package com.app.ps19.tipsapp.geofencing.utils;

import com.app.ps19.tipsapp.geofencing.model.GeofenceModel;

import java.util.List;


public class TransitionGeofence {
    private GeofenceModel geofenceModel;
    private List<GeofenceModel> geofenceModels;
    private int transitionType;
    private String  geofenceID;

    public TransitionGeofence(GeofenceModel geofence, int transitionType) {
        this.geofenceModel = geofence;
        this.transitionType = transitionType;
    }

    public TransitionGeofence(String actualGeofenceID , int transitionType)
    {
        this.geofenceID = actualGeofenceID;
        this.transitionType = transitionType;
    }

    public TransitionGeofence (List<GeofenceModel> models, int transitionType)
    {
        this.geofenceModels = models;
        this.transitionType = transitionType;
    }

    public List<GeofenceModel> getGeofenceModels() {return geofenceModels;}
    public GeofenceModel getGeofenceModel() {
        return geofenceModel;
    }
    public String getGeofenceID() {return geofenceID;}
    public int getTransitionType() {
        return transitionType;
    }
}
