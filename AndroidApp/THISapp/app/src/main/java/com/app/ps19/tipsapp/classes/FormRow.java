package com.app.ps19.tipsapp.classes;

import com.app.ps19.tipsapp.Shared.IConvertHelper;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class FormRow implements IConvertHelper {
    private FormField field;
    private List<FormField> cols;

    public FormField getField() {
        return field;
    }

    public void setField(FormField field) {
        this.field = field;
    }

    public void setCols(List<FormField> cols) {
        this.cols = cols;
    }

    public List<FormField> getCols() {
        return cols;
    }

    public FormRow(JSONObject jo){
        parseJsonObject(jo);
    }

    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        try{
            JSONObject jo=jsonObject.optJSONObject("field");
            setField(null);
            if(jo !=null && !jo.optString("name","").equals("")){
                setField(new FormField(jo));
            }
            JSONArray ja=jsonObject.optJSONArray("cols");
            setCols(null);
            if(ja !=null && ja.length()>0){
                this.cols=new ArrayList<>();
                for(int i=0;i<ja.length();i++){
                    this.cols.add(new FormField(ja.getJSONObject(i)));
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
}