package com.app.ps19.hosapp;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.os.Build;
import android.os.IBinder;
import android.preference.PreferenceManager;

import androidx.core.app.ActivityCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.app.ps19.hosapp.Shared.GPSTrackerEx;
import com.app.ps19.hosapp.Shared.Globals;
import com.app.ps19.hosapp.Shared.LocationChangedInterface;
import com.app.ps19.hosapp.Shared.LocationUpdatesService;
import com.app.ps19.hosapp.Shared.Utilities;
import com.app.ps19.hosapp.Shared.Utils;
import com.app.ps19.hosapp.classes.Task;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;

import static com.app.ps19.hosapp.Shared.Globals.TASK_FINISHED_STATUS;
import static com.app.ps19.hosapp.Shared.Globals.TASK_IN_PROGRESS_STATUS;
import static com.app.ps19.hosapp.Shared.Globals.TASK_NOT_STARTED_STATUS;

public class TaskDashboardActivity extends AppCompatActivity implements LocationChangedInterface, SharedPreferences.OnSharedPreferenceChangeListener {
    private static final int REQUEST_CODE_PERMISSION = 2;
    String mPermission = Manifest.permission.ACCESS_FINE_LOCATION;
    SimpleDateFormat TASK_VIEW_DATE_FORMAT_FULL = new SimpleDateFormat("EEE, d MMM yyyy hh:mm:ss aa");
    SimpleDateFormat TASK_VIEW_DATE_FORMAT = new SimpleDateFormat("EEE, d MMM yyyy");
    SimpleDateFormat TASK_VIEW_TIME_FORMAT = new SimpleDateFormat("hh:mm aa");


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

    // GPSTracker class
    GPSTrackerEx gps;
    private Location cLocation;
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
                // do something here
                //gps.unbindService();
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
        if(gps!=null){
            //gps.unbindService();
        }
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
        if(gps == null){
            gps = new GPSTrackerEx(TaskDashboardActivity.this);
        }
        bindService(new Intent(TaskDashboardActivity.this, LocationUpdatesService.class), mServiceConnection,
                Context.BIND_AUTO_CREATE);
        PreferenceManager.getDefaultSharedPreferences(this)
                .registerOnSharedPreferenceChangeListener(this);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //TODO: Taking too long to execute setContentView()
        this.requestWindowFeature(Window.FEATURE_NO_TITLE);
        requestWindowFeature(Window.FEATURE_INDETERMINATE_PROGRESS);
        requestWindowFeature(Window.FEATURE_PROGRESS);
        myReceiver = new MyReceiver();
        if (Utils.requestingLocationUpdates(this)) {

        }

        setProgressBarIndeterminateVisibility(true);
        setProgressBarVisibility(true);
        setContentView(R.layout.activity_task_dashboard);

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
                            Globals.selectedUnit = Globals.selectedTask.getWholeUnitList().get(0);
                            Intent intent = new Intent(TaskDashboardActivity.this, IssuesActivity.class);//Intent intent = new Intent(TaskActivity.this, TaskDetailActivity.class);
                            startActivity(intent);
                        }
                    } else {
                        Intent intent = new Intent(TaskDashboardActivity.this, IssuesActivity.class);
                        startActivity(intent);
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
                Task task=Globals.selectedTask;
                if(task.getStatus().equals(Globals.TASK_NOT_STARTED_STATUS)
                        || task.getStatus().equals(TASK_IN_PROGRESS_STATUS)
                        || task.getStatus().equals("")){
                    showAlertDialog(task.getStatus());
                }
                return true;
            }
        });

        llFinishedStatus=findViewById(R.id.llFinishedStatus_tdb);
        llTileElapsed=findViewById(R.id.llTileElapsed_tdb);
        getLlTileElapsedSmall=findViewById(R.id.llTileElapsedSmall_tdb);
        Globals.setUserInfoView(userImage, tvUserName);

//        final Task task=Globals.selectedTask;
 //       tvTaskTitle.setText(task.getTitle());
 //       tvTaskDesc.setText(task.getDescription());
 //       tvTaskNotes.setText(task.getNotes());
        if(gps == null){
            gps = new GPSTrackerEx(TaskDashboardActivity.this);
        }
        if(gps.isGPSEnabled()){
            tryLocation();
        } else {
            gps.showSettingsAlert();
        }
        startThread();
        loadTaskDetails();


    }
    private void startTask(){
        Date now = new Date();
        String selTaskId = Globals.selectedTask.getTaskId();
        for (Task task: Globals.selectedJPlan.getTaskList()){
            if(task.getTaskId().equals(selTaskId)){
                task.setStatus(TASK_IN_PROGRESS_STATUS);
                task.setStartTime(now.toString());
                Globals.isTaskStarted = true;
                task.setStartLocation(latitude + "," + longitude);
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
                Globals.selectedUnit = Globals.selectedTask.getWholeUnitList().get(0);
                Intent intent = new Intent(TaskDashboardActivity.this, IssuesActivity.class);//Intent intent = new Intent(TaskActivity.this, TaskDetailActivity.class);
                Globals.selectedJPlan.update();
                loadTaskDetails();
                startActivity(intent);
            }
        } else {
            Intent intent = new Intent(TaskDashboardActivity.this, IssuesActivity.class);//Intent intent = new Intent(TaskActivity.this, TaskDetailActivity.class);
            Globals.selectedJPlan.update();
            loadTaskDetails();
            startActivity(intent);
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
                task.setEndLocation(latitude + "," + longitude);
                task.setStatus(TASK_FINISHED_STATUS);
                Globals.isTaskStarted = false;
                task.setEndTime(now.toString());
            }}
        /*Globals.selectedTask.setEndLocation(latitude + "," + longitude);
        Globals.selectedTask.setStatus(TASK_FINISHED_STATUS);
        Globals.isTaskStarted = false;
        Globals.selectedTask.setEndTime(now.toString());*/
        Globals.selectedJPlan.update();
        loadTaskDetails();
        return  true;
    }
    private void showAlertDialog(final String taskStatus){
        final Context context=TaskDashboardActivity.this;
        AlertDialog.Builder builder;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            builder = new AlertDialog.Builder(context, android.R.style.Theme_Material_Dialog_Alert);
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
                .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        // continue with start
                        if(taskStatus.equals(TASK_NOT_STARTED_STATUS)
                                || taskStatus.equals("")){
                            startTask();
                        }else
                        {
                            closeTask();
                            Toast.makeText(TaskDashboardActivity.this,
                                    getResources().getText(R.string.task_closed),Toast.LENGTH_SHORT).show();
                        }

                    }
                })
                .setNegativeButton(android.R.string.no, new DialogInterface.OnClickListener() {
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
        tvTaskStartTime.setText(TASK_NOT_STARTED_STATUS);
        tvTaskStartDate.setText(taskDate);
        tvTaskStartLoc.setText("_");
        tvIssueCount.setText("_");
        tvImageCount.setText("_");
        tvElapsedLabel.setText(getResources().getText(R.string.time_elapsed));
        tvElapsedText.setText("__");
        tvElapsedText1.setText("__");
        llTileElapsed.setBackgroundColor(getResources().getColor(R.color.color_tile_disabled));
        getLlTileElapsedSmall.setBackgroundColor(getResources().getColor(R.color.color_tile_disabled_dark));
        tvSSBtnText.setText(getResources().getText(R.string.start));

    }

    public void setInProgressTaskView() {
        Date _date = new Date();
        String taskDate = TASK_VIEW_DATE_FORMAT.format(_date);
        Task task =Globals.selectedTask;
        btnView.setVisibility(View.VISIBLE);
        btnView.setText(getResources().getText(R.string.view));
        llFinishedStatus.setVisibility(View.GONE);
        llBtnSS.setVisibility(View.VISIBLE);
        llBtnSS.setBackgroundColor(getResources().getColor(R.color.color_db_stop));
        imgSSBtn.setBackgroundResource(R.drawable.stop_btn);
        tvTaskStartTime.setText(TASK_VIEW_TIME_FORMAT.format(new Date(task.getStartTime())));
        tvTaskStartDate.setText(TASK_VIEW_DATE_FORMAT.format(new Date(task.getStartTime())));
        tvTaskStartLoc.setText(getLocationDescription(task.getStartLocation()));
        tvIssueCount.setText(String.valueOf(task.getReportList().size()));
        tvImageCount.setText(String.valueOf(task.getImageList().size()));
        refreshCounts();
        refreshTimeElapsed();

        llTileElapsed.setBackgroundColor(getResources().getColor(R.color.color_organge_light));
        getLlTileElapsedSmall.setBackgroundColor(getResources().getColor(R.color.color_db_orange_dark));
        tvSSBtnText.setText(getResources().getText(R.string.stop));

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
        btnView.setVisibility(View.VISIBLE);
        btnView.setText(getResources().getText(R.string.view));
        //llBtnSS.setBackgroundColor(getResources().getColor(R.color.color_db_stop));
        llBtnSS.setVisibility(View.GONE);
        llFinishedStatus.setVisibility(View.VISIBLE);
        imgClockIcon.setVisibility(View.INVISIBLE);
        //imgSSBtn.setBackgroundResource(R.drawable.stop_btn);
        tvTaskStartTime.setText(TASK_VIEW_TIME_FORMAT.format(new Date(task.getStartTime())));
        tvTaskStartDate.setText(TASK_VIEW_DATE_FORMAT.format(new Date(task.getStartTime())));
        tvTaskStartLoc.setText(getLocationDescription(task.getStartLocation()));
        tvIssueCount.setText(String.valueOf(task.getReportList().size()));
        tvImageCount.setText(String.valueOf(task.getImageList().size()));
        refreshCounts();
        ArrayList<Integer> items=getElapsedTime(new Date(task.getStartTime()), new Date(task.getEndTime()));

        String days=formatElapsedTime(0,items);
        String hours=formatElapsedTime(1,items);
        String mins=formatElapsedTime(2,items);
        String item1=(days.equals("")?"":(days + " "))+ hours;
        tvElapsedText.setText(item1);
        tvElapsedText1.setText(mins);
        tvElapsedLabel.setText(getResources().getText(R.string.time_total));
        llTileElapsed.setBackgroundColor(getResources().getColor(R.color.color_organge_light));
        getLlTileElapsedSmall.setBackgroundColor(getResources().getColor(R.color.color_db_orange_dark));
        tvTaskEndLoc.setText(getLocationDescription(task.getEndLocation()));
        //tvSSBtnText.setText("STOP");

    }
    private boolean isLocationAvailable(){
        if(!latitude.equals("") && !longitude.equals("")){
            return true;
        }
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if(gps != null){
                    if(gps.isGPSEnabled()){
                        tryLocation();
                    }
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
                    imgGpsIcon.setBackgroundResource(R.drawable.ic_location_on_white_24dp);
                }else
                {
                    imgGpsIcon.setBackgroundResource(R.drawable.ic_location_off_white_24dp);
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
        if(gps ==null) {
            gps = new GPSTrackerEx(TaskDashboardActivity.this);
        }
        try {
            if (ActivityCompat.checkSelfPermission(this, mPermission)
                    != PackageManager.PERMISSION_GRANTED) {

                ActivityCompat.requestPermissions(this, new String[]{mPermission},
                        REQUEST_CODE_PERMISSION);

                // If any permission above not allowed by user, this condition will
                //execute every time, else your else part will work
            } else if(!gps.canGetLocation()) {
                gps.showSettingsAlert();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
       /* if(gps.canGetLocation()){
            gps.getLocation();
        }*/
        // check if GPS enabled
        if (gps.canGetLocation()) {
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
                    gps.showSettingsAlert();
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
        if(gps.canGetLocation()){
            if(cLocation!=null){
                _loc = cLocation;
            } else if(gps.getLastKnownLocation()!=null){
                _loc = gps.getLastKnownLocation();
            } else if (Globals.lastKnownLocation!=null){
                _loc = Globals.lastKnownLocation;
            }
            if(_loc != null){
                latitude = String.valueOf(_loc.getLatitude());
                longitude = String.valueOf(_loc.getLongitude());
                String locationString=longitude +","+latitude;
                String locationDesc= getLocationDescription();
                imgGpsIcon.setBackgroundResource(R.drawable.ic_location_on_white_24dp);
                if(locationDesc.equals("")){
                    tvCurrLocationText.setText(locationString);
                }else{
                    tvCurrLocationText.setText(locationDesc);
                }
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
        if(loc.length==2){
            latitude=loc[0];
            longitude=loc[1];
        }else
        {
            return "";
        }
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
        return  "";
    }
    public ArrayList<Integer> getElapsedTime(String startTime) {
        ArrayList<Integer> returnValue=null;
        try{
            returnValue=getElapsedTime(new Date(startTime), new Date());
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
}
