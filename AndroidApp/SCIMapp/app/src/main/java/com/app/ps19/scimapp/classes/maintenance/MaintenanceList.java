package com.app.ps19.scimapp.classes.maintenance;

import com.app.ps19.scimapp.Shared.IConvertHelper;
import com.app.ps19.scimapp.Shared.StaticListItem;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class MaintenanceList implements IConvertHelper {
    ArrayList<Maintenance> maintenanceList;

    public void setMaintenanceList(ArrayList<Maintenance> maintenanceList) {
        this.maintenanceList = maintenanceList;
    }

    public ArrayList<Maintenance> getMaintenanceList() {
        return maintenanceList;
    }
    public MaintenanceList(List<StaticListItem> list ){
        if(list !=null){
            JSONObject joMainObject=new JSONObject();
            JSONArray jaItems=new JSONArray();
            for(StaticListItem item:list){
                String strText=item.getOptParam1();
                try {
                    jaItems.put( new JSONObject(strText));

                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
            try {
                joMainObject.put("data",jaItems);
                parseJsonObject(joMainObject);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }
    public MaintenanceList(JSONObject jo){
        parseJsonObject(jo);
    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        ArrayList<Maintenance> _maintenanceList=new ArrayList<>();
        try {
            JSONArray jsonArray=jsonObject.getJSONArray("data");
            for(int i=0;i<jsonArray.length();i++){
                _maintenanceList.add(new Maintenance(jsonArray.getJSONObject(i)));
            }
        setMaintenanceList(_maintenanceList);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return false;
    }

    @Override
    public JSONObject getJsonObject() {
        return null;
    }
}
