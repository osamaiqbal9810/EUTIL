package com.app.ps19.tipsapp.safetyBriefing;

import static com.app.ps19.tipsapp.Shared.Globals.jbCollection;
import static com.app.ps19.tipsapp.Shared.Globals.selectedForm;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.KeyEvent;
import android.view.WindowManager;
import android.widget.Toast;

import com.app.ps19.tipsapp.DynFormFragment;
import com.app.ps19.tipsapp.R;
import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.classes.dynforms.DynForm;
import com.app.ps19.tipsapp.classes.dynforms.DynFormControl;
import com.app.ps19.tipsapp.classes.safetybriefings.JobBriefing;

import java.util.ArrayList;
import java.util.Stack;

public class DynBriefingFormActivity extends AppCompatActivity implements DynBriefingFragment.OnFormClickListener{
    private DynBriefingFragment primaryForm;
    private boolean removeInProcess=false;
    private DynForm itemInFocus=null;
    private static Stack<DynForm> formStack;

    @Override
    protected void onStop() {
        super.onStop();
        Log.d("onStop","OnStopCalled Called");
    }

    @Override
    protected void onPostResume() {
        super.onPostResume();
        Log.d("onPostResume","OnPostResume Called"+(primaryForm==null));
    }

    @Override
    protected void onResumeFragments() {
        super.onResumeFragments();
        if(primaryForm!=null){
            getSupportFragmentManager().beginTransaction().replace(R.id.frame_apf,primaryForm).commit();
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        Log.d("Tag", "onSaveInstanceState Called");
        getSupportFragmentManager()
                .putFragment(outState, DynFormFragment.class.getName(),primaryForm);
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dyn_briefing_form);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        if(savedInstanceState!=null) {
            primaryForm = (DynBriefingFragment) getSupportFragmentManager().getFragment(
                    savedInstanceState, DynBriefingFragment.class.getName());
            Log.i("onCreate",savedInstanceState.toString());

        }


        if (primaryForm == null) {
            FragmentManager fm = getSupportFragmentManager();
            FragmentTransaction ft = fm.beginTransaction();
            //primaryForm=DynFormFragment.newInstance("","");
            //Globals.selectedForm = formListMap.get("safetyBriefing");
            primaryForm =  DynBriefingFragment.newInstance("","");
            primaryForm.setActivity(DynBriefingFormActivity.this);
            //ft.add(R.id.frame_apf, primaryForm, "primary");
            ft.replace(R.id.frame_apf, primaryForm, "primary");
            //ft.addToBackStack(null);
            ft.commit();
        }

        setTitle(selectedForm.getFormName());
        formStack =new Stack<>();
    }
    @Override
    public boolean onSupportNavigateUp() {
        //code it to launch an intent to the activity you want
        //if (!etAcct.getText().toString().equals("") || !etName.getText().toString().equals("") || !signatureImg.getImgName().equals("")) {
       if(onBackCall()){
           finish();
       }
        //} else {
        //    finish();
        //}
        return true;
    }
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        switch(keyCode){
            case KeyEvent.KEYCODE_BACK:
                if(onBackCall()){
                    finish();
                }
                return true;
        }
        return super.onKeyDown(keyCode, event);
    }
    private boolean onBackCall(){
        if(formStack.size()>0){
            DynForm childForm= primaryForm.getForm();
            boolean isChildDirty = childForm.isDirty();
            if(childForm.isDirty()) {
                String validateMsg=childForm.validateForm();
                if(!validateMsg.equals("")){
                    Toast.makeText(DynBriefingFormActivity.this,validateMsg,Toast.LENGTH_SHORT).show();
                    return false;
                }
                childForm.updateForm();
            }
            DynForm form=formStack.pop();
            if(isChildDirty){
                form.setDirty(isChildDirty);
            }

            Globals.selectedForm=form;
            primaryForm.setForm(form, form.isDirty());
            primaryForm.refresh();
            return false;
/*
            if(formStack.size()==0){
                selectFragment(primaryForm);
            }else{
                secondaryForm.setForm(Globals.selectedForm);
                secondaryForm.refresh();
                selectFragment(secondaryForm);
            }
*/
        } else {
            if (selectedForm.isDirty()) {
                Toast.makeText(DynBriefingFormActivity.this, "Please Save or Cancel the changes to proceed!", Toast.LENGTH_SHORT).show();
                return false;
            }
            boolean isFound = false;
            if (jbCollection != null && jbCollection.size() != 0) {
                for (JobBriefing briefing : jbCollection) {
                    if (briefing.getJobBriefingForms() != null && briefing.getJobBriefingForms().size() != 0) {
                        for (DynForm form : briefing.getJobBriefingForms()) {
                            if (form.getFormId().equals(selectedForm.getFormId())) {
                                isFound = true;
                                form = selectedForm;
                            }
                        }
                    }
                }
            }
            if (!isFound) {
                JobBriefing jBriefing = new JobBriefing();
                jBriefing.getJobBriefingForms().add(Globals.selectedForm);
                if (jbCollection == null)
                    jbCollection = new ArrayList<>();

                jbCollection.add(jBriefing);
            }
        }
        return true;
    }
    @Override
    public void onFormAddClick(Fragment fragment, DynFormControl control) {
        DynFormControl control1=primaryForm.getForm().getFormControlListMap().get(control.getId());
        DynForm form = control1.getFormTable().addNewRow(Globals.selectedForm);
        //control.getFormTable().generateLayout(this);
        form.setNewForm(true);
        //form.setDirty(true);
        //primaryForm.getForm().setDirty(true);
        showForm(form);
        //Toast.makeText(AppFormActivity.this,"Form Add Clicked",Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onFormItemClick(Fragment fragment, DynFormControl control, DynForm item) {
        /*if(isFinishing()){
            showForm(item);
            showForm(item);
            DynForm form=formStack.pop();
            Globals.selectedForm=form;
            primaryForm.setForm(form);
            primaryForm.refresh();
        }else {
            showForm(item);
        }*/
        showForm(item);
        //Toast.makeText(AppFormActivity.this,"Act.Form Item Clicked",Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onFormItemRemoveClick(Fragment fragment,  DynFormControl control, DynForm item) {
        if(!removeInProcess){
            Toast.makeText(DynBriefingFormActivity.this, getString(R.string.remove_buton_again_to_confirm),Toast.LENGTH_SHORT).show();
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
/*                    if(item.getParentControl()!=null){
                        item.getParentControl().getFormTable().removeRow(item);
                        item.getParentControl().getParentControl().setDirty(true);
                        //.generateLayout(item.getParentControl().getParentControl().getContext());
                        //Toast.makeText(AppFormActivity.this,"Act.Form Removed",Toast.LENGTH_SHORT).show();
                    }*/
                    if(item.getParentForm()!=null){
                        DynForm parentForm=item.getParentForm();
                        DynFormControl parentControl=item.getParentControl();
                        parentControl.getFormTable().removeRow(item);
                        parentForm.setDirty(true);
                        parentControl.setCurrentValueFromTable();
                        //parentForm.getCurrentValues().put(parentControl.getId(),parentControl.getCurrentValue());
                        Toast.makeText(DynBriefingFormActivity.this,"Form Removed",Toast.LENGTH_SHORT).show();
                    }

                }else{
                    Toast.makeText(DynBriefingFormActivity.this,getString(R.string.remove_buton_again_to_confirm),Toast.LENGTH_SHORT).show();
                    removeInProcess=true;
                    itemInFocus=item;
                }
            }

        }

    }
    private void showForm(DynForm form){
        //formStack.push(Globals.selectedForm);
        //Globals.selectedForm=form;
        formStack.push(Globals.selectedForm);
        form.setParentForm(Globals.selectedForm);
        Globals.selectedForm=form;
        //primaryForm=DynFormFragment.newInstance("","");
        primaryForm.setForm(form, form.isDirty());
        primaryForm.refresh();

        //AppFormActivity.this.onResumeFragments();
        //System.out.println(isFinishing());
/*
        getSupportFragmentManager()
                .beginTransaction()
                .detach(primaryForm)
                .attach(primaryForm)
                .commit();
*/
/*
        try {

            this.getSupportFragmentManager().beginTransaction().show(primaryForm).commit();
            //this.getSupportFragmentManager().popBackStackImmediate();
        } catch (IllegalStateException ignored) {
            // There's no way to avoid getting this if saveInstanceState has already been called.
            this.getSupportFragmentManager().beginTransaction().show(primaryForm).commitAllowingStateLoss();
            System.out.println(ignored);
        }
*/
/*
        if (secondaryForm==null) {
            //if(!isFinishing()) {
                formStack.push(Globals.selectedForm);
                Globals.selectedForm=form;
                secondaryForm = DynFormFragment.newInstance("", "");
    ;8            FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
                transaction.add(secondaryForm,"secondaryForm");
                transaction.replace(R.id.frame_apf, secondaryForm);
                transaction.commitAllowingStateLoss();
                //transaction.commit();
            //}
        }else {
            //if(!isFinishing()) {
                formStack.push(Globals.selectedForm);
                Globals.selectedForm=form;
                secondaryForm.setForm(Globals.selectedForm);
                secondaryForm.refresh();
                FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
                transaction.rep
                transaction.replace(R.id.frame_apf, secondaryForm);
                //transaction.commit();
                transaction.commitAllowingStateLoss();
            //}
        }*/
    }
}