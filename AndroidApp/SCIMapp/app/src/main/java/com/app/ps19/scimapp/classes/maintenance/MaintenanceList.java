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

    public List<String> getMaintenanceLocations(){
        List<String> locations = new ArrayList<>();
        for(Maintenance maintenance: maintenanceList){
            if(!locations.contains(maintenance.getLineName())){
                locations.add(maintenance.getLineName());
            }
        }
        locations.add(0,"All");
        return locations;
    }
    public List<String> getMaintenanceLocations(String lineId){
        List<String> locations = new ArrayList<>();
        for(Maintenance maintenance: getMaintenanceByLineId(lineId)){
            if(!locations.contains(maintenance.getLineName())){
                locations.add(maintenance.getLineName());
            }
        }
        return locations;
    }
    public ArrayList<Maintenance> getMaintenanceByLocation(String location){
        ArrayList<Maintenance> maintenances = new ArrayList<>();
        if(location.equals("All")){
            return maintenanceList;
        }

        for(Maintenance maintenance: maintenanceList){
            if(maintenance.getLineName().equals(location)){
                maintenances.add(maintenance);
            }
        }
        return maintenances;
    }
    public ArrayList<Maintenance> getMaintenanceByLineId(String lineId){
        ArrayList<Maintenance> maintenances = new ArrayList<>();

        for(Maintenance maintenance: maintenanceList){
            if(maintenance.getLineId().equals(lineId)){
                maintenances.add(maintenance);
            }
        }
        return maintenances;
    }
}
