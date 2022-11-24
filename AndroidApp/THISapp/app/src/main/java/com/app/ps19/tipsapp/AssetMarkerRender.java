package com.app.ps19.tipsapp;

import android.content.Context;

import com.app.ps19.tipsapp.classes.LocItem;
import com.google.android.gms.maps.GoogleMap;
import com.google.maps.android.clustering.Cluster;
import com.google.maps.android.clustering.ClusterManager;
import com.google.maps.android.clustering.view.DefaultClusterRenderer;
import com.google.maps.android.ui.IconGenerator;

public class AssetMarkerRender extends DefaultClusterRenderer<LocItem> {
    private final Context mContext;
    private final IconGenerator mClusterIconGenerator;/* = new IconGenerator(getApplicationContext());*/
    public AssetMarkerRender(Context context, GoogleMap map, ClusterManager clusterManager) {
        super(context, map, clusterManager);
        mContext = context;
        mClusterIconGenerator = new IconGenerator(mContext);
    }
   /* @Override
    protected void onBeforeClusterItemRendered(LocItem item, MarkerOptions markerOptions) {
        BitmapDescriptor markerDescriptor = BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_AZURE);

        markerOptions.icon(markerDescriptor);
        *//*Bitmap venueCircle = BitmapFactory.decodeResource(mContext.getResources(), R.drawable.asset_4);
        markerOptions.icon(BitmapDescriptorFactory.fromBitmap(venueCircle));*//*
    }
    @Override
    protected void onBeforeClusterRendered(Cluster<LocItem> cluster, MarkerOptions markerOptions) {
        *//*Bitmap venueCircle = BitmapFactory.decodeResource(mContext.getResources(), R.drawable.circle);
        markerOptions.icon(BitmapDescriptorFactory.fromBitmap(venueCircle));*//*
        final Drawable clusterIcon = mContext.getResources().getDrawable(R.drawable.ic_lens_black_24dp);
        clusterIcon.setColorFilter(mContext.getResources().getColor(R.color.action_bar_background), PorterDuff.Mode.SRC_ATOP);

        mClusterIconGenerator.setBackground(clusterIcon);

        //modify padding for one or two digit numbers
        if (cluster.getSize() < 10) {
            mClusterIconGenerator.setContentPadding(40, 10, 0, 0);
        }
        else {
            mClusterIconGenerator.setContentPadding(10, 10, 0, 0);
        }

        Bitmap icon = mClusterIconGenerator.makeIcon(String.valueOf(cluster.getSize()));
        markerOptions.icon(BitmapDescriptorFactory.fromBitmap(icon));

    }*/

    @Override
    protected boolean shouldRenderAsCluster(Cluster<LocItem> cluster){
        return cluster.getSize() > 1;
    }


}
