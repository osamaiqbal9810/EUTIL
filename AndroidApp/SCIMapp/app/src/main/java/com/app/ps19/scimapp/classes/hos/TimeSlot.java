package com.app.ps19.scimapp.classes.hos;

import com.app.ps19.scimapp.Shared.IConvertHelper;
import com.app.ps19.scimapp.Shared.Utilities;

import org.json.JSONObject;

import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

public class TimeSlot implements IConvertHelper {
    private Date date;
    private Date start;
    private Date end;
    private int total;
    private String comments;
    private boolean dirty=false;

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public TimeSlot(Date date){
        this.date=date;
    }
    public TimeSlot(Date date,JSONObject jo){
        this.date=date;
        parseJsonObject(jo);
    }

    public Date getDate() {
        return date;
    }

    public boolean isDirty() {
        return dirty;
    }

    public void setDirty(boolean dirty) {
        this.dirty = dirty;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public void setStart(Date start) {
        this.start = start;
    }

    public Date getStart() {
        return start;
    }

    public void setEnd(Date end) {
        this.end = end;
    }

    public Date getEnd() {
        return end;
    }

    public int getTotal() {
        return total;
    }

    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        this.start=addTime(this.date,jsonObject.optString("startTime",""));
        if(!jsonObject.optString("endTime","").equals("")){
            this.end=addTime(this.date,jsonObject.optString("endTime",""));
            this.comments=jsonObject.optString("comments","");
            this.total=Utilities.getMinsBetween(start, end);
        }
        return false;
    }

    @Override
    public JSONObject getJsonObject() {
        return null;
    }
    private Date addTime(Date date, String time){
        Calendar cal=Calendar.getInstance();
        cal.setTime(date);
        String [] timeParts=time.split(":");
        if(timeParts.length==2){
            cal.add(Calendar.HOUR,Integer.valueOf(timeParts[0]));
            cal.add(Calendar.MINUTE,Integer.valueOf(timeParts[1]));
            //cal.setTimeZone(TimeZone.getTimeZone("UTC"));
        }
        return cal.getTime();
    }
}