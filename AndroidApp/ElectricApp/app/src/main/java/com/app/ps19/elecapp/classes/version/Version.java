package com.app.ps19.elecapp.classes.version;

import com.app.ps19.elecapp.Shared.IConvertHelper;
import com.app.ps19.elecapp.Shared.Utilities;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;

public class Version implements IConvertHelper {
    private String customer ="";
    private String applicationType="";
    private String mobileAppVer="";
    private String webVersion;
    private String migration;
    private String database;

    public String getCustomer() {
        return customer;
    }

    public void setCustomer(String customer) {
        this.customer = customer;
    }

    public String getApplicationType() {
        return applicationType;
    }

    public void setApplicationType(String applicationType) {
        this.applicationType = applicationType;
    }

    public String getMobileAppVer() {
        return mobileAppVer;
    }

    public void setMobileAppVer(String mobileAppVer) {
        this.mobileAppVer = mobileAppVer;
    }

    public String getWebVersion() {
        return webVersion;
    }

    public void setWebVersion(String webVersion) {
        this.webVersion = webVersion;
    }

    public String getMigration() {
        return migration;
    }

    public void setMigration(String migration) {
        this.migration = migration;
    }

    public String getDatabase() {
        return database;
    }

    public void setDatabase(String database) {
        this.database = database;
    }
    private boolean changeOnly=false;
    private HashMap<String, Object> hmBackupValues;

    public Version(JSONObject jsonObject){
        parseJsonObject(jsonObject);
    }
    public Version(){

    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        try {
            hmBackupValues= Utilities.getHashMapJSONObject(jsonObject);

            setCustomer(jsonObject.optString("customer",""));
            setApplicationType(jsonObject.optString("applicationType",""));
            setMobileAppVer(jsonObject.optString("compatibleMobileApps",""));
            setWebVersion(jsonObject.optString("webVersion", ""));
            setMigration(jsonObject.optString("migration",""));
            setDatabase(jsonObject.optString("database", ""));
            hmBackupValues.put("customer",getCustomer());

        } catch (Exception e) {
            e.printStackTrace();
        }
        return true;
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jo =new JSONObject();
        if(changeOnly){
            jo=getJsonObjectChanged();
            if(jo.length()==0){
                return null;
            }else
            {
                return jo;
            }
        }
        try {
            jo.put("customer",getCustomer());
            jo.put("applicationType",getApplicationType());
            jo.put("compatibleMobileApps",getMobileAppVer());
            jo.put("webVersion", getWebVersion());
            jo.put("migration", getMigration());
            jo.put("database", getDatabase());

        }catch (Exception e){
            e.printStackTrace();
        }
        return jo;
    }
    private JSONObject getJsonObjectChanged(){
        JSONObject jo=new JSONObject();
        try {
            putJSONProperty(jo,"customer",getCustomer());
            putJSONProperty(jo,"applicationType",getApplicationType());
            putJSONProperty(jo,"compatibleMobileApps",getMobileAppVer());
            putJSONProperty(jo,"webVersion", getWebVersion());
            putJSONProperty(jo,"migration", getMigration());
            putJSONProperty(jo,"database", getDatabase());

        } catch (Exception e) {
            e.printStackTrace();
        }
        return jo;
    }
    private boolean putJSONProperty(JSONObject jo, String fieldName, Object value){
        Object oldValue=null;
        oldValue=hmBackupValues.get(fieldName);
        if(oldValue ==null || (oldValue !=null && !oldValue.equals(value))){
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
