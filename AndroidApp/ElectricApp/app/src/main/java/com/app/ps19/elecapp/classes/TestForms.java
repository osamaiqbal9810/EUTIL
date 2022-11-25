package com.app.ps19.elecapp.classes;

import com.app.ps19.elecapp.Shared.IConvertHelper;

import org.json.JSONException;
import org.json.JSONObject;

class TestForms implements IConvertHelper {
    private String name;
    private String nextDueDate;
    private String nextExpiryDate;
    private String lastInspected;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNextDueDate() {
        return nextDueDate;
    }

    public void setNextDueDate(String nextDueDate) {
        this.nextDueDate = nextDueDate;
    }

    public String getNextExpiryDate() {
        return nextExpiryDate;
    }

    public void setNextExpiryDate(String nextExpiryDate) {
        this.nextExpiryDate = nextExpiryDate;
    }

    public String getLastInspected() {
        return lastInspected;
    }

    public void setLastInspected(String lastInspected) {
        this.lastInspected = lastInspected;
    }

    public TestForms(JSONObject jo){
        parseJsonObject(jo);
    }

    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        setName(jsonObject.optString("name", ""));
        setNextDueDate(jsonObject.optString("nextDueDate", ""));
        setNextExpiryDate(jsonObject.optString("nextExpiryDate", ""));
        setLastInspected(jsonObject.optString("lastInspectedDate", ""));
        return true;
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jo = new JSONObject();
        try {
            jo.put("name", getName());
            jo.put("nextDueDate", getNextDueDate());
            jo.put("nextExpiryDate", getNextExpiryDate());
            jo.put("lastInspectedDate", getLastInspected());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jo;
    }
}
