package com.app.ps19.tipsapp.classes;

import com.app.ps19.tipsapp.Shared.DBHandler;
import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.Shared.IConvertHelper;
import com.app.ps19.tipsapp.Shared.StaticListItem;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

public class GeoLocation implements IConvertHelper {
    private String type="";
    private Geometry geometry;
    private String rangeId="";
    private String runId="";

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
    private boolean loadRangeFromDB(String runId, String rangeId) {
        DBHandler db = Globals.db;//new DBHandler(Globals.getDBContext());
        List<StaticListItem> items= db.getListItems(Globals.RUN_LIST_NAME,Globals.orgCode, runId);
        if(items.size()>=1){
            StaticListItem item=items.get(0);
            try {
                JSONObject joRun=new JSONObject(item.getOptParam1());
                JSONArray jaRanges=joRun.getJSONArray("runRange");
                for(int i=0;i<jaRanges.length();i++){
                    JSONObject joRange=jaRanges.getJSONObject(i);
                    String _rangeId=joRange.optString("id","");
                    if(rangeId.equals(_rangeId)){
                        JSONObject joGeoJson=joRange.optJSONObject("geoJsonCord");
                        if(joGeoJson !=null){
                            JSONObject joGeometry=joGeoJson.optJSONObject("geometry");
                            if(joGeometry !=null){
                                this.geometry=new Geometry(joGeometry);
                                return  true;
                            }

                        }
                    }

                }

            } catch (JSONException e) {
                e.printStackTrace();
                return false;
            }
        }
        return false;
    }

    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        try{

            this.type=jsonObject.optString("type","");
            JSONObject jo=jsonObject.optJSONObject("geometry");
            this.rangeId=jsonObject.optString("id","");
            this.runId=jsonObject.optString("runId","");
            this.geometry=null;
            if(!this.rangeId.equals("") && !this.runId.equals("")){
                loadRangeFromDB(runId, rangeId);
            }
            if(jo !=null && this.geometry==null){
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
            if(!this.rangeId.equals("")){
                jo.put("id",this.rangeId);
            }
            if(!this.runId.equals("")){
                jo.put("runId",this.runId);
            }
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
