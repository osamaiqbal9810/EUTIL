package com.app.ps19.scimapp.classes.dynforms;

import android.content.Context;
import android.util.Log;

import com.app.ps19.scimapp.Shared.DBHandler;
import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.Shared.IConvertHelper;
import com.app.ps19.scimapp.Shared.ListMap;
import com.app.ps19.scimapp.Shared.StaticListItem;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;

public class DynFormList implements IConvertHelper {
    private static ArrayList<DynForm> formList;
    private static HashMap<String, DynForm> formListMap;

    public static HashMap<String, DynForm> getFormListMap() {
        return formListMap;
    }
    public static ArrayList<StaticListItem> infoListItems;

    public static ArrayList<String> getPdfFileList(){
        ArrayList<String> fileList=new ArrayList<>();
        for(DynForm form:formList){
            if(form.getFormSettings()!=null){
                fileList.addAll(form.getPdfFiles());
            }
        }
        return fileList;
    }
    public static DynForm getFormByName(String formName){
        //"Track Disturbance Report"
        for(DynForm form: formList){
            if(form.getFormName().equals(formName)){
                try {
                    DynForm newForm=(DynForm) form.clone();
                    newForm.cloneFieldList(form.getFormControlList());
                    return  newForm;
                } catch (CloneNotSupportedException e) {
                    e.printStackTrace();
                }
            }
        }
        return null;

    }
    public static ArrayList<DynForm> getFormList(String assetType){
        ArrayList<DynForm> _formList=new ArrayList<>();
        if(formList !=null) {
            for (DynForm form : formList) {
                if (form.isAssetTypeInList(assetType)) {
                    try {
                        DynForm newForm = (DynForm) form.clone();
                        newForm.cloneFieldList(form.getFormControlList());
                        _formList.add((DynForm) newForm);
                    } catch (CloneNotSupportedException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        return _formList;
    }

    public static ArrayList<DynForm> getFormList(){
        return formList;
    }
    public static ArrayList<DynForm> getFormList(boolean taskForms){
        ArrayList<DynForm> _formList=new ArrayList<>();
        for(DynForm form: formList){
            if(form.getFormSettings().getTarget().equals("task")){
                _formList.add(form);
            }
        }
        return _formList;
    }
    public static void loadSampleFormList(){
        ArrayList<DynForm> _formList=new ArrayList<>();
        for(int i=1;i<4;i++){
            String formName="Form " + i;

            try {
                JSONObject jo =new JSONObject();
                JSONArray ja=new JSONArray();
                jo.put("id", formName+"Id");
                jo.put("fieldName",formName+" Name");
                jo.put("fieldType","text");
                ja.put(jo);
                jo=new JSONObject();
                jo.put("id", formName +"-customerCategory");
                jo.put("fieldName","Category");
                jo.put("fieldType","list");
                jo.put("options",new JSONArray("[\"Gold\", \"Silver\", \"Bronze\"]"));
                ja.put(jo);

                if(i==2) {
                    jo = new JSONObject();
                    jo.put("id", formName + "-customerCheckBox");
                    jo.put("fieldName", "Available");
                    jo.put("fieldType", "checkbox");
                    ja.put(jo);
                } else if(i==3){
                    jo=new JSONObject();
                    jo.put("id", formName +"-customerType");
                    jo.put("fieldName","Type");
                    jo.put("fieldType","radioList");
                    jo.put("options",new JSONArray("[\"Type 3\", \"Type 2\", \"Type 1\"]"));
                    ja.put(jo);

                }
                jo=new JSONObject();
                jo.put("form",ja);
                DynForm form = new DynForm(jo);
                form.setFormName(formName);
                _formList.add(form);
            }catch (Exception e){
                Log.e("loadSampleFormList",e.toString());
            }
        }
        formList=_formList;
    }
    public static void loadFromListDB(Context context){
        DBHandler db=Globals.db;//new DBHandler(Globals.getDBContext());
        HashMap<String, String> items;
        items=db.getAppLookupList(Globals.APP_CONFIG_LIST_NAME,"",0);
        ArrayList<DynForm> _formList=new ArrayList<>();
        HashMap<String, DynForm> _formListMap=new HashMap<>();
        if(items !=null){

            for(String key:items.keySet()){
                String strItem=items.get(key);
                if(strItem !=""){
                    try{
                        StaticListItem item=new StaticListItem(new JSONObject(strItem));
                        DynForm form =new DynForm(new JSONArray(item.getOptParam1()));
                        form.setFormName(item.getDescription());
                        form.setFormId(item.getCode());
                        _formList.add(form);
                        _formListMap.put(form.getFormId(), form);
                    }catch (Exception e){
                        e.printStackTrace();
                    }
                }
            }
        }
        formList=_formList;
        formListMap=_formListMap;

    }
    public static void loadFormList(){
        if(!ListMap.isInitialized()){
            ListMap.initializeAllLists(Globals.getDBContext());
        }
        HashMap<String, String> items= ListMap.getListHashMap(ListMap.LIST_APP_FORMS);
        ArrayList<DynForm> _formList=new ArrayList<>();
        HashMap<String, DynForm> _formListMap=new HashMap<>();
        if(items !=null){

            for(String key:items.keySet()){
                String strItem=items.get(key);
                if(strItem !=""){
                    try{
                        StaticListItem item=new StaticListItem(new JSONObject(strItem));
                        DynForm form =new DynForm(new JSONArray(item.getOptParam1()));
                        form.setFormName(item.getDescription());
                        form.setFormId(item.getCode());
                        if(!item.getOptParam2().equals("")){
                            form.loadFormSettings(new JSONObject(item.getOptParam2()));
                        }
                        _formList.add(form);
                        _formListMap.put(form.getFormId(), form);
                    }catch (Exception e){
                        e.printStackTrace();
                    }
                }
            }
        }
        formList=_formList;
        formListMap=_formListMap;
    }

    public static void loadInfoTableList(Context context){
        DBHandler db=Globals.db;//new DBHandler(Globals.getDBContext());
        ArrayList <StaticListItem> items=new ArrayList<>();
        HashMap<String, String > hashMapInfoList=db.getAppLookupList(Globals.APP_INFO_TABLE_LIST_NAME ,"",1);
        for(String key:hashMapInfoList.keySet()){
            String strValue=hashMapInfoList.get(key);
            try {
                StaticListItem item=new StaticListItem(new JSONObject(strValue));
                items.add(item);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        infoListItems=items;
    }
    public DynFormList(JSONObject jsonObject){
        parseJsonObject(jsonObject);
    }
    public DynFormList(JSONArray ja){
        JSONObject jo =new JSONObject();
        try {
            jo.put("formList",ja);
            parseJsonObject(jo);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        try{
            ArrayList<DynForm> _formList=new ArrayList<>();
            JSONArray ja= jsonObject.getJSONArray("formList");
            for (int i=0;i<ja.length();i++){
                DynForm form=new DynForm(ja.getJSONObject(i));
                _formList.add(form);
            }
        }catch (Exception e){
            Log.e("parseJsonObject",e.toString());
            return  false;
        }
        return true;
    }

    @Override
    public JSONObject getJsonObject() {
        return null;
    }
}
