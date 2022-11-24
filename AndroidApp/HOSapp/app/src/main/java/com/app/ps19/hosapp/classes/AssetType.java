package com.app.ps19.hosapp.classes;

import android.content.Context;

import com.app.ps19.hosapp.Shared.DBHandler;
import com.app.ps19.hosapp.Shared.Globals;
import com.app.ps19.hosapp.Shared.IConvertHelper;
import com.app.ps19.hosapp.Shared.StaticListItem;

import org.json.JSONObject;

import java.util.ArrayList;
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
    private DefectCode defectCodes;
    private Context context;
    private Form form;

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
        DBHandler dbHandler= new DBHandler(context);
        List<StaticListItem> items= dbHandler.getListItems(Globals.CATEGORY_LIST_NAME,Globals.orgCode,assetType);
        dbHandler.close();
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

    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        try{
            assetType=jsonObject.optString("assetType","");
            setInstructions(jsonObject.optString("inspectionInstructions",""));
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
}
