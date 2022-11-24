package com.app.ps19.hosapp.classes;

import android.content.Context;
import android.util.Log;

import com.app.ps19.hosapp.R;
import com.app.ps19.hosapp.Shared.DBHandler;
import com.app.ps19.hosapp.Shared.Globals;
import com.app.ps19.hosapp.Shared.StaticListItem;
import com.app.ps19.hosapp.Shared.Utilities;
import com.bumptech.glide.load.model.GenericLoaderFactory;
import com.google.gson.JsonObject;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static android.content.ContentValues.TAG;

public class Inbox {
    private String employeeId;
    private ArrayList<JourneyPlan> journeyPlans;
    private ArrayList<JourneyPlan> workPlanTemplates;

    public ArrayList<JourneyPlan> getJourneyPlans() {
        return journeyPlans;
    }
    public ArrayList<JourneyPlan> getWorkPlanTemplates(){return workPlanTemplates;}

    public void setJourneyPlans(ArrayList<JourneyPlan> journeyPlans) {
        this.journeyPlans = journeyPlans;
    }

    public Inbox() {
    }

    public void load() {
    }

    public JourneyPlan getCurrentJourneyPlan(){
        //Only one Journey plan
        if(journeyPlans !=null){
            if(journeyPlans.size()>0){
                return journeyPlans.get(0);
            }
        }
        return null;
    }
    public JourneyPlan getTodaysJourneyPlan(){
        for(JourneyPlan jp:journeyPlans){
            String strDate=jp.getDate();
            SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
            try{
                Date date=sdf.parse(strDate);
                Date curSOD=Utilities.ConvertToDateTime(Globals.SOD);

                Date curDate= sdf.parse(sdf.format(new Date()));
                if(date.getTime()==curSOD.getTime()){
                    return jp;
                }

            }catch (Exception e){
                e.printStackTrace();
            }
        }
        return  null;
    }
    public void loadWorkPlanTemplates(Context context){
        DBHandler dbHandler=new DBHandler(context);
        List<StaticListItem> items = dbHandler.getListItems(Globals.WPLAN_TEMPLATE_LIST_NAME, Globals.orgCode, "", "code<>''");
        dbHandler.close();
        ArrayList<JourneyPlan> _journeyPlans = new ArrayList<>();
        for (StaticListItem item : items) {
            try {
                JSONObject jo = new JSONObject(item.getOptParam1());
                JourneyPlan jp = new JourneyPlan(context,jo);
                jp.setId(item.getCode());
                _journeyPlans.add(jp);

            } catch (Exception e) {
                Log.e(TAG, e.toString());
            }
        }
        this.workPlanTemplates = _journeyPlans;
    }
    public void loadSampleData(Context context) {
        if(Globals.mainActivity!=null){
            context=Globals.mainActivity;
        }
        DBHandler dbHandler=new DBHandler(context);
        List<StaticListItem> items = dbHandler.getListItems("JourneyPlan", Globals.orgCode, "", "code<>''");
        //dbHandler.close();

        //List<StaticListItem> items = dbHandler.getListItems(Globals.ROUTE_PLAN_LIST_NAME,Globals.orgCode,Globals.empCode);
        ArrayList<JourneyPlan> _journeyPlans = new ArrayList<>();
        for (StaticListItem item : items) {
            try {
                JSONObject jo = new JSONObject(item.getOptParam1());
                JourneyPlan jp = new JourneyPlan(context,jo);
                jp.setId(item.getCode());

                List<StaticListItem> msgItems = dbHandler.getMsgListItems(Globals.JPLAN_LIST_NAME, Globals.orgCode,"code='"+jp.getuId()+"'");
                if(msgItems.size()>0){
                    StaticListItem msgItem=msgItems.get(0);
                    if(msgItem.getStatus()== Globals.MESSAGE_STATUS_READY_TO_POST){
                        JSONObject jo1=new JSONObject(msgItem.getOptParam1());
                        jp=new JourneyPlan(context, jo1);
                        jp.mergeJsonObject(jo1);

                    }
                }
                _journeyPlans.add(jp);


             /*   JSONArray jaPlans = new JSONArray(item.getOptParam1());
                for (int i = 0; i < jaPlans.length(); i++) {
                    JSONObject joRoutePlan = jaPlans.getJSONObject(i);
                    String jpDate = joRoutePlan.getString("date");
                    List<StaticListItem> vItems = dbHandler.getListItems(Globals.VISIT_TASK_LIST_NAME, Globals.orgCode,
                            jpDate);
                    if (vItems.size() > 0) {
                        StaticListItem vItem = vItems.get(0);

                        JourneyPlan jp = new JourneyPlan(new JSONObject(vItem.getOptParam1()));
                        _journeyPlans.add(jp);
                    }
                }*/
            } catch (Exception e) {
                dbHandler.close();
                Log.e(TAG, e.toString());
            }
        }
        this.journeyPlans = _journeyPlans;
        dbHandler.close();




    }
    public void loadFromDB(Context context){

    }
    public void saveSampleData(Context context) {
        DBHandler dbHandler=new DBHandler(context);
        addSampleJP(dbHandler);
        addSampleTaskList(dbHandler);
        dbHandler.close();

    }

    private void addSampleTaskList(DBHandler db) {
        StaticListItem item=new StaticListItem();
        JSONArray jaTaskList=new JSONArray();
        JSONObject joTask = new JSONObject();
        JSONObject joTaskList = new JSONObject();

        try {
            JSONArray images = new JSONArray();
            images.put(String.valueOf(R.drawable.unit_static));
            joTask.put("date", "19 November 2018");
            joTask.put("taskId", "1");
            joTask.put("empId", "1");
            joTask.put("title", "Inspection Unit 204");
            joTask.put("description", "Milepost 10, 11");
            joTask.put("notes", "Please also check Joint bars and mark all cracked ones.");
            joTask.put("imageURL", "https://via.placeholder.com/150");
            JSONArray jaReports = new JSONArray();
            JSONObject joReport = new JSONObject();

            joReport.put("reportId", "0");
            joReport.put("category", "Rails");
            joReport.put("trackId", "TRK00021");
            joReport.put("description", "Need Repairs");
            joReport.put("location", "36.778259,-119.41493");
            joReport.put("marked", true);
            joReport.put("imgList", images);
            joReport.put("priority", "High");
            jaReports.put(joReport);
            joTask.put("reports", jaReports);
            jaTaskList.put(joTask);

            joTaskList.put("date", "19 November 2018");
            joTaskList.put("tasks", jaTaskList);

        }catch (Exception e){
            Log.e(TAG, e.toString());
        }
        item.setOrgCode(Globals.orgCode);
        item.setListName(Globals.VISIT_TASK_LIST_NAME);
        item.setCode("19 November 2018");
        item.setDescription(Globals.empCode);
        item.setOptParam1(joTaskList.toString());
        db.AddOrUpdateList(Globals.VISIT_TASK_LIST_NAME, Globals.orgCode, item);


    }

    private void addSampleJP(DBHandler db)
    {
        StaticListItem item=new StaticListItem();
        JSONArray ja = new JSONArray();
        JSONObject jo = new JSONObject();
        try {
            jo.put("date", "19 November 2018");
            ja.put(jo);
            jo = new JSONObject();
            jo.put("date", "20 November 2018");
            ja.put(jo);
        }catch (Exception e){
            Log.e(TAG,e.toString());
        }

        item.setCode(Globals.orgCode);
        item.setListName(Globals.ROUTE_PLAN_LIST_NAME);
        item.setCode(Globals.empCode);
        item.setDescription(Globals.ROUTE_PLAN_LIST_NAME);
        item.setOptParam1(ja.toString());
        db.AddOrUpdateList(Globals.ROUTE_PLAN_LIST_NAME, Globals.orgCode, item);

    }

}
