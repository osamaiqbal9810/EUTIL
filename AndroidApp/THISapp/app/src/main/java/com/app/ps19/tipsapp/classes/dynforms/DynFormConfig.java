package com.app.ps19.tipsapp.classes.dynforms;

import com.app.ps19.tipsapp.Shared.IConvertHelper;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;

public class DynFormConfig implements IConvertHelper {
    private String assetType="";

    public void setAssetType(String assetType) {
        this.assetType = assetType;
    }

    public ArrayList<String> getInstructionFile() {
        return instructionFile;
    }

    public void setInstructionFile(ArrayList<String> instructionFile) {
        this.instructionFile = instructionFile;
    }

    public InspectionFreq getInspectionFreq() {
        return inspectionFreq;
    }

    public void setInspectionFreq(InspectionFreq inspectionFreq) {
        this.inspectionFreq = inspectionFreq;
    }

    private ArrayList<String> instructionFile=new ArrayList<>();
    private InspectionFreq inspectionFreq;
    public String getAssetType(){return this.assetType;}
    public DynFormConfig(JSONObject jo){
        parseJsonObject(jo);
    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        assetType=jsonObject.optString("assetType");
        if(jsonObject.optJSONArray("instructionFile")!=null){
            JSONArray jaFiles=jsonObject.optJSONArray("instructionFile");
            ArrayList _files=new ArrayList();
            for(int i=0;i<jaFiles.length();i++){
                _files.add(jaFiles.optString(i));
            }
            instructionFile=_files;
        }
        if(jsonObject.optJSONObject("inspectionFreq")!=null){
            this.inspectionFreq=new InspectionFreq(jsonObject.optJSONObject("inspectionFreq"));
        }
        return false;
    }

    @Override
    public JSONObject getJsonObject() {
        return null;
    }
}
