package com.app.ps19.tipsapp;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import androidx.fragment.app.Fragment;

import android.os.Environment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.classes.dynforms.DynControlBinding;
import com.app.ps19.tipsapp.classes.dynforms.DynControlLookup;
import com.app.ps19.tipsapp.classes.dynforms.DynControlType;
import com.app.ps19.tipsapp.classes.dynforms.DynForm;
import com.app.ps19.tipsapp.classes.dynforms.DynFormControl;
import com.app.ps19.tipsapp.classes.dynforms.DynFormList;
import com.app.ps19.tipsapp.classes.dynforms.ExpressionEval;
import com.app.ps19.tipsapp.classes.dynforms.MappingOptions;
import com.app.ps19.tipsapp.classes.dynforms.OnValueChangeEventListener;
import com.app.ps19.tipsapp.classes.dynforms.defaultvalues.DynFormDv;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;

import static com.app.ps19.tipsapp.Shared.Globals.PING_ADDRESS;
import static com.app.ps19.tipsapp.Shared.Globals.appName;
import static com.app.ps19.tipsapp.Shared.Globals.docFolderName;
import static com.app.ps19.tipsapp.Shared.Globals.getSelectedTask;
import static com.app.ps19.tipsapp.Shared.Globals.selectedJPlan;
import static com.app.ps19.tipsapp.Shared.Globals.selectedUnit;
import static com.app.ps19.tipsapp.Shared.Utilities.getDocumentPath;


/**
 * A simple {@link Fragment} subclass.
 * Use the {@link DynFormFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class DynFormFragment extends Fragment implements OnValueChangeEventListener {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    Activity activity;
    public void setActivity(Activity activity){this.activity=activity;}

    public void refresh() {
        //rootView=null;
        selectForm(form);
        this.rootView.invalidate();
        scrollView.post(new Runnable() {
            @Override
            public void run() {
                scrollView.fullScroll(scrollView.FOCUS_UP);
            }
        });
    }

    public interface OnFormClickListener{
        public void onFormAddClick(Fragment fragment,DynFormControl control);
        public void onFormItemClick(Fragment fragment,DynFormControl control,DynForm item);
        public void onFormItemRemoveClick(Fragment fragment,DynFormControl control,DynForm item);
    }
    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    private ArrayList<DynForm> formList;
    private Spinner spinnerFormList;
    private LinearLayout formLayout;
    private LinearLayout formToolbox;
    private LinearLayout formLayoutHeader;
    private ArrayAdapter<String> formListAdapter;
    private View rootView=null;
    private ScrollView scrollView=null;
    private Button btnSave;
    private Button btnCancel;
    private TextView tvFormTitle;
    private LinearLayout llTestFormsContainer;
    private Spinner spTestForms;
    private Button btViewInfo;

    public DynForm getForm() {
        return form;
    }

    public void setForm(DynForm form) {
        this.form = form;
        selectForm(form);
    }

    private DynForm form;

    private Context _context=null;
    public DynFormFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment DynFormFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static DynFormFragment newInstance(String param1, String param2) {
        DynFormFragment fragment = new DynFormFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }
    @Override
    public void onAttach(Context context)
    {
        super.onAttach(context);
        this.activity = getActivity();
    }

    @Override
    public void onDetach() {
        super.onDetach();
        this.activity=null;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
        this.form=Globals.selectedForm;
        updateEventListener();
        Log.i("onCreateFrag","References Updated");
        //DynFormList.loadSampleFormList();
/*
        if(Globals.selectedTask!=null){
              this.formList=Globals.selectedTask.getAppForms();
        }else {
            //DynFormList.loadFormList();
            //this.formList = DynFormList.getFormList();
        }
        formListAdapter=new ArrayAdapter<>(getContext(),android.R.layout.simple_spinner_item);
        formListAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        for(DynForm item:formList){
            formListAdapter.add(item.getFormName());

        }
*/

    }

    private void updateEventListener() {
        try {
            this.form.viewChanged(getActivity());
            this.form.viewListenerChanged(this);
        } catch (Exception e) {
            e.printStackTrace();
        }
        //this.form.generateLayout(getActivity());
        /*
        ArrayList<DynFormControl> controls=this.form.getFormControlList();
        this.form.setChangeEventListener(this);
        for(DynFormControl control:controls){
            control.setListener(this);
        }
*/
    }

    @Override
    public View onCreateView(LayoutInflater inflater, final ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        if(rootView==null) {
            rootView = inflater.inflate(R.layout.fragment_dyn_form, container, false);
            //Button btnSubmit = (Button) rootView.findViewById(R.id.btSubmit);
            _context = rootView.getContext();
            tvFormTitle=rootView.findViewById(R.id.tvForms);
            tvFormTitle.setText(form.getFormName());
            //spinnerFormList=rootView.findViewById(R.id.spinnerFormList);
            formLayout=rootView.findViewById(R.id.layoutFormDetails);
            formToolbox=rootView.findViewById(R.id.layoutToolbox_fdf);
            formLayoutHeader=rootView.findViewById(R.id.layoutFormHeader);
            scrollView=rootView.findViewById(R.id.scrollViewAppForm);
            llTestFormsContainer = rootView.findViewById(R.id.ll_instructions);
            spTestForms = rootView.findViewById(R.id.sp_forms);
            btViewInfo = rootView.findViewById(R.id.bt_view_info);

            ArrayList<String> formsList;
            if(selectedUnit!=null) {
                formsList = form.getPdfFiles(selectedUnit.getAssetType());
            }else{
                formsList =new ArrayList<>();
            }
            if(appName == Globals.AppName.TIMPS){
                llTestFormsContainer.setVisibility(View.GONE);
            } else if (appName == Globals.AppName.SCIM){
                llTestFormsContainer.setVisibility(View.VISIBLE);
            }
            //Hiding View if no instruction available
            if (formsList.size() == 0){
                llTestFormsContainer.setVisibility(View.GONE);
            }

            // Creating adapter for spinner
            ArrayAdapter<String> dataAdapter = new ArrayAdapter<String>(_context, android.R.layout.simple_spinner_item, formsList);

            // Drop down layout style - list view with radio button
            dataAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);

            // attaching data adapter to spinner
            spTestForms.setAdapter(dataAdapter);
            if(formsList.size()==0){
                btViewInfo.setEnabled(false);
            } else {
                btViewInfo.setEnabled(true);
            }
            btViewInfo.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    Intent intent = new Intent(getActivity(), PdfActivity.class);
                    //File dir = Environment.getExternalStoragePublicDirectory(docFolderName);
                    File file = new File(getDocumentPath(spTestForms.getSelectedItem().toString()));
                    if(file.exists()){
                        Globals.selectedPdf = file;
                        startActivity(intent);
                    } else {
                        Toast.makeText(getActivity(), "File not found!", Toast.LENGTH_SHORT).show();
                    }
                    //startMuPDFActivityWithExampleFile();
                }});
            if(!mParam1.equals("") && mParam1.toLowerCase().equals("switch")){
                formLayoutHeader.setVisibility(View.VISIBLE);
                TextView tvText=rootView.findViewById(R.id.tvDfAssetType);
                tvText.setText(selectedUnit.getAssetType());

                tvText=rootView.findViewById(R.id.tvDfMilepost);
                tvText.setText(selectedUnit.getStart());

            }
            //spinnerFormList.setAdapter(this.formListAdapter);
            btnSave=rootView.findViewById(R.id.btnSaveForm_fdf);
            btnCancel=rootView.findViewById(R.id.btnCancel_fdf);
            btnCancel.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    //int i=spinnerFormList.getSelectedItemPosition();
                    //DynForm form=formList.get(i);
                    form.resetFormToNull();
                    form.getLayout().invalidate();
                    getActivity().onBackPressed();
                }
            });
            btnSave.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    //int i=spinnerFormList.getSelectedItemPosition();
                    //DynForm form=formList.get(i);
                    try {
                        JSONObject jo=form.getJsonObject();
                        if(jo !=null) {
                            try {
/*                                DynForm mainForm=null;
                                //Globals.selectedTask.setAppForms(formList);
                                //Globals.selectedJPlan.update();
                                if(form.getParentControl()!=null){
                                    if(form.getParentControl().getParentControl()!=null){
                                        mainForm=form.getParentControl().getParentControl();
                                        form.getParentControl().getParentControl().generateLayout(form.getParentControl().getParentControl().getContext());
                                    }
                                    //Sync formTable with currentValue
                                    JSONArray jaFormData=new JSONArray();
                                    for(DynForm dynForm:form.getParentControl().getFormTable().getFormData()){
                                        jaFormData.put(dynForm.getJsonObject());
                                    }
                                    form.getParentControl().setCurrentValue(jaFormData.toString());
                                }*/
                                String validateMsg=form.validateForm();
                                if(!validateMsg.equals("")){
                                    Toast.makeText(getActivity(),validateMsg,Toast.LENGTH_SHORT).show();
                                    return;
                                }
                                getSelectedTask().setDirty(true);
                                form.updateForm();
/*                                if(mainForm!=null){
                                    mainForm.updateForm();
                                }*/
                            } catch (Exception e) {
                                e.printStackTrace();
                                String text=getResources().getString(R.string.error_update);
                                Toast.makeText(activity, text, Toast.LENGTH_LONG).show();
                            }

                            String text = getResources().getString(R.string.successfully_updated); //jo.toString(5);
                            Toast.makeText(activity, text, Toast.LENGTH_LONG).show();
                            //form.resetFormToNull();
                            form.getLayout().invalidate();
                            getActivity().onBackPressed();
                        }else{
                            String text="Unable to find any changes";
                            Toast.makeText(activity, text, Toast.LENGTH_LONG).show();
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });
            /*
            spinnerFormList.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                @Override
                public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                    DynForm form=formList.get(i);
                    selectForm(form);

                }

                @Override
                public void onNothingSelected(AdapterView<?> adapterView) {

                }
            });
            */
            selectForm(form,true);
            /*
            if(formList!=null){
            if(this.formList.size()>0){
                selectForm(this.formList.get(0));
                }
            }*/
        }

        return rootView;
    }
    private void selectForm(DynForm form){
        selectForm(form, false);
    }
    private void selectForm(DynForm form,boolean forceRedraw){
        boolean showSaveOption=false;
        form.setChangeEventListener(DynFormFragment.this);
        form.setDirty(false);
        form.setLoading(true);
        if((form.getCurrentValues()==null) || (form.getCurrentValues() !=null && form.getCurrentValues().size()==0)) {
            if (selectedUnit != null && selectedUnit.getDefaultFormValues() != null) {
                for (DynFormDv dForm : selectedUnit.getDefaultFormValues().formList) {
                    if (dForm.getId().equals(form.getFormId())) {
                        HashMap<String, String> controlValues=dForm.getControlValues();
                        HashMap<String, String> filteredControlValues=new HashMap<>();
                        for(String key:controlValues.keySet()){
                            DynFormControl control=form.getFormControlListMap().get(key);
                            if(control!=null){
                                if(control.isFieldEnabled()){
                                    filteredControlValues.put(key,controlValues.get(key));
                                }
                            }
                        }
                        form.setCurrentValues( filteredControlValues);
                        form.setDefaultValuesExists(true);
                        showSaveOption=true;
                        break;
                    }
                }
            }
        }
        boolean isEmptyRowExists=false;
        for(DynFormControl control:form.getFormControlList()){
            if(control.getFieldType()== DynControlType.Table){
                for(DynForm form1: control.getFormTable().getFormData()){
                    if(form1.getCurrentValues()==null || (form1.isNewForm() && !form1.isDirty())){
                        control.getFormTable().removeRow(form1);
                        isEmptyRowExists=true;
                        break;
                    }
                }
            }
        }
        if(forceRedraw || form.getLayout()==null|| isEmptyRowExists ){
            form.generateLayout(getActivity());
        }
        //form.setChangeEventListener(DynFormFragment.this);
        LinearLayout layout=form.getLayout();
        form.setDirty(false);
        if(showSaveOption){
            form.setDirty(true);
        }
        if(layout !=null){
            if(formLayout.getChildCount()>0){
                formLayout.removeAllViews();
            }
            if(layout.getParent() != null) {
                ((ViewGroup)layout.getParent()).removeView(layout);
            }
            formLayout.addView(layout);
            formLayout.postInvalidate();
        }
        form.setLoading(false);
        //process all controls and check its binding state
        for(DynFormControl control : form.getFormControlList()){
            if(control.getBinding()!= null){
                control.getBinding().valueChanged(control.getCurrentValue());
            }

        }
    }
    @Override
    public void onValueChange(String id, String value) {

    }

    @Override
    public void onFormDirtyChange(boolean dirty) {

        if(dirty){
            formToolbox.setVisibility(View.VISIBLE);
            //spinnerFormList.setVisibility(View.INVISIBLE);
        }else{
            formToolbox.setVisibility(View.INVISIBLE);
            //spinnerFormList.setVisibility(View.VISIBLE);

        }
    }

    @Override
    public void onObjectAddClick(DynFormControl control) {
        ((OnFormClickListener) this.activity).onFormAddClick(this, control);
        //Toast.makeText(getActivity(),"Add Button Pressed on "+control.getFieldName(),Toast.LENGTH_SHORT).show();

    }

    @Override
    public void onObjectRemoveClick(DynFormControl control, DynForm item) {
        String itemName=item.getFormControlList().get(0).getCurrentValue() +"["+ control.getFieldName()+"]";
        if(this.activity !=null) {
            ((OnFormClickListener) this.activity).onFormItemRemoveClick(this, control, item);
        }
        //Toast.makeText(getActivity(),"Remove Button Pressed on "+itemName,Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onObjectItemClick(DynFormControl control, DynForm item) {
        String itemName=item.getFormControlList().get(0).getCurrentValue() +"["+ control.getFieldName()+"]";
        //Toast.makeText(getActivity(),"Item Clicked on "+itemName,Toast.LENGTH_SHORT).show();
        if(this.activity!= null) {
            ((OnFormClickListener) this.activity).onFormItemClick(this, control, item);
        }
    }
    @Override
    public void onObjectPropertyChange(DynControlBinding binding, String value,String originalValue){
        LinearLayout layout=this.form.getLayout();
        String id=binding.getTargetControl();
        final String groupId=binding.getTargetGroup();
        final String property=binding.getTargetProperty();
        DynFormControl control=this.form.getFormControlListMap().get(id);
        //ExpressionEval expressionEval=new ExpressionEval();
        Log.d("Expression",String.valueOf(ExpressionEval.eval("19 + 10 * 2")));

        if(!groupId.equals("")){
            //Group control selected
            boolean optionsProcessed=false;
            if(binding!=null && binding.getMapping()!=null && binding.getMapping().getOptions()!= null) {
                ArrayList<MappingOptions> options = binding.getMapping().getOptions();
                for (int i = 0; i < options.size(); i++) {
                    MappingOptions option = options.get(i);
                    if (option.getOptions().contains(originalValue)) {
                        setGroupProperty(option.getTargetGroup().equals("") ? groupId : option.getTargetGroup(), property, option.getMapTo());
                        optionsProcessed = true;
                    }
                }
            }
            if(!optionsProcessed){
                setGroupProperty(groupId,property,value);
            }
/*
            LinearLayout groupLayout=layout.findViewWithTag(groupId);
            if(groupLayout!=null){
                if(property.equals("visible")){
                    int visibility=value.equals("true")?View.VISIBLE:View.GONE;
                    groupLayout.setVisibility(visibility);
                }
            }
*/
        }else if(control!=null) {
            if(control.getFieldType()==DynControlType.Text || control.getFieldType()==DynControlType.Number ){
                TextView label=(TextView) layout.findViewWithTag("lbl-"+id);
                EditText editText=(EditText)layout.findViewWithTag(id);
                // enabled , visible , value
                if(property.equals("visible")){
                    int visibility=value.equals("true")?View.VISIBLE:View.GONE;
                    editText.setVisibility(visibility);
                    label.setVisibility(visibility);
                }else if(property.equals("enabled")){
                    boolean enabled=value.equals("true")?true:false;
                    editText.setEnabled(enabled);
                }else if(property.equals("value")){
                    if(binding.getTargetPropertyLookup().equals("table")){
                        DynControlLookup controlLookup= control.getLookup();
                        if(controlLookup!= null){
                            DynFormControl rowControl=this.form.getFormControlListMap().get(controlLookup.getRow());
                            DynFormControl colControl=this.form.getFormControlListMap().get(controlLookup.getCol());
                            if(rowControl!= null && colControl!= null && rowControl.getCurrentValue()!= null
                                    && colControl.getCurrentValue()!= null ){

                                String lookupValue=controlLookup.getLookupValue(colControl.getCurrentValue()
                                        ,rowControl.getCurrentValue());
                                if(lookupValue!=null) {
                                    editText.setText(lookupValue);
                                }else{
                                    editText.setText("");
                                }
                            }
                        }

                    }else {
                        editText.setText(value);
                    }
                }
            }else if(control.getFieldType()==DynControlType.Table
                    || control.getFieldType()==DynControlType.Checkbox
                    || control.getFieldType()==DynControlType.Date
                    || control.getFieldType()==DynControlType.DateTime
                    || control.getFieldType()==DynControlType.List
                    || control.getFieldType()==DynControlType.RadioList
            ){
                String controlTag=id;
                if(control.getFieldType()==DynControlType.Table){
                    controlTag="table-"+id;
                }
                View view= layout.findViewWithTag(controlTag);
                if(property.equals("visible")){
                    int visibility=value.equals("true")?View.VISIBLE:View.GONE;
                    view.setVisibility(visibility);
                }else if(property.equals("enabled")){
                    boolean enabled=value.equals("true")?true:false;
                    view.setEnabled(enabled);
                }
            }
        }
    }

    private void setGroupProperty(String groupId, String property, String value) {
        LinearLayout layout=this.form.getLayout();
        LinearLayout groupLayout=layout.findViewWithTag(groupId);
        if(groupLayout!=null){
            if(property.equals("visible")){
                int visibility=value.equals("true")?View.VISIBLE:View.GONE;
                groupLayout.setVisibility(visibility);
            }else if(property.equals("enabled")){
                boolean enabled=value.equals("true")?true:false;
                groupLayout.setEnabled(enabled);
            }
        }
    }
    /*
    @Override
    public void onObjectPropertyChange(String id, String property, String value) {
        LinearLayout layout=this.form.getLayout();
        DynFormControl control=this.form.getFormControlListMap().get(id);
        if(control!=null) {
            if(control.getFieldType()==DynControlType.Text){
                TextView label=(TextView) layout.findViewWithTag("lbl-"+id);
                EditText editText=(EditText)layout.findViewWithTag(id);
                // enabled , visible , value
                if(property.equals("visible")){
                    int visibility=value.equals("true")?View.VISIBLE:View.GONE;
                    editText.setVisibility(visibility);
                    label.setVisibility(visibility);
                }else if(property.equals("enabled")){
                    boolean enabled=value.equals("true")?true:false;
                    editText.setEnabled(enabled);
                }else if(property.equals("value")){
                    editText.setText(value);
                }
            }
        }
    }
    */
}
