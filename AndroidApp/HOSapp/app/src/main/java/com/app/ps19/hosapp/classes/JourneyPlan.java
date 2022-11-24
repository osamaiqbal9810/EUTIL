package com.app.ps19.hosapp.classes;

import android.content.Context;
import android.util.Log;

import com.app.ps19.hosapp.Shared.DBHandler;
import com.app.ps19.hosapp.Shared.Globals;
import com.app.ps19.hosapp.Shared.IConvertHelper;
import com.app.ps19.hosapp.Shared.IMergeHelper;
import com.app.ps19.hosapp.Shared.StaticListItem;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import static androidx.constraintlayout.widget.Constraints.TAG;


public class JourneyPlan implements IConvertHelper, IMergeHelper {
    private String employeeId;
    private String date;
    private String id;
    private String uId="";
    private String startDateTime = "";
    private String startLocation = "";
    private String endDateTime = "";
    private String endLocation = "";
    private String type = "";
    private String status = "";
    private String lastExecDate ="";
    private String lastInspection = "";
    private String nextInspectionDate = "";
    private String title;
    private String workplanTemplateId="";
    private ArrayList<Task> taskList;
    private Context context;
    private boolean copyAllProps=false;
    private String lineId;
    private String lineName;
    private SafetyBriefingForm safetyBriefingForm=null;
    private String subdivision;
    public SafetyBriefingForm getSafetyBriefingForm() {
        return safetyBriefingForm;
    }

    public void setSafetyBriefingForm(SafetyBriefingForm safetyBriefingForm) {
        this.safetyBriefingForm = safetyBriefingForm;
    }

    public String getSubdivision() {
        return subdivision;
    }

    public void setSubdivision(String subdivision) {
        this.subdivision = subdivision;
    }

    public String getLineId() {
        return lineId;
    }

    public void setLineId(String lineId) {
        this.lineId = lineId;
    }

    public String getLineName() {
        return lineName;
    }

    public void setLineName(String lineName) {
        this.lineName = lineName;
    }



    public String getLastInspection() {
        return lastInspection;
    }

    public void setLastInspection(String lastInspection) {
        this.lastInspection = lastInspection;
    }

    public String getNextInspectionDate() {
        return nextInspectionDate;
    }

    public void setNextInspectionDate(String nextInspectionDate) {
        this.nextInspectionDate = nextInspectionDate;
    }
    public boolean isCopyAllProps() {
        return copyAllProps;
    }
    public String getWorkplanTemplateId() {
        return workplanTemplateId;
    }

    public void setWorkplanTemplateId(String workplanTemplateId) {
        this.workplanTemplateId = workplanTemplateId;
    }


    public void setCopyAllProps(boolean copyAllProps) {
        this.copyAllProps = copyAllProps;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    private  User user;

    public String getLastExecDate() {
        return lastExecDate;
    }

    public void setLastExecDate(String lastExecDate) {
        this.lastExecDate = lastExecDate;
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


    public String getStartDateTime() {
        return startDateTime;
    }

    public void setStartDateTime(String startDateTime) {
        this.startDateTime = startDateTime;
    }

    public String getStartLocation() {
        return startLocation;
    }

    public void setStartLocation(String startLocation) {
        this.startLocation = startLocation;
    }

    public String getEndDateTime() {
        return endDateTime;
    }

    public void setEndDateTime(String endDateTime) {
        this.endDateTime = endDateTime;
    }

    public String getEndLocation() {
        return endLocation;
    }

    public void setEndLocation(String endLocation) {
        this.endLocation = endLocation;
    }


    public String getuId(){ return  uId;}
    public void setuId(String value){ uId= value;}
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
    public boolean refresh(Context context){
        // Refresh This JP form database
        String code=getDate();
        if(context==null){
            context= Globals.mainActivity;
        }
        String selJPCode ="";
        String selTaskId="";
        String selUnitId = "";
        int selReportIndex=-1;

        if(Globals.selectedJPlan !=null){
            Globals.selectedJPlan.getDate();
        }
        if(Globals.selectedTask !=null){
            selTaskId=Globals.selectedTask.getTaskId();
        }
        if(Globals.selectedReport !=null){
            selReportIndex=Globals.selectedReport.getReportIndex();
        }
        if (Globals.selectedUnit != null) {
            selUnitId = Globals.selectedUnit.getUnitId();
        }
        DBHandler db = new DBHandler(context);
        List<StaticListItem> items = db.getListItems(Globals.JPLAN_LIST_NAME,Globals.orgCode,code);
        if(items.size()==1){
            StaticListItem item = items.get(0);
            try {
                JSONObject jo = new JSONObject(item.getOptParam1());
                parseJsonObject(jo);
                db.close();

                //Restore Selected Value
                if(!selJPCode.equals("")){

                }
                if(!selTaskId.equals("")){
                    Globals.selectedTask=null;
                    for(Task task:taskList){
                        if(task.getTaskId().equals(selTaskId)){
                            Globals.selectedTask=task;
                            break;
                        }
                    }
                }
                if(selReportIndex>=0 && Globals.selectedTask!=null){
                    Globals.selectedReport=null;
                    for(Report report:Globals.selectedTask.getReportList()){
                        if(report.getReportIndex()== selReportIndex){
                            Globals.selectedReport=report;
                        }
                    }
                }
                if (!selUnitId.equals("")) {
                    Globals.selectedUnit = null;
                    for (Units _unit : Globals.selectedTask.getWholeUnitList()) {
                        if (_unit.getUnitId().equals(selUnitId)) {
                            Globals.selectedUnit = _unit;
                            break;
                        }
                    }
                }
                return  true;
            }catch (Exception e){
                e.printStackTrace();
            }
        }
        db.close();
        return  false;
    }

    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
/*
        joTask.put("date", "Nov, 19, 2018");
        joTask.put("taskId", "1");
        joTask.put("empId", "1");
        joTask.put("title", "Inspection Unit 204");
        joTask.put("description", "Milepost 10, 11");
        joTask.put("notes", "Please also check Joint bars and mark all cracked ones.");
        joTask.put("imageURL", "http://this.southeastasia.cloudapp.azure.com/images/sampleimg.png");
*/
        try {

            this.date = jsonObject.optString("date");
            //setId(date);
            setId(jsonObject.optString("_id"));
            setuId(jsonObject.optString("_id"));
            setLineId(jsonObject.optString("lineId",""));
            setLineName(jsonObject.optString("lineName",""));
            setWorkplanTemplateId(jsonObject.optString("_id"));
            setTitle(jsonObject.optString("title"));
            setStartDateTime(jsonObject.optString("startDateTime",""));
            setStartLocation(jsonObject.optString("startLocation",""));
            setEndDateTime(jsonObject.optString("endDateTime",""));
            setEndLocation(jsonObject.optString("endLocation",""));
            setStatus(jsonObject.optString("status",""));
            setLastInspection(jsonObject.optString("lastInspection", ""));
            setNextInspectionDate(jsonObject.optString("nextInspectionDate", ""));
            setSubdivision(jsonObject.optString("subdivision",""));
            setSafetyBriefingForm(null);
            if(jsonObject.optJSONObject("safetyBriefing")!=null) {
                setSafetyBriefingForm(new SafetyBriefingForm(jsonObject.optJSONObject("safetyBriefing")));
            }
            JSONObject joUser=jsonObject.optJSONObject("user");
            if(joUser !=null){
                user=new User(joUser);
            }
            ArrayList<Task> _taskList = new ArrayList<>();


            JSONArray ja = jsonObject.getJSONArray("tasks");
            for (int i = 0; i < ja.length(); i++
                    ) {
                Task task = new Task(context,ja.getJSONObject(i));
                task.setTaskIndex(i);
                _taskList.add(task);
            }
            this.taskList = _taskList;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return true;
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jo =new JSONObject();
        JSONArray jaTasks=new JSONArray();
        try {
            jo.put("_id",getuId());
            jo.put("date",getDate());
            jo.put("title",getTitle());
            if(isCopyAllProps()){
                jo.put("workplanTemplateId",getWorkplanTemplateId());
            }
            jo.put("lineId",getLineId());
            jo.put("lineName",getLineName());
            jo.put("startDateTime", getStartDateTime());
            jo.put("startLocation", getStartLocation());
            jo.put("endDateTime", getEndDateTime());
            jo.put("endLocation", getEndLocation());
            jo.put("status", getStatus());
            jo.put("lastInspection", getLastInspection());
            jo.put("nextInspectionDate", getNextInspectionDate());
            jo.put("subdivision",getSubdivision());
            if(getSafetyBriefingForm() !=null) {
                jo.put("safetyBriefing", getSafetyBriefingForm().getJsonObject());
            }
            if(getUser() !=null){
                jo.put("user",getUser().getJsonObject());
            }
            for (Task task : taskList) {
                if(isCopyAllProps()){
                    task.setCopyAllProps(true);
                }
                jaTasks.put(task.getJsonObject());
            }
            jo.put("tasks", jaTasks);

        }catch (Exception e){
            e.printStackTrace();
        }
        return jo;
    }

    public void load() {
    }

    public void update() {
        try {
            JSONObject joOut = getJsonObject();
            String _uId= getuId();

            StaticListItem item = new StaticListItem(Globals.orgCode, Globals.JPLAN_LIST_NAME, _uId, getDate(), joOut.toString(), null);

            DBHandler db = new DBHandler(context);
            db.AddOrUpdateMsgList(item.getListName(), Globals.orgCode, item, Globals.MESSAGE_STATUS_READY_TO_POST);
            db.close();


        } catch (Exception e) {
            Log.e(TAG, e.toString());
        }
    }

    public void loadSampleDate() {

    }

    public JourneyPlan() {
    }

    public JourneyPlan(String date) {
        this.date = date;
        load();
    }

    public JourneyPlan(JSONObject journeyObj) {
        parseJsonObject(journeyObj);

    }

    public JourneyPlan(Context context,JSONObject journeyObj) {
        this.context=context;
        parseJsonObject(journeyObj);

    }

    public ArrayList<Task> getTaskList() {
        return taskList;
    }

    public void setTaskList(ArrayList<Task> taskList) {
        this.taskList = taskList;
    }
    public List<IssueImage> getImageList(){
        ArrayList items = new ArrayList();
        if(taskList !=null) {
            for (Task task : taskList) {
                items.addAll(task.getImageList());
            }
        }
        if(getSafetyBriefingForm()!=null){
            items.addAll(getSafetyBriefingForm().getImageList());
        }
        return items;
    }
    public List<IssueVoice> getVoiceList(){
        ArrayList items = new ArrayList();
        if(taskList !=null) {
            for (Task task : taskList) {
                items.addAll(task.getVoiceList());
            }
        }
        return items;
    }

    public boolean setImageStatus(HashMap<String,Integer> finalItems) {
        boolean blnDataChanged=false;
        for(Task task:taskList){
            boolean retValue=task.setImageStatus(finalItems);
            if(retValue){
                blnDataChanged=true;
            }
        }
        boolean retValue=false;
        if(getSafetyBriefingForm()!=null){
            retValue=getSafetyBriefingForm().setImageStatus(finalItems);
            if(retValue){
                blnDataChanged=true;
            }
        }
        return blnDataChanged;
    }
    public boolean setVoiceStatus(HashMap<String,Integer> finalItems) {
        boolean blnDataChanged=false;
        for(Task task:taskList){
            boolean retValue=task.setVoiceStatus(finalItems);
            if(retValue){
                blnDataChanged=true;
            }
        }
        return blnDataChanged;
    }

    public int getCompletedTaskCount(){
        int taskCount=0;
        for(Task task:taskList){
            if(!task.getEndTime().equals("")){
                taskCount++;
            }
        }
        return taskCount;
    }
    public Task getRunningTask(){
        for(Task task:taskList){
            if(!task.getStartTime().equals("") && task.getEndTime().equals("")){
                return task;
            }
        }
        return null;
    }
    public Task getTaskById(String taskId){
        for(Task task:taskList){
            if(task.getTaskId().equals(taskId)){

                return task;
            }
        }
        return null;
    }
    public int getIssueCount(){
        int issueCount=0;
        for(Task task:taskList){
            if(task.getReportList()!=null){
                issueCount+=task.getReportList().size();
            }
        }
        return issueCount;
    }
    public ArrayList<String> getElapsedTime(){
        ArrayList<String> elapsedArray =new ArrayList<>();
        if(!getStartDateTime().equals("")){
            Date startTime=new Date(getStartDateTime());
            Date endTime = null;
            long secondsInMilli = 1000;
            long minutesInMilli = secondsInMilli * 60;
            long hoursInMilli = minutesInMilli * 60;
            long daysInMilli = hoursInMilli * 24;

            if(!getEndDateTime().equals("")){
                endTime=new Date(getEndDateTime());
            }else{
                endTime=new Date();
            }
            long difference=endTime.getTime()-startTime.getTime();
            long elapsedDays = difference / daysInMilli;
            difference= difference % daysInMilli;

            long elapsedHours = difference/ hoursInMilli;
            difference= difference % hoursInMilli;
            long elapsedMinutes = difference / minutesInMilli;
            difference = difference % minutesInMilli;
            long elapsedSeconds = difference / secondsInMilli;

            elapsedArray.add(String.valueOf(elapsedDays));
            elapsedArray.add(String.valueOf(elapsedHours));
            elapsedArray.add(String.valueOf(elapsedMinutes));
            elapsedArray.add(String.valueOf(elapsedSeconds));
        }
        return elapsedArray;
    }

    @Override
    public boolean mergeJsonObject(JSONObject jsonObject) {
        try {

            this.date = jsonObject.optString("date");
            //setId(date);
            setId(jsonObject.optString("_id"));
            setuId(jsonObject.optString("_id"));
            setLineId(jsonObject.optString("lineId",""));
            setLineName(jsonObject.optString("lineName",""));
            //setWorkplanTemplateId(jsonObject.optString("_id"));
            //setTitle(jsonObject.optString("title"));
            setStartDateTime(jsonObject.optString("startDateTime",""));
            setStartLocation(jsonObject.optString("startLocation",""));
            setEndDateTime(jsonObject.optString("endDateTime",""));
            setEndLocation(jsonObject.optString("endLocation",""));
            setStatus(jsonObject.optString("status",""));
            //setLastInspection(jsonObject.optString("lastInspection", ""));
            //setNextInspectionDate(jsonObject.optString("nextInspectionDate", ""));
            //setSubdivision(jsonObject.optString("subdivision",""));
            //setSafetyBriefingForm(null);
            if(jsonObject.optJSONObject("safetyBriefing")!=null) {
                setSafetyBriefingForm(new SafetyBriefingForm(jsonObject.optJSONObject("safetyBriefing")));
                Globals.safetyBriefing = getSafetyBriefingForm();
            }
            /*JSONObject joUser=jsonObject.optJSONObject("user");
            if(joUser !=null){
                user=new User(joUser);
            }*/
            //ArrayList<Task> _taskList = new ArrayList<>();

            JSONArray ja = jsonObject.getJSONArray("tasks");
            if(ja.length()>0){
                for(int i = 0; i< this.taskList.size(); i++){
                    if(this.taskList.get(i).getTaskId().equals(ja.getJSONObject(i).optString("taskId",""))){
                        this.taskList.set(i, this.taskList.get(i).mergeJsonObject(ja.getJSONObject(i)));
                    }
                }
            }
            /*for (int i = 0; i < ja.length(); i++
            ) {
                Task task = new Task(context,ja.getJSONObject(i));
                task.setTaskIndex(i);
                _taskList.add(task);
            }*/
            //this.taskList = _taskList;
        } catch (Exception e) {
            e.printStackTrace();
        }
        //update();
        refreshAfterMerge(context);
        return true;
    }
    private void refreshAfterMerge(Context context){
        // Refresh This JP form database
        String code=getDate();
        if(context==null){
            context= Globals.mainActivity;
        }
        String selJPCode ="";
        String selTaskId="";
        String selUnitId = "";
        int selReportIndex=-1;

        if(Globals.selectedJPlan !=null){
            Globals.selectedJPlan.getDate();
        }
        if(Globals.selectedTask !=null){
            selTaskId=Globals.selectedTask.getTaskId();
        }
        if(Globals.selectedReport !=null){
            selReportIndex=Globals.selectedReport.getReportIndex();
        }
        if (Globals.selectedUnit != null) {
            selUnitId = Globals.selectedUnit.getUnitId();
        }

            try {

                //Restore Selected Value
                if(!selJPCode.equals("")){

                }
                if(!selTaskId.equals("")){
                    Globals.selectedTask=null;
                    for(Task task:taskList){
                        if(task.getTaskId().equals(selTaskId)){
                            Globals.selectedTask=task;
                            break;
                        }
                    }
                }
                if(selReportIndex>=0 && Globals.selectedTask!=null){
                    Globals.selectedReport=null;
                    for(Report report:Globals.selectedTask.getReportList()){
                        if(report.getReportIndex()== selReportIndex){
                            Globals.selectedReport=report;
                        }
                    }
                }
                if (!selUnitId.equals("")) {
                    Globals.selectedUnit = null;
                    for (Units _unit : Globals.selectedTask.getWholeUnitList()) {
                        if (_unit.getUnitId().equals(selUnitId)) {
                            Globals.selectedUnit = _unit;
                            break;
                        }
                    }
                }
            }catch (Exception e){
                e.printStackTrace();
            }

    }
}
