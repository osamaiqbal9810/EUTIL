package com.app.ps19.tipsapp.classes.dynforms;

import com.app.ps19.tipsapp.Shared.IConvertHelper;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;

public class MappingOptions implements IConvertHelper,Cloneable {
    private ArrayList<String> options = new ArrayList<String>();
    private String mapTo="";
    private String targetGroup="";

    public void setTargetGroup(String targetGroup) {
        this.targetGroup = targetGroup;
    }

    public String getTargetGroup() {
        return targetGroup;
    }

    public void setOptions(ArrayList<String> options) {
        this.options = options;
    }

    public ArrayList<String> getOptions() {
        return options;
    }

    public void setMapTo(String mapTo) {
        this.mapTo = mapTo;
    }

    public String getMapTo() {
        return mapTo;
    }

    public MappingOptions(JSONObject jsonObject) {
        parseJsonObject(jsonObject);
    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {

        JSONArray jaOptions = jsonObject.optJSONArray("options");
        if(jaOptions!=null) {
            ArrayList<String> _options = new ArrayList<String>();
            for (int i = 0; i < jaOptions.length(); i++) {
                _options.add(jaOptions.optString(i));
            }
            this.options = _options;
        }
        setMapTo(jsonObject.optString("mapTo",""));
        setTargetGroup(jsonObject.optString("targetGroup",""));

        return false;
    }

    @Override
    public JSONObject getJsonObject() {
        return null;
    }
}
