package com.app.ps19.hosapp.classes;

import android.content.Context;
import android.location.Location;
import android.util.Log;

import com.app.ps19.hosapp.LoginActivity;
import com.app.ps19.hosapp.Shared.DBHandler;
import com.app.ps19.hosapp.Shared.Globals;
import com.app.ps19.hosapp.Shared.IConvertHelper;
import com.google.android.gms.maps.model.LatLng;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

import static android.content.ContentValues.TAG;

public class Units implements IConvertHelper {

    private String trackId;
    private String unitId;
    private String description;
    private String assetType;
    private String assetTypeClassify="";
    private JSONObject joFormData;
    private HashMap<String, String> selection;
    private Context context;
    private AssetType assetTypeObj;
    private String start;
    private String end;


    public String getStart() {
        return start;
    }

    public void setStart(String start) {
        this.start = start;
    }

    public String getEnd() {
        return end;
    }

    public void setEnd(String end) {
        this.end = end;
    }

    private ArrayList<LatLong> coordinates=new ArrayList<>();

    public HashMap<String, String> getSelection() {
        return selection;
    }

    public AssetType getAssetTypeObj() {
        return assetTypeObj;
    }

    public void setAssetTypeObj(AssetType assetTypeObj) {
        this.assetTypeObj = assetTypeObj;
    }

    public void setSelection(HashMap<String, String> selection) {
        this.selection = selection;
    }
    public String getAssetTypeClassify () {
        return assetTypeClassify;
    }
    public void setAssetTypeClassify(String assetTypeClassify) {
        this.assetTypeClassify = assetTypeClassify;
    }
    private JSONObject convertSelectionHM(){
        JSONObject jo=new JSONObject();
        if(selection == null){
            return jo;
        }
        try {
            for (String key : selection.keySet()) {
                /*if(key.equals("null")){
                    jo.();
                }*/
                if (selection.get(key) == null) {
                    jo.put(key, "");
                } else {
                    jo.put(key, selection.get(key));
                }

            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return jo;
    }
    public Units(Context context, JSONObject jo){
        this.context=context;
        parseJsonObject(jo);
        loadFormTemplate();

    }
    public Units(JSONObject jo) {
        this.trackId = jo.optString("track_id", "");
        this.unitId = jo.optString("id", "");
        this.description = jo.optString("unitId", "");
        this.assetType = jo.optString("assetType","");
        this.start = jo.optString("start", "-1");
        this.end = jo.optString("end", "-1");
        parseJsonObject(jo);
        loadFormTemplate();
    }
    private void loadFormTemplate(){
        joFormData=new JSONObject();

        DBHandler db=new DBHandler(context);
        assert(this.assetType==null);
        HashMap<String, String> assetTypeHM= db.getLookupListObj(Globals.CATEGORY_LIST_NAME,this.assetType);
        db.close();
        this.assetTypeObj = Globals.assetTypes.get(this.assetType);
        if(assetTypeHM.size()==1){
            String strOpt1=assetTypeHM.get(assetTypeHM.keySet().toArray()[0]);
            if(!strOpt1.equals("")){
                try {
                    JSONObject joOptparam1 = new JSONObject(strOpt1);
                    /*
                    String optParam1=joOptparam1.optString("opt1","");
                    JSONObject joOpt1=null;
                    if(optParam1.equals("")){
                        joOpt1=new JSONObject();
                    }else{
                        joOpt1=new JSONObject(optParam1);
                    }*/
                    this.joFormData = joOptparam1;//joOptparam1.getJSONObject("opt1");
                    this.assetTypeClassify=joOptparam1.optString("assetTypeClassify","");
                }catch (Exception e){
                    e.printStackTrace();
                }
            }
        }

    }
    public JSONObject getJoFormData(){return this.joFormData;}
    public String getTrackId() {
        return trackId;
    }

    public void setTrackId(String trackId) {
        this.trackId = trackId;
    }

    public String getUnitId() {
        return unitId;
    }

    public void setUnitId(String unitId) {
        this.unitId = unitId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAssetType() {
        return assetType;
    }

    public void setAssetType(String assetType) {
        this.assetType = assetType;
    }


    public JSONArray convertCoordinates() {

        JSONArray _retArray=new JSONArray();
        for(LatLong cord:  coordinates){
            JSONArray jaLatLng = new JSONArray();
            try {
                if(!cord.getLat().equals("") && !cord.getLon().equals("")){
                    jaLatLng.put(0, cord.getLat());
                    jaLatLng.put(1, cord.getLon());
                    _retArray.put(jaLatLng);
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return _retArray;
    }

    public ArrayList<LatLong> getCoordinates() {
        return coordinates;
    }
    public ArrayList<LatLng> getCoordinatesConvert(){
        ArrayList<LatLng> _items=new ArrayList<>();
        for(LatLong item : coordinates){
            _items.add(item.latLng);
        }
        return _items;
    }

    public void setCoordinates(ArrayList<LatLong> coordinates) {
        this.coordinates = coordinates;
    }


    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {

        try{
        //setTrackId(jsonObject.getString("track_id"));
        setTrackId(jsonObject.optString("track_id",""));
        setUnitId(jsonObject.getString("id"));
        setDescription(jsonObject.getString("unitId"));
        setAssetType(jsonObject.getString("assetType"));
        if(jsonObject.optString("start","").equals("")){
            setStart("-1");
        } else {
            setStart(jsonObject.optString("start","-1"));
        }
        if(jsonObject.optString("end","").equals("")){
            setEnd("-1");
        } else {
            setEnd(jsonObject.optString("end","-1"));
        }
        JSONObject joForm=jsonObject.optJSONObject("form-sel");
        JSONArray jaCoordinates = jsonObject.optJSONArray("coordinates");
        ArrayList<LatLong> _coordinates = new ArrayList<>();
        if(jaCoordinates !=null){
            for(int i=0;i< jaCoordinates.length();i++){
                JSONArray  jaCord=jaCoordinates.optJSONArray(i);
                if(jaCord !=null) {
                    if(!jaCord.getString(0).equals("") && !jaCord.getString(1).equals("")){
                        _coordinates.add(new LatLong(jaCord.getString(0),jaCord.getString(1)));
                    }
                }
            }
        }
        this.coordinates=_coordinates;

        HashMap <String, String> _selection=new HashMap<>();
        if(joForm !=null){
            Iterator<String> keys= joForm.keys();
            while(keys.hasNext()) {
                String key= keys.next();
                if (joForm.getString(key).equals("")) {
                } else {
                    _selection.put(key, joForm.getString(key));
                }
            }
        }
        setSelection(_selection);

        return true;
        }catch (Exception e){
            e.printStackTrace();
            return  false;
        }
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jo=new JSONObject();
        try{
            jo.put("track_id",getTrackId());
            jo.put("id",getUnitId());
            jo.put("unitId",getDescription());
            jo.put("start", getStart());
            jo.put("end", getEnd());
            jo.put("assetType",getAssetType());
            jo.put("form-sel",convertSelectionHM());
            jo.put("coordinates", convertCoordinates());

        }catch (Exception e)
        {
            Log.e(TAG,e.toString());
        }

        return jo;
    }
}
