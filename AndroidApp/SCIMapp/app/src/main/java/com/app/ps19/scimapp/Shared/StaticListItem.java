package com.app.ps19.scimapp.Shared;

import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.app.ps19.scimapp.classes.IssueImage;
import com.app.ps19.scimapp.classes.IssueVoice;
import com.app.ps19.scimapp.classes.JourneyPlan;

import static android.content.ContentValues.TAG;
import static com.app.ps19.scimapp.Shared.Utilities.isImageExist;
import static com.app.ps19.scimapp.Shared.Utilities.isVoiceExist;

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
    private  boolean holdCode=false;

    public boolean isHoldCode() {
        return holdCode;
    }

    public void setHoldCode(boolean holdCode) {
        this.holdCode = holdCode;
    }

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
            if(this.optParam1.equals("")){
                this.optParam1 = jo.optString("opt1");
            }
            this.optParam2 = jo.optString("optParam2");
            if(this.optParam2.equals("")){
                this.optParam2 = jo.optString("opt2");
            }

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
        return holdCode?"":code;
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
                    DBHandler db=Globals.db;//new DBHandler(Globals.getDBContext());
                    List<StaticListItem> _items=db.getListItems(Globals.JPLAN_LIST_NAME,Globals.orgCode,"");
                    JSONObject jplanObj=new JSONObject(getOptParam1());
                    if(_items.size()==1){
                        StaticListItem _item=_items.get(0);
                        try {
                            JSONObject jo = new JSONObject(_item.getOptParam1());
                            String id = jo.getString("_id");
                            if (id.equals(code)) {
                                JSONObject mainObject = new JSONObject(_item.getOptParam1());
                                mainObject = Utilities.mergeObject(mainObject, jplanObj);
                                jplanObj = mainObject;
                            }
                        }catch (Exception e){
                            e.printStackTrace();
                        }

                    }
                    //JourneyPlan jp =new JourneyPlan(Globals.mainActivity,jplanObj);
                    //items=jp.getImageList();
                    items=makeImageList(jplanObj,status);
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
    private List<IssueImage> makeImageList(JSONObject jPlanObject,int status){
        String listName=getListName();
        List<IssueImage> items=new ArrayList<>();
        List<IssueImage>  itemsToUpload = new ArrayList<>();
        boolean blnDataChanged=false;
        if(listName.equals(Globals.JPLAN_LIST_NAME)){
            if(!optParam1.equals("")){
                try {
                    //JSONObject jp=new JSONObject(getOptParam1());
                    JSONObject jp=jPlanObject;
                    JSONArray tasks=jp.optJSONArray("tasks");
                    JSONObject joSB=jp.optJSONObject("safetyBriefing");

                    if(tasks!=null){
                        for(int i=0;i<tasks.length();i++){
                            JSONObject task=tasks.getJSONObject(i);
                            JSONArray jaMaintain=task.optJSONArray("maintenance");
                            if(jaMaintain !=null){
                                for(int j=0;j<jaMaintain.length();j++) {
                                    JSONObject joMaintain = jaMaintain.getJSONObject(j);
                                    JSONArray imageList=joMaintain.optJSONArray("imgList")!=null
                                            ?joMaintain.optJSONArray("imgList")
                                            :joMaintain.optJSONArray("*imgList");
                                    if(imageList!=null){
                                        for(int i1=0;i1<imageList.length();i1++){
                                            JSONObject image=imageList.getJSONObject(i1);
                                            int status1=image.getInt("status");
                                            if(status1==status){
                                                if(!isImageExist(items, new IssueImage(image))){
                                                    items.add(new  IssueImage(image));
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            JSONArray issues=task.optJSONArray("issues");
                            if(issues !=null){
                                for(int j=0;j<issues.length();j++){
                                    JSONObject issue=issues.getJSONObject(j);
                                    JSONArray imageList=issue.optJSONArray("imgList")!=null
                                            ?issue.optJSONArray("imgList")
                                            :issue.optJSONArray("*imgList");
                                    if(imageList!=null){
                                        for(int i1=0;i1<imageList.length();i1++){
                                            JSONObject image=imageList.getJSONObject(i1);
                                            String imageName=image.getString("imgName");
                                            int status1=image.getInt("status");
                                            if(status1==status){
                                                if(!isImageExist(items, new IssueImage(image))){
                                                    items.add(new  IssueImage(image));
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if(joSB !=null){
                        JSONArray workers=joSB.optJSONArray("workers")!=null
                                ?joSB.optJSONArray("workers")
                                :joSB.optJSONArray("*workers");
                        JSONObject signature=joSB.optJSONObject("signature");
                        if(signature!=null){
                            String imgName=signature.getString("imgName");
                            int status1=signature.getInt("status");
                            if(status1==status){
                                items.add(new IssueImage(signature));
                            }
                        }
                        if(workers !=null) {
                            for (int w = 0; w < workers.length(); w++) {
                                JSONObject worker = workers.getJSONObject(w);
                                JSONObject joSignature = worker.optJSONObject("signature");
                                if (joSignature != null) {
                                    String imgName = joSignature.getString("imgName");
                                    int status1 = joSignature.getInt("status");
                                    if(status1==status){
                                        items.add(new IssueImage(joSignature));
                                    }

                                }
                            }
                        }
                    }

                    return items;

                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }
        return items;
    }
    public boolean setImageStatus(List<IssueImage> sourceItems, HashMap<String, Integer> finalItems) {
        String listName=getListName();
        List<IssueImage> items=new ArrayList<>();
        List<IssueImage>  itemsToUpload = new ArrayList<>();
        boolean blnDataChanged=false;
        if(listName.equals(Globals.JPLAN_LIST_NAME)){
            if(!optParam1.equals("")){
                try {
                    /*
                    JourneyPlan jp =new JourneyPlan(Globals.mainActivity,new JSONObject(getOptParam1()));
                    jp.setuId(code);
                    boolean retValue= jp.setImageStatus(finalItems);
                    if(retValue){
                        jp.update();
                    }*/
                    JSONObject jp=new JSONObject(getOptParam1());
                    JSONArray tasks=jp.optJSONArray("tasks");
                    JSONObject joSB=jp.optJSONObject("safetyBriefing");

                    if(tasks!=null){
                        for(int i=0;i<tasks.length();i++){
                            JSONObject task=tasks.getJSONObject(i);
                            JSONArray jaMaintain=task.optJSONArray("maintenance");
                            if(jaMaintain !=null){
                                for(int j=0;j<jaMaintain.length();j++){
                                    JSONObject joMaintain=jaMaintain.getJSONObject(j);
                                    JSONArray imageList=joMaintain.optJSONArray("imgList")!=null
                                            ?joMaintain.optJSONArray("imgList")
                                            :joMaintain.optJSONArray("*imgList");
                                    if(imageList!=null){
                                        for(int i1=0;i1<imageList.length();i1++){
                                            JSONObject image=imageList.getJSONObject(i1);
                                            String imageName=image.getString("imgName");
                                            int status=image.getInt("status");
                                            if( finalItems.containsKey(imageName)){
                                                if(finalItems.get(imageName) != status){
                                                    image.put("status",finalItems.get(imageName));
                                                    blnDataChanged=true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            JSONArray issues=task.optJSONArray("issues");
                            if(issues !=null){
                                for(int j=0;j<issues.length();j++){
                                    JSONObject issue=issues.getJSONObject(j);
                                    JSONArray imageList=issue.optJSONArray("imgList")!=null
                                            ?issue.optJSONArray("imgList")
                                            :issue.optJSONArray("*imgList");
                                    if(imageList!=null){
                                        for(int i1=0;i1<imageList.length();i1++){
                                            JSONObject image=imageList.getJSONObject(i1);
                                            String imageName=image.getString("imgName");
                                            int status=image.getInt("status");
                                            if( finalItems.containsKey(imageName)){
                                                if(finalItems.get(imageName) != status){
                                                    image.put("status",finalItems.get(imageName));
                                                    blnDataChanged=true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if(joSB !=null){
                        JSONArray workers=joSB.optJSONArray("workers")!=null
                                ?joSB.optJSONArray("workers")
                                :joSB.optJSONArray("*workers");
                        JSONObject signature=joSB.optJSONObject("signature");
                        if(signature!=null){
                            String imgName=signature.getString("imgName");
                            int status=signature.getInt("status");
                            if (finalItems.containsKey(imgName)) {
                                if (finalItems.get(imgName) != status) {
                                    signature.put("status", finalItems.get(imgName));
                                    blnDataChanged = true;
                                }
                            }
                        }
                        if(workers !=null) {
                            for (int w = 0; w < workers.length(); w++) {
                                JSONObject worker = workers.getJSONObject(w);
                                JSONObject joSignature = worker.optJSONObject("signature");
                                if (joSignature != null) {
                                    String imgName = joSignature.getString("imgName");
                                    int status = joSignature.getInt("status");
                                    if (finalItems.containsKey(imgName)) {
                                        if (finalItems.get(imgName) != status) {
                                            joSignature.put("status", finalItems.get(imgName));
                                            blnDataChanged = true;
                                        }
                                    }

                                }
                            }
                        }
                    }

                    if(blnDataChanged){
                        DBHandler db =Globals.db;// new DBHandler(Globals.getDBContext());
                        List<StaticListItem> pendingItems=db.getMsgListItems(getListName(), Globals.orgCode,"code='"+getCode() +"' AND status="+Globals.MESSAGE_STATUS_READY_TO_POST);
                        if(pendingItems.size()>0){
                            StaticListItem pendingItem=pendingItems.get(0);
                            try {
                                JSONObject jo1=new JSONObject(pendingItem.getOptParam1());
                                jo1= Utilities.addObject(jo1,jp);
                                pendingItem.setOptParam1(jo1.toString());
                                db.AddOrUpdateMsgList(pendingItem.getListName(),Globals.orgCode,pendingItem,Globals.MESSAGE_STATUS_READY_TO_POST);
                            } catch (Exception e) {
                                e.printStackTrace();
                            }

                        }else {
                            db.AddOrUpdateMsgList(getListName(), Globals.orgCode, this, Globals.MESSAGE_STATUS_READY_TO_POST);
                        }
                        //db.close();

                    }
                    return blnDataChanged;

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
                    JSONObject jplanObj=new JSONObject(getOptParam1());

                    DBHandler db=Globals.db;//new DBHandler(Globals.getDBContext());
                    List<StaticListItem> _items=db.getListItems(Globals.JPLAN_LIST_NAME,Globals.orgCode,"");
                    if(_items.size()==1){
                        StaticListItem _item=_items.get(0);
                        try {
                            JSONObject jo = new JSONObject(_item.getOptParam1());
                            String id = jo.getString("_id");
                            if (id.equals(code)) {
                                JSONObject mainObject = new JSONObject(_item.getOptParam1());
                                mainObject = Utilities.mergeObject(mainObject, jplanObj);
                                jplanObj = mainObject;
                            }
                        }catch (Exception e){
                            e.printStackTrace();
                        }
                    }

                    //JourneyPlan jp =new JourneyPlan(Globals.mainActivity,jplanObj);
                    //items=jp.getVoiceList();
                    items=makeVoiceList(jplanObj,status);
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
    private List<IssueVoice> makeVoiceList(JSONObject jPlanObject,int status) {
        String listName=getListName();
        List<IssueVoice> items=new ArrayList<>();
        boolean blnDataChanged=false;
        if(listName.equals(Globals.JPLAN_LIST_NAME)){
            if(!optParam1.equals("")){
                try {
                    //JSONObject jp=new JSONObject(getOptParam1());
                    JSONObject jp=jPlanObject;
                    JSONArray tasks=jp.optJSONArray("tasks");

                    if(tasks!=null){
                        for(int i=0;i<tasks.length();i++){
                            JSONObject task=tasks.getJSONObject(i);
                            JSONArray jaMaintain=task.optJSONArray("maintenance");
                            if(jaMaintain !=null){
                                for(int j=0;j<jaMaintain.length();j++){
                                    JSONObject joMaintain=jaMaintain.getJSONObject(j);
                                    JSONArray voiceList=
                                            joMaintain.optJSONArray("voiceList")
                                                    !=null?joMaintain.optJSONArray("voiceList")
                                                    :joMaintain.optJSONArray("*voiceList");
                                    if(voiceList!=null){
                                        for(int i1=0;i1<voiceList.length();i1++){
                                            JSONObject voice=voiceList.getJSONObject(i1);
                                            int status1=voice.getInt("status");
                                            if(status==status1){
                                                if(!isVoiceExist(items, new IssueVoice(voice))){
                                                    items.add(new IssueVoice(voice));
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            JSONArray issues=task.optJSONArray("issues");
                            if(issues !=null){
                                for(int j=0;j<issues.length();j++){
                                    JSONObject issue=issues.getJSONObject(j);
                                    JSONArray voiceList=
                                            issue.optJSONArray("voiceList")
                                                    !=null?issue.optJSONArray("voiceList")
                                                    :issue.optJSONArray("*voiceList");
                                    if(voiceList!=null){
                                        for(int i1=0;i1<voiceList.length();i1++){
                                            JSONObject voice=voiceList.getJSONObject(i1);
                                            String voiceName=voice.getString("voiceName");
                                            int status1=voice.getInt("status");
                                            if(status==status1){
                                                if(!isVoiceExist(items, new IssueVoice(voice))){
                                                    items.add(new IssueVoice(voice));
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }
        return items;
    }


    public boolean setVoiceStatus(List<IssueVoice> sourceItems, HashMap<String, Integer> finalItems) {
        String listName=getListName();
        List<IssueImage> items=new ArrayList<>();
        List<IssueImage>  itemsToUpload = new ArrayList<>();
        boolean blnDataChanged=false;
        if(listName.equals(Globals.JPLAN_LIST_NAME)){
            if(!optParam1.equals("")){
                try {
                    /*
                    JourneyPlan jp =new JourneyPlan(Globals.mainActivity,new JSONObject(getOptParam1()));
                    jp.setuId(code);
                    boolean retValue= jp.setVoiceStatus(finalItems);
                    if(retValue){
                        jp.update();
                    }*/
                    JSONObject jp=new JSONObject(getOptParam1());
                    JSONArray tasks=jp.optJSONArray("tasks");

                    if(tasks!=null){
                        for(int i=0;i<tasks.length();i++){
                            JSONObject task=tasks.getJSONObject(i);
                            JSONArray jaMaintain=task.optJSONArray("maintenance");
                            if(jaMaintain !=null){
                                for(int j=0;j<jaMaintain.length();j++){
                                    JSONObject joMaintain=jaMaintain.getJSONObject(j);
                                    JSONArray voiceList=
                                            joMaintain.optJSONArray("voiceList")
                                                    !=null?joMaintain.optJSONArray("voiceList")
                                                    :joMaintain.optJSONArray("*voiceList");
                                    if(voiceList!=null){
                                        for(int i1=0;i1<voiceList.length();i1++){
                                            JSONObject voice=voiceList.getJSONObject(i1);
                                            String voiceName=voice.getString("voiceName");
                                            int status=voice.getInt("status");
                                            if( finalItems.containsKey(voiceName)){
                                                if(finalItems.get(voiceName) != status){
                                                    voice.put("status",finalItems.get(voiceName));
                                                    blnDataChanged=true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            JSONArray issues=task.optJSONArray("issues");
                            if(issues !=null){
                                for(int j=0;j<issues.length();j++){
                                    JSONObject issue=issues.getJSONObject(j);
                                    JSONArray voiceList=
                                            issue.optJSONArray("voiceList")
                                                    !=null?issue.optJSONArray("voiceList")
                                                    :issue.optJSONArray("*voiceList");
                                    if(voiceList!=null){
                                        for(int i1=0;i1<voiceList.length();i1++){
                                            JSONObject voice=voiceList.getJSONObject(i1);
                                            String voiceName=voice.getString("voiceName");
                                            int status=voice.getInt("status");
                                            if( finalItems.containsKey(voiceName)){
                                                if(finalItems.get(voiceName) != status){
                                                    voice.put("status",finalItems.get(voiceName));
                                                    blnDataChanged=true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if(blnDataChanged){
                        DBHandler db =Globals.db;// new DBHandler(Globals.getDBContext());
                        List<StaticListItem> pendingItems=db.getMsgListItems(getListName(), Globals.orgCode,"code='"+getCode() +"' AND status="+Globals.MESSAGE_STATUS_READY_TO_POST);
                        if(pendingItems.size()>0){
                            StaticListItem pendingItem=pendingItems.get(0);
                            try {
                                JSONObject jo1=new JSONObject(pendingItem.getOptParam1());
                                jo1= Utilities.addObject(jo1,jp);
                                pendingItem.setOptParam1(jo1.toString());
                                db.AddOrUpdateMsgList(pendingItem.getListName(),Globals.orgCode,pendingItem,Globals.MESSAGE_STATUS_READY_TO_POST);
                            } catch (Exception e) {
                                e.printStackTrace();
                            }

                        }else {
                            db.AddOrUpdateMsgList(getListName(), Globals.orgCode, this, Globals.MESSAGE_STATUS_READY_TO_POST);
                        }
                        //db.close();

                    }

                    return blnDataChanged;

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
