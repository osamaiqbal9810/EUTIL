package com.app.ps19.hosapp.classes;

import android.location.Address;
import android.location.Geocoder;

import com.app.ps19.hosapp.R;
import com.app.ps19.hosapp.Shared.Globals;
import com.app.ps19.hosapp.Shared.Utilities;
import com.bumptech.glide.load.model.GenericLoaderFactory;

import java.sql.Time;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class RptTimeAndGPS {
    public  class TimeEvent{
        public long timeKey;
        public String description="";
        public String timeText="";
        public String dateText="";
        public String status="";
        public String longitude="";
        public String latitude="";
        public String locationDescription="";
        public Globals.TimeEventType eventType=Globals.TimeEventType.teUndefined;
        public void setLocation(String location){
            if(location.contains(",")){
                String [] loc=Utilities.split(location,",");
                if(loc.length==2) {
                    latitude = loc[0];
                    longitude = loc[1];
                    this.locationDescription=getLocationDescription();
                }
            }
        }
        private String getLocationDescription(){
            try {
                Geocoder myLocation = new Geocoder(Globals.mainActivity, Locale.getDefault());
                List<Address> myList = myLocation.getFromLocation(Double.parseDouble(latitude), Double.parseDouble(longitude), 1);
                Address address = (Address) myList.get(0);
                String addressStr = "";
                //addressStr += address.getPremises();
                addressStr += (address.getAddressLine(0)!=null?(address.getAddressLine(0) + ""):"");
                //addressStr += address.getAddressLine(1) + ", ";
                //addressStr += address.getAddressLine(2);
                return addressStr;
            }catch (Exception e){
                e.printStackTrace();
            }
            return  "";
        }
        private void loadTimeKey(String _timeKey){
            Date dt= Utilities.ConvertToDateTime(_timeKey);
            if(dt==null) {
                dt = new Date(_timeKey);
            }
            timeKey=dt.getTime();

            timeText=Utilities.FormatDateTime(_timeKey, "h:mm a");
            dateText=Utilities.FormatDateTime(_timeKey, "EEE, MMM d, ''yy");

        }
        public TimeEvent(String _timeKey){
            loadTimeKey(_timeKey);
        }
        public TimeEvent(String _timeKey, String description,String longitude, String latitude, String status){
            loadTimeKey(_timeKey);
            this.description=description;
            this.longitude=longitude;
            this.latitude=latitude;
            this.status=status;

        }
        public TimeEvent(String _timeKey, String description,String location, String status){
            loadTimeKey(_timeKey);
            this.description=description;
            this.setLocation(location);
            this.status=status;
        }

    }
    private String reportTitle;
    private String curSOD ;
    private ArrayList<TimeEvent> eventArrayList;
    public String getCurSOD(){
        return  this.curSOD;
    }
    public String getReportTitle(){
        return  this.reportTitle;
    }
    public ArrayList<TimeEvent> getEventArrayList(){
        return  this.eventArrayList;
    }

    public RptTimeAndGPS(){
        eventArrayList=new ArrayList<>();
        loadDayActivity();
    }

    private String getString(int resId){
        return Globals.mainActivity.getString(resId);
    }
    private void loadDayActivity() {
        TimeEvent eventDayStart= new TimeEvent(Globals.startOfDayTime);
        JourneyPlan jp = Globals.selectedJPlan;
        String jpTitle= (jp!=null) ? jp.getTitle():"";
        eventDayStart.description=getString(R.string.work_plan)+" "+ jpTitle +"(" + eventDayStart.dateText +" )";
        eventDayStart.setLocation( Globals.sodStartLocation);
        eventDayStart.status=getString(R.string.started);
        eventDayStart.eventType=Globals.TimeEventType.teDayStart;
        eventArrayList.add(eventDayStart);

        if(jp != null){
            for(Task task:jp.getTaskList()){
                if(!task.getStartTime().equals("")){
                    TimeEvent eventTask=new TimeEvent(task.getStartTimeFormatted());
                    eventTask.setLocation(task.getStartLocation());
                    eventTask.description=getString(R.string.task)+": " +task.getDescription();
                    eventTask.status=getString(R.string.started);
                    eventTask.eventType=Globals.TimeEventType.teTaskStart;
                    eventArrayList.add(eventTask);
                    for(Report report:task.getReportList()){
                        TimeEvent eventReport=new TimeEvent(report.getTimeStampFormatted());
                        eventReport.setLocation(report.getLocation());
                        eventReport.description=getString(R.string.issue )+": " + report.getDescription();
                        eventReport.status=getString(R.string.reported);
                        eventReport.eventType=Globals.TimeEventType.teIssuePosted;
                        eventArrayList.add(eventReport);
                    }
                    if(!task.getEndTime().equals("")){
                        TimeEvent eventTask1=new TimeEvent(task.getEndTimeFormatted());
                        eventTask1.setLocation(task.getEndLocation());
                        eventTask1.description=getString(R.string.task)+": " +task.getDescription();
                        eventTask1.status=getString(R.string.completed);
                        eventTask1.eventType=Globals.TimeEventType.teTaskCompleted;
                        eventArrayList.add(eventTask1);
                    }
                }
            }
        }

        if(!Globals.endOfDayTime.equals("")) {
            TimeEvent eventDayEnd = new TimeEvent(Globals.endOfDayTime);
            eventDayEnd.description=getString(R.string.day_closed);
            eventDayEnd.setLocation(Globals.sodEndLocation);
            eventDayEnd.status=getString(R.string.closed);
            eventDayEnd.eventType=Globals.TimeEventType.teDayClosed;
            eventArrayList.add(eventDayEnd);
        }
        Collections.sort(eventArrayList, new Comparator<TimeEvent>() {
            @Override
            public int compare(TimeEvent lhs, TimeEvent rhs) {
                return Long.valueOf(lhs.timeKey).compareTo(Long.valueOf(rhs.timeKey)) ;
            }
        });
    }

}
