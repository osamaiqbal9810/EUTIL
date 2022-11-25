package com.app.ps19.elecapp.inspection;

import static android.view.View.GONE;
import static android.view.View.INVISIBLE;
import static android.view.View.VISIBLE;
import static com.app.ps19.elecapp.Shared.Globals.ASSET_TYPE_SIDE_TRACK;
import static com.app.ps19.elecapp.Shared.Globals.MESSAGE_STATUS_READY_TO_POST;
import static com.app.ps19.elecapp.Shared.Globals.SESSION_STARTED;
import static com.app.ps19.elecapp.Shared.Globals.SESSION_STOPPED;
import static com.app.ps19.elecapp.Shared.Globals.TASK_FINISHED_STATUS;
import static com.app.ps19.elecapp.Shared.Globals.TASK_IN_PROGRESS_STATUS;
import static com.app.ps19.elecapp.Shared.Globals.WORK_PLAN_FINISHED_STATUS;
import static com.app.ps19.elecapp.Shared.Globals.activeSession;
import static com.app.ps19.elecapp.Shared.Globals.appName;
import static com.app.ps19.elecapp.Shared.Globals.dayStarted;
import static com.app.ps19.elecapp.Shared.Globals.getSelectedTask;
import static com.app.ps19.elecapp.Shared.Globals.inbox;
import static com.app.ps19.elecapp.Shared.Globals.isBypassTaskView;
import static com.app.ps19.elecapp.Shared.Globals.isDayProcessRunning;
import static com.app.ps19.elecapp.Shared.Globals.isMaintainer;
import static com.app.ps19.elecapp.Shared.Globals.isMpReq;
import static com.app.ps19.elecapp.Shared.Globals.isPrimaryAssetOnTop;
import static com.app.ps19.elecapp.Shared.Globals.isShowAllSideTracks;
import static com.app.ps19.elecapp.Shared.Globals.isShowTraverseCheckbox;
import static com.app.ps19.elecapp.Shared.Globals.loadDayStatus;
import static com.app.ps19.elecapp.Shared.Globals.maintenanceList;
import static com.app.ps19.elecapp.Shared.Globals.offlineMode;
import static com.app.ps19.elecapp.Shared.Globals.orgCode;
import static com.app.ps19.elecapp.Shared.Globals.saveCurrentJP;
import static com.app.ps19.elecapp.Shared.Globals.selectedDUnit;
import static com.app.ps19.elecapp.Shared.Globals.selectedForm;
import static com.app.ps19.elecapp.Shared.Globals.selectedJPlan;
import static com.app.ps19.elecapp.Shared.Globals.selectedObserveOpt;
import static com.app.ps19.elecapp.Shared.Globals.selectedPostSign;
import static com.app.ps19.elecapp.Shared.Globals.selectedUnit;
import static com.app.ps19.elecapp.Shared.Globals.setSelectedTask;
import static com.app.ps19.elecapp.Shared.Globals.setSelectedUnit;
import static com.app.ps19.elecapp.Shared.Globals.webPullRequest;
import static com.app.ps19.elecapp.Shared.Globals.webUploadMessageLists;
import static com.app.ps19.elecapp.Shared.StopInspectionFragment.STOP_INSPECTION_RETURN_MSG_FOR_DASHBOARD;
import static com.app.ps19.elecapp.Shared.Utilities.createATextView;
import static com.app.ps19.elecapp.Shared.Utilities.elapsedCalculator;
import static com.app.ps19.elecapp.Shared.Utilities.getFilteredNewIssues;
import static com.app.ps19.elecapp.Shared.Utilities.isInRange;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.content.res.Resources;
import android.graphics.Color;
import android.location.Location;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.Editable;
import android.text.Html;
import android.text.TextWatcher;
import android.util.DisplayMetrics;
import android.util.Log;
import android.util.TypedValue;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.view.animation.AlphaAnimation;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.BaseExpandableListAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.ExpandableListAdapter;
import android.widget.ExpandableListView;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListAdapter;
import android.widget.PopupMenu;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.RecyclerView;

import com.app.ps19.elecapp.AppFormActivity;
import com.app.ps19.elecapp.AssetMapsActivity;
import com.app.ps19.elecapp.InboxActivity;
import com.app.ps19.elecapp.InspectionMapActivity;
import com.app.ps19.elecapp.MaintenanceActivity;
import com.app.ps19.elecapp.R;
import com.app.ps19.elecapp.ReportAddActivity;
import com.app.ps19.elecapp.ReportInboxActivity;
import com.app.ps19.elecapp.Shared.DBHandler;
import com.app.ps19.elecapp.Shared.Globals;
import com.app.ps19.elecapp.Shared.StaticListItem;
import com.app.ps19.elecapp.Shared.StopInspectionFragment;
import com.app.ps19.elecapp.Shared.Utilities;
import com.app.ps19.elecapp.UnitCordsAdjActivity;
import com.app.ps19.elecapp.classes.DUnit;
import com.app.ps19.elecapp.classes.JourneyPlan;
import com.app.ps19.elecapp.classes.JourneyPlanOpt;
import com.app.ps19.elecapp.classes.LatLong;
import com.app.ps19.elecapp.classes.Report;
import com.app.ps19.elecapp.classes.Session;
import com.app.ps19.elecapp.classes.Task;
import com.app.ps19.elecapp.classes.Units;
import com.app.ps19.elecapp.classes.UnitsTestOpt;
import com.app.ps19.elecapp.classes.dynforms.AppFormDialogFragment;
import com.app.ps19.elecapp.classes.dynforms.DynForm;
import com.app.ps19.elecapp.classes.maintenance.WorkOrderListFragment;
import com.app.ps19.elecapp.defects.DefectsActivity;
import com.app.ps19.elecapp.defects.PreviousDefectsMapActivity;
import com.app.ps19.elecapp.location.Interface.OnLocationUpdatedListener;
import com.app.ps19.elecapp.location.LocationUpdatesService;
import com.app.ps19.elecapp.reports.ReportShowActivity;

import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;

//import static com.app.ps19.elecapp.Shared.Globals.selectedTask;

public class InspectionActivity extends AppCompatActivity implements OnLocationUpdatedListener, StopInspectionFragment.StopDialogListener {
    public static final int ADD_DEFECT_ACTIVITY_REQUEST_CODE = 100;
    public static int MAP_SELECTION_REQUEST_CODE = 110;
    public static final String ASC_ORDER_MP_SORT_TEXT = "MP asc";
    public static final String DESC_ORDER_MP_SORT_TEXT = "MP desc";
    public static String SESSION_STOP_STATUS = "";
    public static String SESSION_RESUME_STATUS = "";
    public static String SESSION_PAUSE_MESSAGE = "";
    private SymbolsAdapter symbolsAdapter;
    private  RecyclerView rvSymbols;
    ProgressDialog dialog =null;

    private SessionsAdapter sessionsAdapter;

    private ExpandableListView sessionsExpandableListView;
    private ScrollView svSessions;

    private ArrayList<Session> _sessionsList;
    int sessionCount = 0;
    int secCounter=0;
    private final int LAUNCH_APPFORM_ACTIVITY=1;
    private ExpandableListView inspectionExpandableListView;
    private ExpandableListView inspectionExpandableListViewFreeze;  // will be use to show freezeItems
    private  TextView tvMapMode;
    ArrayList<JourneyPlanOpt> journeyPlansInProgress;
    ArrayList<Units> unitList;
    private String areaType;
    private String mParam2;
    View viewColorNA;
    View viewColorA;
    View viewColorExp;
    public Location mCurrentLocation;
    TextView tvStartMP;
    TextView tvEndMP;
    TextView tvSessionStartDateTime;
    Thread threadScreenUpdate=null;
    private RecyclerView horizontal_recycler_view;
    SimpleDateFormat dateTimeFormat = new SimpleDateFormat("hh:mm");
    View viewLocationColor;
    TextView tvUnitLocation;
    ImageView imgClockIcon_ma;
    //ParentLevel itemsAdapter;
    InspectionUnitsAdapter itemsAdapter;
    InspectionUnitsAdapter itemsAdapterFreeze;
    ArrayList<Template> templateList=new ArrayList<>();
    ArrayList<JourneyPlanOpt> wpTemplateList=inbox.loadWokPlanTemplateListEx();
    LayoutInflater _inflater;
    ArrayList<DUnit> dUnitList = new ArrayList<>();
    //RadioGroup rgAssetFilter;
    LatLong location = new LatLong("0", "0");
    boolean prevSessionStatus = isSessionStarted();
    LinearLayout ll_assets_filter;
    ImageView inspection_expand_indicator;
    Spinner spAssetType;
    Spinner spRangeFilter;
    Spinner spAssetSort;
    ArrayList<String> assetTypeItems = new ArrayList<>();
    ArrayList<String> filterItems = new ArrayList<>();
    ArrayList<String> sortItems = new ArrayList<>();
    String selectedAssetType = "All";
    String selectedAssetRange = "Session";
    String selectedAssetSort = ASC_ORDER_MP_SORT_TEXT;
    String prevtimeStr = "";
    CheckBox cbTraverse;
    CheckBox cbObserve;

    //For Session start dialog
    TextView tvObserveTrackLimit;
    TextView tvTraverseTrackLimit;
    //Traverse and Observe track code
    Spinner spTraverseTracks;
    Spinner spObserveTracks;

    ArrayList<Units> allTracks;
    ArrayList<Units> filteredTracks;
    ArrayAdapter<Units> traverseAdapter;
    ArrayAdapter<Units> observeAdapter;
    boolean newSessionStarted = false;
    LinearLayout llSessionContainer;
    static int selectedGroupPosition;
    FrameLayout flMaintenance;
    LinearLayout ll_maintenance;
    LinearLayout ll_inspection_tile;
    TextView tvTaskForm;
    TextView tvTaskReports;
    LinearLayout llTypeFilter;
    LinearLayout llRangeFilter;
    LinearLayout llSortFilter;
    TextView tvSessionActionText ;
    Button llSessionActionBtn ;
    ViewGroup view;
    ScrollView svContainer;
    LinearLayout llMainContainer;

    //End
    boolean blnEnforceTaskCompleteRule=false;
    Units allSideTracksUnit;
    ArrayList<Units> traverseTracks = new ArrayList<>();
    ArrayList<Units> observeTracks = new ArrayList<>();
    TextView tvMaintenance;
    TextView tvSessionTitle;
    TextView tvSessionCount;
    TextView tvSessionCountTitle;
    ImageView session_expand_indicator;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_inspection);
        _inflater = (LayoutInflater) getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        //rgAssetFilter = findViewById(R.id.rg_asset_filter);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        symbolsAdapter = new SymbolsAdapter(this, true);
        rvSymbols = (RecyclerView) findViewById(R.id.rvInspectionSymbols);
        svContainer = findViewById(R.id.sv_container);
        llMainContainer = findViewById(R.id.ll_main_container);
        LinearLayout ll_Inspection_Legends = (LinearLayout) findViewById(R.id.ll_Inspection_Legends);
        rvSymbols.setAdapter(symbolsAdapter);

        intiSessionDetails();
        setTitle(selectedJPlan.getTitle());
        view = (ViewGroup) findViewById(R.id.rl_inspection_sessions);

        tvSessionCount = findViewById(R.id.tv_session_count);
        tvSessionActionText = findViewById(R.id.tvBtnSS_ma);
        llSessionActionBtn = findViewById(R.id.btn_BtnSS_ma);
        tvSessionTitle = findViewById(R.id.tv_session_title);
        tvSessionCountTitle = findViewById(R.id.tv_session_NO);

        LinearLayout ll_inspection_task = findViewById(R.id.ll_inspection_task);
        spAssetSort = findViewById(R.id.sp_sorting);
        spAssetType = findViewById(R.id.sp_asset_type);
        spRangeFilter = findViewById(R.id.sp_range_filter);
        imgClockIcon_ma = findViewById(R.id.imgClockIcon_ma);

        llTypeFilter = findViewById(R.id.ll_type_filter);
        llRangeFilter = findViewById(R.id.ll_range_filter);
        llSortFilter = findViewById(R.id.ll_sort_filter);
        tvMaintenance = findViewById(R.id.tv_maintenance);

        //updating messages
        SESSION_STOP_STATUS = getString(R.string.pause);
        SESSION_RESUME_STATUS = getString(R.string.resume);
        SESSION_PAUSE_MESSAGE = getString(R.string.inspection_pause_message);

        dialog=new ProgressDialog(this);
        llSessionActionBtn.setOnClickListener(v -> {
            AlphaAnimation buttonClick = new AlphaAnimation(1F, 0.1F);
            llSessionActionBtn.startAnimation(buttonClick);

            if (activeSession != null) {
                if (activeSession.getStatus().equals(SESSION_STARTED)) {
                    showPauseResumeDialog(this, view, SESSION_STOP_STATUS);
                    //showEndMpDialog(this, view);
                } else if (activeSession.getStatus().equals(SESSION_STOPPED)) {
                    showStartMpDialog(this, view, null,"");
                }
            } else {
                showStartMpDialog(this, view, null,"");
            }
        });

        int size = this._sessionsList.size();
        tvSessionCount.setText(Integer.toString(size));

        updateStopButtonBackground(llSessionActionBtn, tvSessionActionText);

        tvStartMP = (TextView) view.findViewById(R.id.tv_session_startMP);
        tvEndMP = (TextView) view.findViewById(R.id.tv_session_endMP);
        tvSessionStartDateTime = (TextView) view.findViewById(R.id.tv_session_duration);
        tvStartMP.setText("--");
        tvEndMP.setText("--");

        if (threadScreenUpdate == null) {
            threadScreenUpdate = new Thread(new Runnable() {

                @Override
                public void run() {

                    try {
                        while (true) {
                            secCounter++;
                            if (secCounter >= 60) {
                                secCounter = 1;
                            }

                            if(!isSessionPaused()) {
                                runOnUiThread(new Runnable() {
                                    @Override
                                    public void run() {

                                        if (isSessionStarted()) {
                                            if (imgClockIcon_ma.getVisibility() == VISIBLE) {
                                                imgClockIcon_ma.setVisibility(View.INVISIBLE);
                                            } else {
                                                imgClockIcon_ma.setVisibility(VISIBLE);
                                            }
                                            tvSessionStartDateTime.setVisibility(VISIBLE);
                                            updateSessionDetails(true);
                                        } else {
                                            if (imgClockIcon_ma.getVisibility() == View.INVISIBLE) {
                                                imgClockIcon_ma.setVisibility(VISIBLE);
                                            }
                                            updateSessionDetails(true);
                                            tvMapMode.setVisibility(VISIBLE);
                                            ll_assets_filter.setVisibility(VISIBLE);
                                            inspection_expand_indicator.setVisibility(VISIBLE);

                                        /*
                                        tvMapMode.setVisibility(GONE);
                                        ll_assets_filter.setVisibility(GONE);
                                        inspection_expand_indicator.setVisibility(GONE);
                                        prevtimeStr = "--:--";
                                        */
                                        }

                                        if (prevSessionStatus != isSessionStarted() || newSessionStarted) {
                                            newSessionStarted = false;
                                            updateStopButtonBackground(llSessionActionBtn, tvSessionActionText);
                                            refresh();
                                            prevSessionStatus = isSessionStarted();

                                            int sessionCount = getSessionsCount();
                                            tvSessionCount.setText(Integer.toString(sessionCount));

                                            if (prevSessionStatus) {
                                                updateSessionDetails(true);
                                                tvMapMode.setVisibility(VISIBLE);
                                                ll_assets_filter.setVisibility(VISIBLE);
                                                inspection_expand_indicator.setVisibility(VISIBLE);
                                            }

                                        }

                                    }
                                });

                            }
                            Thread.sleep(1000);
                        }
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            });
            threadScreenUpdate.start();
        }


        updateSessionDetails(true);

        sessionsAdapter = new SessionsAdapter(this);

        llSessionContainer = findViewById(R.id.ll_sessions_expandableList);

        LinearLayout ll_sessions = (LinearLayout) findViewById(R.id.ll_sessions);
        session_expand_indicator = (ImageView) findViewById(R.id.session_expand_indicator);

        session_expand_indicator.setOnClickListener(v -> {
            if (sessionsExpandableListView.getVisibility() == GONE) {
                session_expand_indicator.setImageResource(R.drawable.ic_expand_less_white_24dp);
                sessionsExpandableListView.setVisibility(VISIBLE);
                float ratio = 0;

                int totalSessions = sessionsAdapter.getSessionCount();
                switch (totalSessions) {
                    case 0:
                        return; //No session running (No expandable screen size)
                    case 1:
                        ratio = ViewGroup.LayoutParams.WRAP_CONTENT;
                        break;
                    default:
                        ratio = (float) 2.8;
                        break;
                }
                setListHeight(sessionsExpandableListView, ratio);

            } else {
                sessionsExpandableListView.setVisibility(GONE);
                ViewGroup.LayoutParams parm = ll_sessions.getLayoutParams();
                parm.height = ViewGroup.LayoutParams.WRAP_CONTENT;
                ll_sessions.setLayoutParams(parm);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    session_expand_indicator.setImageResource(R.drawable.ic_expand_more_white_24dp);
                }
            }
        });


        sessionsExpandableListView = (ExpandableListView) findViewById(R.id.sessionsExpandableListView);
        //sessionsExpandableListView.setGroupIndicator(null);
        sessionsExpandableListView.setAdapter(sessionsAdapter);
        sessionsExpandableListView.setVisibility(GONE);

        sessionsExpandableListView.setOnGroupExpandListener(new ExpandableListView.OnGroupExpandListener() {
            int previousItem = -1;

            @Override
            public void onGroupExpand(int groupPosition) {
                if (groupPosition != previousItem) {
                    sessionsExpandableListView.collapseGroup(previousItem);
                }
                previousItem = groupPosition;
            }
        });
        ll_maintenance=findViewById(R.id.ll_maintenance);
        flMaintenance=findViewById(R.id.fl_maintenance);
        WorkOrderListFragment fragment=WorkOrderListFragment.newInstance("", "");
        final FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        transaction.replace(R.id.fl_maintenance, fragment);
        transaction.addToBackStack(null);
        transaction.commit();
        ImageView maintenanceGroupExpand=findViewById(R.id.maintenance_expand_indicator);
        maintenanceGroupExpand.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (flMaintenance.getVisibility() == View.GONE) {
                    maintenanceGroupExpand.setImageResource(R.drawable.ic_expand_less_white_24dp);
                    flMaintenance.setVisibility(View.VISIBLE);
                    ViewGroup.LayoutParams parm = ll_maintenance.getLayoutParams();
                    DisplayMetrics metrics = new DisplayMetrics();
                    getWindowManager().getDefaultDisplay().getMetrics(metrics);
                    int screenHeight = metrics.heightPixels;
                    parm.height = ViewGroup.LayoutParams.MATCH_PARENT;
                    ll_maintenance.setLayoutParams(parm);
                    ViewGroup.LayoutParams parm1 =flMaintenance.getLayoutParams();
                    screenHeight = (int) (screenHeight / 2.3);
                    if(isMaintainer){
                        screenHeight = (int) ( metrics.heightPixels / 1.1);
                    }
                    parm.height = screenHeight;

                    //parm1.height = ViewGroup.LayoutParams.MATCH_PARENT;
                    flMaintenance.setLayoutParams(parm);

                }else {
                    flMaintenance.setVisibility(View.GONE);
                    ViewGroup.LayoutParams parm = ll_maintenance.getLayoutParams();
                    parm.height = ViewGroup.LayoutParams.WRAP_CONTENT;
                    ll_maintenance.setLayoutParams(parm);
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        maintenanceGroupExpand.setImageResource(R.drawable.ic_expand_more_white_24dp);
                    }
                }
            }
        });
        // LinearLayout ll_inspections = findViewById(R.id.ll_inspections);
        ll_inspection_tile = findViewById(R.id.ll_inspection_tile);
        ll_assets_filter = findViewById(R.id.ll_assets_filter);
        inspection_expand_indicator = findViewById(R.id.inspection_expand_indicator);
        tvMapMode = findViewById(R.id.tv_map_mode);
        tvTaskForm=findViewById(R.id.tv_task_form);
        tvTaskReports=findViewById(R.id.tv_task_reports);
        inspectionExpandableListView = findViewById(R.id.inspectionExpandableListView);
        inspectionExpandableListViewFreeze=findViewById(R.id.inspectionExpandableListViewFreeze);
        //inspectionExpandableListView.setGroupIndicator(null);
        setListHeight(inspectionExpandableListView, 2, true);
        setListViewHeight(inspectionExpandableListViewFreeze);
        inspectionExpandableListViewFreeze.setOnGroupExpandListener(new ExpandableListView.OnGroupExpandListener() {
            int previousItemFreeze = -1;

            @Override
            public void onGroupExpand(int groupPosition) {
                if (groupPosition != previousItemFreeze) {
                    inspectionExpandableListViewFreeze.collapseGroup(previousItemFreeze);
                }
                previousItemFreeze = groupPosition;
                setListViewHeight(inspectionExpandableListViewFreeze,groupPosition);
            }
        });
        inspectionExpandableListViewFreeze.setOnGroupCollapseListener(new ExpandableListView.OnGroupCollapseListener() {
            @Override
            public void onGroupCollapse(int groupPosition) {
                setListViewHeight(inspectionExpandableListViewFreeze,groupPosition);
            }
        });
        inspectionExpandableListView.setOnGroupExpandListener(new ExpandableListView.OnGroupExpandListener() {
            int previousItem = -1;

            @Override
            public void onGroupExpand(int groupPosition) {
                if (groupPosition != previousItem) {
                    inspectionExpandableListView.collapseGroup(previousItem);
                }
                previousItem = groupPosition;
            }
        });
        tvTaskReports.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(isSessionPaused()){
                    //TODO add resume dialog
                    showPauseResumeDialog(InspectionActivity.this,view,SESSION_RESUME_STATUS);
                    //Toast.makeText(InspectionActivity.this,"Press Resume to continue",Toast.LENGTH_SHORT).show();
                    return;
                }
                if(tvTaskReports.getText().toString().equals("")){
                    tvTaskReports.setText(getString(R.string.reports));
                    new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            tvTaskReports.setText("");
                        }
                    },3000);

                    return;
                }else{
                    Intent intent = new Intent(InspectionActivity.this, ReportInboxActivity.class);
                    intent.putExtra("caller", "InspectionActivity");
                    startActivity(intent);
                    //Toast.makeText(getApplicationContext(),"Under Construction!",Toast.LENGTH_SHORT).show();
                    tvTaskReports.setText("");
                }
            }
        });

        tvMapMode.setOnClickListener(v -> {
            if(tvMapMode.getText().toString().equals("")){
                tvMapMode.setText(getString(R.string.map));
                new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        tvMapMode.setText("");
                    }
                },3000);

            }else {
                Intent intent;
                if(appName.equals(Globals.AppName.EUIS)){
                    intent = new Intent(InspectionActivity.this, InspectionMapActivity.class);
                } else {
                    intent = new Intent(InspectionActivity.this, AssetMapsActivity.class);
                }

                startActivityForResult(intent, MAP_SELECTION_REQUEST_CODE);
                tvMapMode.setText("");
            }
        });
        tvMaintenance.setOnClickListener(v -> {
            if(tvMaintenance.getText().toString().equals("")){
                tvMaintenance.setText(getString(R.string.maintenance_title));
                new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        tvMaintenance.setText("");
                    }
                },3000);

            } else {
                if(maintenanceList.getMaintenanceByLineId(selectedJPlan.getLineId()).size()>0){
                    Intent intent = new Intent(InspectionActivity.this, MaintenanceActivity.class);
                    startActivity(intent);
                } else {
                    Toast.makeText(InspectionActivity.this, getString(R.string.no_maintenance_available), Toast.LENGTH_SHORT).show();
                }

                tvMaintenance.setText("");
            }
        });
        tvMaintenance.setVisibility(GONE);

        tvTaskForm.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //setSelectedUnit(unitOpt.getUnit());
                if(isSessionPaused()){
                    //TODO add resume dialog
                    showPauseResumeDialog(InspectionActivity.this,view,SESSION_RESUME_STATUS);
                    //Toast.makeText(InspectionActivity.this,"Press Resume to continue",Toast.LENGTH_SHORT).show();
                    return;
                }
                if(tvTaskForm.getText().toString().equals("")){
                    tvTaskForm.setText(getString(R.string.forms));
                    new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            tvTaskForm.setText("");
                        }
                    },3000);

                    return;
                }else{
                    AppFormDialogFragment dialogFragment=new AppFormDialogFragment(true);
                    dialogFragment.show(getSupportFragmentManager(), "appFormDialog");
                    //Toast.makeText(getApplicationContext(),"Under Construction!",Toast.LENGTH_SHORT).show();
                    tvTaskForm.setText("");
                }
            }
        });
        inspection_expand_indicator.setOnClickListener(v -> {
            if (inspectionExpandableListView.getVisibility() == GONE) {
                inspection_expand_indicator.setImageResource(R.drawable.ic_expand_less_white_24dp);
                inspectionExpandableListView.setVisibility(VISIBLE);
                inspectionExpandableListViewFreeze.setVisibility(VISIBLE);
                ll_assets_filter.setVisibility(VISIBLE);
                //1.61803398875

                setListHeight(inspectionExpandableListView, 2, true);

/*                    ViewGroup.LayoutParams parm = inspectionExpandableListView.getLayoutParams();
                    DisplayMetrics metrics = new DisplayMetrics();
                    getWindowManager().getDefaultDisplay().getMetrics(metrics);
                    int screenHeight = metrics.heightPixels;
                    parm.height = ViewGroup.LayoutParams.MATCH_PARENT;
                    screenHeight = (int) (screenHeight / 2);
                    //screenHeight=(int) screenHeight-inspectionExpandableListView.getTop()-inspectionExpandableListView.getHeight();
                    parm.height = screenHeight;
                    inspectionExpandableListView.setLayoutParams(parm);*/

            } else {
                inspectionExpandableListView.setVisibility(GONE);
                inspectionExpandableListViewFreeze.setVisibility(GONE);
                inspection_expand_indicator.setImageResource(R.drawable.ic_expand_more_white_24dp);
                ll_assets_filter.setVisibility(GONE);
            }
        });

        LatLong location;
        if (mCurrentLocation != null) {
            location = new LatLong(String.valueOf(mCurrentLocation.getLatitude()), String.valueOf(mCurrentLocation.getLongitude()));
        } else {
            location = new LatLong("0", "0");
        }
        journeyPlansInProgress = inbox.getInProgressJourneyPlans();

        /*if(activeSession!=null){
            dUnitList = selectedTask.getSortedUnitListWithinRange(location.getLatLng(), activeSession.getStart(), activeSession.getExpEnd());
        }*/

        ArrayList<Test> testList = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            testList.add(new Test(("G00" + i), (i % 2 == 0) ? Color.parseColor("darkgray") : Color.parseColor(Globals.Green), (i % 2 == 0) ? "Due in 2 days" : "Exipre in x Days"));
        }

        Template template1 = new Template("Template 1", Color.parseColor("darkgray"));
        Template template2 = new Template("Template 2", Color.parseColor(Globals.Green));
        Template template3 = new Template("Template 3", Color.parseColor("darkgray"));

        //dUnitList = getSelectedTask().getUnitList(location.getLatLng());
        //dUnitList = selectedTask.getUnitList(location.getLatLng());
        //By default we set the filter to session only assets
        if(activeSession!=null){
            //In case of yard asset we set filter to All
            if(getSelectedTask().isYardInspection() || appName.equals(Globals.AppName.SCIM)){
                dUnitList = getSelectedTask().getUnitList(location.getLatLng());
                /*for(DUnit d:dUnitList){
                    if(d.isLinear()){
                        d.setFreeze(true);
                    }
                }*/
            } else {
                if(!activeSession.getStart().equals("") && !activeSession.getEnd().equals("")){
                    dUnitList = getSelectedTask().getSortedUnitListWithinRange(location.getLatLng(), activeSession.getStart(), activeSession.getExpEnd());
                }
            }
        } else {
            dUnitList = new ArrayList<>();
        }


        if (isSessionStarted()) { //initialize Inspection Assets here

            //this.unitList = Globals.selectedTask.getWholeUnitList();
            setAssetAdapter();
            initSpinners();
            initSpinnerListeners();

            if (sessionsAdapter != null) {
                sessionsAdapter.UpdateRunningSessionColor();
            }
        }
        //Setting layout for Yard inspection and Maintainer
        if(getSelectedTask().isYardInspection() || isMaintainer || appName.equals(Globals.AppName.SCIM)){
            //llSessionContainer.setVisibility(GONE);
            setYardInspectionView();
            spRangeFilter.setEnabled(false);
        } else {
            llSessionContainer.setVisibility(VISIBLE);
            spRangeFilter.setEnabled(true);
        }
        /* Maintainer Role Items*/
        if(isMaintainer){
            ll_inspection_tile.setVisibility(View.GONE);
            ll_assets_filter.setVisibility(View.GONE);
            inspectionExpandableListView.setVisibility(View.GONE);
            inspectionExpandableListViewFreeze.setVisibility(GONE);
            ll_Inspection_Legends.setVisibility(View.GONE);
            maintenanceGroupExpand.callOnClick();
        }else{
            if(Globals.maintenanceList.getMaintenanceList().size()>0){
                ll_maintenance.setVisibility(View.GONE);
            }else{
                ll_maintenance.setVisibility(View.GONE);
            }
        }
        if(appName.equals(Globals.AppName.SCIM)){
            llTypeFilter.setVisibility(GONE);
            llRangeFilter.setVisibility(GONE);
            //llSessionContainer.setVisibility(GONE);
            tvTaskForm.setVisibility(GONE);
        }
        if(isSessionPaused()){
            llMainContainer.addView(showMessageOnTop(SESSION_PAUSE_MESSAGE),0);
        }
    }

    private void initSpinnerListeners(){

        spAssetSort.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener()
        {
            @Override
            public void onItemSelected(AdapterView<?> arg0, View arg1, int position, long id) {
                switch (position){
                    case 0:
                        selectedAssetSort = ASC_ORDER_MP_SORT_TEXT;
                        break;
                    case 1:
                        selectedAssetSort = DESC_ORDER_MP_SORT_TEXT;
                        break;
                    case 2:
                        selectedAssetSort = "Auto";
                        break;
                }
                setAssetAdapter();
            }

            @Override
            public void onNothingSelected(AdapterView<?> arg0) {
                // TODO Auto-generated method stub
            }
        });

        spRangeFilter.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener()
        {
            @Override
            public void onItemSelected(AdapterView<?> arg0, View arg1, int position, long id) {
                switch (position){
                    case 0:
                        selectedAssetRange = "All";
                        //refreshAssetListFromRangeFilter();
                        break;
                    case 1:
                        selectedAssetRange = "Session";
                        //refreshAssetListFromRangeFilter();
                        break;
                }
                setAssetAdapter();
            }

            @Override
            public void onNothingSelected(AdapterView<?> arg0) {
                // TODO Auto-generated method stub
            }
        });

        spAssetType.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener()
        {
            @Override
            public void onItemSelected(AdapterView<?> arg0, View arg1, int position, long id) {
                switch (position){
                    case 0:
                        selectedAssetType = "All";
                        break;
                    case 1:
                        selectedAssetType = "Linear";
                        break;
                    case 2:
                        selectedAssetType = "Fixed";
                        break;
                }
                setAssetAdapter();
            }

            @Override
            public void onNothingSelected(AdapterView<?> arg0) {
                // TODO Auto-generated method stub
            }
        });

        spAssetSort.setSelection(0, false);
        spAssetType.setSelection(0, false);
        if(getSelectedTask().isYardInspection() || appName.equals(Globals.AppName.SCIM)){
            spRangeFilter.setSelection(0, false);
        } else {
            spRangeFilter.setSelection(1, false);
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, final Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == ADD_DEFECT_ACTIVITY_REQUEST_CODE) {
            if (resultCode == RESULT_OK) {
                refreshIssuesCount();
            }
        }

        if (requestCode == LAUNCH_APPFORM_ACTIVITY) {
            if(resultCode == Activity.RESULT_OK || resultCode==Activity.RESULT_CANCELED) {
                ///String result=data.getStringExtra("result");
                /*
                if (selectedForm.getCurrentValues() != null) {
                    String value = selectedForm.getCurrentValues().get("Inspected");
                    UnitsTestOpt unitTest = selectedForm.getUnitsTestOpt();
                    if (value != null) {
                        if (value.equals("true")) {
                            if (!unitTest.isInspected()) {
                                unitTest.setInspected(true);
                                itemsAdapter.notifyDataSetChanged();
                            }
                        } else {
                            if (unitTest.isInspected()) {
                                unitTest.setInspected(false);
                                itemsAdapter.notifyDataSetChanged();
                            }
                        }
                    }

                }
                */
                onAppFormReturn();
            }
        }
        if (resultCode == Activity.RESULT_CANCELED) {
            // Write your code if there's no result
        }

    }
    private void onAppFormReturn(){

        if (selectedForm !=null && selectedForm.getCurrentValues() != null) {
            //String value = selectedForm.getCurrentValues().get("Inspected");
            String value = selectedForm.getCurrentValues().get(selectedForm.getFormCompleteId());
            UnitsTestOpt unitTest = selectedForm.getUnitsTestOpt();
            if (value != null) {
                if (value.equals("true")) {
                    if (!unitTest.isInspected()) {
                        unitTest.setInspected(true);
                        itemsAdapter.notifyDataSetChanged();
                        itemsAdapterFreeze.notifyDataSetChanged();
                    }
                } else {
                    if (unitTest.isInspected()) {
                        unitTest.setInspected(false);
                        itemsAdapter.notifyDataSetChanged();
                        itemsAdapterFreeze.notifyDataSetChanged();
                    }
                }
            }

        }
    }
    private void updateStopButtonBackground(Button llSessionActionBtn, TextView tvSessionActionText){
        if (isSessionStarted()) {
            if(isSessionPaused()){
                llSessionActionBtn.setBackgroundColor(ContextCompat.getColor(this, R.color.color_db_orange_dark));
                llSessionActionBtn.setText(getString(R.string.tag_resume));
                llSessionActionBtn.setTextColor(ContextCompat.getColor(this, R.color.credentials_white));

            }else{
                llSessionActionBtn.setBackgroundColor(ContextCompat.getColor(this, R.color.color_stop_background));
                llSessionActionBtn.setText(getString(R.string.stop_new_theme));
                llSessionActionBtn.setTextColor(ContextCompat.getColor(this, R.color.credentials_white));

            }
        } else {
            llSessionActionBtn.setBackgroundColor(ContextCompat.getColor(this, R.color.start_button));
            llSessionActionBtn.setText(getString(R.string.start));
            llSessionActionBtn.setTextColor(ContextCompat.getColor(this, R.color.title_black));
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        switch(keyCode){
            case KeyEvent.KEYCODE_BACK:
                // do something here
                threadScreenUpdate.interrupt();
                try {
                    threadScreenUpdate.join();
                } catch (Exception e) {

                }

                LocationUpdatesService.removeLocationUpdateListener( this.getClass().getSimpleName());
                finish();
                return true;
        }
        return super.onKeyDown(keyCode, event);
    }


    @Override
    public void onPause() {
        super.onPause();
    }

    private void initSpinners(){

        if(isSessionStarted()) {
            assetTypeItems.add(getString(R.string.title_all));
            assetTypeItems.add(getString(R.string.linear));
            assetTypeItems.add(getString(R.string.fixed_assets));

            filterItems.add(getString(R.string.title_all));
            filterItems.add(getString(R.string.session));

            sortItems.add(ASC_ORDER_MP_SORT_TEXT);
            sortItems.add(DESC_ORDER_MP_SORT_TEXT);
            sortItems.add(getString(R.string.auto));

        }

        ArrayAdapter<String> typeAdapter = new ArrayAdapter<String>(this,
                R.layout.my_spinner_item, assetTypeItems);
        typeAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spAssetType.setAdapter(typeAdapter);

        ArrayAdapter<String> filterAdapter = new ArrayAdapter<String>(this,
                R.layout.my_spinner_item, filterItems);
        filterAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spRangeFilter.setAdapter(filterAdapter);

        ArrayAdapter<String> sortAdapter = new ArrayAdapter<String>(this,
                R.layout.my_spinner_item, sortItems){
            @Override
            public boolean isEnabled(int position){
                return position != 2;
            }

            @Override
            public View getDropDownView(int position, View convertView, ViewGroup parent) {
                View view = super.getDropDownView(position, convertView, parent);
                TextView tv = (TextView) view;

                if(position==2) {
                    // Set the disable item text color
                    tv.setTextColor(Color.GRAY);
                }
                else {
                    tv.setTextColor(Color.BLACK);
                }
                return view;
            }
        };
        sortAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spAssetSort.setAdapter(sortAdapter);

    }

    private void refreshAssetListFromRangeFilter(){
        if(!isSessionStarted()){return;}
        switch (selectedAssetType) {
            case "All":
                onAllFilter();
                break;
            case "Linear":
                onLinearFilter();
                break;
            case "Fixed":
                onFixedFilter();
                break;
        }

    }


    @Override
    public void onDestroy() {
        super.onDestroy();
        threadScreenUpdate.interrupt();
        try{
            threadScreenUpdate.join();
        }catch (Exception e){

        }
        LocationUpdatesService.removeLocationUpdateListener( this.getClass().getSimpleName());
    }


    @Override
    public void onResume(){
        super.onResume();
        onAppFormReturn();
        /*if(isMidNightInspClosingAllowed){
            if(Globals.checkJourneyPlanExpired()){
                finish();
            }
        }*/
        try {
            LocationUpdatesService.addOnLocationUpdateListener( this.getClass().getSimpleName() , this);

        }catch (Exception e){
            e.printStackTrace();
        }
    }

    @Override
    protected void onStop() {
        super.onStop();
        System.out.println("1.on Stop");
        if(selectedJPlan!=null){
            if(Globals.getSelectedTask().isDirty()){
                selectedJPlan.update();
                System.out.println("Updating JP");
            }
        }
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        System.out.println("2.Back Key pressed");
    }

    @Override
    public boolean onSupportNavigateUp() {
        //onBackPressed();
        System.out.println("1.Back Key pressed");
        finish();
        return true;
    }

    private void onAllFilter(){
        if(!isSessionStarted()){return;}
        //dUnitList = Globals.selectedTask.getUnitList(location.getLatLng());
        if(selectedAssetRange.equals("All")){
            dUnitList = getSelectedTask().getUnitList(location.getLatLng());
        } else {
            if(activeSession!=null){
                if(!activeSession.getStart().equals("") && !activeSession.getEnd().equals("")) {
                    dUnitList = getSelectedTask().getSortedUnitListWithinRange(location.getLatLng(), activeSession.getStart(), activeSession.getExpEnd());
                }
            }
        }
        //setAssetAdapter();
    }

    private void onLinearFilter(){
        if(!isSessionStarted()){return;}
        if(selectedAssetRange.equals("All")){
            dUnitList = getSelectedTask().getUnitList(location.getLatLng());
        } else {
            if(activeSession!=null){
                if(!activeSession.getStart().equals("") && !activeSession.getEnd().equals("")) {
                    dUnitList = getSelectedTask().getSortedUnitListWithinRange(location.getLatLng(), activeSession.getStart(), activeSession.getExpEnd());
                }
            }
        }
        //dUnitList = Globals.selectedTask.getUnitList(location.getLatLng());
        for (Iterator<DUnit> it = dUnitList.iterator(); it.hasNext(); ) {
            //if (it.next().getDistance()>=0) {
            //    it.remove();
            //}
            if (!it.next().isLinear()) {
                it.remove();
            }
        }
        //setAssetAdapter();
    }

    private void onFixedFilter(){
        if(!isSessionStarted()){return;}
        if(selectedAssetRange.equals("All")){
            dUnitList = getSelectedTask().getUnitList(location.getLatLng());
        } else {
            if(activeSession!=null){
                if(!activeSession.getStart().equals("") && !activeSession.getEnd().equals("")) {
                    dUnitList = getSelectedTask().getSortedUnitListWithinRange(location.getLatLng(), activeSession.getStart(), activeSession.getExpEnd());
                }
            }
        }
        //dUnitList = Globals.selectedTask.getUnitList(location.getLatLng());
        for (Iterator<DUnit> it = dUnitList.iterator(); it.hasNext(); ) {
            if (it.next().isLinear()) {
                it.remove();
            }
        }
        //setAssetAdapter();
    }

    @Override
    public void onLocationUpdated(Location location) {
        if(!LocationUpdatesService.canGetLocation() || location.getProvider().equals("None")) {
            Utilities.showSettingsAlert(InspectionActivity.this);
        }
        else {
            mCurrentLocation = location;
            if (selectedAssetSort.equals("Auto")) {
                listUpdate(String.valueOf(mCurrentLocation.getLatitude()), String.valueOf(mCurrentLocation.getLongitude()));
            }
        }
    }


    public class Template{
        public String description="";
        public int color= Color.parseColor("darkgray");
        public ArrayList<Unit> unitList=new ArrayList<>();
        public Template(String description, int color){
            this.description=description;
            this.color=color;
        }

    }

    public class Unit {
        public String description="";
        public int color=Color.parseColor(Globals.Green);
        public ArrayList<Test> testList=new ArrayList<>();
        public Unit(String description, int color){
            this.description=description;
            this.color=color;
        }
        public String getDescription(){
            return description;
        }

        public ArrayList<Test> getTestList() {
            return testList;
        }

        public int getColor() {
            return color;
        }
    }

    public class Test{
        public String description="";
        public int color=Color.parseColor(Globals.Green);
        public String dueText ="";
        public Test(String description , int color, String dueText){
            this.description=description;
            this.color=color;
            this.dueText=dueText;

        }

        public String getDescription() {
            return description;
        }

        public int getColor() {
            return color;
        }

        public String getDueText() {
            return dueText;
        }
    }

    public class InspectionUnitsAdapter extends BaseExpandableListAdapter
    {
        final ArrayList<DUnit> unitList;
        ArrayList<DUnit> unitListOriginal;
        ImageView imgStartPlan;
        final boolean showFreezeItems;
        public  InspectionUnitsAdapter(ArrayList<DUnit> unitList ){
            ArrayList<DUnit> unitList1;
            unitList1 =new ArrayList<>();
            unitList1.addAll(unitList);
            this.showFreezeItems=false;
            this.unitListOriginal=new ArrayList<>();
            this.unitListOriginal=copyItems(unitList);
            unitList1 =copyItems(unitList);
            this.unitList = unitList1;
        }
        public  InspectionUnitsAdapter(ArrayList<DUnit> unitList,boolean showFreezeItems ){
            ArrayList<DUnit> unitList1;
            unitList1 =new ArrayList<>();
            this.showFreezeItems=showFreezeItems;
            this.unitListOriginal=new ArrayList<>();
            this.unitListOriginal=copyItems(unitList);
            unitList1 =copyItems(unitList);
            this.unitList = unitList1;
        }
        private ArrayList<DUnit> copyItems(ArrayList<DUnit> items){
            ArrayList<DUnit> _items=new ArrayList<>();
            for(DUnit d:items){
                //in case items array has size of 1 item
                if(items.size()==1){
                    if(!this.showFreezeItems){
                        _items.add(d);
                    }
                }else{
                    if(this.showFreezeItems){
                        if(d.isFreeze()){_items.add(d);}
                    }else{
                        if(!d.isFreeze()){
                            _items.add(d);
                        }
                    }
                }
            }
            return _items;
        }
        public void filterData(String query){
            query = query.toLowerCase();
            Log.v("MyListAdapter", String.valueOf(unitList.size()));
            unitList.clear();

            if(query.isEmpty()){
                unitList.addAll(unitListOriginal);
            }
            else {

                for(DUnit unitOpt: unitListOriginal){
                    if(unitOpt.getUnit().getDescription().toLowerCase().contains(query)){
                        unitList.add(unitOpt);
                    }
                }
            }
            //Log.v("MyListAdapter", String.valueOf(templateList.size()));
            notifyDataSetChanged();
        }

        @Override
        public UnitsTestOpt getChild(int groupPosition, int childPosition)
        {
            DUnit selected = (DUnit) getGroup(groupPosition);
            ArrayList<UnitsTestOpt> testList = selected.getUnit().getTestFormList();

            UnitsTestOpt unitTestOpt=testList.get(childPosition);

            return unitTestOpt;
        }

        @Override
        public long getChildId(int groupPosition, int childPosition)
        {
            return childPosition;
        }

        @Override
        public View getChildView(int groupPosition, int childPosition,
                                 boolean isLastChild, View convertView, ViewGroup parent)
        {
            View tv=convertView;
            if(tv==null) {
                tv = _inflater.inflate(R.layout.inspection_unit_test_item, parent, false);
            }
            final View cView=tv;

            final UnitsTestOpt unitTest= (UnitsTestOpt) getChild(groupPosition,childPosition);
            TextView textView=tv.findViewById(R.id.tvSecond);
            View v=tv.findViewById(R.id.viewSecond);
            CheckBox chkInspectionTest=tv.findViewById(R.id.chkInspectionTest);
            chkInspectionTest.setChecked(unitTest.isInspected());
            final boolean checkStatus=unitTest.isInspected();
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                v.setBackgroundTintList (ColorStateList.valueOf(unitTest.getColor()));
            }
            textView.setText(unitTest.getTitle());
            chkInspectionTest.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    chkInspectionTest.setChecked(checkStatus);
                    cView.performClick();
                }
            });
            tv.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if(isSessionPaused()){
                        // Show Resume Dialog
                        showPauseResumeDialog(InspectionActivity.this, view,SESSION_RESUME_STATUS);
                        //Toast.makeText(InspectionActivity.this,"Press Resume to continue",Toast.LENGTH_SHORT).show();
                        return;
                    }
                    DUnit selectedUnit=(DUnit)getGroup(groupPosition);
                    Globals.selectedUnit=selectedUnit.getUnit();
                    if(!selectedUnit.getUnit().getUnitId().equals(Globals.selectedUnit)){
                        Globals.selectedUnit=selectedUnit.getUnit();
                        Globals.selectedForm=Globals.selectedUnit.getUnitForm(unitTest.getTestCode());
                        if(selectedForm==null){
                            return;
                        }
                        selectedForm.resetForm();
                        selectedForm.setSelectedUnit(Globals.selectedUnit);
                        selectedForm.setUnitsTestOpt(unitTest);
                    }
                    Intent intent = new Intent(InspectionActivity.this, AppFormActivity.class);
                    intent.putExtra("assetType","");
                    intent.putExtra("getGlobalForm",true);
                    intent.putExtra("form",unitTest.getTestCode());

                    startActivityForResult(intent, LAUNCH_APPFORM_ACTIVITY);
                }
            });
            return tv;
        }

        @Override
        public int getChildrenCount(int groupPosition)
        {
            int count=0;

            DUnit selected = (DUnit) getGroup(groupPosition);
            ArrayList<UnitsTestOpt> testList = selected.getUnit().getTestFormList();

            if( testList.size() > 0){
                count=testList.size();
            }

            return count;
        }

        @Override
        public Object getGroup(int groupPosition)
        {
            return unitList.get(groupPosition);
        }

        @Override
        public int getGroupCount()
        {
            return unitList.size();
        }

        @Override
        public long getGroupId(int groupPosition)
        {
            return groupPosition;
        }

        @Override
        public View getGroupView(final int groupPosition, final boolean isExpanded,
                                 View convertView, ViewGroup parent)
        {
            View tv=convertView;
            if(tv==null) {
                tv = _inflater.inflate(R.layout.inspection_unit_parent_item, parent, false);
            }
            final DUnit unitOpt= (DUnit) getGroup(groupPosition);

            if(selectedJPlan!=null){

                TextView tvMilPostLimits=tv.findViewById(R.id.tvMilPostLimits);
                ImageView imgMpEndValue=tv.findViewById(R.id.imgMpEndValue);

                TextView tvMilPostStart=tv.findViewById(R.id.tvMilPostStart);
                TextView tvMilPostEnd=tv.findViewById(R.id.tvMilPostEnd);

                //TextView tvIssuesCount=tv.findViewById(R.id.tvIssuesCount);
                ImageView imgObserve=tv.findViewById(R.id.imgObserve);
                ImageView imgTraverse=tv.findViewById(R.id.imgTraverse);
                TextView textView=tv.findViewById(R.id.tvParent);
                ImageView ivDefList = tv.findViewById(R.id.iv_defects_list);
                LinearLayout llIssuesCount = tv.findViewById(R.id.ll_issues_counts);
                ImageView ivAddDefect = tv.findViewById(R.id.img_issue_add_iupi);
                ImageView ivUnitLocUpdate = tv.findViewById(R.id.fixAssetLocationEdit);

                TextView tvNewIssueCount = tv.findViewById(R.id.issue_count_new);
                TextView tvOldIssueCount = tv.findViewById(R.id.issue_count_old);
                //Button btnPopupMenu = tv.findViewById(R.id.btnPopup);
                ImageView imgPopupMenu=tv.findViewById(R.id.imgViewPopup);

                LinearLayout llMpContainer = tv.findViewById(R.id.ll_mp_container);
                LinearLayout llMarkerContainer = tv.findViewById(R.id.ll_marker_container);
                TextView tvMarkerStart = tv.findViewById(R.id.tv_marker_start);
                TextView tvMarkerEnd = tv.findViewById(R.id.tv_marker_end);
                ImageView ivPin = tv.findViewById(R.id.img_inspection_tile);

                int newIssueCount = 0;
                DUnit currUnit = (DUnit) getGroup(groupPosition);
                int oldIssueCount = selectedJPlan.getTaskList().get(0).getUnitDefectsListByID(currUnit.getUnit().getUnitId()).size();
                newIssueCount = getFilteredNewIssues(unitOpt.getUnit().getUnitId());
                final int newIssueCountFinal=newIssueCount;

                tvNewIssueCount.setText(String.valueOf(newIssueCount));
                tvOldIssueCount.setText(String.valueOf(oldIssueCount));
                if(newIssueCount==0){
                    //llIssuesCount.setVisibility(View.INVISIBLE);
                    if(oldIssueCount==0){
                        tvNewIssueCount.setVisibility(View.INVISIBLE);
                    } else {
                        tvNewIssueCount.setVisibility(VISIBLE);
                        tvNewIssueCount.setBackgroundResource(R.drawable.badge_background_blue);
                        tvNewIssueCount.setText(String.valueOf(oldIssueCount));
                    }

                }else{
                    tvNewIssueCount.setVisibility(VISIBLE);
                    tvNewIssueCount.setBackgroundResource(R.drawable.badge_background);
                }
                //ivPin.setVisibility(INVISIBLE);
                ivPin.setImageResource(R.drawable.pin_light_gray);
                ivPin.setVisibility(VISIBLE);
                /*
                if(activeSession.getTraverseTrack().equals(unitOpt.getUnit().getUnitId())){
                    unitOpt.setFreeze(true);
                    ivPin.setImageResource(R.drawable.pin_red);
                }*/

                if(this.showFreezeItems && unitOpt.isFreeze()){
                    ivPin.setImageResource(R.drawable.pin_red);
                }else if(!this.showFreezeItems && getGroupCount()==1){
                    ivPin.setVisibility(INVISIBLE);
                }

                ivPin.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        currUnit.setFreeze(!currUnit.isFreeze());
                        setAssetAdapter();
                    }
                });
                /*
                if(unitOpt.getUnit().getAttributes().isPrimary()){
                    if(isPrimaryAssetOnTop){
                        //ivPin.setVisibility(VISIBLE);
                        ivPin.setImageResource(R.drawable.pin_red);
                    } else {
                        //ivPin.setVisibility(INVISIBLE);
                    }
                }*/
                textView.setText(unitOpt.getUnit().getDescription());
                imgPopupMenu.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        PopupMenu popup=new PopupMenu(InspectionActivity.this,imgPopupMenu);
                        popup.getMenuInflater()
                                .inflate(R.menu.popup_inspection_unit,popup.getMenu());
                        if(unitOpt.isLinear()) {
                            popup.getMenu().getItem(0).setVisible(false);
                            popup.getMenu().getItem(4).setVisible(true);
                        }
                        if(getSelectedTask().isYardInspection() || appName.equals(Globals.AppName.SCIM)){
                            try {
                                popup.getMenu().getItem(4).setVisible(false);
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        }
                        popup.setOnMenuItemClickListener(new PopupMenu.OnMenuItemClickListener() {
                            @Override
                            public boolean onMenuItemClick(MenuItem item) {
                                DUnit dUnit = (DUnit) getGroup(groupPosition);
                                selectedUnit = dUnit.getUnit();
                                selectedDUnit = dUnit;
                                switch (item.getItemId()) {
                                    case R.id.mnuEditLocation:
                                        if (activeSession == null) {
                                            Toast.makeText(getApplicationContext(), getString(R.string.no_active_session), Toast.LENGTH_SHORT).show();
                                        }
                                        else {
                                            DUnit _dUnit = (DUnit) getGroup(groupPosition);
                                            selectedUnit = _dUnit.getUnit();
                                            selectedDUnit = _dUnit;
                                            Intent intent = new Intent(InspectionActivity.this, UnitCordsAdjActivity.class);
                                            startActivity(intent);
                                        }
                                        return true;
                                    case R.id.mnuIssues:
                                        if (activeSession == null) {
                                            Toast.makeText(getApplicationContext(), getString(R.string.no_active_session), Toast.LENGTH_SHORT).show();
                                        }
                                        else {
                                            if (newIssueCountFinal == 0 && oldIssueCount == 0) {
                                                Toast.makeText(getApplicationContext(), getString(R.string.no_defect_reported), Toast.LENGTH_SHORT).show();
                                                return false;
                                            } else {

                                                Intent intent = new Intent(InspectionActivity.this, DefectsActivity.class);
                                                DUnit selected = (DUnit) getGroup(groupPosition);
                                                selectedDUnit = selected;
                                                selectedUnit = selected.getUnit();

                                                intent.putExtra("EXTRA_UNIT_ID", selected.getUnit().getUnitId());
                                                intent.putExtra("EXTRA_NEW_ISSUE_COUNT", newIssueCountFinal);
                                                intent.putExtra("EXTRA_OLD_ISSUE_COUNT", oldIssueCount);
                                                startActivity(intent);
                                            }
                                            return true;
                                        }

                                    case R.id.mnuForms:

                                        if (selectedUnit.getAppForms().size() > 0) {
                                            AppFormDialogFragment dialogFragment = new AppFormDialogFragment();
                                            dialogFragment.show(getSupportFragmentManager(), "appFormDialog");
                                        } else {
                                            Toast.makeText(InspectionActivity.this, getString(R.string.no_form_available), Toast.LENGTH_SHORT).show();
                                        }

                                        break;

                                    case R.id.mnuPrevDefectsMap:
                                        if (oldIssueCount == 0) {
                                            Toast.makeText(getApplicationContext(), getString(R.string.no_defect_reported), Toast.LENGTH_SHORT).show();
                                            return false;
                                        } else {
                                            DUnit selected = (DUnit) getGroup(groupPosition);
                                            selectedDUnit = selected;
                                            selectedUnit = selected.getUnit();

                                            Intent intent = new Intent(InspectionActivity.this, PreviousDefectsMapActivity.class);
                                            intent.putExtra("EXTRA_UNIT_ID", selected.getUnit().getUnitId());
                                            startActivity(intent);
                                        }
                                        break;
                                    case R.id.mnuSessionReport:
                                        setSelectedUnit(unitOpt.getUnit());
                                        Intent intentRepActivity=new Intent(InspectionActivity.this, ReportShowActivity.class);
                                        startActivity(intentRepActivity);

                                        break;

                                }

                                return false;
                            }
                        });
                        popup.show();

                    }
                });
                imgObserve.setOnClickListener(v -> {
                    if(activeSession == null){
                        Toast.makeText(getApplicationContext(), getString(R.string.no_active_session), Toast.LENGTH_SHORT).show();
                    }
                    else if(!unitOpt.getUnit().getUnitId().equals(activeSession.getObserveTrack()) || isSessionPaused()){
                        if(isSessionPaused()){
                            showStartMpDialog(InspectionActivity.this,parent, unitOpt.getUnit(), "observe");
                        }else {
                            showSwitchingSessionDialog(InspectionActivity.this, parent, unitOpt.getUnit(), "observe");
                        }
                    }
                });
                imgTraverse.setOnClickListener(v -> {
                    if(activeSession == null){
                        Toast.makeText(getApplicationContext(), getString(R.string.no_active_session), Toast.LENGTH_SHORT).show();
                    }
                    else if(!unitOpt.getUnit().getUnitId().equals(activeSession.getTraverseTrack()) || isSessionPaused()){
                        if(isSessionPaused()) {
                            showStartMpDialog(InspectionActivity.this, parent, unitOpt.getUnit(), "traverse");
                        }
                        else{
                            showSwitchingSessionDialog(InspectionActivity.this, parent, unitOpt.getUnit(), "traverse");
                        }
                    }

                });
                ivUnitLocUpdate.setOnClickListener(v -> {
                    if(activeSession == null){
                        Toast.makeText(getApplicationContext(), getString(R.string.no_active_session), Toast.LENGTH_SHORT).show();
                    }
                    else {
                        DUnit dUnit = (DUnit) getGroup(groupPosition);
                        selectedUnit = dUnit.getUnit();
                        selectedDUnit = dUnit;
                        Intent intent = new Intent(InspectionActivity.this, UnitCordsAdjActivity.class);
                        startActivity(intent);
                    }
                });
                ivAddDefect.setOnClickListener(v -> {
                    if(activeSession == null){
                        Toast.makeText(getApplicationContext(), getString(R.string.no_active_session), Toast.LENGTH_SHORT).show();
                    }
                    else {
                        //if(isExpanded){
                            //if(this.showFreezeItems) {
                                //collapseGroupFreeze(groupPosition);
                                collapseGroupFreeze(-1);
                            //}else{
                                collapseGroup(-1);
                            //}
                        //}
                        DUnit dUnit = (DUnit) getGroup(groupPosition);
                        selectedUnit = dUnit.getUnit();
                        selectedDUnit = dUnit;
                        //selectedDUnit = unit;
                        Globals.selectedReport = null;
                        Globals.newReport = new Report();
                        Globals.issueTitle = "";
                        Globals.selectedCategory = Globals.selectedReportType;
                        Intent intent = new Intent(InspectionActivity.this, ReportAddActivity.class);
                        try {
                            selectedGroupPosition = groupPosition;
                            startActivityForResult(intent, ADD_DEFECT_ACTIVITY_REQUEST_CODE);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                });
                int finalNewIssueCount = newIssueCount;

                llIssuesCount.setOnClickListener((View v) -> {

                    if (finalNewIssueCount == 0 && oldIssueCount == 0) {
                        Toast.makeText(getApplicationContext(), getString(R.string.no_defect_reported), Toast.LENGTH_SHORT).show();
                    } else {
                        Intent intent = new Intent(InspectionActivity.this, DefectsActivity.class);
                        DUnit selected = (DUnit) getGroup(groupPosition);
                        selectedDUnit = selected;
                        selectedUnit = selected.getUnit();

                        intent.putExtra("EXTRA_UNIT_ID", selected.getUnit().getUnitId());
                        intent.putExtra("EXTRA_NEW_ISSUE_COUNT", finalNewIssueCount);
                        intent.putExtra("EXTRA_OLD_ISSUE_COUNT", oldIssueCount);
                        startActivity(intent);
                    }
                });
                boolean isPaused=isSessionPaused();
                ivAddDefect.setVisibility(isPaused ?View.INVISIBLE:View.VISIBLE);
                //imgObserve.setVisibility(isPaused ?View.INVISIBLE:View.VISIBLE);
                //imgTraverse.setVisibility(isPaused ?View.INVISIBLE:View.VISIBLE);
                imgPopupMenu.setVisibility(isPaused?View.INVISIBLE:VISIBLE);

                View view=tv.findViewById(R.id.viewParent);
                ivUnitLocUpdate.setVisibility(GONE);
                //TODO: test marker milepost here
                if(currUnit.getUnit().getAssetTypeObj().isMarkerMilepost()){
                    llMpContainer.setVisibility(GONE);
                    llMarkerContainer.setVisibility(VISIBLE);
                    tvMarkerStart.setText(currUnit.getUnit().getStartMarker());
                    tvMarkerEnd.setText(currUnit.getUnit().getEndMarker());
                    imgObserve.setVisibility(GONE);
                    imgTraverse.setVisibility(GONE);
                } else {
                    llMpContainer.setVisibility(VISIBLE);
                    llMarkerContainer.setVisibility(GONE);
                }
                if(!unitOpt.isLinear() || unitOpt.getUnit().getAssetTypeObj().isMarkerMilepost()) {
                    tvMilPostLimits.setText("MP:"+unitOpt.getUnit().getStart());
                    tvMilPostStart.setText(unitOpt.getUnit().getStart());
                    tvMilPostEnd.setText("...");
                    imgMpEndValue.setVisibility(GONE);
                    tvMilPostEnd.setVisibility(GONE);
                    imgObserve.setVisibility(GONE);
                    imgTraverse.setVisibility(GONE);
                    //ivUnitLocUpdate.setVisibility(View.VISIBLE);
                }
                else{
                    tvMilPostLimits.setText("["+unitOpt.getUnit().getStart()+"-"+ unitOpt.getUnit().getEnd() +"]");
                    tvMilPostStart.setText(unitOpt.getUnit().getStart());
                    tvMilPostEnd.setText(unitOpt.getUnit().getEnd());
                    imgMpEndValue.setVisibility(VISIBLE);
                    tvMilPostEnd.setVisibility(VISIBLE);

                    imgObserve.setVisibility(VISIBLE);
                    imgTraverse.setVisibility(VISIBLE);
                    //ivUnitLocUpdate.setVisibility(View.GONE);

                    //imgObserve.setAlpha((float) 0.2);
                    //imgTraverse.setAlpha((float) 0.2);
                    imgTraverse.setColorFilter(null);
                    imgObserve.setColorFilter(null);
                    if(activeSession!=null){
                        if(unitOpt.getUnit().getUnitId().equals(activeSession.getTraverseTrack())){
                            //imgTraverse.setAlpha((float) 1.0);
                            imgTraverse.setColorFilter(ContextCompat.getColor(InspectionActivity.this,R.color.color_button_enabled));

                        }
                        if(unitOpt.getUnit().getUnitId().equals(activeSession.getObserveTrack())) {
                            //imgObserve.setAlpha((float) 1.0);
                            imgObserve.setColorFilter(ContextCompat.getColor(InspectionActivity.this,R.color.color_button_enabled));
                        }
                    }
                }

                //tvIssuesCount.setText(unitOpt.getIssueCounter());

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    int color = unitOpt.getUnit().getUnitColor();
                    view.setBackgroundTintList (ColorStateList.valueOf(color));
                }
                //String label=""+ template.getSortOrder()+". "+ template.getTitle();
                //            textView.setText(label);
                textView.setText(unitOpt.getUnit().getDescription());
                if(getSelectedTask().isYardInspection() || appName.equals(Globals.AppName.SCIM)){
                    imgObserve.setVisibility(GONE);
                    imgTraverse.setVisibility(GONE);
                }
                //darken the color when all side tracks are selected
                try {
                    if(activeSession.isAllSideTracks()){
                        if(unitOpt.getUnit().getAssetType().equals(ASSET_TYPE_SIDE_TRACK)){
                            imgObserve.setColorFilter(ContextCompat.getColor(InspectionActivity.this,R.color.color_button_enabled));
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
           /* if(currUnit.getUnit().getAssetTypeObj().isMarkerMilepost()){
                imgObserve.setVisibility(GONE);
                imgTraverse.setVisibility(GONE);
            }*/
            }


            return tv;
        }

        @Override
        public boolean hasStableIds()
        {
            return true;
        }

        @Override
        public boolean isChildSelectable(int groupPosition, int childPosition)
        {
            return true;
        }
    }

    public void refresh(){
        if(this.inspectionExpandableListView!=null && selectedJPlan!=null) {

            sessionsAdapter = new SessionsAdapter(this);
            sessionsExpandableListView.setAdapter(sessionsAdapter);

            this.itemsAdapter = new InspectionUnitsAdapter(dUnitList,false);// new ParentLevel(this.unitList);
            this.itemsAdapterFreeze = new InspectionUnitsAdapter(dUnitList,true);
            this.inspectionExpandableListView.setAdapter(this.itemsAdapter);
            this.inspectionExpandableListViewFreeze.setAdapter(this.itemsAdapterFreeze);

            filterItems.clear();
            sortItems.clear();
            assetTypeItems.clear();

            initSpinners();

            if(isSessionStarted()) {
                initSpinnerListeners();
            }

        }
    }


    public void refreshIssuesCount(){
        if(this.inspectionExpandableListView!=null && selectedJPlan!=null) {

            this.itemsAdapter = new InspectionUnitsAdapter(dUnitList);// new ParentLevel(this.unitList);
            this.inspectionExpandableListView.setAdapter(this.itemsAdapter);

            this.inspectionExpandableListView.setSelectedGroup(selectedGroupPosition);

        }
        if(this.inspectionExpandableListViewFreeze!=null && selectedJPlan!=null) {

            this.itemsAdapterFreeze = new InspectionUnitsAdapter(dUnitList,true);// new ParentLevel(this.unitList);
            this.inspectionExpandableListViewFreeze.setAdapter(this.itemsAdapterFreeze);
            this.inspectionExpandableListViewFreeze.setSelectedGroup(selectedGroupPosition);
        }

    }


    public void refresh(String areaType){
        wpTemplateList = inbox.getJPLocationOpts().getJourneyPlanListByLocation(areaType);
        if(this.inspectionExpandableListView!=null && selectedJPlan!=null) {
            this.itemsAdapter = new InspectionUnitsAdapter(dUnitList);
            this.inspectionExpandableListView.setAdapter(this.itemsAdapter);
        }
        if(this.inspectionExpandableListViewFreeze!=null && selectedJPlan!=null) {
            this.itemsAdapterFreeze = new InspectionUnitsAdapter(dUnitList,true);
            this.inspectionExpandableListViewFreeze.setAdapter(this.itemsAdapterFreeze);

        }
        refreshColorLegend();
    }

    public void refreshColors(){
        if(viewColorNA!=null){
            refreshColorLegend();
        }
    }

    private void refreshColorLegend(){
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            viewColorNA.setBackgroundTintList (ColorStateList.valueOf(Globals.COLOR_TEST_NOT_ACTIVE));
            viewColorA.setBackgroundTintList (ColorStateList.valueOf(Globals.COLOR_TEST_ACTIVE));
            viewColorExp.setBackgroundTintList (ColorStateList.valueOf(Globals.COLOR_TEST_EXPIRING));
        }
    }

    private void showSwitchingSessionDialog(final Context context, ViewGroup parent, Units uSelection, String mode){
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        builder.setCancelable(false);
        View viewInflated = LayoutInflater.from(context).inflate(R.layout.session_switching_dialog, parent, false);

        final EditText etStartMp = (EditText) viewInflated.findViewById(R.id.et_start_session_mp_1);
        final EditText etExpEndMp = (EditText) viewInflated.findViewById(R.id.et_session_exp_end_mp_1);
        final EditText etRunningSessionEndMp = (EditText) viewInflated.findViewById(R.id.et_session_end_mp);
        final TextView tvRangeMsg = (TextView) viewInflated.findViewById(R.id.tv_session_end_dialog_range_msg_1);
        tvObserveTrackLimit = viewInflated.findViewById(R.id.tv_selected_observe_track_limit_1);
        tvTraverseTrackLimit = viewInflated.findViewById(R.id.tv_selected_traverse_track_limit_1);
        EditText etSessionStartedAt = viewInflated.findViewById(R.id.et_start_session_mp);
        //TextView tvSessionExpEnd = (TextView) viewInflated.findViewById(R.id.tv_running_session_exp_end);
        TextView tvSessionTraverseTrack = (TextView) viewInflated.findViewById(R.id.tv_selected_traverse_track);
        TextView tvSessionObserveTrack = (TextView) viewInflated.findViewById(R.id.tv_selected_observe_track);
        //Traverse and Observe track code
        spTraverseTracks = (Spinner) viewInflated.findViewById(R.id.sp_traverse_track_1);
        spObserveTracks = (Spinner) viewInflated.findViewById(R.id.sp_observe_track_1);
        cbObserve = viewInflated.findViewById(R.id.cb_observe);
        cbTraverse = viewInflated.findViewById(R.id.cb_traverse);
        final TextView tvLoc = viewInflated.findViewById(R.id.tv_loc_name_1);
        if(!isShowTraverseCheckbox){
            cbTraverse.setVisibility(GONE);
            cbObserve.setVisibility(GONE);
        } else {
            cbTraverse.setVisibility(VISIBLE);
            cbObserve.setVisibility(VISIBLE);
        }
        //Copying tracks to other arrays
        allTracks = getTracks();
        if(allTracks.size() == 0){
            spTraverseTracks.setEnabled(false);
            spObserveTracks.setEnabled(false);
            cbTraverse.setChecked(true);
            cbTraverse.setEnabled(false);
            cbObserve.setChecked(true);
            cbObserve.setEnabled(false);
        } else {
            spTraverseTracks.setEnabled(true);
            spObserveTracks.setEnabled(true);
            cbTraverse.setEnabled(true);
            cbObserve.setEnabled(true);
        }
        filteredTracks = getTracks();
        observeTracks = new ArrayList<>(allTracks);
        traverseTracks = new ArrayList<>(allTracks);
        traverseAdapter = new ArrayAdapter<>(context, android.R.layout.simple_spinner_dropdown_item, traverseTracks);
        traverseAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spTraverseTracks.setAdapter(traverseAdapter);
        etSessionStartedAt.setText(activeSession.getStart());
        etSessionStartedAt.setEnabled(false);

        //tvSessionExpEnd.setText(activeSession.getExpEnd());
        etRunningSessionEndMp.setText(activeSession.getExpEnd());
        etRunningSessionEndMp.requestFocus();

        if(activeSession.getTraverse()!=null){
            tvSessionTraverseTrack.setText(activeSession.getTraverse().getDescription());
        }
        if(activeSession.getObserve()!=null){
            tvSessionObserveTrack.setText(activeSession.getObserve().getDescription());
        }
        if(activeSession.isAllSideTracks()){
            tvSessionObserveTrack.setText("All Side Tracks");
        }
        //removing the traverse track from observe track list
        //observeTracks.remove(spTracks.getSelectedItem());
        if(allTracks.size()>0){
            String lMsg = allTracks.get(0).getDescription() + getString(R.string.from_part1) + allTracks.get(0).getStart()+ getString(R.string.to_part2) + allTracks.get(0).getEnd();
            tvObserveTrackLimit.setText(lMsg);
            tvTraverseTrackLimit.setText(lMsg);
        }
        addAllSideTrack();

        observeAdapter = new ArrayAdapter<Units>(context, android.R.layout.simple_spinner_dropdown_item, observeTracks);
        observeAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spObserveTracks.setAdapter(observeAdapter);

        /*if(traverseTracks.size() == 0){
            spTracks.setEnabled(false);
        }*/
        spTraverseTracks.setSelection(0, false);
        spObserveTracks.setSelection(0, false);

        cbObserve.setOnClickListener(view -> spObserveTracks.setEnabled(!((CompoundButton) view).isChecked()));
        cbTraverse.setOnClickListener(view -> spTraverseTracks.setEnabled(!((CompoundButton) view).isChecked()));
        String _lMsg = uSelection.getDescription() + getString(R.string.from_part1) + uSelection.getStart()+ getString(R.string.to_part2) + uSelection.getEnd();
        spTraverseTracks.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String lMsg = traverseTracks.get(position).getDescription() + getString(R.string.from_part1) + traverseTracks.get(position).getStart()+ getString(R.string.to_part2) + traverseTracks.get(position).getEnd();
                tvTraverseTrackLimit.setText(lMsg);
                //Toast.makeText(TaskInspectionActivity.this, tracks.get(position).getDescription(), Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });
        spObserveTracks.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String unitId = observeTracks.get(position).getUnitId();
                String lMsg;
                if(unitId.equals("0")){
                    lMsg = "";
                } else {
                    lMsg = observeTracks.get(position).getDescription() + getString(R.string.from_part1) + observeTracks.get(position).getStart() + getString(R.string.to_part2) + observeTracks.get(position).getEnd();
                }
                tvObserveTrackLimit.setText(lMsg);
                //Toast.makeText(TaskInspectionActivity.this, tracks.get(position).getDescription(), Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });
        if(mode.equals("observe")){
            spObserveTracks.setSelection(observeAdapter.getPosition(uSelection));
            tvObserveTrackLimit.setText(_lMsg);
        } else if(mode.equals("traverse")){
            spTraverseTracks.setSelection(traverseAdapter.getPosition(uSelection));
            tvTraverseTrackLimit.setText(_lMsg);
        }
        if(selectedAssetRange.equals("Session")){
            etStartMp.setText(activeSession.getStart());
            etExpEndMp.setText(activeSession.getExpEnd());
            if(mode.equals("observe")){
                spObserveTracks.setSelection(observeAdapter.getPosition(uSelection));
                if(activeSession.getTraverse()!=null){
                    spTraverseTracks.setSelection(traverseAdapter.getPosition(activeSession.getTraverse()));
                }
            } else if(mode.equals("traverse")){
                if(activeSession.getObserve()!=null){
                    if(isShowAllSideTracks&&selectedObserveOpt.equals("All side tracks")){
                        setAllSideTracksByDefault();
                    } else {
                        spObserveTracks.setSelection(observeAdapter.getPosition(activeSession.getObserve()));
                    }

                }
                spTraverseTracks.setSelection(traverseAdapter.getPosition(uSelection));
            }
        } else if(selectedAssetRange.equals("All")) {

        }
        final Date startDate = new Date();
        String prefix = "";
        if(selectedPostSign!=null || !selectedPostSign.equals("")){
            prefix = selectedPostSign + " ";
        } else {
            prefix = "MP ";
        }
        String rangeMsg = "<b>" + prefix + " " + "</b> " + getSelectedTask().getMpStart() + getString(R.string.to_part2) + "<b>" + prefix + " " + "</b> " + getSelectedTask().getMpEnd();
        tvRangeMsg.setText(Html.fromHtml(rangeMsg));
        tvLoc.setText(selectedJPlan.getTitle());
        builder.setView(viewInflated);
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
                    if(etStartMp.getText().toString().equals("")||etStartMp.getText().toString().equals(".")||etExpEndMp.getText().toString().equals("")||etExpEndMp.getText().toString().equals(".")){

                    } else {
                        filterTracks(etStartMp.getText().toString(),etExpEndMp.getText().toString(),"SwitchingDialog",uSelection,mode);
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
                    if(etStartMp.getText().toString().equals("")||etStartMp.getText().toString().equals(".")||etExpEndMp.getText().toString().equals("")||etExpEndMp.getText().toString().equals(".")){

                    } else {
                        filterTracks(etStartMp.getText().toString(),etExpEndMp.getText().toString(),"SwitchingDialog",uSelection,mode);
                    }
            }
        });
        builder.setPositiveButton(context.getResources().getText(R.string.btn_ok), new DialogInterface.OnClickListener() {
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
        try {
            dialog.getWindow().setSoftInputMode(
                    WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        } catch (Exception e) {
            e.printStackTrace();
        }
        dialog.show();
        dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                String startMp = etStartMp.getText().toString();
                String expEndMp = etExpEndMp.getText().toString();
                String rEndMp = etRunningSessionEndMp.getText().toString();
                if(startMp.equals("") || startMp.equals(".") || expEndMp.equals("") || expEndMp.equals(".")|| rEndMp.equals("") || rEndMp.equals(".")){
                    Toast.makeText(context, context.getResources().getString(R.string.all_fields_req_msg), Toast.LENGTH_SHORT).show();
                    return;
                } else
                if (!isInRange(Double.parseDouble(selectedJPlan.getTaskList().get(0).getMpStart()), Double.parseDouble(selectedJPlan.getTaskList().get(0).getMpEnd()), Double.parseDouble(rEndMp))) {
                    Toast.makeText(context, getString(R.string.toast_range_milepost), Toast.LENGTH_LONG).show();
                    return;
                }
                else
                if (!isInRange(Double.parseDouble(selectedJPlan.getTaskList().get(0).getMpStart()), Double.parseDouble(selectedJPlan.getTaskList().get(0).getMpEnd()), Double.parseDouble(startMp))) {
                    Toast.makeText(context, context.getResources().getText(R.string.toast_start_milepost), Toast.LENGTH_LONG).show();
                    return;
                } else
                if (!isInRange(Double.parseDouble(selectedJPlan.getTaskList().get(0).getMpStart()), Double.parseDouble(selectedJPlan.getTaskList().get(0).getMpEnd()), Double.parseDouble(expEndMp))) {
                    Toast.makeText(context, context.getResources().getText(R.string.exp_end_not_in_range_msg), Toast.LENGTH_LONG).show();
                    return;
                }
                /*if(filteredTracks.size() == 0){
                    Toast.makeText(context, "Traverse track is required to continue", Toast.LENGTH_SHORT).show();
                    return;
                }*/
               /* if(allTracks.size() > 1 &&
                        spTraverseTracks.getSelectedItemPosition() == spObserveTracks.getSelectedItemPosition() ) {
                    AlertDialog alertDialog = new AlertDialog.Builder(context)
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

                                    //Closing the existing session
                                    for(Session session: selectedJPlan.getIntervals().getSessions()){
                                        if(session.getId().equals(activeSession.getId())){
                                            session.setEnd(rEndMp);
                                            session.setStatus(SESSION_STOPPED);
                                            if(mCurrentLocation!=null){
                                                session.setEndLocation(mCurrentLocation.getLatitude() + "," + mCurrentLocation.getLongitude());
                                            } else {
                                                session.setEndLocation(0.0 + "," + 0.0);
                                            }
                                            session.setEndTime(new Date().toString());
                                            activeSession = null;
                                            break;
                                        }
                                    }

                                    StartSession(context, spTraverseTracks, spObserveTracks, etStartMp, etExpEndMp, startDate);
                                    dialog.dismiss();
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
                            .show();*/
//                } else{
                //Closing the existing session
                for(Session session: selectedJPlan.getIntervals().getSessions()){
                    if(session.getId().equals(activeSession.getId())){
                        session.setEnd(rEndMp);
                        session.setStatus(SESSION_STOPPED);
                        if(mCurrentLocation!=null){
                            session.setEndLocation(mCurrentLocation.getLatitude() + "," + mCurrentLocation.getLongitude());
                        } else {
                            session.setEndLocation(0.0 + "," + 0.0);
                        }
                        session.setEndTime(new Date().toString());
                        makeVirtualSessions(session);
                        //activeSession = null;
                        break;
                    }
                }
                StartSession(context, spTraverseTracks, spObserveTracks, etStartMp, etExpEndMp, startDate);
                dialog.dismiss();
                //}
            }
        });
    }


    private void showEndMpDialog(final Context context, ViewGroup parent){
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        //builder.setTitle("Title");
        View viewInflated = LayoutInflater.from(context).inflate(R.layout.session_end_dialog, parent, false);

        final EditText etEndMp = (EditText) viewInflated.findViewById(R.id.et_session_end_mp);
        final EditText etStartMp = viewInflated.findViewById(R.id.et_start_session_mp);
        //final TextView tvStartedAt = (TextView) viewInflated.findViewById(R.id.tv_session_dialog_end_time);
        final TextView tvEndRangeMsg = (TextView) viewInflated.findViewById(R.id.tv_session_end_dialog_range_msg);
        final TextView tvSelectedTraverse = viewInflated.findViewById(R.id.tv_selected_traverse_track);
        final TextView tvSelectedObserve = viewInflated.findViewById(R.id.tv_selected_observe_track);
        final TextView tvLoc = viewInflated.findViewById(R.id.tv_loc_name);
        //final TextView tvExpEnd = (TextView) viewInflated.findViewById(R.id.tv_session_exp_end_dialog);
        //final TextView tvExpEndTitle = (TextView) viewInflated.findViewById(R.id.tv_exp_end_title);
        String prefix = "";
        if(selectedPostSign!=null || !selectedPostSign.equals("")){
            prefix = selectedPostSign + " ";
        } else {
            prefix = "MP ";
        }
        String rangeMsg = "<b>" + prefix + " " + "</b> " + getSelectedTask().getMpStart() + getString(R.string.to_part2) + "<b>" + prefix + " " + "</b> " + getSelectedTask().getMpEnd();

        String endMpTitle = context.getString(R.string.exp_end_title) + " " + prefix +": ";

        //tvExpEndTitle.setText(endMpTitle);
        //tvStartedAt.setText(dateTimeFormat.format(new Date(activeSession.getStartTime())));
        if(activeSession.getTraverse()!=null && activeSession.getObserve()!=null){
            tvSelectedTraverse.setText(activeSession.getTraverse().getDescription());
            tvSelectedObserve.setText(activeSession.getObserve().getDescription());
        } else {
            for(Units unit: getSelectedTask().getWholeUnitList()){
                if(unit.getUnitId().equals(activeSession.getTraverseTrack())){
                    tvSelectedTraverse.setText(unit.getDescription());
                } else if(unit.getUnitId().equals(activeSession.getObserveTrack())){
                    tvSelectedObserve.setText(unit.getDescription());
                }
            }
        }
        if(activeSession.isAllSideTracks()){
            tvSelectedObserve.setText("All Side Tracks");
        }
        tvLoc.setText(selectedJPlan.getTitle());
        tvEndRangeMsg.setText(Html.fromHtml(rangeMsg));
        etStartMp.setText(activeSession.getStart());
        etStartMp.setEnabled(false);
        //etEndMp.setHint(activeSession.getExpEnd());
        etEndMp.setText(activeSession.getExpEnd());
        etEndMp.requestFocus();
        //tvExpEnd.setText(activeSession.getExpEnd());
        builder.setView(viewInflated);

        builder.setPositiveButton(context.getResources().getText(R.string.btn_ok), new DialogInterface.OnClickListener() {
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
        try {
            dialog.getWindow().setSoftInputMode(
                    WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        } catch (Exception e) {
            e.printStackTrace();
        }
        dialog.show();
        dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                String expEndMp = etEndMp.getText().toString();
                if(expEndMp.equals("")||expEndMp.equals(".")){
                    Toast.makeText(context, context.getResources().getText(R.string.end_mp_req_msg), Toast.LENGTH_SHORT).show();
                    return;
                } else if (!isInRange(Double.parseDouble(selectedJPlan.getTaskList().get(0).getMpStart()), Double.parseDouble(selectedJPlan.getTaskList().get(0).getMpEnd()), Double.parseDouble(etEndMp.getText().toString()))) {
                    Toast.makeText(context, context.getResources().getText(R.string.end_mp_not_in_range_msg), Toast.LENGTH_LONG).show();
                    return;
                } else {
                    for(Session session: selectedJPlan.getIntervals().getSessions()){
                        if(session.getId().equals(activeSession.getId())){
                            session.setEnd(expEndMp);
                            session.setStatus(SESSION_STOPPED);
                            if(mCurrentLocation!=null){
                                session.setEndLocation(mCurrentLocation.getLatitude() + "," + mCurrentLocation.getLongitude());
                            } else {
                                session.setEndLocation(0.0 + "," + 0.0);
                            }
                            session.setEndTime(new Date().toString());
                            //Make Some virtual sessions if All Siding Observer is checked
                            makeVirtualSessions(session);
                            activeSession = null;
                            tvStartMP.setText("--");
                            tvEndMP.setText("--");
                            tvSessionStartDateTime.setText("--:--");
                            tvSessionStartDateTime.setVisibility(View.INVISIBLE);
                            imgClockIcon_ma.setVisibility(View.INVISIBLE);

                            /*
                            llActionButton.setBackgroundColor(context.getResources().getColor(R.color.gradient_green_dark));
                            tvSessionActionBtn.setText(context.getResources().getText(R.string.start_tile_title));
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

                            sAdapter.notifyDataSetChanged();*/
                            dUnitList = new ArrayList<>();
                            selectedJPlan.update();
                            updateSessionDetails(true );
                            updateStopButtonBackground(llSessionActionBtn, tvSessionActionText);
                            itemsAdapter.notifyDataSetChanged();
                            inspectionExpandableListView.invalidateViews();
                            dialog.dismiss();
                            break;
                        }
                    }
                    LinearLayout layout;
                    if(view.findViewWithTag("message")!=null){
                        layout = view.findViewWithTag("message");
                        layout.setVisibility(VISIBLE);
                    } else {
                        llMainContainer.addView(showMessageOnTop(SESSION_PAUSE_MESSAGE),0);
                    }
                }
            }});
    }

    private void makeVirtualSessions(Session session) {
        if(session.isAllSideTracks()){
            //get all siding assets in range
            double start=Double.parseDouble(session.getStart());
            double end =Double.parseDouble(session.getEnd());

            ArrayList<Units> allSidings=new ArrayList<>();
            for (Units unit : getSelectedTask().getWholeUnitList()) {
                if (unit.getAssetType().equals(ASSET_TYPE_SIDE_TRACK)) {
                    double uStart = Double.parseDouble(unit.getStart());
                    double uEnd = Double.parseDouble(unit.getEnd());

                    if (isInRange(start, end, uStart)
                            || isInRange(start, end, uEnd)
                            || isInRange(uStart, uEnd, start)
                            || isInRange(uStart, uEnd, end)) {
                        allSidings.add(unit);
                    }
                }
            }
            for(Units unit:allSidings){
                Double uStart=Double.valueOf(unit.getStart());
                Double uEnd=Double.valueOf(unit.getEnd());
                uStart=uStart<start?start:uStart;
                uEnd =uEnd >end ? end:uEnd;
                if(!isUnitExistsInSessions(unit,uStart,uEnd)) {
                    Session _session = Session.clone(session);
                    _session.setStart(String.valueOf(uStart));
                    _session.setEnd((String.valueOf(uEnd)));
                    _session.setExpEnd(_session.getEnd());
                    _session.setTraverseTrack("");
                    _session.setTraverseUnit(null);
                    _session.setObserveTrack(unit.getUnitId());
                    _session.setObserveUnit(unit);
                    _session.setType("virtual");
                    _session.setParentSession(session.getId());

                    selectedJPlan.getIntervals().getSessions().add(_session);
                    //Add this units inspection form if not exists and
                    // check its inspection checkbox
                    markUnitInspectedCheckbox(unit);
                }
            }
        }
    }
    private void markUnitInspectedCheckbox(Units unit){
        ArrayList<UnitsTestOpt> testList =unit.getTestFormList();
        for(UnitsTestOpt unitTestOpt:testList){
            if(unitTestOpt.getLinearProps().getInspectionType().equals("observed")){
                //found observed form
                DynForm form=unit.getUnitForm(unitTestOpt.getTestCode());
                HashMap<String, String> values=new HashMap<>();
                values.put(form.getFormCompleteId(),"true");
                form.setCurrentValues(values);
            }
        }
        //UnitsTestOpt unitTestOpt=testList.get(childPosition);
        //Globals.selectedForm=Globals.selectedUnit.getUnitForm(unitTest.getTestCode());
    }
    private boolean isUnitExistsInSessions(Units unit, Double uStart, Double uEnd ){
        for(Session session:selectedJPlan.getIntervals().getSessions()){
            if(session.getObserveTrack().equals(unit.getUnitId()) && session.getStatus().equals(SESSION_STOPPED)){
                Double start=Double.parseDouble(session.getStart());
                Double end=Double.parseDouble(session.getEnd());
                if(uStart>=start && uEnd <=end){
                    return true;
                }
            }
        }
        return false;
    }
    private void showStartMpDialog(final Context context, ViewGroup parent, Units uSelection, String mode){
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        builder.setCancelable(false);
        View viewInflated = LayoutInflater.from(context).inflate(R.layout.session_start_dialog, parent, false);

        final EditText etStartMp = (EditText) viewInflated.findViewById(R.id.et_start_session_mp);
        final EditText etExpEndMp = (EditText) viewInflated.findViewById(R.id.et_session_exp_end_mp);
        final TextView tvRangeMsg = (TextView) viewInflated.findViewById(R.id.tv_session_start_dialog_range_msg);
        final TextView tvLoc = viewInflated.findViewById(R.id.tv_loc_name);
        tvObserveTrackLimit = viewInflated.findViewById(R.id.tv_selected_observe_track_limit);
        tvTraverseTrackLimit = viewInflated.findViewById(R.id.tv_selected_traverse_track_limit);
        //Traverse and Observe track code
        spTraverseTracks = (Spinner) viewInflated.findViewById(R.id.sp_traverse_track);
        spObserveTracks = (Spinner) viewInflated.findViewById(R.id.sp_observe_track);
        cbObserve = viewInflated.findViewById(R.id.cb_observe);
        cbTraverse = viewInflated.findViewById(R.id.cb_traverse);
        allTracks = getTracks();
        filteredTracks = getTracks();
        //Copying tracks to other arrays
        observeTracks = new ArrayList<>(allTracks);
        traverseTracks = new ArrayList<>(allTracks);
        //Adding All side tracks option if allowed
        addAllSideTrack();
        traverseAdapter = new ArrayAdapter<>(context, android.R.layout.simple_spinner_dropdown_item, traverseTracks);
        traverseAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spTraverseTracks.setAdapter(traverseAdapter);
        //removing the traverse track from observe track list
        //observeTracks.remove(spTracks.getSelectedItem());
        /*if(observeTracks.size()>0){*/
        observeAdapter = new ArrayAdapter<Units>(context, android.R.layout.simple_spinner_dropdown_item, observeTracks);
        observeAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spObserveTracks.setAdapter(observeAdapter);
        //}
        if(!isShowTraverseCheckbox){
            cbTraverse.setVisibility(GONE);
            cbObserve.setVisibility(GONE);
        } else {
            cbTraverse.setVisibility(VISIBLE);
            cbObserve.setVisibility(VISIBLE);
        }
        if(allTracks.size() == 0){
            spTraverseTracks.setEnabled(false);
            spObserveTracks.setEnabled(false);
            cbTraverse.setChecked(true);
            cbTraverse.setEnabled(false);
            cbObserve.setChecked(true);
            cbObserve.setEnabled(false);
        } else {
            spTraverseTracks.setEnabled(true);
            spObserveTracks.setEnabled(true);
            cbTraverse.setEnabled(true);
            cbObserve.setEnabled(true);
        }
        cbObserve.setOnClickListener(view -> spObserveTracks.setEnabled(!((CompoundButton) view).isChecked()));
        cbTraverse.setOnClickListener(view -> spTraverseTracks.setEnabled(!((CompoundButton) view).isChecked()));
        String prefix = "";
        if(selectedPostSign!=null || !selectedPostSign.equals("")){
            prefix = selectedPostSign + " ";
        } else {
            prefix = "MP ";
        }
        String rangeMsg = "<b>" + prefix + " " + "</b> " + getSelectedTask().getMpStart() + getString(R.string.to_part2) + "<b>" + prefix + " " + "</b> " + getSelectedTask().getMpEnd();

        if(traverseTracks.size() == 0){
            spTraverseTracks.setEnabled(false);
        }
        spTraverseTracks.setSelection(0, false);
        spObserveTracks.setSelection(0, false);
        if(allTracks.size()>0){
            String lMsg = allTracks.get(0).getDescription() + getString(R.string.from_part1) + allTracks.get(0).getStart()+ getString(R.string.to_part2) + allTracks.get(0).getEnd();
            tvObserveTrackLimit.setText(lMsg);
            tvTraverseTrackLimit.setText(lMsg);
        }
        //auto population of end mp
        etExpEndMp.setText(getSelectedTask().getMpEnd());
        etStartMp.requestFocus();
        if(selectedObserveOpt.equals("N/A")){
            spObserveTracks.setEnabled(false);
            cbObserve.setChecked(true);
        } else if (selectedObserveOpt.equals("All side tracks")) {
            setAllSideTracksByDefault();
        }
        if(!mode.equals("")){
            String _lMsg = uSelection.getDescription() + getString(R.string.from_part1) + uSelection.getStart()+ getString(R.string.to_part2) + uSelection.getEnd();
            if(mode.equals("observe")){
                spObserveTracks.setSelection(observeAdapter.getPosition(uSelection));
                tvObserveTrackLimit.setText(_lMsg);
            } else if(mode.equals("traverse")){
                spTraverseTracks.setSelection(traverseAdapter.getPosition(uSelection));
                tvTraverseTrackLimit.setText(_lMsg);
            }
        }

        spTraverseTracks.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String lMsg = traverseTracks.get(position).getDescription() + getString(R.string.from_part1) + traverseTracks.get(position).getStart()+ getString(R.string.to_part2) + traverseTracks.get(position).getEnd();
                tvTraverseTrackLimit.setText(lMsg);
                //selectedTask.setTraverseTrack(traverseTracks.get(position).getUnitId());
                //removeAndUpdateTrackList(traverseTracks.get(position), "observe");
                //Toast.makeText(TaskInspectionActivity.this, tracks.get(position).getDescription(), Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });
        spObserveTracks.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String unitId = observeTracks.get(position).getUnitId();
                String lMsg;
                if(unitId.equals("0")){
                    lMsg = "";
                } else {
                    lMsg = observeTracks.get(position).getDescription() + getString(R.string.from_part1) + observeTracks.get(position).getStart() + getString(R.string.to_part2) + observeTracks.get(position).getEnd();
                }
                tvObserveTrackLimit.setText(lMsg);

                //selectedTask.setTraverseTrack(traverseTracks.get(position).getUnitId());
                //removeAndUpdateTrackList(observeTracks.get(position), "traverse");
                //Toast.makeText(TaskInspectionActivity.this, tracks.get(position).getDescription(), Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });
        ArrayList<Units> finalAllTracks = allTracks;
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
                    if(etStartMp.getText().toString().equals("")||etStartMp.getText().toString().equals(".")||etExpEndMp.getText().toString().equals("")||etExpEndMp.getText().toString().equals(".")){

                    } else {
                        filterTracks(etStartMp.getText().toString(),etExpEndMp.getText().toString(),"", null, "");
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
                    if(etStartMp.getText().toString().equals("")||etStartMp.getText().toString().equals(".")||etExpEndMp.getText().toString().equals("")||etExpEndMp.getText().toString().equals(".")){

                    } else {
                        filterTracks(etStartMp.getText().toString(),etExpEndMp.getText().toString(),"", null, "");
                    }
            }
        });
        final Date startDate = new Date();
        tvRangeMsg.setText(Html.fromHtml(rangeMsg));
        tvLoc.setText(selectedJPlan.getTitle());
        builder.setView(viewInflated);

        builder.setPositiveButton(context.getResources().getText(R.string.btn_ok), new DialogInterface.OnClickListener() {
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
        try {
            dialog.getWindow().setSoftInputMode(
                    WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        } catch (Exception e) {
            e.printStackTrace();
        }
        dialog.show();
        ArrayList<Units> finalAllTracks1 = allTracks;
        dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String startMp = etStartMp.getText().toString();
                String expEndMp = etExpEndMp.getText().toString();
                if (startMp.equals("") || startMp.equals(".") || expEndMp.equals("") || expEndMp.equals(".")) {
                    Toast.makeText(context, context.getResources().getString(R.string.all_fields_req_msg), Toast.LENGTH_SHORT).show();
                    return;
                } else if (!isInRange(Double.parseDouble(selectedJPlan.getTaskList().get(0).getMpStart()), Double.parseDouble(selectedJPlan.getTaskList().get(0).getMpEnd()), Double.parseDouble(etStartMp.getText().toString()))) {
                    Toast.makeText(context, context.getResources().getText(R.string.toast_start_milepost), Toast.LENGTH_LONG).show();
                    return;
                } else if (!isInRange(Double.parseDouble(selectedJPlan.getTaskList().get(0).getMpStart()), Double.parseDouble(selectedJPlan.getTaskList().get(0).getMpEnd()), Double.parseDouble(etExpEndMp.getText().toString()))) {
                    Toast.makeText(context, context.getResources().getText(R.string.exp_end_not_in_range_msg), Toast.LENGTH_LONG).show();
                    return;
                }

                /*if(filteredTracks.size() == 0){
                    Toast.makeText(context, "Traverse track is required to continue", Toast.LENGTH_SHORT).show();
                    return;
                }*/
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
                /*if (finalAllTracks1.size() > 1 &&
                        spTraverseTracks.getSelectedItemPosition() == spObserveTracks.getSelectedItemPosition()) {
                    AlertDialog alertDialog = new AlertDialog.Builder(context)
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
                                    StartSession(context, spTraverseTracks, spObserveTracks, etStartMp, etExpEndMp, startDate);
                                    dialog.dismiss();
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
                } else {*/

                StartSession(context, spTraverseTracks, spObserveTracks, etStartMp, etExpEndMp, startDate);
                dialog.dismiss();
                //}
            }
        });
    }

    void StartSession(Context context, Spinner spTraverseTracks,
                      Spinner spObserveTracks,
                      EditText etStartMp,
                      EditText etExpEndMp,
                      Date startDate) {
        UUID uuid = UUID.randomUUID();
        Session session = new Session();
        session.setStart(etStartMp.getText().toString());
        session.setStartTime(startDate.toString());
        session.setEnd(etExpEndMp.getText().toString());
        session.setExpEnd(etExpEndMp.getText().toString());
        if(mCurrentLocation!=null){
            session.setStartLocation(mCurrentLocation.getLatitude() + "," + mCurrentLocation.getLongitude());
        } else {
            session.setStartLocation(0.0 + "," + 0.0);
        }
        session.setStatus(SESSION_STARTED);
        session.setId(uuid.toString());
        Units traverse = null;
        Units observe = null;
        if(filteredTracks.size()>0){
            traverse = (Units) spTraverseTracks.getSelectedItem();
            observe = (Units) spObserveTracks.getSelectedItem();
            if(isShowTraverseCheckbox){
                if(cbTraverse.isChecked()){
                    session.setTraverseTrack("");
                    session.setTraverseUnit(null);
                } else {
                    session.setTraverseTrack(traverse.getUnitId());
                    session.setTraverseUnit(traverse);
                }
                if(cbObserve.isChecked()){
                    session.setObserveTrack("");
                    session.setObserveUnit(null);
                } else {
                    if(observe.getUnitId().equals("0")&&isShowAllSideTracks){
                        session.setObserveTrack("");
                        session.setObserveUnit(null);
                        session.setAllSideTracks(true);
                    } else {
                        session.setObserveTrack(observe.getUnitId());
                        session.setObserveUnit(observe);
                    }
                }
            }
        } else {
            session.setTraverseTrack("");
            session.setObserveTrack("");
            session.setTraverseUnit(null);
            session.setObserveUnit(null);
        }
        try {
            if(activeSession!=null){
                if(!activeSession.getTraverseTrack().equals("")){
                    //TODO:Need to test this part
                    for(Units unit: getSelectedTask().getWholeUnitList()){
                        if(unit.isLinear()){
                            if(unit.getUnitId().equals(activeSession.getTraverseTrack())){
                                unit.setFreeze(false);
                                break;
                            }
                        }
                    }
                } /*else {
                    for(Units unit: getSelectedTask().getWholeUnitList()){
                        if(unit.isLinear()){
                            if(unit.getUnitId().equals(activeSession.getTraverseTrack())){
                                unit.setFreeze(false);
                                break;
                            }
                        }
                    }
                }*/
            }
            if(!cbTraverse.isChecked()){
                if(traverse!=null){
                    for(Units unit: getSelectedTask().getWholeUnitList()){
                        if(unit.isLinear()){
                            if(unit.getUnitId().equals(traverse.getUnitId())){
                                unit.setFreeze(true);
                                break;
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        setCurrentSession(session);
        Toast.makeText(context, context.getResources().getText(R.string.session_started_msg), Toast.LENGTH_LONG).show();
        selectedJPlan.getIntervals().getSessions().add(session);
        selectedJPlan.update();

        newSessionStarted = true;
        hideMessageOnTop();
        tvSessionStartDateTime.setText("0h:0m");
        setAssetAdapter();
    }
    private void filterTracks(String etStartMp,String etExpEndMp, String source, Units uSelected, String mode){

        ArrayList<Units> tracks = new ArrayList<>();
        double start = Double.parseDouble(etStartMp);
        double end = Double.parseDouble(etExpEndMp);
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
        filteredTracks = new ArrayList<>();
        filteredTracks = tracks;
        updateTrackList(source, uSelected, start, end, mode);
    }
    private void updateTrackList(String source, Units uSelected, double start, double end, String mode){
        //Copying tracks to other arrays
        observeTracks = new ArrayList<>(filteredTracks);
        traverseTracks = new ArrayList<>(filteredTracks);
        traverseAdapter =
                new ArrayAdapter<Units>(InspectionActivity.this, android.R.layout.simple_spinner_dropdown_item, traverseTracks);
        traverseAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spTraverseTracks.setAdapter(traverseAdapter);
        //adding all side tracks option is allowed
        addAllSideTrack();

        observeAdapter =
                new ArrayAdapter<Units>(InspectionActivity.this, android.R.layout.simple_spinner_dropdown_item, observeTracks);
        observeAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spObserveTracks.setAdapter(observeAdapter);

        if(filteredTracks.size() == 0){
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
        if(source.equals("SwitchingDialog")){
            double uStart = Double.parseDouble(uSelected.getStart());
            double uEnd = Double.parseDouble(uSelected.getEnd());
            if (isInRange(start, end, uStart)
                    || isInRange(start, end, uEnd)
                    || isInRange(uStart, uEnd, start)
                    || isInRange(uStart, uEnd, end)){
                if(mode.equals("observe")){
                    if(activeSession.getTraverse()!=null){
                        spObserveTracks.setSelection(observeAdapter.getPosition(uSelected));
                        double auStart = Double.parseDouble(activeSession.getTraverse().getStart());
                        double auEnd = Double.parseDouble(activeSession.getTraverse().getEnd());
                        if (isInRange(start, end, auStart)
                                || isInRange(start, end, auEnd)
                                || isInRange(auStart, auEnd, start)
                                || isInRange(auStart, auEnd, end)){
                            spTraverseTracks.setSelection(traverseAdapter.getPosition(activeSession.getTraverse()));
                        }
                    }
                } else if(mode.equals("traverse")){
                    if(activeSession.getObserve()!=null){
                        spTraverseTracks.setSelection(traverseAdapter.getPosition(uSelected));
                        double auStart = Double.parseDouble(activeSession.getObserve().getStart());
                        double auEnd = Double.parseDouble(activeSession.getObserve().getEnd());
                        if (isInRange(start, end, auStart)
                                || isInRange(start, end, auEnd)
                                || isInRange(auStart, auEnd, start)
                                || isInRange(auStart, auEnd, end)){
                            spObserveTracks.setSelection(observeAdapter.getPosition(activeSession.getObserve()));
                            if(isShowAllSideTracks){
                                setAllSideTracksByDefault();
                            }
                        }
                    }
                }
            }
        }
    }

    private boolean isSessionStarted(){
        if(selectedJPlan!=null){
            for(Session session: selectedJPlan.getIntervals().getSessions()){
                if(session.getStatus().equals(SESSION_STARTED) || session.getStatus().equals(SESSION_STOPPED)){
                    return true;
                }
            }
        }
        return false;
    }
    private boolean isSessionPaused(){
        return  activeSession!=null?activeSession.getStatus().equals(SESSION_STOPPED):true;
    }

    private void intiSessionDetails(){
        if (selectedJPlan != null) {
            this._sessionsList = new ArrayList<>();
            this._sessionsList.addAll(selectedJPlan.getIntervals().getSessions());
            Collections.reverse(this._sessionsList);

            if (_sessionsList != null) {
                if (_sessionsList.size() != 0) {
                    sessionCount = _sessionsList.size();
                    for (Session session : _sessionsList) {
                        if (session.getStatus().equals(SESSION_STARTED)) {
                            activeSession = session;
                            break;
                        }
                    }
                    if(activeSession==null){
                        setDefaultActiveSession();

                    }
                }
            }
        } else {
            _sessionsList = new ArrayList<>();
        }
    }
    private void setDefaultActiveSession(){
        //TODO: crash occurred here on device samsung a7 lite
        if(selectedJPlan.getIntervals().getSessions().size() == 0){
            Toast.makeText(InspectionActivity.this, "Problem occurred! Please try restarting this inspection or use another one.", Toast.LENGTH_SHORT).show();
            finish();
        } else {
            activeSession=selectedJPlan.getIntervals().getSessions().get(selectedJPlan.getIntervals().getSessions().size()-1);
        }
    }
    private int getSessionsCount(){
        intiSessionDetails();
        return _sessionsList.size();
    }


    private void updateSessionDetails(boolean... isNewSession ) {
        boolean is_new_session = isNewSession.length >= 1;
        if(activeSession==null){
            setDefaultActiveSession();
        }
        if(isSessionPaused()){
            if(ll_maintenance!=null){
                ll_maintenance.setVisibility(View.GONE);
            }

            tvSessionStartDateTime.setVisibility(View.INVISIBLE);
            imgClockIcon_ma.setVisibility(View.INVISIBLE);
        } else {
            if(ll_maintenance!=null) {
                if (Globals.maintenanceList.getMaintenanceList().size() > 0) {
                    ll_maintenance.setVisibility(View.GONE);
                } else {
                    ll_maintenance.setVisibility(View.GONE);
                }
            }
        }

        if (activeSession == null || !is_new_session) {
            tvSessionStartDateTime.setText("0h:0m");
        } else {
            tvStartMP.setText(activeSession.getStart());
            tvEndMP.setText(activeSession.getEnd());
            final int[] elapsedTime = elapsedCalculator(new Date(), new Date(activeSession.getStartTime()));
            String days =  (elapsedTime[0]>0? (""+elapsedTime[0] + "d "):"");
            String hours = elapsedTime[1] + "h";
            String mins = elapsedTime[2] + "m";
            String timeStr = days + hours + ":" + mins;
            if (!timeStr.equals(prevtimeStr)) {
                prevtimeStr = timeStr;
                tvSessionStartDateTime.setText(timeStr);
                if (sessionsAdapter != null) {
                    sessionsAdapter.UpdateSessionTimeString(timeStr);

                }
            }
        }

    }


    private void setCurrentSession(Session session){
        activeSession = session;
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

    private ArrayList<Units> getTracks(){
        ArrayList<Units> units = new ArrayList<>();
        for (Units _track : getSelectedTask().getWholeUnitList()) {
            // Now using isLinear() instead of "track"
            //if (_track.getAssetType().equals("track")||_track.getAssetType().equals(ASSET_TYPE_SIDE_TRACK)) {
            if(_track.isLinear()){
                if(!_track.getAssetTypeObj().isMarkerMilepost()){
                    units.add(_track);
                }
            }
        }
        return units;
    }
    private void setListViewHeight(ExpandableListView expListView) {
        ListAdapter listAdapter = expListView.getAdapter();
        int totalHeight = 0;
        if(listAdapter==null){
            return;
        }
        for (int i = 0; i < listAdapter.getCount(); i++) {
            View listItem = listAdapter.getView(i, null, expListView);
            listItem.measure(0, 0);
            totalHeight += listItem.getMeasuredHeight();
            System.out.println("i  " + i);
        }

        ViewGroup.LayoutParams params = expListView.getLayoutParams();
        params.height = totalHeight
                + (expListView.getDividerHeight() * (listAdapter.getCount() - 1));
        System.out.println("params.height =  " + params.height);

        expListView.setLayoutParams(params);
        expListView.requestLayout();
    }

    private void setListHeight(ExpandableListView list, float screenRatio,  boolean... matchParent){
        ViewGroup.LayoutParams parm = list.getLayoutParams();
        DisplayMetrics metrics = new DisplayMetrics();
        getWindowManager().getDefaultDisplay().getMetrics(metrics);
        int screenHeight = metrics.heightPixels;
        boolean is_matchParent = matchParent.length >= 1;
        if(is_matchParent){
            parm.height = ViewGroup.LayoutParams.MATCH_PARENT;
        }
        else
        if(screenRatio <0) {
            screenHeight  = (int) screenRatio;
        }else{
            screenHeight = (int) (screenHeight / screenRatio);
        }
        parm.height = screenHeight;
        list.setLayoutParams(parm);
    }

    public void listUpdate(String lat, String lon) {

        try {
            location = new LatLong(lat,lon);
            refreshAssetListFromRangeFilter();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    private void performTypeFilter(){
        switch (selectedAssetType) {
            case "All":
                onAllFilter();
                break;
            case "Fixed":
                onFixedFilter();
                break;
            case "Linear":
                onLinearFilter();
                break;
        }
    }
    private void sortAssets(){
        if(selectedAssetSort.equals(ASC_ORDER_MP_SORT_TEXT)){
            //Comparator<DUnit> compareByStartMp = (DUnit o1, DUnit o2) -> o1.getUnit().getStart().compareTo( o2.getUnit().getStart() );
            Comparator<DUnit> compareByStartMpNum = new Comparator<DUnit>() {
                @Override
                public int compare(DUnit o1, DUnit o2) {
                    return Float.compare(Utilities.tryParseFloat(o1.getUnit().getStart()),Utilities.tryParseFloat(o2.getUnit().getStart()));
                }
            };
            Collections.sort(dUnitList, compareByStartMpNum);
        }
        if(selectedAssetSort.equals(DESC_ORDER_MP_SORT_TEXT)){
            //Comparator<DUnit> compareByStartMp = (DUnit o1, DUnit o2) -> o2.getUnit().getStart().compareTo( o1.getUnit().getStart() );
            Comparator<DUnit> compareByStartMpNum = new Comparator<DUnit>() {
                @Override
                public int compare(DUnit o1, DUnit o2) {
                    return Float.compare(Utilities.tryParseFloat(o2.getUnit().getStart()),Utilities.tryParseFloat(o1.getUnit().getStart()));
                }
            };
            Collections.sort(dUnitList, compareByStartMpNum);
        }
        if(isPrimaryAssetOnTop){
            DUnit primaryUnit = null;
            for(DUnit unit: dUnitList){
                if(unit.getUnit().getAttributes().isPrimary()){
                    primaryUnit = unit;
                    break;
                }
            }
            if(primaryUnit!=null){
                dUnitList.remove(primaryUnit);
                dUnitList.add(0,primaryUnit);
            }
        }
    }
    private void setAssetAdapter(){
        ArrayList<DUnit> assets = new ArrayList<>(dUnitList);

        //refreshAssetListFromRangeFilter();
        performTypeFilter();
        sortAssets();
        if(assets.equals(dUnitList) && selectedAssetSort.equals("Auto")){

        } else {
            if(selectedJPlan!=null){
                /*for(DUnit d:dUnitList){
                    if(d.isLinear()){
                        d.setFreeze(true);
                    }
                }*/
                itemsAdapter = new InspectionUnitsAdapter(dUnitList);
                inspectionExpandableListView.setAdapter(itemsAdapter);
                itemsAdapterFreeze = new InspectionUnitsAdapter(dUnitList,true);
                inspectionExpandableListViewFreeze.setAdapter(itemsAdapterFreeze);
                setListViewHeight(inspectionExpandableListViewFreeze);

            }
        }
    }
    private void showPauseResumeDialog(final Context context, ViewGroup parent, String mode){

        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        builder.setCancelable(false);
        View viewInflated = LayoutInflater.from(context).inflate(R.layout.inspection_pause_stop_dialog, parent, false);

        final Button btnPause = (Button) viewInflated.findViewById(R.id.btn_pause);
        final Button btnStop = (Button) viewInflated.findViewById(R.id.btn_stop);
        final Button btnResume = (Button) viewInflated.findViewById(R.id.btn_resume);
        final TextView tvMsg = (TextView) viewInflated.findViewById(R.id.tv_confirmation_msg);
        final ImageView ivSessionStatus = (ImageView) viewInflated.findViewById(R.id.iv_sessions_dialog_title);
        final TextView tvSessionTitle = (TextView) viewInflated.findViewById(R.id.tv_session_pause_title);



        builder.setView(viewInflated);

        builder.setNegativeButton(android.R.string.cancel, (dialog, which) -> dialog.cancel());
        if(mode.equals(SESSION_RESUME_STATUS)){
            btnPause.setVisibility(GONE);
            btnStop.setVisibility(GONE);
            ivSessionStatus.setBackgroundResource(R.drawable.ic_baseline_pause_circle_outline_24);
            tvSessionTitle.setText(getString(R.string.inspection_paused_dialog_title));
            tvMsg.setText(R.string.resume_inspection_confirmation);
        } else if(mode.equals(SESSION_STOP_STATUS)){
            btnResume.setVisibility(GONE);
            ivSessionStatus.setBackgroundResource(R.drawable.ic_baseline_play_circle_outline_24);
            tvSessionTitle.setText(R.string.inspection_inprogress_dialog_title);
            tvMsg.setText(R.string.pause_or_stop_inspection_confirmation);
        }
        if(getSelectedTask().isYardInspection() || appName.equals(Globals.AppName.SCIM)){
            btnResume.setVisibility(GONE);
            btnPause.setVisibility(GONE);
            ivSessionStatus.setBackgroundResource(R.drawable.ic_baseline_play_circle_outline_24);
            tvSessionTitle.setText(R.string.inspection_inprogress_dialog_title);
            tvMsg.setText("Do you want to Stop the inspection?");
        }

        final AlertDialog dialog = builder.create();
        try {
            dialog.getWindow().setSoftInputMode(
                    WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        } catch (Exception e) {
            e.printStackTrace();
        }
        dialog.show();
        btnPause.setOnClickListener(view -> {
            showEndMpDialog(context,parent);
            dialog.dismiss();
        });
        btnStop.setOnClickListener(view -> {
            isStopDialog();
            dialog.dismiss();
        });
        btnResume.setOnClickListener(view -> {
            showStartMpDialog(context,parent, null,"");
            dialog.dismiss();
        });
    }
    // Closing inspection code

    public void isStopDialog(){
        //If configured to display only one clock
        try {
            if(isBypassTaskView&&selectedJPlan.getTaskList().size()==1){
                if(getSelectedTask() == null){
                    setSelectedTask(selectedJPlan.getTaskList().get(0));
                }
                //If Milepost requested on stop of task
                if((isMpReq&&!getSelectedTask().getStartTime().equals("")) && !getSelectedTask().isYardInspection() && !isMaintainer && !appName.equals(Globals.AppName.SCIM)){
                    StopInspectionFragment dialogFragment = new StopInspectionFragment();
                    FragmentTransaction ft = getSupportFragmentManager().beginTransaction();

                    Bundle bundle = null;
                    try {
                        bundle = new Bundle();
                        bundle.putBoolean("notAlertDialog", true);
                        if(mCurrentLocation != null){
                            bundle.putString("latitude", String.valueOf(mCurrentLocation.getLatitude()));
                            bundle.putString("longitude", String.valueOf(mCurrentLocation.getLongitude()));
                        } else {
                            String latitude = "0.0";
                            bundle.putString("latitude", latitude);
                            String longitude = "0.0";
                            bundle.putString("longitude", longitude);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }

                    dialogFragment.setArguments(bundle);

                    ft = getSupportFragmentManager().beginTransaction();
                    Fragment prev = getSupportFragmentManager().findFragmentByTag("dialog");
                    if (prev != null) {
                        ft.remove(prev);
                    }
                    ft.addToBackStack(null);
                    dialogFragment.show(ft, "dialog");
                } else {
                    showDialog1("Processing", "Please wait...");
                    new Thread(new Runnable() {
                        @Override
                        public void run() {
                            endTaskAndInspection();
                        }
                    }).start();
                }
            } else {
                if(getSelectedTask() == null){
                    setSelectedTask(selectedJPlan.getTaskList().get(0));
                }
                if(getSelectedTask().getStatus().equals(TASK_IN_PROGRESS_STATUS)){
                    String runFinishMsg = "Run is not finished yet! <br> Please finish the run first?";
                    new android.app.AlertDialog.Builder(InspectionActivity.this)
                            .setTitle("Alert!")
                            .setMessage(Html.fromHtml(runFinishMsg))
                            .setIcon(android.R.drawable.ic_dialog_alert)
                            .setPositiveButton(R.string.btn_ok, new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int whichButton) {

                                    try {
                                        if (Globals.selectedJPlan != null && Globals.selectedJPlan.getTaskList()!=null) {
                                            if (Globals.selectedJPlan.getTaskList().size() == 1) {
                                                setSelectedTask(selectedJPlan.getTaskList().get(0));
                                                //Intent intent = new Intent(InspectionActivity.this, TaskInspectionActivity.class);
                                                //startActivity(intent);
                                            } else {
                                                Intent intent = new Intent(InspectionActivity.this, InboxActivity.class);
                                                startActivity(intent);
                                            }
                                        }
                                    } catch (Resources.NotFoundException e) {
                                        e.printStackTrace();
                                    }
                                }
                            })
                            .setNegativeButton(R.string.btn_cancel, null).show();
                } else {
                    new Thread(new Runnable() {
                        @Override
                        public void run() {
                            endSession();
                        }
                    }).start();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    private void endTaskAndInspection(){
        Date now = new Date();
        try {
            //Closing Inspection Start
            String latitude = "";
            String longitude = "";
            String location;
            if(mCurrentLocation!=null){
                latitude = String.valueOf(mCurrentLocation.getLatitude());
                longitude = String.valueOf(mCurrentLocation.getLongitude());
            }
            if(latitude.equals("")||longitude.equals("")){
                location="0.0" +","+"0.0";
            } else {
                location=latitude +","+longitude;
            }

            JourneyPlan jp=Globals.selectedJPlan;
            if(Globals.inbox != null){
                if(jp == null){
                    jp =Globals.inbox.getCurrentJourneyPlan();
                }
                if(jp !=null){
                    final int taskCount = jp.getTaskList().size();
                    final int taskCompleted= jp.getCompletedTaskCount();
                    if(blnEnforceTaskCompleteRule) {
                        if (taskCount != taskCompleted) {
                            InspectionActivity.this.runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    Toast.makeText(InspectionActivity.this, getResources().getString(R.string.complete_all_tasks), Toast.LENGTH_SHORT).show();
                                    return;
                                }
                            });
                            return;
                        }
                    }
                }else
                {
                    InspectionActivity.this.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(InspectionActivity.this,getResources().getString(R.string.unable_to_find_work_plan),Toast.LENGTH_SHORT).show();
                            return;
                        }
                    });
                    return;

                }
            }


            String listName = Globals.JPLAN_LIST_NAME;
            JSONObject jo = new JSONObject();

            Date _date = new Date();

            try {
                for(Task task: jp.getTaskList()){
                    if(latitude.equals("")||longitude.equals("")){
                        task.setEndLocation("0.0" + "," + "0.0");
                    } else {
                        task.setEndLocation(latitude + "," + longitude);
                    }

                    task.setStatus(TASK_FINISHED_STATUS);
                    Globals.isTaskStarted = false;
                    task.setEndTime(now.toString());
                    //In case of yard inspection
                    if(task.isYardInspection() || isMaintainer || appName.equals(Globals.AppName.SCIM)){
                        task.setUserEndMp(task.getMpEnd());
                    }
                }
                //TODO: will handle this in case of multiple tasks
                for(Session session: jp.getIntervals().getSessions()){
                    if(session.getStatus().equals(SESSION_STARTED)){
                        session.setStatus(SESSION_STOPPED);
                        session.setEndTime(_date.toString());
                        if(latitude.equals("")||longitude.equals("")){
                            session.setEndLocation("0.0" + "," + "0.0");
                        } else {
                            session.setEndLocation(latitude + "," + longitude);
                        }
                        if(jp.getTaskList().get(0).getUserEndMp().equals("")){
                            session.setEnd(jp.getTaskList().get(0).getMpEnd());
                        } else {
                            session.setEnd(jp.getTaskList().get(0).getUserEndMp());
                        }
                        makeVirtualSessions(session);
                    }
                }
                jp.setEndDateTime(_date.toString());
                jp.setEndLocation(location);
                jp.setStatus(WORK_PLAN_FINISHED_STATUS);
                jp.reloadId();
                if(!offlineMode){
                    jo=jp.getJsonObject();
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
            //Adding logic to merge pending data
            DBHandler db = Globals.db;
            List<StaticListItem> pItems = db.getMsgListItems(listName, orgCode, "code='" + jp.getuId() + "' AND status=" + MESSAGE_STATUS_READY_TO_POST);
            if(pItems.size()>0){
                JSONObject pendingItem = null;
                try {
                    pendingItem = new JSONObject(pItems.get(0).getOptParam1());
                    jo = Utilities.addObject(pendingItem, jo);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
            StaticListItem item = new StaticListItem(Globals.orgCode, listName
                    , jp.getuId(), "", jo.toString(), "");
            isDayProcessRunning=true;
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    //showDialog(getResources().getString(R.string.work_plan),getResources().getString(R.string.finishing_inspection));
                }
            });
            Log.i("Message", "Crossing from Inspection finishing dialog");
            //db.AddOrUpdateMsgList(Globals.SOD_LIST_NAME, Globals.orgCode, item, Globals.MESSAGE_STATUS_READY_TO_POST);

            ArrayList<StaticListItem> items=new ArrayList<>();
            items.add(item);
            if(!Globals.offlineMode && webUploadMessageLists(InspectionActivity.this,orgCode,items)==1){
                List<StaticListItem> _items=null;
                if(webPullRequest(InspectionActivity.this,"")){
                    inbox.loadSampleData(InspectionActivity.this);
                    saveCurrentJP(jp.getPrivateKey());
                    jp = inbox.getLastJourneyPlan();
                    selectedJPlan=jp;
                    if(pItems.size()>0){
                        db.RemoveMsgListItems(pItems,MESSAGE_STATUS_READY_TO_POST);
                    }

                    //jp = inbox.getCurrentJourneyPlan();
                    if(jp !=null) {
                        //selectedJPlan=jp;
                        if (!jp.getEndDateTime().equals("")) {
                            //Day end successful
                            showToastOnUiThread(getResources().getString(R.string.inspection_closed));
                            isDayProcessRunning = false;
                            InspectionActivity.this.runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    loadDayStatus(InspectionActivity.this);
                                    //refreshSOD();
                                }
                            });
                        }
                        /*if (!jp.getEndDateTime().equals("")) {
                            //Day end successful
                            showToastOnUiThread(getResources().getString(R.string.inspection_closed));
                            isDayProcessRunning = false;
                            InspectionActivity.this.runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    loadDayStatus(InspectionActivity.this);
                                    refreshSOD();
                                }
                            });
                        }*/

                    }
                }
            } else if(Globals.offlineMode){
                if(jp.getWorkplanTemplateId().equals("")){
                    Log.i("WPLAN ID ", "ID is empty");
                }
                jp.update();
                if(jp.getWorkplanTemplateId().equals("")){
                    Log.i("WPLAN ID ", "ID is empty");
                }
                jp.reloadId();
                String uid=jp.getuId();
                if(uid.equals("")){
                    uid=jp.getPrivateKey();
                }
                Globals.saveCurrentJP(uid);
                inbox.loadSampleData(InspectionActivity.this);
                //Globals.loadInbox(InspectionActivity.this);
                Globals.loadDayStatus(InspectionActivity.this);
                //Log.i("WP Start:",Globals.selectedJPlan.getJsonObject().toString());
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        //refreshDashboard();
                        //refreshSOD();
                    }
                });
                sleep(500);

            } else {
                Toast.makeText(InspectionActivity.this, "Network Error!", Toast.LENGTH_SHORT).show();
                //hideDialog();
                return;
            }

            InspectionActivity.this.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    setSelectedTask(null);
                    saveCurrentJP("");
                    Globals.selectedUnit = null;
                    Globals.safetyBriefing = null;
                    Globals.selectedWorker = null;
                    Globals.selectedJPlan = null;
                    Globals.imageFileName = null;
                    Globals.defectCodeSelection = null;
                    Globals.newReport = null;
                    Globals.selectedDUnit = null;
                    isDayProcessRunning=false;
                    dayStarted = false;
                    //tvSessions.setVisibility(View.INVISIBLE);
                    //loadDayStatus(InspectionActivity.this);
                    //refreshSOD();
                    try {
                        hideDialog1();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    setResult(RESULT_OK);
                    finish();
                    //llIssuesContainer.setVisibility(GONE);
                }
            });
            //Closing Inspection End

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public void endSession() {
        //Globals.isStopSync = true;
        //String location = "";
/*
        if (getCurrentLocation().size() == 2) {
            location = getCurrentLocation().get(0) + "," + getCurrentLocation().get(1);
        }
*/
        String latitude = "";
        String longitude = "";
        String location;
        if(mCurrentLocation!=null){
            latitude = String.valueOf(mCurrentLocation.getLatitude());
            longitude = String.valueOf(mCurrentLocation.getLongitude());
        }
        boolean isServerAvailable=Globals.isServerAvailable();
        if(latitude.equals("")||longitude.equals("")){
            location="0.0" +","+"0.0";
        } else {
            location=latitude +","+longitude;
        }
        JourneyPlan jp=Globals.selectedJPlan;
        if(Globals.inbox != null){
            if(jp == null){
                jp =Globals.inbox.getCurrentJourneyPlan();
            }
            if(jp !=null){
                final int taskCount = jp.getTaskList().size();
                final int taskCompleted= jp.getCompletedTaskCount();
                if(blnEnforceTaskCompleteRule) {
                    if (taskCount != taskCompleted) {
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                Toast.makeText(InspectionActivity.this, getResources().getString(R.string.complete_all_tasks), Toast.LENGTH_SHORT).show();
                                return;
                            }
                        });
                        return;
                    }
                }
            }else
            {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Toast.makeText(InspectionActivity.this,getResources().getString(R.string.unable_to_find_work_plan),Toast.LENGTH_SHORT).show();
                        return;
                    }
                });
                return;

            }
        }


        String listName = Globals.JPLAN_LIST_NAME;
        JSONObject jo = new JSONObject();

        Date _date = new Date();
        ArrayList<StaticListItem> items=new ArrayList<>();
        for(Session session: jp.getIntervals().getSessions()){
            if(session.getStatus().equals(SESSION_STARTED)){
                session.setStatus(SESSION_STOPPED);
                session.setEndTime(_date.toString());
                session.setEndLocation(location);
                if(jp.getTaskList().get(0).getUserEndMp().equals("")){
                    session.setEnd(jp.getTaskList().get(0).getMpEnd());
                } else {
                    session.setEnd(jp.getTaskList().get(0).getUserEndMp());
                }
                makeVirtualSessions(session);
            }
        }
        jp.setEndDateTime(_date.toString());
        jp.setEndLocation(location);
        jp.setStatus(WORK_PLAN_FINISHED_STATUS);
        jp.reloadId();

        if(!offlineMode){
            try {
                jo=jp.getJsonObject();

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        //Adding logic to merge pending data
        DBHandler db = Globals.db;
        List<StaticListItem> pItems = db.getMsgListItems(listName, orgCode, "code='" + jp.getuId() + "' AND status=" + MESSAGE_STATUS_READY_TO_POST);
        if(pItems.size()>0){
            JSONObject pendingItem = null;
            try {
                pendingItem = new JSONObject(pItems.get(0).getOptParam1());
                jo = Utilities.addObject(pendingItem, jo);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        StaticListItem item = new StaticListItem(Globals.orgCode, listName
                , jp.getuId(), "", jo.toString(), "");
        items.add(item);

        isDayProcessRunning=true;
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    //showDialog(getResources().getString(R.string.work_plan),getResources().getString(R.string.finishing_inspection));
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
        Log.i("Message", "Crossing from Inspection finishing dialog");
        Log.i("End time before", jp.getEndDateTime());
        //db.AddOrUpdateMsgList(Globals.SOD_LIST_NAME, Globals.orgCode, item, Globals.MESSAGE_STATUS_READY_TO_POST);

        List<StaticListItem> xItems=db.getMsgListItems(orgCode,"status="
                + MESSAGE_STATUS_READY_TO_POST); //Ready to be posted
        Log.d("Dashboadact","Sixe:"+xItems.size());

        if(!Globals.offlineMode && webUploadMessageLists(InspectionActivity.this,orgCode,items)==1){
            List<StaticListItem> _items=null;
            if(webPullRequest(InspectionActivity.this,"")){
                inbox.loadSampleData(InspectionActivity.this);
                jp = inbox.getLastJourneyPlan();
                selectedJPlan = jp;
                if(pItems.size()>0){
                    db.RemoveMsgListItems(pItems,MESSAGE_STATUS_READY_TO_POST);
                }
                //Log.i("End time after", jp.getEndDateTime());
                if(jp !=null) {
                    //selectedJPlan=jp;
                    /*if (!jp.getEndDateTime().equals("")) {
                        //Day end successful
                        showToastOnUiThread(getResources().getString(R.string.inspection_closed));
                        isDayProcessRunning = false;
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                loadDayStatus(InspectionActivity.this);
                                refreshSOD();
                            }
                        });
                    }*/
                    if (!jp.getEndDateTime().equals("")) {
                        //Day end successful
                        showToastOnUiThread(getResources().getString(R.string.inspection_closed));
                        isDayProcessRunning = false;
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                loadDayStatus(InspectionActivity.this);
                                //refreshSOD();
                            }
                        });
                    }

                }
            }
        }else if(Globals.offlineMode){
            if(jp.getWorkplanTemplateId().equals("")){
                Log.i("WPLAN ID ", "ID is empty");
            }
            jp.update();
            if(jp.getWorkplanTemplateId().equals("")){
                Log.i("WPLAN ID ", "ID is empty");
            }
            jp.reloadId();
            String uid=jp.getuId();
            if(uid.equals("")){
                uid=jp.getPrivateKey();
            }
            Globals.saveCurrentJP(uid);
            inbox.loadSampleData(InspectionActivity.this);
            //Globals.loadInbox(InspectionActivity.this);
            Globals.loadDayStatus(InspectionActivity.this);
            //Log.i("WP Start:",Globals.selectedJPlan.getJsonObject().toString());
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    //refreshDashboard();
                    //refreshSOD();
                }
            });
            sleep(500);

        }

        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                setSelectedTask(null);
                saveCurrentJP("");
                Globals.selectedUnit = null;
                Globals.safetyBriefing = null;
                Globals.selectedWorker = null;
                Globals.selectedJPlan = null;
                Globals.imageFileName = null;
                Globals.defectCodeSelection = null;
                Globals.newReport = null;
                Globals.selectedDUnit = null;
                isDayProcessRunning=false;
                dayStarted = false;
                //refreshSOD();
                try {
                    hideDialog1();
                } catch (Exception e) {
                    e.printStackTrace();
                }
                setResult(RESULT_OK);
                finish();
                //llIssuesContainer.setVisibility(GONE);
            }
        });
    }
    private void sleep(long milis){
        try {
            Thread.sleep(milis);
        }catch (Exception e){

        }
    }
    private void showToastOnUiThread(final String message){
        InspectionActivity.this.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(InspectionActivity.this,message,Toast.LENGTH_SHORT).show();

            }
        });
    }
    void showDialog1(String title,String message){
        dialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
        dialog.setTitle(title);
        dialog.setMessage(message);
        dialog.setIndeterminate(true);
        dialog.setCanceledOnTouchOutside(false);
        dialog.show();
    }
    void hideDialog1(){
        if(dialog!=null){
            if(dialog.isShowing()){
                dialog.dismiss();
            }
        }
    }
    @Override
    public void onFinishStopDialog(String inputText) {
        if(inputText.equals(STOP_INSPECTION_RETURN_MSG_FOR_DASHBOARD)){
            showDialog1("Processing", "Please wait...");
            new Thread(this::endSession).start();
            //hideDialog();
            //setResult(RESULT_OK);
            //finish();
        }
    }
    public View showMessageOnTop(String message){
        LinearLayout parent = new LinearLayout(this);

        parent.setLayoutParams(new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        parent.setLayoutParams(params);
        parent.setOrientation(LinearLayout.HORIZONTAL);
        parent.setGravity(RelativeLayout.CENTER_HORIZONTAL);
        //((RelativeLayout.LayoutParams) parent.getLayoutParams()).addRule(RelativeLayout.ABOVE, R.id.sv_container);
        parent.setTag("message");
        parent.setBackgroundColor(getResources().getColor(R.color.mintColorAccent));
        parent.addView(createATextView(InspectionActivity.this,ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT, RelativeLayout.CENTER_HORIZONTAL,
                message, 14, 5, 3));
        return parent;
    }
    public void hideMessageOnTop(){
        LinearLayout layout = view.findViewWithTag("message");
        if(layout!=null){
            layout.setVisibility(GONE);
        }
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
                allSideTracksUnit.setStart(getSelectedTask().getMpStart());
                allSideTracksUnit.setEnd(getSelectedTask().getMpEnd());
                allSideTracksUnit.getAttributes().setPrimary(false);
                observeTracks.add(0, allSideTracksUnit);

            }
        }
    }
    private void setYardInspectionView(){
        sessionsExpandableListView.setVisibility(GONE);
        tvSessionTitle.setText("Status");
        tvSessionCount.setVisibility(GONE);
        tvSessionCountTitle.setVisibility(GONE);
        session_expand_indicator.setVisibility(GONE);

    }
    private void setListViewHeight(ExpandableListView expListView, int group) {

        ExpandableListAdapter listAdapter = expListView
                .getExpandableListAdapter();
        int marginTop=12;
        float marginTop_px = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, marginTop, getResources().getDisplayMetrics());
        //float wt_px = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, wt, getResources().getDisplayMetrics());
        int totalHeight = 0;
        int desiredWidth = View.MeasureSpec.makeMeasureSpec(expListView.getWidth(),
                View.MeasureSpec.UNSPECIFIED);
        for (int i = 0; i < listAdapter.getGroupCount(); i++) {
            View groupItem = listAdapter.getGroupView(i, false, null,
                    expListView);
            groupItem.measure(desiredWidth, View.MeasureSpec.UNSPECIFIED);

            totalHeight += groupItem.getMeasuredHeight();

            if (((expListView.isGroupExpanded(i)) && (i == group))
                    || ((!expListView.isGroupExpanded(i)) && (i == group))) {

                for (int j = 0; j < listAdapter.getChildrenCount(i); j++) {

                    View listItem = listAdapter.getChildView(i, j, j==listAdapter.getChildrenCount(i)-1, null,
                            expListView);

                    Log.e("Count", listAdapter.getChildrenCount(i) + "");

                    listItem.setLayoutParams(new ViewGroup.LayoutParams(
                            desiredWidth, View.MeasureSpec.UNSPECIFIED));
                    // listItem.measure(desiredWidth, MeasureSpec.UNSPECIFIED);
                    listItem.measure(View.MeasureSpec.makeMeasureSpec(0,
                            View.MeasureSpec.UNSPECIFIED), View.MeasureSpec
                            .makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED));
                    if(expListView.isGroupExpanded(group)) {
                        totalHeight += (listItem.getMeasuredHeight()+marginTop_px);
                    }
                    //System.out.println("totalHeight" + totalHeight);

                }
            }
        }

        ViewGroup.LayoutParams params = expListView.getLayoutParams();
        int height = totalHeight
                + (expListView.getDividerHeight() * (listAdapter
                .getGroupCount() - 1));

        if (height < 10) {
            height = 100;
        }
        params.height = height;
        expListView.setLayoutParams(params);
        expListView.requestLayout();

    }
    private void collapseGroupFreeze(int groupPosition){
        if(groupPosition ==-1){

            int count=inspectionExpandableListViewFreeze.getCount();
            for(int i=0;i<count ;i++){
                inspectionExpandableListViewFreeze.collapseGroup(i);
            }
            return;
        }
        inspectionExpandableListViewFreeze.collapseGroup(groupPosition);
    }
    private void collapseGroup(int groupPosition){
        if(groupPosition ==-1){

            int count=inspectionExpandableListView.getCount();
            for(int i=0;i<count ;i++){
                inspectionExpandableListView.collapseGroup(i);
            }
            return;
        }

        inspectionExpandableListView.collapseGroup(groupPosition);
    }

}