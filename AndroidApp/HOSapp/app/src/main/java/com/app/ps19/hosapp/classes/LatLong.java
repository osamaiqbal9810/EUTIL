package com.app.ps19.hosapp.classes;

import com.app.ps19.hosapp.Shared.Utilities;
import com.google.android.gms.maps.model.LatLng;
import com.koushikdutta.ion.builder.Builders;

public class LatLong {
    private String lat="";
    private String lon="";
    LatLng latLng=null;

    public LatLong(String lat, String lon){
        this.lat=lat;
        this.lon=lon;
        this.latLng=new LatLng(Utilities.parseDoubleWithLimit(lat),Utilities.parseDoubleWithLimit(lon));
    }
    public LatLng getLatLng(){
        return  this.latLng;
    }
    public void setLatLng(LatLng latLng){
        this.latLng=latLng;
    }
    public String getLat() {
        return lat;
    }

    public void setLat(String lat) {
        this.lat = lat;
    }

    public String getLon() {
        return lon;
    }

    public void setLon(String lon) {
        this.lon = lon;
    }
}