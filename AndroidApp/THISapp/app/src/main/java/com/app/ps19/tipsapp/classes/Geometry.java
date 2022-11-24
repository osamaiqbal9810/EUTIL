package com.app.ps19.tipsapp.classes;

import android.location.Geocoder;

import com.app.ps19.tipsapp.Shared.IConvertHelper;
import com.google.android.gms.maps.model.LatLng;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;

public class Geometry implements IConvertHelper {
    String type;

    public String mode="";

    public void setMode(String mode) {
        this.mode = mode;
    }

    public String getMode() {
        return mode;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public ArrayList<LatLng> getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(ArrayList<LatLng> coordinates) {
        this.coordinates = coordinates;
    }

    ArrayList<LatLng> coordinates=new ArrayList<>();
    public Geometry(JSONObject jo){
        parseJsonObject(jo);
    }
    public Geometry(JSONObject jo, String mode){
        this.mode = mode;
        parseJsonObject(jo);

    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        try{
        this.type=jsonObject.optString("type","");
        JSONArray ja=jsonObject.optJSONArray("coordinates");
        coordinates=new ArrayList<>();
        if(ja.length()>0){
            JSONArray ja1=ja.optJSONArray(0);
            LatLng latLng=null;
            if(ja1 ==null){
                // Open Value only
                //latLng=new LatLng(ja.optDouble(1,0.0),ja.optDouble(0,0.0));
                if(mode.toLowerCase().equals("point")){
                     latLng=new LatLng(ja.optDouble(1,0.0),ja.optDouble(0,0.0));
                }else{
                    latLng=new LatLng(ja.optDouble(1,0.0),ja.optDouble(0,0.0));
                }

                coordinates.add(latLng);
            }else{
                for(int i=0;i<ja.length();i++){
                    JSONArray ja2=ja.optJSONArray(i);
                    if(ja2 !=null){
                        coordinates.add(new LatLng(ja2.optDouble(1,0.0),ja2.optDouble(0,0.0)));
                    }
                }

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
        JSONObject jo = new JSONObject();
        try {
            JSONArray jaMain=new JSONArray();
            jo.put("type", this.type);
            if(this.coordinates.size()>0){
                LatLng latlng;

                if(this.type.equals("Point")){
                    latlng=coordinates.get(0);
                    jaMain.put(latlng.longitude);
                    jaMain.put(latlng.latitude);
                }else{
                    /*for (LatLng latlng1:this.coordinates) {
                        JSONArray jaSub=new JSONArray();
                        jaSub.put(latlng1.longitude);
                        jaSub.put(latlng1.latitude);
                        jaMain.put(jaSub);
                    }*/
                }

            }
            jo.put("coordinates",jaMain);
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
        return jo;
    }
}
