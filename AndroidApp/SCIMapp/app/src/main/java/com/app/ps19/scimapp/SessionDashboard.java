package com.app.ps19.scimapp;

import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;

import com.app.ps19.scimapp.location.LocationUpdatesService;
import com.app.ps19.scimapp.Shared.Utilities;
import com.app.ps19.scimapp.classes.Session;
import com.app.ps19.scimapp.classes.Task;
import com.app.ps19.scimapp.classes.Units;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.snackbar.Snackbar;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import android.text.Html;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import org.w3c.dom.Text;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.UUID;

import static com.app.ps19.scimapp.Shared.Globals.SESSION_STARTED;
import static com.app.ps19.scimapp.Shared.Globals.SESSION_STOPPED;
import static com.app.ps19.scimapp.Shared.Globals.dayStarted;
import static com.app.ps19.scimapp.Shared.Globals.getBlinkAnimation;
import static com.app.ps19.scimapp.Shared.Globals.getSelectedTask;
import static com.app.ps19.scimapp.Shared.Globals.lastKnownLocation;
import static com.app.ps19.scimapp.Shared.Globals.selectedJPlan;
import static com.app.ps19.scimapp.Shared.Globals.selectedPostSign;
import static com.app.ps19.scimapp.Shared.Globals.setLocale;
import static com.app.ps19.scimapp.Shared.Utilities.elapsedCalculator;
import static com.app.ps19.scimapp.Shared.Utilities.isInRange;

public class SessionDashboard extends AppCompatActivity {
    TextView tvInspectionTitle;
    TextView tvSessionStartMp;
    TextView tvSessionEndMp;
    TextView tvSessionStartPrefix;
    TextView tvSessionEndPrefix;
    TextView tvStartSessionDateTime;
    TextView tvEndSessionDateTime;
    TextView tvElapDays;
    TextView tvElapHours;
    TextView tvElapMin;
    ImageView ivElapClock;
    LinearLayout llActionButton;
    ListView lvSessions;
    sessionsAdapter sAdapter;
    ArrayList<Session> sessions;
    Session activeSession;
    SimpleDateFormat dateTimeFormat = new SimpleDateFormat("MM-dd-yyyy hh:mm aaa");
    private Thread threadScreenUpdate;
    int secCounter=60;
    boolean blnClockIcon = false;
    String rangeMsg = "";
    Task activeTask;
    String prefix = "";
    TextView tvSessionActionBtn;
    ImageView ivSessionActionBtn;
    ImageButton ibExpandSessions;
    boolean isListExpanded;
    RelativeLayout rlSessionTitle;
    LinearLayout llSessionDetailContainer;
    // Traverse and Observe track code
    Spinner spTracks;
    Spinner spObserveTracks;
    ArrayList<Units> traverseTracks = new ArrayList<>();
    ArrayList<Units> observeTracks = new ArrayList<>();
    ArrayAdapter<Units> traverseAdapter;
    ArrayAdapter<Units> observeAdapter;
    ArrayList<Units> allTracks = new ArrayList<>();


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setLocale(this);
        setTitle(R.string.title_activity_session_dashboard);
        setContentView(R.layout.activity_session_dashboard);
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        //View Initialises
        tvInspectionTitle = findViewById(R.id.tv_sessions_inspection_title);
        tvSessionStartMp = findViewById(R.id.tv_session_start_mp);
        tvSessionEndMp = findViewById(R.id.tv_session_exp_end_mp);
        tvSessionStartPrefix = findViewById(R.id.tv_start_mp_prefix);
        tvSessionEndPrefix = findViewById(R.id.tv_end_mp_prefix);
        tvStartSessionDateTime = findViewById(R.id.tv_session_start_time);
        tvEndSessionDateTime = findViewById(R.id.tv_session_exp_end_time);
        lvSessions = findViewById(R.id.lv_sessions);
        llActionButton = findViewById(R.id.ll_sessions_status);
        tvSessionActionBtn = findViewById(R.id.tv_session_action_button);
        ivSessionActionBtn = findViewById(R.id.iv_session_action_btn);

        rlSessionTitle = findViewById(R.id.rl_sessions_title);
        llSessionDetailContainer = findViewById(R.id.ll_session_details_container);

        tvElapDays = findViewById(R.id.tv_session_elap_days);
        tvElapHours = findViewById(R.id.tv_session_elap_hours);
        tvElapMin = findViewById(R.id.tv_session_elap_min);
        ivElapClock = findViewById(R.id.iv_session_elap_time);
        ibExpandSessions = findViewById(R.id.ib_sessions_list_expand);

        sessions = selectedJPlan.getIntervals().getSessions();

        ivElapClock.setVisibility(View.INVISIBLE);
        llActionButton.setBackgroundColor(getResources().getColor(R.color.gradient_green_dark));
        tvSessionActionBtn.setText(R.string.start_btn_title);
        ivSessionActionBtn.setImageResource(R.drawable.play_btn);
        llActionButton.startAnimation(getBlinkAnimation());

        tvInspectionTitle.setText(selectedJPlan.getTitle());
        tvSessionStartMp.setText("--");
        tvSessionEndMp.setText("--");
        tvSessionStartPrefix.setVisibility(View.GONE);
        tvSessionEndPrefix.setVisibility(View.GONE);
        tvEndSessionDateTime.setText("--:--");
        tvStartSessionDateTime.setText("--:--");
        try {
            if(getSelectedTask() == null){
                activeTask = selectedJPlan.getTaskList().get(0);
            } else {
                activeTask = getSelectedTask();
            }
        } catch (Exception e) {
            e.printStackTrace();
            finish();
        }

        prefix = "";
        if(selectedPostSign!=null || !selectedPostSign.equals("")){
            prefix = selectedPostSign + " ";
        } else {
            prefix = "MP ";
        }

        tvSessionStartPrefix.setText(prefix);
        tvSessionEndPrefix.setText(prefix);
        rangeMsg = getLineName() + "<br> " + "<b>" + prefix + " " + "</b> " + activeTask.getMpStart() + " to " + "<b>" + prefix + " " + "</b> " + activeTask.getMpEnd();
        // Setting default value to list state
        isListExpanded = false;
        if(sessions != null){
            if(sessions.size()!= 0){
                for(Session session: sessions){
                    if(session.getStatus().equals(SESSION_STARTED)){
                        activeSession = session;
                        tvSessionStartPrefix.setVisibility(View.VISIBLE);
                        tvSessionEndPrefix.setVisibility(View.VISIBLE);
                        ivElapClock.setVisibility(View.VISIBLE);
                        tvStartSessionDateTime.setText(dateTimeFormat.format(new Date(session.getStartTime())));
                        tvSessionStartMp.setText(session.getStart());
                        tvSessionEndMp.setText(session.getExpEnd());

                        llActionButton.setBackgroundColor(getResources().getColor(R.color.color_stop_background));
                        tvSessionActionBtn.setText(getResources().getText(R.string.stop_btn_title));
                        ivSessionActionBtn.setImageResource(R.drawable.stop_btn);

                        llActionButton.startAnimation(getBlinkAnimation());
                        break;
                    }
                }
            }
            sAdapter = new sessionsAdapter(SessionDashboard.this, sessions);
            lvSessions.setAdapter(sAdapter);
        }

        ibExpandSessions.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (isListExpanded) {
                    collapseList();
                } else {
                    expandList();
                }
            }
        });
        llActionButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(activeSession!= null){
                    if(activeSession.getStatus().equals(SESSION_STARTED)){
                        showEndMpDialog(SessionDashboard.this);
                    } else {
                        showStartMpDialog(SessionDashboard.this);
                    }
                } else {
                    showStartMpDialog(SessionDashboard.this);
                }
            }});
        FloatingActionButton fab = findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });
        if(threadScreenUpdate ==null){
            threadScreenUpdate=new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        while (true) {
                            secCounter++;
                            if(secCounter>=60){
                                secCounter=1;
                                if(activeSession != null){
                                    final int[] elapsedTime = elapsedCalculator(new Date(), new Date(activeSession.getStartTime()));
                                    runOnUiThread(new Runnable() {
                                        @Override
                                        public void run() {
                                            if(elapsedTime[0] == 0 ){
                                                tvElapDays.setVisibility(View.GONE);
                                            } else {
                                                tvElapDays.setVisibility(View.VISIBLE);
                                            }
                                            String days = elapsedTime[0] + "d ";
                                            String hours = elapsedTime[1] + "h ";
                                            String mins = elapsedTime[2] + "m";
                                            tvElapDays.setText(days);
                                            tvElapHours.setText(hours);
                                            tvElapMin.setText(mins);
                                        }});
                                }

                            }
                            if(dayStarted && selectedJPlan!=null && activeSession != null) {
                                runOnUiThread(new Runnable() {
                                    @Override
                                    public void run() {
                                        if(secCounter % 10 == 0){
                                            if(LocationUpdatesService.canGetLocation()) {
                                                //tryLocation();
                                            }
                                            else{
                                                Utilities.showSettingsAlert(SessionDashboard.this);
                                            }
                                        }
                                        if (blnClockIcon) {
                                            blnClockIcon = false;
                                            ivElapClock.setVisibility(View.INVISIBLE);
                                        }else{
                                            blnClockIcon = true;
                                            ivElapClock.setVisibility(View.VISIBLE);
                                        }
                                       /* if(blnGpsIcon){
                                            imgGpsIcon.setVisibility(View.INVISIBLE);
                                            blnGpsIcon=false;

                                        }else{
                                            imgGpsIcon.setVisibility(View.VISIBLE);
                                            blnGpsIcon=true;
                                        }*/

                                    }
                                });
                            }
                            Thread.sleep(1000);
                        }

                    }catch(InterruptedException e){
                        //e.printStackTrace();
                    }
                }
            });
            threadScreenUpdate.start();
        }
    }
    private void showStartMpDialog(final Context context){
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        builder.setCancelable(false);
        View viewInflated = LayoutInflater.from(context).inflate(R.layout.session_start_dialog, (ViewGroup) findViewById(android.R.id.content).getRootView(), false);

        final EditText etStartMp = (EditText) viewInflated.findViewById(R.id.et_start_session_mp);
        final EditText etExpEndMp = (EditText) viewInflated.findViewById(R.id.et_session_exp_end_mp);
        final TextView tvRangeMsg = (TextView) viewInflated.findViewById(R.id.tv_session_start_dialog_range_msg);
        //Traverse and Observe track code
        spTracks = (Spinner) viewInflated.findViewById(R.id.sp_traverse_track);
        spObserveTracks = (Spinner) viewInflated.findViewById(R.id.sp_observe_track);
        allTracks = getTracks();
        //Copying tracks to other arrays
        observeTracks = new ArrayList<>(allTracks);
        traverseTracks = new ArrayList<>(allTracks);
        traverseAdapter =
                new ArrayAdapter<>(SessionDashboard.this, android.R.layout.simple_spinner_dropdown_item, traverseTracks);
        traverseAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spTracks.setAdapter(traverseAdapter);
        //removing the traverse track from observe track list
        observeTracks.remove(spTracks.getSelectedItem());
        if(observeTracks.size()>0){
            observeAdapter =
                    new ArrayAdapter<Units>(SessionDashboard.this, android.R.layout.simple_spinner_dropdown_item, observeTracks);
            observeAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
            spObserveTracks.setAdapter(observeAdapter);
        }

        if(traverseTracks.size() == 0){
            spTracks.setEnabled(false);
        }
        spTracks.setSelection(0, false);
        spObserveTracks.setSelection(0, false);
        spTracks.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                activeTask.setTraverseTrack(traverseTracks.get(position).getUnitId());
                removeAndUpdateTrackList(traverseTracks.get(position), "observe");
                //Toast.makeText(TaskDashboardActivity.this, tracks.get(position).getDescription(), Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });
        spObserveTracks.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                activeTask.setTraverseTrack(traverseTracks.get(position).getUnitId());
                removeAndUpdateTrackList(observeTracks.get(position), "traverse");
                //Toast.makeText(TaskDashboardActivity.this, tracks.get(position).getDescription(), Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });
        final Date startDate = new Date();
        tvRangeMsg.setText(Html.fromHtml(rangeMsg));
        builder.setView(viewInflated);

        builder.setPositiveButton(getResources().getText(R.string.btn_ok), new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {

            }
        });
        builder.setNegativeButton(android.R.string.cancel, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.cancel();
            }
        });

        final AlertDialog dialog = builder.create();
        dialog.show();
        dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                String startMp = etStartMp.getText().toString();
                String expEndMp = etExpEndMp.getText().toString();
                if(startMp.equals("")||expEndMp.equals("")){
                    Toast.makeText(context, getResources().getString(R.string.all_fields_req_msg), Toast.LENGTH_SHORT).show();
                    return;
                } else
                if (!isInRange(Double.parseDouble(selectedJPlan.getTaskList().get(0).getMpStart()), Double.parseDouble(selectedJPlan.getTaskList().get(0).getMpEnd()), Double.parseDouble(etStartMp.getText().toString()))) {
                    Toast.makeText(context, getResources().getText(R.string.toast_start_milepost), Toast.LENGTH_LONG).show();
                    return;
                } else
                if (!isInRange(Double.parseDouble(selectedJPlan.getTaskList().get(0).getMpStart()), Double.parseDouble(selectedJPlan.getTaskList().get(0).getMpEnd()), Double.parseDouble(etExpEndMp.getText().toString()))) {
                    Toast.makeText(context, getResources().getText(R.string.exp_end_not_in_range_msg), Toast.LENGTH_LONG).show();
                    return;
                } else{
                    UUID uuid = UUID.randomUUID();
                    Session session = new Session();
                    session.setStart(etStartMp.getText().toString());
                    session.setStartTime(startDate.toString());
                    session.setEnd(etExpEndMp.getText().toString());
                    session.setExpEnd(etExpEndMp.getText().toString());
                    session.setStartLocation(lastKnownLocation.getLatitude() + "," + lastKnownLocation.getLongitude());
                    session.setStatus(SESSION_STARTED);
                    session.setId(uuid.toString());
                    setCurrentSession(session);
                    Toast.makeText(context, getResources().getText(R.string.session_started_msg), Toast.LENGTH_LONG).show();
                    selectedJPlan.getIntervals().getSessions().add(session);
                    selectedJPlan.update();
                    dialog.dismiss();
                }
            }
        });
    }
    private void showEndMpDialog(final Context context){/*
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        //builder.setTitle("Title");
        View viewInflated = LayoutInflater.from(context).inflate(R.layout.session_end_dialog, (ViewGroup) findViewById(android.R.id.content).getRootView(), false);

        final EditText etEndMp = (EditText) viewInflated.findViewById(R.id.et_session_end_mp);
        final TextView tvStartedAt = (TextView) viewInflated.findViewById(R.id.tv_session_dialog_end_time);
        final TextView tvEndRangeMsg = (TextView) viewInflated.findViewById(R.id.tv_session_end_dialog_range_msg);
        final TextView tvExpEnd = (TextView) viewInflated.findViewById(R.id.tv_session_exp_end_dialog);
        final TextView tvExpEndTitle = (TextView) viewInflated.findViewById(R.id.tv_exp_end_title);
        String endMpTitle = getString(R.string.exp_end_title) + " " + prefix +": ";

        tvExpEndTitle.setText(endMpTitle);
        tvStartedAt.setText(dateTimeFormat.format(new Date(activeSession.getStartTime())));
        tvEndRangeMsg.setText(Html.fromHtml(rangeMsg));
        tvExpEnd.setText(activeSession.getExpEnd());
        builder.setView(viewInflated);

        builder.setPositiveButton(getResources().getText(R.string.btn_ok), new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {

            }
        });
        builder.setNegativeButton(android.R.string.cancel, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.cancel();
            }
        });

        final AlertDialog dialog = builder.create();
        dialog.show();
        dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                String expEndMp = etEndMp.getText().toString();
                if(expEndMp.equals("")){
                    Toast.makeText(context, getResources().getText(R.string.end_mp_req_msg), Toast.LENGTH_SHORT).show();
                    return;
                } else if (!isInRange(Double.parseDouble(selectedJPlan.getTaskList().get(0).getMpStart()), Double.parseDouble(selectedJPlan.getTaskList().get(0).getMpEnd()), Double.parseDouble(etEndMp.getText().toString()))) {
                    Toast.makeText(context, getResources().getText(R.string.end_mp_not_in_range_msg), Toast.LENGTH_LONG).show();
                    return;
                } else {
                    for(Session session: selectedJPlan.getIntervals().getSessions()){
                        if(session.getId().equals(activeSession.getId())){
                            session.setEnd(expEndMp);
                            session.setStatus(SESSION_STOPPED);
                            session.setEndLocation(lastKnownLocation.getLatitude() + "," + lastKnownLocation.getLongitude());
                            session.setEndTime(new Date().toString());
                            activeSession = null;
                            tvSessionEndMp.setText("--");
                            tvEndSessionDateTime.setText("--:--");

                            llActionButton.setBackgroundColor(getResources().getColor(R.color.gradient_green_dark));
                            tvSessionActionBtn.setText(getResources().getText(R.string.start_tile_title));
                            ivSessionActionBtn.setImageResource(R.drawable.play_btn);
                            llActionButton.startAnimation(getBlinkAnimation());

                            tvElapDays.setText("--:--");
                            tvElapHours.setVisibility(View.GONE);
                            tvElapMin.setVisibility(View.GONE);
                            ivElapClock.setVisibility(View.GONE);
                            tvStartSessionDateTime.setText("--:--");
                            tvSessionStartMp.setText("--");
                            tvSessionStartPrefix.setVisibility(View.GONE);
                            tvSessionEndPrefix.setVisibility(View.GONE);

                            sAdapter.notifyDataSetChanged();

                            selectedJPlan.update();
                            dialog.dismiss();
                            break;
                        }
                    }
                }
            }});*/
    }
    /*private void showSwitchingSessionDialog(final Context context){
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        builder.setCancelable(false);
        View viewInflated = LayoutInflater.from(context).inflate(R.layout.session_switching_dialog, (ViewGroup) findViewById(android.R.id.content).getRootView(), false);

        final EditText etStartMp = (EditText) viewInflated.findViewById(R.id.et_start_session_mp);
        final EditText etExpEndMp = (EditText) viewInflated.findViewById(R.id.et_session_exp_end_mp);
        final TextView tvRangeMsg = (TextView) viewInflated.findViewById(R.id.tv_session_start_dialog_range_msg);
        TextView tvSessionStartedAt = (TextView) viewInflated.findViewById(R.id.tv_running_session_started_at);
        TextView tvSessionExpEnd = (TextView) viewInflated.findViewById(R.id.tv_running_session_exp_end);
        TextView tvSessionTraverseTrack = (TextView) viewInflated.findViewById(R.id.tv_running_session_traverse_track);
        TextView tvSessionObserveTrack = (TextView) viewInflated.findViewById(R.id.tv_running_session_observe_track);
        //Traverse and Observe track code
        spTracks = (Spinner) viewInflated.findViewById(R.id.sp_traverse_track);
        spObserveTracks = (Spinner) viewInflated.findViewById(R.id.sp_observe_track);
        allTracks = getTracks();
        //Copying tracks to other arrays
        observeTracks = new ArrayList<>(allTracks);
        traverseTracks = new ArrayList<>(allTracks);
        traverseAdapter =
                new ArrayAdapter<>(SessionDashboard.this, android.R.layout.simple_spinner_dropdown_item, traverseTracks);
        traverseAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spTracks.setAdapter(traverseAdapter);
        //removing the traverse track from observe track list
        observeTracks.remove(spTracks.getSelectedItem());
        if(observeTracks.size()>0){
            observeAdapter =
                    new ArrayAdapter<Units>(SessionDashboard.this, android.R.layout.simple_spinner_dropdown_item, observeTracks);
            observeAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
            spObserveTracks.setAdapter(observeAdapter);
        }

        if(traverseTracks.size() == 0){
            spTracks.setEnabled(false);
        }
        spTracks.setSelection(0, false);
        spObserveTracks.setSelection(0, false);
        spTracks.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                activeTask.setTraverseTrack(traverseTracks.get(position).getUnitId());
                removeAndUpdateTrackList(traverseTracks.get(position), "observe");
                //Toast.makeText(TaskDashboardActivity.this, tracks.get(position).getDescription(), Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });
        spObserveTracks.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                activeTask.setTraverseTrack(traverseTracks.get(position).getUnitId());
                removeAndUpdateTrackList(observeTracks.get(position), "traverse");
                //Toast.makeText(TaskDashboardActivity.this, tracks.get(position).getDescription(), Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });
        final Date startDate = new Date();
        tvRangeMsg.setText(Html.fromHtml(rangeMsg));
        builder.setView(viewInflated);

        builder.setPositiveButton(getResources().getText(R.string.btn_ok), new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {

            }
        });
        builder.setNegativeButton(android.R.string.cancel, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.cancel();
            }
        });

        final AlertDialog dialog = builder.create();
        dialog.show();
        dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                String startMp = etStartMp.getText().toString();
                String expEndMp = etExpEndMp.getText().toString();
                if(startMp.equals("")||expEndMp.equals("")){
                    Toast.makeText(context, getResources().getString(R.string.all_fields_req_msg), Toast.LENGTH_SHORT).show();
                    return;
                } else
                if (!isInRange(Double.parseDouble(selectedJPlan.getTaskList().get(0).getMpStart()), Double.parseDouble(selectedJPlan.getTaskList().get(0).getMpEnd()), Double.parseDouble(etStartMp.getText().toString()))) {
                    Toast.makeText(context, getResources().getText(R.string.toast_start_milepost), Toast.LENGTH_LONG).show();
                    return;
                } else
                if (!isInRange(Double.parseDouble(selectedJPlan.getTaskList().get(0).getMpStart()), Double.parseDouble(selectedJPlan.getTaskList().get(0).getMpEnd()), Double.parseDouble(etExpEndMp.getText().toString()))) {
                    Toast.makeText(context, getResources().getText(R.string.exp_end_not_in_range_msg), Toast.LENGTH_LONG).show();
                    return;
                } else{
                    UUID uuid = UUID.randomUUID();
                    Session session = new Session();
                    session.setStart(etStartMp.getText().toString());
                    session.setStartTime(startDate.toString());
                    session.setEnd(etExpEndMp.getText().toString());
                    session.setExpEnd(etExpEndMp.getText().toString());
                    session.setStartLocation(lastKnownLocation.getLatitude() + "," + lastKnownLocation.getLongitude());
                    session.setStatus(SESSION_STARTED);
                    session.setId(uuid.toString());
                    setCurrentSession(session);
                    Toast.makeText(context, getResources().getText(R.string.session_started_msg), Toast.LENGTH_LONG).show();
                    selectedJPlan.getIntervals().getSessions().add(session);
                    selectedJPlan.update();
                    dialog.dismiss();
                }
            }
        });
    }*/
    private void setCurrentSession(Session session){
        activeSession = session;
        tvStartSessionDateTime.setVisibility(View.VISIBLE);
        tvSessionStartMp.setVisibility(View.VISIBLE);
        tvSessionStartPrefix.setVisibility(View.VISIBLE);

        tvEndSessionDateTime.setVisibility(View.VISIBLE);
        tvSessionEndMp.setVisibility(View.VISIBLE);
        tvSessionEndPrefix.setVisibility(View.VISIBLE);

        tvElapHours.setVisibility(View.VISIBLE);
        tvElapMin.setVisibility(View.VISIBLE);

        tvElapDays.setVisibility(View.GONE);
        tvElapHours.setText("0h ");
        tvElapMin.setText("0m");

        tvSessionStartPrefix.setText(prefix);
        tvSessionEndPrefix.setText(prefix);

        tvStartSessionDateTime.setText(dateTimeFormat.format(new Date(activeSession.getStartTime())));
        tvSessionStartMp.setText(session.getStart());
        tvSessionEndMp.setText(session.getExpEnd());
        tvEndSessionDateTime.setText("--:--");

        llActionButton.setBackgroundColor(getResources().getColor(R.color.color_stop_background));
        tvSessionActionBtn.setText(getResources().getText(R.string.stop_btn_title));
        ivSessionActionBtn.setImageResource(R.drawable.stop_btn);

        llActionButton.startAnimation(getBlinkAnimation());


    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        threadScreenUpdate.interrupt();
        try{
            threadScreenUpdate.join();
        }catch (Exception ignored){}
    }
    private String getLineName(){
        String lineName = "";
        if(selectedJPlan!=null){
            for(Units unit: selectedJPlan.getTaskList().get(0).getWholeUnitList()){
                if(unit.getUnitId().equals(selectedJPlan.getLineId())){
                    lineName = unit.getDescription();
                    return lineName;
                }
            }
        }
        return lineName;
    }
    @Override
    public boolean onSupportNavigateUp() {
        finish();
        return true;
    }
    private void expandList() {
        isListExpanded = true;
        ibExpandSessions.setImageResource(R.drawable.ic_baseline_unfold_less_24);
        llSessionDetailContainer.setVisibility(View.GONE);
        rlSessionTitle.setVisibility(View.GONE);
    }

    private void collapseList() {
        isListExpanded = false;
        ibExpandSessions.setImageResource(R.drawable.ic_baseline_unfold_more_24);
        llSessionDetailContainer.setVisibility(View.VISIBLE);
        rlSessionTitle.setVisibility(View.VISIBLE);
    }
    private void removeAndUpdateTrackList(Units track, String type){
        if(type.equals("traverse")){
            traverseTracks = new ArrayList<>(allTracks);
            traverseTracks.remove(track);
            if(traverseTracks.size()>0){
                spTracks.setEnabled(true);
                traverseAdapter.clear(); //remove all data;
                traverseAdapter.addAll(traverseTracks);
                traverseAdapter.notifyDataSetChanged();
               /* ArrayAdapter<Units> traverseAdapter =
                        new ArrayAdapter<Units>(context, android.R.layout.simple_spinner_dropdown_item, traverseTracks);
                traverseAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                spTracks.setAdapter(traverseAdapter);*/
            } else {
                spTracks.setEnabled(false);
            }


        } else if(type.equals("observe")){
            observeTracks = new ArrayList<>(allTracks);
            observeTracks.remove(track);
            if(observeTracks.size()>0){
                spObserveTracks.setEnabled(true);
                observeAdapter.clear(); //remove all data;
                observeAdapter.addAll(observeTracks);
                observeAdapter.notifyDataSetChanged();

              /*  ArrayAdapter<Units> observeAdapter =
                        new ArrayAdapter<Units>(context, android.R.layout.simple_spinner_dropdown_item, observeTracks);
                observeAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                spObserveTracks.setAdapter(observeAdapter);*/
            } else {
                spObserveTracks.setEnabled(false);
            }

        }
    }
    private ArrayList<Units> getTracks(){
        ArrayList<Units> units = new ArrayList<>();
        for (Units _track : activeTask.getWholeUnitList()) {
            if (_track.getAssetType().equals("track")) {
                units.add(_track);
            }
        }
        return units;
    }
}