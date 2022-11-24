package com.app.ps19.hosapp.Shared;

import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.app.ps19.hosapp.classes.IssueImage;
import com.app.ps19.hosapp.classes.IssueVoice;
import com.app.ps19.hosapp.classes.JourneyPlan;

import static android.content.ContentValues.TAG;

/**
 * Created by Ajaz Ahmad Qureshi on 6/19/2017.
 */

public class StaticListItem {
    private String orgCode;
    private String listName;
    private  String code;
    private String description;
    private String optParam1;
    private String optParam2;
    private  int status=0;

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public StaticListItem() {
    }

    public StaticListItem(String orgCode, String listName, String code, String description, String optParam1, String optParam2) {
        this.orgCode = orgCode;
        this.listName = listName;
        this.code = code;
        this.description = description;
        this.optParam1 = optParam1;
        this.optParam2 = optParam2;
    }
    public StaticListItem(JSONObject jo){
        try {
            this.orgCode = jo.getString("tenantId");
            this.listName = jo.getString("listName");
            this.code = jo.getString("code");
            this.description = jo.getString("description");
            this.optParam1 = jo.optString("optParam1");
            this.optParam2 = jo.optString("optParam2");
        }catch (Exception e){
            Log.e(TAG, e.toString());
        }

    }
    public String getOrgCode() {
        return orgCode;
    }

    public void setOrgCode(String orgCode) {
        this.orgCode = orgCode;
    }

    public String getListName() {
        return listName;
    }

    public void setListName(String listName) {
        this.listName = listName;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOptParam1() {
        return optParam1;
    }

    public void setOptParam1(String optParam1) {
        this.optParam1 = optParam1;
    }

    public String getOptParam2() {
        return optParam2;
    }

    public void setOptParam2(String optParam2) {
        this.optParam2 = optParam2;
    }
    public JSONObject getJSONObject()
    {
        JSONObject jo=new JSONObject();
       try {
           jo.put("code", getCode());
           jo.put("desc",getDescription());
           if(optParam1!=null)
                 jo.put("opt1",optParam1);
           if(optParam2!=null)
               jo.put("opt2",optParam2);
           return jo;
       } catch (Exception e)
       {
           return  null;
       }
    }
    public JSONObject getMultiJSONObject()
    {
        JSONObject jo=new JSONObject();
        try {
            //jo.put("ltype", 0);
            jo.put("listname", getListName());
            jo.put("code", getCode());
            if(!getDescription().equals(""))
                jo.put("desc",getDescription());
            if(optParam1!=null)
                jo.put("optParam1",optParam1);
            if(optParam2!=null)
                jo.put("optParam2",optParam2);
            return jo;
        } catch (Exception e)
        {
            return  null;
        }
    }
    public List<IssueImage> getImageList(){
        return getImageList(Globals.ISSUE_IMAGE_STATUS_CREATED);
    }
    public List<IssueImage> getImageList(int status)
    {
        String listName=getListName();
        List<IssueImage> items=new ArrayList<>();
        List<IssueImage>  itemsToUpload = new ArrayList<>();
        if(listName.equals(Globals.JPLAN_LIST_NAME)){
            if(!optParam1.equals("")){
                try {
                    JourneyPlan jp =new JourneyPlan(Globals.mainActivity,new JSONObject(getOptParam1()));
                    items=jp.getImageList();
                    for(IssueImage item:items){
                        if(item.getStatus()==status){
                            itemsToUpload.add(item);
                        }
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }

            }
        }
        if(status==-1){
            return items;
        }else
        {
            return itemsToUpload;
        }

    }
    public boolean setImageStatus(List<IssueImage> sourceItems, HashMap<String, Integer> finalItems) {
        String listName=getListName();
        List<IssueImage> items=new ArrayList<>();
        List<IssueImage>  itemsToUpload = new ArrayList<>();
        if(listName.equals(Globals.JPLAN_LIST_NAME)){
            if(!optParam1.equals("")){
                try {
                    JourneyPlan jp =new JourneyPlan(Globals.mainActivity,new JSONObject(getOptParam1()));
                    boolean retValue= jp.setImageStatus(finalItems);
                    if(retValue){
                        jp.update();
                    }
                    return retValue;

                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }
        return false;
    }

    public List<IssueVoice> getVoiceList(){
        return getVoiceList(Globals.ISSUE_IMAGE_STATUS_CREATED);
    }
    public List<IssueVoice> getVoiceList(int status)
    {
        String listName=getListName();
        List<IssueVoice> items=new ArrayList<>();
        List<IssueVoice>  itemsToUpload = new ArrayList<>();
        if(listName.equals(Globals.JPLAN_LIST_NAME)){
            if(!optParam1.equals("")){
                try {
                    JourneyPlan jp =new JourneyPlan(Globals.mainActivity,new JSONObject(getOptParam1()));
                    items=jp.getVoiceList();
                    for(IssueVoice item:items){
                        if(item.getStatus()==status){
                            itemsToUpload.add(item);
                        }
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }

            }
        }
        if(status==-1){
            return items;
        }else
        {
            return itemsToUpload;
        }

    }
    public boolean setVoiceStatus(List<IssueVoice> sourceItems, HashMap<String, Integer> finalItems) {
        String listName=getListName();
        List<IssueImage> items=new ArrayList<>();
        List<IssueImage>  itemsToUpload = new ArrayList<>();
        if(listName.equals(Globals.JPLAN_LIST_NAME)){
            if(!optParam1.equals("")){
                try {
                    JourneyPlan jp =new JourneyPlan(Globals.mainActivity,new JSONObject(getOptParam1()));
                    boolean retValue= jp.setVoiceStatus(finalItems);
                    if(retValue){
                        jp.update();
                    }
                    return retValue;

                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }
        return false;
    }

    /*
    public void setImageStatus(List<String> uploadComplete, int intStatus) {

        String listName=getListName();
        List<List<String>> items=new ArrayList<>();
        List<String> allItems=new ArrayList<>();
        List<String> uploadItems=new ArrayList<>();
        boolean dataChanged=false;
        if(listName.equals(com.app.ps19.thisapp.Globals.getVisitMsgListName()))
        {
            try
            {
                //Globals.imgListAll=new ArrayList<>();
                //Globals.imgListUpload=new ArrayList<>();
                JSONArray ja =new JSONArray(optParam1);
                JSONObject jo=ja.getJSONObject(0);
                JSONArray jaQuestions=jo.optJSONArray("items");
                if(jaQuestions!=null)
                {
                    for(int i=0;i<jaQuestions.length();i++)
                    {
                        JSONObject joAns=jaQuestions.getJSONObject(i);
                        JSONArray jaAns=joAns.optJSONArray("items");
                        for(int j=0;j< jaAns.length();j++)
                        {
                            JSONObject joAI=jaAns.getJSONObject(j);
                            JSONArray jaAI=joAI.getJSONArray("items");
                            for(int k=0;k<jaAI.length();k++) {
                                JSONObject joAItems=jaAI.getJSONObject(k);
                                int ansType = joAItems.optInt("t", 0);
                                if (ansType == Globals.ANSWER_TYPE_IMAGE
                                        || ansType==Globals.ANSWER_TYPE_SCRIBBLE) {
                                    JSONArray jaAId = joAItems.optJSONArray("items");
                                    for(int l=0;l<jaAId.length();l++)
                                    {
                                        JSONObject joAIimg=jaAId.getJSONObject(l);
                                        JSONArray jaAIimg=joAIimg.getJSONArray("items");
                                        if (jaAIimg.length() >= 4) {
                                            //Globals.imgListAll.add(jaAId.getString(2));
                                            allItems.add(jaAIimg.getString(2));
                                            if(uploadComplete.contains(jaAIimg.getString(2)))
                                            {
                                                if(!jaAIimg.optString(3,"")
                                                        .equals(String.valueOf(intStatus))) {
                                                    jaAIimg.put(3, String.valueOf(intStatus));
                                                    dataChanged=true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if(dataChanged) {
                    setOptParam1(ja.toString());
                }

            }catch (Exception e)
            {
                Log.e("StaticListItem","getImageList:"+e.toString());
            }
        }

    }
    */
}
