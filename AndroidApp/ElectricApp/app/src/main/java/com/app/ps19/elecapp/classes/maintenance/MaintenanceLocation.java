package com.app.ps19.elecapp.classes.maintenance;

import com.app.ps19.elecapp.Shared.IConvertHelper;
import com.app.ps19.elecapp.classes.LatLong;

import org.json.JSONObject;

public class MaintenanceLocation implements IConvertHelper {
    String id;
    String type;
    LatLong start;
    LatLong end;
    String startMp;
    String endMp;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public LatLong getStart() {
        return start;
    }

    public void setStart(LatLong start) {
        this.start = start;
    }

    public LatLong getEnd() {
        return end;
    }

    public void setEnd(LatLong end) {
        this.end = end;
    }

    public String getStartMp() {
        return startMp;
    }

    public void setStartMp(String startMp) {
        this.startMp = startMp;
    }

    public String getEndMp() {
        return endMp;
    }

    public void setEndMp(String endMp) {
        this.endMp = endMp;
    }

    public MaintenanceLocation(JSONObject jo){
        parseJsonObject(jo);
    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        setId(jsonObject.optString("_id",""));
        setType(jsonObject.optString("type",""));
        if(type.equals("GPS")){
            JSONObject joStart=jsonObject.optJSONObject("start");
            if(joStart!=null){
                setStart(new LatLong(joStart.optString("lat",""),joStart.optString("lon","")));
            }
            JSONObject joEnd=jsonObject.optJSONObject("end");
            if(joEnd!=null){
                setEnd(new LatLong(joEnd.optString("lat",""),joEnd.optString("lon","")));
            }
        }else{
            setStartMp(jsonObject.optString("start",""));
            setEndMp(jsonObject.optString("end",""));
        }
        return false;
    }

    @Override
    public JSONObject getJsonObject() {
        return null;
    }
}
