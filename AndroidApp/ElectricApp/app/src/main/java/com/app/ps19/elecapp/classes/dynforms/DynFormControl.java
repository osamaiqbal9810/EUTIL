package com.app.ps19.elecapp.classes.dynforms;

import android.content.Context;
import android.util.Log;

import com.app.ps19.elecapp.Shared.IConvertHelper;
import com.app.ps19.elecapp.Shared.Utilities;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;

enum DynControlType{
    Text,
    Checkbox,
    List,
    RadioList,
    Table,
    Label,
    Divider,
    Date,
    Number

}

public class DynFormControl implements IConvertHelper,Cloneable,IViewController {
    private String fieldName;
    private DynControlType fieldType;
    private String fieldTypeText;
    private String defaultValue;
    private String id;
    private boolean required;
    private JSONArray options;
    private String currentValue;
    private ArrayList<DynFormControl> cols;
    private String fontSize;
    private String originalValue;
    private boolean numberDecimal=false;
    private boolean numberSigned=false;
    private boolean fieldEnabled=true;
    private boolean changeOnly=false;
    private String tag;
    private boolean active=false;

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public String getTag() {
        return tag;
    }

    public boolean isChangeOnly() {
        return changeOnly;
    }
    public void setChangeOnly(boolean changeOnly) {
        this.changeOnly = changeOnly;
    }
    public boolean isFieldEnabled(){return fieldEnabled;}
    public boolean isNumberDecimal(){return numberDecimal;}
    public boolean isNumberSigned(){return numberSigned;}
    public DynForm getParentControl() {
        return parentControl;
    }

    public void setParentControl(DynForm parentControl) {
        this.parentControl = parentControl;
    }

    private DynForm parentControl;

    public OnValueChangeEventListener getListener() {
        return listener;
    }

    public void setListener(OnValueChangeEventListener listener) {
        this.listener = listener;
    }

    private OnValueChangeEventListener listener;


    public DynFormTable getFormTable() {
        return formTable;
    }

    public void setFormTable(DynFormTable formTable) {
        this.formTable = formTable;
    }

    private DynFormTable formTable;

    public String getFontSize() {
        return fontSize;
    }

    public void setFontSize(String fontSize) {
        this.fontSize = fontSize;
    }

    public ArrayList<DynFormControl> getCols() {
        return cols;
    }

    public void setCols(ArrayList<DynFormControl> cols) {
        this.cols = cols;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public DynControlType getFieldType() {
        return fieldType;
    }

    public void setFieldType(DynControlType fieldType) {
        this.fieldType = fieldType;
    }

    public String getDefaultValue() {
        return defaultValue;
    }

    public void setDefaultValue(String defaultValue) {
        this.defaultValue = defaultValue;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }

    public JSONArray getOptions() {
        return options;
    }

    public void setOptions(JSONArray options) {
        this.options = options;
    }

    public String getCurrentValue() {
        return currentValue;
    }
    public void setCurrentValue(String currentValue) {
        this.currentValue = currentValue;
        if(this.fieldType==DynControlType.Table){
            //Table Data in string format
            try{
                if(currentValue!=null && !currentValue.equals("")){
                    JSONArray ja=new JSONArray(currentValue);

                    this.formTable.setFormData(new ArrayList<DynForm>());
                    for(int i=0;i< ja.length();i++){
                        //JSONArray jaRec=ja.getJSONArray(i);
                        //JSONObject joRec=jaRec.getJSONObject(0);
                        JSONObject joRec=ja.getJSONObject(i);
                        DynForm form=(DynForm) this.formTable.getForm().clone();
                        form.cloneFieldList(this.formTable.getForm().getFormControlList());
                        JSONArray jaRecForm=joRec.optJSONArray("form");
                        if(jaRecForm !=null) {
                            form.setCurrentValues(Utilities.convertJsonArrayToHashMap(jaRecForm));
                        }
                        form.setFormName(this.getFieldName());
                        form.setChangeEventListener(listener);
                        form.setParentControl(this);
                        this.formTable.getFormData().add(form);

                    }
                }
            }catch (Exception e){
                e.printStackTrace();
            }

        }
    }
    public DynFormControl(JSONObject jsonObject){
        parseJsonObject(jsonObject);
    }
    //Only data fields types are allowed to send data back to server
    public boolean isDataField(){
        if( fieldType==DynControlType.Checkbox||fieldType==DynControlType.List
                ||fieldType==DynControlType.Text||fieldType==DynControlType.RadioList
                ||fieldType==DynControlType.Table||fieldType==DynControlType.Date
                ||fieldType==DynControlType.Number){
            return true;
        }
        return false;
    }
    private DynControlType getFieldType(String type){
        switch ( type){
            case "checkbox":
                return DynControlType.Checkbox;
            case "list":
                return DynControlType.List;
            case "radioList":
                return DynControlType.RadioList;
            case "label":
                return  DynControlType.Label;
            case "table":
                return  DynControlType.Table;
            case "divider":
                return DynControlType.Divider;
            case "date":
                return DynControlType.Date;
            case "number":
                return DynControlType.Number;
            default:
                return DynControlType.Text;
        }
    }
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        try{
            String fieldType=jsonObject.optString("fieldType","text");
            String fieldName=jsonObject.optString("fieldName","undefined");
            String fieldId=jsonObject.optString("id","undefined");
            String defaultValue=jsonObject.optString("default","");
            String fontSize=jsonObject.optString("fontSize","");
            String value = jsonObject.optString("value",null);
            String tag= jsonObject.optString("tag","");
            boolean _numberDecimal=jsonObject.optBoolean("numberDecimal",false);
            boolean _numberSigned=jsonObject.optBoolean("numberSigned",false);
            boolean _fieldEnabled=jsonObject.optBoolean("enabled",true);
            if(this.fieldType==DynControlType.Table){
                value=jsonObject.optJSONArray("value").toString();
            }

            JSONArray jaOptions=jsonObject.optJSONArray("options");
            boolean required=jsonObject.optBoolean("required",false);
            this.fieldName=fieldName;
            this.fieldTypeText=fieldType;
            this.fieldType=getFieldType(fieldType);
            this.id=fieldId;
            this.defaultValue=defaultValue;
            this.options=jaOptions;
            this.required=required;
            this.fontSize=fontSize;
            this.currentValue=value;
            this.numberDecimal=_numberDecimal;
            this.numberSigned=_numberSigned;
            this.fieldEnabled=_fieldEnabled;
            this.tag=tag;

            if(this.fieldType==DynControlType.Table){
                this.formTable=new DynFormTable(this,jaOptions);
                this.formTable.setTableName(this.fieldName);
            }
            JSONArray jaCols=jsonObject.optJSONArray("cols");
            if(jaCols !=null){
                ArrayList<DynFormControl> _cols=new ArrayList<>();
                for(int i=0;i<jaCols.length();i++) {
                    DynFormControl _control = new DynFormControl(jaCols.getJSONObject(i));
                    _cols.add(_control);
                }
                this.cols=_cols;
            }

        }catch (Exception e){
            Log.e("DynFormControl",e.toString());
            return  false;
        }
        return true;
    }

    @Override
    public JSONObject getJsonObject() {
        if(fieldType!=DynControlType.Table){
            if(currentValue==null || currentValue.equals("") ){
                return  null;
            }
        }
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("id", this.id);
            jsonObject.put("name", this.fieldName);
            if(!getTag().equals("")){
                jsonObject.put("tag",getTag());
            }
            if(fieldType==DynControlType.Table){
                JSONObject jsonObject1=formTable.getJsonObject();
                if(jsonObject1 !=null){
                    jsonObject.put("value",jsonObject1.getJSONArray("value"));
                }else{
                    //jsonObject.put("value",new JSONArray());
                    return null;
                }
            }else{
                jsonObject.put("value",currentValue);
            }
            jsonObject.put("type",this.fieldTypeText);
        }catch (Exception e){
            Log.e("DynFormControl",e.toString());
            return  null;
        }
        return jsonObject;
    }

    @Override
    public void viewChanged(Context context) {
        if(fieldType==DynControlType.Table){
            this.getFormTable().viewChanged(context);
        }
    }

    @Override
    public void viewListenerChanged(OnValueChangeEventListener listener) {
        this.listener=listener;
        if(fieldType==DynControlType.Table){
            this.getFormTable().viewListenerChanged(listener);
        }
    }

    @Override
    public void viewClosed() {
        this.listener=null;
        if(fieldType==DynControlType.Table){
            this.getFormTable().viewClosed();
        }
    }
}
