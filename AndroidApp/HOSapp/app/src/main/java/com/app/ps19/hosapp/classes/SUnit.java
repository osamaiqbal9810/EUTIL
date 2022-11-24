package com.app.ps19.hosapp.classes;

import com.app.ps19.hosapp.Shared.IConvertHelper;

import org.json.JSONObject;

public class SUnit implements IConvertHelper {

    private String start;
    private String end;
    private GeoLocation lineCords;
    public String getStart() {
        return start;
    }

    public void setStart(String start) {
        this.start = start;
    }

    public String getEnd() {
        return end;
    }

    public void setEnd(String end) {
        this.end = end;
    }

    public GeoLocation getLineCords() {
        return lineCords;
    }

    public void setLineCords(GeoLocation lineCords) {
        this.lineCords = lineCords;
    }


    public SUnit (JSONObject jo){
        parseJsonObject(jo);
    }

    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        try {
            setStart(jsonObject.optString("start","" ));
            setEnd(jsonObject.optString("end", ""));
            if(jsonObject.opt("lineCords")!= null){
                setLineCords(new GeoLocation(jsonObject.optJSONObject("lineCords")));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jo=new JSONObject();
        try{
            jo.put("start",getStart());
            jo.put("end",getEnd());
            if(getLineCords()!=null){
                jo.put("lineCords",getLineCords().getJsonObject());
            } else {
                jo.put("lineCords", new JSONObject());
            }
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
        return jo;
    }
}
