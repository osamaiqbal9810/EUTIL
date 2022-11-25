package com.app.ps19.elecapp.classes.version;

import com.app.ps19.elecapp.Shared.IConvertHelper;

import org.json.JSONObject;

import java.util.ArrayList;

public class FeatureSetList implements IConvertHelper {
    private String id;
    private boolean value;
    private ArrayList<String> subset;

    public void setValue(boolean value) {
        this.value = value;
    }

    public boolean isValue() {
        return value;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public FeatureSetList(JSONObject jo)
    {
        parseJsonObject(jo);
    }

    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        setId(jsonObject.optString("id",""));
        setValue(jsonObject.optBoolean("value",false));
        return false;
    }

    @Override
    public JSONObject getJsonObject() {
        return null;
    }
}
