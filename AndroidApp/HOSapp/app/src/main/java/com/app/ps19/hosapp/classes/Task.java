package com.app.ps19.hosapp.classes;

import android.content.ContentResolver;
import android.content.Context;
import android.content.res.Resources;
import android.net.Uri;
import androidx.annotation.AnyRes;
import androidx.annotation.NonNull;
import android.util.Log;

import com.app.ps19.hosapp.Shared.Globals;
import com.app.ps19.hosapp.Shared.IConvertHelper;
import com.app.ps19.hosapp.Shared.Utilities;
import com.google.android.gms.maps.model.LatLng;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import static android.content.ContentValues.TAG;


public class Task implements IConvertHelper{
    private String taskId;
    private int taskIndex;
    private String employeeId;
    private String taskDate;
    private String startLocation;
    private String endLocation;
    private String startTime;
    private String endTime;
    private String status;
    private String title;
    private String description;
    private String notes;
    private String imageUrl;
    private ArrayList<Report> reportList;
    private ArrayList<Units> unitList;
    private Context mContext;
    private boolean copyAllProps=false;
    private GeoLocation startLoc;
    private GeoLocation endLoc;
    private GeoLocation lineCords;
    private SUnit locationSpecial;

    public SUnit getLocationSpecial() {
        return locationSpecial;
    }

    public void setLocationSpecial(SUnit locationSpecial) {
        this.locationSpecial = locationSpecial;
    }

    public GeoLocation getStartLoc() {
        return startLoc;
    }

    public void setStartLoc(GeoLocation startLoc) {
        this.startLoc = startLoc;
    }

    public GeoLocation getEndLoc() {
        return endLoc;
    }

    public void setEndLoc(GeoLocation endLoc) {
        this.endLoc = endLoc;
    }

    public GeoLocation getLineCords() {
        return lineCords;
    }

    public void setLineCords(GeoLocation lineCords) {
        this.lineCords = lineCords;
    }

    public boolean isCopyAllProps() {
        return copyAllProps;
    }

    public void setCopyAllProps(boolean copyAllProps) {
        this.copyAllProps = copyAllProps;
    }

    public ArrayList<DUnit> getUnitList(LatLng userLatLng){
        ArrayList<DUnit> unitOutList=new ArrayList<>();
        for (Units unit:unitList)
        {
            DUnit dUnit=new DUnit(unit, -1);
            if(unit.getCoordinates().size()>=1){
                if(unit.getCoordinates().size() == 2){
                    if(!dUnit.isLinear()){//if(unit.getCoordinates().get(0).getLat().equals(unit.getCoordinates().get(1).getLat())){
                        dUnit.setDistance(Utilities.calculateDistanceInMeters(userLatLng
                                , unit.getCoordinates().get(0).getLatLng()));
                    } else {
                        int dist = Utilities.calculateDistanceInMeters(unit.getCoordinates().get(0).getLatLng(), unit.getCoordinates().get(1).getLatLng()) - (Utilities.calculateDistanceInMeters(userLatLng, unit.getCoordinates().get(0).getLatLng()) - Utilities.calculateDistanceInMeters(userLatLng, unit.getCoordinates().get(1).getLatLng()));
                        dUnit.setDistance(dist);
                    }
                } else if(unit.getCoordinates().size()==1){
                    dUnit.setDistance(Utilities.calculateDistanceInMeters(userLatLng
                            , unit.getCoordinates().get(0).getLatLng()));
                }
            }
            unitOutList.add(dUnit);
        }
        //Sort Array List
        Collections.sort(unitOutList, new Comparator<DUnit>() {
            @Override
            public int compare(DUnit lhs, DUnit rhs) {
                return rhs.getDistance() > lhs.getDistance() ? -1 : (rhs.getDistance() < lhs.getDistance()) ? 1 : 0;
                //return lhs.getDistance() > rhs.getDistance() ? -1 : (lhs.getDistance() < rhs.getDistance()) ? 1 : 0;
            }
        });
        return unitOutList;
    }

    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        this.taskId=jsonObject.optString("taskId","");
        this.employeeId=jsonObject.optString("employeeId","");
        this.taskDate=jsonObject.optString("taskDate","");
        this.startLocation=jsonObject.optString("startLocation","");
        this.endLocation=jsonObject.optString("endLocation","");
        this.startTime=jsonObject.optString("startTime","");
        this.endTime=jsonObject.optString("endTime","");
        this.status=jsonObject.optString("status","");
        this.title=jsonObject.optString("title","");
        this.description = jsonObject.optString("desc", "");
        this.notes=jsonObject.optString("notes","");
        if(jsonObject.optJSONObject("locationSpecial")!= null){
            setLocationSpecial(new SUnit(jsonObject.optJSONObject("locationSpecial")));
        } else {
            setLocationSpecial(null);
        }
        if(jsonObject.optJSONObject("startLoc")!=null){
            this.startLoc = new GeoLocation(jsonObject.optJSONObject("startLoc"));
        }
        if(jsonObject.optJSONObject("endLoc")!=null){
            this.endLoc = new GeoLocation(jsonObject.optJSONObject("endLoc"));
        }
        if(jsonObject.optJSONObject("lineCords")!=null){
            this.lineCords= new GeoLocation(jsonObject.optJSONObject("lineCords"));
        }

        JSONArray jaImgs = jsonObject.optJSONArray("imgs");
        if (jaImgs == null) {
            this.imageUrl = jsonObject.optString("imgs", "");
        } else {
            if (jaImgs.length() > 0) {
                this.imageUrl = jaImgs.optString(0, "");
            }
        }
        JSONArray jaUnits = jsonObject.optJSONArray("units");
        ArrayList<Units> unitItems = new ArrayList<>();
        if (jaUnits != null) {
            for (int i = 0; i < jaUnits.length(); i++) {
                JSONObject jo = jaUnits.optJSONObject(i);
                if (jo != null) {
                    Units unit = new Units(mContext,jo);
                    unitItems.add(unit);
                }
            }
        }
        this.unitList = unitItems;

        JSONArray ja=jsonObject.optJSONArray("issues");
        ArrayList<Report> items=new ArrayList<>();
        if(ja !=null){
            for(int i=0;i<ja.length();i++){
                JSONObject jo=ja.optJSONObject(i);
                if(jo !=null){
                    //Report report=new Report(jo);
                    Report report=new Report(mContext,jo);
                    report.setReportIndex(i);
                    items.add(report);
                }
            }
        }
        this.reportList=items;
        return true;
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jo=new JSONObject();
        try{
            jo.put("taskId",this.taskId);
            //jo.put("employeeId",getEmployeeId());
            //jo.put("taskDate",getTaskDate());
            jo.put("startLocation",getStartLocation());
            jo.put("endLocation",getEndLocation());
            jo.put("startTime",getStartTime());
            jo.put("endTime",getEndTime());
            jo.put("status",getStatus());
            if(isCopyAllProps()){
                jo.put("title",getTitle());
                jo.put("desc",getDescription());
                jo.put("title",getTitle());
                jo.put("notes",getNotes());
                jo.put("imgs",getImageUrl());
               // jo.put("taskId",getTaskId());
                if(this.startLoc!=null){
                    jo.put("startLoc",this.startLoc.getJsonObject());
                }
                if(this.endLoc!=null){
                    jo.put("endLoc",this.endLoc.getJsonObject());
                }
                if(this.lineCords!=null){
                    jo.put("lineCords",this.lineCords.getJsonObject());
                }
                if(getLocationSpecial()!=null){
                    jo.put("locationSpecial", getLocationSpecial().getJsonObject());
                }
            }
            //jo.put("title",getTitle());
            //jo.put("description",getDescription());
            //jo.put("notes",getNotes());
            JSONArray jaReports = new JSONArray();
            for (Report report : reportList) {
                jaReports.put(report.getJsonObject());
            }
            jo.put("issues", jaReports);
            JSONArray jaUnits = new JSONArray();
            for (Units unit : unitList) {
                jaUnits.put(unit.getJsonObject());
            }
            jo.put("units", jaUnits);

        }catch (Exception e)
        {
            Log.e(TAG,e.toString());
        }

        return jo;
    }

    public void load() {
    }

    public void start() {
    }

    public void end() {
    }
    public Task (JSONObject jo){
        parseJsonObject(jo);
    }
    public Task (Context context,JSONObject jo){
        this.mContext=context;
        parseJsonObject(jo);
    }

    public Task(String taskId) {

    }
    public Task(Context context){
        this.mContext = context;
        loadSampleData();
    }

    public void loadSampleData() {
        /*this.title = "Inspection Unit 203";
        this.description = "Milepost 10, 11";
        this.notes = "Please also check Joint bars and mark all cracked ones.";
        //this.reportList.add();
        reportList = new ArrayList<>();
        //ArrayList<Uri> images = new ArrayList<Uri>();
        //images.add(getUriToResource(mContext, R.drawable.report_1));

        ArrayList<String> images = new ArrayList<String>();
        images.add(String.valueOf(R.drawable.report_1));
        reportList.add(new Report("0", "Rails", "TRK0001", "Need Repairs", images, "36.778259,-119.41493", true, "High"));
        reportList.add(new Report("2", "Tiles", "TRK0001", "Need Repairs", images, "36.778259,-119.41493", true, "High"));
        reportList.add(new Report("3", "Spikes", "TRK0001", "Need Repairs", images, "36.778259,-119.41493", true, "High"));
        reportList.add(new Report("4", "Joint Bar", "TRK0001", "Need Repairs", images, "36.778259,-119.41493", true, "High"));
        reportList.add(new Report("5", "Switch", "TRK0001", "Need Repairs", images, "36.778259,-119.41493", true, "High"));
        reportList.add(new Report("6", "Rails", "TRK0001", "Need Repairs", images, "36.778259,-119.41493", true, "High"));
        reportList.add(new Report("7", "Switch", "TRK0001", "Need Repairs", images, "36.778259,-119.41493", true, "High"));
*/
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getTaskDate() {
        return taskDate;
    }

    public void setTaskDate(String taskDate) {
        this.taskDate = taskDate;
    }

    public String getStartLocation() {
        return startLocation;
    }

    public void setStartLocation(String startLocation) {
        this.startLocation = startLocation;
    }

    public String getEndLocation() {
        return endLocation;
    }

    public void setEndLocation(String endLocation) {
        this.endLocation = endLocation;
    }

    public String getStartTime() {
        return startTime;
    }
    public String getStartTimeFormatted(){
        if(!startTime.equals("")) {
            Date date = new Date(startTime);
            return Utilities.FormatDateTime(date, Globals.defaultDateFormat);
        }
        return  null;
    }
    public String getEndTimeFormatted(){
        if(!endTime.equals("")) {
            Date date = new Date(endTime);
            return Utilities.FormatDateTime(date, Globals.defaultDateFormat);
        }
        return  null;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTaskId() {
        return taskId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String url) {
        this.imageUrl = url;
    }

    public int getTaskIndex() {
        return taskIndex;
    }

    public void setTaskIndex(int taskIndex) {
        this.taskIndex = taskIndex;
    }

    public ArrayList<Report> getReportList() {
        return reportList;
    }

    /*Old method for getting reports filtered by Asset Type*/
    public ArrayList<Report> getFilteredReportList(String type) {
        ArrayList<Report> filteredReportList = new ArrayList<>();
        //Iterator<Report> iterator = reportList.iterator();
        for (int counter = 0; counter < reportList.size(); counter++) {
            if(reportList.get(counter).getUnit()!= null){
                if(reportList.get(counter).getUnit().getAssetType().equals(type)){
                    filteredReportList.add(reportList.get(counter));
                }
            }

            //System.out.println(arrlist.get(counter));
        }
        /*while (iterator.hasNext()) {
            if(iterator.next().getCategory().equals(category)){
                filteredReportList.add(iterator.next());
            }
            //System.out.println(iterator.next());
        }*/
        return filteredReportList;
    }

    /*Method for getting report list filtered by unit ID*/
    public ArrayList<Report> getFilteredReports(String type) {
        ArrayList<Report> filteredReportList = new ArrayList<>();
        //Iterator<Report> iterator = reportList.iterator();
        for (int counter = 0; counter < reportList.size(); counter++) {
            if (reportList.get(counter).getUnit() != null) {
                if (reportList.get(counter).getUnit().getUnitId().equals(type)) {
                    filteredReportList.add(reportList.get(counter));
                }
            }

            //System.out.println(arrlist.get(counter));
        }
        /*while (iterator.hasNext()) {
            if(iterator.next().getCategory().equals(category)){
                filteredReportList.add(iterator.next());
            }
            //System.out.println(iterator.next());
        }*/
        return filteredReportList;
    }

    public void setReportList(ArrayList<Report> reportList) {
        this.reportList = reportList;
    }

    /**
     * get uri to any resource type
     * @param context - context
     * @param resId - resource id
     * @throws Resources.NotFoundException if the given ID does not exist.
     * @return - Uri to resource by given id
     */
    public static final Uri getUriToResource(@NonNull Context context,
                                             @AnyRes int resId)
            throws Resources.NotFoundException {
        /** Return a Resources instance for your application's package. */
        Resources res = context.getResources();
        /**
         * Creates a Uri which parses the given encoded URI string.
         * @param uriString an RFC 2396-compliant, encoded URI
         * @throws NullPointerException if uriString is null
         * @return Uri for this given uri string
         */
        Uri resUri = Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE +
                "://" + res.getResourcePackageName(resId)
                + '/' + res.getResourceTypeName(resId)
                + '/' + res.getResourceEntryName(resId));
        /** return uri */
        return resUri;
    }

    public ArrayList<String> getUnitListOnlyName() {
        ArrayList<String> items = new ArrayList<>();
        for (Units item : unitList) {
            items.add(item.getDescription());
        }
        return items;
    }
    public ArrayList<Units> getWholeUnitList() {

        return this.unitList;
    }
    public List<IssueImage> getImageList(){
        ArrayList<IssueImage> items=new ArrayList<IssueImage>();
        for(Report r:reportList){
            for(IssueImage issueImage:r.getImgList()){
                items.add(issueImage);
            }
        }
        return  items;
    }
    public boolean setImageStatus(HashMap<String , Integer> items){
        Boolean blnDataChanged=false;
        for(Report report: reportList){
            boolean retValue = report.setImgStatus(items);
            if(retValue){
                blnDataChanged=true;
            }
        }
        return blnDataChanged;
    }

    public List<IssueVoice> getVoiceList(){
        ArrayList<IssueVoice> items=new ArrayList<IssueVoice>();
        for(Report r:reportList){
            for(IssueVoice issueVoice:r.getVoiceList()){
                items.add(issueVoice);
            }
        }
        return  items;
    }
    public boolean setVoiceStatus(HashMap<String , Integer> items){
        Boolean blnDataChanged=false;
        for(Report report: reportList){
            boolean retValue = report.setVoiceStatus(items);
            if(retValue){
                blnDataChanged=true;
            }
        }
        return blnDataChanged;
    }

    public Task mergeJsonObject(JSONObject jsonObject) {

        this.taskId=jsonObject.optString("taskId","");
        //this.employeeId=jsonObject.optString("employeeId","");
        //this.taskDate=jsonObject.optString("taskDate","");
        this.startLocation=jsonObject.optString("startLocation","");
        this.endLocation=jsonObject.optString("endLocation","");
        this.startTime=jsonObject.optString("startTime","");
        this.endTime=jsonObject.optString("endTime","");
        this.status=jsonObject.optString("status","");
        //this.title=jsonObject.optString("title","");
        //this.description = jsonObject.optString("desc", "");
        //this.notes=jsonObject.optString("notes","");
        if(jsonObject.optJSONObject("startLoc")!=null){
            this.startLoc = new GeoLocation(jsonObject.optJSONObject("startLoc"));
        }
        if(jsonObject.optJSONObject("endLoc")!=null){
            this.endLoc = new GeoLocation(jsonObject.optJSONObject("endLoc"));
        }
        /*if(jsonObject.optJSONObject("lineCords")!=null){
            this.lineCords= new GeoLocation(jsonObject.optJSONObject("lineCords"));
        }*/

        /*JSONArray jaImgs = jsonObject.optJSONArray("imgs");
        if (jaImgs == null) {
            this.imageUrl = jsonObject.optString("imgs", "");
        } else {
            if (jaImgs.length() > 0) {
                this.imageUrl = jaImgs.optString(0, "");
            }
        }*/
        JSONArray jaUnits = jsonObject.optJSONArray("units");
        ArrayList<Units> unitItems = new ArrayList<>();
        if (jaUnits != null) {
            for (int i = 0; i < jaUnits.length(); i++) {
                JSONObject jo = jaUnits.optJSONObject(i);
                if (jo != null) {
                    Units unit = new Units(mContext,jo);
                    unitItems.add(unit);
                }
            }
        }
        this.unitList = unitItems;

        JSONArray ja=jsonObject.optJSONArray("issues");

        ArrayList<Report> items=new ArrayList<>();
        if(ja !=null){
            for(int i=0;i<ja.length();i++){
                JSONObject jo=ja.optJSONObject(i);
                if(jo !=null){
                    //Report report=new Report(jo);
                    Report report=new Report(mContext,jo);
                    report.setReportIndex(i);
                    items.add(report);
                }
            }
        }
        this.reportList=items;
        return this;
    }
}
