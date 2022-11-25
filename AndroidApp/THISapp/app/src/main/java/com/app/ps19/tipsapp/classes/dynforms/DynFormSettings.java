package com.app.ps19.tipsapp.classes.dynforms;

import android.util.Log;

import com.app.ps19.tipsapp.Shared.IConvertHelper;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class DynFormSettings implements IConvertHelper {
    public ArrayList<String> getAssetTypes() {
        return assetTypes;
    }
    public ArrayList<DynFormConfig> getConfigs(){
        return configs;
    }
    private String viewGroup;
    private ArrayList<String> assetTypes=new ArrayList<>();
    private String target = "";
    private String parentTestCode="";
    private String type="";
    private ArrayList<DynFormConfig> configs=new ArrayList<>();
    private ArrayList<String> equipmentTypes=new ArrayList<>(); //allowed equipment types
    private ArrayList<String> allowedInstructions;

    public ArrayList<String> getAllowedInstructions() {
        return allowedInstructions;
    }

    public void setAllowedInstructions(ArrayList<String> allowedInstructions) {
        this.allowedInstructions = allowedInstructions;
    }


    public void setType(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }

    public void setParentTestCode(String parentTestCode) {
        this.parentTestCode = parentTestCode;
    }

    public String getParentTestCode() {
        return parentTestCode;
    }

    public void setEquipmentTypes(ArrayList<String> equipmentTypes) {
        this.equipmentTypes = equipmentTypes;
    }

    public ArrayList<String> getEquipmentTypes() {
        return equipmentTypes;
    }

    public DynFormSettings(JSONObject jo){
        parseJsonObject(jo);
    }
    public String getTarget() {
        return target;
    }

    public String getViewGroup() {
        return viewGroup;
    }

    public void setViewGroup(String viewGroup) {
        this.viewGroup = viewGroup;
    }

    public void setTarget(String target) {
        this.target = target;
    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        JSONArray jaAssetTypes=jsonObject.optJSONArray("assetTypes");
        JSONArray jaEquipmentTypes=jsonObject.optJSONArray("allowedEquipmentTypes");
        JSONArray jaAllowedInstructions = jsonObject.optJSONArray("allowedInstruction");

        setTarget(jsonObject.optString("target", ""));
        setParentTestCode(jsonObject.optString("parentTestCode", ""));
        setType(jsonObject.optString("type", ""));
        setViewGroup(jsonObject.optString("viewGroup",""));
        if(jaAllowedInstructions!=null){
            ArrayList<String> _instructions=new ArrayList<>();
            for(int i=0;i<jaAllowedInstructions.length();i++){
                try {
                    if(!jaAllowedInstructions.getString(i).equals("")){
                        _instructions.add(jaAllowedInstructions.getString(i));
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
            this.allowedInstructions = _instructions;
            //setAllowedInstructions(_instructions);
        }
        if(jaAssetTypes!=null){
            ArrayList<String> _assetTypes=new ArrayList<>();
            for(int i=0;i<jaAssetTypes.length();i++){
                try {
                    _assetTypes.add(jaAssetTypes.getString(i));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
            this.assetTypes=_assetTypes;
        }
        ArrayList<String> _equipmentTypes = new ArrayList<>();
        if(jaEquipmentTypes!=null) {
            for (int i = 0; i < jaEquipmentTypes.length(); i++) {
                try {
                    _equipmentTypes.add(jaEquipmentTypes.getString(i));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }
        this.equipmentTypes=_equipmentTypes;
        JSONArray jaConfig=jsonObject.optJSONArray("config");
        if(jaConfig!=null){
            ArrayList<DynFormConfig> _configs=new ArrayList<>();
            ArrayList<String> _assetTypes=new ArrayList<>();
            for(int i=0; i<jaConfig.length();i++){
                if(jaConfig.optJSONObject(i)!=null){
                    DynFormConfig config=new DynFormConfig(jaConfig.optJSONObject(i));
                    _configs.add(config);
                    if(!config.getAssetType().equals("")) {
                        _assetTypes.add(config.getAssetType());
                    }
                }
            }
            configs=_configs;
            assetTypes=_assetTypes;
        }
        return true;
    }

    @Override
    public JSONObject getJsonObject() {
        return null;
    }
}
