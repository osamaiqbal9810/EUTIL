package com.app.ps19.tipsapp.classes;

import com.app.ps19.tipsapp.R;
import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.Shared.IConvertHelper;
import com.app.ps19.tipsapp.Shared.Utilities;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Date;

public class UnitsTestOpt implements IConvertHelper {

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getAssetType() {
        return assetType;
    }

    public void setAssetType(String assetType) {
        this.assetType = assetType;
    }

    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }

    public String getTestId() {
        return testId;
    }

    public void setTestId(String testId) {
        this.testId = testId;
    }

    public Double getStartMP() {
        return startMP;
    }

    public void setStartMP(Double startMP) {
        this.startMP = startMP;
    }

    public Double getEndMP() {
        return endMP;
    }

    public void setEndMP(Double endMP) {
        this.endMP = endMP;
    }

    public String getLineId() {
        return lineId;
    }

    public void setLineId(String lineId) {
        this.lineId = lineId;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public String getCurrentPeriodStart() {
        return currentPeriodStart;
    }

    public void setCurrentPeriodStart(String currentPeriodStart) {
        this.currentPeriodStart = currentPeriodStart;
    }

    public String getCurrentPeriodEnd() {
        return currentPeriodEnd;
    }

    public void setCurrentPeriodEnd(String currentPeriodEnd) {
        this.currentPeriodEnd = currentPeriodEnd;
    }

    private String startDate = "";
    private String assetType = "";
    private String testCode="";
    private String assetId = "";
    private String nextDueDate ="";
    private String nextExpiryDate ="";
    private String testId ="";
    private Double startMP = 0.0;
    private Double endMP = 0.0;
    private String lineId = "";
    private String title = "";
    private String timezone = "";
    private String currentPeriodStart = "";
    private String currentPeriodEnd = "";
    private boolean inspected=false;

    public void setInspected(boolean inspected) {
        this.inspected = inspected;
    }

    public boolean isInspected() {
        return inspected;
    }

    private int color=Globals.COLOR_TEST_NOT_ACTIVE;
    private int sortOrder=1000;

    private String dueText ="";

    public void setTestCode(String testCode) {
        this.testCode = testCode;
    }

    public String getTestCode() {
        return testCode;
    }

    public void setSortOrder(int sortOrder) {
        this.sortOrder = sortOrder;
    }

    public int getSortOrder() {
        return sortOrder;
    }

//    public void setColor(int color) {
//        this.color = color;
//    }

    public int getColor() {
        return this.color;
    }

    public void setNextDueDate(String nextDueDate) {
        this.nextDueDate = nextDueDate;
    }

    public String getNextDueDate() {
        return nextDueDate;
    }

    public void setNextExpiryDate(String nextExpiryDate) {
        this.nextExpiryDate = nextExpiryDate;
    }

    public String getNextExpiryDate() {
        return nextExpiryDate;
    }

    public UnitsTestOpt(JSONObject jo){
        parseJsonObject(jo);

    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String description) {
        this.title = description;
    }

    public String getDueText() {
        return dueText;
    }

    public void setDueText(String dueText) {
        this.dueText = dueText;
    }

    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {

        try{

            setStartDate(jsonObject.optString("startDate",""));
            setAssetType(jsonObject.optString("assetType",""));
            setTestCode(jsonObject.optString("testCode",""));
            setAssetId(jsonObject.optString("assetId",""));
            setNextDueDate(jsonObject.optString("nextDueDate", ""));
            setNextExpiryDate(jsonObject.optString("nextExpiryDate", ""));
            setTestId(jsonObject.optString("testId",""));
            setStartMP(jsonObject.optDouble("start",0.0));
            setEndMP(jsonObject.optDouble("end",0.0));
            setLineId(jsonObject.optString("lineId", ""));
            setTitle(jsonObject.optString("title", ""));
            setTimezone(jsonObject.optString("timezone", ""));
            setCurrentPeriodStart(jsonObject.optString("currentPeriodStart", ""));
            setCurrentPeriodEnd(jsonObject.optString("currentPeriodEnd", ""));

            makeDueText();

            return true;
        }catch (Exception e){
            e.printStackTrace();
            return  false;
        }
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jo=new JSONObject();

        try {
            jo.put("startDate", this.startDate);
            jo.put("assetType", this.assetType);
            jo.put("testCode", this.testCode);
            jo.put("assetId", this.assetId);
            jo.put("nextDueDate", this.nextDueDate);
            jo.put("nextExpiryDate", this.nextExpiryDate);
            jo.put("testId", this.testId);
            jo.put("start", this.startMP);
            jo.put("end", this.endMP);
            jo.put("lineId", this.lineId);
            jo.put("title", this.title);
            jo.put("timezone", this.timezone);

            jo.put("currentPeriodStart", this.currentPeriodStart);
            jo.put("currentPeriodEnd", this.currentPeriodEnd);
        } catch (JSONException e) {
            e.printStackTrace();
        }


        return jo;
    }
    @Override
    public String toString() {
        return title;
    }

    private void makeDueText(){
        setDueText("");
        //this.color = Globals.COLOR_TEST_NOT_ACTIVE;
        if(!this.nextDueDate.equals("") && !this.nextExpiryDate.equals("")
            && !this.nextExpiryDate.equals("null") &&!this.nextDueDate.equals("null") ) {
            Date dueDate = Utilities.parseMomentDate(this.nextDueDate);
            Date expDate = Utilities.parseMomentDate(this.nextExpiryDate);
            int percentComplete = 0;
            Date today = new Date();

            if (today.before(dueDate)) {
                // due date not arrived
                //int daysBetween=Utilities.getDaysBetween(today, dueDate);
                String dueText = Utilities.timeDiffText(today, dueDate);
                String strText = Globals.loginContext.getString(R.string.due_in_text) + dueText;
                setDueText(strText);
                // this.color = Globals.COLOR_TEST_NOT_ACTIVE;
            } else if (today.after(dueDate) && today.before(expDate)) {
                percentComplete = Utilities.getPercentComplete(dueDate, expDate);
                int daysBetween = Utilities.getDaysBetween(today, expDate);
                String strText = String.format("Expiring in %d day(s)", daysBetween);
                String expText = Utilities.timeDiffText(today, expDate);
                strText = Globals.loginContext.getString(R.string.expiring_in_text) + expText;
                setDueText(strText);
                setSortOrder(daysBetween);

                if (percentComplete > 75) {
                    this.color = Globals.COLOR_TEST_EXPIRING;
                } else {
                    this.color = Globals.COLOR_TEST_ACTIVE;
                }
            }
        }
    }
}
