package com.app.ps19.scimapp;

import android.Manifest;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.location.Location;
import android.media.MediaMetadataRetriever;
import android.media.MediaRecorder;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.IBinder;
import android.os.StrictMode;
import android.preference.PreferenceManager;
import android.speech.RecognizerIntent;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.appcompat.widget.Toolbar;

import android.text.Editable;
import android.text.SpannableString;
import android.text.TextWatcher;
import android.text.style.UnderlineSpan;
import android.util.Log;
import android.util.TypedValue;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.view.inputmethod.InputMethodManager;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;

import com.app.ps19.scimapp.Shared.GPSTrackerEx;
import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.Shared.ListMap;
import com.app.ps19.scimapp.Shared.LocationChangedInterface;
import com.app.ps19.scimapp.Shared.LocationUpdatesService;
import com.app.ps19.scimapp.Shared.Res;
import com.app.ps19.scimapp.Shared.StaticListItem;
import com.app.ps19.scimapp.Shared.Utilities;
import com.app.ps19.scimapp.Shared.Utils;
import com.app.ps19.scimapp.classes.IssueImage;
import com.app.ps19.scimapp.classes.IssueVoice;
import com.app.ps19.scimapp.classes.LocationMarkers;
import com.app.ps19.scimapp.classes.RemedialActionItem;
import com.app.ps19.scimapp.classes.Report;
import com.app.ps19.scimapp.classes.Task;
import com.google.common.collect.ArrayListMultimap;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;
import java.util.UUID;

import static android.view.View.GONE;
import static com.app.ps19.scimapp.Shared.Globals.ADAPTER_REFRESH_MSG;
import static com.app.ps19.scimapp.Shared.Globals.DEFECT_TYPE;
import static com.app.ps19.scimapp.Shared.Globals.DEFICIENCY_TYPE;
import static com.app.ps19.scimapp.Shared.Globals.appName;
import static com.app.ps19.scimapp.Shared.Globals.defectSelection;
import static com.app.ps19.scimapp.Shared.Globals.isIssueUpdateAllowed;
import static com.app.ps19.scimapp.Shared.Globals.isUseRailDirection;
import static com.app.ps19.scimapp.Shared.Globals.defectSelectionCopy;
import static com.app.ps19.scimapp.Shared.Globals.lastKnownLocation;
import static com.app.ps19.scimapp.Shared.Globals.selectedCode;
import static com.app.ps19.scimapp.Shared.Globals.selectedReport;
import static com.app.ps19.scimapp.Shared.Globals.selectedUnit;
import static com.app.ps19.scimapp.Shared.Globals.setLocale;
import static com.app.ps19.scimapp.Shared.Globals.tempIssueImgList;
import static com.app.ps19.scimapp.Shared.Globals.tempIssueVoiceList;
import static com.app.ps19.scimapp.Shared.ListMap.LIST_CATEGORY;
import static com.app.ps19.scimapp.Shared.ListMap.LIST_PRIORITY;
import static com.app.ps19.scimapp.Shared.Utilities.getImgPath;
import static com.app.ps19.scimapp.Shared.Utilities.getVoicePath;
import static java.lang.String.format;

public class ReportAddActivity extends AppCompatActivity implements LocationChangedInterface, SharedPreferences.OnSharedPreferenceChangeListener {
    static final String DATEFORMAT = "yyyy-MM-dd HH:mm:ss.SSS";
    TextView tvAssetName;
    Spinner spPriority;
    ImageButton ibCapturePic;
    private Boolean isMarked = false;
    private ArrayList<String> _priorityList;

    EditText etDescription;
    Button btSave;
    Switch swMarked;
    public final static int RESULT_CODE = 1;
    TextView tvReflexDesc;
    ArrayList<IssueImage> attachmentImgs = new ArrayList<IssueImage>();
    ArrayList<IssueImage> beforeImgs = new ArrayList<IssueImage>();
    ArrayList<IssueImage> afterImgs = new ArrayList<IssueImage>();
    RecyclerView rvImages;
    reportImgAdapter issueImgAdapter;
    public final static String TAG_BEFORE_FIX = "before";

    // For images taken after fix
    ImageButton iBtnCaptureAfterFix;
    RecyclerView rvRemedialImgs;
    reportImgAdapter picsAfterFixAdapter;
    public final static String TAG_AFTER_FIX = "after";
    public static final String FIX_TYPE_PERMANENT = "Permanent";
    public static final String FIX_TYPE_TEMPORARY = "Temporary";
    public static final String ASSET_TYPE_LINEAR = "linear";
    public static final String ASSET_TYPE_FIXED = "point";
    String fixType;
    //=== remedial Actions
    Spinner spRemedialActions;
    ArrayList<RemedialActions> remedialActions;
    LinearLayout llRemedialActionForm;
    ArrayAdapter<String> priAdapter;
    ArrayAdapter<String> remedialActionAdapter;
    ArrayList<RemedialActionItem> remedialActionItems;
    public Boolean isEditMode = false;
    GPSTrackerEx gps;
    Location cLocation;
    TextView tvAssetType;
    TextView tvDefectCodes;
    ArrayList<String> finalSelectionList = new ArrayList<>();
    ArrayList<String> defectList = new ArrayList<>();
    //Edit text for start and end location
    EditText etStartMp;
    EditText etEndMp;
    LinearLayout llStartMp;
    LinearLayout llEndMp;
    TextView tvStartMp;
    TextView tvEndMp;

    boolean[] tempDefSelection;
    TextView tvPicturesHead;
    TextView tvVoiceHead;
    LinearLayout lyPictures;
    LinearLayout lyVoices;
    // ------Voice Notes------
    RecyclerView rvVoiceNotes;
    ImageButton btVoiceRecord;
    private static final String AUDIO_RECORDER_FILE_EXT_MP3 = ".mp3";
    private static final String AUDIO_RECORDER_FILE_EXT_MP4 = ".mp4";
    private static final String AUDIO_RECORDER_FOLDER = "AudioRecorder";
    private MediaRecorder recorder = null;
    private int currentFormat = 1;
    private int output_formats[] = {MediaRecorder.OutputFormat.MPEG_4, MediaRecorder.OutputFormat.THREE_GPP};
    private String file_exts[] = {AUDIO_RECORDER_FILE_EXT_MP4, AUDIO_RECORDER_FILE_EXT_MP3};
    public String voiceFile;
    ArrayList<IssueVoice> attachmentVoice = new ArrayList<IssueVoice>();
    reportVoiceAdapter voiceAdapter;
    public static final int RECORD_AUDIO = 0;
    Animation animBlink;
    public boolean isRecording = false;
    RadioGroup rgFix;
    LinearLayout llFix;
    public int defectCount;
    TextView tvDefSelectionCount;
    TextView tvDefTotalCount;
    EditText etLocationInfo;
    LinearLayout llTempRestriction;
    EditText etTempSpeedRestriction;
    EditText etIssueTitle;
    RadioGroup rgTypeOfAction;
    RelativeLayout rlRemedialTitle;
    LinearLayout llRemedial;
    RelativeLayout rlTypeOfAction;
    LinearLayout llTypeOfAction;
    RelativeLayout rlFixedTitle;
    LinearLayout llFixedSwitch;
    LinearLayout llFixedContainerOld;
    Spinner spRailDirection;
    List<String> directions = new ArrayList<String>();
    //RelativeLayout rlRailDirectionTitle;
    LinearLayout llRailDirectionContainer;
    LinearLayout llLocationOptional;
    RelativeLayout rlPriorityTitle;
    LinearLayout llPriority;
    CheckBox cbRule;
    boolean isLongPressed = false;
    CheckBox cbDeficiency;
    ImageButton btnSpeak;
    EditText etSpeechToText;
    TextView tvTables;
    private final int REQ_CODE_SPEECH_INPUT = 1001;
    private final int REQ_CODE_CAMERA = 1;
    private final int REQ_CODE_DEFECT_CODE = 11;
    private Res res;
    String initialTime;
    LinearLayout llDefCounter;
    LinearLayout llDefDivider;
    TextView tvDefTitle;
    RelativeLayout rlRuleTitle;
    LinearLayout llRuleContainer;
    LinearLayout llMarkerContainer;
    LinearLayout llMPContainer;
    Spinner spMarkerStart;
    Spinner spMarkerEnd;
    EditText etMarkerStart;
    EditText etMarkerEnd;
    ArrayList<String> markersList = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setLocale(this);
        setContentView(R.layout.activity_report_add);
        //-------------------GPS Code--------------
        myReceiver = new MyReceiver();
        // Check that the user hasn't revoked permissions by going to Settings.
        if (Utils.requestingLocationUpdates(this)) {
           /* if (!checkPermissions()) {
                requestPermissions();
            }*/
        }
        //--------------------END-------------------
        Toolbar toolbar = (Toolbar) findViewById(R.id.reportAddtoolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        tvDefectCodes = (TextView) findViewById(R.id.btnCheckList);
        rvImages = (RecyclerView) findViewById(R.id.horizontal_recycler_view);
        swMarked = (Switch) findViewById(R.id.markedSwitch);
        //reflectDescription = (TextView) findViewById(R.id.reflectDescrTxt);
        ibCapturePic = (ImageButton) findViewById(R.id.captureBtn);
        etDescription = (EditText) findViewById(R.id.reportDescriptionTxt);
        btSave = (Button) findViewById(R.id.saveBtn);
        toolbar.setBackgroundColor(res.getColor(R.color.action_bar_background));
        tvAssetType = (TextView) findViewById(R.id.assetTypeTxt);
        if (gps == null) {
            gps = new GPSTrackerEx(ReportAddActivity.this);
        }
        ListMap.initializeAllLists(this);

        llDefCounter = (LinearLayout) findViewById(R.id.ll_def_counter);
        llDefDivider = (LinearLayout) findViewById(R.id.ll_def_divider);
        tvDefTitle = (TextView) findViewById(R.id.tv_defect_title);

        rlRuleTitle = (RelativeLayout) findViewById(R.id.rl_apply_rule_title);
        llRuleContainer = (LinearLayout) findViewById(R.id.ll_apply_rule);

        tvPicturesHead = (TextView) findViewById(R.id.tv_pic_heading);
        tvVoiceHead = (TextView) findViewById(R.id.tv_voice_heading);
        lyPictures = (LinearLayout) findViewById(R.id.ly_pictures);
        lyVoices = (LinearLayout) findViewById(R.id.ly_voice);
        tvAssetName = (TextView) findViewById(R.id.tv_report_asset_selection_name);
        //rlRailDirectionTitle = (RelativeLayout) findViewById(R.id.ll_rail_direction_title);
        llRailDirectionContainer = (LinearLayout) findViewById(R.id.ll_rail_direction_container);
        llLocationOptional = (LinearLayout) findViewById(R.id.ll_location_info_optional);
        rlPriorityTitle = (RelativeLayout) findViewById(R.id.rl_priority_title);
        llPriority = (LinearLayout) findViewById(R.id.ll_priority);
        cbRule = (CheckBox) findViewById(R.id.cb_rule);
        cbDeficiency = (CheckBox) findViewById(R.id.cb_deficiency);
        // Edit Text for MP
        etStartMp = (EditText) findViewById(R.id.et_mp_start);
        etEndMp = (EditText) findViewById(R.id.et_mp_end);
        llStartMp = (LinearLayout) findViewById(R.id.ll_mp_start);
        llEndMp = (LinearLayout) findViewById(R.id.ll_mp_end);
        tvStartMp = (TextView) findViewById(R.id.tv_title_mp_start);
        tvEndMp = (TextView) findViewById(R.id.tv_title_mp_end);
        etIssueTitle = (EditText) findViewById(R.id.et_title);
        rgTypeOfAction = (RadioGroup) findViewById(R.id.rg_actions_type);
        tvTables = (TextView) findViewById(R.id.tv_tables);

        llMarkerContainer = (LinearLayout) findViewById(R.id.ll_marker_container);
        llMPContainer = (LinearLayout) findViewById(R.id.ll_mp_container);
        spMarkerStart = (Spinner) findViewById(R.id.sp_marker_start);
        spMarkerEnd = (Spinner) findViewById(R.id.sp_marker_end);
        etMarkerStart = (EditText) findViewById(R.id.et_marker_start);
        etMarkerEnd = (EditText) findViewById(R.id.et_marker_end);

        llFix = (LinearLayout) findViewById(R.id.ll_fix);
        //For images taken after fix
        iBtnCaptureAfterFix = (ImageButton) findViewById(R.id.ibtn_capture_after_fix);
        rvRemedialImgs = (RecyclerView) findViewById(R.id.recycler_pics_after_fix);
        etLocationInfo = (EditText) findViewById(R.id.ed_location_info);
        etTempSpeedRestriction = (EditText) findViewById(R.id.ed_speed_restriction);
        llTempRestriction = (LinearLayout) findViewById(R.id.ll_temp_speed_restriction);
        btnSpeak = (ImageButton) findViewById(R.id.btn_speak);
        etSpeechToText = (EditText) findViewById(R.id.ed_voice_info);
        llTempRestriction.setVisibility(GONE);
        // Code for just hiding the unfinished features

        //Start
        rlRemedialTitle = (RelativeLayout) findViewById(R.id.rl_remedial_title);
        rlTypeOfAction = (RelativeLayout) findViewById(R.id.rl_action_type_title);
        llRemedial = (LinearLayout) findViewById(R.id.ll_remedial_action);
        llTypeOfAction = (LinearLayout) findViewById(R.id.ll_action_type);
        rlFixedTitle = (RelativeLayout) findViewById(R.id.rl_fixed_title_old);
        llFixedSwitch = (LinearLayout) findViewById(R.id.ll_fixed_switch_old);
        llFixedContainerOld = (LinearLayout) findViewById(R.id.ll_fix_old);
        rlFixedTitle.setVisibility(GONE);
        llFixedSwitch.setVisibility(GONE);
        llFixedContainerOld.setVisibility(GONE);
        rlTypeOfAction.setVisibility(GONE);
        llTypeOfAction.setVisibility(GONE);
        //End

        //Load location list for markers
        LocationMarkers locMarkers = new LocationMarkers();
        if (locMarkers.getMarkerArray() != null) {
            markersList = locMarkers.getMarkerArray();
        }
        // Setting adapter for markers
        ArrayAdapter<String> LocStartMarkerAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_dropdown_item, markersList);
        spMarkerStart.setAdapter(LocStartMarkerAdapter);
        ArrayAdapter<String> LocEndMarkerAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_dropdown_item, markersList);
        spMarkerEnd.setAdapter(LocEndMarkerAdapter);

        spMarkerStart.setSelection(0, false);
        spMarkerEnd.setSelection(0, false);
        if (markersList == null || markersList.size() == 0) {
            spMarkerStart.setEnabled(false);
            spMarkerEnd.setEnabled(false);
        }
        spMarkerStart.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int pos, long l) {
                try {
                    if (markersList != null && markersList.size() != 0) {
                        etMarkerStart.setText(markersList.get(pos));
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {

            }
        });
        spMarkerEnd.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int pos, long l) {
                try {
                    if (markersList != null && markersList.size() != 0) {
                        etMarkerEnd.setText(markersList.get(pos));
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {

            }
        });
        //Not showing Marker spinner for now
        spMarkerStart.setVisibility(GONE);
        spMarkerEnd.setVisibility(GONE);

        //if yard track is selected or not
        if (selectedUnit.getAssetTypeObj().isMarkerMilepost()) {
            llMarkerContainer.setVisibility(View.VISIBLE);
            llMPContainer.setVisibility(GONE);
            etMarkerStart.setText(selectedUnit.getStartMarker());
            etMarkerEnd.setText(selectedUnit.getEndMarker());
            etMarkerStart.setEnabled(false);
            etMarkerEnd.setEnabled(false);
        } else {
            llMarkerContainer.setVisibility(GONE);
            llMPContainer.setVisibility(View.VISIBLE);
        }

        //---------- Remedial Actions
        spRemedialActions = (Spinner) findViewById(R.id.spinnerRemedialActions);
        llRemedialActionForm = (LinearLayout) findViewById(R.id.remedialActionsForm);
        loadRemedialActions();
        setTitle(R.string.title_activity_report_add);
        // ------Voice Notes------
        // load the animation
        animBlink = AnimationUtils.loadAnimation(this,
                R.anim.blink);
        rvVoiceNotes = (RecyclerView) findViewById(R.id.rv_voice);
        btVoiceRecord = (ImageButton) findViewById(R.id.btn_voice_record);
        rgFix = (RadioGroup) findViewById(R.id.rg_fix_type);
        tvDefSelectionCount = (TextView) findViewById(R.id.tv_defect_select_count);
        tvDefTotalCount = (TextView) findViewById(R.id.tv_defect_total_count);
        spRailDirection = (Spinner) findViewById(R.id.sp_rail_direction);
        // Recording time when "+" is pressed
        initialTime = getUTCdatetimeAsString();
        cbRule.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {

            @Override
            public void onCheckedChanged(CompoundButton buttonView,
                                         boolean isChecked) {
                if (isLongPressed) {
                    isLongPressed = false;
                } else {
                    if (isChecked) {
                        Toast.makeText(ReportAddActivity.this, getString(R.string.long_press_to_activate), Toast.LENGTH_SHORT).show();
                        cbRule.setChecked(false);
                        // Code to display your message.
                    } else {
                        spRemedialActions.setEnabled(true);
                        setEnableRemedialViews(true);
                        iBtnCaptureAfterFix.setEnabled(true);
                        //cbRule.setChecked(false);
                    }
                }
            }
        });
        cbRule.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                isLongPressed = false;
                //Toast.makeText(ReportAddActivity.this, "Please long press to select this option!", Toast.LENGTH_SHORT).show();
            }
        });
        cbRule.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View v) {
                isLongPressed = true;
                if (cbRule.isChecked()) {
                    cbRule.setChecked(false);
                    spRemedialActions.setEnabled(true);
                    setEnableRemedialViews(true);
                    iBtnCaptureAfterFix.setEnabled(true);
                    System.out.println("Apply Rule Un-Checked");
                } else {
                    cbRule.setChecked(true);
                    spRemedialActions.setEnabled(false);
                    setEnableRemedialViews(false);
                    iBtnCaptureAfterFix.setEnabled(false);
                    System.out.println("Apply Rule Checked");
                }
                return true;
            }
        });
        cbDeficiency.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {

            @Override
            public void onCheckedChanged(CompoundButton buttonView,
                                         boolean isChecked) {
                //int defectCount = Integer.parseInt(tvDefSelectionCount.getText().toString());
                int defectCount = defectSelectionCopy.values().size();
                if(defectCount != 0){
                    if(isChecked)
                        Toast.makeText(ReportAddActivity.this, R.string.issue_type_msg, Toast.LENGTH_SHORT).show();
                    cbDeficiency.setChecked(false);
                }

            }
        });


        if (Globals.selectedUnit.getAttributes().getDirectionList().size() != 0) {
            directions = new ArrayList<>(Globals.selectedUnit.getAttributes().getDirectionList());
            //Collections.copy(directions, Globals.selectedUnit.getAttributes().getDirectionList());
        } else {
            directions.add("N/A");
            directions.add("North");
            directions.add("South");
            directions.add("East");
            directions.add("West");
        }
        // Creating adapter for spinner
        ArrayAdapter<String> directionsAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, directions);

        // Drop down layout style - list view with radio button
        directionsAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);

        // attaching data adapter to spinner
        spRailDirection.setAdapter(directionsAdapter);
        spRailDirection.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {

            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });
        btnSpeak.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                promptSpeechInput();
            }
        });
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            btVoiceRecord.setTooltipText(getString(R.string.record_activate_msg));
            btnSpeak.setTooltipText(getString(R.string.speak_to_text_tooltip));
        }
        btVoiceRecord.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.e(getString(R.string.record), getString(R.string.msg_start_recording));
                if (ActivityCompat.checkSelfPermission(getApplication(), Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {

                    ActivityCompat.requestPermissions(ReportAddActivity.this, new String[]{Manifest.permission.RECORD_AUDIO},
                            RECORD_AUDIO);

                } else {
                    if (isRecording) {
                        Log.e(getString(R.string.record), getString(R.string.msg_stop_recording));
                        stopRecording();
                        ViewGroup.LayoutParams layoutParams = btVoiceRecord.getLayoutParams();
                        layoutParams.width = (int) dpToPixel(44);
                        layoutParams.height = (int) dpToPixel(44);
                        btVoiceRecord.setLayoutParams(layoutParams);
                        view.clearAnimation();
                    } else {
                        startRecording();
                        ViewGroup.LayoutParams layoutParams = btVoiceRecord.getLayoutParams();
                        layoutParams.width = (int) dpToPixel(88);
                        layoutParams.height = (int) dpToPixel(88);
                        btVoiceRecord.setLayoutParams(layoutParams);
                        view.startAnimation(animBlink);
                    }

                }
            }
        });
        /*btVoiceRecord.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                // TODO Auto-generated method stub
                switch(event.getAction()){
                    case MotionEvent.ACTION_DOWN:
                        Log.e("Record","Start Recording");
                        if (ActivityCompat.checkSelfPermission(getApplication(), Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {

                            ActivityCompat.requestPermissions(ReportAddActivity.this, new String[]{Manifest.permission.RECORD_AUDIO},
                                    RECORD_AUDIO);

                        } else {
                            startRecording();
                            ViewGroup.LayoutParams layoutParams = btVoiceRecord.getLayoutParams();
                            layoutParams.width = (int)dpToPixel(88);
                            layoutParams.height = (int)dpToPixel(88);
                            btVoiceRecord.setLayoutParams(layoutParams);
                            v.startAnimation(animBlink);
                        }
                        //startRecording();
                        return true;
                    case MotionEvent.ACTION_UP:
                        Log.e("Record","Stop Recording");
                        stopRecording();
                        ViewGroup.LayoutParams layoutParams = btVoiceRecord.getLayoutParams();
                        layoutParams.width = (int)dpToPixel(44);
                        layoutParams.height = (int)dpToPixel(44);
                        btVoiceRecord.setLayoutParams(layoutParams);
                        v.clearAnimation();
                        break;
                        case MotionEvent.ACTION_CANCEL:
                            Log.e("Record","Stop Recording with swipe gesture");
                            stopRecording();
                            ViewGroup.LayoutParams _layoutParams = btVoiceRecord.getLayoutParams();
                            _layoutParams.width = (int)dpToPixel(44);
                            _layoutParams.height = (int)dpToPixel(44);
                            btVoiceRecord.setLayoutParams(_layoutParams);
                            v.clearAnimation();
                            break;
                }
                return false;
            }
        });*/


        tvPicturesHead.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                lyPictures.setVisibility(View.VISIBLE);
            }
        });
        tvVoiceHead.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                lyVoices.setVisibility(View.VISIBLE);
            }
        });
        //Log.d("ERROR_PS19",Globals.wsImgURL.toString());
        String selectedType = Globals.selectedUnit.getAssetType();
        tvAssetType.setText(selectedType);
        //Populating Spinners
        ListMap.loadList(LIST_CATEGORY);
        ListMap.loadList(LIST_PRIORITY);
        //_categoryList = ListMap.getList(LIST_CATEGORY);
        _priorityList = ListMap.getList(LIST_PRIORITY);
        //addCategoriesOnSpinner();
        addPriorityOnSpinner();
        //addTracksOnSpinner();
        tempIssueImgList = new ArrayList<IssueImage>();
        tempIssueVoiceList = new ArrayList<IssueVoice>();
        SpannableString content = new SpannableString(getString(R.string.defects_title));
        content.setSpan(new UnderlineSpan(), 0, content.length(), 0);
        tvDefectCodes.setText(content);

        //Hiding as on customer demand
        llLocationOptional.setVisibility(GONE);
        rlPriorityTitle.setVisibility(GONE);
        llPriority.setVisibility(GONE);


        //setImgAdapter(attachmentImgs);
        defectCount = 0;
        if (Globals.selectedUnit.getAssetTypeObj() != null) {
            if (Globals.selectedUnit.getAssetTypeObj().getDefectCodes() != null) {
                for (int i = 0; i < Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().size(); i++) {
                    //listDataGroup.add(Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().get(i));
                    for (int j = 0; j < Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().get(i).getDetails().size(); j++) {
                        defectCount++;
                    }
                }
            }
        }

        tvTables.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(ReportAddActivity.this, infoTableActivity.class);
                startActivity(intent);
            }
        });
        if (selectedUnit.getAssetTypeClassify().equals("linear")) {
            tvTables.setVisibility(View.VISIBLE);
        } else {
            tvTables.setVisibility(GONE);
        }
        //Hiding this button in every case as per client request
        tvTables.setVisibility(GONE);

        tvDefTotalCount.setText(String.valueOf(defectCount));
        defectList = Globals.defectCodeList;
        tvAssetName.setText(Globals.selectedUnit.getDescription());
        tvDefectCodes.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (!cbDeficiency.isChecked()) {
                    if (Globals.selectedUnit.getAssetTypeObj() != null) {
                        if (Globals.selectedUnit.getAssetTypeObj().getDefectCodes() != null) {
                            Intent intent = new Intent(ReportAddActivity.this, DefectCodeActivity.class);
                            startActivityForResult(intent, REQ_CODE_DEFECT_CODE);
                            //startActivity(intent);
                        } else {
                            Toast.makeText(ReportAddActivity.this, getString(R.string.no_def_code), Toast.LENGTH_SHORT).show();
                        }
                    } else {
                        Toast.makeText(ReportAddActivity.this, getString(R.string.no_def_code), Toast.LENGTH_SHORT).show();
                    }
                } else {
                    Toast.makeText(ReportAddActivity.this, getString(R.string.issue_type_msg), Toast.LENGTH_SHORT).show();
                }


            }
        });
        if (isUseRailDirection) {
            if (Globals.selectedUnit.getAttributes().isShowDirection()) {
                llRailDirectionContainer.setVisibility(View.VISIBLE);
            } else {
                llRailDirectionContainer.setVisibility(GONE);
            }
        } else {
            llRailDirectionContainer.setVisibility(GONE);
        }
        if (Globals.newReport == null) {
            //Activity in edit mode
            if (isIssueUpdateAllowed) {

                try {
                    spRailDirection.setSelection(directionsAdapter.getPosition(Globals.selectedReport.getRailDirection()));
                } catch (Exception e) {
                    e.printStackTrace();
                }
                int btnCount = rgTypeOfAction.getChildCount();
                ArrayList<RadioButton> listOfRadioButtons = new ArrayList<RadioButton>();
                for (int i = 0; i < btnCount; i++) {
                    View o = rgTypeOfAction.getChildAt(i);
                    if (o instanceof RadioButton) {
                        if (((RadioButton) o).getText().equals(Globals.selectedReport.getTypeOfAction())) {
                            ((RadioButton) o).setChecked(true);
                        }
                        //listOfRadioButtons.add((RadioButton)o);
                    }
                }
                etLocationInfo.setText(Globals.selectedReport.getLocationInfo());
                Globals.issueTitle = Globals.selectedReport.getTitle();
                etIssueTitle.setText(Globals.issueTitle);
                for (IssueImage imgObj : Globals.selectedReport.getImgList()) {
                    if (imgObj.getTag() != null) {
                        if (!imgObj.getTag().equals("")) {
                            if (imgObj.getTag().equals(TAG_BEFORE_FIX)) {
                                beforeImgs.add(imgObj);
                            } else if (imgObj.getTag().equals(TAG_AFTER_FIX)) {
                                afterImgs.add(imgObj);
                            }
                        }

                    }
                }
                if (Globals.selectedReport.getUnit().getAssetTypeObj() == null) {
                    if (Globals.selectedReport.getUnit().getAssetTypeClassify().equals(ASSET_TYPE_LINEAR)) {
                        setLinearAssetInEditMode();
                    } else if (Globals.selectedReport.getUnit().getAssetTypeClassify().equals(ASSET_TYPE_FIXED)) {
                        setFixedAssetInEditMode();
                    }
                } else {
                    if (Globals.selectedReport.getUnit().getAssetTypeObj().getAssetTypeClassify().equals(ASSET_TYPE_LINEAR)) {
                        setLinearAssetInEditMode();
                    } else if (Globals.selectedReport.getUnit().getAssetTypeObj().getAssetTypeClassify().equals(ASSET_TYPE_FIXED)) {
                        setFixedAssetInEditMode();
                    }
                }
            /*if (Globals.selectedReport.getUnit().getAssetTypeObj().getAssetTypeClassify().equals(ASSET_TYPE_LINEAR)) {
                etStartMp.setHint(Globals.selectedUnit.getStart());
                etEndMp.setHint(Globals.selectedUnit.getEnd());
                etStartMp.setText(Globals.selectedReport.getStartMp());
                etEndMp.setText(Globals.selectedReport.getEndMp());
                //Setting Placeholder if saved value is empty in any case
                if (Globals.selectedReport.getStartMp().equals("")) {
                    etStartMp.setHint(Globals.selectedUnit.getStart());
                }
                if (Globals.selectedReport.getEndMp().equals("")) {
                    etEndMp.setHint(Globals.selectedUnit.getEnd());
                }
                etStartMp.setFilters(new InputFilter[]{new MinMaxInputFilter(Double.parseDouble(Globals.selectedUnit.getStart()), Double.parseDouble(Globals.selectedUnit.getEnd()))});
                etEndMp.setFilters(new InputFilter[]{new MinMaxInputFilter(Double.parseDouble(Globals.selectedUnit.getStart()), Double.parseDouble(Globals.selectedUnit.getEnd()))});

            } else if (Globals.selectedUnit.getAssetTypeObj().getAssetTypeClassify().equals(ASSET_TYPE_FIXED)) {
                llEndMp.setVisibility(View.GONE);
                tvStartMp.setText("Milepost");
                etStartMp.setText(Globals.selectedReport.getStartMp());
                etStartMp.setEnabled(false);
            }*/
                //defectList = Globals.selectedReport.getCheckList();
            /*for(int i = 0; i < defectList.size(); i++){
                tempDefSelection.add(false);
            }*/

                try {
                    if (Globals.selectedUnit.getAssetTypeObj() != null) {
                        if (Globals.selectedUnit.getAssetTypeObj().getDefectCodes() != null && Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().size() > 0) {
                            if (Globals.selectedReport.getDefectCodes().size() > 0) {
                                Globals.defectCodeSelection = Globals.selectedReport.getDefectCodes();
                            } else {
                                if (Globals.defectCodeSelection == null) {
                                    Globals.defectCodeSelection = new ArrayList<>();
                                }
                                Globals.defectCodeSelection.clear();
                                for (int i = 0; i < Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().size(); i++) {
                                    for (int j = 0; j < Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().get(i).getDetails().size(); j++) {
                                        Globals.defectCodeSelection.add("");
                                    }
                                }
                            }
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }

                if (defectList != null) {
                    tempDefSelection = new boolean[defectList.size()];
                    Arrays.fill(tempDefSelection, Boolean.FALSE);
                    if (Globals.selectedReport.getCheckList().size() == 0) {
                        for (int i = 0; i < defectList.size(); i++) {
                            finalSelectionList.add("");
                        }
                    } else {
                        finalSelectionList = Globals.selectedReport.getCheckList();
                    }

                    if (Globals.selectedReport.getCheckList().size() != 0) {
                        for (int i = 0; i < Globals.selectedReport.getCheckList().size(); i++) {
                            if (!Globals.selectedReport.getCheckList().get(i).equals("")) {
                                tempDefSelection[i] = true;
                            }
                        }
                    }
                }
                if (Globals.defectCodeSelection != null) {
                    Log.d("Defect Code", String.valueOf(Globals.defectCodeSelection.size()));
                    if (Globals.defectCodeSelection.size() == 0) {
                        tvDefSelectionCount.setText("0");
                        Log.d("Defect Code", String.valueOf(Globals.defectCodeSelection.size()) + "ZERO");
                    } else {
                        int count = 0;
                        for (int i = 0; i < Globals.defectCodeSelection.size(); i++) {
                            if (!Globals.defectCodeSelection.get(i).equals("")) {
                                count++;
                            }
                        }
                        Log.d("Defect Code size", String.valueOf(count));
                        tvDefSelectionCount.setText(String.valueOf(count));
                    }
                }

                String descriptionTxt = Globals.selectedReport.getDescription();
                isMarked = Globals.selectedReport.getMarked();
                String priority = Globals.selectedReport.getPriority();
                attachmentVoice = Globals.selectedReport.getVoiceList();
                setSpinner(priAdapter, spPriority, priority);
                swMarked.setChecked(isMarked);
                etDescription.setText(descriptionTxt);
                fixType = Globals.selectedReport.getFixType();
                if (swMarked.isChecked()) {
                    if (Globals.selectedReport.getFixType().equals(FIX_TYPE_TEMPORARY)) {
                        rgFix.check(rgFix.getChildAt(0).getId());
                        llTempRestriction.setVisibility(View.VISIBLE);
                        etTempSpeedRestriction.setText(Globals.selectedReport.getTempSpeed());
                    } else if (Globals.selectedReport.getFixType().equals(FIX_TYPE_PERMANENT)) {
                        rgFix.check(rgFix.getChildAt(1).getId());
                        llTempRestriction.setVisibility(GONE);
                    }
                }
                etStartMp.setText(Globals.selectedReport.getStartMp());
                etEndMp.setText(Globals.selectedReport.getEndMp());
                if (Globals.selectedReport.getIssueType().equals(DEFICIENCY_TYPE)) {
                    cbDeficiency.setChecked(true);
                }
                if (Globals.selectedReport.isRuleApplied()) {
                    isLongPressed = true;
                    cbRule.setChecked(true);

                }
                etSpeechToText.setText(selectedReport.getVoiceNotes());
                btSave.setText(R.string.title_new_report_btn_edit);
            } else {
                // Activity in ViewOnly Mode
                defectCount = 0;
                if (selectedReport.getUnit().getAssetTypeObj() != null) {
                    if (selectedReport.getUnit().getAssetTypeObj().getDefectCodes() != null) {
                        for (int i = 0; i < selectedReport.getUnit().getAssetTypeObj().getDefectCodes().getDetails().size(); i++) {
                            //listDataGroup.add(Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().get(i));
                            for (int j = 0; j < selectedReport.getUnit().getAssetTypeObj().getDefectCodes().getDetails().get(i).getDetails().size(); j++) {
                                defectCount++;
                            }
                        }
                    }
                }
                tvDefTotalCount.setText(String.valueOf(defectCount));
                if (Globals.selectedReport.getUnit().getAssetTypeObj() == null) {
                    if (Globals.selectedReport.getUnit().getAssetTypeClassify().equals(ASSET_TYPE_LINEAR)) {
                        setLinearAssetInEditMode();
                    } else if (Globals.selectedReport.getUnit().getAssetTypeClassify().equals(ASSET_TYPE_FIXED)) {
                        setFixedAssetInEditMode();
                    }
                } else {
                    if (Globals.selectedReport.getUnit().getAssetTypeObj().getAssetTypeClassify().equals(ASSET_TYPE_LINEAR)) {
                        setLinearAssetInEditMode();
                    } else if (Globals.selectedReport.getUnit().getAssetTypeObj().getAssetTypeClassify().equals(ASSET_TYPE_FIXED)) {
                        setFixedAssetInEditMode();
                    }
                }
                etStartMp.setEnabled(false);
                try {
                    etEndMp.setEnabled(false);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                // Setting markers
                if (selectedReport.getUnit().getAssetTypeObj().isMarkerMilepost()) {
                    llMarkerContainer.setVisibility(View.VISIBLE);
                    llMPContainer.setVisibility(GONE);
                } else {
                    llMarkerContainer.setVisibility(GONE);
                    llMPContainer.setVisibility(View.VISIBLE);
                }
                etMarkerStart.setText(selectedReport.getStartMarker());
                etMarkerEnd.setText(selectedReport.getEndMarker());
                etMarkerStart.setEnabled(false);
                etMarkerEnd.setEnabled(false);
                spMarkerStart.setVisibility(GONE);
                spMarkerEnd.setVisibility(GONE);

                tvAssetType.setText(selectedReport.getUnit().getAssetType());
                tvAssetName.setText(selectedReport.getUnit().getDescription());
                if (isUseRailDirection) {
                    if (selectedReport.getUnit().getAttributes().isShowDirection()) {
                        // rlRailDirectionTitle.setVisibility(View.VISIBLE);
                        llRailDirectionContainer.setVisibility(View.VISIBLE);
                    } else {
                        // rlRailDirectionTitle.setVisibility(View.GONE);
                        llRailDirectionContainer.setVisibility(GONE);
                    }
                } else {
                    // rlRailDirectionTitle.setVisibility(View.GONE);
                    llRailDirectionContainer.setVisibility(GONE);
                }
                spRailDirection.setSelection(directionsAdapter.getPosition(Globals.selectedReport.getRailDirection()));
                spRailDirection.setEnabled(false);
                tvDefectCodes.setOnClickListener(null);
                try {
                    if (Globals.selectedReport.getUnit().getAssetTypeObj() != null) {
                        if (Globals.selectedReport.getUnit().getAssetTypeObj().getDefectCodes() != null && Globals.selectedReport.getUnit().getAssetTypeObj().getDefectCodes().getDetails().size() > 0) {
                            if (Globals.selectedReport.getDefectCodes().size() > 0) {
                                Globals.defectCodeSelection = Globals.selectedReport.getDefectCodes();
                            } else {
                                if (Globals.defectCodeSelection == null) {
                                    Globals.defectCodeSelection = new ArrayList<>();
                                }
                                Globals.defectCodeSelection.clear();
                                for (int i = 0; i < Globals.selectedReport.getUnit().getAssetTypeObj().getDefectCodes().getDetails().size(); i++) {
                                    for (int j = 0; j < Globals.selectedReport.getUnit().getAssetTypeObj().getDefectCodes().getDetails().get(i).getDetails().size(); j++) {
                                        Globals.defectCodeSelection.add("");
                                    }
                                }
                            }
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                if (defectList != null) {
                    tempDefSelection = new boolean[defectList.size()];
                    Arrays.fill(tempDefSelection, Boolean.FALSE);
                    if (Globals.selectedReport.getCheckList().size() == 0) {
                        for (int i = 0; i < defectList.size(); i++) {
                            finalSelectionList.add("");
                        }
                    } else {
                        finalSelectionList = Globals.selectedReport.getCheckList();
                    }

                    if (Globals.selectedReport.getCheckList().size() != 0) {
                        for (int i = 0; i < Globals.selectedReport.getCheckList().size(); i++) {
                            if (!Globals.selectedReport.getCheckList().get(i).equals("")) {
                                tempDefSelection[i] = true;
                            }
                        }
                    }
                }
                if (Globals.defectCodeSelection != null) {
                    Log.d("Defect Code", String.valueOf(Globals.defectCodeSelection.size()));
                    if (Globals.defectCodeSelection.size() == 0) {
                        tvDefSelectionCount.setText("0");
                        Log.d("Defect Code", String.valueOf(Globals.defectCodeSelection.size()) + "ZERO");
                    } else {
                        int count = 0;
                        for (int i = 0; i < Globals.defectCodeSelection.size(); i++) {
                            if (!Globals.defectCodeSelection.get(i).equals("")) {
                                count++;
                            }
                        }
                        Log.d("Defect Code size", String.valueOf(count));
                        tvDefSelectionCount.setText(String.valueOf(count));
                    }
                }
                if (selectedReport.getIssueType().equals(DEFICIENCY_TYPE)) {
                    cbDeficiency.setChecked(true);
                } else if (selectedReport.getIssueType().equals(DEFECT_TYPE)) {
                    cbDeficiency.setChecked(false);
                }
                cbDeficiency.setEnabled(false);

                if (selectedReport.isRuleApplied()) {
                    isLongPressed = true;
                    cbRule.setChecked(true);
                } else {
                    cbRule.setChecked(false);
                }
                cbRule.setEnabled(false);
                etIssueTitle.setText(selectedReport.getTitle());
                etIssueTitle.setEnabled(false);
                etDescription.setText(selectedReport.getDescription());
                etDescription.setEnabled(false);
                for (IssueImage imgObj : Globals.selectedReport.getImgList()) {
                    if (imgObj.getTag() != null) {
                        if (!imgObj.getTag().equals("")) {
                            if (imgObj.getTag().equals(TAG_BEFORE_FIX)) {
                                beforeImgs.add(imgObj);
                            } else if (imgObj.getTag().equals(TAG_AFTER_FIX)) {
                                afterImgs.add(imgObj);
                            }
                        }
                    }
                }
                iBtnCaptureAfterFix.setVisibility(GONE);
                ibCapturePic.setVisibility(GONE);
                attachmentVoice = Globals.selectedReport.getVoiceList();
                btVoiceRecord.setVisibility(GONE);
                btnSpeak.setEnabled(false);
                etSpeechToText.setText(selectedReport.getVoiceNotes());
                etSpeechToText.setEnabled(false);
                btSave.setVisibility(GONE);
            }
        } else {
            // Setting location at initial step req by JD
            Globals.newReport.setLocation(getLocation());
            //lyVoices.setVisibility(View.GONE);
            //lyPictures.setVisibility(View.GONE);

            if (Globals.selectedUnit.getAssetTypeClassify().equals(ASSET_TYPE_LINEAR)) {
                setLinearAssetMode();
            } else if (Globals.selectedUnit.getAssetTypeClassify().equals(ASSET_TYPE_FIXED)) {
                setFixedAssetMode();
            }
            fixType = "";
            if (!Globals.selectedCategory.equals("")) {
                // setSpinner(catAdapter, categorySpinner, Globals.selectedCategory);
            }
            if (defectList != null) {
                finalSelectionList = new ArrayList<>(Arrays.asList(new String[defectList.size()]));
                Collections.fill(finalSelectionList, "");
                tempDefSelection = new boolean[defectList.size()];
                Arrays.fill(tempDefSelection, Boolean.FALSE);
            }
            if (Globals.selectedUnit.getAssetTypeObj() != null) {
                if (Globals.selectedUnit.getAssetTypeObj().getDefectCodes() != null) {
                    Globals.defectCodeSelection = new ArrayList<>();
                    for (int i = 0; i < Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().size(); i++) {
                        for (int j = 0; j < Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().get(i).getDetails().size(); j++) {
                            Globals.defectCodeSelection.add("");
                        }
                    }
                }
            }

            //setSpinner(trkAdapter, trackSpinner, Globals.selectedUnit.getDescription());
            btSave.setText(R.string.title_new_report_btn_save);
        }

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            ibCapturePic.setEnabled(false);
            iBtnCaptureAfterFix.setEnabled(false);
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE}, 0);
        }
        StrictMode.VmPolicy.Builder builder = new StrictMode.VmPolicy.Builder();
        StrictMode.setVmPolicy(builder.build());
        //Commenting as logic changed
        /*if (isMarked) {
            llFix.setVisibility(View.VISIBLE);
        } else {
            llFix.setVisibility(View.GONE);
        }*/
        //Is now actually Fix on Site
        swMarked.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if (isChecked) {
                    llFix.setVisibility(View.VISIBLE);
                    isMarked = true;
                    rgFix.check(rgFix.getChildAt(0).getId());
                    fixType = FIX_TYPE_TEMPORARY;
                    llTempRestriction.setVisibility(View.VISIBLE);
                } else {
                    llFix.setVisibility(GONE);
                    isMarked = false;
                    llTempRestriction.setVisibility(GONE);
                    etTempSpeedRestriction.setText("");
                }
            }
        });
        rgFix.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {

            @Override
            public void onCheckedChanged(RadioGroup group, int checkedId) {

                View radioButton = rgFix.findViewById(checkedId);
                int index = rgFix.indexOfChild(radioButton);

                // Add logic here
                switch (index) {
                    case 0: // first button
                        fixType = FIX_TYPE_TEMPORARY;
                        llTempRestriction.setVisibility(View.VISIBLE);
                        if (Globals.newReport == null) {
                            etTempSpeedRestriction.setText(Globals.selectedReport.getTempSpeed());
                        }
                        //Toast.makeText(getApplicationContext(), "Selected button number " + index, Toast.LENGTH_LONG).show();
                        break;
                    case 1: // second button
                        fixType = FIX_TYPE_PERMANENT;
                        llTempRestriction.setVisibility(GONE);
                        //Toast.makeText(getApplicationContext(), "Selected button number " + index, Toast.LENGTH_LONG).show();
                        break;
                }
            }
        });
        //description.addTextChangedListener(inputTextWatcher);
        etStartMp.addTextChangedListener(mpTextWatcher);
        /*etStartMp.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                if(hasFocus){
                    isMpRepAllowed = true;
                } else {
                    isMpRepAllowed = false;
                }
            }
        });*/
        isEditMode = (Globals.selectedReport != null);
        btSave.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String descriptionTxt = etDescription.getText().toString();
                String titleTxt = etIssueTitle.getText().toString();
                //String category = categorySpinner.getSelectedItem().toString();
                attachmentImgs.clear();
                attachmentImgs.addAll(beforeImgs);
                attachmentImgs.addAll(afterImgs);
                // get selected radio button from radioGroup
                int selectedId = rgTypeOfAction.getCheckedRadioButtonId();

                // find the radiobutton by returned id
                RadioButton selectedAction = (RadioButton) findViewById(selectedId);

                /*if (prioritySpinner.getSelectedItem() == null) {
                    Toast.makeText(ReportAddActivity.this, getString(R.string.select_priority), Toast.LENGTH_SHORT).show();
                    return;
                }*/
                if (descriptionTxt.trim().equals("")) {
                    Toast.makeText(ReportAddActivity.this, getResources().getString(R.string.select_description), Toast.LENGTH_SHORT).show();
                    return;
                }
                if (titleTxt.trim().equals("")) {
                    Toast.makeText(ReportAddActivity.this, getResources().getString(R.string.req_title_msg), Toast.LENGTH_SHORT).show();
                    return;
                }
                int defectCount = Integer.parseInt(tvDefSelectionCount.getText().toString());

                if (defectCount == 0 && !cbDeficiency.isChecked()) {
                    Toast.makeText(ReportAddActivity.this, getResources().getString(R.string.issue_type_req_msg), Toast.LENGTH_SHORT).show();
                    return;
                }

                // No more needed as its now dynamic
               /* if (selectedId==-1){
                    Toast.makeText(ReportAddActivity.this, "Please select Type of Action", Toast.LENGTH_SHORT).show();
                    return;
                }*/
                if (!selectedUnit.getAssetTypeObj().isMarkerMilepost()) {
                    // If using MP
                    if (etStartMp.getText().toString().equals("")) {
                        Toast.makeText(ReportAddActivity.this, getResources().getText(R.string.toast_start_mile_post), Toast.LENGTH_SHORT).show();
                        etStartMp.setFocusable(true);
                        etStartMp.setFocusableInTouchMode(true);
                        etStartMp.requestFocus();
                        InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
                        imm.showSoftInput(etStartMp, InputMethodManager.SHOW_IMPLICIT);
                        return;
                    } else {
                        if (!isInRange(Double.parseDouble(Globals.selectedUnit.getStart()), Double.parseDouble(Globals.selectedUnit.getEnd()), Double.parseDouble(etStartMp.getText().toString()))) {
                            Toast.makeText(ReportAddActivity.this, getResources().getText(R.string.toast_start_milepost), Toast.LENGTH_LONG).show();
                            return;
                        }
                    }
                    if (Globals.selectedUnit.getAssetTypeClassify().equals(ASSET_TYPE_LINEAR)) {
                        if (etEndMp.getText().toString().equals("")) {
                            Toast.makeText(ReportAddActivity.this, getResources().getText(R.string.toast_end_milepost), Toast.LENGTH_SHORT).show();
                            etEndMp.setFocusable(true);
                            etEndMp.setFocusableInTouchMode(true);
                            etEndMp.requestFocus();
                            InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
                            imm.showSoftInput(etEndMp, InputMethodManager.SHOW_IMPLICIT);
                            return;
                        } else {
                            if (!isInRange(Double.parseDouble(Globals.selectedUnit.getStart()), Double.parseDouble(Globals.selectedUnit.getEnd()), Double.parseDouble(etEndMp.getText().toString()))) {
                                Toast.makeText(ReportAddActivity.this, getResources().getText(R.string.toast_range_milepost), Toast.LENGTH_LONG).show();
                                return;
                            }
                        }
                    }
                }  // If using Markers
                /*if (etMarkerStart.getText().toString().equals("")) {
                        Toast.makeText(ReportAddActivity.this, getString(R.string.start_marker_req), Toast.LENGTH_SHORT).show();
                        return;
                    }
                    if(etMarkerEnd.getText().toString().equals("")){
                        Toast.makeText(ReportAddActivity.this, getString(R.string.end_marker_req), Toast.LENGTH_SHORT).show();
                        return;
                    }*/
                if (appName.equals(Globals.AppName.TIMPS)) {
                    if (!cbDeficiency.isChecked() && !cbRule.isChecked()) {
                        if (spRemedialActions.getSelectedItemPosition() == 0) {
                            Toast.makeText(ReportAddActivity.this, getString(R.string.select_remedial_action), Toast.LENGTH_SHORT).show();
                            return;
                        }
                    }
                }
                RemedialActions ra = null;
                String remedialAction = "";
                ArrayList<RemedialActionItem> rItems = null;
                if (appName.equals(Globals.AppName.TIMPS) && (!cbDeficiency.isChecked() && !cbRule.isChecked())) {
                    ra = remedialActions.get(spRemedialActions.getSelectedItemPosition() - 1);
                    remedialAction = spRemedialActions.getSelectedItem().toString();
                    rItems = ra.getRemedialActionItems();
                    if (!ra.errorMessage.equals("")) {
                        Toast.makeText(ReportAddActivity.this, ra.errorMessage, Toast.LENGTH_LONG).show();
                        return;
                    }
                } else {
                    if (spRemedialActions.getSelectedItemPosition() != 0) {
                        ra = remedialActions.get(spRemedialActions.getSelectedItemPosition() - 1);
                        remedialAction = spRemedialActions.getSelectedItem().toString();
                        rItems = ra.getRemedialActionItems();
                    }
                }
                // if rule is applied
                if(cbRule.isChecked()){
                    rItems = null;
                    remedialAction = "";
                }
                //String priority = prioritySpinner.getSelectedItem().toString();
                //Setting priority empty as requested by client
                String priority = "";

                //String categoryTxt = categorySpinner.getSelectedItem().toString();
                String trackTxt = "";
                /*if(trackSpinner.getSelectedItem()!=null){
                    trackTxt= trackSpinner.getSelectedItem().toString();
                }*/
                for (int index = 0; index < tempIssueImgList.size(); index++) {
                    try {
                        File file = new File(getImgPath(tempIssueImgList.get(index).getImgName()));
                        file.delete();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                /*for (int index = 0; index < tempIssueVoiceList.size(); index++) {
                    try {
                        File file = new File(getImgPath(tempIssueVoiceList.get(index).getVoiceName()));
                        file.delete();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }*/
                Boolean _isMarked = isMarked;
                Report report = Globals.selectedReport;
                ArrayList<String> codes = new ArrayList<>();

                if (report == null) {
                    //New Issue
                    report = new Report();

                    if(selectedCode !=null && !selectedCode.equals("")){
                        codes.add(selectedCode);
                    }
                    report.setReportIndex(Globals.selectedTask.getReportList().size());
                    // generating unique id for this issue
                    UUID uuid = UUID.randomUUID();

                    //report.setCategory(categoryTxt);
                    /*if(!Globals.issueTitle.equals("")){
                        String[] _title = Globals.issueTitle.split(Globals.defectDivider);
                        Globals.issueTitle = _title[1].trim();
                    }*/
                    report.setTitle(etIssueTitle.getText().toString());
                    //Setting unique id
                    report.setIssueId(uuid.toString());
                    //report.setTypeOfAction(selectedAction.getText().toString());
                    report.setPriority(priority);
                    report.setTrackId(Globals.selectedUnit.getDescription());
                    report.setDescription(descriptionTxt);
                    report.setMarked(_isMarked);
                    report.setLocation(Globals.newReport.getLocation());
                    report.setImgList(attachmentImgs);
                    report.setVoiceList(attachmentVoice);
                    report.setUnit(Globals.selectedUnit.makeClone());
                    //Assigning time when button was pressed
                    report.setTimeStamp(initialTime);
                    report.setCheckList(finalSelectionList);
                    report.setDefectCodes(codes);
                    report.setLocationInfo(etLocationInfo.getText().toString());
                    report.setTempSpeed(etTempSpeedRestriction.getText().toString());
                    report.setRemedialActionItems(rItems);
                    report.setRemedialAction(remedialAction);
                    report.setRuleApplied(cbRule.isChecked());
                    report.setLocationUnit(Globals.selectedPostSign);
                    report.setVoiceNotes(etSpeechToText.getText().toString());
                    if (cbDeficiency.isChecked()) {
                        report.setIssueType(Globals.DEFICIENCY_TYPE);
                    } else {
                        report.setIssueType(Globals.DEFECT_TYPE);
                    }
                    if (isUseRailDirection) {
                        try {
                            if (Globals.selectedUnit.getAttributes().isShowDirection()) {
                                report.setRailDirection(spRailDirection.getSelectedItem().toString());
                            } else {
                                report.setRailDirection("None");
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    } else {
                        report.setRailDirection("None");
                    }

                    if (isMarked) {
                        report.setFixType(fixType);
                    } else {
                        report.setFixType("");
                    }
                    if (selectedUnit.getAssetTypeObj().isMarkerMilepost()) {
                        if (etMarkerStart.getText().toString().equals("")) {
                            report.setStartMarker("(N/A)");
                        } else {
                            report.setStartMarker(etMarkerStart.getText().toString());
                        }
                        if (etMarkerEnd.getText().toString().equals("")) {
                            report.setEndMarker("(N/A)");
                        } else {
                            report.setEndMarker(etMarkerEnd.getText().toString());
                        }
                    } else {
                        report.setStartMp(etStartMp.getText().toString());
                        if (Globals.selectedUnit.getAssetTypeClassify().equals(ASSET_TYPE_LINEAR)) {
                            report.setEndMp(etEndMp.getText().toString());
                        } else if (Globals.selectedUnit.getAssetTypeClassify().equals(ASSET_TYPE_FIXED)) {
                            report.setEndMp(etStartMp.getText().toString());
                        }
                    }

                    Globals.selectedTask = Globals.selectedJPlan.getTaskById(Globals.selectedTask.getTaskId());
                    Globals.selectedTask.getReportList().add(report);
                    int count = Integer.parseInt(Globals.selectedUnit.getIssueCounter());
                    count++;
                    Globals.selectedUnit.setIssueCounter(String.valueOf(count));
                    //Globals.selectedTask.getReportList().add(report);
                } else {
                    /*String[] _title = Globals.issueTitle.split(Globals.defectDivider);
                    if(_title.length>0){
                        Globals.issueTitle = _title[1].trim();
                    }*/

                    for (Task task : Globals.selectedJPlan.getTaskList()) {
                        if (task.getTaskId().equals(Globals.selectedTask.getTaskId())) {
                            for (Report _report : task.getReportList()) {
                                //if condition was incorrect, was not comparing correctly
                                if (_report.getTimeStamp().equals(Globals.selectedReport.getTimeStamp())) {

                                    _report.setPriority(priority);
                                    _report.setTrackId(Globals.selectedUnit.getDescription());
                                    _report.setDescription(descriptionTxt);
                                    _report.setMarked(_isMarked);
                                    _report.setLocation(getGpsCoordinates());
                                    //Assigning time when button was pressed
                                    _report.setTimeStamp(initialTime);
                                    _report.setUnit(Globals.selectedUnit.makeClone());
                                    /*if (tempIssueImgList.size() > 0) {
                                        for (int index = 0; index < tempIssueImgList.size(); index++) {
                                            attachmentImgs.add(new IssueImage());
                                        }
                                    }
                                    if (tempIssueVoiceList.size() > 0) {
                                        for (int index = 0; index < tempIssueVoiceList.size(); index++) {
                                            attachmentVoice.add(new IssueVoice());
                                        }
                                    }*/
                                    //_report.setTypeOfAction(selectedAction.getText().toString());
                                    _report.setTitle(etIssueTitle.getText().toString());
                                    _report.setVoiceList(attachmentVoice);
                                    _report.setImgList(attachmentImgs);
                                    _report.setCheckList(finalSelectionList);
                                    _report.setDefectCodes(codes);
                                    _report.setLocationInfo(etLocationInfo.getText().toString());
                                    _report.setTempSpeed(etTempSpeedRestriction.getText().toString());
                                    _report.setRuleApplied(cbRule.isChecked());
                                    _report.setVoiceNotes(etSpeechToText.getText().toString());
                                    _report.setLocationUnit(Globals.selectedPostSign);
                                    //Setting markers data
                                    if (selectedUnit.getAssetTypeObj().isMarkerMilepost()) {
                                        if (etMarkerStart.getText().toString().equals("")) {
                                            _report.setStartMarker("(N/A)");
                                        } else {
                                            _report.setStartMarker(etMarkerStart.getText().toString());
                                        }
                                        if (etMarkerEnd.getText().toString().equals("")) {
                                            _report.setEndMarker("(N/A)");
                                        } else {
                                            _report.setEndMarker(etMarkerEnd.getText().toString());
                                        }
                                    } else {
                                        _report.setStartMp(etStartMp.getText().toString());
                                        if (Globals.selectedUnit.getAssetTypeClassify().equals(ASSET_TYPE_LINEAR)) {
                                            _report.setEndMp(etEndMp.getText().toString());
                                        } else if (Globals.selectedUnit.getAssetTypeClassify().equals(ASSET_TYPE_FIXED)) {
                                            _report.setEndMp(etStartMp.getText().toString());
                                        }
                                    }

                                    if (cbDeficiency.isChecked()) {
                                        _report.setIssueType(DEFICIENCY_TYPE);
                                    } else {
                                        _report.setIssueType(DEFECT_TYPE);
                                    }
                                    if (isUseRailDirection) {
                                        try {
                                            if (Globals.selectedUnit.getAttributes().isShowDirection()) {
                                                _report.setRailDirection(spRailDirection.getSelectedItem().toString());
                                            } else {
                                                _report.setRailDirection("None");
                                            }
                                        } catch (Exception e) {
                                            e.printStackTrace();
                                        }
                                    } else {
                                        _report.setRailDirection("None");
                                    }

                                    if (isMarked) {
                                        _report.setFixType(fixType);
                                    } else {
                                        _report.setFixType("");
                                    }
                                    _report.setRemedialActionItems(rItems);
                                    _report.setRemedialAction(remedialAction);
                                }
                            }
                        }
                    }
                }
                if(defectSelection.size() > 0){
                    if(createRemainingDefects(report)){
                        Globals.selectedJPlan.update();
                        Globals.defectCodeSelection = new ArrayList<>();
                        Globals.issueTitle = "";
                        Globals.defectCodeDetails = new ArrayList<>();
                        defectSelection.clear();
                        defectSelectionCopy.clear();
                        selectedCode = "";
                        //finishActivity(SECOND_ACTIVITY_REQUEST_CODE);
                        Intent data = new Intent();
                        data.setData(Uri.parse(ADAPTER_REFRESH_MSG));
                        setResult(RESULT_OK, data);
                        finish();
                    }
                } else {
                    Globals.selectedJPlan.update();
                    Globals.defectCodeSelection = new ArrayList<>();
                    Globals.issueTitle = "";
                    Globals.defectCodeDetails = new ArrayList<>();
                    defectSelection.clear();
                    defectSelectionCopy.clear();
                    selectedCode = "";
                    //finishActivity(SECOND_ACTIVITY_REQUEST_CODE);
                    Intent data = new Intent();
                    data.setData(Uri.parse(ADAPTER_REFRESH_MSG));
                    setResult(RESULT_OK, data);
                    finish();
                }

            }
        });
        ibCapturePic.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
              /*  Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                try {
                    Globals.issueImgFileUri = Uri.fromFile(getOutputMediaFile());
                    intent.putExtra(MediaStore.EXTRA_OUTPUT, Globals.issueImgFileUri);
                    intent.putExtra(android.provider.MediaStore.EXTRA_SIZE_LIMIT, "720000");
                    if (intent.resolveActivity(getPackageManager()) != null) {
                        startActivityForResult(intent, 100);
                    }

                } catch (Exception e) {
                    e.printStackTrace();
                }*/
                Globals.currentImageTag = TAG_BEFORE_FIX;
                Intent intent = new Intent(ReportAddActivity.this, CameraActivity.class);
                startActivityForResult(intent, REQ_CODE_CAMERA);
            }
        });

        iBtnCaptureAfterFix.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Globals.currentImageTag = TAG_AFTER_FIX;
                Intent intent = new Intent(ReportAddActivity.this, CameraActivity.class);
                startActivityForResult(intent, REQ_CODE_CAMERA);
                //startActivity(intent);
            }
        });


        String activityMode = getIntent().getStringExtra("Activity");
        if (Globals.selectedReport != null) {

            //  if (activityMode.equals("Edit")) {
            //isEditMode = true;

            //Bundle bundle = getIntent().getExtras();

        } else {
            //isEditMode = false;

        }
        if (!Globals.selectedCategory.equals("")) {

        }
        setImgAdapter(beforeImgs);
        setVoiceAdapter(attachmentVoice);
        setFixImgAdapter(afterImgs);
       /* trackSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parentView, View selectedItemView, int position, long id) {
                unitPosition = position;
                String selectedType = Globals.selectedTask.getWholeUnitList().get(position).getAssetType();
                assetTypeTxtView.setText(selectedType);
                //setAdapter(selectedType);
            }

            @Override
            public void onNothingSelected(AdapterView<?> parentView) {

            }

        });*/
        //ListMap.getList(ListMap.LIST_REM_ACTIONS)
        updateViewAsOfApp();
    }

    private void updateViewAsOfApp() {
        //If SCIM is running
        if (Globals.newReport == null) {
            //In edit mode
            if ((selectedReport.getUnit().getAssetTypeObj().getDefectCodes() == null || selectedReport.getUnit().getAssetTypeObj().getDefectCodes().getDetails().size() == 0) && appName.equals(Globals.AppName.SCIM)) {
                tvDefectCodes.setVisibility(GONE);
                llDefDivider.setVisibility(GONE);
                llDefCounter.setVisibility(GONE);
                cbDeficiency.setChecked(true);
                cbDeficiency.setEnabled(false);
                tvDefTitle.setText(R.string.deficiency_checkbox);
                rlRuleTitle.setVisibility(GONE);
                llRuleContainer.setVisibility(GONE);
            }
        } else {
            //In new issue mode
            if ((selectedUnit.getAssetTypeObj().getDefectCodes() == null || selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().size() == 0) && appName.equals(Globals.AppName.SCIM)) {
                tvDefectCodes.setVisibility(GONE);
                llDefDivider.setVisibility(GONE);
                llDefCounter.setVisibility(GONE);
                cbDeficiency.setChecked(true);
                cbDeficiency.setEnabled(false);
                tvDefTitle.setText(R.string.deficiency_checkbox);
                rlRuleTitle.setVisibility(GONE);
                llRuleContainer.setVisibility(GONE);
            }
        }

    }

    private class RemedialActions {
        public String code;
        public String description;
        public LinearLayout layout;
        public StaticListItem staticListItem;
        public String errorMessage = "";

        public RemedialActions(String code, String description, LinearLayout layout, StaticListItem staticListItem) {
            this.code = code;
            this.description = description;
            this.layout = layout;
            this.staticListItem = staticListItem;
        }

        public RemedialActions(StaticListItem item) {
            this.code = item.getCode();
            this.description = item.getDescription();
            this.layout = null;
            this.staticListItem = item;
        }

        public ArrayList<RemedialActionItem> getRemedialActionItems() {
            ArrayList<RemedialActionItem> items = new ArrayList<>();
            if (staticListItem != null) {
                if (!staticListItem.getOptParam1().equals("")) {
                    try {
                        JSONArray ja = new JSONArray(staticListItem.getOptParam1());
                        this.errorMessage = "";
                        for (int i = 0; i < ja.length(); i++) {
                            JSONObject jo = ja.getJSONObject(i);
                            String fieldType = jo.optString("fieldType", "text");
                            String fieldName = jo.optString("fieldName", "undefined");
                            String fieldId = jo.optString("id", "undefined");
                            boolean required = jo.optBoolean("required", false);
                            RemedialActionItem item = new RemedialActionItem(fieldId, "", fieldName, fieldType);
                            if (fieldType.equals("text")) {
                                EditText et = layout.findViewWithTag(fieldId);
                                if (et != null) {
                                    String text = et.getText().toString();
                                    if (text.equals("") && required) {
                                        this.errorMessage = fieldName + " is required";
                                    }
                                    item.setValue(text);
                                }
                            } else if (fieldType.equals("list")) {
                                Spinner spinner = layout.findViewWithTag(fieldId);
                                //spinner.setEnabled(false);
                                //spinner.setClickable(false);
                                if (required) {
                                    if (spinner.getSelectedItemPosition() == 0) {
                                        this.errorMessage = fieldName + " is required";
                                    }

                                }
                                if (spinner != null) {
                                    if (spinner.getSelectedItemPosition() == 0 && required) {

                                    } else {
                                        if (spinner.getSelectedItem() != null) {
                                            item.setValue(spinner.getSelectedItem().toString());
                                        }
                                    }
                                }
                            } else if (fieldType.equals("radioList")) {
                                RadioGroup rg = layout.findViewWithTag(fieldId);
                                if (rg != null) {
                                    int selectedId = rg.getCheckedRadioButtonId();
                                    RadioButton rb = findViewById(selectedId);
                                    if (rb != null) {
                                        item.setValue(rb.getText().toString());
                                    }
                                }
                            } else if (fieldType.equals("checkbox")) {
                                CheckBox checkBox = layout.findViewWithTag(fieldId);
                                if (checkBox != null) {
                                    item.setValue(checkBox.isChecked() ? "true" : "false");

                                }
                            }
                            items.add(item);
                        }
                    } catch (Exception e) {
                        Log.e("getRemedialActionItems", e.toString());
                    }
                }
            }
            return items;
        }
    }

    private void selectRemedialAction(int i) {
        if (remedialActions.size() > 0) {
            int index = 1;
            for (RemedialActions item : remedialActions) {
                if (index == i) {
                    if (item.layout != null) {
                        item.layout.setVisibility(View.VISIBLE);
                    }
                } else {
                    if (item.layout != null) {
                        item.layout.setVisibility(GONE);
                    }
                }
                index++;
            }
        }
    }

    private HashMap<String, String> getRemedialActionHash() {
        HashMap<String, String> hashMap = new HashMap<>();
        if (this.remedialActionItems != null) {
            for (RemedialActionItem item : this.remedialActionItems) {
                hashMap.put(item.getId(), item.getValue());
            }
        }
        return hashMap;
    }

    private void loadRemedialActions() {
        HashMap<String, String> items = ListMap.getListHashMap(ListMap.LIST_REM_ACTIONS);
        List<String> itemsList = ListMap.getListHashMapSorted(ListMap.LIST_REM_ACTIONS);
        HashMap<String, String> hashMapRemActionItems = new HashMap<>();
        String remedialAction = "";

        int selectedIndex = 0;
        if (Globals.selectedReport != null) {
            this.remedialActionItems = Globals.selectedReport.getRemedialActionItems();
            hashMapRemActionItems = getRemedialActionHash();
            remedialAction = Globals.selectedReport.getRemedialAction();
        }
        if (items != null) {
            //remedialActionItems=new ArrayList<>();
            remedialActions = new ArrayList<>();
            remedialActionAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item);
            remedialActionAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
            remedialActionAdapter.add("<Not Selected>");
            int index = 1;
            for (String key : itemsList) {
                String strItem = items.get(key);
                if (strItem != "") {
                    try {
                        StaticListItem item = new StaticListItem(new JSONObject(strItem));
                        RemedialActions remedialActionsItem = new RemedialActions(item);
                        //remedialActionItems.add(item);
                        if (item.getDescription().equals(remedialAction)) {
                            selectedIndex = index;
                        }
                        index++;
                        remedialActionAdapter.add(item.getDescription());
                        if (!item.getOptParam1().equals("")) {
                            remedialActionsItem.layout = getLayout(new JSONArray(item.getOptParam1()), hashMapRemActionItems);
                            if (remedialActionsItem.layout != null) {
                                llRemedialActionForm.addView(remedialActionsItem.layout);
                            }
                        }
                        remedialActions.add(remedialActionsItem);
                    } catch (Exception e) {
                        Log.e("loadRemedialActions", e.toString());
                    }
                }
            }
            spRemedialActions.setAdapter(remedialActionAdapter);
            spRemedialActions.setSelection(selectedIndex);
            if (Globals.newReport == null) {
                if (!isIssueUpdateAllowed) {
                    spRemedialActions.setEnabled(false);
                    spRemedialActions.setClickable(false);
                }
            }
            spRemedialActions.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                @Override
                public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                    selectRemedialAction(i);
                }

                @Override
                public void onNothingSelected(AdapterView<?> adapterView) {
                    selectRemedialAction(-1);
                }
            });
        }
    }

    private LinearLayout getLayout(JSONArray jsonArray, HashMap<String, String> currentValues) {
        LinearLayout layout = null;
        if (jsonArray.length() > 0) {
            layout = new LinearLayout(this);
            layout.setOrientation(LinearLayout.VERTICAL);
            layout.setVisibility(View.VISIBLE);
            layout.setLayoutParams(new ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT));
            setMargins(layout, 30, 10, 10, 10);

        }
        for (int i = 0; i < jsonArray.length(); i++) {
            try {
                JSONObject jsonObject = jsonArray.getJSONObject(i);
                String fieldType = jsonObject.optString("fieldType", "text");
                String fieldName = jsonObject.optString("fieldName", "undefined");
                String fieldId = jsonObject.optString("id", "undefined");
                String defaultValue = jsonObject.optString("default", "");
                boolean enabled=jsonObject.optBoolean("enabled", true);
                boolean visible=jsonObject.optBoolean("visible", true);
                JSONArray jaOptions = jsonObject.optJSONArray("options");
                boolean required = jsonObject.optBoolean("required", false);
                String currentValue = "";
                if (currentValues != null) {
                    currentValue = currentValues.get(fieldId);
                    if (currentValue == null) {
                        currentValue = defaultValue;
                    }
                }
                if (!fieldType.equals("checkbox")) {
                    TextView tvName = new TextView(this);
                    tvName.setText(fieldName + (required ? "*" : ""));
                    tvName.setLayoutParams(new ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.WRAP_CONTENT));
                    setPadding(tvName, 10, 10, 0, 0);
                    tvName.setVisibility(visible?View.VISIBLE:View.GONE);
                    layout.addView(tvName);
                }
                if (fieldType.equals("text")) {
                    EditText editText = new EditText(this);
                    editText.setTag(fieldId);
                    editText.setLayoutParams(new ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.WRAP_CONTENT));
                    setPadding(editText, 10, 10, 10, 10);
                    editText.setVisibility(visible?View.VISIBLE:View.GONE);
                    if (!currentValue.equals("")) {
                        editText.setText(currentValue);
                    }
                    //For readonly mode
                    if (Globals.newReport == null) {
                        if (!isIssueUpdateAllowed) {
                            editText.setEnabled(false);
                        }
                    }
                    layout.addView(editText);
                } else if (fieldType.equals("list")) {
                    Spinner spinner = new Spinner(this);
                    spinner.setTag(fieldId);
                    spinner.setLayoutParams(new ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.WRAP_CONTENT));
                    setPadding(spinner, 10, 10, 10, 10);
                    spinner.setVisibility(visible?View.VISIBLE:View.GONE);
                    ArrayAdapter<String> spinerAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item);
                    spinerAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                    if (required) {
                        spinerAdapter.add("<Not Selected>");
                    }
                    if (jaOptions != null) {
                        int selectedOption = 0;
                        for (int i1 = 0; i1 < jaOptions.length(); i1++) {
                            spinerAdapter.add(jaOptions.getString(i1));
                            if (jaOptions.getString(i1).equals(currentValue)) {
                                selectedOption = (required) ? i1 + 1 : i1;
                            }
                        }
                        spinner.setAdapter(spinerAdapter);
                        spinner.setSelection(selectedOption);
                    }
                    if (Globals.newReport == null) {
                        if (!isIssueUpdateAllowed) {
                            spinner.setEnabled(false);
                            spinner.setClickable(false);
                        }
                    }
                    layout.addView(spinner);
                } else if (fieldType.equals("radioList")) {
                    RadioGroup rg = new RadioGroup(this);
                    rg.setTag(fieldId);
                    int selectedOption = 0;
                    for (int i1 = 0; i1 < jaOptions.length(); i1++) {
                        RadioButton rb = new RadioButton(this);
                        rg.addView(rb, i1);
                        /*rb.setLayoutParams(new ViewGroup.LayoutParams(
                                ViewGroup.LayoutParams.MATCH_PARENT,
                                ViewGroup.LayoutParams.WRAP_CONTENT));*/
                        setPadding(rb, 10, 0, 5, 5);
                        rb.setText(jaOptions.getString(i1));

                        if (jaOptions.getString(i1).equals(currentValue)) {
                            selectedOption = i1;
                            rb.setChecked(true);
                        }
                        if (Globals.newReport == null) {
                            if (!isIssueUpdateAllowed) {
                                rb.setEnabled(false);
                                rb.setClickable(false);
                            }
                        }
                    }

                    /*rg.setLayoutParams(new ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.WRAP_CONTENT));
                    */
                    setPadding(rg, 10, 10, 10, 10);

                    rg.setVisibility(visible?View.VISIBLE:View.GONE);
                    layout.addView(rg);

                } else if (fieldType.equals("checkbox")) {
                    CheckBox checkBox = new CheckBox(this);
                    checkBox.setText(fieldName);
                    checkBox.setTag(fieldId);
                    setPadding(checkBox, 10, 10, 10, 10);
                    checkBox.setVisibility(View.VISIBLE);
                    if (currentValue.equals("true")) {
                        checkBox.setChecked(true);
                    }
                    checkBox.setVisibility(visible?View.VISIBLE:View.GONE);
                    if (Globals.newReport == null) {
                        if (!isIssueUpdateAllowed) {
                            checkBox.setEnabled(false);
                            checkBox.setClickable(false);
                        }
                    }
                    layout.addView(checkBox);
                }
            } catch (Exception e) {
                Log.e("getLayout", e.toString());
            }
        }
        return layout;
    }

    private void setPadding(View view, int left, int top, int right, int bottom) {
        final float scale = getBaseContext().getResources().getDisplayMetrics().density;
        // convert the DP into pixel
        int l = (int) (left * scale + 0.5f);
        int r = (int) (right * scale + 0.5f);
        int t = (int) (top * scale + 0.5f);
        int b = (int) (bottom * scale + 0.5f);
        view.setPadding(l, t, r, b);
    }

    private void setMargins(View view, int left, int top, int right, int bottom) {
        final float scale = getBaseContext().getResources().getDisplayMetrics().density;
        // convert the DP into pixel
        int l = (int) (left * scale + 0.5f);
        int r = (int) (right * scale + 0.5f);
        int t = (int) (top * scale + 0.5f);
        int b = (int) (bottom * scale + 0.5f);

        view.setLeft(l);
        view.setTop(t);
        view.setRight(r);
        view.setBottom(b);
/*
        if (view.getLayoutParams() instanceof ViewGroup.LayoutParams) {
            ViewGroup.MarginLayoutParams p = (ViewGroup.MarginLayoutParams) view.getLayoutParams();

            final float scale = getBaseContext().getResources().getDisplayMetrics().density;
            // convert the DP into pixel
            int l =  (int)(left * scale + 0.5f);
            int r =  (int)(right * scale + 0.5f);
            int t =  (int)(top * scale + 0.5f);
            int b =  (int)(bottom * scale + 0.5f);

            p.setMargins(l, t, r, b);
            view.requestLayout();
        }
*/
    }

    // ------Voice Notes------
    private String getVoiceFilename() {
        voiceFile = "";
  /*      File sdCard = Environment.getExternalStorageDirectory();
        File dir = new File(sdCard.getAbsolutePath() + "/" + Globals.voiceFolderName);
        if (!dir.exists())
            dir.mkdirs();
*/
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
        voiceFile = getVoicePath(Globals.selectedTask.getTaskId() + "_" + getCurrentReportIndex() + "_" + timeStamp + file_exts[currentFormat]);

        return voiceFile;
    }

    private void startRecording() {
        recorder = new MediaRecorder();
        recorder.setAudioSource(MediaRecorder.AudioSource.MIC);
        recorder.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4);
        recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC);
        recorder.setOutputFile(getVoiceFilename());
        recorder.setAudioSamplingRate(16000);
        recorder.setOnErrorListener(errorListener);
        recorder.setOnInfoListener(infoListener);

        try {
            recorder.prepare();
            recorder.start();
            isRecording = true;
        } catch (IllegalStateException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private MediaRecorder.OnErrorListener errorListener = new MediaRecorder.OnErrorListener() {
        @Override
        public void onError(MediaRecorder mr, int what, int extra) {
            Log.e("Record", "Error: " + what + ", " + extra);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                btVoiceRecord.setTooltipText(getString(R.string.hold_to_record));
            } else {
                Toast.makeText(ReportAddActivity.this, getString(R.string.hold_to_record), Toast.LENGTH_SHORT).show();
            }
        }
    };

    private MediaRecorder.OnInfoListener infoListener = new MediaRecorder.OnInfoListener() {
        @Override
        public void onInfo(MediaRecorder mr, int what, int extra) {
            Log.e("Record", "Warning: " + what + ", " + extra);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                btVoiceRecord.setTooltipText(getString(R.string.hold_to_record));
            } else {
                Toast.makeText(ReportAddActivity.this, getString(R.string.hold_to_record), Toast.LENGTH_SHORT).show();
            }
        }
    };

    private void stopRecording() {
        if (null != recorder) {
            try {
                recorder.stop();
                recorder.reset();
                recorder.release();
                recorder = null;
                if (getDuration(new File(getVoicePath(Globals.extractVoiceName(voiceFile)))).equals("0:00") || getDuration(new File(getVoicePath(Globals.extractVoiceName(voiceFile)))).equals("00:00")) {
                    Toast.makeText(ReportAddActivity.this, R.string.insufficient_voice_duration_msg, Toast.LENGTH_SHORT).show();
                } else {
                    attachmentVoice.add(new IssueVoice(Globals.extractVoiceName(voiceFile), Globals.ISSUE_IMAGE_STATUS_CREATED));
                    setVoiceAdapter(attachmentVoice);
                }
                isRecording = false;
            } catch (RuntimeException stopException) {
                Log.e("Record Stop:", stopException.toString());
                isRecording = false;
                //Toast.makeText(ReportAddActivity.this, getString(R.string.hold_to_record), Toast.LENGTH_SHORT).show();
            }

        }
    }

    private static String getDuration(File file) {
        String durationStr = null;
        if (file.isFile() && file.exists()) {
            try {
                MediaMetadataRetriever mediaMetadataRetriever = new MediaMetadataRetriever();
                mediaMetadataRetriever.setDataSource(file.getAbsolutePath());
                durationStr = mediaMetadataRetriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION);
            } catch (IllegalArgumentException e) {
                e.printStackTrace();
            }
            try {
                return Utilities.formatMilliSecond(Long.parseLong(durationStr));
            } catch (NumberFormatException e) {
                e.printStackTrace();
            }
        }
        return "00:00";
    }

    public void setVoiceAdapter(ArrayList<IssueVoice> attachments) {
        voiceAdapter = new reportVoiceAdapter(this, attachments);

        LinearLayoutManager horizontalLayoutManager = new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false);
        rvVoiceNotes.setLayoutManager(horizontalLayoutManager);
        rvVoiceNotes.setAdapter(voiceAdapter);
    }
    // ------END Voice Notes------

    //For Images after fix
    public void setFixImgAdapter(ArrayList<IssueImage> attachments) {
        picsAfterFixAdapter = new reportImgAdapter(this, attachments, TAG_AFTER_FIX);

        LinearLayoutManager horizontalLayoutManager = new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false);
        rvRemedialImgs.setLayoutManager(horizontalLayoutManager);
        rvRemedialImgs.setAdapter(picsAfterFixAdapter);
    }

    public void setImgAdapter(ArrayList<IssueImage> attachments) {
        issueImgAdapter = new reportImgAdapter(this, attachments, TAG_BEFORE_FIX);

        LinearLayoutManager horizontalLayoutManager = new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false);
        rvImages.setLayoutManager(horizontalLayoutManager);
        rvImages.setAdapter(issueImgAdapter);
    }

    public void setSpinner(ArrayAdapter<String> selectedAdapter, Spinner selectedSpinner, String spinnerTxt) {
        if (spinnerTxt != null) {
            int spinnerPosition = selectedAdapter.getPosition(spinnerTxt);
            selectedSpinner.setSelection(spinnerPosition);
        }
    }

    TextWatcher inputTextWatcher = new TextWatcher() {
        public void afterTextChanged(Editable s) {
            tvReflexDesc.setText(s.toString());
        }

        public void beforeTextChanged(CharSequence s, int start, int count, int after) {
        }

        public void onTextChanged(CharSequence s, int start, int before, int count) {
        }
    };
    TextWatcher mpTextWatcher = new TextWatcher() {
        public void afterTextChanged(Editable s) {
            etEndMp.setText(s.toString());
        }

        public void beforeTextChanged(CharSequence s, int start, int count, int after) {
        }

        public void onTextChanged(CharSequence s, int start, int before, int count) {
        }
    };

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        try {
            if (requestCode == 0) {
                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED
                        && grantResults[1] == PackageManager.PERMISSION_GRANTED) {
                    ibCapturePic.setEnabled(true);
                }
            } else if (requestCode == 101 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // This method is called when the  permissions are given
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

   /* public void takePicture(View view) {
        Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        file = Uri.fromFile(getOutputMediaFile());
        intent.putExtra(MediaStore.EXTRA_OUTPUT, file);

        startActivityForResult(intent, 100);
    }*/

    private static File getOutputMediaFile() {
        /*File sdCard = Environment.getExternalStorageDirectory();
        File dir = new File(sdCard.getAbsolutePath() + "/" + Globals.imageFolderName);
        //File dir=new File(Environment.getExternalStorageDirectory(),Globals.imageFolderName);
        if (!dir.exists())
            dir.mkdirs();*/

        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());

        return new File(getImgPath(Globals.selectedTask.getTaskId() + "_" + getCurrentReportIndex() + "_" + timeStamp + ".jpg"));
    }

    /**
     * Showing google speech input dialog
     */
    private void promptSpeechInput() {
        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault());
        intent.putExtra(RecognizerIntent.EXTRA_PROMPT,
                getString(R.string.speech_prompt));
        try {
            startActivityForResult(intent, REQ_CODE_SPEECH_INPUT);
        } catch (ActivityNotFoundException a) {
            Toast.makeText(getApplicationContext(),
                    getString(R.string.speech_not_supported),
                    Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        //if (requestCode == 100) {
        super.onActivityResult(requestCode, resultCode, data);
        Bundle extras;
        String receivedData;
        setLocale(this);
        if (requestCode == REQ_CODE_SPEECH_INPUT) {
            if (resultCode == RESULT_OK && null != data) {

                ArrayList<String> result = data
                        .getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
                etSpeechToText.setText(result.get(0));
            }
        }

//fetching extra data passed with intents in a Bundle type variable
        if (requestCode == REQ_CODE_CAMERA) {

            //extras = data.getExtras();
                /*if (extras == null) {
                    receivedData = null;
                } else {
                    *//* fetching the string passed with intent using ‘extras’*//*
                    receivedData = extras.getString("code");
                }*/
            if (resultCode == RESULT_OK) {
                updateImgList();
            }

        } else if (requestCode == REQ_CODE_DEFECT_CODE) {
            if (data != null) {
                extras = data.getExtras();
                if (extras == null) {
                    receivedData = null;
                } else {
                    /* fetching the string passed with intent using ‘extras’*/
                    receivedData = extras.getString("code");
                }
                if (resultCode == RESULT_OK) {
                    if (receivedData != null) {
                        if (receivedData.equals("DefectCode")) {
                            defectSelectionCopy = ArrayListMultimap.create(defectSelection);
                            if (defectSelection.size() > 0) {
                                //defectSelectionCopy = ArrayListMultimap.create(defectSelection);

                                String _title = defectSelection.keySet().toArray()[0].toString();
                                String[] titleArray = _title.split(Globals.defectDivider);
                                String title = titleArray[0] + " - " + titleArray[1];
                                String _desc = "";

                                defectSelection.get(defectSelection.keySet().toArray()[0].toString());
                                for (int j = 0; j < defectSelection.get(defectSelection.keySet().toArray()[0].toString()).size(); j++) {
                                    _desc = defectSelection.get(defectSelection.keySet().toArray()[0].toString()).toArray()[0].toString();
                                    defectSelection.get(defectSelection.keySet().toArray()[0].toString()).remove(_desc);
                                    break;
                                }
                                String[] descArray = _desc.split(Globals.defectDivider);
                                String desc = descArray[0] + " - " + descArray[1];
                                selectedCode = descArray[0];
                                etIssueTitle.setText(title);
                                etDescription.setText(desc);
                                //Disabling input
                                etIssueTitle.setEnabled(false);
                                etDescription.setEnabled(false);

                                tvDefSelectionCount.setText(String.valueOf(defectSelectionCopy.values().size()));
                               /* for ( Map<String, ArrayList<String>> entry : defectSelection) {
                                    String key = entry.getKey();
                                    //Tab tab = entry.getValue();
                                    // do something with key and/or tab
                                }
                                String _title = defectSelection.getByIndex(0).get(0);
                                String[] titleArray = _title.split(Globals.defectDivider);
                                String title = titleArray[0] + " - " + titleArray[1];*/

                                //etIssueTitle.setText(title);

                            } else {
                                //If no defect code is selected
                                etIssueTitle.setText("");
                                etDescription.setText("");
                                etIssueTitle.setEnabled(true);
                                etDescription.setEnabled(true);
                                tvDefSelectionCount.setText(String.valueOf(defectSelection.values().size()));

                            }


                            /*int count = 0;
                            for (int i = 0; i < Globals.defectCodeSelection.size(); i++) {
                                if (!Globals.defectCodeSelection.get(i).equals("")) {
                                    count++;
                                }
                            }
                            tvDefSelectionCount.setText(String.valueOf(count));
                            if (Globals.defectCodeSelection.size() > 0) {
                                String selectedCode = "";
                                for (int index = 0; index < Globals.defectCodeSelection.size(); index++) {
                                    if (!Globals.defectCodeSelection.get(index).equals("")) {
                                        selectedCode = Globals.defectCodeSelection.get(index);
                                        break;
                                    }
                                }
                                for (int i = 0; i < Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().size(); i++) {
                                    if (Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().get(i).getDetails().size() > 0) {
                                        for (int j = 0; j < Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().get(i).getDetails().size(); j++) {
                                            if (Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().get(i).getDetails().get(j).getCode().equals(selectedCode)) {
                                                //etDescription.setText(Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().get(i).getDetails().get(j).getTitle());
                                            }
                                        }
                                    }
                                }
                                StringBuilder _desc = new StringBuilder();
                                for (int i = 0; i < Globals.defectCodeDetails.size(); i++) {
                                    String[] _details = Globals.defectCodeDetails.get(i).split(Globals.defectDivider);
                                    if (_desc.length() == 0) {
                                        //Adding code to text
                                        _desc.append(_details[0].trim());
                                        _desc.append(" - ");
                                        _desc.append(_details[1].trim());
                                        //_desc.append(_details[1].trim());
                                    } else {
                                        _desc.append(",\n").append(_details[1].trim());
                                    }
                                }
                                //etDescription.setText(_desc);
                                String title = "";
                                if (!Globals.issueTitle.equals("")) {
                                    String[] _title = Globals.issueTitle.split(Globals.defectDivider);
                                    if (_title.length > 1) {
                                        //Adding code title
                                        title = _title[0] + " - " + _title[1].trim();

                                        //etIssueTitle.setText(_title[1].trim());
                                    }
                                }
                                //etIssueTitle.setText(title);
                            }*/
                        }
                    }
                }
            }
        }


        //}
    }

    /*private void addLayout(Integer image) {
        View layout2 = LayoutInflater.from(this).inflate(R.layout.image_layout, mLinearLayout, false);

        ImageView imageView = (ImageView) layout2.findViewById(R.id.imageSlide);
        imageView.setImageResource(image);
       *//* Button button1 = (Button) layout2.findViewById(R.id.button2);
        Button button2 = (Button) layout2.findViewById(R.id.button3);

        textView1.setText(textViewText);
        button1.setText(buttonText1);
        button2.setText(buttonText2);*//*

        mLinearLayout.addView(layout2);
    }*/

    /*private void addLayoutURI(File image) {
        View layout2 = LayoutInflater.from(this).inflate(R.layout.image_layout, mLinearLayout, false);

        ImageView imageView = (ImageView) layout2.findViewById(R.id.imageSlide);
        imageView.setImageBitmap(BitmapFactory.decodeFile(image.getPath()));
       *//* Button button1 = (Button) layout2.findViewById(R.id.button2);
        Button button2 = (Button) layout2.findViewById(R.id.button3);

        textView1.setText(textViewText);
        button1.setText(buttonText1);
        button2.setText(buttonText2);*//*

        mLinearLayout.addView(layout2);
    }*/


    /*public void saveScaledPhotoToFile(Uri file) {
        //Convert your photo to a bitmap
        Bitmap photoBm = BitmapFactory.decodeFile(file.getPath());//"your Bitmap image";
        //get its original dimensions
        int bmOriginalWidth = photoBm.getWidth();
        int bmOriginalHeight = photoBm.getHeight();
        double originalWidthToHeightRatio = 1.0 * bmOriginalWidth / bmOriginalHeight;
        double originalHeightToWidthRatio = 1.0 * bmOriginalHeight / bmOriginalWidth;
        //choose a maximum height
        int maxHeight = 1024;
        //choose a max width
        int maxWidth = 1024;
        //call the method to get the scaled bitmap
        photoBm = getScaledBitmap(photoBm, bmOriginalWidth, bmOriginalHeight,
                originalWidthToHeightRatio, originalHeightToWidthRatio,
                maxHeight, maxWidth);

        //create a byte array output stream to hold the photo's bytes
        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        //compress the photo's bytes into the byte array output stream
        photoBm.compress(Bitmap.CompressFormat.JPEG, 40, bytes);
        photoBm.recycle();
        photoBm = null;

        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
        //construct a File object to save the scaled file to
        File f = new File(getImgPath(
                Globals.selectedTask.getTaskId() + "_" + getCurrentReportIndex() + "_" + timeStamp + ".jpg"));
        //create the file
        try {
            f.createNewFile();
            //create an FileOutputStream on the created file
            FileOutputStream fo = new FileOutputStream(f);
            //write the photo's bytes to the file
            fo.write(bytes.toByteArray());

            //finish by closing the FileOutputStream
            fo.close();
            //addLayoutURI(f);
           *//* if (Globals.newReport == null) {
                //In edit mode
                attachmentImgs.add(new IssueImage(f.getName().toString(), Globals.ISSUE_IMAGE_STATUS_CREATED));
                //Globals.selectedReport.getImgList().add(new IssueImage(f.getName().toString(), Globals.ISSUE_IMAGE_STATUS_CREATED));
                horizontalAdapter = new reportImgAdapter(this, Globals.selectedReport.getImgList());
            } else {
                //In new mode
                attachmentImgs.add(new IssueImage(f.getName().toString(), Globals.ISSUE_IMAGE_STATUS_CREATED));
                horizontalAdapter = new reportImgAdapter(this, Globals.newReport.getImgList());
            }*//*
            attachmentImgs.add(new IssueImage(f.getName().toString(), Globals.ISSUE_IMAGE_STATUS_CREATED));
            horizontalAdapter = new reportImgAdapter(this, attachmentImgs);
            *//*attachmentImgs.add(new IssueImage(f.getName().toString(), Globals.ISSUE_IMAGE_STATUS_CREATED));
            horizontalAdapter = new reportImgAdapter(this, attachmentImgs);*//*
            //imgFile = f;
            //horizontalAdapter = new reportImgAdapter(this, attachmentImgs);
            LinearLayoutManager horizontalLayoutManager = new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false);
            img_recycler_view.setLayoutManager(horizontalLayoutManager);
            img_recycler_view.setAdapter(horizontalAdapter);
            //horizontalAdapter.notifyDataSetChanged();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }*/
    public void updateImgList() {
        if (Globals.currentImageTag.equals(TAG_BEFORE_FIX)) {
            beforeImgs.add(new IssueImage(Globals.imgFile.getName().toString(), Globals.ISSUE_IMAGE_STATUS_CREATED, TAG_BEFORE_FIX));
            issueImgAdapter = new reportImgAdapter(this, beforeImgs, TAG_BEFORE_FIX);
            /*attachmentImgs.add(new IssueImage(f.getName().toString(), Globals.ISSUE_IMAGE_STATUS_CREATED));
            horizontalAdapter = new reportImgAdapter(this, attachmentImgs);*/
            //imgFile = f;
            //horizontalAdapter = new reportImgAdapter(this, attachmentImgs);
            LinearLayoutManager horizontalLayoutManager = new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false);
            rvImages.setLayoutManager(horizontalLayoutManager);
            rvImages.setAdapter(issueImgAdapter);
        } else if (Globals.currentImageTag.equals(TAG_AFTER_FIX)) {
            afterImgs.add(new IssueImage(Globals.imgFile.getName().toString(), Globals.ISSUE_IMAGE_STATUS_CREATED, TAG_AFTER_FIX));
            picsAfterFixAdapter = new reportImgAdapter(this, afterImgs, TAG_AFTER_FIX);
            LinearLayoutManager horizontalLayoutManager = new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false);
            rvRemedialImgs.setLayoutManager(horizontalLayoutManager);
            rvRemedialImgs.setAdapter(picsAfterFixAdapter);
        }

    }

    private static Bitmap getScaledBitmap(Bitmap bm, int bmOriginalWidth, int bmOriginalHeight, double originalWidthToHeightRatio, double originalHeightToWidthRatio, int maxHeight, int maxWidth) {
        if (bmOriginalWidth > maxWidth || bmOriginalHeight > maxHeight) {
            Log.v("Resize", format("RESIZING bitmap FROM %sx%s ", bmOriginalWidth, bmOriginalHeight));

            if (bmOriginalWidth > bmOriginalHeight) {
                bm = scaleDeminsFromWidth(bm, maxWidth, bmOriginalHeight, originalHeightToWidthRatio);
            } else {
                bm = scaleDeminsFromHeight(bm, maxHeight, bmOriginalHeight, originalWidthToHeightRatio);
            }

            Log.v("Resize", format("RESIZED bitmap TO %sx%s ", bm.getWidth(), bm.getHeight()));
        }
        return bm;
    }

    private static Bitmap scaleDeminsFromHeight(Bitmap bm, int maxHeight, int bmOriginalHeight, double originalWidthToHeightRatio) {
        int newHeight = (int) Math.min(maxHeight, bmOriginalHeight * .55);
        int newWidth = (int) (newHeight * originalWidthToHeightRatio);
        bm = Bitmap.createScaledBitmap(bm, newWidth, newHeight, true);
        return bm;
    }

    private static Bitmap scaleDeminsFromWidth(Bitmap bm, int maxWidth, int bmOriginalWidth, double originalHeightToWidthRatio) {
        //scale the width
        int newWidth = (int) Math.min(maxWidth, bmOriginalWidth * .75);
        int newHeight = (int) (newWidth * originalHeightToWidthRatio);
        bm = Bitmap.createScaledBitmap(bm, newWidth, newHeight, true);
        return bm;
    }

    private String getGpsCoordinates() {
        // check if GPS enabled
        Location _loc = null;
        double latitude = 0.0;
        double longitude = 0.0;
        if (gps.canGetLocation()) {
            if (cLocation == null) {
                if (gps != null) {
                    if (gps.getLastKnownLocation() != null) {
                        _loc = gps.getLastKnownLocation();
                        latitude = _loc.getLatitude();
                        longitude = _loc.getLongitude();
                    } else {
                        _loc = lastKnownLocation;
                        latitude = _loc.getLatitude();
                        longitude = _loc.getLongitude();
                    }
                }
            } else {
                latitude = cLocation.getLatitude();
                longitude = cLocation.getLongitude();
            }

            /*longTxt.setText(String.valueOf(longitude));
            latTxt.setText(String.valueOf(latitude));*/

            // \n is for new line
            /*if(cLocation!=null){
                Toast.makeText(getApplicationContext(), "Your Location is - \nLat: "
                        + latitude + "\nLong: " + longitude + "From Provider: " + cLocation.getProvider(), Toast.LENGTH_LONG).show();
            } else {
                Toast.makeText(getApplicationContext(), "Your Location is - \nLat: "
                        + latitude + "\nLong: " + longitude + "From Provider: " + _loc.getProvider(), Toast.LENGTH_LONG).show();
            }*/


            return String.valueOf(latitude) + "," + String.valueOf(longitude);
        } else gps.showSettingsAlert();
        return "";
    }

    private static int getCurrentReportIndex() {
        if (Globals.selectedReport == null) {
            return Globals.selectedTask.getReportList().size();
        }
        return Globals.selectedReport.getReportIndex();
    }

    /*public void addCategoriesOnSpinner() {

        categorySpinner = (Spinner) findViewById(R.id.catSpinner);
        List<String> list = new ArrayList<String>();
        list.add("Rails");
        list.add("Tiles");
        list.add("Spikes");
        list.add("Joint Bar");
        list.add("Switch");
        catAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, _categoryList);
        catAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        categorySpinner.setAdapter(catAdapter);
    }*/

    /*public void addTracksOnSpinner() {

        trackSpinner = (Spinner) findViewById(R.id.trackSpinner);
        List<String> list = new ArrayList<String>();
        list.add("TRK000231");
        list.add("TRK000232");
        list.add("TRK000233");
        list.add("TRK000234");
        list.add("TRK000235");

        trkAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, Globals.selectedTask.getUnitListOnlyName());
        trkAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        trackSpinner.setAdapter(trkAdapter);
    }*/

    public void addPriorityOnSpinner() {

        spPriority = (Spinner) findViewById(R.id.prioritySpinner);
        List<String> list = new ArrayList<String>();
        list.add("High");
        list.add("Medium");
        list.add("Low");
        priAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, _priorityList);
        priAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spPriority.setAdapter(priAdapter);
    }

    @Override
    public boolean onSupportNavigateUp() {
        //code it to launch an intent to the activity you want
        if (Globals.newReport == null) {
            if (!isIssueUpdateAllowed) {
                if (mBound) {
                    // Unbind from the service. This signals to the service that this activity is no longer
                    // in the foreground, and the service can respond by promoting itself to a foreground
                    // service.
                    unbindService(mServiceConnection);
                    mBound = false;
                }
                Globals.defectCodeSelection = new ArrayList<>();
                Globals.issueTitle = "";
                Globals.defectCodeDetails = new ArrayList<>();
                defectSelectionCopy.clear();
                defectSelection.clear();
                selectedCode = "";

                finish();
            } else {
                showConfirmationDialog();
            }
        } else {
            showConfirmationDialog();
        }
        //finish();
        return true;
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        // inflater.inflate(R.menu.inbox_actions, menu);
        return true;
    }

    public static String getUTCdatetimeAsString() {
        final SimpleDateFormat sdf = new SimpleDateFormat(DATEFORMAT);
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
        final String utcTime = sdf.format(new Date());
        return utcTime;
    }

    public float dpToPixel(int dp) {
        Resources r = getResources();
        float px = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, dp, r.getDisplayMetrics());
        return px;
    }

    @Override
    public void onStart() {
        super.onStart();

        bindService(new Intent(ReportAddActivity.this, LocationUpdatesService.class), mServiceConnection,
                Context.BIND_AUTO_CREATE);
        PreferenceManager.getDefaultSharedPreferences(this)
                .registerOnSharedPreferenceChangeListener(this);
        // Restore the state of the buttons when the activity (re)launches.
        //setButtonsState(Utils.requestingLocationUpdates(this));
        /*if (!checkPermissions()) {
            requestPermissions();
        } else {
            if(mService!=null){
                mService.requestLocationUpdates();
            }
        }*/
        // Bind to the service. If the service is in foreground mode, this signals to the service
        // that since this activity is in the foreground, the service can exit foreground mode.

    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        switch (keyCode) {
            case KeyEvent.KEYCODE_BACK:
                // do something here
                //gps.unbindService();
                if (Globals.newReport == null) {
                    if (!isIssueUpdateAllowed) {
                        if (mBound) {
                            // Unbind from the service. This signals to the service that this activity is no longer
                            // in the foreground, and the service can respond by promoting itself to a foreground
                            // service.
                            unbindService(mServiceConnection);
                            mBound = false;
                        }
                        Globals.defectCodeSelection = new ArrayList<>();
                        Globals.issueTitle = "";
                        Globals.defectCodeDetails = new ArrayList<>();
                        defectSelectionCopy.clear();
                        defectSelection.clear();
                        selectedCode = "";
                        finish();
                    } else {
                        showConfirmationDialog();
                    }
                } else {
                    showConfirmationDialog();
                }

                return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    protected void onResume() {
        super.onResume();
        LocalBroadcastManager.getInstance(this).registerReceiver(myReceiver,
                new IntentFilter(LocationUpdatesService.ACTION_BROADCAST));
        Log.e(getString(R.string.tag_resume), getString(R.string.msg_app_resumed));
    }

    @Override
    public void onPause() {
        super.onPause();
        try {
            if (isRecording) {
                Log.e(getString(R.string.record), getString(R.string.msg_stop_recording));
                stopRecording();
                ViewGroup.LayoutParams layoutParams = btVoiceRecord.getLayoutParams();
                layoutParams.width = (int) dpToPixel(44);
                layoutParams.height = (int) dpToPixel(44);
                btVoiceRecord.setLayoutParams(layoutParams);
                btVoiceRecord.clearAnimation();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            LocalBroadcastManager.getInstance(this).unregisterReceiver(myReceiver);
            super.onPause();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public void onStop() {
        if (mBound) {
            // Unbind from the service. This signals to the service that this activity is no longer
            // in the foreground, and the service can respond by promoting itself to a foreground
            // service.
            unbindService(mServiceConnection);
            mBound = false;
        }
        PreferenceManager.getDefaultSharedPreferences(this)
                .unregisterOnSharedPreferenceChangeListener(this);
        super.onStop();
        try {
            if (isRecording) {
                Log.e(getString(R.string.record), getString(R.string.msg_stop_recording));
                stopRecording();
                ViewGroup.LayoutParams layoutParams = btVoiceRecord.getLayoutParams();
                layoutParams.width = (int) dpToPixel(44);
                layoutParams.height = (int) dpToPixel(44);
                btVoiceRecord.setLayoutParams(layoutParams);
                btVoiceRecord.clearAnimation();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    protected void onDestroy() {

        super.onDestroy();
        try {
            if (isRecording) {
                Log.e(getString(R.string.record), getString(R.string.msg_stop_recording));
                stopRecording();
                ViewGroup.LayoutParams layoutParams = btVoiceRecord.getLayoutParams();
                unbindService(mServiceConnection);
                layoutParams.width = (int) dpToPixel(44);
                layoutParams.height = (int) dpToPixel(44);
                btVoiceRecord.setLayoutParams(layoutParams);
                btVoiceRecord.clearAnimation();
            }
            /*if(gps!=null){
                gps.unbindService();
            }*/
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (mBound) {
            // Unbind from the service. This signals to the service that this activity is no longer
            // in the foreground, and the service can respond by promoting itself to a foreground
            // service.
            unbindService(mServiceConnection);
            mBound = false;
        }
    }

    private boolean isInRange(double a, double b, double c) {
        if (b > a) {
            if (c >= a && c <= b) return true;
            else return false;
        } else {
            if (c >= b && c <= a) return true;
            else return false;
        }
    }

    private void setLinearAssetInEditMode() {
        etStartMp.setHint(Globals.selectedUnit.getStart());
        etEndMp.setHint(Globals.selectedUnit.getEnd());
        etStartMp.setText(Globals.selectedReport.getStartMp());
        etEndMp.setText(Globals.selectedReport.getEndMp());
        //Setting Placeholder if saved value is empty in any case
        if (Globals.selectedReport.getStartMp().equals("")) {
            etStartMp.setHint(Globals.selectedUnit.getStart());
        }
        if (Globals.selectedReport.getEndMp().equals("")) {
            etEndMp.setHint(Globals.selectedUnit.getEnd());
        }
        //etStartMp.setFilters(new InputFilter[]{new MinMaxInputFilter(Double.parseDouble(Globals.selectedUnit.getStart()), Double.parseDouble(Globals.selectedUnit.getEnd()))});
        //etEndMp.setFilters(new InputFilter[]{new MinMaxInputFilter(Double.parseDouble(Globals.selectedUnit.getStart()), Double.parseDouble(Globals.selectedUnit.getEnd()))});

    }

    private void setFixedAssetInEditMode() {
        llEndMp.setVisibility(GONE);
        tvStartMp.setText(getString(R.string.msg_milepost));
        etStartMp.setText(Globals.selectedReport.getStartMp());
        etStartMp.setEnabled(false);
    }

    private void setLinearAssetMode() {
        etStartMp.setHint(Globals.selectedUnit.getStart());
        etEndMp.setHint(Globals.selectedUnit.getEnd());
        //etStartMp.setFilters(new InputFilter[]{new MinMaxInputFilter(Double.parseDouble(Globals.selectedUnit.getStart()), Double.parseDouble(Globals.selectedUnit.getEnd()))});
        //etEndMp.setFilters(new InputFilter[]{new MinMaxInputFilter(Double.parseDouble(Globals.selectedUnit.getStart()), Double.parseDouble(Globals.selectedUnit.getEnd()))});
    }

    private void setFixedAssetMode() {
        llEndMp.setVisibility(GONE);
        tvStartMp.setText(getString(R.string.msg_milepost));
        etStartMp.setText(Globals.selectedUnit.getStart());
        etStartMp.setEnabled(false);
    }

    @Override
    public void locationChanged(Location mLocation) {
        cLocation = mLocation;
    }

    @Override
    public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, String key) {

    }

    /**
     * Receiver for broadcasts sent by {@link LocationUpdatesService}.
     */
    private class MyReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            Location mLocation = intent.getParcelableExtra(LocationUpdatesService.EXTRA_LOCATION);
            if (mLocation != null) {
                cLocation = mLocation;
            }
        }
    }

    // Monitors the state of the connection to the service.
    private final ServiceConnection mServiceConnection = new ServiceConnection() {

        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            LocationUpdatesService.LocalBinder binder = (LocationUpdatesService.LocalBinder) service;
            mService = binder.getService();
            mBound = true;
            if (mService != null) {
                mService.requestLocationUpdates();
            }
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            mService = null;
            mBound = false;
        }
    };
    private static final String TAG = "resPMain";

    // Used in checking for runtime permissions.
    private static final int REQUEST_PERMISSIONS_REQUEST_CODE = 34;

    // The BroadcastReceiver used to listen from broadcasts from the service.
    private MyReceiver myReceiver;

    // A reference to the service used to get location updates.
    private LocationUpdatesService mService = null;

    // Tracks the bound state of the service.
    private boolean mBound = false;

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
                        if (mBound) {
                            // Unbind from the service. This signals to the service that this activity is no longer
                            // in the foreground, and the service can respond by promoting itself to a foreground
                            // service.
                            unbindService(mServiceConnection);
                            mBound = false;
                        }
                        Globals.defectCodeSelection = new ArrayList<>();
                        Globals.issueTitle = "";
                        Globals.defectCodeDetails = new ArrayList<>();
                        defectSelectionCopy.clear();
                        defectSelection.clear();
                        selectedCode = "";
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

    private String getLocation() {
        if (cLocation != null) {
            return String.valueOf(cLocation.getLatitude()) + "," + String.valueOf(cLocation.getLongitude());
        } else if (lastKnownLocation != null) {
            return String.valueOf(lastKnownLocation.getLatitude()) + "," + String.valueOf(lastKnownLocation.getLongitude());
        } else {
            return "0.0,0.0";
            //gps.showSettingsAlert();
        }
    }

    @Override
    public Resources getResources() {
        if (res == null) {
            res = new Res(super.getResources());
        }
        return res;
    }

    private boolean createRemainingDefects(Report report){
        for (int i = 0; i < defectSelection.keySet().size(); i++) {
            String _title = defectSelection.keySet().toArray()[i].toString();
            String[] titleArray = _title.split(Globals.defectDivider);
            String title = titleArray[0] + " - " + titleArray[1];
            for(int j = 0; j < defectSelection.get(_title).size(); j++){
                String _desc = defectSelection.get(defectSelection.keySet().toArray()[i].toString()).toArray()[j].toString();
                String[] descArray = _desc.split(Globals.defectDivider);
                String desc = descArray[0] + " - " + descArray[1];
                Report issue = new Report();
                issue = createIssueObj(report, title, desc, descArray[0]);
                Globals.selectedTask = Globals.selectedJPlan.getTaskById(Globals.selectedTask.getTaskId());
                Globals.selectedTask.getReportList().add(issue);
                int count = Integer.parseInt(Globals.selectedUnit.getIssueCounter());
                count++;
                Globals.selectedUnit.setIssueCounter(String.valueOf(count));

            }
        }
        return true;
    }

    private Report createIssueObj(Report existingIssue, String title, String descriptionTxt, String defectCode) {
        Report newIssue = new Report();
        ArrayList<String> defects = new ArrayList<>();
        defects.add(defectCode);


        newIssue.setReportIndex(Globals.selectedTask.getReportList().size());
        // generating unique id for this issue
        UUID uuid = UUID.randomUUID();

        newIssue.setTitle(title);
        //Setting unique id
        newIssue.setIssueId(uuid.toString());
        //report.setTypeOfAction(selectedAction.getText().toString());
        newIssue.setPriority(existingIssue.getPriority());
        newIssue.setTrackId(selectedUnit.getDescription());
        newIssue.setDescription(descriptionTxt);
        newIssue.setMarked(existingIssue.getMarked());
        newIssue.setLocation(existingIssue.getLocation());
        newIssue.setImgList(attachmentImgs);
        newIssue.setVoiceList(attachmentVoice);
        newIssue.setUnit(selectedUnit.makeClone());
        //Assigning time when button was pressed
        newIssue.setTimeStamp(existingIssue.getTimeStamp());
        newIssue.setCheckList(finalSelectionList);
        newIssue.setDefectCodes(defects);
        newIssue.setLocationInfo(existingIssue.getLocationInfo());
        newIssue.setTempSpeed(existingIssue.getTempSpeed());
        newIssue.setRemedialActionItems(existingIssue.getRemedialActionItems());
        newIssue.setRemedialAction(existingIssue.getRemedialAction());
        newIssue.setRuleApplied(cbRule.isChecked());
        newIssue.setLocationUnit(Globals.selectedPostSign);
        newIssue.setVoiceNotes(etSpeechToText.getText().toString());
        newIssue.setIssueType(existingIssue.getIssueType());

        newIssue.setRailDirection(existingIssue.getRailDirection());
        newIssue.setFixType(existingIssue.getFixType());

        if (selectedUnit.getAssetTypeObj().isMarkerMilepost()) {
            if (etMarkerStart.getText().toString().equals("")) {
                newIssue.setStartMarker("(N/A)");
            } else {
                newIssue.setStartMarker(etMarkerStart.getText().toString());
            }
            if (etMarkerEnd.getText().toString().equals("")) {
                newIssue.setEndMarker("(N/A)");
            } else {
                newIssue.setEndMarker(etMarkerEnd.getText().toString());
            }
        } else {
            newIssue.setStartMp(etStartMp.getText().toString());
            if (Globals.selectedUnit.getAssetTypeClassify().equals(ASSET_TYPE_LINEAR)) {
                newIssue.setEndMp(etEndMp.getText().toString());
            } else if (Globals.selectedUnit.getAssetTypeClassify().equals(ASSET_TYPE_FIXED)) {
                newIssue.setEndMp(etStartMp.getText().toString());
            }
        }
        return newIssue;
    }
    public void initWidgets(){

    }
    public void initBusinessLogic(){

    }
    public void initListeners(){

    }
    private void setEnableRemedialViews(boolean isEnabled){
        if(spRemedialActions.getSelectedItemPosition() != 0){
            ArrayList<RemedialActionItem> rItems = remedialActions.get(spRemedialActions.getSelectedItemPosition() - 1).getRemedialActionItems();
            View mainView= remedialActions.get(spRemedialActions.getSelectedItemPosition() - 1).layout;
            if(rItems.size() > 0){
                for(RemedialActionItem rItem: rItems){
                    mainView.findViewWithTag(rItem.getId()).setEnabled(isEnabled);
                }

            }
        }
    }

}
