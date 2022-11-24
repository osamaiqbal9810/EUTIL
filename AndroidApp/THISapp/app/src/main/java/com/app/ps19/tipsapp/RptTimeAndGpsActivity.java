package com.app.ps19.tipsapp;

import android.app.ProgressDialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.Typeface;
import android.os.Handler;
import android.os.Message;
import androidx.fragment.app.FragmentActivity;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.classes.RptTimeAndGPS;
import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;

import java.util.ArrayList;

import static com.app.ps19.tipsapp.Shared.Globals.setLocale;

public class RptTimeAndGpsActivity extends FragmentActivity implements OnMapReadyCallback {

    private GoogleMap mMap;
    private RptTimeAndGPS rptTimeAndGPS;
    private Context mContext;
    ProgressDialog progressDialog;
    Handler msgHandler;
    public RptTimeAndGPS getRptTimeAndGPS(){
        return  rptTimeAndGPS;
    }
    public void setRptTimeAndGPS(RptTimeAndGPS rptTimeAndGPS){
        this.rptTimeAndGPS=rptTimeAndGPS;
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setLocale(this);
        setContentView(R.layout.activity_rpt_time_and_gps);
        mContext=this;
        msgHandler=new Handler(){
            @Override
            public void handleMessage(Message msg) {
                progressDialog.dismiss();
                super.handleMessage(msg);
            }
        };
        progressDialog= new ProgressDialog(this);
        progressDialog.setTitle(getString(R.string.please_wait));
        progressDialog.setMessage(getString(R.string.report_loading));
        progressDialog.setCancelable(false);
        progressDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
        progressDialog.show();

        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        //rptTimeAndGPS=new RptTimeAndGPS();
        rptTimeAndGPS=Globals.rptTimeAndGPS;
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);

    }
    /**
     * Manipulates the map once available.
     * This callback is triggered when the map is ready to be used.
     * This is where we can add markers or lines, add listeners or move the camera. In this case,
     * we just add a marker near Sydney, Australia.
     * If Google Play services is not installed on the device, the user will be prompted to install
     * it inside the SupportMapFragment. This method will only be triggered once the user has
     * installed Google Play services and returned to the app.
     */
    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
        //mMap.setMapType(GoogleMap.MAP_TYPE_SATELLITE);
        mMap.setInfoWindowAdapter(new GoogleMap.InfoWindowAdapter() {

            @Override
            public View getInfoWindow(Marker arg0) {
                return null;
            }

            @Override
            public View getInfoContents(Marker marker) {

                LinearLayout info = new LinearLayout(mContext);
                info.setOrientation(LinearLayout.VERTICAL);

                TextView title = new TextView(mContext);
                title.setTextColor(Color.BLACK);
                title.setGravity(Gravity.CENTER);
                title.setTypeface(null, Typeface.BOLD);
                title.setText(marker.getTitle());

                TextView snippet = new TextView(mContext);
                snippet.setTextColor(Color.GRAY);
                snippet.setText(marker.getSnippet());

                info.addView(title);
                info.addView(snippet);

                return info;
            }
        });
        int counter=0;
        // Add a marker in Sydney and move the camera
        /*
        LatLng sydney = new LatLng(-34, 151);
        mMap.addMarker(new MarkerOptions().position(sydney).title("Marker in Sydney"));
        mMap.moveCamera(CameraUpdateFactory.newLatLng(sydney));
        */
        //
        LatLngBounds.Builder builder = new LatLngBounds.Builder();
        LatLng dayStart=null;
        ArrayList<RptTimeAndGPS.TimeEvent> eventArrayList =rptTimeAndGPS.getEventArrayList();
        for(RptTimeAndGPS.TimeEvent timeEvent: eventArrayList){
            try {
                LatLng event1 = new LatLng(Double.parseDouble(timeEvent.latitude), Double.parseDouble(timeEvent.longitude));
                if(dayStart==null){
                    dayStart=event1;
                }
            /*
            MarkerOptions markerOptions=new MarkerOptions();
            markerOptions.position(event1).title(timeEvent.timeText);
            markerOptions.draggable(false);
            markerOptions.snippet(timeEvent.description + "\n" + timeEvent.status );
            Marker marker=mMap.addMarker(markerOptions);
            */
                mMap.addMarker(new MarkerOptions().position(event1).title(timeEvent.timeText)
                        .snippet(timeEvent.description + "\n" + timeEvent.status +"\n"+getString(R.string.date)+": " + timeEvent.dateText )
                        .icon(BitmapDescriptorFactory.defaultMarker(getIconColor(timeEvent.eventType))));
                builder.include(event1);
                counter++;
            } catch (NumberFormatException e) {
                e.printStackTrace();
            }
        }
        msgHandler.sendEmptyMessage(0);
        if(dayStart!=null){
            LatLngBounds bounds = builder.build();
            int padding = 50; // offset from edges of the map in pixels
            CameraUpdate cu = CameraUpdateFactory.newLatLngBounds(bounds, padding);
            //mMap.moveCamera(CameraUpdateFactory.newLatLng(dayStart));
            mMap.animateCamera(cu);
        }
    }
    private float getIconColor(Globals.TimeEventType timeEventType){
        float retColor = BitmapDescriptorFactory.HUE_RED;

        switch (timeEventType){
            case teDayStart:
                retColor=BitmapDescriptorFactory.HUE_GREEN;
                break;
            case teDayClosed:
                retColor = BitmapDescriptorFactory.HUE_GREEN;
                break;
            case teIssuePosted:
                retColor = BitmapDescriptorFactory.HUE_BLUE;
                break;

        }
        return retColor;

    }
}
