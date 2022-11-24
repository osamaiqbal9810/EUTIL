package com.app.ps19.hosapp;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageButton;
import android.widget.Spinner;
import android.widget.TextView;

import com.app.ps19.hosapp.Shared.Globals;
import com.app.ps19.hosapp.Shared.ListMap;
import com.app.ps19.hosapp.classes.DUnit;
import com.app.ps19.hosapp.classes.LatLong;
import com.app.ps19.hosapp.classes.Units;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import static com.app.ps19.hosapp.Shared.ListMap.LIST_CATEGORY;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link UnitsFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link UnitsFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class UnitsFragment extends Fragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    private SpinAdapter typeAdapter;
    //ArrayAdapter<String> typeAdapter;
    private ArrayList<String> _assetTypeList = new ArrayList<>();
    JSONObject joReader;
    Context _context;
    Spinner spAsset;
    TextView tvInstructions;
    GPSTracker gps;
    TextView tvUnit;
    public static final String ASSET_TYPE_ALL_TXT = "All";
    //ImageButton ibtUnitList;
ImageButton ibtUnitListMap;
    public ArrayList<DUnit> spValues;

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;

    public UnitsFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment UnitsFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static UnitsFragment newInstance(String param1, String param2) {
        UnitsFragment fragment = new UnitsFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Globals.defectCodeList = null;
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
        for (Units unit: Globals.selectedTask.getWholeUnitList()){
            _assetTypeList.add(unit.getAssetType());
        }
        ListMap.loadList(LIST_CATEGORY);
        try {
            Globals.selectedReportType = _assetTypeList.get(0);
            //Globals.selectedUnit = Globals.selectedTask.getWholeUnitList().get(0);
        } catch (Exception e) {
            e.printStackTrace();
        }
        gps = new GPSTracker(getContext());
    }

    @Override
    public View onCreateView(LayoutInflater inflater, final ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        final View rootView = inflater.inflate(R.layout.fragment_units, container, false);
        tvInstructions = rootView.findViewById(R.id.tvInstructions);
        //spAsset = (Spinner) rootView.findViewById(R.id.spAssetTypes);
        //ibtUnitList = (ImageButton) rootView.findViewById(R.id.ib_unit_list);
        //ibtUnitListMap = (ImageButton) rootView.findViewById(R.id.ib_unit_list_map);

        _context = rootView.getContext();
        tvUnit = (TextView) rootView.findViewById(R.id.tvUnitTitle);
        tvUnit.setText(Globals.selectedTask.getTitle());


        //_assetTypeList = ListMap.getList(LIST_CATEGORY);
       // populateTypeSpinner();

        if(Globals.selectedUnit != null){
            updateInstructions();
        }
        /*joReader = Globals.selectedUnit.getJoFormData();
        try {
            String instructionText = joReader.getString("instructions");
            tvInstructions.setText(instructionText);
        } catch (JSONException e) {
            e.printStackTrace();
        }*/
        /*ibtUnitList.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(_context, UnitSelectionActivity.class);
                //Intent intent = new Intent(TaskActivity.this, TaskDetailActivity.class);
                //Intent intent=new Intent(_context,AssetMapsActivity.class);
                if(gps.canGetLocation()){
                    startActivityForResult(intent, 1);
                } else {
                    gps.showSettingsAlert();
                }
            }});*/
        /*ibtUnitListMap.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent=new Intent(_context,AssetMapsActivity.class);
                if(gps.canGetLocation()){
                    startActivityForResult(intent, 1);
                } else {
                    gps.showSettingsAlert();
                }


            }
        });*/
        ((IssuesActivity)getActivity()).setFragmentRefreshUnitListener(new IssuesActivity.FragmentRefreshUnitListener() {
            @Override
            public void onRefresh() {

                // Refresh Your Fragment
                if(Globals.selectedUnit != null){
                    updateInstructions();
                }
            }
        });

        return rootView;
    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {

        if (requestCode == 1) {
            if(resultCode == Activity.RESULT_OK){
                String result=data.getStringExtra("result");
                if(result.equals("selected")){
                    updateInstructions();
                        /*// find your fragment
                        FormFragment f = (FormFragment) getActivity().getSupportFragmentManager().findFragmentByTag(getFragmentTag(1));
                        // update the list view
                        f.refreshView();*/
                    Fragment frg = null;
                    Fragment frgRpt = null;
                    frg = getActivity().getSupportFragmentManager().findFragmentByTag(getFragmentTag(1));
                    frgRpt = getActivity().getSupportFragmentManager().findFragmentByTag(getFragmentTag(2));
                    final FragmentTransaction ft = getActivity().getSupportFragmentManager().beginTransaction();
                    if(frg!=null){
                        ft.detach(frg);
                        ft.attach(frg);
                    }
                    for(int i = 0; i < spValues.size(); i++) {
                        if(spValues.get(i).getUnit().getDescription().equals(Globals.selectedDUnit.getUnit().getDescription())){
                            spAsset.setSelection(i);
                        }
                    }
                }
            }
            if (resultCode == Activity.RESULT_CANCELED) {
                //Write your code if there's no result
            }
        }
    }//onActivityResult

    public void updateInstructions() {
        try {
            joReader = Globals.selectedUnit.getJoFormData();
            if (joReader.toString().equals("{}")) {
                tvInstructions.setText("");
            } else {
                String instructionText = joReader.getString("inspectionInstructions");
                tvInstructions.setText(instructionText);
                // For Defect Code
                JSONArray jaDefectCodes = joReader.optJSONArray("defectCodes");
                ArrayList<String> list = new ArrayList<String>();
                if(jaDefectCodes!=null){
                    for(int i = 0; i < jaDefectCodes.length(); i++){
                        list.add(jaDefectCodes.getString(i));
                    }
                }
                Globals.defectCodeList = list;
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    public void populateTypeSpinner() {
        //_assetTypeList.add(0, ASSET_TYPE_ALL_TXT);
        if (gps.canGetLocation()) {
            LatLong location = new LatLong(Double.toString(gps.getLatitude()), Double.toString(gps.getLongitude()));
            spValues = Globals.selectedTask.getUnitList(location.getLatLng());
            typeAdapter = new SpinAdapter(_context, android.R.layout.simple_spinner_item, spValues);
        } else {
            String[] locStartArray = Globals.selectedTask.getStartLocation().split(",");
            LatLong _location = new LatLong(locStartArray[0], locStartArray[1]);
            spValues = Globals.selectedTask.getUnitList(_location.getLatLng());
            typeAdapter = new SpinAdapter(_context, android.R.layout.simple_spinner_item, spValues);
        }

        //typeAdapter = new ArrayAdapter<String>(_context, android.R.layout.simple_spinner_item, _assetTypeList);
        typeAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spAsset.setAdapter(typeAdapter);
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

    /**
     * Gets the fragment tag of a fragment at a specific position in the viewpager.
     *
     * @param pos the pos
     * @return the fragment tag
     */
    public String getFragmentTag(int pos) {
        return "android:switcher:" + R.id.container + ":" + pos;
    }

    public class SpinAdapter extends ArrayAdapter<DUnit> {

        // Your sent context
        private Context context;
        // Your custom values for the spinner (User)
        private ArrayList<DUnit> values;

        public SpinAdapter(Context context, int textViewResourceId,
                           ArrayList<DUnit> values) {
            super(context, textViewResourceId, values);
            this.context = context;
            this.values = values;
        }

        @Override
        public int getCount() {
            return values.size();
        }

        @Override
        public DUnit getItem(int position) {
            return values.get(position);
        }
        @Override
        public long getItemId(int position) {
            return position;
        }


        // And the "magic" goes here
        // This is for the "passive" state of the spinner
        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            // I created a dynamic TextView here, but you can reference your own  custom layout for each spinner item
            TextView label = (TextView) super.getView(position, convertView, parent);
            label.setTextColor(Color.BLACK);
            // Then you can get the current item using the values array (Users array) and the current position
            // You can NOW reference each method you has created in your bean object (User class)
            String strDistance = "";
            if(values.get(position).getDistance() >= 0){
                if(values.get(position).getDistance() > 1000){
                    Double kmValue = values.get(position).getDistance()/1000;
                    kmValue = Math.round(kmValue * 100.0) / 100.0;
                    strDistance = " [ " + kmValue + "km ]";
                } else {
                    strDistance = " [ " + values.get(position).getDistance() + "m ]";
                }

            }
            label.setText(values.get(position).getUnit().getDescription() + strDistance);
            //label.setText(values.get(position).getAssetType());

            // And finally return your dynamic (or custom) view for each spinner item
            return label;
        }

        // And here is when the "chooser" is popped up
        // Normally is the same view, but you can customize it if you want
        @Override
        public View getDropDownView(int position, View convertView,
                                    ViewGroup parent) {
            TextView label = (TextView) super.getDropDownView(position, convertView, parent);
            label.setTextColor(Color.BLACK);
            String strDistance = "";
            if(values.get(position).getDistance() >= 0){
                if(values.get(position).getDistance() > 1000){
                    Double kmValue = values.get(position).getDistance()/1000;
                    kmValue = Math.round(kmValue * 100.0) / 100.0;
                    strDistance = " [ " + kmValue + "km ]";
                } else {
                    strDistance = " [ " + values.get(position).getDistance() + "m ]";
                }

            }
            label.setText(values.get(position).getUnit().getDescription() + strDistance);
            //label.setText(values.get(position).getAssetType());
            return label;
        }
    }
}
