package com.app.ps19.scimapp.classes.dynforms;

import com.app.ps19.scimapp.Shared.IConvertHelper;

import org.json.JSONObject;

public class InspectionFreq implements IConvertHelper {
    private String startDate;
    private String minDays;
    private String maxInterval;
    private String recurTimeFrame;
    private String recurNumber;
    private String timeFrameNumber;
    private String freq;
    private String timeFrame;

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getMinDays() {
        return minDays;
    }

    public void setMinDays(String minDays) {
        this.minDays = minDays;
    }

    public String getMaxInterval() {
        return maxInterval;
    }

    public void setMaxInterval(String maxInterval) {
        this.maxInterval = maxInterval;
    }

    public String getRecurTimeFrame() {
        return recurTimeFrame;
    }

    public void setRecurTimeFrame(String recurTimeFrame) {
        this.recurTimeFrame = recurTimeFrame;
    }

    public String getRecurNumber() {
        return recurNumber;
    }

    public void setRecurNumber(String recurNumber) {
        this.recurNumber = recurNumber;
    }

    public String getTimeFrameNumber() {
        return timeFrameNumber;
    }

    public void setTimeFrameNumber(String timeFrameNumber) {
        this.timeFrameNumber = timeFrameNumber;
    }

    public String getFreq() {
        return freq;
    }

    public void setFreq(String freq) {
        this.freq = freq;
    }

    public String getTimeFrame() {
        return timeFrame;
    }

    public void setTimeFrame(String timeFrame) {
        this.timeFrame = timeFrame;
    }


    public InspectionFreq(JSONObject jo){
        parseJsonObject(jo);
    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        setStartDate(jsonObject.optString("startDate",""));
        setMinDays(jsonObject.optString("minDays",""));
        setMaxInterval(jsonObject.optString("maxInterval",""));
        setRecurTimeFrame(jsonObject.optString("recurTimeFrame",""));
        setRecurNumber(jsonObject.optString("recurNumber",""));
        setTimeFrameNumber(jsonObject.optString("timeFrameNumber",""));
        setFreq(jsonObject.optString("freq",""));
        setTimeFrame(jsonObject.optString("timeFrame",""));

        return false;
    }

    @Override
    public JSONObject getJsonObject() {
        return null;
    }
}
