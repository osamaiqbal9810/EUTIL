package com.app.ps19.elecapp;//package com.app.ps19.elecapp;
//
//import android.Manifest;
//import android.annotation.SuppressLint;
//import android.app.AlertDialog;
//import android.app.Service;
//import android.content.Context;
//import android.content.DialogInterface;
//import android.content.Intent;
//import android.content.pm.PackageManager;
//import android.location.Criteria;
//import android.location.Location;
//import android.location.LocationListener;
//import android.location.LocationManager;
//import android.os.Build;
//import android.os.Bundle;
//import android.os.IBinder;
//import android.provider.Settings;
//import androidx.core.content.ContextCompat;
//import android.util.Log;
//
//import com.app.ps19.elecapp.Shared.LocationChangedInterface;
//
//import java.util.List;
//
//import static android.content.ContentValues.TAG;
//
//
//public class GPSTracker extends Service implements LocationListener {
//
//    private Context mContext;
//    private static final int REQUEST_CODE_PERMISSION = 2;
//    String mPermission = Manifest.permission.ACCESS_FINE_LOCATION;
//    public LocationChangedInterface mListener;
//    private static final String NETWORK_PROVIDER = "network";
//    private static final String GPS_PROVIDER = "gps";
//    public static final String PASSIVE_PROVIDER = "passive";
//    public static final String FUSED_PROVIDER = "fused";
//    private static final int TWO_MINUTES = 1000 * 60 * 2;
//    public Location previousBestLocation = null;
//
//
//    // flag for GPS status
//    boolean isGPSEnabled = false;
//
//    // flag for network status
//    boolean isNetworkEnabled = false;
//
//    // flag for GPS status
//    boolean canGetLocation = false;
//    String provider;
//
//    Location location; // location
//    double latitude; // latitude
//    double longitude; // longitude
//
//    // The minimum distance to change Updates in meters
//    private static final long MIN_DISTANCE_CHANGE_FOR_UPDATES = 1; // 10 meters
//
//    // The minimum time between updates in milliseconds
//    private static final long MIN_TIME_BW_UPDATES = 0;//1000 * 10 * 1; // 1 minute
//
//    // Declaring a Location Manager
//    protected LocationManager locationManager;
//
//    public GPSTracker(Context context) {
//        this.mContext = context;
//        if(isGPSEnabled()){
//            getLocation();
//        }
//        if (context instanceof LocationChangedInterface) {
//            mListener = (LocationChangedInterface) context;
//        } else {
//           /* throw new RuntimeException(context.toString()
//                    + " must implement LocationManagerInterface");*/
//        }
//    }
//
//    public GPSTracker() {
//    }
//
//    public Location getLocation() {
//        try {
//            if ( Build.VERSION.SDK_INT >= 23 &&
//                    ContextCompat.checkSelfPermission( mContext, android.Manifest.permission.ACCESS_FINE_LOCATION ) != PackageManager.PERMISSION_GRANTED &&
//                    ContextCompat.checkSelfPermission( mContext, android.Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
//                return null;
//            } else {
//                requestLocationUpdates();
//            }
//            /*else {
//                locationManager = (LocationManager) mContext.getSystemService(LOCATION_SERVICE);
//                if(isGPSEnabled()){
//                    this.isGPSEnabled = true;
//                    //Updated Code for better accuracy
//                    if(provider == null){
//                        // Probably its service's initial run
//                        //provider = locationManager.getBestProvider(criteria, false);
//                        location = locationManager.getLastKnownLocation(getGPSProvider());
//                        locationManager.requestLocationUpdates(
//                                provider,
//                                MIN_TIME_BW_UPDATES,
//                                MIN_DISTANCE_CHANGE_FOR_UPDATES, this);
//                    } else {
//                        if(location == null){
//                            if(isSameProvider(provider, locationManager.getBestProvider(criteria, false))){
//                                switch (provider) {
//                                    case GPS_PROVIDER :
//                                        provider = locationManager.NETWORK_PROVIDER;
//                                        break;
//                                    case NETWORK_PROVIDER:
//                                        if(isNetworkProviderAvailable()){
//                                            provider = locationManager.PASSIVE_PROVIDER;
//                                        }
//                                        break;
//                                    case PASSIVE_PROVIDER:
//                                        provider = locationManager.GPS_PROVIDER;
//                                        break;
//                                }
//                                location = locationManager.getLastKnownLocation(provider);
//                                locationManager.requestLocationUpdates(
//                                        provider,
//                                        MIN_TIME_BW_UPDATES,
//                                        MIN_DISTANCE_CHANGE_FOR_UPDATES, this);
//                            } else {
//                                if(locationManager.getLastKnownLocation(locationManager.GPS_PROVIDER)!=null){
//                                    location = locationManager.getLastKnownLocation(locationManager.GPS_PROVIDER);
//                                } else  if(locationManager.getLastKnownLocation(locationManager.NETWORK_PROVIDER)!=null){
//                                    location = locationManager.getLastKnownLocation(locationManager.NETWORK_PROVIDER);
//                                } else  if(locationManager.getLastKnownLocation(locationManager.PASSIVE_PROVIDER)!=null){
//                                    location = locationManager.getLastKnownLocation(locationManager.PASSIVE_PROVIDER);
//                                } else {
//                                    Toast.makeText(mContext, "Unable to get location at this time!", Toast.LENGTH_SHORT).show();
//                                }
//                            }
//                        } else {
//                            provider = locationManager.getBestProvider(criteria, true);
//                            location = locationManager.getLastKnownLocation(provider);
//                            assert locationManager != null;
//                            locationManager.requestLocationUpdates(
//                                    provider,
//                                    MIN_TIME_BW_UPDATES,
//                                    MIN_DISTANCE_CHANGE_FOR_UPDATES, this);
//                        }
//                    }
//                } else {
//                    this.isGPSEnabled = false;
//                }
//
//
//
//
//               *//* // getting GPS status
//                isGPSEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
//
//                // getting network status
//                isNetworkEnabled = locationManager
//                        .isProviderEnabled(LocationManager.NETWORK_PROVIDER);
//
//                if (!isGPSEnabled) {
//                    // no network provider is enabled
//                    this.canGetLocation = false;
//                } else {
//                    this.canGetLocation = true;
//                    //Updated code for better Accuracy
//                    assert locationManager != null;
//                    locationManager.requestLocationUpdates(
//                            provider,
//                            MIN_TIME_BW_UPDATES,
//                            MIN_DISTANCE_CHANGE_FOR_UPDATES, this);
//            }*//*
//
//                // First get location from Network Provider
//
//                *//*if (isNetworkEnabled) {
//                    if (ActivityCompat.checkSelfPermission(mContext, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(mContext, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
//
//                        // TODO: Consider calling
//                        //    ActivityCompat#requestPermissions
//                        // here to request the missing permissions, and then overriding
//                        //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
//                        //                                          int[] grantResults)
//                        // to handle the case where the user grants the permission. See the documentation
//                        // for ActivityCompat#requestPermissions for more details.
//                        //return TODO;
//                        this.canGetLocation = false;
//                    }
//                    locationManager.requestLocationUpdates(
//                           provider,
//                            MIN_TIME_BW_UPDATES,
//                            MIN_DISTANCE_CHANGE_FOR_UPDATES, this);
//                   *//**//* locationManager.requestLocationUpdates(
//                            LocationManager.NETWORK_PROVIDER,
//                            MIN_TIME_BW_UPDATES,
//                            MIN_DISTANCE_CHANGE_FOR_UPDATES, this);*//**//*
//
//                    Log.d("Network", "Network");
//                    if (locationManager != null) {
//                        location = locationManager
//                                .getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
//
//                        if (location != null) {
//                            latitude = location.getLatitude();
//                            longitude = location.getLongitude();
//                        }
//                    }
//                }
//
//                // if GPS Enabled get lat/long using GPS Services
//                if (isGPSEnabled) {
//                    this.canGetLocation = true;
//                    if (location == null) {
//                       *//**//* locationManager.requestLocationUpdates(
//                                LocationManager.GPS_PROVIDER,
//                                MIN_TIME_BW_UPDATES,
//                                MIN_DISTANCE_CHANGE_FOR_UPDATES, this);*//**//*
//                        assert locationManager != null;
//                        locationManager.requestLocationUpdates(
//                                provider,
//                                MIN_TIME_BW_UPDATES,
//                                MIN_DISTANCE_CHANGE_FOR_UPDATES, this);
//
//                        Log.d("GPS Enabled", "GPS Enabled");
//                        if (locationManager != null) {
//                            location = locationManager
//                                    .getLastKnownLocation(LocationManager.GPS_PROVIDER);
//
//                            if (location != null) {
//                                latitude = location.getLatitude();
//                                longitude = location.getLongitude();
//                            }
//                        }
//                    }
//                }*//*
//            }*/
//
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//
//        return location;
//    }
//
//    /**
//     * Stop using GPS listener
//     * Calling this function will stop using GPS in your app
//     */
//
//    public void stopUsingGPS() {
//        if (locationManager != null) {
//            locationManager.removeUpdates(GPSTracker.this);
//        }
//    }
//
//    /**
//     * Function to get latitude
//     */
//
//    public double getLatitude() {
//        if (location != null) {
//            latitude = location.getLatitude();
//        }
//
//        // return latitude
//        return latitude;
//    }
//
//    /**
//     * Function to get longitude
//     */
//
//    public double getLongitude() {
//        if (location != null) {
//            longitude = location.getLongitude();
//        }
//
//        // return longitude
//        return longitude;
//    }
//
//    /**
//     * Function to check GPS/wifi enabled
//     *
//     * @return boolean
//     */
//
//    public boolean canGetLocation() {
//        //getLocation();
//        if(isGPSEnabled()){
//            this.canGetLocation = true;
//        } else this.canGetLocation = isNetworkProviderAvailable();
//        return this.canGetLocation;
//    }
//
//    /**
//     * Function to show settings alert dialog
//     * On pressing Settings button will launch Settings Options
//     */
//
//    public void showSettingsAlert() {
//        AlertDialog.Builder alertDialog = new AlertDialog.Builder(mContext);
//
//        // Setting Dialog Title
//        alertDialog.setTitle("GPS settings");
//
//        // Setting Dialog Message
//        alertDialog.setMessage("GPS is not enabled. Do you want to go to settings ?");
//
//        // On pressing Settings button
//        alertDialog.setPositiveButton("Settings", new DialogInterface.OnClickListener() {
//            public void onClick(DialogInterface dialog, int which) {
//                Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
//                mContext.startActivity(intent);
//            }
//        });
//
//        // on pressing cancel button
//        alertDialog.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
//            public void onClick(DialogInterface dialog, int which) {
//                dialog.cancel();
//            }
//        });
//
//        // Showing Alert Message
//        alertDialog.show();
//    }
//
//    @Override
//    public void onProviderDisabled(String provider) {
//    }
//
//    @Override
//    public void onProviderEnabled(String provider) {
//    }
//
//    @Override
//    public void onStatusChanged(String provider, int status, Bundle extras) {
//    }
//
//    @Override
//    public IBinder onBind(Intent arg0) {
//        return null;
//    }
//    /** Checks whether two providers are the same */
//    private boolean isSameProvider(String provider1, String provider2) {
//        if (provider1 == null) {
//            return provider2 == null;
//        }
//        return provider1.equals(provider2);
//    }
//    public boolean isGPSEnabled() {
//        if (locationManager != null) {
//            return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
//        } else {
//            locationManager = (LocationManager) mContext.getSystemService(LOCATION_SERVICE);
//            return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
//        }
//    }
//    public boolean isNetworkProviderAvailable() {
//        if (locationManager != null) {
//            return isNetworkEnabled = locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
//        } else {
//            locationManager = (LocationManager) mContext.getSystemService(LOCATION_SERVICE);
//            return isNetworkEnabled = locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
//        }
//    }
//    @Override
//    public void onLocationChanged(Location location) {
//        if(isBetterLocation(location, previousBestLocation)) {
//            previousBestLocation = location;
//            if (mListener != null) {
//                mListener.locationChanged(location);
//            }
//            this.location = location;
//        }
//    }
//    protected boolean isBetterLocation(Location location, Location currentBestLocation) {
//        if (currentBestLocation == null) {
//            // A new location is always better than no location
//            return true;
//        }
//
//        // Check whether the new location fix is newer or older
//        long timeDelta = location.getTime() - currentBestLocation.getTime();
//        boolean isSignificantlyNewer = timeDelta > TWO_MINUTES;
//        boolean isSignificantlyOlder = timeDelta < -TWO_MINUTES;
//        boolean isNewer = timeDelta > 0;
//
//        // If it's been more than two minutes since the current location, use the new location
//        // because the user has likely moved
//        if (isSignificantlyNewer) {
//            return true;
//            // If the new location is more than two minutes older, it must be worse
//        } else if (isSignificantlyOlder) {
//            return false;
//        }
//
//        // Check whether the new location fix is more or less accurate
//        int accuracyDelta = (int) (location.getAccuracy() - currentBestLocation.getAccuracy());
//        boolean isLessAccurate = accuracyDelta > 0;
//        boolean isMoreAccurate = accuracyDelta < 0;
//        boolean isSignificantlyLessAccurate = accuracyDelta > 200;
//
//        // Check if the old and new location are from the same provider
//        boolean isFromSameProvider = isSameProvider(location.getProvider(),
//                currentBestLocation.getProvider());
//
//        // Determine location quality using a combination of timeliness and accuracy
//        if (isMoreAccurate) {
//            return true;
//        } else if (isNewer && !isLessAccurate) {
//            return true;
//        } else if (isNewer && !isSignificantlyLessAccurate && isFromSameProvider) {
//            return true;
//        }
//        return false;
//    }
//    private String getNetworkProvider(){
//        Criteria criteria = new Criteria();
//        criteria.setAltitudeRequired(false);
//        criteria.setBearingRequired(false);
//        criteria.setCostAllowed(false);
//        criteria.setPowerRequirement(Criteria.POWER_LOW);
//
//        criteria.setAccuracy(Criteria.ACCURACY_COARSE);
//        return locationManager.getBestProvider(criteria, true);
//    }
//    private String getGPSProvider(){
//        Criteria criteria = new Criteria();
//        criteria.setAltitudeRequired(false);
//        criteria.setBearingRequired(false);
//        criteria.setCostAllowed(false);
//        criteria.setPowerRequirement(Criteria.POWER_LOW);
//
//        criteria.setAccuracy(Criteria.ACCURACY_FINE);
//        return locationManager.getBestProvider(criteria, true);
//    }
//    @SuppressLint("MissingPermission")
//    private void requestLocationUpdates() {
//        this.locationManager = (LocationManager) mContext.getSystemService(Context.LOCATION_SERVICE);
//        locationManager.removeUpdates(this);
//        List<String> enabledProviders = this.locationManager.getProviders(true);
//        for (String provider:enabledProviders){
//            Log.i(TAG, "Requesting location updates from provider " + provider);
//            if(this.location == null){
//                if(locationManager.getLastKnownLocation(provider) != null){
//                    location = locationManager.getLastKnownLocation(provider);
//                }
//            }
//            this.locationManager.requestLocationUpdates(provider, MIN_TIME_BW_UPDATES, MIN_DISTANCE_CHANGE_FOR_UPDATES, this);
//        }
//    }
//    @SuppressLint("MissingPermission")
//    public Location getLastKnownLocation(){
//        List<String> enabledProviders = this.locationManager.getProviders(true);
//        for (String provider:enabledProviders){
//            Log.i(TAG, "Requesting location updates from provider " + provider);
//
//                if(locationManager.getLastKnownLocation(provider) != null){
//                    return locationManager.getLastKnownLocation(provider);
//                }
//        }
//        return null;
//    }
//}