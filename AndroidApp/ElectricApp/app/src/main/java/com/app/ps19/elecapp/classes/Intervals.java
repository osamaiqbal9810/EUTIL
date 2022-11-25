package com.app.ps19.elecapp.classes;

import com.app.ps19.elecapp.Shared.IConvertHelper;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;

public class Intervals implements IConvertHelper {
    public ArrayList<Session> getSessions() {
        return sessions;
    }

    public void setSessions(ArrayList<Session> sessions) {
        this.sessions = sessions;
    }

    private  ArrayList<Session> sessions;
    private boolean changeOnly=false;
    public boolean isChangeOnly() {
        return changeOnly;
    }
    private HashMap<String, Object> hmBackupValues;

    public void setChangeOnly(boolean changeOnly) {
        this.changeOnly = changeOnly;
    }



    public Intervals(JSONArray jsonArray){
        try{
            JSONObject jo=new JSONObject();
            jo.put("intervals",jsonArray);
            parseJsonObject(jo);

        }catch (Exception e){
            e.printStackTrace();
        }
    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        try{
            JSONArray ja=jsonObject.getJSONArray("intervals");
            ArrayList<Session> _sessions=new ArrayList<>();
            for(int i=0;i<ja.length();i++){
                JSONObject jo=ja.getJSONObject(i);
                _sessions.add(new Session(this,jo));
            }
            setSessions(_sessions);


        }catch (Exception e){
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public JSONObject getJsonObject() {
        if(changeOnly){
            return getJsonObjectChanged();
        }
        JSONObject jo=new JSONObject();
        try {
            if (this.sessions != null && this.sessions.size() > 0) {
                JSONArray ja = new JSONArray();
                for (Session session : this.sessions) {
                    session.setChangeOnly(changeOnly);
                    JSONObject jsonObject = session.getJsonObject();
                    ja.put(jsonObject);
                }
                jo.put("intervals", ja);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return jo;
    }
    private JSONObject getJsonObjectChanged(){
        JSONObject jo=new JSONObject();
        try {
            if (sessions != null && sessions.size() > 0) {
                JSONArray ja = new JSONArray();
                boolean isDataExists=false;
                for (Session session : sessions) {
                    session.setChangeOnly(changeOnly);
                    JSONObject jsonObject = session.getJsonObject();
                    ja.put(jsonObject);
                    if(jsonObject.length()!=0){
                        isDataExists=true;
                    }
                }
                if(isDataExists){
                    jo.put("intervals", ja);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return jo;
    }
    private boolean putJSONProperty(JSONObject jo, String fieldName, Object value){
        Object oldValue=null;
        oldValue=hmBackupValues.get(fieldName);
        if(oldValue !=null && !oldValue.equals(value)){
            try {
                jo.put(fieldName,value);
            } catch (JSONException e) {
                e.printStackTrace();
                return  false;
            }
        }
        return true;
    }

}
