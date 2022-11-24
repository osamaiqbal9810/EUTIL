package com.app.ps19.scimapp;

import android.Manifest;
import android.annotation.TargetApi;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.Color;
import android.location.Location;
import android.media.Image;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.preference.PreferenceManager;
import androidx.core.app.ActivityCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;

import android.text.Html;
import android.text.Spannable;
import android.text.SpannableString;
import android.text.method.ScrollingMovementMethod;
import android.text.style.ForegroundColorSpan;
import android.text.style.UnderlineSpan;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.app.ps19.scimapp.Shared.DBHandler;
import com.app.ps19.scimapp.Shared.DataSyncProcessEx;
import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.Shared.ListMap;
import com.app.ps19.scimapp.Shared.LocationUpdatesService;
import com.app.ps19.scimapp.Shared.ObservableObject;
import com.app.ps19.scimapp.Shared.Res;
import com.app.ps19.scimapp.Shared.StartInspectionActivity;
import com.app.ps19.scimapp.Shared.StartInspectionFragment;
import com.app.ps19.scimapp.Shared.StaticListItem;
import com.app.ps19.scimapp.Shared.StopInspectionFragment;
import com.app.ps19.scimapp.Shared.Utilities;
import com.app.ps19.scimapp.Shared.Utils;
import com.app.ps19.scimapp.classes.Inbox;
import com.app.ps19.scimapp.classes.JourneyPlan;
import com.app.ps19.scimapp.classes.Session;
import com.app.ps19.scimapp.classes.Task;
import com.app.ps19.scimapp.classes.Units;
import com.app.ps19.scimapp.classes.User;
import com.app.ps19.scimapp.classes.dynforms.DynFormList;
import com.app.ps19.scimapp.safetyBriefing.SafetyBriefingActivity;
import com.app.ps19.scimapp.wplan.WplanActivity;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Observable;
import java.util.Observer;
import java.util.TimeZone;
import java.util.UUID;

import static android.view.View.GONE;
import static com.app.ps19.scimapp.Shared.Globals.MESSAGE_STATUS_READY_TO_POST;
import static com.app.ps19.scimapp.Shared.Globals.SESSION_STARTED;
import static com.app.ps19.scimapp.Shared.Globals.SESSION_STOPPED;
import static com.app.ps19.scimapp.Shared.Globals.TASK_FINISHED_STATUS;
import static com.app.ps19.scimapp.Shared.Globals.TASK_IN_PROGRESS_STATUS;
import static com.app.ps19.scimapp.Shared.Globals.WORK_PLAN_FINISHED_STATUS;
import static com.app.ps19.scimapp.Shared.Globals.WORK_PLAN_IN_PROGRESS_STATUS;
import static com.app.ps19.scimapp.Shared.Globals.appName;
import static com.app.ps19.scimapp.Shared.Globals.blnFreshLogin;
import static com.app.ps19.scimapp.Shared.Globals.blnFreshLoginWaitForData;
import static com.app.ps19.scimapp.Shared.Globals.dayStarted;
import static com.app.ps19.scimapp.Shared.Globals.inbox;
import static com.app.ps19.scimapp.Shared.Globals.initialInspection;
import static com.app.ps19.scimapp.Shared.Globals.initialRun;
import static com.app.ps19.scimapp.Shared.Globals.isDataPopulated;
import static com.app.ps19.scimapp.Shared.Globals.isDayProcessRunning;
import static com.app.ps19.scimapp.Shared.Globals.isInspectionTypeReq;
import static com.app.ps19.scimapp.Shared.Globals.isMaintainer;
import static com.app.ps19.scimapp.Shared.Globals.isMpReq;
import static com.app.ps19.scimapp.Shared.Globals.isBypassTaskView;
import static com.app.ps19.scimapp.Shared.Globals.isShowSession;
import static com.app.ps19.scimapp.Shared.Globals.isTraverseReq;
import static com.app.ps19.scimapp.Shared.Globals.isUseDefaultAsset;
import static com.app.ps19.scimapp.Shared.Globals.isWConditionReq;
import static com.app.ps19.scimapp.Shared.Globals.lastError;
import static com.app.ps19.scimapp.Shared.Globals.lastKnownLocation;
import static com.app.ps19.scimapp.Shared.Globals.loadDayStatus;
import static com.app.ps19.scimapp.Shared.Globals.loadInbox;
import static com.app.ps19.scimapp.Shared.Globals.mainActivity;
import static com.app.ps19.scimapp.Shared.Globals.offlineMode;
import static com.app.ps19.scimapp.Shared.Globals.orgCode;
import static com.app.ps19.scimapp.Shared.Globals.saveCurrentJP;
import static com.app.ps19.scimapp.Shared.Globals.selectedDUnit;
import static com.app.ps19.scimapp.Shared.Globals.selectedJPlan;
import static com.app.ps19.scimapp.Shared.Globals.selectedTask;
import static com.app.ps19.scimapp.Shared.Globals.selectedUnit;
import static com.app.ps19.scimapp.Shared.Globals.setLocale;
import static com.app.ps19.scimapp.Shared.Globals.showNearByAssets;
import static com.app.ps19.scimapp.Shared.Globals.startOfDayTime;
import static com.app.ps19.scimapp.Shared.Globals.userEmail;
import static com.app.ps19.scimapp.Shared.Globals.userUID;
import static com.app.ps19.scimapp.Shared.Globals.webPullRequest;
import static com.app.ps19.scimapp.Shared.Globals.webUploadMessageLists;
import static com.app.ps19.scimapp.Shared.StopInspectionFragment.STOP_INSPECTION_RETURN_MSG_FOR_DASHBOARD;
import static com.app.ps19.scimapp.Shared.Utilities.canGetLocation;
import static com.app.ps19.scimapp.Shared.Utilities.showSettingsAlert;

public class DashboardActivity extends AppCompatActivity implements Observer,
        SharedPreferences.OnSharedPreferenceChangeListener,
        StopInspectionFragment.StopDialogListener {
    // Updated GPS location service code
    // Start
    private static final String TAG = "resPMain";

    // Used in checking for runtime permissions.
    private static final int REQUEST_PERMISSIONS_REQUEST_CODE = 34;

    // Used for start inspection activity
    private static final int START_INSPECTION_REQUEST_CODE = 10;

    // Used for work plan activity
    private static final int WORK_PLAN_REQUEST_CODE = 1;

    // The BroadcastReceiver used to listen from broadcasts from the service.
    private MyReceiver myReceiver;

    // A reference to the service used to get location updates.
    private LocationUpdatesService mService = null;

    // Tracks the bound state of the service.
    private boolean mBound = false;

    // UI elements.
    private Button mRequestLocationUpdatesButton;
    private Button mRemoveLocationUpdatesButton;

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
                /*Toast.makeText(DashboardActivity.this, Utils.getLocationText(mLocation),
                        Toast.LENGTH_SHORT).show();*/
            }
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
     * Callback received when a permissions request has been completed.
     */
    /*@Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        Log.i(TAG, "onRequestPermissionResult");
        if (requestCode == REQUEST_PERMISSIONS_REQUEST_CODE) {
            if (grantResults.length <= 0) {
                // If user interaction was interrupted, the permission request is cancelled and you
                // receive empty arrays.
                Log.i(TAG, "User interaction was cancelled.");
            } else if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // Permission was granted.
                mService.requestLocationUpdates();
            } else {
                // Permission denied.
                Toast.makeText(this, "Permission Denied", Toast.LENGTH_SHORT).show();
                *//*Snackbar.make(
                        this,
                        "Permission Denied",
                        Snackbar.LENGTH_INDEFINITE)
                        .setAction(R.string.settings, new View.OnClickListener() {
                            @Override
                            public void onClick(View view) {
                                // Build intent that displays the App settings screen.
                                Intent intent = new Intent();
                                intent.setAction(
                                        Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                                Uri uri = Uri.fromParts("package",
                                        BuildConfig.APPLICATION_ID, null);
                                intent.setData(uri);
                                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                startActivity(intent);
                            }
                        })
                        .show();*//*
            }
        }
    }*/
    @Override
    protected void onStop() {
        ObservableObject.getInstance().deleteObserver(this);
        if (mBound) {
            // Unbind from the service. This signals to the service that this activity is no longer
            // in the foreground, and the service can respond by promoting itself to a foreground
            // service.
            unbindService(mServiceConnection);
            mBound = false;
        }
        PreferenceManager.getDefaultSharedPreferences(this)
                .unregisterOnSharedPreferenceChangeListener(this);
        super.onStop();
    }
    @Override
    public void onDestroy() {
        super.onDestroy();
        threadScreenUpdate.interrupt();
        try{
            threadScreenUpdate.join();
        }catch (Exception e){

        }
        if (mBound) {
            // Unbind from the service. This signals to the service that this activity is no longer
            // in the foreground, and the service can respond by promoting itself to a foreground
            // service.
            unbindService(mServiceConnection);
            mBound = false;
        }
        if(mService!=null){
            mService.removeLocationUpdates();
        }
        //gps.stopUsingGPS();

        //Intent myService = new Intent(DashboardActivity.this, GPSService.class);
        //stopService(myService);
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
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @Override
    public void onStart() {
        super.onStart();
        /*if(gps== null){
            gps = new GPSTrackerEx(DashboardActivity.this);
        }*/
        bindService(new Intent(DashboardActivity.this, LocationUpdatesService.class), mServiceConnection,
                Context.BIND_AUTO_CREATE);
        PreferenceManager.getDefaultSharedPreferences(this)
                .registerOnSharedPreferenceChangeListener(this);
        // Restore the state of the buttons when the activity (re)launches.
        //setButtonsState(Utils.requestingLocationUpdates(this));
        if (!checkPermissions()) {
            requestPermissions();
        } else {
            if(mService!=null){
                mService.requestLocationUpdates();
            }
        }
        // Bind to the service. If the service is in foreground mode, this signals to the service
        // that since this activity is in the foreground, the service can exit foreground mode.

    }
    @Override
    public void onResume(){
        super.onResume();
        try {
            if(!Globals.dayStarted){
                //    progressDialog.show();
            }
            if(blnFreshLogin){
                progressDialog.show();
                blnFreshLogin=false;
            }
            if(Globals.dataSyncProcessEx!=null){
                Globals.dataSyncProcessEx.InterruptThread();
            }
            //sleep(5000);
            refreshSwitchboard();
            refreshDashboard();
            /*if(gps== null){
                gps = new GPSTrackerEx(DashboardActivity.this);
            }*/
            LocalBroadcastManager.getInstance(this).registerReceiver(myReceiver,
                    new IntentFilter(LocationUpdatesService.ACTION_BROADCAST));
            refreshLocation();
            if(cLocation == null){
                cLocation = lastKnownLocation;
            }
            Globals.setUserInfoView(DashboardActivity.this, userImage, userNameView);
        }catch (Exception e){
            e.printStackTrace();
        }
    }


    // End

    // APIInterface apiInterface;
    static {
        AppCompatDelegate.setCompatVectorFromResourcesEnabled(true);
    }
    public String GPS_UNAVAILABLE_MSG = "";
    ProgressDialog progressDialog;
    Handler msgHandler;
    private static final int REQUEST_CODE_PERMISSION = 2;
    String mPermission = Manifest.permission.ACCESS_FINE_LOCATION;
    TextView currentDate;
    TextView elapsedTxtView;
    TextView reportedTxtView;
    TextView inspTxtView;
    TextView tvServiceStatus;
    TextView tvListResult;
    TextView userNameView;
    TextView tvElapsedLabel;
    TextView tvSSBtnText;
    TextView tvCurrLocationText;
    DataSyncProcessEx dataSyncProcessEx=null;
    Button btnSelectRun;
    Button btnBriefing;
    Button btnRun;
    Button reportBtn;
    ImageView syncStatusIcon;
    ImageView userImage;
    //GPSTrackerEx gps;
    String location="";
    Location cLocation;
    //Dashboard Items
    TextView tvTimeElapsedMins;
    TextView tvTimeElapsedHours;
    TextView tvTaskTotal;
    TextView tvTaskCurrent;
    TextView tvIssueCount;
    TextView tvDayYear;
    TextView tvDayText;
    ImageView imgNetStatus;
    ProgressDialog dialog =null;
    ImageView imgGpsIcon;
    ImageView imgClockIcon;
    ImageView imgBtnSS;
    LinearLayout llBtnSS;
    LinearLayout llFinishedStatus;
    LinearLayout llTileElapsed;
    LinearLayout llTileElapsedSmall;
    SimpleDateFormat FULL_DATE_FORMAT = new SimpleDateFormat("EEE MMM dd HH:mm:ss zzzz yyyy", Locale.ENGLISH);
    ImageView ivLogo;

    int secCounter=0;
    boolean blnGpsIcon =false, blnClockIcon = false;
    String workPlanStatus=""; //
    String longitude="", latitude ="";
    boolean blnShowLocationAlert=false;
    boolean blnEnforceTaskCompleteRule=false;
    //end
    Thread threadScreenUpdate=null;
    RelativeLayout rlUserInfo;
    private Res res;
    TextView tvInspStatus;
    ImageView tvSessions;
    TextView tvSessionTitle;
    ImageView ivUpdatePassword;

    @Override public Resources getResources() {
        if (res == null) {
            res = new Res(super.getResources());
        }
        return res;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Globals.checkLanguage(this);
        setLocale(this);
        //-------------------GPS Code--------------
        myReceiver = new MyReceiver();
        // Check that the user hasn't revoked permissions by going to Settings.
        if (Utils.requestingLocationUpdates(this)) {
            if (!checkPermissions()) {
                requestPermissions();
            }
        }
        //--------------------END-------------------
        setContentView(R.layout.main_dashboard);
        rlUserInfo = (RelativeLayout) findViewById(R.id.layout_user);
        currentDate = (TextView) findViewById(R.id.sodDateTxt);
        elapsedTxtView = (TextView) findViewById(R.id.elapsedTxt);
        reportedTxtView = (TextView) findViewById(R.id.reportedIssuesTxt);
        inspTxtView = (TextView) findViewById(R.id.inspTxt);
        userImage = (ImageView) rlUserInfo.findViewById(R.id.userImgView);
        userNameView = (TextView) rlUserInfo.findViewById(R.id.userNameTxt);
        ivUpdatePassword = (ImageView) rlUserInfo.findViewById(R.id.iv_update_password);
        elapsedTxtView.setText("0h 0m");
        reportedTxtView.setText("3");
        inspTxtView.setText("5");
        ivLogo = (ImageView) rlUserInfo.findViewById(R.id.iv_logo);
        ObservableObject.getInstance().addObserver(this);
        syncStatusIcon = (ImageView) findViewById(R.id.syncStatusIcon);
        Globals.setUserInfoView(DashboardActivity.this, userImage, userNameView);
        try {
            ListMap.initializeAllLists(this);
        } catch (Exception e) {
            e.printStackTrace();
        }
        rlUserInfo.setBackgroundColor(res.getColor(R.color.action_bar_background));
        dialog=new ProgressDialog(this); // this = YourActivity
        GPS_UNAVAILABLE_MSG = getString(R.string.gps_location_unavailable_msg);
        //DASHBOARD ITEMS
        //-----------------------------------------------------------
        tvTimeElapsedMins=findViewById(R.id.tv_tem_ma);
        tvTimeElapsedHours=findViewById(R.id.tv_teh_ma);
        tvTaskTotal=findViewById(R.id.tv_tbt_ma);
        tvTaskCurrent=findViewById(R.id.tv_tbc_ma);
        tvIssueCount=findViewById(R.id.tv_ibc_ma);
        tvDayYear=findViewById(R.id.tv_det_ma);
        tvDayText=findViewById(R.id.tv_dem_ma);
        tvElapsedLabel=findViewById(R.id.tvTimeElapsedLabel_ma);
        tvSSBtnText=findViewById(R.id.tvBtnSS_ma);
        tvCurrLocationText=findViewById(R.id.tvCurrLocationText_ma);

        imgNetStatus=findViewById(R.id.imgNetStatus_ma);
        imgClockIcon=findViewById(R.id.imgClockIcon_ma);
        imgGpsIcon =findViewById(R.id.imgGPSIcon_ma);
        imgBtnSS=findViewById(R.id.imgBtnSS_ma);
        llBtnSS=findViewById(R.id.ll_BtnSS_ma);
        llFinishedStatus=findViewById(R.id.llFinishedStatus_ma);
        llTileElapsed=findViewById(R.id.llTileElapsed_ma);
        llTileElapsedSmall=findViewById(R.id.llTileElapsedSmall_ma);
        tvInspStatus = (TextView) findViewById(R.id.tv_inspection_status);
        tvSessions = (ImageView) findViewById(R.id.iv_view_sessions);
        tvSessionTitle = (TextView) findViewById(R.id.tv_session_title);

        SpannableString sessionTitle1 = new SpannableString("Sessions");
        sessionTitle1.setSpan(new ForegroundColorSpan(getResources().getColor(R.color.title_background)), 0, sessionTitle1.length(), Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);

        sessionTitle1.setSpan(new UnderlineSpan(), 0, sessionTitle1.length(), 0);
        tvSessionTitle.setText(R.string.session_title);

        if(selectedJPlan == null){
            selectedTask = null;
        }

        tvDayText.setMovementMethod(new ScrollingMovementMethod());
        //-----------------------------------------------------------
        refreshDashboard();
        btnSelectRun = (Button) findViewById(R.id.startBtn);
        btnBriefing = (Button) findViewById(R.id.syncBtn);
        btnRun = (Button) findViewById(R.id.planBtn);
        reportBtn = (Button) findViewById(R.id.reportsBtn);
        if(isMaintainer){
            btnRun.setText(R.string.maintenance_title);
        }
        //For testing
        //getDelegate().setLocalNightMode(AppCompatDelegate.MODE_NIGHT_YES);
        //int theme = R.style.Theme_Design_Light_NoActionBar;
        //setTheme(theme);
        //DateFormat dateFormat = new SimpleDateFormat("EEE, d MMM yyyy");
        //Date date = new Date();
        //currentDate.setText(dateFormat.format(date));
        /*if (Globals.dayStarted) {
            sessionBtn.setText("DAY END");
            sessionBtn.setBackgroundColor(getResources().getColor(R.color.end_task_button));
        } else {
            sessionBtn.setText("DAY START");
            sessionBtn.setBackgroundColor(getResources().getColor(R.color.start_button));
        }*/
        // Starting Location Service
        //startService(new Intent(this, GPSService.class));
        SpannableString sessionTitle = new SpannableString("View");
        sessionTitle.setSpan(new ForegroundColorSpan(getResources().getColor(R.color.title_background)), 0, sessionTitle.length(), Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);

        sessionTitle.setSpan(new UnderlineSpan(), 0, sessionTitle.length(), 0);
        //tvSessions.setText(sessionTitle);

        tvSessions.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(DashboardActivity.this, SessionDashboard.class);
                startActivity(intent);
            }});
        ivUpdatePassword.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(DashboardActivity.this, ProfileActivity.class);
                startActivity(intent);
            }});


        refreshSwitchboard();
        /*if(gps == null){
            gps = new GPSTrackerEx(DashboardActivity.this);
        }*/
        if(threadScreenUpdate ==null){
            threadScreenUpdate=new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        while (true) {
                            secCounter++;
                            if(secCounter>=60){
                                secCounter=1;
                            }
                            if(dayStarted && selectedJPlan!=null) {
                                runOnUiThread(new Runnable() {
                                    @Override
                                    public void run() {
                                        if(secCounter % 10 == 0){
                                            if(canGetLocation(DashboardActivity.this)) {
                                                tryLocation();
                                            }
                                        }
                                        if (blnClockIcon) {
                                            blnClockIcon = false;
                                            imgClockIcon.setVisibility(View.INVISIBLE);
                                        }else{
                                            blnClockIcon = true;
                                            imgClockIcon.setVisibility(View.VISIBLE);
                                        }
                                        if(blnGpsIcon){
                                            imgGpsIcon.setVisibility(View.INVISIBLE);
                                            blnGpsIcon=false;

                                        }else{
                                            imgGpsIcon.setVisibility(View.VISIBLE);
                                            blnGpsIcon=true;
                                        }

                                    }
                                });
                            }else{
                                if(!blnGpsIcon){
                                    DashboardActivity.this.runOnUiThread(new Runnable() {
                                        @Override
                                        public void run() {
                                            if(blnGpsIcon){
                                                imgGpsIcon.setVisibility(View.INVISIBLE);
                                                blnGpsIcon=false;

                                            }else{
                                                imgGpsIcon.setVisibility(View.VISIBLE);
                                                blnGpsIcon=true;
                                            }
                                        }
                                    });
                                }
                            }
                            if(secCounter==30 && !isDayProcessRunning) {
                                runOnUiThread(new Runnable() {
                                    @Override
                                    public void run() {
                                        refreshDashboard();
                                        refreshSwitchboard();
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
        /*
        sessionBtn.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View view) {
                if(!Globals.dayStarted && Globals.currDayLocked){

                    new AlertDialog.Builder(DashboardActivity.this)
                            .setTitle("Confirmation!")
                            .setMessage("Do you really want to open closed Session?")
                            .setIcon(android.R.drawable.ic_dialog_alert)
                            .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int whichButton) {
                                    //Toast.makeText(DashboardActivity.this, "Successfully Started", Toast.LENGTH_SHORT).show();

                                    new Thread(new Runnable() {
                                        @Override
                                        public void run() {
                                            openSession();
                                        }
                                    }).start();

                                }
                            })
                            .setNegativeButton(android.R.string.no, null).show();
                }
                return false;
            }
        });
        */
        //Set yard inspection
        //findAndSetYardInspection();

        btnSelectRun.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                /*
                blnShowLocationAlert=true;
                tryLocation();
                blnShowLocationAlert=false;
                if(!canGetLocation(DashboardActivity.this)){
                    Toast.makeText(DashboardActivity.this,GPS_UNAVAILABLE_MSG,Toast.LENGTH_SHORT).show();
                    return ;
                }
                Intent intent = new Intent( DashboardActivity.this, WorkPlanActivity.class);
                startActivityForResult(intent, WORK_PLAN_REQUEST_CODE);
                */
                if(dayStarted){
                    Intent intent = new Intent( DashboardActivity.this, WplanActivity.class);
                    //Intent intent = new Intent( DashboardActivity.this, WorkPlanActivity.class);
                    startActivityForResult(intent, WORK_PLAN_REQUEST_CODE);
                    //Close WorkPlan
                    //Toast.makeText(DashboardActivity.this,"CLOSE Work Plan",Toast.LENGTH_SHORT).show();
                }else{
                    blnShowLocationAlert=true;
                    tryLocation();
                    blnShowLocationAlert=false;
                    if(!canGetLocation(DashboardActivity.this)){
                        Toast.makeText(DashboardActivity.this,GPS_UNAVAILABLE_MSG,Toast.LENGTH_SHORT).show();
                        return ;
                    }
                    //tryLocation();
                    //Select WorkPlan
                    /*SelectWorkPlanDialogFragment selectBox=SelectWorkPlanDialogFragment.newInstance("SELECT WORK PLAN");
                    selectBox.setOnDialogClicked(new IOnDialogClicked() {
                        @Override
                        public void onOkayClicked(JourneyPlan jp) {
                            final JourneyPlan journeyPlan=jp;
                            //Toast.makeText(DashboardActivity.this,"Selected: " + jp.getTitle(),Toast.LENGTH_SHORT).show();
                            new AlertDialog.Builder(DashboardActivity.this)
                                    .setTitle("Confirmation!")
                                    .setMessage("Do you really want to start "+ jp.getTitle() +"?")
                                    .setIcon(android.R.drawable.ic_dialog_alert)
                                    .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
                                        public void onClick(DialogInterface dialog, int whichButton) {
                                            //Toast.makeText(DashboardActivity.this, "Successfully Stopped", Toast.LENGTH_SHORT).show();
                                            new Thread(new Runnable() {
                                                @Override
                                                public void run() {
                                                    startSession(journeyPlan);
                                                }
                                            }).start();
                                        }
                                    })
                                    .setNegativeButton(android.R.string.no, null).show();
                        }
                    });*/
                    Intent intent = new Intent( DashboardActivity.this, WplanActivity.class);
                    //Intent intent = new Intent( DashboardActivity.this, WorkPlanActivity.class);
                    startActivityForResult(intent, WORK_PLAN_REQUEST_CODE);
                    // selectBox.show(getFragmentManager(),"SELECT WORK PLAN");

                    //Toast.makeText(DashboardActivity.this,"SELECT Work Plan",Toast.LENGTH_SHORT).show();
                }

            }
        });
        tryLocation();
        btnBriefing.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(Globals.dayStarted){
                    Intent intent = new Intent(DashboardActivity.this, SafetyBriefingActivity.class);
                    // Intent intent =new Intent(DashboardActivity.this,ScribbleNotesActivity.class);
                    Bundle b=new Bundle();
                    b.putString("filename","");
                    //intent.putExtras(b);
                    startActivityForResult(intent,1);
                }
                //Temporary commented for Testing only
                   /*  Globals.timeStamp="";
                  if(Globals.blnNetAvailable)
                    Toast.makeText(DashboardActivity.this, getResources().getText(R.string.sync_service_running), Toast.LENGTH_SHORT).show();
                  else
                      Toast.makeText(DashboardActivity.this, getResources().getText(R.string.network_unavailable), Toast.LENGTH_SHORT).show();*/
                //}
            }
        });
        btnRun.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try{
                    String json1="{\"title\": \"Welcome\",\"issues\":[{\"name\":\"Issue 1\",\"status\":\"closed\"}]}";
                    String json2="{\"issues\":[{},{\"name\":\"Issue 2\",\"status\":\"open\"}]}";
                    String json11="{\"title\":\"Sample 1\",\"status\":2, \"Object1\":{\"Field1\": \"Sample 1\",\"Field2\":\"Sample 2\"},\"ary\":[{\"name\":\"a1\",\"status\":0}]}";
                    //String json12="{\"status\":3,\"Object1\":{\"Field3\":\"Sample 3\"},\"*ary\":[,{\"name\":\"a2\"}]}";
                    String json12="{\"status\":5}";
                    JSONObject jo = null;
                    //JSONObject jo=new JSONObject(json11);
                    //JSONObject jo1=new JSONObject(json12);
                    //jo=Utilities.addObject(jo,jo1);
                    //jo=Utilities.mergeObject(jo,jo1);
                    jo=Utilities.addObject(new JSONObject(json11),new JSONObject(json12));
                    Log.i("Sample",jo.toString());
                    if (Globals.dayStarted) {
                        if (Globals.selectedJPlan != null && Globals.selectedJPlan.getTaskList()!=null) {
                            if (Globals.selectedJPlan.getTaskList().size() == 1) {
                                Globals.selectedTask = selectedJPlan.getTaskList().get(0);
                                Intent intent = new Intent(DashboardActivity.this, TaskDashboardActivity.class);
                                startActivity(intent);
                            } else {
                                Intent intent = new Intent(DashboardActivity.this, InboxActivity.class);
                                startActivity(intent);
                            }
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
        reportBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(isMaintainer){
                    Toast.makeText(DashboardActivity.this, "Permission denied!", Toast.LENGTH_SHORT).show();
                } else {
                    if (Globals.dayStarted) {
                        Intent intent = new Intent(DashboardActivity.this, ReportInboxActivity.class);
                        startActivity(intent);
                    }
                }

            }
        });

        llBtnSS.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Toast.makeText(DashboardActivity.this, getResources().getText(R.string.long_press_to_continue),Toast.LENGTH_SHORT).show();
            }
        });
        llBtnSS.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View view) {
                if(dayStarted){
                    blnShowLocationAlert=true;
                    tryLocation();
                    blnShowLocationAlert=false;
                    if(!canGetLocation(DashboardActivity.this)){
                        Toast.makeText(DashboardActivity.this,GPS_UNAVAILABLE_MSG,Toast.LENGTH_SHORT).show();
                        return true;
                    }
                    new AlertDialog.Builder(DashboardActivity.this)
                            .setTitle(getResources().getText(R.string.confirmation))
                            .setMessage(getResources().getText(R.string.want_to_stop_inspection))
                            .setIcon(android.R.drawable.ic_dialog_alert)
                            .setPositiveButton(R.string.btn_ok, new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int whichButton) {
                                    /*new Thread(new Runnable() {
                                        @Override
                                        public void run() {*/
                                    try {
                                        if(isBypassTaskView && selectedJPlan.getTaskList().size()==1){
                                            if(selectedTask == null){
                                                selectedTask = selectedJPlan.getTaskList().get(0);
                                            }
                                            if(selectedTask.getStartTime().equals("")){

                                                new AlertDialog.Builder(DashboardActivity.this)
                                                        .setTitle(getResources().getText(R.string.confirmation))
                                                        .setMessage(R.string.run_not_started_confirmation)
                                                        .setIcon(android.R.drawable.ic_dialog_alert)
                                                        .setPositiveButton(R.string.btn_ok, new DialogInterface.OnClickListener() {
                                                            public void onClick(DialogInterface dialog, int whichButton) {
                                                                isStopDialog();
                                                            }}).setNegativeButton(R.string.btn_cancel, null).show();
                                            } else {
                                                isStopDialog();
                                            }
                                        } else {
                                            isStopDialog();
                                        }
                                    } catch (Resources.NotFoundException e) {
                                        e.printStackTrace();
                                    }
                                    //endSession();
                                      /*  }
                                    }).start();*/
                                    //Toast.makeText(DashboardActivity.this, "Successfully Stopped", Toast.LENGTH_SHORT).show();
                               /*     if(isMpReq){
                                        endMpDialog(view);
                                    } else {
                                        new Thread(new Runnable() {
                                            @Override
                                            public void run() {
                                                endSession();
                                            }
                                        }).start();
                                    }*/
                                }
                            })
                            .setNegativeButton(R.string.btn_cancel, null).show();

                }
                return true;
            }
        });
        tvServiceStatus=(TextView) findViewById(R.id.tvServiceStatus_ma);
        //TODO: Need to change
        Globals.mainActivity = this;
        //gps = new GPSTracker(this);
        if(Globals.dataSyncProcessEx ==null){
            StartDataSyncService();
            dataSyncProcessEx.setDataSyncProcessListener(new DataSyncProcessEx.DataSyncProcessListener() {
                @Override
                public void onStatusChanged(int status) {
                    final int _status=status;
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            /*
                            switch(_status){
                                case 2:
                                    syncStatusIcon.setImageResource(R.drawable.ic_sync_green_24dp);
                                    break;
                                case 1:
                                    syncStatusIcon.setImageResource(R.drawable.ic_sync_red_24dp);
                                    break;
                                case 3:
                                    syncStatusIcon.setImageResource(R.drawable.ic_sync_green_24dp);
                                    break;
                                    default:
                                        syncStatusIcon.setImageResource(R.drawable.ic_sync_grey_24dp);
                                        break;
                            }*/
                            if (_status == 1) {
                                syncStatusIcon.setImageResource(R.drawable.ic_sync_green_24dp);
                            } else if (_status == 2) {
                                syncStatusIcon.setImageResource(R.drawable.ic_sync_red_24dp);
                            } else if (_status == 3) {
                                syncStatusIcon.setImageResource(R.drawable.ic_sync_grey_24dp);
                            }
                            tvServiceStatus.setText(getResources().getText(R.string.status) +" : " +String.valueOf(_status));
                        }
                    });

                }
            });
        }

        progressDialog= new ProgressDialog(this);
        progressDialog.setTitle(getResources().getString(R.string.please_wait));
        progressDialog.setMessage(getResources().getString(R.string.waiting_for_sync_service));
        progressDialog.setCancelable(false);
        progressDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
        //progressDialog.show();

        msgHandler = new Handler(){
            @Override
            public void handleMessage(Message msg) {
                super.handleMessage(msg);

                if(blnFreshLoginWaitForData) {
                    new Thread(new Runnable() {
                        @Override
                        public void run() {
                            Globals.inbox = null;
                            //Globals.inbox.loadSampleData(getApplicationContext());
                            //Globals.selectedJPlan = Globals.inbox.getCurrentJourneyPlan();
                            while(!isDataPopulated){
                                try {
                                    Thread.sleep(500);
                                } catch (InterruptedException e) {
                                    e.printStackTrace();
                                }
                            }

                            if(!lastError.equals("")){
                                Toast.makeText(DashboardActivity.this, lastError, Toast.LENGTH_SHORT).show();
                            }
                            loadDayStatus(mainActivity);
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    refreshDashboard();
                                    refreshSwitchboard();
                                    Log.i("DashboardActivity", "After Login Thread:" + (Globals.inbox.getJourneyPlans()!=null?Globals.inbox.getJourneyPlans().size():0));
                                    progressDialog.dismiss();

                                }
                            });
                            blnFreshLoginWaitForData=false;

                        }
                    }).start();

                    //DashboardActivity.this.recreate();
                }


            }

        };

    }
    @Override
    protected void onActivityResult(int requestCode, int resultCode, final Intent data) {
       /* if (!Debug.isDebuggerConnected()) {
            Debug.waitForDebugger();
            Log.d("debug", "started"); // Insert a breakpoint at this line!!
        }*/
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == WORK_PLAN_REQUEST_CODE) {
            if (resultCode == RESULT_OK) {
                String selection = data.getStringExtra("Selection");
                String mode = data.getStringExtra("Mode");
                if (selection.equals("Yes")) {
                    final int position = data.getIntExtra("Position", -1);
                    final String jpCode = data.getStringExtra("code");
                    if(mode.equals("New")){
                        selectedJPlan = null;
                        selectedTask = null;
                        selectedUnit = null;
                        selectedDUnit = null;
                        if (!jpCode.equals("")) {
                            JourneyPlan journeyPlan = inbox.loadJourneyPlanTemplate(DashboardActivity.this, jpCode);
                            //journeyPlan.setUserStartMp(startMp);
                            startSessionProcess(journeyPlan);
                        }
                    } else if(mode.equals("Switch")){
                        saveCurrentJP(jpCode);
                        selectedTask = null;
                        selectedUnit = null;
                        selectedDUnit = null;
                        selectedJPlan = inbox.getCurrentJourneyPlan();
                        dayStarted = true;
                        Globals.safetyBriefing = null;
                        Globals.listViews = new HashMap<Integer, View>();
                        refreshDashboard();
                        refreshSwitchboard();
                    }

                }
            }
        } else if (requestCode == START_INSPECTION_REQUEST_CODE) {
            if (resultCode == RESULT_OK) {
                new Thread(new Runnable() {
                    @Override
                    public void run() {

                        String expEnd = data.getStringExtra("expEnd");
                        startSession(initialInspection, expEnd);
                        Globals.safetyBriefing = null;
                        Globals.listViews = new HashMap<Integer, View>();
                    }
                }).start();

            } else if (resultCode == RESULT_CANCELED) {
                initialInspection = null;
                initialRun = null;
            }
        }
    }

    private void refreshDashboard() {
        boolean blnDataChanged =false;
        if (Globals.inbox == null) {
            Globals.inbox = new Inbox();

            if(Globals.mainActivity==null){
                Globals.mainActivity=DashboardActivity.this;
            }
            Globals.inbox.loadSampleData(DashboardActivity.this);
            Globals.selectedJPlan = Globals.inbox.getCurrentJourneyPlan();
        }
        Globals.selectedJPlan = Globals.inbox.getCurrentJourneyPlan();
        JourneyPlan jp = Globals.selectedJPlan;
        if(jp !=null){
            if(!workPlanStatus.equals(jp.getStatus())){
                workPlanStatus=jp.getStatus();
                blnDataChanged=true;
            }

        }

        String strElapsedHours="00 h";
        String strElapsedMins="00 m";
        String strSessionTotal="0";
        String strTaskCurrent="0";
        String strIssueCount="0";
        String strDayYear="0000";
        String strDayText="";
        String strWorkPlanName="";
        if (jp != null) {
            startOfDayTime = jp.getStartDateTime();
        }


        try {
            if (Globals.dayStarted) {
                if (!Globals.startOfDayTime.equals("")) {
                    Date startDate = FULL_DATE_FORMAT.parse(Globals.startOfDayTime);
                    Date currSOD =new Date();
                    Date currDate = new Date();
                    if(!Globals.SOD.equals("")){
                        currSOD=Utilities.ConvertToDateTime(Globals.SOD);
                    }
                    if (startDate != null) {
                        TimeZone tz = TimeZone.getDefault();
                        Date now = new Date();
                        int offsetFromUtc = tz.getOffset(now.getTime()); // / 3600000;
                        offsetFromUtc=0;
                        long different = currDate.getTime() - (startDate.getTime() + offsetFromUtc);
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

                        //long elapsedSeconds = different / secondsInMilli;
                        strElapsedHours= (elapsedDays>0 )? (elapsedDays + "d "):"";
                        strElapsedHours += String.valueOf(elapsedHours) + "h";
                        strElapsedMins = String.valueOf(elapsedMinutes) + "m";
                        SimpleDateFormat sdfYear = new SimpleDateFormat("yyyy");
                        SimpleDateFormat sdfDayText = new SimpleDateFormat("EEE, MMM d, yyyy");
                        strDayYear = sdfYear.format(currDate);
                        //strDayText = sdfDayText.format(currDate);
                        strDayText = sdfDayText.format(currSOD);
                    }
                    // Task Count
                    if (jp != null) {
                        if(isShowSession && !jp.getTaskList().get(0).isYardInspection() && !isMaintainer){
                            tvSessions.setVisibility(View.VISIBLE);
                        } else {
                            tvSessions.setVisibility(View.INVISIBLE);
                        }
                        strWorkPlanName=jp.getTitle();
                        strSessionTotal = String.valueOf(jp.getIntervals().getSessions().size());
                        if (jp.getTaskList() != null) {
                            //strTaskTotal = String.valueOf(jp.getTaskList().size());
                            strTaskCurrent = String.valueOf(jp.getCompletedTaskCount());
                            strIssueCount = String.valueOf(jp.getIssueCount());
                        }
                        if(jp.getEndDateTime().equals("")){
                            // Task In-Progress
                            imgBtnSS.setBackgroundResource(R.drawable.stop_btn);
                            tvInspStatus.setText(getResources().getText(R.string.inspection_in_progress));
                            llBtnSS.setVisibility(View.VISIBLE);
                            llBtnSS.setBackgroundColor(getResources().getColor(R.color.color_db_stop));
                            llFinishedStatus.setVisibility(GONE);
                            llTileElapsed.setBackgroundColor(getResources().getColor(R.color.color_organge_light));
                            llTileElapsedSmall.setBackgroundColor(getResources().getColor(R.color.color_db_orange_dark));
                            tvSSBtnText.setText(getResources().getText(R.string.stop_new_theme));
                        }

                    }

                }
            }else{
                //No WorkPlan started

                if (jp != null) {
                    strSessionTotal = String.valueOf(jp.getIntervals().getSessions().size());
                    if (jp.getTaskList() != null) {
                        tvInspStatus.setText(getResources().getText(R.string.no_inspection_started));
                        //strTaskTotal = String.valueOf(jp.getTaskList().size());
                        strTaskCurrent = String.valueOf(jp.getCompletedTaskCount());
                        strIssueCount = String.valueOf(jp.getIssueCount());
                        strWorkPlanName=jp.getTitle();
                        ArrayList<String> elapseArray=jp.getElapsedTime();
                        strElapsedHours=formatElapsedTimeHours(elapseArray);
                        strElapsedMins = formatElapsedTimeMins(elapseArray);
                        if(!jp.getEndDateTime().equals(""))
                        {
                            //Task Closed
                            tvInspStatus.setText(getResources().getText(R.string.inspection_closed_status));
                            llBtnSS.setVisibility(View.GONE);
                            //llFinishedStatus.setVisibility(View.VISIBLE);
                            imgClockIcon.setVisibility(View.INVISIBLE);
                            tvElapsedLabel.setText(getResources().getString(R.string.time_total));
                            llTileElapsed.setBackgroundColor(getResources().getColor(R.color.color_organge_light));
                            llTileElapsedSmall.setBackgroundColor(getResources().getColor(R.color.color_db_orange_dark));
                            tvSessions.setVisibility(View.INVISIBLE);

                        }

                    }

                } else {
                    tvInspStatus.setText(getResources().getText(R.string.no_inspection_started));
                    llBtnSS.setVisibility(View.GONE);
                    llFinishedStatus.setVisibility(View.GONE);
                    imgClockIcon.setVisibility(View.INVISIBLE);
                    tvElapsedLabel.setText(getResources().getString(R.string.time_total));
                    llTileElapsed.setBackgroundColor(getResources().getColor(R.color.color_organge_light));
                    llTileElapsedSmall.setBackgroundColor(getResources().getColor(R.color.color_db_orange_dark));
                    strWorkPlanName = getResources().getString(R.string.no_last_inspection);
                    tvSessions.setVisibility(View.INVISIBLE);
                }

            }
            if(jp == null){
                tvInspStatus.setText(getResources().getText(R.string.no_inspection_started));
                llBtnSS.setVisibility(View.GONE);
                llFinishedStatus.setVisibility(View.GONE);
                imgClockIcon.setVisibility(View.INVISIBLE);
                tvElapsedLabel.setText(getResources().getString(R.string.time_total));
                llTileElapsed.setBackgroundColor(getResources().getColor(R.color.color_organge_light));
                llTileElapsedSmall.setBackgroundColor(getResources().getColor(R.color.color_db_orange_dark));
                strWorkPlanName = getResources().getString(R.string.no_last_inspection);
            }
        }catch (Exception e){
            e.printStackTrace();
        }

        tvTimeElapsedHours.setText(strElapsedHours);
        tvTimeElapsedMins.setText(strElapsedMins);
        tvTaskTotal.setText(strSessionTotal);
        tvTaskCurrent.setText(strTaskCurrent);
        tvIssueCount.setText(strIssueCount);
        tvDayYear.setText(strDayText);
        tvDayText.setText(strWorkPlanName);

    }
    private void refreshSwitchboard(){
        if (Globals.dayStarted) {
//            sessionBtn.setText("DAY END");
//            sessionBtn.setBackgroundColor(getResources().getColor(R.color.end_task_button));
/*
            planBtn.setBackgroundColor(getResources().getColor(R.color.journey_button_light));
            syncBtn.setBackgroundColor(getResources().getColor(R.color.sync_button_light));
            reportBtn.setBackgroundColor(getResources().getColor(R.color.report_button_light));
*/
            //sessionBtn.setBackgroundColor(getResources().getColor(R.color.color_button_disabled));
            btnRun.setBackgroundColor(getResources().getColor(R.color.btn_transparent_background));
            btnBriefing.setBackgroundColor(getResources().getColor(R.color.btn_transparent_background));
            reportBtn.setBackgroundColor(getResources().getColor(R.color.btn_transparent_background));

        } else {
            if(Globals.currDayLocked){
                //              sessionBtn.setText("DAY CLOSED");
            }else{
                //             sessionBtn.setText("DAY START");
            }
            btnSelectRun.setBackgroundColor(getResources().getColor(R.color.btn_transparent_background));
            btnRun.setBackgroundColor(getResources().getColor(R.color.color_button_disabled));
            btnBriefing.setBackgroundColor(getResources().getColor(R.color.color_button_disabled));
            reportBtn.setBackgroundColor(getResources().getColor(R.color.color_button_disabled));
        }
        if(selectedJPlan == null){
            btnSelectRun.setBackgroundColor(getResources().getColor(R.color.btn_transparent_background));
            btnRun.setBackgroundColor(getResources().getColor(R.color.color_button_disabled));
            btnBriefing.setBackgroundColor(getResources().getColor(R.color.color_button_disabled));
            reportBtn.setBackgroundColor(getResources().getColor(R.color.color_button_disabled));
        }
    }

    private  void StartDataSyncService(){
        Globals.IsAutoUpdateEnabled=true;
        dataSyncProcessEx =new DataSyncProcessEx();
        Globals.dataSyncProcessEx=dataSyncProcessEx;
        StartAsyncTaskInParallel(dataSyncProcessEx, this);
        Log.i("StartDataSyncService","Starting Data Sync Service");
    }
    @TargetApi(Build.VERSION_CODES.HONEYCOMB)
    private void StartAsyncTaskInParallel(DataSyncProcessEx task){
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB)
            task.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
        else
            task.execute();
    }

    @TargetApi(Build.VERSION_CODES.HONEYCOMB)
    private void StartAsyncTaskInParallel(DataSyncProcessEx task, Context context){
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB)
            task.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR,context);
        else
            task.execute(context);
    }
    private String formatElapsedTime(ArrayList<String> arrayList){
        String text="";
        if(arrayList.size()>=4){
            text= arrayList.get(0) + "d "+ arrayList.get(1) +"h " + arrayList.get(2) + "m";
        }
        return text;
    }
    private String formatElapsedTimeHours(ArrayList<String> arrayList){
        String text="";
        if(arrayList.size()>=4){
            if(!arrayList.get(0).equals("0")){
                text +=arrayList.get(0) + "d ";
            }
            text +=  arrayList.get(1) +"h ";
        }
        return text;
    }
    private String formatElapsedTimeMins(ArrayList<String> arrayList){
        String text="";
        if(arrayList.size()>=4){
            text +=  arrayList.get(2) +"m ";
        }
        return text;
    }

    public boolean showAlert(Context mContext, String title, String message) {
        Boolean status;
        new AlertDialog.Builder(mContext)
                .setTitle(title)
                .setMessage(message)
                .setIcon(android.R.drawable.ic_dialog_alert)
                .setPositiveButton(R.string.btn_ok, new DialogInterface.OnClickListener() {

                    public void onClick(DialogInterface dialog, int whichButton) {

                    }
                })
                .setNegativeButton(R.string.btn_cancel, null).show();
        return true;

    }
    private void showToastOnUiThread(final String message){
        DashboardActivity.this.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(DashboardActivity.this,message,Toast.LENGTH_SHORT).show();

            }
        });
    }
    public void openSession(){
        String dayToStart="";

        if(!Globals.isInternetAvailable(DashboardActivity.this)){
            //Toast.makeText(DashboardActivity.this,"Network Unavailable!",Toast.LENGTH_SHORT).show();
            showToastOnUiThread(getResources().getString(R.string.network_unavailable));
            return ;

        }
        String listName = Globals.SOD_LIST_NAME;
        JSONObject jo = new JSONObject();
        SimpleDateFormat _formatDay = new SimpleDateFormat("yyyy-MM-dd");
        Date _date = new Date();

        try {
            jo.put("end", "");
            jo.put("endLocation","");
        } catch (Exception e) {
            e.printStackTrace();
        }
        StaticListItem item = new StaticListItem(Globals.orgCode, listName
                , Globals.sodId, "", jo.toString(), "");
        isDayProcessRunning=true;
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                showDialog("Day Unlock","Please wait day unlock process running");
            }
        });
        //db.AddOrUpdateMsgList(Globals.SOD_LIST_NAME, Globals.orgCode, item, Globals.MESSAGE_STATUS_READY_TO_POST);

        ArrayList<StaticListItem> items=new ArrayList<>();
        items.add(item);
        if(webUploadMessageLists(DashboardActivity.this,orgCode,items)==1){
            List<StaticListItem> _items=Globals.getListFromWeb(Globals.SOD_LIST_NAME);
            if(_items.size()>0){
                StaticListItem _item=_items.get(0);
                try {
                    JSONObject joData = new JSONObject(_item.getOptParam1());
                    String day=joData.getString("day");
                    String start=joData.getString("start");
                    String end=joData.optString("end","");
                    if((end.equals("") || end.equals("null")) && day.equals(Globals.SOD)){
                        //Day end successful
                        DBHandler db =Globals.db;//new DBHandler(Globals.getDBContext());
                        db.AddOrUpdateList(Globals.SOD_LIST_NAME,Globals.orgCode,_item);
                        //db.close();
                        showToastOnUiThread("Day unlock successful");
                        DashboardActivity.this.runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                loadDayStatus(DashboardActivity.this);
                                refreshSOD();
                            }
                        });
                    }
                }catch (Exception e){
                    e.printStackTrace();
                }
            }

        }/*
        Globals.SOD = "";
        Globals.dayStarted = false;
        sessionBtn.setText("DAY START");
        sessionBtn.setBackgroundColor(getResources().getColor(R.color.start_button));*/
        isDayProcessRunning=false;
        DashboardActivity.this.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                hideDialog();
            }
        });

    }
    public void startSession(JourneyPlan journeyPlan, String expEnd) {
        //String location = "";
        String dayToStart="";
        /*
        if(!Globals.isInternetAvailable(DashboardActivity.this)){
            //Toast.makeText(DashboardActivity.this,"Network Unavailable!",Toast.LENGTH_SHORT).show();
            showToastOnUiThread(getResources().getString(R.string.network_unavailable));
            return ;

        }
        */
        DBHandler db= Globals.db;
        boolean isServerAvailable=Globals.isServerAvailable();
        Globals.setOfflineMode(!isServerAvailable);

        if(latitude.equals("") || longitude.equals("")){
            location = "0.0" + "," + "0.0";
        } else {
            location = latitude + "," + longitude;
        }
        String listName = Globals.JPLAN_LIST_NAME;
        JSONObject jo = new JSONObject();
        SimpleDateFormat _formatDay = new SimpleDateFormat("yyyy-MM-dd");
        Date curDate = new Date();
        journeyPlan.setuId("");
        journeyPlan.setDate(curDate.toString());
        journeyPlan.setStartDateTime(curDate.toString());
        journeyPlan.setStartLocation(location);
        journeyPlan.setStatus(WORK_PLAN_IN_PROGRESS_STATUS);
        User user = new User();
        user.setEmail(userEmail);
        user.setId(userUID);
        user.setName(Globals.userName);
        journeyPlan.setUser(user);
        journeyPlan.setPrivateKey(inbox.generateLocalJPCode());
        journeyPlan.setCopyAllProps(true);
        JSONObject joWorkPlan=journeyPlan.getJsonObject();

        joWorkPlan.remove("_id");
        final String strJPlanTitle=journeyPlan.getTitle();
        StaticListItem item = new StaticListItem(Globals.orgCode, listName
                , journeyPlan.getPrivateKey(), "", joWorkPlan.toString(), "");
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                showDialog(getResources().getString(R.string.work_plan_starting),getResources().getString(R.string.please_wait) );
            }
        });
        isDayProcessRunning=true;
        ArrayList<StaticListItem> _items =new ArrayList<>();
        _items.add(item);
        saveCurrentJP(journeyPlan.getPrivateKey());
        if(!Globals.offlineMode && Globals.webUploadMessageLists(DashboardActivity.this,Globals.orgCode,_items)==1){
            sleep(500);
            if(Globals.webPullRequest(DashboardActivity.this,"")){
                Globals.inbox=null;
                Globals.selectedJPlan=null;
                Globals.loadInbox(DashboardActivity.this);
                Globals.loadDayStatus(DashboardActivity.this);
                //Log.i("WP Start:",Globals.selectedJPlan.getJsonObject().toString());
                sleep(500);
                if(Globals.dayStarted){
                    makeDocumentsAvailable();
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            hideDialog();
                            Toast.makeText(DashboardActivity.this,getResources().getString(R.string.inspection_started),Toast.LENGTH_SHORT).show();
                            refreshSOD();
                        }
                    });

                }else{

                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            hideDialog();
                            Toast.makeText(DashboardActivity.this,getResources().getString(R.string.unable_to_start_inspection),Toast.LENGTH_SHORT).show();
                        }
                    });
                }
            }
        } else if(Globals.offlineMode){
            //_items.get(0).setCode(journeyPlan.getDate());
            //item.setCode(Utilities.formatMomentDate(curDate));
            db.AddOrUpdateMsgList(Globals.JPLAN_LIST_NAME,orgCode,item, MESSAGE_STATUS_READY_TO_POST);
            Globals.inbox=null;
            Globals.selectedJPlan=null;
            Globals.saveCurrentJP(item.getCode());
            //Globals.loadInbox(DashboardActivity.this);
            Globals.loadDayStatus(DashboardActivity.this);
            //refreshSOD();
            //Log.i("WP Start:",Globals.selectedJPlan.getJsonObject().toString());
            //sleep(500);

        }

        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                refreshSOD();
                hideDialog();
            }
        });
        isDayProcessRunning=false;
        // Check if require to start task
        if(journeyPlan.getTaskList().size() == 1 && isBypassTaskView){
            if(initialRun == null){
                initialRun = journeyPlan.getTaskList().get(0);
            }
            startRun(expEnd);
        }
        //isStartDialog(latitude, longitude);
    }

    private void makeDocumentsAvailable() {
        DynFormList.loadFormList();
        ArrayList<String> fileList=DynFormList.getPdfFileList();
        for(String fileName:fileList){
            if(!Utilities.isDocumentExists(fileName)) {
                if(dialog!=null){
                    final String fileName1=fileName;
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            if(dialog.isShowing()){
                                dialog.setMessage(getString(R.string.downloading_file)+ " "+fileName1);
                            }
                        }
                    });
                }
                Utilities.makeDocAvailableEx(getApplicationContext(), fileName);
            }
        }
    }

    private void sleep(long milis){
        try {
            Thread.sleep(milis);
        }catch (Exception e){

        }
    }
    private void refreshSOD(){
        //Simp2leDateFormat _formatDay = new SimpleDateFormat("yyyy-MM-dd");
        //Date _date = new Date();

        //Globals.SOD = _formatDay.format(_date);
        //Globals.dayStarted = true;
        //currentDate.setText(_formatDay.format(_date));
        //sessionBtn.setText("DAY END");
        //sessionBtn.setBackgroundColor(getResources().getColor(R.color.end_task_button));
        refreshDashboard();
        refreshSwitchboard();
        //Toast.makeText(DashboardActivity.this, "Day Successfully Started", Toast.LENGTH_SHORT).show();


    }

    public void endSession() {
        //Globals.isStopSync = true;
        //String location = "";
/*
        if (getCurrentLocation().size() == 2) {
            location = getCurrentLocation().get(0) + "," + getCurrentLocation().get(1);
        }
*/
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
                                Toast.makeText(DashboardActivity.this, getResources().getString(R.string.complete_all_tasks), Toast.LENGTH_SHORT).show();
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
                        Toast.makeText(DashboardActivity.this,getResources().getString(R.string.unable_to_find_work_plan),Toast.LENGTH_SHORT).show();
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
                showDialog(getResources().getString(R.string.work_plan),getResources().getString(R.string.finishing_inspection));
            }
        });
        Log.i("Message", "Crossing from Inspection finishing dialog");
        Log.i("End time before", jp.getEndDateTime());
        //db.AddOrUpdateMsgList(Globals.SOD_LIST_NAME, Globals.orgCode, item, Globals.MESSAGE_STATUS_READY_TO_POST);

        List<StaticListItem> xItems=db.getMsgListItems(orgCode,"status="
                + MESSAGE_STATUS_READY_TO_POST); //Ready to be posted
        Log.d("Dashboadact","Sixe:"+xItems.size());

        if(!Globals.offlineMode && webUploadMessageLists(DashboardActivity.this,orgCode,items)==1){
            List<StaticListItem> _items=null;
            if(webPullRequest(DashboardActivity.this,"")){
                inbox.loadSampleData(DashboardActivity.this);
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
                                loadDayStatus(DashboardActivity.this);
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
                                loadDayStatus(DashboardActivity.this);
                                refreshSOD();
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
            inbox.loadSampleData(DashboardActivity.this);
            //Globals.loadInbox(DashboardActivity.this);
            Globals.loadDayStatus(DashboardActivity.this);
            //Log.i("WP Start:",Globals.selectedJPlan.getJsonObject().toString());
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    refreshDashboard();
                    refreshSOD();
                }
            });
            sleep(500);

        }

        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Globals.selectedTask = null;
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
                refreshSOD();
                hideDialog();
            }
        });
    }
    private int getPendingTransCount(Context context) {

        DBHandler db =  Globals.db;//new DBHandler(Globals.getDBContext());
        List<StaticListItem> items= db.getMsgListItems(Globals.orgCode,"status="+ MESSAGE_STATUS_READY_TO_POST);
        //db.close();
        return  items.size();
    }
    @Override
    public void update(Observable o, Object arg) {
        Intent intent=(Intent)arg;
        Bundle b1= intent.getExtras();
        final String messageName=b1.getString("messageName");
        final String messageData=b1.getString("messageData");
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                String message="";
                switch (messageName){
                    case Globals.OBSERVABLE_MESSAGE_TOKEN_STATUS:
                        Globals.handleTokenStatus(DashboardActivity.this);
                        break;
                    case Globals.OBSERVABLE_MESSAGE_DATA_CHANGED:
                        //message="Data Changed: (" + messageData +")";
                        if(Globals.changeItemList !=null){
                            if(Globals.changeItemList.size()==0){
                                //First Pull
                                loadInbox(DashboardActivity.this);
                                Globals.loadDayStatus(DashboardActivity.this);
                                refreshSOD();
                                // ListMap.initializeAllLists(DashboardActivity.this);
                            }
                            for(String key:Globals.changeItemList.keySet()){
                                switch (key){
                                    case Globals.MAINTENANCE_LIST_NAME:
                                        if(Globals.inbox !=null){
                                            inbox.loadMaintenance();
                                        }
                                        break;
                                    case Globals.JPLAN_LIST_NAME:
                                        JSONArray ja=Globals.changeItemList.get(key);
                                        for( int i=0;i<ja.length();i++){
                                            try {
                                                String code = ja.getString(i);
                                                if(Globals.selectedJPlan !=null){
                                                    if(Globals.selectedJPlan.getDate().equals(code)){
                                                        Globals.selectedJPlan.refresh(DashboardActivity.this);
                                                    }
                                                }
                                            }catch (Exception e){
                                                e.printStackTrace();
                                            }
                                        }
                                        refreshDashboard();
                                        break;
                                    case Globals.SOD_LIST_NAME:
                                        Globals.loadDayStatus(DashboardActivity.this);
                                        refreshSOD();
                                        break;
                                }
                            }
                        }
                        break;
                    case Globals.OBSERVABLE_MESSAGE_DATA_SENT:
                        //message="Data Sent";
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                imgNetStatus.setImageDrawable(getResources().getDrawable(R.drawable.ic_cloud_queue_white_24dp));
                            }
                        });

                        break;
                    case Globals.OBSERVABLE_MESSAGE_NETWORK_PULL:
                        Log.i("Info","pull");
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                imgNetStatus.setImageDrawable(getResources().getDrawable(R.drawable.ic_cloud_download_white_24dp));

                            }
                        });
                        break;
                    case Globals.OBSERVABLE_MESSAGE_NETWORK_PUSH:
                        Log.i("Info","push");
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                imgNetStatus.setImageDrawable(getResources().getDrawable(R.drawable.ic_cloud_upload_white_24dp));
                            }
                        });
                        break;
                    case Globals.OBSERVABLE_MESSAGE_NETWORK_CONNECTED:
                        msgHandler.sendEmptyMessage(0);
                        Log.i("Info","connected");
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                imgNetStatus.setImageDrawable(getResources().getDrawable(R.drawable.ic_cloud_white_24dp));
                            }
                        });
                        break;
                    case Globals.OBSERVABLE_MESSAGE_NETWORK_DISCONNECTED:
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                imgNetStatus.setImageDrawable(getResources().getDrawable(R.drawable.ic_cloud_off_white_24dp));
                            }
                        });
                        break;
                    case Globals.OBSERVABLE_MESSAGE_LANGUAGE_CHANGED:
                        DashboardActivity.this.recreate();

                }
                if(!message.equals(""))
                    Toast.makeText(DashboardActivity.this,message,Toast.LENGTH_SHORT ).show();
            }
        });


    }
    public ArrayList<String> getCurrentLocation() {
        double latitude;
        double longitude;
        ArrayList<String> loc = new ArrayList<>();
        // create class object
        /*if(gps ==null) {
            gps = new GPSTrackerEx(DashboardActivity.this);
        }*/
        try {
            if (ActivityCompat.checkSelfPermission(this, mPermission)
                    != PackageManager.PERMISSION_GRANTED) {

                ActivityCompat.requestPermissions(this, new String[]{mPermission},
                        REQUEST_CODE_PERMISSION);

                // If any permission above not allowed by user, this condition will
                //execute every time, else your else part will work
            } else if(!canGetLocation(DashboardActivity.this)) {
                showSettingsAlert(DashboardActivity.this);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        if(!canGetLocation(DashboardActivity.this)){
            showSettingsAlert(DashboardActivity.this);
        }
        // check if GPS enabled
        if (canGetLocation(DashboardActivity.this) && cLocation !=null) {
            latitude = cLocation.getLatitude();
            longitude = cLocation.getLongitude();

            loc.add(String.valueOf(latitude));
            loc.add(String.valueOf(longitude));

            return loc;
        } else {
            // can't get location
            // GPS or Network is not enabled
            // Ask user to enable GPS/network in settings
            if(blnShowLocationAlert) {
                if (!isGpsPermissionAvailable()) {
                    requestPermission(this, mPermission, REQUEST_CODE_PERMISSION);
                } else {
                    //gps.showSettingsAlert();
                }
            }
            return loc;
        }

    }

    void showDialog(String title,String message){
        dialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
        dialog.setTitle(title);
        dialog.setMessage(message);
        dialog.setIndeterminate(true);
        dialog.setCanceledOnTouchOutside(false);
        dialog.show();
    }
    void hideDialog(){
        if(dialog!=null){
            if(dialog.isShowing()){
                dialog.dismiss();
            }
        }
    }
    boolean loadCurrentLocation(){
        getCurrentLocation();

        if(!canGetLocation(DashboardActivity.this)){
            Toast.makeText(DashboardActivity.this,getResources().getString(R.string.enable_gps),Toast.LENGTH_SHORT).show();
            return false;
        }
        if (getCurrentLocation().size() == 2) {
            location = getCurrentLocation().get(0) + "," + getCurrentLocation().get(1);
            return true;
        }
        return  false;

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
       /* try {
            ArrayList<String> loc =getCurrentLocation();
            longitude="";
            longitude ="";
            if(loc.size()>0){
                latitude=loc.get(0);
                longitude=loc.get(1);
                //gps.stopUsingGPS();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }*/
        refreshLocation();
    }
    private void refreshLocation(){
        try {
            String locationString=longitude +","+latitude;
            if(latitude.equals("") && longitude.equals("")){
                if(lastKnownLocation!=null){
                    Location _loc = lastKnownLocation;
                    latitude = String.valueOf(_loc.getLatitude());
                    longitude = String.valueOf(_loc.getLongitude());
                    setLocation(tvCurrLocationText, DashboardActivity.this, latitude, longitude);
                    //String locationDesc= Utilities.getLocationAddress(DashboardActivity.this, latitude, longitude);
                    imgGpsIcon.setBackgroundResource(R.drawable.ic_location_on_black_24dp);
                }

            } else if(!longitude.equals("") && !latitude.equals("")){
                setLocation(tvCurrLocationText, DashboardActivity.this, latitude, longitude);
                //String locationDesc= Utilities.getLocationAddress(DashboardActivity.this, latitude, longitude);
                imgGpsIcon.setBackgroundResource(R.drawable.ic_location_on_black_24dp);
            }else
            {
                imgGpsIcon.setBackgroundResource(R.drawable.ic_location_off_black_24dp);
                tvCurrLocationText.setText(GPS_UNAVAILABLE_MSG);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    /*private String getLocationDescription(String location){
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
            Geocoder myLocation = new Geocoder(Globals.DashboardActivity, Locale.getDefault());
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
    }*/
    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);


        // Checks the orientation of the screen
        if (newConfig.orientation == Configuration.ORIENTATION_LANDSCAPE) {
            Toast.makeText(this, "landscape", Toast.LENGTH_SHORT).show();
        } else if (newConfig.orientation == Configuration.ORIENTATION_PORTRAIT){
            Toast.makeText(this, "portrait", Toast.LENGTH_SHORT).show();
        }
    }
    /*public void endMpDialog(View view) {

        android.support.v7.app.AlertDialog.Builder mBuilder = new android.support.v7.app.AlertDialog.Builder(DashboardActivity.this);

        //  Inflate the Layout Resource file you created in Step 1
        View mView = getLayoutInflater().inflate(R.layout.dialog_workplan_end_mp, null);

        //  Get View elements from Layout file. Be sure to include inflated view name (mView)
        final EditText etEndMp = (EditText) mView.findViewById(R.id.et_workplan_end_mp);
        TextView tvEndMsg = (TextView) mView.findViewById(R.id.tv_title_msg_wp_end_mp);
        TextView tvTotalMp = (TextView) mView.findViewById(R.id.tv_title_msg_wp_start_mp_value);
        tvTotalMp.setText("MP" + " " + selectedJPlan.getMpStart() + " to " + "MP" + selectedJPlan.getMpEnd());
        etEndMp.setHint(selectedJPlan.getMpEnd());
        TextInputLayout textInputLayout = (TextInputLayout) mView.findViewById(R.id.ti_end_mp);
        textInputLayout.setHint(selectedJPlan.getMpEnd());

        // Create the AlertDialog using everything we needed from above
        mBuilder.setView(mView);
        // Set up the buttons
        mBuilder.setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                if(etEndMp.getText().toString().equals("")){
                    Toast.makeText(DashboardActivity.this, "Please enter the Milepost to continue", Toast.LENGTH_SHORT).show();
                } else {
                    selectedJPlan.setUserEndMp(etEndMp.getText().toString());
                    new Thread(new Runnable() {
                        @Override
                        public void run() {
                            endSession();
                        }
                    }).start();
                }
                //dialog.dismiss();
                //m_Text = input.getText().toString();
            }
        });
        mBuilder.setNegativeButton(android.R.string.cancel, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.cancel();
            }
        });
        mBuilder.show();
    }*/
    public void isStartDialog(String _lat, String _long ){
        try {
            if(selectedJPlan.getTaskList().size()==1 && isBypassTaskView){
                StartInspectionFragment dialogFragment = new StartInspectionFragment();
                FragmentTransaction ft = getSupportFragmentManager().beginTransaction();

                Bundle bundle = null;
                try {
                    bundle = new Bundle();
                    bundle.putString("latitude", String.valueOf(_lat));
                    bundle.putString("longitude", String.valueOf(_long));
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
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public void isStopDialog(){
        //If configured to display only one clock
        try {
            if(isBypassTaskView&&selectedJPlan.getTaskList().size()==1){
                if(selectedTask == null){
                    selectedTask = selectedJPlan.getTaskList().get(0);
                }
                //If Milepost requested on stop of task
                if((isMpReq&&!selectedTask.getStartTime().equals("")) && !selectedTask.isYardInspection() && !isMaintainer){
                    StopInspectionFragment dialogFragment = new StopInspectionFragment();
                    FragmentTransaction ft = getSupportFragmentManager().beginTransaction();

                    Bundle bundle = null;
                    try {
                        bundle = new Bundle();
                        bundle.putBoolean("notAlertDialog", true);
                        if(cLocation != null){
                            bundle.putString("latitude", String.valueOf(cLocation.getLatitude()));
                            bundle.putString("longitude", String.valueOf(cLocation.getLongitude()));
                        } else {
                            bundle.putString("latitude", latitude);
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
                    new Thread(new Runnable() {
                        @Override
                        public void run() {
                            endTaskAndInspection();
                        }
                    }).start();
                }
            } else {
                if(selectedTask == null){
                    selectedTask = selectedJPlan.getTaskList().get(0);
                }
                if(selectedTask.getStatus().equals(TASK_IN_PROGRESS_STATUS)){
                    String runFinishMsg = "Run is not finished yet! <br> Please finish the run first?";
                    new AlertDialog.Builder(DashboardActivity.this)
                            .setTitle("Alert!")
                            .setMessage(Html.fromHtml(runFinishMsg))
                            .setIcon(android.R.drawable.ic_dialog_alert)
                            .setPositiveButton(R.string.btn_ok, new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int whichButton) {

                                    try {
                                        if (Globals.selectedJPlan != null && Globals.selectedJPlan.getTaskList()!=null) {
                                            if (Globals.selectedJPlan.getTaskList().size() == 1) {
                                                Globals.selectedTask = selectedJPlan.getTaskList().get(0);
                                                Intent intent = new Intent(DashboardActivity.this, TaskDashboardActivity.class);
                                                startActivity(intent);
                                            } else {
                                                Intent intent = new Intent(DashboardActivity.this, InboxActivity.class);
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
                            DashboardActivity.this.runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    Toast.makeText(DashboardActivity.this, getResources().getString(R.string.complete_all_tasks), Toast.LENGTH_SHORT).show();
                                    return;
                                }
                            });
                            return;
                        }
                    }
                }else
                {
                    DashboardActivity.this.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(DashboardActivity.this,getResources().getString(R.string.unable_to_find_work_plan),Toast.LENGTH_SHORT).show();
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
                    if(task.isYardInspection() || isMaintainer){
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
                    }
                }
                jp.setEndDateTime(_date.toString());
                jp.setEndLocation(location);
                jp.setStatus(WORK_PLAN_FINISHED_STATUS);
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
                    showDialog(getResources().getString(R.string.work_plan),getResources().getString(R.string.finishing_inspection));
                }
            });
            Log.i("Message", "Crossing from Inspection finishing dialog");
            //db.AddOrUpdateMsgList(Globals.SOD_LIST_NAME, Globals.orgCode, item, Globals.MESSAGE_STATUS_READY_TO_POST);

            ArrayList<StaticListItem> items=new ArrayList<>();
            items.add(item);
            if(!Globals.offlineMode && webUploadMessageLists(DashboardActivity.this,orgCode,items)==1){
                List<StaticListItem> _items=null;
                if(webPullRequest(DashboardActivity.this,"")){
                    inbox.loadSampleData(DashboardActivity.this);
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
                            DashboardActivity.this.runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    loadDayStatus(DashboardActivity.this);
                                    refreshSOD();
                                }
                            });
                        }
                        /*if (!jp.getEndDateTime().equals("")) {
                            //Day end successful
                            showToastOnUiThread(getResources().getString(R.string.inspection_closed));
                            isDayProcessRunning = false;
                            DashboardActivity.this.runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    loadDayStatus(DashboardActivity.this);
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
                inbox.loadSampleData(DashboardActivity.this);
                //Globals.loadInbox(DashboardActivity.this);
                Globals.loadDayStatus(DashboardActivity.this);
                refreshSOD();
                //Log.i("WP Start:",Globals.selectedJPlan.getJsonObject().toString());
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        refreshDashboard();
                    }
                });
                sleep(500);

            } else {
                Toast.makeText(DashboardActivity.this, "Network Error!", Toast.LENGTH_SHORT).show();
                hideDialog();
                return;
            }

            DashboardActivity.this.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Globals.selectedTask = null;
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
                    tvSessions.setVisibility(View.INVISIBLE);
                    //loadDayStatus(DashboardActivity.this);
                    refreshSOD();
                    hideDialog();
                }
            });
            //Closing Inspection End

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @Override
    public void onFinishStopDialog(String inputText) {
        if(inputText.equals(STOP_INSPECTION_RETURN_MSG_FOR_DASHBOARD)){
            new Thread(new Runnable() {
                @Override
                public void run() {
                    endSession();
                }
            }).start();
        }
    }
    public void startSessionProcess(final JourneyPlan jPlan){
        if(jPlan.getTaskList().size() == 1 && isBypassTaskView){
            if(isMaintainer){
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        jPlan.getTaskList().get(0).setUserStartMp(jPlan.getTaskList().get(0).getMpStart());
                        jPlan.getTaskList().get(0).setUserEndMp(jPlan.getTaskList().get(0).getMpEnd());
                        jPlan.getTaskList().get(0).setInspectionTypeTag("required");
                        jPlan.getTaskList().get(0).setInspectionType("Required Inspection");
                        jPlan.getTaskList().get(0).setInspectionTypeDescription("");
                        jPlan.getTaskList().get(0).setTraverseBy("");
                        jPlan.getTaskList().get(0).setTraverseTrack("");
                        jPlan.getTaskList().get(0).setWeatherConditions("");
                        jPlan.getTaskList().get(0).setTemperature("");
                        jPlan.getTaskList().get(0).setTemperatureUnit("");
                        try {
                            jPlan.getTaskList().get(0).setLocationUnit(Globals.selectedPostSign);
                            jPlan.getTaskList().get(0).setTemperatureUnit(Globals.selectedTempSign);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                        startSession(jPlan,"");
                        Globals.safetyBriefing = null;
                        Globals.listViews = new HashMap<Integer, View>();
                    }}).start();
                return;
            }
            if(isMpReq||isTraverseReq||isWConditionReq||isInspectionTypeReq||showNearByAssets) {
                initialInspection = jPlan;
                Intent intent = new Intent(DashboardActivity.this, StartInspectionActivity.class);
                startActivityForResult(intent, START_INSPECTION_REQUEST_CODE);
            } else {
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        startSession(jPlan,"");
                        Globals.safetyBriefing = null;
                        Globals.listViews = new HashMap<Integer, View>();
                    }}).start();
            }
        } else {
            new Thread(new Runnable() {
                @Override
                public void run() {
                    startSession(jPlan,"");
                    Globals.safetyBriefing = null;
                    Globals.listViews = new HashMap<Integer, View>();
                }}).start();
        }
    }
    public void startInspection(final JourneyPlan jPlan){
        new Thread(new Runnable() {
            @Override
            public void run() {
                startSession(jPlan, "");
                Globals.safetyBriefing = null;
                Globals.listViews = new HashMap<Integer, View>();
            }}).start();
    }
    public void startRun(String expEnd){
        Date now = new Date();
        String selTaskId = Globals.initialRun.getTaskId();
        if(selectedJPlan!=null){
            for (Task task: Globals.selectedJPlan.getTaskList()){
                if(task.getTaskId().equals(selTaskId)){
                    task.setStatus(TASK_IN_PROGRESS_STATUS);
                    task.setStartTime(now.toString());
                    Globals.isTaskStarted = true;
                    Session session = new Session();
                    if(latitude.equals("") || longitude.equals("")){
                        task.setStartLocation("0.0" + "," + "0.0");
                        session.setStartLocation("0.0" + "," + "0.0");
                    } else{
                        task.setStartLocation(latitude + "," + longitude);
                        session.setStartLocation(latitude + "," + longitude);
                    }

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
                    if(appName.equals(Globals.AppName.SCIM)){
                        session.setStart(task.getMpStart());
                        task.setUserStartMp(task.getMpStart());
                        session.setEnd(task.getMpEnd());
                        session.setExpEnd(task.getMpEnd());
                        task.setUserEndMp(task.getMpEnd());
                    } else {
                        session.setStart(initialRun.getUserStartMp());
                        //in case if expected end is unavailable
                        if(expEnd.equals("")){
                            session.setExpEnd(task.getMpEnd());
                            session.setEnd(task.getMpEnd());
                        } else {
                            session.setExpEnd(expEnd);
                            session.setEnd(expEnd);
                        }
                    }
                    selectedJPlan.getIntervals().getSessions().add(session);
                    selectedTask = task;
                }}
            //SimpleDateFormat _format = new SimpleDateFormat("hh:mm:ss aa");
       /* Globals.selectedTask.setStatus(TASK_IN_PROGRESS_STATUS);
        Globals.selectedTask.setStartTime(now.toString());
        Globals.isTaskStarted = true;
        Globals.selectedTask.setStartLocation(latitude + "," + longitude);*/

            if(selectedTask == null){
                selectedTask = selectedJPlan.getTaskList().get(0);
            }
            if(Globals.selectedUnit == null){
                if(selectedTask.getWholeUnitList().size() == 0){
                    Toast.makeText(DashboardActivity.this,getResources().getText(R.string.asset_available), Toast.LENGTH_SHORT).show();
                } else{
                    if(isUseDefaultAsset){
                        for(Units unit: selectedTask.getWholeUnitList()){
                            if(unit.getAttributes().isPrimary()){
                                Globals.selectedUnit = unit;
                            }
                        }
                    }else {
                        selectFirstAsset();
                    }

                }
            }
            //Intent intent = new Intent(TaskDashboardActivity.this, IssuesActivity.class);//Intent intent = new Intent(TaskActivity.this, TaskDetailActivity.class);
            if(selectedJPlan.getWorkplanTemplateId().equals("")){
                Log.i("WPLAN ID ", "ID is empty");
            }
            Globals.selectedJPlan.update();
            if(selectedJPlan.getWorkplanTemplateId().equals("")){
                Log.i("WPLAN ID ", "ID is empty");
            }
            //Globals.selectedJPlan=Globals.inbox.refreshJP(selectedJPlan);
            //selectedTask = null;
            initialRun = null;
            initialInspection = null;
        }

        //loadTaskDetails();
        //startActivity(intent);
    }
    private void selectFirstAsset(){
        for (Units unit: selectedTask.getWholeUnitList()){
            if(!unit.getAssetTypeObj().isLocation()){
                selectedUnit = unit;
                break;
            }
        }
    }
    private void setLocation(final TextView view, final Context context, final String _latitude, final String _longitude){
        final String[] location = new String[1];
        final String locationString=longitude +","+latitude;
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
    /*private void findAndSetYardInspection(){
        if(selectedTask!=null){
            for(Units asset: selectedTask.getWholeUnitList()){
                if(asset.getAssetTypeObj().isMarkerMilepost()){
                    selectedTask.setYardInspection(true);
                    break;
                }
            }
        } else if(selectedJPlan!=null){
            for(Units asset: selectedJPlan.getTaskList().get(0).getWholeUnitList()){
                if(asset.getAssetTypeObj().isMarkerMilepost()){
                    selectedJPlan.getTaskList().get(0).setYardInspection(true);
                    break;
                }
            }
        }
    }*/
}

