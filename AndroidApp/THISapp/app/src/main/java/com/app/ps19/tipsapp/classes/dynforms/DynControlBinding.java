package com.app.ps19.tipsapp.classes.dynforms;

import com.app.ps19.tipsapp.Shared.IConvertHelper;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class DynControlBinding implements IConvertHelper,Cloneable {
    private DynFormControl source;
    private DynFormControl target;
    private String property;
    private String targetProperty;
    private String targetControl;
    private String targetGroup;
    private BindingMapping mapping;
    private String logicalFunction;
    private String targetPropertyLookup;

    public String getTargetPropertyLookup() {
        return targetPropertyLookup;
    }

    public void setTargetPropertyLookup(String targetPropertyLookup) {
        this.targetPropertyLookup = targetPropertyLookup;
    }

    public String getLogicalFunction() {
        return logicalFunction;
    }

    public void setLogicalFunction(String logicalFunction) {
        this.logicalFunction = logicalFunction;
    }

    public BindingMapping getMapping() {
        return mapping;
    }

    public void setMapping(BindingMapping mapping) {
        this.mapping = mapping;
    }

    public String getTargetGroup() {
        return targetGroup;
    }

    public void setTargetGroup(String targetGroup) {
        this.targetGroup = targetGroup;
    }

    public DynFormControl getSource() {
        return source;
    }

    public void setSource(DynFormControl source) {
        this.source = source;
    }

    public DynFormControl getTarget() {
        return target;
    }

    public void setTarget(DynFormControl target) {
        this.target = target;
    }

    public String getProperty() {
        return property;
    }

    public void setProperty(String property) {
        this.property = property;
    }

    public String getTargetProperty() {
        return targetProperty;
    }

    public void setTargetProperty(String targetProperty) {
        this.targetProperty = targetProperty;
    }

    public String getTargetControl() {
        return targetControl;
    }

    public void setTargetControl(String targetControl) {
        this.targetControl = targetControl;
    }

    public DynControlBinding(JSONObject jsonObject) {parseJsonObject(jsonObject);}
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        setProperty(jsonObject.optString("property", ""));
        setTargetControl(jsonObject.optString("target", ""));
        setTargetGroup(jsonObject.optString("targetGroup", ""));
        setTargetProperty(jsonObject.optString("targetProperty", ""));
        setLogicalFunction(jsonObject.optString("logicalFunction", ""));
        setTargetPropertyLookup(jsonObject.optString("targetPropertyLookup", ""));
        if(jsonObject.optJSONArray("mapping")!= null){
            JSONArray jaMapping = jsonObject.optJSONArray("mapping");
            JSONObject joMapping=new JSONObject();
            try {
                joMapping.put("mapping", jaMapping);
                this.mapping = new BindingMapping(joMapping);
            }catch (JSONException e){
                e.printStackTrace();
            }
        }
        return false;
    }

    @Override
    public JSONObject getJsonObject() {
        return null;
    }

    public void valueChanged(String currentValue) {
        if(target!=null){
            if(target.getListener()!=null && currentValue!=null){
                //target.getListener().onObjectPropertyChange(this.targetControl,this.targetProperty,currentValue);
                if(!logicalFunction.equals("")){
                    currentValue=String.valueOf(ExpressionEval.applyLogicalFunction(currentValue,logicalFunction));
                }
                if(mapping!=null){
                    String retValue= mapping.getMappingValue(currentValue);
                    if(retValue!=null){
                        target.getListener().onObjectPropertyChange(this,retValue,currentValue);
                        return;
                    }

                }
                target.getListener().onObjectPropertyChange(this,currentValue,currentValue);
            }
        }
    }
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
