package com.app.ps19.hosapp.Shared;

import org.json.JSONObject;

public interface IConvertHelper {
    boolean parseJsonObject(JSONObject jsonObject);
    JSONObject getJsonObject();

}
