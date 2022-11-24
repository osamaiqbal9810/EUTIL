package com.app.ps19.scimapp.classes;

import com.app.ps19.scimapp.Shared.IConvertHelper;
import com.app.ps19.scimapp.Shared.Utilities;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;

public class Session implements IConvertHelper {
    public String getStart() {
        return start;
    }
    public float getStartF(){
        float retValue=Float.parseFloat(start);
        return retValue;
    }
    public float getEndF(){
        float retValue=Float.parseFloat(end);
        return retValue;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    public String getStartTime() {
        return startTime;
    }
    public String getStartTimeFormatted() {
        SimpleDateFormat sdf=new SimpleDateFormat("MMM-dd-yy hh:mm");
        try{
            Date date=new Date(startTime);
            return sdf.format(date);
            //Utilities.formatMomentDate()
        }catch (Exception e){

        }
        return startTime;
    }
    private String formatDateTime(String dateValue, String pattern){
        SimpleDateFormat sdf=new SimpleDateFormat(pattern);
        try{
            Date date=new Date(dateValue);
            return sdf.format(date);
            //Utilities.formatMomentDate()
        }catch (Exception e){

        }
        return "";
    }
    public String getStartTimeFormatted(String pattern) {
        return formatDateTime(startTime,pattern);
    }
    public String getEndTimeFormatted(String pattern) {
        return formatDateTime(endTime,pattern);
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getStartLocation() {
        return startLocation;
    }

    public void setStartLocation(String startLocation) {
        this.startLocation = startLocation;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getEndLocation() {
        return endLocation;
    }

    public void setEndLocation(String endLocation) {
        this.endLocation = endLocation;
    }

    public void setExpEnd(String expEnd) {
        this.expEnd = expEnd;
    }
    public String getExpEnd() {
        return expEnd;
    }
    private boolean changeOnly=false;
    public boolean isChangeOnly() {
        return changeOnly;
    }
    private HashMap<String, Object> hmBackupValues=new HashMap<>();

    public void setChangeOnly(boolean changeOnly) {
        this.changeOnly = changeOnly;
    }

    public void setParent(Object parent) {
        this.parent = parent;
    }

    public Object getParent() {
        return parent;
    }

    String start;
    String end;
    String status;
    String expEnd;
    String startTime;
    String startLocation;
    String endTime;
    String endLocation;
    Object parent;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    String id;
    public Session(String start, String end, String status){
        this.start=start;
        this.end=end;
        this.status=status;
    }
    public Session (){

    }
    public Session(Object parent, JSONObject jo){
        this.parent=parent;
        parseJsonObject(jo);
    }
    public Session(JSONObject jo){

        parseJsonObject(jo);

    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        try {
            this.start=jsonObject.optString("start","");
            this.end=jsonObject.optString("end","");
            this.status=jsonObject.optString("status","");
            this.expEnd=jsonObject.optString("expEnd","");
            this.startTime=jsonObject.optString("startTime","");
            this.startLocation=jsonObject.optString("startLocation","");
            this.endTime=jsonObject.optString("endTime","");
            this.endLocation=jsonObject.optString("endLocation","");
            this.id=jsonObject.optString("id","");
            hmBackupValues=new HashMap<>();
            hmBackupValues.put("start", getStart());
            hmBackupValues.put("end", getEnd());
            hmBackupValues.put("status", getStatus());
            hmBackupValues.put("expEnd", getExpEnd());
            hmBackupValues.put("startTime", getStartTime());
            hmBackupValues.put("endTime", getEndTime());
            hmBackupValues.put("startLocation", getStartLocation());
            hmBackupValues.put("endLocation", getEndLocation());

        } catch (Exception e) {
            e.printStackTrace();
        }
        return true;
    }

    @Override
    public JSONObject getJsonObject() {
        if(changeOnly){
            return getJsonObjectChanged();
        }
        JSONObject jo=new JSONObject();
        try {
            jo.put("id", this.id);
            jo.put("start", this.start);
            jo.put("end", this.end);
            jo.put("status", this.status);
            jo.put("expEnd", this.expEnd);
            jo.put("startTime", this.startTime);
            jo.put("startLocation", this.startLocation);
            jo.put("endTime", this.endTime);
            jo.put("endLocation", this.endLocation);
        }catch (Exception e){
            e.printStackTrace();
        }
        return jo;
    }
    private JSONObject getJsonObjectChanged(){
        JSONObject jo=new JSONObject();
        try {
            //putJSONProperty(jo,"id", getId());
            putJSONProperty(jo,"start", getStart());
            putJSONProperty(jo,"end", getEnd());
            putJSONProperty(jo,"status", getStatus());
            putJSONProperty(jo,"expEnd", getExpEnd());
            putJSONProperty(jo,"startTime", getStartTime());
            putJSONProperty(jo,"startLocation", getStartLocation());
            putJSONProperty(jo,"endTime", getEndTime());
            putJSONProperty(jo,"endLocation", getEndLocation());
            if(jo.length()!=0){
                putJSONProperty(jo,"id", getId());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return jo;
    }
    private boolean putJSONProperty(JSONObject jo, String fieldName, Object value){
        Object oldValue=null;
        oldValue=hmBackupValues.get(fieldName);
        if(oldValue == null || (oldValue !=null && !oldValue.equals(value))){
            try {
                jo.put(fieldName,value);
            } catch (JSONException e) {
                e.printStackTrace();
                return  false;
            }
        }
        return true;
    }

}

