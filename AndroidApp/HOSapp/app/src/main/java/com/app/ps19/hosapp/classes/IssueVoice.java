package com.app.ps19.hosapp.classes;

import com.app.ps19.hosapp.Shared.IConvertHelper;

import org.json.JSONException;
import org.json.JSONObject;

public class IssueVoice implements IConvertHelper {
    private String voiceName;
    private int status;

    public String getVoiceName() {
        return voiceName;
    }

    public void setVoiceName(String voiceName) {
        this.voiceName = voiceName;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }


    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {

        //TODO: JSON object null causes exception
        try {
            setVoiceName(jsonObject.optString("voiceName"));

            setStatus(jsonObject.optInt("status", 0));
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jo = new JSONObject();
        if (voiceName != null && !voiceName.equals("")) {
            try {
                jo.put("voiceName", voiceName);
                jo.put("status", status);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        } else {
            return null;
        }

        return jo;
    }

    public IssueVoice(JSONObject jo) {
        parseJsonObject(jo);
    }

    public IssueVoice(String name, int status) {
        setVoiceName(name);
        setStatus(status);
    }

    public IssueVoice() {
    };
}
