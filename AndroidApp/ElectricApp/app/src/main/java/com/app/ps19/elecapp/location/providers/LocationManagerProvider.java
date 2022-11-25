package com.app.ps19.elecapp.location.providers;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Looper;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;

import com.app.ps19.elecapp.location.Interface.LocationProvider;
import com.app.ps19.elecapp.location.Interface.OnLocationUpdatedListener;
import com.app.ps19.elecapp.location.config.LocationAccuracy;
import com.app.ps19.elecapp.location.config.LocationParams;
import com.app.ps19.elecapp.location.utils.LocationRelay;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;

import org.jetbrains.annotations.NotNull;

//import com.app.ps19.elecapp.location.utils.LocationStore;


public class LocationManagerProvider implements LocationProvider, LocationListener {

    private boolean isFusedLocation = false;
    private FusedLocationProviderClient mFusedLocationClient;

    private LocationCallback locationCallback;
    private LocationManager locationManager;
    private static OnLocationUpdatedListener listener;
    private Context mContext;
    private static LocationRelay locationRelay = null;
    private String provider;
    private Location lastLocation = null;
    private boolean isRunning;
    private boolean canGetUpdates = true;
    private LocationRequest locationRequest;
    public static final Location defaultLocation =  new Location("None");
    public static LocationAccuracy CurrentAccuracy = LocationAccuracy.HIGH;

    @Override
    public void init(Context context, ProviderType type) {
        switch (type) {
            case NETWORK:
                provider = LocationManager.NETWORK_PROVIDER;
                break;
            case GPS:
                provider = LocationManager.GPS_PROVIDER;
                break;
            case Passive:
                provider = LocationManager.PASSIVE_PROVIDER;
                break;

            case FusedLocation:
                isFusedLocation = true;
                provider = "fused";
                mFusedLocationClient = LocationServices.getFusedLocationProviderClient(context);
                break;
        }
        if (isFusedLocation) {
            locationCallback = new LocationCallback() {//Fused Location Updates Callback
                @Override
                public void onLocationResult(@NonNull LocationResult locationResult) {
                    for (Location location : locationResult.getLocations()) {
                        if (location != null) {
                            //Send Location Updates here
                            onLocationChanged(location);
                        }
                    }
                }
            };
        } else {
            locationManager = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
        }
        if (locationRelay == null) {
            locationRelay = new LocationRelay();
            locationRelay.onStart();
        }
        this.mContext = context;
    }

    @Override
    public void start(OnLocationUpdatedListener listener, LocationParams params, boolean singleUpdate) {

        if (LocationManagerProvider.listener == null) {
            LocationManagerProvider.listener = listener;
        }

        if (this.isRunning)
            return;

        if (singleUpdate) {
            if (ActivityCompat.checkSelfPermission(mContext,
                    Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
                    ActivityCompat.checkSelfPermission(mContext,
                            Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                canGetUpdates = false;
                return;
            }
            locationManager.requestSingleUpdate(LocationManager.GPS_PROVIDER, this, Looper.getMainLooper());
        }

        CurrentAccuracy = params.getAccuracy();
        if (isFusedLocation) {//Fused Location
            locationRequest = getLocationRequest(params);
            mFusedLocationClient.requestLocationUpdates(locationRequest, locationCallback, null);

        } else {
            locationManager.requestLocationUpdates(
                    provider,
                    params.getInterval(),
                    params.getDistance(),
                    this,
                    Looper.getMainLooper());
        }
        canGetUpdates = true;
        this.isRunning = true;
        long lastTime = 0;
    }

    @Override
    public void stop() {
        if (ActivityCompat.checkSelfPermission(mContext,
                Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
                ActivityCompat.checkSelfPermission(mContext,
                        Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            canGetUpdates = false;
            return;
        }

        if (isRunning) {

            if (isFusedLocation && provider == "fused") {
                mFusedLocationClient.removeLocationUpdates(locationCallback);
            } else {
                locationManager.removeUpdates(this);
            }

            isRunning = false;
            //listener = null;
            canGetUpdates = false;
        }
    }

    @Override
    public void restart(OnLocationUpdatedListener listener, LocationParams params) {

        if (LocationManagerProvider.listener == null) {
            LocationManagerProvider.listener = listener;
        }

        if (ActivityCompat.checkSelfPermission(mContext,
                Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED
                && ActivityCompat.checkSelfPermission(mContext,
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
        CurrentAccuracy = params.getAccuracy();
        if (isFusedLocation) {//Fused Location
            locationRequest = getLocationRequest(params);
            mFusedLocationClient.requestLocationUpdates(locationRequest, locationCallback, null);

        } else {
            locationManager.requestLocationUpdates(
                    provider,
                    params.getInterval(),
                    params.getDistance(),
                    this,
                    Looper.getMainLooper());
        }
    }

    @Override
    public boolean canGetLocation() {
//        if(!this.canGetUpdates){
//            return this.canGetUpdates;
//        }

        boolean gps_enabled;
        boolean network_enabled;

        gps_enabled = isGPSEnabled();
        network_enabled = isNetworkProviderAvailable();

        this.canGetUpdates = gps_enabled || network_enabled;

        return this.canGetUpdates;
    }

    private boolean isGPSEnabled() {
        try {
            LocationManager lm;
                lm = (LocationManager) mContext.getSystemService(Context.LOCATION_SERVICE);
                return lm.isProviderEnabled(LocationManager.GPS_PROVIDER);
        } catch (Exception ignored) {
        }
        return false;
    }

    private boolean isNetworkProviderAvailable() {
        try {
            LocationManager lm;
            lm = (LocationManager) mContext.getSystemService(Context.LOCATION_SERVICE);
            return lm.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
        } catch (Exception ignored) {
        }
        return false;
    }

    @NotNull
    private LocationRequest getLocationRequest(@NotNull LocationParams params) {
        final LocationAccuracy accuracy = params.getAccuracy();
        CurrentAccuracy = accuracy;

        final LocationRequest locationRequest = new LocationRequest();
        locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
        switch (accuracy) {
            case HIGH:
                locationRequest.setInterval(LocationProvider.MIN_UPDATE_TIME);//100
                locationRequest.setSmallestDisplacement(LocationProvider.MIN_UPDATE_DISTANCE);//0.1meter
                break;

            case MEDIUM:
                locationRequest.setInterval(LocationProvider.MEDIUM_UPDATE_TIME);//500
                locationRequest.setSmallestDisplacement(LocationProvider.MEDIUM_UPDATE_DISTANCE);//1meter
                break;

            case LOW:
            case LOWEST:
                locationRequest.setInterval(LocationProvider.MAX_UPDATE_TIME);//5min
                locationRequest.setSmallestDisplacement(LocationProvider.MAX_UPDATE_DISTANCE);//5meter
                break;
        }

        return locationRequest;
    }

    public  double roundAvoid(double value, int places) {
        double scale = Math.pow(10, places);
        return Math.round(value * scale) / scale;
    }

    private double getDistanceBwTwoLocations(Location loc1, Location loc2){
        double loc1Lat = loc1.getLatitude(); // Last known lat
        double loc1Lng = loc1.getLongitude(); // Last known lng

        double latDistance = Math.toRadians(loc2.getLatitude() - loc1Lat);
        double lngDistance = Math.toRadians(loc2.getLongitude() - loc1Lng);
        double a = (Math.sin(latDistance / 2) * Math.sin(latDistance / 2)) +
                (Math.cos(Math.toRadians(loc2.getLatitude()))) *
                        (Math.cos(Math.toRadians(loc2.getLongitude()))) *
                        (Math.sin(lngDistance / 2)) *
                        (Math.sin(lngDistance / 2));

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        double dist = 6371 * c;
        return dist;
    }

    private boolean isSame(Location loc1, Location loc2){
        int LocationRoundingPlaces = 5;
        boolean ret = false;

        double lat1 = loc1.getLatitude();
        double lon1 = loc1.getLongitude();

        double lat2 = loc2.getLatitude();
        double lon2 = loc2.getLongitude();

        if(roundAvoid(lat2,LocationRoundingPlaces) == roundAvoid(lat1,LocationRoundingPlaces) &&
                roundAvoid(lon2,LocationRoundingPlaces) == roundAvoid(lon1,LocationRoundingPlaces)){
            ret = true;
        }

        else{ //Location is same upto 5 Significant Places, Let check the distance
            double displacement =  getDistanceBwTwoLocations(loc1, loc2); // in meters
            if(displacement > 0.001){ // change is greater than 1meter
                //we need to update the location with current location
                ret = false;
            }else{ // we have same location
                ret = true;
            }
        }

        return  ret;
    }

    @Override
    public void onLocationChanged(Location location) {

        if (location == null){
            canGetLocation();
        }
        if(lastLocation != null) {

            if(isSame(location, lastLocation)){
               // Log.i("SAME LOCATION", "WE ARE GETTING SAME LOCATION");
            }
            else {
                Location newLoc = locationRelay.getAccurateLocation(location);
                if(!lastLocation.equals(newLoc)) {

                    if (listener != null && lastLocation != null) {
                       // Log.i("UPDATE LOCATION", " LOCATION UPDATED");
                        lastLocation = newLoc;
                        listener.onLocationUpdated(lastLocation);
                    }
                }else{
                   // Log.i("SAME LOCATION", "Location Relay returned same location");
                }
            }
        }
        else {
            lastLocation = locationRelay.getAccurateLocation(location);
            if (listener != null && lastLocation != null) {
                listener.onLocationUpdated(lastLocation);
            }
        }

    }

    @NotNull
    @Override
    public Location getLocation() {
        if(canGetLocation())
        return lastLocation;
        else
            return null;
    }

    @NotNull
    @Override
    public Location getLastLocation() {
        return locationRelay.getLastLocation();
    }

    @Override
    public void onProviderEnabled(String provider) {
        canGetUpdates = true;
        this.provider = provider;
    }


    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {
    }

    @Override
    public void onProviderDisabled(String provider) {
        if (listener != null) {
            listener.onLocationUpdated(defaultLocation);
        }
        canGetUpdates = false;
        this.provider = provider;
    }


}
