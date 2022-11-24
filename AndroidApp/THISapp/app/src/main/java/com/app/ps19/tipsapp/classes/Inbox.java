package com.app.ps19.tipsapp.classes;

import android.content.Context;
import android.os.Build;
import android.util.Log;

import com.app.ps19.tipsapp.R;
import com.app.ps19.tipsapp.Shared.DBHandler;
import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.Shared.StaticListItem;
import com.app.ps19.tipsapp.Shared.Utilities;
import com.app.ps19.tipsapp.classes.maintenance.MaintenanceList;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static android.content.ContentValues.TAG;
import static com.app.ps19.tipsapp.Shared.Globals.MAINTENANCE_LIST_NAME;
import static com.app.ps19.tipsapp.Shared.Globals.WORK_PLAN_IN_PROGRESS_STATUS;

public class Inbox {

    private String employeeId;
    private ArrayList<JourneyPlan> journeyPlans;
    private ArrayList<JourneyPlanOpt> journeyPlanOpts;
    private ArrayList<JourneyPlan> workPlanTemplates;
    private ArrayList<JSONObject> joWorkPlanTemplates;
    private ArrayList<JourneyPlanOpt> jpoWorkPlanTemplates;
    public ArrayList<JourneyPlan> getJourneyPlans() {
        return journeyPlans;
    }
    public ArrayList<JourneyPlan> getWorkPlanTemplates(){return workPlanTemplates;}
    public static byte[] prev_WorkPlanDataMessageDigest = new byte[16];
    private static LocationsOpt locationsOpt = new LocationsOpt();

    public void setDefectsList(ArrayList<UnitsDefectsOpt> defectsList) {
        this.defectsList = defectsList;
    }

    private ArrayList<UnitsDefectsOpt> defectsList;

    private boolean intiJP= false;

    public void setJourneyPlanOpts(ArrayList<JourneyPlanOpt> journeyPlanOpts) {
        this.journeyPlanOpts = journeyPlanOpts;
    }

    public ArrayList<JourneyPlanOpt> getJourneyPlanOpts() {
        return journeyPlanOpts;
    }

    public static boolean isLocalJPCode(String code){
        return code.startsWith("L-");
    }
    public static String generateLocalJPCode(){
        DBHandler db=Globals.db;
        List<StaticListItem> items=db.getMsgListItems(Globals.JPLAN_LIST_NAME,Globals.orgCode,"status="+Globals.MESSAGE_STATUS_READY_TO_POST);
        return "L-"+Utilities.getUniqueId();
    }
    public void setJourneyPlans(ArrayList<JourneyPlan> journeyPlans) {
        this.journeyPlans = journeyPlans;
    }

    public Inbox() {
    }

    public void load() {
    }

    public JourneyPlan getCurrentJourneyPlan(){
        //Only one Journey plan
/*        if(journeyPlans !=null){
            if(journeyPlans.size()>0){
                return journeyPlans.get(0);
            }
        }*/
        String strJP=Globals.getCurrentJP();
        boolean isLocalKey=isLocalJPCode(strJP);
        if(journeyPlanOpts!=null) {
            if(!strJP.equals("")) {
                for (JourneyPlanOpt jp : journeyPlanOpts) {
                    String id=isLocalKey?jp.getPrivateKey():(jp.getId()!=null && !jp.getId().equals(""))?jp.getId():jp.getPrivateKey();
                    if (id.equals(strJP)) {
                        return jp.loadJourneyPlan();
                    }
                }
            }
            if ( journeyPlanOpts.size() > 0) {
               // return journeyPlanOpts.get(0).loadJourneyPlan();
            }
        }
        return null;
    }

    public JourneyPlan getLastJourneyPlan(){
        //Only one Journey plan
/*        if(journeyPlans !=null){
            if(journeyPlans.size()>0){
                return journeyPlans.get(0);
            }
        }*/
        String strJP=Globals.getCurrentJP();
        boolean isLocalKey=isLocalJPCode(strJP);
        if(journeyPlanOpts!=null) {
            if(!strJP.equals("")) {
                for (JourneyPlanOpt jp : journeyPlanOpts) {
                    String id=isLocalKey?jp.getPrivateKey():(jp.getId()!=null && !jp.getId().equals(""))?jp.getId():jp.getPrivateKey();
                    if (id.equals(strJP)) {
                        return jp.loadJourneyPlan();
                    }
                }
            }
            if ( journeyPlanOpts.size() > 0) {
                //return journeyPlanOpts.get(0).loadJourneyPlan();
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

    public static JourneyPlan loadJourneyPlanTemplate(Context context,String code) {
        JourneyPlan journeyPlan = null;
        DBHandler dbHandler = Globals.db;//new DBHandler(Globals.getDBContext());
        List<StaticListItem> items = dbHandler.getListItems(Globals.WPLAN_TEMPLATE_LIST_NAME, Globals.orgCode, code, "code='" + code + "'");
        //dbHandler.close();
        if (items.size() == 1) {
            try {
                JSONObject jo = new JSONObject(items.get(0).getOptParam1());
                JourneyPlan jp = new JourneyPlan(context, jo);
                journeyPlan = jp;
            } catch (JSONException e) {
                e.printStackTrace();
            }

        }

        return journeyPlan;
    }

    public static JourneyPlan loadJourneyPlan(Context context,String code){
        JourneyPlan journeyPlan=null;
        DBHandler dbHandler=Globals.db;//new DBHandler(Globals.getDBContext());
        List<StaticListItem> items = dbHandler.getListItems(Globals.JPLAN_LIST_NAME, Globals.orgCode, code,"code='"+code +"'");
        //dbHandler.close();
        if(items.size()==1){
            try {
                JSONObject jo = new JSONObject();
                jo=JourneyPlan.mergePendingItem(items.get(0));
                JourneyPlan jp=new JourneyPlan(context, jo);
                if(!jp.getWorkplanTemplateId().equals("")){
                    jp.copyFormDefaults();
                }
                journeyPlan= jp;
                //Merge it with messages
                
            } catch (Exception e) {
                e.printStackTrace();
            }

        }else{
            //Check Offline Data
            List<StaticListItem> _items = dbHandler.getMsgListItems(Globals.JPLAN_LIST_NAME, Globals.orgCode, "code='"+code +"'");
            if(_items.size()==1){
                try {
                    JSONObject jo = new JSONObject(_items.get(0).getOptParam1());
                    JourneyPlan jp=new JourneyPlan(context, jo);
                    journeyPlan= jp;
                } catch (JSONException e) {
                    e.printStackTrace();
                }

            }
        }
        return journeyPlan;
    }

    public JourneyPlanOpt getWorkPlanTemplate(String templateId,boolean loadCompletion, boolean loadUnitList,boolean loadAllUnits){
        DBHandler dbHandler=Globals.db;//new DBHandler(Globals.getDBContext());
        List<StaticListItem> items = dbHandler.getListItems(Globals.WPLAN_TEMPLATE_LIST_NAME, Globals.orgCode, "", "code='"+templateId+"'");
        //dbHandler.close();
        ArrayList<JSONObject> _journeyPlans = new ArrayList<>();
        JourneyPlanOpt jpTemplate=null;
        for (StaticListItem item : items) {
            try {
                JSONObject jo = new JSONObject(item.getOptParam1());
                //jpTemplate=new JourneyPlanOpt(jo,true);
                jpTemplate=new JourneyPlanOpt(jo,loadCompletion, loadUnitList,loadAllUnits);

            } catch (Exception e) {
                Log.e(TAG, e.toString());
            }
        }
        return jpTemplate;
    }

    public JourneyPlanOpt getWorkPlanTemplate(String templateId){
        return getWorkPlanTemplate(templateId,true,false,false);
    }


    public byte[] getWPLANMessageDigest(List<StaticListItem> data){
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ObjectOutputStream oos = null;
        try {
            oos = new ObjectOutputStream(bos);
            oos.writeObject(data);
        } catch (IOException e) {
            e.printStackTrace();
        }
        byte[] bytes = bos.toByteArray();

        MessageDigest md = null;
        try {
            md = MessageDigest.getInstance("MD5");
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return md.digest(bytes);
    }

    public LocationsOpt getJPLocationOpts(){
        return locationsOpt;
    }

    public  ArrayList<UnitsDefectsOpt> getDefectsList() { return  this.defectsList; }

    public ArrayList<JourneyPlanOpt> loadWokPlanTemplateListEx(){
        DBHandler dbHandler=Globals.db;//new DBHandler(Globals.getDBContext());
        List<StaticListItem> items = dbHandler.getListItems(Globals.WPLAN_TEMPLATE_LIST_NAME, Globals.orgCode, "", "code<>''");

        byte [] currHash = getWPLANMessageDigest(items);

        if (Arrays.equals(prev_WorkPlanDataMessageDigest ,currHash) && this.jpoWorkPlanTemplates != null) {
            return this.jpoWorkPlanTemplates;

        }

        locationsOpt.clear();
        for (StaticListItem item : items) {
            try {
                JSONObject jo = new JSONObject(item.getOptParam1());
                JourneyPlanOpt jp=new JourneyPlanOpt(jo,false,true);
                locationsOpt.addJourneyPlan(jp);
               // setDefectsList(jp.getUnitList().);

            } catch (Exception e) {
                Log.e(TAG, e.toString());
            }
        }
        prev_WorkPlanDataMessageDigest = currHash;
        locationsOpt.SortArray();
        this.jpoWorkPlanTemplates = locationsOpt.getJourneyPlanListByLocation("ALL");

//       Collections.sort(_journeyPlans, new Comparator<JourneyPlanOpt>() {
//            @Override
//            public int compare(JourneyPlanOpt o1, JourneyPlanOpt o2) {
//                return o1.getSortOrder()-o2.getSortOrder();
//            }
//        });
//
//        this.jpoWorkPlanTemplates=_journeyPlans;
        return this.jpoWorkPlanTemplates;

    }


    public ArrayList<JSONObject> loadWokPlanTemplateList(Context context){
        DBHandler dbHandler=Globals.db;//new DBHandler(Globals.getDBContext());
        List<StaticListItem> items = dbHandler.getListItems(Globals.WPLAN_TEMPLATE_LIST_NAME, Globals.orgCode, "", "code<>''");
        //dbHandler.close();
        ArrayList<JSONObject> _journeyPlans = new ArrayList<>();
        for (StaticListItem item : items) {
            try {
                JSONObject jo = new JSONObject(item.getOptParam1());
                JSONObject jp=new JSONObject();
                jp.put("code",item.getCode());
                jp.put("title",jo.optString("title"));
                jp.put("lastInspection",jo.optString("lastInspection"));
                jp.put("nextDueDate",jo.optString("nextDueDate"));
                _journeyPlans.add(jp);

            } catch (Exception e) {
                Log.e(TAG, e.toString());
            }
        }
        this.joWorkPlanTemplates=_journeyPlans;
        return _journeyPlans;

    }
    public void loadWorkPlanTemplates(Context context){
        DBHandler dbHandler=Globals.db;//new DBHandler(Globals.getDBContext());
        List<StaticListItem> items = dbHandler.getListItems(Globals.WPLAN_TEMPLATE_LIST_NAME, Globals.orgCode, "", "code<>''");
        //dbHandler.close();
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
        DBHandler dbHandler=Globals.db;//new DBHandler(Globals.getDBContext());
        List<StaticListItem> items = dbHandler.getListItems("JourneyPlan", Globals.orgCode, "", "code<>''");
        //dbHandler.close();

        //List<StaticListItem> items = dbHandler.getListItems(Globals.ROUTE_PLAN_LIST_NAME,Globals.orgCode,Globals.empCode);
        ArrayList<JourneyPlanOpt> _journeyPlans = new ArrayList<>();
        for (StaticListItem item : items) {
            try {
                JSONObject jo = new JSONObject(item.getOptParam1());
                String jpId=jo.optString("_id");
                if(jpId ==null){
                    jpId=jo.optString("privateKey","");
                }
                //JourneyPlan jp = new JourneyPlan(context,jo);
                //jp.setId(item.getCode());
                //TODO Data changing here
                //List<StaticListItem> msgItems = dbHandler.getMsgListItems(Globals.JPLAN_LIST_NAME, Globals.orgCode,"code='"+item.getCode()+"'");
                //List<StaticListItem> msgItems = dbHandler.getMsgListItems(Globals.JPLAN_LIST_NAME, Globals.orgCode,"description='"+item.getCode()+"'");
                List<StaticListItem> msgItems = dbHandler.getMsgListItems(Globals.JPLAN_LIST_NAME
                        , Globals.orgCode,"code='"+jpId+"' and status="+Globals.MESSAGE_STATUS_READY_TO_POST);
                //List<StaticListItem> msgItems = dbHandler.getMsgListItems(Globals.JPLAN_LIST_NAME, Globals.orgCode,"code='"+jp.getuId()+"'");
                if(msgItems.size()>0){
                    StaticListItem msgItem=msgItems.get(0);
                    if(msgItem.getStatus()== Globals.MESSAGE_STATUS_READY_TO_POST){
                        JSONObject jo1=new JSONObject(msgItem.getOptParam1());
                        JSONObject _jo1 = Utilities.addObject(jo,jo1);
                        jo=_jo1;

                        //jp=new JourneyPlan(context, jo1);
                        //jp.mergeJsonObject(jo1);

                    }
                }


                JourneyPlanOpt jp=new JourneyPlanOpt(jo);
                //JourneyPlan jp=new JourneyPlan(jo);
                //jp.setCode(item.getCode());
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
                //dbHandler.close();
                Log.e(TAG, e.toString());
            }
        }
        List<StaticListItem> _items = dbHandler.getMsgListItems(Globals.JPLAN_LIST_NAME, Globals.orgCode
                , "description='' AND status="+Globals.MESSAGE_STATUS_READY_TO_POST);
        for(StaticListItem _item:_items){
            try {
                JSONObject jo = new JSONObject(_item.getOptParam1());
                JourneyPlanOpt jp=new JourneyPlanOpt(jo);
                //jp.setCode(_item.getCode());
                _journeyPlans.add(jp);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        this.journeyPlanOpts = _journeyPlans;
        //dbHandler.close();
        //load maintenance
        loadMaintenance();
    }
    public void loadMaintenance(){
        DBHandler dbHandler=Globals.db;
        List<StaticListItem> mItems = dbHandler.getListItems(MAINTENANCE_LIST_NAME, Globals.orgCode, "", "code<>''");
        Globals.maintenanceList= new MaintenanceList(mItems);
    }
    public void loadFromDB(Context context){

    }
    public void saveSampleData(Context context) {
        DBHandler dbHandler=Globals.db;//new DBHandler(Globals.getDBContext());
        addSampleJP(dbHandler);
        addSampleTaskList(dbHandler);
        //dbHandler.close();

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
    public ArrayList<JourneyPlanOpt> getInProgressJourneyPlans()
    {
        ArrayList<JourneyPlanOpt> jPlans = new ArrayList<>();
        for(JourneyPlanOpt jp: getJourneyPlanOpts()){
            if(jp.getStatus().equals(WORK_PLAN_IN_PROGRESS_STATUS)){
                jPlans.add(jp);
            }
        }
        return jPlans;
    }

    public JourneyPlan refreshJP(JourneyPlan selectedJPlan) {
        String uid=selectedJPlan.getuId();
        if(uid.equals("")){
            uid=selectedJPlan.getPrivateKey();
        }
        for(JourneyPlanOpt jp:this.journeyPlanOpts){
            if(jp.getCode().equals(uid)){
                return jp.loadJourneyPlan(true);
            }
        }
    return  null;
    }
}
