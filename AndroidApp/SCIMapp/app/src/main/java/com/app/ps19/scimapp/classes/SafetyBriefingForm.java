package com.app.ps19.scimapp.classes;

import com.app.ps19.scimapp.Shared.IConvertHelper;
import com.app.ps19.scimapp.Shared.Utilities;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class SafetyBriefingForm implements  IConvertHelper{
    private String dateTime;
    private String workLocation;
    private String workAssignment;
    private String qPE;
    private String confirmCQ;
    private String lineOfTrack;
    private String trackMaxSpeed;
    private List<String> typeOfProtection;
    private String itdProtectionTime;
    private boolean haveFoulTimeForms;
    private String tawWatchPersonRequired;
    private String tawTime;
    private boolean tawLocationHotspot;
    private boolean tawAdditionalWatchpersons;
    private boolean taw15PerRule;
    private String  tawRequiredDistanceFeet;
    private boolean workZoneSignPlaced;
    private boolean oosTrainStopPlans;
    private boolean protectionEntryPoints;
    private boolean protectionAllDirections;
    private String protectionAllDirectionNoExplain;
    private boolean otherGroupsInvolved;
    private String discussRoadWorkerClear;
    private boolean watchPersonsHaveProperEquipment;
    private boolean workersCheckedVQC;
    private boolean allRadiosChecked;
    private List<String> discussedWithOperator;
    private boolean anyoneHaveConcern;
    private boolean anyoneHaveConcernSatisfied;

    private List<Worker> workers;
    private String reviewComments;
    private IssueImage signature;

    private HashMap<String, Object> hmBackupValues;
    private boolean changeOnly=false;
    public boolean isChangeOnly() {
        return changeOnly;
    }
    public void setChangeOnly(boolean changeOnly) {
        this.changeOnly = changeOnly;
    }


    public SafetyBriefingForm(JSONObject jo) {
        parseJsonObject(jo);
    }

    public String getWorkAssignment() {
        return workAssignment;
    }

    public void setWorkAssignment(String workAssignment) {
        this.workAssignment = workAssignment;
    }

    public String getConfirmCQ() {
        return confirmCQ;
    }

    public void setConfirmCQ(String confirmCQ) {
        this.confirmCQ = confirmCQ;
    }

    public String getProtectionAllDirectionNoExplain() {
        return protectionAllDirectionNoExplain;
    }

    public void setProtectionAllDirectionNoExplain(String protectionAllDirectionNoExplain) {
        this.protectionAllDirectionNoExplain = protectionAllDirectionNoExplain;
    }

    public List<Worker> getWorkers() {
        return workers;
    }

    public JSONArray getWorkersJA(){
        JSONArray ja=new JSONArray();
        if(this.workers!=null){
            for(Worker worker:this.workers){
                ja.put(worker.getJsonObject());
            }
        }

        return ja;
    }

    public void setWorkers(List<Worker> workers) {
        this.workers = workers;
    }
    public void setWorkers(JSONArray ja){
        if(ja !=null){
            try {
                this.workers = new ArrayList<>();
                for (int i = 0; i < ja.length(); i++) {
                    this.workers.add(new Worker(ja.getJSONObject(i)));
                }
            }catch (Exception e){
                e.printStackTrace();
            }
        }
    }

    public void setAnyoneHaveConcernSatisfied(boolean anyoneHaveConcernSatisfied) {
        this.anyoneHaveConcernSatisfied = anyoneHaveConcernSatisfied;
    }

    public String getReviewComments() {
        return reviewComments;
    }

    public void setReviewComments(String reviewComments) {
        this.reviewComments = reviewComments;
    }

    public IssueImage getSignature() {
        return signature;
    }

    public void setSignature(IssueImage signature) {
        this.signature = signature;
    }

    public String getDateTime() {
        return dateTime;
    }

    public void setDateTime(String dateTime) {
        this.dateTime = dateTime;
    }

    public String getWorkLocation() {
        return workLocation;
    }

    public void setWorkLocation(String workLocation) {
        this.workLocation = workLocation;
    }

    public String getqPE() {
        return qPE;
    }

    public void setqPE(String qPE) {
        this.qPE = qPE;
    }

    public String getLineOfTrack() {
        return lineOfTrack;
    }

    public void setLineOfTrack(String lineOfTrack) {
        this.lineOfTrack = lineOfTrack;
    }

    public String getTrackMaxSpeed() {
        return trackMaxSpeed;
    }

    public void setTrackMaxSpeed(String trackMaxSpeed) {
        this.trackMaxSpeed = trackMaxSpeed;
    }

    public List<String> getTypeOfProtection() {
        return typeOfProtection;
    }
    public JSONArray getTypeOfProtectionJA() {
        JSONArray ja = new JSONArray(this.typeOfProtection);
        return ja;
    }

    public void setMyTypeOfProtection(List<String> typeOfProtection) {
        this.typeOfProtection = typeOfProtection;
    }
    public void setTypeOfProtection(JSONArray typeOfProtection) {
        if(typeOfProtection!=null){
            this.typeOfProtection=new ArrayList<>();
            for(int i=0;i<typeOfProtection.length();i++){
                this.typeOfProtection.add(typeOfProtection.optString(i,""));
            }
        }
    }

    public String getItdProtectionTime() {
        return itdProtectionTime;
    }

    public void setItdProtectionTime(String itdProtectionTime) {
        this.itdProtectionTime = itdProtectionTime;
    }

    public boolean isHaveFoulTimeForms() {
        return haveFoulTimeForms;
    }

    public void setHaveFoulTimeForms(boolean haveFoulTimeForms) {
        this.haveFoulTimeForms = haveFoulTimeForms;
    }

    public String getTawWatchPersonRequired() {
        return tawWatchPersonRequired;
    }

    public void setTawWatchPersonRequired(String tawWatchPersonRequired) {
        this.tawWatchPersonRequired = tawWatchPersonRequired;
    }

    public String getTawTime() {
        return tawTime;
    }

    public void setTawTime(String tawTime) {
        this.tawTime = tawTime;
    }

    public boolean isTawLocationHotspot() {
        return tawLocationHotspot;
    }

    public void setTawLocationHotspot(boolean tawLocationHotspot) {
        this.tawLocationHotspot = tawLocationHotspot;
    }
    public boolean isTawAdditionalWatchpersons() {
        return tawAdditionalWatchpersons;
    }

    public void setTawAdditionalWatchpersons(boolean tawAdditionalWatchpersons) {
        this.tawAdditionalWatchpersons = tawAdditionalWatchpersons;
    }

    public boolean isTaw15PerRule() {
        return taw15PerRule;
    }

    public void setTaw15PerRule(boolean taw15PerRule) {
        this.taw15PerRule = taw15PerRule;
    }

    public String getTawRequiredDistanceFeet() {
        return tawRequiredDistanceFeet;
    }

    public void setTawRequiredDistanceFeet(String tawRequiredDistanceFeet) {
        this.tawRequiredDistanceFeet = tawRequiredDistanceFeet;
    }

    public boolean isWorkZoneSignPlaced() {
        return workZoneSignPlaced;
    }

    public void setWorkZoneSignPlaced(boolean workZoneSignPlaced) {
        this.workZoneSignPlaced = workZoneSignPlaced;
    }

    public boolean isOosTrainStopPlans() {
        return oosTrainStopPlans;
    }

    public void setOosTrainStopPlans(boolean oosTrainStopPlans) {
        this.oosTrainStopPlans = oosTrainStopPlans;
    }

    public boolean isProtectionEntryPoints() {
        return protectionEntryPoints;
    }

    public void setProtectionEntryPoints(boolean protectionEntryPoints) {
        this.protectionEntryPoints = protectionEntryPoints;
    }

    public boolean isProtectionAllDirections() {
        return protectionAllDirections;
    }

    public void setProtectionAllDirections(boolean protectionAllDirections) {
        this.protectionAllDirections = protectionAllDirections;
    }

    public boolean isOtherGroupsInvolved() {
        return otherGroupsInvolved;
    }

    public void setOtherGroupsInvolved(boolean otherGroupsInvolved) {
        this.otherGroupsInvolved = otherGroupsInvolved;
    }

    public String getDiscussRoadWorkerClear() {
        return discussRoadWorkerClear;
    }

    public void setDiscussRoadWorkerClear(String discussRoadWorkerClear) {
        this.discussRoadWorkerClear = discussRoadWorkerClear;
    }

    public boolean isWatchPersonsHaveProperEquipment() {
        return watchPersonsHaveProperEquipment;
    }

    public void setWatchPersonsHaveProperEquipment(boolean watchPersonsHaveProperEquipment) {
        this.watchPersonsHaveProperEquipment = watchPersonsHaveProperEquipment;
    }

    public boolean isWorkersCheckedVQC() {
        return workersCheckedVQC;
    }

    public void setWorkersCheckedVQC(boolean workersCheckedVQC) {
        this.workersCheckedVQC = workersCheckedVQC;
    }

    public boolean isAllRadiosChecked() {
        return allRadiosChecked;
    }

    public void setAllRadiosChecked(boolean allRadiosChecked) {
        this.allRadiosChecked = allRadiosChecked;
    }

    public List<String> getDiscussedWithOperator() {
        return discussedWithOperator;
    }

    public void setDiscussedWithOperator(List<String> discussedWithOperator) {
        this.discussedWithOperator = discussedWithOperator;
    }

    public void setDiscussedWithOperator(JSONArray discussedWithOperator) {
        if(discussedWithOperator!=null){
            this.discussedWithOperator=new ArrayList<>();
            for(int i=0;i<discussedWithOperator.length();i++){
                this.discussedWithOperator.add(discussedWithOperator.optString(i,""));
            }
        }
    }

    public boolean isAnyoneHaveConcern() {
        return anyoneHaveConcern;
    }

    public void setAnyoneHaveConcern(boolean anyoneHaveConcern) {
        this.anyoneHaveConcern = anyoneHaveConcern;
    }

    public boolean isAnyoneHaveConcernSatisfied() {
        return anyoneHaveConcernSatisfied;
    }

    public void setanyoneHaveConcernSatisfied(boolean anyoneHaveConcernStisfied) {
        this.anyoneHaveConcernSatisfied = anyoneHaveConcernStisfied;
    }

    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        try{
            hmBackupValues= Utilities.getHashMapJSONObject(jsonObject);
            setDateTime(jsonObject.optString("dateTime"));
            setWorkLocation(jsonObject.optString("workLocation"));
            setWorkAssignment(jsonObject.optString("workAssignment"));
            setqPE(jsonObject.optString("qPE"));
            setConfirmCQ(jsonObject.optString("confirmCQ"));
            setLineOfTrack(jsonObject.optString("lineOfTrack"));
            setTrackMaxSpeed(jsonObject.optString("trackMaxSpeed"));
            setTypeOfProtection(jsonObject.optJSONArray("typeOfProtection"));
            setItdProtectionTime(jsonObject.optString("itdProtectionTime"));
            setHaveFoulTimeForms(jsonObject.optBoolean("haveFoulTimeForms"));
            setTawWatchPersonRequired(jsonObject.optString("tawWatchPersonRequired"));
            setTawTime(jsonObject.optString("tawTime"));
            setTawLocationHotspot(jsonObject.optBoolean("tawLocationHotspot"));
            setTawAdditionalWatchpersons(jsonObject.optBoolean("tawAdditionalWatchpersons"));
            setTaw15PerRule(jsonObject.optBoolean("taw15PerRule"));
            setTawRequiredDistanceFeet(jsonObject.optString("tawRequiredDistanceFeet"));
            setWorkZoneSignPlaced(jsonObject.optBoolean("workZoneSignPlaced"));
            setOosTrainStopPlans(jsonObject.optBoolean("oosTrainStopPlans"));
            setProtectionEntryPoints(jsonObject.optBoolean("protectionEntryPoints"));
            setProtectionAllDirections(jsonObject.optBoolean("protectionAllDirections"));
            setProtectionAllDirectionNoExplain(jsonObject.optString("protectionAllDirectionNoExplain"));
            setOtherGroupsInvolved(jsonObject.optBoolean("otherGroupsInvolved"));
            setDiscussRoadWorkerClear(jsonObject.optString("discussRoadWorkerClear"));
            setWatchPersonsHaveProperEquipment(jsonObject.optBoolean("watchPersonsHaveProperEquipment"));
            setWorkersCheckedVQC(jsonObject.optBoolean("workersCheckedVQC") );
            setAllRadiosChecked(jsonObject.optBoolean("allRadiosChecked"));
            setDiscussedWithOperator(jsonObject.optJSONArray("discussedWithOperator"));
            setAnyoneHaveConcern(jsonObject.optBoolean("anyoneHaveConcern"));
            setanyoneHaveConcernSatisfied(jsonObject.optBoolean("anyoneHaveConcernSatisfied"));
            setWorkers(jsonObject.optJSONArray("workers"));
            setReviewComments(jsonObject.optString("reviewComments"));
            IssueImage objSignature=null;
            if(jsonObject.optJSONObject("signature")!=null){
                objSignature=new IssueImage(jsonObject.optJSONObject("signature"));
            }
            setSignature(objSignature);
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
        return false;
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jo=new JSONObject();
        if(changeOnly){
            jo=getJsonObjectChanged();
            return  jo;
        }
        try {
            jo.put("dateTime", getDateTime());
            jo.put("workLocation", getWorkLocation());
            jo.put("workAssignment", getWorkAssignment());
            jo.put("qPE", getqPE());
            jo.put("confirmCQ", getConfirmCQ());
            jo.put("lineOfTrack", getLineOfTrack());
            jo.put("trackMaxSpeed", getTrackMaxSpeed());
            jo.put("typeOfProtection", (getTypeOfProtection()!=null?getTypeOfProtectionJA():null));
            jo.put("itdProtectionTime", getItdProtectionTime());
            jo.put("haveFoulTimeForms", isHaveFoulTimeForms());
            jo.put("tawWatchPersonRequired", getTawWatchPersonRequired());
            jo.put("tawTime", getTawTime());
            jo.put("tawLocationHotspot", isTawLocationHotspot());
            jo.put("tawAdditionalWatchpersons", isTawAdditionalWatchpersons());
            jo.put("taw15PerRule", isTaw15PerRule());
            jo.put("tawRequiredDistanceFeet", getTawRequiredDistanceFeet());
            jo.put("workZoneSignPlaced", isWorkZoneSignPlaced());
            jo.put("oosTrainStopPlans", isOosTrainStopPlans());
            jo.put("protectionEntryPoints", isProtectionEntryPoints());
            jo.put("protectionAllDirections", isProtectionAllDirections());
            jo.put("protectionAllDirectionNoExplain", getProtectionAllDirectionNoExplain());
            jo.put("otherGroupsInvolved", isOtherGroupsInvolved());
            jo.put("discussRoadWorkerClear", getDiscussRoadWorkerClear());
            jo.put("watchPersonsHaveProperEquipment", isWatchPersonsHaveProperEquipment());
            jo.put("workersCheckedVQC", isWorkersCheckedVQC());
            jo.put("allRadiosChecked", isAllRadiosChecked());
            jo.put("discussedWithOperator", (getDiscussedWithOperator()!=null)?getDiscussedWithOperator().toArray():null);
            jo.put("anyoneHaveConcern", isAnyoneHaveConcern());
            jo.put("anyoneHaveConcernSatisfied", isAnyoneHaveConcernSatisfied());

            jo.put("workers",getWorkersJA());
            jo.put("reviewComments",getReviewComments());
            if(getSignature()!=null) {
                jo.put("signature", getSignature().getJsonObject());
            }
            jo.put("__replace", true);
        }catch(Exception e){
            e.printStackTrace();
            return null;
        }
        return jo;
    }
    public JSONObject getJsonObjectChanged() {
        JSONObject jo=new JSONObject();
        try {
            putJSONProperty(jo,"dateTime", getDateTime());
            putJSONProperty(jo,"workLocation", getWorkLocation());
            putJSONProperty(jo,"workAssignment", getWorkAssignment());
            putJSONProperty(jo,"qPE", getqPE());
            putJSONProperty(jo,"confirmCQ", getConfirmCQ());
            putJSONProperty(jo,"lineOfTrack", getLineOfTrack());
            putJSONProperty(jo,"trackMaxSpeed", getTrackMaxSpeed());
            putJSONProperty(jo,"typeOfProtection", (getTypeOfProtection()!=null?getTypeOfProtectionJA():null));
            putJSONProperty(jo,"itdProtectionTime", getItdProtectionTime());
            putJSONProperty(jo,"haveFoulTimeForms", isHaveFoulTimeForms());
            putJSONProperty(jo,"tawWatchPersonRequired", getTawWatchPersonRequired());
            putJSONProperty(jo,"tawTime", getTawTime());
            putJSONProperty(jo,"tawLocationHotspot", isTawLocationHotspot());
            putJSONProperty(jo,"tawAdditionalWatchpersons", isTawAdditionalWatchpersons());
            putJSONProperty(jo,"taw15PerRule", isTaw15PerRule());
            putJSONProperty(jo,"tawRequiredDistanceFeet", getTawRequiredDistanceFeet());
            putJSONProperty(jo,"workZoneSignPlaced", isWorkZoneSignPlaced());
            putJSONProperty(jo,"oosTrainStopPlans", isOosTrainStopPlans());
            putJSONProperty(jo,"protectionEntryPoints", isProtectionEntryPoints());
            putJSONProperty(jo,"protectionAllDirections", isProtectionAllDirections());
            putJSONProperty(jo,"protectionAllDirectionNoExplain", getProtectionAllDirectionNoExplain());
            putJSONProperty(jo,"otherGroupsInvolved", isOtherGroupsInvolved());
            putJSONProperty(jo,"discussRoadWorkerClear", getDiscussRoadWorkerClear());
            putJSONProperty(jo,"watchPersonsHaveProperEquipment", isWatchPersonsHaveProperEquipment());
            putJSONProperty(jo,"workersCheckedVQC", isWorkersCheckedVQC());
            putJSONProperty(jo,"allRadiosChecked", isAllRadiosChecked());
            putJSONProperty(jo,"discussedWithOperator", (getDiscussedWithOperator()!=null)?getDiscussedWithOperator().toArray():null);
            putJSONProperty(jo,"anyoneHaveConcern", isAnyoneHaveConcern());
            putJSONProperty(jo,"anyoneHaveConcernSatisfied", isAnyoneHaveConcernSatisfied());

            //JSONArray jsonArray=getWorkersJA();
            if(workers!=null) {
                if (workers.size() != getBackupArrayLen("workers") || workers.size() > 0) {
                    //jo.put("*remedialActionItems", jsonArray);
                    boolean isDataChanged = false;
                    boolean getChangeOnly = changeOnly;
                    if (getBackupArrayLen("workers") > workers.size()) {
                        getChangeOnly = false;
                        isDataChanged = true;
                    }
                    JSONArray jaWorker = new JSONArray();
                    for (Worker worker : workers) {
                        worker.setChangeOnly(getChangeOnly);
                        JSONObject joWorker = worker.getJsonObject();
                        jaWorker.put(joWorker);
                        if (joWorker.length() != 0) {
                            isDataChanged = true;
                        }
                    }
                    if (isDataChanged) {
                        putJSONProperty(jo, "workers", jaWorker);
                    }
                }
            }
            //putJSONProperty(jo,"workers",getWorkersJA());
            putJSONProperty(jo,"reviewComments",getReviewComments());
            if(getSignature()!=null) {
                putJSONProperty(jo,"signature", getSignature().getJsonObject());
            }
            if(jo.length()==0){
                return null;
            }
            if(jo !=null && jo.length()!=0){
                hmBackupValues=Utilities.putHashMapJSONObject(hmBackupValues, jo);
            }

            //putJSONProperty(jo,"__replace", true);
        }catch(Exception e){
            e.printStackTrace();
            return null;
        }
        return jo;
    }
    private int getBackupArrayLen(String fieldName){
        if(hmBackupValues==null){
            return 0;
        }
        if(hmBackupValues.get(fieldName) == null){
            return 0;
        }
        Object oldValue=hmBackupValues.get(fieldName);
        return ((JSONArray)oldValue).length();
    }

    private boolean putJSONProperty(JSONObject jo, String fieldName, Object value){
        Object oldValue=null;
        Object value1=null;
        oldValue=hmBackupValues.get(fieldName);
        if(oldValue instanceof  Integer){
            value1=Integer.parseInt((String) value);
        }else if(oldValue instanceof Float){
            value1=Float.parseFloat((String) value);
        }else{
            value1=value;
        }
        if(value1 instanceof  JSONArray){
            if(oldValue == null || (oldValue !=null && !oldValue.toString().equals(((JSONArray) value1).toString()))){
                try {
                    if(oldValue !=null && ((JSONArray) oldValue).length()>((JSONArray) value1).length()){
                        jo.put("*"+fieldName, value);
                    }else {
                        jo.put(fieldName, value);
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                    return  false;
                }
            }
        }else if(oldValue==null || (oldValue !=null && !oldValue.equals(value1))){
            try {
                jo.put(fieldName,value);
            } catch (JSONException e) {
                e.printStackTrace();
                return  false;
            }
        }
        return true;
    }

    public List<IssueImage> getImageList(){
        ArrayList<IssueImage> items=new ArrayList<IssueImage>();
        if(workers!=null) {
            for (Worker r : workers) {
                if (r.getSignature() != null) {
                    items.add(r.getSignature());
                }
            }
        }
        if(getSignature()!=null){
            items.add(getSignature());
        }
        return  items;
    }

    public boolean setImageStatus(HashMap<String , Integer> items){
        Boolean blnDataChanged=false;
        for(Worker worker: workers){
            boolean retValue = worker.setImgStatus(items);
            if(retValue){
                blnDataChanged=true;
            }
        }
        return blnDataChanged;
    }
}
