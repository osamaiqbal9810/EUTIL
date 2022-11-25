package com.app.ps19.scimapp.classes;

import android.content.Context;

import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.Shared.IConvertHelper;
import com.app.ps19.scimapp.Shared.Utilities;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;

public class JourneyPlanOpt implements IConvertHelper {

    public String getCode() {
        if(getId()!=null && !getId().equals("")){
            return this.id;
        }
        return privateKey;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getuId() {
        return uId;
    }

    public void setuId(String uId) {
        this.uId = uId;
    }

    public String getStartDateTime() {
        return startDateTime;
    }

    public void setStartDateTime(String startDateTime) {
        this.startDateTime = startDateTime;
    }

    public String getEndDateTime() {
        return endDateTime;
    }

    public void setEndDateTime(String endDateTime) {
        this.endDateTime = endDateTime;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getWorkplanTemplateId() {
        return workplanTemplateId;
    }

    public void setWorkplanTemplateId(String workplanTemplateId) { this.workplanTemplateId = workplanTemplateId; }

    public Context getContext() {
        return context;
    }

    public void setContext(Context context) {
        this.context = context;
    }

    public String getPrivateKey() {
        return privateKey;
    }

    public void setPrivateKey(String privateKey) {
        this.privateKey = privateKey;
    }

    public void setCompletion(Completion completion) {
        this.completion = completion;
    }

    public Completion getCompletion() {
        return completion;
    }

    public boolean isLoadCompletion() {
        return loadCompletion;
    }

    public void setLoadCompletion(boolean loadCompletion) {
        this.loadCompletion = loadCompletion;
    }

    public void setNextDueDate(String nextDueDate) {
        this.nextDueDate = nextDueDate;
    }

    public String getArea() {
        return area;
    }
    public void setArea(String area) {
        this.area = area;
    }

    public String getNextDueDate() {
        return nextDueDate;
    }

    public Date getNextDueDateToDate() {
        if(nextDueDate.equals("")){
            return null;
        }
        Date date=Utilities.parseMomentDate(nextDueDate);
        return date;
    }

    public void setLoadUnitList(boolean loadUnitList) {
        this.loadUnitList = loadUnitList;
    }

    public boolean isLoadUnitList() {
        return loadUnitList;
    }

    private String code="";
    private String date;
    private String id;
    private String uId="";
    private String startDateTime = "";
    private String endDateTime = "";
    private String type = "";
    private String status = "";
    private String title;
    private String area = "";
    private String workplanTemplateId="";
    private String privateKey="";
    private String nextDueDate="";
    private Context context;
    private JourneyPlan journeyPlan;
    private Completion completion;
    private ArrayList<UnitsOpt> unitList;
    private HashMap<String, UnitsOpt> unitListHashMap;
    private boolean loadCompletion=false;
    private boolean loadUnitList=false;
    private int color= Globals.COLOR_TEST_NOT_ACTIVE;
    private String lastInspection="";
    private int sortOrder=100;
    private boolean loadAllUnits=false;

    public HashMap<String, UnitsOpt> getUnitListHashMap() {
        return unitListHashMap;
    }

    public void setLoadAllUnits(boolean loadAllUnits) {
        this.loadAllUnits = loadAllUnits;
    }

    public boolean isLoadAllUnits() {
        return loadAllUnits;
    }

    public void setSortOrder(int sortOrder) {
        this.sortOrder = sortOrder;
    }

    public int getSortOrder() {
        return sortOrder;
    }

    public ArrayList<UnitsOpt> getUnitList() {
        return unitList;
    }

    public void setUnitList(ArrayList<UnitsOpt> unitList) {
        this.unitList = unitList;
    }

    public void setLastInspection(String lastInspection) {
        this.lastInspection = lastInspection;
    }

    public String getLastInspection() {
        return lastInspection;
    }

    public void setColor(int color) {
        this.color = color;
    }

    public int getColor() {
        return color;
    }

    public JourneyPlanOpt(JSONObject jo){
        parseJsonObject(jo);
    }

    public JourneyPlanOpt(JSONObject jo,boolean loadCompletion){
        this.loadCompletion=loadCompletion;
        parseJsonObject(jo);
    }
    public JourneyPlanOpt(JSONObject jo,boolean loadCompletion,boolean loadUnitList){
        this.loadCompletion=loadCompletion;
        this.loadUnitList=loadUnitList;
        parseJsonObject(jo);
    }
    public JourneyPlanOpt(JSONObject jo,boolean loadCompletion,boolean loadUnitList, boolean loadAllUnits){
        this.loadCompletion=loadCompletion;
        this.loadUnitList=loadUnitList;
        this.loadAllUnits=loadAllUnits;
        parseJsonObject(jo);
    }


    public JourneyPlan loadJourneyPlan(boolean force){
        if(journeyPlan==null || force){
            journeyPlan=Inbox.loadJourneyPlan(Globals.getDBContext(),getCode());
        }
        return journeyPlan;
    }

    public JourneyPlan loadJourneyPlan(){
        if(journeyPlan==null){
            journeyPlan=Inbox.loadJourneyPlan(Globals.getDBContext(),getCode());
        }
        return journeyPlan;
    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        this.date = jsonObject.optString("date");
        setId(jsonObject.optString("_id"));
        setuId(jsonObject.optString("_id"));
        setWorkplanTemplateId(jsonObject.optString("workplanTemplateId"));
        setTitle(jsonObject.optString("title"));
        setStartDateTime(jsonObject.optString("startDateTime",""));
        setEndDateTime(jsonObject.optString("endDateTime",""));
        setStatus(jsonObject.optString("status",""));
        setPrivateKey(jsonObject.optString("privateKey",""));
        setNextDueDate(jsonObject.optString("nextDueDate",""));
        setLastInspection(jsonObject.optString("lastInspection",""));

        if(isLoadCompletion()) {
            JSONObject joCompletion = jsonObject.optJSONObject("completion");
            if(joCompletion!=null){
                this.completion=new Completion(joCompletion);
            }
        }
        if(isLoadUnitList()){
            JSONArray jaTask = jsonObject.optJSONArray("tasks");
            if(jaTask !=null){
                JSONObject joTask=jaTask.optJSONObject(0);
                if(joTask!=null){
                    JSONArray jaUnitList=joTask.optJSONArray("units");

                    ArrayList<UnitsOpt> _unitList=new ArrayList<>();
                    if(jaUnitList !=null){
                        int jpColor=Globals.COLOR_TEST_NOT_ACTIVE;
                        int jpSortOrder=this.sortOrder;
                        for(int i=0;i<jaUnitList.length();i++){
                            UnitsOpt unitsOpt=new UnitsOpt(jaUnitList.optJSONObject(i));
                            if( i == 0){

                                AssetType assetType =  Globals.assetTypes.get(unitsOpt.getAssetType());
                                if(assetType != null) {
                                    if (assetType.isLocation() && assetType.isPlanable()) {
                                        setArea(unitsOpt.getUnitLocation());
                                    }
                                }
                            }
                            if(unitsOpt.getTestList().size()>0){
                                _unitList.add(unitsOpt);
                                if (unitsOpt.getColor() == Globals.COLOR_TEST_ACTIVE || unitsOpt.getColor()==Globals.COLOR_TEST_EXPIRING) {
                                    jpSortOrder=Math.min(jpSortOrder,unitsOpt.getSortOrder());
                                    if(jpColor!=Globals.COLOR_TEST_EXPIRING){
                                        jpColor=unitsOpt.getColor();

                                    }
                                }

                            } else if(isLoadAllUnits()){
                                _unitList.add(unitsOpt);
                            }
                        }
                        setColor(jpColor);
                        if(jpColor==Globals.COLOR_TEST_NOT_ACTIVE){
                            setSortOrder(1000);
                        }else {
                            setSortOrder(jpSortOrder);
                        }
                    }
                    Collections.sort(_unitList, new Comparator<UnitsOpt>() {
                        @Override
                        public int compare(UnitsOpt o1, UnitsOpt o2) {
                            return o1.getSortOrder()-o2.getSortOrder();
                        }
                    });
                    HashMap<String, UnitsOpt> _unitListHashMap=new HashMap<>();
                    for(UnitsOpt u:_unitList){
                        _unitListHashMap.put(u.getUnitId(),u);
                    }
                    this.unitListHashMap=_unitListHashMap;
                    this.unitList=_unitList;
                }
            }
        }
        return true;
    }

    @Override
    public JSONObject getJsonObject() {
        return null;
    }
    public UnitsOpt getUnitOptById(String unitId){
        return this.unitListHashMap.get(unitId);
    }
}
