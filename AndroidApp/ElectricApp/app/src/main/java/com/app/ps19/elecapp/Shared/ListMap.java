package com.app.ps19.elecapp.Shared;

import android.content.Context;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.StringTokenizer;

/**
 * Created by Ajaz Ahmad Qureshi on 8/17/2017.
 */

public  class ListMap {
    private  static HashMap<String , Object> listLookups=new HashMap<String,Object>();
    //private  static HashMap<String, String > lookup=new HashMap<String, String>();
    private static Context context;
    public static final int LIST_EMPLOYEE=1;
    public static final int LIST_SURVEY=2;
    public static final int LIST_QUESTION_CODES=3;
    public static final int LIST_NSR=4;
    public static final int LIST_PRODUCTS=5;
    public static final int LIST_PRODUCTS_CAT=6;
    public static final int LIST_CATEGORY=7;
    public static final int LIST_PRIORITY=8;
    public static final int LIST_SETTINGS=9;
    public static final int LIST_REM_ACTIONS=10;
    public static final int LIST_APP_FORMS=11;
    public static final int LIST_APP_CONFIG=12;
    public static final int LIST_TEMPLATES=13;

    public static HashMap<String, Object> getListLookups() {
        return listLookups;
    }

    public  static boolean isInitialized()
    {
        return (listLookups.size()!=0);
    }

    public static boolean initializeAllLists(Context context)
    {
        if(ListMap.context==null) {
            ListMap.context = context;
        }
        boolean retValue=false;
        //retValue=loadList(LIST_SURVEY) & loadList(LIST_QUESTION_CODES)& loadList(LIST_NSR) & loadList(LIST_PRODUCTS)& loadList(LIST_PRODUCTS_CAT);
        retValue=loadList(LIST_CATEGORY) & loadList(LIST_PRIORITY)
                & loadList(LIST_SETTINGS)  & loadList(LIST_REM_ACTIONS) & loadList(LIST_APP_FORMS)
                & loadList(LIST_APP_CONFIG)
                & loadList(LIST_TEMPLATES);;

        initConfig();
        return  retValue;
    }
    public static void initConfig(){
        try {
            String rule213Config = getConfigValue(Globals.isRule213ReqConfig);
            String mpConfig = getConfigValue(Globals.isMPRequireConfig);
            String traverseTrackConfig = getConfigValue(Globals.isTrackTraverseRequireConfig);
            String isTaskViewConfig = getConfigValue(Globals.isByPassTaskViewConfig);
            String isRailDirectionConfig = getConfigValue(Globals.isRailDirectionConfig);
            String isUseDefaultAssetConfig = getConfigValue(Globals.isUseDefaultAssetConfig);
            String isInspectionTypeConfig = getConfigValue(Globals.isInspectionTypeConfig);
            String isWConditionConfig = getConfigValue(Globals.isWConditionConfig);
            String tempSign = getConfigValue(Globals.tempSign);
            String distanceSign = getConfigValue(Globals.distanceSign);
            String postSign = getConfigValue(Globals.postSign);
            String traverseBy = getConfigValue(Globals.defTraverseBy);
            String observeOpt = getConfigValue(Globals.defaultObserveOpt);
            String audibleNotification = getConfigValue(Globals.isAudibleNotification);

            Globals.COLOR_TEST_NOT_ACTIVE=Utilities.checkColorValue(getConfigValue(Globals.colorCodingNaConfig),"darkgray");
            Globals.COLOR_TEST_ACTIVE=Utilities.checkColorValue(getConfigValue(Globals.colorCodingAConfig),Globals.Green);
            Globals.COLOR_TEST_EXPIRING=Utilities.checkColorValue(getConfigValue(Globals.colorCodingExpConfig),"#FFFF0000");



            if(rule213Config!= null && !rule213Config.equals("")){
                Globals.isHideRule213 = Boolean.parseBoolean(rule213Config);
            }
            if(mpConfig!= null && !mpConfig.equals("")){
                Globals.isMpReq = Boolean.parseBoolean(mpConfig);
            }
            if(traverseTrackConfig!= null && !traverseTrackConfig.equals("")){
                Globals.isTraverseReq = Boolean.parseBoolean(traverseTrackConfig);
            }
            if(isTaskViewConfig!= null && !isTaskViewConfig.equals("")){
                Globals.isBypassTaskView = Boolean.parseBoolean(isTaskViewConfig);
            }
            if(isRailDirectionConfig!= null && !isRailDirectionConfig.equals("")){
                Globals.isUseRailDirection = Boolean.parseBoolean(isRailDirectionConfig);
            }
            if(isUseDefaultAssetConfig!= null && !isUseDefaultAssetConfig.equals("")){
                Globals.isUseDefaultAsset = Boolean.parseBoolean(isUseDefaultAssetConfig);
            }
            if(isInspectionTypeConfig!= null && !isInspectionTypeConfig.equals("")){
                Globals.isInspectionTypeReq = Boolean.parseBoolean(isInspectionTypeConfig);
            }
            if(isWConditionConfig!= null && !isWConditionConfig.equals("")){
                Globals.isWConditionReq = Boolean.parseBoolean(isWConditionConfig);
            }
            if(tempSign!= null && !tempSign.equals("")){
                Globals.selectedTempSign = tempSign;
            }
            if(distanceSign!= null && !distanceSign.equals("")){
                Globals.selectedDistanceSign = distanceSign;
            }
            if(postSign!= null && !postSign.equals("")){
                Globals.selectedPostSign = postSign;
            }
            if(traverseBy!= null && !traverseBy.equals("")){
                Globals.selectedTraverseBy = traverseBy;
            }
            if(observeOpt!= null && !observeOpt.equals("")){
                Globals.selectedObserveOpt = observeOpt;
            }
            if(audibleNotification!= null && !audibleNotification.equals("")){
                Globals.isAudibleNotificationAllowed = Boolean.parseBoolean(audibleNotification);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public static boolean loadList(int listId)
    {
        DBHandler db=Globals.db;//new DBHandler(Globals.getDBContext());
        switch (listId)
        {
            case LIST_TEMPLATES:
                listLookups.put(String.valueOf(LIST_TEMPLATES), db.getWorkPlanTemplateList());
                return true;
            case LIST_APP_CONFIG:
                listLookups.put(String.valueOf(LIST_APP_CONFIG), db.getAppLookupList(Globals.APP_CONFIG_LIST_NAME,"",0));
                //db.close();
                return true;

            case LIST_APP_FORMS:
                listLookups.put(String.valueOf(LIST_APP_FORMS), db.getAppLookupList(Globals.APP_FORMS_LIST_NAME,""));
                //db.close();
                return true;

            case LIST_REM_ACTIONS:
                listLookups.put(String.valueOf(LIST_REM_ACTIONS), db.getAppLookupList(Globals.REM_ACTION_LIST_NAME,""));
                //db.close();
                return true;

            case LIST_CATEGORY:
                listLookups.put(String.valueOf(LIST_CATEGORY), db.getAppLookupList(Globals.CATEGORY_LIST_NAME));
                //db.close();
                return true;

            case LIST_PRIORITY:
                listLookups.put(String.valueOf(LIST_PRIORITY), db.getAppLookupList(Globals.PRIORITY_LIST_NAME));
                //db.close();
                return true;

            case LIST_SURVEY:
                listLookups.put(String.valueOf(LIST_SURVEY), db.getSurveyList());
                //db.close();
                return  true;
            case LIST_QUESTION_CODES:
                listLookups.put(String.valueOf(LIST_QUESTION_CODES), db.getSurveyQuestionList());
                //db.close();
                return  true;

            case LIST_NSR:
                listLookups.put(String.valueOf(LIST_NSR), db.getNSRList());
                //db.close();
                return  true;
            case LIST_PRODUCTS:
                listLookups.put(String.valueOf(LIST_PRODUCTS), db.getProductList());
                //db.close();
                return  true;
            case LIST_PRODUCTS_CAT:
                listLookups.put(String.valueOf(LIST_PRODUCTS_CAT), db.getProductCatList());
                //db.close();
                return  true;
            case LIST_SETTINGS:
                listLookups.put(String.valueOf(LIST_SETTINGS), db.getAppLookupList(Globals.APP_SETTINGS_LIST_NAME));
                //db.close();
                return true;
        }
        return  false;

    }
    public static String getListValue(int listId,String key)
    {
        HashMap<String,String >lookup=(HashMap<String, String>) listLookups.get(String.valueOf(listId));
        if(lookup!=null)
        {
            return lookup.get(key);
        }
        return "";
    }

    public static HashMap<String, String> getListHashMap(int listId)
    {
        return  (HashMap<String, String>) listLookups.get(String.valueOf(listId));
    }

    public static List<String> getListHashMapSorted(int listId)
    {
        HashMap<String, String> items=(HashMap<String, String>)listLookups.get(String.valueOf(listId));
        HashMap<String, StaticListItem> codeMap=new HashMap<>();
        for(String key:items.keySet()){
            String strItem=items.get(key);
            try {
                StaticListItem sItem=new StaticListItem(new JSONObject(strItem));
                codeMap.put(sItem.getCode(),sItem);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        List sortedKeys=new ArrayList(codeMap.keySet());
        Collections.sort(sortedKeys);
        HashMap<String, String> sItems=new HashMap<>();
        List sortedItems =new ArrayList();

        for(Object sortedKey:sortedKeys){
            String key=(String) sortedKey;
            String desc=codeMap.get(key).getDescription();
            sItems.put(desc,items.get(desc));
            sortedItems.add(desc);
        }

        return sortedItems;
    }

    public static ArrayList<String> getList(int listId) {
        ArrayList<String> itemList = new ArrayList<>();

        HashMap<String, String> list = (HashMap<String, String>) listLookups.get(String.valueOf(listId));
        for (String key : list.keySet()) {
            itemList.add(list.get(key));
        }
        return itemList;
    }
    public static String [] getProductList(String strProductCat)
    {
        String prodList=getListValue(LIST_PRODUCTS_CAT,strProductCat);
        StringTokenizer stringTokenizer=new StringTokenizer(prodList,",");

        //String [] prodListAry=prodList.split(",");
        String [] prodListAry=new String[stringTokenizer.countTokens()];

        for(int i=0;i<stringTokenizer.countTokens();i++)
        {
            String code=stringTokenizer.nextToken();
            String product=getListValue(LIST_PRODUCTS,code);
            String desc="";
            try {
                JSONObject jo=new JSONObject(product);
                desc=jo.getString("desc");
            } catch (JSONException e) {
                e.printStackTrace();
                desc="<Not Found>";
            }
            prodListAry[i]=code +"."+ desc;
        }
        return prodListAry;
    }
    public static String [] getProductList(String strProductCat,String strProductCode)
    {
        String prodList=getListValue(LIST_PRODUCTS_CAT,strProductCat);
        StringTokenizer stringTokenizer=new StringTokenizer(prodList,",");
        final int count=stringTokenizer.countTokens();
        String [] prodListAry=new String[count];
        for(int i=0;i<count;i++)
        {
            String code=stringTokenizer.nextToken();
            if(code.equals(strProductCode) || strProductCode.equals(""))
            {
                String product=getListValue(LIST_PRODUCTS,code);
                String desc="";
                try {
                    JSONObject jo=new JSONObject(product);
                    desc=jo.getString("desc");
                } catch (JSONException e) {
                    e.printStackTrace();
                    desc="<Not Found>";
                }
                prodListAry[i]=code+"."+desc;
            }
        }
        return prodListAry;
    }
    public static List<String> getProductListArray(String strProductCat,String strProductCode)
    {
        String prodList=getListValue(LIST_PRODUCTS_CAT,strProductCat);
        StringTokenizer stringTokenizer=new StringTokenizer(prodList,",");
        final int count=stringTokenizer.countTokens();
        String [] prodListAry=new String[count];
        List<String> strArray=new ArrayList<>();
        for(int i=0;i<count;i++)
        {
            String code=stringTokenizer.nextToken();
            if(code.equals(strProductCode) || strProductCode.equals(""))
            {
                String product=getListValue(LIST_PRODUCTS,code);
                String desc="";
                try {
                    JSONObject jo=new JSONObject(product);
                    desc=jo.getString("desc");
                } catch (JSONException e) {
                    e.printStackTrace();
                    desc="<Not Found>";
                }
                prodListAry[i]=code+"."+desc;
                strArray.add(code+"."+desc);
            }
        }
        return strArray;
    }
    public static String getConfigValue(String key){
        return getConfigValue(key,3);
    }

    public static String getConfigValue(String key, int col ){
        HashMap<String, String> list=getListHashMap(LIST_APP_CONFIG);
        if(list !=null && list.size() != 0){
            String value=list.get(key);
            if(value!=null && !value.equals("")){
                try {
                    StaticListItem item=new StaticListItem( new JSONObject(value));
                    switch (col){
                        case 0:
                            return item.getCode();
                        case 1:
                            return item.getDescription();
                        case 2:
                            return item.getOptParam1();
                        default:
                            return item.getOptParam2();
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }
        return null;
    }

    public static JSONObject getProductObject(int productId)
    {
        try{
            JSONObject jo =new JSONObject(getListValue(LIST_PRODUCTS,String.valueOf(productId)));
            return  jo;

        }catch (Exception e)
        {
            Log.e("getProductObject","MapList:"+e.toString());
        }
        return null;
    }
    public static String getProductDescription(int productId)
    {
        try
        {
            JSONObject jo=getProductObject(productId);
            if(jo !=null)
            {
                return jo.getString("desc");
            }
        }catch (Exception ex)
        {
            Log.e("getProductDescription", ex.toString());
        }
        return "";
    }
}
