package com.app.ps19.scimapp.classes;

import com.app.ps19.scimapp.Shared.IConvertHelper;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class Form implements IConvertHelper {
    private String name="";
    private List<FormRow> rows;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<FormRow> getRows() {
        return rows;
    }

    public void setRows(List<FormRow> rows) {
        this.rows = rows;
    }

    public Form(JSONObject jo){
        parseJsonObject(jo);

    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        try{
            setName(jsonObject.optString("name",""));
            JSONArray ja=jsonObject.optJSONArray("rows");
            this.rows=new ArrayList<>();
            if(ja !=null){
                for(int i=0;i<ja.length();i++){
                    this.rows.add(new FormRow(ja.getJSONObject(i)));
                }
            }

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
/*    public enum FieldTypes{
        booleanCheckbox,
        booleanSwitch,
        text ,
        editBox,
        editBoxNumber,
        lookup
    }*/



}
