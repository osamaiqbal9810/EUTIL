package com.app.ps19.hosapp;

import android.Manifest;
import android.app.AlertDialog;
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
import android.media.MediaRecorder;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.IBinder;
import android.os.StrictMode;
import android.preference.PreferenceManager;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;
import androidx.viewpager.widget.ViewPager;
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
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.RadioGroup;
import android.widget.Spinner;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;

import com.app.ps19.hosapp.Shared.GPSTrackerEx;
import com.app.ps19.hosapp.Shared.Globals;
import com.app.ps19.hosapp.Shared.ListMap;
import com.app.ps19.hosapp.Shared.LocationChangedInterface;
import com.app.ps19.hosapp.Shared.LocationUpdatesService;
import com.app.ps19.hosapp.Shared.Utils;
import com.app.ps19.hosapp.classes.IssueImage;
import com.app.ps19.hosapp.classes.IssueVoice;
import com.app.ps19.hosapp.classes.Report;
import com.app.ps19.hosapp.classes.Task;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

import static com.app.ps19.hosapp.Shared.Globals.ADAPTER_REFRESH_MSG;
import static com.app.ps19.hosapp.Shared.Globals.tempIssueImgList;
import static com.app.ps19.hosapp.Shared.Globals.tempIssueVoiceList;
import static com.app.ps19.hosapp.Shared.ListMap.LIST_CATEGORY;
import static com.app.ps19.hosapp.Shared.ListMap.LIST_PRIORITY;
import static com.app.ps19.hosapp.Shared.Utilities.getImgPath;
import static com.app.ps19.hosapp.Shared.Utilities.getVoicePath;
import static java.lang.String.format;

public class ReportAddActivity extends AppCompatActivity implements LocationChangedInterface, SharedPreferences.OnSharedPreferenceChangeListener {
    static final String DATEFORMAT = "yyyy-MM-dd HH:mm:ss.SSS";
    TextView tvAssetName;
    //Spinner categorySpinner;
    Spinner trackSpinner;
    Spinner prioritySpinner;
    ImageButton takePictureButton;
    ViewPager viewPager;
    private ViewGroup mLinearLayout;
    private Integer[] images = {/*R.drawable.task2,R.drawable.task3,R.drawable.task1*/};
    //private Uri file;
    private File imgFile;
    private Boolean isMarked = false;
    //private ArrayList<String> _categoryList;
    private ArrayList<String> _priorityList;
    private int unitPosition = 0;

    EditText description;
    Button saveBtn;
    Switch markedSwitch;
    public final static int RESULT_CODE = 1;
    TextView reflectDescription;
    ArrayList<IssueImage> attachmentImgs = new ArrayList<IssueImage>();
    ArrayList<IssueImage> beforeImgs = new ArrayList<IssueImage>();
    ArrayList<IssueImage> afterImgs = new ArrayList<IssueImage>();
    RecyclerView img_recycler_view;
    reportImgAdapter horizontalAdapter;
    public final static String TAG_BEFORE_FIX = "before";

    // For images taken after fix
    ImageButton iBtnCaptureAfterFix;
    RecyclerView recyclerAfterFix;
    reportImgAdapter picsAfterFixAdapter;
    public final static String TAG_AFTER_FIX = "after";
    public static final String FIX_TYPE_PERMANENT = "Permanent";
    public static final String FIX_TYPE_TEMPORARY = "Temporary";
    public static final String ASSET_TYPE_LINEAR = "linear";
    public static final String ASSET_TYPE_FIXED = "point";
    String fixType;


    //ArrayAdapter<String> catAdapter;
    ArrayAdapter<String> trkAdapter;
    ArrayAdapter<String> priAdapter;
    public Boolean isEditMode = false;
    GPSTrackerEx gps;
    Location cLocation;
    TextView assetTypeTxtView;
    TextView btChecklist;
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
    RecyclerView rcvVoiceNotes;
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


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
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
        btChecklist = (TextView) findViewById(R.id.btnCheckList);
        img_recycler_view = (RecyclerView) findViewById(R.id.horizontal_recycler_view);
        markedSwitch = (Switch) findViewById(R.id.markedSwitch);
        //reflectDescription = (TextView) findViewById(R.id.reflectDescrTxt);
        takePictureButton = (ImageButton) findViewById(R.id.captureBtn);
        description = (EditText) findViewById(R.id.reportDescriptionTxt);
        saveBtn = (Button) findViewById(R.id.saveBtn);
        assetTypeTxtView = (TextView) findViewById(R.id.assetTypeTxt);
        if(gps == null){
            gps = new GPSTrackerEx(ReportAddActivity.this);
        }
        ListMap.initializeAllLists(this);
        tvPicturesHead = (TextView) findViewById(R.id.tv_pic_heading);
        tvVoiceHead = (TextView) findViewById(R.id.tv_voice_heading);
        lyPictures = (LinearLayout) findViewById(R.id.ly_pictures);
        lyVoices = (LinearLayout) findViewById(R.id.ly_voice);
        tvAssetName = (TextView) findViewById(R.id.tv_report_asset_selection_name);
        // Edit Text for MP
        etStartMp = (EditText) findViewById(R.id.et_mp_start);
        etEndMp = (EditText) findViewById(R.id.et_mp_end);
        llStartMp = (LinearLayout) findViewById(R.id.ll_mp_start);
        llEndMp = (LinearLayout) findViewById(R.id.ll_mp_end);
        tvStartMp = (TextView) findViewById(R.id.tv_title_mp_start);
        tvEndMp = (TextView) findViewById(R.id.tv_title_mp_end);

        llFix = (LinearLayout) findViewById(R.id.ll_fix);
        //For images taken after fix
        iBtnCaptureAfterFix = (ImageButton) findViewById(R.id.ibtn_capture_after_fix);
        recyclerAfterFix = (RecyclerView) findViewById(R.id.recycler_pics_after_fix);

        setTitle(R.string.title_activity_report_add);
        // ------Voice Notes------
        // load the animation
        animBlink = AnimationUtils.loadAnimation(this,
                R.anim.blink);
        rcvVoiceNotes = (RecyclerView) findViewById(R.id.rv_voice);
        btVoiceRecord = (ImageButton) findViewById(R.id.btn_voice_record);
        rgFix = (RadioGroup) findViewById(R.id.rg_fix_type);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            btVoiceRecord.setTooltipText(getString(R.string.hold_to_record));
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
        assetTypeTxtView.setText(selectedType);
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
        SpannableString content = new SpannableString(getString(R.string.def_codes));
        content.setSpan(new UnderlineSpan(), 0, content.length(), 0);
        btChecklist.setText(content);

        //setImgAdapter(attachmentImgs);
        defectList = Globals.defectCodeList;
        tvAssetName.setText(Globals.selectedUnit.getDescription());
        if (Globals.newReport == null) {
            //Activity in edit mode
            for (IssueImage imgObj : Globals.selectedReport.getImgList()) {
                if(imgObj.getTag() != null){
                    if(!imgObj.getTag().equals("")){
                        if(imgObj.getTag().equals(TAG_BEFORE_FIX)){
                            beforeImgs.add(imgObj);
                        } else if(imgObj.getTag().equals(TAG_AFTER_FIX)){
                            afterImgs.add(imgObj);
                        }
                    }

                }
            }
            if(Globals.selectedReport.getUnit().getAssetTypeObj() == null){
                if(Globals.selectedReport.getUnit().getAssetTypeClassify().equals(ASSET_TYPE_LINEAR)){
                    setLinearAssetInEditMode();
                } else if (Globals.selectedReport.getUnit().getAssetTypeClassify().equals(ASSET_TYPE_FIXED)){
                    setFixedAssetInEditMode();
                }
            } else {
                if(Globals.selectedReport.getUnit().getAssetTypeObj().getAssetTypeClassify().equals(ASSET_TYPE_LINEAR)){
                    setLinearAssetInEditMode();
                } else if (Globals.selectedReport.getUnit().getAssetTypeObj().getAssetTypeClassify().equals(ASSET_TYPE_FIXED)){
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
            //TODO: Null check must implement here
            if(Globals.selectedUnit.getAssetTypeObj() != null){
                if (Globals.selectedUnit.getAssetTypeObj().getDefectCodes() != null && Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().size() > 0) {
                    if (Globals.selectedReport.getDefectCodes().size() > 0) {
                        Globals.defectCodeSelection = Globals.selectedReport.getDefectCodes();
                    } else {
                        Globals.defectCodeSelection.clear();
                        for (int i = 0; i < Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().size(); i++) {
                            for (int j = 0; j < Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().get(i).getDetails().size(); j++) {
                                Globals.defectCodeSelection.add("");
                            }
                        }
                    }
                }
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

            String category = Globals.selectedReport.getCategory();
            String track = Globals.selectedReport.getTrackId();
            String descriptionTxt = Globals.selectedReport.getDescription();
            isMarked = Globals.selectedReport.getMarked();
            String priority = Globals.selectedReport.getPriority();
            //attachmentImgs = Globals.selectedReport.getImgList();
            attachmentVoice = Globals.selectedReport.getVoiceList();
            if (Globals.selectedReport.getImgList().size() > 0) {
                lyPictures.setVisibility(View.VISIBLE);
            } else {
                lyPictures.setVisibility(View.GONE);
            }
            if (attachmentVoice.size() > 0) {
                lyVoices.setVisibility(View.VISIBLE);
            } else {
                lyVoices.setVisibility(View.GONE);
            }
            // setSpinner(catAdapter, categorySpinner, category);
            //setSpinner(trkAdapter, trackSpinner, track);
            setSpinner(priAdapter, prioritySpinner, priority);
            markedSwitch.setChecked(isMarked);
            description.setText(descriptionTxt);
            fixType = Globals.selectedReport.getFixType();
            if (markedSwitch.isChecked()) {
                if (Globals.selectedReport.getFixType().equals(FIX_TYPE_TEMPORARY)) {
                    rgFix.check(rgFix.getChildAt(0).getId());
                } else if (Globals.selectedReport.getFixType().equals(FIX_TYPE_PERMANENT)) {
                    rgFix.check(rgFix.getChildAt(1).getId());
                }
            }
            etStartMp.setText(Globals.selectedReport.getStartMp());
            etEndMp.setText(Globals.selectedReport.getEndMp());
            saveBtn.setText(R.string.title_new_report_btn_edit);
        } else {
            lyVoices.setVisibility(View.GONE);
            lyPictures.setVisibility(View.GONE);

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
            if(Globals.selectedUnit.getAssetTypeObj() != null){
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
            saveBtn.setText(R.string.title_new_report_btn_save);
        }

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            takePictureButton.setEnabled(false);
            iBtnCaptureAfterFix.setEnabled(false);
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE}, 0);
        }
        StrictMode.VmPolicy.Builder builder = new StrictMode.VmPolicy.Builder();
        StrictMode.setVmPolicy(builder.build());
        if (isMarked) {
            llFix.setVisibility(View.VISIBLE);
        } else {
            llFix.setVisibility(View.GONE);
        }

        markedSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if (isChecked) {
                    llFix.setVisibility(View.VISIBLE);
                    isMarked = true;
                    rgFix.check(rgFix.getChildAt(0).getId());
                    fixType = FIX_TYPE_TEMPORARY;
                } else {
                    llFix.setVisibility(View.GONE);
                    isMarked = false;
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
                        //Toast.makeText(getApplicationContext(), "Selected button number " + index, Toast.LENGTH_LONG).show();
                        break;
                    case 1: // second button
                        fixType = FIX_TYPE_PERMANENT;
                        //Toast.makeText(getApplicationContext(), "Selected button number " + index, Toast.LENGTH_LONG).show();
                        break;
                }
            }
        });
        //description.addTextChangedListener(inputTextWatcher);
        isEditMode = (Globals.selectedReport != null);
        btChecklist.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(Globals.selectedUnit.getAssetTypeObj() != null){
                    if (Globals.selectedUnit.getAssetTypeObj().getDefectCodes() != null) {
                        Intent intent = new Intent(ReportAddActivity.this, DefectCodeActivity.class);
                        startActivity(intent);
                    } else {
                        Toast.makeText(ReportAddActivity.this, getString(R.string.no_def_code), Toast.LENGTH_SHORT).show();
                    }
                } else {
                    Toast.makeText(ReportAddActivity.this, getString(R.string.no_def_code), Toast.LENGTH_SHORT).show();
                }

            }
        });
        saveBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String descriptionTxt = description.getText().toString();
                //String category = categorySpinner.getSelectedItem().toString();
                attachmentImgs.clear();
                attachmentImgs.addAll(beforeImgs);
                attachmentImgs.addAll(afterImgs);

                if (prioritySpinner.getSelectedItem() == null) {
                    Toast.makeText(ReportAddActivity.this, getString(R.string.select_priority), Toast.LENGTH_SHORT).show();
                    return;
                }
                if (descriptionTxt.trim().equals("")) {
                    Toast.makeText(ReportAddActivity.this, getString(R.string.select_description), Toast.LENGTH_SHORT).show();
                    return;
                }
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

                String priority = prioritySpinner.getSelectedItem().toString();
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
                if (report == null) {
                    //New Issue
                    report = new Report();
                    report.setReportIndex(Globals.selectedTask.getReportList().size());
                    //report.setCategory(categoryTxt);
                    report.setPriority(priority);
                    report.setTrackId(Globals.selectedUnit.getDescription());
                    report.setDescription(descriptionTxt);
                    report.setMarked(_isMarked);
                    report.setLocation(getGpsCoordinates());
                    report.setImgList(attachmentImgs);
                    report.setVoiceList(attachmentVoice);
                    report.setUnit(Globals.selectedUnit);
                    report.setTimeStamp(getUTCdatetimeAsString());
                    report.setCheckList(finalSelectionList);
                    report.setDefectCodes(Globals.defectCodeSelection);
                    if (isMarked) {
                        report.setFixType(fixType);
                    } else {
                        report.setFixType("");
                    }

                    report.setStartMp(etStartMp.getText().toString());
                    if (Globals.selectedUnit.getAssetTypeClassify().equals(ASSET_TYPE_LINEAR)) {
                        report.setEndMp(etEndMp.getText().toString());
                    } else if (Globals.selectedUnit.getAssetTypeClassify().equals(ASSET_TYPE_FIXED)) {
                        report.setEndMp(etStartMp.getText().toString());
                    }
                    Globals.selectedTask = Globals.selectedJPlan.getTaskById(Globals.selectedTask.getTaskId());
                    Globals.selectedTask.getReportList().add(report);
                    //Globals.selectedTask.getReportList().add(report);
                } else {
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
                                    _report.setTimeStamp(getUTCdatetimeAsString());
                                    _report.setUnit(Globals.selectedUnit);
                                    if (tempIssueImgList.size() > 0) {
                                        for (int index = 0; index < tempIssueImgList.size(); index++) {
                                            attachmentImgs.add(new IssueImage());
                                        }
                                    }
                                    if (tempIssueVoiceList.size() > 0) {
                                        for (int index = 0; index < tempIssueVoiceList.size(); index++) {
                                            attachmentVoice.add(new IssueVoice());
                                        }
                                    }
                                    _report.setVoiceList(attachmentVoice);
                                    _report.setImgList(attachmentImgs);
                                    _report.setCheckList(finalSelectionList);
                                    _report.setDefectCodes(Globals.defectCodeSelection);
                                    _report.setStartMp(etStartMp.getText().toString());
                                    if (Globals.selectedUnit.getAssetTypeClassify().equals(ASSET_TYPE_LINEAR)) {
                                        _report.setEndMp(etEndMp.getText().toString());
                                    } else if (Globals.selectedUnit.getAssetTypeClassify().equals(ASSET_TYPE_FIXED)) {
                                        _report.setEndMp(etStartMp.getText().toString());
                                    }
                                    if (isMarked) {
                                        _report.setFixType(fixType);
                                    } else {
                                        _report.setFixType("");
                                    }
                                }
                            }
                        }
                    }
                }
                Globals.selectedJPlan.update();
                Globals.defectCodeSelection = new ArrayList<>();
                //finishActivity(SECOND_ACTIVITY_REQUEST_CODE);
                Intent data = new Intent();
                data.setData(Uri.parse(ADAPTER_REFRESH_MSG));
                setResult(RESULT_OK, data);
                finish();
            }
        });
        takePictureButton.setOnClickListener(new View.OnClickListener() {
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
                startActivityForResult(intent, 1);
            }
        });

        iBtnCaptureAfterFix.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Globals.currentImageTag = TAG_AFTER_FIX;
                Intent intent = new Intent(ReportAddActivity.this, CameraActivity.class);
                startActivityForResult(intent, 1);
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
    }

    // ------Voice Notes------
    private String getVoiceFilename() {
        voiceFile = "";
        File sdCard = Environment.getExternalStorageDirectory();
        File dir = new File(sdCard.getAbsolutePath() + "/" + Globals.voiceFolderName);
        if (!dir.exists())
            dir.mkdirs();

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
                btVoiceRecord.setTooltipText("Hold to record!");
            } else {
                Toast.makeText(ReportAddActivity.this, "Please Hold to record!", Toast.LENGTH_SHORT).show();
            }
        }
    };

    private MediaRecorder.OnInfoListener infoListener = new MediaRecorder.OnInfoListener() {
        @Override
        public void onInfo(MediaRecorder mr, int what, int extra) {
            Log.e("Record", "Warning: " + what + ", " + extra);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                btVoiceRecord.setTooltipText("Hold to record!");
            } else {
                Toast.makeText(ReportAddActivity.this, "Please Hold to record!", Toast.LENGTH_SHORT).show();
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
                attachmentVoice.add(new IssueVoice(Globals.extractVoiceName(voiceFile), Globals.ISSUE_IMAGE_STATUS_CREATED));
                setVoiceAdapter(attachmentVoice);
                isRecording = false;
            } catch (RuntimeException stopException) {
                Log.e("Record Stop:", stopException.toString());
                Toast.makeText(ReportAddActivity.this, "Please Hold to record!", Toast.LENGTH_SHORT).show();
            }

        }
    }

    public void setVoiceAdapter(ArrayList<IssueVoice> attachments) {
        voiceAdapter = new reportVoiceAdapter(this, attachments);

        LinearLayoutManager horizontalLayoutManager = new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false);
        rcvVoiceNotes.setLayoutManager(horizontalLayoutManager);
        rcvVoiceNotes.setAdapter(voiceAdapter);
    }
    // ------END Voice Notes------

    //For Images after fix
    public void setFixImgAdapter(ArrayList<IssueImage> attachments) {
        picsAfterFixAdapter = new reportImgAdapter(this, attachments, TAG_AFTER_FIX);

        LinearLayoutManager horizontalLayoutManager = new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false);
        recyclerAfterFix.setLayoutManager(horizontalLayoutManager);
        recyclerAfterFix.setAdapter(picsAfterFixAdapter);
    }

    public void setImgAdapter(ArrayList<IssueImage> attachments) {
        horizontalAdapter = new reportImgAdapter(this, attachments, TAG_BEFORE_FIX);

        LinearLayoutManager horizontalLayoutManager = new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false);
        img_recycler_view.setLayoutManager(horizontalLayoutManager);
        img_recycler_view.setAdapter(horizontalAdapter);
    }

    public void setSpinner(ArrayAdapter<String> selectedAdapter, Spinner selectedSpinner, String spinnerTxt) {
        if (spinnerTxt != null) {
            int spinnerPosition = selectedAdapter.getPosition(spinnerTxt);
            selectedSpinner.setSelection(spinnerPosition);
        }
    }

    TextWatcher inputTextWatcher = new TextWatcher() {
        public void afterTextChanged(Editable s) {
            reflectDescription.setText(s.toString());
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
                    takePictureButton.setEnabled(true);
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
        File sdCard = Environment.getExternalStorageDirectory();
        File dir = new File(sdCard.getAbsolutePath() + "/" + Globals.imageFolderName);
        //File dir=new File(Environment.getExternalStorageDirectory(),Globals.imageFolderName);
        if (!dir.exists())
            dir.mkdirs();

        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());

        return new File(getImgPath(Globals.selectedTask.getTaskId() + "_" + getCurrentReportIndex() + "_" + timeStamp + ".jpg"));
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
       /* if (!Debug.isDebuggerConnected()) {
            Debug.waitForDebugger();
            Log.d("debug", "started"); // Insert a breakpoint at this line!!
        }*/
        //if (requestCode == 100) {
        if (resultCode == RESULT_OK) {
            //imageView.setImageURI(file);
            //addLayoutURI(file);
            //saveScaledPhotoToFile(Globals.issueImgFileUri);
            updateImgList();

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
            horizontalAdapter = new reportImgAdapter(this, beforeImgs, TAG_BEFORE_FIX);
            /*attachmentImgs.add(new IssueImage(f.getName().toString(), Globals.ISSUE_IMAGE_STATUS_CREATED));
            horizontalAdapter = new reportImgAdapter(this, attachmentImgs);*/
            //imgFile = f;
            //horizontalAdapter = new reportImgAdapter(this, attachmentImgs);
            LinearLayoutManager horizontalLayoutManager = new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false);
            img_recycler_view.setLayoutManager(horizontalLayoutManager);
            img_recycler_view.setAdapter(horizontalAdapter);
        } else if (Globals.currentImageTag.equals(TAG_AFTER_FIX)) {
            afterImgs.add(new IssueImage(Globals.imgFile.getName().toString(), Globals.ISSUE_IMAGE_STATUS_CREATED, TAG_AFTER_FIX));
            picsAfterFixAdapter = new reportImgAdapter(this, afterImgs, TAG_AFTER_FIX);
            LinearLayoutManager horizontalLayoutManager = new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false);
            recyclerAfterFix.setLayoutManager(horizontalLayoutManager);
            recyclerAfterFix.setAdapter(picsAfterFixAdapter);
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
        if (gps.canGetLocation()){
            if( cLocation == null) {
                if(gps!=null){
                    if(gps.getLastKnownLocation()!=null){
                         _loc = gps.getLastKnownLocation();
                        latitude = _loc.getLatitude();
                        longitude = _loc.getLongitude();
                    } else {
                        _loc = Globals.lastKnownLocation;
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

        prioritySpinner = (Spinner) findViewById(R.id.prioritySpinner);
        List<String> list = new ArrayList<String>();
        list.add("High");
        list.add("Medium");
        list.add("Low");
        priAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, _priorityList);
        priAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        prioritySpinner.setAdapter(priAdapter);
    }

    @Override
    public boolean onSupportNavigateUp() {
        //code it to launch an intent to the activity you want
        showConfirmationDialog();
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
        switch(keyCode){
            case KeyEvent.KEYCODE_BACK:
                // do something here
                //gps.unbindService();
                showConfirmationDialog();
                return true;
        }
        return super.onKeyDown(keyCode, event);
    }
    @Override
    protected void onResume() {
        super.onResume();
        LocalBroadcastManager.getInstance(this).registerReceiver(myReceiver,
                new IntentFilter(LocationUpdatesService.ACTION_BROADCAST));
        Log.e("Resume", "App resumed");
    }

    @Override
    public void onPause() {
        super.onPause();
        try {
            if (isRecording) {
                Log.e("Record", "Stop Recording");
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
                Log.e("Record", "Stop Recording");
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
                Log.e("Record", "Stop Recording");
                stopRecording();
                ViewGroup.LayoutParams layoutParams = btVoiceRecord.getLayoutParams();
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
    private void setLinearAssetInEditMode(){
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
    private void setFixedAssetInEditMode(){
        llEndMp.setVisibility(View.GONE);
        tvStartMp.setText(getString(R.string.msg_milepost));
        etStartMp.setText(Globals.selectedReport.getStartMp());
        etStartMp.setEnabled(false);
    }
    private void setLinearAssetMode(){
        etStartMp.setHint(Globals.selectedUnit.getStart());
        etEndMp.setHint(Globals.selectedUnit.getEnd());
        //etStartMp.setFilters(new InputFilter[]{new MinMaxInputFilter(Double.parseDouble(Globals.selectedUnit.getStart()), Double.parseDouble(Globals.selectedUnit.getEnd()))});
        //etEndMp.setFilters(new InputFilter[]{new MinMaxInputFilter(Double.parseDouble(Globals.selectedUnit.getStart()), Double.parseDouble(Globals.selectedUnit.getEnd()))});
    }
    private void setFixedAssetMode(){
        llEndMp.setVisibility(View.GONE);
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
            if(mService!=null){
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
                .setTitle("Warning!")
//set message
                .setMessage("Are you sure you want to discard the changes ?")
//set positive button
                .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        if (mBound) {
                            // Unbind from the service. This signals to the service that this activity is no longer
                            // in the foreground, and the service can respond by promoting itself to a foreground
                            // service.
                            unbindService(mServiceConnection);
                            mBound = false;
                        }
                        finish();
                    }
                })
//set negative button
                .setNegativeButton("No", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        //set what should happen when negative button is clicked


                    }
                })
                .show();
    }
}
