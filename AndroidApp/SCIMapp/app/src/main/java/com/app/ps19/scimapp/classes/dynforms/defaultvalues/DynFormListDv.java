package com.app.ps19.scimapp.classes.dynforms.defaultvalues;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;

public  class DynFormListDv {
    public ArrayList<DynFormDv> formList;
    public DynFormListDv(){
    }
    public DynFormListDv(JSONArray ja){
        ArrayList<DynFormDv> _formList=new ArrayList<>();
        for(int i=0;i<ja.length();i++){
            JSONObject jo=ja.optJSONObject(i);
            if(jo !=null){
                _formList.add(new DynFormDv(jo));
            }
            this.formList=_formList;
        }
    }
    public DynFormDv getFormById(String id){
        if(this.formList!=null) {
            for (DynFormDv form : this.formList) {
                if (form.getId().equals(id)) {
                    return form;
                }
            }
        }
        return  null;
    }
}
