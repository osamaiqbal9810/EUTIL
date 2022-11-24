package com.app.ps19.tipsapp.geofencing.model;

import com.google.android.gms.location.Geofence;

public class GeofenceModel {
    private String requestId;
    private double latitude;
    private double longitude;
    private float radius;
    private long expiration;
    private int transition;
    private int loiteringDelay;
    private int responsivensess;

    private GeofenceModel(String id, double latitude, double longitude,
                          float radius, long expiration, int transition,
                          int loiteringDelay, int responsivensess) {
        this.requestId = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.radius = radius;
        this.expiration = expiration;
        this.transition = transition;
        this.loiteringDelay = loiteringDelay;
        this.responsivensess = responsivensess;
    }

    public String getRequestId() {
        return requestId;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public float getRadius() {
        return radius;
    }

    public long getExpiration() {
        return expiration;
    }

    public int getTransition() {
        return transition;
    }

    public int getLoiteringDelay() {
        return loiteringDelay;
    }

    public Geofence toGeofence() {
        return new Geofence.Builder()
                .setCircularRegion(latitude, longitude, radius)
                .setExpirationDuration(expiration)
                .setRequestId(requestId)
                .setTransitionTypes(Geofence.GEOFENCE_TRANSITION_ENTER |
                        Geofence.GEOFENCE_TRANSITION_EXIT |
                        Geofence.GEOFENCE_TRANSITION_DWELL)
                .setNotificationResponsiveness(responsivensess) //500 MilliSec
                .setLoiteringDelay(loiteringDelay)
                .build();
    }

    public static class Builder {
        private String requestId;
        private int responsivensess;
        private double latitude;
        private double longitude;
        private float radius;
        private long expiration;
        private int transition;
        private int loiteringDelay;

        public Builder(String id) {
            this.requestId = id;
        }

        public Builder setLatitude(double latitude) {
            this.latitude = latitude;
            return this;
        }

        public Builder setLongitude(double longitude) {
            this.longitude = longitude;
            return this;
        }

        public Builder setRadius(float radius) {
            this.radius = radius;
            return this;
        }

        public Builder setExpiration(long expiration) {
            this.expiration = expiration;
            return this;
        }

        public Builder setTransition(int transition) {
            this.transition = transition;
            return this;
        }
        public Builder setNotificationResponseTimeMS(int responsiveness)
        {
            this.responsivensess = responsiveness;
            return this;
        }


        public Builder setLoiteringDelay(int loiteringDelay) {
            this.loiteringDelay = loiteringDelay;
            return this;
        }

        public GeofenceModel build() {
            return new GeofenceModel(requestId, latitude, longitude,
                    radius, expiration, transition,
                    loiteringDelay,responsivensess);
        }
    }
}