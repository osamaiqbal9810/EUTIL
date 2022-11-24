package com.app.ps19.hosapp.classes;

import com.app.ps19.hosapp.Shared.IConvertHelper;

import org.json.JSONArray;
import org.json.JSONObject;
public class User implements IConvertHelper {
    private String id ="";
    private String name="";
    private String email="";
    private Boolean isLogging;
    private Boolean isRemoved;
    private Boolean isAdmin;
    private Boolean active;

    public Boolean getRemoved() {
        return isRemoved;
    }

    public void setRemoved(Boolean removed) {
        isRemoved = removed;
    }

    public Boolean getAdmin() {
        return isAdmin;
    }

    public void setAdmin(Boolean admin) {
        isAdmin = admin;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Boolean getLogging() {
        return isLogging;
    }

    public void setLogging(Boolean logging) {
        isLogging = logging;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public User(JSONObject jsonObject){
        parseJsonObject(jsonObject);
    }
    public User(){

    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        try {

            setId(jsonObject.optString("id"));
            setName(jsonObject.optString("name",""));
            setEmail(jsonObject.optString("email",""));
            setActive(jsonObject.optBoolean("active", true));
            setRemoved(jsonObject.optBoolean("isRemoved",false));
            setAdmin(jsonObject.optBoolean("isAdmin", false));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return true;
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jo =new JSONObject();
        JSONArray jaTasks=new JSONArray();
        try {
            jo.put("id",getId());
            jo.put("name",getName());
            jo.put("email",getEmail());
            jo.put("isRemoved", getRemoved());
            jo.put("isAdmin", getAdmin());
            jo.put("active", getActive());
        }catch (Exception e){
            e.printStackTrace();
        }
        return jo;
    }

}
