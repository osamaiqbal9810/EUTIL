package com.app.ps19.elecapp.classes.dynforms;

import static com.app.ps19.elecapp.Shared.Utilities.createDashedLined;

import android.app.Activity;
import android.content.Context;
import android.text.Editable;
import android.text.InputType;
import android.text.TextWatcher;
import android.util.Log;
import android.util.TypedValue;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;
import android.widget.TextView;

import com.app.ps19.elecapp.R;
import com.app.ps19.elecapp.Shared.Globals;
import com.app.ps19.elecapp.Shared.IConvertHelper;
import com.app.ps19.elecapp.classes.DimensionConverter;
import com.app.ps19.elecapp.classes.Units;
import com.app.ps19.elecapp.classes.UnitsTestOpt;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;

public class DynForm implements IConvertHelper,Cloneable,IViewController {
    private String formId;
    private String formName;
    private boolean hasData=false;
    private ArrayList<DynFormControl> formControlList;
    private HashMap<String, DynFormControl> formControlListMap;
    private HashMap<String,String> currentValues;
    private HashMap<String, String> copyCurrentValues;
    private Context context;
    private LinearLayout layout;
    private LinearLayout layoutListItem;
    private boolean dirty=false;
    private HashMap<String, Object> hmBackupValues;
    private boolean changeOnly=false;
    private DynFormSettings formSettings=null;
    private boolean defaultValuesExists=false;
    private Units selectedUnit;
    private UnitsTestOpt unitsTestOpt;
    private String formCompleteId;
    private boolean loading=false;

    public boolean isLoading() {
        return loading;
    }

    public void setLoading(boolean loading) {
        this.loading = loading;
    }

    public String getFormCompleteId() {
        return formCompleteId;
    }

    public void setFormCompleteId(String formCompleteId) {
        this.formCompleteId = formCompleteId;
    }

    public void setSelectedUnit(Units selectedUnit) {
        this.selectedUnit = selectedUnit;
    }

    public Units getSelectedUnit() {
        return selectedUnit;
    }

    public void setUnitsTestOpt(UnitsTestOpt unitsTestOpt) {
        this.unitsTestOpt = unitsTestOpt;
    }

    public UnitsTestOpt getUnitsTestOpt() {
        return unitsTestOpt;
    }

    public HashMap<String, DynFormControl> getFormControlListMap() {
        return formControlListMap;
    }

    public void setDefaultValuesExists(boolean defaultValuesExists) {
        this.defaultValuesExists = defaultValuesExists;
    }

    public boolean isDefaultValuesExists() {
        return defaultValuesExists;
    }

    public boolean isChangeOnly() {
        return changeOnly;
    }

    public void setChangeOnly(boolean changeOnly) {
        this.changeOnly = changeOnly;
    }
    public DynFormSettings getFormSettings(){return formSettings;}
    public DynFormControl getParentControl() {
        return parentControl;
    }

    public void setParentControl(DynFormControl parentControl) {
        this.parentControl = parentControl;
    }

    private DynFormControl parentControl;

    private OnValueChangeEventListener changeEventListener;
    public void setChangeEventListener(OnValueChangeEventListener listener){
        this.changeEventListener=listener;
    }
    public LinearLayout getLayoutListItem(){return layoutListItem;}
    public ArrayList<DynFormControl> getFormControlList(){
        return this.formControlList;
    }
    public boolean isDirty(){
        return this.dirty;
    }
    public void setDirty(boolean dirty){
        this.dirty=dirty;
        if(this.changeEventListener!=null){
            this.changeEventListener.onFormDirtyChange(dirty);
        }
    }
    public Context getContext(){
        return this.context;
    }
    public LinearLayout getLayout(){
        return  this.layout;
    }
    public void setLayout(LinearLayout layout){
        this.layout=layout;
    }
    public void setContext(Context context){
        this.context=context;
    }
    public String getFormId(){return formId;}
    public void setFormId(String formId){this.formId=formId;}
    public String getFormName() {
        return formName;
    }

    public void setFormName(String formName) {
        this.formName = formName;
    }

    public boolean isHasData() {
        return hasData;
    }

    public void setHasData(boolean hasData) {
        this.hasData = hasData;
    }
    public void  setCurrentValues(HashMap<String, String> values){
        this.currentValues=values;
        this.copyCurrentValues=copyCurrentValues(this.currentValues);
        loadControlValues(values);
        if(layout!=null) {
            refresh();
            setDirty(false);
        }
    }
    public ArrayList<String> getPdfFiles(){
        return getPdfFiles("");
    }
    public ArrayList<String> getPdfFiles(String assetType){
        ArrayList<String> fileList=new ArrayList<>();
        if(formSettings!=null){
            ArrayList<DynFormConfig> configs= formSettings.getConfigs();
            for(DynFormConfig config:configs){
                if(assetType.equals("") || config.getAssetType().equals(assetType)){
                    fileList.addAll(config.getInstructionFile());
                }
            }
        }
        return fileList;
    }
    public boolean isAssetTypeExists(){
        if(formSettings !=null){
            return formSettings.getAssetTypes().size()>0;
        }
        return false;
    }
    public boolean isTaskForm(){
        if(formSettings != null){
            return formSettings.getAssetTypes().size() == 0 && formSettings.getTarget().equals("task");
        }
        return false;
    }
    public boolean isAssetTypeInList(String assetType){
        ArrayList<String> _assetTypeList=getFormAssetTypes();
        if(_assetTypeList!=null) {
            for (String type : _assetTypeList) {
                if (type.equals(assetType)) {
                    return true;
                }
            }
        }
        return false;
    }
    public ArrayList<String> getFormAssetTypes(){
        if(formSettings!=null){
            return formSettings.getAssetTypes();
        }
        return null;
    }
    public boolean loadFormSettings(JSONObject joFormSettings){
        formSettings=new DynFormSettings(joFormSettings);
        return true;
    }
    public HashMap<String, String> getCurrentValues(){
        return this.currentValues;
    }
    public DynForm(String formName, boolean hasData){
        this.formName=formName;
        this.hasData=hasData;
    }

    public DynForm(JSONObject jsonObject,HashMap<String, String> currentValues){
        this.currentValues=currentValues;
        this.copyCurrentValues=copyCurrentValues(currentValues);
        parseJsonObject(jsonObject);
    }
    public DynForm(JSONObject jsonObject){
        parseJsonObject(jsonObject);
    }
    public DynForm(JSONObject jsonObject,JSONObject jsonFormSettings){
        parseJsonObject(jsonObject);
        loadFormSettings(jsonFormSettings);
    }

    public DynForm(JSONArray ja){
        JSONObject jsonObject=new JSONObject();
        try {
            jsonObject.put("form",ja);
            parseJsonObject(jsonObject);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
    private void loadControlValues(HashMap<String, String> values){
        if(formControlList!=null){
            for(DynFormControl control:formControlList){
                String id=control.getId();
                String value=control.getDefaultValue();
                if(values !=null){
                    value=values.get(id);
                    if(value==null){
                        value=values.get(id);
                    }
                }
                control.setCurrentValue(value);
            }
        }
    }
    public void updateForm(){
        if(this.layoutListItem !=null){
            TextView tvTitle=this.layoutListItem.findViewById(R.id.tvTitle_ior);
            String strCaption="";
            String strLayoutValue="";
            if(formControlList !=null && formControlList.size()>0){
                strCaption=formControlList.get(0).getCurrentValue();
            }
            strLayoutValue=tvTitle.getText().toString();
            if(!strLayoutValue.equals(strCaption)){
                tvTitle.setText(strCaption);
            }
        }
        this.copyCurrentValues=copyCurrentValues(this.currentValues);
        setDefaultValuesExists(false);
        setDirty(false);
    }
    public void resetForm(){
        this.currentValues=copyCurrentValues(this.copyCurrentValues);
        for(DynFormControl control:this.formControlList){
            //String value=control.getDefaultValue();
            DynControlType fieldType=control.getFieldType();
            String defaultValue=translateDefaultValue(fieldType,control.getDefaultValue());
            String value = defaultValue;
            if(currentValues!=null){
                value=currentValues.get(control.getId());
                if(value==null){
                    value=defaultValue;
                }
            }
            control.setCurrentValue(value);
        }
        if(this.layout !=null){
            refresh();
        }
        setDirty(false);
    }
    public void resetFormToNull(){
        HashMap<String, String>_currentValues=copyCurrentValues(this.copyCurrentValues);

        for(DynFormControl control:this.formControlList){
            control.setActive(false);
            control.setCurrentValue(null);
        }
        //refresh();
        if(isDefaultValuesExists()){
            this.copyCurrentValues=null;
            this.currentValues=null;
            setDefaultValuesExists(false);
            _currentValues=null;//copyCurrentValues(this.copyCurrentValues);
        }
        if(isValueChanged(this.currentValues,_currentValues)){
            this.currentValues=_currentValues;
        }

        //this.currentValues=copyCurrentValues(this.copyCurrentValues);
        setDirty(false);
    }
    private boolean isValueChanged(HashMap<String, String> values1, HashMap<String, String> values2){
        //cannot compare if one of object or both null
        if(values1==null && values2==null){
            return false;
        }
        if(values1 ==null || values2==null){
            return true;
        }
        if(values1.size() !=values2.size()){
            return true;
        }
        for (String key : values1.keySet()) {
            if(values2.containsKey(key)) {
                if (!values2.get(key).equals( values1.get(key))) {
                    return true;
                }
            }else{
                return true;
            }

        }
        return false;
    }
    private HashMap<String, String> copyCurrentValues(HashMap<String, String > sourceValues){
        HashMap<String, String> values=new HashMap<>();
        if(sourceValues!=null) {
            for (String key : sourceValues.keySet()) {
                values.put(key, sourceValues.get(key));
            }
        }else{
            return null;
        }
        return values;
    }
    private String getCurrentValue(String id){
        if(currentValues !=null){
            return  currentValues.get(id);
        }
        return "";
    }
    private void valueChanged(String id, String value){
        if(currentValues ==null){
            currentValues=new HashMap<>();
        }
        //currentValues.put(id, value);
        DynFormControl control=formControlListMap.get(id);
        if(control !=null && control.getCurrentValue()!=null){
            if(control.getCurrentValue().equals(value)){
                return;
            }
        }
        if(control.getCurrentValue()==null && (value==null || value.equals(""))){
            return;
        }
        currentValues.put(id, value);
        control.setCurrentValue(value);
        if(!isLoading()) {
            setDirty(true);
            if (this.changeEventListener != null) {
                this.changeEventListener.onValueChange(id, value);
            }
        }
    }
    public void refresh(){
        for(DynFormControl control:this.formControlList) {
            if (control.isDataField()) {
                control.setActive(true);
                String id = control.getId();
                String value = control.getCurrentValue();
                String defaultValue = control.getDefaultValue();
                if (value == null || value.equals("")) {
                    value = defaultValue;
                }
                View view = this.layout.findViewWithTag(id);
                DynControlType type = control.getFieldType();
                if (type.equals(DynControlType.Text)) {
                    ((EditText) view).setText(control.getCurrentValue());
                } else if (type.equals(DynControlType.Checkbox)) {
                    if (value.equals("true")) {
                        ((CheckBox) view).setChecked(true);
                    } else if (value.equals("false")) {
                        ((CheckBox) view).setChecked(false);
                    }
                } else if (type.equals(DynControlType.List)) {
                    Spinner spinner = ((Spinner) view);
                    if (control.getCurrentValue() != null) {
                        for (int i = 0; i < spinner.getCount(); i++) {
                            if (spinner.getAdapter().getItem(i).equals(control.getCurrentValue())) {
                                spinner.setSelection(i, false);
                                break;
                            }
                        }
                    } else {
                        spinner.setSelection(0, false);
                    }
                } else if (type.equals(DynControlType.RadioList)) {
                    RadioGroup rg = (RadioGroup) view;
                    if(!value.equals("")) {
                        for (int i = 0; i < rg.getChildCount(); i++) {
                            RadioButton radioButton = (RadioButton) rg.getChildAt(i);
                            if (radioButton.getText().toString().equals(value)) {
                                radioButton.setChecked(true);
                            } else {
                                radioButton.setChecked(false);
                            }
                        }
                    }
                }
            }
        }
    }
    public boolean generateLayout(Context context){
        LinearLayout layout=null;
        if(context !=null){
            this.context=context;
        }

        if(this.context == null){
            return false;
        }

        if(this.formControlList.size()>0){
            layout=new LinearLayout(this.context);
            layout.setOrientation(LinearLayout.VERTICAL);
            layout.setVisibility(View.VISIBLE);
            layout.setLayoutParams(new ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT));
            setMargins(layout,30,10,10,10);

        }
        for(int i=0;i<this.formControlList.size();i++){
            try {
                DynFormControl control=this.formControlList.get(i);
                DynControlType fieldType=control.getFieldType();
                String fieldName=control.getFieldName();
                final  String fieldId=control.getId();
                String defaultValue=translateDefaultValue(fieldType,control.getDefaultValue());
                JSONArray jaOptions=control.getOptions();
                boolean required=control.isRequired();
                boolean fieldEnabled=control.isFieldEnabled();
                String currentValue="";
                String fontSize =control.getFontSize();
                if(this.currentValues !=null){
                    currentValue=this.currentValues.get(fieldId);
                    if(currentValue==null){
                        currentValue=defaultValue;
                    }
                }else{
                    currentValue=defaultValue;
                }
                if(fieldType!=DynControlType.Checkbox && fieldType != DynControlType.Table) {
                    TextView tvName = new TextView(this.context);
                    tvName.setText(fieldName + (required ? "*" : ""));
                    tvName.setLayoutParams(new ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.WRAP_CONTENT));
                    setPadding(tvName, 10, 10, 0, 0);
                    if(fieldType == DynControlType.Label){
                        if(!fontSize.equals("")){
                            try {
                                tvName.setTextSize(TypedValue.COMPLEX_UNIT_SP, DimensionConverter.stringToDimension(fontSize,context.getResources().getDisplayMetrics()));
                            }catch (Exception e){
                                e.printStackTrace();
                            }
                        } else {
                            // Setting default font size for label
                            String _fontSize = "8dp";
                            tvName.setTextSize(TypedValue.COMPLEX_UNIT_SP, DimensionConverter.stringToDimension(_fontSize,context.getResources().getDisplayMetrics()));
                        }

                    }
                    tvName.setVisibility(View.VISIBLE);
                    layout.addView(tvName);
                }
                if(fieldType==DynControlType.Text
                        || fieldType==DynControlType.Date
                        || fieldType==DynControlType.Number) {
                    final EditText editText = new EditText(this.context);
                    final boolean isDateField=fieldType.equals(DynControlType.Date);
                    final  boolean isNumberField=fieldType.equals(DynControlType.Number);
                    final  boolean isDecimalField=control.isNumberDecimal();
                    final  boolean isSignedField=control.isNumberSigned();
                    editText.setTag(fieldId);
                    editText.setLayoutParams(new ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.WRAP_CONTENT));
                    setPadding(editText, 10, 10, 10, 10);
                    if(isNumberField){
                        int type=InputType.TYPE_CLASS_NUMBER | (isDecimalField?InputType.TYPE_NUMBER_FLAG_DECIMAL:0) |(isSignedField?InputType.TYPE_NUMBER_FLAG_SIGNED:0);
                        editText.setInputType(type);
                        //editText.setInputType(InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_FLAG_DECIMAL | InputType.TYPE_NUMBER_FLAG_SIGNED);
                        //editText.setInputType(InputType.TYPE_CLASS_NUMBER | (isDecimalField?InputType.TYPE_NUMBER_FLAG_DECIMAL:0));

                    }
                    editText.setVisibility(View.VISIBLE);
                    if(isDateField){
                        editText.setFocusable(false);
                        editText.setClickable(true);
                        new DynEditTextDatePicker(getContext(),editText);
                    }
                    editText.addTextChangedListener(new TextWatcher() {
                        @Override
                        public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

                        }

                        @Override
                        public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                            String value=editText.getText().toString();
                            valueChanged(fieldId, value);
                        }

                        @Override
                        public void afterTextChanged(Editable editable) {


                        }
                    });
                    if(!currentValue.equals("")){
                        editText.setText(currentValue);
                    }
                    editText.setEnabled(fieldEnabled);
                    layout.addView(editText);
                }else if(fieldType==DynControlType.List){
                    final Spinner spinner=new Spinner(this.context);
                    spinner.setTag(fieldId);
                    spinner.setLayoutParams(new ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.WRAP_CONTENT));
                    setPadding(spinner, 10, 10, 10, 10);
                    spinner.setVisibility(View.VISIBLE);
                    ArrayAdapter<String> spinerAdapter=new ArrayAdapter<String>(this.context,android.R.layout.simple_spinner_item);
                    spinerAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);

                    if(jaOptions !=null){
                        int selectedOption=0;
                        for(int i1=0;i1<jaOptions.length();i1++){
                            spinerAdapter.add(jaOptions.getString(i1));
                            if(jaOptions.getString(i1).equals(currentValue)){
                                selectedOption=i1;
                            }
                        }
                        spinner.setAdapter(spinerAdapter);
                        spinner.setSelection(0, false);
                        if(!currentValue.equals("")){
                            spinner.setSelection(selectedOption);
                        }
                        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                            @Override
                            public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                                //String value=spinner.getSelectedItem().toString();
                                String value=adapterView.getSelectedItem().toString();
                                valueChanged(fieldId, value);
                            }

                            @Override
                            public void onNothingSelected(AdapterView<?> adapterView) {

                            }
                        });
                    }
                    layout.addView(spinner);
                }else if(fieldType==DynControlType.RadioList){
                    RadioGroup rg=new RadioGroup(this.context);
                    rg.setTag(fieldId);
                    int selectedOption=0;
                    for(int i1=0;i1<jaOptions.length();i1++){
                        RadioButton rb =new RadioButton(this.context);
                        rg.addView(rb,i1);
                        setPadding(rb, 10,0, 5, 5);
                        rb.setText(jaOptions.getString(i1));

                        if(jaOptions.getString(i1).equals(currentValue)){
                            selectedOption=i1;
                            rb.setChecked(true);
                        }
                    }
                    setPadding(rg, 10, 10, 10, 10);
                    rg.setVisibility(View.VISIBLE);
                    rg.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
                        @Override
                        public void onCheckedChanged(RadioGroup radioGroup, int i) {
                            try {
                                RadioButton radioButton=radioGroup.findViewById(i);
                                if(radioButton !=null) {
                                    String value = radioButton.getText().toString();
                                    valueChanged(fieldId, value);
                                }
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        }
                    });
                    layout.addView(rg);

                }else if(fieldType==DynControlType.Checkbox){
                    CheckBox checkBox =new CheckBox(this.context);
                    checkBox.setText(fieldName);
                    checkBox.setTag(fieldId);
                    setPadding(checkBox, 10, 10, 10, 10);
                    checkBox.setVisibility(View.VISIBLE);
                    if(currentValue.equals("true")){
                        checkBox.setChecked(true);
                    }
                    checkBox.setVisibility(View.VISIBLE);
                    checkBox.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
                        @Override
                        public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                            valueChanged(fieldId, String.valueOf(b));
                        }
                    });
                    layout.addView(checkBox);
                } else if(fieldType == DynControlType.Label){

                } else if(fieldType==DynControlType.Divider){
                    ImageView divider = new ImageView(context);
                    LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, 3);
                    lp.setMargins(10, 10, 10, 10);
                    divider.setLayoutParams(lp);
                    divider.setBackground(createDashedLined());
                    //divider.setBackgroundColor(Color.parseColor("#2E3342"));
                    layout.addView(divider);
                } else if (fieldType == DynControlType.Table){
                    DynFormTable table = control.getFormTable();
                    if(table!=null){
                        if(table.generateListLayout(context,this.changeEventListener)){

                            layout.addView(table.getLayoutTable());
                        }
                    }

                }
            }catch (Exception e){
                Log.e("generateLayout",e.toString());
                return false;
            }
        }
        this.layout=layout;
        return  true;
    }

    private String translateDefaultValue(DynControlType fieldType, String defaultValue) {
        String _defaultValue=defaultValue;
        if(defaultValue.startsWith("#VAR_")){
            //It contains variables
            if (true == defaultValue.equals("#VAR_TODAY#")) {
                String myFormat = "MMM, dd, yyyy"; //In which you need put here
                SimpleDateFormat sdf = new SimpleDateFormat(myFormat, Locale.US);
                _defaultValue = sdf.format(Calendar.getInstance().getTime());
                Date date= null;
                try {
                    date = sdf.parse(sdf.format(new Date()));
                    _defaultValue=date.toString();
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }else if (true == defaultValue.equals("#VAR_NOW#")) {
                Date date=new Date();
                _defaultValue=date.toString();
            }else if (true == defaultValue.equals("#VAR_UNAME#")) {
                String userName=Globals.selectedJPlan!=null?Globals.selectedJPlan.getUser().getName():"";
                _defaultValue= userName;
            }
        }
        return _defaultValue;
    }

    public boolean generateListItemLayout(Context context){
        LinearLayout layout=null;
        if(context !=null){
            this.context=context;
        }

        if(this.context == null){
            return false;
        }

        if(this.formControlList.size()>0){
            String itemName=this.formControlList.get(0).getCurrentValue();
            LayoutInflater inflater = LayoutInflater.from(context);
            layout =  (LinearLayout) inflater.inflate(R.layout.item_object_row, null, false);

            TextView tvCaption=(TextView) layout.findViewById(R.id.tvTitle_ior);
            tvCaption.setText(itemName);

            TextView tvDetail=(TextView) layout.findViewById(R.id.tvDetails_ior);
            tvDetail.setText(getFormName());
            ImageButton removeButton=layout.findViewById(R.id.btnRemove_ior);
            removeButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    if(changeEventListener!=null){
                        changeEventListener.onObjectRemoveClick(parentControl, DynForm.this);
                    }

                }
            });
            layout.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    if(changeEventListener!=null){
                        changeEventListener.onObjectItemClick(parentControl, DynForm.this);
                    }
                }
            });

            layoutListItem=layout;
            return true;
        }
        return false;
    }
    private void setPadding (View view, int left, int top, int right, int bottom) {
        final float scale =((Activity) this.context).getBaseContext().getResources().getDisplayMetrics().density;
        // convert the DP into pixel
        int l = (int) (left * scale + 0.5f);
        int r = (int) (right * scale + 0.5f);
        int t = (int) (top * scale + 0.5f);
        int b = (int) (bottom * scale + 0.5f);
        view.setPadding(l,t,r,b);
    }
    private void setMargins (View view, int left, int top, int right, int bottom) {
        final float scale = ((Activity) this.context).getBaseContext().getResources().getDisplayMetrics().density;
        // convert the DP into pixel
        int l =  (int)(left * scale + 0.5f);
        int r =  (int)(right * scale + 0.5f);
        int t =  (int)(top * scale + 0.5f);
        int b =  (int)(bottom * scale + 0.5f);

        view.setLeft(l);
        view.setTop(t);
        view.setRight(r);
        view.setBottom(b);
    }

    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
       // hmBackupValues= Utilities.getHashMapJSONObject(jsonObject);
        ArrayList<DynFormControl> _formControlList=new ArrayList<>();
        HashMap<String , DynFormControl> _formControlListMap=new HashMap<>();
        try{
            JSONArray ja=jsonObject.getJSONArray("form");
            for(int i=0;i<ja.length();i++){
                DynFormControl control=new DynFormControl(ja.getJSONObject(i));
                control.setCurrentValue(getCurrentValue(control.getId()));
                control.setListener(changeEventListener);
                control.setParentControl(this);
                _formControlList.add(control);
                _formControlListMap.put(control.getId(), control);
                if(control.getTag()!=null && control.getTag().equals("completionCheck")){
                    setFormCompleteId(control.getId());
                }
            }
            this.formControlList=_formControlList;
            this.formControlListMap=_formControlListMap;
        }catch (Exception e){
            Log.e("DynForm parseJsonObject",e.toString());
            return  false;
        }
        return true;
    }

    @Override
    public JSONObject getJsonObject() {
        if(changeOnly){
            return getJsonObjectChanged();
        }
        JSONObject jsonObject=null;
        JSONArray jsonArray=new JSONArray();
        try {
            boolean dataChanged=false;
            for (DynFormControl control : this.formControlList) {
                if(control.isDataField()) {
                    JSONObject jsonObject1 = control.getJsonObject();
                    if (jsonObject1 != null) {
                        jsonArray.put(jsonObject1);
                        dataChanged = true;
                    } else {
                        jsonArray.put(new JSONObject());
                    }
                }
            }
            if(dataChanged ) {
                jsonObject=new JSONObject();
                jsonObject.put("id", this.formId);
                jsonObject.put("name", this.formName);
                if(getParentControl() ==null){
                    //jsonObject.put("__replace", true);
                }
                jsonObject.put("form", jsonArray);
            }
        }catch (Exception e){
            Log.e("DynForm",e.toString());
            return null;
        }
        return jsonObject;
    }
    public JSONObject getJsonObjectChanged() {
        JSONObject jsonObject=null;
        JSONArray jsonArray=new JSONArray();
        try {
            boolean dataChanged=false;
            for (DynFormControl control : this.formControlList) {
                if(control.isDataField()) {
                    JSONObject jsonObject1 = control.getJsonObject();
                    if (jsonObject1 != null) {
                        jsonArray.put(jsonObject1);
                        dataChanged = true;
                    } else {
                        jsonArray.put(new JSONObject());
                    }
                }
            };
            if( dataChanged) {
                jsonObject=new JSONObject();
                jsonObject.put("id", this.formId);
                jsonObject.put("name", this.formName);
                if(getParentControl() ==null){
                    //jsonObject.put("__replace", true);
                }
                jsonObject.put("form", jsonArray);
            }
        }catch (Exception e){
            Log.e("DynForm",e.toString());
            return null;
        }
        return jsonObject;
    }

    public void cloneFieldList(ArrayList<DynFormControl> formControlList) {
        ArrayList<DynFormControl> _controlList=new ArrayList<>();
        HashMap<String , DynFormControl> _formControlListMap=new HashMap<>();
        for(DynFormControl control:formControlList){
            try {
                DynFormControl newControl=(DynFormControl) control.clone();
                newControl.setListener(this.changeEventListener);
                newControl.setParentControl(this);
                _controlList.add(newControl);
                _formControlListMap.put(newControl.getId(),newControl);

            } catch (CloneNotSupportedException e) {
                e.printStackTrace();
            }
        }
        this.formControlList=_controlList;
        this.formControlListMap=_formControlListMap;
    }

    @Override
    public void viewChanged(Context context) {
        if(this.context !=null) {
            if (!this.context.equals(context)) {
                this.context = context;
                if (formControlList != null) {
                    for (DynFormControl control : formControlList) {
                        control.viewChanged(context);

                    }
                }
                this.layoutListItem = null;
                this.layout = null;
            }
        }
    }

    @Override
    public void viewClosed() {
        this.context=null;
        this.changeEventListener=null;
        if (formControlList != null) {
            for (DynFormControl control : formControlList) {
                control.viewClosed();
            }
        }
    }

    @Override
    public void viewListenerChanged(OnValueChangeEventListener listener) {
        this.changeEventListener=listener;
        if(formControlList !=null){
            for(DynFormControl control:formControlList){
                control.viewListenerChanged(listener);
            }
        }

    }
}
