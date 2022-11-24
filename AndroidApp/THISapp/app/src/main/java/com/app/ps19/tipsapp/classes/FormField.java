package com.app.ps19.tipsapp.classes;

import com.app.ps19.tipsapp.Shared.IConvertHelper;

import org.json.JSONObject;

import java.util.List;

public class  FormField implements IConvertHelper {
    private String name="";
    private String description="";
    private String id="";
    private String tag="";
    private String type;
    private String minChars;
    private String maxChars;
    private String layout_weight;
    private String layout_gravity;
    private String defaultValue;
    private List<String> validList;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLayout_weight() {
        return layout_weight;
    }

    public void setLayout_weight(String layout_weight) {
        this.layout_weight = layout_weight;
    }

    public String getLayout_gravity() {
        return layout_gravity;
    }

    public void setLayout_gravity(String layout_gravity) {
        this.layout_gravity = layout_gravity;
    }

    public List<String> getValidList() {
        return validList;
    }

    public void setValidList(List<String> validList) {
        this.validList = validList;
    }


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMinChars() {
        return minChars;
    }

    public void setMinChars(String minChars) {
        this.minChars = minChars;
    }

    public String getMaxChars() {
        return maxChars;
    }

    public void setMaxChars(String maxChars) {
        this.maxChars = maxChars;
    }

    public String getDefaultValue() {
        return defaultValue;
    }

    public void setDefaultValue(String defaultValue) {
        this.defaultValue = defaultValue;
    }


    public FormField(JSONObject jo){
        parseJsonObject(jo);
    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        try{
            setName(jsonObject.optString("name",""));
            setId(jsonObject.optString("id",""));
            setTag(jsonObject.optString("tag",""));
            setType(jsonObject.optString("type",""));
            setDescription(jsonObject.optString("description",""));
            setLayout_gravity(jsonObject.optString("layout_gravity",""));
            setLayout_weight(jsonObject.optString("layout_weight",""));
            setMinChars(jsonObject.optString("minChar",""));
            setMaxChars(jsonObject.optString("maxChar",""));


        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }

    @Override
    public JSONObject getJsonObject() {
        return null;
    }
}
