package com.app.ps19.hosapp.Shared;

import android.content.Context;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
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

    public  static boolean isInitialized()
    {
        return (listLookups.size()!=0);
    }

    public static boolean initializeAllLists(Context context)
    {
        ListMap.context=context;
        boolean retValue=false;
        //retValue=loadList(LIST_SURVEY) & loadList(LIST_QUESTION_CODES)& loadList(LIST_NSR) & loadList(LIST_PRODUCTS)& loadList(LIST_PRODUCTS_CAT);
        retValue=loadList(LIST_CATEGORY) & loadList(LIST_PRIORITY);
        return  retValue;
    }

    public static boolean loadList(int listId)
    {
        DBHandler db=new DBHandler(context);
        switch (listId)
        {
            case LIST_CATEGORY:
                listLookups.put(String.valueOf(LIST_CATEGORY), db.getAppLookupList(Globals.CATEGORY_LIST_NAME));
                db.close();
                return true;

            case LIST_PRIORITY:
                listLookups.put(String.valueOf(LIST_PRIORITY), db.getAppLookupList(Globals.PRIORITY_LIST_NAME));
                db.close();
                return true;

            case LIST_SURVEY:
                listLookups.put(String.valueOf(LIST_SURVEY), db.getSurveyList());
                db.close();
                return  true;
            case LIST_QUESTION_CODES:
                listLookups.put(String.valueOf(LIST_QUESTION_CODES), db.getSurveyQuestionList());
                db.close();
                return  true;

            case LIST_NSR:
                listLookups.put(String.valueOf(LIST_NSR), db.getNSRList());
                db.close();
                return  true;
            case LIST_PRODUCTS:
                listLookups.put(String.valueOf(LIST_PRODUCTS), db.getProductList());
                db.close();
                return  true;
            case LIST_PRODUCTS_CAT:
                listLookups.put(String.valueOf(LIST_PRODUCTS_CAT), db.getProductCatList());
                db.close();
                return  true;
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
