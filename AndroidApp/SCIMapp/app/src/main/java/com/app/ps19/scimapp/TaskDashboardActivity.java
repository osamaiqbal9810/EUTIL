package com.app.ps19.scimapp;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationManager;
import android.os.Build;
import android.os.IBinder;
import android.preference.PreferenceManager;

import com.app.ps19.scimapp.Shared.StartInspectionActivity;
import com.app.ps19.scimapp.classes.Session;
import com.google.android.material.textfield.TextInputLayout;
import androidx.core.app.ActivityCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.provider.Settings;
import android.text.Html;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.app.ps19.scimapp.Shared.GPSTrackerEx;
import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.Shared.LocationChangedInterface;
import com.app.ps19.scimapp.Shared.LocationUpdatesService;
import com.app.ps19.scimapp.Shared.StartInspectionFragment;
import com.app.ps19.scimapp.Shared.StopInspectionFragment;
import com.app.ps19.scimapp.Shared.Utilities;
import com.app.ps19.scimapp.Shared.Utils;
import com.app.ps19.scimapp.classes.Task;
import com.app.ps19.scimapp.classes.Units;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;
import java.util.UUID;

import static com.app.ps19.scimapp.Shared.Globals.SESSION_STARTED;
import static com.app.ps19.scimapp.Shared.Globals.SESSION_STOPPED;
import static com.app.ps19.scimapp.Shared.Globals.TASK_FINISHED_STATUS;
import static com.app.ps19.scimapp.Shared.Globals.TASK_IN_PROGRESS_STATUS;
import static com.app.ps19.scimapp.Shared.Globals.TASK_NOT_STARTED_STATUS;
import static com.app.ps19.scimapp.Shared.Globals.appName;
import static com.app.ps19.scimapp.Shared.Globals.getBlinkAnimation;
import static com.app.ps19.scimapp.Shared.Globals.initialInspection;
import static com.app.ps19.scimapp.Shared.Globals.initialRun;
import static com.app.ps19.scimapp.Shared.Globals.isBackOnTaskClose;
import static com.app.ps19.scimapp.Shared.Globals.isInspectionTypeReq;
import static com.app.ps19.scimapp.Shared.Globals.isMpReq;
import static com.app.ps19.scimapp.Shared.Globals.isBypassTaskView;
import static com.app.ps19.scimapp.Shared.Globals.isTraverseReq;
import static com.app.ps19.scimapp.Shared.Globals.isUseDefaultAsset;
import static com.app.ps19.scimapp.Shared.Globals.isWConditionReq;
import static com.app.ps19.scimapp.Shared.Globals.selectedJPlan;
import static com.app.ps19.scimapp.Shared.Globals.selectedTask;
import static com.app.ps19.scimapp.Shared.Globals.selectedUnit;
import static com.app.ps19.scimapp.Shared.Globals.setLocale;
import static com.app.ps19.scimapp.Shared.StartInspectionFragment.START_INSPECTION_RETURN_MSG;
import static com.app.ps19.scimapp.Shared.StopInspectionFragment.STOP_INSPECTION_RETURN_MSG;

public class TaskDashboardActivity extends AppCompatActivity implements LocationChangedInterface, SharedPreferences.OnSharedPreferenceChangeListener, StartInspectionFragment.StartDialogListener, StopInspectionFragment.StopDialogListener {
    private static final int REQUEST_CODE_PERMISSION = 2;
    private static final int ISSUE_ACTIVITY_REQUEST_CODE = 1;
    private static final int START_INSPECTION_ACTIVITY_REQUEST_CODE = 10;
    String mPermission = Manifest.permission.ACCESS_FINE_LOCATION;
    SimpleDateFormat TASK_VIEW_DATE_FORMAT_FULL = new SimpleDateFormat("EEE, d MMM yyyy hh:mm:ss aa");
    SimpleDateFormat TASK_VIEW_DATE_FORMAT = new SimpleDateFormat("EEE, d MMM yyyy", Locale.ENGLISH);
    SimpleDateFormat TASK_VIEW_TIME_FORMAT = new SimpleDateFormat("hh:mm aa", Locale.ENGLISH);
    SimpleDateFormat FULL_DATE_FORMAT = new SimpleDateFormat("EEE MMM dd HH:mm:ss zzzz yyyy", Locale.ENGLISH);


    public static final String TASK_BTN_START_TEXT = "START";
    public static final String TASK_BTN_FINISHED_TEXT = "FINISHED";
    public static final String TASK_BTN_END_TEXT = "END";

    public static final String TASK_START_TITLE = "Start";
    public static final String TASK_NOW_TITLE = "Now";
    public static final String TASK_END_TITLE = "End";

    public static final String TASK_VERIFICATION_TITLE = "Confirmation!";
    public static final String TASK_START_VERIFICATION_MSG = "Do you really want to Start Task?";
    public static final String TASK_END_VERIFICATION_MSG = "Do you really want to End Task?";
    public static final String TASK_PARALLEL_RUNNING_MSG = "Please Finish the other task first";
    public static final String GPS_UNAVAILABLE_MSG = "GPS Location unavailable !";

    boolean blnShowLocationAlert=false;

    boolean blnGpsImage=false;
    boolean blnClockImage=false;

    TextView tvTaskTitle,tvTaskDesc, tvTaskNotes;
    TextView tvTaskStartTime, tvTaskStartDate, tvTaskStartLoc;
    TextView tvIssueCount, tvImageCount;
    TextView tvElapsedLabel, tvElapsedText, tvElapsedText1;
    TextView tvTaskEndLoc;
    TextView tvSSBtnText;
    ImageView imgSSBtn;
    TextView tvCurrLocationText;
    ImageView imgGpsIcon ;
    ImageView imgClockIcon;

    TextView tvUserName;
    ImageView userImage;

    Button btnView ;
    LinearLayout llBtnSS;
    LinearLayout llTileElapsed, getLlTileElapsedSmall;
    LinearLayout llFinishedStatus;
    String latitude="", longitude="";
    Thread thread;
    int secCounter=0;
    int imageCount=0, issueCount=0;
    TextView tvTaskStatus;
    LinearLayout llFinished;

/*    TextView longTxt;
    TextView latTxt;
    TextView longNowTxt;
    TextView latNowTxt;
    TextView timeTxt;
    TextView titleTxt;
    TextView descTxt;
    TextView notesTxt;
    TextView elapsedTxt;
    TextView elapsedMinTxt;
    TextView timeNow;
    Button taskStartBtn;
    Button taskViewBtn;
    LinearLayout endTaskLayout;
    public Thread thread;
    public Thread gpsThread;
    ImageView userImage;
    TextView userNameView;
    TextView taskStatusTxt;
    */
    //TextView timeTxt;

    private Location cLocation;
    LocationManager locationManager;
    private static final String TAG = "resPMain";

    // Used in checking for runtime permissions.
    private static final int REQUEST_PERMISSIONS_REQUEST_CODE = 34;

    // The BroadcastReceiver used to listen from broadcasts from the service.
    private MyReceiver myReceiver;

    // A reference to the service used to get location updates.
    private LocationUpdatesService mService = null;

    // Tracks the bound state of the service.
    private boolean mBound = false;
    // Monitors the state of the connection to the service.
    private final ServiceConnection mServiceConnection = new ServiceConnection() {

        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            LocationUpdatesService.LocalBinder binder = (LocationUpdatesService.LocalBinder) service;
            mService = binder.getService();
            mBound = true;
            if(mService!=null){
                mService.requestLocationUpdates();
            }
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            mService = null;
            mBound = false;
        }
    };

    @Override
    public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, String key) {

    }

    @Override
    public void onFinishStartDialog(String inputText) {
        if(inputText.equals(START_INSPECTION_RETURN_MSG)){
            //startTask();
        }
        loadTaskDetails();
    }

    @Override
    public void onFinishStopDialog(String inputText) {
        if(inputText.equals(STOP_INSPECTION_RETURN_MSG)){
            taskCloseAction();
        }

    }
    /**
     * Returns the current state of the permissions needed.
     */
    private boolean checkPermissions() {
        return  PackageManager.PERMISSION_GRANTED == ActivityCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_FINE_LOCATION);
    }

    private void requestPermissions() {
        boolean shouldProvideRationale =
                ActivityCompat.shouldShowRequestPermissionRationale(this,
                        Manifest.permission.ACCESS_FINE_LOCATION);

        // Provide an additional rationale to the user. This would happen if the user denied the
        // request previously, but didn't check the "Don't ask again" checkbox.
        if (shouldProvideRationale) {
            Log.i(TAG, "Displaying permission rationale to provide additional context.");
            /*Snackbar.make(
                    findViewById(R.layout.activity_main),
                    R.string.permission_rationale,
                    Snackbar.LENGTH_INDEFINITE)
                    .setAction(R.string.ok, new View.OnClickListener() {
                        @Override
                        public void onClick(View view) {
                            // Request permission
                            ActivityCompat.requestPermissions(DashboardActivity.this,
                                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                                    REQUEST_PERMISSIONS_REQUEST_CODE);
                        }
                    })
                    .show();*/
        } else {
            Log.i(TAG, "Requesting permission");
            // Request permission. It's possible this can be auto answered if device policy
            // sets the permission in a given state or the user denied the permission
            // previously and checked "Never ask again".
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                    REQUEST_PERMISSIONS_REQUEST_CODE);
        }
    }

    /**
     * Receiver for broadcasts sent by {@link LocationUpdatesService}.
     */
    private class MyReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            Location mLocation = intent.getParcelableExtra(LocationUpdatesService.EXTRA_LOCATION);
            if (mLocation != null) {
                cLocation = mLocation;
                latitude = String.valueOf(mLocation.getLatitude());
                longitude = String.valueOf(mLocation.getLongitude());
                refreshLocation();
                /*Toast.makeText(TaskDashboardActivity.this, Utils.getLocationText(mLocation),
                        Toast.LENGTH_SHORT).show();*/
            }
        }
    }

    @Override
    public void onResume(){
        super.onResume();
        try {
            LocalBroadcastManager.getInstance(this).registerReceiver(myReceiver,
                    new IntentFilter(LocationUpdatesService.ACTION_BROADCAST));
        }catch (Exception e){
            e.printStackTrace();
        }
    }
    @Override
    protected void onDestroy(){
        super.onDestroy();
        if(thread !=null){
            if(thread.isAlive()){
                thread.interrupt();
            }
        }
        if (mBound) {
            // Unbind from the service. This signals to the service that this activity is no longer
            // in the foreground, and the service can respond by promoting itself to a foreground
            // service.
            unbindService(mServiceConnection);
            mBound = false;
        }
    }
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        switch(keyCode){
            case KeyEvent.KEYCODE_BACK:
                if (mBound) {
                    // Unbind from the service. This signals to the service that this activity is no longer
                    // in the foreground, and the service can respond by promoting itself to a foreground
                    // service.
                    unbindService(mServiceConnection);
                    mBound = false;
                }
                finish();
                return true;
        }
        return super.onKeyDown(keyCode, event);
    }
    @Override
    public void onPause() {
        super.onPause();
        try {
            LocalBroadcastManager.getInstance(this).unregisterReceiver(myReceiver);
            super.onPause();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @Override
    protected void onStop(){
        super.onStop();
        if (mBound) {
            // Unbind from the service. This signals to the service that this activity is no longer
            // in the foreground, and the service can respond by promoting itself to a foreground
            // service.
            unbindService(mServiceConnection);
            mBound = false;
        }
        PreferenceManager.getDefaultSharedPreferences(this)
                .unregisterOnSharedPreferenceChangeListener(this);
    }
    @Override
    protected void onStart(){
        super.onStart();
        /*if(gps == null){
            gps = new GPSTrackerEx(TaskDashboardActivity.this);
        }*/
        tryLocation();
        bindService(new Intent(TaskDashboardActivity.this, LocationUpdatesService.class), mServiceConnection,
                Context.BIND_AUTO_CREATE);
        PreferenceManager.getDefaultSharedPreferences(this)
                .registerOnSharedPreferenceChangeListener(this);
        if (!checkPermissions()) {
            requestPermissions();
        } else {
            if(mService!=null){
                mService.requestLocationUpdates();
            }
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //TODO: Taking too long to execute setContentView()
        this.requestWindowFeature(Window.FEATURE_NO_TITLE);
        requestWindowFeature(Window.FEATURE_INDETERMINATE_PROGRESS);
        requestWindowFeature(Window.FEATURE_PROGRESS);
        //-------------------GPS Code--------------
        myReceiver = new MyReceiver();
        if (Utils.requestingLocationUpdates(this)) {

        }
        //--------------------END-------------------

        //For not showing activity if configured so
        try {
            if(isBypassTaskView && selectedJPlan.getTaskList().size() == 1){
                if(!selectedTask.getStartTime().equals(""))
                    onViewAction();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        setLocale(this);
        //setContentView(R.layout.activity_task_dashboard);
        setContentView(R.layout.task_dashboard_new);
        setProgressBarIndeterminateVisibility(true);
        setProgressBarVisibility(true);

        tvTaskTitle = findViewById(R.id.tvTitle_tdb);
        tvTaskDesc = findViewById(R.id.tvDesc_tdb);
        tvTaskNotes = findViewById(R.id.tvNotes_tdb);

        tvTaskStartTime =findViewById(R.id.tvTaskTime_tdb);
        tvTaskStartDate = findViewById(R.id.tvTaskDate_tdb);
        tvTaskStartLoc = findViewById(R.id.tvSLocationDesc_tdb);
        tvIssueCount = findViewById(R.id.tvIssueCount_tdb);
        tvImageCount = findViewById(R.id.tvImageCount_tdb);

        tvElapsedLabel=findViewById(R.id.tvTimeElapsedLabel_tdb);
        tvElapsedText = findViewById(R.id.tvElapsed_tdb);
        tvElapsedText1 = findViewById(R.id.tvElapsed1_tdb);
        tvTaskEndLoc = findViewById(R.id.tvELocationDesc_tdb);
        tvTaskStatus = (TextView) findViewById(R.id.tv_task_status);
        llFinished = (LinearLayout) findViewById(R.id.ll_finished_task);
        llFinished.setVisibility(View.GONE);
        tvTaskStatus.setVisibility(View.GONE);

        tvSSBtnText = findViewById(R.id.tvBtnSS_tdb);
        imgSSBtn = findViewById(R.id.imgBtnSS_tdb);
        btnView = findViewById( R.id.btnView_tdb);
        btnView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(!Globals.selectedTask.getStartTime().equals("")) {
                    if(Globals.selectedUnit == null){
                        if(Globals.selectedTask.getWholeUnitList().size() == 0){
                            Toast.makeText(TaskDashboardActivity.this, getResources().getText(R.string.asset_available), Toast.LENGTH_SHORT).show();
                        } else{
                            if(defaultUnitSelection()){
                                Intent intent = new Intent(TaskDashboardActivity.this, IssuesActivity.class);//Intent intent = new Intent(TaskActivity.this, TaskDetailActivity.class);
                                startActivityForResult(intent, ISSUE_ACTIVITY_REQUEST_CODE);
                            } else {
                                Toast.makeText(TaskDashboardActivity.this,getResources().getText(R.string.asset_available), Toast.LENGTH_SHORT).show();
                            }
                        }
                    } else {
                        Intent intent = new Intent(TaskDashboardActivity.this, IssuesActivity.class);
                        startActivityForResult(intent, ISSUE_ACTIVITY_REQUEST_CODE);
                    }
                }else
                {
                    //GOTO RUNNING TASK OPTION
                    final Task task =Globals.selectedJPlan.getRunningTask();
                    if(task !=null){
                        Globals.selectedTask=task;
                        loadTaskDetails();
                    }
                }
            }
        });

        tvCurrLocationText=findViewById(R.id.tvCurrLocationText_tdb);
        imgGpsIcon=findViewById(R.id.imgGPSIcon_tdb);
        imgClockIcon=findViewById(R.id.imgClockIcon_tdb);
        tvUserName = findViewById(R.id.userNameTxt);
        userImage = findViewById(R.id.userImgView);
        llBtnSS = findViewById(R.id.ll_BtnSS_tdb);
        llBtnSS.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //"Please long press to activate"
                Toast.makeText(TaskDashboardActivity.this,getResources().getText(R.string.long_press_to_activate), Toast.LENGTH_SHORT).show();
            }
        });
        llBtnSS.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View view) {
                if(!isLocationAvailable()){
                    //"Please enable location to continue"
                    Toast.makeText(TaskDashboardActivity.this,getResources().getText(R.string.enable_location),Toast.LENGTH_SHORT).show();
                    //Snackbar.make(view, GPS_UNAVAILABLE_MSG, Snackbar.LENGTH_LONG)
                    //        .setAction("Action", null).show();
                    return true;
                }
                tryLocation();
                if(latitude == null || latitude.equals("")){
                    Toast.makeText(TaskDashboardActivity.this, R.string.getting_location_msg,Toast.LENGTH_SHORT).show();
                    try {
                        if(cLocation!= null)
                            refreshLocation();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                } else {
                    Task task=Globals.selectedTask;
                    if(task.getStatus().equals(Globals.TASK_NOT_STARTED_STATUS)
                            || task.getStatus().equals(TASK_IN_PROGRESS_STATUS)
                            || task.getStatus().equals("")){
                        showAlertDialog(task.getStatus());
                    }
                }
                return true;
            }
        });

        llFinishedStatus=findViewById(R.id.llFinishedStatus_tdb);
        llTileElapsed=findViewById(R.id.llTileElapsed_tdb);
        getLlTileElapsedSmall=findViewById(R.id.llTileElapsedSmall_tdb);
        Globals.setUserInfoView(TaskDashboardActivity.this,userImage, tvUserName);

//        final Task task=Globals.selectedTask;
        //       tvTaskTitle.setText(task.getTitle());
        //       tvTaskDesc.setText(task.getDescription());
        //       tvTaskNotes.setText(task.getNotes());
        /*if(gps == null){
            gps = new GPSTrackerEx(TaskDashboardActivity.this);
        }*/
        locationManager = (LocationManager) this.getSystemService(LOCATION_SERVICE);
        //locationManager.getAllProviders()
        if(locationManager.getAllProviders().contains(LocationManager.GPS_PROVIDER)){
            tryLocation();
        } else {
            showSettingsAlert();
        }
        startThread();
        loadTaskDetails();


    }
    private void startTask(boolean isCopyValues, String expEnd){
        Date now = new Date();
        String selTaskId = Globals.selectedTask.getTaskId();
        for (Task task: Globals.selectedJPlan.getTaskList()){
            if(task.getTaskId().equals(selTaskId)){
                Session session = new Session();
                task.setStatus(TASK_IN_PROGRESS_STATUS);
                task.setStartTime(now.toString());
                Globals.isTaskStarted = true;
                if(latitude.equals("") || longitude.equals("")){
                    task.setStartLocation("0.0" + "," + "0.0");
                    session.setStartLocation("0.0" + "," + "0.0");
                } else {
                    task.setStartLocation(latitude + "," + longitude);
                    session.setStartLocation(latitude + "," + longitude);
                }

                if(isCopyValues){
                    if(initialRun!=null){
                        if(initialRun.getInspectionType().equals("")){
                            task.setInspectionType("Required Inspection");
                            task.setInspectionTypeTag("required");
                        } else {
                            task.setInspectionType(initialRun.getInspectionType());
                            task.setInspectionTypeTag(initialRun.getInspectionTypeTag());
                        }
                        task.setInspectionTypeDescription(initialRun.getInspectionTypeDescription());
                        task.setWeatherConditions(initialRun.getWeatherConditions());
                        task.setTraverseBy(initialRun.getTraverseBy());
                        task.setUserStartMp(initialRun.getUserStartMp());
                        task.setLocationUnit(initialRun.getLocationUnit());
                        task.setTemperatureUnit(initialRun.getTemperatureUnit());
                        task.setTraverseTrack(initialRun.getTraverseTrack());
                        task.setTemperature(initialRun.getTemperature());
                        task.setYardInspection(initialRun.isYardInspection());
                        UUID uuid = UUID.randomUUID();
                        session.setId(uuid.toString());
                        session.setStatus(SESSION_STARTED);
                        session.setStartTime(now.toString());
                        session.setStart(initialRun.getUserStartMp());
                        //in case if expected end is unavailable
                        if(expEnd.equals("")){
                            session.setExpEnd(task.getMpEnd());
                            session.setEnd(task.getMpEnd());
                        } else {
                            session.setExpEnd(expEnd);
                            session.setEnd(expEnd);
                        }
                        selectedJPlan.getIntervals().getSessions().add(session);
                    }
                }
            }}
        //SimpleDateFormat _format = new SimpleDateFormat("hh:mm:ss aa");
       /* Globals.selectedTask.setStatus(TASK_IN_PROGRESS_STATUS);
        Globals.selectedTask.setStartTime(now.toString());
        Globals.isTaskStarted = true;
        Globals.selectedTask.setStartLocation(latitude + "," + longitude);*/

        if(Globals.selectedUnit == null){
            if(Globals.selectedTask.getWholeUnitList().size() == 0){
                Toast.makeText(TaskDashboardActivity.this,getResources().getText(R.string.asset_available), Toast.LENGTH_SHORT).show();
            } else{
                if(defaultUnitSelection()){
                    Intent intent = new Intent(TaskDashboardActivity.this, IssuesActivity.class);//Intent intent = new Intent(TaskActivity.this, TaskDetailActivity.class);
                    Globals.selectedJPlan.update();
                    loadTaskDetails();
                    startActivityForResult(intent, ISSUE_ACTIVITY_REQUEST_CODE);
                } else{
                    Toast.makeText(TaskDashboardActivity.this,getResources().getText(R.string.asset_available), Toast.LENGTH_SHORT).show();
                }
            }
        } else {
            Intent intent = new Intent(TaskDashboardActivity.this, IssuesActivity.class);//Intent intent = new Intent(TaskActivity.this, TaskDetailActivity.class);
            Globals.selectedJPlan.update();
            loadTaskDetails();
            startActivityForResult(intent, ISSUE_ACTIVITY_REQUEST_CODE);
        }

    }
    private boolean closeTask(){
        Date now = new Date();
        if(Globals.selectedTask.getStartTime().equals("")){
            return false;
        }
        String selTaskId = Globals.selectedTask.getTaskId();

        for (Task task: Globals.selectedJPlan.getTaskList()){
            if(task.getTaskId().equals(selTaskId)){
                if(latitude.equals("")||longitude.equals("")){
                    task.setEndLocation("0.0" + "," + "0.0");
                } else {
                    task.setEndLocation(latitude + "," + longitude);
                }

                task.setStatus(TASK_FINISHED_STATUS);
                Globals.isTaskStarted = false;
                task.setEndTime(now.toString());
                //In case of yard inspection
                task.setUserEndMp(task.getMpEnd());
            }}
        /*Globals.selectedTask.setEndLocation(latitude + "," + longitude);
        Globals.selectedTask.setStatus(TASK_FINISHED_STATUS);
        Globals.isTaskStarted = false;
        Globals.selectedTask.setEndTime(now.toString());*/
        for(Session session: selectedJPlan.getIntervals().getSessions()){
            if(session.getStatus().equals(SESSION_STARTED)){
                session.setStatus(SESSION_STOPPED);
                session.setEndTime(now.toString());
                if(latitude.equals("")||longitude.equals("")){
                    session.setEndLocation("0.0" + "," + "0.0");
                } else {
                    session.setEndLocation(latitude + "," + longitude);
                }
                session.setEnd(selectedTask.getUserEndMp());
            }
        }
        Globals.selectedJPlan.update();
        loadTaskDetails();
        return  true;
    }
    private void showAlertDialog(final String taskStatus){
        final Context context=TaskDashboardActivity.this;
        AlertDialog.Builder builder;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            builder = new AlertDialog.Builder(context);
        } else {
            builder = new AlertDialog.Builder(context);
        }
        String title="",message="";
        switch (taskStatus){
            case "":
            case Globals.TASK_NOT_STARTED_STATUS:
                title=getString(R.string.want_to_start_task_title);//TASK_START_VERIFICATION_MSG;
                message=getString(R.string.want_to_start_task);//TASK_START_VERIFICATION_MSG;
                break;
            case TASK_IN_PROGRESS_STATUS:
                title=getString(R.string.want_to_end_task_title);
                message=getString(R.string.want_to_end_task);
                break;
        }
        builder.setTitle(title)
                .setMessage(message)
                .setPositiveButton(R.string.btn_ok, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        // continue with start
                        if(taskStatus.equals(TASK_NOT_STARTED_STATUS)
                                || taskStatus.equals("")){
                            if(isMpReq||isTraverseReq||isWConditionReq||isInspectionTypeReq){
                                //startMpDialog(0);
                                isStartDialog();
                            } else {
                                startTask(false, "");
                            }
                        }else
                        {
                            if(isMpReq && !selectedTask.isYardInspection()){
                                isStopDialog();
                                //endMpDialog();
                            } else {
                                closeTask();
                                Toast.makeText(TaskDashboardActivity.this,
                                        getResources().getText(R.string.task_closed),Toast.LENGTH_SHORT).show();
                                if(isBackOnTaskClose){
                                    taskCloseAction();
                                }
                            }

                        }

                    }
                })
                .setNegativeButton(R.string.btn_cancel, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        // do nothing
                    }
                })
                .setIcon(android.R.drawable.ic_dialog_alert)
                .show();
    }
    private void loadTaskDetails(){
        final Task task=Globals.selectedTask;
        tvTaskTitle.setText(task.getTitle());
        tvTaskDesc.setText(task.getDescription());
        tvTaskNotes.setText(task.getNotes());
        setTaskView(task.getStatus());

    }
    public void setTaskView(String status) {

        switch (status) {
            case "":
            case TASK_NOT_STARTED_STATUS:
                setInitTaskView();
                break;
            case TASK_IN_PROGRESS_STATUS:
                setInProgressTaskView();
                break;
            case TASK_FINISHED_STATUS:
                setFinishedTaskView();
                break;
        }
    }
    public void setInitTaskView() {
        Date _date = new Date();
        String taskDate = TASK_VIEW_DATE_FORMAT.format(_date);
        Task task=Globals.selectedJPlan.getRunningTask();
        llFinished.setVisibility(View.GONE);
        tvTaskStatus.setVisibility(View.GONE);
        if(task !=null){
            if(!task.equals(Globals.selectedTask)){
                btnView.setText(getResources().getText(R.string.view_running_task));
                btnView.setVisibility(View.VISIBLE);
                llBtnSS.setVisibility(View.GONE);

            }else{
                btnView.setVisibility(View.GONE);
                llBtnSS.setVisibility(View.VISIBLE);
                llBtnSS.setBackgroundColor(getResources().getColor(R.color.color_db_green_dark));
                imgSSBtn.setBackgroundResource(R.drawable.play_btn);

            }
        }else{
            llBtnSS.setVisibility(View.VISIBLE);
            llBtnSS.setBackgroundColor(getResources().getColor(R.color.color_db_green_dark));
            imgSSBtn.setBackgroundResource(R.drawable.play_btn);
            btnView.setVisibility(View.GONE);

        }
        //btnView.setVisibility(View.GONE);
        //llBtnSS.setVisibility(View.VISIBLE);
        //llBtnSS.setBackgroundColor(getResources().getColor(R.color.color_db_green_dark));
        //imgSSBtn.setBackgroundResource(R.drawable.play_btn);
        llFinishedStatus.setVisibility(View.GONE);
        tvTaskStartTime.setText(getResources().getText(R.string.task_not_started_status));
        tvTaskStartDate.setText(taskDate);
        tvTaskStartLoc.setText("_");
        tvIssueCount.setText("_");
        tvImageCount.setText("_");
        tvElapsedLabel.setText(getResources().getText(R.string.time_elapsed));
        tvElapsedText.setText("__");
        tvElapsedText1.setText("__");
        llTileElapsed.setBackgroundColor(getResources().getColor(R.color.color_tile_disabled));
        getLlTileElapsedSmall.setBackgroundColor(getResources().getColor(R.color.color_tile_disabled_dark));
        tvSSBtnText.setText(getResources().getText(R.string.start_new_theme));

    }

    public void setInProgressTaskView() {
        Date _date = new Date();
        String taskDate = TASK_VIEW_DATE_FORMAT.format(_date);
        Task task =Globals.selectedTask;
        tvTaskStatus.setVisibility(View.GONE);
        btnView.setVisibility(View.VISIBLE);
        btnView.setText(getResources().getText(R.string.view));
        llFinishedStatus.setVisibility(View.GONE);
        llBtnSS.setVisibility(View.VISIBLE);
        llBtnSS.setBackgroundColor(getResources().getColor(R.color.color_db_stop));
        imgSSBtn.setBackgroundResource(R.drawable.stop_btn);

        try {
            tvTaskStartTime.setText(TASK_VIEW_TIME_FORMAT.format(FULL_DATE_FORMAT.parse(task.getStartTime())));//new Date(task.getStartTime())));
            tvTaskStartDate.setText(TASK_VIEW_DATE_FORMAT.format(FULL_DATE_FORMAT.parse(task.getStartTime())));//new Date(task.getStartTime())));
        } catch (ParseException e) {
            e.printStackTrace();
        }

        //tvTaskStartTime.setText(TASK_VIEW_TIME_FORMAT.format(new Date(task.getStartTime())));
        //tvTaskStartDate.setText(TASK_VIEW_DATE_FORMAT.format(new Date(task.getStartTime())));
        setLocation(tvTaskStartLoc,TaskDashboardActivity.this, task.getStartLocation());
        //tvTaskStartLoc.setText(getLocationDescription(task.getStartLocation()));
        tvIssueCount.setText(String.valueOf(task.getReportList().size()));
        tvImageCount.setText(String.valueOf(task.getImageList().size()));
        refreshCounts();
        refreshTimeElapsed();

        llTileElapsed.setBackgroundColor(getResources().getColor(R.color.color_organge_light));
        getLlTileElapsedSmall.setBackgroundColor(getResources().getColor(R.color.color_db_orange_dark));
        tvSSBtnText.setText(getResources().getText(R.string.stop_new_theme));

    }

    private void refreshTimeElapsed(){
        Task task =Globals.selectedTask;
        ArrayList<Integer> items=getElapsedTime(task.getStartTime());
        String days=formatElapsedTime(0,items);
        String hours=formatElapsedTime(1,items);
        String mins=formatElapsedTime(2,items);
        String item1=(days.equals("")?"":(days + " "))+ hours;
        tvElapsedLabel.setText(getResources().getText(R.string.time_elapsed));
        tvElapsedText.setText(item1);
        tvElapsedText1.setText(mins);
    }
    private void refreshCounts(){
        Task task =Globals.selectedTask;
        int _issueCount=task.getReportList().size();
        int _imageCount=task.getImageList().size();
        if(_issueCount !=issueCount || _imageCount !=imageCount) {
            tvIssueCount.setText(String.valueOf(task.getReportList().size()));
            tvImageCount.setText(String.valueOf(task.getImageList().size()));
            imageCount=_imageCount;
            issueCount=_issueCount;
        }
    }
    public void setFinishedTaskView() {
        Date _date = new Date();
        String taskDate = TASK_VIEW_DATE_FORMAT.format(_date);
        Task task =Globals.selectedTask;
        tvTaskStatus.setVisibility(View.VISIBLE);
        llFinished.setVisibility(View.VISIBLE);
        llFinished.setAnimation(getBlinkAnimation());
        //tvTaskStatus.startAnimation(getBlinkAnimation());
        btnView.setVisibility(View.VISIBLE);
        btnView.setText(getResources().getText(R.string.view));
        //llBtnSS.setBackgroundColor(getResources().getColor(R.color.color_db_stop));
        llBtnSS.setVisibility(View.GONE);
        //llFinishedStatus.setVisibility(View.VISIBLE);
        imgClockIcon.setVisibility(View.INVISIBLE);
        //imgSSBtn.setBackgroundResource(R.drawable.stop_btn);

        try {
            tvTaskStartTime.setText(TASK_VIEW_TIME_FORMAT.format(FULL_DATE_FORMAT.parse(task.getStartTime())));//new Date(task.getStartTime())));
            tvTaskStartDate.setText(TASK_VIEW_DATE_FORMAT.format(FULL_DATE_FORMAT.parse(task.getStartTime())));//new Date(task.getStartTime())));
        } catch (ParseException e) {
            e.printStackTrace();
        }


        // tvTaskStartTime.setText(TASK_VIEW_TIME_FORMAT.format(new Date(task.getStartTime())));
        // tvTaskStartDate.setText(TASK_VIEW_DATE_FORMAT.format(new Date(task.getStartTime())));
        setLocation(tvTaskStartLoc, TaskDashboardActivity.this, task.getStartLocation());
        //tvTaskStartLoc.setText(getLocationDescription(task.getStartLocation()));
        tvIssueCount.setText(String.valueOf(task.getReportList().size()));
        tvImageCount.setText(String.valueOf(task.getImageList().size()));
        refreshCounts();
        ArrayList<Integer> items= null;
        try {
            items = getElapsedTime(FULL_DATE_FORMAT.parse(task.getStartTime()), FULL_DATE_FORMAT.parse(task.getEndTime()));
        } catch (ParseException e) {
            e.printStackTrace();
        }

        String days=formatElapsedTime(0,items);
        String hours=formatElapsedTime(1,items);
        String mins=formatElapsedTime(2,items);
        String item1=(days.equals("")?"":(days + " "))+ hours;
        tvElapsedText.setText(item1);
        tvElapsedText1.setText(mins);
        tvElapsedLabel.setText(getResources().getText(R.string.time_total));
        llTileElapsed.setBackgroundColor(getResources().getColor(R.color.color_organge_light));
        getLlTileElapsedSmall.setBackgroundColor(getResources().getColor(R.color.color_db_orange_dark));
        //tvTaskEndLoc.setText(getLocationDescription(task.getEndLocation()));
        setLocation(tvTaskEndLoc, TaskDashboardActivity.this, task.getEndLocation());
        //tvSSBtnText.setText("STOP");

    }
    private boolean isLocationAvailable(){
        if(!latitude.equals("") && !longitude.equals("")){
            return true;
        }
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if(Utilities.isGPSEnabled(TaskDashboardActivity.this)){
                    tryLocation();
                }
            }
        });
        return (!latitude.equals("") && !longitude.equals(""));
    }
    public void startThread() {

        thread = new Thread() {

            @Override
            public void run() {
                try {
                    while (!thread.isInterrupted()) {
                        Thread.sleep(1000);
                        if(!isLocationAvailable()){
                            toggleGpsIcon();
                        }else if(blnGpsImage){
                            toggleGpsIcon();
                        }
                        if(Globals.selectedTask!=null){
                            if(Globals.selectedTask.getStatus().equals(TASK_IN_PROGRESS_STATUS)){
                                blnClockImage=!blnClockImage;
                                TaskDashboardActivity.this.runOnUiThread(new Runnable() {
                                    @Override
                                    public void run() {
                                        if(blnClockImage){
                                            imgClockIcon.setVisibility(View.VISIBLE);
                                        }else
                                        {
                                            imgClockIcon.setVisibility(View.INVISIBLE);
                                        }
                                        refreshCounts();
                                    }
                                });
                            }
                        }

                        secCounter++;
                        if(secCounter>59){
                            secCounter=1;
                            //Time Elapsed Refresh
                            if(Globals.selectedTask!=null){
                                if(Globals.selectedTask.getStatus().equals(TASK_IN_PROGRESS_STATUS)){
                                    TaskDashboardActivity.this.runOnUiThread(new Runnable() {
                                        @Override
                                        public void run() {
                                            refreshTimeElapsed();
                                        }
                                    });
                                }
                            }

                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        };
        //TaskTimer task = new TaskTimer(myRunnable);
        //task.execute((Void) null);
        thread.start();
    }
    private void toggleGpsIcon(){
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if(blnGpsImage){
                    imgGpsIcon.setBackgroundResource(R.drawable.ic_location_on_black_24dp);
                }else
                {
                    imgGpsIcon.setBackgroundResource(R.drawable.ic_location_off_black_24dp);
                }
                blnGpsImage=!blnGpsImage;
            }
        });
    }
    public void endThread() {

        if (thread != null) {
            thread.isInterrupted();
        }
    }

    public ArrayList<String> getCurrentLocation() {
        double latitude;
        double longitude;
        ArrayList<String> loc = new ArrayList<>();
        // create class object
        try {
            if (ActivityCompat.checkSelfPermission(this, mPermission)
                    != PackageManager.PERMISSION_GRANTED) {

                ActivityCompat.requestPermissions(this, new String[]{mPermission},
                        REQUEST_CODE_PERMISSION);

                // If any permission above not allowed by user, this condition will
                //execute every time, else your else part will work
            } else if(!locationManager.getAllProviders().contains(LocationManager.GPS_PROVIDER)){
                showSettingsAlert();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
       /* if(gps.canGetLocation()){
            gps.getLocation();
        }*/
        // check if GPS enabled
        if (Utilities.canGetLocation(TaskDashboardActivity.this)) {
            if(cLocation!=null){
                latitude = cLocation.getLatitude();
                longitude = cLocation.getLongitude();

                loc.add(String.valueOf(latitude));
                loc.add(String.valueOf(longitude));
            } else {
                if(Globals.lastKnownLocation!=null){
                    latitude = Globals.lastKnownLocation.getLatitude();
                    longitude = Globals.lastKnownLocation.getLongitude();

                    loc.add(String.valueOf(latitude));
                    loc.add(String.valueOf(longitude));
                }

            }
            return loc;
        } else {
            // can't get location
            // GPS or Network is not enabled
            // Ask user to enable GPS/network in settings
            if(blnShowLocationAlert) {
                if (!isGpsPermissionAvailable()) {
                    requestPermission(this, mPermission, REQUEST_CODE_PERMISSION);
                } else {
                    // gps.showSettingsAlert();
                }
            }
            return loc;
        }

    }
    public boolean isGpsPermissionAvailable(){
        try {
            if (ActivityCompat.checkSelfPermission(this, mPermission)
                    != PackageManager.PERMISSION_GRANTED) {

                /*ActivityCompat.requestPermissions(this, new String[]{mPermission},
                        REQUEST_CODE_PERMISSION);*/

                // If any permission above not allowed by user, this condition will
                //execute every time, else your else part will work
                return false;
            } else {
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return  false;
    }
    public void requestPermission(Context context, String reqPermission, int permissionCode){
        ActivityCompat.requestPermissions((Activity) context, new String[]{reqPermission},
                permissionCode);

    }
    public void onRequestPermissionsResult(int requestCode, String permissions[], int[] grantResults) {
        switch (requestCode) {
            case REQUEST_CODE_PERMISSION: {
                // If request is cancelled, the result arrays are empty.
                if (grantResults.length > 0
                        && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    ArrayList<String> loc = getCurrentLocation();
                    if(loc.size()>0){
                        latitude=loc.get(0);
                        longitude=loc.get(1);
                    }

                } else {
                    // permission denied, boo! Disable the
                    // functionality that depends on this permission.
                    latitude="";
                    longitude="";
                }
                refreshLocation();
                return;
            }
            // other 'case' lines to check for other
            // permissions this app might request
        }
    }
    private void tryLocation(){
        ArrayList<String> loc =getCurrentLocation();
        longitude="";
        longitude ="";
        if(loc.size()>0){
            latitude=loc.get(0);
            longitude=loc.get(1);
            //gps.stopUsingGPS();
        }
        refreshLocation();
    }
    private void refreshLocation(){
        Location _loc = null;
        if(Utilities.canGetLocation(TaskDashboardActivity.this)){
            if(cLocation!=null){
                _loc = cLocation;
            } else if(Globals.lastKnownLocation!=null){
                _loc =  Globals.lastKnownLocation;
            }
            if(_loc != null){
                latitude = String.valueOf(_loc.getLatitude());
                longitude = String.valueOf(_loc.getLongitude());
                /*String locationString=longitude +","+latitude;
                String locationDesc= getLocationDescription();*/
                setLocation(tvCurrLocationText, TaskDashboardActivity.this, latitude,longitude);
                imgGpsIcon.setBackgroundResource(R.drawable.ic_location_on_black_24dp);
                /*if(locationDesc.equals("")){
                    tvCurrLocationText.setText(locationString);
                }else{
                    tvCurrLocationText.setText(locationDesc);
                }*/
            }

        } else {
            imgGpsIcon.setBackgroundResource(R.drawable.ic_gps_off_white_24dp);
            tvCurrLocationText.setText(getString(R.string.enable_location));
        }
       /* String locationString=longitude +","+latitude;
        if(latitude.equals("") && longitude.equals("")){
            if(gps!=null){
                if(gps.getLastKnownLocation()!=null){
                    Location _loc = gps.getLastKnownLocation();
                    latitude = String.valueOf(_loc.getLatitude());
                    longitude = String.valueOf(_loc.getLongitude());
                    String locationDesc= getLocationDescription();
                    imgGpsIcon.setBackgroundResource(R.drawable.ic_location_on_white_24dp);
                    if(locationDesc.equals("")){
                        tvCurrLocationText.setText(locationString);
                    }else{
                        tvCurrLocationText.setText(locationDesc);
                    }
                } else {
                    if(Globals.lastKnownLocation != null){
                        Location _loc = Globals.lastKnownLocation;
                        latitude = String.valueOf(_loc.getLatitude());
                        longitude = String.valueOf(_loc.getLongitude());
                        String locationDesc= getLocationDescription();
                        imgGpsIcon.setBackgroundResource(R.drawable.ic_location_on_white_24dp);
                        if(locationDesc.equals("")){
                            tvCurrLocationText.setText(locationString);
                        }else{
                            tvCurrLocationText.setText(locationDesc);
                        }
                    }
                }
            }
        } else if(!longitude.equals("") && !latitude.equals("")){
            String locationDesc= getLocationDescription();
            imgGpsIcon.setBackgroundResource(R.drawable.ic_location_on_white_24dp);
            if(locationDesc.equals("")){
                tvCurrLocationText.setText(locationString);
            }else{
                tvCurrLocationText.setText(locationDesc);
            }
        }else
        {
            imgGpsIcon.setBackgroundResource(R.drawable.ic_gps_off_white_24dp);
            tvCurrLocationText.setText(getString(R.string.enable_location));
        }*/
    }
    private String getLocationDescription(){
        try {
            Geocoder myLocation = new Geocoder(Globals.mainActivity, Locale.getDefault());
            List<Address> myList = myLocation.getFromLocation(Double.parseDouble(latitude), Double.parseDouble(longitude), 1);
            Address address = (Address) myList.get(0);
            String addressStr = "";
            //addressStr += address.getPremises();
            addressStr += (address.getAddressLine(0)!=null?(address.getAddressLine(0) + ""):"");
            //addressStr += address.getAddressLine(1) + ", ";
            //addressStr += address.getAddressLine(2);
            return addressStr;
        }catch (Exception e){
            e.printStackTrace();
        }
        return  "";
    }
    private String getLocationDescription(String location){
        String [] loc=Utilities.split(location,",");
        String latitude="", longitude="";
        assert loc != null;
        if(loc.length==2){
            Log.println(Log.INFO,"Info", Arrays.toString(loc));
            latitude=loc[0];
            longitude=loc[1];
        }else
        {
            return "";
        }
        if(!latitude.equals("null") && !longitude.equals("null")){
            try {
                Geocoder myLocation = new Geocoder(Globals.mainActivity, Locale.getDefault());
                List<Address> myList = myLocation.getFromLocation(Double.parseDouble(latitude), Double.parseDouble(longitude), 1);
                Address address = (Address) myList.get(0);
                String addressStr = "";
                //addressStr += address.getPremises();
                addressStr += (address.getAddressLine(0)!=null?(address.getAddressLine(0) + ""):"");
                //addressStr += address.getAddressLine(1) + ", ";
                //addressStr += address.getAddressLine(2);
                if(addressStr.equals("")){
                    addressStr=latitude +","+longitude;
                }
                return addressStr;
            }catch (Exception e){
                e.printStackTrace();
            }
        } else {
            return "";
        }

        return  "";
    }
    public ArrayList<Integer> getElapsedTime(String startTime) {
        ArrayList<Integer> returnValue=null;
        try{
            returnValue=getElapsedTime(FULL_DATE_FORMAT.parse(startTime), new Date());
        }catch (Exception e){
            e.printStackTrace();
        }
        return returnValue;
    }
    public ArrayList<Integer> getElapsedTime(Date startTime, Date endTime) {
        String diff = "";
        ArrayList<Integer> items=new ArrayList<>();
        try {
            //SimpleDateFormat _format = new SimpleDateFormat("hh:mm:ss aa");
            //timeNow.setText(_format.format(new Date()));
            TimeZone tz = TimeZone.getDefault();
            Date now = new Date();
            int offsetFromUtc =0;// tz.getOffset(now.getTime()); // / 3600000;

            Date date1 = endTime;
            Date date2 = startTime;

            long different = date1.getTime() - (date2.getTime() + offsetFromUtc);
            long secondsInMilli = 1000;
            long minutesInMilli = secondsInMilli * 60;
            long hoursInMilli = minutesInMilli * 60;
            long daysInMilli = hoursInMilli * 24;

            long elapsedDays = different / daysInMilli;
            different = different % daysInMilli;

            long elapsedHours = different / hoursInMilli;
            different = different % hoursInMilli;

            long elapsedMinutes = different / minutesInMilli;
            different = different % minutesInMilli;

            Integer days=Integer.parseInt(String.valueOf(elapsedDays));
            Integer hours=Integer.parseInt(String.valueOf(elapsedHours));
            Integer mins=Integer.parseInt(String.valueOf(elapsedMinutes));

            items.add(days);
            items.add(hours);
            items.add(mins);
            //diff = (days>0?(days +"d "):"") + hours + " h" + ":" + mins + " m"; // updated value every1 second
            return items;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return items;
    }
    private  String formatElapsedTime(int pos, ArrayList<Integer> items){

        switch (pos){
            case 0:
                if(items.size()>0){
                    return items.get(pos) + "d";
                }
                break;
            case 1:
                if(items.size()>0){
                    return items.get(pos) + "h";
                }
                break;
            case 2:
                if(items.size()>0){
                    return items.get(pos) + "m";
                }
                break;

        }
        return "";
    }


    @Override
    public void locationChanged(Location mLocation) {
        /*cLocation = mLocation;
        latitude = String.valueOf(mLocation.getLatitude());
        longitude = String.valueOf(mLocation.getLongitude());
        refreshLocation();*/
    }
    /* @Override
     public boolean onKeyDown(int keyCode, KeyEvent event) {
         switch(keyCode){
             case KeyEvent.KEYCODE_BACK:
                 // do something here
                 gps.unbindService();
                 finish();
                 return true;
         }
         return super.onKeyDown(keyCode, event);
     }*/

    void selectFirstVisibleRadioButton(RadioGroup radioGroup) {

        int childCount = radioGroup.getChildCount();

        for (int i = 0; i < childCount; i++) {
            RadioButton rButton = (RadioButton) radioGroup.getChildAt(i);

            if (rButton.getVisibility() == View.VISIBLE) {
                rButton.setChecked(true);
                return;
            }

        }

    }
    private void taskCloseAction (){
        selectedJPlan.update();
        finish();
    }
    private void isStartDialog(){
        initialInspection = selectedJPlan;
        Intent intent = new Intent( TaskDashboardActivity.this, StartInspectionActivity.class);
        startActivityForResult(intent, START_INSPECTION_ACTIVITY_REQUEST_CODE);

                /*StartInspectionFragment dialogFragment = new StartInspectionFragment();
                FragmentTransaction ft = getSupportFragmentManager().beginTransaction();

        Bundle bundle = null;
        try {
            bundle = new Bundle();
            bundle.putString("latitude", latitude);
            bundle.putString("longitude", longitude);
            bundle.putBoolean("notAlertDialog", true);
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

                dialogFragment.show(ft, "dialog");*/
    }
    private void isStopDialog(){

        StopInspectionFragment dialogFragment = new StopInspectionFragment();
        FragmentTransaction ft = getSupportFragmentManager().beginTransaction();

        Bundle bundle = null;
        try {
            bundle = new Bundle();
            bundle.putString("latitude", latitude);
            bundle.putString("longitude", longitude);
            bundle.putBoolean("notAlertDialog", true);
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
    }
    private void onViewAction(){

        if(Globals.selectedUnit == null){
            if(Globals.selectedTask.getWholeUnitList().size() == 0){
                Toast.makeText(TaskDashboardActivity.this, getResources().getText(R.string.asset_available), Toast.LENGTH_SHORT).show();
            } else{
                if(defaultUnitSelection()){
                    Intent intent = new Intent(TaskDashboardActivity.this, IssuesActivity.class);//Intent intent = new Intent(TaskActivity.this, TaskDetailActivity.class);
                    startActivityForResult(intent, ISSUE_ACTIVITY_REQUEST_CODE);
                } else {
                    Toast.makeText(TaskDashboardActivity.this,getResources().getText(R.string.asset_available), Toast.LENGTH_SHORT).show();
                }
            }
        } else {
            Intent intent = new Intent(TaskDashboardActivity.this, IssuesActivity.class);
            startActivityForResult(intent, ISSUE_ACTIVITY_REQUEST_CODE);
        }
    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == ISSUE_ACTIVITY_REQUEST_CODE) {
            if(resultCode == RESULT_OK) {
                if(isBypassTaskView && selectedJPlan.getTaskList().size() == 1){
                    finish();
                }
            }
        } if (requestCode == START_INSPECTION_ACTIVITY_REQUEST_CODE){
            if(resultCode == RESULT_OK) {
                String expEnd = data.getStringExtra("expEnd");
                startTask(true, expEnd);
            } else if ( resultCode == RESULT_CANCELED){
                initialInspection = null;
                initialRun = null;
            }
        }
    }
    private boolean defaultUnitSelection(){

        if(isUseDefaultAsset){
            if(appName.equals(Globals.AppName.SCIM)){
                for(Units unit: selectedTask.getWholeUnitList()) {
                    if ((!unit.getAssetTypeClassify().equals("linear") && !unit.getAssetTypeClassify().equals("")) && (unit.getAssetTypeObj().isInspectable() && !unit.getAssetTypeObj().isLocation())) {
                        selectedUnit = unit;
                        return true;
                    }
                }
            } else if(appName.equals(Globals.AppName.TIMPS)){
                for(Units unit: selectedTask.getWholeUnitList()){
                    if(unit.getAttributes().isPrimary()){
                        Globals.selectedUnit = unit;
                        return true;
                    }
                }
                if(selectedUnit == null){
                    for(Units unit: selectedTask.getWholeUnitList()){
                        if(!unit.getAssetTypeObj().isLocation() && unit.getAssetTypeObj().isInspectable()){
                            Globals.selectedUnit = unit;
                            return true;
                        }
                    }
                }
            }

        }else {
            if(appName.equals(Globals.AppName.SCIM)){
                for(Units unit: selectedTask.getWholeUnitList()) {
                    if ((!unit.getAssetTypeClassify().equals("linear") && !unit.getAssetTypeClassify().equals("")) && (unit.getAssetTypeObj().isInspectable() && !unit.getAssetTypeObj().isLocation())) {
                        selectedUnit = unit;
                        return true;
                    }
                }
            } else{
                return selectFirstAsset();
            }
        }
        return false;
    }
    private boolean selectFirstAsset(){
        for (Units unit: selectedTask.getWholeUnitList()){
            if(!unit.getAssetTypeObj().isLocation() && unit.getAssetTypeObj().isInspectable()){
                selectedUnit = unit;
                return true;
            }
        }
        return false;
    }
    private void setLocation(final TextView view, final Context context, final String _location){
        boolean isLocationValid = true;
        String [] loc=Utilities.split(_location,",");
        String lati="", longi="";
        assert loc != null;

        if(loc.length==2){
            Log.println(Log.INFO,"Info", Arrays.toString(loc));
            lati=loc[0];
            longi=loc[1];
        }else
        {
            isLocationValid = false;
        }

        final String[] location = new String[1];
        final String locationString=lati +","+longi;

        final String finalLati = lati;
        final String finalLongi = longi;
        final boolean finalIsLocationValid = isLocationValid;
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    location[0] = Utilities.getLocationAddress(null, finalLati, finalLongi);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                //update ui on UI thread
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        if(!finalIsLocationValid){
                            view.setText(locationString);
                        }else{
                            view.setText(location[0]);
                        }
                    }
                });

            }
        }).start();
    }
    private void setLocation(final TextView view, final Context context, final String _latitude, final String _longitude){

        final String[] location = new String[1];
        final String locationString=_longitude +","+_latitude;

        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    location[0] = Utilities.getLocationAddress(getApplicationContext(), _latitude, _longitude);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                //update ui on UI thread
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        if(location[0].equals("")){
                            view.setText(locationString);
                        }else{
                            view.setText(location[0]);
                        }
                    }
                });

            }
        }).start();
    }
    /**
     * Function to show settings alert dialog
     * On pressing Settings button will launch Settings Options
     */

    public void showSettingsAlert() {
        AlertDialog.Builder alertDialog = new AlertDialog.Builder(TaskDashboardActivity.this);

        // Setting Dialog Title
        alertDialog.setTitle("GPS settings");

        // Setting Dialog Message
        alertDialog.setMessage("GPS is not enabled. Do you want to go to settings ?");

        // On pressing Settings button
        alertDialog.setPositiveButton("Settings", new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int which) {
                Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                TaskDashboardActivity.this.startActivity(intent);
            }
        });

        // on pressing cancel button
        alertDialog.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int which) {
                dialog.cancel();
            }
        });

        // Showing Alert Message
        alertDialog.show();
    }
}
