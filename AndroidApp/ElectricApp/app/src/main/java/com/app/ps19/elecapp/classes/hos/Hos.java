package com.app.ps19.elecapp.classes.hos;

import android.util.Log;

import com.app.ps19.elecapp.Shared.Globals;
import com.app.ps19.elecapp.Shared.Utilities;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

public class Hos {
    public static volatile DateSlot yesterday;
    public static volatile DateSlot today;
    public  static volatile boolean waitingForData=false;
    public static DateSlot getYesterday() {
        return yesterday;
    }

    public static void setYesterday(DateSlot yesterday) {
        Hos.yesterday = yesterday;
    }

    public static DateSlot getToday() {
        return today;
    }

    public static void setToday(DateSlot today) {
        Hos.today = today;
    }
    public static void addTodaySession(){
        ArrayList<TimeSlot> slots=today.getSlots();
        if(slots.size()==0 ||slots.size()==1 ){
            TimeSlot ts=new TimeSlot(getTodayDate());

            ts.setStart(getTodayDateWithTime(18,30));
            ts.setEnd(getTodayDateWithTime(18,50));
            ts.setDirty(true);
            slots.add(ts);

        }
    }
    public static void addYesterdaySession(){
        ArrayList<TimeSlot> slots=yesterday.getSlots();
        if(slots.size()==0 ||slots.size()==1 ){
            TimeSlot ts=new TimeSlot(yesterday.getDate());

            ts.setStart(getDateWithTime(yesterday.getDate(), 8,30));
            ts.setEnd(getDateWithTime(yesterday.getDate(),18,50));
            ts.setDirty(true);
            slots.add(ts);

        }
    }
    public static boolean load(IServerResponseCallback serverResponseCallback){
        yesterday=new DateSlot(getYesterdayDate());
        today=new DateSlot(getTodayDate());
        waitingForData=true;
        getFromServer(serverResponseCallback);
        waitingForData=false;
        return false;
    }
    public static boolean update(){
        ArrayList<TimeSlot> slots=today.getSlots();
        for(TimeSlot ts:slots){
            if(ts.isDirty()){
                sendToServer(ts);
            }
        }
        return true;
    }

    public static boolean getFromServer(IServerResponseCallback serverResponseCallback){
        boolean retValue=false;
        final String startDate= Utilities.formatMomentDate(yesterday.getDate());
        final String endDate= Utilities.formatMomentDate(today.getDate());
        new Thread(new Runnable() {
            @Override
            public void run() {
                String strData=Globals.getHosData(Globals.getDBContext(),startDate,endDate);
                if(strData!=null) {
                    if (!strData.equals("")) {
                        JSONArray ja;
                        try {
                            ja = new JSONArray(strData);
                            for (int i = 0; i < ja.length(); i++) {
                                JSONObject jsonObject = ja.getJSONObject(i);
                                String date = jsonObject.getString("date");
                                Date dtStart = Utilities.parseMomentDate(date);
                                if (today.getDate().equals(dtStart)) {
                                    today.parseJSONObject(jsonObject);
                                } else if (yesterday.getDate().equals(dtStart)) {
                                    yesterday.parseJSONObject(jsonObject);
                                }
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        if (serverResponseCallback != null) {
                            Globals.mainActivity.runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    serverResponseCallback.serverResponseCallback();
                                }
                            });
                        }
                    }
                    Log.d("data", strData);
                }
            }
        }).start();


        return retValue;
    }
    public static boolean sendToServer(TimeSlot timeSlot){
        boolean retValue=false;
        final String startDate=Utilities.formatMomentDate(timeSlot.getStart());
        final String endDate=timeSlot.getEnd()!=null?Utilities.formatMomentDate(timeSlot.getEnd()):"";
        final String comments=timeSlot.getComments();
        new Thread(new Runnable() {
            @Override
            public void run() {
                String retData=Globals.updateHosData(Globals.getDBContext(),startDate,endDate,comments);
            }
        }).start();

        return retValue;
    }
    public static boolean getFromDatabase(){
        boolean retValue=false;
        return retValue;

    }
    public static boolean sendToDatabase(TimeSlot timeSlot){
        boolean retValue=false;
        return retValue;
    }
    private static Date getYesterdayDate(){
        Calendar cal=Calendar.getInstance();
        Date today=getTodayDate();
        cal.setTime(today);
        cal.add(Calendar.DATE,cal.get(Calendar.DAY_OF_WEEK)==Calendar.MONDAY?-3:-1);
        return cal.getTime();
    }
    public static Date getTodayDate(){
        DateFormat formatter=new SimpleDateFormat("dd/MM/yyyy");
        Date today=new Date();
        Date todayWithoutTime=today;
        try {
            todayWithoutTime= formatter.parse(formatter.format(today));

        } catch (ParseException e) {
            e.printStackTrace();
        }
        return todayWithoutTime;
    }
    public static Date getTodayDateWithTime(int hour, int minute){
        Date tDate=getTodayDate();
        Calendar cal=Calendar.getInstance();
        cal.setTime(tDate);
        cal.add(Calendar.HOUR, hour);
        cal.add(Calendar.MINUTE, minute);
        return cal.getTime();
    }
    public static Date getDateWithTime(Date date, int hour, int minute){
        Date tDate=date;
        Calendar cal=Calendar.getInstance();
        cal.setTime(tDate);
        cal.add(Calendar.HOUR, hour);
        cal.add(Calendar.MINUTE, minute);
        return cal.getTime();
    }

}
