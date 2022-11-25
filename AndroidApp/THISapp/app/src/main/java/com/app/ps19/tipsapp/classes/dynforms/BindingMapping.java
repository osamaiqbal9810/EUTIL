package com.app.ps19.tipsapp.classes.dynforms;

import com.app.ps19.tipsapp.Shared.IConvertHelper;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class BindingMapping implements IConvertHelper,Cloneable {
    private ArrayList<MappingOptions> options;

    public void setOptions(ArrayList<MappingOptions> options) {
        this.options = options;
    }

    public ArrayList<MappingOptions> getOptions() {
        return options;
    }

    public BindingMapping(JSONObject jsonObject) {
        parseJsonObject(jsonObject);
    }
    public String getMappingValue(String key) {
        for (MappingOptions option : options) {
            ArrayList<String> options = option.getOptions();
            if(options.contains(key)){
                return option.getMapTo();
            }
        }
        return null;
    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        JSONArray jsonArray=jsonObject.optJSONArray("mapping");
        ArrayList<MappingOptions> _options=new ArrayList<MappingOptions>();
        if (jsonArray != null) {
            for (int i=0; i<jsonArray.length(); i++){
                JSONObject option=jsonArray.optJSONObject(i);
                if (option != null) {
                    _options.add(new MappingOptions(option));
                }
            }
        }
        setOptions(_options);
        return false;
    }

    @Override
    public JSONObject getJsonObject() {
        return null;
    }
}
