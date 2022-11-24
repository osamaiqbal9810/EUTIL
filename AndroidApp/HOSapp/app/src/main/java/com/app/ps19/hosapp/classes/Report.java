package com.app.ps19.hosapp.classes;

import android.content.Context;
import android.util.Log;

import com.app.ps19.hosapp.Shared.DBHandler;
import com.app.ps19.hosapp.Shared.Globals;
import com.app.ps19.hosapp.Shared.IConvertHelper;
import com.app.ps19.hosapp.Shared.StaticListItem;
import com.app.ps19.hosapp.Shared.Utilities;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.TimeZone;

import static android.content.ContentValues.TAG;

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
        try {
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
 //           jo.put("__replace", true);
            if(unit!=null){
                jo.put("unit", unit.getJsonObject());
            } else {
                jo.put("unit", Globals.selectedUnit.getJsonObject());
                Log.e("REPORT", "Again Null..............");
            }
        } catch (Exception e) {
            Log.e("REPORT CLASS:", e.toString());
        }

        return jo;

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
            int taskIndex = Globals.selectedTask.getTaskIndex();
            jo.put("title", "Zuba");

        } catch (Exception e) {

        }
        StaticListItem item = new StaticListItem(Globals.orgCode, listName
                , "5bfbf0b7cd04134090ddcb19", "", jo.toString(), "");
        DBHandler db = new DBHandler(Globals.mainActivity);
        db.AddOrUpdateMsgList(listName, Globals.orgCode, item, Globals.MESSAGE_STATUS_READY_TO_POST);
        db.close();
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
                  String priority, String status, String fixType, String startMp, String endMp) {
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


}
