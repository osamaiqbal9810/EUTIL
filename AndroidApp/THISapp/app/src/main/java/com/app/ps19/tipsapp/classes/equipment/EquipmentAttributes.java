package com.app.ps19.tipsapp.classes.equipment;

import com.app.ps19.tipsapp.Shared.IConvertHelper;

import org.json.JSONException;
import org.json.JSONObject;

public class EquipmentAttributes implements IConvertHelper {
    private Equipment parent;
    private String key ;
    private String value;
    private String url;
    private String urlRelative;

    public String getUrlRelative() {
        return urlRelative;
    }

    public void setUrlRelative(String urlRelative) {
        this.urlRelative = urlRelative;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Equipment getParent() {
        return parent;
    }

    public void setParent(Equipment parent) {
        this.parent = parent;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public EquipmentAttributes(Equipment parent, JSONObject jo){
        this.parent=parent;
        parseJsonObject(jo);
    }

    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        setKey(jsonObject.optString("key"));
        setValue(jsonObject.optString("value"));
        setUrl(jsonObject.optString("url",""));
        setUrlRelative(jsonObject.optString("url-rel",""));
        return false;
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jsonObject=new JSONObject();
        try {
            jsonObject.put("key",getKey());
            jsonObject.put("value",getValue());
            jsonObject.put("url", getUrl());
            jsonObject.put("url-rel", getUrlRelative());

        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jsonObject;
    }
}
