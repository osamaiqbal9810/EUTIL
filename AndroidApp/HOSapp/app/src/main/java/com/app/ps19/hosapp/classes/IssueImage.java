package com.app.ps19.hosapp.classes;

import com.app.ps19.hosapp.Shared.Globals;
import com.app.ps19.hosapp.Shared.IConvertHelper;

import org.json.JSONException;
import org.json.JSONObject;

public class IssueImage implements IConvertHelper {
    private String imgName;
    private int status=Globals.ISSUE_IMAGE_STATUS_CREATED;
    private String tag;

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public String getImgName() {
        return imgName;
    }

    public void setImgName(String imgName) {
        this.imgName = imgName;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }


    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {

        try {
            setImgName(jsonObject.optString("imgName"));

            setStatus(jsonObject.optInt("status", 0));
            setTag(jsonObject.optString("tag"));
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jo = new JSONObject();
        if (imgName != null && !imgName.equals("")) {
            try {
                jo.put("imgName", imgName);
                jo.put("status", status);
                jo.put("tag", tag);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        } else {
            return null;
        }

        return jo;
    }

    public IssueImage(JSONObject jo) {
        parseJsonObject(jo);
    }

    public IssueImage(String name, int status, String tag) {
        setImgName(name);
        setStatus(status);
        setTag(tag);
    }

    public IssueImage() {
    }

    ;
}
