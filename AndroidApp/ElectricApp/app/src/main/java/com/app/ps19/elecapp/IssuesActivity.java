package com.app.ps19.elecapp;

import static com.app.ps19.elecapp.IssueFragment.SECOND_ACTIVITY_REQUEST_CODE;
import static com.app.ps19.elecapp.Shared.Globals.ADAPTER_REFRESH_MSG;
import static com.app.ps19.elecapp.Shared.Globals.CURRENT_LOCATION;
import static com.app.ps19.elecapp.Shared.Globals.TASK_FINISHED_STATUS;
import static com.app.ps19.elecapp.Shared.Globals.TASK_IN_PROGRESS_STATUS;
import static com.app.ps19.elecapp.Shared.Globals.TASK_NOT_STARTED_STATUS;
import static com.app.ps19.elecapp.Shared.Globals.appName;
import static com.app.ps19.elecapp.Shared.Globals.getBlinkAnimation;
import static com.app.ps19.elecapp.Shared.Globals.getSelectedTask;
import static com.app.ps19.elecapp.Shared.Globals.isMaintainer;
import static com.app.ps19.elecapp.Shared.Globals.isTimpsApp;
import static com.app.ps19.elecapp.Shared.Globals.selectedUnit;
import static com.app.ps19.elecapp.Shared.Globals.setLocale;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.content.res.Resources;
import android.location.Location;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.PowerManager;
import android.preference.PreferenceManager;
import android.util.Log;
import android.util.TypedValue;
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

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.view.ViewCompat;
import androidx.core.widget.NestedScrollView;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;
import androidx.fragment.app.FragmentStatePagerAdapter;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;
import androidx.viewpager.widget.PagerAdapter;
import androidx.viewpager.widget.ViewPager;

import com.app.ps19.elecapp.Shared.FragmentToActivityInterface;
import com.app.ps19.elecapp.Shared.Globals;
import com.app.ps19.elecapp.Shared.Res;
import com.app.ps19.elecapp.Shared.Utilities;
import com.app.ps19.elecapp.classes.DUnit;
import com.app.ps19.elecapp.classes.LatLong;
import com.app.ps19.elecapp.classes.Units;
import com.app.ps19.elecapp.classes.maintenance.WorkOrderListFragment;
import com.app.ps19.elecapp.location.Interface.OnLocationUpdatedListener;
import com.app.ps19.elecapp.location.LocationUpdatesService;
import com.google.android.material.bottomsheet.BottomSheetBehavior;
import com.google.android.material.tabs.TabLayout;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;

public class IssuesActivity extends AppCompatActivity implements
        FormFragment.OnFragmentInteractionListener,
        com.app.ps19.elecapp.UnitsFragment.OnFragmentInteractionListener,
        com.app.ps19.elecapp.IssueFragment.OnFragmentInteractionListener,
        AssetFragment.OnFragmentInteractionListener,
        SharedPreferences.OnSharedPreferenceChangeListener,
       // onLocReceive,
        FragmentToActivityInterface,
        DynFormListFragment.OnFragmentInteractionListener,
        OnLocationUpdatedListener {

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
  //  GPSTrackerEx gps;
    volatile Location cLocation;
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
    TextView tvTaskStatus;

    private FragmentRefreshFormListener fragmentRefreshFormListener;
    private FragmentRefreshIssueListener fragmentRefreshIssueListener;
    private FragmentRefreshUnitListener fragmentRefreshUnitListener;
    private FragmentRefreshAssetFormListener fragmentRefreshAssetFormListener;

    public FragmentRefreshFormListener getFragmentRefreshFormListener() {
        return fragmentRefreshFormListener;
    }

    public FragmentRefreshAssetFormListener getFragmentRefreshAssetFormListener() {
        return fragmentRefreshAssetFormListener;
    }
    public void setFragmentRefreshAssetFormListener(FragmentRefreshAssetFormListener fragmentRefreshAssetFormListener) {
        this.fragmentRefreshAssetFormListener = fragmentRefreshAssetFormListener;
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

    private Res res;

    @Override public Resources getResources() {
        if (res == null) {
            res = new Res(super.getResources());
        }
        return res;
    }
    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //Listen to location Updates
        LocationUpdatesService.addOnLocationUpdateListener( this.getClass().getSimpleName() , this);
        setLocale(this);
        setContentView(R.layout.activity_issues);
        dialog=new ProgressDialog(this);
        showDialog("Please Wait!","Loading Assets. . . ");
        //-------------------GPS Code--------------
       // myReceiver = new MyReceiver();
        // Check that the user hasn't revoked permissions by going to Settings.
//        if (Utils.requestingLocationUpdates(this)) {
//        /*    if (!checkPermissions()) {
//                requestPermissions();
//            }*/
//        }
        //--------------------END-------------------

        // Calculating is yard inspection
        if(getSelectedTask() != null){
            findAndSetYardInspection();
        }
        bottom_sheet = findViewById(R.id.bottom_sheet);
        bottom_sheet.setVisibility(View.GONE);
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
        sheetBehavior.setState(BottomSheetBehavior.STATE_HIDDEN);
        bottom_sheet.scrollTo(0,0);

        Toolbar toolbar = (Toolbar) findViewById(R.id.tbIssues);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        if(isMaintainer) {
            toolbar.setTitle(getString(R.string.maintenance_title));
        }

        // Create the adapter that will return a fragment for each of the three
        // primary sections of the activity.
        mSectionsPagerAdapter = new SectionsPagerAdapter(getSupportFragmentManager(), this);

        // Set up the ViewPager with the sections adapter.
        mViewPager = (ViewPager) findViewById(R.id.container);
        mViewPager.setAdapter(mSectionsPagerAdapter);
        /* DO NOT FORGET! The ViewPager requires at least “1” minimum OffscreenPageLimit */
        int limit = (mSectionsPagerAdapter.getCount() > 1 ? mSectionsPagerAdapter.getCount() - 1 : 1);
        mViewPager.setOffscreenPageLimit(limit);

        TabLayout tabLayout = (TabLayout) findViewById(R.id.tabs);
        //Index of Maintain tab
        //TabLayout.Tab tabSecond = tabLayout.getTabAt(1);
        //TabLayout.Tab tabThird = tabLayout.getTabAt(2); //Info Tab

        //Testing the code
        // Give the TabLayout the ViewPager

        tabLayout.setupWithViewPager(mViewPager);

        // Iterate over all tabs and set the custom view
        for (int i = 0; i < tabLayout.getTabCount(); i++) {
            TabLayout.Tab tab = tabLayout.getTabAt(i);
            tab.setCustomView(mSectionsPagerAdapter.getTabView(i));
        }
        //End of testing code

        /*if(appName.equals(Globals.AppName.TIMPS)){
            tabSecond.setText(R.string.tab_text_4);
            tabThird.setText(R.string.tab_text_4_scim);
        } else if(appName.equals(Globals.AppName.SCIM)){
            tabSecond.setText(R.string.tab_text_4_scim);
        }*/

        tabLayout.setBackgroundColor(res.getColor(R.color.action_bar_background));
        toolbar.setBackgroundColor(res.getColor(R.color.action_bar_background));
        tvTaskStatus = (TextView) findViewById(R.id.tv_task_status);
        setTaskView(getSelectedTask().getStatus());

        mViewPager.addOnPageChangeListener(new TabLayout.TabLayoutOnPageChangeListener(tabLayout));
        tabLayout.addOnTabSelectedListener(new TabLayout.ViewPagerOnTabSelectedListener(mViewPager));
        // without this listener the tabs would still get updated when fragments are swiped, but ....  (read the next comment)
        tabLayout.setOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                if(tab.getText().toString().equals(getResources().getString(R.string.tab_text_1))){
                    //sheetBehavior.setHideable(false);
                    //sheetBehavior.setState(BottomSheetBehavior.STATE_COLLAPSED);
                    sheetBehavior.setHideable(true);
                    sheetBehavior.setState(BottomSheetBehavior.STATE_HIDDEN);
                } else if(tab.getText().toString().equals(getResources().getString(R.string.tab_text_2))){
                    sheetBehavior.setHideable(true);
                    sheetBehavior.setState(BottomSheetBehavior.STATE_HIDDEN);
                } else if(tab.getText().toString().equals(getResources().getString(R.string.tab_text_3))){
                    sheetBehavior.setHideable(true);
                    sheetBehavior.setState(BottomSheetBehavior.STATE_HIDDEN);
                } else if(tab.getText().toString().equals(getResources().getString(R.string.tab_text_4))){
                    sheetBehavior.setHideable(true);
                    sheetBehavior.setState(BottomSheetBehavior.STATE_HIDDEN);
                }
                //Toast.makeText(IssuesActivity.this, "tabSelected:  " + tab.getText(), Toast.LENGTH_SHORT).show();
                // no where in the code it is defined what will happen when tab is tapped/selected by the user
                // this is why the following line is necessary
                // we need to manually set the correct fragment when a tab is selected/tapped
                // and this is the problem in your code
                mViewPager.setCurrentItem(tab.getPosition());
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {

            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {
                //Toast.makeText(IssuesActivity.this, "tabReSelected:  " + tab.getText(), Toast.LENGTH_SHORT).show();

                // Reload your recyclerView here
            }});

        if(getSelectedTask().getWholeUnitList().size() == 0){
            Toast.makeText(IssuesActivity.this, "No Asset available to proceed!", Toast.LENGTH_SHORT).show();
            //gps.unbindService();
            finishActivity();
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

        if (Globals.selectedUnit == null) {
            if(appName.equals(Globals.AppName.SCIM)){
                for(Units unit: getSelectedTask().getWholeUnitList()) {
                    if (!unit.getAssetTypeClassify().equals("linear")) {
                        selectedUnit = unit;
                        break;
                    }
                }
            } else{
                selectFirstAsset();
            }
            //Intent intent = new Intent(IssuesActivity.this, UnitSelectionActivity.class);
            //startActivityForResult(intent, 1);
        }
        tvAssetType.setText(Globals.selectedUnit.getAssetType());
        tvAssetTitle.setText(Globals.selectedUnit.getDescription());
        ViewCompat.setNestedScrollingEnabled(lvStaticUnits, true);

        ibtUnitListMap.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent=new Intent(IssuesActivity.this,AssetMapsActivity.class);

                if(cLocation != null){
                    startActivityForResult(intent, 1);
                } else {
                    Log.e(TAG, "GPS Service Not Availiable");
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

        cLocation = LocationUpdatesService.getLocation();
        if ( cLocation != null) {

            preLongitude = cLocation.getLongitude();
            preLatitude = cLocation.getLatitude();

            //tvLatitude.setText(Double.toString(gps.getLatitude()));
            //tvLongitude.setText(Double.toString(gps.getLongitude()));
            CURRENT_LOCATION = LocationUpdatesService.getLocationText(cLocation);
            //String.valueOf(cLocation.getLatitude()) + "," + String.valueOf(cLocation.getLongitude());

            LatLong location = new LatLong(Double.toString(preLatitude), Double.toString(preLongitude));
            //tvLocation.setText(getLocationDescription(location, UnitSelectionActivity.this));
            staticList = getSelectedTask().getUnitList(location.getLatLng());
            for (Iterator<DUnit> it = staticList.iterator(); it.hasNext();) {
                //if (it.next().getDistance()>=0) {
                //    it.remove();
                //}
                if(!it.next().isLinear()){
                    it.remove();
                }
            }
            sortedList =getSelectedTask().getUnitList(location.getLatLng());
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
        } //else {
           // gps.showSettingsAlert();
        //}

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
                if(getFragmentRefreshAssetFormListener()!=null){
                    getFragmentRefreshAssetFormListener().onRefresh();
                }
                tvAssetType.setText(Globals.selectedUnit.getAssetType());
                tvAssetTitle.setText(Globals.selectedUnit.getDescription());
                bottom_sheet.fullScroll(View.FOCUS_UP);
                bottom_sheet.smoothScrollTo(0,0);
                sheetBehavior.setState(BottomSheetBehavior.STATE_HIDDEN);
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
        params.height = totalHeight + (listView.getDividerHeight() * (listAdapter.getCount() - 1));
        //params.height = totalHeight + (listView.getDividerHeight() * (listAdapter.getCount()))+55;
        listView.setLayoutParams(params);
        listView.requestLayout();
    }
    public void listUpdate(String lat, String lon){
        try {
            LatLong location = null;
            location = new LatLong(lat, lon);
            //staticList.clear();
            //TODO null check
            staticList =getSelectedTask().getUnitList(location.getLatLng());
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
            sortedList = getSelectedTask().getUnitList(location.getLatLng());
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
            if(selectionSortedAdt != null && selectionStaticAdt != null){
                selectionStaticAdt.setNotifyOnChange(false); // Prevents 'clear()' from clearing/resetting the listview
                selectionStaticAdt.clear();
                selectionStaticAdt.addAll(staticList);
                selectionStaticAdt.notifyDataSetChanged();

                selectionSortedAdt.setNotifyOnChange(false); // Prevents 'clear()' from clearing/resetting the listview
                selectionSortedAdt.clear();
                selectionSortedAdt.addAll(sortedList);
                selectionSortedAdt.notifyDataSetChanged();
            }

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
//        if (mBound) {
//            // Unbind from the service. This signals to the service that this activity is no longer
//            // in the foreground, and the service can respond by promoting itself to a foreground
//            // service.
//            unbindService(mServiceConnection);
//            mBound = false;
//        }
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
//        if (mBound) {
//            // Unbind from the service. This signals to the service that this activity is no longer
//            // in the foreground, and the service can respond by promoting itself to a foreground
//            // service.
//            unbindService(mServiceConnection);
//            mBound = false;
//        }
        //gps.unbindService();
        //Remove Location Updates
        LocationUpdatesService.removeLocationUpdateListener(this.getClass().getSimpleName());
        super.onDestroy();
    }

    @Override
    public void onPause() {
        super.onPause();
        //mThreadPool.shutdownNow();
        if(mWakeLock.isHeld()){
            try {
                mWakeLock.release();
                //Remove Location Updates
                LocationUpdatesService.removeLocationUpdateListener(this.getClass().getSimpleName());
                //LocalBroadcastManager.getInstance(this).unregisterReceiver(myReceiver);
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
        //Listen to location Updates
        LocationUpdatesService.addOnLocationUpdateListener( this.getClass().getSimpleName() , this);
        //TODO: GPS HERE
//        if(gps == null){
//            gps = new GPSTrackerEx(IssuesActivity.this);
//        }
//        bindService(new Intent(IssuesActivity.this, LocationUpdatesService.class), mServiceConnection,
//                Context.BIND_AUTO_CREATE);
        PreferenceManager.getDefaultSharedPreferences(this)
                .registerOnSharedPreferenceChangeListener(this);

    }
    @Override
    public void onResume()
    {
        // TODO: Implement this method
        super.onResume();
        screenWakeLock();
        //Listen to location Updates
        LocationUpdatesService.addOnLocationUpdateListener( this.getClass().getSimpleName() , this);
//        LocalBroadcastManager.getInstance(this).registerReceiver(myReceiver,
//                new IntentFilter(LocationUpdatesService.ACTION_BROADCAST));
        setLocale(this);
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

//    @Override
//    public void locationChanged(Location mLocation) {
//        /*String location = String.valueOf(mLocation.getLatitude() + ", " + String.valueOf(mLocation.getLongitude()));
//        txtDegrees.setText(location);*/
//
//        //tvLatitude.setText(String.valueOf(mLocation.getLatitude()));
//        //tvLongitude.setText(String.valueOf(mLocation.getLongitude()));
//        /*cLocation = mLocation;
//        CURRENT_LOCATION = String.valueOf(mLocation.getLatitude()) + "," + String.valueOf(mLocation.getLongitude());
//        LatLong location = new LatLong(Double.toString(mLocation.getLatitude()), Double.toString(mLocation.getLongitude()));
//        //tvLocation.setText(getLocationDescription(location, UnitSelectionActivity.this));
//        listUpdate(String.valueOf(mLocation.getLatitude()), String.valueOf(mLocation.getLongitude()));*/
//    }


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

    @Override
    public void onAssetChange() {
        if(getFragmentRefreshFormListener()!=null){
            getFragmentRefreshFormListener().onRefresh();
        }
        if(getFragmentRefreshUnitListener()!=null){
            getFragmentRefreshUnitListener().onRefresh();
        }
        if(getFragmentRefreshAssetFormListener()!=null){
            getFragmentRefreshAssetFormListener().onRefresh();
        }
    }

    @Override
    public void onLocationUpdated(Location location) {
        if(!LocationUpdatesService.canGetLocation() || location.getProvider().equals("None")) { Utilities.showSettingsAlert(IssuesActivity.this); return;}
        if (location != null) {
            cLocation = location;
            CURRENT_LOCATION = LocationUpdatesService.getLocationText(cLocation);
            //String.valueOf(location.getLatitude()) + "," + String.valueOf(location.getLongitude());
            LatLong mlocation = new LatLong(Double.toString(location.getLatitude()), Double.toString(location.getLongitude()));
            //tvLocation.setText(getLocationDescription(location, UnitSelectionActivity.this));
            listUpdate(String.valueOf(location.getLatitude()), String.valueOf(location.getLongitude()));
                /*Toast.makeText(IssuesActivity.this, Utils.getLocationText(mLocation),
                        Toast.LENGTH_SHORT).show();*/
        }

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
        ArrayList<String> tabTitles = new ArrayList<>();
    // site: Inspect, Forms, Info, report
    // timps: Inspect, Maintain, Form, Report
        public SectionsPagerAdapter(FragmentManager fm, Context context) {
            super(fm);
            fillTabTitles(context);
            this._context = context;
        }
        private void fillTabTitles(Context context){
            if(appName.equals(Globals.AppName.TIMPS)){
                if(isMaintainer){
                    tabTitles.add(context.getString(R.string.tab_text_4));
                } else{
                    tabTitles.add(context.getString(R.string.tab_text_1));
                    tabTitles.add(context.getString(R.string.tab_text_4));
                    tabTitles.add(context.getString(R.string.tab_text_4_scim));
                    tabTitles.add(context.getString(R.string.tab_text_2));
                }
            }else if(appName.equals(Globals.AppName.SCIM)){
                tabTitles.add(context.getString(R.string.tab_text_1));
                tabTitles.add(context.getString(R.string.tab_text_4_scim));
                tabTitles.add(context.getString(R.string.tab_text_3));
                tabTitles.add(context.getString(R.string.tab_text_2));
            }
        }

        @Override
        public Fragment getItem(int position) {
            // getItem is called to instantiate the fragment for the given page.
            // Return a PlaceholderFragment (defined as a static inner class below).
            switch (position){
                case 0:
                    if(isMaintainer && isTimpsApp()){
                            return WorkOrderListFragment.newInstance("", "");
                    } else {
                        return com.app.ps19.elecapp.IssueFragment.newInstance("First", "#2E3192");
                    }
                    //AssetFragment.newInstance("First", "Units");//
                case 1:
                    //return FormFragment.newInstance("Second","Forms");
                    //return FormFragment.newInstance("Second", "Forms");
                   //return  DynFormListFragment.newInstance("assetType", selectedUnit.getAssetType());
                    Fragment fragment;
                    if(Globals.isTimpsApp()){
                        //fragment=MaintainFragment.newInstance("","");
                        fragment= WorkOrderListFragment.newInstance("","");
                    }else{
                        fragment=DynFormListFragment.newInstance("assetType", selectedUnit.getAssetType());
                    }
                    return fragment;
                case 2:
                    return com.app.ps19.elecapp.UnitsFragment.newInstance("Third", "Units");
                case 3:
                //return DynFormFragment.newInstance("Form","List");
                return DynFormListFragment.newInstance("","");
            }
            return PlaceholderFragment.newInstance(position + 1);
        }

        @Override
        public int getCount() {
            // Show 4 total pages.
            if(isMaintainer){
                return 1;
            } else
                return 4;
        }
        @Override
        public CharSequence getPageTitle(int position) {
            // Generate title based on item position
            return tabTitles.get(position);
        }

        public View getTabView(int position) {
            View tab = LayoutInflater.from(IssuesActivity.this).inflate(R.layout.issue_tab_custom_title, null);
            TextView tv = (TextView) tab.findViewById(R.id.custom_text);
            tv.setText(tabTitles.get(position));
            return tab;
        }

    }

    @Override
    public boolean onSupportNavigateUp() {
        //code it to launch an intent to the activity you want
        //gps.unbindService();
        finishActivity();
        return true;
    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {

        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == SECOND_ACTIVITY_REQUEST_CODE) {
            if (resultCode == RESULT_OK) {
                String returnedResult = data.getData().toString();
                if (returnedResult.equals(ADAPTER_REFRESH_MSG)) {
                    if (getFragmentRefreshIssueListener() != null) {
                        getFragmentRefreshIssueListener().onRefresh();
                    }
                }
            }
        }
        if (requestCode == com.app.ps19.elecapp.IssueFragment.MAP_SELECTION_REQUEST_CODE) {
            if (resultCode == Activity.RESULT_OK) {
                String result = data.getStringExtra("result");
                if (result.equals("selected")) {
                    // updateInstructions();
                        /*// find your fragment
                        FormFragment f = (FormFragment) getActivity().getSupportFragmentManager().findFragmentByTag(getFragmentTag(1));
                        // update the list view
                        f.refreshView();*/
                    if (selectedUnit != null) {
                        tvAssetType.setText(selectedUnit.getAssetType());
                        tvAssetTitle.setText(selectedUnit.getDescription());
                    }
                    if (getFragmentRefreshIssueListener() != null) {
                        getFragmentRefreshIssueListener().onRefresh();
                    }
                    if (getFragmentRefreshFormListener() != null) {
                        getFragmentRefreshFormListener().onRefresh();
                    }
                    if (getFragmentRefreshUnitListener() != null) {
                        getFragmentRefreshUnitListener().onRefresh();
                    }
                    if (getFragmentRefreshAssetFormListener() != null) {
                        getFragmentRefreshAssetFormListener().onRefresh();
                    }
                    bottom_sheet.fullScroll(View.FOCUS_UP);
                    bottom_sheet.smoothScrollTo(0, 0);
                    sheetBehavior.setState(BottomSheetBehavior.STATE_HIDDEN);
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
    public interface FragmentRefreshAssetFormListener{
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
    public void onBackPressed() {
//        if (mBound) {
//            // Unbind from the service. This signals to the service that this activity is no longer
//            // in the foreground, and the service can respond by promoting itself to a foreground
//            // service.
//            unbindService(mServiceConnection);
//            mBound = false;
//        }
        Intent intent = new Intent();
        intent.putExtra("status", "close");
        setResult(RESULT_OK, intent);
        super.onBackPressed();
    }
   /* @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        switch(keyCode){
            case KeyEvent.KEYCODE_BACK:
                //gps.unbindService();
                if (mBound) {
                    // Unbind from the service. This signals to the service that this activity is no longer
                    // in the foreground, and the service can respond by promoting itself to a foreground
                    // service.
                    unbindService(mServiceConnection);
                    mBound = false;
                }
                finishActivity();
                return true;
        }
        return super.onKeyDown(keyCode, event);
    }*/
   //   /**
//     * Receiver for broadcasts sent by {@link LocationUpdatesService}.
//     */
//    private class MyReceiver extends BroadcastReceiver {
//        @Override
//        public void onReceive(Context context, Intent intent) {
//            Location mLocation = intent.getParcelableExtra(LocationUpdatesService.EXTRA_LOCATION);
//            if (mLocation != null) {
//                cLocation = mLocation;
//                CURRENT_LOCATION = String.valueOf(mLocation.getLatitude()) + "," + String.valueOf(mLocation.getLongitude());
//                LatLong location = new LatLong(Double.toString(mLocation.getLatitude()), Double.toString(mLocation.getLongitude()));
//                //tvLocation.setText(getLocationDescription(location, UnitSelectionActivity.this));
//                listUpdate(String.valueOf(mLocation.getLatitude()), String.valueOf(mLocation.getLongitude()));
//                /*Toast.makeText(IssuesActivity.this, Utils.getLocationText(mLocation),
//                        Toast.LENGTH_SHORT).show();*/
//            }
//        }
//    }
    // Monitors the state of the connection to the service.
//    private final ServiceConnection mServiceConnection = new ServiceConnection() {
//
//        @Override
//        public void onServiceConnected(ComponentName name, IBinder service) {
//            LocationUpdatesService.LocalBinder binder = (LocationUpdatesService.LocalBinder) service;
//            mService = binder.getService();
//            mBound = true;
//            if(mService!=null){
//                mService.requestLocationUpdates();
//            }
//        }
//
//        @Override
//        public void onServiceDisconnected(ComponentName name) {
//            mService = null;
//            mBound = false;
//        }
//    };
    private static final String TAG = "resPMain";

    // Used in checking for runtime permissions.
    private static final int REQUEST_PERMISSIONS_REQUEST_CODE = 34;

    // The BroadcastReceiver used to listen from broadcasts from the service.
   // private MyReceiver myReceiver;

    // A reference to the service used to get location updates.
   // private LocationUpdatesService mService = null;

    // Tracks the bound state of the service.
   // private boolean mBound = false;
    public float dpToPixel(int dp) {
        Resources r = getResources();
        float px = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, dp, r.getDisplayMetrics());
        return px;
    }
    private void finishActivity(){
        Intent intent = new Intent();
        intent.putExtra("status", "close");
        setResult(RESULT_OK, intent);
        finish();
    }
    private void setTaskView(String status){
        switch (status) {
            case "":
            case TASK_NOT_STARTED_STATUS:
                //setInitTaskView();
                break;
            case TASK_IN_PROGRESS_STATUS:
                //setInProgressTaskView();
                break;
            case TASK_FINISHED_STATUS:
                setFinishedTaskView();
                break;
        }
    }

    private void setFinishedTaskView() {
        tvTaskStatus.setText(getString(R.string.task_finished_status));
        tvTaskStatus.setAnimation(getBlinkAnimation());
    }
    private void selectFirstAsset(){
        for (Units unit: getSelectedTask().getWholeUnitList()){
            if(!unit.getAssetTypeObj().isLocation()){
                selectedUnit = unit;
                break;
            }
        }
    }
    private void findAndSetYardInspection(){
        for(Units asset: getSelectedTask().getWholeUnitList()){
            if(asset.getAssetTypeObj().isMarkerMilepost()){
                getSelectedTask().setYardInspection(true);
            }
        }
    }
}