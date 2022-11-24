package com.app.ps19.tipsapp.geofencing.Interface;

import com.app.ps19.tipsapp.geofencing.utils.TransitionGeofence;

public interface OnGeofencingTransitionListener {
    void onGeofenceTransition(TransitionGeofence transitionGeofence);
}