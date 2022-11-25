package com.app.ps19.tipsapp.classes.version;

import com.app.ps19.tipsapp.Shared.IConvertHelper;
import com.google.maps.android.data.Feature;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;


public class VersionInfo implements IConvertHelper {
    private Version version;
    private ContractAppearance displayData;
    private ArrayList<FeatureSetList> featureSetListArrayList;
    public Version getVersion() {
        return version;
    }


    public void setVersion(Version version) {
        this.version = version;
    }

    public ContractAppearance getDisplayData() {
        return displayData;
    }


    public void setDisplayData(ContractAppearance displayData) {
        this.displayData = displayData;
    }
    public boolean isNonFRACodes(){
        boolean retValue=false;
        if(featureSetListArrayList!=null){
            for(FeatureSetList featureSetList:featureSetListArrayList){
                if(featureSetList.getId().equals("nonFRACodes")){
                    return featureSetList.isValue();
                }
            }
        }
        return false;
    }
    public VersionInfo(JSONObject jsonObject){
        parseJsonObject(jsonObject);
    }
    public VersionInfo(){

    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        try {
            setVersion(new Version(jsonObject.optJSONObject("versionInfo")));
            setDisplayData(new ContractAppearance(jsonObject.optJSONObject("appearance")));
            JSONArray jaFeatureList=jsonObject.optJSONArray("featuresetList");
            if(jaFeatureList!=null){
                ArrayList<FeatureSetList> _featureList=new ArrayList<>();
                for(int i=0;i<jaFeatureList.length();i++){
                    _featureList.add(new FeatureSetList(jaFeatureList.getJSONObject(i)));
                }
                this.featureSetListArrayList=_featureList;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return true;
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jo =new JSONObject();
        try {
            jo.put("versionInfo", getVersion().getJsonObject());
            jo.put("appearance", getDisplayData().getJsonObject());

        }catch (Exception e){
            e.printStackTrace();
        }
        return jo;
    }

}
