package com.app.ps19.elecapp.defects;

import static com.app.ps19.elecapp.Shared.Globals.selectedJPlan;
import static com.app.ps19.elecapp.Shared.Globals.selectedUnit;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.Typeface;
import android.location.Location;
import android.os.Bundle;
import android.view.Gravity;
import android.view.MenuItem;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import com.app.ps19.elecapp.AssetMarkerRender;
import com.app.ps19.elecapp.R;
import com.app.ps19.elecapp.Shared.Globals;
import com.app.ps19.elecapp.classes.ListViewDialog;
import com.app.ps19.elecapp.classes.LocItem;
import com.app.ps19.elecapp.classes.Units;
import com.app.ps19.elecapp.classes.UnitsDefectsOpt;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.Marker;
import com.google.maps.android.clustering.Cluster;
import com.google.maps.android.clustering.ClusterManager;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class PreviousDefectsMapActivity extends AppCompatActivity implements
         OnMapReadyCallback
        , ClusterManager.OnClusterClickListener<LocItem>
        , ClusterManager.OnClusterItemClickListener<LocItem>
        , ClusterManager.OnClusterItemInfoWindowClickListener<LocItem>
        , ClusterManager.OnClusterInfoWindowClickListener<LocItem> {

    // Declare a variable for the cluster manager.
    private ClusterManager<LocItem> mClusterManager;
    private String selectedUnitID;
    TextView tvDefectLocationName;
    TextView tvPrevDefectCount;
    Context _context;
    private GoogleMap mMap;
    private ArrayList<UnitsDefectsOpt> prevDefectsList = new ArrayList<>();

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();

        if (id == android.R.id.home) {
            onBackPressed();  return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        selectedUnitID = getIntent().getStringExtra("EXTRA_UNIT_ID");
        setContentView(R.layout.fragment_previous_map);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        setTitle(getString(R.string.title_previous_defects_on_map));
        _context = this;
        tvDefectLocationName = findViewById(R.id.tv_defect_loc_name);
        tvPrevDefectCount = findViewById(R.id.tv_issue_count);
        initializeMap();
        tvDefectLocationName.setText(selectedUnit.getDescription());
        prevDefectsList = selectedJPlan.getTaskList().get(0).getUnitDefectsListByID(selectedUnitID);
        tvPrevDefectCount.setText(String.valueOf(prevDefectsList.size()));
    }

    private void initializeMap() {
        SupportMapFragment supportMapFragment = (SupportMapFragment) getSupportFragmentManager().findFragmentById(R.id.map_previous_defects);
        supportMapFragment.getMapAsync(this);
    }


    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
        if (ActivityCompat.checkSelfPermission(_context, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
                ActivityCompat.checkSelfPermission(_context, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
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

        Units selectedUnit = selectedJPlan.getTaskList().get(0).getUnitByID(selectedUnitID);
        setUpClusterer();
        ArrayList<Units> unitList = selectedJPlan.getTaskList().get(0).getWholeUnitList();
        LocItem defaultLoc = null;
        if(prevDefectsList.size() > 0){
            for( UnitsDefectsOpt defect : prevDefectsList ){
                Location defectLocation = defect.getLocation();

                String formattedDate = defect.getTimeStamp();
                String strDate = "--:--";
                DateFormat df = new SimpleDateFormat(Globals.defaultDateFormat, Locale.getDefault());
                try {
                    Date dtt = df.parse(formattedDate);
                    SimpleDateFormat sm = new SimpleDateFormat("MMM-dd-yyyy  HH:mm:ss.SSS", Locale.getDefault());
                    strDate = sm.format(dtt);
                } catch (ParseException e) {
                    e.printStackTrace();
                }

                LocItem offsetItem = new LocItem(
                        defectLocation.getLatitude(),
                        defectLocation.getLongitude(),
                        defect.getTitle(),
                        getString(R.string.string_type) + " " + selectedUnit.getAssetTypeDisplayName() +"," +
                                "\n" + defect.getDescription() +
                                "\n" + getString(R.string.created_at) + strDate,
                        defect.getIssueId());
                if(defaultLoc == null){
                    defaultLoc = offsetItem;
                }
                mClusterManager.addItem(offsetItem);
            }
        }

        LocItem finalDefaultLoc = defaultLoc;
        mMap.setOnMapLoadedCallback(new GoogleMap.OnMapLoadedCallback() {
            @Override
            public void onMapLoaded() {
                try {
                    mMap.animateCamera(CameraUpdateFactory.newLatLng(finalDefaultLoc.getPosition()), new GoogleMap.CancelableCallback() {
                        @Override
                        public void onFinish() {
                        }
                        @Override
                        public void onCancel() { }
                    });
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }


/*
    @Override
    public boolean onMarkerClick(Marker marker) {
        return false;
    }
*/

    private void setUpClusterer() {
        // Initialize the manager with the context and the map.
        // (Activity extends context, so we can pass 'this' in the constructor.)
        mClusterManager = new ClusterManager<LocItem>(_context, mMap);
        AssetMarkerRender renderer = new AssetMarkerRender(_context, mMap, mClusterManager);
        mClusterManager.setRenderer(renderer);

        // Point the map's listeners at the listeners implemented by the cluster
        // manager.
        mMap.setOnCameraIdleListener(mClusterManager);
        mMap.setOnMarkerClickListener(mClusterManager);
        mClusterManager.setOnClusterClickListener(this);
        mClusterManager.setOnClusterItemClickListener(this);
        mClusterManager.setOnClusterItemInfoWindowClickListener(this);
        mClusterManager.setOnClusterInfoWindowClickListener(this);
    }

    @Override
    public boolean onClusterClick(Cluster<LocItem> cluster) {
        if(mMap.getCameraPosition().zoom == mMap.getMaxZoomLevel()){
            final ArrayList<LocItem> listItems = (ArrayList<LocItem>) cluster.getItems();
            final List<String> listNames = new ArrayList<>();
            final ListViewDialog listViewDialog = new ListViewDialog(_context, listItems, false);
            for (LocItem item : listItems){
                listNames.add(item.getSnippet());
            }
            mMap.animateCamera(CameraUpdateFactory.newLatLng(cluster.getPosition()), new GoogleMap.CancelableCallback() {
                @Override
                public void onFinish() {
                    //TODO: Activity has leaked window exception on showDialog()
                    listViewDialog.showDialog();
                }
                @Override
                public void onCancel() { }
            });
        } else {
            LatLngBounds.Builder builder = LatLngBounds.builder();
            LatLng venuePosition = cluster.getPosition();
            builder.include(venuePosition);
            final LatLngBounds bounds = builder.build();
            mMap.animateCamera(CameraUpdateFactory.newLatLngBounds(bounds, 100));
        }
        return true;
    }

    @Override
    public void onClusterInfoWindowClick(Cluster<LocItem> cluster) {
        cluster.getItems();
    }

    @Override
    public boolean onClusterItemClick(LocItem locItem) {
        return false;
    }

    @Override
    public void onClusterItemInfoWindowClick(LocItem locItem) {
    }
}
