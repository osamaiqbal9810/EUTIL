package com.app.ps19.tipsapp.classes.dynforms;

import com.app.ps19.tipsapp.Shared.IConvertHelper;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Iterator;

public class DynControlLookup implements IConvertHelper,Cloneable {
    private String col;
    private String row;
    private HashMap<String, HashMap<String,String>> source;

    public String getCol() {
        return col;
    }

    public void setCol(String col) {
        this.col = col;
    }

    public String getRow() {
        return row;
    }

    public void setRow(String row) {
        this.row = row;
    }

    public HashMap<String, HashMap<String, String>> getSource() {
        return source;
    }

    public void setSource(HashMap<String, HashMap<String, String>> source) {
        this.source = source;
    }

    public DynControlLookup(){

    }
    public DynControlLookup(JSONObject obj) {
        parseJsonObject(obj);
    }
    public String getLookupValue(String _col, String _row){
        if(source!= null){
            HashMap<String, String> rows=getSource().get(_col);
            if(rows!= null){
                return rows.get(_row);
            }
        }
        return null;
    }
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        HashMap<String, HashMap<String,String>> _source = new HashMap<>();
        JSONArray jaSource = jsonObject.optJSONArray("source");
        if (jaSource != null) {
            for (int i = 0; i < jaSource.length(); i++) {
                JSONObject jo = jaSource.optJSONObject(i);
                if (jo!= null) {
                    String key="";
                    HashMap<String, String> tableValues=new HashMap<>();
                    for (Iterator<String> it = jo.keys(); it.hasNext(); ) {
                        String _key = it.next();
                        String value = jo.optString(_key);
                        if (key.equals("")) {
                            key=value;
                        }else{
                            tableValues.put(_key, value);
                        }
                    }
                    _source.put(key, tableValues);
                }
            }
            setSource(_source);
        }
        setCol(jsonObject.optString("col"));
        setRow(jsonObject.optString("row"));
        return false;
    }

    @Override
    public JSONObject getJsonObject() {
        return null;
    }
}
