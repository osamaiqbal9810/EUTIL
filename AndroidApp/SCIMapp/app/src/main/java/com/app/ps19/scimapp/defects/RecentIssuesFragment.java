package com.app.ps19.scimapp.defects;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseExpandableListAdapter;
import android.widget.ExpandableListView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import androidx.core.app.ActivityCompat;
import androidx.fragment.app.Fragment;

import com.app.ps19.scimapp.R;
import com.app.ps19.scimapp.ReportAddActivity;
import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.classes.Report;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.squareup.picasso.Picasso;

import java.io.File;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.Locale;

import static android.view.View.GONE;
import static android.view.View.VISIBLE;
import static com.app.ps19.scimapp.Shared.Globals.appName;
import static com.app.ps19.scimapp.Shared.Globals.getSelectedTask;
import static com.app.ps19.scimapp.Shared.Globals.selectedJPlan;
import static com.app.ps19.scimapp.Shared.Globals.selectedUnit;
import static com.app.ps19.scimapp.Shared.Globals.setSelectedTask;
import static com.app.ps19.scimapp.Shared.Utilities.getImgPath;

//import static com.app.ps19.scimapp.Shared.Globals.selectedTask;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link RecentIssuesFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class RecentIssuesFragment extends Fragment implements OnMapReadyCallback{

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    private ExpandableListView issueList;
    View rootView;
    Context _context;
    private recentDefectsAdapter adapter;
    private ArrayList<Report> issues = new ArrayList<>();
    private GoogleMap mMap;
    private ScrollView svMainContainer;
    private ImageView ivTransparent;
    public static Report selectedIssue;
    private TextView tvLocName;
    private TextView tvIssueCount;
    public static final int SECOND_ACTIVITY_REQUEST_CODE = 0;
    private Marker prevMarker = null;
    private int currentViewID = -1;
    public RecentIssuesFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment RecentIssuesFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static RecentIssuesFragment newInstance(String param1, String param2) {
        RecentIssuesFragment fragment = new RecentIssuesFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment

        rootView = inflater.inflate(R.layout.fragment_recent_issues, container, false);
        _context = rootView.getContext();
        issueList = rootView.findViewById(R.id.el_recent_issues);
        tvLocName = rootView.findViewById(R.id.tv_loc_name);
        tvIssueCount = rootView.findViewById(R.id.tv_issue_count);

//      svMainContainer = rootView.findViewById(R.id.sv_main_container);
        ivTransparent = rootView.findViewById(R.id.transparent_image);
        initializeMap();
        //Workaround for map scrolling till yet
        /*ivTransparent.setOnTouchListener(new View.OnTouchListener() {

            @Override
            public boolean onTouch(View v, MotionEvent event) {
                int action = event.getAction();
                switch (action) {
                    case MotionEvent.ACTION_DOWN:

                    case MotionEvent.ACTION_MOVE:
                        // Disallow ScrollView to intercept touch events.
                        //svMainContainer.requestDisallowInterceptTouchEvent(true);
                        // Disable touch on transparent view
                        return false;

                    case MotionEvent.ACTION_UP:
                        // Allow ScrollView to intercept touch events.
                        //svMainContainer.requestDisallowInterceptTouchEvent(false);
                        return true;

                    default:
                        return true;
                }
            }
        });*/
        //issues = getUnitIssues();
        issues = getSelectedTask().getFilteredReports(selectedUnit.getUnitId());
        tvLocName.setText(selectedUnit.getDescription());
        tvIssueCount.setText(String.valueOf(issues.size()));

        DisplayMetrics metrics = new DisplayMetrics();
        requireActivity().getWindowManager().getDefaultDisplay().getMetrics(metrics);
        int width = metrics.widthPixels;
        if (selectedIssue == null) {
            selectedIssue = selectedJPlan.getTaskList().get(0).getReportList().get(0);
        }

        //issues = selectedJPlan.getTaskList().get(0).getReversedReportList();
        //issueList.setIndicatorBounds(width - GetDipsFromPixel((int)(width/25)), width - GetDipsFromPixel(15));
        Collections.reverse(issues);
        adapter = new recentDefectsAdapter(getActivity(), issues);

        // setting list adapter
        issueList.setAdapter(adapter);

        issueList.setOnChildClickListener(new ExpandableListView.OnChildClickListener() {
            @Override
            public boolean onChildClick(ExpandableListView expandableListView, View view,
                                        int groupPosition, int childPosition, long l) {
                selectedIssue = issues.get(groupPosition);
                onIssueClick();
                return false;
            }
        });

        issueList.setOnGroupExpandListener(new ExpandableListView.OnGroupExpandListener() {
            int previousItem = -1;

            @Override
            public void onGroupExpand(int groupPosition) {
                if(groupPosition != previousItem ) {
                    issueList.collapseGroup(previousItem);
                }
                previousItem = groupPosition;

                selectedIssue = issues.get(groupPosition);
                onIssueClick();
            }
        });

        issueList.setOnGroupCollapseListener(new ExpandableListView.OnGroupCollapseListener() {
            @Override
            public void onGroupCollapse(int groupPosition) {
                if(mMap != null) {
                    mMap.clear();
                }
            }

            int previousItem = -1;
        });



//        issueList.setOnGroupClickListener(new ExpandableListView.OnGroupClickListener() {
//            @Override
//            public boolean onGroupClick(ExpandableListView expandableListView, View view, int groupPosition, long l) {
//
//
//                return false;
//            }
//        });

        //issueList.expandGroup(0);
        return rootView;

    }
    private ArrayList<Report> getUnitIssues(){
        ArrayList<Report> issues = new ArrayList<>();
        for(Report issue: getSelectedTask().getReportList()){
            if(issue.getUnit().getUnitId().equals(selectedUnit.getUnitId())){
                issues.add(issue);
            }
        }
        return issues;
    }
    private void initializeMap() {
        SupportMapFragment supportMapFragment = (SupportMapFragment) getChildFragmentManager().findFragmentById(R.id.map_uca);
        supportMapFragment.getMapAsync(this);
    }
    public int GetDipsFromPixel(float pixels)
    {
        // Get the screen's density scale
        final float scale = getResources().getDisplayMetrics().density;
        // Convert the dps to pixels, based on density scale
        return (int) (pixels * scale + 0.5f);
    }
    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
        if (ActivityCompat.checkSelfPermission(_context, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(_context, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        mMap.setMyLocationEnabled(false);
        mMap.getUiSettings().setMyLocationButtonEnabled(false);

        mMap.setInfoWindowAdapter(new GoogleMap.InfoWindowAdapter() {

            @Override
            public View getInfoWindow(Marker arg0) {
                return null;
            }

            @Override
            public View getInfoContents(Marker marker) {

                LinearLayout info = new LinearLayout(_context);
                info.setOrientation(LinearLayout.VERTICAL);

                TextView title = new TextView(_context);
                title.setTextColor(Color.BLACK);
                title.setGravity(Gravity.CENTER);
                title.setTypeface(null, Typeface.BOLD);
                title.setText(marker.getTitle());

                TextView snippet = new TextView(_context);
                snippet.setTextColor(Color.GRAY);
                snippet.setText(marker.getSnippet());

                info.addView(title);
                info.addView(snippet);

                return info;
            }
        });

        /*mCurrLocationMarker = mMap.addMarker(new MarkerOptions().position(new LatLng(mLocation.getLatitude(), mLocation.getLongitude())).title("Current Location")
                .icon(BitmapDescriptorFactory.fromBitmap(getMarkerBitmapFromView(R.drawable.ic_person_white_24dp))));*/

        String[] loc = selectedIssue.getLocation().split(",");
        LatLng asset = new LatLng(Double.parseDouble(loc[0]), Double.parseDouble(loc[1]));

        try {
            mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(asset, 19));

            prevMarker = googleMap.addMarker(new MarkerOptions()
                    .position(asset)
                    .title(selectedIssue.getTitle()).snippet(selectedIssue.getDescription()));
            prevMarker.showInfoWindow();

        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    private void onIssueClick(){

        if(mMap == null)return;

        mMap.clear();

        String[] loc = selectedIssue.getLocation().split(",");
        LatLng asset = new LatLng(Double.parseDouble(loc[0]), Double.parseDouble(loc[1]));
        try {

            prevMarker =  mMap.addMarker(new MarkerOptions()
                    .position(asset)
                    .title(selectedIssue.getTitle()).snippet(selectedIssue.getDescription()));
            prevMarker.showInfoWindow();

            mMap.animateCamera(CameraUpdateFactory.newLatLngZoom(asset, 19));

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /*private boolean defaultUnitSelection(){

        if(isUseDefaultAsset){
            if(appName.equals(Globals.AppName.SCIM)){
                for(Units unit: Globals.selectedTask.getWholeUnitList()) {
                    if ((!unit.getAssetTypeClassify().equals("linear") &&
                            !unit.getAssetTypeClassify().equals("")) &&
                            (unit.getAssetTypeObj().isInspectable() && !unit.getAssetTypeObj().isLocation())) {
                        selectedUnit = unit;
                        return true;
                    }
                }
            } else if(appName.equals(Globals.AppName.TIMPS)){
                for(Units unit: Globals.selectedTask.getWholeUnitList()){
                    if(unit.getAttributes().isPrimary()){
                        Globals.selectedUnit = unit;
                        return true;
                    }
                }
                if(selectedUnit == null){
                    for(Units unit: Globals.selectedTask.getWholeUnitList()){
                        if(!unit.getAssetTypeObj().isLocation() && unit.getAssetTypeObj().isInspectable()){
                            Globals.selectedUnit = unit;
                            return true;
                        }
                    }
                }
            }

        }else {
            if(appName.equals(Globals.AppName.SCIM)){
                for(Units unit: Globals.selectedTask.getWholeUnitList()) {
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
        for (Units unit: Globals.selectedTask.getWholeUnitList()){
            if(!unit.getAssetTypeObj().isLocation() && unit.getAssetTypeObj().isInspectable()){
                selectedUnit = unit;
                return true;
            }
        }
        return false;
    }
*/

}