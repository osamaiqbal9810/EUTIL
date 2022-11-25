package com.app.ps19.tipsapp.classes.equipment;

import android.content.Context;

import androidx.fragment.app.FragmentActivity;

import com.app.ps19.tipsapp.Shared.IConvertHelper;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class Equipment implements IConvertHelper {
    private String id;
    private String name;
    private EquipmentType equipmentType;
    private String interfaceString;
    private ArrayList<EquipmentAttributes> attributes;
    private ArrayList<Equipment> equipmentList;
    private Equipment parent;
    private Context context;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public EquipmentType getEquipmentType() {
        return equipmentType;
    }

    public void setEquipmentType(EquipmentType equipmentType) {
        this.equipmentType = equipmentType;
    }

    public String getInterfaceString() {
        return interfaceString;
    }

    public void setInterfaceString(String interfaceString) {
        this.interfaceString = interfaceString;
    }

    public ArrayList<EquipmentAttributes> getAttributes() {
        return attributes;
    }

    public void setAttributes(ArrayList<EquipmentAttributes> attributes) {
        this.attributes = attributes;
    }

    public ArrayList<Equipment> getEquipmentList() {
        return equipmentList;
    }

    public void setEquipmentList(ArrayList<Equipment> equipmentList) {
        this.equipmentList = equipmentList;
    }

    public Equipment getParent() {
        return parent;
    }

    public void setParent(Equipment parent) {
        this.parent = parent;
    }

    public Equipment(Equipment parent, JSONObject jo){
        this.parent=parent;
        parseJsonObject( jo );
    }

    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        setId(jsonObject.optString("id"));
        setName(jsonObject.optString("name"));
        setEquipmentType(new EquipmentType(jsonObject.optString("equipmentType")));
        setInterfaceString(jsonObject.optString("interface"));
        JSONArray jaAttributes=jsonObject.optJSONArray("attributes");
        ArrayList<EquipmentAttributes> _attributes=new ArrayList<>();
        if(jaAttributes!=null){
            for(int i=0;i<jaAttributes.length();i++){
                if(jaAttributes.optJSONObject(i)!=null) {
                    _attributes.add(new EquipmentAttributes(this, jaAttributes.optJSONObject(i)));
                }
            }
        }
        JSONArray jaEquipments=jsonObject.optJSONArray("equipments");
        ArrayList<Equipment> _equipments=new ArrayList<>();
        if(jaEquipments!=null){
            for(int i=0;i<jaEquipments.length();i++){
                if(jaEquipments.optJSONObject(i)!=null){
                    _equipments.add(new Equipment(this,jaEquipments.optJSONObject(i)));
                }
            }
        }
        this.equipmentList=_equipments;

        setAttributes(_attributes);
        return false;
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jsonObject=new JSONObject();
        try {
            jsonObject.put("id",getId());
            jsonObject.put("name",getName());
            jsonObject.put("equipmentType",getEquipmentType().getEquipmentType());
            jsonObject.put("interface",getInterfaceString());
            if(getAttributes()!=null && getAttributes().size()>0 ){
                JSONArray jaAttributes=new JSONArray();
                for(EquipmentAttributes att: getAttributes() ){
                    jaAttributes.put(att.getJsonObject());
                }
                jsonObject.put("attributes",jaAttributes);
            }
            if(getEquipmentList()!=null && getEquipmentList().size()>0 ){
                JSONArray jaEquipments=new JSONArray();
                for(Equipment equ: getEquipmentList() ){
                    jaEquipments.put(equ.getJsonObject());
                }
                jsonObject.put("equipments",jaEquipments);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jsonObject;
    }

    public void setContext(FragmentActivity activity) {
        this.context=activity;

    }

    public Context getContext() {
        return context;
    }
}
