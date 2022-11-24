package com.app.ps19.scimapp.classes;

import android.content.Context;
import android.graphics.Color;

import com.app.ps19.scimapp.R;
import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.Shared.IConvertHelper;
import com.app.ps19.scimapp.Shared.Utilities;

import org.json.JSONObject;

import java.util.Date;

public class UnitsTestOpt implements IConvertHelper {

    private String description="";
    private String dueDate="";
    private String expiryDate="";
    private String testCode="";

    private int color=Color.parseColor("green");
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

    public void setColor(int color) {
        this.color = color;
    }
    public int getColor() {
        return color;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setExpiryDate(String expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getExpiryDate() {
        return expiryDate;
    }

    public UnitsTestOpt(JSONObject jo){
        parseJsonObject(jo);

    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
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
            //hmBackupValues= Utilities.getHashMapJSONObject(jsonObject);
            //TODO: no value for id from loadInbox Globals file
            setTestCode(jsonObject.optString("testCode",""));
            setDescription(jsonObject.optString("title", ""));
            setDueDate(jsonObject.optString("nextDueDate", ""));
            setExpiryDate(jsonObject.optString("nextExpiryDate", ""));
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


        return jo;
    }
    @Override
    public String toString() {
        return description;
    }

    private void makeDueText(){
        setDueText("");
        if(!this.dueDate.equals("") && !this.expiryDate.equals("")){
            Date dueDate=Utilities.parseMomentDate(this.dueDate);
            Date expDate =Utilities.parseMomentDate(this.expiryDate);
            int percentComplete=0;
            Date today=new Date();
            setColor(Globals.COLOR_TEST_NOT_ACTIVE);
            if(today.before(dueDate)){
                // due date not arrived
                //int daysBetween=Utilities.getDaysBetween(today, dueDate);
                String dueText=Utilities.timeDiffText(today,dueDate);
                String strText= Globals.loginContext.getString(R.string.due_in_text) + dueText;
                setDueText(strText);
                setColor(Globals.COLOR_TEST_NOT_ACTIVE);
            } else if(today.after(dueDate) && today.before(expDate)){
                percentComplete=Utilities.getPercentComplete(dueDate,expDate);
                int daysBetween=Utilities.getDaysBetween(today, expDate);
                String strText=String.format("Expiring in %d day(s)",daysBetween);
                String expText=Utilities.timeDiffText(today, expDate);
                strText=Globals.loginContext.getString(R.string.expiring_in_text) + expText;
                setDueText(strText);
                setSortOrder(daysBetween);

                if(percentComplete>75){
                    setColor(Globals.COLOR_TEST_EXPIRING);
                }else{
                    setColor(Globals.COLOR_TEST_ACTIVE);
                }
            }
        }
    }

}
