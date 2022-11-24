package com.app.ps19.scimapp;

import android.content.Context;
import android.location.Location;
import android.net.Uri;
import android.os.Bundle;
import android.os.PowerManager;
import androidx.fragment.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.view.animation.TranslateAnimation;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.Shared.LocationChangedInterface;
import com.app.ps19.scimapp.classes.DUnit;
import com.app.ps19.scimapp.classes.LatLong;

import java.util.ArrayList;
import java.util.Iterator;
import static com.app.ps19.scimapp.Shared.Globals.CURRENT_LOCATION;
import static com.app.ps19.scimapp.Shared.Utilities.getLocationDescription;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link AssetFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link AssetFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class AssetFragment extends Fragment implements LocationChangedInterface {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    // From unit selection activity
    ListView lvStaticUnits;
    ListView lvSortedUnits;
    GPSTracker gps;
    uSelectionAdapter selectionSortedAdt;
    uSelectionAdapter selectionStaticAdt;
    Double preLongitude;
    Double preLatitude;
    boolean isUp;
    RelativeLayout rlStaticList;
    RelativeLayout rlSortedList;
    ImageView ivStaticListIndicator;
    ImageView ivSortedListIndicator;
    ArrayList<DUnit> staticList;
    ArrayList<DUnit> sortedList;
    protected PowerManager.WakeLock mWakeLock;
    public PowerManager pm ;
    View rootView;
    TextView tvStartLoc;
    TextView tvEndLoc;

    private OnFragmentInteractionListener mListener;

    public AssetFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment AssetFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static AssetFragment newInstance(String param1, String param2) {
        AssetFragment fragment = new AssetFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
        pm = (PowerManager) getActivity().getSystemService(getActivity().POWER_SERVICE);
        getActivity().getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        screenWakeLock();
        gps = new GPSTracker(getContext());
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        rootView = inflater.inflate(R.layout.fragment_asset, container, false);

        lvStaticUnits = (ListView) rootView.findViewById(R.id.fm_lv_static_units);
        lvSortedUnits = (ListView) rootView.findViewById(R.id.fm_lv_sorted_units);
        tvStartLoc = (TextView) rootView.findViewById(R.id.tv_task_start);
        tvEndLoc = (TextView) rootView.findViewById(R.id.tv_task_end);
        /*tvLocation = (TextView) findViewById(R.id.tv_unit_your_location);
        tvLatitude = (TextView) findViewById(R.id.unit_loc_lat);
        tvLongitude = (TextView) findViewById(R.id.unit_loc_long);*/
        rlStaticList = (RelativeLayout) rootView.findViewById(R.id.fm_rl_static_list);
        ivStaticListIndicator = (ImageView) rootView.findViewById(R.id.fm_iv_list_static_indicator);
        rlSortedList = (RelativeLayout) rootView.findViewById(R.id.fm_rl_sorted_list);
        ivSortedListIndicator = (ImageView) rootView.findViewById(R.id.fm_iv_list_sorted_indicator);

        /*imgCompass=(ImageView)findViewById(R.id.iv_unit_person);
        txtDegrees=(TextView)findViewById(R.id.tv_location_title);
        sensorManager=(SensorManager)getSystemService(SENSOR_SERVICE);*/
        // Setting Tags
        //imgCompass.setImageResource(R.drawable.unit_person);
        //imgCompass.setTag(R.drawable.unit_person);


        //setTitle(R.string.title_activity_select_asset);

        String[] startLoc = getLocationDescription(getContext(),
                Globals.selectedTask.getStartLoc().getGeometry().getCoordinates().get(0).latitude,
                Globals.selectedTask.getStartLoc().getGeometry().getCoordinates().get(0).longitude).split(",");
        if(startLoc.length != 0){
            tvStartLoc.setText(startLoc[0]);
        }
        /*tvStartLoc.setText(getLocationDescription(getContext(),
                Globals.selectedTask.getStartLoc().getGeometry().getCoordinates().get(0).latitude,
                Globals.selectedTask.getStartLoc().getGeometry().getCoordinates().get(0).longitude));*/

        String[] endLoc = getLocationDescription(getContext(), Globals.selectedTask.getEndLoc().getGeometry().getCoordinates().get(0).latitude, Globals.selectedTask.getEndLoc().getGeometry().getCoordinates().get(0).longitude).split(",");
        if(endLoc.length != 0){
            tvEndLoc.setText(endLoc[0]);
        }/*
        tvEndLoc.setText(getLocationDescription(getContext(),
                Globals.selectedTask.getEndLoc().getGeometry().getCoordinates().get(0).latitude,
                Globals.selectedTask.getEndLoc().getGeometry().getCoordinates().get(0).longitude));*/

        rlSortedList.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v){
                if(lvSortedUnits.getVisibility() == View.VISIBLE){
                    ivSortedListIndicator.setImageResource(R.drawable.ic_expand_less_white_24dp);
                    slideDown(lvSortedUnits);
                } else {
                    ivSortedListIndicator.setImageResource(R.drawable.ic_expand_more_white_24dp);
                    slideUp(lvSortedUnits);
                }
            }
        });
        rlStaticList.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v){
                if(lvStaticUnits.getVisibility() == View.VISIBLE){
                    ivStaticListIndicator.setImageResource(R.drawable.ic_expand_less_white_24dp);
                    slideDown(lvStaticUnits);
                } else {
                    ivStaticListIndicator.setImageResource(R.drawable.ic_expand_more_white_24dp);
                    slideUp(lvStaticUnits);
                }
            }
        });

        if (gps.canGetLocation()) {
            preLongitude = gps.getLongitude();
            preLatitude = gps.getLatitude();

            //tvLatitude.setText(Double.toString(gps.getLatitude()));
            //tvLongitude.setText(Double.toString(gps.getLongitude()));
            CURRENT_LOCATION = String.valueOf(gps.getLatitude()) + "," + String.valueOf(gps.getLongitude());

            LatLong location = new LatLong(Double.toString(preLatitude), Double.toString(preLongitude));
            //tvLocation.setText(getLocationDescription(location, UnitSelectionActivity.this));
            staticList = Globals.selectedTask.getUnitList(location.getLatLng());
            for (Iterator<DUnit> it = staticList.iterator(); it.hasNext();) {
                //if (it.next().getDistance()>=0) {
                //    it.remove();
                //}
                if(!it.next().isLinear()){
                    it.remove();
                }
            }
            sortedList = Globals.selectedTask.getUnitList(location.getLatLng());
            for (Iterator<DUnit> it = sortedList.iterator(); it.hasNext();) {
                //if (it.next().getDistance()<0) {
                //    it.remove();
                //}
                if(it.next().isLinear()){
                    it.remove();
                }
            }
            if (staticList != null && staticList.size()>0){
                ivStaticListIndicator.setImageResource(R.drawable.ic_expand_more_white_24dp);
            }
            if (sortedList != null && sortedList.size()>0){
                ivSortedListIndicator.setImageResource(R.drawable.ic_expand_more_white_24dp);
            }
            selectionStaticAdt = new uSelectionAdapter(getActivity(), "static", staticList);
            lvStaticUnits.setAdapter(selectionStaticAdt);

            selectionSortedAdt = new uSelectionAdapter(getActivity(), "sorted", sortedList);
            lvSortedUnits.setAdapter(selectionSortedAdt);
        }

        isUp = false;

        // Inflate the layout for this fragment
        return rootView;//inflater.inflate(R.layout.fragment_asset, container, false);
    }
    public void listUpdate(String lat, String lon){
        LatLong location = new LatLong(lat, lon);
        //staticList.clear();
        staticList = Globals.selectedTask.getUnitList(location.getLatLng());
        for (Iterator<DUnit> it = staticList.iterator(); it.hasNext();) {
            //if (it.next().getDistance()>=0) {
            //    it.remove();
            // }
            if(!it.next().isLinear()){
                it.remove();
            }
        }
        //sortedList.clear();
        sortedList = Globals.selectedTask.getUnitList(location.getLatLng());
        for (Iterator<DUnit> it = sortedList.iterator(); it.hasNext();) {
            //if (it.next().getDistance()<0) {
            //    it.remove();
            //}
            if(it.next().isLinear()){
                it.remove();
            }

        }
        selectionStaticAdt.setNotifyOnChange(false); // Prevents 'clear()' from clearing/resetting the listview
        selectionStaticAdt.clear();
        selectionStaticAdt.addAll(staticList);
        selectionStaticAdt.notifyDataSetChanged();

        selectionSortedAdt.setNotifyOnChange(false); // Prevents 'clear()' from clearing/resetting the listview
        selectionSortedAdt.clear();
        selectionSortedAdt.addAll(sortedList);
        selectionSortedAdt.notifyDataSetChanged();
    }

    // slide the view from below itself to the current position
    public void slideUp(View view){
        view.setVisibility(View.VISIBLE);
        TranslateAnimation animate = new TranslateAnimation(
                0,                 // fromXDelta
                0,                 // toXDelta
                view.getHeight(),  // fromYDelta
                0);                // toYDelta
        animate.setDuration(500);
        animate.setFillAfter(true);
        view.startAnimation(animate);
    }

    // slide the view from its current position to below itself
    public void slideDown(View view){
        TranslateAnimation animate = new TranslateAnimation(
                0,                 // fromXDelta
                0,                   // toXDelta
                0,                 // fromYDelta
                view.getHeight());          // toYDelta
        animate.setDuration(500);
        animate.setFillAfter(true);
        view.startAnimation(animate);
        view.setVisibility(View.GONE);
    }
    private void screenWakeLock(){
        mWakeLock = pm.newWakeLock(PowerManager.SCREEN_DIM_WAKE_LOCK, "Unit Selection:");
        mWakeLock.acquire(30*60*1000L /*30 minutes*/);
    }
    @Override
    public void onDestroy(){
        if(mWakeLock.isHeld()){
            try {
                mWakeLock.release();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        super.onDestroy();
    }

    @Override
    public void onPause() {
        super.onPause();
        //mThreadPool.shutdownNow();
        if(mWakeLock.isHeld()){
            try {
                mWakeLock.release();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        /*try {
            sensorManager.unregisterListener(UnitSelectionActivity.this);
        } catch (Exception e) {
            e.printStackTrace();
        }*/
        //mLocationManager.pauseLocationFetching();
    }
    @Override
    public void onResume()
    {
        // TODO: Implement this method
        super.onResume();
        screenWakeLock();
        /*if(imgCompass.getTag().equals(R.drawable.compass)) {
            sensorManager.registerListener(UnitSelectionActivity.this, sensorManager.getDefaultSensor(Sensor.TYPE_ORIENTATION), SensorManager.SENSOR_DELAY_GAME);
        }*/
    }

    /*@Override
    public void onSensorChanged(SensorEvent event)
    {
        float degree=Math.round(event.values[0]);
        //txtDegrees.setText("Rotation: "+Float.toString(degree)+" degrees");
        RotateAnimation ra=new RotateAnimation(currentDegree,-degree,Animation.RELATIVE_TO_SELF,0.5f,
                Animation.RELATIVE_TO_SELF,0.5f);
        ra.setDuration(120);
        ra.setFillAfter(true);
        imgCompass.startAnimation(ra);
        currentDegree=-degree;
    }*/

    /*@Override
    public void onAccuracyChanged(Sensor p1, int p2)
    {
        // TODO: Implement this method
    }*/
    protected static String bearing(double lat1, double lon1, double lat2, double lon2){
        double longitude1 = lon1;
        double longitude2 = lon2;
        double latitude1 = Math.toRadians(lat1);
        double latitude2 = Math.toRadians(lat2);
        double longDiff= Math.toRadians(longitude2-longitude1);
        double y= Math.sin(longDiff)*Math.cos(latitude2);
        double x=Math.cos(latitude1)*Math.sin(latitude2)-Math.sin(latitude1)*Math.cos(latitude2)*Math.cos(longDiff);
        double resultDegree= (Math.toDegrees(Math.atan2(y, x))+360)%360;
        String coordNames[] = {"N","NNE", "NE","ENE","E", "ESE","SE","SSE", "S","SSW", "SW","WSW", "W","WNW", "NW","NNW", "N"};
        double directionid = Math.round(resultDegree / 22.5);
        // no of array contain 360/16=22.5
        if (directionid < 0) {
            directionid = directionid + 16;
            //no. of contains in array
        }
        String compasLoc=coordNames[(int) directionid];

        return resultDegree+" "+compasLoc;
    }

    @Override
    public void locationChanged(Location mLocation) {
        /*String location = String.valueOf(mLocation.getLatitude() + ", " + String.valueOf(mLocation.getLongitude()));
        txtDegrees.setText(location);*/

        //tvLatitude.setText(String.valueOf(mLocation.getLatitude()));
        //tvLongitude.setText(String.valueOf(mLocation.getLongitude()));
        CURRENT_LOCATION = String.valueOf(mLocation.getLatitude()) + "," + String.valueOf(mLocation.getLongitude());
        LatLong location = new LatLong(Double.toString(mLocation.getLatitude()), Double.toString(mLocation.getLongitude()));
        //tvLocation.setText(getLocationDescription(location, UnitSelectionActivity.this));
        listUpdate(String.valueOf(mLocation.getLatitude()), String.valueOf(mLocation.getLongitude()));
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof OnFragmentInteractionListener) {
            mListener = (OnFragmentInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement OnFragmentInteractionListener");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnFragmentInteractionListener {
        // TODO: Update argument type and name
        void onFragmentInteraction(Uri uri);
    }
}
