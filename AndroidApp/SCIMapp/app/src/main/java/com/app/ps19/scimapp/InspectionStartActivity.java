package com.app.ps19.scimapp;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.location.Location;
import android.os.Bundle;
import android.text.Editable;
import android.text.Html;
import android.text.InputType;
import android.text.TextWatcher;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.Shared.Utilities;
import com.app.ps19.scimapp.classes.CompRange;
import com.app.ps19.scimapp.classes.JourneyPlan;
import com.app.ps19.scimapp.classes.JourneyPlanOpt;
import com.app.ps19.scimapp.classes.LatLong;
import com.app.ps19.scimapp.classes.Session;
import com.app.ps19.scimapp.classes.Units;
import com.app.ps19.scimapp.classes.User;
import com.app.ps19.scimapp.location.Interface.OnLocationUpdatedListener;
import com.app.ps19.scimapp.location.LocationUpdatesService;
import com.google.android.material.textfield.TextInputLayout;

import java.util.ArrayList;
import java.util.Arrays;

import static android.view.View.GONE;
import static android.view.View.VISIBLE;
import static com.app.ps19.scimapp.Shared.Globals.getLocPrefix;
import static com.app.ps19.scimapp.Shared.Globals.getPrefixMp;
import static com.app.ps19.scimapp.Shared.Globals.initialInspection;
import static com.app.ps19.scimapp.Shared.Globals.initialRun;
import static com.app.ps19.scimapp.Shared.Globals.isInspectionTypeReq;
import static com.app.ps19.scimapp.Shared.Globals.isMpReq;
import static com.app.ps19.scimapp.Shared.Globals.isPrimaryAssetOnTop;
import static com.app.ps19.scimapp.Shared.Globals.isShowAllSideTracks;
import static com.app.ps19.scimapp.Shared.Globals.isShowTraverseCheckbox;
import static com.app.ps19.scimapp.Shared.Globals.isTraverseReq;
import static com.app.ps19.scimapp.Shared.Globals.isWConditionReq;
import static com.app.ps19.scimapp.Shared.Globals.selectedObserveOpt;
import static com.app.ps19.scimapp.Shared.Globals.selectedTraverseBy;
import static com.app.ps19.scimapp.Shared.Globals.setLocale;
import static com.app.ps19.scimapp.Shared.Globals.showNearByAssets;
import static com.app.ps19.scimapp.Shared.Utilities.isInRange;
import static com.app.ps19.scimapp.Shared.Utilities.selectFirstVisibleRadioButton;

public class InspectionStartActivity extends AppCompatActivity implements OnLocationUpdatedListener {

    EditText etStartMp;
    EditText etExpEndMp;
    RadioGroup rgType;
    RadioGroup rgInspectionType;
    EditText etWeatherConditions;
    EditText etInspectionTypeDescription;
    View mView;
    Context context;
    Button btnOk;
    Button btnCancel;
    String latitude;
    String longitude;
    Location lastLocation;
    //EditText etSelectedAsset;
    public static String START_INSPECTION_RETURN_MSG = "start task";
    TextView tvInspMemebersMsg;
    LinearLayout llInspSharingContainer;
    ListView lvInspMembers;
    ArrayList<CompRange> inspRanges = new ArrayList<>();
    Spinner spTraverseTracks;
    Spinner spObserveTracks;
    ArrayList<Units> traverseTracks = new ArrayList<>();
    ArrayList<Units> observeTracks = new ArrayList<>();
    ArrayAdapter<Units> traverseAdapter;
    ArrayAdapter<Units> observeAdapter;
    ArrayList<Units> allTracks = new ArrayList<>();
    TextView tvTraverseTrackLimit;
    TextView tvObserveTrackLimit;
    CheckBox cbTraverse;
    CheckBox cbObserve;
    LinearLayout llMpInput;
    LinearLayout llSessionTitle;
    Units allSideTracksUnit;
    LinearLayout llTraverseBy;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setLocale(this);
        setContentView(R.layout.activity_inspection_start);
        context = this;
        initialRun = initialInspection.getTaskList().get(0);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        setTitle(initialInspection.getTitle());

        //Get View elements from Layout file. Be sure to include inflated view name (mView)
        LinearLayout llTraverseTrack = (LinearLayout) findViewById(R.id.ll_traverse_track);
        LinearLayout llRequireMp = (LinearLayout) findViewById(R.id.ll_start_mp);
        LinearLayout llWeatherConditions = (LinearLayout) findViewById(R.id.ll_weather_conditions);
        LinearLayout llInspectionType = (LinearLayout) findViewById(R.id.ll_inspection_type);
        LinearLayout llMpValue = (LinearLayout) findViewById(R.id.ll_mp_value);
        LinearLayout llExpEndMp = (LinearLayout) findViewById(R.id.ll_exp_end_mp_value);
        TextView tvLineName=findViewById(R.id.tvLineName_ais);
        TextView tvLineStart=findViewById(R.id.tvMPStart_ais);
        TextView tvLineEnd=findViewById(R.id.tvMPEnd_ais);
        llMpInput = findViewById(R.id.ll_limit_input);
        llSessionTitle = findViewById(R.id.ll_session_title);
        tvObserveTrackLimit = findViewById(R.id.tv_selected_observe_track_limit);
        tvTraverseTrackLimit = findViewById(R.id.tv_selected_traverse_track_limit);
        cbObserve = findViewById(R.id.cb_observe);
        cbTraverse = findViewById(R.id.cb_traverse);

        tvInspMemebersMsg = (TextView) findViewById(R.id.tv_sharing_inspection_members_msg);
        llInspSharingContainer = (LinearLayout) findViewById(R.id.ll_sharing_inspection);
        lvInspMembers = (ListView) findViewById(R.id.lv_sharing_members);

        btnCancel = (Button) findViewById(R.id.btn_cancel);
        btnOk = (Button) findViewById(R.id.btn_ok);
        final RadioGroup rgInspectionType = (RadioGroup) findViewById(R.id.rg_inspection_type);
        etInspectionTypeDescription = (EditText) findViewById(R.id.et_inspection_type_description);
        selectFirstVisibleRadioButton(rgInspectionType);
        etStartMp = (EditText) findViewById(R.id.et_workplan_start_mp);
        etExpEndMp = (EditText) findViewById(R.id.et_exp_end_mp);
        TextView tvMpRange = (TextView) findViewById(R.id.tv_title_mp_range);
        TextView tvStartMsg = (TextView) findViewById(R.id.tv_title_msg_wp_start_mp);
        TextView tvTempPrefix = (TextView) findViewById(R.id.tv_temp_sign);
        TextView tvStartTitle = (TextView) findViewById(R.id.tv_start_mp_title);
        //etSelectedAsset = (EditText) findViewById(R.id.et_selected_nearby_asset);
        etWeatherConditions = (EditText) findViewById(R.id.et_weather_conditions);
        final RadioGroup rgType = (RadioGroup) findViewById(R.id.rg_traverse_type);
        spTraverseTracks = (Spinner) findViewById(R.id.sp_traverse_track);
        spObserveTracks = (Spinner) findViewById(R.id.sp_observe_track);
        Spinner spTemperature = (Spinner) findViewById(R.id.sp_temperature);
        llTraverseBy = findViewById(R.id.ll_traverse_by);
        selectFirstVisibleRadioButton(rgType);
        if (!selectedTraverseBy.equals("")) {
            selectDefaultTraverseBy(rgType, Globals.selectedTraverseBy);
        }
        String startTitle;
        String startMsg;

        if(!isShowTraverseCheckbox){
            cbTraverse.setVisibility(GONE);
            cbObserve.setVisibility(GONE);
        } else {
            cbTraverse.setVisibility(VISIBLE);
            cbObserve.setVisibility(VISIBLE);
        }
        allTracks = getTracks();
        if(allTracks.size() == 0){
            llTraverseTrack.setVisibility(GONE);
        } else {
            llTraverseTrack.setVisibility(VISIBLE);
        }
        //Copying tracks to other arrays
        observeTracks = new ArrayList<>(allTracks);
        traverseTracks = new ArrayList<>(allTracks);

        //Adding All side tracks option if allowed
        addAllSideTrack();
        //etSelectedAsset.setEnabled(false);
        if(initialRun.isYardInspection()){
            etStartMp.setInputType(InputType.TYPE_CLASS_TEXT);
            etExpEndMp.setInputType(InputType.TYPE_CLASS_TEXT);
        }

        String lineName = "";
        //lineName = getLineName();
        lineName = initialInspection.getTitle();
        traverseAdapter =
                new ArrayAdapter<>(context, android.R.layout.simple_spinner_dropdown_item, traverseTracks);
        traverseAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spTraverseTracks.setAdapter(traverseAdapter);
//        if(allTracks.size() > 1) {
//            //removing the traverse track from observe track list
//            observeTracks.remove(spTraverseTracks.getSelectedItem());
//        }
        if(observeTracks.size()>0){
            observeAdapter =
                    new ArrayAdapter<Units>(context, android.R.layout.simple_spinner_dropdown_item, observeTracks);
            observeAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
            spObserveTracks.setAdapter(observeAdapter);
        }

        if(traverseTracks.size() == 0){
            spTraverseTracks.setEnabled(false);
        }
        if (!Globals.selectedTempSign.equals("")) {
            tvTempPrefix.setText(Globals.selectedTempSign);
        }
        if (!Globals.selectedPostSign.equals("")) {
            tvMpRange.setText(Html.fromHtml(lineName + "<br> " + "<b>" + Globals.selectedPostSign + " " + "</b> " + initialRun.getMpStart() + getString(R.string.to_part2) + "<b>" + Globals.selectedPostSign + " " + "</b> " + initialRun.getMpEnd()));
            startTitle = getString(R.string.start_title) + " " + Globals.selectedPostSign + ":";
            startMsg = getString(R.string.mp_req_msg_1) + Globals.selectedPostSign + getString(R.string.mp_req_msg_2);
        } else {
            tvMpRange.setText(Html.fromHtml(lineName + "<br> " + "<b>" + "MP " + "</b> " + initialRun.getMpStart() + getString(R.string.to_part2) + "<b>" + "MP " + "</b> " + initialRun.getMpEnd()));
            startTitle = getString(R.string.start_mp_msg_title);
            startMsg = getString(R.string.start_mp_req_for_inspection_msg);
        }
        //tvStartTitle.setText(startTitle);
        tvLineName.setText(lineName);
        tvLineStart.setText(getPrefixMp(initialRun.getMpStart()));
        tvLineEnd.setText(getPrefixMp(initialRun.getMpEnd()));
        tvStartMsg.setText(startMsg);
        spTraverseTracks.setSelection(0, false);
        spObserveTracks.setSelection(0, false);
        // Setting traverse track selected as by default
        setPrimaryTrackAsTraverse();
        if(allTracks.size()>0){
            String lMsg = allTracks.get(0).getDescription() + getString(R.string.from_part1) + getPrefixMp(allTracks.get(0).getStart())+ getString(R.string.to_part2) + getPrefixMp(allTracks.get(0).getEnd());
            tvObserveTrackLimit.setText(lMsg);
            tvTraverseTrackLimit.setText(lMsg);
        }
        cbObserve.setOnClickListener(view -> {
            spObserveTracks.setEnabled(!((CompoundButton) view).isChecked());
        });
        cbTraverse.setOnClickListener(view -> {
            spTraverseTracks.setEnabled(!((CompoundButton) view).isChecked());
        });

        spTemperature.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                initialRun.setTemperature(parent.getItemAtPosition(position).toString());
                //Toast.makeText(TaskDashboardActivity.this, tracks.get(position).getDescription(), Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });
        spTraverseTracks.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                initialRun.setTraverseTrack(traverseTracks.get(position).getUnitId());
                String lMsg = traverseTracks.get(position).getDescription() + getString(R.string.from_part1) + getPrefixMp(traverseTracks.get(position).getStart())+ getString(R.string.to_part2) + getPrefixMp(traverseTracks.get(position).getEnd());
                tvTraverseTrackLimit.setText(lMsg);
                //removeAndUpdateTrackList(traverseTracks.get(position), "observe");
                //Toast.makeText(TaskDashboardActivity.this, tracks.get(position).getDescription(), Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });
        spObserveTracks.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String unitId = observeTracks.get(position).getUnitId();
                if(unitId.equals("0")){
                    initialRun.setObserveTrack("");
                    String lMsg = "";
                    tvObserveTrackLimit.setText(lMsg);
                } else {
                    initialRun.setObserveTrack(observeTracks.get(position).getUnitId());
                    String lMsg = observeTracks.get(position).getDescription() + getString(R.string.from_part1) + getPrefixMp(observeTracks.get(position).getStart())+ getString(R.string.to_part2) + getPrefixMp(observeTracks.get(position).getEnd());
                    tvObserveTrackLimit.setText(lMsg);
                }

                //removeAndUpdateTrackList(observeTracks.get(position), "traverse");
                //Toast.makeText(TaskDashboardActivity.this, tracks.get(position).getDescription(), Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });
        // Setting default value to 45 for temperature as req by JD
        String[] tempValues = getResources().getStringArray(R.array.temp_values);
        int defaultIndex = Arrays.asList(tempValues).indexOf("45");
        spTemperature.setSelection(defaultIndex);

        //etStartMp.setHint(Globals.initialInspection.getMpStart());
        if (Globals.isTraverseReq) {
            llTraverseTrack.setVisibility(VISIBLE);
            llTraverseBy.setVisibility(VISIBLE);
        } else {
            llTraverseTrack.setVisibility(GONE);
            llTraverseBy.setVisibility(GONE);
        }
        if (isMpReq) {
            llRequireMp.setVisibility(VISIBLE);
            //llMpValue.setVisibility(VISIBLE);
            //llExpEndMp.setVisibility(VISIBLE);
        } else {
            llRequireMp.setVisibility(GONE);
            //llMpValue.setVisibility(GONE);
            //llExpEndMp.setVisibility(GONE);
        }
        if (isWConditionReq) {
            llWeatherConditions.setVisibility(VISIBLE);
        } else {
            llWeatherConditions.setVisibility(GONE);
        }
        if (isInspectionTypeReq) {
            llInspectionType.setVisibility(VISIBLE);
        } else {
            llInspectionType.setVisibility(GONE);
        }
        if (!(isMpReq || isTraverseReq || isWConditionReq || isInspectionTypeReq)) {
        }

        try {
            initialRun.setLocationUnit(Globals.selectedPostSign);
            initialRun.setTemperatureUnit(Globals.selectedTempSign);
        } catch (Exception e) {
            e.printStackTrace();
        }
        //Implemented Config
        if (!showNearByAssets) {
            //llNearByAssets.setVisibility(View.GONE);
            try {
                LocationUpdatesService.removeLocationUpdateListener( this.getClass().getSimpleName());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        if(observeTracks.size()==0){
            spObserveTracks.setEnabled(false);
            cbObserve.setChecked(true);
            cbObserve.setEnabled(false);
        }
        if(traverseTracks.size()==0){
            spTraverseTracks.setEnabled(false);
            cbTraverse.setChecked(true);
            cbTraverse.setEnabled(false);
        }
        if(initialRun.isYardInspection()){
            //llRequireMp.setVisibility(GONE);
            //llMpInput.setVisibility(GONE);
            llSessionTitle.setVisibility(GONE);
            //llMpValue.setVisibility(GONE);
            //llExpEndMp.setVisibility(GONE);
            //llNearByAssets.setVisibility(View.GONE);
            etStartMp.setText(initialRun.getMpStart());
            etExpEndMp.setText(initialRun.getMpEnd());
            etStartMp.setEnabled(false);
            etExpEndMp.setEnabled(false);
            llTraverseTrack.setVisibility(GONE);
            try {
                LocationUpdatesService.removeLocationUpdateListener( this.getClass().getSimpleName());
            } catch (Exception e) {
                e.printStackTrace();
            }
            etWeatherConditions.requestFocus();
        } else {
            etStartMp.requestFocus();
        }
        tvInspMemebersMsg.setVisibility(GONE);
        etExpEndMp.setText(initialRun.getMpEnd());
        if(selectedObserveOpt.equals("N/A")){
            spObserveTracks.setEnabled(false);
            cbObserve.setChecked(true);
        } else if (selectedObserveOpt.equals("All side tracks")) {
            setAllSideTracksByDefault();
        }

        etStartMp.addTextChangedListener(new TextWatcher() {

            @Override
            public void afterTextChanged(Editable s) {}

            @Override
            public void beforeTextChanged(CharSequence s, int start,
                                          int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start,
                                      int before, int count) {
                if(s.length() != 0)
                    if(etStartMp.getText().toString().equals("")|| etStartMp.getText().toString().equals(".") || etExpEndMp.getText().toString().equals("") || etExpEndMp.getText().toString().equals(".")){
                        tvInspMemebersMsg.setVisibility(GONE);
                        lvInspMembers.setVisibility(GONE);

                    } else {
                        calcSessionData();
                        filterTracks();
                    }
            }
        });
        etExpEndMp.addTextChangedListener(new TextWatcher() {

            @Override
            public void afterTextChanged(Editable s) {}

            @Override
            public void beforeTextChanged(CharSequence s, int start,
                                          int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start,
                                      int before, int count) {
                if(s.length() != 0)
                    if(etStartMp.getText().toString().equals("")||etStartMp.getText().toString().equals(".") || etExpEndMp.getText().toString().equals("") || etExpEndMp.getText().toString().equals(".")){
                        tvInspMemebersMsg.setVisibility(GONE);
                        lvInspMembers.setVisibility(GONE);
                    } else {
                        calcSessionData();
                        filterTracks();
                    }
            }
        });
        tvInspMemebersMsg.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(inspRanges.size()>0){
                    lvInspMembers.setVisibility(VISIBLE);
                }

            }
        });
        etExpEndMp.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View view, boolean hasFocus) {
                if (hasFocus) {
                } else {
                    if(etStartMp.getText().toString().equals("")||etStartMp.getText().toString().equals(".")||etExpEndMp.getText().toString().equals("")||etExpEndMp.getText().toString().equals(".")){
                        tvInspMemebersMsg.setVisibility(GONE);
                        lvInspMembers.setVisibility(GONE);
                    } else {
                        calcSessionData();
                        //filterTracks();
                    }
                }
            }
        });
        TextInputLayout textInputLayout = (TextInputLayout) findViewById(R.id.ti_start_mp);
        //textInputLayout.setHint(initialInspection.getTaskList().get(0).getMpStart());
        btnOk.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (Globals.isWConditionReq && Globals.isWConditionMustReq) {
                    if (etWeatherConditions.getText().toString().equals("")) {
                        Toast.makeText(context, R.string.weather_condition_req_msg, Toast.LENGTH_SHORT).show();
                        return;
                    }
                }
                if(traverseTracks.size() == 0){
                    if(allTracks.size()>0){
                        if(isShowTraverseCheckbox &&!cbTraverse.isChecked()){
                            Toast.makeText(context, getString(R.string.traverse_track_req_to_continue), Toast.LENGTH_SHORT).show();
                            return;
                        }
                    }
                }
                if(observeTracks.size() == 0){
                    if(allTracks.size()>0){
                        if(isShowTraverseCheckbox && !cbObserve.isChecked()){
                            Toast.makeText(context, getString(R.string.observe_track_req_to_continue), Toast.LENGTH_SHORT).show();
                            return;
                        }
                    }
                }
                if (isMpReq) {
                    double startMp = Double.parseDouble(initialRun.getMpStart());

                    if (etStartMp.getText().toString().equals("")|| etStartMp.getText().toString().equals(".")) {
                        Toast.makeText(context, R.string.milepost_required_msg, Toast.LENGTH_SHORT).show();
                    } else if (!isInRange(Double.parseDouble(initialRun.getMpStart()), Double.parseDouble(initialRun.getMpEnd()), Double.parseDouble(etStartMp.getText().toString()))) {
                        Toast.makeText(context, getResources().getText(R.string.toast_start_milepost), Toast.LENGTH_LONG).show();
                        //return;
                    } else if(etExpEndMp.getText().toString().equals("") || etExpEndMp.getText().toString().equals(".")){
                        Toast.makeText(context, getResources().getText(R.string.exp_end_mp_req_msg), Toast.LENGTH_SHORT).show();
                    } else if(!isInRange(Double.parseDouble(initialRun.getMpStart()), Double.parseDouble(initialRun.getMpEnd()), Double.parseDouble(etExpEndMp.getText().toString()))){
                        Toast.makeText(context, getResources().getText(R.string.exp_end_not_in_range_msg), Toast.LENGTH_LONG).show();
                    } else {
                        initialRun.setUserStartMp(etStartMp.getText().toString());
                        if(allTracks.size() > 0 && !initialRun.isYardInspection()){
                            initialRun.setTraverseTrack(traverseTracks.get(spTraverseTracks.getSelectedItemPosition()).getUnitId());
                            initialRun.setObserveTrack(observeTracks.get(spObserveTracks.getSelectedItemPosition()).getUnitId());
                            if(isShowTraverseCheckbox){
                                if(!cbTraverse.isChecked()){
                                    initialRun.setTraverseTrack(traverseTracks.get(spTraverseTracks.getSelectedItemPosition()).getUnitId());
                                } else{
                                    initialRun.setTraverseTrack("");
                                }
                                if(!cbObserve.isChecked()){
                                    initialRun.setObserveTrack(observeTracks.get(spObserveTracks.getSelectedItemPosition()).getUnitId());
                                } else {
                                    initialRun.setObserveTrack("");
                                }
                            }
                        } else {
                            initialRun.setTraverseTrack("");
                            initialRun.setObserveTrack("");
                        }
                        if (Globals.isTraverseReq) {
                            int genid = rgType.getCheckedRadioButtonId();
                            RadioButton radioButton = (RadioButton) findViewById(genid);
                            String traverseBy = radioButton.getText().toString();
                            String _traverseByTag = radioButton.getTag().toString();
                            initialRun.setTraverseBy(_traverseByTag);
                        }
                        if (isWConditionReq) {
                            initialRun.setWeatherConditions(etWeatherConditions.getText().toString());
                        }
                        if (isInspectionTypeReq) {
                            int genid = rgInspectionType.getCheckedRadioButtonId();
                            RadioButton radioButton = (RadioButton) findViewById(genid);
                            int rbIndex = rgInspectionType.indexOfChild(radioButton);
                            switch (rbIndex) {
                                case 0:
                                    initialRun.setInspectionTypeTag("required");
                                    break;
                                case 1:
                                    initialRun.setInspectionTypeTag("weather");
                                    break;
                                case 2:
                                    initialRun.setInspectionTypeTag("special");
                                    break;
                            }
                            String _inspectionType = radioButton.getText().toString();
                            initialRun.setInspectionType(_inspectionType);
                            initialRun.setInspectionTypeDescription(etInspectionTypeDescription.getText().toString());
                        } else {
                            //If config is set false then "required" set by default
                            initialRun.setInspectionTypeTag("required");
                        }

                       /* if(allTracks.size() > 1 &&
                                spTraverseTracks.getSelectedItemPosition() == spObserveTracks.getSelectedItemPosition()&&isShowTraverseCheckbox && !cbObserve.isChecked() && !cbTraverse.isChecked() ) {
                                showSameObserveTraverseConfirmation();
                        }else {*/

                        Intent returnIntent = new Intent();
                        returnIntent.putExtra("result", "");
                        returnIntent.putExtra("expEnd", etExpEndMp.getText().toString());
                        setResult(Activity.RESULT_OK, returnIntent);
                        finish();
                        //}
                    }
                }

                else {
                    initialRun.setUserStartMp(etStartMp.getText().toString());
                    if(allTracks.size() > 0 && !initialRun.isYardInspection()){
                        initialRun.setTraverseTrack(traverseTracks.get(spTraverseTracks.getSelectedItemPosition()).getUnitId());
                        initialRun.setObserveTrack(observeTracks.get(spObserveTracks.getSelectedItemPosition()).getUnitId());
                        if(isShowTraverseCheckbox){
                            if(!cbTraverse.isChecked()){
                                initialRun.setTraverseTrack(traverseTracks.get(spTraverseTracks.getSelectedItemPosition()).getUnitId());
                            } else{
                                initialRun.setTraverseTrack("");
                            }
                            if(!cbObserve.isChecked()){
                                initialRun.setObserveTrack(observeTracks.get(spObserveTracks.getSelectedItemPosition()).getUnitId());
                            } else {
                                initialRun.setObserveTrack("");
                            }
                        }
                    } else {
                        initialRun.setTraverseTrack("");
                        initialRun.setObserveTrack("");
                    }
                    if (Globals.isTraverseReq) {
                        int genid = rgType.getCheckedRadioButtonId();
                        RadioButton radioButton = (RadioButton) findViewById(genid);
                        String traverseBy = radioButton.getText().toString();
                        String _traverseByTag = radioButton.getTag().toString();
                        initialRun.setTraverseBy(_traverseByTag);
                    }
                    if (isWConditionReq) {
                        initialRun.setWeatherConditions(etWeatherConditions.getText().toString());
                    }
                    if (isInspectionTypeReq) {
                        int genid = rgInspectionType.getCheckedRadioButtonId();
                        RadioButton radioButton = (RadioButton) findViewById(genid);
                        int rbIndex = rgInspectionType.indexOfChild(radioButton);
                        switch (rbIndex) {
                            case 0:
                                initialRun.setInspectionTypeTag("required");
                                break;
                            case 1:
                                initialRun.setInspectionTypeTag("weather");
                                break;
                            case 2:
                                initialRun.setInspectionTypeTag("special");
                                break;
                        }
                        String _inspectionType = radioButton.getText().toString();
                        initialRun.setInspectionType(_inspectionType);
                        initialRun.setInspectionTypeDescription(etInspectionTypeDescription.getText().toString());
                    } else {
                        //If config is set false then "required" set by default
                        initialRun.setInspectionTypeTag("required");
                    }

                    /*if(allTracks.size() > 1 &&
                            spTraverseTracks.getSelectedItemPosition() == spObserveTracks.getSelectedItemPosition()&&isShowTraverseCheckbox && !cbObserve.isChecked() && !cbTraverse.isChecked() ) {
                        showSameObserveTraverseConfirmation();
                    }else {*/

                    Intent returnIntent = new Intent();
                    returnIntent.putExtra("result", "");
                    returnIntent.putExtra("expEnd", etExpEndMp.getText().toString());
                    setResult(Activity.RESULT_OK, returnIntent);
                    finish();
                    //}
                }
            }
        });
        //btnCancel.setVisibility(View.GONE);
        btnCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                showConfirmationDialog();
            }
        });
    }

    private void setAllSideTracksByDefault() {
        if(isShowAllSideTracks){
            for(Units unit: observeTracks){
                if(unit.getUnitId().equals("0")){
                    spObserveTracks.setSelection(observeTracks.indexOf(unit));
                    tvObserveTrackLimit.setText("");
                    break;
                }
            }
        }
    }

    private void addAllSideTrack() {
        if(observeTracks.size()>0){
            if(isShowAllSideTracks){
                allSideTracksUnit = new Units();
                allSideTracksUnit = observeTracks.get(0).makeClone();
                allSideTracksUnit.setParentId("0");
                allSideTracksUnit.setTrackId("0");
                allSideTracksUnit.setUnitId("0");
                allSideTracksUnit.setDescription("All Side Tracks");
                allSideTracksUnit.setStart(initialRun.getMpStart());
                allSideTracksUnit.setEnd(initialRun.getMpEnd());
                allSideTracksUnit.getAttributes().setPrimary(false);
                observeTracks.add(0, allSideTracksUnit);

            }
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        if(showNearByAssets){
            LocationUpdatesService.addOnLocationUpdateListener( this.getClass().getSimpleName() , this);
        }

    }
    @Override
    public void onPause() {
        super.onPause();
        if(showNearByAssets){
            try {
                LocationUpdatesService.removeLocationUpdateListener(this.getClass().getSimpleName());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

    }
    private String getLineName(){
        String lineName = "";
        if(initialRun!=null){
            for(Units unit: initialRun.getWholeUnitList()){
                if(unit.getUnitId().equals(initialInspection.getLineId())){
                    lineName = unit.getDescription();
                    return lineName;
                }
            }
        }
        return lineName;
    }

    public static void selectDefaultTraverseBy(RadioGroup radioGroup, String value) {

        int childCount = radioGroup.getChildCount();
        for (int i = 0; i < childCount; i++) {
            RadioButton rButton = (RadioButton) radioGroup.getChildAt(i);

            if(rButton.getText().equals(value)){
                if (rButton.getVisibility() == VISIBLE) {
                    rButton.setChecked(true);
                    return;
                }
            }
        }
    }

    void showSameObserveTraverseConfirmation() {
        AlertDialog alertDialog = new AlertDialog.Builder(this)
                //set icon
                .setIcon(android.R.drawable.ic_dialog_alert)
                //set title
                .setTitle(getString(R.string.title_warning))
                //set message
                .setMessage(getString(R.string.same_track_confirmation_msg))
                //set positive button
                .setPositiveButton(getString(R.string.briefing_yes), new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        Intent returnIntent = new Intent();
                        returnIntent.putExtra("result", "");
                        returnIntent.putExtra("expEnd", etExpEndMp.getText().toString());
                        setResult(Activity.RESULT_OK, returnIntent);
                        finish();
                    }
                })
                //set negative button
                .setNegativeButton(getString(R.string.briefing_no), new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        //set what should happen when negative button is clicked
                        return;

                    }
                })
                .show();
    }

    void showConfirmationDialog() {
        AlertDialog alertDialog = new AlertDialog.Builder(this)
                //set icon
                .setIcon(android.R.drawable.ic_dialog_alert)
                //set title
                .setTitle(getString(R.string.title_warning))
                //set message
                .setMessage(getString(R.string.issue_confirmation_msg))
                //set positive button
                .setPositiveButton(getString(R.string.briefing_yes), new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        Intent returnIntent = new Intent();
                        setResult(Activity.RESULT_CANCELED, returnIntent);
                        finish();
                    }
                })
                //set negative button
                .setNegativeButton(getString(R.string.briefing_no), new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        //set what should happen when negative button is clicked
                    }
                })
                .show();
    }
    private void calcSessionData() {
        /*if(isInRange(3.0, 9.0, 4.0) || isInRange(3.0, 9.0, 5.0)){
            Log.d("Testing", "inside loop now");
        }*/
        double startMp = Double.parseDouble(etStartMp.getText().toString());
        double endMp = Double.parseDouble(etExpEndMp.getText().toString());
        JourneyPlanOpt wpTemplate = initialInspection.getTemplateOpt();
        JourneyPlan jp = initialInspection;
        ArrayList<User> rangeUsers = new ArrayList<>();
        inspRanges = new ArrayList<>();
        if(wpTemplate.getCompletion() !=null
                && wpTemplate.getCompletion().getRanges()!=null
                && wpTemplate.getCompletion().getRanges().size()> 0){
            for(CompRange range: wpTemplate.getCompletion().getRanges()){
                //if(!userEmail.equals(range.getUser().getEmail())){
                if(range.getSessions().size()>0){
                    try {
                        for(Session session: range.getSessions()){
                            if (isInRange(Double.parseDouble(session.getStart()), Double.parseDouble(session.getEnd()), startMp)
                                    || isInRange(Double.parseDouble(session.getStart()), Double.parseDouble(session.getEnd()), endMp)
                                    || isInRange(startMp, endMp, Double.parseDouble(session.getStart()))
                                    || isInRange(startMp, endMp, Double.parseDouble(session.getEnd()))){
                                CompRange _range = new CompRange();
                                ArrayList<Session> _session = new ArrayList<>();
                                if(!isUserExist(rangeUsers, range.getUser())){
                                    rangeUsers.add(range.getUser());
                                }
                                _session.add(session);
                                _range.setSessions(_session);
                                _range.setUser(range.getUser());
                                _range.setInspectionId(range.getInspectionId());
                                _range.setInspectionName(range.getInspectionName());
                                inspRanges.add(_range);
                            }
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
                // }
            }
        }
        if(rangeUsers.size()>0){
            tvInspMemebersMsg.setVisibility(VISIBLE);
            String inspSharingMemberMsg = rangeUsers.size() + getString(R.string.session_sharing_msg);
            tvInspMemebersMsg.setText(inspSharingMemberMsg);
            inspMemberAdapter sAdapter = new inspMemberAdapter(InspectionStartActivity.this, inspRanges);
            lvInspMembers.setAdapter(sAdapter);
        } else {
            tvInspMemebersMsg.setVisibility(GONE);
        }
        lvInspMembers.setVisibility(GONE);
    }
    private boolean isUserExist(ArrayList<User> users, User user){
        for(User _user: users){
            if(_user.getEmail().equals(user.getEmail())){
                return true;
            }
        }
        return false;
    }
    private void removeAndUpdateTrackList(Units track, String type){
        if(type.equals("traverse")){
            traverseTracks = new ArrayList<>(allTracks);
            traverseTracks.remove(track);
            if(traverseTracks.size()>0){
                spTraverseTracks.setEnabled(true);
                traverseAdapter.clear(); //remove all data;
                traverseAdapter.addAll(traverseTracks);
                traverseAdapter.notifyDataSetChanged();
               /* ArrayAdapter<Units> traverseAdapter =
                        new ArrayAdapter<Units>(context, android.R.layout.simple_spinner_dropdown_item, traverseTracks);
                traverseAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                spTracks.setAdapter(traverseAdapter);*/
            } else {
                spTraverseTracks.setEnabled(false);
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
        for (Units _track : initialRun.getWholeUnitList()) {
            // Now using isLinear() instead of "track"
            if(_track.isLinear()){
                //if (_track.getAssetType().equals("track") || _track.getAssetType().equals("Side Track")) {
                if(!_track.getAssetTypeObj().isMarkerMilepost()){
                    units.add(_track);
                }
            }
        }
        return units;
    }
    private void filterTracks(){
        ArrayList<Units> tracks = new ArrayList<>();
        double start = Double.parseDouble(etStartMp.getText().toString());
        double end = Double.parseDouble(etExpEndMp.getText().toString());
        for(Units unit: getTracks()){
            double uStart = Double.parseDouble(unit.getStart());
            double uEnd = Double.parseDouble(unit.getEnd());

            if (isInRange(start, end, uStart)
                    || isInRange(start, end, uEnd)
                    || isInRange(uStart, uEnd, start)
                    || isInRange(uStart, uEnd, end)){
                tracks.add(unit);
            }
        }
        allTracks = new ArrayList<>();
        allTracks = tracks;
        updateTrackList();
    }
    private void updateTrackList(){
        //Copying tracks to other arrays
        observeTracks = new ArrayList<>(allTracks);
        traverseTracks = new ArrayList<>(allTracks);
        //adding all side tracks option is allowed
        addAllSideTrack();

        traverseAdapter =
                new ArrayAdapter<>(context, android.R.layout.simple_spinner_dropdown_item, traverseTracks);
        traverseAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spTraverseTracks.setAdapter(traverseAdapter);
        setPrimaryTrackAsTraverse();

        observeAdapter =
                new ArrayAdapter<Units>(context, android.R.layout.simple_spinner_dropdown_item, observeTracks);
        observeAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spObserveTracks.setAdapter(observeAdapter);

        if(allTracks.size() == 0){
            spTraverseTracks.setEnabled(false);
            tvTraverseTrackLimit.setText("");
            spObserveTracks.setEnabled(false);
            tvObserveTrackLimit.setText("");
            cbTraverse.setChecked(true);
            cbTraverse.setEnabled(false);
            cbObserve.setChecked(true);
            cbObserve.setEnabled(false);
        } else {
            spTraverseTracks.setEnabled(true);
            spObserveTracks.setEnabled(true);
            cbTraverse.setChecked(false);
            cbTraverse.setEnabled(true);
            cbObserve.setChecked(false);
            cbObserve.setEnabled(true);

            if(!cbTraverse.isChecked()){
                spTraverseTracks.setEnabled(true);
            }
            if(!cbObserve.isChecked()){
                spObserveTracks.setEnabled(true);
            }
        }
        if(selectedObserveOpt.equals("All side tracks")){
            setAllSideTracksByDefault();
        } else if(selectedObserveOpt.equals("N/A")) {
            spObserveTracks.setEnabled(false);
            cbObserve.setChecked(true);
        }
    }

    @Override
    public void onLocationUpdated(Location location) {
        if(!LocationUpdatesService.canGetLocation() || location.getProvider().equals("None")) {
            Utilities.showSettingsAlert(InspectionStartActivity.this);
        }
        else{
            Globals.CURRENT_LOCATION = String.valueOf(location.getLatitude()) + "," + String.valueOf(location.getLongitude());
            LatLong mlocation = new LatLong(Double.toString(location.getLatitude()), Double.toString(location.getLongitude()));
            if(lastLocation!=null){
                lastLocation.bearingTo(location);
                Log.e("Location:", String.valueOf(lastLocation.bearingTo(location)));
            }
            //listUpdate(mLocation);
            lastLocation = location;
        }

    }
    private void setPrimaryTrackAsTraverse(){
        if(isPrimaryAssetOnTop){
            for(Units unit: traverseTracks){
                if(unit.getAttributes().isPrimary()){
                    spTraverseTracks.setSelection(traverseTracks.indexOf(unit));
                    break;
                }
            }
        }
    }
    @Override
    public void onBackPressed() {
        showConfirmationDialog();
    }
}