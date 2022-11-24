package com.app.ps19.tipsapp.inspection;

import android.app.Activity;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.ColorStateList;
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
import android.widget.ExpandableListView;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.PopupMenu;
import android.widget.ScrollView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.RecyclerView;

import com.app.ps19.tipsapp.AppFormActivity;
import com.app.ps19.tipsapp.AssetMapsActivity;
import com.app.ps19.tipsapp.R;
import com.app.ps19.tipsapp.ReportAddActivity;
import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.Shared.Utilities;
import com.app.ps19.tipsapp.UnitCordsAdjActivity;
import com.app.ps19.tipsapp.classes.DUnit;
import com.app.ps19.tipsapp.classes.JourneyPlanOpt;
import com.app.ps19.tipsapp.classes.LatLong;
import com.app.ps19.tipsapp.classes.Report;
import com.app.ps19.tipsapp.classes.Session;
import com.app.ps19.tipsapp.classes.Units;
import com.app.ps19.tipsapp.classes.UnitsTestOpt;
import com.app.ps19.tipsapp.classes.dynforms.AppFormDialogFragment;
import com.app.ps19.tipsapp.classes.maintenance.WorkOrderListFragment;
import com.app.ps19.tipsapp.defects.DefectsActivity;
import com.app.ps19.tipsapp.defects.PreviousDefectsMapActivity;
import com.app.ps19.tipsapp.location.Interface.OnLocationUpdatedListener;
import com.app.ps19.tipsapp.location.LocationUpdatesService;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.Iterator;
import java.util.UUID;

import static android.view.View.GONE;
import static android.view.View.VISIBLE;
import static com.app.ps19.tipsapp.Shared.Globals.SESSION_STARTED;
import static com.app.ps19.tipsapp.Shared.Globals.SESSION_STOPPED;
import static com.app.ps19.tipsapp.Shared.Globals.activeSession;
import static com.app.ps19.tipsapp.Shared.Globals.appName;
import static com.app.ps19.tipsapp.Shared.Globals.getSelectedTask;
import static com.app.ps19.tipsapp.Shared.Globals.inbox;
import static com.app.ps19.tipsapp.Shared.Globals.isMaintainer;
import static com.app.ps19.tipsapp.Shared.Globals.isMidNightInspClosingAllowed;
import static com.app.ps19.tipsapp.Shared.Globals.isShowTraverseCheckbox;
import static com.app.ps19.tipsapp.Shared.Globals.selectedDUnit;
import static com.app.ps19.tipsapp.Shared.Globals.selectedForm;
import static com.app.ps19.tipsapp.Shared.Globals.selectedJPlan;
import static com.app.ps19.tipsapp.Shared.Globals.selectedPostSign;
import static com.app.ps19.tipsapp.Shared.Globals.selectedUnit;
import static com.app.ps19.tipsapp.Shared.Globals.setSelectedUnit;
import static com.app.ps19.tipsapp.Shared.Utilities.elapsedCalculator;
import static com.app.ps19.tipsapp.Shared.Utilities.getFilteredNewIssues;
import static com.app.ps19.tipsapp.Shared.Utilities.isInRange;

//import static com.app.ps19.tipsapp.Shared.Globals.selectedTask;

public class InspectionActivity extends AppCompatActivity implements OnLocationUpdatedListener {
    public static final int ADD_DEFECT_ACTIVITY_REQUEST_CODE = 100;
    public static int MAP_SELECTION_REQUEST_CODE = 110;
    public static final String ASC_ORDER_MP_SORT_TEXT = "MP asc";
    public static final String DESC_ORDER_MP_SORT_TEXT = "MP desc";
    private SymbolsAdapter symbolsAdapter;
    private  RecyclerView rvSymbols;

    private SessionsAdapter sessionsAdapter;

    private ExpandableListView sessionsExpandableListView;
    private ScrollView svSessions;

    private ArrayList<Session> _sessionsList;
    int sessionCount = 0;
	int secCounter=0;
    private final int LAUNCH_APPFORM_ACTIVITY=1;
    private ExpandableListView inspectionExpandableListView;
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
    LinearLayout llTypeFilter;
    LinearLayout llRangeFilter;
    LinearLayout llSortFilter;
    //End

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
        LinearLayout ll_Inspection_Legends = (LinearLayout) findViewById(R.id.ll_Inspection_Legends);
        rvSymbols.setAdapter(symbolsAdapter);

        intiSessionDetails();
        setTitle(selectedJPlan.getTitle());
        ViewGroup view = (ViewGroup) findViewById(R.id.rl_inspection_sessions);

        TextView tvSessionCount = findViewById(R.id.tv_session_count);
        TextView tvSessionActionText = findViewById(R.id.tvBtnSS_ma);
        Button llSessionActionBtn = findViewById(R.id.btn_BtnSS_ma);
        LinearLayout ll_inspection_task = findViewById(R.id.ll_inspection_task);
        spAssetSort = findViewById(R.id.sp_sorting);
        spAssetType = findViewById(R.id.sp_asset_type);
        spRangeFilter = findViewById(R.id.sp_range_filter);
        imgClockIcon_ma = findViewById(R.id.imgClockIcon_ma);

        llTypeFilter = findViewById(R.id.ll_type_filter);
        llRangeFilter = findViewById(R.id.ll_range_filter);
        llSortFilter = findViewById(R.id.ll_sort_filter);

        llSessionActionBtn.setOnClickListener(v -> {
            AlphaAnimation buttonClick = new AlphaAnimation(1F, 0.1F);
            llSessionActionBtn.startAnimation(buttonClick);

            if (activeSession != null) {
                if (activeSession.getStatus().equals(SESSION_STARTED)) {
                    showEndMpDialog(this, view);
                } else if (activeSession.getStatus().equals(SESSION_STOPPED)) {
                    showStartMpDialog(this, view);
                }
            } else {
                showStartMpDialog(this, view);
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

                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {

                                    if (isSessionStarted()) {
                                        if (imgClockIcon_ma.getVisibility() == VISIBLE) {
                                            imgClockIcon_ma.setVisibility(View.INVISIBLE);
                                        } else {
                                            imgClockIcon_ma.setVisibility(VISIBLE);
                                        }
                                        updateSessionDetails(true);
                                    } else {
                                        if (imgClockIcon_ma.getVisibility() == View.INVISIBLE) {
                                            imgClockIcon_ma.setVisibility(VISIBLE);
                                        }

                                        tvMapMode.setVisibility(GONE);
                                        ll_assets_filter.setVisibility(GONE);
                                        inspection_expand_indicator.setVisibility(GONE);
                                        prevtimeStr = "--:--";
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


                            Thread.sleep(1000);
                        }
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            });
            threadScreenUpdate.start();
        }


        updateSessionDetails();

        sessionsAdapter = new SessionsAdapter(this);

        llSessionContainer = findViewById(R.id.ll_sessions_expandableList);

        LinearLayout ll_sessions = (LinearLayout) findViewById(R.id.ll_sessions);
        ImageView session_expand_indicator = (ImageView) findViewById(R.id.session_expand_indicator);

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
        inspectionExpandableListView = findViewById(R.id.inspectionExpandableListView);
        //inspectionExpandableListView.setGroupIndicator(null);
        setListHeight(inspectionExpandableListView, 2, true);
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
                Intent intent = new Intent(InspectionActivity.this, AssetMapsActivity.class);
                startActivityForResult(intent, MAP_SELECTION_REQUEST_CODE);
                tvMapMode.setText("");
            }
        });

        tvTaskForm.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //setSelectedUnit(unitOpt.getUnit());
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
            if(getSelectedTask().isYardInspection()){
                dUnitList = getSelectedTask().getUnitList(location.getLatLng());
            } else {
                dUnitList = getSelectedTask().getSortedUnitListWithinRange(location.getLatLng(), activeSession.getStart(), activeSession.getExpEnd());
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
        if(getSelectedTask().isYardInspection() || isMaintainer){
            llSessionContainer.setVisibility(GONE);
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
            ll_Inspection_Legends.setVisibility(View.GONE);
            maintenanceGroupExpand.callOnClick();
        }else{
            if(Globals.maintenanceList.getMaintenanceList().size()>0){
                ll_maintenance.setVisibility(View.VISIBLE);
            }else{
                ll_maintenance.setVisibility(View.GONE);
            }
        }
        if(appName.equals(Globals.AppName.SCIM)){
            llTypeFilter.setVisibility(GONE);
            llRangeFilter.setVisibility(GONE);
            llSessionContainer.setVisibility(GONE);
            tvTaskForm.setVisibility(GONE);
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
        if(getSelectedTask().isYardInspection()){
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
                    }
                } else {
                    if (unitTest.isInspected()) {
                        unitTest.setInspected(false);
                        itemsAdapter.notifyDataSetChanged();
                    }
                }
            }

        }
    }
    private void updateStopButtonBackground(Button llSessionActionBtn, TextView tvSessionActionText){
        if (isSessionStarted()) {
            llSessionActionBtn.setBackgroundColor(ContextCompat.getColor(this, R.color.color_stop_background));
            llSessionActionBtn.setText(getString(R.string.stop_new_theme));
            llSessionActionBtn.setTextColor(ContextCompat.getColor(this, R.color.credentials_white));
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
    public boolean onSupportNavigateUp() {
        //onBackPressed();
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
            dUnitList = getSelectedTask().getSortedUnitListWithinRange(location.getLatLng(), activeSession.getStart(), activeSession.getExpEnd());
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
            dUnitList = getSelectedTask().getSortedUnitListWithinRange(location.getLatLng(), activeSession.getStart(), activeSession.getExpEnd());
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
            dUnitList = getSelectedTask().getSortedUnitListWithinRange(location.getLatLng(), activeSession.getStart(), activeSession.getExpEnd());
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
        final ArrayList<DUnit> unitListOriginal;
        ImageView imgStartPlan;

        public  InspectionUnitsAdapter(ArrayList<DUnit> unitList ){
            this.unitList=new ArrayList<>();
            this.unitList.addAll(unitList);
            this.unitListOriginal=new ArrayList<>();
            this.unitListOriginal.addAll(unitList);

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

            final UnitsTestOpt unitTest= (UnitsTestOpt) getChild(groupPosition,childPosition);
            TextView textView=tv.findViewById(R.id.tvSecond);
            View view=tv.findViewById(R.id.viewSecond);
            CheckBox chkInspectionTest=tv.findViewById(R.id.chkInspectionTest);
            chkInspectionTest.setChecked(unitTest.isInspected());
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                view.setBackgroundTintList (ColorStateList.valueOf(unitTest.getColor()));
            }
            textView.setText(unitTest.getTitle());
            tv.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    DUnit selectedUnit=(DUnit)getGroup(groupPosition);
                    Globals.selectedUnit=selectedUnit.getUnit();
                    if(!selectedUnit.getUnit().getUnitId().equals(Globals.selectedUnit)){
                        Globals.selectedUnit=selectedUnit.getUnit();
                        Globals.selectedForm=Globals.selectedUnit.getUnitForm(unitTest.getTestCode());
                        if(selectedForm==null){
                            return;
                        }
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
            textView.setText(unitOpt.getUnit().getDescription());
            imgPopupMenu.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    PopupMenu popup=new PopupMenu(InspectionActivity.this,imgPopupMenu);
                    popup.getMenuInflater()
                            .inflate(R.menu.popup_inspection_unit,popup.getMenu());
                    if(unitOpt.isLinear()) {
                        popup.getMenu().getItem(0).setVisible(false);
                    }
                    popup.setOnMenuItemClickListener(new PopupMenu.OnMenuItemClickListener() {
                        @Override
                        public boolean onMenuItemClick(MenuItem item) {
                            switch (item.getItemId()) {
                                case R.id.mnuEditLocation:
                                    if (activeSession == null) {
                                        Toast.makeText(getApplicationContext(), getString(R.string.no_active_session), Toast.LENGTH_SHORT).show();
                                        }
                                        else {
                                        DUnit dUnit = (DUnit) getGroup(groupPosition);
                                        selectedUnit = dUnit.getUnit();
                                        selectedDUnit = dUnit;
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
                                    setSelectedUnit(unitOpt.getUnit());
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
                else if(!unitOpt.getUnit().getUnitId().equals(activeSession.getObserveTrack())){
                    showSwitchingSessionDialog(InspectionActivity.this, parent, unitOpt.getUnit(), "observe");
                }
            });
            imgTraverse.setOnClickListener(v -> {
                if(activeSession == null){
                    Toast.makeText(getApplicationContext(), getString(R.string.no_active_session), Toast.LENGTH_SHORT).show();
                }
                else if(!unitOpt.getUnit().getUnitId().equals(activeSession.getTraverseTrack())){
                    showSwitchingSessionDialog(InspectionActivity.this, parent, unitOpt.getUnit(),"traverse");
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


            View view=tv.findViewById(R.id.viewParent);
            ivUnitLocUpdate.setVisibility(GONE);
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
                if(!unitOpt.isLinear()) {
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
                    imgObserve.setAlpha((float) 0.2);
                    imgTraverse.setAlpha((float) 0.2);

                    if(activeSession!=null){
                        if(unitOpt.getUnit().getUnitId().equals(activeSession.getTraverseTrack())){
                            imgTraverse.setAlpha((float) 1.0);
                        }
                        if(unitOpt.getUnit().getUnitId().equals(activeSession.getObserveTrack())) {
                            imgObserve.setAlpha((float) 1.0);
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
            if(getSelectedTask().isYardInspection()){
                imgObserve.setVisibility(GONE);
                imgTraverse.setVisibility(GONE);
            }

           /* if(currUnit.getUnit().getAssetTypeObj().isMarkerMilepost()){
                imgObserve.setVisibility(GONE);
                imgTraverse.setVisibility(GONE);
            }*/

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
        if(this.inspectionExpandableListView!=null) {

            sessionsAdapter = new SessionsAdapter(this);
            sessionsExpandableListView.setAdapter(sessionsAdapter);

            this.itemsAdapter = new InspectionUnitsAdapter(dUnitList);// new ParentLevel(this.unitList);
            this.inspectionExpandableListView.setAdapter(this.itemsAdapter);
            
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
        if(this.inspectionExpandableListView!=null) {

            this.itemsAdapter = new InspectionUnitsAdapter(dUnitList);// new ParentLevel(this.unitList);
            this.inspectionExpandableListView.setAdapter(this.itemsAdapter);

            this.inspectionExpandableListView.setSelectedGroup(selectedGroupPosition);

        }
    }


    public void refresh(String areaType){
        if(this.inspectionExpandableListView!=null) {
            wpTemplateList = inbox.getJPLocationOpts().getJourneyPlanListByLocation(areaType);
            this.itemsAdapter = new InspectionUnitsAdapter(dUnitList);
            this.inspectionExpandableListView.setAdapter(this.itemsAdapter);

            refreshColorLegend();
        }
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
        ArrayList<Units> observeTracks = new ArrayList<>(allTracks);
        ArrayList<Units> traverseTracks = new ArrayList<>(allTracks);
        traverseAdapter = new ArrayAdapter<>(context, android.R.layout.simple_spinner_dropdown_item, traverseTracks);
        traverseAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spTraverseTracks.setAdapter(traverseAdapter);
        etSessionStartedAt.setText(activeSession.getStart());
        etSessionStartedAt.setEnabled(false);

        //tvSessionExpEnd.setText(activeSession.getExpEnd());
        etRunningSessionEndMp.setHint(activeSession.getExpEnd());
        etRunningSessionEndMp.requestFocus();

        if(activeSession.getTraverse()!=null){
            tvSessionTraverseTrack.setText(activeSession.getTraverse().getDescription());
        }
        if(activeSession.getObserve()!=null){
            tvSessionObserveTrack.setText(activeSession.getObserve().getDescription());
        }
        //removing the traverse track from observe track list
        //observeTracks.remove(spTracks.getSelectedItem());
        if(allTracks.size()>0){
            String lMsg = allTracks.get(0).getDescription() + getString(R.string.from_part1) + allTracks.get(0).getStart()+ getString(R.string.to_part2) + allTracks.get(0).getEnd();
            tvObserveTrackLimit.setText(lMsg);
            tvTraverseTrackLimit.setText(lMsg);
        }

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
                    spObserveTracks.setSelection(observeAdapter.getPosition(activeSession.getObserve()));
                }
                spTraverseTracks.setSelection(traverseAdapter.getPosition(uSelection));
            }
        } else if(selectedAssetRange.equals("All")) {

        }
        spTraverseTracks.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String lMsg = traverseTracks.get(position).getDescription() + getString(R.string.from_part1) + traverseTracks.get(position).getStart()+ getString(R.string.to_part2) + traverseTracks.get(position).getEnd();
                tvTraverseTrackLimit.setText(lMsg);
                //Toast.makeText(TaskDashboardActivity.this, tracks.get(position).getDescription(), Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });
        spObserveTracks.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String lMsg = observeTracks.get(position).getDescription() + getString(R.string.from_part1) + observeTracks.get(position).getStart()+ getString(R.string.to_part2) + observeTracks.get(position).getEnd();
                tvObserveTrackLimit.setText(lMsg);
                //Toast.makeText(TaskDashboardActivity.this, tracks.get(position).getDescription(), Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });
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
                        filterTracks(etStartMp,etExpEndMp,"SwitchingDialog",uSelection,mode);
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
                        filterTracks(etStartMp,etExpEndMp,"SwitchingDialog",uSelection,mode);
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
                            activeSession = null;
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
        tvLoc.setText(selectedJPlan.getTitle());
        tvEndRangeMsg.setText(Html.fromHtml(rangeMsg));
        etStartMp.setText(activeSession.getStart());
        etStartMp.setEnabled(false);
        etEndMp.setHint(activeSession.getExpEnd());
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
                            activeSession = null;
                            tvStartMP.setText("--");
                            tvEndMP.setText("--");
                            tvSessionStartDateTime.setText("--:--");

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
                            dialog.dismiss();
                            break;
                        }
                    }
                }
            }});
    }

    private void showStartMpDialog(final Context context, ViewGroup parent){
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
        final ArrayList<Units>observeTracks = new ArrayList<>(allTracks);
        final ArrayList<Units>traverseTracks = new ArrayList<>(allTracks);
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
        spTraverseTracks.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String lMsg = filteredTracks.get(position).getDescription() + getString(R.string.from_part1) + filteredTracks.get(position).getStart()+ getString(R.string.to_part2) + filteredTracks.get(position).getEnd();
                tvTraverseTrackLimit.setText(lMsg);
                //selectedTask.setTraverseTrack(traverseTracks.get(position).getUnitId());
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
                String lMsg = filteredTracks.get(position).getDescription() + getString(R.string.from_part1) + filteredTracks.get(position).getStart()+ getString(R.string.to_part2) + filteredTracks.get(position).getEnd();
                tvObserveTrackLimit.setText(lMsg);
                //selectedTask.setTraverseTrack(traverseTracks.get(position).getUnitId());
                //removeAndUpdateTrackList(observeTracks.get(position), "traverse");
                //Toast.makeText(TaskDashboardActivity.this, tracks.get(position).getDescription(), Toast.LENGTH_SHORT).show();
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
                        filterTracks(etStartMp,etExpEndMp,"", null, "");
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
                       filterTracks(etStartMp,etExpEndMp,"", null, "");
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
                    session.setObserveTrack(observe.getUnitId());
                    session.setObserveUnit(observe);
                }
            }
        } else {
            session.setTraverseTrack("");
            session.setObserveTrack("");
            session.setTraverseUnit(null);
            session.setObserveUnit(null);
        }
        setCurrentSession(session);
        Toast.makeText(context, context.getResources().getText(R.string.session_started_msg), Toast.LENGTH_LONG).show();
        selectedJPlan.getIntervals().getSessions().add(session);
        selectedJPlan.update();

        newSessionStarted = true;
    }
    private void filterTracks(EditText etStartMp,EditText etExpEndMp, String source, Units uSelected, String mode){

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
        filteredTracks = new ArrayList<>();
        filteredTracks = tracks;
        updateTrackList(source, uSelected, start, end, mode);
    }
    private void updateTrackList(String source, Units uSelected, double start, double end, String mode){
        traverseAdapter =
                new ArrayAdapter<Units>(InspectionActivity.this, android.R.layout.simple_spinner_dropdown_item, filteredTracks);
        traverseAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spTraverseTracks.setAdapter(traverseAdapter);

        observeAdapter =
                new ArrayAdapter<Units>(InspectionActivity.this, android.R.layout.simple_spinner_dropdown_item, filteredTracks);
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
                        }
                    }
                }
            }
        }
    }

    private boolean isSessionStarted(){
        for(Session session: selectedJPlan.getIntervals().getSessions()){
            if(session.getStatus().equals(SESSION_STARTED)){
                return true;
            }
        }
        return false;
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
                }
            }
        } else {
            _sessionsList = new ArrayList<>();
        }
    }

    private int getSessionsCount(){
        intiSessionDetails();
        return _sessionsList.size();
    }


    private void updateSessionDetails(boolean... isNewSession ) {
        boolean is_new_session = isNewSession.length >= 1;
        if (activeSession == null || !is_new_session) {
            tvSessionStartDateTime.setText("--:--");
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
            if (_track.getAssetType().equals("track")) {
                units.add(_track);
            }
        }
        return units;
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
            Comparator<DUnit> compareByStartMp = (DUnit o1, DUnit o2) -> o1.getUnit().getStart().compareTo( o2.getUnit().getStart() );
            Collections.sort(dUnitList, compareByStartMp);
        }
        if(selectedAssetSort.equals(DESC_ORDER_MP_SORT_TEXT)){
            Comparator<DUnit> compareByStartMp = (DUnit o1, DUnit o2) -> o2.getUnit().getStart().compareTo( o1.getUnit().getStart() );
            Collections.sort(dUnitList, compareByStartMp);
        }

    }
    private void setAssetAdapter(){
        ArrayList<DUnit> assets = new ArrayList<>(dUnitList);
        //refreshAssetListFromRangeFilter();
        performTypeFilter();
        sortAssets();
        if(assets.equals(dUnitList) && selectedAssetSort.equals("Auto")){

        } else {
            itemsAdapter = new InspectionUnitsAdapter(dUnitList);
            inspectionExpandableListView.setAdapter(itemsAdapter);
        }
    }
}