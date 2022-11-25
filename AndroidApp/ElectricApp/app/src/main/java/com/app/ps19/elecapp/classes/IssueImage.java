package com.app.ps19.elecapp.classes;

import com.app.ps19.elecapp.Shared.Globals;
import com.app.ps19.elecapp.Shared.IConvertHelper;
import com.app.ps19.elecapp.Shared.Utilities;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;

public class IssueImage implements IConvertHelper {
    private String imgName;
    private int status=Globals.ISSUE_IMAGE_STATUS_CREATED;
    private String tag;

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public String getImgName() {
        return imgName;
    }

    public void setImgName(String imgName) {
        this.imgName = imgName;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    private HashMap<String, Object> hmBackupValues;
    private boolean changeOnly=false;
    public boolean isChangeOnly() {
        return changeOnly;
    }
    public void setChangeOnly(boolean changeOnly) {
        this.changeOnly = changeOnly;
    }

    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {

        try {
            hmBackupValues= Utilities.getHashMapJSONObject(jsonObject);
            setImgName(jsonObject.optString("imgName"));
            setStatus(jsonObject.optInt("status", 0));
            setTag(jsonObject.optString("tag"));
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jo = new JSONObject();
        if(changeOnly){
            jo=getJsonObjectChanged();
            return  jo;
        }

        if (imgName != null && !imgName.equals("")) {
            try {
                jo.put("imgName", imgName);
                jo.put("status", status);
                jo.put("tag", tag);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        } else {
            return null;
        }

        return jo;
    }
    public JSONObject getJsonObjectChanged() {
        JSONObject jo = new JSONObject();
        if (imgName != null && !imgName.equals("")) {
            try {
                putJSONProperty(jo,"imgName", imgName);
                putJSONProperty(jo,"status", status);
                putJSONProperty(jo,"tag", tag);
                if(jo !=null && jo.length()!=0){
                    hmBackupValues=Utilities.putHashMapJSONObject(hmBackupValues, jo);
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            return null;
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
        if(value1 instanceof JSONArray){
            if(oldValue !=null && !oldValue.toString().equals(((JSONArray) value1).toString())){
                try {
                    if(((JSONArray) oldValue).length()>((JSONArray) value1).length()){
                        jo.put("*"+fieldName, value);
                    }else {
                        jo.put(fieldName, value);
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                    return  false;
                }
            }
        }else if(oldValue !=null && !oldValue.equals(value1)){
            try {
                jo.put(fieldName,value);
            } catch (JSONException e) {
                e.printStackTrace();
                return  false;
            }
        }
        return true;
    }

    public IssueImage(JSONObject jo) {
        parseJsonObject(jo);
    }

    public IssueImage(String name, int status, String tag) {
        setImgName(name);
        setStatus(status);
        setTag(tag);
    }

    public IssueImage() {
    }

    ;
}
