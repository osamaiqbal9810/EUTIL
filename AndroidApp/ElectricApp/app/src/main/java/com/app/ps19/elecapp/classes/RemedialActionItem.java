package com.app.ps19.elecapp.classes;

import com.app.ps19.elecapp.Shared.IConvertHelper;

import org.json.JSONObject;

public class RemedialActionItem implements IConvertHelper {
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
    public void setDescription(String description){
        this.description=description;
    }
    public String getDescription(){return  this.description;}

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    private String id;
    private String value;
    private String description;
    private String type;

    RemedialActionItem(){

    }
    public RemedialActionItem(String id, String value, String description,String type){
        this.id=id;
        this.value=value;
        this.description=description;
        this.type=type;
    }

    public RemedialActionItem(String id, String value){
        this.id=id;
        this.value=value;
    }
    public RemedialActionItem(JSONObject jsonObject){
        parseJsonObject(jsonObject);
    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        try {
            this.id=jsonObject.getString("id");
            this.value=jsonObject.getString("value");
            this.description=jsonObject.optString("desc");
            this.type=jsonObject.optString("type");
        }catch (Exception e){
            return false;
        }
        return true;
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jo=new JSONObject();
        try {
            jo.put("id", this.id);
            jo.put("value",this.value);
            if(this.description !=null) {
                jo.put("desc", this.description);
            }
            if(this.type !=null){
                jo.put("type", this.type);
            }
        }catch (Exception e){
            return null;
        }
        return jo;
    }
}
