package com.app.ps19.hosapp;

import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.Resources;
import android.os.Bundle;
import com.google.android.material.snackbar.Snackbar;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.appcompat.widget.Toolbar;
import android.text.InputFilter;
import android.text.SpannableString;
import android.text.style.UnderlineSpan;
import android.util.TypedValue;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;

import com.app.ps19.hosapp.Shared.Globals;
import com.app.ps19.hosapp.Shared.MinMaxInputFilter;
import com.app.ps19.hosapp.classes.IssueImage;
import com.app.ps19.hosapp.classes.IssueVoice;

import java.util.ArrayList;
import java.util.Arrays;

public class ReportViewActivity extends AppCompatActivity {
    TextView catText;
    TextView trkText;
    TextView descText;
    TextView mrkText;
    TextView priText;
    Button btnBack;
    public final static String TAG_BEFORE_FIX = "before";
    ArrayList<IssueImage> imgs = new ArrayList<IssueImage>();
    RecyclerView img_recycler_view;
    RecyclerView rvVoice;
    reportImgAdapter horizontalAdapter;
    reportVoiceAdapter voiceAdapter;
    TextView btChecklist;
    ArrayList<String> defectList = new ArrayList<>();
    boolean[] tempDefSelection;
    RecyclerView recyclerAfterFix;
    reportImgAdapter picsAfterFixAdapter;
    public final static String TAG_AFTER_FIX = "after";
    public static final String FIX_TYPE_PERMANENT = "Permanent";
    public static final String FIX_TYPE_TEMPORARY = "Temporary";
    public static final String ASSET_TYPE_LINEAR = "linear";
    public static final String ASSET_TYPE_FIXED = "point";
    String fixType;
    RadioGroup rgFix;
    RadioButton rbTemp;
    RadioButton rbPerm;
    //Edit text for start and end location
    EditText etStartMp;
    EditText etEndMp;
    LinearLayout llStartMp;
    LinearLayout llEndMp;
    TextView tvStartMp;
    TextView tvEndMp;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.activity_report_view);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        catText = (TextView) findViewById(R.id.catTxtView);
        trkText = (TextView) findViewById(R.id.trackSelectionView);
        descText = (TextView) findViewById(R.id.reportDescriptionView);
        mrkText = (TextView) findViewById(R.id.markedSwitchView);
        priText = (TextView) findViewById(R.id.prioritySelectionView);
        btnBack = (Button) findViewById(R.id.backBtn);
        img_recycler_view = (RecyclerView) findViewById(R.id.horizontal_recycler_view);
        rvVoice = (RecyclerView) findViewById(R.id.rv_voice_view);
        btChecklist = (TextView) findViewById(R.id.btnCheckList);
        recyclerAfterFix = (RecyclerView) findViewById(R.id.recycler_pics_after_fix);
        rgFix = (RadioGroup) findViewById(R.id.rg_fix_type);
        rbPerm = (RadioButton) findViewById(R.id.rb_permanent_fix);
        rbTemp = (RadioButton) findViewById(R.id.rb_temp_fix);
        llStartMp = (LinearLayout) findViewById(R.id.ll_mp_start);
        llEndMp = (LinearLayout) findViewById(R.id.ll_mp_end);
        etEndMp = (EditText) findViewById(R.id.et_mp_end);
        etStartMp = (EditText) findViewById(R.id.et_mp_start);
        tvStartMp = (TextView) findViewById(R.id.tv_title_mp_start);

        SpannableString content = new SpannableString("Defect Codes");
        content.setSpan(new UnderlineSpan(), 0, content.length(), 0);
        btChecklist.setText(content);
        defectList = Globals.defectCodeList;

        catText.setText(Globals.selectedReport.getUnit().getAssetType());
        trkText.setText(Globals.selectedReport.getUnit().getDescription());
        descText.setText(Globals.selectedReport.getDescription());
        if (Globals.selectedReport.getMarked()) {
            mrkText.setText(getString(R.string.briefing_yes));
        } else {
            mrkText.setText(getString(R.string.briefing_no));
        }
        priText.setText(Globals.selectedReport.getPriority());
        btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });
        if(Globals.selectedReport.getFixType().equals(FIX_TYPE_TEMPORARY)){
            rbTemp.setChecked(true);
            rbTemp.setEnabled(false);
            rbPerm.setEnabled(false);

        } else if(Globals.selectedReport.getFixType().equals(FIX_TYPE_PERMANENT)){
            rbPerm.setChecked(true);
            rbPerm.setEnabled(false);
            rbTemp.setEnabled(false);
        }
        if(Globals.selectedReport.getUnit().getAssetTypeObj().getAssetTypeClassify().equals(ASSET_TYPE_LINEAR)){
            etStartMp.setHint(Globals.selectedUnit.getStart());
            etEndMp.setHint(Globals.selectedUnit.getEnd());
            etStartMp.setText(Globals.selectedReport.getStartMp());
            etEndMp.setText(Globals.selectedReport.getEndMp());
            //Setting Placeholder if saved value is empty in any case
            if(Globals.selectedReport.getStartMp().equals("")){
                etStartMp.setHint(Globals.selectedUnit.getStart());
            }
            if(Globals.selectedReport.getEndMp().equals("")){
                etEndMp.setHint(Globals.selectedUnit.getEnd());
            }
            etStartMp.setFilters(new InputFilter[]{ new MinMaxInputFilter(Double.parseDouble(Globals.selectedUnit.getStart()), Double.parseDouble(Globals.selectedUnit.getEnd()))});
            etEndMp.setFilters(new InputFilter[]{ new MinMaxInputFilter(Double.parseDouble(Globals.selectedUnit.getStart()), Double.parseDouble(Globals.selectedUnit.getEnd()))});

            etStartMp.setEnabled(false);
            etEndMp.setEnabled(false);
        } else if(Globals.selectedUnit.getAssetTypeObj().getAssetTypeClassify().equals(ASSET_TYPE_FIXED)){

            llEndMp.setVisibility(View.GONE);
            tvStartMp.setText(getString(R.string.msg_milepost));
            etStartMp.setText(Globals.selectedReport.getStartMp());
            etStartMp.setEnabled(false);
        }

        setFixImgAdapter(Globals.selectedReport.getImgList());
        setImgAdapter(Globals.selectedReport.getImgList());
        setVoiceAdapter(Globals.selectedReport.getVoiceList());
        //TODO: Null check must implement here
        if(Globals.selectedUnit.getAssetTypeObj().getDefectCodes() != null && Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().size()>0){
            if(Globals.selectedReport.getDefectCodes().size()>0){
                Globals.defectCodeSelection = Globals.selectedReport.getDefectCodes();
            } else {
                Globals.defectCodeSelection.clear();
                for(int i = 0 ; i < Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().size(); i++){
                    for(int j = 0; j < Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().get(i).getDetails().size(); j++){
                        Globals.defectCodeSelection.add("");
                    }
                }
            }
        }
        if(defectList != null){
            tempDefSelection = new boolean[defectList.size()];
            Arrays.fill(tempDefSelection, Boolean.FALSE);
            if(Globals.selectedReport.getCheckList().size() != 0){
                for (int i = 0; i < Globals.selectedReport.getCheckList().size(); i++){
                    if(!Globals.selectedReport.getCheckList().get(i).equals("")){
                        tempDefSelection[i] = true;
                    }
                }
            }
        }
        btChecklist.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(Globals.selectedUnit.getAssetTypeObj().getDefectCodes() != null){
                    if(Globals.selectedTask.getStatus().equals(Globals.TASK_FINISHED_STATUS)){
                    Intent intent = new Intent( ReportViewActivity.this, DefectCodeActivity.class);
                    startActivity(intent);}
                } else if (defectList != null){
                    if(Globals.selectedTask.getStatus().equals(Globals.TASK_FINISHED_STATUS)){
                        AlertDialog.Builder builder = new AlertDialog.Builder(ReportViewActivity.this);
                        // Get the layout inflater
                        LayoutInflater inflater = (ReportViewActivity.this).getLayoutInflater();
                        // Inflate and set the layout for the dialog
                        // Pass null as the parent view because its going in the
                        // dialog layout
                        builder.setTitle("Track Defects!");
                        builder.setCancelable(false);
                        LinearLayout lyDialog = new LinearLayout(ReportViewActivity.this);
                        lyDialog.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
                        lyDialog.setOrientation(LinearLayout.VERTICAL);
                        for(int i = 0; i<defectList.size(); i++){
                            LinearLayout parent = new LinearLayout(ReportViewActivity.this);
                            parent.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));
                            parent.setOrientation(LinearLayout.HORIZONTAL);
                            parent.setPadding(10, 10, 10, 10);
                            CheckBox cb = new CheckBox(ReportViewActivity.this);
                            cb.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT));
                            cb.setChecked(tempDefSelection[i]);
                            cb.setEnabled(false);
                            parent.addView(cb);
                            TextView tv = new TextView(ReportViewActivity.this);
                            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                                    LinearLayout.LayoutParams.WRAP_CONTENT,
                                    LinearLayout.LayoutParams.WRAP_CONTENT
                            );
                            params.setMargins(0,0,5, getDp(5));
                            tv.setLayoutParams(params);
                            tv.setText(defectList.get(i));
                            parent.addView(tv);
                            lyDialog.addView(parent);
                        }
                        builder.setView(lyDialog)
                                // Add action buttons
                                .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                                            @Override
                                            public void onClick(DialogInterface dialog, int id) {
                                            }
                                        }
                                );
                        builder.create();
                        builder.show();
                    }
                }else {
                    Snackbar.make(view, getString(R.string.no_def_code), Snackbar.LENGTH_LONG)
                            .setAction(getString(R.string.msg_action), null).show();
                }
            }});

        /*FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });*/
    }
    //For Images after fix
    public void setFixImgAdapter(ArrayList<IssueImage> attachments) {
        picsAfterFixAdapter = new reportImgAdapter(this, attachments, TAG_AFTER_FIX);

        LinearLayoutManager horizontalLayoutManager = new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false);
        recyclerAfterFix.setLayoutManager(horizontalLayoutManager);
        recyclerAfterFix.setAdapter(picsAfterFixAdapter);
    }
    public void setImgAdapter(ArrayList<IssueImage> attachments) {
        horizontalAdapter = new reportImgAdapter(this, attachments,TAG_BEFORE_FIX);
        LinearLayoutManager horizontalLayoutManager = new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false);
        img_recycler_view.setLayoutManager(horizontalLayoutManager);
        img_recycler_view.setAdapter(horizontalAdapter);
    }
    public void setVoiceAdapter(ArrayList<IssueVoice> attachments) {
        voiceAdapter = new reportVoiceAdapter(this, attachments);
        LinearLayoutManager horizontalLayoutManager = new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false);
        rvVoice.setLayoutManager(horizontalLayoutManager);
        rvVoice.setAdapter(voiceAdapter);
    }

    public int getDp(int size){
        Resources r = ReportViewActivity.this.getResources();
        return (int) TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP,
                size,
                r.getDisplayMetrics()
        );
    }
}
