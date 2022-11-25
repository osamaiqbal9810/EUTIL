package com.app.ps19.scimapp.geofencing.Interface;
import android.content.Context;

import com.app.ps19.scimapp.geofencing.model.GeofenceModel;

import java.util.List;


public interface IGeofencingProvider {
    void init(Context context);

    void start(OnGeofencingTransitionListener listener);
    void stop();

    void addGeofence(GeofenceModel geofence);
    void addGeofences(List<GeofenceModel> geofenceList);

    void removeGeofences(List<String> geofenceIds);
    void removeGeofence(String geofenceId);
}
