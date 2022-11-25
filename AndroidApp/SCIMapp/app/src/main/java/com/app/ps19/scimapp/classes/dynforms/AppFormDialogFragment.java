package com.app.ps19.scimapp.classes.dynforms;

import android.app.Dialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.DialogFragment;

import com.app.ps19.scimapp.AppFormActivity;
import com.app.ps19.scimapp.DynFormListFragment;
import com.app.ps19.scimapp.R;
import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.classes.Units;
import com.app.ps19.scimapp.classes.UnitsTestOpt;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static com.app.ps19.scimapp.Shared.Globals.app;
import static com.app.ps19.scimapp.Shared.Globals.getSelectedTask;
import static com.app.ps19.scimapp.Shared.Globals.selectedForm;

public class AppFormDialogFragment extends DialogFragment {
    private List<DynForm> formListObj;
    private List formList;
    private Units unit;
    private String mParam2;
    private String mParam3="";
    private HashMap<String, String> testCodeHM;
    public  AppFormDialogFragment(){
        unit=Globals.getSelectedUnit();
        mParam2=unit.getAssetType();
        fillFormList();
    }
    public  AppFormDialogFragment(boolean trackForms){
        unit=null;
        mParam2="";
        mParam3="1";
        fillFormList();
    }

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        // Use the Builder class for convenient dialog construction
        //CharSequence[] charSequenceItems = (CharSequence[])formList.toArray(new CharSequence[formList.size()]);
        CharSequence[] charSequencesItems=new CharSequence[this.formListObj.size()];
        int count=0;
        for(DynForm form:this.formListObj){
            String testTitle=form.getFormName();
            if(testCodeHM.get(form.getFormId())!=null) {
                testTitle = testCodeHM.get(form.getFormId());
            }
            charSequencesItems[count]=testTitle;
            count++;
        }
        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        builder.setTitle(getString(R.string.select_a_form))
                .setItems(charSequencesItems, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        Log.i("Dialog" ,"which: "+String.valueOf(which) );
                        String formName=formList.get(which).toString();
                        DynForm formObj=formListObj.get(which);
                        selectedForm=formObj;
                        Globals.selectedUnit=unit;
                        if(unit !=null && !unit.getUnitId().equals(Globals.selectedUnit)){
                            Globals.selectedUnit=unit;
                            selectedForm=Globals.selectedUnit.getUnitForm(formObj.getFormId());
                            UnitsTestOpt unitTest=unit.getUnitTestOpt(formObj.getFormId());
                            if(selectedForm==null || unitTest==null){
                                return;
                            }
                            selectedForm.setSelectedUnit(Globals.selectedUnit);
                            selectedForm.setUnitsTestOpt(unitTest);
                        }


                        Intent intent = new Intent(getActivity(), AppFormActivity.class);
                        intent.putExtra("assetType","");
                        intent.putExtra("getGlobalForm",true);
                        intent.putExtra("form", formObj.getFormId());
                        //intent.putExtra("assetType",mParam2);
                        //intent.putExtra("form",formName);
                        startActivity(intent);


                    }
                })
                .setNegativeButton(R.string.cancel, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        // User cancelled the dialog
                    }
                });
        // Create the AlertDialog object and return it
        return builder.create();
    }
    private void fillFormList(){
        if(getSelectedTask()!=null){
            Log.i("List Frags","getting app forms");
            mParam2=(mParam2.equals("")?"":unit.getAssetType());
            if(!mParam2.equals("")){
                //layoutInfoTables.setVisibility(View.VISIBLE);
            }

            ArrayList<DynForm> _formList=null;
            if(!mParam2.equals("")){
                if(Globals.selectedUnit !=null){
                    _formList=sortListByTests(unit.getAppForms());
                    //rayList<UnitsTestOpt> testList = selected.getUnit().getTestFormList();
                }else{
                    return;
                }
            }else{
                _formList=getSelectedTask().getAppForms();
            }
            ArrayList<DynForm> _formFilterList=new ArrayList<>();
            List<String> _formListText=new ArrayList<String>();
            String viewGroup=mParam3 !=null?mParam3:"";
            for(DynForm form:_formList){
                if(mParam2.equals("")) {
                    //if (!form.isAssetTypeExists()) {
                    if ((form.getFormSettings() == null && viewGroup.equals("")) || (form.getFormSettings() !=null && form.getFormSettings().getTarget().equals("task") && form.getFormSettings().getViewGroup().equals(viewGroup)) ) {
                        _formFilterList.add(form);
                        _formListText.add(form.getFormName());
                    }
                }else{
                    _formFilterList.add(form);
                    _formListText.add(form.getFormName());
                }
            }
            HashMap<String, String> _testCodeHM=new HashMap<>();
            if(unit !=null){
                if(unit.getTestFormList()!=null){
                    for(UnitsTestOpt unitsTestOpt:unit.getTestFormList()){
                        _testCodeHM.put(unitsTestOpt.getTestCode(),unitsTestOpt.getTitle());
                    }

                }
            }

            this.formListObj=_formFilterList;
            this.formList=_formListText;
            testCodeHM=_testCodeHM;
        }else {
            //DynFormList.loadFormList();
            //this.formList = DynFormList.getFormList();
        }
    }

    private ArrayList<DynForm> sortListByTests(ArrayList<DynForm> appForms) {
        ArrayList<UnitsTestOpt> testList= unit.getTestFormList();
        HashMap<String, DynForm> formHashMap=new HashMap<>();
        ArrayList<DynForm> formList=new ArrayList<>();
        for(DynForm form:appForms)
        {
            formHashMap.put(form.getFormId(),form);
        }
        for(int i=0;i<testList.size();i++)
        {
            DynForm form= formHashMap.get(testList.get(i).getTestCode());
            if(form !=null){
                formList.add(form);
                formHashMap.remove(testList.get(i).getTestCode());
            }
        }
        if(formHashMap.size()>0) {
            for (String key : formHashMap.keySet()) {
                formList.add(formHashMap.get(key));
            }
        }
        return formList;
    }
}