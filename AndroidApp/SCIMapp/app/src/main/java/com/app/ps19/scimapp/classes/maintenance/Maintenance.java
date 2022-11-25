package com.app.ps19.scimapp.classes.maintenance;

import com.app.ps19.scimapp.Shared.IConvertHelper;
import com.app.ps19.scimapp.classes.Report;
import com.app.ps19.scimapp.classes.Units;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;

public class Maintenance implements IConvertHelper {
    /*    	"_id": "6089a93b63e4834ec463d10d",
                    "tenantId": "ps19",
                    "lineId": "5ece789ad4cfcc01bc6f08ac",
                    "lineName": "Geneva Yard",
                    "mrNumber": "MR#0004",
                    "description": "0037A - Combustible vegetation around track-carrying structures.",
                    "coordinates": "37.4219983,-122.084",
                        "sourceType": "app-issue",
        "inspectionRun": "5f3300b47793382ba5490043",
        "inspection": "60895d667b515c09a8507b26",
        "timestamp": "2021-04-28 18:18:12.681",
        "status": "New",
        "defectCodes": [
            "0037A"
        ],
        "maintenanceType": "Town",
        "subdivision": "",
        "issueId": "746cf998-1db6-4a51-8621-bd950c3823a5",
        "maintenanceRole": "InspectorWork",
        "createdAt": "2021-04-28T18:28:11.466Z",
        "updatedAt": "2021-04-28T18:28:11.489Z",
        "__v": 0,
        "workOrderNumber": "MWO#0004"
        "issue" :{
            "issueId" : "d15a92fc-7ea3-4b4e-b6c9-f8ad76196ae8",
            "category" : "",
            "trackId" : "Main Track",
            "description" : "0037B1 - Vegetation obstructs visibility of railroad signs and fixed signals.",
            "imgList" : [
                {
                    "imgName" : "5e27029f-b15e-afea-07d3-036edb99a715_2_20211116_222311.jpg",
                    "status" : NumberInt(1),
                    "tag" : "before"
                }
            ],
            "voiceList" : [
                {
                    "voiceName" : "5e27029f-b15e-afea-07d3-036edb99a715_2_20211116_222321.mp3",
                    "status" : NumberInt(1)
                },
                {
                    "voiceName" : "5e27029f-b15e-afea-07d3-036edb99a715_2_20211116_222327.mp3",
                    "status" : NumberInt(1)
                }
            ],
            "tags" : [
    
            ],
            "defectCodes" : [
                "0037B1"
            ],
            "location" : "37.421998333333335,-122.084",
            "marked" : false,
            "priority" : "Pending",
            "timeStamp" : "2021-11-16 17:22:23.185",
            "status" : "",
            "startMp" : "50.35",
            "endMp" : "50.35",
            "fixType" : "",
            "locationInfo" : "",
            "tempSpeed" : "",
            "title" : "213.37 - Vegetation",
            "typeOfAction" : "",
            "railDirection" : "N/A",
            "ruleApplied" : false,
            "issueType" : "Defect",
            "voiceNotes" : "1 picture and 2 voice recordings",
            "locUnit" : "MP",
            "startMarker" : "",
            "endMarker" : "",
            "unit" : {
                "track_id" : "null",
                "id" : "5f304a2b7793382ba548ffca",
                "unitId" : "Main Track",
                "start" : "50.35",
                "end" : "51.3",
                "assetType" : "track",
                "coordinates" : [
                    [
                        "42.87805492100979",
                        "-76.95914065080032"
                    ],
                    [
                        "42.87167057907319",
                        "-76.97573832073444"
                    ]
                ],
                "parent_id" : "5ece789ad4cfcc01bc6f08ac",
                "attributes" : {
                    "primaryTrack" : false,
                    "trackOrientation" : "",
                    "showDirection" : true,
                    "railOptions" : [
                        "N/A",
                        "North",
                        "South"
                    ]
                },
                "testForm" : [
    
                ]
            },
            "remedialAction" : "Not Repaired",
            "remedialActionItems" : [
                {
                    "id" : "describe",
                    "value" : "",
                    "desc" : "Describe",
                    "type" : "text"
                }
            ],
            "planId" : "618e641c1a8f302d7821b1dd",
            "taskId" : "5e27029f-b15e-afea-07d3-036edb99a715",
            "index" : "319-0-2",
            "date" : "2021-11-12T12:54:51.000Z",
            "user" : {
                "id" : "5e4ef9a0c77acb0478b26f0a",
                "name" : "Joe Denny",
                "email" : "jdenny@tektracking.com"
            },
            "uniqueGuid" : "3e2d367b-da0e-7131-282a-ceabba9f2528",
            "lineName" : "Geneva Yard",
            "lineId" : "5ece789ad4cfcc01bc6f08ac",
            "weatherConditions" : "fast",
            "temperature" : "45",
            "tempUnit" : "F",
            "maintenanceAction" : "maintenanceMode",
            "serverObject" : {
                "maintenanceRole" : "InspectorWork"
            }
        }
    */
    String id;
    String lineName;
    String mrNumber;
    String description;
    String coordinates;
    ArrayList<MaintenanceLocation> locationList;
    Units asset;
    String status;
    ArrayList<String> defCodesList;
    String maintenanceRole;
    String workOrderNumber;
    String maintenanceType;
    boolean markedOnSite;
    String lineId;
    Report report;

    public String getLineId() {
        return lineId;
    }

    public void setLineId(String lineId) {
        this.lineId = lineId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLineName() {
        return lineName;
    }

    public void setLineName(String lineName) {
        this.lineName = lineName;
    }

    public String getMrNumber() {
        return mrNumber;
    }

    public void setMrNumber(String mrNumber) {
        this.mrNumber = mrNumber;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(String coordinates) {
        this.coordinates = coordinates;
    }

    public ArrayList<MaintenanceLocation> getLocationList() {
        return locationList;
    }
    public String getLocationStartMp(){

        if(locationList !=null && locationList.size()>0){
            for(MaintenanceLocation ml:locationList){
                if(ml.getStartMp()!=null){
                    return  ml.getStartMp();
                }
            }
        }
        return "";
    }
    public String getLocationEndMp(){

        if(locationList !=null && locationList.size()>0){
            for(MaintenanceLocation ml:locationList){
                if(ml.getEndMp()!=null){
                    return  ml.getEndMp();
                }
            }
        }
        return "";
    }
    public String getLocationStartCords(){

        if(locationList !=null && locationList.size()>0){
            for(MaintenanceLocation ml:locationList){
                if(ml.getStart() !=null){
                    return  ml.getStart().getLat() +","+ml.getStart().getLon();
                }
            }
        }
        return "";
    }
    public String getLocationEndCords(){

        if(locationList !=null && locationList.size()>0){
            for(MaintenanceLocation ml:locationList){
                if(ml.getEnd() !=null){
                    return  ml.getEnd().getLat() +","+ml.getStart().getLon();
                }
            }
        }
        return "";
    }

    public void setLocationList(ArrayList<MaintenanceLocation> locationList) {
        this.locationList = locationList;
    }

    public Units getAsset() {
        return asset;
    }

    public void setAsset(Units asset) {
        this.asset = asset;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public ArrayList<String> getDefCodesList() {
        return defCodesList;
    }

    public void setDefCodesList(ArrayList<String> defCodesList) {
        this.defCodesList = defCodesList;
    }

    public String getMaintenanceRole() {
        return maintenanceRole;
    }

    public void setMaintenanceRole(String maintenanceRole) {
        this.maintenanceRole = maintenanceRole;
    }

    public String getWorkOrderNumber() {
        return workOrderNumber;
    }

    public void setWorkOrderNumber(String workOrderNumber) {
        this.workOrderNumber = workOrderNumber;
    }

    public String getMaintenanceType() {
        return maintenanceType;
    }

    public void setMaintenanceType(String maintenanceType) {
        this.maintenanceType = maintenanceType;
    }

    public void setMarkedOnSite(boolean markedOnSite) {
        this.markedOnSite = markedOnSite;
    }

    public boolean isMarkedOnSite() {
        return markedOnSite;
    }

    public Report getReport() {
        return report;
    }

    public void setReport(Report report) {
        this.report = report;
    }

    public Maintenance(JSONObject jo){
        parseJsonObject(jo);
    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        setLineId(jsonObject.optString("lineId", ""));
        setId(jsonObject.optString("_id",""));
        setLineName(jsonObject.optString("lineName",""));
        setMrNumber(jsonObject.optString("mrNumber",""));
        setDescription(jsonObject.optString("description",""));
        setCoordinates(jsonObject.optString("coordinate",""));
        ArrayList<MaintenanceLocation> _locationList=new ArrayList<>();
        JSONArray jaLocationList=jsonObject.optJSONArray("location");
        if(jaLocationList!=null){
            for(int i=0;i<jaLocationList.length();i++){
                _locationList.add(new MaintenanceLocation(jaLocationList.optJSONObject(i)));
            }
        }
        setLocationList(_locationList);
        if(jsonObject.has("asset")){
            setAsset(new Units(jsonObject.optJSONObject("asset"),true));
        }
        setStatus(jsonObject.optString("status",""));
        setMaintenanceRole(jsonObject.optString("maintenanceRole",""));
        setWorkOrderNumber(jsonObject.optString("workOrderNumber",""));
        setMaintenanceType(jsonObject.optString("maintenanceType",""));
        setMarkedOnSite(jsonObject.optBoolean("markedOnSite",false));

        if(jsonObject.optJSONObject("issue")!=null){
            setReport(new Report(jsonObject.optJSONObject("issue")));
        }else{
            setReport(null);
        }

        return false;
    }

    @Override
    public JSONObject getJsonObject() {
        return null;
    }
}
