package com.app.ps19.scimapp.classes.hos;

import com.app.ps19.scimapp.Shared.Utilities;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Date;

public class DateSlot {
    private ArrayList<TimeSlot> slots=new ArrayList();
    private Date date;
    public DateSlot(Date date){
        this.date=date;
    }
    public ArrayList<TimeSlot> getSlots() {
        return slots;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public void setSlots(ArrayList<TimeSlot> slots) {
        this.slots = slots;
    }
    public boolean parseJSONObject(JSONObject jo){
        JSONArray jaData=jo.optJSONArray("data");
        String date1=jo.optString("date");
        Date curDate= Utilities.parseMomentDate(date1);
        if(jaData !=null){
            ArrayList<TimeSlot>_timeSlots=new ArrayList<>();
            for(int i=0;i<jaData.length();i++){
                _timeSlots.add(new TimeSlot(curDate, jaData.optJSONObject(i)));
            }
            this.slots=_timeSlots;
        }
        return true;
    }


}
