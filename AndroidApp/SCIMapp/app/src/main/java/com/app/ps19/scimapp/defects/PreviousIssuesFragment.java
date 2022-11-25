package com.app.ps19.scimapp.defects;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.Typeface;
import android.location.Location;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ExpandableListView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import androidx.core.app.ActivityCompat;
import androidx.fragment.app.Fragment;

import com.app.ps19.scimapp.R;
import com.app.ps19.scimapp.classes.UnitsDefectsOpt;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;

import java.util.ArrayList;

import static com.app.ps19.scimapp.Shared.Globals.selectedJPlan;
import static com.app.ps19.scimapp.Shared.Globals.selectedUnit;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link PreviousIssuesFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class PreviousIssuesFragment extends Fragment implements OnMapReadyCallback {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String selectedUnitID;
    private String mParam2;
    private ExpandableListView evDefectsList;
    View rootView;
    Context _context;
    private previousDefectsAdapter adapter;
    private ArrayList<UnitsDefectsOpt> prevDefectsList = new ArrayList<>();
    private GoogleMap mMap;
    private ScrollView svMainContainer;
    private ImageView ivTransparent;
    private UnitsDefectsOpt selectedDefect;
    private TextView tvLocName;
    private TextView tvIssueCount;
    private Marker prevMarker =null;
    public PreviousIssuesFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param unitID Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment PreviousIssuesFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static PreviousIssuesFragment newInstance(String unitID, String param2) {
        PreviousIssuesFragment fragment = new PreviousIssuesFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, unitID);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            selectedUnitID = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        rootView = inflater.inflate(R.layout.fragment_previous_issues, container, false);
        _context = rootView.getContext();
        evDefectsList = rootView.findViewById(R.id.el_previous_issues);
        tvLocName = rootView.findViewById(R.id.tv_loc_name);
        tvIssueCount = rootView.findViewById(R.id.tv_issue_count);
        initializeMap();
//        svMainContainer = rootView.findViewById(R.id.sv_main_container);
        ivTransparent = rootView.findViewById(R.id.transparent_image);

        tvLocName.setText(selectedUnit.getDescription());

        DisplayMetrics metrics = new DisplayMetrics();
        requireActivity().getWindowManager().getDefaultDisplay().getMetrics(metrics);
        int width = metrics.widthPixels;

        prevDefectsList = selectedJPlan.getTaskList().get(0).getUnitDefectsListByID(selectedUnitID);

        selectedDefect = prevDefectsList.get(0);
        tvIssueCount.setText(String.valueOf(prevDefectsList.size()));


        adapter = new previousDefectsAdapter(_context, prevDefectsList);

        // setting list adapter
        evDefectsList.setAdapter(adapter);



        evDefectsList.setOnChildClickListener(new ExpandableListView.OnChildClickListener() {
            @Override
            public boolean onChildClick(ExpandableListView expandableListView, View view,
                                        int groupPosition, int childPosition, long l) {
                //  selectedIssue = prevDefectsList.get(groupPosition);

                int index = expandableListView.getFlatListPosition(ExpandableListView
                        .getPackedPositionForChild(groupPosition, childPosition));
                expandableListView.setItemChecked(index, true);

                onIssueClick();
                return false;
            }
        });


        evDefectsList.setOnGroupExpandListener(new ExpandableListView.OnGroupExpandListener() {
            int previousItem = -1;

            @Override
            public void onGroupExpand(int groupPosition) {
                if(groupPosition != previousItem ) {
                    evDefectsList.collapseGroup(previousItem);
                }
                previousItem = groupPosition;

                selectedDefect = prevDefectsList.get(groupPosition);
                onIssueClick();

            }
        });

        evDefectsList.setOnGroupClickListener(new ExpandableListView.OnGroupClickListener() {
            @Override
            public boolean onGroupClick(ExpandableListView parent, View view, int groupPosition, long id) {
                int index = parent.getFlatListPosition(ExpandableListView
                        .getPackedPositionForGroup(groupPosition));
                parent.setItemChecked(index, true);

                return false;
            }
        });

        evDefectsList.setOnGroupCollapseListener(new ExpandableListView.OnGroupCollapseListener() {
            @Override
            public void onGroupCollapse(int groupPosition) {
                if(mMap != null) {
                    mMap.clear();
                }
            }

            int previousItem = -1;
        });

        //evDefectsList.expandGroup(0);

        return rootView;

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

        Location loc = selectedDefect.getLocation();
        LatLng asset = new LatLng(loc.getLatitude(), loc.getLongitude());

        try {
            mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(asset, 50));

            prevMarker = googleMap.addMarker(new MarkerOptions()
                    .position(asset)
                    .title(selectedDefect.getTitle()).snippet(selectedDefect.getDescription()));
            prevMarker.showInfoWindow();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
    private void onIssueClick(){

        if (mMap == null) return;

        mMap.clear();
        Location loc = selectedDefect.getLocation();
        LatLng asset = new LatLng(loc.getLatitude(), loc.getLongitude());

        try {

            prevMarker = mMap.addMarker(new MarkerOptions()
                    .position(asset)
                    .title(selectedDefect.getTitle()).snippet(selectedDefect.getDescription()));
            prevMarker.showInfoWindow();

            mMap.animateCamera(CameraUpdateFactory.newLatLngZoom(asset, 50));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}