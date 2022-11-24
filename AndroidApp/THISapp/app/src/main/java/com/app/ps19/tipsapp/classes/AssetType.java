package com.app.ps19.tipsapp.classes;

import android.content.Context;

import com.app.ps19.tipsapp.Shared.DBHandler;
import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.Shared.IConvertHelper;
import com.app.ps19.tipsapp.Shared.StaticListItem;

import org.json.JSONObject;

import java.util.List;

public class AssetType implements IConvertHelper {
    public String getAssetType() {
        return assetType;
    }

    public void setAssetType(String assetType) {
        this.assetType = assetType;
    }

    public String getAssetTypeClassify() {
        return assetTypeClassify;
    }

    public void setAssetTypeClassify(String assetTypeClassify) {
        this.assetTypeClassify = assetTypeClassify;
    }

    public DefectCode getDefectCodes() {
        return defectCodes;
    }

    public void setDefectCodes(DefectCode defectCodes) {
        this.defectCodes = defectCodes;
    }

    public Context getContext() {
        return context;
    }

    public void setContext(Context context) {
        this.context = context;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    private String assetType="";
    private String assetTypeClassify="";
    private String instructions="";
    private boolean isLocation = false;
    private DefectCode defectCodes;
    private Context context;
    private Form form;
    private boolean isInspectable = false;

    public boolean isPlanable() {
        return isPlanable;
    }

    public void setPlanable(boolean planable) {
        isPlanable = planable;
    }

    private boolean isPlanable = false;


    private boolean isMarkerMilepost = false;

    public Form getForm() {
        return form;
    }

    public void setForm(Form form) {
        this.form = form;
    }

    public  AssetType(Context context, String assetType){
        this.context=context;
        loadFromDB(assetType);

    }
    public AssetType(JSONObject jo){
        parseJsonObject(jo);
    }
    private boolean loadFromDB(String assetType){
        DBHandler dbHandler= Globals.db;//new DBHandler(Globals.getDBContext());
        List<StaticListItem> items= dbHandler.getListItems(Globals.CATEGORY_LIST_NAME,Globals.orgCode,assetType);
        //dbHandler.close();
        if(items.size()==1){
            try {
                JSONObject jo = new JSONObject(items.get(0).getOptParam1());
                parseJsonObject(jo);
            }catch (Exception e){
                e.printStackTrace();
                return false;
            }
        }
        return false;
    }
    public boolean isLocation() {
        return isLocation;
    }

    public void setLocation(boolean location) {
        isLocation = location;
    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        try{
            assetType=jsonObject.optString("assetType","");
            setInstructions(jsonObject.optString("inspectionInstructions",""));
            setLocation(jsonObject.optBoolean("location", false));
            setInspectable(jsonObject.optBoolean("inspectable", false));
            setPlanable(jsonObject.optBoolean("plannable", false));
            setMarkerMilepost(jsonObject.optBoolean("markerMilepost", false));
            setAssetTypeClassify(jsonObject.optString("assetTypeClassify",""));
            if(jsonObject.optJSONObject("defectCodesObj") !=null) {
                defectCodes = new DefectCode(jsonObject.optJSONObject("defectCodesObj"));
            }else{
                defectCodes=null;
            }
            if(jsonObject.optJSONObject("inspectionFormsObj") !=null) {
                this.form = new Form(jsonObject.optJSONObject("inspectionFormsObj"));
            }else{
                this.form=null;
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

    public boolean isInspectable() {
        return isInspectable;
    }

    public void setInspectable(boolean inspectable) {
        isInspectable = inspectable;
    }

    public boolean isMarkerMilepost() {
        return isMarkerMilepost;
    }

    public void setMarkerMilepost(boolean markerMilepost) {
        isMarkerMilepost = markerMilepost;
    }
}
