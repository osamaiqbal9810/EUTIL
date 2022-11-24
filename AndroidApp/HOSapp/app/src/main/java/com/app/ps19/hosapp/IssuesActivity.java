package com.app.ps19.hosapp;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.content.SharedPreferences;
import android.location.Location;
import android.net.Uri;
import android.os.IBinder;
import android.os.PowerManager;
import android.preference.PreferenceManager;
import androidx.annotation.NonNull;
import com.google.android.material.bottomsheet.BottomSheetBehavior;
import com.google.android.material.tabs.TabLayout;

import androidx.fragment.app.FragmentStatePagerAdapter;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;
import androidx.core.view.ViewCompat;
import androidx.core.widget.NestedScrollView;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;
import androidx.viewpager.widget.PagerAdapter;
import androidx.viewpager.widget.ViewPager;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;

import android.view.WindowManager;
import android.view.animation.TranslateAnimation;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.app.ps19.hosapp.Shared.GPSTrackerEx;
import com.app.ps19.hosapp.Shared.Globals;
import com.app.ps19.hosapp.Shared.LocationChangedInterface;
import com.app.ps19.hosapp.Shared.LocationUpdatesService;
import com.app.ps19.hosapp.Shared.Utils;
import com.app.ps19.hosapp.classes.DUnit;
import com.app.ps19.hosapp.classes.LatLong;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;

import static com.app.ps19.hosapp.IssueFragment.SECOND_ACTIVITY_REQUEST_CODE;
import static com.app.ps19.hosapp.Shared.Globals.ADAPTER_REFRESH_MSG;
import static com.app.ps19.hosapp.Shared.Globals.CURRENT_LOCATION;
import static com.app.ps19.hosapp.Shared.Utilities.getLocationDescription;

public class IssuesActivity extends AppCompatActivity implements FormFragment.OnFragmentInteractionListener, UnitsFragment.OnFragmentInteractionListener, IssueFragment.OnFragmentInteractionListener, AssetFragment.OnFragmentInteractionListener, LocationChangedInterface, SharedPreferences.OnSharedPreferenceChangeListener {

    /**
     * The {@link PagerAdapter} that will provide
     * fragments for each of the sections. We use a
     * {@link FragmentPagerAdapter} derivative, which will keep every
     * loaded fragment in memory. If this becomes too memory intensive, it
     * may be best to switch to a
     * {@link FragmentStatePagerAdapter}.
     */
    private SectionsPagerAdapter mSectionsPagerAdapter;

    /**
     * The {@link ViewPager} that will host the section contents.
     */
    private ViewPager mViewPager;

    public BottomSheetBehavior sheetBehavior;
    private Toolbar toolbar;
    private Button btn_bottom_sheet;
    private NestedScrollView bottom_sheet;
    ListView lvStaticUnits;
    ListView lvSortedUnits;
    GPSTrackerEx gps;
    Location cLocation;
    uSelectionAdapter selectionSortedAdt;
    uSelectionAdapter selectionStaticAdt;
    Double preLongitude;
    Double preLatitude;
    boolean isUp;
    RelativeLayout rlStaticList;
    RelativeLayout rlSortedList;
    ImageView ivStaticListIndicator;
    ImageView ivSortedListIndicator;
    ArrayList<DUnit> staticList;
    ArrayList<DUnit> sortedList;
    protected PowerManager.WakeLock mWakeLock;
    public PowerManager pm ;
    TextView tvAssetTitle;
    TextView tvAssetType;
    ImageButton ibtUnitListMap;
    ProgressDialog dialog =null;

    private FragmentRefreshFormListener fragmentRefreshFormListener;
    private FragmentRefreshIssueListener fragmentRefreshIssueListener;
    private FragmentRefreshUnitListener fragmentRefreshUnitListener;

    public FragmentRefreshFormListener getFragmentRefreshFormListener() {
        return fragmentRefreshFormListener;
    }

    public void setFragmentRefreshFormListener(FragmentRefreshFormListener fragmentRefreshFormListener) {
        this.fragmentRefreshFormListener = fragmentRefreshFormListener;
    }

    public FragmentRefreshIssueListener getFragmentRefreshIssueListener() {
        return fragmentRefreshIssueListener;
    }

    public void setFragmentRefreshIssueListener(FragmentRefreshIssueListener fragmentRefreshIssueListener) {
        this.fragmentRefreshIssueListener = fragmentRefreshIssueListener;
    }
    public FragmentRefreshUnitListener getFragmentRefreshUnitListener() {
        return fragmentRefreshUnitListener;
    }

    public void setFragmentRefreshUnitListener(FragmentRefreshUnitListener fragmentRefreshUnitListener) {
        this.fragmentRefreshUnitListener = fragmentRefreshUnitListener;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_issues);
        dialog=new ProgressDialog(this);
     showDialog("Please Wait!","Loading Assets. . . ");
        //-------------------GPS Code--------------
        myReceiver = new MyReceiver();
        // Check that the user hasn't revoked permissions by going to Settings.
        if (Utils.requestingLocationUpdates(this)) {
        /*    if (!checkPermissions()) {
                requestPermissions();
            }*/
        }
        //--------------------END-------------------

        bottom_sheet = findViewById(R.id.bottom_sheet);
        sheetBehavior = BottomSheetBehavior.from(bottom_sheet);
        //bottom_sheet.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        sheetBehavior.setBottomSheetCallback(new BottomSheetBehavior.BottomSheetCallback() {
            @Override
            public void onStateChanged(@NonNull View view, int newState) {
                switch (newState) {
                    case BottomSheetBehavior.STATE_HIDDEN:
                        break;
                    case BottomSheetBehavior.STATE_EXPANDED: {
                        //btn_bottom_sheet.setText("Close Sheet");
                    }
                    break;
                    case BottomSheetBehavior.STATE_COLLAPSED: {
                        //btn_bottom_sheet.setText("Expand Sheet");
                    }
                    break;
                    case BottomSheetBehavior.STATE_DRAGGING:
                        break;
                    case BottomSheetBehavior.STATE_SETTLING:
                        bottom_sheet.scrollTo(0,0);
                        break;
                }
            }

            @Override
            public void onSlide(@NonNull View view, float v) {

            }
        });
        //sheetBehavior.setPeekHeight(BottomSheetBehavior.STATE_SETTLING);
        sheetBehavior.setState(BottomSheetBehavior.STATE_COLLAPSED);
        bottom_sheet.scrollTo(0,0);

        Toolbar toolbar = (Toolbar) findViewById(R.id.tbIssues);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        // Create the adapter that will return a fragment for each of the three
        // primary sections of the activity.
        mSectionsPagerAdapter = new SectionsPagerAdapter(getSupportFragmentManager(), this);

        // Set up the ViewPager with the sections adapter.
        mViewPager = (ViewPager) findViewById(R.id.container);
        mViewPager.setAdapter(mSectionsPagerAdapter);

        TabLayout tabLayout = (TabLayout) findViewById(R.id.tabs);

        mViewPager.addOnPageChangeListener(new TabLayout.TabLayoutOnPageChangeListener(tabLayout));
        tabLayout.addOnTabSelectedListener(new TabLayout.ViewPagerOnTabSelectedListener(mViewPager));
        if(Globals.selectedTask.getWholeUnitList().size() == 0){
            Toast.makeText(IssuesActivity.this, "No Asset available to proceed!", Toast.LENGTH_SHORT).show();
            //gps.unbindService();
            finish();
        }

        /*FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });*/
        pm = (PowerManager) getSystemService(POWER_SERVICE);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        screenWakeLock();
        if(gps == null){
            gps = new GPSTrackerEx(IssuesActivity.this);
        }
        lvStaticUnits = (ListView) findViewById(R.id.fm_lv_static_units);
        lvSortedUnits = (ListView) findViewById(R.id.fm_lv_sorted_units);
        tvAssetTitle = (TextView) findViewById(R.id.tv_selected_asset_title);
        tvAssetType = (TextView) findViewById(R.id.tv_selected_asset_type);
        //tvStartLoc = (TextView) findViewById(R.id.tv_task_start);
        //tvEndLoc = (TextView) findViewById(R.id.tv_task_end);
        /*tvLocation = (TextView) findViewById(R.id.tv_unit_your_location);
        tvLatitude = (TextView) findViewById(R.id.unit_loc_lat);
        tvLongitude = (TextView) findViewById(R.id.unit_loc_long);*/
        rlStaticList = (RelativeLayout) findViewById(R.id.fm_rl_static_list);
        ivStaticListIndicator = (ImageView) findViewById(R.id.fm_iv_list_static_indicator);
        rlSortedList = (RelativeLayout) findViewById(R.id.fm_rl_sorted_list);
        ivSortedListIndicator = (ImageView) findViewById(R.id.fm_iv_list_sorted_indicator);
        ibtUnitListMap = (ImageButton) findViewById(R.id.ib_unit_list_map);
        cLocation = Globals.lastKnownLocation;

        if(Globals.selectedUnit != null){
            tvAssetType.setText(Globals.selectedUnit.getAssetType());
            tvAssetTitle.setText(Globals.selectedUnit.getDescription());
        } else {
            Intent intent = new Intent(IssuesActivity.this, UnitSelectionActivity.class);
            startActivityForResult(intent, 1);
        }
        ViewCompat.setNestedScrollingEnabled(lvStaticUnits, true);

        ibtUnitListMap.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent=new Intent(IssuesActivity.this,AssetMapsActivity.class);
                if(gps.canGetLocation()){
                    startActivityForResult(intent, 1);
                } else {
                    gps.showSettingsAlert();
                }


            }
        });
        /*imgCompass=(ImageView)findViewById(R.id.iv_unit_person);
        txtDegrees=(TextView)findViewById(R.id.tv_location_title);
        sensorManager=(SensorManager)getSystemService(SENSOR_SERVICE);*/
        // Setting Tags
        //imgCompass.setImageResource(R.drawable.unit_person);
        //imgCompass.setTag(R.drawable.unit_person);


        //setTitle(R.string.title_activity_select_asset);

        /*String[] startLoc = getLocationDescription(IssuesActivity.this,
                Globals.selectedTask.getStartLoc().getGeometry().getCoordinates().get(0).latitude,
                Globals.selectedTask.getStartLoc().getGeometry().getCoordinates().get(0).longitude).split(",");
        if(startLoc.length != 0){
            tvStartLoc.setText(startLoc[0]);
        }
        *//*tvStartLoc.setText(getLocationDescription(getContext(),
                Globals.selectedTask.getStartLoc().getGeometry().getCoordinates().get(0).latitude,
                Globals.selectedTask.getStartLoc().getGeometry().getCoordinates().get(0).longitude));*//*

        String[] endLoc = getLocationDescription(getContext(), Globals.selectedTask.getEndLoc().getGeometry().getCoordinates().get(0).latitude, Globals.selectedTask.getEndLoc().getGeometry().getCoordinates().get(0).longitude).split(",");
        if(endLoc.length != 0){
            tvEndLoc.setText(endLoc[0]);
        }*/
        /*
        tvEndLoc.setText(getLocationDescription(getContext(),
                Globals.selectedTask.getEndLoc().getGeometry().getCoordinates().get(0).latitude,
                Globals.selectedTask.getEndLoc().getGeometry().getCoordinates().get(0).longitude));*/

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

        if (gps.canGetLocation() && cLocation != null) {
            preLongitude = cLocation.getLongitude();
            preLatitude = cLocation.getLatitude();

            //tvLatitude.setText(Double.toString(gps.getLatitude()));
            //tvLongitude.setText(Double.toString(gps.getLongitude()));
            CURRENT_LOCATION = String.valueOf(cLocation.getLatitude()) + "," + String.valueOf(cLocation.getLongitude());

            LatLong location = new LatLong(Double.toString(preLatitude), Double.toString(preLongitude));
            //tvLocation.setText(getLocationDescription(location, UnitSelectionActivity.this));
            staticList = Globals.selectedTask.getUnitList(location.getLatLng());
            for (Iterator<DUnit> it = staticList.iterator(); it.hasNext();) {
                //if (it.next().getDistance()>=0) {
                //    it.remove();
                //}
                if(!it.next().isLinear()){
                    it.remove();
                }
            }
            sortedList = Globals.selectedTask.getUnitList(location.getLatLng());
            for (Iterator<DUnit> it = sortedList.iterator(); it.hasNext();) {
                //if (it.next().getDistance()<0) {
                //    it.remove();
                //}
                if(it.next().isLinear()){
                    it.remove();
                }
            }

            Collections.sort(staticList, DUnit.UnitDistanceComparator);
            if (staticList != null && staticList.size()>0){
                ivStaticListIndicator.setImageResource(R.drawable.ic_expand_more_white_24dp);
            }
            if (sortedList != null && sortedList.size()>0){
                ivSortedListIndicator.setImageResource(R.drawable.ic_expand_more_white_24dp);
            }
            selectionStaticAdt = new uSelectionAdapter(IssuesActivity.this, "static", staticList);
            lvStaticUnits.setAdapter(selectionStaticAdt);

            selectionSortedAdt = new uSelectionAdapter(IssuesActivity.this, "sorted", sortedList);
            lvSortedUnits.setAdapter(selectionSortedAdt);
        } else {
            gps.showSettingsAlert();
        }

        setListViewHeightBasedOnChildren(lvStaticUnits);
        setListViewHeightBasedOnChildren(lvSortedUnits);
        isUp = false;
        LocalBroadcastManager.getInstance(this).registerReceiver(mMessageReceiver,
                new IntentFilter("asset-selection"));
        hideDialog();
    }
    public BroadcastReceiver mMessageReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            // Get extra data included in the Intent
            //Boolean isSelected = intent.getBooleanExtra("isSelected", false);
            if(intent.getBooleanExtra("isSelected", false)){
               /* Fragment frg = null;
                Fragment frgRpt = null;
                frg = IssuesActivity.this.getSupportFragmentManager().findFragmentByTag(getFragmentTag(1));
                frgRpt = IssuesActivity.this.getSupportFragmentManager().findFragmentByTag(getFragmentTag(2));
                final FragmentTransaction ft = IssuesActivity.this.getSupportFragmentManager().beginTransaction();
                if(frg!=null){
                    ft.detach(frg);
                    ft.attach(frg);
                }
               *//* if(frgRpt!=null){
                    ft.detach(frgRpt);
                    ft.attach(frgRpt);
                }*//*
                ft.commit();*/
                if(getFragmentRefreshIssueListener()!=null){
                    getFragmentRefreshIssueListener().onRefresh();
                }
                if(getFragmentRefreshFormListener()!=null){
                    getFragmentRefreshFormListener().onRefresh();
                }
                if(getFragmentRefreshUnitListener()!=null){
                    getFragmentRefreshUnitListener().onRefresh();
                }
                tvAssetType.setText(Globals.selectedUnit.getAssetType());
                tvAssetTitle.setText(Globals.selectedUnit.getDescription());
                bottom_sheet.fullScroll(View.FOCUS_UP);
                bottom_sheet.smoothScrollTo(0,0);
                sheetBehavior.setState(BottomSheetBehavior.STATE_COLLAPSED);
            }
            //Toast.makeText(MainActivity.this,ItemName +" "+qty ,Toast.LENGTH_SHORT).show();
        }
    };
    /**
     * Gets the fragment tag of a fragment at a specific position in the viewpager.
     *
     * @param pos the pos
     * @return the fragment tag
     */
    public String getFragmentTag(int pos) {
        return "android:switcher:" + R.id.container + ":" + pos;
    }
    public static void setListViewHeightBasedOnChildren(ListView listView) {
        ListAdapter listAdapter = listView.getAdapter();
        if (listAdapter == null) {
            // pre-condition
            return;
        }
        int totalHeight = 0;
        for (int i = 0; i < listAdapter.getCount(); i++) {
            View listItem = listAdapter.getView(i, null, listView);
            listItem.measure(0, 0);
            totalHeight += listItem.getMeasuredHeight();
        }
        ViewGroup.LayoutParams params = listView.getLayoutParams();
        //params.height = totalHeight + (listView.getDividerHeight() * (listAdapter.getCount() - 1));
        params.height = totalHeight + (listView.getDividerHeight() * (listAdapter.getCount()))+55;
        listView.setLayoutParams(params);
        listView.requestLayout();
    }
    public void listUpdate(String lat, String lon){


        try {
            LatLong location = null;
            location = new LatLong(lat, lon);
            //staticList.clear();
            //TODO null check
            staticList = Globals.selectedTask.getUnitList(location.getLatLng());
            for (Iterator<DUnit> it = staticList.iterator(); it.hasNext();) {
                //if (it.next().getDistance()>=0) {
                //    it.remove();
                // }
                if(!it.next().isLinear()){
                    it.remove();
                }
            }
            Collections.sort(staticList, DUnit.UnitDistanceComparator);
            //sortedList.clear();
            sortedList = Globals.selectedTask.getUnitList(location.getLatLng());
            for (Iterator<DUnit> it = sortedList.iterator(); it.hasNext();) {
                //if (it.next().getDistance()<0) {
                //    it.remove();
                //}
                if(it.next().isLinear()){
                    it.remove();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        try {
            selectionStaticAdt.setNotifyOnChange(false); // Prevents 'clear()' from clearing/resetting the listview
            selectionStaticAdt.clear();
            selectionStaticAdt.addAll(staticList);
            selectionStaticAdt.notifyDataSetChanged();

            selectionSortedAdt.setNotifyOnChange(false); // Prevents 'clear()' from clearing/resetting the listview
            selectionSortedAdt.clear();
            selectionSortedAdt.addAll(sortedList);
            selectionSortedAdt.notifyDataSetChanged();
        } catch (Exception e) {
            e.printStackTrace();
        }
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
    protected void onStop() {
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
    public void onDestroy(){
        if(mWakeLock.isHeld()){
            try {
                mWakeLock.release();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        if (mBound) {
            // Unbind from the service. This signals to the service that this activity is no longer
            // in the foreground, and the service can respond by promoting itself to a foreground
            // service.
            unbindService(mServiceConnection);
            mBound = false;
        }
        //gps.unbindService();
        super.onDestroy();
    }

    @Override
    public void onPause() {
        super.onPause();
        //mThreadPool.shutdownNow();
        if(mWakeLock.isHeld()){
            try {
                mWakeLock.release();
                LocalBroadcastManager.getInstance(this).unregisterReceiver(myReceiver);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        /*try {
            sensorManager.unregisterListener(UnitSelectionActivity.this);
        } catch (Exception e) {
            e.printStackTrace();
        }*/
        //mLocationManager.pauseLocationFetching();
    }
    @Override
    public void onStart()
    {
        super.onStart();
        if(gps == null){
            gps = new GPSTrackerEx(IssuesActivity.this);
        }
        bindService(new Intent(IssuesActivity.this, LocationUpdatesService.class), mServiceConnection,
                Context.BIND_AUTO_CREATE);
        PreferenceManager.getDefaultSharedPreferences(this)
                .registerOnSharedPreferenceChangeListener(this);

    }
    @Override
    public void onResume()
    {
        // TODO: Implement this method
        super.onResume();
        screenWakeLock();
        LocalBroadcastManager.getInstance(this).registerReceiver(myReceiver,
                new IntentFilter(LocationUpdatesService.ACTION_BROADCAST));
        /*if(imgCompass.getTag().equals(R.drawable.compass)) {
            sensorManager.registerListener(UnitSelectionActivity.this, sensorManager.getDefaultSensor(Sensor.TYPE_ORIENTATION), SensorManager.SENSOR_DELAY_GAME);
        }*/
    }
    /*@Override
    public void onDestroy()
    {
        // TODO: Implement this method
        super.onDestroy();
        gps.stopUsingGPS();
       // screenWakeLock();
        *//*if(imgCompass.getTag().equals(R.drawable.compass)) {
            sensorManager.registerListener(UnitSelectionActivity.this, sensorManager.getDefaultSensor(Sensor.TYPE_ORIENTATION), SensorManager.SENSOR_DELAY_GAME);
        }*//*
    }*/

    /*@Override
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
    }*/

    /*@Override
    public void onAccuracyChanged(Sensor p1, int p2)
    {
        // TODO: Implement this method
    }*/
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

    @Override
    public void locationChanged(Location mLocation) {
        /*String location = String.valueOf(mLocation.getLatitude() + ", " + String.valueOf(mLocation.getLongitude()));
        txtDegrees.setText(location);*/

        //tvLatitude.setText(String.valueOf(mLocation.getLatitude()));
        //tvLongitude.setText(String.valueOf(mLocation.getLongitude()));
        /*cLocation = mLocation;
        CURRENT_LOCATION = String.valueOf(mLocation.getLatitude()) + "," + String.valueOf(mLocation.getLongitude());
        LatLong location = new LatLong(Double.toString(mLocation.getLatitude()), Double.toString(mLocation.getLongitude()));
        //tvLocation.setText(getLocationDescription(location, UnitSelectionActivity.this));
        listUpdate(String.valueOf(mLocation.getLatitude()), String.valueOf(mLocation.getLongitude()));*/
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
       // getMenuInflater().inflate(R.menu.menu_issues, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onFragmentInteraction(Uri uri) {

    }

    @Override
    public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, String key) {

    }

    /**
     * A placeholder fragment containing a simple view.
     */
    public static class PlaceholderFragment extends Fragment {
        /**
         * The fragment argument representing the section number for this
         * fragment.
         */
        private static final String ARG_SECTION_NUMBER = "section_number";
        private Context _context;



        public PlaceholderFragment() {
        }

        /**
         * Returns a new instance of this fragment for the given section
         * number.
         */
        public static PlaceholderFragment newInstance(int sectionNumber) {
            PlaceholderFragment fragment = new PlaceholderFragment();
            Bundle args = new Bundle();
            args.putInt(ARG_SECTION_NUMBER, sectionNumber);
            fragment.setArguments(args);
            return fragment;
        }

        @Override
        public View onCreateView(LayoutInflater inflater, ViewGroup container,
                                 Bundle savedInstanceState) {
            final View rootView = inflater.inflate(R.layout.fragment_issues, container, false);
            //TextView textView = (TextView) rootView.findViewById(R.id.section_label);


            // textView.setText(getString(R.string.section_format, getArguments().getInt(ARG_SECTION_NUMBER)));
            return rootView;
        }
    }

    /**
     * A {@link FragmentPagerAdapter} that returns a fragment corresponding to
     * one of the sections/tabs/pages.
     */
    public class SectionsPagerAdapter extends FragmentPagerAdapter {
        private Context _context;

        public SectionsPagerAdapter(FragmentManager fm, Context context) {
            super(fm);
            this._context = context;
        }

        @Override
        public Fragment getItem(int position) {
            // getItem is called to instantiate the fragment for the given page.
            // Return a PlaceholderFragment (defined as a static inner class below).
            switch (position){
                case 0:
                    return IssueFragment.newInstance("First", "Issues");
                    //AssetFragment.newInstance("First", "Units");//
                    case 1:
                        return FormFragment.newInstance("Second","Forms");
                case 2:
                    return UnitsFragment.newInstance("Third", "Units");
            }
            return PlaceholderFragment.newInstance(position + 1);
        }

        @Override
        public int getCount() {
            // Show 3 total pages.
            return 3;
        }
    }

    @Override
    public boolean onSupportNavigateUp() {
        //code it to launch an intent to the activity you want
        //gps.unbindService();
        finish();
        return true;
    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {

        if(requestCode == SECOND_ACTIVITY_REQUEST_CODE){
            if(resultCode == RESULT_OK){
                String returnedResult = data.getData().toString();
                if(returnedResult.equals(ADAPTER_REFRESH_MSG)){
                    if(getFragmentRefreshIssueListener()!=null){
                        getFragmentRefreshIssueListener().onRefresh();
                    }
                }
            }
        }
        if (requestCode == 1) {
            if(resultCode == Activity.RESULT_OK){
                String result=data.getStringExtra("result");
                if(result.equals("selected")){
                   // updateInstructions();
                        /*// find your fragment
                        FormFragment f = (FormFragment) getActivity().getSupportFragmentManager().findFragmentByTag(getFragmentTag(1));
                        // update the list view
                        f.refreshView();*/
                        if(Globals.selectedUnit !=null){
                            tvAssetType.setText(Globals.selectedUnit.getAssetType());
                            tvAssetTitle.setText(Globals.selectedUnit.getDescription());
                        }
                    if(getFragmentRefreshIssueListener()!=null){
                        getFragmentRefreshIssueListener().onRefresh();
                    }
                    if(getFragmentRefreshFormListener()!=null){
                        getFragmentRefreshFormListener().onRefresh();
                    }
                    if(getFragmentRefreshUnitListener()!=null){
                        getFragmentRefreshUnitListener().onRefresh();
                    }
                    bottom_sheet.fullScroll(View.FOCUS_UP);
                    bottom_sheet.smoothScrollTo(0,0);
                    sheetBehavior.setState(BottomSheetBehavior.STATE_COLLAPSED);
                   /* Fragment frg = null;
                    Fragment frgRpt = null;
                    frg = getActivity().getSupportFragmentManager().findFragmentByTag(getFragmentTag(1));
                    frgRpt = getActivity().getSupportFragmentManager().findFragmentByTag(getFragmentTag(2));
                    final FragmentTransaction ft = getActivity().getSupportFragmentManager().beginTransaction();
                    if(frg!=null){
                        ft.detach(frg);
                        ft.attach(frg);
                    }
                    for(int i = 0; i < spValues.size(); i++) {
                        if(spValues.get(i).getUnit().getDescription().equals(Globals.selectedDUnit.getUnit().getDescription())){
                            spAsset.setSelection(i);
                        }
                    }*/
                }
            }
            if (resultCode == Activity.RESULT_CANCELED) {
                //Write your code if there's no result
            }
        }
    }//onActivityResult
    public interface FragmentRefreshIssueListener{
        void onRefresh();
    }
    public interface FragmentRefreshFormListener{
        void onRefresh();
    }
    public interface FragmentRefreshUnitListener{
        void onRefresh();
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
    /**
     * Receiver for broadcasts sent by {@link LocationUpdatesService}.
     */
    private class MyReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            Location mLocation = intent.getParcelableExtra(LocationUpdatesService.EXTRA_LOCATION);
            if (mLocation != null) {
                cLocation = mLocation;
                CURRENT_LOCATION = String.valueOf(mLocation.getLatitude()) + "," + String.valueOf(mLocation.getLongitude());
                LatLong location = new LatLong(Double.toString(mLocation.getLatitude()), Double.toString(mLocation.getLongitude()));
                //tvLocation.setText(getLocationDescription(location, UnitSelectionActivity.this));
                listUpdate(String.valueOf(mLocation.getLatitude()), String.valueOf(mLocation.getLongitude()));
                /*Toast.makeText(IssuesActivity.this, Utils.getLocationText(mLocation),
                        Toast.LENGTH_SHORT).show();*/
            }
        }
    }
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
    private static final String TAG = "resPMain";

    // Used in checking for runtime permissions.
    private static final int REQUEST_PERMISSIONS_REQUEST_CODE = 34;

    // The BroadcastReceiver used to listen from broadcasts from the service.
    private MyReceiver myReceiver;

    // A reference to the service used to get location updates.
    private LocationUpdatesService mService = null;

    // Tracks the bound state of the service.
    private boolean mBound = false;
}