package com.app.ps19.elecapp.classes;

import android.util.Log;

import com.app.ps19.elecapp.Shared.IConvertHelper;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import static android.content.ContentValues.TAG;

class WorkPlan implements IConvertHelper {

    private String title;
    private String nextDueDate;
    private String lastInspection;
    private ArrayList<TestForms> tests;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getNextDueDate() {
        return nextDueDate;
    }

    public void setNextDueDate(String nextDueDate) {
        this.nextDueDate = nextDueDate;
    }

    public String getLastInspection() {
        return lastInspection;
    }

    public void setLastInspection(String lastInspection) {
        this.lastInspection = lastInspection;
    }

    public ArrayList<TestForms> getTests() {
        return tests;
    }

    public void setTests(ArrayList<TestForms> tests) {
        this.tests = tests;
    }

    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {

        setTitle(jsonObject.optString("title", ""));
        setNextDueDate(jsonObject.optString("nextDueDate", ""));
        setLastInspection(jsonObject.optString("lastInspection", ""));
        ArrayList<TestForms> _tests = new ArrayList<>();
        JSONArray jaTests = jsonObject.optJSONArray("tests");
        if(jaTests != null){
            try {
                for (int i = 0; i < jaTests.length(); i++) {
                    JSONObject joTest = jaTests.optJSONObject(i);
                    if (joTest != null) {
                        _tests.add(new TestForms(joTest));
                    }

                }
            }catch (Exception ex)
            {
                Log.e(TAG,ex.toString());
            }
        }
        setTests(_tests);

        return true;
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jo = new JSONObject();
        try {
            jo.put("title", getTitle());
            jo.put("nextDueDate", getNextDueDate());
            jo.put("lastInspection", getLastInspection());
            JSONArray jaTests = new JSONArray();
            for (TestForms test : getTests()) {
                jaTests.put(test.getJsonObject());
            }
            jo.put("tests", jaTests);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jo;
    }
}
