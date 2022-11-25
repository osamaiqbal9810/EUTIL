package com.app.ps19.scimapp.classes.error;

import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.Shared.IConvertHelper;

import org.json.JSONException;
import org.json.JSONObject;

public class ServerInfo implements IConvertHelper {
    private String server;
    private String installationType;
    public ServerInfo(){
        setInfo();
    }

    private void setInfo() {
        server= Globals.getWsDomain();
        this.installationType=Globals.isTimpsApp()?"TIMPS":"SITE";
    }

    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        return false;
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jsonObject=new JSONObject();
        try {
            jsonObject.put("server",this.server);
            jsonObject.put("installationType",this.installationType);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jsonObject;
    }
}
