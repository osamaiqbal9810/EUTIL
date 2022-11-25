package com.app.ps19.scimapp.classes;

import android.content.ContentResolver;
import android.content.Context;
import android.content.res.Resources;
import android.location.Location;
import android.net.Uri;
import android.util.Log;

import androidx.annotation.AnyRes;
import androidx.annotation.NonNull;

import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.Shared.IConvertHelper;
import com.app.ps19.scimapp.Shared.Utilities;
import com.app.ps19.scimapp.classes.ativ.ATIVDefect;
import com.app.ps19.scimapp.classes.dynforms.DynForm;
import com.app.ps19.scimapp.classes.dynforms.DynFormList;
import com.app.ps19.scimapp.classes.maintenance.MaintenanceExecution;
import com.app.ps19.scimapp.classes.maintenance.MaintenanceList;
import com.google.android.gms.maps.model.LatLng;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import static android.content.ContentValues.TAG;
import static com.app.ps19.scimapp.Shared.Globals.FULL_DATE_FORMAT;
import static com.app.ps19.scimapp.Shared.Utilities.isInRange;


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
    private String userStartMp;
    private String userEndMp;
    private String mpStart;
    private String mpEnd;
    private ArrayList<RunRanges> runRanges;
    private String traverseTrack;
    private String observeTrack;
    private String traverseBy;
    private String weatherConditions;
    private String inspectionType;
    private String inspectionTypeTag;
    private String inspectionTypeDescription;
    private JSONArray jaAppForms;
    private ArrayList<DynForm> appForms;
    private boolean dirty;
    private String temperature;
    private String temperatureUnit;
    private String locationUnit;
    private boolean isYardInspection = false;
    private MaintenanceList maintenanceList;
    private ArrayList<ATIVDefect> ativIssues;
    private ArrayList<MaintenanceExecution> maintenanceExecutions;

    public ArrayList<ATIVDefect> getAtivIssues() {
        return ativIssues;
    }

    public void setAtivIssues(ArrayList<ATIVDefect> ativIssues) {
        this.ativIssues = ativIssues;
    }

    public String getAppVersion() {
        return appVersion;
    }

    public void setAppVersion(String appVersion) {
        this.appVersion = appVersion;
    }

    private String appVersion = "";

    public String getObserveTrack() {
        return observeTrack;
    }

    public void setObserveTrack(String observeTrack) {
        this.observeTrack = observeTrack;
    }
    public ArrayList<MaintenanceExecution> getMaintenanceExecutions() {
        return maintenanceExecutions;
    }

    public void setMaintenanceExecutions(ArrayList<MaintenanceExecution> maintenanceExecutions) {
        this.maintenanceExecutions = maintenanceExecutions;
    }

    public MaintenanceList getMaintenanceList() {
        return maintenanceList;
    }

    public void setMaintenanceList(MaintenanceList maintenanceList) {
        this.maintenanceList = maintenanceList;
    }

    public String getTemperatureUnit() {
        return temperatureUnit;
    }

    public void setTemperatureUnit(String temperatureUnit) {
        this.temperatureUnit = temperatureUnit;
    }
    public String getLocationUnit() {
        return locationUnit;
    }
    public void setLocationUnit(String locationUnit) {
        this.locationUnit = locationUnit;
    }

    private HashMap<String, Object> hmBackupValues;
    private boolean changeOnly=false;
    public boolean isChangeOnly() {
        return changeOnly;
    }

    public String getInspectionTypeTag() {
        return inspectionTypeTag;
    }

    public void setInspectionTypeTag(String inspectionTypeTag) {
        this.inspectionTypeTag = inspectionTypeTag;
    }

    public void setChangeOnly(boolean changeOnly) {
        this.changeOnly = changeOnly;
    }

    public String getTemperature() {
        return temperature;
    }
    public void setTemperature(String temperature) {
        this.temperature = temperature;
    }
    public boolean isDirty() {
        return dirty;
    }

    public void setDirty(boolean dirty) {
        this.dirty = dirty;
    }

    public ArrayList<DynForm> getAppForms(){
        if(appForms==null || appForms.size()==0){
            //To get Forms if target is task
            this.appForms=DynFormList.getFormList(true);
        }
        return appForms;}
    public void setAppForms(ArrayList<DynForm> forms){this.appForms=forms;}

    public JSONArray getJaAppForms() {
        return jaAppForms;
    }
    public String getWeatherConditions() {
        return weatherConditions;
    }

    public void setWeatherConditions(String weatherConditions) {
        this.weatherConditions = weatherConditions;
    }
    public String getInspectionType() {
        return inspectionType;
    }

    public void setInspectionType(String inspectionType) {
        this.inspectionType = inspectionType;
    }

    public String getInspectionTypeDescription() {
        return inspectionTypeDescription;
    }

    public void setInspectionTypeDescription(String inspectionTypeDescription) {
        this.inspectionTypeDescription = inspectionTypeDescription;
    }
    /*
        public ArrayList<UnitsDefectsOpt> getUnitDefectsListByID(String unitId){
            ArrayList<UnitsDefectsOpt> retDefects = new ArrayList<>();
    
           for(int i = 0 ; i< this.unitList.size() ; i ++) {
               if (unitList.get(i).getUnitId().equals(unitId)) {
                   if(unitList.get(i).hasDefectsList()) {
                       retDefects.addAll(unitList.get(i).getDefectsList());
                       Collections.reverse(retDefects);
                   }
                   break;
               }
           }
    
           return retDefects != null ? retDefects : new  ArrayList<UnitsDefectsOpt>() ;
        }*/
    public ArrayList<UnitsDefectsOpt> getUnitDefectsListByID(String unitId){
        ArrayList<UnitsDefectsOpt> retDefects = new ArrayList<>();

        for(int i = 0 ; i< this.unitList.size() ; i ++) {
            if (unitList.get(i).getUnitId().equals(unitId)) {
                if(unitList.get(i).hasDefectsList()) {
                    retDefects.addAll(unitList.get(i).getDefectsList());
                    Collections.reverse(retDefects);
                }
                break;
            }
        }

        return retDefects != null ? retDefects : new  ArrayList<UnitsDefectsOpt>() ;
    }

    public Units getUnitByID(String unitId){
        for(Units unit : this.unitList){
            if(unit.getUnitId().equals(unitId)){
                return unit;
            }
        }
        return null;
    }

    public ArrayList<UnitsTestOpt> getUnitTestFormListByID(String unitId){
        ArrayList<UnitsTestOpt> retTestFormList = new ArrayList<>();

        for(int i = 0 ; i< this.unitList.size() ; i ++) {
            if(unitList.get(i).getUnitId().equals(unitId)){
                retTestFormList = unitList.get(i).getTestFormList();
                break;
            }
        }
        return retTestFormList != null ? retTestFormList : new  ArrayList<UnitsTestOpt>();
    }



    public HashMap<String , String > getAppFormCurrentValuesHM(){
        HashMap<String , String > hashMap=new HashMap<>();
        if(jaAppForms !=null){
            for(int i=0;i<jaAppForms.length();i++){
                try {
                    JSONObject jo=jaAppForms.getJSONObject(i);
                    hashMap.put(jo.getString("id"),jo.getString("value"));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }
        return hashMap;
    }
    public void setJaAppForms(JSONArray jaAppForms) {
        this.jaAppForms = jaAppForms;
    }



    public String getTraverseTrack() {
        return traverseTrack;
    }

    public void setTraverseTrack(String traverseTrack) {
        this.traverseTrack = traverseTrack;
    }

    public String getTraverseBy() {
        return traverseBy;
    }

    public void setTraverseBy(String traverseBy) {
        this.traverseBy = traverseBy;
    }

    public ArrayList<RunRanges> getRunRanges() {
        return runRanges;
    }

    public void setRunRanges(ArrayList<RunRanges> runRanges) {
        this.runRanges = runRanges;
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

    public String getUserStartMp() {
        return userStartMp;
    }

    public void setUserStartMp(String userStartMp) {
        this.userStartMp = userStartMp;
    }

    public String getUserEndMp() {
        return userEndMp;
    }

    public void setUserEndMp(String userEndMp) {
        this.userEndMp = userEndMp;
    }

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
                    //For fixes assets

                    if(!dUnit.isLinear()){//if(unit.getCoordinates().get(0).getLat().equals(unit.getCoordinates().get(1).getLat())){
                        Location unitLoc = new Location(unit.getDescription());
                        unitLoc.setLatitude(unit.getCoordinates().get(0).getLatLng().latitude);
                        unitLoc.setLongitude(unit.getCoordinates().get(0).getLatLng().longitude);
                        unitLoc.setTime(new Date().getTime());
                        Location deviceLoc = new Location("User");
                        deviceLoc.setLatitude(userLatLng.latitude);
                        deviceLoc.setLongitude(userLatLng.longitude);
                        deviceLoc.setTime(new Date().getTime());
                        dUnit.setBearing(deviceLoc.bearingTo(unitLoc));
                        dUnit.setDistance(Utilities.calculateDistanceInMeters(userLatLng
                                , unit.getCoordinates().get(0).getLatLng()));
                    } else {
                        int dist = Utilities.calculateDistanceInMeters(unit.getCoordinates().get(0).getLatLng(), unit.getCoordinates().get(1).getLatLng()) - (Utilities.calculateDistanceInMeters(userLatLng, unit.getCoordinates().get(0).getLatLng()) - Utilities.calculateDistanceInMeters(userLatLng, unit.getCoordinates().get(1).getLatLng()));
                        dUnit.setDistance(dist);
                    }
                } else if(unit.getCoordinates().size()==1){
                    Location unitLoc = new Location(unit.getDescription());
                    unitLoc.setLatitude(unit.getCoordinates().get(0).getLatLng().latitude);
                    unitLoc.setLongitude(unit.getCoordinates().get(0).getLatLng().longitude);
                    unitLoc.setTime(new Date().getTime());
                    Location deviceLoc = new Location("User");
                    deviceLoc.setLatitude(userLatLng.latitude);
                    deviceLoc.setLongitude(userLatLng.longitude);
                    deviceLoc.setTime(new Date().getTime());
                    dUnit.setBearing(deviceLoc.bearingTo(unitLoc));

                    dUnit.setDistance(Utilities.calculateDistanceInMeters(userLatLng
                            , unit.getCoordinates().get(0).getLatLng()));
                }
            }
            //Filtering Location asset to be added in list
            if(!dUnit.getUnit().getAssetTypeObj().isLocation()){
                // For filtering inspectable false assets is exits in data
                if(dUnit.getUnit().getAssetTypeObj().isInspectable()){
                    unitOutList.add(dUnit);
                }
            }
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
    public ArrayList<DUnit> getSortedUnitListWithinRange(LatLng userLatLng, String start, String end){
        ArrayList<DUnit> unitOutList=new ArrayList<>();
        ArrayList<DUnit> sortedUnits = new ArrayList<>();
        double dStart = Double.parseDouble(start);
        double dEnd = Double.parseDouble(end);

        sortedUnits = getUnitList(userLatLng);
        for(DUnit unit: sortedUnits){
            if (isInRange(Double.parseDouble(unit.getUnit().getStart()), Double.parseDouble(unit.getUnit().getEnd()), dStart)
                    || isInRange(Double.parseDouble(unit.getUnit().getStart()), Double.parseDouble(unit.getUnit().getEnd()), dEnd)
                    || isInRange(dStart, dEnd, Double.parseDouble(unit.getUnit().getStart()))
                    || isInRange(dStart, dEnd, Double.parseDouble(unit.getUnit().getEnd()))){
                unitOutList.add(unit);
            }
        }
        return unitOutList;
    }

    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        hmBackupValues=Utilities.getHashMapJSONObject(jsonObject);
        DynFormList.loadFormList();
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
        setAppVersion(jsonObject.optString("appVersion", ""));
        setTemperature(jsonObject.optString("temperature", ""));
        setTemperatureUnit(jsonObject.optString("tempUnit", ""));
        setLocationUnit(jsonObject.optString("locUnit",""));
        setInspectionTypeTag(jsonObject.optString("inspectionTypeTag", ""));
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
        this.inspectionType = jsonObject.optString("inspectionType", "");
        this.inspectionTypeDescription = jsonObject.optString("inspectionTypeDescription");
        this.weatherConditions = jsonObject.optString("weatherConditions","");
        this.traverseTrack = jsonObject.optString("traverseTrack","");
        this.observeTrack = jsonObject.optString("observeTrack","");
        this.traverseBy = jsonObject.optString("traverseBy","");
        JSONArray jaUnits = jsonObject.optJSONArray("units");
        HashMap<String, Units> unitsHashMap=new HashMap<>();
        HashMap<String, UnitsGroup> unitGroupHash=new HashMap<>();
        ArrayList<Units> unitItems = new ArrayList<>();
        if (jaUnits != null) {
            for (int i = 0; i < jaUnits.length(); i++) {
                JSONObject jo = jaUnits.optJSONObject(i);
                if (jo != null) {
                    if(jo.has("id")) {
                        Units unit = new Units(mContext, jo);
                        unitItems.add(unit);
                        unitsHashMap.put(unit.getUnitId(), unit);
                        if(unit.getAttributes()!=null){
                            String group=unit.getAttributes().getGroup();
                            if(!group.equals("")){
                                //Search group in hash
                                if(unitGroupHash.get(group)==null){
                                    // Not found add new
                                    UnitsGroup unitsGroup=new UnitsGroup(group);
                                    unitsGroup.setMainUnit(unit);
                                    unitsGroup.getUnitsList().add(unit);
                                    unit.setUnitsGroup(unitsGroup);
                                    unit.setVisible(true);
                                    unitGroupHash.put(group , unitsGroup);
                                }else{
                                    UnitsGroup unitsGroup=unitGroupHash.get(group);
                                    unitsGroup.getUnitsList().add(unit);
                                    unit.setVisible(false);
                                    unitGroupHash.put(group , unitsGroup);
                                }

                            }
                        }
                        for(String groupKey:unitGroupHash.keySet()){
                            unitGroupHash.get(groupKey).refresh();
                        }
                    }
                }
            }
            for(Units unit1: unitItems){
                Units pUnit=unitsHashMap.get(unit1.getParentId());
                if(pUnit !=null){
                    unit1.setParentUnit(pUnit);
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
        calculateIssueCounter();
        try {
            JSONArray jaAtivIssues=jsonObject.optJSONArray("ativIssues");
            ArrayList<ATIVDefect> _ativIssues=new ArrayList<>();
            if(jaAtivIssues !=null){
                for(int i=0;i<jaAtivIssues.length();i++){
                    JSONObject jo=jaAtivIssues.optJSONObject(i);
                    if(jo !=null){
                        ATIVDefect aIssue=new ATIVDefect(jo);
                        _ativIssues.add(aIssue);
                    }
                }
            }
            setAtivIssues(_ativIssues);
        } catch (Exception e) {
            e.printStackTrace();
        }
        //Adding this to handle special task
        if(jsonObject.has("locationSpecial")){
            JSONObject specialLoc = null;
            try {
                specialLoc = jsonObject.getJSONObject("locationSpecial");

                if(specialLoc!=null){
                    setMpStart(specialLoc.optString("start", ""));
                    setMpEnd(specialLoc.optString("end", ""));
                } else {
                    setMpStart(jsonObject.optString("runStart", ""));
                    setMpEnd(jsonObject.optString("runEnd", ""));
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }  else {
            setMpStart(jsonObject.optString("runStart", ""));
            setMpEnd(jsonObject.optString("runEnd", ""));
        }
        setUserStartMp(jsonObject.optString("userStartMP", ""));
        setUserEndMp(jsonObject.optString("userEndMP", ""));

        ArrayList<RunRanges> _runRanges = new ArrayList<>();
        try {
            JSONArray jaRunRanges = jsonObject.optJSONArray("runRanges");
            if(jaRunRanges!=null){
                for (int i = 0; i < jaRunRanges.length(); i++) {
                    RunRanges run = new RunRanges(jaRunRanges.getJSONObject(i));
                    _runRanges.add(run);
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        //TODO: update setRunRange
        setRunRanges(_runRanges);
        calculateRanges();

        //this.jaAppForms=
        JSONArray jaForms=jsonObject.optJSONArray("appForms");
        //DynFormList.loadFormList();
        this.appForms=DynFormList.getFormList();
        HashMap<String, DynForm> formListMap=DynFormList.getFormListMap();
        if(jaForms !=null){

            for(int i=0;i<jaForms.length();i++){
                try {
                    JSONObject jo=jaForms.getJSONObject(i);
                    String formId=jo.getString("id");
                    JSONArray jaFormData=jo.optJSONArray("form");
                    DynForm form =formListMap.get(formId);
                    if(form !=null){
                        if(jaFormData!=null)
                            form.setCurrentValues(convertJsonArrayToHashMap(jaFormData));
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }
        if(jsonObject.has("isYardInspection")){
            setYardInspection(jsonObject.optBoolean("isYardInspection", false));
        } else {
            setYardInspection(isYardAssetAvailable());
        }
        JSONArray jaMaintenance= jsonObject.optJSONArray("maintenance");
        ArrayList<MaintenanceExecution> _mainExeList=new ArrayList<>();
        if(jaMaintenance!=null){
            for(int i=0; i<jaMaintenance.length();i++){
                JSONObject joMainExec=jaMaintenance.optJSONObject(i);
                if(joMainExec!=null){
                    _mainExeList.add(new MaintenanceExecution(joMainExec));
                }
            }
        }
        this.maintenanceExecutions=_mainExeList;
        return true;
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jo=new JSONObject();
        JSONArray jaRunRanges = new JSONArray();
        if(!isCopyAllProps() && changeOnly){
            jo=getJsonObjectChanged();
            return  jo;
        }
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
            jo.put("userStartMP", getUserStartMp());
            jo.put("userEndMP", getUserEndMp());
            jo.put("runStart", getMpStart());
            jo.put("runEnd", getMpEnd());
            jo.put("traverseTrack", getTraverseTrack());
            jo.put("observeTrack", getObserveTrack());
            jo.put("traverseBy", getTraverseBy());
            jo.put("weatherConditions", getWeatherConditions());
            jo.put("temperature", getTemperature());
            jo.put("inspectionType", getInspectionType());
            jo.put("inspectionTypeTag", getInspectionTypeTag());
            jo.put("inspectionTypeDescription", getInspectionTypeDescription());
            jo.put("tempUnit", getTemperatureUnit());
            jo.put("locUnit", getLocationUnit());
            jo.put("appVersion", getAppVersion());
            //jo.put("title",getTitle());
            //jo.put("description",getDescription());
            //jo.put("notes",getNotes());
            JSONArray jaAtivIssues = new JSONArray();
            for (ATIVDefect aIssue : getAtivIssues()) {
                jaAtivIssues.put(aIssue.getJsonObject());
            }
            jo.put("ativIssues", jaAtivIssues);

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
            for (RunRanges run : runRanges) {
                jaRunRanges.put(run.getJsonObject());
            }
            jo.put("isYardInspection", isYardInspection());
            jo.put("runRanges", jaRunRanges);
            if(this.appForms !=null){
                JSONArray jaForms =new JSONArray();
                for(DynForm form : this.appForms){
                    JSONObject jsonObject=form.getJsonObject();
                    if(jsonObject!=null) {
                        jaForms.put(jsonObject);
                    }
                }
                jo.put("appForms",jaForms);
            }

            if(this.maintenanceExecutions !=null && this.maintenanceExecutions.size()>0){
                JSONArray jaMaintain=new JSONArray();
                for(int i=0; i<this.maintenanceExecutions.size();i++){
                    MaintenanceExecution maintainExe=this.maintenanceExecutions.get(i);
                    maintainExe.setChangeOnly(isChangeOnly());
                    JSONObject joMaintain= maintainExe.getJsonObject();
                    if(joMaintain !=null ){
                        jaMaintain.put(joMaintain);
                    }
                }
                jo.put("maintenance",jaMaintain);
            }

        }catch (Exception e)
        {
            Log.e(TAG,e.toString());
        }

        return jo;
    }

    public JSONObject getJsonObjectChanged() {
        JSONObject jo=new JSONObject();
        JSONArray jaRunRanges = new JSONArray();
        try{
            putJSONProperty(jo,"taskId",this.taskId);
            //jo.put("employeeId",getEmployeeId());
            //jo.put("taskDate",getTaskDate());
            putJSONProperty(jo,"startLocation",getStartLocation());
            putJSONProperty(jo,"endLocation",getEndLocation());
            putJSONProperty(jo,"startTime",getStartTime());
            putJSONProperty(jo,"endTime",getEndTime());
            putJSONProperty(jo,"status",getStatus());
            putJSONProperty(jo,"userStartMP", getUserStartMp());
            putJSONProperty(jo,"userEndMP", getUserEndMp());
            putJSONProperty(jo,"runStart", getMpStart());
            putJSONProperty(jo,"runEnd", getMpEnd());
            putJSONProperty(jo,"traverseTrack", getTraverseTrack());
            putJSONProperty(jo,"observeTrack", getObserveTrack());
            putJSONProperty(jo,"traverseBy", getTraverseBy());
            putJSONProperty(jo,"weatherConditions", getWeatherConditions());
            putJSONProperty(jo,"inspectionType", getInspectionType());
            putJSONProperty(jo,"inspectionTypeTag", getInspectionTypeTag());
            putJSONProperty(jo,"inspectionTypeDescription", getInspectionTypeDescription());
            putJSONProperty(jo,"temperature", getTemperature());
            putJSONProperty(jo, "locUnit", getLocationUnit());
            putJSONProperty(jo, "tempUnit", getTemperatureUnit());
            putJSONProperty(jo,"appVersion", getAppVersion());
            JSONArray jaReports = new JSONArray();
            boolean isDataExists=false;
            for (Report report : reportList) {
                report.setChangeOnly(changeOnly);
                JSONObject joReport=report.getJsonObject();
                jaReports.put(joReport);
                if(joReport.length()!=0){
                    isDataExists=true;
                }
            }
            if(jaReports.length()>0) {
                if(isDataExists) {
                    jo.put("issues", jaReports);
                }
            }

            JSONArray jaAIssues = new JSONArray();
            boolean isDExists=false;
            for (ATIVDefect aIssue : getAtivIssues()) {
                aIssue.setChangeOnly(changeOnly);
                JSONObject joIssue=aIssue.getJsonObject();
                jaAIssues.put(joIssue);
                if(joIssue.length()!=0){
                    isDExists=true;
                }
            }
            if(jaAIssues.length()>0) {
                if(isDExists) {
                    jo.put("ativIssues", jaAIssues);
                }
            }

            JSONArray jaUnits = new JSONArray();
            boolean blnDataChanged=false;
            for (Units unit : unitList) {
                unit.setChangeOnly(changeOnly);
                JSONObject jObjUnit=unit.getJsonObject();
                if(jObjUnit.length()!=0){
                    blnDataChanged=true;
                }
                jaUnits.put(jObjUnit);
                //jaUnits.put(unit.getJsonObject());
            }
            if(blnDataChanged){
                jo.put("units",jaUnits);
            }
            putJSONProperty(jo,"isYardInspection", isYardInspection());
            //jo.put("units", jaUnits);
            //for (RunRanges run : runRanges) {
            //    jaRunRanges.put(run.getJsonObject());
            //}
            //jo.put("runRanges", jaRunRanges);
            if(this.appForms !=null){
                JSONArray jaForms =new JSONArray();
                for(DynForm form : this.appForms){
                    if(!form.isAssetTypeExists()) {
                        form.setChangeOnly(changeOnly);
                        JSONObject jsonObject = form.getJsonObject();
                        if (jsonObject != null) {
                            jaForms.put(jsonObject);
                        }
                    }
                }
                if(jaForms.length()>0) {
                    jo.put("*appForms", jaForms);
                }
            }
            if(jo !=null && jo.length()!=0){
                hmBackupValues=Utilities.putHashMapJSONObject(hmBackupValues, jo);
            }
            if(this.maintenanceExecutions !=null && this.maintenanceExecutions.size()>0){
                JSONArray jaMaintain=new JSONArray();
                for(int i=0; i<this.maintenanceExecutions.size();i++){
                    MaintenanceExecution maintainExe=this.maintenanceExecutions.get(i);
                    maintainExe.setChangeOnly(isChangeOnly());
                    JSONObject joMaintain= maintainExe.getJsonObject();
                    if(joMaintain !=null ){
                        jaMaintain.put(joMaintain);
                    }
                }
                jo.put("maintenance",jaMaintain);
            }

        }catch (Exception e)
        {
            Log.e(TAG,e.toString());
        }

        return jo;
    }

    private boolean putJSONProperty(JSONObject jo, String fieldName, Object value){
        Object oldValue=null;
        Object value1=null;
        oldValue=hmBackupValues.get(fieldName);
        if(oldValue instanceof  Integer){
            value1=Integer.parseInt((String) value);
        }else if(oldValue instanceof Float){
            value1=Float.parseFloat((String) value);
        }else{
            value1=value;
        }

        if(oldValue !=null && !oldValue.equals(value1)){
            try {
                jo.put(fieldName,value);
            } catch (JSONException e) {
                e.printStackTrace();
                return  false;
            }
        }
        return true;
    }

    private HashMap<String, String> convertJsonArrayToHashMap(JSONArray ja){
        HashMap<String , String > map=new HashMap<>();
        for(int i=0;i<ja.length();i++){
            try {
                JSONObject jo=ja.optJSONObject(i);
                if(jo !=null && jo.length()>0) {
                    String id = jo.getString("id");
                    String value = jo.getString("value");
                    map.put(id, value);
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return map;
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
            Date date = null;
            try {
                date = FULL_DATE_FORMAT.parse((startTime));
            } catch (ParseException e) {
                e.printStackTrace();
            }
            return Utilities.FormatDateTime(date, Globals.defaultDateFormat);
        }
        return  null;
    }
    public String getEndTimeFormatted(){
        if(!endTime.equals("")) {
            Date date = null;
            try {
                date = FULL_DATE_FORMAT.parse((endTime));
            } catch (ParseException e) {
                e.printStackTrace();
            }
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

    public  ArrayList<Report> getReversedReportList() {
        ArrayList<Report> retCollection = new ArrayList<>();
        retCollection.addAll(reportList);
        Collections.reverse(retCollection);
        return retCollection;
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
        this.traverseTrack = jsonObject.optString("traverseTrack", "");
        this.observeTrack = jsonObject.optString("observeTrack", "");
        this.traverseBy = jsonObject.optString("traverseBy", "");
        this.weatherConditions = jsonObject.optString("weatherConditions", "");
        setTemperature(jsonObject.optString("temperature", ""));
        this.inspectionType = jsonObject.optString("inspectionType", "");
        this.inspectionTypeDescription = jsonObject.optString("inspectionTypeDescription", "");
        setLocationUnit(jsonObject.optString("locUnit", ""));
        setTemperatureUnit(jsonObject.optString("tempUnit", ""));
        setInspectionTypeTag(jsonObject.optString("inspectionTypeTag", ""));
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
    public void calculateIssueCounter(){
        for(int i = 0; i<unitList.size(); i++){
            if(reportList.size()>0){
                for (int j= 0 ; j<reportList.size(); j++){
                    try {
                        if(unitList.get(i).getUnitId().equals(reportList.get(j).getUnit().getUnitId())){
                            int count = Integer.parseInt(unitList.get(i).getIssueCounter());
                            count++;
                            unitList.get(i).setIssueCounter(String.valueOf(count));
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }

        }
    }
    public void calculateRanges(){
        if(runRanges.size()>0){
            setMpStart(runRanges.get(0).getMpStart());
            for(int i = 0; i<runRanges.size(); i++){
                if(i == runRanges.size()-1){
                    setMpEnd(runRanges.get(i).getMpEnd());
                }
            }
        }
    }

    public boolean isYardInspection() {
        return isYardInspection;
    }

    public void setYardInspection(boolean yardInspection) {
        isYardInspection = yardInspection;
    }
    private boolean isYardAssetAvailable(){
        if(getWholeUnitList().size()>0){
            for(Units asset: getWholeUnitList()){
                if(asset.isLinear()&&!asset.getAssetTypeObj().isMarkerMilepost()){
                    return false;
                }
            }}
        if(getWholeUnitList().size()>0){
            for(Units asset: getWholeUnitList()){
                if(asset.getAssetTypeObj().isMarkerMilepost()){
                    return true;
                }
            }
        }
        return false;
    }
    public Units getLocationAsset(){
        for (Units asset: unitList){
            if(asset.getAssetTypeObj().isLocation()){
                return asset;
            }
        }
        return null;
    }
}
