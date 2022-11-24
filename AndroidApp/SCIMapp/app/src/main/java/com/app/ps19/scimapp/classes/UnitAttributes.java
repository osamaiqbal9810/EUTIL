package com.app.ps19.scimapp.classes;

import android.content.Context;
import android.util.Log;

import com.app.ps19.scimapp.Shared.IConvertHelper;
import com.app.ps19.scimapp.Shared.Utilities;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;

import static android.content.ContentValues.TAG;

public class UnitAttributes  implements IConvertHelper  {
    private boolean isPrimary;
    private String trackOrientation;
    ArrayList<String> directionList;
    private boolean showDirection;
    private HashMap<String, Object> hmBackupValues;
    private boolean changeOnly=false;
    public boolean isChangeOnly() {
        return changeOnly;
    }
    public void setChangeOnly(boolean changeOnly) {
        this.changeOnly = changeOnly;
    }

    public boolean isShowDirection() {
        return showDirection;
    }

    public void setShowDirection(boolean showDirection) {
        this.showDirection = showDirection;
    }

    public ArrayList<String> getDirectionList() {
        return directionList;
    }

    public void setDirectionList(ArrayList<String> directionList) {
        this.directionList = directionList;
    }

    public String getTrackOrientation() {
        return trackOrientation;
    }

    public void setTrackOrientation(String trackOrientation) {
        this.trackOrientation = trackOrientation;
    }

    public boolean isPrimary() {
        return isPrimary;
    }

    public void setPrimary(boolean primary) {
        isPrimary = primary;
    }
    public boolean getPrimary(){return isPrimary;}
    public UnitAttributes(JSONObject jo){
        parseJsonObject(jo);
    }
    public UnitAttributes(){
        setPrimary(false);
        hmBackupValues=new HashMap<>();
    }


    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        hmBackupValues= Utilities.getHashMapJSONObject(jsonObject);
        setPrimary(jsonObject.optBoolean("primaryTrack", false));
        setTrackOrientation(jsonObject.optString("trackOrientation", ""));
        setShowDirection(jsonObject.optBoolean("showDirection", false));
        ArrayList<String> _directions = new ArrayList<>();
        if(jsonObject.has("railOptions")){
            JSONArray jaDirection = jsonObject.optJSONArray("railOptions");
            if(jaDirection != null){
                try {
                    for (int i = 0; i < jaDirection.length(); i++){
                        _directions.add(jaDirection.optString(i));
                    }
                } catch (Exception ex){
                    Log.e(TAG,ex.toString());
                }
            }
        }
        setDirectionList(_directions);

        return false;
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jo=new JSONObject();
        if(changeOnly){
            jo=getJsonObjectChanged();
            return jo;
        }
        JSONArray jaDirections = new JSONArray();
        try {
            jo.put("primaryTrack",isPrimary());
            jo.put("trackOrientation", getTrackOrientation());
            jo.put("showDirection", isShowDirection());

            if(getDirectionList()!=null){
                for(String value: getDirectionList()){
                    jaDirections.put(value);
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        try {
            jo.put("railOptions", jaDirections);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jo;
    }
    public JSONObject getJsonObjectChanged() {
        JSONObject jo=new JSONObject();
        JSONArray jaDirections = new JSONArray();
        try {
            putJSONProperty(jo,"primaryTrack",isPrimary());
            putJSONProperty(jo,"trackOrientation", getTrackOrientation());
            putJSONProperty(jo,"showDirection", isShowDirection());

            if(getDirectionList()!=null){
                for(String value: getDirectionList()){
                    jaDirections.put(value);
                }
            }
            putJSONProperty(jo,"railOptions", jaDirections);
            if(jo !=null && jo.length()!=0){
                hmBackupValues=Utilities.putHashMapJSONObject(hmBackupValues, jo);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return jo;
    }

    private boolean putJSONProperty(JSONObject jo, String fieldName, Object value){
        Object oldValue=null;
        oldValue=hmBackupValues.get(fieldName);
        if(oldValue==null || (oldValue !=null && !oldValue.equals(value))){
            try {
                jo.put(fieldName,value);
            } catch (JSONException e) {
                e.printStackTrace();
                return  false;
            }
        }
        return true;
    }
    public UnitAttributes makeClone(){
        UnitAttributes ua=new UnitAttributes();
        ua.setPrimary(getPrimary());
        ua.setTrackOrientation(getTrackOrientation());
        ua.setShowDirection(isShowDirection());
        ua.setDirectionList(getDirectionList());
        return ua;
    }
}
