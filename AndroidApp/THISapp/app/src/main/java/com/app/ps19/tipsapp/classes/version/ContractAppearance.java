package com.app.ps19.tipsapp.classes.version;

import com.app.ps19.tipsapp.Shared.IConvertHelper;
import com.app.ps19.tipsapp.Shared.Utilities;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;

public class ContractAppearance implements IConvertHelper {
    private String displayName ="";
    private String logo1="";
    private String logo2="";

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getLogo1() {
        return logo1;
    }

    public void setLogo1(String logo1) {
        this.logo1 = logo1;
    }

    public String getLogo2() {
        return logo2;
    }

    public void setLogo2(String logo2) {
        this.logo2 = logo2;
    }


    private boolean changeOnly=false;
    private HashMap<String, Object> hmBackupValues;

    public ContractAppearance(JSONObject jsonObject){
        parseJsonObject(jsonObject);
    }
    public ContractAppearance(){

    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        try {
            hmBackupValues= Utilities.getHashMapJSONObject(jsonObject);

            setDisplayName(jsonObject.optString("displayName",""));
            setLogo1(jsonObject.optString("logo1",""));
            setLogo2(jsonObject.optString("logo2",""));
            hmBackupValues.put("displayName",getDisplayName());
            hmBackupValues.put("logo1",getLogo1());
            hmBackupValues.put("logo2",getLogo2());

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
            jo.put("displayName",getDisplayName());
            jo.put("logo1",getLogo1());
            jo.put("logo2",getLogo2());

        }catch (Exception e){
            e.printStackTrace();
        }
        return jo;
    }
    private JSONObject getJsonObjectChanged(){
        JSONObject jo=new JSONObject();
        try {
            putJSONProperty(jo,"displayName",getDisplayName());
            putJSONProperty(jo,"logo1",getLogo1());
            putJSONProperty(jo,"logo2",getLogo2());

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
