package com.app.ps19.scimapp.classes;

import android.content.Context;
import android.util.Log;

import com.app.ps19.scimapp.Shared.DBHandler;
import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.Shared.IConvertHelper;
import com.app.ps19.scimapp.Shared.Utilities;
import com.app.ps19.scimapp.classes.dynforms.DynForm;
import com.app.ps19.scimapp.classes.dynforms.DynFormControl;
import com.app.ps19.scimapp.classes.dynforms.DynFormList;
import com.app.ps19.scimapp.classes.dynforms.defaultvalues.DynFormListDv;
import com.google.android.gms.maps.model.LatLng;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

import static android.content.ContentValues.TAG;
import static com.app.ps19.scimapp.Shared.Utilities.convertJsonArrayToHashMap;

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
    private String parentId;
    private Units parentUnit;
    private String issueCounter = "0";
    private UnitAttributes attributes;
    private ArrayList<DynForm> appForms;
    private HashMap<String, Object> hmBackupValues;
    private boolean changeOnly=false;
    private String startMarker;
    private String endMarker;
    private DynFormListDv defaultFormValues;

    public void setDefaultFormValues(DynFormListDv defaultFormValues) {
        this.defaultFormValues = defaultFormValues;
    }

    public DynFormListDv getDefaultFormValues() {
        return defaultFormValues;
    }

    public boolean isChangeOnly() {
        return changeOnly;
    }
    public void setChangeOnly(boolean changeOnly) {
        this.changeOnly = changeOnly;
    }

    public UnitAttributes getAttributes() {
        return attributes;
    }

    public void setAttributes(UnitAttributes attributes) {
        this.attributes = attributes;
    }
    public ArrayList<DynForm> getAppForms() {
        return appForms;
    }
    public void setAppForms(ArrayList<DynForm> appForms) {
        this.appForms = appForms;
    }
    public String getIssueCounter() {
        return issueCounter;
    }

    public void setIssueCounter(String issueCounter) {
        this.issueCounter = issueCounter;
    }

    public Units getParentUnit() {
        return parentUnit;
    }

    public void setParentUnit(Units parentUnit) {
        this.parentUnit = parentUnit;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }


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
    private Geometry coordinatesAdj;

    public Geometry getCoordinatesAdj() {
        return coordinatesAdj;
    }

    public void setCoordinatesAdj(Geometry coordinatesAdj) {
        this.coordinatesAdj = coordinatesAdj;
    }

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
    public Units(){
        hmBackupValues=new HashMap<>();
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

        DBHandler db=Globals.db;//new DBHandler(Globals.getDBContext());
        if(this.assetType != null){
            HashMap<String, String> assetTypeHM= db.getLookupListObj(Globals.CATEGORY_LIST_NAME,this.assetType);
            //db.close();
            AssetType aType = Globals.assetTypes.get(this.assetType);
            if(aType == null){
                aType = new AssetType(new JSONObject());
            }
            this.assetTypeObj = aType;
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


    }
    public JSONObject getJoFormData(){
        return this.joFormData;
    }
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
        loadFormTemplate();
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
            hmBackupValues= Utilities.getHashMapJSONObject(jsonObject);
            if(jsonObject.has("form-sel")){
                hmBackupValues.put("form-sel",jsonObject.getJSONObject("form-sel"));
            }

            if(jsonObject.has("adjCoordinates")){
                hmBackupValues.put("adjCoordinates",jsonObject.getJSONObject("adjCoordinates"));
            }

            //setTrackId(jsonObject.getString("track_id"));
            setTrackId(jsonObject.optString("track_id",""));
            //TODO: no value for id from loadInbox Globals file
            setUnitId(jsonObject.optString("id", ""));
            setDescription(jsonObject.optString("unitId", ""));
            setAssetType(jsonObject.getString("assetType"));
            UnitAttributes attributes = new UnitAttributes();

            if(jsonObject.has("attributes")){
                attributes.parseJsonObject(jsonObject.getJSONObject("attributes"));
            }
            setAttributes(attributes);
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
            setParentId(jsonObject.optString("parent_id",""));
            setStartMarker(jsonObject.optString("startMarker", ""));
            setEndMarker(jsonObject.optString("endMarker", ""));
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

            Geometry _adjCoordinates=null ;
            JSONObject joAdjCoordinates = jsonObject.optJSONObject("adjCoordinates");
            if(joAdjCoordinates !=null){
                _adjCoordinates=new Geometry(joAdjCoordinates,"Point");
            }
            this.coordinatesAdj=_adjCoordinates;
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

            JSONArray jaForms=jsonObject.optJSONArray("appForms");
            this.appForms= DynFormList.getFormList(assetType);
            if(jaForms !=null){
                HashMap<String, DynForm> formListMap=new HashMap<>();
                for(DynForm form:this.appForms){
                    formListMap.put(form.getFormId(),form);
                }
                for(int i=0;i<jaForms.length();i++){
                    try {
                        JSONObject jo=jaForms.getJSONObject(i);
                        String formId=jo.getString("id");
                        JSONArray jaFormData=jo.optJSONArray("form");
                        DynForm form =formListMap.get(formId);
                        if(form !=null){
                            form.setCurrentValues(convertJsonArrayToHashMap(jaFormData));
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }

            JSONArray jaFormsDv=jsonObject.optJSONArray("defaultAppForms");
            this.defaultFormValues=null;
            if(jaFormsDv !=null){
                this.defaultFormValues=new DynFormListDv(jaFormsDv);
            }
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return  false;
        }
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jo=new JSONObject();

        if( changeOnly){
            jo=getJsonObjectChanged();
            return  jo;
        }

        try{
            jo.put("track_id",getTrackId());
            jo.put("id",getUnitId());
            jo.put("unitId",getDescription());
            jo.put("start", getStart());
            jo.put("end", getEnd());
            jo.put("assetType",getAssetType());
            jo.put("form-sel",convertSelectionHM());
            jo.put("coordinates", convertCoordinates());
            jo.put("parent_id",getParentId());
            jo.put("attributes", getAttributes().getJsonObject());
            jo.put("startMarker", getStartMarker());
            jo.put("endMarker", getEndMarker());
            if(this.appForms !=null){
                JSONArray jaForms =new JSONArray();
                for(DynForm form : this.appForms){
                    JSONObject jsonObject=form.getJsonObject();
                    if(jsonObject!=null) {
                        jaForms.put(jsonObject);
                    }
                }
                jo.put("appForms",jaForms);
            }
            if(this.coordinatesAdj!=null){
                jo.put("adjCoordinates",this.coordinatesAdj.getJsonObject());
            }

        }catch (Exception e)
        {
            Log.e(TAG,e.toString());
        }

        return jo;
    }
    @Override
    public String toString() {
        return description;
    }
    public JSONObject getJsonObjectChanged() {
        JSONObject jo=new JSONObject();
        try{

            putJSONProperty(jo,"track_id",getTrackId());
            putJSONProperty(jo,"id",getUnitId());
            putJSONProperty(jo,"unitId",getDescription());
            putJSONProperty(jo,"start", getStart());
            putJSONProperty(jo,"end", getEnd());
            putJSONProperty(jo,"assetType",getAssetType());
            putJSONProperty(jo, "startMarker", getStartMarker());
            putJSONProperty(jo, "endMarker", getEndMarker());

            JSONObject joFormSel=convertSelectionHM();
            if(joFormSel !=null && joFormSel.length()>0) {
                putJSONProperty(jo, "form-sel", joFormSel);
            }

            putJSONProperty(jo,"coordinates", convertCoordinates());
            putJSONProperty(jo,"parent_id",getParentId());
            getAttributes().setChangeOnly(changeOnly);
            JSONObject joUnitAttr=getAttributes().getJsonObject();
            if(joUnitAttr !=null && joUnitAttr.length()>0) {
                jo.put( "attributes", joUnitAttr);
            }
            if(this.appForms !=null && this.appForms.size()>0){
                JSONArray jaForms =new JSONArray();
                //int prevSize=-1;
                //JSONArray jsonArray=(JSONArray) this.hmBackupValues.get("appForms");
                //if(jsonArray !=null){
                //   prevSize=jsonArray.length();
                //}
                boolean dataExists=false;
                for(DynForm form : this.appForms){
                    form.setChangeOnly(changeOnly);
                    JSONObject jsonObject=form.getJsonObject();
                    if(jsonObject!=null) {
                        jaForms.put(jsonObject);
                        dataExists=true;
                    }else{
                        jaForms.put(new JSONObject());
                    }
                }
                if(dataExists){
                    jo.put("appForms", jaForms);
                }

                /*
                if(jaForms.length()>0) {
                    if(jaForms.length() > prevSize){
                        jaForms =new JSONArray();
                        for(DynForm form : this.appForms){
                            form.setChangeOnly(false);
                            JSONObject jsonObject=form.getJsonObject();
                            if(jsonObject!=null) {
                                jaForms.put(jsonObject);
                            }else{
                                jaForms.put(new JSONObject());
                            }
                        }
                        jo.put("*appForms", jaForms);
                    }else{
                        jo.put("appForms", jaForms);
                    }

                }
                */
            }
            if(this.coordinatesAdj!=null){
                Geometry geometry=getCoordinatesAdj();
                putJSONProperty(jo,"adjCoordinates",geometry.getJsonObject());
            }

            if(jo !=null && jo.length()!=0){
                hmBackupValues=Utilities.putHashMapJSONObject(hmBackupValues, jo);
            }

        }catch (Exception e)
        {
            Log.e(TAG,e.toString());
        }

        return jo;
    }
    private boolean putJSONProperty(JSONObject jo, String fieldName, Object value){
        Object oldValue=null;
        oldValue=hmBackupValues.get(fieldName);
        if(oldValue !=null && oldValue instanceof JSONObject){
            if(!oldValue.toString().equals(value.toString())){
                try {
                    jo.put(fieldName,value);
                } catch (JSONException e) {
                    e.printStackTrace();
                    return  false;
                }
            }
        }else if(oldValue==null || (oldValue !=null && !oldValue.equals(value))){
            try {
                jo.put(fieldName,value);
            } catch (JSONException e) {
                e.printStackTrace();
                return  false;
            }
        }
        return true;
    }
    public Units makeClone(){
        Units unit=new Units();
        unit.setTrackId(getTrackId());
        unit.setUnitId(getUnitId());
        unit.setDescription(getDescription());
        unit.setStart( getStart());
        unit.setEnd(getEnd());
        unit.setAssetType(getAssetType());
        unit.setCoordinates(getCoordinates());
        unit.setParentId(getParentId());
        unit.setAttributes(getAttributes().makeClone());
        return  unit;
    }
    public String getEndMarker() {
        return endMarker;
    }

    public void setEndMarker(String endMarker) {
        this.endMarker = endMarker;
    }

    public String getStartMarker() {
        return startMarker;
    }

    public void setStartMarker(String startMarker) {
        this.startMarker = startMarker;
    }
}
