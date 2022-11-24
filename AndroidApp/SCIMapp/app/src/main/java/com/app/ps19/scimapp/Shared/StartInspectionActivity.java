package com.app.ps19.scimapp.Shared;

import androidx.appcompat.app.AppCompatActivity;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.location.Location;
import android.os.Bundle;
import android.text.Editable;
import android.text.Html;
import android.text.InputType;
import android.text.TextWatcher;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.app.ps19.scimapp.R;
import com.app.ps19.scimapp.SessionDashboard;
import com.app.ps19.scimapp.classes.CompRange;
import com.app.ps19.scimapp.classes.DUnit;
import com.app.ps19.scimapp.classes.JourneyPlan;
import com.app.ps19.scimapp.classes.JourneyPlanOpt;
import com.app.ps19.scimapp.classes.LatLong;
import com.app.ps19.scimapp.classes.Session;
import com.app.ps19.scimapp.classes.Task;
import com.app.ps19.scimapp.classes.Units;
import com.app.ps19.scimapp.classes.User;
import com.app.ps19.scimapp.inspMemberAdapter;
import com.app.ps19.scimapp.sessionsAdapter;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.material.textfield.TextInputLayout;

import org.w3c.dom.Text;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;

import static com.app.ps19.scimapp.Shared.Globals.CURRENT_LOCATION;
import static com.app.ps19.scimapp.Shared.Globals.NEARBY_ASSETS_LIST_SIZE;
import static com.app.ps19.scimapp.Shared.Globals.TASK_IN_PROGRESS_STATUS;
import static com.app.ps19.scimapp.Shared.Globals.angleOffset;
import static com.app.ps19.scimapp.Shared.Globals.isInspectionTypeReq;
import static com.app.ps19.scimapp.Shared.Globals.isMpReq;
import static com.app.ps19.scimapp.Shared.Globals.isTraverseReq;
import static com.app.ps19.scimapp.Shared.Globals.isUseDefaultAsset;
import static com.app.ps19.scimapp.Shared.Globals.isWConditionReq;
import static com.app.ps19.scimapp.Shared.Globals.initialInspection;
import static com.app.ps19.scimapp.Shared.Globals.initialRun;
import static com.app.ps19.scimapp.Shared.Globals.lastKnownLocation;
import static com.app.ps19.scimapp.Shared.Globals.selectedTraverseBy;
import static com.app.ps19.scimapp.Shared.Globals.setLocale;
import static com.app.ps19.scimapp.Shared.Globals.showNearByAssets;
import static com.app.ps19.scimapp.Shared.Globals.userEmail;
import static com.app.ps19.scimapp.Shared.Globals.userID;
import static com.app.ps19.scimapp.Shared.Utilities.isInRange;
import static com.app.ps19.scimapp.Shared.Utilities.selectFirstVisibleRadioButton;

public class StartInspectionActivity extends AppCompatActivity {

    EditText etStartMp;
    EditText etExpEndMp;
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
    TextView tvInspMemebersMsg;
    LinearLayout llInspSharingContainer;
    ListView lvInspMembers;
    ArrayList<CompRange> inspRanges = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setLocale(this);
        setContentView(R.layout.activity_start_inspection);
        myReceiver = new MyReceiver();
        if (Utils.requestingLocationUpdates(this)) {

        }
        context = this;
        initialRun = initialInspection.getTaskList().get(0);

        //  Get View elements from Layout file. Be sure to include inflated view name (mView)
        LinearLayout llTraverseTrack = (LinearLayout) findViewById(R.id.ll_traverse_track);
        LinearLayout llRequireMp = (LinearLayout) findViewById(R.id.ll_start_mp);
        LinearLayout llWeatherConditions = (LinearLayout) findViewById(R.id.ll_weather_conditions);
        LinearLayout llInspectionType = (LinearLayout) findViewById(R.id.ll_inspection_type);
        LinearLayout llMpValue = (LinearLayout) findViewById(R.id.ll_mp_value);
        LinearLayout llExpEndMp = (LinearLayout) findViewById(R.id.ll_exp_end_mp_value);

        tvInspMemebersMsg = (TextView) findViewById(R.id.tv_sharing_inspection_members_msg);
        llInspSharingContainer = (LinearLayout) findViewById(R.id.ll_sharing_inspection);
        lvInspMembers = (ListView) findViewById(R.id.lv_sharing_members);

        btnCancel = (Button) findViewById(R.id.btn_cancel);
        spAssetsAhead = (Spinner) findViewById(R.id.sp_assets_ahead);
        spAssetsBehind = (Spinner) findViewById(R.id.sp_assets_behind);
        btnOk = (Button) findViewById(R.id.btn_ok);
        llNearByAssets = (LinearLayout) findViewById(R.id.ll_nearby_assets);
        final RadioGroup rgInspectionType = (RadioGroup) findViewById(R.id.rg_inspection_type);
        etInspectionTypeDescription = (EditText) findViewById(R.id.et_inspection_type_description);
        selectFirstVisibleRadioButton(rgInspectionType);
        etStartMp = (EditText) findViewById(R.id.et_workplan_start_mp);
        etExpEndMp = (EditText) findViewById(R.id.et_exp_end_mp);
        TextView tvMpRange = (TextView) findViewById(R.id.tv_title_mp_range);
        TextView tvStartMsg = (TextView) findViewById(R.id.tv_title_msg_wp_start_mp);
        TextView tvTempPrefix = (TextView) findViewById(R.id.tv_temp_sign);
        TextView tvStartTitle = (TextView) findViewById(R.id.tv_start_mp_title);
        etSelectedAsset = (EditText) findViewById(R.id.et_selected_nearby_asset);
        etWeatherConditions = (EditText) findViewById(R.id.et_weather_conditions);
        final RadioGroup rgType = (RadioGroup) findViewById(R.id.rg_traverse_type);
        Spinner spTracks = (Spinner) findViewById(R.id.sp_traverse_track);
        Spinner spTemperature = (Spinner) findViewById(R.id.sp_temperature);
        selectFirstVisibleRadioButton(rgType);
        if (!selectedTraverseBy.equals("")) {
            selectDefaultTraverseBy(rgType, Globals.selectedTraverseBy);
        }
        String startTitle;
        String startMsg;
        final ArrayList<Units> tracks = new ArrayList<>();
        for (Units _track : initialRun.getWholeUnitList()) {
            if (_track.getAssetType().equals("track")) {
                tracks.add(_track);
            }
        }
        assetsAhead = new ArrayList<>();
        assetsBehind = new ArrayList<>();
        etSelectedAsset.setEnabled(false);
        llNearByAssets.setVisibility(View.VISIBLE);
        spAssetsAhead.setOnTouchListener(spAheadOnTouch);
        spAssetsBehind.setOnTouchListener(spBehindOnTouch);
        if(initialRun.isYardInspection()){
            etStartMp.setInputType(InputType.TYPE_CLASS_TEXT);
            etExpEndMp.setInputType(InputType.TYPE_CLASS_TEXT);
        }

        try {
            if (location != null) {
                fixedAssetsList = Globals.initialRun.getUnitList(new LatLng(location.getLatitude(), location.getLongitude()));
                listUpdate(location);
            } else if(lastKnownLocation!=null){
                fixedAssetsList = Globals.initialRun.getUnitList(new LatLng(Globals.lastKnownLocation.getLatitude(), Globals.lastKnownLocation.getLongitude()));
                listUpdate(Globals.lastKnownLocation);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        //spAssetsBehind.setSelection(0, false);
        //spAssetsAhead.setSelection(0, false);
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
                try {
                    String asset = assetsBehind.get(pos).getDescription() + " - " + assetsBehind.get(pos).getStart() + " to " + assetsBehind.get(pos).getEnd();
                    etSelectedAsset.setText(asset);
                    //etStartMp.setText(assetsBehind.get(pos).getStart());
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
                    String asset = assetsAhead.get(pos).getDescription() + " - " + assetsAhead.get(pos).getStart() + " to " + assetsAhead.get(pos).getEnd();
                    etSelectedAsset.setText(asset);
                    //etStartMp.setText(assetsAhead.get(pos).getStart());
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
        if(tracks.size() == 0){
            spTracks.setEnabled(false);
        }
        if (!Globals.selectedTempSign.equals("")) {
            tvTempPrefix.setText(Globals.selectedTempSign);
        }
        if (!Globals.selectedPostSign.equals("")) {
            tvMpRange.setText(Html.fromHtml(lineName + "<br> " + "<b>" + Globals.selectedPostSign + " " + "</b> " + initialRun.getMpStart() + " to " + "<b>" + Globals.selectedPostSign + " " + "</b> " + initialRun.getMpEnd()));
            startTitle = getString(R.string.start_title) + " " + Globals.selectedPostSign + ":";
            startMsg = getString(R.string.mp_req_msg_1) + Globals.selectedPostSign + getString(R.string.mp_req_msg_2);
        } else {
            tvMpRange.setText(Html.fromHtml(lineName + "<br> " + "<b>" + "MP " + "</b> " + initialRun.getMpStart() + " to " + "<b>" + "MP " + "</b> " + initialRun.getMpEnd()));
            startTitle = getString(R.string.start_mp_msg_title);
            startMsg = getString(R.string.start_mp_req_for_inspection_msg);
        }
        tvStartTitle.setText(startTitle);
        tvStartMsg.setText(startMsg);
        spTemperature.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                initialRun.setTemperature(parent.getItemAtPosition(position).toString());
                //Toast.makeText(TaskDashboardActivity.this, tracks.get(position).getDescription(), Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });
        spTracks.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                initialRun.setTraverseTrack(tracks.get(position).getUnitId());
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

        //etStartMp.setHint(Globals.initialInspection.getMpStart());
        if (Globals.isTraverseReq) {
            llTraverseTrack.setVisibility(View.VISIBLE);
        } else {
            llTraverseTrack.setVisibility(View.GONE);
        }
        if (isMpReq) {
            llRequireMp.setVisibility(View.VISIBLE);
            llMpValue.setVisibility(View.VISIBLE);
            llExpEndMp.setVisibility(View.VISIBLE);
        } else {
            llRequireMp.setVisibility(View.GONE);
            llMpValue.setVisibility(View.GONE);
            llExpEndMp.setVisibility(View.GONE);
        }
        if (isWConditionReq) {
            llWeatherConditions.setVisibility(View.VISIBLE);
        } else {
            llWeatherConditions.setVisibility(View.GONE);
        }
        if (isInspectionTypeReq) {
            llInspectionType.setVisibility(View.VISIBLE);
        } else {
            llInspectionType.setVisibility(View.GONE);
        }
        if (!(isMpReq || isTraverseReq || isWConditionReq || isInspectionTypeReq)) {
        }

        try {
            initialRun.setLocationUnit(Globals.selectedPostSign);
            initialRun.setTemperatureUnit(Globals.selectedTempSign);
        } catch (Exception e) {
            e.printStackTrace();
        }
        //Implemented Config
        if (!showNearByAssets) {
            llNearByAssets.setVisibility(View.GONE);
            try {
                LocalBroadcastManager.getInstance(context).unregisterReceiver(myReceiver);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        if(initialRun.isYardInspection()){
            llRequireMp.setVisibility(View.GONE);
            llMpValue.setVisibility(View.GONE);
            llExpEndMp.setVisibility(View.GONE);
            llNearByAssets.setVisibility(View.GONE);
            etStartMp.setText(initialRun.getMpStart());
            etExpEndMp.setText(initialRun.getMpEnd());
            try {
                LocalBroadcastManager.getInstance(context).unregisterReceiver(myReceiver);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        tvInspMemebersMsg.setVisibility(View.GONE);
        etStartMp.addTextChangedListener(new TextWatcher() {

            @Override
            public void afterTextChanged(Editable s) {}

            @Override
            public void beforeTextChanged(CharSequence s, int start,
                                          int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start,
                                      int before, int count) {
                if(s.length() != 0)
                    if(etStartMp.getText().toString().equals("")||etExpEndMp.getText().toString().equals("")){
                        tvInspMemebersMsg.setVisibility(View.GONE);
                        lvInspMembers.setVisibility(View.GONE);

                    } else {
                        calcSessionData();
                    }
            }
        });
        etExpEndMp.addTextChangedListener(new TextWatcher() {

            @Override
            public void afterTextChanged(Editable s) {}

            @Override
            public void beforeTextChanged(CharSequence s, int start,
                                          int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start,
                                      int before, int count) {
                if(s.length() != 0)
                    if(etStartMp.getText().toString().equals("")||etExpEndMp.getText().toString().equals("")){
                        tvInspMemebersMsg.setVisibility(View.GONE);
                        lvInspMembers.setVisibility(View.GONE);
                    } else {
                        calcSessionData();
                    }
            }
        });
        tvInspMemebersMsg.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(inspRanges.size()>0){
                    lvInspMembers.setVisibility(View.VISIBLE);
                }

            }
        });
        etExpEndMp.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View view, boolean hasFocus) {
                if (hasFocus) {
                } else {
                    if(etStartMp.getText().toString().equals("")||etExpEndMp.getText().toString().equals("")){
                        tvInspMemebersMsg.setVisibility(View.GONE);
                        lvInspMembers.setVisibility(View.GONE);
                    } else {
                        calcSessionData();
                    }
                }
            }
        });
        TextInputLayout textInputLayout = (TextInputLayout) findViewById(R.id.ti_start_mp);
        //textInputLayout.setHint(initialInspection.getTaskList().get(0).getMpStart());
        btnOk.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (Globals.isWConditionReq && Globals.isWConditionMustReq) {
                    if (etWeatherConditions.getText().toString().equals("")) {
                        Toast.makeText(context, R.string.weather_condition_req_msg, Toast.LENGTH_SHORT).show();
                        return;
                    }
                }
                if (isMpReq) {
                    double startMp = Double.parseDouble(initialRun.getMpStart());

                    if (etStartMp.getText().toString().equals("")) {
                        Toast.makeText(context, R.string.milepost_required_msg, Toast.LENGTH_SHORT).show();
                    } else if (!isInRange(Double.parseDouble(initialRun.getMpStart()), Double.parseDouble(initialRun.getMpEnd()), Double.parseDouble(etStartMp.getText().toString()))) {
                        Toast.makeText(context, getResources().getText(R.string.toast_start_milepost), Toast.LENGTH_LONG).show();
                        //return;
                    } else if(etExpEndMp.getText().toString().equals("")){
                        Toast.makeText(context, getResources().getText(R.string.exp_end_mp_req_msg), Toast.LENGTH_SHORT).show();
                    } else if(!isInRange(Double.parseDouble(initialRun.getMpStart()), Double.parseDouble(initialRun.getMpEnd()), Double.parseDouble(etExpEndMp.getText().toString()))){
                        Toast.makeText(context, getResources().getText(R.string.exp_end_not_in_range_msg), Toast.LENGTH_LONG).show();
                    } else {
                        initialRun.setUserStartMp(etStartMp.getText().toString());
                        if (Globals.isTraverseReq) {
                            int genid = rgType.getCheckedRadioButtonId();
                            RadioButton radioButton = (RadioButton) findViewById(genid);
                            String traverseBy = radioButton.getText().toString();
                            String _traverseByTag = radioButton.getTag().toString();
                            initialRun.setTraverseBy(_traverseByTag);
                        }
                        if (isWConditionReq) {
                            initialRun.setWeatherConditions(etWeatherConditions.getText().toString());
                        }
                        if (isInspectionTypeReq) {
                            int genid = rgInspectionType.getCheckedRadioButtonId();
                            RadioButton radioButton = (RadioButton) findViewById(genid);
                            int rbIndex = rgInspectionType.indexOfChild(radioButton);
                            switch (rbIndex) {
                                case 0:
                                    initialRun.setInspectionTypeTag("required");
                                    break;
                                case 1:
                                    initialRun.setInspectionTypeTag("weather");
                                    break;
                                case 2:
                                    initialRun.setInspectionTypeTag("special");
                                    break;
                            }
                            String _inspectionType = radioButton.getText().toString();
                            initialRun.setInspectionType(_inspectionType);
                            initialRun.setInspectionTypeDescription(etInspectionTypeDescription.getText().toString());
                        } else {
                            //If config is set false then "required" set by default
                            initialRun.setInspectionTypeTag("required");
                        }
                        Intent returnIntent = new Intent();
                        returnIntent.putExtra("result", "");
                        returnIntent.putExtra("expEnd", etExpEndMp.getText().toString());
                        setResult(Activity.RESULT_OK, returnIntent);
                        finish();
                    }
                } else {
                    initialRun.setUserStartMp(etStartMp.getText().toString());
                    if (Globals.isTraverseReq) {
                        int genid = rgType.getCheckedRadioButtonId();
                        RadioButton radioButton = (RadioButton) findViewById(genid);
                        String traverseBy = radioButton.getText().toString();
                        String _traverseByTag = radioButton.getTag().toString();
                        initialRun.setTraverseBy(_traverseByTag);
                    }
                    if (isWConditionReq) {
                        initialRun.setWeatherConditions(etWeatherConditions.getText().toString());
                    }
                    if (isInspectionTypeReq) {
                        int genid = rgInspectionType.getCheckedRadioButtonId();
                        RadioButton radioButton = (RadioButton) findViewById(genid);
                        int rbIndex = rgInspectionType.indexOfChild(radioButton);
                        switch (rbIndex) {
                            case 0:
                                initialRun.setInspectionTypeTag("required");
                                break;
                            case 1:
                                initialRun.setInspectionTypeTag("weather");
                                break;
                            case 2:
                                initialRun.setInspectionTypeTag("special");
                                break;
                        }
                        String _inspectionType = radioButton.getText().toString();
                        initialRun.setInspectionType(_inspectionType);
                        initialRun.setInspectionTypeDescription(etInspectionTypeDescription.getText().toString());
                    } else {
                        //If config is set false then "required" set by default
                        initialRun.setInspectionTypeTag("required");
                    }
                    Intent returnIntent = new Intent();
                    returnIntent.putExtra("result", "");
                    returnIntent.putExtra("expEnd", etExpEndMp.getText().toString());
                    setResult(Activity.RESULT_OK, returnIntent);
                    finish();
                }
            }
        });
        //btnCancel.setVisibility(View.GONE);
        btnCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                showConfirmationDialog();
            }
        });
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
    }
    private String getLineName(){
        String lineName = "";
        if(initialRun!=null){
            for(Units unit: initialRun.getWholeUnitList()){
                if(unit.getUnitId().equals(initialInspection.getLineId())){
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
                CURRENT_LOCATION = String.valueOf(mLocation.getLatitude()) + "," + String.valueOf(mLocation.getLongitude());
                LatLong location = new LatLong(Double.toString(mLocation.getLatitude()), Double.toString(mLocation.getLongitude()));
                if(lastLocation!=null){
                    lastLocation.bearingTo(mLocation);
                    Log.e("Location:", String.valueOf(lastLocation.bearingTo(mLocation)));
                }
                listUpdate(mLocation);
                lastLocation = mLocation;
            }
        }}
    private void listUpdate(Location mLocation){

        try {

            double direction = 0;
            double behindAngle;
            if(mLocation != null){
                fixedAssetsList = Globals.initialRun.getUnitList(new LatLng(mLocation.getLatitude(), mLocation.getLongitude()));
            } else if(lastKnownLocation!=null){
                fixedAssetsList = Globals.initialRun.getUnitList(new LatLng(Globals.lastKnownLocation.getLatitude(), Globals.lastKnownLocation.getLongitude()));
            }
            for (Iterator<DUnit> it = fixedAssetsList.iterator(); it.hasNext();) {
                if(it.next().isLinear()){
                    it.remove();
                }
            }
            if(lastKnownLocation != null){
                direction = normalizeDegree(Globals.lastKnownLocation.bearingTo(mLocation));
            } else if(lastLocation != null){
                direction = normalizeDegree(lastLocation.bearingTo(mLocation));
            }
            behindAngle = getBehindAngle(direction);
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


            assetAheadAdapter =
                    new ArrayAdapter<Units>(context, android.R.layout.simple_spinner_dropdown_item, assetsAhead);
            assetAheadAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
            spAssetsAhead.setAdapter(assetAheadAdapter);

            assetBehindAdapter =
                    new ArrayAdapter<Units>(context, android.R.layout.simple_spinner_dropdown_item, assetsBehind);
            assetBehindAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
            spAssetsBehind.setAdapter(assetBehindAdapter);
            if(assetsBehind.size() == 0){
                spAssetsBehind.setEnabled(false);
            }
            if(assetsAhead.size() == 0){
                spAssetsAhead.setEnabled(false);
            }
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
    void showConfirmationDialog() {
        AlertDialog alertDialog = new AlertDialog.Builder(this)
//set icon
                .setIcon(android.R.drawable.ic_dialog_alert)
//set title
                .setTitle(getString(R.string.title_warning))
//set message
                .setMessage(getString(R.string.issue_confirmation_msg))
//set positive button
                .setPositiveButton(getString(R.string.briefing_yes), new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        Intent returnIntent = new Intent();
                        setResult(Activity.RESULT_CANCELED, returnIntent);
                        finish();
                    }
                })
//set negative button
                .setNegativeButton(getString(R.string.briefing_no), new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        //set what should happen when negative button is clicked


                    }
                })
                .show();
    }
    /*private void findAndSetYardInspection(){
        for(Units asset: initialRun.getWholeUnitList()){
            if(asset.getAssetTypeObj().isMarkerMilepost()){
                initialRun.setYardInspection(true);
                break;
            }
        }
    }*/
    private void calcSessionData() {
        /*if(isInRange(3.0, 9.0, 4.0) || isInRange(3.0, 9.0, 5.0)){
            Log.d("Testing", "inside loop now");
        }*/
        double startMp = Double.parseDouble(etStartMp.getText().toString());
        double endMp = Double.parseDouble(etExpEndMp.getText().toString());
        JourneyPlanOpt wpTemplate = initialInspection.getTemplateOpt();
        JourneyPlan jp = initialInspection;
        ArrayList<User> rangeUsers = new ArrayList<>();
        inspRanges = new ArrayList<>();
        if(wpTemplate.getCompletion() !=null
                && wpTemplate.getCompletion().getRanges()!=null
                && wpTemplate.getCompletion().getRanges().size()> 0){
            for(CompRange range: wpTemplate.getCompletion().getRanges()){
                //if(!userEmail.equals(range.getUser().getEmail())){
                if(range.getSessions().size()>0){
                    try {
                        for(Session session: range.getSessions()){
                            if (isInRange(Double.parseDouble(session.getStart()), Double.parseDouble(session.getEnd()), startMp)
                                    || isInRange(Double.parseDouble(session.getStart()), Double.parseDouble(session.getEnd()), endMp)
                                    || isInRange(startMp, endMp, Double.parseDouble(session.getStart()))
                                    || isInRange(startMp, endMp, Double.parseDouble(session.getEnd()))){
                                CompRange _range = new CompRange();
                                ArrayList<Session> _session = new ArrayList<>();
                                if(!isUserExist(rangeUsers, range.getUser())){
                                    rangeUsers.add(range.getUser());
                                }
                                _session.add(session);
                                _range.setSessions(_session);
                                _range.setUser(range.getUser());
                                _range.setInspectionId(range.getInspectionId());
                                _range.setInspectionName(range.getInspectionName());
                                inspRanges.add(_range);
                            }
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
                // }
            }
        }
        if(rangeUsers.size()>0){
            tvInspMemebersMsg.setVisibility(View.VISIBLE);
            String inspSharingMemberMsg = rangeUsers.size() + getString(R.string.session_sharing_msg);
            tvInspMemebersMsg.setText(inspSharingMemberMsg);
            inspMemberAdapter sAdapter = new inspMemberAdapter(StartInspectionActivity.this, inspRanges);
            lvInspMembers.setAdapter(sAdapter);
        } else {
            tvInspMemebersMsg.setVisibility(View.GONE);
        }
        lvInspMembers.setVisibility(View.GONE);
    }
    private boolean isUserExist(ArrayList<User> users, User user){
        for(User _user: users){
            if(_user.getEmail().equals(user.getEmail())){
                return true;
            }
        }
        return false;
    }
}