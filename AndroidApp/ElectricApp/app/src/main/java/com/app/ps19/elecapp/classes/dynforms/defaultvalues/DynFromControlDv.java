package com.app.ps19.elecapp.classes.dynforms.defaultvalues;

import com.app.ps19.elecapp.Shared.IConvertHelper;

import org.json.JSONObject;

public class DynFromControlDv implements IConvertHelper {
    String id;
    String value;

    public void setId(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public DynFromControlDv(){}
    public DynFromControlDv(JSONObject jo){
        parseJsonObject(jo);
    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        setId(jsonObject.optString("id",""));
        setValue(jsonObject.optString("value",""));
        return false;
    }

    @Override
    public JSONObject getJsonObject() {
        return null;
    }
}
