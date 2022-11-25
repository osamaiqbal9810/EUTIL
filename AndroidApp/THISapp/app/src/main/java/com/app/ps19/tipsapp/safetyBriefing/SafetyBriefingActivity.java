package com.app.ps19.tipsapp.safetyBriefing;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;

import com.app.ps19.tipsapp.AppFormActivity;
import com.app.ps19.tipsapp.DynFormFragment;
import com.app.ps19.tipsapp.classes.dynforms.DynForm;
import com.app.ps19.tipsapp.classes.dynforms.DynFormControl;
import com.app.ps19.tipsapp.classes.safetybriefings.JobBriefing;
import com.google.android.material.tabs.TabLayout;

import androidx.annotation.RequiresApi;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.viewpager.widget.ViewPager;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Handler;
import android.util.Log;
import android.view.KeyEvent;
import android.view.WindowManager;
import android.widget.Toast;

import com.app.ps19.tipsapp.R;
import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.classes.SafetyBriefingForm;
import com.app.ps19.tipsapp.safetyBriefing.ui.main.SectionsPagerAdapter;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

import static com.app.ps19.tipsapp.Shared.Globals.getSelectedJBriefing;
import static com.app.ps19.tipsapp.Shared.Globals.getSelectedTask;
import static com.app.ps19.tipsapp.Shared.Globals.isUseDynSafetyBriefing;
import static com.app.ps19.tipsapp.Shared.Globals.isUseRailDirection;
import static com.app.ps19.tipsapp.Shared.Globals.jbCollection;
import static com.app.ps19.tipsapp.Shared.Globals.safetyBriefing;
import static com.app.ps19.tipsapp.Shared.Globals.selectedForm;
import static com.app.ps19.tipsapp.Shared.Globals.setLocale;
import static com.app.ps19.tipsapp.Shared.Globals.safetyBriefingContext;
import static com.app.ps19.tipsapp.Shared.Globals.setSelectedJBriefing;
import static com.app.ps19.tipsapp.classes.dynforms.DynFormList.formListMap;

public class SafetyBriefingActivity extends AppCompatActivity implements BriefingFragment.OnFragmentInteractionListener, WorkerFragment.OnFragmentInteractionListener, CommentsFragment.OnFragmentInteractionListener, DynBriefingFragment.OnFormClickListener{
    public static DynBriefingFragment primaryForm;
    private boolean getGlobalForm=false;
    private boolean removeInProcess=false;
    private DynForm itemInFocus=null;
    private static Stack<DynForm> formStack;
    SectionsPagerAdapter sectionsPagerAdapter;
    @Override
    protected void onResumeFragments() {
        super.onResumeFragments();
        if(primaryForm!=null){
            //getSupportFragmentManager().beginTransaction().replace(R.id.frame_apf,primaryForm).commit();
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setLocale(this);
        setTitle(R.string.activity_title_safety_briefing);
        setContentView(R.layout.activity_safety_briefing);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        safetyBriefingContext = this;
        try {
            if(Globals.selectedJPlan.getSafetyBriefingForm()!=null){
                Globals.safetyBriefing = Globals.selectedJPlan.getSafetyBriefingForm();
                if(Globals.safetyBriefing.getTypeOfProtection()==null){
                    ArrayList<String> types = new ArrayList<String>();
                    types.add("");
                    types.add("");
                    types.add("");
                    types.add("");
                    types.add("");
                    Globals.safetyBriefing.setMyTypeOfProtection(types);
                }
            } else {
                if(jbCollection == null){
                    Globals.jbCollection = new ArrayList<>();
                }
                Globals.safetyBriefing = new SafetyBriefingForm(new JSONObject());
                Globals.safetyBriefing.setMyTypeOfProtection(new ArrayList<String>());
                ArrayList<String> types = new ArrayList<String>();
                types.add("");
                types.add("");
                types.add("");
                types.add("");
                types.add("");
                Globals.safetyBriefing.setMyTypeOfProtection(types);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);


        /*for (int i = 0; i<5; i++){
            Globals.safetyBriefing.getTypeOfProtection().set(i, "");
        }*/
        /*getActionBar().setDisplayHomeAsUpEnabled(true);
        getActionBar().setHomeButtonEnabled(true);*/
        //etSupportActionBar().setDisplayHomeAsUpEnabled(true);
        sectionsPagerAdapter = new SectionsPagerAdapter(this, getSupportFragmentManager());
        ViewPager viewPager = findViewById(R.id.view_pager);
        viewPager.setAdapter(sectionsPagerAdapter);
        TabLayout tabs = findViewById(R.id.safety_briefing_tabs);
        tabs.setupWithViewPager(viewPager);
        /*FloatingActionButton fab = findViewById(R.id.fab);

        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });*/


        // Start of Dynamic data
       /* if(getSelectedTask()== null){
            Toast.makeText(SafetyBriefingActivity.this,"System is not ready! Please try again...",Toast.LENGTH_SHORT).show();
            finish();
        }*/
        //ArrayList<DynForm> forms=getSelectedTask().getAppForms();
        /*if(savedInstanceState==null){
            //DynFormList.loadFormList();
            forms=getSelectedTask().getAppForms();
        }*/
        /*Bundle b=getIntent().getExtras();
        String formName="form1";//b.getString("form");
        String assetType=b.getString("assetType");
        boolean blnGetGlobalForm=b.getBoolean("getGlobalForm");
        this.getGlobalForm=blnGetGlobalForm;
        if(!assetType.equals("")){
            forms=Globals.selectedUnit.getAppForms();
        }
        for(DynForm form:forms){
            if(form.getFormName().equals(formName) || form.getFormId().equals(formName)){
                if(!blnGetGlobalForm) {
                    Globals.selectedForm = form;
                }
                break;
            }
        }*/


       /* if (primaryForm == null) {
            FragmentManager fm = getSupportFragmentManager();
            FragmentTransaction ft = fm.beginTransaction();
            //primaryForm=DynFormFragment.newInstance("","");
            primaryForm =  DynBriefingFragment.newInstance("","");
            primaryForm.setActivity(SafetyBriefingActivity.this);
            //ft.add(R.id.frame_apf, primaryForm, "primary");
            ft.replace(R.id.frame_apf, primaryForm, "primary");
            //ft.addToBackStack(null);
            ft.commit();
            //secondaryForm=(DynFormFragment) fm.findFragmentByTag("secondary");
            //fm.beginTransaction().hide(secondaryForm).commit();

        }*/
        //primaryForm.setActivity(this);

        //primaryForm = (DynFormFragment) fm.findFragmentByTag("primary");
        //fm.beginTransaction().show(primaryForm).commit();

/*
        primaryForm = (DynFormFragment) fm.findFragmentById(R.id.frame_apf);
        if (primaryForm == null) {
            primaryForm = DynFormFragment.newInstance("","");

            FragmentTransaction ft = fm.beginTransaction();
            ft.add(R.id.frame_apf, primaryForm, "primaryFragment");
            ft.commit();
        }*/
        /*
        primaryForm=DynFormFragment.newInstance("","");
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        transaction.replace(R.id.frame_apf, primaryForm);
        //transaction.addToBackStack(null);

// Commit the transaction
        transaction.commit();*/

        if(isUseDynSafetyBriefing){
            if(jbCollection!=null && jbCollection.size()!=0){
                if(jbCollection.get(0).getJobBriefingForms().get(0).getFormSettings().getViewGroup().equals("0")){
                    selectedForm = jbCollection.get(0).getJobBriefingForms().get(0);
                    setSelectedJBriefing(jbCollection.get(0));

                }
            }
            //primaryForm = (DynBriefingFragment) getSupportFragmentManager().getFragments().get(0);
            if(savedInstanceState!=null) {
                primaryForm = (DynBriefingFragment) getSupportFragmentManager().getFragment(
                        savedInstanceState, DynBriefingFragment.class.getName());
                Log.i("onCreate",savedInstanceState.toString());

            }
            formStack =new Stack<>();
            if(getSelectedJBriefing()!=null){
                safetyBriefing.setReviewComments(getSelectedJBriefing().getReviewComments());
                safetyBriefing.setSignature(getSelectedJBriefing().getSignature());
            }
            if (jbCollection != null && jbCollection.size() != 0) {
                for (JobBriefing briefing : jbCollection) {
                    if(briefing.getWorkers()!=null&&briefing.getWorkers().size()!=0){
                        Globals.safetyBriefing.setWorkers(briefing.getWorkers());
                    }
                }

            }
            setTitle(selectedForm.getFormName());
        }
        // End of Dynamic data
    }
    @Override
    public boolean onSupportNavigateUp() {
        //code it to launch an intent to the activity you want
        if(onBackButton()){
            finish();
        }
        return true;
    }
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        switch(keyCode){
            case KeyEvent.KEYCODE_BACK:
                // do something here
                /*if (!etAcct.getText().toString().equals("") || !etName.getText().toString().equals("") || !signatureImg.getImgName().equals("")) {
                    showDialog();
                } else {
                    finish();
                }*/
                if(onBackButton()) {
                    finish();
                }
                return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    public void onFragmentInteraction(Uri uri) {

    }
    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        Log.d("Tag", "onSaveInstanceState Called");
        if(isUseDynSafetyBriefing){
            try {
                if(primaryForm!=null){
                    getSupportFragmentManager().putFragment(outState, DynBriefingFragment.class.getName(),primaryForm);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    public void onBackPressed() {
        if(onBackButton()) {
            super.onBackPressed();
        }
    }
    private boolean onBackButton(){
        try {
            if (isUseDynSafetyBriefing) {
                getSelectedJBriefing().setDirty(true);
                if (formStack.size() > 0) {
                    DynForm childForm = primaryForm.getForm();
                    boolean isChildDirty = childForm.isDirty();
                    if (childForm.isDirty()) {
                        String validateMsg = childForm.validateForm();
                        if (!validateMsg.equals("")) {
                            Toast.makeText(SafetyBriefingActivity.this, validateMsg, Toast.LENGTH_SHORT).show();
                            return false;
                        }
                        childForm.updateForm();
                    }
                    DynForm form = formStack.pop();
                    if (isChildDirty) {
                        form.setDirty(isChildDirty);
                    }

                    Globals.selectedForm = form;
                    primaryForm.setForm(form, form.isDirty());
                    primaryForm.refresh();
                    return false;

                } else {
                    if (selectedForm.isDirty()) {
                        Toast.makeText(SafetyBriefingActivity.this, "Please Save or Cancel the changes to proceed!", Toast.LENGTH_SHORT).show();
                        return false;
                    }
                    JobBriefing jBriefing = new JobBriefing();
                    jBriefing.getJobBriefingForms().add(Globals.selectedForm);
                    jBriefing.setWorkers(Globals.safetyBriefing.getWorkers());
                    jBriefing.setSignature(Globals.safetyBriefing.getSignature());
                    jBriefing.setReviewComments(Globals.safetyBriefing.getReviewComments());
                    boolean isFound = false;
                    for (int i = 0; i < jbCollection.size(); i++) {
                        if (jbCollection.get(i).getWorkers() != null || jbCollection.get(i).getJobBriefingForms().get(0).getFormSettings().getViewGroup().equals("0")) {
                            isFound = true;
                            jbCollection.set(i, jBriefing);
                        }
                    }
                    if (!isFound) {
                        jbCollection.add(jBriefing);
                    }
                }
                } else{
                    Globals.selectedJPlan.setSafetyBriefingForm(Globals.safetyBriefing);
                    Globals.selectedJPlan.update();
                }
            } catch(Exception e){
                e.printStackTrace();

            }

            //setResult(RESULT_OK);
        return true;
    }
    @Override
    public void onFormAddClick(Fragment fragment, DynFormControl control) {
        setPrimaryForm(getSupportFragmentManager().getFragments());
        DynFormControl control1=primaryForm.getForm().getFormControlListMap().get(control.getId());
        DynForm form = control1.getFormTable().addNewRow(selectedForm);
        form.setNewForm(true);
        showForm(form);
    }

    @Override
    public void onFormItemClick(Fragment fragment, DynFormControl control, DynForm item) {
        setPrimaryForm(getSupportFragmentManager().getFragments());
        showForm(item);
    }

    @Override
    public void onFormItemRemoveClick(Fragment fragment,  DynFormControl control, DynForm item) {
        setPrimaryForm(getSupportFragmentManager().getFragments());
        if(!removeInProcess){
            Toast.makeText(SafetyBriefingActivity.this, getString(R.string.remove_buton_again_to_confirm),Toast.LENGTH_SHORT).show();
            removeInProcess=true;
            itemInFocus=item;
            Runnable runnable=new Runnable() {
                @Override
                public void run() {
                    removeInProcess=false;
                    itemInFocus=null;
                }
            };
            final Handler handler=new Handler();
            handler.postDelayed(runnable,3000);

        }else{
            removeInProcess=false;
            if(itemInFocus!=null ){
                if(itemInFocus.equals(item)){
                    itemInFocus=null;
                    if(item.getParentForm()!=null){
                        DynForm parentForm=item.getParentForm();
                        DynFormControl parentControl=item.getParentControl();
                        parentControl.getFormTable().removeRow(item);
                        parentForm.setDirty(true);
                        parentControl.setCurrentValueFromTable();
                        //parentForm.getCurrentValues().put(parentControl.getId(),parentControl.getCurrentValue());
                        Toast.makeText(SafetyBriefingActivity.this,"Form Removed",Toast.LENGTH_SHORT).show();
                    }

                }else{
                    Toast.makeText(SafetyBriefingActivity.this,getString(R.string.remove_buton_again_to_confirm),Toast.LENGTH_SHORT).show();
                    removeInProcess=true;
                    itemInFocus=item;
                }
            }

        }

    }
    private void showForm(DynForm form){
        formStack.push(Globals.selectedForm);
        form.setParentForm(Globals.selectedForm);
        Globals.selectedForm=form;
        primaryForm.setForm(form, form.isDirty());
        primaryForm.refresh();
    }
    private void setPrimaryForm(List<Fragment> fragments ){
        for(Fragment frg: fragments){
            if(frg.getArguments().getString("param1").equals("First")){
                primaryForm = (DynBriefingFragment) frg;
            }
        }
    }
}