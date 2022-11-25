package com.app.ps19.scimapp.geofencing.Interface;

import com.app.ps19.scimapp.geofencing.utils.TransitionGeofence;

public interface OnGeofencingTransitionListener {
    void onGeofenceTransition(TransitionGeofence transitionGeofence);
}