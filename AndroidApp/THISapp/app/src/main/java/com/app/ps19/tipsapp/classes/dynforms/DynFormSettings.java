package com.app.ps19.tipsapp.classes.dynforms;

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
    private ArrayList<DynFormConfig> configs=new ArrayList<>();
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
        setTarget(jsonObject.optString("target", ""));
        setViewGroup(jsonObject.optString("viewGroup",""));
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
