package com.app.ps19.tipsapp.classes.safetybriefings;

import com.app.ps19.tipsapp.Shared.IConvertHelper;
import com.app.ps19.tipsapp.Shared.Utilities;
import com.app.ps19.tipsapp.classes.IssueImage;
import com.app.ps19.tipsapp.classes.Task;
import com.app.ps19.tipsapp.classes.Worker;
import com.app.ps19.tipsapp.classes.dynforms.DynForm;
import com.app.ps19.tipsapp.classes.dynforms.DynFormList;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import kotlinx.coroutines.Job;

public class JobBriefing implements IConvertHelper {
    private ArrayList<DynForm> jobBriefingForms = new ArrayList<>();
    private List<Worker> workers;
    private String reviewComments;
    private IssueImage signature;
    private HashMap<String, Object> hmBackupValues;
    private boolean changeOnly=false;
    private boolean isDirty = false;

    public boolean isDirty() {
        return isDirty;
    }

    public void setDirty(boolean dirty) {
        isDirty = dirty;
    }
    public boolean isChangeOnly() {
        return changeOnly;
    }

    public void setChangeOnly(boolean changeOnly) {
        this.changeOnly = changeOnly;
    }

    public ArrayList<DynForm> getJobBriefingForms() {
        return jobBriefingForms;
    }

    public void setJobBriefingForms(ArrayList<DynForm> jobBriefingForms) {
        this.jobBriefingForms = jobBriefingForms;
    }

    public List<Worker> getWorkers() {
        return workers;
    }
    public void setWorkers(List<Worker> workers){
        this.workers= workers;
    }

    public void setJAWorkers(JSONArray ja){
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
    public JSONArray getWorkersJA(){
        JSONArray ja=new JSONArray();
        if(this.workers!=null){
            for(Worker worker:this.workers){
                ja.put(worker.getJsonObject());
            }
        }

        return ja;
    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        hmBackupValues= Utilities.getHashMapJSONObject(jsonObject);
        try {
            setJAWorkers(jsonObject.optJSONArray("workers"));
            setReviewComments(jsonObject.optString("reviewComments"));
            IssueImage objSignature=null;
            if(jsonObject.optJSONObject("signature")!=null){
                objSignature=new IssueImage(jsonObject.optJSONObject("signature"));
            }
            setSignature(objSignature);
            JSONArray jaForms=jsonObject.optJSONArray("jobBriefingForms");
            //DynFormList.loadFormList();
            //this.appForms= DynFormList.getFormList();
            if(getJobBriefingForms().size()==0) {
                HashMap<String, DynForm> formListMap = DynFormList.getFormListMap();
                if (jaForms != null) {
                    ArrayList<DynForm> _dynForm = new ArrayList<>();
                    for (int i = 0; i < jaForms.length(); i++) {
                        try {
                            JSONObject jo = jaForms.getJSONObject(i);
                            String formId = jo.getString("id");
                            JSONArray jaFormData = jo.optJSONArray("form");
                            DynForm form = formListMap.get(formId);

                            DynForm newForm = cloneForm(form);

                            if (newForm != null) {
                                _dynForm.add(newForm);
                                if (jaFormData != null)
                                    newForm.setCurrentValues(convertJsonArrayToHashMap(jaFormData));
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                    setJobBriefingForms(_dynForm);
                }
            }/*else {
                HashMap<String, ArrayList<DynForm> > fm =  DynFormList.getFormListForBriefingHM();
                for(String key: fm.keySet()){

                }
            }*/
           /* ArrayList<DynForm> _dynForm = new ArrayList<>();
            JSONArray ja = jsonObject.optJSONArray("jobBriefingForms");
            if(ja!=null){
                for (int i = 0; i < ja.length(); i++) {
                    DynForm form = new DynForm(ja.getJSONObject(i));
                    _dynForm.add(form);
                }
                setJobBriefingForms(_dynForm);
            }*/
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
    @Override
    public JSONObject getJsonObject() {
        JSONObject jo=new JSONObject();
        if(changeOnly && hmBackupValues!=null && !hmBackupValues.isEmpty()){
            jo=getJsonObjectChanged();
            return jo;
        }

        JSONArray jaBriefings = new JSONArray();
        try {
            boolean isDataChanged = false;
            for (DynForm briefing : getJobBriefingForms()) {
                JSONObject joData = briefing.getJsonObject();
                if(joData!=null && joData.length()>0){
                    isDataChanged = true;
                    jaBriefings.put(joData);
                } else{
                    jaBriefings.put(new JSONObject());
                }
            }
            if(isDataChanged){
                jo.put("jobBriefingForms", jaBriefings);
            }

            if(getWorkersJA().length() != 0){
                jo.put("workers",getWorkersJA());
            }
            jo.put("reviewComments",getReviewComments());
            if(getSignature()!=null) {
                jo.put("signature", getSignature().getJsonObject());
            }
            hmBackupValues=Utilities.getHashMapJSONObject(jo);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jo;
    }
    public JSONObject getJsonObjectChanged() {
        JSONObject jo = new JSONObject();
        boolean isDataChanged = false;
        JSONArray jaBriefings = new JSONArray();
        try {
            for (DynForm briefing : getJobBriefingForms()) {
                JSONObject joData = briefing.getJsonObject();
                if(joData!=null){
                    isDataChanged = true;
                    jaBriefings.put(joData);
                } else{
                    jaBriefings.put(new JSONObject());
                }
            }
            if(isDataChanged){
                jo.put("jobBriefingForms", jaBriefings);
            }
            if(workers!=null) {
                if (workers.size() != getBackupArrayLen("workers") || workers.size() > 0) {
                    //jo.put("*remedialActionItems", jsonArray);
                    boolean _isDataChanged = false;
                    boolean getChangeOnly = changeOnly;
                    if (getBackupArrayLen("workers") > workers.size()) {
                        getChangeOnly = false;
                        _isDataChanged = true;
                    }
                    JSONArray jaWorker = new JSONArray();
                    for (Worker worker : workers) {
                        worker.setChangeOnly(getChangeOnly);
                        JSONObject joWorker = worker.getJsonObject();
                        jaWorker.put(joWorker);
                        if (joWorker.length() != 0) {
                            _isDataChanged = true;
                        }
                    }
                    if (_isDataChanged) {
                        putJSONProperty(jo, "workers", jaWorker);
                    }
                }
            }
            if (getReviewComments() != null && !getReviewComments().equals("")) {
                putJSONProperty(jo, "reviewComments", getReviewComments());
            }
            if (getSignature() != null) {
                putJSONProperty(jo, "signature", getSignature().getJsonObject());
            }
            if(jo.length()==0){
                return null;
            }


            if(jo !=null && jo.length()!=0){
                hmBackupValues=Utilities.putHashMapJSONObject(hmBackupValues, jo);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jo;
    }
    private boolean putJSONProperty(JSONObject jo, String fieldName, Object value){
        Object oldValue=null;
        oldValue=hmBackupValues.get(fieldName);

        if(oldValue instanceof JSONArray ){
            if(!oldValue.toString().equals(value.toString())){
                try {
                    if(((JSONArray) oldValue).length()>((JSONArray)value).length()){
                        jo.put("*"+fieldName,value);
                    }else {
                        jo.put(fieldName, value);
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }else if(oldValue !=null && !oldValue.equals(value)){
            try {
                jo.put(fieldName,value);
            } catch (JSONException e) {
                e.printStackTrace();
                return  false;
            }
        }
        //hmBackupValues.put(fieldName,value);
        return true;
    }
    public JobBriefing(){}
    public JobBriefing(JSONObject jo){
        parseJsonObject(jo);
    }
    public JobBriefing(ArrayList<DynForm> forms,JSONObject joData){
        try {
            HashMap<String, JSONArray> formData=new HashMap<>();
            if(joData!=null){
                JSONArray jaForms=joData.optJSONArray("jobBriefingForms");
                if(jaForms!=null){
                    for(int i=0;i<jaForms.length();i++){
                        JSONObject joFormObject=jaForms.optJSONObject(i);
                        if(joFormObject!=null){
                            String formId=joFormObject.optString("id");
                            JSONArray jaFormData=joFormObject.optJSONArray("form");
                            formData.put(formId,jaFormData);
                        }

                    }
                }
            }

            for(DynForm form: forms){
                DynForm newForm = (DynForm) form.clone();
                newForm.cloneFieldList(form.getFormControlList());
                JSONArray jaFormData=formData.get(form.getFormId());
                if(jaFormData!=null){
                    newForm.setCurrentValues(convertJsonArrayToHashMap(jaFormData));
                }
                getJobBriefingForms().add(newForm);
                if(joData!=null) {
                    parseJsonObject(joData);
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }
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
    private HashMap<String, String> convertJsonArrayToHashMap(JSONArray ja){
        HashMap<String , String > map=new HashMap<>();
        for(int i=0;i<ja.length();i++){
            try {
                JSONObject jo=ja.optJSONObject(i);
                if(jo !=null && jo.length()>0) {
                    String id = jo.getString("id");
                    String value = jo.getString("value");
                    map.put(id, value);
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return map;
    }
    public DynForm cloneForm(DynForm sourceForm){

        try {
            DynForm form1=(DynForm) sourceForm.clone();
            form1.setChangeEventListener(null);
            form1.cloneFieldList(sourceForm.getFormControlList());
            return form1;
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
        }
        return null;
    }
}
