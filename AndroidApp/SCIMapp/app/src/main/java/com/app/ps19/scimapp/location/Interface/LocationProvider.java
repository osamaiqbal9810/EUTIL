package com.app.ps19.scimapp.location.Interface;

import android.content.Context;
import android.location.Location;

import androidx.annotation.NonNull;

import com.app.ps19.scimapp.location.config.LocationParams;
import com.app.ps19.scimapp.location.providers.ProviderType;


public interface LocationProvider {

    void init(Context context, ProviderType type);

    void start(OnLocationUpdatedListener listener, LocationParams params, boolean singleUpdate);

    void stop();

    void restart(OnLocationUpdatedListener listener, LocationParams params);

    boolean canGetLocation();

    @NonNull
    Location getLocation();

    @NonNull
    Location getLastLocation();

    // The minimum distance to change Updates in meters
    float MIN_UPDATE_DISTANCE = (float) 0.1;
    // The minimum time between updates in milliseconds
    long MIN_UPDATE_TIME = 100;

    // The minimum distance to change Updates in meters
    long MEDIUM_UPDATE_DISTANCE = 1;
    // The minimum time between updates in milliseconds
    long MEDIUM_UPDATE_TIME = 500;


    // The minimum distance to change Updates in meters
    long MAX_UPDATE_DISTANCE = 5;
    // The minimum time between updates in milliseconds
    long MAX_UPDATE_TIME = 1000 * 60 * 5;


}
