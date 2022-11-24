package com.app.ps19.scimapp.classes;

import com.app.ps19.scimapp.Shared.DBHandler;
import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.Shared.StaticListItem;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;

public class LocationMarkers  {
    private ArrayList<String> markerArray=null;

    public ArrayList<String> getMarkerArray() {
        return markerArray;
    }

    public void setMarkerArray(ArrayList<String> markerArray) {
        this.markerArray = markerArray;
    }

    public LocationMarkers(){
        loadList();
    }
    private void loadList(){
        DBHandler db =Globals.db;// new DBHandler(Globals.getDBContext());
        HashMap<String, String> markers =
                db.getAppLookupList(Globals.APP_LOCATION_MARKER_LIST_NAME,"",0);
        if(markers.size()>=1){
            for(String key:markers.keySet()){
                try {
                    StaticListItem item=new StaticListItem(new JSONObject(markers.get(key)));
                    JSONArray jaMarkers=new JSONArray(item.getOptParam1());
                    ArrayList<String> _markerArray=new ArrayList<String>();
                    for(int i=0;i<jaMarkers.length();i++){
                        _markerArray.add(jaMarkers.getString(i));
                    }
                    setMarkerArray(_markerArray);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }


        }

    }
}
