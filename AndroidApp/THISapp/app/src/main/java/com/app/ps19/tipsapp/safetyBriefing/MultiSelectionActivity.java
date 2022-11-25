package com.app.ps19.tipsapp.safetyBriefing;

import static com.app.ps19.tipsapp.Shared.Globals.getSelectedJBriefing;
import static com.app.ps19.tipsapp.Shared.Globals.isUseDynSafetyBriefing;
import static com.app.ps19.tipsapp.Shared.Globals.jbCollection;
import static com.app.ps19.tipsapp.Shared.Globals.selectedForm;
import static com.app.ps19.tipsapp.Shared.Globals.selectedJPlan;
import static com.app.ps19.tipsapp.Shared.Globals.setSelectedJBriefing;
import static com.app.ps19.tipsapp.Shared.Utilities.dpToPixel;
import static com.app.ps19.tipsapp.classes.dynforms.DynFormList.formListMap;

import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.ContextThemeWrapper;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.app.ps19.tipsapp.R;
import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.classes.dynforms.DynForm;
import com.app.ps19.tipsapp.classes.dynforms.DynFormList;
import com.app.ps19.tipsapp.classes.safetybriefings.JobBriefing;
import com.app.ps19.tipsapp.databinding.ActivityMultiSelectionBinding;

import java.util.ArrayList;
import java.util.HashMap;

public class MultiSelectionActivity extends AppCompatActivity {

    private ActivityMultiSelectionBinding binding;
    private static final int SAFETY_BRIEFING_REQUEST_CODE = 50;
    private static final int DYN_FORM_BRIEFING_REQUEST_CODE = 60;
    final int sdk = android.os.Build.VERSION.SDK_INT;
    public static final String SAFETY_BRIEFING = "safetyBriefing";
    public static final String TRACK_N_TIME = "trackandtime";
    public static final String FORM_O = "formo";
    public static final String BRIEFING_CHECKLIST = "briefingChecklist";
    //ArrayList<String> formNames;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMultiSelectionBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        //getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        //addFormNames();
        setButtonNames();

        binding.tvNameMain.setText(selectedJPlan.getTitle());
        binding.tvDetailsMain.setText(selectedJPlan.getTaskList().get(0).getTitle());

        binding.rlBackButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackButton();
            }
        });

        binding.ltIncluded.tvFirstStep.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent safetyIntent = new Intent(MultiSelectionActivity.this, SafetyBriefingActivity.class);
                onSafetyBriefingResult.launch(safetyIntent);
            }
        });
        /*binding.ltIncluded.tvSecondStep.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Globals.selectedForm = formListMap.get("trackandtime");
                Intent tTimeIntent = new Intent(MultiSelectionActivity.this, DynBriefingFormActivity.class);
                onTrackAndTimeResult.launch(tTimeIntent);

            }
        });
        binding.ltIncluded.tvThirdStep.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Globals.selectedForm = formListMap.get("formo");
                Intent tTimeIntent = new Intent(MultiSelectionActivity.this, DynBriefingFormActivity.class);
                onFormOResult.launch(tTimeIntent);
            }
        });*/
        if(selectedJPlan.getJbCollection()!=null && selectedJPlan.getJbCollection().size()!=0){
            jbCollection = selectedJPlan.getJbCollection();
        }
    }

//Instead of onActivityResult() method use this one

    ActivityResultLauncher<Intent> onSafetyBriefingResult = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            new ActivityResultCallback<ActivityResult>() {
                @Override
                public void onActivityResult(ActivityResult result) {
                    if (result.getResultCode() == Activity.RESULT_OK) {
                        // Here, no request code
                        Intent data = result.getData();
                        //setImageChecked(binding.ivSelection1);

                    }
                }
            });
    ActivityResultLauncher<Intent> onTrackAndTimeResult = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            new ActivityResultCallback<ActivityResult>() {
                @Override
                public void onActivityResult(ActivityResult result) {
                    if (result.getResultCode() == Activity.RESULT_OK) {
                        // Here, no request code
                        Intent data = result.getData();
                        //setImageChecked(binding.ivSelection2);

                    }
                }
            });
    ActivityResultLauncher<Intent> onFormOResult = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            new ActivityResultCallback<ActivityResult>() {
                @Override
                public void onActivityResult(ActivityResult result) {
                    if (result.getResultCode() == Activity.RESULT_OK) {
                        // Here, no request code
                        Intent data = result.getData();
                        //setImageChecked(binding.ivSelection3);
                    }
                }
            });
    private void setImageChecked(ImageView iView){
        if(sdk < android.os.Build.VERSION_CODES.JELLY_BEAN) {
            iView.setBackgroundDrawable(ContextCompat.getDrawable(MultiSelectionActivity.this, R.drawable.ic_check_box_black_24dp) );
        } else {
            iView.setBackground(ContextCompat.getDrawable(MultiSelectionActivity.this, R.drawable.ic_check_box_black_24dp));
        }
    }
    private void setButtonNames(){
        HashMap<String, ArrayList<DynForm>> _formList = DynFormList.getFormListForBriefingHM();
        if(_formList.size()>0){
            for (String key: _formList.keySet()){
                if(_formList.get(key)!=null && _formList.get(key).size()>0){
                    if(!_formList.get(key).get(0).getFormSettings().getViewGroup().equals("0")){
                        createButton(_formList.get(key).get(0).getFormName(), _formList.get(key).get(0).getFormId());
                    }
                }
            }
        }/*
        for(DynForm form: DynFormList.getFormListForBriefing())
        for(String name: formNames){
            if(formListMap.get(name).getFormName()!=null && !formListMap.get(name).getFormId().equals(SAFETY_BRIEFING)){
                createButton(formListMap.get(name).getFormName(), name);
            }
        }*/
        //binding.ltIncluded.tvFirstStep.setText("Job Briefing");
       /* if(formListMap.get(TRACK_N_TIME).getFormName()!=null){
            createButton(formListMap.get(TRACK_N_TIME).getFormName(), TRACK_N_TIME);
        }
        if(formListMap.get(FORM_O).getFormName()!=null){
            createButton(formListMap.get(FORM_O).getFormName(), FORM_O);
        }*/


    }
    private void createButton(String btnName, String fName){
        // Creating a new RelativeLayout
        RelativeLayout relativeLayout =  new RelativeLayout(new ContextThemeWrapper(this,R.style.profileDetailsLayout));
        RelativeLayout mainLayout = new RelativeLayout(this);
        // Defining the RelativeLayout layout parameters.
        // In this case I want to fill its parent
        RelativeLayout.LayoutParams rlp = new RelativeLayout.LayoutParams(
                RelativeLayout.LayoutParams.MATCH_PARENT,
                RelativeLayout.LayoutParams.WRAP_CONTENT);
        mainLayout.setGravity(Gravity.CENTER);
        rlp.addRule(RelativeLayout.ALIGN_BOTTOM);
        rlp.setMargins(0, (int) dpToPixel(this,20),0,0);
        mainLayout.setBackground(ContextCompat.getDrawable(this, R.color.profileBackground));
        mainLayout.setLayoutParams(rlp);

        TextView tv = new TextView(new ContextThemeWrapper(this, R.style.profileStyledForwardButton));
        RelativeLayout.LayoutParams tvParam = new RelativeLayout.LayoutParams(
                RelativeLayout.LayoutParams.WRAP_CONTENT,
                RelativeLayout.LayoutParams.WRAP_CONTENT);
        tvParam.addRule(RelativeLayout.CENTER_VERTICAL);
        tv.setTextColor(getResources().getColor(R.color.credentials_white));
        tv.setText(btnName);
        tv.setLayoutParams(tvParam);

        View divider = new View(new ContextThemeWrapper(this, R.style.profileDetailsView));
        divider.setBackground(ContextCompat.getDrawable(this, R.color.divider_color));
        RelativeLayout.LayoutParams divParam = new RelativeLayout.LayoutParams(
                RelativeLayout.LayoutParams.MATCH_PARENT,
                (int) dpToPixel(this,2));

        divParam.setMargins(0, (int) dpToPixel(this,10),0,0);
        divider.setLayoutParams(divParam);

        mainLayout.addView(tv);
        relativeLayout.addView(mainLayout);
        binding.ltIncluded.llMainLayout.addView(relativeLayout);
        binding.ltIncluded.llMainLayout.addView(divider);
        mainLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //Globals.selectedForm = formListMap.get(fName);
                Globals.selectedForm =null;

                if(jbCollection!=null){
                    for(JobBriefing _jbCollection: jbCollection){
                        for (DynForm form: _jbCollection.getJobBriefingForms()){
                            if(form.getFormId().equals(fName)){
                                setSelectedJBriefing(_jbCollection);
                                selectedForm = form;
                                break;
                            }
                        }
                    }
                }
                /*if(selectedForm ==null){
                    selectedForm = cloneForm(fName);
                }*/
                 if(selectedForm!=null) {

                     Intent dynActivity = new Intent(MultiSelectionActivity.this, DynBriefingFormActivity.class);
                     onTrackAndTimeResult.launch(dynActivity);
                 }
            }
        });


    }
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        switch(keyCode){
            case KeyEvent.KEYCODE_BACK:
                onBackButton();
                return true;
        }
        return super.onKeyDown(keyCode, event);
    }
    @Override
    public boolean onSupportNavigateUp() {
        //code it to launch an intent to the activity you want
        onBackButton();
        return true;
    }
    private void onBackButton(){
        if(getSelectedJBriefing()!=null && getSelectedJBriefing().isDirty()){
            selectedJPlan.setJbCollection(jbCollection);
            selectedJPlan.update();
        }
        finish();
    }
    private DynForm cloneForm(String name){
        DynForm form = formListMap.get(name);
        if(form!=null){
            DynForm newForm = null;
            try {
                newForm = (DynForm) form.clone();
                newForm.cloneFieldList(form.getFormControlList());
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
            return newForm;
        } else {
            return null;
        }

    }
    /*private void setFormsInPlan(){
        if(jbCollection==null){
            jbCollection = new ArrayList<>();
        }
        for(String name: formNames){
            if(formListMap.get(name)!=null){
                JobBriefing jb = new JobBriefing();
                jb.setJobBriefingForms(new ArrayList<>());
                if(cloneForm(name)!=null){
                    jb.getJobBriefingForms().add(cloneForm(name));
                }
                //Need to revisit this logic
                jbCollection.add(jb);
            }
        }
        selectedJPlan.setJbCollection(jbCollection);
    }*/
    /*private void addFormNames(){
        formNames = new ArrayList<>();
        formNames.add(SAFETY_BRIEFING);
        formNames.add(BRIEFING_CHECKLIST);
        formNames.add(TRACK_N_TIME);
        formNames.add(FORM_O);
    }*/
}