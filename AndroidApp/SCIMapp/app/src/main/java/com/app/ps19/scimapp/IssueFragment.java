package com.app.ps19.scimapp;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.location.Location;
import android.media.Image;
import android.net.Uri;
import android.os.Bundle;

import androidx.annotation.Nullable;

import com.app.ps19.scimapp.classes.Units;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import android.provider.ContactsContract;
import android.view.ContextMenu;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.app.ps19.scimapp.Shared.FragmentToActivityInterface;
import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.Shared.LocationUpdatesService;
import com.app.ps19.scimapp.classes.DUnit;
import com.app.ps19.scimapp.classes.LatLong;
import com.app.ps19.scimapp.classes.Report;
import com.app.ps19.scimapp.classes.Task;
import com.google.android.material.tabs.TabLayout;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;

import static android.app.Activity.RESULT_OK;
import static com.app.ps19.scimapp.Shared.Globals.CURRENT_LOCATION;
import static com.app.ps19.scimapp.Shared.Globals.TASK_FINISHED_STATUS;
import static com.app.ps19.scimapp.Shared.Globals.appName;
import static com.app.ps19.scimapp.Shared.Globals.selectedDUnit;
import static com.app.ps19.scimapp.Shared.Globals.selectedTask;
import static com.app.ps19.scimapp.Shared.Globals.selectedUnit;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link IssueFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link IssueFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class IssueFragment extends Fragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    ArrayList<DUnit> staticList;
    ArrayList<DUnit> sortedList;
    ArrayList<DUnit> switchList;

    private OnFragmentInteractionListener mListener;
    public static final int SECOND_ACTIVITY_REQUEST_CODE = 0;
    public static final String ASSET_TYPE_ALL_TXT = "All";
    ListView reportList;
    Context context;
    // GPSTracker class
    GPSTracker gps;
    TextView taskTitle;
    TextView taskDesc;
    TextView taskNotes;
    TextView tvAddHelp;
    reportAdapter adapter;
    Button btnInfoTables;
    LinearLayout llFixedAsset;
    LinearLayout llLinearAsset;
    LinearLayout llSwitchInspection;
    ImageButton ibFixedAsset;
    ImageButton ibLinearAsset;
    ImageButton ibSwitchInspection;
    TextView ivFixedAsset;
    TextView ivLinearAsset;
    TextView ivSwitchInspection;
    Spinner spFixedAsset;
    Spinner spLinearAsset;
    Spinner spSwitchInspection;
    LinearLayout llLinearAssetContainer;
    LinearLayout llFixedAssetContainer;
    LinearLayout llSwitchContainer;
    Location location;
    ImageView fixAssetLocationEdit;
    FragmentToActivityInterface callback;
    Task task;// = new Task(context);
    // The BroadcastReceiver used to listen from broadcasts from the service.
    private MyReceiver myReceiver;
    assetAdapter staticAdapter;
    assetAdapter sortedAdapter;
    assetAdapter switchAdapter;
    protected FragmentActivity mActivity;
    FloatingActionButton fab;
    ImageButton ibExpandList;
    boolean isListExpanded;
    TextView tvMapMode;
    public static int MAP_SELECTION_REQUEST_CODE = 110;

    private TextView mTextMessage;
    private TextView tvDefListTitle;

    public IssueFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment IssueFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static IssueFragment newInstance(String param1, String param2) {
        IssueFragment fragment = new IssueFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        myReceiver = new MyReceiver();
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public void onActivityCreated(@Nullable Bundle outState) {
        super.onActivityCreated(outState);
        callback = (FragmentToActivityInterface) getActivity();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        final View rootView = inflater.inflate(R.layout.fragment_issues_new, container, false);
        taskTitle = (TextView) rootView.findViewById(R.id.taskTitleTxt);
        taskDesc = (TextView) rootView.findViewById(R.id.taskDescTxt);
        taskNotes = (TextView) rootView.findViewById(R.id.taskNotesTxt);
        tvAddHelp = (TextView) rootView.findViewById(R.id.tvAddIssueHelp);
        btnInfoTables = (Button) rootView.findViewById(R.id.btnInfoTables);

        tvDefListTitle = (TextView) rootView.findViewById(R.id.tv_def_list_title);

        llFixedAsset = (LinearLayout) rootView.findViewById(R.id.ll_fixed_asset);
        llLinearAsset = (LinearLayout) rootView.findViewById(R.id.ll_linear_asset);
        llSwitchInspection = (LinearLayout) rootView.findViewById(R.id.ll_switch_insp);
        llFixedAssetContainer = (LinearLayout) rootView.findViewById(R.id.ll_fixed_asset_container);
        llLinearAssetContainer = (LinearLayout) rootView.findViewById(R.id.ll_linear_asset_container);
        llSwitchContainer = (LinearLayout) rootView.findViewById(R.id.ll_switch_insp_container);
        ibFixedAsset = (ImageButton) rootView.findViewById(R.id.ib_fixed_asset);
        ibLinearAsset = (ImageButton) rootView.findViewById(R.id.ib_linear_asset);
        ibSwitchInspection = (ImageButton) rootView.findViewById(R.id.ib_switch_insp);
        ivFixedAsset = (TextView) rootView.findViewById(R.id.tv_fixed_asset);
        ivLinearAsset = (TextView) rootView.findViewById(R.id.tv_linear_asset);
        ivSwitchInspection = (TextView) rootView.findViewById(R.id.tv_switch_insp);
        spFixedAsset = (Spinner) rootView.findViewById(R.id.sp_fixed_asset);
        spLinearAsset = (Spinner) rootView.findViewById(R.id.sp_linear_asset);
        spSwitchInspection = (Spinner) rootView.findViewById(R.id.sp_switch_insp);
        ibExpandList = (ImageButton) rootView.findViewById(R.id.ib_defects_list_expand);
        tvMapMode = (TextView) rootView.findViewById(R.id.tv_map_mode);
        fixAssetLocationEdit=(ImageView) rootView.findViewById(R.id.fixAssetLocationEdit);
        mTextMessage = (TextView) rootView.findViewById(R.id.message);
        reportList = (ListView) rootView.findViewById(R.id.reportsList);
        fab = (FloatingActionButton) rootView.findViewById(R.id.fabAddIssue);
        context = rootView.getContext();
        task = new Task(context);
        // Setting default value to list state
        isListExpanded = false;

        tvAddHelp.setText(getString(R.string.press_add_button));
        //Hiding as not required
        tvAddHelp.setVisibility(View.GONE);

        taskTitle.setText(Globals.selectedTask.getTitle());
        taskDesc.setText(Globals.selectedTask.getDescription());
        taskNotes.setText(Globals.selectedTask.getNotes());
        //Hiding as not required to display here
        taskNotes.setVisibility(View.GONE);
        //setAdapter(Globals.selectedUnit.getUnitId());
        String[] _curLocation = CURRENT_LOCATION.split(",");
        String latitude = "0.0";
        String longitude = "0.0";
        LatLong location = new LatLong("0", "0");
        try {
            location = new LatLong(_curLocation[0], _curLocation[1]);
        } catch (Exception e) {
            e.printStackTrace();
        }
        String unitId = "";
        if (selectedUnit != null) {
            unitId = selectedUnit.getUnitId();
        }
        /*if (unitId.equals(ASSET_TYPE_ALL_TXT)) {
            adapter = new reportAdapter(getActivity(), Globals.selectedTask.getReportList(), unitId);
        } else {
            adapter = new reportAdapter(getActivity(), Globals.selectedTask.getFilteredReports(unitId), unitId);
        }*/
        adapter = new reportAdapter(getActivity(), Globals.selectedTask.getReportList(), unitId);
        reportList.setAdapter(adapter);

        llLinearAsset.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(staticList.size() != 0){
                    linearSelection();
                }
            }
        });
        llFixedAsset.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(sortedList.size() != 0){
                    fixedSelection();
                }
            }
        });
        llSwitchInspection.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(switchList.size() != 0){
                    switchSelection();
                }
            }
        });

        /*btnInfoTables.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent=new Intent(getActivity(),infoTableActivity.class);
                getActivity().startActivity(intent);
            }
        });*/
        staticList = Globals.selectedTask.getUnitList(location.getLatLng());
        for (Iterator<DUnit> it = staticList.iterator(); it.hasNext(); ) {
            //if (it.next().getDistance()>=0) {
            //    it.remove();
            //}
            if (!it.next().isLinear()) {
                it.remove();
            }
        }
        sortedList = Globals.selectedTask.getUnitList(location.getLatLng());
        for (Iterator<DUnit> it = sortedList.iterator(); it.hasNext(); ) {
            if (it.next().isLinear()) {
                it.remove();
            }
        }
        if(switchList == null){
            switchList = new ArrayList<>();
        }
        switchList.clear();
        for (DUnit unit : sortedList) {
            if(unit.getUnit().getAssetType().equals("Switch") || unit.getUnit().getAssetType().equals("switch")){
                switchList.add(unit);
            }
        }
        staticAdapter = new assetAdapter((Activity) context, "static", staticList);
        spLinearAsset.setAdapter(staticAdapter);
        sortedAdapter = new assetAdapter((Activity) context, "sorted", sortedList);
        spFixedAsset.setAdapter(sortedAdapter);
        switchAdapter = new assetAdapter((Activity) context, "sorted", switchList);
        spSwitchInspection.setAdapter(switchAdapter);
        if(staticList.size() ==  0){
            spLinearAsset.setEnabled(false);
            ibLinearAsset.setEnabled(false);
        }
        if(sortedList.size() == 0){
            spFixedAsset.setEnabled(false);
            ibFixedAsset.setEnabled(false);
        } else {
            spFixedAsset.setEnabled(true);
            ibFixedAsset.setEnabled(true);
        }

        if(switchList.size() == 0){
            spSwitchInspection.setEnabled(false);
            ibSwitchInspection.setEnabled(false);
        }
        ibExpandList.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (isListExpanded) {
                    collapseList();
                } else {
                    expandList();
                }
            }
        });
        tvMapMode.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(getActivity(), AssetMapsActivity.class);
                getActivity().startActivityForResult(intent, MAP_SELECTION_REQUEST_CODE);
            }
        });
        ibFixedAsset.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(sortedList.size() != 0){
                    fixedSelection();
                    ibFixedAsset.setEnabled(false);
                    onCreateIssueClick();
                    //performLongClick();
                    //Toast.makeText(context,"Short click ", Toast.LENGTH_SHORT).show();
                }
            }
        });
        ibLinearAsset.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(staticList.size() != 0){
                    ibLinearAsset.setEnabled(false);
                    linearSelection();
                    onCreateIssueClick();
                }
            }
        });
        ibSwitchInspection.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(switchList.size() != 0){
                    ibSwitchInspection.setEnabled(false);
                    switchSelection();
                    onCreateInspectClick();
                }
            }
        });
        fab.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor(mParam2)));

        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                onCreateIssueClick();
            }
        });
        fab.hide();
        spLinearAsset.setSelection(0, false);
        spFixedAsset.setSelection(0, false);
        spSwitchInspection.setSelection(0, false);
        //registerForContextMenu(ibFixedAsset);
        if(sortedList.size() == 0){
            fixAssetLocationEdit.setVisibility(View.GONE);
        } else {
            fixAssetLocationEdit.setVisibility(View.VISIBLE);
        }
        fixAssetLocationEdit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(sortedList.size() == 0){
                    Toast.makeText(getActivity(), "No fixed asset available to continue.", Toast.LENGTH_SHORT).show();
                } else {
                    fixedSelection();
                    Intent intent = new Intent(getActivity(), UnitCordsAdjActivity.class);
                    getActivity().startActivity(intent);
                }
            }
        });
        spLinearAsset.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int pos, long l) {
                linearSelection();
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {

            }
        });
        spFixedAsset.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int pos, long l) {
                fixedSelection();
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {

            }
        });
        spSwitchInspection.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int pos, long l) {
                switchSelection();
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {

            }
        });
        reportList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            public void onItemClick(AdapterView<?> parent, View view,
                                    int position, long id) {
                position = selectedTask.getReportList().size() - 1 - position;
                Globals.selectedReportIndex = position;
               /* if (Globals.selectedReportType.equals(ASSET_TYPE_ALL_TXT)) {
                    Globals.selectedReport = Globals.selectedTask.getReportList().get(position);
                } else {
                   //Globals.selectedReport = Globals.selectedTask.getFilteredReports(selectedUnit.getUnitId()).get(position);
                }*/
                Globals.selectedReport = Globals.selectedTask.getReportList().get(position);
                Globals.newReport = null;
                Globals.selectedCategory = Globals.selectedReportType;
               /* if (Globals.selectedTask.getStatus().equals(TASK_FINISHED_STATUS)) {
                    Intent viewMode = new Intent(context, ReportViewActivity.class);
                    startActivity(viewMode);
                } else {*/
                Intent intent = new Intent(context, ReportAddActivity.class);
                startActivityForResult(intent, SECOND_ACTIVITY_REQUEST_CODE);
                // }
            }
        });
        ((IssuesActivity) getActivity()).setFragmentRefreshIssueListener(new IssuesActivity.FragmentRefreshIssueListener() {
            @Override
            public void onRefresh() {

                // Refresh Your Fragment
                String unitId = "";
                if (selectedUnit != null) {
                    unitId = selectedUnit.getUnitId();
                }
                /*if (unitId.equals(ASSET_TYPE_ALL_TXT)) {
                    adapter = new reportAdapter(mActivity, Globals.selectedTask.getReportList(), unitId);
                } else {
                    adapter = new reportAdapter(mActivity, Globals.selectedTask.getFilteredReports(unitId), unitId);
                }*/
                // Showing all issues in list as per client requirement
                /*adapter = new reportAdapter(mActivity, Globals.selectedTask.getReportList(), unitId);
                reportList.setAdapter(adapter);
                adapter.notifyDataSetChanged();*/
                Collections.reverse(selectedTask.getReportList());
                setAdapter("");
                selectAssetItem();
            }
        });
        selectAssetItem();
        if(!Globals.isShowSwitchInspection){
            llSwitchContainer.setVisibility(View.GONE);
        }
        collapseList();
        updateView();
        if (Globals.selectedTask.getStatus().equals(TASK_FINISHED_STATUS)) {
            fab.hide(); //fab.setVisibility(View.GONE);
            tvAddHelp.setVisibility(View.GONE);
            llFixedAssetContainer.setVisibility(View.GONE);
            llLinearAssetContainer.setVisibility(View.GONE);
            llSwitchContainer.setVisibility(View.GONE);
            ibExpandList.setVisibility(View.GONE);
            tvMapMode.setVisibility(View.GONE);
        }
        return rootView;
    }
    private void updateView(){
        if(staticList.size() == 0 && appName.equals(Globals.AppName.SCIM)){
            llLinearAssetContainer.setVisibility(View.GONE);
            tvDefListTitle.setText(R.string.deficiency_title);
        } else {
            llLinearAssetContainer.setVisibility(View.VISIBLE);
        }
    }

    public void setAdapter(String type) {
        /*if (type.equals(ASSET_TYPE_ALL_TXT)) {
            adapter = new reportAdapter(getActivity(), Globals.selectedTask.getReportList(), type);
        } else {
            adapter = new reportAdapter(getActivity(), Globals.selectedTask.getFilteredReports(type), type);
        }*/
        Collections.reverse(selectedTask.getReportList());
        adapter = new reportAdapter(mActivity, Globals.selectedTask.getReportList(), type);
        reportList.setAdapter(adapter);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        // check that it is the SecondActivity with an OK result
        if (requestCode == SECOND_ACTIVITY_REQUEST_CODE) {
            setAdapter(selectedUnit.getUnitId());
            if (resultCode == RESULT_OK) {
            }
        }
        if (requestCode == MAP_SELECTION_REQUEST_CODE) {
            if (resultCode == Activity.RESULT_OK) {
                selectAssetItem();
            }
        }
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
        callback = (FragmentToActivityInterface) getActivity();
        if (context instanceof Activity) {
            mActivity = (FragmentActivity) context;
        }
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

    @Override
    public void onResume() {
        super.onResume();
        try {
            //Re-enabling buttons which were disabled on there click
            ibFixedAsset.setEnabled(true);
            ibLinearAsset.setEnabled(true);
            ibSwitchInspection.setEnabled(true);
        } catch (Exception e) {
            e.printStackTrace();
        }
        LocalBroadcastManager.getInstance(context).registerReceiver(myReceiver,
                new IntentFilter(LocationUpdatesService.ACTION_BROADCAST));
        /*if(selectedUnit!=null){
            setAdapter(selectedUnit.getUnitId());
        }*/
        adapter.notifyDataSetChanged();
    }

    @Override
    public void onPause() {
        super.onPause();
        LocalBroadcastManager.getInstance(context).unregisterReceiver(myReceiver);
        /*if(selectedUnit!=null){
            setAdapter(selectedUnit.getUnitId());
        }*/
    }

    /**
     * Receiver for broadcasts sent by {@link LocationUpdatesService}.
     */
    private class MyReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            Location mLocation = intent.getParcelableExtra(LocationUpdatesService.EXTRA_LOCATION);
            if (mLocation != null) {
                //cLocation = mLocation;
                CURRENT_LOCATION = String.valueOf(mLocation.getLatitude()) + "," + String.valueOf(mLocation.getLongitude());
                LatLong location = new LatLong(Double.toString(mLocation.getLatitude()), Double.toString(mLocation.getLongitude()));
                //tvLocation.setText(getLocationDescription(location, UnitSelectionActivity.this));
                listUpdate(String.valueOf(mLocation.getLatitude()), String.valueOf(mLocation.getLongitude()));
                /*Toast.makeText(IssuesActivity.this, Utils.getLocationText(mLocation),
                        Toast.LENGTH_SHORT).show();*/
            }
        }
    }

    public void listUpdate(String lat, String lon) {

        try {
            LatLong location = null;
            location = new LatLong(lat, lon);
            //staticList.clear();
            //TODO null check
            staticList = Globals.selectedTask.getUnitList(location.getLatLng());
            for (Iterator<DUnit> it = staticList.iterator(); it.hasNext(); ) {
                //if (it.next().getDistance()>=0) {
                //    it.remove();
                // }
                if (!it.next().isLinear()) {
                    it.remove();
                }
            }
            Collections.sort(staticList, DUnit.UnitDistanceComparator);
            //sortedList.clear();
            sortedList = Globals.selectedTask.getUnitList(location.getLatLng());
            for (Iterator<DUnit> it = sortedList.iterator(); it.hasNext(); ) {
                //if (it.next().getDistance()<0) {
                //    it.remove();
                //}
                if (it.next().isLinear()) {
                    it.remove();
                }
            }
            if(switchList == null){
                switchList = new ArrayList<>();
            }
            //switchList.clear();
            switchList = new ArrayList<>();
            for (DUnit unit : sortedList) {
                if(unit.getUnit().getAssetType().equals("Switch") || unit.getUnit().getAssetType().equals("switch")){
                    switchList.add(unit);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        try {
            staticAdapter.setNotifyOnChange(false); // Prevents 'clear()' from clearing/resetting the listview
            staticAdapter.clear();
            staticAdapter.addAll(staticList);
            staticAdapter.notifyDataSetChanged();

            sortedAdapter.setNotifyOnChange(false); // Prevents 'clear()' from clearing/resetting the listview
            sortedAdapter.clear();
            sortedAdapter.addAll(sortedList);
            sortedAdapter.notifyDataSetChanged();

            switchAdapter.setNotifyOnChange(false); // Prevents 'clear()' from clearing/resetting the listview
            switchAdapter.clear();
            switchAdapter.addAll(switchList);
            switchAdapter.notifyDataSetChanged();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void linearSelection() {
        ivLinearAsset.setCompoundDrawablesWithIntrinsicBounds(0, 0, 0, R.drawable.ic_baseline_radio_button_checked_24);
        ivFixedAsset.setCompoundDrawablesWithIntrinsicBounds(0, 0, 0, R.drawable.ic_baseline_radio_button_unchecked_24);
        ivSwitchInspection.setCompoundDrawablesWithIntrinsicBounds(0, 0, 0, R.drawable.ic_baseline_radio_button_unchecked_24);
        DUnit unit = (DUnit) spLinearAsset.getSelectedItem();
        selectedUnit = unit.getUnit();
        selectedDUnit = unit;
        refreshFragments();
    }

    private void fixedSelection() {
        ivFixedAsset.setCompoundDrawablesWithIntrinsicBounds(0, 0, 0, R.drawable.ic_baseline_radio_button_checked_24);
        ivLinearAsset.setCompoundDrawablesWithIntrinsicBounds(0, 0, 0, R.drawable.ic_baseline_radio_button_unchecked_24);
        ivSwitchInspection.setCompoundDrawablesWithIntrinsicBounds(0, 0, 0, R.drawable.ic_baseline_radio_button_unchecked_24);
        DUnit unit = (DUnit) spFixedAsset.getSelectedItem();
        selectedUnit = unit.getUnit();
        selectedDUnit = unit;
        refreshFragments();
    }
    private void switchSelection() {
        ivSwitchInspection.setCompoundDrawablesWithIntrinsicBounds(0, 0, 0, R.drawable.ic_baseline_radio_button_checked_24);
        ivLinearAsset.setCompoundDrawablesWithIntrinsicBounds(0, 0, 0, R.drawable.ic_baseline_radio_button_unchecked_24);
        ivFixedAsset.setCompoundDrawablesWithIntrinsicBounds(0, 0, 0, R.drawable.ic_baseline_radio_button_unchecked_24);
        DUnit unit = (DUnit) spSwitchInspection.getSelectedItem();
        selectedUnit = unit.getUnit();
        selectedDUnit = unit;
        refreshFragments();
    }

    private void onCreateIssueClick() {
        Globals.selectedReport = null;
        Globals.newReport = new Report();
        Globals.issueTitle = "";
        Globals.selectedCategory = Globals.selectedReportType;
        Intent intent = new Intent(getActivity(), ReportAddActivity.class);
        try {
            getActivity().startActivityForResult(intent, SECOND_ACTIVITY_REQUEST_CODE);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    private void onCreateInspectClick(){
        try {
            Units unit = selectedUnit;
            if(unit.getAppForms().size() != 0){
                if(unit.getAppForms().size() > 1){
                    TabLayout host = (TabLayout) getActivity().findViewById(R.id.tabs);
                    host.getTabAt(Globals.isTimpsApp()?2:1).select();
                    ibSwitchInspection.setEnabled(true);
                } else {
                    String formName = unit.getAppForms().get(0).getFormName();
                    Intent intent = new Intent(getActivity(), AppFormActivity.class);
                    intent.putExtra("assetType",unit.getAssetType());
                    intent.putExtra("form",formName);
                    startActivity(intent);
                }
            } else {
                Toast.makeText(getActivity(), "No Inspect form available!", Toast.LENGTH_SHORT).show();
                ibSwitchInspection.setEnabled(true);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void selectAssetItem() {
        boolean isFound = false;
        for (int pos = 0; pos < staticList.size(); pos++) {
            if (selectedUnit.getUnitId().equals(staticList.get(pos).getUnit().getUnitId())) {
                isFound = true;
                ivLinearAsset.setCompoundDrawablesWithIntrinsicBounds(0, 0, 0, R.drawable.ic_baseline_radio_button_checked_24);
                ivFixedAsset.setCompoundDrawablesWithIntrinsicBounds(0, 0, 0, R.drawable.ic_baseline_radio_button_unchecked_24);
                ivSwitchInspection.setCompoundDrawablesWithIntrinsicBounds(0, 0, 0, R.drawable.ic_baseline_radio_button_unchecked_24);
                spLinearAsset.setSelection(pos);
                break;
            }
        }
        if (!isFound) {
            for (int pos = 0; pos < sortedList.size(); pos++) {
                if (selectedUnit.getUnitId().equals(sortedList.get(pos).getUnit().getUnitId())) {
                    ivFixedAsset.setCompoundDrawablesWithIntrinsicBounds(0, 0, 0, R.drawable.ic_baseline_radio_button_checked_24);
                    ivLinearAsset.setCompoundDrawablesWithIntrinsicBounds(0, 0, 0, R.drawable.ic_baseline_radio_button_unchecked_24);
                    ivSwitchInspection.setCompoundDrawablesWithIntrinsicBounds(0, 0, 0, R.drawable.ic_baseline_radio_button_unchecked_24);
                    spFixedAsset.setSelection(pos);
                    isFound = true;
                    break;
                }
            }
        }
    }

    private void refreshFragments() {
        callback.onAssetChange();
    }

    private void expandList() {
        isListExpanded = true;
        ibExpandList.setImageResource(R.drawable.ic_baseline_unfold_less_24);
        llLinearAssetContainer.setVisibility(View.GONE);
        llFixedAssetContainer.setVisibility(View.GONE);
        llSwitchContainer.setVisibility(View.GONE);
    }

    private void collapseList() {
        isListExpanded = false;
        ibExpandList.setImageResource(R.drawable.ic_baseline_unfold_more_24);
        if(appName.equals(Globals.AppName.SCIM)){
            llLinearAssetContainer.setVisibility(View.GONE);
        } else {
            llLinearAssetContainer.setVisibility(View.VISIBLE);
        }
        llFixedAssetContainer.setVisibility(View.VISIBLE);
        if(Globals.isShowSwitchInspection){
            llSwitchContainer.setVisibility(View.VISIBLE);
        }
    }

    protected static String bearing(double lat1, double lon1, double lat2, double lon2) {
        double longitude1 = lon1;
        double longitude2 = lon2;
        double latitude1 = Math.toRadians(lat1);
        double latitude2 = Math.toRadians(lat2);
        double longDiff = Math.toRadians(longitude2 - longitude1);
        double y = Math.sin(longDiff) * Math.cos(latitude2);
        double x = Math.cos(latitude1) * Math.sin(latitude2) - Math.sin(latitude1) * Math.cos(latitude2) * Math.cos(longDiff);
        double resultDegree = (Math.toDegrees(Math.atan2(y, x)) + 360) % 360;
        String coordNames[] = {"N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"};
        double directionid = Math.round(resultDegree / 22.5);
        // no of array contain 360/16=22.5
        if (directionid < 0) {
            directionid = directionid + 16;
            //no. of contains in array
        }
        String compassLoc = coordNames[(int) directionid];

        return resultDegree + " " + compassLoc;
    }
    @Override
    public void onCreateContextMenu(ContextMenu menu, View v, ContextMenu.ContextMenuInfo menuInfo) {
        super.onCreateContextMenu(menu, v, menuInfo);
        menu.setHeaderTitle("Context Menu");
        menu.add(0, v.getId(), 0, "Defect / Deficiency");
        menu.add(0, v.getId(), 0, "Inspect");
    }
    @Override
    public boolean onContextItemSelected(MenuItem item) {
        Toast.makeText(context, "Selected Item: " +item.getTitle(), Toast.LENGTH_SHORT).show();
        return true;
    }
}
