package com.app.ps19.hosapp.classes;

import com.app.ps19.hosapp.Shared.IConvertHelper;

import org.json.JSONObject;

public class GeoLocation implements IConvertHelper {
    private String type="";
    private Geometry geometry;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
    public Geometry getGeometry() {
        return geometry;
    }

    public void setGeometry(Geometry geometry) {
        this.geometry = geometry;
    }


    public GeoLocation(JSONObject jo){
        parseJsonObject(jo);
    }

    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        try{

            this.type=jsonObject.optString("type","");
            JSONObject jo=jsonObject.optJSONObject("geometry");
            if(jo !=null){
                geometry=new Geometry(jo);
            }

        }catch (Exception e){
            e.printStackTrace();
            return false;

        }
        return true;
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jo=new JSONObject();
        try{
            jo.put("type",this.type);
            if(this.geometry !=null) {
                jo.put("geometry", this.geometry.getJsonObject());
            }else
            {
                jo.put("geometry", new JSONObject());
            }

        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
        return jo;
    }
}
