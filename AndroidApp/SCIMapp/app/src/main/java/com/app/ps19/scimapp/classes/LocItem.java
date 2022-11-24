package com.app.ps19.scimapp.classes;

import com.google.android.gms.maps.model.LatLng;
import com.google.maps.android.clustering.ClusterItem;

public class LocItem implements ClusterItem {
    private final LatLng mPosition;
    private String mTitle;
    private String mSnippet;

    public String getName() {
        return mName;
    }

    public void setName(String name) {
        this.mName = name;
    }

    private String mName;

    public DUnit getmTag() {
        return mTag;
    }

    public void setmTag(DUnit mTag) {
        this.mTag = mTag;
    }

    private DUnit mTag;

    public LocItem(double lat, double lng) {
        mPosition = new LatLng(lat, lng);
    }

    public LocItem(double lat, double lng, String title, String snippet, DUnit tag, String name) {
        mPosition = new LatLng(lat, lng);
        mTitle = title;
        mSnippet = snippet;
        mTag = tag;
        mName = name;
    }

    @Override
    public LatLng getPosition() {
        return mPosition;
    }

    @Override
    public String getTitle() {
        return mTitle;
    }

    @Override
    public String getSnippet() {
        return mSnippet;
    }
}