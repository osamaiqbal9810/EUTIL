package com.app.ps19.scimapp.Shared;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.content.Context;
import android.content.ContextWrapper;
import android.content.DialogInterface;
import android.content.Intent;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationManager;
import android.provider.Settings;

public class GPSTrackerEx extends ContextWrapper implements LocationChangedInterface{

    private Context mContext;
    private static final int REQUEST_CODE_PERMISSION = 2;
    String mPermission = Manifest.permission.ACCESS_FINE_LOCATION;

    // flag for GPS status
    boolean isGPSEnabled = false;

    // flag for network status
    boolean isNetworkEnabled = false;

    // flag for GPS status
    boolean canGetLocation = false;
    String provider;
    private boolean mIsBound;

    public GPSTrackerEx(Context base) {
        super(base);
        /*if(!mServiceConnected){
            mServiceConnected = bindService(new Intent(base, GPSService.class), mServconn,
                    Context.BIND_AUTO_CREATE);
        }*/
        mContext = base;
        //doBindService();
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    Location location; // location
    double latitude; // latitude
    double longitude; // longitude

    // The minimum distance to change Updates in meters
    private static final long MIN_DISTANCE_CHANGE_FOR_UPDATES = 1; // 10 meters

    // The minimum time between updates in milliseconds
    private static final long MIN_TIME_BW_UPDATES = 0;//1000 * 10 * 1; // 1 minute

    // Declaring a Location Manager
    protected LocationManager locationManager;
//TODO: See https://developer.android.com/reference/android/app/Service
    /*ServiceConnection mServconn = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            Log.d("SVTEST", "Activity service connected");
            //GPSService.LocalBinder binder = (GPSService.LocalBinder) service;
            gService = ((GPSService.LocalBinder)service).getService();
            //gService = binder.getService();
            // Can't call this methodInTheService UNTIL IT'S BOUND!
            //gService.getLocation();
            //gService.methodInTheService();
            if(mContext != null && gService!= null){
                gService.setListener(mContext);
            }
            mBound = true;
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            Log.d("SVTEST", "Activity service disconnected from: " + name);
            mBound = false;
        }
    };*/


    public Location getLocation() {
        return this.location;
    }

    /**
     * Stop using GPS listener
     * Calling this function will stop using GPS in your app
     */

    /*public void stopUsingGPS() {
        if (gService != null) {
            gService.stopUsingGPS();
        }
    }*/

    /**
     * Function to get latitude
     */

    public double getLatitude() {
        if (location != null) {
            latitude = location.getLatitude();
        }

        // return latitude
        return latitude;
    }

    /**
     * Function to get longitude
     */

    public double getLongitude() {
        if (location != null) {
            longitude = location.getLongitude();
        }

        // return longitude
        return longitude;
    }

    /**
     * Function to check GPS/wifi enabled
     *
     * @return boolean
     */

    public boolean canGetLocation() {
        if(isGPSEnabled()){
            this.canGetLocation = true;
        } else this.canGetLocation = isNetworkProviderAvailable();
        return this.canGetLocation;
    }

    /**
     * Function to show settings alert dialog
     * On pressing Settings button will launch Settings Options
     */

    public void showSettingsAlert() {
        AlertDialog.Builder alertDialog = new AlertDialog.Builder(mContext);

        // Setting Dialog Title
        alertDialog.setTitle("GPS settings");

        // Setting Dialog Message
        alertDialog.setMessage("GPS is not enabled. Do you want to go to settings ?");

        // On pressing Settings button
        alertDialog.setPositiveButton("Settings", new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int which) {
                Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                mContext.startActivity(intent);
            }
        });

        // on pressing cancel button
        alertDialog.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int which) {
                dialog.cancel();
            }
        });

        // Showing Alert Message
        alertDialog.show();
    }

    /** Checks whether two providers are the same */
    private boolean isSameProvider(String provider1, String provider2) {
        if (provider1 == null) {
            return provider2 == null;
        }
        return provider1.equals(provider2);
    }
    public boolean isGPSEnabled() {
        if (locationManager != null) {
            return locationManager.getAllProviders().contains(LocationManager.GPS_PROVIDER);
            //return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
        } else {
            locationManager = (LocationManager) mContext.getSystemService(LOCATION_SERVICE);
            return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
        }
    }
    public boolean isNetworkProviderAvailable() {
        if (locationManager != null) {
            return isNetworkEnabled = locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
        } else {
            locationManager = (LocationManager) mContext.getSystemService(LOCATION_SERVICE);
            return isNetworkEnabled = locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
        }
    }
    private String getNetworkProvider(){
        Criteria criteria = new Criteria();
        criteria.setAltitudeRequired(false);
        criteria.setBearingRequired(false);
        criteria.setCostAllowed(false);
        criteria.setPowerRequirement(Criteria.POWER_LOW);

        criteria.setAccuracy(Criteria.ACCURACY_COARSE);
        return locationManager.getBestProvider(criteria, true);
    }
    private String getGPSProvider(){
        Criteria criteria = new Criteria();
        criteria.setAltitudeRequired(false);
        criteria.setBearingRequired(false);
        criteria.setCostAllowed(false);
        criteria.setPowerRequirement(Criteria.POWER_LOW);

        criteria.setAccuracy(Criteria.ACCURACY_FINE);
        return locationManager.getBestProvider(criteria, true);
    }

    @SuppressLint("MissingPermission")
    public Location getLastKnownLocation(){
        if(Globals.lastKnownLocation!=null){
            return Globals.lastKnownLocation;
        } else {
            return null;
        }
    }

    @Override
    public void locationChanged(Location mLocation) {
        setLocation(mLocation);
    }
   /* public void unbindService(){
        if (mBound) {
            if(gService!= null){
                try {
                    mServiceConnected = false;
                    gService.unbindService(mServconn);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                mBound = false;
            }
        }
    }*/
}