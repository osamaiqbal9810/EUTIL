package com.app.ps19.tipsapp.classes;

import android.content.Context;
import android.util.Log;

import com.app.ps19.tipsapp.Shared.DBHandler;
import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.Shared.IConvertHelper;
import com.app.ps19.tipsapp.Shared.IMergeHelper;
import com.app.ps19.tipsapp.Shared.StaticListItem;
import com.app.ps19.tipsapp.Shared.Utilities;
import com.app.ps19.tipsapp.classes.dynforms.DynForm;
import com.app.ps19.tipsapp.classes.dynforms.DynFormList;
import com.app.ps19.tipsapp.classes.safetybriefings.JobBriefing;
import com.app.ps19.tipsapp.classes.safetybriefings.JobBriefingCollection;
import com.bumptech.glide.load.engine.Resource;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Array;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import static android.content.ContentValues.TAG;
import static com.app.ps19.tipsapp.Shared.Globals.FULL_DATE_FORMAT;
import static com.app.ps19.tipsapp.Shared.Globals.SESSION_STARTED;
import static com.app.ps19.tipsapp.Shared.Globals.activeSession;
import static com.app.ps19.tipsapp.Shared.Globals.getSelectedTask;
import static com.app.ps19.tipsapp.Shared.Globals.inbox;
import static com.app.ps19.tipsapp.Shared.Globals.setSelectedTask;

public class JourneyPlan implements IConvertHelper, IMergeHelper {
    private String employeeId;
    private String code="";
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
    private String nextDueDate = "";
    private String title;
    private String workplanTemplateId="";
    private ArrayList<Task> taskList;
    private Context context;
    private boolean copyAllProps=false;
    private String lineId;
    private String lineName;
    private SafetyBriefingForm safetyBriefingForm=null;
    private String subdivision;
    private String privateKey;
    private Intervals intervals = new Intervals(new JSONArray());
    private Completion completion;
    private boolean loadCompletion=false;
    private JourneyPlanOpt jpTemplate;
    private ArrayList<JobBriefing> jbCollection;

    public ArrayList<JobBriefing> getJbCollection() {
        return jbCollection;
    }

    public void setJbCollection(ArrayList<JobBriefing> jbCollection) {
        this.jbCollection = jbCollection;
    }


    public JourneyPlanOpt getJpTemplate() {
        return jpTemplate;
    }

    public void setJpTemplate(JourneyPlanOpt jpTemplate) {
        this.jpTemplate = jpTemplate;
    }

    public boolean isLoadCompletion() {
        return loadCompletion;
    }

    public void setLoadCompletion(boolean loadCompletion) {
        this.loadCompletion = loadCompletion;
    }

    public void setCompletion(Completion completion) {
        this.completion = completion;
    }

    public Completion getCompletion() {
        return completion;
    }

    public Intervals getIntervals() {
        return intervals;
    }

    public void setIntervals(Intervals intervals) {
        this.intervals = intervals;
    }

    private HashMap<String, Object> hmBackupValues;
    private boolean changeOnly=false;
    public boolean isChangeOnly() {
        return changeOnly;
    }

    public void setChangeOnly(boolean changeOnly) {
        this.changeOnly = changeOnly;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    /*private String userStartMp;
            private String userEndMp;
            private String mpStart;
            private String mpEnd;
            private ArrayList<RunRanges> runRanges;

            public ArrayList<RunRanges> getRunRanges() {
                return runRanges;
            }

            public void setRunRanges(ArrayList<RunRanges> runRanges) {
                this.runRanges = runRanges;
            }

            public String getMpStart() {
                return mpStart;
            }

            public void setMpStart(String mpStart) {
                this.mpStart = mpStart;
            }

            public String getMpEnd() {
                return mpEnd;
            }

            public void setMpEnd(String mpEnd) {
                this.mpEnd = mpEnd;
            }

            public String getUserStartMp() {
                return userStartMp;
            }

            public void setUserStartMp(String userStartMp) {
                this.userStartMp = userStartMp;
            }

            public String getUserEndMp() {
                return userEndMp;
            }

            public void setUserEndMp(String userEndMp) {
                this.userEndMp = userEndMp;
            }
        */
    public String getNextDueDate() {
        return nextDueDate;
    }

    public void setNextDueDate(String nextDueDate) {
        this.nextDueDate = nextDueDate;
    }
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
        return workplanTemplateId.equals("-1")?"":workplanTemplateId;
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

    public String getPrivateKey() {
        return privateKey;
    }

    public void setPrivateKey(String privateKey) {
        this.privateKey = privateKey;
    }

    public void setDate(String date) {
        this.date = date;
    }
    public boolean refresh(Context context){
        // Refresh This JP form database
        String code=getDate();
        if(context==null){
            context= Globals.getDBContext();
        }
        String selJPCode ="";
        String selTaskId="";
        String selUnitId = "";
        int selReportIndex=-1;

        if(Globals.selectedJPlan !=null){
            Globals.selectedJPlan.getDate();
        }
        if(getSelectedTask() !=null){
            selTaskId=getSelectedTask().getTaskId();
        }
        if(Globals.selectedReport !=null){
            selReportIndex=Globals.selectedReport.getReportIndex();
        }
        if (Globals.selectedUnit != null) {
            selUnitId = Globals.selectedUnit.getUnitId();
        }
        DBHandler db = Globals.db;//new DBHandler(Globals.getDBContext());
        List<StaticListItem> items = db.getListItems(Globals.JPLAN_LIST_NAME,Globals.orgCode,code);
        if(items.size()==1){
            StaticListItem item = items.get(0);
            try {
                JSONObject jo = new JSONObject();
                jo=mergePendingItem(item);
                parseJsonObject(jo);
                //db.close();

                //Restore Selected Value
                if(!selJPCode.equals("")){

                }
                if(!selTaskId.equals("")){
                    setSelectedTask(null);
                    for(Task task:taskList){
                        if(task.getTaskId().equals(selTaskId)){
                            setSelectedTask(task);
                            break;
                        }
                    }
                }
                if(selReportIndex>=0 && getSelectedTask()!=null){
                    Globals.selectedReport=null;
                    for(Report report:getSelectedTask().getReportList()){
                        if(report.getReportIndex()== selReportIndex){
                            Globals.selectedReport=report;
                        }
                    }
                }
                if (!selUnitId.equals("")) {
                    Globals.selectedUnit = null;
                    for (Units _unit : getSelectedTask().getWholeUnitList()) {
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
        //db.close();
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
            this.setJpTemplate(getTemplateFullOpt());
            this.date = jsonObject.optString("date");
            //setId(date);
            setId(jsonObject.optString("_id"));
            setuId(jsonObject.optString("_id"));
            setLineId(jsonObject.optString("lineId",""));
            setLineName(jsonObject.optString("lineName",""));
            if(jsonObject.has("workplanTemplateId")){
                setWorkplanTemplateId(jsonObject.optString("workplanTemplateId"));
            }else{
                setWorkplanTemplateId(jsonObject.optString("_id"));
            }
            setTitle(jsonObject.optString("title"));
            setStartDateTime(jsonObject.optString("startDateTime",""));
            setStartLocation(jsonObject.optString("startLocation",""));
            setEndDateTime(jsonObject.optString("endDateTime",""));
            setEndLocation(jsonObject.optString("endLocation",""));
            setStatus(jsonObject.optString("status",""));
            setLastInspection(jsonObject.optString("lastInspection", ""));
            setNextInspectionDate(jsonObject.optString("nextInspectionDate", ""));
            setNextDueDate(jsonObject.optString("nextDueDate", ""));
            setSubdivision(jsonObject.optString("subdivision",""));
            setSafetyBriefingForm(null);
            setPrivateKey(jsonObject.optString("privateKey",""));

            //Backup Properties
            hmBackupValues=new HashMap<>();
            hmBackupValues.put("_id", getId());
            hmBackupValues.put("title", getTitle());
            hmBackupValues.put("startDateTime", getStartDateTime());
            hmBackupValues.put("endDateTime", getEndDateTime());
            hmBackupValues.put("startLocation", getStartLocation());
            hmBackupValues.put("endLocation", getEndLocation());
            hmBackupValues.put("status", getStatus());
            hmBackupValues.put("lastInspection", getLastInspection());
            hmBackupValues.put("nextInspectionDate", getNextInspectionDate());
            hmBackupValues.put("nextDueDate", getNextDueDate());
            hmBackupValues.put("subdivision", getSubdivision());
            hmBackupValues.put("privateKey", getPrivateKey());
           /* setUserStartMp(jsonObject.optString("userStartMP", ""));
            setUserEndMp(jsonObject.optString("userEndMP", ""));
            setMpStart(jsonObject.optString("mpStart", ""));
            setMpEnd(jsonObject.optString("mpEnd", ""));

            ArrayList<RunRanges> _runRanges = new ArrayList<>();
            JSONArray jaRunRanges = jsonObject.optJSONArray("runRanges");
            if(jaRunRanges!=null){
                for (int i = 0; i < jaRunRanges.length(); i++) {
                    RunRanges run = new RunRanges(jaRunRanges.getJSONObject(i));
                    _runRanges.add(run);
                }
            }
            setRunRanges(_runRanges);*/

            ArrayList<JobBriefing> jBriefing = new ArrayList<>();
            JSONArray jaBriefings = jsonObject.optJSONArray("jobBriefings");

            HashMap<String, ArrayList<DynForm> > fm =  DynFormList.getFormListForBriefingHM();
            int _i=0;
            for(String key: fm.keySet()){
                JSONObject joData=null;
                if(jaBriefings!=null){
                    joData=jaBriefings.optJSONObject(_i);
                }
                JobBriefing briefing = new JobBriefing(fm.get(key),joData);
                jBriefing.add(briefing);
                _i++;
            }
            setJbCollection(jBriefing);

    /*
            if(jaBriefings!=null){
                for (int i = 0; i < jaBriefings.length(); i++) {
                    JobBriefing briefing = new JobBriefing(jaBriefings.getJSONObject(i));
                    jBriefing.add(briefing);
                }
                setJbCollection(jBriefing);
            }else {
                HashMap<String, ArrayList<DynForm> > fm =  DynFormList.getFormListForBriefingHM();
                for(String key: fm.keySet()){
                    JobBriefing briefing = new JobBriefing(fm.get(key));
                    jBriefing.add(briefing);
                }*/
               /* ArrayList<DynForm> briefingForms = DynFormList.getFormListForBriefing();
                for (DynForm form: briefingForms){
                    JobBriefing briefing = new JobBriefing(form);
                    jBriefing.add(briefing);
                }*/

//            }

            if(jsonObject.optJSONObject("safetyBriefing")!=null) {
                setSafetyBriefingForm(new SafetyBriefingForm(jsonObject.optJSONObject("safetyBriefing")));
            }
            JSONObject joUser=jsonObject.optJSONObject("user");
            if(joUser !=null){
                user=new User(joUser);
            }
            ArrayList<Task> _taskList = new ArrayList<>();

            JSONArray jaIntervals = jsonObject.optJSONArray("intervals");
            if(jaIntervals!=null){
                this.intervals=new Intervals(jaIntervals);
            }
            JSONObject joComp= jsonObject.optJSONObject("completion");
            if(joComp !=null && isLoadCompletion()){
                this.completion=new Completion(joComp);
            }
            JSONArray ja = jsonObject.getJSONArray("tasks");
            for (int i = 0; i < ja.length(); i++
                    ) {
                Task task = new Task(context,ja.getJSONObject(i));
                task.setTaskIndex(i);
                _taskList.add(task);
            }
            this.taskList = _taskList;

           // calculateRanges();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return true;
    }

    @Override
    public JSONObject getJsonObject() {
        if(copyAllProps==false && changeOnly){
            return getJsonObjectChanged();
        }
        JSONObject jo =new JSONObject();
        JSONArray jaTasks=new JSONArray();
        JSONArray jaBriefing = new JSONArray();
       // JSONArray jaRunRanges = new JSONArray();
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
            jo.put("nextDueDate", getNextDueDate());
            jo.put("subdivision",getSubdivision());
            jo.put("privateKey",getPrivateKey());
            if(this.intervals!=null){
                this.intervals.setChangeOnly(changeOnly);
                JSONObject joIntervals=this.intervals.getJsonObject();
                JSONArray jaIntervals=joIntervals.optJSONArray("intervals");
                if(jaIntervals!=null && jaIntervals.length()>0){
                    jo.put("intervals",jaIntervals);
                }
            }

           /* jo.put("userStartMP", getUserStartMp());
            jo.put("userEndMP", getUserEndMp());
            jo.put("mpStart", getMpStart());
            jo.put("mpEnd", getMpEnd());*/
            boolean isDataChanged = false;
            if(getJbCollection()!=null){
                for (JobBriefing briefing : getJbCollection()) {
                    briefing.setChangeOnly(changeOnly);
                    JSONObject joData = briefing.getJsonObject();
                    if(joData!=null && joData.length()>0){
                        isDataChanged = true;
                        jaBriefing.put(joData);
                    } else {
                        jaBriefing.put(new JSONObject());
                    }
                }
            }
            if(isDataChanged){
                jo.put("jobBriefings", jaBriefing);
            }
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
            /*for (RunRanges run : runRanges) {
                jaRunRanges.put(run.getJsonObject());
            }
            jo.put("runRanges", jaRunRanges);*/

        }catch (Exception e){
            e.printStackTrace();
        }
        return jo;
    }
    private JSONObject getJsonObjectChanged(){
        JSONObject jo=new JSONObject();
        JSONArray jaTasks=new JSONArray();
        JSONArray jaBriefing = new JSONArray();
        try {
            //putJSONProperty(jo,"_id",getuId());
            putJSONProperty(jo,"date",getDate());
            putJSONProperty(jo,"title",getTitle());
            putJSONProperty(jo,"workplanTemplateId",getWorkplanTemplateId());
            putJSONProperty(jo,"lineId",getLineId());
            putJSONProperty(jo,"lineName",getLineName());
            putJSONProperty(jo,"startDateTime", getStartDateTime());
            putJSONProperty(jo,"startLocation", getStartLocation());
            putJSONProperty(jo,"endDateTime", getEndDateTime());
            putJSONProperty(jo,"endLocation", getEndLocation());
            putJSONProperty(jo,"status", getStatus());
            putJSONProperty(jo,"lastInspection", getLastInspection());
            putJSONProperty(jo,"nextInspectionDate", getNextInspectionDate());
            putJSONProperty(jo,"nextDueDate", getNextDueDate());
            putJSONProperty(jo,"subdivision",getSubdivision());
            putJSONProperty(jo,"privateKey",getPrivateKey());
            boolean isDataChanged = false;
            if(getJbCollection()!=null){
                for (JobBriefing briefing : getJbCollection()) {
                    briefing.setChangeOnly(changeOnly);
                    JSONObject joData = briefing.getJsonObject();
                    if(joData!=null && joData.length()>0){
                        isDataChanged = true;
                        jaBriefing.put(joData);
                    } else {
                        jaBriefing.put(new JSONObject());
                    }

                }
            }
            if(isDataChanged){
                jo.put("jobBriefings", jaBriefing);
            }
            //putJSONProperty(jo,"jobBriefings", jaBriefing);
            if(getSafetyBriefingForm() !=null) {
                getSafetyBriefingForm().setChangeOnly(changeOnly);
                JSONObject jsonObject=getSafetyBriefingForm().getJsonObject();
                if(jsonObject!=null) {
                    jo.put("safetyBriefing",jsonObject );
                }
            }
            /*if(getUser() !=null){
                JSONObject joUser=getUser().getJsonObject();
                if(joUser!=null) {
                    jo.put("user", joUser);
                }
            }*/
            boolean isDataExists=false;
            for (Task task : taskList) {
                task.setCopyAllProps(isCopyAllProps());
                task.setChangeOnly(changeOnly);
                JSONObject joTask=task.getJsonObject();
                if(joTask!=null) {
                    jaTasks.put(joTask);
                }
                if(joTask.length()!=0){
                    isDataExists=true;
                }
            }
            if(jaTasks.length()>0) {
                if(isDataExists) {
                    jo.put("tasks", jaTasks);
                }
            }
            if(this.intervals!=null){
                this.intervals.setChangeOnly(changeOnly);
                JSONObject joIntervals=this.intervals.getJsonObject();
                JSONArray jaIntervals=joIntervals.optJSONArray("intervals");
                if(jaIntervals!=null && jaIntervals.length()>0){
                    jo.put("intervals",jaIntervals);
                }
            }

            if(user!=null){
                user=Globals.user;
                Globals.user.setChangeOnly(changeOnly);
                JSONObject userObj=Globals.user.getJsonObject();
                if(userObj!=null && userObj.length()!=0){
                    jo.put("user", userObj);
                }
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jo;
    }
    private boolean putJSONProperty(JSONObject jo, String fieldName, Object value){
        Object oldValue=null;
        oldValue=hmBackupValues.get(fieldName);
        if(oldValue !=null && !oldValue.equals(value)){
            try {
                jo.put(fieldName,value);
            } catch (JSONException e) {
                e.printStackTrace();
                return  false;
            }
        }
        return true;
    }
    public void load() {
    }
    public void reloadId(){
        if(id.equals("")){
            //Check if Id available in List
            if(!privateKey.equals("")){
                DBHandler db=Globals.db;
                List<StaticListItem> items=Globals.db.getListItems(Globals.JPLAN_LIST_NAME, Globals.orgCode,"","description='"+privateKey+"'");
                if(items.size()==1){
                    StaticListItem item=items.get(0);
                    setId(item.getCode());
                    setuId(item.getCode());
                }
            }
        }

    }
    public void update() {
        try {
            if(copyAllProps){
                changeOnly=false;
            }else{
                changeOnly=Globals.isSmartObjectAvailable;
            }
            JSONObject joOut = getJsonObject();
            if(joOut.length()==0){
                //No change required
                Log.e(TAG, "No change required");
                return;
            }
            String _uId= getuId();
            if( _uId.equals("")){
                //Offline Update
                reloadId();
                _uId= getuId();
                if(_uId.equals("")) {
                    _uId = privateKey;

                }
            }

            StaticListItem item = new StaticListItem(Globals.orgCode, Globals.JPLAN_LIST_NAME, _uId, getDate(), joOut.toString(), null);

            DBHandler db = Globals.db;//new DBHandler(Globals.getDBContext());
            List<StaticListItem> pendingItems=db.getMsgListItems(item.getListName(), Globals.orgCode,"code='"+item.getCode() +"' AND status="+Globals.MESSAGE_STATUS_READY_TO_POST);
            if(pendingItems.size()>0){
                StaticListItem pendingItem=pendingItems.get(0);
                try {
                    JSONObject jo1=new JSONObject(pendingItem.getOptParam1());
                    jo1= Utilities.addObject(jo1,joOut);
                    pendingItem.setOptParam1(jo1.toString());
                    db.AddOrUpdateMsgList(pendingItem.getListName(),Globals.orgCode,pendingItem,Globals.MESSAGE_STATUS_READY_TO_POST);
                } catch (Exception e) {
                    e.printStackTrace();
                }

            }else {
                  db.AddOrUpdateMsgList(item.getListName(), Globals.orgCode, item, Globals.MESSAGE_STATUS_READY_TO_POST);
            }
            //db.close();


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
    /*public void calculateRanges(){
        if(runRanges.size()>0){
            setMpStart(runRanges.get(0).getMpStart());
            for(int i = 0; i<runRanges.size(); i++){
                if(i == runRanges.size()-1){
                    setMpEnd(runRanges.get(i).getMpEnd());
                }
            }
        }
    }
*/
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
        retValue=getUser().setImageStatus(finalItems);
        if(retValue){
            blnDataChanged=true;
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
            Date startTime= null;
            try {
                startTime = FULL_DATE_FORMAT.parse(getStartDateTime());
            } catch (ParseException e) {
                e.printStackTrace();
            }
            Date endTime = null;
            long secondsInMilli = 1000;
            long minutesInMilli = secondsInMilli * 60;
            long hoursInMilli = minutesInMilli * 60;
            long daysInMilli = hoursInMilli * 24;

            if(!getEndDateTime().equals("")){
                try {
                    endTime=FULL_DATE_FORMAT.parse(getEndDateTime());
                } catch (ParseException e) {
                    e.printStackTrace();
                }
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
            /*setUserStartMp(jsonObject.optString("startMP", ""));
            setUserEndMp(jsonObject.optString("endMP", ""));
            setMpStart(jsonObject.optString("mpStart", ""));
            setMpEnd(jsonObject.optString("mpEnd", ""));*/
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
            /*ArrayList<RunRanges> _runRanges = new ArrayList<>();
            JSONArray jaRunRanges = jsonObject.optJSONArray("runRanges");
            if(jaRunRanges!=null){
                for (int i = 0; i < jaRunRanges.length(); i++) {
                    RunRanges run = new RunRanges(jaRunRanges.getJSONObject(i));
                    _runRanges.add(run);
                }
            }

            setRunRanges(_runRanges);
            calculateRanges();*/
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
            context= Globals.getDBContext();
        }
        String selJPCode ="";
        String selTaskId="";
        String selUnitId = "";
        int selReportIndex=-1;

        if(Globals.selectedJPlan !=null){
            Globals.selectedJPlan.getDate();
        }
        if(getSelectedTask() !=null){
            selTaskId=getSelectedTask().getTaskId();
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
                    setSelectedTask(null);
                    for(Task task:taskList){
                        if(task.getTaskId().equals(selTaskId)){
                            setSelectedTask(task);
                            break;
                        }
                    }
                }
                if(selReportIndex>=0 && getSelectedTask()!=null){
                    Globals.selectedReport=null;
                    for(Report report:getSelectedTask().getReportList()){
                        if(report.getReportIndex()== selReportIndex){
                            Globals.selectedReport=report;
                        }
                    }
                }
                if (!selUnitId.equals("")) {
                    Globals.selectedUnit = null;
                    for (Units _unit : getSelectedTask().getWholeUnitList()) {
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
    public static JSONObject mergePendingItem(StaticListItem item){
        JSONObject retObject=null;
        DBHandler db = Globals.db;//new DBHandler(Globals.getDBContext());
        try {
            JSONObject joOut = new JSONObject(item.getOptParam1());
            retObject=joOut;
            List<StaticListItem> pendingItems = db.getMsgListItems(item.getListName(), Globals.orgCode, "code='" + item.getCode() + "' AND status=" + Globals.MESSAGE_STATUS_READY_TO_POST);
            if (pendingItems.size() > 0) {
                StaticListItem pendingItem = pendingItems.get(0);
                try {
                    JSONObject jo1 = new JSONObject(pendingItem.getOptParam1());
                    jo1 = Utilities.addObject(joOut, jo1);
                    return jo1;
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return retObject;
    }
    public JourneyPlanOpt getTemplateOpt(){
        return inbox.getWorkPlanTemplate(this.workplanTemplateId);
    }
    public JourneyPlanOpt getTemplateFullOpt(){
        return inbox.getWorkPlanTemplate(this.workplanTemplateId,false,true,true);
    }
    public boolean copyFormDefaults(){
        JourneyPlanOpt jpTemplate=getTemplateFullOpt();
        ArrayList<UnitsOpt> unitsOpts=jpTemplate.getUnitList();

        if(taskList !=null && unitsOpts!=null){
            HashMap<String, UnitsOpt> unitsOptHashMap = jpTemplate.getUnitListHashMap();
            /*
            HashMap<String, UnitsOpt> unitsOptHashMap = new HashMap<>();
            for(UnitsOpt unit:unitsOpts){
                if(unit.getDefaultFormValues()!=null){
                    unitsOptHashMap.put(unit.getUnitId(), unit);
                }
            }*/
            for(Task task:taskList){
                if(task.getWholeUnitList()!=null){
                    for(Units unit:task.getWholeUnitList()){
                        UnitsOpt unitsOpt=unitsOptHashMap.get(unit.getUnitId());
                        if(unitsOpt !=null){
                            unit.setDefaultFormValues(unitsOpt.getDefaultFormValues());
                            unit.setDefectsList(unitsOpt.getDefectsList());
                            unit.setAtivDefects(unitsOpt.getaDefects());
                        }
                    }
                }

            }
        }
        return true;
    }
    public void setActiveSession(){
        for (Session session : getIntervals().getSessions()) {
            if (session.getStatus().equals(SESSION_STARTED)) {
                activeSession = session;
                setTraverseObj(session.traverseTrack);
                setObserveObj(session.observeTrack);
                break;
            }
        }
    }
    public void setTraverseObj(String id){
        for(Units unit: taskList.get(0).getWholeUnitList()){
            if(unit.getUnitId().equals(id)){
                activeSession.setTraverseUnit(unit);
            }
        }
    }
    public void setObserveObj(String id){
        for(Units unit: taskList.get(0).getWholeUnitList()){
            if(unit.getUnitId().equals(id)){
                activeSession.setObserveUnit(unit);
            }
        }
    }
}
