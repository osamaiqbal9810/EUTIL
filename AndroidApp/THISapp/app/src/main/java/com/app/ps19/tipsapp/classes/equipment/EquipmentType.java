package com.app.ps19.tipsapp.classes.equipment;

import com.app.ps19.tipsapp.Shared.IConvertHelper;
import com.app.ps19.tipsapp.Shared.ListMap;
import com.app.ps19.tipsapp.classes.dynforms.DynForm;
import com.app.ps19.tipsapp.classes.dynforms.DynFormList;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class EquipmentType implements IConvertHelper {
    private String equipmentType;
    private String iconGroup;

    private ArrayList<DynForm> formList=new ArrayList<>();

    public void setIconGroup(String iconGroup) {
        this.iconGroup = iconGroup;
    }

    public String getIconGroup() {
        return iconGroup;
    }

    public void setFormList(ArrayList<DynForm> formList) {
        this.formList = formList;
    }

    public ArrayList<DynForm> getFormList() {
        return formList;
    }

    public void setEquipmentType(String equipmentType) {
        this.equipmentType = equipmentType;
    }

    public String getEquipmentType() {
        return equipmentType;
    }

    public EquipmentType(JSONObject jo){
        parseJsonObject(jo);
    }
    public EquipmentType(String equipmentType){
        if(equipmentType.equals("")){
            equipmentType="default";
        }
        this.equipmentType=equipmentType;
        setFormList(DynFormList.getFormListForEquipment(getEquipmentType()));
        try{
        if(ListMap.getListHashMap(ListMap.LIST_EQUIPMENT_TYPES)!=null) {
            String value = ListMap.getListHashMap(ListMap.LIST_EQUIPMENT_TYPES).get(getEquipmentTypeKey(equipmentType));
            if (value !=null && !value.equals("")) {
                JSONObject jo = new JSONObject(value);
                JSONObject joOptions = jo.optJSONObject("opt1");
                if (joOptions != null) {
                    setIconGroup(joOptions.optString("iconGroup", "default"));
                }
            }
        }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
    private String getEquipmentTypeKey(String equipmentType){
        return "aet-"+equipmentType;
    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        setEquipmentType(jsonObject.optString("equipmentType"));
        setFormList(DynFormList.getFormListForEquipment(getEquipmentType()));
        return false;
    }

    @Override
    public JSONObject getJsonObject() {
        return null;
    }
}
