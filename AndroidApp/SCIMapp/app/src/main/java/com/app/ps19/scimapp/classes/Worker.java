package com.app.ps19.scimapp.classes;

import com.app.ps19.scimapp.Shared.IConvertHelper;
import com.app.ps19.scimapp.Shared.Utilities;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;

public class Worker implements IConvertHelper {
    private String uid;
    private String acctNumber;
    private String name;
    private IssueImage signature;

    private HashMap<String, Object> hmBackupValues;//=new HashMap<>();
    private boolean changeOnly=false;
    public boolean isChangeOnly() {
        return changeOnly;
    }
    public void setChangeOnly(boolean changeOnly) {
        this.changeOnly = changeOnly;
    }

    public String getAcctNumber() {
        return acctNumber;
    }
    public HashMap<String, Object> getHmBackupValues(){return  hmBackupValues;}
    public void setHmBackupValues(HashMap<String, Object> values){hmBackupValues=values;}
    public void setAcctNumber(String acctNumber) {
        this.acctNumber = acctNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public IssueImage getSignature() {
        return signature;
    }

    public void setSignature(IssueImage signature) {
        this.signature = signature;
    }

    public boolean isByPhone() {
        return byPhone;
    }

    public void setByPhone(boolean byPhone) {
        this.byPhone = byPhone;
    }

    private boolean byPhone;
    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public Worker(JSONObject jo){
        parseJsonObject(jo);
    }
    public Worker(){}
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        try{
            hmBackupValues= Utilities.getHashMapJSONObject(jsonObject);
            this.uid = jsonObject.optString("uid", "");
            this.acctNumber=jsonObject.optString("acctNumber","");
            this.name=jsonObject.optString("name","");
            this.signature =null;
            if(jsonObject.optJSONObject("signature")!=null) {
                this.signature = new IssueImage(jsonObject.optJSONObject("signature"));
            }
            this.byPhone=jsonObject.optBoolean("byPhone",false);
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jo =new JSONObject();
        if(changeOnly){
            jo=getJsonObjectChanged();
            return  jo;
        }

        try {
            jo.put("uid", getUid());
            jo.put("acctNumber",getAcctNumber());
            jo.put("name",getName());
            IssueImage objSignature=getSignature();
            if(objSignature !=null) {

                jo.put("signature", objSignature.getJsonObject());
            }
            jo.put("byPhone",isByPhone());
        } catch (JSONException e) {
            e.printStackTrace();
            return  null;
        }
        return jo;
    }
    public JSONObject getJsonObjectChanged() {
        JSONObject jo =new JSONObject();
        try {
            putJSONProperty(jo,"uid", getUid());
            putJSONProperty(jo,"acctNumber",getAcctNumber());
            putJSONProperty(jo,"name",getName());
            IssueImage objSignature=getSignature();
            if(objSignature !=null) {
                putJSONProperty(jo,"signature", objSignature.getJsonObject());
            }
            putJSONProperty(jo,"byPhone",isByPhone());
            if(jo !=null && jo.length()!=0){
                hmBackupValues=Utilities.putHashMapJSONObject(hmBackupValues, jo);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return  null;
        }
        return jo;
    }
    private boolean putJSONProperty(JSONObject jo, String fieldName, Object value){
        Object oldValue=null;
        Object value1=null;
        if(hmBackupValues==null){
            try {
                jo.put(fieldName, value);
            } catch (JSONException e) {
                e.printStackTrace();
                return  false;
            }
            return true;
        }
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

    public boolean setImgStatus(HashMap<String, Integer> items) {
        Boolean blnDataChanged = false;
        if (signature != null) {
            if (items.containsKey(signature.getImgName())) {
                if (items.get(signature.getImgName()) != signature.getStatus()) {
                    signature.setStatus(items.get(signature.getImgName()));
                    blnDataChanged = true;
                }
            }
        }

        return blnDataChanged;
    }

}