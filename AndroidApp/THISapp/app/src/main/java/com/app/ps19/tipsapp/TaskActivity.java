package com.app.ps19.tipsapp;

import android.Manifest;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;

import com.app.ps19.tipsapp.location.LocationUpdatesService;
import com.app.ps19.tipsapp.Shared.Utilities;
import com.google.android.material.snackbar.Snackbar;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;

import android.location.Location;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.classes.Task;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import static com.app.ps19.tipsapp.Shared.Globals.TASK_FINISHED_STATUS;
import static com.app.ps19.tipsapp.Shared.Globals.TASK_IN_PROGRESS_STATUS;
import static com.app.ps19.tipsapp.Shared.Globals.TASK_NOT_STARTED_STATUS;
import static com.app.ps19.tipsapp.Shared.Globals.getSelectedTask;

public class TaskActivity extends AppCompatActivity {
    private static final int REQUEST_CODE_PERMISSION = 2;
    String mPermission = Manifest.permission.ACCESS_FINE_LOCATION;
    SimpleDateFormat TASK_VIEW_DATE_FORMAT = new SimpleDateFormat("EEE, d MMM hh:mm:ss aa");

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
    TextView longTxt;
    TextView latTxt;
    TextView longNowTxt;
    TextView latNowTxt;
    TextView timeTxt;
    TextView titleTxt;
    TextView descTxt;
    TextView notesTxt;
    TextView elapsedTxt;
    TextView timeNow;
    Button taskStartBtn;
    Button taskViewBtn;
    LinearLayout endTaskLayout;
    public Thread thread;
    public Thread gpsThread;
    ImageView userImage;
    TextView userNameView;
    TextView taskStatusTxt;
    //TextView timeTxt;

    // GPSTracker class
    //GPSTracker gps;

    //TODO: Display TASK start and end date and time
    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_task);
        timeTxt = (TextView) findViewById(R.id.timeTxt);
        longTxt = (TextView) findViewById(R.id.longTxt);
        latTxt = (TextView) findViewById(R.id.latTxt);
        titleTxt = (TextView) findViewById(R.id.task_menu_title);
        descTxt = (TextView) findViewById(R.id.task_menu_desc);
        notesTxt = (TextView) findViewById(R.id.task_menu_notes);
        endTaskLayout = (LinearLayout) findViewById(R.id.endTaskLayout);
        elapsedTxt = (TextView) findViewById(R.id.elapsedTimeNowTxt);
        timeNow = (TextView) findViewById(R.id.timeNowTxt);
        longNowTxt = (TextView) findViewById(R.id.longNowTxt);
        latNowTxt = (TextView) findViewById(R.id.latNowTxt);
        userImage = (ImageView) findViewById(R.id.userImgView);
        userNameView = (TextView) findViewById(R.id.userNameTxt);
        taskStatusTxt = (TextView) findViewById(R.id.taskStatusTxt);
        taskViewBtn = (Button) findViewById(R.id.taskViewBtn);
        //isTaskStarted = false;

        Date date = new Date();

        timeTxt.setText(TASK_VIEW_DATE_FORMAT.format(date));
        titleTxt.setText(getSelectedTask().getTitle());
        descTxt.setText(getSelectedTask().getDescription());
        notesTxt.setText(getSelectedTask().getNotes());
        taskStartBtn = (Button) findViewById(R.id.taskStartBtn);
        //Globals.setUserInfoView(TaskActivity.this,userImage, userNameView);

//        if(!isGpsPermissionAvailable()){
//            requestPermission(this,mPermission,REQUEST_CODE_PERMISSION);
//        }
        setTaskView(getSelectedTask().getStatus());

        taskViewBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(TaskActivity.this, IssuesActivity.class);
                //Intent intent = new Intent(TaskActivity.this, TaskDetailActivity.class);
                startActivity(intent);
            }
        });

        taskStartBtn.setOnClickListener(new View.OnClickListener() {
            @RequiresApi(api = Build.VERSION_CODES.KITKAT)
            @Override
            public void onClick(final View v) {
                //Date now = new Date();
                //SimpleDateFormat _format = new SimpleDateFormat("hh:mm:ss aa");

                Globals.isTaskStarted = false;
                for(Task _task: Globals.selectedJPlan.getTaskList()){
                    if(_task.getStatus().equals(Globals.TASK_IN_PROGRESS_STATUS)){
                        Globals.isTaskStarted = true;
                    }
                }
                if ((getSelectedTask().getStatus().equals(TASK_NOT_STARTED_STATUS) || getSelectedTask().getStatus().equals("")) && !Globals.isTaskStarted) {
                    if (getCurrentLocation().size() != 0) {

                        new AlertDialog.Builder(TaskActivity.this)
                                .setTitle(TASK_VERIFICATION_TITLE)
                                .setMessage(TASK_START_VERIFICATION_MSG)
                                .setIcon(android.R.drawable.ic_dialog_alert)
                                .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
                                    public void onClick(DialogInterface dialog, int whichButton) {

                                        Date now = new Date();
                                        //SimpleDateFormat _format = new SimpleDateFormat("hh:mm:ss aa");
                                        getSelectedTask().setStatus(TASK_IN_PROGRESS_STATUS);
                                        getSelectedTask().setStartTime(now.toString());
                                        taskViewBtn.setVisibility(View.VISIBLE);
                                        Globals.isTaskStarted = true;
                                        getSelectedTask().setStartLocation(getCurrentLocation().get(0) + "," + getCurrentLocation().get(1));
                                        startThread();
                                        timeTxt.setText(TASK_VIEW_DATE_FORMAT.format(new Date(getSelectedTask().getStartTime()))); //TODO:Must test this format change
                                        endTaskLayout.setVisibility(LinearLayout.VISIBLE);
                                        taskStartBtn.setText(TASK_BTN_END_TEXT);
                                        taskStartBtn.setBackgroundColor(getResources().getColor(R.color.journey_button));
                                        Globals.selectedJPlan.update();
                                        Intent intent = new Intent(TaskActivity.this, IssuesActivity.class);//Intent intent = new Intent(TaskActivity.this, TaskDetailActivity.class);
                                        startActivity(intent);

                                    }
                                })
                                .setNegativeButton(android.R.string.no, null).show();
                    } else {
//                        latTxt.setText(getCurrentLocation().get(0));
//                        longTxt.setText(getCurrentLocation().get(1));
                        Snackbar.make(v, "Failed to get current location !", Snackbar.LENGTH_LONG)
                                .setAction("Action", null).show();
                    }
                } else if (getSelectedTask().getStatus().equals(TASK_IN_PROGRESS_STATUS)) {
                    if (LocationUpdatesService.canGetLocation()) {
                        new AlertDialog.Builder(TaskActivity.this)
                                .setTitle(TASK_VERIFICATION_TITLE)
                                .setMessage(TASK_END_VERIFICATION_MSG)
                                .setIcon(android.R.drawable.ic_dialog_alert)
                                .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
                                    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
                                    public void onClick(DialogInterface dialog, int whichButton) {
                                        //Toast.makeText(TaskActivity.this, "Successfully Started", Toast.LENGTH_SHORT).show();
                                        Date now = new Date();
                                        taskViewBtn.setVisibility(View.VISIBLE);
                                        // SimpleDateFormat _format = new SimpleDateFormat("hh:mm:ss aa");
                                        endThread();
                                        if (getCurrentLocation().size() != 0) {
                                            getSelectedTask().setEndLocation(getCurrentLocation().get(0) + "," + getCurrentLocation().get(1));
                                        }
                                        getSelectedTask().setStatus(TASK_FINISHED_STATUS);
                                        Globals.isTaskStarted = false;
                                        getSelectedTask().setEndTime(now.toString());
                                        timeTxt.setText(TASK_VIEW_DATE_FORMAT.format(now));
                                        //endTaskLayout.setVisibility(LinearLayout.INVISIBLE);
                                        taskStatusTxt.setText(TASK_END_TITLE);
                                        //taskStartBtn.setEnabled(false);
                                        taskStartBtn.setText(TASK_BTN_FINISHED_TEXT);
                                        taskStartBtn.setBackgroundColor(getResources().getColor(R.color.end_task_button));
                                        Globals.selectedJPlan.update();
                                    }
                                })
                                .setNegativeButton(android.R.string.no, null).show();
                    } else {
                        Snackbar.make(v, GPS_UNAVAILABLE_MSG, Snackbar.LENGTH_LONG)
                                .setAction("Action", null).show();
                        Utilities.showSettingsAlert(TaskActivity.this);
                    }


                } else if (getSelectedTask().getStatus().equals(TASK_FINISHED_STATUS)) {

                } else if (Globals.isTaskStarted) {
                    Snackbar.make(v, TASK_PARALLEL_RUNNING_MSG, Snackbar.LENGTH_LONG)
                            .setAction("Action", null).show();
                }

            }
        });
    }

    public void startGPSThread(){
        gpsThread = new Thread() {

            @Override
            public void run() {
        try {
            while (!gpsThread.isInterrupted()) {
                Thread.sleep(1000);
                runOnUiThread(new Runnable() {
                    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
                    @Override
                    public void run() {
                        try {
                           // if(isGpsPermissionAvailable()){
                                //gps.getLocation();
                                if (LocationUpdatesService.canGetLocation()) {
                                    Location loc = LocationUpdatesService.getLocation();
                                    double latitude = loc.getLatitude();
                                    double longitude = loc.getLongitude();
                                    longTxt.setText(String.valueOf(longitude));
                                    latTxt.setText(String.valueOf(latitude));
                                    gpsThread.isInterrupted();
                                }
                                else{
                                    Utilities.showSettingsAlert(TaskActivity.this);
                                }


                        } catch (Exception e){
                            e.printStackTrace();
                        }
    }});}} catch (Exception e ){
            e.printStackTrace();
        }}};
        gpsThread.start();
    }
    public void startThread() {

        thread = new Thread() {

            @Override
            public void run() {
                try {
                    while (!thread.isInterrupted()) {
                        Thread.sleep(1000);
                        runOnUiThread(new Runnable() {
                            @RequiresApi(api = Build.VERSION_CODES.KITKAT)
                            @Override
                            public void run() {
                                try {
                                    //SimpleDateFormat _format = new SimpleDateFormat("hh:mm:ss aa");
                                    if (getSelectedTask().getStatus().equals(TASK_IN_PROGRESS_STATUS)) {
                                        timeNow.setText(TASK_VIEW_DATE_FORMAT.format(new Date()));
                                        Date date1 = TASK_VIEW_DATE_FORMAT.parse(TASK_VIEW_DATE_FORMAT.format(new Date()));
                                        Date date2 = TASK_VIEW_DATE_FORMAT.parse(TASK_VIEW_DATE_FORMAT.format(new Date(getSelectedTask().getStartTime())));
                                        long mills = date1.getTime() - date2.getTime();

                                        int hours = (int) (mills / (1000 * 60 * 60));
                                        int mins = (int) (mills / (1000 * 60)) % 60;
                                        String diff;
                                        diff = hours + " h" + ":" + mins + " m"; // updated value every1 second
                                        elapsedTxt.setText(diff);
                                        if (LocationUpdatesService.canGetLocation()) {
                                            Location loc = LocationUpdatesService.getLocation();
                                            double latitude = loc.getLatitude();
                                            double longitude = loc.getLongitude();
                                            longNowTxt.setText(String.valueOf(longitude));
                                            latNowTxt.setText(String.valueOf(latitude));
                                        }else{
                                            Utilities.showSettingsAlert(TaskActivity.this);
                                        }


                                    } else {
                                        // can't get location
                                        // GPS or Network is not enabled
                                        // Ask user to enable GPS/network in settings
                                        //gps.showSettingsAlert();
                                    }
                                } catch (Exception e) {
                                    e.printStackTrace();
                                }
                                // update TextView here!
                            }
                        });
                    }
                } catch (InterruptedException e) {
                }
            }
        };
        //TaskTimer task = new TaskTimer(myRunnable);
        //task.execute((Void) null);
        thread.start();
    }

    public void endThread() {

        if (thread != null) {
            thread.isInterrupted();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        //gps.stopUsingGPS();
    }

    public String getElapsedTime(String startTime) {
        String diff = "";
        try {
            //SimpleDateFormat _format = new SimpleDateFormat("hh:mm:ss aa");
            //timeNow.setText(_format.format(new Date()));
            Date date1 = TASK_VIEW_DATE_FORMAT.parse(TASK_VIEW_DATE_FORMAT.format(new Date()));
            Date date2 = TASK_VIEW_DATE_FORMAT.parse(startTime);
            long mills = date1.getTime() - date2.getTime();
            int hours = (int) (mills / (1000 * 60 * 60));
            int mins = (int) (mills / (1000 * 60)) % 60;
            diff = hours + " h" + ":" + mins + " m"; // updated value every1 second
        } catch (Exception e) {
            e.printStackTrace();
        }
        return diff;
    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    public ArrayList<String> getCurrentLocation() {
        double latitude;
        double longitude;
        ArrayList<String> locStr = new ArrayList<>();
        // create class object
//        try {
//            if (ActivityCompat.checkSelfPermission(this, mPermission)
//                    != PackageManager.PERMISSION_GRANTED) {
//
//                ActivityCompat.requestPermissions(this, new String[]{mPermission},
//                        REQUEST_CODE_PERMISSION);
//
//                // If any permission above not allowed by user, this condition will
//                //execute every time, else your else part will work
//            } else if(!gps.canGetLocation) {
//                gps.showSettingsAlert();
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        }

        // check if GPS enabled
        if (LocationUpdatesService.canGetLocation()) {
            Location loc = LocationUpdatesService.getLocation();
            latitude = loc.getLatitude();
            longitude = loc.getLongitude();

            locStr.add(String.valueOf(latitude));
            locStr.add(String.valueOf(longitude));

            return locStr;
        } else {
            Utilities.showSettingsAlert(TaskActivity.this);
            // can't get location
            // GPS or Network is not enabled
            // Ask user to enable GPS/network in settings
//            if(!isGpsPermissionAvailable()){
//                requestPermission(this,mPermission,REQUEST_CODE_PERMISSION);
//            } else {
//               // gps.showSettingsAlert();
//            }
            return locStr;
        }

    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    public void setTaskView(String status) {

        switch (status) {
            case "":
                setInitTaskView();
                break;
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
//    public boolean isGpsPermissionAvailable(){
//        try {
//            if (ActivityCompat.checkSelfPermission(this, mPermission)
//                    != PackageManager.PERMISSION_GRANTED) {
//
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
//    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
//    public void onRequestPermissionsResult(int requestCode, String permissions[], int[] grantResults) {
//        switch (requestCode) {
//            case REQUEST_CODE_PERMISSION: {
//                // If request is cancelled, the result arrays are empty.
//                if (grantResults.length > 0
//                        && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
//                    if ((Globals.selectedTask.getStatus().equals(TASK_NOT_STARTED_STATUS) || Globals.selectedTask.getStatus().equals("")) && !Globals.isTaskStarted) {
//                        if(getCurrentLocation().size()>0){
//                            latTxt.setText(getCurrentLocation().get(0));
//                            longTxt.setText(getCurrentLocation().get(1));
//                        }
//
//                    } else if (Globals.selectedTask.getStatus().equals(TASK_IN_PROGRESS_STATUS)) {
//                        if(getCurrentLocation().size()>0) {
//                            latNowTxt.setText(getCurrentLocation().get(0));
//                            longNowTxt.setText(getCurrentLocation().get(1));
//                        }
//                    }
//
//                } else {
//                    // permission denied, boo! Disable the
//                    // functionality that depends on this permission.
//
//                }
//                return;
//            }
//            // other 'case' lines to check for other
//            // permissions this app might request
//        }
//    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    public void setInitTaskView() {
        Date _date = new Date();
        if (getCurrentLocation().size() != 0) {
            latTxt.setText(getCurrentLocation().get(0));
            longTxt.setText(getCurrentLocation().get(1));
        }
        taskViewBtn.setVisibility(View.GONE);
        endThread();
        timeTxt.setText(TASK_VIEW_DATE_FORMAT.format(_date));
        endTaskLayout.setVisibility(LinearLayout.INVISIBLE);
        taskStartBtn.setText(TASK_BTN_START_TEXT);
        taskStartBtn.setBackgroundColor(getResources().getColor(R.color.start_button));
        //taskStartBtn.setEnabled(true);
    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    public void setInProgressTaskView() {
        String[] locStartArray = getTaskStartLocation();
        startThread();
        if (locStartArray.length != 2) {
            latTxt.setText("N/A");
            longTxt.setText("N/A");
        } else {
            latTxt.setText(locStartArray[0]);
            longTxt.setText(locStartArray[1]);
        }

        if (getCurrentLocation().size() != 0) {
            latNowTxt.setText(getCurrentLocation().get(0));
            longNowTxt.setText(getCurrentLocation().get(1));
        }
        timeTxt.setText(TASK_VIEW_DATE_FORMAT.format(new Date(getSelectedTask().getStartTime())));
        endTaskLayout.setVisibility(LinearLayout.VISIBLE);
        taskStatusTxt.setText(TASK_NOW_TITLE);
        taskStartBtn.setText(TASK_BTN_END_TEXT);
        taskViewBtn.setVisibility(View.VISIBLE);
        taskStartBtn.setBackgroundColor(getResources().getColor(R.color.journey_button));
        // taskStartBtn.setEnabled(true);
    }

    public void setFinishedTaskView() {
        String[] locStartArray = getTaskStartLocation();
        String[] locEndArray = getTaskEndLocation();
        latTxt.setText(locStartArray[0]);
        longTxt.setText(locStartArray[1]);
        latNowTxt.setText(locEndArray[0]);
        longNowTxt.setText(locEndArray[1]);
        endThread();
        taskStatusTxt.setText(TASK_END_TITLE);
        taskViewBtn.setVisibility(View.VISIBLE);
        timeTxt.setText(TASK_VIEW_DATE_FORMAT.format(new Date(getSelectedTask().getStartTime())));
        timeNow.setText(TASK_VIEW_DATE_FORMAT.format(new Date(getSelectedTask().getEndTime())));
        elapsedTxt.setText(getElapsedTime(getSelectedTask().getStartTime()));
        endTaskLayout.setVisibility(LinearLayout.VISIBLE);
        //taskStartBtn.setEnabled(false);
        taskStartBtn.setText(TASK_BTN_FINISHED_TEXT);
        taskStartBtn.setBackgroundColor(getResources().getColor(R.color.end_task_button));
    }

    public String[] getTaskStartLocation() {
        return getSelectedTask().getStartLocation().split(",");
    }

    public String[] getTaskEndLocation() {
        return getSelectedTask().getEndLocation().split(",");
    }
}
