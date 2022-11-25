package com.app.ps19.elecapp;

import static com.app.ps19.elecapp.Shared.Globals.getSelectedTask;
import static com.app.ps19.elecapp.Shared.Globals.inbox;
import static com.app.ps19.elecapp.Shared.Globals.lastKnownLocation;
import static com.app.ps19.elecapp.Shared.Globals.selectedJPlan;
import static com.app.ps19.elecapp.Shared.Globals.selectedMaintenance;
import static com.app.ps19.elecapp.Shared.Globals.setLocale;
import static com.app.ps19.elecapp.Shared.Globals.setSelectedTask;
import static com.app.ps19.elecapp.Shared.Globals.tempIssueImgList;
import static com.app.ps19.elecapp.Shared.Globals.tempIssueVoiceList;
import static com.app.ps19.elecapp.Shared.Utilities.getVoicePath;

import android.Manifest;
import android.app.AlertDialog;
import android.app.DatePickerDialog;
import android.content.ActivityNotFoundException;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.Resources;
import android.media.MediaMetadataRetriever;
import android.media.MediaRecorder;
import android.os.Build;
import android.os.Bundle;
import android.speech.RecognizerIntent;
import android.util.Log;
import android.util.TypedValue;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.app.ps19.elecapp.Shared.Globals;
import com.app.ps19.elecapp.Shared.Utilities;
import com.app.ps19.elecapp.classes.IssueImage;
import com.app.ps19.elecapp.classes.IssueVoice;
import com.app.ps19.elecapp.classes.JourneyPlan;
import com.app.ps19.elecapp.classes.JourneyPlanOpt;
import com.app.ps19.elecapp.classes.Task;
import com.app.ps19.elecapp.classes.maintenance.MaintenanceExecution;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;
import java.util.UUID;

public class MaintenanceExecActivity extends AppCompatActivity {
    static final String DATEFORMAT = "yyyy-MM-dd HH:mm:ss.SSS";
    TextView tvMrNumber;
    TextView tvMrDescription;
    TextView tvMrType;
    TextView tvDueDate;
    Button btnUpdate;
    reportImgAdapter issueImgAdapter;
    EditText etSpeechToText;
    RecyclerView rvImages;
    ImageButton btnSpeak;
    ArrayList<IssueImage> beforeImgs = new ArrayList<IssueImage>();
    ImageButton ibCapturePic;
    private final int REQ_CODE_CAMERA = 1;
    private final int REQ_CODE_SPEECH_INPUT = 1001;
    private final String IMAGE_TAG = "Maintenance";
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
    // -----End Voice Data-----

    EditText etStartMp;
    EditText etEndMp;
    String initialTime;
    boolean isEditMode;
    MaintenanceExecution selectedExecution = null;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setLocale(this);
        setContentView(R.layout.activity_maintenance_exec);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        setTitle(getString(R.string.maintenance_exec_title));
        tvMrNumber = (TextView) findViewById(R.id.tv_mr_number);
        etStartMp = (EditText) findViewById(R.id.et_mp_start);
        etEndMp = (EditText) findViewById(R.id.et_mp_end);
        tvMrDescription = (TextView) findViewById(R.id.tv_mr_description);
        tvMrType = (TextView) findViewById(R.id.tv_mr_type);
        ibCapturePic = (ImageButton) findViewById(R.id.captureBtn);
        btVoiceRecord = (ImageButton) findViewById(R.id.btn_voice_record);
        animBlink = AnimationUtils.loadAnimation(this,
                R.anim.blink);
        btnUpdate = (Button) findViewById(R.id.saveBtn);
        etSpeechToText = (EditText) findViewById(R.id.ed_voice_info);
        btnSpeak = (ImageButton) findViewById(R.id.btn_speak);
        rvVoiceNotes = (RecyclerView) findViewById(R.id.rv_voice);
        rvImages = (RecyclerView) findViewById(R.id.horizontal_recycler_view);
        initialTime = getUTCdatetimeAsString();
        if(selectedJPlan!=null){
            setEditMode(selectedJPlan);
        } else if(getActiveMPlan()!=null) {
            setEditMode(getActiveMPlan());
        }

        //tvDueDate = (TextView) findViewById(R.id.tv_select_due_date);

        tempIssueImgList = new ArrayList<IssueImage>();
        tempIssueVoiceList = new ArrayList<IssueVoice>();

        tvMrNumber.setText(selectedMaintenance.getMrNumber());
        tvMrDescription.setText(selectedMaintenance.getDescription());
        tvMrType.setText(selectedMaintenance.getMaintenanceType());
        if(selectedMaintenance.getReport()!=null){
            if(selectedMaintenance.getReport().getStartMarker()!=null && !selectedMaintenance.getReport().getStartMarker().equals("")){
                etStartMp.setText(selectedMaintenance.getReport().getStartMarker());
                etEndMp.setText(selectedMaintenance.getReport().getEndMarker());
            } else {
                etStartMp.setText(selectedMaintenance.getReport().getStartMp());
                etEndMp.setText(selectedMaintenance.getReport().getEndMp());
            }
        }
        if(isEditMode){

            beforeImgs.addAll(selectedExecution.getImgList());
            attachmentVoice.addAll(selectedExecution.getVoiceList());

            setVoiceAdapter(attachmentVoice);
            etEndMp.setText(selectedExecution.getEndMp());
            etStartMp.setText(selectedExecution.getStartMp());
            etSpeechToText.setText(selectedExecution.getVoiceNotes());
        }

        issueImgAdapter = new reportImgAdapter(this, beforeImgs, IMAGE_TAG);

        LinearLayoutManager horizontalLayoutManager = new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false);
        rvImages.setLayoutManager(horizontalLayoutManager);
        rvImages.setAdapter(issueImgAdapter);

        btnSpeak.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                promptSpeechInput();
            }
        });
        btnUpdate.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                if(etStartMp.getText().toString().equals("")){
                    Toast.makeText(MaintenanceExecActivity.this, getString(R.string.require_start_mp), Toast.LENGTH_SHORT).show();
                    etStartMp.requestFocusFromTouch();
                } else if (etEndMp.getText().toString().equals("")){
                    Toast.makeText(MaintenanceExecActivity.this, getString(R.string.require_end_mp), Toast.LENGTH_SHORT).show();
                    etEndMp.requestFocusFromTouch();
                } else if (etSpeechToText.getText().toString().equals("")){
                    Toast.makeText(MaintenanceExecActivity.this, getString(R.string.require_info), Toast.LENGTH_SHORT).show();
                    etSpeechToText.requestFocusFromTouch();
                } else {
                    if(selectedJPlan != null){
                        execAsInspector(selectedJPlan);
                    } else if(getActiveMPlan() != null) {
                        execAsInspector(getActiveMPlan());
                    }
                    /* if(isMaintainer){
                        execAsMaintainer();
                    } else {
                        if(getActiveMPlan()!=null){
                            execAsInspector(getActiveMPlan());
                        }
                    }*/
                }
            }
        });
        /*tvDueDate.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                showDatePicker();
            }
        });
*/
        ibCapturePic.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //Intent intent = new Intent(MaintenanceExecActivity.this, CameraActivity.class);
                Intent intent = null;//new Intent(MaintenanceExecActivity.this, Camera2Activity.class);
                switch (Globals.cameraType){
                    case IntentType:
                        intent = new Intent(MaintenanceExecActivity.this, CameraIntentActivity.class);
                        break;
                    default:
                        intent = new Intent(MaintenanceExecActivity.this, Camera2Activity.class);
                }
                startActivityForResult(intent, REQ_CODE_CAMERA);
            }
        });
        btVoiceRecord.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.e(getString(R.string.record), getString(R.string.msg_start_recording));
                if (ActivityCompat.checkSelfPermission(getApplication(), Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {

                    ActivityCompat.requestPermissions(MaintenanceExecActivity.this, new String[]{Manifest.permission.RECORD_AUDIO},
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
    }

    private void setEditMode(JourneyPlan jPlan) {
        for(MaintenanceExecution exec: jPlan.getTaskList().get(0).getMaintenanceExecutions()){
            try {
                if(exec.getId().equals(selectedMaintenance.getId())){
                    isEditMode = true;
                    selectedExecution = exec;
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private JourneyPlan getActiveMPlan() {
        ArrayList<JourneyPlanOpt> activePlans = new ArrayList<>();
        activePlans = inbox.getInProgressJourneyPlans();
        JourneyPlanOpt activeJp = null;
        if(activePlans.size()>0){
            for(JourneyPlanOpt jp: activePlans){
                if(jp.getWorkplanTemplateId().equals("")){
                    activeJp = jp;
                    break;
                }
            }
            if(activeJp!=null){
                if(inbox.loadJourneyPlan(MaintenanceExecActivity.this, activeJp.getCode())!=null){
                    return inbox.loadJourneyPlan(MaintenanceExecActivity.this, activeJp.getCode());
                }
            }
        }
        return null;
    }

    private void execAsMaintainer(){
        if(isEditMode){
            for (MaintenanceExecution execution: getSelectedTask().getMaintenanceExecutions()){
                if(execution.getId().equals(selectedExecution.getId())){
                    execution.setStartMp(etStartMp.getText().toString());
                    execution.setEndMp(etEndMp.getText().toString());
                    execution.setImgList(beforeImgs);
                    execution.setVoiceList(attachmentVoice);
                    execution.setVoiceNotes(etSpeechToText.getText().toString());
                    execution.setLocation(getLocation());
                    execution.setTimeStamp(initialTime);
                }
            }
        } else {
            UUID gId = UUID.randomUUID();
            MaintenanceExecution mExec = new MaintenanceExecution();
            mExec.setStartMp(etStartMp.getText().toString());
            mExec.setEndMp(etEndMp.getText().toString());
            mExec.setImgList(beforeImgs);
            mExec.setVoiceList(attachmentVoice);
            mExec.setVoiceNotes(etSpeechToText.getText().toString());
            mExec.setLocation(getLocation());
            mExec.setTimeStamp(initialTime);
            mExec.setGuId(gId.toString());
            mExec.setId(selectedMaintenance.getId());
            for (Task task: selectedJPlan.getTaskList()){
                if(task.getTaskId().equals(getSelectedTask().getTaskId())){
                    task.getMaintenanceExecutions().add(mExec);
                }
            }
        }
        selectedJPlan.update();
        //Updating selected Task
        setSelectedTask(selectedJPlan.getTaskList().get(0));
        selectedMaintenance = null;
        selectedExecution = null;
        finish();
    }
    private void execAsInspector(JourneyPlan jPlan){
        if(isEditMode){
            for (MaintenanceExecution execution: jPlan.getTaskList().get(0).getMaintenanceExecutions()){
                if(execution.getId().equals(selectedExecution.getId())){
                    execution.setStartMp(etStartMp.getText().toString());
                    execution.setEndMp(etEndMp.getText().toString());
                    execution.setImgList(beforeImgs);
                    execution.setVoiceList(attachmentVoice);
                    execution.setVoiceNotes(etSpeechToText.getText().toString());
                    execution.setLocation(getLocation());
                    execution.setTimeStamp(initialTime);
                }
            }
        } else {
            UUID gId = UUID.randomUUID();
            MaintenanceExecution mExec = new MaintenanceExecution();
            mExec.setStartMp(etStartMp.getText().toString());
            mExec.setEndMp(etEndMp.getText().toString());
            mExec.setImgList(beforeImgs);
            mExec.setVoiceList(attachmentVoice);
            mExec.setVoiceNotes(etSpeechToText.getText().toString());
            mExec.setLocation(getLocation());
            mExec.setTimeStamp(initialTime);
            mExec.setGuId(gId.toString());
            mExec.setId(selectedMaintenance.getId());

            jPlan.getTaskList().get(0).getMaintenanceExecutions().add(mExec);

        }
        jPlan.update();
        //Updating selected Task
        //setSelectedTask(selectedJPlan.getTaskList().get(0));
        selectedMaintenance = null;
        selectedExecution = null;
        finish();

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
        if (requestCode == REQ_CODE_CAMERA) {
            if (resultCode == RESULT_OK) {
                updateImgList();
            }

        }
    }
    @Override
    public boolean onSupportNavigateUp() {
        if(isEditMode){
            showConfirmationDialog();
        } else {
            selectedMaintenance = null;
            selectedExecution = null;
            finish();
        }
        return true;
    }

    public static String getUTCdatetimeAsString() {
        final SimpleDateFormat sdf = new SimpleDateFormat(DATEFORMAT);
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
        final String utcTime = sdf.format(new Date());
        return utcTime;
    }

    private String getLocation(){
        if(lastKnownLocation!=null){
            return String.valueOf(lastKnownLocation.getLatitude() + "," + lastKnownLocation.getLongitude());
        } else {
            return "0.0,0.0";
        }
    }

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
                        selectedMaintenance = null;
                        selectedExecution = null;
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
    // -----Image Code-----
    public void updateImgList() {
            beforeImgs.add(new IssueImage(Globals.imgFile.getName().toString(), Globals.ISSUE_IMAGE_STATUS_CREATED, IMAGE_TAG));
            issueImgAdapter = new reportImgAdapter(this, beforeImgs, IMAGE_TAG);
            /*attachmentImgs.add(new IssueImage(f.getName().toString(), Globals.ISSUE_IMAGE_STATUS_CREATED));
            horizontalAdapter = new reportImgAdapter(this, attachmentImgs);*/
            //imgFile = f;
            //horizontalAdapter = new reportImgAdapter(this, attachmentImgs);
            LinearLayoutManager horizontalLayoutManager = new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false);
            rvImages.setLayoutManager(horizontalLayoutManager);
            rvImages.setAdapter(issueImgAdapter);
    }
    //-----End Image Code-----
    // ------Voice Notes------
    private String getVoiceFilename() {
        voiceFile = "";
        UUID uuid = UUID.randomUUID();
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
        voiceFile = getVoicePath(uuid + "_" + timeStamp + file_exts[currentFormat]);

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
                Toast.makeText(MaintenanceExecActivity.this, getString(R.string.hold_to_record), Toast.LENGTH_SHORT).show();
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
                Toast.makeText(MaintenanceExecActivity.this, getString(R.string.hold_to_record), Toast.LENGTH_SHORT).show();
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
                    Toast.makeText(MaintenanceExecActivity.this, R.string.insufficient_voice_duration_msg, Toast.LENGTH_SHORT).show();
                } else {
                    attachmentVoice.add(new IssueVoice(Globals.extractVoiceName(voiceFile), Globals.ISSUE_IMAGE_STATUS_CREATED));
                    setVoiceAdapter(attachmentVoice);
                }
                isRecording = false;
            } catch (RuntimeException stopException) {
                Log.e("Record Stop:", stopException.toString());
                isRecording = false;
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
        voiceAdapter = new reportVoiceAdapter(this, attachments, MaintenanceExecActivity.this.getLocalClassName());

        LinearLayoutManager horizontalLayoutManager = new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false);
        rvVoiceNotes.setLayoutManager(horizontalLayoutManager);
        rvVoiceNotes.setAdapter(voiceAdapter);
    }
    // ------END Voice Notes------
    public float dpToPixel(int dp) {
        Resources r = getResources();
        float px = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, dp, r.getDisplayMetrics());
        return px;
    }
    public void showDatePicker() {
        // Get Current Date
        final Calendar c = Calendar.getInstance();
        int mYear = c.get(Calendar.YEAR);
        int mMonth = c.get(Calendar.MONTH);
        int mDay = c.get(Calendar.DAY_OF_MONTH);


        DatePickerDialog datePickerDialog = new DatePickerDialog(MaintenanceExecActivity.this,
                new DatePickerDialog.OnDateSetListener() {

                    @Override
                    public void onDateSet(DatePicker view, int year,
                                          int monthOfYear, int dayOfMonth) {
                        Calendar calendar = Calendar.getInstance();
                        calendar.set(year, monthOfYear, dayOfMonth);

                        SimpleDateFormat dateFormat = new SimpleDateFormat("EEE, d MMM yyyy ");

                        tvDueDate.setText(dateFormat.format(calendar.getTime()));


                        //etDate.setText(dayOfMonth + "-" + (monthOfYear + 1) + "-" + year);
                        //date_row_1 = (dayOfMonth + "-" + (monthOfYear + 1) + "-" + year);
                        //showTimePicker(position);

                    }
                }, mYear, mMonth, mDay);
        try {
            datePickerDialog.show();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}