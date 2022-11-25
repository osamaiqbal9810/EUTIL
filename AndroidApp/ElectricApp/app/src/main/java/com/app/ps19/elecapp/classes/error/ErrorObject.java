package com.app.ps19.elecapp.classes.error;

import com.app.ps19.elecapp.BuildConfig;
import com.app.ps19.elecapp.Shared.Globals;
import com.app.ps19.elecapp.Shared.IConvertHelper;
import com.app.ps19.elecapp.Shared.Utilities;
import com.app.ps19.elecapp.classes.User;

import org.json.JSONObject;

import java.util.Date;

public class ErrorObject implements IConvertHelper {
    private String exceptionText;
    private String time;
    private DeviceInfo deviceInfo;
    private User user;
    private String gpsStatus;
    private ServerInfo serverInfo;
    private String appVersion;


    public String getExceptionText() {
        return exceptionText;
    }

    public String getTime() {
        return time;
    }

    public DeviceInfo getDeviceInfo() {
        return deviceInfo;
    }

    public ErrorObject(){
        setInfo("");
    }
    public ErrorObject(String exceptionText){
        setInfo(exceptionText);
    }
    private void  setInfo(String exceptionText){
        this.exceptionText=exceptionText;
        deviceInfo=new DeviceInfo();
        this.time= Utilities.FormatDateTime(new Date(), Globals.momentDateFormat);
        this.user=Globals.user;
        this.appVersion= BuildConfig.VERSION_NAME;
        this.gpsStatus=Utilities.isGPSEnabled(Globals.getDBContext())?"enabled":"disabled";
        this.serverInfo=new ServerInfo();
    }
    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        return false;
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jsonObject=new JSONObject();
        try{
            jsonObject.put("exceptionText",getExceptionText());
            jsonObject.put("time",getTime());
            jsonObject.put("appVersion",this.appVersion);
            jsonObject.put("gpsStatus",this.gpsStatus);
            jsonObject.put("deviceInfo",this.deviceInfo.getJsonObject());
            jsonObject.put("user",this.user.getJsonObject());
            jsonObject.put("serverInfo",this.serverInfo.getJsonObject());
        }catch (Exception e){
            e.printStackTrace();
        }
        return jsonObject;
    }
}
