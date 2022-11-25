package com.app.ps19.tipsapp.classes;

import com.app.ps19.tipsapp.Shared.IConvertHelper;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class DefectCode implements IConvertHelper {
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<DefectCode> getDetails() {
        if(filterText.equals("")){
            return details;
        }
        return filterDetails;
    }
    private void applyFilter(){
        ArrayList<DefectCode> _details=new ArrayList<>();
        for(DefectCode d:details){
            String code=d.getCode().toLowerCase().replaceAll("[-,.]+", "");
            if(d.getTitle().toLowerCase().contains(filterText) || d.getCode().toLowerCase().contains(filterText) || code.contains(filterText)){
                _details.add(d);
            }
        }
        this.filterDetails=_details;

    }
    public void setDetails(List<DefectCode> details) {
        this.details = details;
        applyFilter();
    }

    private String code="";
    private String title ="";
    private List<DefectCode> details;
    private List<DefectCode> filterDetails;
    private String filterText="";

    public void setFilterText(String filterText) {
        this.filterText = filterText;
        applyFilter();
    }

    public String getFilterText() {
        return filterText;
    }

    public DefectCode(JSONObject jo){
        parseJsonObject(jo);
    }

    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        try{
            setCode(jsonObject.optString("code",""));
            setTitle(jsonObject.optString("title",""));
            JSONArray ja=jsonObject.optJSONArray("details");
            details=new ArrayList<>();
            if(ja !=null){
                for(int i=0;i< ja.length();i++){
                    details.add(new DefectCode(ja.getJSONObject(i)));
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
