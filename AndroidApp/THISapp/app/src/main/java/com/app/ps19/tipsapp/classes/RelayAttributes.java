package com.app.ps19.tipsapp.classes;

import com.app.ps19.tipsapp.Shared.IConvertHelper;

import org.json.JSONObject;

public class RelayAttributes implements IConvertHelper {
    public String getColumn() {
        return column;
    }

    public void setColumn(String column) {
        this.column = column;
    }

    public String getRow() {
        return row;
    }

    public void setRow(String row) {
        this.row = row;
    }

    public String getRack() {
        return rack;
    }

    public void setRack(String rack) {
        this.rack = rack;
    }

    private String column;
    private String row;
    private  String rack;
    public RelayAttributes(JSONObject jo){
        parseJsonObject(jo);
    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        setColumn(jsonObject.optString("column",""));
        setRow(jsonObject.optString("row",""));
        setRack(jsonObject.optString("rack",""));
        return false;
    }

    @Override
    public JSONObject getJsonObject() {
        return null;
    }
}
