package com.app.ps19.tipsapp.classes;

import android.content.Context;
import android.graphics.Color;
import android.text.BoringLayout;
import android.util.Log;

import com.app.ps19.tipsapp.Shared.DBHandler;
import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.Shared.IConvertHelper;
import com.app.ps19.tipsapp.Shared.Utilities;
import com.app.ps19.tipsapp.classes.ativ.ATIVDefect;
import com.app.ps19.tipsapp.classes.dynforms.DynForm;
import com.app.ps19.tipsapp.classes.dynforms.DynFormList;
import com.app.ps19.tipsapp.classes.dynforms.defaultvalues.DynFormListDv;
import com.app.ps19.tipsapp.classes.equipment.Equipment;
import com.google.android.gms.maps.model.LatLng;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import static android.content.ContentValues.TAG;
import static android.os.Parcelable.PARCELABLE_WRITE_RETURN_VALUE;
import static com.app.ps19.tipsapp.Shared.Utilities.convertJsonArrayToHashMap;

public class Units implements IConvertHelper {

    private String trackId;
    private String unitId;
    private String description;
    private String assetType;
    private String assetTypeClassify="";
    private JSONObject joFormData;
    private HashMap<String, String> selection;
    private Context context;
    private AssetType assetTypeObj;
    private String start;
    private String end;
    private String parentId;
    private Units parentUnit;
    private String issueCounter = "0";
    private UnitAttributes attributes;
    private ArrayList<DynForm> appForms;
    private HashMap<String, Object> hmBackupValues;
    private boolean changeOnly=false;
    private String startMarker;
    private String endMarker;
    private DynFormListDv defaultFormValues;
    private ArrayList<UnitsTestOpt> testList = new ArrayList<>();
    private ArrayList<UnitsDefectsOpt> defectsList;
    private HashMap<String, DynForm> appFormListMap;
    private boolean loadMinimum=false;
    private boolean freeze=false;
    private UnitsGroup unitsGroup;
    private boolean visible=true;
    private ArrayList<ATIVDefect> ativDefects;
    private ArrayList<ATIVDefect> ativIssues;
    private ArrayList<Equipment> equipmentList;
    private ArrayList<Units> children;
    private ArrayList<DynForm> equipmentForms;
    private HashMap<String, DynForm> equipmentFormsHM=new HashMap<>();
    private int countFormWithTests=0;

    public int getCountFormWithTests() {
        return countFormWithTests;
    }
    public int getCountFormWithoutTests() {
        int totalSize= appForms!=null ? appForms.size() : 0;
        return totalSize- countFormWithTests;
    }

    public void setEquipmentList(ArrayList<Equipment> equipmentList) {
        this.equipmentList = equipmentList;
    }

    public ArrayList<Units> getChildren() {
        return children;
    }

    public void setChildren(ArrayList<Units> children) {
        this.children = children;
    }

    public ArrayList<Equipment> getEquipmentList() {
        return equipmentList;
    }

    public ArrayList<ATIVDefect> getAtivIssues() {
        return ativIssues;
    }

    public void setAtivIssues(ArrayList<ATIVDefect> ativIssues) {
        this.ativIssues = ativIssues;
    }

    public ArrayList<ATIVDefect> getAtivDefects() {
        return ativDefects;
    }

    public void setAtivDefects(ArrayList<ATIVDefect> ativDefects) {
        this.ativDefects = ativDefects;
    }

    public ArrayList<UnitsDefectsOpt> getDefectsList() {
        return defectsList;
    }

    public boolean isVisible() {
        return visible;
    }

    public void setVisible(boolean visible) {
        this.visible = visible;
    }

    public String getAssetTypeDisplayName(){
        String displayName =assetType;
        if(assetTypeObj!=null){
            displayName=assetTypeObj.getDisplayName().equals("")?assetType:assetTypeObj.getDisplayName();
        }
        return displayName;
    }
    public void setDefectsList(ArrayList<UnitsDefectsOpt> defectsList) {
        this.defectsList = defectsList;
    }

    public Boolean hasDefectsList(){
        return defectsList != null;
    }

    public ArrayList<UnitsTestOpt> getTestFormList() {
        return testList;
    }

    public boolean isGroupMember(){
        if(this.attributes !=null && !this.attributes.getGroup().equals("")){
            return  true;
        }
        return false;
    }

    public void setUnitsGroup(UnitsGroup unitsGroup) {
        this.unitsGroup = unitsGroup;
    }

    public UnitsGroup getUnitsGroup() {
        return unitsGroup;
    }

    private JSONArray getUnitsDefectsJsonArray(){
        JSONArray ja = new JSONArray();
        for(int i = 0 ; i< defectsList.size(); i++){
            try {
                ja.put(i, defectsList.get(i).getJsonObject());
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return ja;
    }


    public int getUnitColor(){
        int retColor = Globals.COLOR_TEST_NOT_ACTIVE;

        for(int i = 0 ; i< testList.size(); i++){
            if(testList.get(i).getColor() == Globals.COLOR_TEST_EXPIRING) {
                retColor = Globals.COLOR_TEST_EXPIRING;
                break;
            }else if(testList.get(i).getColor() != Globals.COLOR_TEST_NOT_ACTIVE){
                retColor = testList.get(i).getColor();
            }
        }
        return retColor;
    }

    private JSONArray getUnitsTestsJsonArray(){
        JSONArray ja = new JSONArray();
        for(int i = 0 ; i< testList.size(); i++){
            try {
                ja.put(i, testList.get(i).getJsonObject());
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return ja;
    }


    private int unitColor = Color.parseColor("darkgray");
    private int sortOrder=0;
    private boolean linear=false;

    public void setLinear(boolean linear) {
        this.linear = linear;
    }

    public boolean isLinear() {
        return linear;
    }

    public int getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(int sortOrder) {
        this.sortOrder = sortOrder;
    }

    public void setContext(Context context) {
        this.context = context;
    }

    public void setUnitColor(int color) {

        if(color == Globals.COLOR_TEST_EXPIRING){
            this.unitColor = color;
        }else if(color == Globals.COLOR_TEST_NOT_ACTIVE){
            if(this.unitColor ==  Globals.COLOR_TEST_NOT_ACTIVE) {
                this.unitColor = color;
            }
        }
    }

    public int getColor() {
        return this.unitColor;
    }

    public Context getContext() {
        return context;
    }

    public void setDefaultFormValues(DynFormListDv defaultFormValues) {
        this.defaultFormValues = defaultFormValues;
    }

    public DynFormListDv getDefaultFormValues() {
        return defaultFormValues;
    }

    public boolean isChangeOnly() {
        return changeOnly;
    }
    public void setChangeOnly(boolean changeOnly) {
        this.changeOnly = changeOnly;
    }

    public UnitAttributes getAttributes() {
        return attributes;
    }

    public void setAttributes(UnitAttributes attributes) {
        this.attributes = attributes;
    }
    public ArrayList<DynForm> getAppForms() {
        return appForms;
    }
    public void setAppForms(ArrayList<DynForm> appForms) {
        this.appForms = appForms;
    }
    public String getIssueCounter() {
        return issueCounter;
    }

    public void setIssueCounter(String issueCounter) {
        this.issueCounter = issueCounter;
    }

    public Units getParentUnit() {
        return parentUnit;
    }

    public void setParentUnit(Units parentUnit) {
        this.parentUnit = parentUnit;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }


    public String getStart() {
        return start;
    }

    public void setStart(String start) {
        this.start = start;
    }

    public String getEnd() {
        return end;
    }

    public void setEnd(String end) {
        this.end = end;
    }

    private ArrayList<LatLong> coordinates=new ArrayList<>();
    private Geometry coordinatesAdj;

    public Geometry getCoordinatesAdj() {
        return coordinatesAdj;
    }

    public void setCoordinatesAdj(Geometry coordinatesAdj) {
        this.coordinatesAdj = coordinatesAdj;
    }

    public HashMap<String, String> getSelection() {
        return selection;
    }

    public AssetType getAssetTypeObj() {
        return assetTypeObj;
    }

    public void setAssetTypeObj(AssetType assetTypeObj) {
        this.assetTypeObj = assetTypeObj;
    }


    public void setSelection(HashMap<String, String> selection) {
        this.selection = selection;
    }
    public String getAssetTypeClassify () {
        return assetTypeClassify;
    }
    public void setAssetTypeClassify(String assetTypeClassify) {
        this.assetTypeClassify = assetTypeClassify;
    }
    private JSONObject convertSelectionHM(){
        JSONObject jo=new JSONObject();
        if(selection == null){
            return jo;
        }
        try {
            for (String key : selection.keySet()) {
                /*if(key.equals("null")){
                    jo.();
                }*/
                if (selection.get(key) == null) {
                    jo.put(key, "");
                } else {
                    jo.put(key, selection.get(key));
                }

            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return jo;
    }
    public Units(Context context, JSONObject jo){
        this.context=context;
        parseJsonObject(jo);
        loadFormTemplate();

    }
    public Units(){
        hmBackupValues=new HashMap<>();
    }
    public Units(JSONObject jo,boolean loadMinimum) {
        this.loadMinimum=loadMinimum;
        this.trackId = jo.optString("track_id", "");
        this.unitId = jo.optString("id", "");
        this.description = jo.optString("unitId", "");
        this.assetType = jo.optString("assetType","");
        this.start = jo.optString("start", "-1");
        this.end = jo.optString("end", "-1");
        parseJsonObject(jo);
        loadFormTemplate();
    }

    public Units(JSONObject jo) {
        this.trackId = jo.optString("track_id", "");
        this.unitId = jo.optString("id", "");
        this.description = jo.optString("unitId", "");
        this.assetType = jo.optString("assetType","");
        this.start = jo.optString("start", "-1");
        this.end = jo.optString("end", "-1");
        parseJsonObject(jo);
        loadFormTemplate();
    }
    private void loadFormTemplate(){
        joFormData=new JSONObject();

        DBHandler db=Globals.db;//new DBHandler(Globals.getDBContext());
        if(this.assetType != null){
            HashMap<String, String> assetTypeHM= db.getLookupListObj(Globals.CATEGORY_LIST_NAME,this.assetType);
            //db.close();
            AssetType aType = Globals.assetTypes.get(this.assetType);
            if(aType == null){
                aType = new AssetType(new JSONObject());
            }
            this.assetTypeObj = aType;
            if(assetTypeHM.size()==1){
                String strOpt1=assetTypeHM.get(assetTypeHM.keySet().toArray()[0]);
                if(!strOpt1.equals("")){
                    try {
                        JSONObject joOptparam1 = new JSONObject(strOpt1);
                    /*
                    String optParam1=joOptparam1.optString("opt1","");
                    JSONObject joOpt1=null;
                    if(optParam1.equals("")){
                        joOpt1=new JSONObject();
                    }else{
                        joOpt1=new JSONObject(optParam1);
                    }*/
                        this.joFormData = joOptparam1;//joOptparam1.getJSONObject("opt1");
                        this.assetTypeClassify=joOptparam1.optString("assetTypeClassify","");
                    }catch (Exception e){
                        e.printStackTrace();
                    }
                }
            }
        }


    }
    public JSONObject getJoFormData(){
        return this.joFormData;
    }
    public String getTrackId() {
        return trackId;
    }

    public void setTrackId(String trackId) {
        this.trackId = trackId;
    }

    public String getUnitId() {
        return unitId;
    }

    public void setUnitId(String unitId) {
        this.unitId = unitId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAssetType() {
        return assetType;
    }

    public void setAssetType(String assetType) {
        this.assetType = assetType;
        loadFormTemplate();
    }


    public JSONArray convertCoordinates() {

        JSONArray _retArray=new JSONArray();
        for(LatLong cord:  coordinates){
            JSONArray jaLatLng = new JSONArray();
            try {
                if(!cord.getLat().equals("") && !cord.getLon().equals("")){
                    jaLatLng.put(0, cord.getLat());
                    jaLatLng.put(1, cord.getLon());
                    _retArray.put(jaLatLng);
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return _retArray;
    }

    public ArrayList<LatLong> getCoordinates() {
        return coordinates;
    }
    public ArrayList<LatLng> getCoordinatesConvert(){
        ArrayList<LatLng> _items=new ArrayList<>();
        for(LatLong item : coordinates){
            _items.add(item.latLng);
        }
        return _items;
    }

    public void setCoordinates(ArrayList<LatLong> coordinates) {
        this.coordinates = coordinates;
    }


    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {

        try {
            hmBackupValues = Utilities.getHashMapJSONObject(jsonObject);
            if (jsonObject.has("form-sel")) {
                hmBackupValues.put("form-sel", jsonObject.getJSONObject("form-sel"));
            }

            if (jsonObject.has("adjCoordinates")) {
                hmBackupValues.put("adjCoordinates", jsonObject.getJSONObject("adjCoordinates"));
            }

            //setTrackId(jsonObject.getString("track_id"));
            setTrackId(jsonObject.optString("track_id", ""));
            //TODO: no value for id from loadInbox Globals file
            setUnitId(jsonObject.optString("id", ""));
            setDescription(jsonObject.optString("unitId", ""));
            setAssetType(jsonObject.getString("assetType"));
            setFreeze(jsonObject.optBoolean("freeze",false));
            UnitAttributes attributes = new UnitAttributes();
            attributes.setParent(this);
            if (jsonObject.has("attributes")) {
                attributes.parseJsonObject(jsonObject.getJSONObject("attributes"));
            }
            setAttributes(attributes);
            if (jsonObject.optString("start", "").equals("")) {
                setStart("-1");
            } else {
                setStart(jsonObject.optString("start", "-1"));
            }
            if (jsonObject.optString("end", "").equals("")) {
                setEnd("-1");
            } else {
                setEnd(jsonObject.optString("end", "-1"));
            }
            setParentId(jsonObject.optString("parent_id", ""));
            setStartMarker(jsonObject.optString("startMarker", ""));
            setEndMarker(jsonObject.optString("endMarker", ""));
            JSONObject joForm = jsonObject.optJSONObject("form-sel");
            JSONArray jaCoordinates = jsonObject.optJSONArray("coordinates");
            ArrayList<LatLong> _coordinates = new ArrayList<>();
            if (jaCoordinates != null) {
                for (int i = 0; i < jaCoordinates.length(); i++) {
                    JSONArray jaCord = jaCoordinates.optJSONArray(i);
                    if (jaCord != null) {
                        if (!jaCord.getString(0).equals("") && !jaCord.getString(1).equals("")) {
                            _coordinates.add(new LatLong(jaCord.getString(0), jaCord.getString(1)));
                        }
                    }
                }
            }
            this.coordinates = _coordinates;

            Geometry _adjCoordinates = null;
            JSONObject joAdjCoordinates = jsonObject.optJSONObject("adjCoordinates");
            if (joAdjCoordinates != null) {
                _adjCoordinates = new Geometry(joAdjCoordinates, "Point");
            }
            this.coordinatesAdj = _adjCoordinates;
            HashMap<String, String> _selection = new HashMap<>();
            if (joForm != null) {
                Iterator<String> keys = joForm.keys();
                while (keys.hasNext()) {
                    String key = keys.next();
                    if (joForm.getString(key).equals("")) {
                    } else {
                        _selection.put(key, joForm.getString(key));
                    }
                }
            }
            setSelection(_selection);
            if(!this.loadMinimum) {
                JSONArray jaEquForms = jsonObject.optJSONArray("appFormsEquipment");
                if(jaEquForms!=null){
                    //DynForm form=DynFormList.formListMap.get()
                    ArrayList<DynForm> _equipmentForms=new ArrayList<>();
                    for (int i = 0; i < jaEquForms.length(); i++) {
                        try {
                            JSONObject jo = jaEquForms.getJSONObject(i);
                            if (jo.length() > 0) {
                                String formId = jo.getString("id");
                                JSONArray jaFormData = jo.optJSONArray("form");
                                String formCode=jo.optString("code");
                                DynForm form = DynFormList.getFormListMap().get(formId);
                                if (form != null && !formCode.equals("")) {
                                            DynForm newForm = (DynForm) form.clone();
                                            newForm.cloneFieldList(form.getFormControlList());
                                            newForm.setCurrentValues(convertJsonArrayToHashMap(jaFormData));
                                            String key=formCode +"\n"+formId;

                                    this.equipmentFormsHM.put(key,newForm);
                                            _equipmentForms.add(newForm);
                                }
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }

                    }
                    this.equipmentForms=_equipmentForms;

                }
                JSONArray jaForms = jsonObject.optJSONArray("appForms");
                this.appForms = DynFormList.getFormList(assetType);
                if (this.appForms != null) {
                    HashMap<String, DynForm> formListMap = new HashMap<>();
                    for (DynForm form : this.appForms) {
                        formListMap.put(form.getFormId(), form);
                    }
                    this.appFormListMap = formListMap;
                    if(jaForms!=null) {
                        for (int i = 0; i < jaForms.length(); i++) {
                            try {
                                JSONObject jo = jaForms.getJSONObject(i);
                                if (jo.length() > 0) {
                                    String formId = jo.getString("id");
                                    JSONArray jaFormData = jo.optJSONArray("form");
                                    DynForm form = formListMap.get(formId);
                                    if (form != null) {
                                        form.setCurrentValues(convertJsonArrayToHashMap(jaFormData));
                                    }
                                }
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }
                    }
                }
                JSONArray jaEquipments=jsonObject.optJSONArray("equipments");
                ArrayList<Equipment> _equipmentList=new ArrayList<>();
                if(jaEquipments !=null){
                    for(int i=0;i<jaEquipments.length();i++){
                        JSONObject jo=jaEquipments.optJSONObject(i);
                        if(jo !=null){
                            _equipmentList.add(new Equipment(null,jo));
                        }
                    }
                }
                this.equipmentList=_equipmentList;
            }

            //Parsing Tests here
            JSONArray jaTests=jsonObject.optJSONArray("testForm");
            if(jaTests!=null){

                ArrayList<UnitsTestOpt> _testList=new ArrayList<>();
                HashMap<String, String> _testCodeHM=new HashMap<>();
                int clr=Globals.COLOR_TEST_NOT_ACTIVE;
                int _sortOrder=100;
                for(int i=0;i<jaTests.length();i++){
                    UnitsTestOpt test=new UnitsTestOpt(jaTests.optJSONObject(i));
                    test.setInspected(getInspectionStatus(test.getTestCode()));
                    int testColor = test.getColor();
                    if (testColor == Globals.COLOR_TEST_ACTIVE ||testColor == Globals.COLOR_TEST_EXPIRING) {
                        _sortOrder=Math.min(_sortOrder,test.getSortOrder());
                        clr = testColor;
                    }
                    if(DynFormList.isFormExists(assetType,test.getTestCode())){
                        _testList.add(test);
                        _testCodeHM.put(test.getTestCode(),test.getTitle());
                    }
                }

                if(clr==Globals.COLOR_TEST_NOT_ACTIVE){
                    setSortOrder(1000);
                }else{
                    setSortOrder(_sortOrder);
                }
                Collections.sort(_testList, new Comparator<UnitsTestOpt>() {
                    @Override
                    public int compare(UnitsTestOpt o1, UnitsTestOpt o2) {
                        return o1.getSortOrder()- o2.getSortOrder();
                    }
                });
                this.testList=_testList;
                //get count for form with tests and without test
                int cntFormWithTest = 0;
                if(this.appForms!=null){
                    for(DynForm form:this.appForms){
                        if (_testCodeHM.get(form.getFormId()) != null) {
                            cntFormWithTest++;
                        }
                    }
                }
                this.countFormWithTests=cntFormWithTest;
            }
            /*
            //Parsing Defects here
            JSONArray jaDefects = jsonObject.optJSONArray("issueDefects");

            if (jaDefects != null) {
                ArrayList<UnitsDefectsOpt> _defectsList = new ArrayList<>();

                for (int i = 0; i < jaDefects.length(); i++) {
                    UnitsDefectsOpt defect = new UnitsDefectsOpt(jaDefects.optJSONObject(i));
                    _defectsList.add(defect);
                }

                this.defectsList = _defectsList;
            }

*/
        /*get issue defects from template*/
            /*
            if(Globals.selectedJPlan !=null && Globals.selectedJPlan.getJpTemplate()!=null){
                JourneyPlanOpt jpTemplate=Globals.selectedJPlan.getJpTemplate();
                UnitsOpt unitsOpt=jpTemplate.getUnitOptById(unitId);
                ArrayList<UnitsDefectsOpt> _defectList=new ArrayList<>();
                if(unitsOpt!=null){
                    if(unitsOpt.getDefectsList()!=null){
                        _defectList.addAll(unitsOpt.getDefectsList());
                        this.defectsList=_defectList;
                    }
                }
            }*/
            //parsing ATIV defects
            JSONArray jaAtivDef = jsonObject.optJSONArray("ativ_defects");
            if(jaAtivDef!=null){
                ArrayList<ATIVDefect> _ativDefs=new ArrayList<>();
                for(int i=0;i<jaAtivDef.length();i++){
                    ATIVDefect _defect = new ATIVDefect(jaAtivDef.optJSONObject(i));
                    _ativDefs.add(_defect);
                }
                setAtivDefects(_ativDefs);
            }

            JSONArray jaFormsDv = jsonObject.optJSONArray("defaultAppForms");
            this.defaultFormValues = null;
            if (jaFormsDv != null) {
                this.defaultFormValues = new DynFormListDv(jaFormsDv);
            }

            if (getAssetTypeClassify().equals("linear")) {
                setLinear(true);
            } else {
                setLinear(false);
            }
            this.children=new ArrayList<>();
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return  false;
        }
    }

    private boolean getInspectionStatus(String testCode) {
        if(appFormListMap!=null){
            DynForm form= this.appFormListMap.get(testCode);
            if(form !=null){
                HashMap<String, String> formValues=form.getCurrentValues();
                if(formValues!=null){
                    String formCompleteId=form.getFormCompleteId();
                    if(formCompleteId!=null &&!formCompleteId.equals("")){
                        String value=formValues.get(formCompleteId);
                        if(value!=null){
                            if(value.equals("true")){
                                return true;
                            }else{
                                return false;
                            }

                        }
                    }
                    String value=formValues.get("Inspected");
                    if(value!=null && value.equals("true")){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jo=new JSONObject();

        if( changeOnly){
            jo=getJsonObjectChanged();
            return  jo;
        }

        try{
            jo.put("track_id",getTrackId());
            jo.put("id",getUnitId());
            jo.put("unitId",getDescription());
            jo.put("start", getStart());
            jo.put("end", getEnd());
            jo.put("assetType",getAssetType());
            jo.put("form-sel",convertSelectionHM());
            jo.put("coordinates", convertCoordinates());
            jo.put("parent_id",getParentId());
            jo.put("attributes", getAttributes().getJsonObject());
            jo.put("startMarker", getStartMarker());
            jo.put("endMarker", getEndMarker());
            jo.put("testForm", getUnitsTestsJsonArray());
            jo.put("freeze",isFreeze());
            //jo.put("issueDefects", getUnitsDefectsJsonArray());
            if(getEquipmentList() !=null && getEquipmentList().size()>0){
                JSONArray jaEquipments = new JSONArray();
                for(Equipment equipment: getEquipmentList()){
                    JSONObject joEquipment = equipment.getJsonObject();
                    if(joEquipment!=null){
                        jaEquipments.put(joEquipment);
                    }
                }
                jo.put("equipments",jaEquipments);

            }
            if(getAtivIssues()!=null){
                JSONArray jaAIssues = new JSONArray();
                for(ATIVDefect aDefect: getAtivIssues()){
                    JSONObject joDefect = aDefect.getJsonObject();
                    if(joDefect!=null){
                        jaAIssues.put(joDefect);
                    }
                }
                jo.put("ativ_defects",jaAIssues);
            }
            if(this.appForms !=null){
                JSONArray jaForms =new JSONArray();
                for(DynForm form : this.appForms){
                    JSONObject jsonObject=form.getJsonObject();
                    if(jsonObject!=null) {
                        jaForms.put(jsonObject);
                    }
                }
                jo.put("appForms",jaForms);
            }
            if(this.equipmentForms !=null){
                JSONArray jaForms =new JSONArray();
                for(DynForm form : this.equipmentForms){
                    JSONObject jsonObject=form.getJsonObject();
                    if(jsonObject!=null) {
                        jaForms.put(jsonObject);
                    }
                }
                jo.put("appFormsEquipment",jaForms);
            }
            if(this.coordinatesAdj!=null){
                jo.put("adjCoordinates",this.coordinatesAdj.getJsonObject());
            }

        }catch (Exception e)
        {
            Log.e(TAG,e.toString());
        }

        return jo;
    }
    @Override
    public String toString() {
        return description;
    }
    public JSONObject getJsonObjectChanged() {
        JSONObject jo=new JSONObject();
        try{

            putJSONProperty(jo,"track_id",getTrackId());
            putJSONProperty(jo,"id",getUnitId());
            putJSONProperty(jo,"unitId",getDescription());
            putJSONProperty(jo,"start", getStart());
            putJSONProperty(jo,"end", getEnd());
            putJSONProperty(jo,"assetType",getAssetType());
            putJSONProperty(jo, "startMarker", getStartMarker());
            putJSONProperty(jo, "endMarker", getEndMarker());
            putJSONProperty(jo,"freeze",isFreeze());

            JSONObject joFormSel=convertSelectionHM();
            if(joFormSel !=null && joFormSel.length()>0) {
                putJSONProperty(jo, "form-sel", joFormSel);
            }

            putJSONProperty(jo,"coordinates", convertCoordinates());
            putJSONProperty(jo,"parent_id",getParentId());
            getAttributes().setChangeOnly(changeOnly);
            JSONObject joUnitAttr=getAttributes().getJsonObject();
            if(joUnitAttr !=null && joUnitAttr.length()>0) {
                jo.put( "attributes", joUnitAttr);
            }
            /*
            JSONArray jaDefects = getUnitsDefectsJsonArray();
            if(jaDefects !=null && jaDefects.length()>0) {
                jo.put( "issueDefects", jaDefects);
            }*/
            //jo.put("testForm", getUnitsTestsJsonArray());
            //jo.put("issueDefects", getUnitsDefectsJsonArray());

            if(this.appForms !=null && this.appForms.size()>0){
                JSONArray jaForms =new JSONArray();
                //int prevSize=-1;
                //JSONArray jsonArray=(JSONArray) this.hmBackupValues.get("appForms");
                //if(jsonArray !=null){
                 //   prevSize=jsonArray.length();
                //}
                boolean dataExists=false;
                for(DynForm form : this.appForms){
                    form.setChangeOnly(changeOnly);
                    JSONObject jsonObject=form.getJsonObject();
                    if(jsonObject!=null) {
                        jaForms.put(jsonObject);
                        dataExists=true;
                    }else{
                        jaForms.put(new JSONObject());
                    }
                }
                if(dataExists){
                    jo.put("appForms", jaForms);
                }

                /*
                if(jaForms.length()>0) {
                    if(jaForms.length() > prevSize){
                        jaForms =new JSONArray();
                        for(DynForm form : this.appForms){
                            form.setChangeOnly(false);
                            JSONObject jsonObject=form.getJsonObject();
                            if(jsonObject!=null) {
                                jaForms.put(jsonObject);
                            }else{
                                jaForms.put(new JSONObject());
                            }
                        }
                        jo.put("*appForms", jaForms);
                    }else{
                        jo.put("appForms", jaForms);
                    }

                }
                */
            }
            if(this.equipmentForms !=null){
                JSONArray jaForms =new JSONArray();
                boolean dataExists=false;
                for(DynForm form : this.equipmentForms){
                    form.setChangeOnly(changeOnly);
                    JSONObject jsonObject=form.getJsonObject();
                    if(jsonObject!=null) {
                        jaForms.put(jsonObject);
                        dataExists=true;
                    }else{
                        jaForms.put(new JSONObject());
                    }
                }
                if(dataExists){
                    jo.put("appFormsEquipment", jaForms);
                }
            }
            if(this.coordinatesAdj!=null){
                Geometry geometry=getCoordinatesAdj();
                putJSONProperty(jo,"adjCoordinates",geometry.getJsonObject());
            }

            if(jo !=null && jo.length()!=0){
                hmBackupValues=Utilities.putHashMapJSONObject(hmBackupValues, jo);
            }

        }catch (Exception e)
        {
            Log.e(TAG,e.toString());
        }

        return jo;
    }
    private boolean putJSONProperty(JSONObject jo, String fieldName, Object value){
        Object oldValue=null;
        oldValue=hmBackupValues.get(fieldName);
        if(oldValue !=null && oldValue instanceof JSONObject){
            if(!oldValue.toString().equals(value.toString())){
                try {
                    jo.put(fieldName,value);
                } catch (JSONException e) {
                    e.printStackTrace();
                    return  false;
                }
            }
        }else if(oldValue==null || (oldValue !=null && !oldValue.equals(value))){
            try {
                jo.put(fieldName,value);
            } catch (JSONException e) {
                e.printStackTrace();
                return  false;
            }
        }
        return true;
    }
    public Units makeClone(){
        Units unit=new Units();
        unit.setTrackId(getTrackId());
        unit.setUnitId(getUnitId());
        unit.setDescription(getDescription());
        unit.setStart( getStart());
        unit.setEnd(getEnd());
        unit.setFreeze(isFreeze());
        unit.setAssetType(getAssetType());
        unit.setCoordinates(getCoordinates());
        unit.setParentId(getParentId());
        unit.setAttributes(getAttributes().makeClone());
        return  unit;
    }
    public String getEndMarker() {
        return endMarker;
    }

    public void setEndMarker(String endMarker) {
        this.endMarker = endMarker;
    }

    public String getStartMarker() {
        return startMarker;
    }

    public void setStartMarker(String startMarker) {
        this.startMarker = startMarker;
    }
    public DynForm getUnitForm(String formId){
        DynForm form=null;
        if(appFormListMap!=null) {
            form = appFormListMap.get(formId);
        }
        return form;
    }
    public UnitsTestOpt getUnitTestOpt(String formId){
        UnitsTestOpt unitsTestOpt=null;
        List<UnitsTestOpt> unitTestList=getTestFormList();
        for(UnitsTestOpt unitTest:unitTestList){
            if(unitTest.getTestCode().equals(formId)){
                 return unitTest;
            }
        }
        return unitsTestOpt;
    }
    public DynForm getEquipmentForm(Equipment equipment,String formId){
        String formCode=equipment.getId();
        String key=equipment.getId() +"\n"+formId;
        DynForm _form =this.equipmentFormsHM.get(key);

        if(_form==null){
            DynForm form = DynFormList.getFormListMap().get(formId);
            if (form != null && !formCode.equals("")) {
                try {
                    DynForm newForm = (DynForm) form.clone();
                    newForm.cloneFieldList(form.getFormControlList());
                    //form.setCurrentValues(convertJsonArrayToHashMap(jaFormData));
                    this.equipmentFormsHM.put(key, newForm);
                    if(equipmentForms==null){
                        equipmentForms=new ArrayList<>();
                    }
                    this.equipmentForms.add(newForm);
                    _form=newForm;
                }catch (Exception e){
                    e.printStackTrace();
                }
            }
        }
        return _form;
    }
    public void setFreeze(boolean freeze) {
        this.freeze = freeze;
    }

    public boolean isFreeze() {
        return freeze;
    }
}
