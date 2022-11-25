package com.app.ps19.scimapp.classes;

import android.content.Context;
import android.util.Log;

import com.app.ps19.scimapp.Shared.DBHandler;
import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.Shared.IConvertHelper;
import com.app.ps19.scimapp.Shared.StaticListItem;
import com.app.ps19.scimapp.Shared.Utilities;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.TimeZone;

import static android.content.ContentValues.TAG;
import static com.app.ps19.scimapp.Shared.Globals.getSelectedTask;

public class Report implements IConvertHelper {
    static final String DATEFORMAT = "yyyy-MM-dd HH:mm:ss";
    private String parentId;
    private String reportId;
    private int reportIndex;
    private String category;
    private String trackId;
    private String description;
    private Units unit;
    private ArrayList<IssueImage> imgList;
    private ArrayList<IssueVoice> voiceList;
    private String location;
    private Boolean marked;
    private String priority;
    private String timeStamp;
    private String status;
    private ArrayList<String> checkList;
    private ArrayList<String> defectCodes;
    private Context context;
    private String fixType;
    private String startMp;
    private String endMp;
    private String locationInfo;
    private String tempSpeed;
    private String title;
    private String typeOfAction;
    private String remedialAction;
    private String railDirection;
    private String locationUnit;
    private String issueId;
    private String startMarker;
    private String endMarker;

    public String getIssueId() {
        return issueId;
    }

    public void setIssueId(String issueId) {
        this.issueId = issueId;
    }

    private HashMap<String, Object> hmBackupValues;
    private boolean changeOnly=false;
    public boolean isChangeOnly() {
        return changeOnly;
    }

    public void setChangeOnly(boolean changeOnly) {
        this.changeOnly = changeOnly;
    }
    private boolean isRuleApplied;
    private String issueType;
    private String voiceNotes;
    public String getLocationUnit() {
        return locationUnit;
    }

    public void setLocationUnit(String locationUnit) {
        this.locationUnit = locationUnit;
    }

    public String getVoiceNotes() {
        return voiceNotes;
    }

    public void setVoiceNotes(String voiceNotes) {
        this.voiceNotes = voiceNotes;
    }

    private ArrayList<RemedialActionItem> remedialActionItems;

    public String getIssueType() {
        return issueType;
    }

    public void setIssueType(String issueType) {
        this.issueType = issueType;
    }


    public boolean isRuleApplied() {
        return isRuleApplied;
    }

    public void setRuleApplied(boolean ruleApplied) {
        isRuleApplied = ruleApplied;
    }
    public String getRailDirection() {
        return railDirection;
    }

    public void setRailDirection(String railDirection) {
        this.railDirection = railDirection;
    }
    public String getTypeOfAction() {
        return typeOfAction;
    }

    public void setTypeOfAction(String typeOfAction) {
        this.typeOfAction = typeOfAction;
    }
    public void setRemedialActionItems(ArrayList<RemedialActionItem> items){
        this.remedialActionItems=items;
    }
    public void setRemedialAction(String remedialAction){
        this.remedialAction=remedialAction;
    }
    public String getRemedialAction(){
        return this.remedialAction;
    }
    public ArrayList<RemedialActionItem> getRemedialActionItems(){
        return this.remedialActionItems;
    }
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }


    public String getTempSpeed() {
        return tempSpeed;
    }

    public void setTempSpeed(String tempSpeed) {
        this.tempSpeed = tempSpeed;
    }

    public String getLocationInfo() {
        return locationInfo;
    }

    public void setLocationInfo(String locationInfo) {
        this.locationInfo = locationInfo;
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

    public String getFixType() {
        return fixType;
    }

    public void setFixType(String fixType) {
        this.fixType = fixType;
    }

    public ArrayList<String> getCheckList() {
        return checkList;
    }

    public void setCheckList(ArrayList<String> checkList) {
        this.checkList = checkList;
    }
    public ArrayList<String> getDefectCodes() {
        return defectCodes;
    }

    public void setDefectCodes(ArrayList<String> defectCodes) {
        this.defectCodes = defectCodes;
    }

    public int getReportIndex() {
        return reportIndex;
    }

    public void setReportIndex(int reportIndex) {
        this.reportIndex = reportIndex;
    }

    public Units getUnit() {
        return unit;
    }

    public void setUnit(Units _selectedUnit) {
        this.unit = _selectedUnit;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        hmBackupValues=Utilities.getHashMapJSONObject(jsonObject);
        setIssueId(jsonObject.optString("issueId", ""));
        this.reportId = jsonObject.optString("reportId", "");
        this.category=jsonObject.optString("category","");
        this.trackId=jsonObject.optString("trackId","");
        this.description=jsonObject.optString("description","");
        this.location=jsonObject.optString("location","");
        this.marked=jsonObject.optBoolean("marked",false);
        this.priority =jsonObject.optString("priority","");
        this.timeStamp=jsonObject.optString("timeStamp","");
        this.status = jsonObject.optString("status", "");
        this.fixType = jsonObject.optString("fixType","");
        this.startMp = jsonObject.optString("startMp", "");
        this.endMp = jsonObject.optString("endMp","");
        this.locationInfo = jsonObject.optString("locationInfo", "");
        this.tempSpeed = jsonObject.optString("tempSpeed", "");
        this.title = jsonObject.optString("title", "");
        this.typeOfAction = jsonObject.optString("typeOfAction", "");
        this.remedialAction=jsonObject.optString("remedialAction","");
        this.railDirection = jsonObject.optString("railDirection", "");
        setVoiceNotes(jsonObject.optString("voiceNotes", ""));
        setRuleApplied(jsonObject.optBoolean("ruleApplied", false));
        setIssueType(jsonObject.optString("issueType",""));
        setLocationUnit(jsonObject.optString("locUnit",""));
        setStartMarker(jsonObject.optString("startMarker", ""));
        setEndMarker(jsonObject.optString("endMarker", ""));

        JSONArray _ja =jsonObject.optJSONArray("remedialActionItems");
        if(_ja !=null){
            ArrayList<RemedialActionItem> rItems=new ArrayList<>();
            for(int i=0;i<_ja.length();i++){
                JSONObject  jo=_ja.optJSONObject(i);
                if(jo !=null){
                    rItems.add(new RemedialActionItem(jo));
                }
            }
            this.remedialActionItems=rItems;
        }
        ArrayList<String> tagList = new ArrayList<>();
        JSONArray jaTagList = jsonObject.optJSONArray("tags");
        if(jaTagList != null){
            try {
                for (int i = 0; i < jaTagList.length(); i++){
                    tagList.add(jaTagList.getString(i));
                }
            } catch (Exception ex){
                Log.e(TAG,ex.toString());
            }
        }
        ArrayList<String> defectList = new ArrayList<>();
        JSONArray jaDefList = jsonObject.optJSONArray("defectCodes");
        if(jaDefList != null){
            try {
                for (int i = 0; i < jaDefList.length(); i++){
                    defectList.add(jaDefList.getString(i));
                }
            } catch (Exception ex){
                Log.e(TAG,ex.toString());
            }
        }
        this.checkList = tagList;
        this.defectCodes = defectList;
        JSONObject joUnit = jsonObject.optJSONObject("unit");
        if(joUnit!= null){
            this.unit = new Units(context,joUnit);
        }
        //Units _unit = new Units(joUnit);

        ArrayList<IssueVoice> voiceItems = new ArrayList<>();
        JSONArray jaVoice = jsonObject.optJSONArray("voiceList");
        if(jaVoice != null){
            try {
                for (int i = 0; i < jaVoice.length(); i++
                ) {
                    JSONObject joVoice = jaVoice.optJSONObject(i);
                    if (joVoice != null) {
                        voiceItems.add(new IssueVoice(joVoice));
                    }

                }
            }catch (Exception ex)
            {
                Log.e(TAG,ex.toString());
            }
        }
        this.voiceList = voiceItems;

        ArrayList<IssueImage> items = new ArrayList<>();
        JSONArray ja = jsonObject.optJSONArray("imgList");
        if(ja != null){
            try {
                for (int i = 0; i < ja.length(); i++
                ) {
                    JSONObject joImage = ja.optJSONObject(i);
                    if (joImage != null) {
                        if(joImage.optString("imgName")!=null){
                            items.add(new IssueImage(joImage));
                        }
                    }


                }
            }catch (Exception ex)
            {
                Log.e(TAG,ex.toString());
            }
        }

        this.imgList=items;
        return true;
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jo = new JSONObject();
        if(changeOnly && hmBackupValues!=null && !hmBackupValues.isEmpty()){
            jo=getJsonObjectChanged();
            return jo;
        }
        try {
            jo.put("issueId", getIssueId());
            jo.put("category", category);
            jo.put("trackId", trackId);
            jo.put("description", description);
            JSONArray jaImages = new JSONArray();
            for (IssueImage img : imgList) {
                jaImages.put(img.getJsonObject());
            }
            jo.put("imgList", jaImages);
            JSONArray jaVoices = new JSONArray();
            for (IssueVoice voice : voiceList) {
                jaVoices.put(voice.getJsonObject());
            }
            jo.put("voiceList", jaVoices);

            JSONArray jaCheckList = new JSONArray();
            for(String value: checkList){
                jaCheckList.put(value);
            }
            jo.put("tags", jaCheckList);
            JSONArray jaDefectList = new JSONArray();
            if(defectCodes!=null){
                for(String value: defectCodes){
                    jaDefectList.put(value);
                }
            }
            //jo.put("__replace", true);
            jo.put("defectCodes", jaDefectList);
            jo.put("location", location);
            jo.put("marked", marked);
            jo.put("priority", priority);
            jo.put("timeStamp", timeStamp);
            jo.put("status", status);
            jo.put("startMp", startMp);
            jo.put("endMp", endMp);
            jo.put("fixType", fixType);
            //jo.put("__replace", true);
            jo.put("locationInfo", locationInfo);
            jo.put("tempSpeed", tempSpeed);
            jo.put("title", title);
            jo.put("typeOfAction", typeOfAction);
            jo.put("railDirection", getRailDirection());
            jo.put("ruleApplied", isRuleApplied());
            jo.put("issueType", getIssueType());
            jo.put("voiceNotes", getVoiceNotes());
            jo.put("locUnit", getLocationUnit());
            jo.put("startMarker", getStartMarker());
            jo.put("endMarker", getEndMarker());
            if(unit!=null){
                jo.put("unit", unit.getJsonObject());
            } else {
                jo.put("unit", Globals.selectedUnit.getJsonObject());
                Log.e("REPORT", "Again Null..............");
            }
            jo.put("remedialAction",this.remedialAction);
            jo.put("remedialActionItems",getRemedialActionItemsArray());
            hmBackupValues=Utilities.getHashMapJSONObject(jo);

        } catch (Exception e) {
            Log.e("REPORT CLASS:", e.toString());
        }

        return jo;

    }
    public JSONObject getJsonObjectChanged() {
        JSONObject jo = new JSONObject();
        try {
            putJSONProperty(jo, "issueId", getIssueId());
            putJSONProperty(jo,"category", category) ;
            putJSONProperty(jo,"trackId", trackId);
            putJSONProperty(jo,"description", description);
            JSONArray jaImages = new JSONArray();
            for (IssueImage img : imgList) {
                jaImages.put(img.getJsonObject());
            }
            putJSONProperty(jo,"imgList", jaImages);
            JSONArray jaVoices = new JSONArray();
            for (IssueVoice voice : voiceList) {
                jaVoices.put(voice.getJsonObject());
            }
            putJSONProperty(jo,"voiceList", jaVoices);

            JSONArray jaCheckList = new JSONArray();
            for(String value: checkList){
                jaCheckList.put(value);
            }
            putJSONProperty(jo,"tags", jaCheckList);
            JSONArray jaDefectList = new JSONArray();
            if(defectCodes!=null){
                for(String value: defectCodes){
                    jaDefectList.put(value);
                }
            }
            //jo.put("__replace", true);
            putJSONProperty(jo,"defectCodes", jaDefectList);
            putJSONProperty(jo,"location", location);
            putJSONProperty(jo,"marked", marked);
            putJSONProperty(jo,"priority", priority);
            putJSONProperty(jo,"timeStamp", timeStamp);
            putJSONProperty(jo,"status", status);
            putJSONProperty(jo,"startMp", startMp);
            putJSONProperty(jo,"endMp", endMp);
            putJSONProperty(jo,"fixType", fixType);
            //jo.put("__replace", true);
            putJSONProperty(jo,"locationInfo", locationInfo);
            putJSONProperty(jo,"tempSpeed", tempSpeed);
            putJSONProperty(jo,"title", title);
            putJSONProperty(jo,"typeOfAction", typeOfAction);
            putJSONProperty(jo,"railDirection", getRailDirection());
            putJSONProperty(jo,"ruleApplied", isRuleApplied());
            putJSONProperty(jo,"issueType", getIssueType());
            putJSONProperty(jo,"voiceNotes", getVoiceNotes());
            putJSONProperty(jo,"locUnit", getLocationUnit());
            putJSONProperty(jo, "startMarker", getStartMarker());
            putJSONProperty(jo, "endMarker", getEndMarker());
            /*if(unit!=null){
                unit.setChangeOnly(changeOnly);
                jo.put("unit", unit.getJsonObject());
            } else {
                jo.put("unit", Globals.selectedUnit.getJsonObject());
                Log.e("REPORT", "Again Null..............");
            }*/
            putJSONProperty(jo,"remedialAction",this.remedialAction);
            //putJSONProperty(jo,"remedialActionItems",getRemedialActionItemsArray());
            JSONArray jsonArray=getRemedialActionItemsArray();
            if(jsonArray.length()!=getBackupArrayLen("remedialActionItems")|| jsonArray.length()>0){
                //jo.put("*remedialActionItems", jsonArray);
                putJSONProperty(jo,"remedialActionItems",getRemedialActionItemsArray());
            }
            if(jo !=null && jo.length()!=0){
                hmBackupValues=Utilities.putHashMapJSONObject(hmBackupValues, jo);
            }
        } catch (Exception e) {
            Log.e("REPORT CLASS:", e.toString());
        }

        return jo;

    }
    private int getBackupArrayLen(String fieldName){
        Object oldValue=hmBackupValues.get(fieldName);
        return ((JSONArray)oldValue).length();
    }
    private boolean putJSONProperty(JSONObject jo, String fieldName, Object value){
        Object oldValue=null;
        oldValue=hmBackupValues.get(fieldName);

        if(oldValue instanceof JSONArray ){
            if(!oldValue.toString().equals(value.toString())){
                try {
                    if(((JSONArray) oldValue).length()>((JSONArray)value).length()){
                        jo.put("*"+fieldName,value);
                    }else {
                        jo.put(fieldName, value);
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }else if(oldValue !=null && !oldValue.equals(value)){
            try {
                jo.put(fieldName,value);
            } catch (JSONException e) {
                e.printStackTrace();
                return  false;
            }
        }
        //hmBackupValues.put(fieldName,value);
        return true;
    }

    private JSONArray getRemedialActionItemsArray(){
        JSONArray ja=new JSONArray();
        if(this.remedialActionItems!=null) {
            for (RemedialActionItem item : this.remedialActionItems) {
                ja.put(item.getJsonObject());
            }
        }
        return  ja;
    }
    public void load() {
    }

    public void save() {

        String listName = Globals.JPLAN_LIST_NAME;
        JSONObject jo = new JSONObject();
        /*private String reportId;
        private String category;
        private String trackId;
        private String description;
        private ArrayList<String> imgList;
        private String location;
        private Boolean marked;
        private String priority;
        private String timeStamp;*/
        try {
            int taskIndex = getSelectedTask().getTaskIndex();
            jo.put("title", "Zuba");

        } catch (Exception e) {

        }
        StaticListItem item = new StaticListItem(Globals.orgCode, listName
                , "5bfbf0b7cd04134090ddcb19", "", jo.toString(), "");
        DBHandler db = Globals.db;//new DBHandler(Globals.getDBContext());
        db.AddOrUpdateMsgList(listName, Globals.orgCode, item, Globals.MESSAGE_STATUS_READY_TO_POST);
        //db.close();
    }

    public Report() {
        init();
    }
    public Report(JSONObject jo){
        parseJsonObject(jo);
    }
    public Report(Context context, JSONObject jo){
        this.context=context;
        parseJsonObject(jo);
    }

    public Report(String reportId, String category, String trackId,
                  String description, ArrayList<IssueImage> imgList,
                  ArrayList<IssueVoice> voiceList,
                  String location, Boolean marked,
                  String priority, String status,
                  String fixType, String startMp,
                  String endMp, String locationInfo,
                  String tempSpeed, String title,
                  String typeOfAction, String railDirection,
                  boolean isRuleApplied, String issueType,
                  String voiceNotes, String locationUnit, String issueId, String startMarker, String endMarker) {

        this.reportId = reportId;
        this.category = category;
        this.trackId = trackId;
        this.description = description;
        this.location = location;
        this.marked = marked;
        this.priority = priority;
        this.imgList = imgList;
        this.voiceList = voiceList;
        this.status = status;
        this.fixType = fixType;
        this.startMp = startMp;
        this.endMp = endMp;
        this.locationInfo = locationInfo;
        this.tempSpeed = tempSpeed;
        this.title = title;
        this.typeOfAction = typeOfAction;
        this.railDirection = railDirection;
        setVoiceNotes(voiceNotes);
        setRuleApplied(isRuleApplied);
        setIssueType(issueType);
        setLocationUnit(locationUnit);
        setIssueId(issueId);
        setStartMarker(startMarker);
        setEndMarker(endMarker);
    }

    public String getReportId() {
        return reportId;
    }

    public void setReportId(String reportId) {
        this.reportId = reportId;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTrackId() {
        return trackId;
    }

    public void setTrackId(String trackId) {
        this.trackId = trackId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ArrayList<IssueImage> getImgList() {
        return imgList;
    }

    public ArrayList<IssueVoice> getVoiceList() {
        return voiceList;
    }

    public boolean setImgStatus(HashMap<String , Integer> items){
        Boolean blnDataChanged=false;
        for(IssueImage issueImage:imgList){
            if( items.containsKey(issueImage.getImgName())){
                if(items.get(issueImage.getImgName()) != issueImage.getStatus()){
                    issueImage.setStatus(items.get(issueImage.getImgName()));
                    blnDataChanged=true;
                }
            }
        }
        return blnDataChanged;
    }
    public boolean setVoiceStatus(HashMap<String , Integer> items){
        Boolean blnDataChanged=false;
        for(IssueVoice issueVoice:voiceList){
            if( items.containsKey(issueVoice.getVoiceName())){
                if(items.get(issueVoice.getVoiceName()) != issueVoice.getStatus()){
                    issueVoice.setStatus(items.get(issueVoice.getVoiceName()));
                    blnDataChanged=true;
                }
            }
        }
        return blnDataChanged;
    }

    public void setImgList(ArrayList<IssueImage> imgList) {
        this.imgList = imgList;
    }

    public void setVoiceList(ArrayList<IssueVoice> voiceList) {
        this.voiceList = voiceList;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Boolean getMarked() {
        return marked;
    }

    public void setMarked(Boolean marked) {
        this.marked = marked;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getTimeStamp() {
        return timeStamp;
    }
    public String getTimeStampFormatted(){
        if(!timeStamp.equals("")){
            Date dt=getUTCdatetimeFromString(timeStamp);
            return Utilities.FormatDateTime(dt,Globals.defaultDateFormat);
        }
        return  null;
    }
    public void setTimeStamp(String timeStamp) {
        this.timeStamp = timeStamp;
    }

    private void init() {
        this.reportId = "";
        this.category = "";
        this.trackId = "";
        this.description = "";
        this.location = "";
        this.marked = false;
        this.priority = "";
        this.timeStamp = "";
        this.status = "";
        this.imgList = new ArrayList<IssueImage>();
        this.voiceList = new ArrayList<IssueVoice>();
        this.fixType = "";
        this.startMp = "";
        this.endMp = "";
        this.locationInfo = "";
        this.tempSpeed = "";
        this.title = "";
        this.typeOfAction = "";
        this.railDirection = "";
        setRuleApplied(false);
        setIssueType("");
        setVoiceNotes("");
        setLocationUnit("");
        setIssueId("");
        setStartMarker("");
        setEndMarker("");

    }
    public static Date getUTCdatetimeFromString(String dateValue){
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

    public String getEndMarker() {
        return endMarker;
    }

    public void setEndMarker(String endMarker) {
        this.endMarker = endMarker;
    }

    public String getStartMarker() {
        return startMarker;
    }

    public void setStartMarker(String startMarker) {
        this.startMarker = startMarker;
    }
}