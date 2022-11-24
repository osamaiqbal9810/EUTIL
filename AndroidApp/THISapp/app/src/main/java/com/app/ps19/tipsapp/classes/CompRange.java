package com.app.ps19.tipsapp.classes;

import com.app.ps19.tipsapp.Shared.IConvertHelper;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class CompRange implements IConvertHelper {
    public CompRange() {

    }
    private String inspectionName;
    private String inspectionId;
    private User user;
    private ArrayList<Session> sessions;

    public void setInspectionId(String inspectionId) {
        this.inspectionId = inspectionId;
    }

    public String getInspectionId() {
        return inspectionId;
    }

    public void setInspectionName(String inspectionName) {
        this.inspectionName = inspectionName;
    }

    public String getInspectionName() {
        return inspectionName;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public CompRange(JSONObject jo){
        parseJsonObject(jo);
    }

    public void setSessions(ArrayList<Session> sessions) {
        this.sessions = sessions;
    }

    public ArrayList<Session> getSessions() {
        return sessions;
    }

    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        setInspectionId(jsonObject.optString("inspectionId",""));
        setInspectionName(jsonObject.optString("inspectionName",""));
        JSONObject joUser=jsonObject.optJSONObject("user");
        if(joUser!=null){
            setUser(new User(joUser));
        }
        JSONArray jaSessions=jsonObject.optJSONArray("intervals");
        if(jaSessions!=null){
            ArrayList<Session> _sessions=new ArrayList<>();
            for(int i=0;i<jaSessions.length();i++){
                try {
                    _sessions.add(new Session(this,jaSessions.getJSONObject(i)));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
            setSessions(_sessions);

        }
        return true;
    }

    @Override
    public JSONObject getJsonObject() {
        return null;
    }
}
