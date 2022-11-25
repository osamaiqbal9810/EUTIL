package com.app.ps19.elecapp.geofencing.Interface;

import com.app.ps19.elecapp.geofencing.utils.TransitionGeofence;

public interface OnGeofencingTransitionListener {
    void onGeofenceTransition(TransitionGeofence transitionGeofence);
}