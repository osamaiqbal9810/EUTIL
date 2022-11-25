package com.app.ps19.elecapp.classes.dynforms.defaultvalues;

import com.app.ps19.elecapp.Shared.IConvertHelper;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;

public class DynFormDv implements IConvertHelper {
    private String id="";
    private ArrayList<DynFromControlDv> controlList;
    private HashMap<String, String> controlValues;

    public void setControlValues(HashMap<String, String> controlValues) {
        this.controlValues = controlValues;
    }

    public HashMap<String, String> getControlValues() {
        return controlValues;
    }

    public String getValueById(String id){
        if(controlValues !=null){
            return controlValues.get(id);
        }
        if(controlList!=null){
            for(DynFromControlDv dv:controlList){
                if(dv.getId().equals(id)){
                    return dv.getValue();
                }
            }
        }
        return null;
    }
    public void setControlList(ArrayList<DynFromControlDv> controlList) {
        this.controlList = controlList;
    }

    public ArrayList<DynFromControlDv> getControlList() {
        return controlList;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public DynFormDv(){

    }
    public DynFormDv(JSONObject jo){
        parseJsonObject(jo);
    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        setId(jsonObject.optString("id",""));
        JSONArray jaControls=jsonObject.optJSONArray("form");
        if(jaControls!=null){
            ArrayList<DynFromControlDv> _controlDvs=new ArrayList<>();
            HashMap<String , String > _controlValues=new HashMap<>();
            for(int i=0;i<jaControls.length();i++){
                DynFromControlDv _control=new DynFromControlDv(jaControls.optJSONObject(i));
                _controlDvs.add(_control);
                _controlValues.put(_control.getId(), _control.getValue());
            }
            setControlList(_controlDvs);
            setControlValues(_controlValues);
        }
        return false;
    }

    @Override
    public JSONObject getJsonObject() {
        return null;
    }
}
