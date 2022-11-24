package com.app.ps19.scimapp;



import android.content.DialogInterface;
import android.os.Build;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.widget.Toast;

import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.classes.dynforms.DynForm;
import com.app.ps19.scimapp.classes.dynforms.DynFormControl;

import java.util.ArrayList;
import java.util.Stack;

import static com.app.ps19.scimapp.Shared.Globals.getReportsURL;
import static com.app.ps19.scimapp.Shared.Globals.setLocale;

public class AppFormActivity extends AppCompatActivity implements DynFormFragment.OnFormClickListener {
    private static Stack<DynForm> formStack;
    private DynFormFragment primaryForm;
    private DynFormFragment secondaryForm;
    private boolean removeInProcess=false;
    private DynForm itemInFocus=null;

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
        setLocale(this);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        setContentView(R.layout.activity_app_form);
        //setContentView(R.layout.fragment_dyn_form);
        ArrayList<DynForm> forms=Globals.selectedTask.getAppForms();
        if(savedInstanceState==null){
            //DynFormList.loadFormList();
            forms=Globals.selectedTask.getAppForms();
        }
        Bundle b=getIntent().getExtras();
        String formName=b.getString("form");
        String assetType=b.getString("assetType");
        if(!assetType.equals("")){
            forms=Globals.selectedUnit.getAppForms();
        }
        for(DynForm form:forms){
            if(form.getFormName().equals(formName)){
                Globals.selectedForm=form;
                break;
            }
        }

        if(savedInstanceState!=null) {
            primaryForm = (DynFormFragment) getSupportFragmentManager().getFragment(
                    savedInstanceState, DynFormFragment.class.getName());
            Log.i("onCreate",savedInstanceState.toString());

        }

        if (primaryForm == null) {
            FragmentManager fm = getSupportFragmentManager();
            FragmentTransaction ft = fm.beginTransaction();
            //primaryForm=DynFormFragment.newInstance("","");
            primaryForm =  DynFormFragment.newInstance(assetType,"");
            primaryForm.setActivity(AppFormActivity.this);
            //ft.add(R.id.frame_apf, primaryForm, "primary");
            ft.replace(R.id.frame_apf, primaryForm, "primary");
            //ft.addToBackStack(null);
            ft.commit();
            //secondaryForm=(DynFormFragment) fm.findFragmentByTag("secondary");
            //fm.beginTransaction().hide(secondaryForm).commit();

        }
        primaryForm.setActivity(this);

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
        formStack =new Stack<>();

    }
    private boolean backPressedHandler(){
        if(formStack.size()>0){
            DynForm form=formStack.pop();
            Globals.selectedForm=form;
            primaryForm.setForm(form);
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
        }else{
            formStack.clear();
            for (Fragment fragment : getSupportFragmentManager().getFragments()) {
                //getSupportFragmentManager().beginTransaction().remove(fragment).commit();
            }
            if(primaryForm!=null ){
                final DynForm form=primaryForm.getForm();
                form.viewClosed();
                primaryForm.setActivity(null);
/*
                form.setLayout(null);
                form.setChangeEventListener(null);
*/
                Globals.selectedForm =form;
                if(form.isDirty()){
                    new AlertDialog.Builder(this)
                            .setTitle(getResources().getString(R.string.confirmation))
                            .setMessage(getResources().getString(R.string.message_save_changes))
                            .setIcon(android.R.drawable.ic_dialog_alert)
                            .setPositiveButton("YES", new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialog, int which) {
                                    Globals.selectedTask.setDirty(false);
                                    Globals.selectedJPlan.update();
                                    finish();
                                }
                            })
                            .setNegativeButton("NO", new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialog, int which) {
                                    Globals.selectedTask.setDirty(false);
                                    form.resetFormToNull();
                                    finish();
                                }
                            }).show();
                    return false;
                    //Globals.selectedTask.setDirty(false);
                    //Globals.selectedJPlan.update();
                }else if(Globals.selectedTask.isDirty()){
                    Globals.selectedTask.setDirty(false);
                    Globals.selectedJPlan.update();
                }
                else{
                    //form.resetForm();
                    form.resetFormToNull();
                }
            }

/*
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                finishAndRemoveTask();
            }else{
                finishAffinity();
            }
*/

        }
        return true;
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    public void onBackPressed() {
        //super.onBackPressed();
        if(backPressedHandler()) {
            super.onBackPressed();
        }
 /*       int count = getSupportFragmentManager().getBackStackEntryCount();

        if (count == 0) {
            super.onBackPressed();
            //additional code
        } else {
            getSupportFragmentManager().popBackStack();
        }
*/
    }
    private void selectFragment(Fragment fragment){
/*
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        transaction.replace(R.id.frame_apf,fragment);
        transaction.commit();
*/
        if(fragment.equals(primaryForm)){
            getSupportFragmentManager().beginTransaction().hide(secondaryForm).commit();
        }else{
            getSupportFragmentManager().beginTransaction().hide(primaryForm).commit();
        }
        getSupportFragmentManager().beginTransaction().show(fragment).commit();
    }
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                if(backPressedHandler()) {
                    finish();
                }
                return true;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onFormAddClick(Fragment fragment, DynFormControl control) {
        DynForm form = control.getFormTable().addNewRow();
        //control.getFormTable().generateLayout(this);
        showForm(form);
        //Toast.makeText(AppFormActivity.this,"Act.Form Add Clicked",Toast.LENGTH_SHORT).show();
    }
    private void showForm(DynForm form){
        //formStack.push(Globals.selectedForm);
        //Globals.selectedForm=form;
        formStack.push(Globals.selectedForm);
        Globals.selectedForm=form;
        //primaryForm=DynFormFragment.newInstance("","");
        primaryForm.setForm(form);
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
            Toast.makeText(AppFormActivity.this,"Press remove button again to confirm",Toast.LENGTH_SHORT).show();
            removeInProcess=true;
            itemInFocus=item;
            Runnable runnable=new Runnable() {
                @Override
                public void run() {
                    removeInProcess=false;
                    itemInFocus=null;
                }
            };

        }else{
            removeInProcess=false;
            if(itemInFocus!=null ){
                if(itemInFocus.equals(item)){
                    itemInFocus=null;
                    if(item.getParentControl()!=null){
                        item.getParentControl().getFormTable().removeRow(item);
                        item.getParentControl().getParentControl().setDirty(true);
                        //.generateLayout(item.getParentControl().getParentControl().getContext());
                        //Toast.makeText(AppFormActivity.this,"Act.Form Removed",Toast.LENGTH_SHORT).show();
                    }

                }else{
                    Toast.makeText(AppFormActivity.this,"Press remove button again to confirm",Toast.LENGTH_SHORT).show();
                    removeInProcess=true;
                    itemInFocus=item;
                }
            }

        }

    }
}
