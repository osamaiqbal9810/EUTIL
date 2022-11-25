package com.app.ps19.scimapp.classes;

import android.content.Context;

import com.app.ps19.scimapp.Shared.DBHandler;
import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.Shared.IConvertHelper;
import com.app.ps19.scimapp.classes.ativ.ATIVDefect;
import com.app.ps19.scimapp.classes.dynforms.DynFormList;
import com.app.ps19.scimapp.classes.dynforms.defaultvalues.DynFormListDv;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;

public class UnitsOpt implements IConvertHelper {

    private String unitId;
    private String description;
    private String assetType;
    private String assetTypeClassify="";
    private int sortOrder=0;
    private Context context;
    private AssetType assetTypeObj;
    private int color= Globals.COLOR_TEST_NOT_ACTIVE;
    private DynFormListDv defaultFormValues;
    private JSONObject joFormData;
    private String unitLocation = "";

    public ArrayList<ATIVDefect> getaDefects() {
        return aDefects;
    }

    public void setaDefects(ArrayList<ATIVDefect> aDefects) {
        this.aDefects = aDefects;
    }

    private ArrayList<ATIVDefect> aDefects;

    public DynFormListDv getDefaultFormValues() {
        return defaultFormValues;
    }

    public void setDefaultFormValues(DynFormListDv defaultFormValues) {
        this.defaultFormValues = defaultFormValues;
    }

    private ArrayList<UnitsDefectsOpt> defectsList;

    public ArrayList<UnitsDefectsOpt> getDefectsList() {
        return defectsList;
    }

    public void setSortOrder(int sortOrder) {
        this.sortOrder = sortOrder;
    }

    public int getSortOrder() {
        return sortOrder;
    }

    ArrayList<UnitsTestOpt> testList=new ArrayList<>();

    public void setTestList(ArrayList<UnitsTestOpt> list) {
        testList = list;
    }

    public ArrayList<UnitsTestOpt> getTestList() {
        return testList;
    }

    public void setColor(int color) {
        this.color = color;
    }

    public int getColor() {
        return color;
    }

    public AssetType getAssetTypeObj() {
        return assetTypeObj;
    }
    public void setAssetTypeObj(AssetType assetTypeObj) {
        this.assetTypeObj = assetTypeObj;
    }
    public String getAssetTypeClassify () {
        return assetTypeClassify;
    }
    public void setAssetTypeClassify(String assetTypeClassify) {
        this.assetTypeClassify = assetTypeClassify;
    }
    public UnitsOpt(Context context, JSONObject jo){
        this.context=context;
        parseJsonObject(jo);

    }
    public UnitsOpt(JSONObject jo) {
        parseJsonObject(jo);

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

    public String getUnitLocation() {
        return unitLocation;
    }

    public void setUnitLocation(String unitLocation) {
        this.unitLocation = unitLocation;
    }

    public String getAssetType() {
        return assetType;
    }
    public String getAssetTypeDisplayName(){
        if(assetTypeObj!=null){
            return assetTypeObj.getDisplayName().equals("")?assetType:assetTypeObj.getDisplayName();
        }
        return assetType;
    }
    public void setAssetType(String assetType) {
        this.assetType = assetType;
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
                        //this.joFormData = joOptparam1;//joOptparam1.getJSONObject("opt1");
                        this.assetTypeClassify=joOptparam1.optString("assetTypeClassify","");
                    }catch (Exception e){
                        e.printStackTrace();
                    }
                }
            }
        }


    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {

        try{
            //hmBackupValues= Utilities.getHashMapJSONObject(jsonObject);
            //TODO: no value for id from loadInbox Globals file
            setUnitId(jsonObject.optString("id", ""));
            setDescription(jsonObject.optString("unitId", ""));
            setUnitLocation(jsonObject.optString("unitId", ""));
            setAssetType(jsonObject.getString("assetType"));

            //Parsing Tests here
            JSONArray jaTests=jsonObject.optJSONArray("testForm");
            if(jaTests!=null){

                ArrayList<UnitsTestOpt> _testList=new ArrayList<>();
                int color=Globals.COLOR_TEST_NOT_ACTIVE;
                int _sortOrder=100;
                for(int i=0;i<jaTests.length();i++){
                    UnitsTestOpt test=new UnitsTestOpt(jaTests.optJSONObject(i));
                    if (test.getColor() == Globals.COLOR_TEST_ACTIVE || test.getColor()==Globals.COLOR_TEST_EXPIRING) {
                        _sortOrder=Math.min(_sortOrder,test.getSortOrder());
                        if(color!=Globals.COLOR_TEST_EXPIRING){
                            color=test.getColor();
                        }
                    }
                    //   if(test.getDescription() != "null") {
                    if(DynFormList.isFormExists(assetType,test.getTestCode())){
                        _testList.add(test);
                    }
                    //     }
                }
                setColor(color);
                if(color==Globals.COLOR_TEST_NOT_ACTIVE){
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
            }

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
            JSONArray jaADefects = jsonObject.optJSONArray("ativ_defects");

            if (jaADefects != null) {
                ArrayList<ATIVDefect> _aDefectsList = new ArrayList<>();

                for (int i = 0; i < jaADefects.length(); i++) {
                    ATIVDefect defect = new ATIVDefect(jaADefects.optJSONObject(i));
                    _aDefectsList.add(defect);
                }

                setaDefects(_aDefectsList);
            }


            JSONArray jaFormsDv=jsonObject.optJSONArray("defaultAppForms");
            this.defaultFormValues=null;
            if(jaFormsDv !=null){
                this.defaultFormValues=new DynFormListDv(jaFormsDv);
            }

            return true;
        }catch (Exception e){
            e.printStackTrace();
            return  false;
        }
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jo=new JSONObject();


        return jo;
    }
    @Override
    public String toString() {
        return description;
    }
    public void calculate(){
        int color;
        int sortOrder;
        for(UnitsTestOpt unit:getTestList()){

        }
    }

}
