package com.app.ps19.tipsapp.classes;

import com.app.ps19.tipsapp.Shared.DBHandler;
import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.Shared.IConvertHelper;
import com.app.ps19.tipsapp.Shared.StaticListItem;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class RunRanges implements IConvertHelper {
    private String runId ="";
    private String runDescription="";
    private String mpStart="";
    private String mpEnd;
    private String lineId;
    private String lineName;

    public String getRunId() {
        return runId;
    }

    public void setRunId(String runId) {
        this.runId = runId;
    }

    public String getRunDescription() {
        return runDescription;
    }

    public void setRunDescription(String runDescription) {
        this.runDescription = runDescription;
    }

    public String getMpStart() {
        return mpStart;
    }

    public void setMpStart(String mpStart) {
        this.mpStart = mpStart;
    }

    public String getMpEnd() {
        return mpEnd;
    }

    public void setMpEnd(String mpEnd) {
        this.mpEnd = mpEnd;
    }

    public String getLineId() {
        return lineId;
    }

    public void setLineId(String lineId) {
        this.lineId = lineId;
    }

    public String getLineName() {
        return lineName;
    }

    public void setLineName(String lineName) {
        this.lineName = lineName;
    }


    public RunRanges(JSONObject jsonObject){
        parseJsonObject(jsonObject);
    }
    public RunRanges(String runId, String rangeId){
        loadRangeFromDB(runId, rangeId);
    }


    private void loadRangeFromDB(String runId, String rangeId) {
        DBHandler db = Globals.db;//new DBHandler(Globals.getDBContext());
        List<StaticListItem> items= db.getListItems(Globals.RUN_LIST_NAME,Globals.orgCode, runId);
        if(items.size()>=1){
            StaticListItem item=items.get(0);
            try {
                JSONObject joRun=new JSONObject(item.getOptParam1());
                JSONArray jaRanges=joRun.getJSONArray("runRange");
                for(int i=0;i<jaRanges.length();i++){
                    JSONObject joRange=jaRanges.getJSONObject(i);

                }

            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        try {

            setRunId(jsonObject.optString("runId"));
            setRunDescription(jsonObject.optString("runDescription",""));
            setMpStart(jsonObject.optString("mpStart",""));
            setMpEnd(jsonObject.optString("mpEnd", ""));
            setLineId(jsonObject.optString("lineId",""));
            setLineName(jsonObject.optString("lineName", ""));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return true;
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jo =new JSONObject();
        JSONArray jaTasks=new JSONArray();
        try {
            jo.put("runId",getRunId());
            jo.put("runDescription",getRunDescription());
            jo.put("mpStart",getMpStart());
            jo.put("mpEnd", getMpEnd());
            jo.put("lineId", getLineId());
            jo.put("lineName", getLineName());
        }catch (Exception e){
            e.printStackTrace();
        }
        return jo;
    }

}
