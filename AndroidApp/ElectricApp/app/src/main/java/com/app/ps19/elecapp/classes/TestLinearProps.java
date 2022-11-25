package com.app.ps19.elecapp.classes;

import com.app.ps19.elecapp.Shared.IConvertHelper;

import org.json.JSONException;
import org.json.JSONObject;

public class TestLinearProps implements IConvertHelper {
    String inspectionType="";

    public void setInspectionType(String inspectionType) {
        this.inspectionType = inspectionType;
    }

    public String getInspectionType() {
        return inspectionType;
    }

    public TestLinearProps(JSONObject jo){
        parseJsonObject(jo);
    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        if(jsonObject!=null){
            setInspectionType(jsonObject.optString("inspectionType"));
        }
        return false;
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jsonObject=new JSONObject();
        try {
            jsonObject.put("inspectionType",getInspectionType());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jsonObject;
    }
}
