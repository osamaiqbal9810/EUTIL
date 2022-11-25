package com.app.ps19.tipsapp.map;

import static com.app.ps19.tipsapp.Shared.Globals.getSelectedTask;
import static com.app.ps19.tipsapp.Shared.Globals.markerItemsMap;
import static com.app.ps19.tipsapp.Shared.Globals.selectedDUnit;
import static com.app.ps19.tipsapp.Shared.Globals.selectedForm;
import static com.app.ps19.tipsapp.Shared.Globals.selectedUnit;
import static com.app.ps19.tipsapp.Shared.Globals.setLocale;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.location.Location;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.Spinner;

import androidx.annotation.DrawableRes;
import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.fragment.app.FragmentActivity;

import com.app.ps19.tipsapp.AppFormActivity;
import com.app.ps19.tipsapp.AssetMarkerRender;
import com.app.ps19.tipsapp.R;
import com.app.ps19.tipsapp.ReportAddActivity;
import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.Shared.Utilities;
import com.app.ps19.tipsapp.classes.DUnit;
import com.app.ps19.tipsapp.classes.ListViewDialog;
import com.app.ps19.tipsapp.classes.LocItem;
import com.app.ps19.tipsapp.classes.MD5Util;
import com.app.ps19.tipsapp.classes.Report;
import com.app.ps19.tipsapp.classes.Task;
import com.app.ps19.tipsapp.classes.Units;
import com.app.ps19.tipsapp.classes.UnitsTestOpt;
import com.app.ps19.tipsapp.location.Interface.OnLocationUpdatedListener;
import com.app.ps19.tipsapp.location.LocationUpdatesService;
import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.LocationSource;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.Polyline;
import com.google.android.gms.maps.model.PolylineOptions;
import com.google.maps.android.clustering.Cluster;
import com.google.maps.android.clustering.ClusterManager;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

//import com.app.ps19.tipsapp.Shared.GPSTrackerEx;

public class InspectionMapActivity extends FragmentActivity implements OnMapReadyCallback
        , GoogleMap.OnMarkerClickListener
        , SharedPreferences.OnSharedPreferenceChangeListener
        , ClusterManager.OnClusterClickListener<LocItem>
        , ClusterManager.OnClusterItemClickListener<LocItem>
        , ClusterManager.OnClusterItemInfoWindowClickListener<LocItem>
        , ClusterManager.OnClusterInfoWindowClickListener<LocItem>
        , OnLocationUpdatedListener
, LocationSource{
    // Declare a variable for the cluster manager.
    private ClusterManager<LocItem> mClusterManager;
    private OnLocationChangedListener mMapLocationListener = null;
    public static final int ADD_DEFECT_ACTIVITY_REQUEST_CODE = 100;
    private final int LAUNCH_APPFORM_ACTIVITY=1;

    private static final String TAG = "AssetMapsActivity";
    //  private GPSTrackerEx gpsTracker;
    private GoogleMap mMap;
    private Boolean mblnFollowCamera = true;
    private Context mContext;
    private OnLocationChangedListener onLocationChangedListener;
    // LocationRequest mLocationRequest;
    // GoogleApiClient mGoogleApiClient;
    volatile Location mLastLocation;
    Marker mCurrLocationMarker;
    private Button infoButton;
    private Polyline selectedPolyLine = null;
    public static final String ASSET_TYPE_LINEAR = "linear";
    public static final String ASSET_TYPE_FIXED = "point";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //Listen to location Updates

        setLocale(this);
        setContentView(R.layout.activity_asset_maps);
        mContext = this;

        //--------------------END-------------------
        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);
        //mLastLocation=gpsTracker.getLocation();
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
/*        if (gpsTracker == null) {
            gpsTracker = new GPSTrackerEx(this);
        }*/
    }


    /**
     * Manipulates the map once available.
     * This callback is triggered when the map is ready to be used.
     * This is where we can add markers or lines, add listeners or move the camera. In this case,
     * we just add a marker near Sydney, Australia.
     * If Google Play services is not installed on the device, the user will be prompted to install
     * it inside the SupportMapFragment. This method will only be triggered once the user has
     * installed Google Play services and returned to the app.
     */

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
        //TODO: add new location service here
        mLastLocation = LocationUpdatesService.getLocation();
        //mLastLocation=gpsTracker.getLocation();
        mMap.setOnMarkerClickListener(this);
        if (ActivityCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
                ActivityCompat.checkSelfPermission(this,
                        Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }

        //mMap.setMyLocationEnabled(false);

        Task task = getSelectedTask();
        LatLngBounds.Builder builder = new LatLngBounds.Builder();

        //LatLng sydney = new LatLng(-34, 151);
        LatLng currLatLng = null;//getCurrentLocation();
        double lat = 0;
        double lng = 0;
        try {
            currLatLng = new LatLng(mLastLocation.getLatitude(), mLastLocation.getLongitude());
            lat = 31.519477;
            lng = 74.376377;
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (currLatLng == null) {
            currLatLng = new LatLng(lat, lng);
        }

        builder.include(currLatLng);
        LatLngBounds bounds = builder.build();
        int padding = 16; // offset from edges of the map in pixels
        CameraUpdate cu = CameraUpdateFactory.newLatLngBounds(bounds, padding);

        if (ActivityCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
                ActivityCompat.checkSelfPermission(this,
                        Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        mMap.setOnInfoWindowLongClickListener(new GoogleMap.OnInfoWindowLongClickListener() {
            @Override
            public void onInfoWindowLongClick(Marker marker) {
                for(DUnit unit: getSelectedTask().getUnitList(new LatLng(Globals.lastKnownLocation.getLatitude(), Globals.lastKnownLocation.getLongitude()))){
                    if(unit.getUnit().getUnitId().equals(marker.getTitle())){
                        showSelectionDialog(marker);
                        //selectUnitAndExit(unit);
                    }
                }
                /*DUnit unit=(DUnit) marker.getTag();
                if(unit !=null) {
                    selectUnitAndExit(unit);
                    //Toast.makeText(mContext, "Info Window Clicked "+ unit1.getDescription(), Toast.LENGTH_SHORT).show();
                }*/
            }
        });
        //mMap.setInfoWindowAdapter(new MyInfoWindowAdapter());

        /*mMap.setInfoWindowAdapter(new GoogleMap.InfoWindowAdapter() {

            @Override
            public View getInfoWindow(Marker arg0) {
                return null;
            }

            @Override
            public View getInfoContents(Marker marker) {

                LinearLayout info = new LinearLayout(mContext);
                info.setOrientation(LinearLayout.VERTICAL);

                TextView title = new TextView(mContext);
                title.setTextColor(Color.BLACK);
                title.setGravity(Gravity.CENTER);
                title.setTypeface(null, Typeface.BOLD);
                try {
                    if(marker.getSnippet()!= null){
                        String[] details = marker.getSnippet().split(",");
                        String _name = details[1].replace(getString(R.string.description_title), "");
                        title.setText(_name);

                        TextView snippet = new TextView(mContext);
                        snippet.setTextColor(Color.GRAY);
                        snippet.setText(marker.getSnippet());

                        TextView clickMsg = new TextView(mContext);
                        clickMsg.setTextColor(Color.BLACK);
                        clickMsg.setTextSize(12.0f);
                        //clickMsg.setText("Please Long press to select asset");
                        clickMsg.setText("");

                        info.addView(title);
                        info.addView(snippet);
                    } else {
                        title.setText(marker.getTitle());
                        TextView clickMsg = new TextView(mContext);
                        clickMsg.setTextColor(Color.BLACK);
                        clickMsg.setTextSize(12.0f);
                        //clickMsg.setText("Please Long press to select asset");
                        clickMsg.setText("");

                        info.addView(title);

                    }

                } catch (Exception e) {
                    e.printStackTrace();
                }
                //info.addView(clickMsg);

                return info;
            }
        });*/

        mMap.setOnPolylineClickListener(new GoogleMap.OnPolylineClickListener() {
            @Override
            public void onPolylineClick(Polyline polyline) {
                DUnit unit = (DUnit) polyline.getTag();
                if (unit != null) {
                    if (selectedPolyLine == null) {
                        selectPolyline(polyline, true);
                    } else {
                        if (polyline.equals(selectedPolyLine)) {
                            //Toast.makeText(mContext, "Info Window Clicked " + unit.getUnit().getDescription(), Toast.LENGTH_SHORT).show();
                            selectUnitAndExit(unit);
                        } else {
                            selectPolyline(polyline, true);
                        }
                    }

                }
            }
        });

        LatLng finalCurrLatLng = currLatLng;
        mMap.setOnMapLoadedCallback(new GoogleMap.OnMapLoadedCallback() {
            @Override
            public void onMapLoaded() {
                try {
                    mMap.animateCamera(cu);
                } catch (Exception e) {
                    CameraUpdate cameraUpdate = CameraUpdateFactory.newLatLngZoom(finalCurrLatLng, padding);
                    mMap.animateCamera(cameraUpdate);
                    e.printStackTrace();
                }
            }
        });

        if (task != null) {
            ArrayList<DUnit> units = task.getUnitList(currLatLng);
            PolylineOptions options = new PolylineOptions().width(5).color(Color.BLUE).geodesic(true);
            options.addAll(getSelectedTask().getLineCords().getGeometry().getCoordinates());
            Polyline line = mMap.addPolyline(options);
            //line.setClickable(true);
            if (getSelectedTask().getLocationSpecial() != null) {
                PolylineOptions sUnitOptions = new PolylineOptions().width(5).color(Color.RED).geodesic(true);
                sUnitOptions.addAll(getSelectedTask().getLocationSpecial().getLineCords().getGeometry().getCoordinates());
                Polyline line1 = mMap.addPolyline(sUnitOptions);
            }
            //line.setTag(unit);
            HashMap<String, List<Units>> clusterHash = new HashMap<>();
            for (DUnit unit : units) {
                Units unit1 = unit.getUnit();
                // if (unit.getDistance() == -1) {
                if (unit.getUnit().getAssetTypeClassify().equals(ASSET_TYPE_LINEAR)) {
                    if (unit.getUnit().getCoordinates().size() > 0) {
                        String key = unit.getUnit().getCoordinates().get(0).getLat() + "-" +
                                unit.getUnit().getCoordinates().get(0).getLon();
                        if (clusterHash.get(key) == null) {
                            ArrayList<Units> unitList = new ArrayList<>();
                            unitList.add(unit1);
                            clusterHash.put(key, unitList);
                        } else {
                            List<Units> unitList = clusterHash.get(key);
                            if (unitList != null) {
                                unitList.add(unit1);
                            }
                        }
                    }

                }
                // }
            }
            setUpClusterer();
            for (DUnit unit : units) {
                Units unit1 = unit.getUnit();
                if (unit.getDistance() == -1) {
                    //May be Polyline
                    if (unit.getUnit().getAssetTypeClassify().equals(ASSET_TYPE_LINEAR)) {
                        if (unit1.getCoordinates().size() > 0) {
                            LatLng curPos = unit1.getCoordinates().get(0).getLatLng();
                            String snippet1 = getString(R.string.string_type) + "-1 " + unit1.getAssetTypeDisplayName() +"," +
                                    "\n" + getString(R.string.description_title) + " " + unit1.getDescription() + "," + "\n\n"
                                    + getString(R.string.asset_selection_msg);
                            double lat1 = 0.0;
                            double lng1 = 0.0;
                            if(unit1.getCoordinatesAdj()!=null){
                                lat1 = unit1.getCoordinatesAdj().getCoordinates().get(0).latitude;
                                lng1 = unit1.getCoordinatesAdj().getCoordinates().get(0).longitude;
                            } else {
                                lat1 = unit1.getCoordinates().get(0).getLatLng().latitude;
                                lng1 = unit1.getCoordinates().get(0).getLatLng().longitude;
                            }
                            LocItem offsetItem = new LocItem(lat1, lng1, unit1.getUnitId(), snippet1, unit, unit1.getDescription());
                            mClusterManager.addItem(offsetItem);
                            builder.include(unit1.getCoordinates().get(0).getLatLng());
                            /*mMap.addMarker(new MarkerOptions().position(curPos).title(unit1.getDescription())
                                    .snippet(snippet1)
                                    .icon(BitmapDescriptorFactory.defaultMarker()))
                                    .setTag(unit);*/
                            //builder.include(curPos);
                            /*PolylineOptions options = new PolylineOptions().width(5).color(Color.BLUE).geodesic(true);
                            options.addAll(unit1.getCoordinatesConvert());
                            Polyline line = mMap.addPolyline(options);
                            line.setClickable(true);
                            line.setTag(unit);*/
                        }
                    }
                } else {
                    LatLng curPos = unit1.getCoordinates().get(0).getLatLng();
                    String snippet1 = getString(R.string.string_type) + " else" + unit1.getAssetTypeDisplayName() +"," +
                            "\n" + getString(R.string.description_title) + " " + unit1.getDescription() +"," +"\n\n"
                            + getString(R.string.asset_selection_msg);
                   /* String snippet1="Type : " + unit1.getAssetType() +
                            "\nDescription : " + unit1.getDescription()
                            + "\n\nPlease long press to select asset";*/
                    double lat1 = 0.0;
                    double lng1 = 0.0;
                    if(unit1.getCoordinatesAdj()!=null && unit1.getCoordinatesAdj().getCoordinates().get(0).latitude!=0.0){
                        lat1 = unit1.getCoordinatesAdj().getCoordinates().get(0).latitude;
                        lng1 = unit1.getCoordinatesAdj().getCoordinates().get(0).longitude;
                    } else {
                        lat1 = unit1.getCoordinates().get(0).getLatLng().latitude;
                        lng1 = unit1.getCoordinates().get(0).getLatLng().longitude;
                    }

                    LocItem offsetItem = new LocItem(lat1, lng1, unit1.getUnitId(), snippet1, unit, unit1.getDescription());
                    mClusterManager.addItem(offsetItem);
                    builder.include(unit1.getCoordinates().get(0).getLatLng());
                   /* mMap.addMarker(new MarkerOptions().position(curPos).title(unit1.getDescription())
                            .snippet(snippet1)
                            .icon(BitmapDescriptorFactory.defaultMarker()))
                            .setTag(unit);*/
                    //builder.include(curPos);
                }
                /*setUpClusterer();
                for(String key : clusterHash.keySet()){
                    //TODO Process All Clusters Here.
                    List<Units> unitList=clusterHash.get(key);
                    double lat1 = unitList.get(0).getCoordinates().get(0).getLatLng().latitude;
                    double lng1 = unitList.get(0).getCoordinates().get(0).getLatLng().longitude;
                    for (int i = 0; i<unitList.size(); i++){
                        double offset = i / 60d;
                        lat1 = lat1 + offset;
                        lng1 = lng1 + offset;
                        String snippet1="Type : " + unitList.get(i).getAssetType() +
                                "\nDescription (From Cluster) : " + unitList.get(i).getDescription()
                                + "\n\nPlease long press to select asset";
                        LocItem offsetItem = new LocItem(lat1,lng1, unitList.get(i).getUnitId(), snippet1);
                        mClusterManager.addItem(offsetItem);
                    }
                }*/
            }
        }
/*
        mCurrLocationMarker = mMap.addMarker(new MarkerOptions().position(currLatLng).title(getUserName())
                .icon(BitmapDescriptorFactory.fromBitmap(getMarkerBitmapFromView(R.drawable.ic_baseline_circle_24))));*/
        mMap.getUiSettings().setZoomControlsEnabled(true);
        mMap.getUiSettings().setCompassEnabled(true);
        mMap.getUiSettings().setMapToolbarEnabled(true);
        mMap.getUiSettings().setMyLocationButtonEnabled(true);
        mMap.setMyLocationEnabled(true);
        mMap.setInfoWindowAdapter(mClusterManager.getMarkerManager());
        mClusterManager.getMarkerCollection().setOnInfoWindowAdapter(new MyInfoWindowAdapter(this));
       /* mClusterManager.getMarkerCollection().setOnInfoWindowAdapter(new GoogleMap.InfoWindowAdapter() {

            @Override
            public View getInfoWindow(Marker marker) {
                final LocItem thePersonOnThisMarker = markerItemsMap.get(marker.getId());
                LinearLayout info = new LinearLayout(mContext);
                info.setOrientation(LinearLayout.VERTICAL);

                TextView title = new TextView(mContext);
                title.setTextColor(Color.BLACK);
                title.setGravity(Gravity.CENTER);
                title.setTypeface(null, Typeface.BOLD);
                try {
                    if(marker.getSnippet()!= null){
                        String[] details = marker.getSnippet().split(",");
                        String _name = details[1].replace(getString(R.string.description_title), "");
                        title.setText(_name);

                        TextView snippet = new TextView(mContext);
                        snippet.setTextColor(Color.GRAY);
                        snippet.setText(marker.getSnippet());

                        TextView clickMsg = new TextView(mContext);
                        clickMsg.setTextColor(Color.BLACK);
                        clickMsg.setTextSize(12.0f);
                        //clickMsg.setText("Please Long press to select asset");
                        clickMsg.setText("");

                        info.addView(title);
                        info.addView(snippet);
                    } else {
                        title.setText(marker.getTitle());
                        TextView clickMsg = new TextView(mContext);
                        clickMsg.setTextColor(Color.BLACK);
                        clickMsg.setTextSize(12.0f);
                        //clickMsg.setText("Please Long press to select asset");
                        clickMsg.setText("");

                        info.addView(title);

                    }

                } catch (Exception e) {
                    e.printStackTrace();
                }
                //info.addView(clickMsg);

                return info;
            }

            @Override
            public View getInfoContents(Marker marker) {

                return null;
            }
        });*/

    }

    private void selectPolyline(Polyline line, boolean selected) {
        if (selected) {
            if (selectedPolyLine != null) {
                selectedPolyLine.setWidth(5);
            }
            selectedPolyLine = line;
            selectedPolyLine.setWidth(9);
        } else {
            if (selectedPolyLine != null) {
                selectedPolyLine.setWidth(5);
                selectedPolyLine = null;
            }
        }
    }

    private String getUserName() {
        return Globals.userName;
    }

    private Bitmap getUserImage() {
        String hash = MD5Util.md5Hex(Globals.userEmail);
        return Utilities.getFromInternalStorage(Globals.mainActivity, hash);
    }

    private Bitmap getMarkerBitmapFromView(@DrawableRes int resId) {

        View customMarkerView = ((LayoutInflater) getSystemService(Context.LAYOUT_INFLATER_SERVICE)).inflate(R.layout.view_custom_marker, null);
        ImageView markerImageView = (ImageView) customMarkerView.findViewById(R.id.profile_image);
        Bitmap bitmap = getUserImage();
        if (bitmap != null) {
            markerImageView.setImageBitmap(bitmap);
        } else {
            markerImageView.setImageResource(resId);
        }
        customMarkerView.measure(View.MeasureSpec.UNSPECIFIED, View.MeasureSpec.UNSPECIFIED);
        customMarkerView.layout(0, 0, customMarkerView.getMeasuredWidth(), customMarkerView.getMeasuredHeight());
        customMarkerView.buildDrawingCache();
        Bitmap returnedBitmap = Bitmap.createBitmap(customMarkerView.getMeasuredWidth(), customMarkerView.getMeasuredHeight(),
                Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(returnedBitmap);
        canvas.drawColor(Color.WHITE, PorterDuff.Mode.SRC_IN);
        Drawable drawable = customMarkerView.getBackground();
        if (drawable != null)
            drawable.draw(canvas);
        customMarkerView.draw(canvas);
        return returnedBitmap;
    }


    @Override
    public boolean onMarkerClick(Marker marker) {
        if (marker.equals(mCurrLocationMarker)) {
            mblnFollowCamera = !mblnFollowCamera;
            if (mblnFollowCamera) {
                mCurrLocationMarker.setTitle(getUserName() + " (Auto)");
            } else {
                mCurrLocationMarker.setTitle(getUserName());
            }
        }
        selectPolyline(null, false);
        return false;
    }

    public void selectUnitAndExit(DUnit unit) {
        Globals.selectedReportType = unit.getUnit().getAssetType();
        Globals.selectedUnit = unit.getUnit();
        Globals.selectedDUnit = unit;
        Intent returnIntent = new Intent();
        returnIntent.putExtra("result", "selected");
        setResult(Activity.RESULT_OK, returnIntent);
        finish();

    }

    /* private void addItems(HashMap latLong) {

         // Set some lat/lng coordinates to start with.
         double lat = latLong.latitude;
         double lng = latLong.longitude;

         // Add ten cluster items in close proximity, for purposes of this example.
         for (int i = 0; i < 10; i++) {
             double offset = i / 60d;
             lat = lat + offset;
             lng = lng + offset;
             LocItem offsetItem = new LocItem(lat, lng);
             mClusterManager.addItem(offsetItem);
         }
 }*/
    private void setUpClusterer() {
        // Position the map.
        //mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(new LatLng(51.503186, -0.126446), 10));

        // Initialize the manager with the context and the map.
        // (Activity extends context, so we can pass 'this' in the constructor.)
        mClusterManager = new ClusterManager<LocItem>(this, mMap);
        AssetMarkerRender renderer = new AssetMarkerRender(this, mMap, mClusterManager);
        //mClusterManager.setRenderer(renderer);
        mClusterManager.setRenderer(new CustomClusterRenderer(InspectionMapActivity.this, mMap, mClusterManager));

        // Point the map's listeners at the listeners implemented by the cluster
        // manager.
        mMap.setOnCameraIdleListener(mClusterManager);
        mMap.setOnMarkerClickListener(mClusterManager);
        mClusterManager.setOnClusterClickListener(this);
        mClusterManager.setOnClusterItemClickListener(this);
        mClusterManager.setOnClusterItemInfoWindowClickListener(this);
        mClusterManager.setOnClusterInfoWindowClickListener(this);


        // Add cluster items (markers) to the cluster manager.
        //addItems();
    }


    @Override
    protected void onStop() {
        super.onStop();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        //Remove Location Updates
        LocationUpdatesService.removeLocationUpdateListener(this.getClass().getSimpleName());

    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        switch (keyCode) {
            case KeyEvent.KEYCODE_BACK:
                //Remove Location Updates
                LocationUpdatesService.removeLocationUpdateListener(this.getClass().getSimpleName());
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
            super.onPause();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onStart() {
        super.onStart();

    }

    @Override
    public void onResume() {
        super.onResume();
        LocationUpdatesService.addOnLocationUpdateListener( this.getClass().getSimpleName() , this);
    }

    @Override
    public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, String key) {

    }

    /*@Override
    public boolean onClusterClick(Cluster<LocItem> cluster) {
        LatLngBounds.Builder builder = LatLngBounds.builder();
        Collection<LocItem> venueMarkers = cluster.getItems();

        float value = 0.5f;
        int i = 0;
        for (ClusterItem item : venueMarkers) {
            LatLng venuePosition = item.getPosition();
            builder.include(venuePosition);

            mMap.addMarker(new MarkerOptions().position(venuePosition).title(item.getTitle())
                    .snippet(item.getSnippet())
                    .anchor(value + i, value + i)
                    .icon(BitmapDescriptorFactory.defaultMarker()))
                    .setTag(item.getTitle());
            //builder.include(curPos);
            i++;
        }

        final LatLngBounds bounds = builder.build();

        try {
            mMap.animateCamera(CameraUpdateFactory.newLatLngBounds(bounds, 100));
        } catch (Exception error) {
            error.printStackTrace();
        }

        return true;

    }*/

    @Override
    public boolean onClusterClick(Cluster<LocItem> cluster) {
        if(mMap.getCameraPosition().zoom == mMap.getMaxZoomLevel()){
            final ArrayList<LocItem> listItems = (ArrayList<LocItem>) cluster.getItems();
            final List<String> listNames = new ArrayList<>();
            final ListViewDialog listViewDialog = new ListViewDialog(InspectionMapActivity.this, listItems);
            for (LocItem item : listItems){
                listNames.add(item.getSnippet());
            }
            mMap.animateCamera(CameraUpdateFactory.newLatLng(cluster.getPosition()), 1500, new GoogleMap.CancelableCallback() {
                @Override
                public void onFinish() {
                    //TODO: Activity has leaked window exception on showDialog()
                }
                @Override
                public void onCancel() { }
            });
            //listViewDialog.showDialog();
            showSelectionDialog(listItems);
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
    public boolean onClusterItemClick(LocItem locItem) {

        return false;
    }

    @Override
    public void onClusterItemInfoWindowClick(LocItem locItem) {
        for(DUnit unit:getSelectedTask().getUnitList(new LatLng(Globals.lastKnownLocation.getLatitude(),
                Globals.lastKnownLocation.getLongitude()))){
            if(unit.getUnit().getUnitId().equals(locItem.getTitle())){
                //showSelectionDialog(unit);

                //selectUnitAndExit(unit);
            }
        }
    }

    @Override
    public void onClusterInfoWindowClick(Cluster<LocItem> cluster) {
        cluster.getItems();
    }

    @Override
    public void onLocationUpdated(Location location) {
        //Provider Disabled

        if(!LocationUpdatesService.canGetLocation() || location.getProvider().equals("None")) {
            Utilities.showSettingsAlert(InspectionMapActivity.this);
        }
        else {
            if (mMapLocationListener != null) {
                mMapLocationListener.onLocationChanged(location);
            }
            mLastLocation = location;
            if (mMap != null) {
                //TODO: add location null check here
                //if (mCurrLocationMarker != null) {
                    LatLng curLatLng = new LatLng(location.getLatitude(), location.getLongitude());
                    //mCurrLocationMarker.setPosition(curLatLng);
                    if (mblnFollowCamera) {
                        float zoom = mMap.getCameraPosition().zoom;

                        CameraUpdate cameraUpdate = CameraUpdateFactory.newLatLngZoom(curLatLng, zoom);
                        mMap.animateCamera(cameraUpdate);

                    }
                    Log.i(TAG, "Location Updated");
                }
            //}

        }
    }

    private static final String TAGa = "resPMain";

    @Override
    public void activate(@NonNull OnLocationChangedListener onLocationChangedListener) {
        mMapLocationListener = onLocationChangedListener;
    }

    @Override
    public void deactivate() {
        mMapLocationListener = null;
    }

    private void showSelectionDialog(Marker marker){
        LayoutInflater factory = LayoutInflater.from(InspectionMapActivity.this);
        final View dialogView = factory.inflate(R.layout.dialog_info_window, null);
        final AlertDialog selectionDialog = new AlertDialog.Builder(InspectionMapActivity.this).create();
        Button btnReportDefect = dialogView.findViewById(R.id.btn_report_issue);
        Button btnOpenForm = dialogView.findViewById(R.id.btn_open_form);

        Spinner spForms = dialogView.findViewById(R.id.sp_forms);
        FormsAdapter adapter = new FormsAdapter(InspectionMapActivity.this,
                android.R.layout.simple_spinner_item,
                markerItemsMap.get(marker.getId()).getmTag().getUnit().getTestFormList().toArray(new UnitsTestOpt[0]));
        spForms.setAdapter(adapter); // Set the custom adapter to the spinner
        selectionDialog.setView(dialogView);
        final UnitsTestOpt[] sForm = new UnitsTestOpt[1];
        spForms.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                sForm[0] = markerItemsMap.get(marker.getId()).getmTag().getUnit().getTestFormList().get(position);
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });
        btnReportDefect.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //your business logic
                launchDefectActivity(markerItemsMap.get(marker.getId()).getmTag());
                //selectionDialog.dismiss();
            }
        });
        btnOpenForm.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                launchFormActivity(markerItemsMap.get(marker.getId()).getmTag(), sForm[0]);
                //selectionDialog.dismiss();
            }
        });

        selectionDialog.show();
    }
    private void showSelectionDialog(ArrayList<LocItem> assets){
        LayoutInflater factory = LayoutInflater.from(InspectionMapActivity.this);
        final View dialogView = factory.inflate(R.layout.dialog_info_window, null);
        final AlertDialog selectionDialog = new AlertDialog.Builder(InspectionMapActivity.this).create();
        LinearLayout llAssetSelection = dialogView.findViewById(R.id.ll_asset_selection_container);
        Spinner spAssets = dialogView.findViewById(R.id.sp_assets);
        Button btnReportDefect = dialogView.findViewById(R.id.btn_report_issue);
        Button btnOpenForm = dialogView.findViewById(R.id.btn_open_form);

        AssetsAdapter assetAdapter = new AssetsAdapter(InspectionMapActivity.this, android.R.layout.simple_spinner_item, assets);
        spAssets.setAdapter(assetAdapter);

        llAssetSelection.setVisibility(View.VISIBLE);
        Spinner spForms = dialogView.findViewById(R.id.sp_forms);
        final DUnit[] sAsset = new DUnit[1];
        final UnitsTestOpt[] sForm = new UnitsTestOpt[1];
        final FormsAdapter[] adapter = new FormsAdapter[1];
        sAsset[0] = assets.get(0).getmTag();
            adapter[0] = new FormsAdapter(InspectionMapActivity.this,
                    android.R.layout.simple_spinner_item,
                    sAsset[0].getUnit().getTestFormList().toArray(new UnitsTestOpt[0]));

        spForms.setAdapter(adapter[0]); // Set the custom adapter to the spinner

        selectionDialog.setView(dialogView);
        spForms.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
               sForm[0] = sAsset[0].getUnit().getTestFormList().get(position);
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });
        spAssets.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {

                sAsset[0] = assets.get(position).getmTag();
                adapter[0] = new FormsAdapter(InspectionMapActivity.this,
                        android.R.layout.simple_spinner_item,
                        assets.get(position).getmTag().getUnit().getTestFormList().toArray(new UnitsTestOpt[0]));
                spForms.setAdapter(adapter[0]);
                if(sAsset[0].getUnit().getTestFormList().size() == 0){
                    spForms.setEnabled(false);
                    sForm[0] = null;
                } else {
                    spForms.setEnabled(true);
                    sForm[0] = sAsset[0].getUnit().getTestFormList().get(0);
                }

            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });
        btnReportDefect.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //your business logic
                launchDefectActivity(sAsset[0]);
                //selectionDialog.dismiss();
            }
        });
        btnOpenForm.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(sForm[0]!=null){
                    launchFormActivity(sAsset[0], sForm[0]);
                }
                //selectionDialog.dismiss();
            }
        });

        selectionDialog.show();
    }
    private void launchDefectActivity(DUnit dUnit){
        selectedUnit = dUnit.getUnit();
        selectedDUnit = dUnit;
        Globals.selectedReport = null;
        Globals.newReport = new Report();
        Globals.issueTitle = "";
        Globals.selectedCategory = Globals.selectedReportType;
        Intent intent = new Intent(InspectionMapActivity.this, ReportAddActivity.class);
        try {
            startActivityForResult(intent, ADD_DEFECT_ACTIVITY_REQUEST_CODE);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    private void launchFormActivity(DUnit dUnit, UnitsTestOpt unitTest){

        Globals.selectedUnit=dUnit.getUnit();
        if(!dUnit.getUnit().getUnitId().equals(Globals.selectedUnit)){
            Globals.selectedUnit=dUnit.getUnit();
            Globals.selectedForm=Globals.selectedUnit.getUnitForm(unitTest.getTestCode());
            if(selectedForm==null){
                return;
            }
            selectedForm.resetForm();
            selectedForm.setSelectedUnit(Globals.selectedUnit);
            selectedForm.setUnitsTestOpt(unitTest);
        }
        Intent intent = new Intent(InspectionMapActivity.this, AppFormActivity.class);
        intent.putExtra("assetType","");
        intent.putExtra("getGlobalForm",true);
        intent.putExtra("form",unitTest.getTestCode());

        startActivityForResult(intent, LAUNCH_APPFORM_ACTIVITY);
    }
}
