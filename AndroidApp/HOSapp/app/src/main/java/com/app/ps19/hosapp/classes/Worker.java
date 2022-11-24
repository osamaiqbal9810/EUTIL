package com.app.ps19.hosapp.classes;

import com.app.ps19.hosapp.Shared.IConvertHelper;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;

public class Worker implements IConvertHelper {
    private String uid;
    private String acctNumber;
    private String name;
    private IssueImage signature;

    public String getAcctNumber() {
        return acctNumber;
    }

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