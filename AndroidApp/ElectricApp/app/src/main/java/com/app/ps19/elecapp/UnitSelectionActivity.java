package com.app.ps19.elecapp;

import static com.app.ps19.elecapp.Shared.Globals.CURRENT_LOCATION;
import static com.app.ps19.elecapp.Shared.Globals.getSelectedTask;
import static com.app.ps19.elecapp.Shared.Utilities.getLocationDescription;

import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.location.Location;
import android.os.Build;
import android.os.Bundle;
import android.os.PowerManager;
import android.view.View;
import android.view.WindowManager;
import android.view.animation.Animation;
import android.view.animation.RotateAnimation;
import android.view.animation.TranslateAnimation;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;

import com.app.ps19.elecapp.Shared.Utilities;
import com.app.ps19.elecapp.classes.DUnit;
import com.app.ps19.elecapp.classes.LatLong;
import com.app.ps19.elecapp.location.Interface.OnLocationUpdatedListener;
import com.app.ps19.elecapp.location.LocationUpdatesService;

import java.util.ArrayList;
import java.util.Iterator;

public class UnitSelectionActivity extends AppCompatActivity implements SensorEventListener, OnLocationUpdatedListener {
    private TextView txtDegrees;
    private ImageView imgCompass;
    private float currentDegree=0f;
    private SensorManager sensorManager;
    ListView lvStaticUnits;
    ListView lvSortedUnits;
   // GPSTracker gps;
    uSelectionAdapter selectionSortedAdt;
    uSelectionAdapter selectionStaticAdt;
    Double preLongitude;
    Double preLatitude;
    //SmartLocationManager mLocationManager;
    //ExecutorService mThreadPool = Executors.newSingleThreadExecutor();
    TextView tvLocation;
    TextView tvLatitude;
    TextView tvLongitude;
    View myView;
    boolean isUp;
    RelativeLayout rlStaticList;
    RelativeLayout rlSortedList;
    ImageView ivStaticListIndicator;
    ImageView ivSortedListIndicator;
    ArrayList<DUnit> staticList;
    ArrayList<DUnit> sortedList;
    protected PowerManager.WakeLock mWakeLock;
    public PowerManager pm ;

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_unit_selection);
        assert getSupportActionBar() != null;   //null check
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);   //show back button
        lvStaticUnits = (ListView) findViewById(R.id.lv_static_units);
        lvSortedUnits = (ListView) findViewById(R.id.lv_sorted_units);
        tvLocation = (TextView) findViewById(R.id.tv_unit_your_location);
        tvLatitude = (TextView) findViewById(R.id.unit_loc_lat);
        tvLongitude = (TextView) findViewById(R.id.unit_loc_long);
        rlStaticList = (RelativeLayout) findViewById(R.id.rl_static_list);
        ivStaticListIndicator = (ImageView) findViewById(R.id.iv_list_static_indicator);
        rlSortedList = (RelativeLayout) findViewById(R.id.rl_sorted_list);
        ivSortedListIndicator = (ImageView) findViewById(R.id.iv_list_sorted_indicator);

        imgCompass=(ImageView)findViewById(R.id.iv_unit_person);
        txtDegrees=(TextView)findViewById(R.id.tv_location_title);
        sensorManager=(SensorManager)getSystemService(SENSOR_SERVICE);
        // Setting Tags
        imgCompass.setImageResource(R.drawable.unit_person);
        imgCompass.setTag(R.drawable.unit_person);
        pm = (PowerManager) getSystemService(this.POWER_SERVICE);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        screenWakeLock();
        setTitle(R.string.title_activity_select_asset);
        /*this.mWakeLock = pm.newWakeLock(PowerManager.SCREEN_DIM_WAKE_LOCK, "Unit Selection:");
        this.mWakeLock.acquire(30*60*1000L *//*30 minutes*//*);*/

       // mLocationManager = new SmartLocationManager(getApplicationContext(), this, this, SmartLocationManager.ALL_PROVIDERS, LocationRequest.PRIORITY_HIGH_ACCURACY, 10 * 1000, 1 * 1000, SmartLocationManager.LOCATION_PROVIDER_RESTRICTION_NONE); // init location manager

        imgCompass.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v){
                if(imgCompass.getTag().equals(R.drawable.unit_person)){
                    imgCompass.setImageResource(R.drawable.compass);
                    imgCompass.setTag(R.drawable.compass);
                    //mLocationManager.startLocationFetching();
                    sensorManager.registerListener(UnitSelectionActivity.this,sensorManager.getDefaultSensor(Sensor.TYPE_ORIENTATION),SensorManager.SENSOR_DELAY_GAME);

                } else if(imgCompass.getTag().equals(R.drawable.compass)){
                    sensorManager.unregisterListener(UnitSelectionActivity.this);
                    imgCompass.clearAnimation();
                    imgCompass.setRotation(0f);
                    imgCompass.setImageResource(R.drawable.unit_person);
                    imgCompass.setTag(R.drawable.unit_person);

                }
            }});
        rlSortedList.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v){
                if(lvSortedUnits.getVisibility() == View.VISIBLE){
                    ivSortedListIndicator.setImageResource(R.drawable.ic_expand_less_white_24dp);
                    slideDown(lvSortedUnits);
                } else {
                    ivSortedListIndicator.setImageResource(R.drawable.ic_expand_more_white_24dp);
                    slideUp(lvSortedUnits);
                }
            }
        });
        rlStaticList.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v){
                if(lvStaticUnits.getVisibility() == View.VISIBLE){
                    ivStaticListIndicator.setImageResource(R.drawable.ic_expand_less_white_24dp);
                    slideDown(lvStaticUnits);
                } else {
                    ivStaticListIndicator.setImageResource(R.drawable.ic_expand_more_white_24dp);
                    slideUp(lvStaticUnits);
                }
            }
        });
        //Listen to location Updates
        LocationUpdatesService.addOnLocationUpdateListener( this.getClass().getSimpleName() , this);
        // gps = new GPSTracker(UnitSelectionActivity.this);
        if (LocationUpdatesService.canGetLocation()) {
            Location loc = LocationUpdatesService.getLocation();
            preLongitude = loc.getLongitude();
            preLatitude = loc.getLatitude();

            tvLatitude.setText(Double.toString(loc.getLatitude()));
            tvLongitude.setText(Double.toString(loc.getLongitude()));
            CURRENT_LOCATION = String.valueOf(loc.getLatitude()) + "," + String.valueOf(loc.getLongitude());

            LatLong location = new LatLong(Double.toString(preLatitude), Double.toString(preLongitude));
            tvLocation.setText(getLocationDescription(location, UnitSelectionActivity.this));
            staticList = getSelectedTask().getUnitList(location.getLatLng());
            for (Iterator<DUnit> it = staticList.iterator(); it.hasNext();) {
                //if (it.next().getDistance()>=0) {
                //    it.remove();
                //}
                if(!it.next().isLinear()){
                    it.remove();
                }
            }
            sortedList = getSelectedTask().getUnitList(location.getLatLng());
            for (Iterator<DUnit> it = sortedList.iterator(); it.hasNext();) {
                //if (it.next().getDistance()<0) {
                //    it.remove();
                //}
                if(it.next().isLinear()){
                    it.remove();
                }

            }
            if (staticList != null && staticList.size()>0){
                ivStaticListIndicator.setImageResource(R.drawable.ic_expand_more_white_24dp);
            }
            if (sortedList != null && sortedList.size()>0){
                ivSortedListIndicator.setImageResource(R.drawable.ic_expand_more_white_24dp);
            }
            selectionStaticAdt = new uSelectionAdapter(this, "static", staticList);
            lvStaticUnits.setAdapter(selectionStaticAdt);

            selectionSortedAdt = new uSelectionAdapter(this, "sorted", sortedList);
            lvSortedUnits.setAdapter(selectionSortedAdt);
        }else{
            Utilities.showSettingsAlert(UnitSelectionActivity.this);
        }

        isUp = false;
    }
    public void listUpdate(String lat, String lon){
        LatLong location = new LatLong(lat, lon);
        //staticList.clear();
        staticList = getSelectedTask().getUnitList(location.getLatLng());
        for (Iterator<DUnit> it = staticList.iterator(); it.hasNext();) {
            //if (it.next().getDistance()>=0) {
            //    it.remove();
           // }
            if(!it.next().isLinear()){
                it.remove();
            }
        }
        //sortedList.clear();
        sortedList = getSelectedTask().getUnitList(location.getLatLng());
        for (Iterator<DUnit> it = sortedList.iterator(); it.hasNext();) {
            //if (it.next().getDistance()<0) {
            //    it.remove();
            //}
            if(it.next().isLinear()){
                it.remove();
            }

        }
        selectionStaticAdt.setNotifyOnChange(false); // Prevents 'clear()' from clearing/resetting the listview
        selectionStaticAdt.clear();
        selectionStaticAdt.addAll(staticList);
        selectionStaticAdt.notifyDataSetChanged();

        selectionSortedAdt.setNotifyOnChange(false); // Prevents 'clear()' from clearing/resetting the listview
        selectionSortedAdt.clear();
        selectionSortedAdt.addAll(sortedList);
        selectionSortedAdt.notifyDataSetChanged();
    }

    // slide the view from below itself to the current position
    public void slideUp(View view){
        view.setVisibility(View.VISIBLE);
        TranslateAnimation animate = new TranslateAnimation(
                0,                 // fromXDelta
                0,                 // toXDelta
                view.getHeight(),  // fromYDelta
                0);                // toYDelta
        animate.setDuration(500);
        animate.setFillAfter(true);
        view.startAnimation(animate);
    }

    // slide the view from its current position to below itself
    public void slideDown(View view){
        TranslateAnimation animate = new TranslateAnimation(
                0,                 // fromXDelta
                0,                   // toXDelta
                0,                 // fromYDelta
                view.getHeight());          // toYDelta
        animate.setDuration(500);
        animate.setFillAfter(true);
        view.startAnimation(animate);
        view.setVisibility(View.GONE);
    }
    private void screenWakeLock(){
        mWakeLock = pm.newWakeLock(PowerManager.SCREEN_DIM_WAKE_LOCK, "Unit Selection:");
        mWakeLock.acquire(30*60*1000L /*30 minutes*/);
    }
    @Override
    public void onDestroy(){
        if(mWakeLock.isHeld()){
            try {
                mWakeLock.release();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        super.onDestroy();
    }

    @Override
    protected void onPause() {
        super.onPause();
        //mThreadPool.shutdownNow();
        if(mWakeLock.isHeld()){
            try {
                mWakeLock.release();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        try {
            //Remove Location Updates
            LocationUpdatesService.removeLocationUpdateListener(this.getClass().getSimpleName());
            sensorManager.unregisterListener(UnitSelectionActivity.this);
        } catch (Exception e) {
            e.printStackTrace();
        }
        //mLocationManager.pauseLocationFetching();
    }
    @Override
    protected void onResume()
    {
        // TODO: Implement this method
        super.onResume();
        screenWakeLock();
        if(imgCompass.getTag().equals(R.drawable.compass)) {
            sensorManager.registerListener(UnitSelectionActivity.this, sensorManager.getDefaultSensor(Sensor.TYPE_ORIENTATION), SensorManager.SENSOR_DELAY_GAME);
        }
        //Listen to location Updates
        LocationUpdatesService.addOnLocationUpdateListener( this.getClass().getSimpleName() , this);
    }

    @Override
    public void onSensorChanged(SensorEvent event)
    {
        float degree=Math.round(event.values[0]);
        //txtDegrees.setText("Rotation: "+Float.toString(degree)+" degrees");
        RotateAnimation ra=new RotateAnimation(currentDegree,-degree,Animation.RELATIVE_TO_SELF,0.5f,
                Animation.RELATIVE_TO_SELF,0.5f);
        ra.setDuration(120);
        ra.setFillAfter(true);
        imgCompass.startAnimation(ra);
        currentDegree=-degree;
    }

    @Override
    public void onAccuracyChanged(Sensor p1, int p2)
    {
        // TODO: Implement this method
    }
    protected static String bearing(double lat1, double lon1, double lat2, double lon2){
        double longitude1 = lon1;
        double longitude2 = lon2;
        double latitude1 = Math.toRadians(lat1);
        double latitude2 = Math.toRadians(lat2);
        double longDiff= Math.toRadians(longitude2-longitude1);
        double y= Math.sin(longDiff)*Math.cos(latitude2);
        double x=Math.cos(latitude1)*Math.sin(latitude2)-Math.sin(latitude1)*Math.cos(latitude2)*Math.cos(longDiff);
        double resultDegree= (Math.toDegrees(Math.atan2(y, x))+360)%360;
        String coordNames[] = {"N","NNE", "NE","ENE","E", "ESE","SE","SSE", "S","SSW", "SW","WSW", "W","WNW", "NW","NNW", "N"};
        double directionid = Math.round(resultDegree / 22.5);
        // no of array contain 360/16=22.5
        if (directionid < 0) {
            directionid = directionid + 16;
            //no. of contains in array
        }
        String compasLoc=coordNames[(int) directionid];

        return resultDegree+" "+compasLoc;
    }

//    @Override
//    public void locationChanged(Location mLocation) {
//
//    }
    @Override
    public boolean onSupportNavigateUp(){
        finish();
        return true;
    }

    @Override
    public void onLocationUpdated(Location mLocation) {

        if(!LocationUpdatesService.canGetLocation() || mLocation.getProvider().equals("None")) { Utilities.showSettingsAlert(UnitSelectionActivity.this); return; }
                /*String location = String.valueOf(mLocation.getLatitude() + ", " + String.valueOf(mLocation.getLongitude()));
        txtDegrees.setText(location);*/

        tvLatitude.setText(String.valueOf(mLocation.getLatitude()));
        tvLongitude.setText(String.valueOf(mLocation.getLongitude()));
        CURRENT_LOCATION = String.valueOf(mLocation.getLatitude()) + "," + String.valueOf(mLocation.getLongitude());
        LatLong location = new LatLong(Double.toString(mLocation.getLatitude()), Double.toString(mLocation.getLongitude()));
        tvLocation.setText(getLocationDescription(location, UnitSelectionActivity.this));
        listUpdate(String.valueOf(mLocation.getLatitude()), String.valueOf(mLocation.getLongitude()));
    }
}
