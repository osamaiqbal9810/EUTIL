package com.app.ps19.tipsapp.safetyBriefing;

import static android.view.View.GONE;
import static android.view.View.VISIBLE;

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
import android.view.WindowManager;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.app.ps19.tipsapp.PdfActivity;
import com.app.ps19.tipsapp.R;
import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.classes.dynforms.DynControlBinding;
import com.app.ps19.tipsapp.classes.dynforms.DynControlType;
import com.app.ps19.tipsapp.classes.dynforms.DynForm;
import com.app.ps19.tipsapp.classes.dynforms.DynFormControl;
import com.app.ps19.tipsapp.classes.dynforms.MappingOptions;
import com.app.ps19.tipsapp.classes.dynforms.OnValueChangeEventListener;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.util.ArrayList;

import static com.app.ps19.tipsapp.Shared.Globals.getSelectedJBriefing;
import static com.app.ps19.tipsapp.Shared.Globals.getSelectedTask;
import static com.app.ps19.tipsapp.Shared.Utilities.getDocumentPath;


/**
 * A simple {@link Fragment} subclass.
 * Use the {@link DynBriefingFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class DynBriefingFragment extends Fragment implements OnValueChangeEventListener {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    Activity activity;
    public String parentControlId;
    public void setActivity(Activity activity){this.activity=activity;}

    public void refresh() {
        selectForm(form, form.isDirty());
        this.rootView.invalidate();
        if(rootView!=null){
            setFocus();
        }
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

    public void setForm(DynForm form, boolean isDirty) {
        this.form = form;
        selectForm(form, isDirty);
    }

    private DynForm form;

    private Context _context=null;
    public DynBriefingFragment() {
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
    public static DynBriefingFragment newInstance(String param1, String param2) {
        DynBriefingFragment fragment = new DynBriefingFragment();
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
            rootView = inflater.inflate(R.layout.fragment_dyn_briefing, container, false);
            //Button btnSubmit = (Button) rootView.findViewById(R.id.btSubmit);
            try {
                getActivity().getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
            } catch (Exception e) {
                e.printStackTrace();
            }
            _context = rootView.getContext();
            tvFormTitle=rootView.findViewById(R.id.tvForms);
            tvFormTitle.setText(form.getFormName());
            //spinnerFormList=rootView.findViewById(R.id.spinnerFormList);
            formLayout=rootView.findViewById(R.id.layoutFormDetails);
            formToolbox=rootView.findViewById(R.id.layoutToolbox_fdf);
            formLayoutHeader=rootView.findViewById(R.id.layoutFormHeader);

            llTestFormsContainer = rootView.findViewById(R.id.ll_instructions);
            spTestForms = rootView.findViewById(R.id.sp_forms);
            btViewInfo = rootView.findViewById(R.id.bt_view_info);

            ArrayList<String> formsList;
            formsList = form.getFormPdfFiles();
            /*if(appName == Globals.AppName.TIMPS){
                llTestFormsContainer.setVisibility(View.GONE);
            } else if (appName == Globals.AppName.SCIM){
                llTestFormsContainer.setVisibility(View.VISIBLE);
            }*/
            //Hiding View if no instruction available
            if (formsList.size() == 0){
                llTestFormsContainer.setVisibility(GONE);
            }

            // Creating adapter for spinner
            ArrayAdapter<String> dataAdapter = new ArrayAdapter<String>(_context, android.R.layout.simple_spinner_item, formsList);

            // Drop down layout style - list view with radio button
            dataAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);

            // attaching data adapter to spinner
            spTestForms.setAdapter(dataAdapter);
            if(formsList.size()==0){
                llTestFormsContainer.setVisibility(GONE);
                btViewInfo.setEnabled(false);
            } else {
                llTestFormsContainer.setVisibility(VISIBLE);
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
                }});
            /*
            if(!mParam1.equals("") && mParam1.toLowerCase().equals("switch")){
                formLayoutHeader.setVisibility(View.VISIBLE);
                TextView tvText=rootView.findViewById(R.id.tvDfAssetType);
                tvText.setText(selectedUnit.getAssetType());

                tvText=rootView.findViewById(R.id.tvDfMilepost);
                tvText.setText(selectedUnit.getStart());

            }*/
            //spinnerFormList.setAdapter(this.formListAdapter);
            btnSave=rootView.findViewById(R.id.btnSaveForm_fdf);
            btnCancel=rootView.findViewById(R.id.btnCancel_fdf);
            btnCancel.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    //int i=spinnerFormList.getSelectedItemPosition();
                    //DynForm form=formList.get(i);
                    try {
                        form.resetFormToNull();
                        form.getLayout().invalidate();
                        getSelectedJBriefing().setDirty(false);
                        form.setDirty(false);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
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
                                getSelectedJBriefing().setDirty(true);
                                form.updateForm();
/*                                if(mainForm!=null){
                                    mainForm.updateForm();
                                }*/
                            } catch (Exception e) {
                                e.printStackTrace();
                                getSelectedJBriefing().setDirty(false);
                                String text=getResources().getString(R.string.error_update);
                                Toast.makeText(activity, text, Toast.LENGTH_LONG).show();
                                return;
                            }
                            form.setDirty(false);
                            String text = getResources().getString(R.string.successfully_updated); //jo.toString(5);
                            Toast.makeText(activity, text, Toast.LENGTH_LONG).show();
                            //form.resetFormToNull();
                            form.getLayout().invalidate();
                            //getActivity().onBackPressed();
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
            selectForm(form,true,form.isDirty());
            /*
            if(formList!=null){
            if(this.formList.size()>0){
                selectForm(this.formList.get(0));
                }
            }*/
        }

        return rootView;
    }
    private void selectForm(DynForm form, boolean isDirty){
        selectForm(form, false, isDirty);
    }
    private void selectForm(DynForm form,boolean forceRedraw, boolean isDirty){
        boolean showSaveOption=false;
       /* form.setChangeEventListener(this);
        for( DynFormControl control: form.getFormControlList()){
            control.viewListenerChanged(this);
        }*/
        form.setChangeEventListener(this);
        form.setDirty(isDirty);
        /*if((form.getCurrentValues()==null) || (form.getCurrentValues() !=null && form.getCurrentValues().size()==0)) {
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
        }*/
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
        form.setDirty(isDirty);
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
            formToolbox.setVisibility(VISIBLE);
            //spinnerFormList.setVisibility(View.INVISIBLE);
        }else{
            formToolbox.setVisibility(View.INVISIBLE);
            //spinnerFormList.setVisibility(View.VISIBLE);

        }
    }

    @Override
    public void onObjectAddClick(DynFormControl control) {
        if(this.activity != null)
        ((OnFormClickListener) this.activity).onFormAddClick(this, control);
        parentControlId = control.getId();

    }

    @Override
    public void onObjectRemoveClick(DynFormControl control, DynForm item) {
        String itemName=item.getFormControlList().get(0).getCurrentValue() +"["+ control.getFieldName()+"]";
        if(this.activity !=null) {
            ((OnFormClickListener) this.activity).onFormItemRemoveClick(this, control, item);
        }
    }

    @Override
    public void onObjectItemClick(DynFormControl control, DynForm item) {
        String itemName=item.getFormControlList().get(0).getCurrentValue() +"["+ control.getFieldName()+"]";
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
                    editText.setText(value);
                }
            }else if(control.getFieldType()==DynControlType.Table
                    || control.getFieldType()==DynControlType.Checkbox
                    || control.getFieldType()==DynControlType.Date
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
    private void setFocus(){
        if(parentControlId!=null){
            //int id = getResources().getIdentifier(parentControlId, "id", "com.app.ps19");
            View control = rootView.findViewWithTag(parentControlId);
            control.requestFocus();
            parentControlId = null;
        }
    }
}
