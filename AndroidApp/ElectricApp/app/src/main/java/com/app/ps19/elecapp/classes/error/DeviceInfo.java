package com.app.ps19.elecapp.classes.error;

import android.os.Build;

import com.app.ps19.elecapp.Shared.IConvertHelper;

import org.json.JSONException;
import org.json.JSONObject;

public class DeviceInfo implements IConvertHelper {
    private String serial;
    private String model;
    private String id;
    private String manufacture;
    private String brand;
    private String type;
    private String user;
    private String base;
    private String incremental;
    private String sdk;
    private String board;
    private String host;
    private String fingerprint;
    private String version;

    public String getSerial() {
        return serial;
    }

    public String getModel() {
        return model;
    }

    public String getId() {
        return id;
    }

    public String getManufacture() {
        return manufacture;
    }

    public String getBrand() {
        return brand;
    }

    public String getType() {
        return type;
    }

    public String getUser() {
        return user;
    }

    public String getBase() {
        return base;
    }

    public String getIncremental() {
        return incremental;
    }

    public String getSdk() {
        return sdk;
    }

    public String getBoard() {
        return board;
    }

    public String getHost() {
        return host;
    }

    public String getFingerprint() {
        return fingerprint;
    }

    public String getVersion() {
        return version;
    }

    public DeviceInfo(){
        setInfo();
    }

    private void setInfo() {
        this.serial= Build.SERIAL;
        this.model=Build.MODEL;
        this.id=Build.ID;
        this.manufacture=Build.MANUFACTURER;
        this.brand=Build.BRAND;
        this.type=Build.TYPE;
        this.user=Build.USER;
        this.incremental=Build.VERSION.INCREMENTAL;
        this.sdk=String.valueOf(Build.VERSION.SDK_INT);
        this.board=Build.BOARD;
        this.host=Build.HOST;
        this.fingerprint=Build.FINGERPRINT;
        this.version=Build.VERSION.RELEASE;


    }

    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        return false;
    }

    @Override
    public JSONObject getJsonObject() {
        JSONObject jsonObject=new JSONObject();
        try {
            jsonObject.put("serial",getSerial());
            jsonObject.put("model",getModel());
            jsonObject.put("id",getId());
            jsonObject.put("manufacture",getManufacture());
            jsonObject.put("brand",getBrand());
            jsonObject.put("type",getType());
            jsonObject.put("user",getUser());
            jsonObject.put("base",getBase());
            jsonObject.put("incremental",getIncremental());
            jsonObject.put("sdk",getSdk());
            jsonObject.put("board",getBoard());
            jsonObject.put("host",getHost());
            jsonObject.put("fingerprint",getFingerprint());
            jsonObject.put("version",getVersion());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jsonObject;
    }
}
