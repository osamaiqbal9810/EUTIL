package com.app.ps19.scimapp.classes.maintenance;

import android.content.Context;
import android.util.Log;

import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.Shared.IConvertHelper;
import com.app.ps19.scimapp.Shared.Utilities;
import com.app.ps19.scimapp.classes.IssueImage;
import com.app.ps19.scimapp.classes.IssueVoice;

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

public class MaintenanceExecution implements IConvertHelper {
    static final String DATEFORMAT = "yyyy-MM-dd HH:mm:ss";
    private ArrayList<IssueImage> imgList;
    private ArrayList<IssueVoice> voiceList;
    private String location;
    private String timeStamp;
    private String status;
    private Context context;
    private String startMp;
    private String endMp;
    private String guId;
    private String id;

    public void setId(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    private HashMap<String, Object> hmBackupValues;
    private boolean changeOnly=false;
    public boolean isChangeOnly() {
        return changeOnly;
    }

    public void setChangeOnly(boolean changeOnly) {
        this.changeOnly = changeOnly;
    }
      private String voiceNotes;
    public String getVoiceNotes() {
        return voiceNotes;
    }
    public void setVoiceNotes(String voiceNotes) {
        this.voiceNotes = voiceNotes;
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
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public String getGuId() {
        return guId;
    }

    public void setGuId(String guId) {
        this.guId = guId;
    }

    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        hmBackupValues= Utilities.getHashMapJSONObject(jsonObject);
        this.id=jsonObject.optString("_id","");
        this.guId=jsonObject.optString("guid","");
        this.location=jsonObject.optString("location","");
        this.timeStamp=jsonObject.optString("timeStamp","");
        this.status = jsonObject.optString("status", "");
        this.startMp = jsonObject.optString("startMp", "");
        this.endMp = jsonObject.optString("endMp","");
        setVoiceNotes(jsonObject.optString("voiceNotes", ""));

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

            //jo.put("__replace", true);
            jo.put("_id",id);
            jo.put("guid",getGuId());
            jo.put("location", location);
            jo.put("timeStamp", timeStamp);
            jo.put("status", status);
            jo.put("startMp", startMp);
            jo.put("endMp", endMp);
            jo.put("voiceNotes", getVoiceNotes());
            hmBackupValues=Utilities.getHashMapJSONObject(jo);

        } catch (Exception e) {
            Log.e("REPORT CLASS:", e.toString());
        }

        return jo;

    }
    public JSONObject getJsonObjectChanged() {
        JSONObject jo = new JSONObject();
        try {
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

            //jo.put("__replace", true);
            putJSONProperty(jo,"_id",getId());
            putJSONProperty(jo,"guid",getGuId());
            putJSONProperty(jo,"location", location);
            putJSONProperty(jo,"timeStamp", timeStamp);
            putJSONProperty(jo,"status", status);
            putJSONProperty(jo,"startMp", startMp);
            putJSONProperty(jo,"endMp", endMp);
            putJSONProperty(jo,"voiceNotes", getVoiceNotes());
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


    public MaintenanceExecution() {
        init();
    }
    public MaintenanceExecution(JSONObject jo){
        parseJsonObject(jo);
    }
    public MaintenanceExecution(Context context, JSONObject jo){
        this.context=context;
        parseJsonObject(jo);
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
        this.location = "";
        this.timeStamp = "";
        this.status = "";
        this.imgList = new ArrayList<IssueImage>();
        this.voiceList = new ArrayList<IssueVoice>();
        this.startMp = "";
        this.endMp = "";
        setVoiceNotes("");

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
