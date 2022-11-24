package com.app.ps19.tipsapp;

import android.Manifest;
import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.location.Location;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.text.method.ScrollingMovementMethod;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;

import com.app.ps19.tipsapp.Shared.DBHandler;
import com.app.ps19.tipsapp.Shared.DataSyncProcessEx;
import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.Shared.ListMap;
import com.app.ps19.tipsapp.Shared.ObservableObject;
import com.app.ps19.tipsapp.Shared.StaticListItem;
import com.app.ps19.tipsapp.Shared.Utilities;
import com.app.ps19.tipsapp.classes.Inbox;
import com.app.ps19.tipsapp.classes.JourneyPlan;
import com.app.ps19.tipsapp.classes.User;
import com.app.ps19.tipsapp.location.Interface.OnLocationUpdatedListener;
import com.app.ps19.tipsapp.location.LocationUpdatesService;
import com.app.ps19.tipsapp.safetyBriefing.SafetyBriefingActivity;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Observable;
import java.util.Observer;
import java.util.TimeZone;

import static android.view.View.GONE;
import static com.app.ps19.tipsapp.Shared.Globals.WORK_PLAN_FINISHED_STATUS;
import static com.app.ps19.tipsapp.Shared.Globals.WORK_PLAN_IN_PROGRESS_STATUS;
import static com.app.ps19.tipsapp.Shared.Globals.blnFreshLogin;
import static com.app.ps19.tipsapp.Shared.Globals.dayStarted;
import static com.app.ps19.tipsapp.Shared.Globals.inbox;
import static com.app.ps19.tipsapp.Shared.Globals.isDayProcessRunning;
import static com.app.ps19.tipsapp.Shared.Globals.loadDayStatus;
import static com.app.ps19.tipsapp.Shared.Globals.loadInbox;
import static com.app.ps19.tipsapp.Shared.Globals.orgCode;
import static com.app.ps19.tipsapp.Shared.Globals.selectedJPlan;
import static com.app.ps19.tipsapp.Shared.Globals.setSelectedTask;
import static com.app.ps19.tipsapp.Shared.Globals.userEmail;
import static com.app.ps19.tipsapp.Shared.Globals.userUID;
import static com.app.ps19.tipsapp.Shared.Globals.webPullRequest;
import static com.app.ps19.tipsapp.Shared.Globals.webUploadMessageLists;

//import com.app.ps19.tipsapp.Shared.GPSTrackerEx;

public class MainActivity extends AppCompatActivity implements
        Observer,
        OnLocationUpdatedListener {
    // Updated GPS location service code
    // Start
        private static final String TAG = "resPMain";

        // Used in checking for runtime permissions.
//        private static final int REQUEST_PERMISSIONS_REQUEST_CODE = 34;

//        // The BroadcastReceiver used to listen from broadcasts from the service.
//        private MyReceiver mLocationUpdateReciever;
//
//        // A reference to the service used to get location updates.
//        @SuppressLint("StaticFieldLeak")
//        private static LocationUpdatesService mService = null;
//
//        // Tracks the bound state of the service.
//        private boolean mBound = false;
//
//        // UI elements.
//       // private Button mRequestLocationUpdatesButton;
//       // private Button mRemoveLocationUpdatesButton;
//
//        // Monitors the state of the connection to the service.
//        private final ServiceConnection mServiceConnection = new ServiceConnection() {
//
//            @Override
//            public void onServiceConnected(ComponentName name, IBinder service) {
//                LocationUpdatesService.LocalBinder binder = (LocationUpdatesService.LocalBinder) service;
//                if (mService == null) {
//                    mService = binder.getService();
//                    mService.requestLocationUpdates();
//                }
//                else{
//                    mService.requestLocationUpdates();
//                }
//                mBound = true;
//            }
//
//            @Override
//            public void onServiceDisconnected(ComponentName name) {
//                mService = null;
//                mBound = false;
//            }
//        };

//    @Override
//    public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, String key) {
//
//    }

//    /**
//     * Receiver for broadcasts sent by {@link LocationUpdatesService}.
//     */
//    private class MyReceiver extends BroadcastReceiver {
//        @RequiresApi(api = Build.VERSION_CODES.KITKAT)
//        @Override
//        public void onReceive(Context context, Intent intent) {
//            Location mLocation = intent.getParcelableExtra(LocationUpdatesService.EXTRA_LOCATION);
//            if (location != null) {
//                cLocation = mLocation;
//                latitude = String.valueOf(mLocation.getLatitude());
//                longitude = String.valueOf(mLocation.getLongitude());
//                refreshLocation();
//                /*Toast.makeText(MainActivity.this, Utils.getLocationText(mLocation),
//                        Toast.LENGTH_SHORT).show();*/
//            }
//        }
//    }
    /**
     * Returns the current state of the permissions needed.
     */
//    private boolean checkPermissions() {
//        return PackageManager.PERMISSION_GRANTED == ActivityCompat.checkSelfPermission(this,
//                Manifest.permission.ACCESS_FINE_LOCATION) &&
//                PackageManager.PERMISSION_GRANTED == ActivityCompat.checkSelfPermission(this,
//                        Manifest.permission.ACCESS_COARSE_LOCATION) &&
//                PackageManager.PERMISSION_GRANTED == ActivityCompat.checkSelfPermission(this,
//                        Manifest.permission.ACCESS_BACKGROUND_LOCATION);
//    }
//
//    public static boolean hasPermissions(Context context, String... permissions) {
//        if (context != null && permissions != null) {
//            for (String permission : permissions) {
//                if (ActivityCompat.checkSelfPermission(context, permission) != PackageManager.PERMISSION_GRANTED) {
//                    return false;
//                }
//            }
//        }
//        return true;
//    }
//
//    private void requestPermissions() {
//
//        int PERMISSION_ALL = 1;
//        String[] PERMISSIONS = {
//                Manifest.permission.ACCESS_FINE_LOCATION,
//                Manifest.permission.ACCESS_COARSE_LOCATION,
//                Manifest.permission.ACCESS_BACKGROUND_LOCATION
//        };
//
//        if (!hasPermissions(this, PERMISSIONS)) {
//            ActivityCompat.requestPermissions(this, PERMISSIONS, PERMISSION_ALL);
//        }
//
//
//        boolean shouldProvideRationale =
//                ActivityCompat.shouldShowRequestPermissionRationale(this,
//                        Manifest.permission.ACCESS_FINE_LOCATION);
//
//        if (!shouldProvideRationale) {
//            shouldProvideRationale =
//                    ActivityCompat.shouldShowRequestPermissionRationale(this,
//                            Manifest.permission.ACCESS_BACKGROUND_LOCATION);
//        }
//        // Provide an additional rationale to the user. This would happen if the user denied the
//        // request previously, but didn't check the "Don't ask again" checkbox.
//        if (shouldProvideRationale) {
//            Log.i(TAG, "Displaying permission rationale to provide additional context.");
//            /*Snackbar.make(
//                    findViewById(R.layout.activity_main),
//                    R.string.permission_rationale,
//                    Snackbar.LENGTH_INDEFINITE)
//                    .setAction(R.string.ok, new View.OnClickListener() {
//                        @Override
//                        public void onClick(View view) {
//                            // Request permission
//                            ActivityCompat.requestPermissions(MainActivity.this,
//                                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
//                                    REQUEST_PERMISSIONS_REQUEST_CODE);
//                        }
//                    })
//                    .show();*/
//        } else {
//            Log.i(TAG, "Requesting permission");
//            // Request permission. It's possible this can be auto answered if device policy
//            // sets the permission in a given state or the user denied the permission
//            // previously and checked "Never ask again".
//            ActivityCompat.requestPermissions(this, PERMISSIONS, PERMISSION_ALL);
////            ActivityCompat.requestPermissions(this,
////                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
////                    REQUEST_PERMISSIONS_REQUEST_CODE);
//        }
//    }

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


    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @Override
    public void onLocationUpdated(Location mLocation) {

        if(!LocationUpdatesService.canGetLocation() || mLocation.getProvider().equals("None")) { Utilities.showSettingsAlert(MainActivity.this); return; }

        if (location != null) {
            cLocation = mLocation;
            latitude = String.valueOf(mLocation.getLatitude());
            longitude = String.valueOf(mLocation.getLongitude());
            refreshLocation();
                /*Toast.makeText(MainActivity.this, Utils.getLocationText(mLocation),
                        Toast.LENGTH_SHORT).show();*/
        }
    }

    @Override
    protected void onStop() {
//Remove Location Updates
            LocationUpdatesService.removeLocationUpdateListener(this.getClass().getSimpleName());
//        if (mBound) {
//            // Unbind from the service. This signals to the service that this activity is no longer
//            // in the foreground, and the service can respond by promoting itself to a foreground
//            // service.
//            unbindService(mServiceConnection);
//            mBound = false;
//        }
//        PreferenceManager.getDefaultSharedPreferences(this)
//                .unregisterOnSharedPreferenceChangeListener(this);
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

//Remove Location Updates
        LocationUpdatesService.removeLocationUpdateListener(this.getClass().getSimpleName());
//        if (mBound) {
//            // Unbind from the service. This signals to the service that this activity is no longer
//            // in the foreground, and the service can respond by promoting itself to a foreground
//            // service.
//            unbindService(mServiceConnection);
//            mBound = false;
//        }
//        if(mService!=null){
//            mService.removeLocationUpdates();
//        }
        //gps.stopUsingGPS();

        //Intent myService = new Intent(MainActivity.this, GPSService.class);
        //stopService(myService);
    }
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        switch(keyCode){
            case KeyEvent.KEYCODE_BACK:


                //RemoveLocation Updates
                LocationUpdatesService.removeLocationUpdateListener(this.getClass().getSimpleName());
                // do something here
                //gps.unbindService();
//                if (mBound) {
//                    // Unbind from the service. This signals to the service that this activity is no longer
//                    // in the foreground, and the service can respond by promoting itself to a foreground
//                    // service.
//                    unbindService(mServiceConnection);
//                    mBound = false;
//                }
                finish();
                return true;
        }
        return super.onKeyDown(keyCode, event);
    }
    @Override
    public void onPause() {
        super.onPause();
        try {

            //Remove Location Updates
            LocationUpdatesService.removeLocationUpdateListener(this.getClass().getSimpleName());
//            LocalBroadcastManager.getInstance(this).unregisterReceiver(mLocationUpdateReciever);
            super.onPause();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @Override
    public void onStart() {
        super.onStart();
        //Listen to location Updates
        LocationUpdatesService.addOnLocationUpdateListener( this.getClass().getSimpleName() , this);
        /*if(gps== null){
            gps = new GPSTrackerEx(MainActivity.this);
        }*/

//        if (!checkPermissions()) {
//            requestPermissions();
//        } else {
//            if(mService!=null){
//                mService.requestLocationUpdates();
//            }
//        }

//        bindService(new Intent(MainActivity.this, LocationUpdatesService.class), mServiceConnection,
//                Context.BIND_AUTO_CREATE);
//        PreferenceManager.getDefaultSharedPreferences(this)
//                .registerOnSharedPreferenceChangeListener(this);
        // Restore the state of the buttons when the activity (re)launches.
        //setButtonsState(Utils.requestingLocationUpdates(this));

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
            //Listen to location Updates
            LocationUpdatesService.addOnLocationUpdateListener( this.getClass().getSimpleName() , this);
            /*if(gps== null){
                gps = new GPSTrackerEx(MainActivity.this);
            }*/
//            LocalBroadcastManager.getInstance(this).registerReceiver(mLocationUpdateReciever,
//                    new IntentFilter(LocationUpdatesService.ACTION_BROADCAST));
        }catch (Exception e){
            e.printStackTrace();
        }
    }


    // End

    // APIInterface apiInterface;
    static {
        AppCompatDelegate.setCompatVectorFromResourcesEnabled(true);
    }
    public static final String GPS_UNAVAILABLE_MSG = "GPS Location unavailable !";
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
    Button sessionBtn;
    Button syncBtn;
    Button planBtn;
    Button reportBtn;
    ImageView syncStatusIcon;
    ImageView userImage;
   // GPSTrackerEx gps;
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

    int secCounter=0;
    boolean blnGpsIcon =false, blnClockIcon = false;
    String workPlanStatus=""; //
    String longitude="", latitude ="";
    boolean blnShowLocationAlert=false;
    boolean blnEnforceTaskCompleteRule=false;
    //end
    Thread threadScreenUpdate=null;

    @SuppressLint("HandlerLeak")
    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Globals.checkLanguage(this);
        //-------------------GPS Code--------------
//        mLocationUpdateReciever = new MyReceiver();
        // Check that the user hasn't revoked permissions by going to Settings.
//        if (Utils.requestingLocationUpdates(this)) {
//            if (!checkPermissions()) {
//                requestPermissions();
//            }
//        }
        //--------------------END-------------------
        setContentView(R.layout.activity_main);
        currentDate = (TextView) findViewById(R.id.sodDateTxt);
        elapsedTxtView = (TextView) findViewById(R.id.elapsedTxt);
        reportedTxtView = (TextView) findViewById(R.id.reportedIssuesTxt);
        inspTxtView = (TextView) findViewById(R.id.inspTxt);
        userImage = (ImageView) findViewById(R.id.userImgView);
        userNameView = (TextView) findViewById(R.id.userNameTxt);
        elapsedTxtView.setText("0h 0m");
        reportedTxtView.setText("3");
        inspTxtView.setText("5");
		ObservableObject.getInstance().addObserver(this);
        syncStatusIcon = (ImageView) findViewById(R.id.syncStatusIcon);
        //Globals.setUserInfoView(this,userImage, userNameView);
        ListMap.initializeAllLists(this);
        dialog=new ProgressDialog(this); // this = YourActivity
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

        tvDayText.setMovementMethod(new ScrollingMovementMethod());
        //-----------------------------------------------------------
        refreshDashboard();
        sessionBtn = (Button) findViewById(R.id.startBtn);
        syncBtn = (Button) findViewById(R.id.syncBtn);
        planBtn = (Button) findViewById(R.id.planBtn);
        reportBtn = (Button) findViewById(R.id.reportsBtn);
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

        refreshSwitchboard();
        //TODO: GPS HERE
//        if(gps == null){
//            gps = new GPSTrackerEx(MainActivity.this);
//        }
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
                            if(dayStarted) {
                                runOnUiThread(new Runnable() {
                                    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
                                    @Override
                                    public void run() {
                                        if(secCounter % 10 == 0){
                                            if(latitude.equals("")) {
                                                tryLocation();
                                                //TODO: GPS HERE
//                                                if(gps!=null){
//                                                    if(gps.isGPSEnabled()){
//
//                                                    }
//                                                }

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
                                    MainActivity.this.runOnUiThread(new Runnable() {
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

                            if(secCounter==30) {
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
                        e.printStackTrace();
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

                    new AlertDialog.Builder(MainActivity.this)
                            .setTitle("Confirmation!")
                            .setMessage("Do you really want to open closed Session?")
                            .setIcon(android.R.drawable.ic_dialog_alert)
                            .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int whichButton) {
                                    //Toast.makeText(MainActivity.this, "Successfully Started", Toast.LENGTH_SHORT).show();

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
        sessionBtn.setOnClickListener(new View.OnClickListener() {
            @RequiresApi(api = Build.VERSION_CODES.KITKAT)
            @Override
            public void onClick(View view) {
                if(dayStarted){
                    //Close WorkPlan
                    //Toast.makeText(MainActivity.this,"CLOSE Work Plan",Toast.LENGTH_SHORT).show();
                }else{
                    blnShowLocationAlert=true;
                    tryLocation();
                    blnShowLocationAlert=false;
                    if(latitude.equals("") || longitude.equals("") ){//|| !gps.canGetLocation()){////TODO: GPS HERE
                        Toast.makeText(MainActivity.this,GPS_UNAVAILABLE_MSG,Toast.LENGTH_SHORT).show();
                        return ;
                    }
                    tryLocation();
                    //Select WorkPlan
                    /*SelectWorkPlanDialogFragment selectBox=SelectWorkPlanDialogFragment.newInstance("SELECT WORK PLAN");
                    selectBox.setOnDialogClicked(new IOnDialogClicked() {
                        @Override
                        public void onOkayClicked(JourneyPlan jp) {
                            final JourneyPlan journeyPlan=jp;
                            //Toast.makeText(MainActivity.this,"Selected: " + jp.getTitle(),Toast.LENGTH_SHORT).show();
                            new AlertDialog.Builder(MainActivity.this)
                                    .setTitle("Confirmation!")
                                    .setMessage("Do you really want to start "+ jp.getTitle() +"?")
                                    .setIcon(android.R.drawable.ic_dialog_alert)
                                    .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
                                        public void onClick(DialogInterface dialog, int whichButton) {
                                            //Toast.makeText(MainActivity.this, "Successfully Stopped", Toast.LENGTH_SHORT).show();
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
                    Intent intent = new Intent( MainActivity.this, WorkPlanActivity.class);
                    startActivityForResult(intent, 1);
                   // selectBox.show(getFragmentManager(),"SELECT WORK PLAN");

                    //Toast.makeText(MainActivity.this,"SELECT Work Plan",Toast.LENGTH_SHORT).show();
                }

            }
        });
       tryLocation();
        syncBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
               if(Globals.dayStarted){
                   Intent intent = new Intent(MainActivity.this, SafetyBriefingActivity.class);
                   // Intent intent =new Intent(MainActivity.this,ScribbleNotesActivity.class);
                   Bundle b=new Bundle();
                   b.putString("filename","");
                   //intent.putExtras(b);
                   startActivityForResult(intent,1);
               }
                //Temporary commented for Testing only
                   /*  Globals.timeStamp="";
                  if(Globals.blnNetAvailable)
                    Toast.makeText(MainActivity.this, getResources().getText(R.string.sync_service_running), Toast.LENGTH_SHORT).show();
                  else
                      Toast.makeText(MainActivity.this, getResources().getText(R.string.network_unavailable), Toast.LENGTH_SHORT).show();*/
               //}
            }
        });
        planBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (Globals.dayStarted) {
                    if(Globals.selectedJPlan.getTaskList().size() == 1){
                        setSelectedTask(selectedJPlan.getTaskList().get(0));
                        Intent intent = new Intent(MainActivity.this, TaskDashboardActivity.class);
                        startActivity(intent);
                    } else {
                        Intent intent = new Intent(MainActivity.this, InboxActivity.class);
                        startActivity(intent);
                    }
                }
            }
        });
        reportBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (Globals.dayStarted) {
                    Intent intent = new Intent(MainActivity.this, ReportInboxActivity.class);
                    startActivity(intent);
                }
            }
        });

        llBtnSS.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Toast.makeText(MainActivity.this, getResources().getText(R.string.long_press_to_continue),Toast.LENGTH_SHORT).show();
            }
        });
        llBtnSS.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View view) {
                if(dayStarted){
                    blnShowLocationAlert=true;
                    tryLocation();
                    blnShowLocationAlert=false;
                    if(latitude.equals("")|| longitude.equals("") ){//|| !gps.canGetLocation()){//TODO: GPS HERE
                        Toast.makeText(MainActivity.this,GPS_UNAVAILABLE_MSG,Toast.LENGTH_SHORT).show();
                        return true;
                    }
                    new AlertDialog.Builder(MainActivity.this)
                            .setTitle(getResources().getText(R.string.confirmation))
                            .setMessage(getResources().getText(R.string.want_to_stop_inspection))
                            .setIcon(android.R.drawable.ic_dialog_alert)
                            .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int whichButton) {
                                    //Toast.makeText(MainActivity.this, "Successfully Stopped", Toast.LENGTH_SHORT).show();
                                    new Thread(new Runnable() {
                                        @Override
                                        public void run() {
                                            endSession();
                                        }
                                    }).start();
                                }
                            })
                            .setNegativeButton(android.R.string.no, null).show();

                }
                return true;
            }
        });
        tvServiceStatus=(TextView) findViewById(R.id.tvServiceStatus_ma);
        //Globals.mainActivity = this;
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
                progressDialog.dismiss();
                super.handleMessage(msg);
            }

        };

    }
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
       /* if (!Debug.isDebuggerConnected()) {
            Debug.waitForDebugger();
            Log.d("debug", "started"); // Insert a breakpoint at this line!!
        }*/
        //if (requestCode == 100) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == RESULT_OK) {
            String selection = data.getStringExtra("Selection");
            if (selection.equals("Yes")) {
                //Bundle extras = data.getExtras();
                final int position = data.getIntExtra("Position", -1);
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        JourneyPlan journeyPlan = inbox.getWorkPlanTemplates().get(position);
                        startSession(journeyPlan);
                    }
                }).start();

            }
        }
        //}
    }

    private void refreshDashboard() {
        boolean blnDataChanged =false;
        if (Globals.inbox == null) {
            Globals.inbox = new Inbox();
            if(Globals.mainActivity==null){
                //Globals.mainActivity=MainActivity.this;
            }
            Globals.inbox.loadSampleData(MainActivity.this);
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
        String strTaskTotal="0";
        String strTaskCurrent="0";
        String strIssueCount="0";
        String strDayYear="0000";
        String strDayText="";
        String strWorkPlanName="";


        try {
            if (Globals.dayStarted) {
                if (!Globals.startOfDayTime.equals("")) {
                    Date startDate = new Date(Globals.startOfDayTime);
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
                        strWorkPlanName=jp.getTitle();
                        if (jp.getTaskList() != null) {
                            strTaskTotal = String.valueOf(jp.getTaskList().size());
                            strTaskCurrent = String.valueOf(jp.getCompletedTaskCount());
                            strIssueCount = String.valueOf(jp.getIssueCount());
                        }
                        if(jp.getEndDateTime().equals("")){
                            // Task In-Progress
                            imgBtnSS.setBackgroundResource(R.drawable.stop_btn);
                            llBtnSS.setVisibility(View.VISIBLE);
                            llBtnSS.setBackgroundColor(getResources().getColor(R.color.color_db_stop));
                            llFinishedStatus.setVisibility(GONE);
                            llTileElapsed.setBackgroundColor(getResources().getColor(R.color.color_organge_light));
                            llTileElapsedSmall.setBackgroundColor(getResources().getColor(R.color.color_db_orange_dark));
                            tvSSBtnText.setText(getResources().getText(R.string.stop));


                        }

                    }

                }
            }else{
                //No WorkPlan started

                if (jp != null) {
                    if (jp.getTaskList() != null) {
                        strTaskTotal = String.valueOf(jp.getTaskList().size());
                        strTaskCurrent = String.valueOf(jp.getCompletedTaskCount());
                        strIssueCount = String.valueOf(jp.getIssueCount());
                        strWorkPlanName=jp.getTitle();
                        ArrayList<String> elapseArray=jp.getElapsedTime();
                        strElapsedHours=formatElapsedTimeHours(elapseArray);
                        strElapsedMins = formatElapsedTimeMins(elapseArray);
                        if(!jp.getEndDateTime().equals(""))
                        {
                            //Task Closed
                            llBtnSS.setVisibility(View.GONE);
                            llFinishedStatus.setVisibility(View.VISIBLE);
                            imgClockIcon.setVisibility(View.INVISIBLE);
                            tvElapsedLabel.setText(getResources().getString(R.string.time_total));
                            llTileElapsed.setBackgroundColor(getResources().getColor(R.color.color_organge_light));
                            llTileElapsedSmall.setBackgroundColor(getResources().getColor(R.color.color_db_orange_dark));

                        }

                    }

                } else {
                    llBtnSS.setVisibility(View.GONE);
                    llFinishedStatus.setVisibility(View.GONE);
                    imgClockIcon.setVisibility(View.INVISIBLE);
                    tvElapsedLabel.setText(getResources().getString(R.string.time_total));
                    llTileElapsed.setBackgroundColor(getResources().getColor(R.color.color_organge_light));
                    llTileElapsedSmall.setBackgroundColor(getResources().getColor(R.color.color_db_orange_dark));
                    strWorkPlanName = getResources().getString(R.string.no_last_inspection);
                }

            }
        }catch (Exception e){
            e.printStackTrace();
        }

        tvTimeElapsedHours.setText(strElapsedHours);
        tvTimeElapsedMins.setText(strElapsedMins);
        tvTaskTotal.setText(strTaskTotal);
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
            sessionBtn.setBackgroundColor(getResources().getColor(R.color.color_button_disabled));
            planBtn.setBackgroundColor(getResources().getColor(R.color.color_button_enabled));
            syncBtn.setBackgroundColor(getResources().getColor(R.color.color_button_enabled));
            reportBtn.setBackgroundColor(getResources().getColor(R.color.color_button_enabled));

        } else {
            if(Globals.currDayLocked){
  //              sessionBtn.setText("DAY CLOSED");
            }else{
   //             sessionBtn.setText("DAY START");
            }
            sessionBtn.setBackgroundColor(getResources().getColor(R.color.color_button_enabled));
            planBtn.setBackgroundColor(getResources().getColor(R.color.color_button_disabled));
            syncBtn.setBackgroundColor(getResources().getColor(R.color.color_button_disabled));
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
                .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {

                    public void onClick(DialogInterface dialog, int whichButton) {

                    }
                })
                .setNegativeButton(android.R.string.no, null).show();
        return true;

    }
    private void showToastOnUiThread(final String message){
        MainActivity.this.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(MainActivity.this,message,Toast.LENGTH_SHORT).show();

            }
        });
    }
    public void openSession(){
        String dayToStart="";

        if(!Globals.isInternetAvailable(MainActivity.this)){
            //Toast.makeText(MainActivity.this,"Network Unavailable!",Toast.LENGTH_SHORT).show();
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
        if(webUploadMessageLists(MainActivity.this,orgCode,items)==1){
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
                        MainActivity.this.runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                loadDayStatus(MainActivity.this);
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
        MainActivity.this.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                hideDialog();
            }
        });

    }
    public void startSession(JourneyPlan journeyPlan) {
        //String location = "";
        String dayToStart="";

        if(!Globals.isInternetAvailable(MainActivity.this)){
            //Toast.makeText(MainActivity.this,"Network Unavailable!",Toast.LENGTH_SHORT).show();
            showToastOnUiThread(getResources().getString(R.string.network_unavailable));
            return ;

        }
        location = latitude + "," + longitude;
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
        journeyPlan.setCopyAllProps(true);
        JSONObject joWorkPlan=journeyPlan.getJsonObject();

        joWorkPlan.remove("_id");
        final String strJPlanTitle=journeyPlan.getTitle();
        StaticListItem item = new StaticListItem(Globals.orgCode, listName
                , "", "", joWorkPlan.toString(), "");
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                showDialog(getResources().getString(R.string.work_plan_starting),getResources().getString(R.string.please_wait) );
            }
        });
        isDayProcessRunning=true;
        ArrayList<StaticListItem> _items =new ArrayList<>();
        _items.add(item);
        if(Globals.webUploadMessageLists(MainActivity.this,Globals.orgCode,_items)==1){
            sleep(500);
            if(Globals.webPullRequest(MainActivity.this,"")){
                Globals.inbox=null;
                Globals.selectedJPlan=null;
                Globals.loadInbox(MainActivity.this);
                Globals.loadDayStatus(MainActivity.this);
                //Log.i("WP Start:",Globals.selectedJPlan.getJsonObject().toString());
                sleep(500);
                if(Globals.dayStarted){
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            hideDialog();
                            Toast.makeText(MainActivity.this,getResources().getString(R.string.inspection_started),Toast.LENGTH_SHORT).show();
                            refreshSOD();
                        }
                    });

                }else{

                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            hideDialog();
                            Toast.makeText(MainActivity.this,getResources().getString(R.string.unable_to_start_inspection),Toast.LENGTH_SHORT).show();
                        }
                    });
                }
            }
        }
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                hideDialog();
            }
        });
        isDayProcessRunning=false;
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
        //Toast.makeText(MainActivity.this, "Day Successfully Started", Toast.LENGTH_SHORT).show();


    }

    public void endSession() {
        //String location = "";
/*
        if (getCurrentLocation().size() == 2) {
            location = getCurrentLocation().get(0) + "," + getCurrentLocation().get(1);
        }
*/
        location=latitude +","+longitude;
        JourneyPlan jp=Globals.selectedJPlan;
        if(Globals.inbox != null){
            jp =Globals.inbox.getCurrentJourneyPlan();
            if(jp !=null){
                final int taskCount = jp.getTaskList().size();
                final int taskCompleted= jp.getCompletedTaskCount();
                if(blnEnforceTaskCompleteRule) {
                    if (taskCount != taskCompleted) {
                        MainActivity.this.runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                Toast.makeText(MainActivity.this, getResources().getString(R.string.complete_all_tasks), Toast.LENGTH_SHORT).show();
                                return;
                            }
                        });
                        return;
                    }
                }
            }else
            {
                MainActivity.this.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Toast.makeText(MainActivity.this,getResources().getString(R.string.unable_to_find_work_plan),Toast.LENGTH_SHORT).show();
                        return;
                    }
                });
                return;

            }
        }


        String listName = Globals.JPLAN_LIST_NAME;
        JSONObject jo = null;

        Date _date = new Date();

        try {
            jp.setEndDateTime(_date.toString());
            jp.setEndLocation(location);
            jp.setStatus(WORK_PLAN_FINISHED_STATUS);
            jo=jp.getJsonObject();
        } catch (Exception e) {
            e.printStackTrace();
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
        //db.AddOrUpdateMsgList(Globals.SOD_LIST_NAME, Globals.orgCode, item, Globals.MESSAGE_STATUS_READY_TO_POST);

        ArrayList<StaticListItem> items=new ArrayList<>();
        items.add(item);
        if(webUploadMessageLists(MainActivity.this,orgCode,items)==1){
            List<StaticListItem> _items=null;
            if(webPullRequest(MainActivity.this,"")){
                    inbox.loadSampleData(MainActivity.this);
                    jp = inbox.getCurrentJourneyPlan();
                    if(jp !=null) {
                        selectedJPlan=jp;
                        if (!jp.getEndDateTime().equals("")) {
                            //Day end successful
                            showToastOnUiThread(getResources().getString(R.string.inspection_closed));
                            isDayProcessRunning = false;
                            MainActivity.this.runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    loadDayStatus(MainActivity.this);
                                    refreshSOD();
                                }
                            });
                        }
                        if (!jp.getEndDateTime().equals("")) {
                            //Day end successful
                            showToastOnUiThread(getResources().getString(R.string.inspection_closed));
                            isDayProcessRunning = false;
                            MainActivity.this.runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    loadDayStatus(MainActivity.this);
                                    refreshSOD();
                                }
                            });
                        }

                    }
            }
        }

        MainActivity.this.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                setSelectedTask( null);
                Globals.selectedUnit = null;
                Globals.safetyBriefing = null;
                Globals.selectedWorker = null;
                Globals.selectedJPlan = null;
                Globals.imageFileName = null;
                Globals.defectCodeSelection = null;
                Globals.newReport = null;
                Globals.selectedDUnit = null;
                isDayProcessRunning=false;
                hideDialog();
            }
        });
    }
    private int getPendingTransCount(Context context) {

        DBHandler db = Globals.db;//new DBHandler(Globals.getDBContext());
        List<StaticListItem> items= db.getMsgListItems(Globals.orgCode,"status="+Globals.MESSAGE_STATUS_READY_TO_POST);
        db.close();
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
                        Globals.handleTokenStatus(MainActivity.this);
                        break;
                    case Globals.OBSERVABLE_MESSAGE_DATA_CHANGED:
                        //message="Data Changed: (" + messageData +")";
                        if(Globals.changeItemList !=null){
                            if(Globals.changeItemList.size()==0){
                                //First Pull
                                loadInbox(MainActivity.this);
                                Globals.loadDayStatus(MainActivity.this);
                                refreshSOD();
                            }
                            for(String key:Globals.changeItemList.keySet()){
                                switch (key){
                                    case Globals.JPLAN_LIST_NAME:
                                        JSONArray ja=Globals.changeItemList.get(key);
                                        for( int i=0;i<ja.length();i++){
                                            try {
                                                String code = ja.getString(i);
                                                if(Globals.selectedJPlan !=null){
                                                    if(Globals.selectedJPlan.getDate().equals(code)){
                                                        Globals.selectedJPlan.refresh(MainActivity.this);
                                                    }
                                                }
                                            }catch (Exception e){
                                                e.printStackTrace();
                                            }
                                        }
                                        refreshDashboard();
                                        break;
                                    case Globals.SOD_LIST_NAME:
                                        Globals.loadDayStatus(MainActivity.this);
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
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                imgNetStatus.setImageDrawable(getResources().getDrawable(R.drawable.ic_cloud_download_white_24dp));
                            }
                        });
                        break;
                    case Globals.OBSERVABLE_MESSAGE_NETWORK_PUSH:
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                imgNetStatus.setImageDrawable(getResources().getDrawable(R.drawable.ic_cloud_upload_white_24dp));
                            }
                        });
                        break;
                    case Globals.OBSERVABLE_MESSAGE_NETWORK_CONNECTED:
                        msgHandler.sendEmptyMessage(0);
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
                        MainActivity.this.recreate();

                }
                if(!message.equals(""))
                    Toast.makeText(MainActivity.this,message,Toast.LENGTH_SHORT ).show();
            }
        });


    }
//    public ArrayList<String> getCurrentLocation() {
//        double latitude;
//        double longitude;
//        ArrayList<String> loc = new ArrayList<>();
//        // create class object
//        //TODO: GPS HERE
////        if(gps ==null) {
////            gps = new GPSTrackerEx(MainActivity.this);
////        }
//        try {
//            if (ActivityCompat.checkSelfPermission(this, mPermission)
//                    != PackageManager.PERMISSION_GRANTED) {
//
//                ActivityCompat.requestPermissions(this, new String[]{mPermission},
//                        REQUEST_CODE_PERMISSION);
//
//                // If any permission above not allowed by user, this condition will
//                //execute every time, else your else part will work
////            } else if(!gps.canGetLocation()) {//TODO: GPS HERE
////                gps.showSettingsAlert();
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        //TODO: GPS HERE
////        if(!gps.canGetLocation()){
////            gps.showSettingsAlert();
////        }
//        // check if GPS enabled
//        //TODO: GPS HERE
//        //if (gps.canGetLocation() && cLocation !=null) {
//        if ( cLocation !=null)
//        {
//            latitude = cLocation.getLatitude();
//            longitude = cLocation.getLongitude();
//
//            loc.add(String.valueOf(latitude));
//            loc.add(String.valueOf(longitude));
//
//            return loc;
//        } else{
//            // can't get location
//            // GPS or Network is not enabled
//            // Ask user to enable GPS/network in settings
//            if(blnShowLocationAlert) {
//                if (!isGpsPermissionAvailable()) {
//                    requestPermission(this, mPermission, REQUEST_CODE_PERMISSION);
//                } else {
//                    //gps.showSettingsAlert();
//                }
//            }
//            return loc;
//        }
//
//    }

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
//    boolean loadCurrentLocation(){
//        getCurrentLocation();
//
//        //TODO: GPS HERE
////        if(!gps.canGetLocation()){
////            Toast.makeText(MainActivity.this,getResources().getString(R.string.enable_gps),Toast.LENGTH_SHORT).show();
////            return false;
////        }
//        if (getCurrentLocation().size() == 2) {
//            location = getCurrentLocation().get(0) + "," + getCurrentLocation().get(1);
//            return true;
//        }
//        return  false;
//
//    }
//    public boolean isGpsPermissionAvailable(){
//        try {
//            if (ActivityCompat.checkSelfPermission(this, mPermission)
//                    != PackageManager.PERMISSION_GRANTED) {
//                /*ActivityCompat.requestPermissions(this, new String[]{mPermission},
//                        REQUEST_CODE_PERMISSION);*/
//
//                // If any permission above not allowed by user, this condition will
//                //execute every time, else your else part will work
//                return false;
//            } else {
//                return true;
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        return  false;
//    }
//    public void requestPermission(Context context, String reqPermission, int permissionCode){
//        ActivityCompat.requestPermissions((Activity) context, new String[]{reqPermission},
//                permissionCode);
//
//    }
    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    public void onRequestPermissionsResult(int requestCode, String permissions[], int[] grantResults) {
        switch (requestCode) {
            case REQUEST_CODE_PERMISSION: {
                // If request is cancelled, the result arrays are empty.
                if (grantResults.length > 0
                        && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
//                    ArrayList<String> loc = getCurrentLocation();
//                    if(loc.size()>0){
//                        latitude=loc.get(0);
//                        longitude=loc.get(1);
//                    }

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

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    private void tryLocation(){
        Location loc = LocationUpdatesService.getLocation();
        latitude = String.valueOf(loc.getLatitude());
        longitude = String.valueOf(loc.getLongitude());

        refreshLocation();
    }

    private void refreshLocation() {
        String locationString = longitude + "," + latitude;
        if (latitude.equals("") && longitude.equals("")) {
            Location _loc = LocationUpdatesService.getLocation();
            latitude = String.valueOf(_loc.getLatitude());
            longitude = String.valueOf(_loc.getLongitude());
            String locationDesc = Utilities.getLocationAddress(MainActivity.this, latitude, longitude);
            imgGpsIcon.setBackgroundResource(R.drawable.ic_location_on_white_24dp);
            if (locationDesc.equals("")) {
                tvCurrLocationText.setText(locationString);
            } else {
                tvCurrLocationText.setText(locationDesc);
            }

        } else if (!longitude.equals("") && !latitude.equals("")) {
            String locationDesc = Utilities.getLocationAddress(MainActivity.this, latitude, longitude);
            imgGpsIcon.setBackgroundResource(R.drawable.ic_location_on_white_24dp);
            if (locationDesc.equals("")) {
                tvCurrLocationText.setText(locationString);
            } else {
                tvCurrLocationText.setText(locationDesc);
            }

        } else {
            imgGpsIcon.setBackgroundResource(R.drawable.ic_gps_off_white_24dp);
            tvCurrLocationText.setText(GPS_UNAVAILABLE_MSG);
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


}

