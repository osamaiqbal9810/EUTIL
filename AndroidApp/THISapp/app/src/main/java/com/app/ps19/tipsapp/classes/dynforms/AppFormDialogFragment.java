package com.app.ps19.tipsapp.classes.dynforms;

import android.app.Dialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.DialogFragment;

import com.app.ps19.tipsapp.AppFormActivity;
import com.app.ps19.tipsapp.DynFormListFragment;
import com.app.ps19.tipsapp.R;
import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.classes.Units;
import com.app.ps19.tipsapp.classes.UnitsTestOpt;
import com.app.ps19.tipsapp.classes.equipment.Equipment;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static com.app.ps19.tipsapp.Shared.Globals.app;
import static com.app.ps19.tipsapp.Shared.Globals.getSelectedTask;
import static com.app.ps19.tipsapp.Shared.Globals.selectedForm;

public class AppFormDialogFragment extends DialogFragment {
    private List<DynForm> formListObj;
    private List formList;
    private Units unit;
    private String mParam2;
    private String mParam3="";
    private Equipment equipment;
    private boolean onlyTestForms =true;
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
    public  AppFormDialogFragment(boolean trackForms,boolean onlyTestForms){
        unit=Globals.getSelectedUnit();
        mParam2=unit.getAssetType();
        mParam3="";
        this.onlyTestForms=onlyTestForms;
        fillFormList();
    }
    public  AppFormDialogFragment(Equipment equipment){
        unit=Globals.getSelectedUnit();
        this.equipment=equipment;
        mParam2="";//unit.getAssetType();
        fillFormList();
    }
    private boolean isEquipmentFormList(){
        if(equipment!=null){
            return true;
        }
        return false;
    }
    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        // Use the Builder class for convenient dialog construction
        //CharSequence[] charSequenceItems = (CharSequence[])formList.toArray(new CharSequence[formList.size()]);
        List<DynForm> _formListObjWTest=new ArrayList<DynForm>();
        List<DynForm> _formListObjNoTest=new ArrayList<DynForm>();
        for(DynForm form:this.formListObj){
            if(testCodeHM.get(form.getFormId())!=null){
                _formListObjWTest.add(form);
            }else{
                _formListObjNoTest.add(form);
            }
        }
        int size= onlyTestForms?_formListObjWTest.size():_formListObjNoTest.size();
        CharSequence[] charSequencesItems=new CharSequence[size];
        int count=0;
        List<DynForm> _formListObj=onlyTestForms?_formListObjWTest:_formListObjNoTest;
        for (DynForm form :  _formListObj) {
            String testTitle = form.getFormName();
            if (testCodeHM.get(form.getFormId()) != null) {
                testTitle = testCodeHM.get(form.getFormId());
            }
            charSequencesItems[count] = testTitle;
            count++;
        }
        this.formListObj=_formListObj;
        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        String title=isEquipmentFormList()?("Forms for "+equipment.getName()):getString(R.string.select_a_form);
        builder.setTitle(title)
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
                            if(isEquipmentFormList()){
                                if(Globals.selectedUnit.getEquipmentForm(equipment,formObj.getFormId()) == null){
                                    Toast.makeText(getActivity(),equipment.getEquipmentType().getEquipmentType() + " parameter is missing", Toast.LENGTH_SHORT).show();
                                    return;
                                }
                                selectedForm=Globals.selectedUnit.getEquipmentForm(equipment,formObj.getFormId());
                            }else{
                                selectedForm=Globals.selectedUnit.getUnitForm(formObj.getFormId());
                                UnitsTestOpt unitTest=unit.getUnitTestOpt(formObj.getFormId());
                                if(selectedForm==null /*|| unitTest==null*/){
                                    return;
                                }
                                selectedForm.setUnitsTestOpt(unitTest);
                            }
                            selectedForm.setSelectedUnit(Globals.selectedUnit);
                            if(isEquipmentFormList()){
                                selectedForm.setSelectedEquipment(equipment);
                            }
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
                if(isEquipmentFormList()){
                    _formList=equipment.getEquipmentType().getFormList();
                }else {
                    _formList = getSelectedTask().getAppForms();
                }
            }
            ArrayList<DynForm> _formFilterList=new ArrayList<>();
            List<String> _formListText=new ArrayList<String>();
            String viewGroup=mParam3 !=null?mParam3:"";
            for(DynForm form:_formList){
                if(mParam2.equals("") && !isEquipmentFormList()) {
                    //if (!form.isAssetTypeExists()) {
                    if ((form.getFormSettings() == null && viewGroup.equals("")) ||
                            (form.getFormSettings() !=null
                                    && form.getFormSettings().getTarget().equals("task")
                                    && form.getFormSettings().getViewGroup().equals(viewGroup))

                    ) {
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