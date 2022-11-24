package com.app.ps19.hosapp;

import android.Manifest;
import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.graphics.Typeface;
import android.graphics.drawable.Drawable;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationManager;
import android.os.IBinder;
import android.preference.PreferenceManager;
import androidx.annotation.DrawableRes;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.fragment.app.FragmentActivity;
import android.os.Bundle;
import androidx.core.content.ContextCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;
import android.util.Log;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.app.ps19.hosapp.Shared.GPSTrackerEx;
import com.app.ps19.hosapp.Shared.Globals;
import com.app.ps19.hosapp.Shared.LocationChangedInterface;
import com.app.ps19.hosapp.Shared.LocationUpdatesService;
import com.app.ps19.hosapp.Shared.Utilities;
import com.app.ps19.hosapp.Shared.Utils;
import com.app.ps19.hosapp.classes.DUnit;
import com.app.ps19.hosapp.classes.LocItem;
import com.app.ps19.hosapp.classes.MD5Util;
import com.app.ps19.hosapp.classes.Task;
import com.app.ps19.hosapp.classes.Units;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.Polyline;
import com.google.android.gms.maps.model.PolylineOptions;
import com.google.maps.android.clustering.ClusterManager;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class AssetMapsActivity extends FragmentActivity implements OnMapReadyCallback
        , LocationChangedInterface
        , GoogleMap.OnMarkerClickListener, SharedPreferences.OnSharedPreferenceChangeListener {
        // Declare a variable for the cluster manager.
        private ClusterManager<LocItem> mClusterManager;

        private static final String TAG = "AssetMapsActivity";
        private GPSTrackerEx gpsTracker;
        private GoogleMap mMap;
        private Boolean mblnFollowCamera=false;
        private Context mContext;
    LocationRequest mLocationRequest;
    GoogleApiClient mGoogleApiClient;
    Location mLastLocation;
    Marker mCurrLocationMarker;
    private Button infoButton;
    private Polyline selectedPolyLine=null;
        public static final String ASSET_TYPE_LINEAR = "linear";
        public static final String ASSET_TYPE_FIXED = "point";
    //private OnInfoWindowElemTouchListener infoButtonListener;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_asset_maps);
        mContext=this;
        //-------------------GPS Code--------------
        myReceiver = new MyReceiver();
        // Check that the user hasn't revoked permissions by going to Settings.
        if (Utils.requestingLocationUpdates(this)) {
            /*if (!checkPermissions()) {
                requestPermissions();
            }*/
        }
        //--------------------END-------------------
        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);
        //mLastLocation=gpsTracker.getLocation();
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        if(gpsTracker == null){
            gpsTracker=new GPSTrackerEx(this);
        }
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
        if(gpsTracker.getLastKnownLocation()!= null){
            mLastLocation = gpsTracker.getLastKnownLocation();
        } else {
            mLastLocation = Globals.lastKnownLocation;
        }
        //mLastLocation=gpsTracker.getLocation();
        mMap.setOnMarkerClickListener(this);
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
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
        Task task = Globals.selectedTask;
        LatLngBounds.Builder builder = new LatLngBounds.Builder();
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
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
                DUnit unit=(DUnit) marker.getTag();
                if(unit !=null) {
                    selectUnitAndExit(unit);
                    //Toast.makeText(mContext, "Info Window Clicked "+ unit1.getDescription(), Toast.LENGTH_SHORT).show();
                }
            }
        });
        mMap.setInfoWindowAdapter(new GoogleMap.InfoWindowAdapter() {

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
                title.setText(marker.getTitle());

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
                //info.addView(clickMsg);

                return info;
            }
        });

        mMap.setOnPolylineClickListener(new GoogleMap.OnPolylineClickListener() {
            @Override
            public void onPolylineClick(Polyline polyline) {
                DUnit unit =(DUnit) polyline.getTag();
                if(unit !=null){
                    if(selectedPolyLine==null) {
                        selectPolyline(polyline,true);
                    }else{
                        if(polyline.equals(selectedPolyLine)) {
                            //Toast.makeText(mContext, "Info Window Clicked " + unit.getUnit().getDescription(), Toast.LENGTH_SHORT).show();
                            selectUnitAndExit(unit);
                        }else{
                            selectPolyline(polyline,true);
                        }
                    }

                }
            }
        });

        // Add a marker in Sydney and move the camera
        //LatLng sydney = new LatLng(-34, 151);
        LatLng currLatLng =new LatLng(mLastLocation.getLatitude(),mLastLocation.getLongitude());//getCurrentLocation();
        double lat = 31.519477;
        double lng = 74.376377;

        if (currLatLng == null) {
            currLatLng= new LatLng(lat, lng);
        }


        if (task != null) {
            ArrayList<DUnit> units = task.getUnitList(currLatLng);
            PolylineOptions options = new PolylineOptions().width(5).color(Color.BLUE).geodesic(true);
            options.addAll(Globals.selectedTask.getLineCords().getGeometry().getCoordinates());
            Polyline line = mMap.addPolyline(options);
            if(Globals.selectedTask.getLocationSpecial() != null){
                PolylineOptions sUnitOptions = new PolylineOptions().width(5).color(Color.RED).geodesic(true);
                sUnitOptions.addAll(Globals.selectedTask.getLocationSpecial().getLineCords().getGeometry().getCoordinates());
                Polyline line1 = mMap.addPolyline(sUnitOptions);
            }
            //line.setTag(unit);
            HashMap<String , List<Units>> clusterHash=new HashMap<>();
            for(DUnit unit :units){
                Units unit1 = unit.getUnit();
                if (unit.getDistance() == -1) {
                    if (unit.getUnit().getAssetTypeClassify().equals(ASSET_TYPE_LINEAR)) {
                        if(unit.getUnit().getCoordinates().size()>0){
                            String key = unit.getUnit().getCoordinates().get(0).getLat() + "-"+
                                    unit.getUnit().getCoordinates().get(0).getLon();
                            if(clusterHash.get(key)==null){
                                ArrayList<Units> unitList=new ArrayList<>();
                                unitList.add(unit1);
                                clusterHash.put(key,unitList);
                            }else{
                                List<Units> unitList=clusterHash.get(key);
                                if (unitList != null) {
                                    unitList.add(unit1);
                                }
                            }
                        }

                    }
                }
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
                            "\nDescription : " + unitList.get(i).getDescription()
                            + "\n\nPlease long press to select asset";
                    LocItem offsetItem = new LocItem(lat,lng, unitList.get(i).getUnitId(), snippet1);
                    mClusterManager.addItem(offsetItem);
                }
            }*/
            for (DUnit unit : units) {
                Units unit1 = unit.getUnit();
                if (unit.getDistance() == -1) {
                    //May be Polyline
                    if (unit.getUnit().getAssetTypeClassify().equals(ASSET_TYPE_LINEAR)) {
                        if (unit1.getCoordinates().size() > 0) {
                            LatLng curPos = unit1.getCoordinates().get(0).getLatLng();
                            String snippet1="Type : " + unit1.getAssetType() +
                                    "\nDescription : " + unit1.getDescription()
                                    + "\n\nPlease long press to select asset";

                            mMap.addMarker(new MarkerOptions().position(curPos).title(unit1.getDescription())
                                    .snippet(snippet1)
                                    .icon(BitmapDescriptorFactory.defaultMarker()))
                                    .setTag(unit);
                            builder.include(curPos);
                            /*PolylineOptions options = new PolylineOptions().width(5).color(Color.BLUE).geodesic(true);
                            options.addAll(unit1.getCoordinatesConvert());
                            Polyline line = mMap.addPolyline(options);
                            line.setClickable(true);
                            line.setTag(unit);*/
                        }
                    }
                } else {
                    LatLng curPos = unit1.getCoordinates().get(0).getLatLng();
                    String snippet1="Type : " + unit1.getAssetType() +
                            "\nDescription : " + unit1.getDescription()
                            + "\n\nPlease long press to select asset";

                    mMap.addMarker(new MarkerOptions().position(curPos).title(unit1.getDescription())
                            .snippet(snippet1)
                            .icon(BitmapDescriptorFactory.defaultMarker()))
                            .setTag(unit);
                    builder.include(curPos);
                }
            }
        }

        mCurrLocationMarker=mMap.addMarker(new MarkerOptions().position(currLatLng).title(getUserName())
                .icon(BitmapDescriptorFactory.fromBitmap(getMarkerBitmapFromView(R.drawable.ic_person_white_24dp))));

        builder.include(currLatLng);
        LatLngBounds bounds = builder.build();
        int padding = 50; // offset from edges of the map in pixels
        CameraUpdate cu = CameraUpdateFactory.newLatLngBounds(bounds, padding);


        try {
            mMap.moveCamera(cu);
        } catch (Exception e) {
            CameraUpdate cameraUpdate = CameraUpdateFactory.newLatLngZoom(currLatLng, 16);
            mMap.animateCamera(cameraUpdate);
            e.printStackTrace();
        }
    }
    private void selectPolyline(Polyline line, boolean selected){
        if(selected){
            if(selectedPolyLine !=null){
                selectedPolyLine.setWidth(5);
            }
            selectedPolyLine=line;
            selectedPolyLine.setWidth(9);
        }else
        {
            if(selectedPolyLine !=null){
                selectedPolyLine.setWidth(5);
                selectedPolyLine=null;
            }
        }
    }
    private String getUserName(){
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

    private LatLng getCurrentLocation() {
        LocationManager service = (LocationManager) getSystemService(LOCATION_SERVICE);
        Criteria criteria = new Criteria();
        String provider = service.getBestProvider(criteria, false);
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return null;
            }
            Location location = service.getLastKnownLocation(provider);
            LatLng userLocation = new LatLng(location.getLatitude(),location.getLongitude());
            return userLocation;
        }

        @Override
        public void locationChanged(Location mLocation) {
            if(mMap !=null){
                if(mCurrLocationMarker!=null){
                    LatLng curLatLng=new LatLng(mLocation.getLatitude(),mLocation.getLongitude());
                    mCurrLocationMarker.setPosition(curLatLng);
                    if(mblnFollowCamera){
                        float zoom=mMap.getCameraPosition().zoom;

                        CameraUpdate cameraUpdate = CameraUpdateFactory.newLatLngZoom(curLatLng, zoom);
                        mMap.animateCamera(cameraUpdate);

                    }
                    Log.i(TAG,"Location Updated");
                }
            }
        }

        @Override
        public boolean onMarkerClick(Marker marker) {
            if(marker.equals(mCurrLocationMarker)){
                mblnFollowCamera= ! mblnFollowCamera;
                if(mblnFollowCamera){
                    mCurrLocationMarker.setTitle(getUserName()+ " (Auto)");
                }else{
                    mCurrLocationMarker.setTitle(getUserName());
                }
            }
            selectPolyline(null,false);
            return false;
        }
        private void selectUnitAndExit(DUnit unit){
            Globals.selectedReportType = unit.getUnit().getAssetType();
            Globals.selectedUnit = unit.getUnit();
            Globals.selectedDUnit = unit;
            Intent returnIntent = new Intent();
            returnIntent.putExtra("result","selected");
            ((Activity)mContext).setResult(Activity.RESULT_OK,returnIntent);
            ((Activity)mContext).finish();

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

            // Point the map's listeners at the listeners implemented by the cluster
            // manager.
            mMap.setOnCameraIdleListener(mClusterManager);
            mMap.setOnMarkerClickListener(mClusterManager);

            // Add cluster items (markers) to the cluster manager.
            //addItems();
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
        public void onDestroy() {
            super.onDestroy();
           /* if(gpsTracker!=null){
                gpsTracker.unbindService();
            }*/
            if (mBound) {
                // Unbind from the service. This signals to the service that this activity is no longer
                // in the foreground, and the service can respond by promoting itself to a foreground
                // service.
                unbindService(mServiceConnection);
                mBound = false;
            }
            //gps.stopUsingGPS();

            //Intent myService = new Intent(MainActivity.this, GPSService.class);
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
                super.onPause();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        @Override
        public void onStart() {
            super.onStart();

            bindService(new Intent(AssetMapsActivity.this, LocationUpdatesService.class), mServiceConnection,
                    Context.BIND_AUTO_CREATE);
            PreferenceManager.getDefaultSharedPreferences(this)
                    .registerOnSharedPreferenceChangeListener(this);
            // Restore the state of the buttons when the activity (re)launches.
            //setButtonsState(Utils.requestingLocationUpdates(this));
            /*if (!checkPermissions()) {
                requestPermissions();
            } else {
                if(mService!=null){
                    mService.requestLocationUpdates();
                }
            }*/
            // Bind to the service. If the service is in foreground mode, this signals to the service
            // that since this activity is in the foreground, the service can exit foreground mode.

        }
        @Override
        public void onResume(){
            super.onResume();
            try {

                LocalBroadcastManager.getInstance(this).registerReceiver(myReceiver,
                        new IntentFilter(LocationUpdatesService.ACTION_BROADCAST));
            }catch (Exception e){
                e.printStackTrace();
            }
        }

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
                    if(mMap !=null){
                        if(mCurrLocationMarker!=null){
                            LatLng curLatLng=new LatLng(mLocation.getLatitude(),mLocation.getLongitude());
                            mCurrLocationMarker.setPosition(curLatLng);
                            if(mblnFollowCamera){
                                float zoom=mMap.getCameraPosition().zoom;

                                CameraUpdate cameraUpdate = CameraUpdateFactory.newLatLngZoom(curLatLng, zoom);
                                mMap.animateCamera(cameraUpdate);

                            }
                            Log.i(TAG,"Location Updated");
                        }
                    }
                   /* cLocation = mLocation;
                    latitude = String.valueOf(mLocation.getLatitude());
                    longitude = String.valueOf(mLocation.getLongitude());
                    refreshLocation();
                    Toast.makeText(MainActivity.this, Utils.getLocationText(mLocation),
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
        private static final String TAGa = "resPMain";

        // Used in checking for runtime permissions.
        private static final int REQUEST_PERMISSIONS_REQUEST_CODE = 34;

        // The BroadcastReceiver used to listen from broadcasts from the service.
        private MyReceiver myReceiver;

        // A reference to the service used to get location updates.
        private LocationUpdatesService mService = null;

        // Tracks the bound state of the service.
        private boolean mBound = false;
    }
