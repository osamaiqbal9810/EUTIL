package com.app.ps19.tipsapp.Shared;

import android.app.Dialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.res.Resources;
import android.location.Location;
import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.app.ps19.tipsapp.location.LocationUpdatesService;
import com.google.android.material.textfield.TextInputLayout;
import androidx.fragment.app.DialogFragment;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import android.text.Html;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
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
import java.util.Date;
import java.util.Iterator;

import static com.app.ps19.tipsapp.Shared.Globals.CURRENT_LOCATION;
import static com.app.ps19.tipsapp.Shared.Globals.NEARBY_ASSETS_LIST_SIZE;
import static com.app.ps19.tipsapp.Shared.Globals.TASK_FINISHED_STATUS;
import static com.app.ps19.tipsapp.Shared.Globals.angleOffset;
import static com.app.ps19.tipsapp.Shared.Globals.getSelectedTask;
import static com.app.ps19.tipsapp.Shared.Globals.isBackOnTaskClose;
import static com.app.ps19.tipsapp.Shared.Globals.isBypassTaskView;
import static com.app.ps19.tipsapp.Shared.Globals.lastKnownLocation;
import static com.app.ps19.tipsapp.Shared.Globals.selectedJPlan;
import static com.app.ps19.tipsapp.Shared.Globals.setSelectedTask;
import static com.app.ps19.tipsapp.Shared.Utilities.closeKeyboard;
import static com.app.ps19.tipsapp.Shared.Utilities.isInRange;
import static com.app.ps19.tipsapp.Shared.Utilities.showKeyboard;

public class StopInspectionFragment extends DialogFragment {
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
    EditText etEndMp;
    public static String STOP_INSPECTION_RETURN_MSG = "finish activity";
    public static String STOP_INSPECTION_RETURN_MSG_FOR_DASHBOARD = "task closed";
    @NonNull
    @Override
    public Dialog onCreateDialog(@Nullable Bundle savedInstanceState) {


        if (getArguments() != null) {
            latitude = getArguments().getString("latitude");
            longitude = getArguments().getString("longitude");
            if(latitude.equals("")||longitude.equals("")){
                if(lastKnownLocation != null){
                    latitude = String.valueOf(lastKnownLocation.getLatitude());
                    longitude = String.valueOf(lastKnownLocation.getLongitude());
                } else {
                    latitude = "0.0";
                    longitude = "0.0";
                }

            }

            /*if (getArguments().getBoolean("notAlertDialog")) {
                return super.onCreateDialog(savedInstanceState);
            }*/
        }
        return super.onCreateDialog(savedInstanceState);
       /* AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        builder.setTitle("Message!");
        builder.setMessage("Please note that this action will never revert");

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

        return builder.create();*/

    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        //setCancelable(false);
        return inflater.inflate(R.layout.fragment_stop_inspection, container, false);


    }

    @Override
    public void onViewCreated(@NonNull View _mView, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(_mView, savedInstanceState);
        //  Inflate the Layout Resource file you created in Step 1
        //final View mView = getLayoutInflater().inflate(R.layout.fragment_start_inspection, null);
        mView = _mView;
        context = mView.getContext();
        if (getSelectedTask() == null) {
            setSelectedTask(selectedJPlan.getTaskList().get(0));
        }
        //  Get View elements from Layout file. Be sure to include inflated view name (mView)
        spAssetsAhead = (Spinner) mView.findViewById(R.id.sp_assets_ahead);
        spAssetsBehind = (Spinner) mView.findViewById(R.id.sp_assets_behind);
        btnCancel = (Button) mView.findViewById(R.id.btn_cancel);
        btnOk = (Button) mView.findViewById(R.id.btn_ok);
        llNearByAssets = (LinearLayout) mView.findViewById(R.id.ll_nearby_assets);
        etEndMp = (EditText) mView.findViewById(R.id.et_workplan_end_mp);
        final EditText etSelectedAsset = (EditText) mView.findViewById(R.id.et_selected_nearby_asset);
        TextView tvEndMsg = (TextView) mView.findViewById(R.id.tv_title_msg_wp_end_mp);
        TextView tvTotalMp = (TextView) mView.findViewById(R.id.tv_title_msg_wp_start_mp_value);
        TextView tvCompletedTill = (TextView) mView.findViewById(R.id.tv_completed_title);

        tvTotalMp.setText(Html.fromHtml("<b>" + "MP " + "</b> " + getSelectedTask().getMpStart() + getString(R.string.to_part2) + "<b>" + "MP " + "</b> " + getSelectedTask().getMpEnd()));
        //etEndMp.setHint(selectedJPlan.getMpEnd());
        TextInputLayout textInputLayout = (TextInputLayout) mView.findViewById(R.id.ti_end_mp);
        //textInputLayout.setHint(selectedTask.getMpEnd());
        assetsAhead = new ArrayList<>();
        assetsBehind = new ArrayList<>();
        llNearByAssets.setVisibility(View.VISIBLE);
        etSelectedAsset.setEnabled(false);

        if(location != null){
            fixedAssetsList = getSelectedTask().getUnitList(new LatLng(location.getLatitude(), location.getLongitude()));
            listUpdate(location);
        } else if(lastKnownLocation!=null) {
            fixedAssetsList = getSelectedTask().getUnitList(new LatLng(Globals.lastKnownLocation.getLatitude(), Globals.lastKnownLocation.getLongitude()));
            listUpdate(Globals.lastKnownLocation);
        }
        if(fixedAssetsList == null || fixedAssetsList.size() == 0){
            spAssetsAhead.setEnabled(false);
            spAssetsBehind.setEnabled(false);
        } else {
            spAssetsAhead.setEnabled(true);
            spAssetsBehind.setEnabled(true);
        }
        spAssetsBehind.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int pos, long l) {
                String asset = assetsBehind.get(pos).getDescription() + " - " + assetsBehind.get(pos).getStart() + " to " + assetsBehind.get(pos).getEnd();
                etSelectedAsset.setText(asset);
                //etEndMp.setText(assetsBehind.get(pos).getStart());
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {

            }
        });
        spAssetsAhead.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int pos, long l) {
                String asset = assetsAhead.get(pos).getDescription() + " - " + assetsAhead.get(pos).getStart() + " to " + assetsAhead.get(pos).getEnd();
                etSelectedAsset.setText(asset);
                //etEndMp.setText(assetsAhead.get(pos).getStart());
            }
            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {

            }
        });
        //Implement Config
        if(!Globals.showNearByAssets){
            llNearByAssets.setVisibility(View.GONE);
            try {
                LocalBroadcastManager.getInstance(context).unregisterReceiver(myReceiver);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        // Hiding Nearby assets as req by client
        llNearByAssets.setVisibility(View.GONE);
        etEndMp.requestFocus();
        //showKeyboard(context);
        // Set up the buttons
        //btnCancel.setVisibility(View.GONE);
        btnOk.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                try {
                    if (etEndMp.getText().toString().equals("")) {
                        Toast.makeText(context, R.string.milepost_required_msg, Toast.LENGTH_SHORT).show();
                    } else if (!isInRange(Double.parseDouble(getSelectedTask().getMpStart()), Double.parseDouble(getSelectedTask().getMpEnd()), Double.parseDouble(etEndMp.getText().toString()))) {
                        Toast.makeText(context, getResources().getText(R.string.toast_range_milepost), Toast.LENGTH_LONG).show();
                        //return;
                    } else {
                        getSelectedTask().setUserEndMp(etEndMp.getText().toString());
                        Toast.makeText(context,
                                getResources().getText(R.string.task_closed), Toast.LENGTH_SHORT).show();
                        if (isBypassTaskView && selectedJPlan.getTaskList().size() == 1) {
                            if (closeTask()) {
                                StopDialogListener dialogListener = (StopDialogListener) getActivity();
                                dialogListener.onFinishStopDialog(STOP_INSPECTION_RETURN_MSG_FOR_DASHBOARD);
                                //closeKeyboard(context);
                                dismiss();
                            }
                        }
                        if (isBackOnTaskClose) {
                            if (closeTask()) {
                                StopDialogListener dialogListener = (StopDialogListener) getActivity();
                                dialogListener.onFinishStopDialog(STOP_INSPECTION_RETURN_MSG);
                                //closeKeyboard(context);
                                dismiss();
                            }
                        }
                    }
                } catch (Resources.NotFoundException e) {
                    e.printStackTrace();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });

        btnCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //closeKeyboard(context);
                dismiss();
            }
        });


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
    private boolean closeTask(){
        if (!getSelectedTask().getStatus().equals(TASK_FINISHED_STATUS)) {
            Date now = new Date();
        /*if(Globals.selectedTask.getStartTime().equals("")){
            return false;
        }*/
            String selTaskId =getSelectedTask().getTaskId();

            for (Task task : Globals.selectedJPlan.getTaskList()) {
                if (task.getTaskId().equals(selTaskId)) {
                    if (latitude.equals("") || longitude.equals("")) {
                        task.setEndLocation("0.0" + "," + "0.0");
                    } else {
                        task.setEndLocation(latitude + "," + longitude);
                    }
                    if (!task.getUserEndMp().equals("")) {
                        task.setUserEndMp(etEndMp.getText().toString());
                    }

                    task.setStatus(TASK_FINISHED_STATUS);
                    Globals.isTaskStarted = false;
                    task.setEndTime(now.toString());
                }
            }
        /*Globals.selectedTask.setEndLocation(latitude + "," + longitude);
        Globals.selectedTask.setStatus(TASK_FINISHED_STATUS);
        Globals.isTaskStarted = false;
        Globals.selectedTask.setEndTime(now.toString());*/
            //Globals.selectedJPlan.update();
        }
        return true;
    }


    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        myReceiver = new MyReceiver();
        Log.d("StopInspectionDialog", "onCreate");

        boolean setFullScreen = false;
        if (getArguments() != null) {
            setFullScreen = getArguments().getBoolean("fullScreen");
        }
        setStyle(DialogFragment.STYLE_NORMAL, android.R.style.Theme_DeviceDefault_Light_Dialog_NoActionBar);
       /* if (setFullScreen)
            setStyle(DialogFragment.STYLE_NORMAL, android.R.style.Theme_Black_NoTitleBar_Fullscreen);*/
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
    }

    public interface StopDialogListener {
        void onFinishStopDialog(String inputText);
    }
    @Override
    public void onResume() {
        super.onResume();
        if(Globals.showNearByAssets){
            LocalBroadcastManager.getInstance(context).registerReceiver(myReceiver,
                    new IntentFilter(LocationUpdatesService.ACTION_BROADCAST));
        }
    }
    @Override
    public void onPause() {
        super.onPause();
        if(Globals.showNearByAssets) {
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
            double direction = 0;
            double behindAngle;
            double startOffset;
            double endOffset;
            if(mLocation != null){
                fixedAssetsList = getSelectedTask().getUnitList(new LatLng(mLocation.getLatitude(), mLocation.getLongitude()));
            } else if(lastKnownLocation!=null){
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
            if(lastKnownLocation != null){
                direction = normalizeDegree(Globals.lastKnownLocation.bearingTo(mLocation));
            } else if(lastLocation != null){
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

}
