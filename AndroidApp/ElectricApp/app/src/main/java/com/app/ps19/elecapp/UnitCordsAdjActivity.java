package com.app.ps19.elecapp;

import static com.app.ps19.elecapp.Shared.Globals.lastKnownLocation;
import static com.app.ps19.elecapp.Shared.Globals.setLocale;

import android.Manifest;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.location.Location;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ScrollView;
import android.widget.TextView;

import androidx.annotation.DrawableRes;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.app.ActivityCompat;

import com.app.ps19.elecapp.Shared.Globals;
import com.app.ps19.elecapp.Shared.Utilities;
import com.app.ps19.elecapp.classes.Geometry;
import com.app.ps19.elecapp.classes.LatLong;
import com.app.ps19.elecapp.classes.Units;
import com.app.ps19.elecapp.location.Interface.OnLocationUpdatedListener;
import com.app.ps19.elecapp.location.LocationUpdatesService;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.LocationSource;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class UnitCordsAdjActivity extends AppCompatActivity implements
        OnMapReadyCallback,
        OnLocationUpdatedListener {
    TextView titleText;
    TextView unitText;
    MapView mapView;
    TextView tvMilepost;
    TextView tvLat1;
    TextView tvLong1;
    TextView tvLat2;
    TextView tvLong2;
    Units selectedUnit;
    Button btnReset;
    Button btnAdjust;
    Geometry lastGeometry;
    boolean dirty = false;
   // private LocationManager locationManager;
    private Location currentLocation;
   // private final int REQUEST_FINE_LOCATION = 1234;
    private GoogleMap mMap;
    private LocationSource.OnLocationChangedListener onLocationChangedListener;
    private ScrollView svMainContainer;
    private ImageView ivTransparent;
    private Location mLocation;
    Marker mCurrLocationMarker;
    Marker adjustedMarker;
    Location adjustedLocation;
    boolean isPrevAvailable = false;
    boolean move2CurrentLocation = true;

    public void setDirty(boolean dirty) {
        this.dirty = dirty;
    }

    public boolean isDirty() {
        return dirty;
    }

    @Override
    public void onLocationUpdated(Location _mLocation) {

        if (!LocationUpdatesService.canGetLocation() || _mLocation.getProvider().equals("None")) {
            Utilities.showSettingsAlert(UnitCordsAdjActivity.this);
        }
        else {
            if (onLocationChangedListener != null) {
                onLocationChangedListener.onLocationChanged(_mLocation);
            }

            mLocation = _mLocation;
            currentLocation = _mLocation;
        }
/*        if (mMap != null && move2CurrentLocation) {
            move2CurrentLocation = false;
            LatLng curLatLng = new LatLng(_mLocation.getLatitude(), _mLocation.getLongitude());
            // mCurrLocationMarker.setPosition(curLatLng);
            //if (mblnFollowCamera) {
            float zoom = mMap.getCameraPosition().zoom;

            CameraUpdate cameraUpdate = CameraUpdateFactory.newLatLngZoom(curLatLng, zoom);
            mMap.animateCamera(cameraUpdate);

            //}
            Log.i("Location:", "Location Updated");
        }*/

    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setLocale(this);
        setTitle(R.string.activity_update_asset_location);
        setContentView(R.layout.activity_unit_cords_adj);
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        move2CurrentLocation = true;
        if (lastKnownLocation != null) {
            mLocation = lastKnownLocation;
        }
        //Listen to location Updates
        LocationUpdatesService.addOnLocationUpdateListener( this.getClass().getSimpleName() , this);
        //-------------------GPS Code--------------
//        myReceiver = new MyReceiver();
//        // Check that the user hasn't revoked permissions by going to Settings.
//        if (Utils.requestingLocationUpdates(this)) {
//            /*if (!checkPermissions()) {
//                requestPermissions();
//            }*/
//        }
        //--------------------END-------------------
        svMainContainer = findViewById(R.id.sv_main_container);
        ivTransparent = findViewById(R.id.transparent_image);
        titleText = findViewById(R.id.tvTitleAssetType_uca);
        unitText = findViewById(R.id.tv_asset_name_uca);
        tvMilepost = findViewById(R.id.tvMilepost_uca);
        tvLat1 = findViewById(R.id.tvLat_uca);
        tvLong1 = findViewById(R.id.tvLong_uca);
        tvLat2 = findViewById(R.id.tvLatAdj_uca);
        tvLong2 = findViewById(R.id.tvLongAdj_uca);
        selectedUnit = Globals.selectedUnit;
        btnAdjust = findViewById(R.id.btnAdj_uca);
        btnReset = findViewById(R.id.btnReset_uca);
        btnAdjust.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (currentLocation != null) {
                    tvLat2.setText(String.valueOf(currentLocation.getLatitude()));
                    tvLong2.setText(String.valueOf(currentLocation.getLongitude()));
                    updateValues();
                    setDirty(true);
                }
            }
        });
        btnReset.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                tvLat2.setText("");
                tvLong2.setText("");
                /*if (lastGeometry == null) {
                    selectedUnit.setCoordinatesAdj(null);
                } else {
                    updateValues();
                    setDirty(true);
                    return;
                }*/
                setDirty(true);
                if(adjustedMarker != null){
                    adjustedMarker.remove();
                }
               setClearBtnDisable();
            }
        });

       setClearBtnDisable();
        btnAdjust.setVisibility(View.GONE);
        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map_uca);
        mapFragment.getMapAsync(this);
        updateFormValues();

//        LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
//        //LocationServices.getFusedLocationProviderClient(this);
//        // Create a criteria object to retrieve provider
//        Criteria criteria = new Criteria();
//
//        // Get the name of the best provider
//        String provider = locationManager.getBestProvider(criteria, true);

//        // Get Current Location
//        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
//            // TODO: Consider calling
//            //    ActivityCompat#requestPermissions
//            // here to request the missing permissions, and then overriding
//            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
//            //                                          int[] grantResults)
//            // to handle the case where the user grants the permission. See the documentation
//            // for ActivityCompat#requestPermissions for more details.
//            return;
//        }
        lastGeometry = selectedUnit.getCoordinatesAdj();

        currentLocation = LocationUpdatesService.getLocation();

        //Workaround for map scrolling till yet
        ivTransparent.setOnTouchListener(new View.OnTouchListener() {

            @Override
            public boolean onTouch(View v, MotionEvent event) {
                int action = event.getAction();
                switch (action) {
                    case MotionEvent.ACTION_DOWN:

                    case MotionEvent.ACTION_MOVE:
                        // Disallow ScrollView to intercept touch events.
                        svMainContainer.requestDisallowInterceptTouchEvent(true);
                        // Disable touch on transparent view
                        return false;

                    case MotionEvent.ACTION_UP:
                        // Allow ScrollView to intercept touch events.
                        svMainContainer.requestDisallowInterceptTouchEvent(false);
                        return true;

                    default:
                        return true;
                }
            }
        });

    }

    @Override
    public void onBackPressed() {
        if (isDirty()) {
            showConfirmationDialog();
        } else {
            finish();
        }
        super.onBackPressed();
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
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
        mMap.setMyLocationEnabled(true);
        mMap.getUiSettings().setMyLocationButtonEnabled(true);

        googleMap.setLocationSource(new LocationSource() {

            @Override
            public void activate(OnLocationChangedListener listener) {
                onLocationChangedListener = listener;

            }

            @Override
            public void deactivate() {
                onLocationChangedListener = null;
            }
        });

        //add location button click listener
        mMap.setOnMyLocationButtonClickListener(new GoogleMap.OnMyLocationButtonClickListener(){
            @Override
            public boolean onMyLocationButtonClick() {

                if (adjustedMarker != null) {
                    adjustedMarker.remove();
                }
                setClearBtnEnable();
                adjustedMarker = mMap.addMarker(new MarkerOptions()
                        .position(new LatLng(mLocation.getLatitude(), mLocation.getLongitude()))
                        .title("Adjusted Location").icon(BitmapDescriptorFactory
                                .defaultMarker(BitmapDescriptorFactory.HUE_AZURE)));

                adjustedLocation = new Location(LocationManager.GPS_PROVIDER);
                adjustedLocation.setLatitude(mLocation.getLatitude());
                adjustedLocation.setLongitude(mLocation.getLongitude());
                tvLat2.setText(String.valueOf(mLocation.getLatitude()));
                tvLong2.setText(String.valueOf(mLocation.getLongitude()));

                try {
                    onLocationChangedListener.onLocationChanged(mLocation);
                    mMap.animateCamera(CameraUpdateFactory.newLatLngZoom(new LatLng(mLocation.getLatitude(), mLocation.getLongitude()), 50));
                } catch (Exception e) {
                    e.printStackTrace();
                }

                setDirty(true);
                return false;
            }
        });
        mMap.setOnMapClickListener(new GoogleMap.OnMapClickListener() {
            @Override
            public void onMapClick(LatLng point) {
                if(adjustedMarker != null){
                    adjustedMarker.remove();
                }
                adjustedMarker = mMap.addMarker(new MarkerOptions().position(new LatLng(point.latitude, point.longitude)).title("Adjusted Location").icon(BitmapDescriptorFactory
                        .defaultMarker(BitmapDescriptorFactory.HUE_AZURE)));

                adjustedLocation = new Location(LocationManager.GPS_PROVIDER);
                adjustedLocation.setLatitude(point.latitude);
                adjustedLocation.setLongitude(point.longitude);
                tvLat2.setText(String.valueOf(point.latitude));
                tvLong2.setText(String.valueOf(point.longitude));
                setDirty(true);
                setClearBtnEnable();

                System.out.println(point.latitude+"---"+ point.longitude);
            }
        });
        /*mCurrLocationMarker = mMap.addMarker(new MarkerOptions().position(new LatLng(mLocation.getLatitude(), mLocation.getLongitude())).title("Current Location")
                .icon(BitmapDescriptorFactory.fromBitmap(getMarkerBitmapFromView(R.drawable.ic_person_white_24dp))));*/
        LatLng sydney = new LatLng(-33.852, 151.211);
        LatLng asset = null;
        try {
            asset = new LatLng(Double.parseDouble(selectedUnit.getCoordinates().get(0).getLat()), Double.parseDouble(selectedUnit.getCoordinates().get(0).getLon()));
            googleMap.addMarker(new MarkerOptions()
                    .position(asset)
                    .title(selectedUnit.getAssetTypeDisplayName()).snippet(selectedUnit.getDescription()));
        } catch (Exception e) {
            e.printStackTrace();
        }
        if(isPrevAvailable){
            if(adjustedMarker!=null){
                adjustedMarker.remove();
            }
            adjustedMarker = mMap.addMarker(new MarkerOptions().position(new LatLng(adjustedLocation.getLatitude(), adjustedLocation.getLongitude())).title("Adjusted Location").icon(BitmapDescriptorFactory
                    .defaultMarker(BitmapDescriptorFactory.HUE_AZURE)));
            isPrevAvailable = false;
            setClearBtnEnable();
        }
        try {
            mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(asset, 50));
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    private void updateValues(){
        //Update Adjusted Values;
        Geometry coordinatesAdj = selectedUnit.getCoordinatesAdj();

        String latitude=tvLat2.getText().toString();
        String longitude=tvLong2.getText().toString();
        latitude=latitude.equals("")?"0.0":latitude;
        longitude=longitude.equals("")?"0.0":longitude;

        if(coordinatesAdj ==null){
            JSONArray jaCords=new JSONArray();
            JSONObject joCords=new JSONObject();
            try {
                jaCords.put(Double.parseDouble(longitude));
                jaCords.put(Double.parseDouble(latitude));
                joCords.put("type","Point");
                joCords.put("coordinates",jaCords);
                coordinatesAdj=new Geometry(joCords,"Point");
                selectedUnit.setCoordinatesAdj(coordinatesAdj);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }else{
            LatLng latLng1=new LatLng(Double.parseDouble(latitude), Double.parseDouble(longitude));
            coordinatesAdj.getCoordinates().clear();
            coordinatesAdj.getCoordinates().add(latLng1);
            selectedUnit.setCoordinatesAdj(coordinatesAdj);
        }
    }
    private void updateFormValues() {
        ArrayList<LatLong> coordinates = selectedUnit.getCoordinates();
        Geometry coordinatesAdj = selectedUnit.getCoordinatesAdj();

        String assetType = selectedUnit.getAssetType();
        String unitId = selectedUnit.getDescription();
        String lat1 = coordinates.size() > 0 ? coordinates.get(0).getLat() : "";
        String lng1 = coordinates.size() > 0 ? coordinates.get(0).getLon() : "";

        String lat2 = coordinatesAdj!=null ? coordinatesAdj.getCoordinates().size()>0?String.valueOf(coordinatesAdj.getCoordinates().get(0).latitude).equals("0.0")?"":String.valueOf(coordinatesAdj.getCoordinates().get(0).latitude) : "":"";
        String lng2 =coordinatesAdj!=null ? coordinatesAdj.getCoordinates().size()>0?String.valueOf(coordinatesAdj.getCoordinates().get(0).longitude).equals("0.0")?"":String.valueOf(coordinatesAdj.getCoordinates().get(0).longitude) : "":"";

        tvMilepost.setText(selectedUnit.getStart());
        tvLat1.setText(lat1);
        tvLong1.setText(lng1);
        tvLat2.setText(lat2);
        tvLong2.setText(lng2);
        titleText.setText(assetType);
        unitText.setText(unitId);
        if(!lat2.equals("")){
            adjustedLocation = new Location(LocationManager.GPS_PROVIDER);
            adjustedLocation.setLatitude(Double.parseDouble(lat2));
            adjustedLocation.setLongitude(Double.parseDouble(lng2));
            isPrevAvailable = true;
        }

    }

//    @Override
//    public void onLocationChanged(Location location) {
//        currentLocation = location;
//        locationManager.removeUpdates(this);
//    }

//    @Override
//    public void onStatusChanged(String provider, int status, Bundle extras) {
//    }
//
//    @Override
//    public void onProviderEnabled(String provider) {
//    }
//
//    @Override
//    public void onProviderDisabled(String provider) {
//    }

//    @Override
//    public void onRequestPermissionsResult(int requestCode, String permissions[], int[] grantResults) {
//        switch (requestCode) {
//            case REQUEST_FINE_LOCATION:
//                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
//                    Log.d("gps", "Location permission granted");
//                    try {
////                        locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
////                        locationManager.requestLocationUpdates("gps", 0, 0, this);
//                    } catch (SecurityException ex) {
//                        Log.d("gps", "Location permission did not work!");
//                    }
//                }
//                break;
//        }
//    }
    @Override
    public boolean onSupportNavigateUp() {
        if(isDirty()){
            showConfirmationDialog();
        } else {
            finish();
        }
        return true;
    }

////    @Override
////    public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, String key) {
////
////    }
//
//    /**
//     * Receiver for broadcasts sent by {@link LocationUpdatesService}.
//     */
//    private class MyReceiver extends BroadcastReceiver {
//        @Override
//        public void onReceive(Context context, Intent intent) {
//            Location _mLocation = intent.getParcelableExtra(LocationUpdatesService.EXTRA_LOCATION);
//            if (_mLocation != null) {
//                mLocation = _mLocation;
//                if (mMap != null) {
//                    if (mCurrLocationMarker != null) {
//                        LatLng curLatLng = new LatLng(_mLocation.getLatitude(), _mLocation.getLongitude());
//                        mCurrLocationMarker.setPosition(curLatLng);
//                        //if (mblnFollowCamera) {
//                            float zoom = mMap.getCameraPosition().zoom;
//
//                            CameraUpdate cameraUpdate = CameraUpdateFactory.newLatLngZoom(curLatLng, zoom);
//                            mMap.animateCamera(cameraUpdate);
//
//                        //}
//                        Log.i("Location:", "Location Updated");
//                    }
//                }
//                   /* cLocation = mLocation;
//                    latitude = String.valueOf(mLocation.getLatitude());
//                    longitude = String.valueOf(mLocation.getLongitude());
//                    refreshLocation();
//                    Toast.makeText(MainActivity.this, Utils.getLocationText(mLocation),
//                            Toast.LENGTH_SHORT).show();*/
//            }
//        }
//    }
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        switch (keyCode) {
            case KeyEvent.KEYCODE_BACK:

                if(isDirty()){
                    showConfirmationDialog();
                } else {
                    finish();
                }
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
//            LocalBroadcastManager.getInstance(this).unregisterReceiver(myReceiver);
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

//        bindService(new Intent(UnitCordsAdjActivity.this, LocationUpdatesService.class), mServiceConnection,
//                Context.BIND_AUTO_CREATE);
//        PreferenceManager.getDefaultSharedPreferences(this)
//                .registerOnSharedPreferenceChangeListener(this);
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
    public void onResume() {
        super.onResume();
        try {
            //Listen to location Updates
            LocationUpdatesService.addOnLocationUpdateListener( this.getClass().getSimpleName() , this);
//            LocalBroadcastManager.getInstance(this).registerReceiver(myReceiver,
//                    new IntentFilter(LocationUpdatesService.ACTION_BROADCAST));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
//    // Monitors the state of the connection to the service.
//    private final ServiceConnection mServiceConnection = new ServiceConnection() {
//
//        @Override
//        public void onServiceConnected(ComponentName name, IBinder service) {
//            LocationUpdatesService.LocalBinder binder = (LocationUpdatesService.LocalBinder) service;
//            mService = binder.getService();
//            mBound = true;
//            if (mService != null) {
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
    private static final String TAGa = "resPMain";

//    // Used in checking for runtime permissions.
//    private static final int REQUEST_PERMISSIONS_REQUEST_CODE = 34;
//
//    // The BroadcastReceiver used to listen from broadcasts from the service.
//    private MyReceiver myReceiver;
//
//    // A reference to the service used to get location updates.
//    private LocationUpdatesService mService = null;

    // Tracks the bound state of the service.
  //  private boolean mBound = false;
    private Bitmap getMarkerBitmapFromView(@DrawableRes int resId) {

        View customMarkerView = ((LayoutInflater) getSystemService(Context.LAYOUT_INFLATER_SERVICE)).inflate(R.layout.view_custom_marker, null);
        ImageView markerImageView = (ImageView) customMarkerView.findViewById(R.id.profile_image);
        markerImageView.setImageResource(resId);

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
    private void showConfirmationDialog() {
        AlertDialog alertDialog = new AlertDialog.Builder(this)
                //set icon
                .setIcon(android.R.drawable.ic_dialog_alert)
                //set title
                .setTitle(getString(R.string.title_warning))
                //set message
                //.setMessage(getString(R.string.issue_confirmation_msg))
                .setMessage(R.string.asset_location_update_confirmation_msg)
                //set positive button
                .setPositiveButton(getString(R.string.briefing_yes), new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        //Remove Location Updates
                        LocationUpdatesService.removeLocationUpdateListener(this.getClass().getSimpleName());
//                        if (mBound) {
//                            // Unbind from the service. This signals to the service that this activity is no longer
//                            // in the foreground, and the service can respond by promoting itself to a foreground
//                            // service.
//                            unbindService(mServiceConnection);
//                            mBound = false;
//                        }
                        updateValues();
                        Globals.selectedJPlan.update();
                        finish();
                    }
                })
                //set negative button
                .setNegativeButton(getString(R.string.briefing_no), new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        //set what should happen when negative button is clicked
                        finish();

                    }
                })
                .show();
    }
    private void setClearBtnDisable(){
        btnReset.setEnabled(false);
        btnReset.setTextColor(Color.parseColor("#E8F5E9"));
        btnReset.setBackgroundColor(Color.parseColor("#2F1A1A18"));
    }
    private void setClearBtnEnable(){
        btnReset.setEnabled(true);
        btnReset.setTextColor(Color.parseColor("#FFFFFF"));
        btnReset.setBackgroundColor(Color.parseColor("#c1272d"));
    }


}