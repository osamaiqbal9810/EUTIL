package com.app.ps19.tipsapp.ativ;

import static com.app.ps19.tipsapp.Shared.Globals.defectSelection;
import static com.app.ps19.tipsapp.Shared.Globals.defectSelectionCopy;
import static com.app.ps19.tipsapp.Shared.Globals.getSelectedAtivDef;
import static com.app.ps19.tipsapp.Shared.Globals.getSelectedTask;
import static com.app.ps19.tipsapp.Shared.Globals.getSelectedUnit;
import static com.app.ps19.tipsapp.Shared.Globals.isSingleDefCode;
import static com.app.ps19.tipsapp.Shared.Globals.isSingleDefectSelection;
import static com.app.ps19.tipsapp.Shared.Globals.sATIVDefect;
import static com.app.ps19.tipsapp.Shared.Globals.selectedCode;
import static com.app.ps19.tipsapp.Shared.Globals.selectedJPlan;
import static com.app.ps19.tipsapp.Shared.Globals.setLocale;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Bundle;
import android.text.SpannableString;
import android.text.style.UnderlineSpan;
import android.view.KeyEvent;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.app.ps19.tipsapp.DefectCodeActivity;
import com.app.ps19.tipsapp.R;
import com.app.ps19.tipsapp.ReportAddActivity;
import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.classes.LatLong;
import com.app.ps19.tipsapp.classes.ativ.ATIVData;
import com.app.ps19.tipsapp.classes.ativ.ATIVDefect;
import com.google.common.collect.ArrayListMultimap;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class ATIVDefectDetailsActivity extends AppCompatActivity {
    private final int REQ_CODE_DEFECT_CODE = 11;
    private detailAdapter detailAdapter;
    EditText etInfo;
    private String joString = "{'ativ_defects':[{'verified':false,'lat':'0.0','long':'0.0','properties':[{'name':'Track Type','value':'MAIN','tag':'','index':1},{'name':'Worst Location','value':'4.88902'},{'name':'Defect Number','value':'94'},{'name':'Latitude','value':'41.7682','tag':'latitude'},{'name':'Longitude','value':'-87.8023','tag':'longitude'}]}]}";
    RecyclerView rvDetails;
    TextView tvDefSelectionCount;
    CheckBox cbVerify;
    CheckBox cbDeficiency;
    Button btnSave;
    TextView tvDefectCodes;
    TextView tvDefTotalCount;
    public int defectCount;
    String sCode;
    String selectedDescription;
    boolean isViewOnly = false;
    boolean isUseProps = false;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_ativdefect_details);

        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        isUseProps = getIntent().getBooleanExtra("USE_FROM_PROPS", false);
        // set up the RecyclerView
        RecyclerView rvDetails = findViewById(R.id.rv_details);
        setTitle("Defect details");

        rvDetails.setLayoutManager(new LinearLayoutManager(this));
        /*aData = null;
        try {
            aData = new ATIVData(new JSONObject(joString));
        } catch (JSONException e) {
            e.printStackTrace();
        }*/
        if(getSelectedAtivDef().getProperties()!=null){
            detailAdapter = new detailAdapter(this, getSelectedAtivDef().getProperties());
        } else {
            for(ATIVDefect originalADefect: getSelectedUnit().getAtivDefects()){
                if(originalADefect.getAtivId().equals(getSelectedAtivDef().getAtivId())){
                    detailAdapter = new detailAdapter(this, originalADefect.getProperties());

                }
            }
        }

        rvDetails.setAdapter(detailAdapter);
        tvDefSelectionCount = (TextView) findViewById(R.id.tv_defect_select_count);
        tvDefTotalCount = (TextView) findViewById(R.id.tv_defect_total_count);
        cbVerify = findViewById(R.id.cb_verify);
        cbDeficiency = findViewById(R.id.cb_deficiency);
        tvDefectCodes = findViewById(R.id.tv_defects);
        btnSave = findViewById(R.id.btn_update);
        etInfo = findViewById(R.id.et_info);

        SpannableString content = new SpannableString(getString(R.string.defects_title));
        content.setSpan(new UnderlineSpan(), 0, content.length(), 0);
        tvDefectCodes.setText(content);

        //Counting defects
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
        tvDefTotalCount.setText(String.valueOf(defectCount));

        tvDefectCodes.setOnClickListener(view -> {
            if(!isViewOnly){
                if (!cbDeficiency.isChecked()) {
                    if (Globals.selectedUnit.getAssetTypeObj() != null) {
                        if (Globals.selectedUnit.getAssetTypeObj().getDefectCodes() != null) {
                            isSingleDefCode = true;
                            Intent intent = new Intent(ATIVDefectDetailsActivity.this, DefectCodeActivity.class);
                            startActivityForResult(intent, REQ_CODE_DEFECT_CODE);
                            //startActivity(intent);
                        } else {
                            Toast.makeText(ATIVDefectDetailsActivity.this, getString(R.string.no_def_code), Toast.LENGTH_SHORT).show();                        }
                    } else {
                        Toast.makeText(ATIVDefectDetailsActivity.this, getString(R.string.no_def_code), Toast.LENGTH_SHORT).show();
                    }
                } else {
                    Toast.makeText(ATIVDefectDetailsActivity.this, getString(R.string.issue_type_msg), Toast.LENGTH_SHORT).show();
                }
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
                        Toast.makeText(ATIVDefectDetailsActivity.this, R.string.issue_type_msg, Toast.LENGTH_SHORT).show();
                    cbDeficiency.setChecked(false);
                }

            }
        });
        /*cbVerify.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {

            @Override
            public void onCheckedChanged(CompoundButton buttonView,
                                         boolean isChecked) {
                //int defectCount = Integer.parseInt(tvDefSelectionCount.getText().toString());
                int defectCount = defectSelectionCopy.values().size();
                if(isChecked){
                    if(defectCount == 0 && !cbDeficiency.isChecked() && !isViewOnly){
                        Toast.makeText(ATIVDefectDetailsActivity.this, "Please assign Defect code or Deficiency before verification", Toast.LENGTH_SHORT).show();
                        cbVerify.setChecked(false);
                    }
                }
            }
        });*/
        btnSave.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(isViewOnly){
                    finish();
                    return;
                }
                int defectCount = Integer.parseInt(tvDefSelectionCount.getText().toString());

                /*if (defectCount == 0 && !cbDeficiency.isChecked()) {
                    Toast.makeText(ATIVDefectDetailsActivity.this, getResources().getString(R.string.issue_type_req_msg), Toast.LENGTH_SHORT).show();
                    return;
                } else*/
                if(!cbVerify.isChecked()){
                    Toast.makeText(ATIVDefectDetailsActivity.this, "Please acknowledge by marking the verify checkbox!", Toast.LENGTH_SHORT).show();
                } else {
                    updateIssue();
                }
            }
        });
        if(getSelectedAtivDef().isVerified()){
            String info ="";
            if(isUseProps){
                info = getSelectedAtivDef().getVerifiedProps().getDefCode() + "\n" + getSelectedAtivDef().getVerifiedProps().getDefDescription();
                cbDeficiency.setChecked(getSelectedAtivDef().getVerifiedProps().isDeficiency());
            } else {
                if(getSelectedAtivDef().getDefCode()!=null&&getSelectedAtivDef().getDefCode().equals("null")){
                    info = getSelectedAtivDef().getDefCode() + "\n" + getSelectedAtivDef().getDefDescription();
                } else {
                    info = getSelectedAtivDef().getDefDescription();
                }
                cbDeficiency.setChecked(getSelectedAtivDef().isDeficiency());

            }
            isViewOnly = true;
            etInfo.setText(info);
            etInfo.setEnabled(false);
            cbVerify.setChecked(true);
            cbVerify.setEnabled(false);
            cbDeficiency.setEnabled(false);
            btnSave.setText("Back");
            tvDefSelectionCount.setText("1");

        }
    }
    private void updateIssue(){
        ATIVDefect aDefect = new ATIVDefect();
        aDefect.setDefCode(sCode);
        if(selectedDescription == null || selectedDescription.equals("")){
            aDefect.setDefDescription(etInfo.getText().toString());
        } else {
            aDefect.setDefDescription(selectedDescription);
        }

        aDefect.setAtivId(getSelectedAtivDef().getAtivId());
        aDefect.setDeficiency(cbDeficiency.isChecked());
        aDefect.setVerified(cbVerify.isChecked());
        aDefect.setvLocation(new LatLong(String.valueOf(Globals.lastKnownLocation.getLatitude()),String.valueOf(Globals.lastKnownLocation.getLongitude())));
        aDefect.setoLatitude(getSelectedAtivDef().getoLatitude());
        aDefect.setoLongitude(getSelectedAtivDef().getoLongitude());
        aDefect.setMilepost(getSelectedAtivDef().getMilepost());
        if(selectedJPlan.getTaskList().get(0).getAtivIssues() == null){
            selectedJPlan.getTaskList().get(0).setAtivIssues(new ArrayList<>());
        }
        selectedJPlan.getTaskList().get(0).getAtivIssues().add(aDefect);
        selectedJPlan.update();
        closeActivity();
    }
    @Override
    public boolean onSupportNavigateUp() {
        closeActivity();
        return true;
    }
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        switch (keyCode) {
            case KeyEvent.KEYCODE_BACK:
                closeActivity();
        }
        return super.onKeyDown(keyCode, event);
    }
    private void closeActivity(){
        Globals.defectCodeSelection = new ArrayList<>();
        Globals.issueTitle = "";
        Globals.defectCodeDetails = new ArrayList<>();
        defectSelectionCopy.clear();
        defectSelection.clear();
        finish();
    }
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        Bundle extras;
        String receivedData;
        setLocale(this);
        if (requestCode == REQ_CODE_DEFECT_CODE) {
            isSingleDefCode = false;
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

                                boolean isNonFRACodes= Globals.versionInfo.isNonFRACodes();
                                String _title = defectSelection.keySet().toArray()[0].toString();
                                String[] titleArray = _title.split(Globals.defectDivider);
                                String title =isNonFRACodes?titleArray[1]: titleArray[0] + " - " + titleArray[1];
                                sCode = isNonFRACodes?titleArray[1]: titleArray[0];
                                selectedDescription = titleArray[1];
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
                                sCode = sCode + " - " + descArray[0];
                                selectedDescription = selectedDescription + " - " + descArray[1];
                                String completeCode = title + "\n" + desc;
                                etInfo.setText(completeCode);
                                //Disabling input
                                etInfo.setEnabled(false);
                                tvDefSelectionCount.setText(String.valueOf(defectSelectionCopy.values().size()));
                            } else {
                                //If no defect code is selected
                                etInfo.setText("");
                                selectedDescription = "";
                                etInfo.setEnabled(true);
                                tvDefSelectionCount.setText(String.valueOf(defectSelection.values().size()));
                                int defectCount = defectSelectionCopy.values().size();
                                if(defectCount == 0 && !cbDeficiency.isChecked()){
                                    cbVerify.setChecked(false);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}