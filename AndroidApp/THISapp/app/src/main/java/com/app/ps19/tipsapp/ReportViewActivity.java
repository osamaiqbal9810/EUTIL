package com.app.ps19.tipsapp;

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
import android.util.Log;
import android.util.TypedValue;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.TextView;

import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.Shared.ListMap;
import com.app.ps19.tipsapp.Shared.MinMaxInputFilter;
import com.app.ps19.tipsapp.Shared.StaticListItem;
import com.app.ps19.tipsapp.classes.IssueImage;
import com.app.ps19.tipsapp.classes.IssueVoice;
import com.app.ps19.tipsapp.classes.RemedialActionItem;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;

import static com.app.ps19.tipsapp.Shared.Globals.getSelectedTask;
import static com.app.ps19.tipsapp.Shared.Globals.setLocale;

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
    public int defectCount;
    TextView tvDefSelectionCount;
    TextView tvDefTotalCount;
    EditText etLocationInfo;
    LinearLayout llTempRestriction;
    EditText etTempSpeedRestriction;
    TextView tvIssueTitle;
    RadioGroup rgTypeOfAction;
    RelativeLayout rlTypeOfAction;
    LinearLayout llTypeOfAction;
    //Remedial Action
    Spinner spinnerRemedialActions;
    //ArrayList<StaticListItem> remedialActionItems;
    ArrayList<RemedialActions> remedialActions;
    LinearLayout llRemedialActionForm;
    //ArrayAdapter<String> catAdapter;
    ArrayAdapter<String> trkAdapter;
    ArrayAdapter<String> priAdapter;
    ArrayAdapter<String> remedialActionAdapter;
    ArrayList<RemedialActionItem> remedialActionItems;
    RelativeLayout rlFixedTitle;
    LinearLayout llFixedSwitch;
    LinearLayout llFixedContainerOld;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setLocale(this);
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
        tvDefSelectionCount = (TextView) findViewById(R.id.tv_defect_select_count);
        tvDefTotalCount = (TextView) findViewById(R.id.tv_defect_total_count);
        etLocationInfo = (EditText) findViewById(R.id.ed_location_info);
        llTempRestriction = (LinearLayout) findViewById(R.id.ll_temp_speed_restriction);
        etTempSpeedRestriction = (EditText) findViewById(R.id.ed_speed_restriction);
        llTempRestriction.setVisibility(View.GONE);
        tvIssueTitle = (TextView) findViewById(R.id.tv_issue_title);
        rgTypeOfAction = (RadioGroup) findViewById(R.id.rg_actions_type);
        // Commenting as its unfinished
        llTypeOfAction = (LinearLayout) findViewById(R.id.ll_action_type);
        rlTypeOfAction = (RelativeLayout) findViewById(R.id.rl_action_type_title);
        rlFixedTitle = (RelativeLayout) findViewById(R.id.rl_fixed_title_old);
        llFixedSwitch = (LinearLayout) findViewById(R.id.ll_fixed_switch_old);
        llFixedContainerOld = (LinearLayout) findViewById(R.id.ll_fix);
        rlFixedTitle.setVisibility(View.GONE);
        llFixedSwitch.setVisibility(View.GONE);
        llFixedContainerOld.setVisibility(View.GONE);
        //---------- Remedial Actions
        spinnerRemedialActions=(Spinner) findViewById(R.id.spinnerRemedialActions);
        llRemedialActionForm=(LinearLayout) findViewById(R.id.remedialActionsForm);

        llTypeOfAction.setVisibility(View.GONE);
        rlTypeOfAction.setVisibility(View.GONE);

        SpannableString content = new SpannableString("Defect Codes");
        content.setSpan(new UnderlineSpan(), 0, content.length(), 0);
        tvIssueTitle.setText(Globals.selectedReport.getTitle());
        //btChecklist.setText(content);
        defectList = Globals.defectCodeList;

        catText.setText(Globals.selectedReport.getUnit().getAssetType());
        trkText.setText(Globals.selectedReport.getUnit().getDescription());
        descText.setText(Globals.selectedReport.getDescription());
        if (Globals.selectedReport.getMarked()) {
            mrkText.setText(getString(R.string.briefing_yes));
        } else {
            mrkText.setText(getString(R.string.briefing_no));
        }
        rbPerm.setEnabled(false);
        rbTemp.setEnabled(false);
        loadRemedialActions();
        priText.setText(Globals.selectedReport.getPriority());
        btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Globals.issueTitle = "";
                Globals.defectCodeDetails = new ArrayList<>();
                finish();
            }
        });
        if(Globals.selectedReport.getFixType().equals(FIX_TYPE_TEMPORARY)){
            rbTemp.setChecked(true);
            rbTemp.setEnabled(false);
            rbPerm.setEnabled(false);
            llTempRestriction.setVisibility(View.VISIBLE);
            etTempSpeedRestriction.setText(Globals.selectedReport.getTempSpeed());
            etTempSpeedRestriction.setEnabled(false);

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
        int btnCount = rgTypeOfAction.getChildCount();
        ArrayList<RadioButton> listOfRadioButtons = new ArrayList<RadioButton>();
        for (int i=0;i<btnCount;i++) {
            View o = rgTypeOfAction.getChildAt(i);
            if (o instanceof RadioButton) {
                if(((RadioButton) o).getText().equals(Globals.selectedReport.getTypeOfAction())){
                    ((RadioButton) o).setChecked(true);
                }
                //listOfRadioButtons.add((RadioButton)o);
            }
        }
        Disable_Or_Enable_RG_Button(rgTypeOfAction, false);
        //TODO: Null check must implement here
        if(Globals.selectedUnit.getAssetTypeObj().getDefectCodes() != null && Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().size()>0){
            if(Globals.selectedReport.getDefectCodes().size()>0){
                Globals.defectCodeSelection = Globals.selectedReport.getDefectCodes();
            } else {
                if(Globals.defectCodeSelection== null){
                    Globals.defectCodeSelection = new ArrayList<>();
                }
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
                    if(getSelectedTask().getStatus().equals(Globals.TASK_FINISHED_STATUS)){
                    Intent intent = new Intent( ReportViewActivity.this, DefectCodeActivity.class);
                    startActivity(intent);}
                } else if (defectList != null && defectList.size()>0){
                    if(getSelectedTask().getStatus().equals(Globals.TASK_FINISHED_STATUS)){
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
        defectCount = 0;
        if(Globals.selectedUnit.getAssetTypeObj() != null){
            if(Globals.selectedUnit.getAssetTypeObj().getDefectCodes()!=null){
                for(int i = 0 ; i < Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().size(); i++){
                    //listDataGroup.add(Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().get(i));
                    for (int j = 0 ; j < Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().get(i).getDetails().size(); j++){
                        defectCount++;
                    }
                }
            }
        }

        tvDefTotalCount.setText(String.valueOf(defectCount));
        if(Globals.defectCodeSelection!=null){
            if(Globals.defectCodeSelection.size() == 0){
                tvDefSelectionCount.setText("0");
            } else {
                int count = 0;
                for(int i=0; i < Globals.defectCodeSelection.size(); i++){
                    if (!Globals.defectCodeSelection.get(i).equals("")) {
                        count++;
                    }
                }
                tvDefSelectionCount.setText(String.valueOf(count));
            }
        }
        etLocationInfo.setText(Globals.selectedReport.getLocationInfo());
        etLocationInfo.setEnabled(false);
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
    private void Disable_Or_Enable_RG_Button(RadioGroup radioGroup,boolean enable_or_disable){
        for (int i = 0; i < radioGroup.getChildCount(); i++) {
            ((RadioButton) radioGroup.getChildAt(i)).setEnabled(enable_or_disable);
        }
    }
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        switch(keyCode){
            case KeyEvent.KEYCODE_BACK:
                // do something here
                Globals.issueTitle = "";
                Globals.defectCodeDetails = new ArrayList<>();
                finish();
                return true;
        }
        return super.onKeyDown(keyCode, event);
    }
    private class RemedialActions{
        public String code;
        public String description;
        public LinearLayout layout;
        public StaticListItem staticListItem;
        public String errorMessage="";

        public RemedialActions(String code, String description, LinearLayout layout, StaticListItem staticListItem){
            this.code=code;
            this.description=description;
            this.layout=layout;
            this.staticListItem=staticListItem;
        }
        public RemedialActions(StaticListItem item){
            this.code=item.getCode();
            this.description=item.getDescription();
            this.layout=null;
            this.staticListItem=item;
        }
        public ArrayList<RemedialActionItem> getRemedialActionItems(){
            ArrayList<RemedialActionItem> items=new ArrayList<>();
            if(staticListItem !=null){
                if(!staticListItem.getOptParam1().equals("")){
                    try{
                        JSONArray ja=new JSONArray(staticListItem.getOptParam1());
                        for(int i=0;i<ja.length();i++){
                            JSONObject jo=ja.getJSONObject(i);
                            String fieldType=jo.optString("fieldType","text");
                            String fieldName=jo.optString("fieldName","undefined");
                            String fieldId=jo.optString("id","undefined");
                            boolean required= jo.optBoolean("required",false);
                            RemedialActionItem item=new RemedialActionItem(fieldId,"",fieldName,fieldType);
                            if(fieldType.equals("text")){
                                EditText et=layout.findViewWithTag(fieldId);
                                if(et !=null){
                                    String text=et.getText().toString();
                                    if(text.equals("") && required)
                                    {
                                        this.errorMessage=fieldName +" is required";
                                    }else
                                    {
                                        this.errorMessage="";
                                    }
                                    item.setValue(text);
                                }
                            }else if(fieldType.equals("list")){
                                Spinner spinner=layout.findViewWithTag(fieldId);
                                if(spinner !=null){
                                    if(spinner.getSelectedItem() !=null){
                                        item.setValue(spinner.getSelectedItem().toString());
                                    }
                                }
                            }else if(fieldType.equals("radioList")){
                                RadioGroup rg=layout.findViewWithTag(fieldId);
                                if(rg !=null){
                                    int selectedId=rg.getCheckedRadioButtonId();
                                    RadioButton rb=findViewById(selectedId);
                                    if(rb !=null){
                                        item.setValue(rb.getText().toString());
                                    }
                                }
                            }else if(fieldType.equals("checkbox")){
                                CheckBox checkBox=layout.findViewWithTag(fieldId);
                                if(checkBox !=null){
                                    item.setValue(checkBox.isChecked()?"true":"false");

                                }
                            }
                            items.add(item);
                        }
                    }catch (Exception e){
                        Log.e("getRemedialActionItems",e.toString());
                    }
                }
            }
            return items;
        }
    }
    private void selectRemedialAction(int i){
        if(remedialActions.size()>0){
            int index=0;
            for(RemedialActions item: remedialActions){
                if(index==i){
                    if(item.layout !=null){
                        item.layout.setVisibility(View.VISIBLE);
                    }
                }else{
                    if(item.layout !=null){
                        item.layout.setVisibility(View.GONE);
                    }
                }
                index++;
            }
        }
    }
    private HashMap<String, String> getRemedialActionHash(){
        HashMap<String, String > hashMap=new HashMap<>();
        if(this.remedialActionItems !=null){
            for(RemedialActionItem item:this.remedialActionItems){
                hashMap.put(item.getId(),item.getValue());
            }
        }
        return  hashMap;
    }
    private void loadRemedialActions() {
        HashMap <String, String> items= ListMap.getListHashMap(ListMap.LIST_REM_ACTIONS);
        HashMap<String, String> hashMapRemActionItems=new HashMap<>();
        String remedialAction="";

        int selectedIndex=0;
        if(Globals.selectedReport !=null){
            this.remedialActionItems=Globals.selectedReport.getRemedialActionItems();
            hashMapRemActionItems=getRemedialActionHash();
            remedialAction=Globals.selectedReport.getRemedialAction();
        }
        if(items !=null){
            //remedialActionItems=new ArrayList<>();
            remedialActions=new ArrayList<>();
            remedialActionAdapter=new ArrayAdapter<String>(this,android.R.layout.simple_spinner_item);
            remedialActionAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
            int index=0;
            for(String key:items.keySet()){
                String strItem=items.get(key);
                if(strItem !=""){
                    try{
                        StaticListItem item=new StaticListItem(new JSONObject(strItem));
                        RemedialActions remedialActionsItem=new RemedialActions(item);
                        //remedialActionItems.add(item);
                        if(item.getDescription().equals(remedialAction)){
                            selectedIndex=index;
                        }
                        index++;
                        remedialActionAdapter.add(item.getDescription());
                        if(!item.getOptParam1().equals("")){
                            remedialActionsItem.layout=getLayout(new JSONArray(item.getOptParam1()),hashMapRemActionItems);
                            if(remedialActionsItem.layout !=null) {
                                llRemedialActionForm.addView(remedialActionsItem.layout);
                            }
                        }
                        remedialActions.add(remedialActionsItem);
                    }catch (Exception e){
                        Log.e("loadRemedialActions",e.toString());
                    }
                }
            }
            spinnerRemedialActions.setAdapter(remedialActionAdapter);
            spinnerRemedialActions.setSelection(selectedIndex);
            spinnerRemedialActions.setEnabled(false);
            spinnerRemedialActions.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
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
    private LinearLayout getLayout(JSONArray jsonArray,HashMap<String,String> currentValues){
        LinearLayout layout=null;
        if(jsonArray.length()>0){
            layout=new LinearLayout(this);
            layout.setOrientation(LinearLayout.VERTICAL);
            layout.setVisibility(View.VISIBLE);
            layout.setLayoutParams(new ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT));
            setMargins(layout,30,10,10,10);

        }
        for(int i=0;i<jsonArray.length();i++){
            try {
                JSONObject jsonObject = jsonArray.getJSONObject(i);
                String fieldType=jsonObject.optString("fieldType","text");
                String fieldName=jsonObject.optString("fieldName","undefined");
                String fieldId=jsonObject.optString("id","undefined");
                String defaultValue=jsonObject.optString("default","");
                JSONArray jaOptions=jsonObject.optJSONArray("options");
                boolean required=jsonObject.optBoolean("required",false);
                String currentValue="";
                if(currentValues !=null){
                    currentValue=currentValues.get(fieldId);
                    if(currentValue==null){
                        currentValue=defaultValue;
                    }
                }
                if(!fieldType.equals("checkbox")) {
                    TextView tvName = new TextView(this);
                    tvName.setText(fieldName + (required ? "*" : ""));
                    tvName.setLayoutParams(new ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.WRAP_CONTENT));
                    setPadding(tvName, 10, 10, 0, 0);
                    tvName.setVisibility(View.VISIBLE);
                    tvName.setEnabled(false);
                    layout.addView(tvName);
                }
                if(fieldType.equals("text")) {
                    EditText editText = new EditText(this);
                    editText.setTag(fieldId);
                    editText.setLayoutParams(new ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.WRAP_CONTENT));
                    setPadding(editText, 10, 10, 10, 10);
                    editText.setVisibility(View.VISIBLE);
                    if(!currentValue.equals("")){
                        editText.setText(currentValue);
                    }
                    editText.setEnabled(false);
                    layout.addView(editText);
                }else if(fieldType.equals("list")){
                    Spinner spinner=new Spinner(this);
                    spinner.setTag(fieldId);
                    spinner.setLayoutParams(new ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.WRAP_CONTENT));
                    setPadding(spinner, 10, 10, 10, 10);
                    spinner.setVisibility(View.VISIBLE);
                    ArrayAdapter<String> spinerAdapter=new ArrayAdapter<String>(this,android.R.layout.simple_spinner_item);
                    spinerAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);

                    if(jaOptions !=null){
                        int selectedOption=0;
                        for(int i1=0;i1<jaOptions.length();i1++){
                            spinerAdapter.add(jaOptions.getString(i1));
                            if(jaOptions.getString(i1).equals(currentValue)){
                                selectedOption=i1;
                            }
                        }
                        spinner.setEnabled(false);
                        spinner.setAdapter(spinerAdapter);
                        spinner.setSelection(selectedOption);
                    }
                    layout.addView(spinner);
                }else if(fieldType.equals("radioList")){
                    RadioGroup rg=new RadioGroup(this);
                    rg.setTag(fieldId);
                    int selectedOption=0;
                    for(int i1=0;i1<jaOptions.length();i1++){
                        RadioButton rb =new RadioButton(this);
                        rg.addView(rb,i1);
                        /*rb.setLayoutParams(new ViewGroup.LayoutParams(
                                ViewGroup.LayoutParams.MATCH_PARENT,
                                ViewGroup.LayoutParams.WRAP_CONTENT));*/
                        setPadding(rb, 10,0, 5, 5);
                        rb.setText(jaOptions.getString(i1));

                        if(jaOptions.getString(i1).equals(currentValue)){
                            selectedOption=i1;
                            rb.setChecked(true);
                        }
                    }

                    /*rg.setLayoutParams(new ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.WRAP_CONTENT));
                    */
                    setPadding(rg, 10, 10, 10, 10);

                    rg.setEnabled(false);
                    rg.setVisibility(View.VISIBLE);
                    layout.addView(rg);

                }else if(fieldType.equals("checkbox")){
                    CheckBox checkBox =new CheckBox(this);
                    checkBox.setText(fieldName);
                    checkBox.setTag(fieldId);
                    setPadding(checkBox, 10, 10, 10, 10);
                    checkBox.setVisibility(View.VISIBLE);
                    checkBox.setEnabled(false);
                    if(currentValue.equals("true")){
                        checkBox.setChecked(true);
                    }
                    checkBox.setVisibility(View.VISIBLE);
                    layout.addView(checkBox);
                }
            }catch (Exception e){
                Log.e("getLayout",e.toString());
            }
        }
        return  layout;
    }
    private void setPadding (View view, int left, int top, int right, int bottom) {
        final float scale = getBaseContext().getResources().getDisplayMetrics().density;
        // convert the DP into pixel
        int l = (int) (left * scale + 0.5f);
        int r = (int) (right * scale + 0.5f);
        int t = (int) (top * scale + 0.5f);
        int b = (int) (bottom * scale + 0.5f);
        view.setPadding(l,t,r,b);
    }
    private void setMargins (View view, int left, int top, int right, int bottom) {
        final float scale = getBaseContext().getResources().getDisplayMetrics().density;
        // convert the DP into pixel
        int l =  (int)(left * scale + 0.5f);
        int r =  (int)(right * scale + 0.5f);
        int t =  (int)(top * scale + 0.5f);
        int b =  (int)(bottom * scale + 0.5f);

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
}
