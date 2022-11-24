package com.app.ps19.tipsapp.classes;

import android.annotation.SuppressLint;
import android.location.Location;
import android.util.Log;

import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.Shared.IConvertHelper;
import com.app.ps19.tipsapp.Shared.Utilities;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.TimeZone;

import static android.content.ContentValues.TAG;

public class UnitsDefectsOpt implements IConvertHelper {

    static final String DATEFORMAT = "yyyy-MM-dd HH:mm:ss";
    private String issueId="";
    private ArrayList<String> defectCodes = new ArrayList<>();
    private String title="";
    private String description="";
    private String startMP="";
    private String endMP = "";
    private String issueType = "";
    private Location location ;
    private String timeStamp ;
    private String orignalTimeStamp ;
    private String startMarker;
    private String endMarker;
    JSONObject orignalObject;
    public String getStartMarker() {
        return startMarker;
    }

    public void setStartMarker(String startMarker) {
        this.startMarker = startMarker;
    }

    public String getEndMarker() {
        return endMarker;
    }

    public void setEndMarker(String endMarker) {
        this.endMarker = endMarker;
    }
    public Location getLocation() {
        return location;
    }

    public void setLocation(String location) {
        String[] latlon = location.split(",");
        this.location = new Location("gps");
        this.location.setLatitude(Double.parseDouble( latlon[0] ));
        this.location.setLongitude(Double.parseDouble( latlon[1] ));
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStartMP() {
        return startMP;
    }

    public void setStartMP(String startMP) {
        this.startMP = startMP;
    }

    public String getEndMP() {
        return endMP;
    }

    public void setEndMP(String endMP) {
        this.endMP = endMP;
    }

    public String getTimeStamp() {
        return timeStamp;
    }

    public Date getUTCdatetimeFromString(String dateValue){
        try {
            final SimpleDateFormat sdf = new SimpleDateFormat(DATEFORMAT);
            sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
            Date dt = sdf.parse(dateValue);
            return dt;
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
    }

    @SuppressLint("SimpleDateFormat")
    public void setTimeStamp(String timeStamp) {
        try {
            orignalTimeStamp = timeStamp;
            if(!timeStamp.equals("")){
                Date dt=getUTCdatetimeFromString(timeStamp);
                this.timeStamp = Utilities.FormatDateTime(dt, Globals.defaultDateFormat);
            }

        } catch(Exception e) {
        }
    }


    public String getRemedialAction() {
        return remedialAction;
    }

    public void setRemedialAction(String remedialAction) {
        this.remedialAction = remedialAction;
    }

    private String remedialAction = "";

    public String getIssueType() {
        return issueType;
    }

    public void setIssueType(String issueType) {
        this.issueType = issueType;
    }


    public ArrayList<String> getDefectCodes() {
        return defectCodes;
    }



    public void setDefectCodes(JSONArray codes) {

        if(codes != null) {
            try {
                for (int i = 0; i < codes.length(); i++) {
                    defectCodes.add(codes.getString(i));
                }
            } catch (Exception ex) {
                Log.e(TAG, ex.toString());
            }
        }
    }

    public String getIssueId() {
        return issueId;
    }

    public void setIssueId(String issueId) {
        this.issueId = issueId;
    }


    public UnitsDefectsOpt(JSONObject jo){
        parseJsonObject(jo);
    }

    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {

        try{
            setIssueId(jsonObject.optString("issueId",""));
            setIssueType(jsonObject.optString("issueType",""));
            setTitle(jsonObject.optString("title", ""));
            setDescription(jsonObject.optString("description", ""));
            setStartMP(jsonObject.optString("startMp", ""));
            setEndMP(jsonObject.optString("endMp", ""));
            setRemedialAction(jsonObject.optString("remedialAction", ""));
            setLocation(jsonObject.optString("location", ""));
            setTimeStamp(jsonObject.optString("timeStamp", ""));
            setDefectCodes(jsonObject.optJSONArray("defectCodes"));
            setStartMarker(jsonObject.optString("startMarker", ""));
            setEndMarker(jsonObject.optString("endMarker",""));
            orignalObject = jsonObject;
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return  false;
        }
    }



    @Override
    public JSONObject getJsonObject() {
        //As previous defects are readonly, we don't need to parse them
        return orignalObject;
    }
}
