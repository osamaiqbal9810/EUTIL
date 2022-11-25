package com.app.ps19.scimapp.classes.ativ;

import com.app.ps19.scimapp.Shared.IConvertHelper;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class ATIVData implements IConvertHelper {
    public ArrayList<ATIVDefect> getDefects() {
        return defects;
    }

    public void setDefects(ArrayList<ATIVDefect> defects) {
        this.defects = defects;
    }

    ArrayList<ATIVDefect> defects;

    public ATIVData(JSONObject jsonObject){
        parseJsonObject(jsonObject);
    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        JSONArray ja = jsonObject.optJSONArray("ativ_defects");
        ArrayList<ATIVDefect> _defects = new ArrayList<>();
        if(ja!=null){
            for(int i=0;i<ja.length(); i++){
                try {
                    _defects.add(new ATIVDefect(ja.getJSONObject(i)));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
            setDefects(_defects);
        }
        return false;
    }

    @Override
    public JSONObject getJsonObject() {
        return null;
    }
}
