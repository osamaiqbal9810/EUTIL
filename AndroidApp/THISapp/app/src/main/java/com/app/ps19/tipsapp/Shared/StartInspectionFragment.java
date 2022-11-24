package com.app.ps19.tipsapp.Shared;

import android.app.Dialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.location.Location;
import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.app.ps19.tipsapp.location.LocationUpdatesService;
import com.google.android.material.textfield.TextInputLayout;
import androidx.fragment.app.DialogFragment;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;
import androidx.appcompat.app.AlertDialog;
import android.text.Html;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.app.ps19.tipsapp.R;
import com.app.ps19.tipsapp.classes.DUnit;
import com.app.ps19.tipsapp.classes.LatLong;
import com.app.ps19.tipsapp.classes.Task;
import com.app.ps19.tipsapp.classes.Units;
import com.google.android.gms.maps.model.LatLng;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.Iterator;

import static com.app.ps19.tipsapp.Shared.Globals.CURRENT_LOCATION;
import static com.app.ps19.tipsapp.Shared.Globals.NEARBY_ASSETS_LIST_SIZE;
import static com.app.ps19.tipsapp.Shared.Globals.TASK_IN_PROGRESS_STATUS;
import static com.app.ps19.tipsapp.Shared.Globals.angleOffset;
import static com.app.ps19.tipsapp.Shared.Globals.getSelectedTask;
import static com.app.ps19.tipsapp.Shared.Globals.isInspectionTypeReq;
import static com.app.ps19.tipsapp.Shared.Globals.isMpReq;
import static com.app.ps19.tipsapp.Shared.Globals.isTraverseReq;
import static com.app.ps19.tipsapp.Shared.Globals.isUseDefaultAsset;
import static com.app.ps19.tipsapp.Shared.Globals.isWConditionReq;
import static com.app.ps19.tipsapp.Shared.Globals.selectedJPlan;
import static com.app.ps19.tipsapp.Shared.Globals.selectedTraverseBy;
import static com.app.ps19.tipsapp.Shared.Globals.setSelectedTask;
import static com.app.ps19.tipsapp.Shared.Globals.showNearByAssets;
import static com.app.ps19.tipsapp.Shared.Utilities.isInRange;
import static com.app.ps19.tipsapp.Shared.Utilities.selectFirstVisibleRadioButton;

public class StartInspectionFragment extends DialogFragment {
    EditText etStartMp;
    RadioGroup rgType;
    RadioGroup rgInspectionType;
    EditText etWeatherConditions;
    EditText etInspectionTypeDescription;
    View mView;
    Context context;
    Button btnOk;
    Button btnCancel;
    String latitude;
    String longitude;
    private MyReceiver myReceiver;
    Location lastLocation;
    Spinner spAssetsAhead;
    Spinner spAssetsBehind;
    ArrayList<DUnit> fixedAssetsList;
    ArrayList<Units> assetsAhead;
    ArrayList<Units> assetsBehind;
    Location location;
    ArrayAdapter<Units> assetBehindAdapter;
    ArrayAdapter<Units> assetAheadAdapter;
    LinearLayout llNearByAssets;
    EditText etSelectedAsset;
    public static String START_INSPECTION_RETURN_MSG = "start task";
    @NonNull
    @Override
    public Dialog onCreateDialog(@Nullable Bundle savedInstanceState) {


        if (getArguments() != null) {
            latitude = getArguments().getString("latitude");
            longitude = getArguments().getString("longitude");
            if (getArguments().getBoolean("notAlertDialog")) {
                return super.onCreateDialog(savedInstanceState);
            }

        }
        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        builder.setTitle("Alert Dialog");
        builder.setMessage("Alert Dialog inside DialogFragment");

        builder.setPositiveButton("Ok", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
            }
        });

        builder.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dismiss();
            }
        });

        return builder.create();

    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        setCancelable(false);
        try {
            getDialog().getWindow().setSoftInputMode(
                    WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return inflater.inflate(R.layout.fragment_start_inspection, container, false);

    }

    @Override
    public void onViewCreated(@NonNull View _mView, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(_mView, savedInstanceState);
        //  Inflate the Layout Resource file you created in Step 1
        //final View mView = getLayoutInflater().inflate(R.layout.fragment_start_inspection, null);
        mView = _mView;
        context = mView.getContext();
        if(getSelectedTask() == null){
            if(selectedJPlan.getTaskList().size()==1){
                setSelectedTask(selectedJPlan.getTaskList().get(0));
            } else{
                //just for handling error
                setSelectedTask(selectedJPlan.getTaskList().get(0));
            }
        }

        //  Get View elements from Layout file. Be sure to include inflated view name (mView)
        LinearLayout llTraverseTrack = (LinearLayout) mView.findViewById(R.id.ll_traverse_track);
        LinearLayout llRequireMp = (LinearLayout) mView.findViewById(R.id.ll_start_mp);
        LinearLayout llWeatherConditions = (LinearLayout) mView.findViewById(R.id.ll_weather_conditions);
        LinearLayout llInspectionType = (LinearLayout) mView.findViewById(R.id.ll_inspection_type);
        LinearLayout llMpValue = (LinearLayout) mView.findViewById(R.id.ll_mp_value);
        btnCancel = (Button) mView.findViewById(R.id.btn_cancel);
        spAssetsAhead = (Spinner) mView.findViewById(R.id.sp_assets_ahead);
        spAssetsBehind = (Spinner) mView.findViewById(R.id.sp_assets_behind);
        btnOk = (Button) mView.findViewById(R.id.btn_ok);
        llNearByAssets = (LinearLayout) mView.findViewById(R.id.ll_nearby_assets);
        final RadioGroup rgInspectionType = (RadioGroup) mView.findViewById(R.id.rg_inspection_type);
        etInspectionTypeDescription = (EditText) mView.findViewById(R.id.et_inspection_type_description);
        selectFirstVisibleRadioButton(rgInspectionType);
        etStartMp = (EditText) mView.findViewById(R.id.et_workplan_start_mp);
        TextView tvMpRange = (TextView) mView.findViewById(R.id.tv_title_mp_range);
        TextView tvStartMsg = (TextView) mView.findViewById(R.id.tv_title_msg_wp_start_mp);
        TextView tvTempPrefix = (TextView) mView.findViewById(R.id.tv_temp_sign);
        TextView tvStartTitle = (TextView) mView.findViewById(R.id.tv_start_mp_title);
        etSelectedAsset = (EditText) mView.findViewById(R.id.et_selected_nearby_asset);
        etWeatherConditions = (EditText) mView.findViewById(R.id.et_weather_conditions);
        final RadioGroup rgType = (RadioGroup) mView.findViewById(R.id.rg_traverse_type);
        Spinner spTracks = (Spinner) mView.findViewById(R.id.sp_traverse_track);
        Spinner spTemperature = (Spinner) mView.findViewById(R.id.sp_temperature);
        selectFirstVisibleRadioButton(rgType);
        if(!selectedTraverseBy.equals("")){
            selectDefaultTraverseBy(rgType, Globals.selectedTraverseBy);
        }
        String startTitle;
        String startMsg;
        final ArrayList<Units> tracks = new ArrayList<>();
        for(Units _track: getSelectedTask().getWholeUnitList()){
            if(_track.getAssetType().equals("track")){
                tracks.add(_track);
            }
        }
        assetsAhead = new ArrayList<>();
        assetsBehind = new ArrayList<>();
        etSelectedAsset.setEnabled(false);
        llNearByAssets.setVisibility(View.VISIBLE);
        spAssetsAhead.setOnTouchListener(spAheadOnTouch);
        spAssetsBehind.setOnTouchListener(spBehindOnTouch);

        if(location != null){
            fixedAssetsList =getSelectedTask().getUnitList(new LatLng(location.getLatitude(), location.getLongitude()));
            listUpdate(location);
        } else {
            fixedAssetsList = getSelectedTask().getUnitList(new LatLng(Globals.lastKnownLocation.getLatitude(), Globals.lastKnownLocation.getLongitude()));
            listUpdate(Globals.lastKnownLocation);
        }
        spAssetsBehind.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int pos, long l) {
                try {
                    etSelectedAsset.setText(assetsBehind.get(pos).getDescription());
                    etStartMp.setText(assetsBehind.get(pos).getStart());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {

            }
        });
        spAssetsAhead.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int pos, long l) {
                try {
                    etSelectedAsset.setText(assetsAhead.get(pos).getDescription());
                    etStartMp.setText(assetsAhead.get(pos).getStart());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {

            }
        });
        String lineName = "";
        lineName = getLineName();
        ArrayAdapter<Units> adapter =
                new ArrayAdapter<Units>(context, android.R.layout.simple_spinner_dropdown_item, tracks);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spTracks.setAdapter(adapter);
        if(!Globals.selectedTempSign.equals("")){
            tvTempPrefix.setText(Globals.selectedTempSign);
        }
        if(!Globals.selectedPostSign.equals("")){
            tvMpRange.setText(Html.fromHtml(lineName + "<br> " + "<b>" + Globals.selectedPostSign + " " + "</b> " + getSelectedTask().getMpStart() + " to " + "<b>" + Globals.selectedPostSign + " " + "</b> " + getSelectedTask().getMpEnd()));
            startTitle = getString(R.string.start_title) +" "+ Globals.selectedPostSign + ":";
            startMsg = getString(R.string.mp_req_msg_1) + Globals.selectedPostSign + getString(R.string.mp_req_msg_2);
        } else {
            tvMpRange.setText(Html.fromHtml(lineName + "<br> " +"<b>"+"MP "+"</b> " + getSelectedTask().getMpStart() + " to " + "<b>"+"MP "+"</b> " + getSelectedTask().getMpEnd()));
            startTitle = getString(R.string.start_mp_msg_title);
            startMsg = getString(R.string.start_mp_req_for_inspection_msg);
        }
        tvStartTitle.setText(startTitle);
        tvStartMsg.setText(startMsg);
        spTemperature.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                getSelectedTask().setTemperature(parent.getItemAtPosition(position).toString());
                //Toast.makeText(TaskDashboardActivity.this, tracks.get(position).getDescription(), Toast.LENGTH_SHORT).show();
            }
            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });
        spTracks.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                getSelectedTask().setTraverseTrack(tracks.get(position).getUnitId());
                //Toast.makeText(TaskDashboardActivity.this, tracks.get(position).getDescription(), Toast.LENGTH_SHORT).show();
            }
            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });
        // Setting default value to 45 for temperature as req by JD
        String[] tempValues = getResources().getStringArray(R.array.temp_values);
        int defaultIndex = Arrays.asList(tempValues).indexOf("45");
        spTemperature.setSelection(defaultIndex);

        //etStartMp.setHint(Globals.selectedJPlan.getMpStart());
        if(Globals.isTraverseReq){
            llTraverseTrack.setVisibility(View.VISIBLE);
        } else {
            llTraverseTrack.setVisibility(View.GONE);
        }
        if(isMpReq){
            llRequireMp.setVisibility(View.VISIBLE);
            llMpValue.setVisibility(View.VISIBLE);
        } else {
            llRequireMp.setVisibility(View.GONE);
            llMpValue.setVisibility(View.GONE);
        }
        if(isWConditionReq){
            llWeatherConditions.setVisibility(View.VISIBLE);
        } else {
            llWeatherConditions.setVisibility(View.GONE);
        }
        if(isInspectionTypeReq){
            llInspectionType.setVisibility(View.VISIBLE);
        } else {
            llInspectionType.setVisibility(View.GONE);
        }
        if(!(isMpReq||isTraverseReq||isWConditionReq||isInspectionTypeReq)){
            try {
                startTask();
                StartDialogListener startDialogListener = (StartDialogListener) getActivity();
                assert startDialogListener != null;
                startDialogListener.onFinishStartDialog(START_INSPECTION_RETURN_MSG);
            } catch (Exception e) {
                e.printStackTrace();
            }
            dismiss();
        }

        try {
            getSelectedTask().setLocationUnit(Globals.selectedPostSign);
            getSelectedTask().setTemperatureUnit(Globals.selectedTempSign);
        } catch (Exception e) {
            e.printStackTrace();
        }
        //Implemented Config
        if(!showNearByAssets){
            llNearByAssets.setVisibility(View.GONE);
            try {
                LocalBroadcastManager.getInstance(context).unregisterReceiver(myReceiver);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        TextInputLayout textInputLayout = (TextInputLayout) mView.findViewById(R.id.ti_start_mp);
        textInputLayout.setHint(selectedJPlan.getTaskList().get(0).getMpStart());
        btnOk.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(Globals.isWConditionReq && Globals.isWConditionMustReq){
                    if(etWeatherConditions.getText().toString().equals("")){
                        Toast.makeText(context, R.string.weather_condition_req_msg, Toast.LENGTH_SHORT).show();
                        return;
                    }
                }
                if(isMpReq){
                    double startMp = Double.parseDouble(getSelectedTask().getMpStart());

                    if(etStartMp.getText().toString().equals("")){
                        Toast.makeText(context, R.string.milepost_required_msg, Toast.LENGTH_SHORT).show();
                    } else if (!isInRange(Double.parseDouble(getSelectedTask().getMpStart()), Double.parseDouble(getSelectedTask().getMpEnd()), Double.parseDouble(etStartMp.getText().toString()))) {
                        Toast.makeText(context, getResources().getText(R.string.toast_start_milepost), Toast.LENGTH_LONG).show();
                        //return;
                    } else {
                        getSelectedTask().setUserStartMp(etStartMp.getText().toString());
                        if(Globals.isTraverseReq){
                            int genid= rgType.getCheckedRadioButtonId();
                            RadioButton radioButton = (RadioButton) mView.findViewById(genid);
                            String traverseBy =radioButton.getText().toString();
                            getSelectedTask().setTraverseBy(traverseBy);
                        }
                        if(isWConditionReq){
                            getSelectedTask().setWeatherConditions(etWeatherConditions.getText().toString());
                        }
                        if(isInspectionTypeReq){
                            int genid= rgInspectionType.getCheckedRadioButtonId();
                            RadioButton radioButton = (RadioButton) mView.findViewById(genid);
                            int rbIndex = rgInspectionType.indexOfChild(radioButton);
                            switch (rbIndex) {
                                case 0:
                                    getSelectedTask().setInspectionTypeTag("required");
                                    break;
                                case 1:
                                    getSelectedTask().setInspectionTypeTag("weather");
                                    break;
                                case 2:
                                    getSelectedTask().setInspectionTypeTag("special");
                                    break;
                            }
                            String _inspectionType =radioButton.getText().toString();
                            getSelectedTask().setInspectionType(_inspectionType);
                            getSelectedTask().setInspectionTypeDescription(etInspectionTypeDescription.getText().toString());
                        } else {
                            //If config is set false then "required" set by default
                            getSelectedTask().setInspectionTypeTag("required");
                        }
                        /*f(isBypassTaskView && selectedJPlan.getTaskList().size() == 1){
                            startTask();
                        } else {*/
                        try {
                            startTask();
                            StartDialogListener startDialogListener = (StartDialogListener) getActivity();
                            assert startDialogListener != null;
                            startDialogListener.onFinishStartDialog(START_INSPECTION_RETURN_MSG);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                        //}
                        dismiss();
                    }
                } else{
                    getSelectedTask().setUserStartMp(etStartMp.getText().toString());
                    if(Globals.isTraverseReq){
                        int genid= rgType.getCheckedRadioButtonId();
                        RadioButton radioButton = (RadioButton) mView.findViewById(genid);
                        String traverseBy =radioButton.getText().toString();
                        getSelectedTask().setTraverseBy(traverseBy);
                    }
                    if(isWConditionReq){
                        getSelectedTask().setWeatherConditions(etWeatherConditions.getText().toString());
                    }
                    if(isInspectionTypeReq){
                        int genid= rgInspectionType.getCheckedRadioButtonId();
                        RadioButton radioButton = (RadioButton) mView.findViewById(genid);
                        int rbIndex = rgInspectionType.indexOfChild(radioButton);
                        switch (rbIndex) {
                            case 0:
                                getSelectedTask().setInspectionTypeTag("required");
                                break;
                            case 1:
                                getSelectedTask().setInspectionTypeTag("weather");
                                break;
                            case 2:
                                getSelectedTask().setInspectionTypeTag("special");
                                break;
                        }
                        String _inspectionType =radioButton.getText().toString();
                        getSelectedTask().setInspectionType(_inspectionType);
                        getSelectedTask().setInspectionTypeDescription(etInspectionTypeDescription.getText().toString());
                    } else {
                        //If config is set false then "required" set by default
                        getSelectedTask().setInspectionTypeTag("required");
                    }
                    try {
                        startTask();
                        StartDialogListener startDialogListener = (StartDialogListener) getActivity();
                        startDialogListener.onFinishStartDialog(START_INSPECTION_RETURN_MSG);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    //}
                    dismiss();
                }
                /* DialogListener dialogListener = (DialogListener) getActivity();
                dialogListener.onFinishEditDialog(editText.getText().toString());
                dismiss();*/
            }});
        btnCancel.setVisibility(View.GONE);
        btnCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dismiss();
            }});



       /* final EditText editText = view.findViewById(R.id.inEmail);

        if (getArguments() != null && !TextUtils.isEmpty(getArguments().getString("email")))
            editText.setText(getArguments().getString("email"));

        Button btnDone = view.findViewById(R.id.btnDone);
        btnDone.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                DialogListener dialogListener = (DialogListener) getActivity();
                dialogListener.onFinishEditDialog(editText.getText().toString());
                dismiss();
            }
        });*/
    }
    private void startTask(){
        Date now = new Date();
        String selTaskId =getSelectedTask().getTaskId();
        for (Task task: Globals.selectedJPlan.getTaskList()){
            if(task.getTaskId().equals(selTaskId)){
                task.setStatus(TASK_IN_PROGRESS_STATUS);
                task.setStartTime(now.toString());
                Globals.isTaskStarted = true;
                task.setStartLocation(latitude + "," + longitude);
            }}
        //SimpleDateFormat _format = new SimpleDateFormat("hh:mm:ss aa");
       /* Globals.selectedTask.setStatus(TASK_IN_PROGRESS_STATUS);
        Globals.selectedTask.setStartTime(now.toString());
        Globals.isTaskStarted = true;
        Globals.selectedTask.setStartLocation(latitude + "," + longitude);*/

        if(Globals.selectedUnit == null){
            if(getSelectedTask().getWholeUnitList().size() == 0){
                Toast.makeText(context,getResources().getText(R.string.asset_available), Toast.LENGTH_SHORT).show();
            } else{
                if(isUseDefaultAsset){
                    for(Units unit: getSelectedTask().getWholeUnitList()){
                        if(unit.getAttributes().isPrimary()){
                            Globals.selectedUnit = unit;
                        }
                    }
                }else {
                    Globals.selectedUnit = getSelectedTask().getWholeUnitList().get(0);
                }

            }
        }
            //Intent intent = new Intent(TaskDashboardActivity.this, IssuesActivity.class);//Intent intent = new Intent(TaskActivity.this, TaskDetailActivity.class);
            Globals.selectedJPlan.update();
            //loadTaskDetails();
            //startActivity(intent);

    }

    @Override
    public void onResume() {
        super.onResume();
        if(showNearByAssets){
            LocalBroadcastManager.getInstance(context).registerReceiver(myReceiver,
                    new IntentFilter(LocationUpdatesService.ACTION_BROADCAST));
        }
    }
    @Override
    public void onPause() {
        super.onPause();
        if(showNearByAssets){
            try {
                LocalBroadcastManager.getInstance(context).unregisterReceiver(myReceiver);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        /*if(selectedUnit!=null){
            setAdapter(selectedUnit.getUnitId());
        }*/
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        myReceiver = new MyReceiver();
        Log.d("StartInspectionDialog", "onCreate");

        boolean setFullScreen = false;
        if (getArguments() != null) {
            setFullScreen = getArguments().getBoolean("fullScreen");
        }
        if (setFullScreen)
            setStyle(DialogFragment.STYLE_NORMAL, android.R.style.Theme_Black_NoTitleBar_Fullscreen);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
    }

    public interface StartDialogListener {
        void onFinishStartDialog(String inputText);
    }
    private String getLineName(){
        String lineName = "";
        if(getSelectedTask()!=null){
            for(Units unit: getSelectedTask().getWholeUnitList()){
                if(unit.getUnitId().equals(selectedJPlan.getLineId())){
                    lineName = unit.getDescription();
                    return lineName;
                }
            }
        }
        return lineName;
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
                if(lastLocation!=null){
                    lastLocation.bearingTo(mLocation);
                    Log.e("Location:", String.valueOf(lastLocation.bearingTo(mLocation)));
                }
                //tvLocation.setText(getLocationDescription(location, UnitSelectionActivity.this));
                listUpdate(mLocation);
                lastLocation = mLocation;

                /*Toast.makeText(IssuesActivity.this, Utils.getLocationText(mLocation),
                        Toast.LENGTH_SHORT).show();*/
            }
        }}
    private void listUpdate(Location mLocation){

        try {
            //staticList.clear();
            //String direction = "";
            double direction;
            double behindAngle;
            double startOffset;
            double endOffset;
            if(mLocation != null){
                fixedAssetsList =getSelectedTask().getUnitList(new LatLng(mLocation.getLatitude(), mLocation.getLongitude()));
            } else {
                fixedAssetsList = getSelectedTask().getUnitList(new LatLng(Globals.lastKnownLocation.getLatitude(), Globals.lastKnownLocation.getLongitude()));
            }
            for (Iterator<DUnit> it = fixedAssetsList.iterator(); it.hasNext();) {
                //if (it.next().getDistance()<0) {
                //    it.remove();
                //}
                if(it.next().isLinear()){
                    it.remove();
                }
            }
            if(lastLocation == null){
                direction = normalizeDegree(Globals.lastKnownLocation.bearingTo(mLocation));
            } else {
                direction = normalizeDegree(lastLocation.bearingTo(mLocation));
            }
            //direction = normalizeDegree(lastLocation.bearingTo(mLocation));
            behindAngle = getBehindAngle(direction);
            //startOffset = getStartOffset()
            assetsAhead.clear();
            assetsBehind.clear();
            spAssetsAhead.setEnabled(true);
            spAssetsBehind.setEnabled(true);

            for(DUnit dUnit: fixedAssetsList){
                //Decision according to ahead angle
                if(normalizeDegree(dUnit.getBearing()) == direction || (normalizeDegree(dUnit.getBearing()) >= getEndOffset(direction) || normalizeDegree(dUnit.getBearing()) <= getStartOffset(direction))){
                    if(assetsAhead.size() <= NEARBY_ASSETS_LIST_SIZE){
                        assetsAhead.add(dUnit.getUnit());
                    }
                    //Decision according to behind angle
                } else if(normalizeDegree(dUnit.getBearing()) == behindAngle || (normalizeDegree(dUnit.getBearing()) >= getEndOffset(behindAngle) || normalizeDegree(dUnit.getBearing()) <= getStartOffset(behindAngle))){
                    if(assetsBehind.size() <= NEARBY_ASSETS_LIST_SIZE){
                        assetsBehind.add(dUnit.getUnit());
                    }
                }
            }

           // if(spAssetsAhead.getAdapter() == null){
                assetAheadAdapter =
                        new ArrayAdapter<Units>(context, android.R.layout.simple_spinner_dropdown_item, assetsAhead);
                assetAheadAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                spAssetsAhead.setAdapter(assetAheadAdapter);
                //assetAheadAdapter.setNotifyOnChange(true);
           /* } else {
               // assetAheadAdapter.setNotifyOnChange(false); // Prevents 'clear()' from clearing/resetting the listview
                *//*assetAheadAdapter.clear();
                assetAheadAdapter.addAll(assetsAhead);*//*
                assetAheadAdapter.notifyDataSetChanged();
            }*/
            //if(spAssetsBehind.getAdapter() == null){
                assetBehindAdapter =
                        new ArrayAdapter<Units>(context, android.R.layout.simple_spinner_dropdown_item, assetsBehind);
                assetBehindAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                spAssetsBehind.setAdapter(assetBehindAdapter);
                //assetBehindAdapter.setNotifyOnChange(true);


            /*} else {
                //assetBehindAdapter.setNotifyOnChange(false); // Prevents 'clear()' from clearing/resetting the listview
               *//* assetBehindAdapter.clear();
                assetBehindAdapter.addAll(assetsBehind);*//*
                assetBehindAdapter.notifyDataSetChanged();
            }*/
            if(assetsBehind.size() == 0){
                spAssetsBehind.setEnabled(false);
            }
            if(assetsAhead.size() == 0){
                spAssetsAhead.setEnabled(false);
            }

           /* assetBehindAdapter = new assetAdapter(getActivity(), "sorted", assetsBehind);
            spAssetsBehind.setAdapter(assetBehindAdapter);*/

            /*if(previousLocation != null){
                //1st param: previous location
                //2nd param: new location
               // direction = bearing(Double.parseDouble(previousLocation.getLat()), Double.parseDouble(previousLocation.getLon()), Double.parseDouble(location.getLat()), Double.parseDouble(location.getLon())  );

            }*/
            //sortedList.clear();

            //previousLocation = location;
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    private double normalizeDegree(double value) {
        if (value >= 0.0f && value <= 180.0f) {
            return value;
        } else {
            return 180 + (180 + value);
        }
    }
    private double getBehindAngle(double value){
        if(value >= 0.1f && value <= 179.9f) {
            return value + 180.0f;
        } else if(value == 180f || value == 180.0f){
            return 0.0f;
        } else if(value == 0.0 || value == 0) {
            return 180.0f;
        } else {
            return value - 180.0f;
        }
    }
    private double getStartOffset(double value){
        double offsetValue = angleOffset;
        value = value + offsetValue;
        if(value > 360){
            return value - 360;
        }
        return value;
    }
    private double getEndOffset(double value){
        double offsetValue = angleOffset;
        value = value - offsetValue;
        if(value < 0){
            return 360 - value;
        }
        return value;
    }
    public static void selectDefaultTraverseBy(RadioGroup radioGroup, String value) {

        int childCount = radioGroup.getChildCount();
        for (int i = 0; i < childCount; i++) {
            RadioButton rButton = (RadioButton) radioGroup.getChildAt(i);

            if(rButton.getText().equals(value)){
                if (rButton.getVisibility() == View.VISIBLE) {
                    rButton.setChecked(true);
                    return;
                }
            }
        }
    }
    private View.OnTouchListener spAheadOnTouch = new View.OnTouchListener() {
        public boolean onTouch(View v, MotionEvent event) {
            if (event.getAction() == MotionEvent.ACTION_UP) {
                if(assetsAhead.size()==1){
                    try {
                        etSelectedAsset.setText(assetsBehind.get(0).getDescription());
                        etStartMp.setText(assetsAhead.get(0).getStart());
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
            return false;
        }
    };
    private View.OnTouchListener spBehindOnTouch = new View.OnTouchListener() {
        public boolean onTouch(View v, MotionEvent event) {
            if (event.getAction() == MotionEvent.ACTION_UP) {
                if(assetsBehind.size()==1){
                    try {
                        etSelectedAsset.setText(assetsBehind.get(0).getDescription());
                        etStartMp.setText(assetsBehind.get(0).getStart());
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
            return false;
        }
    };
}
