package com.app.ps19.tipsapp.Shared;

import org.json.JSONObject;

public interface IConvertHelper {
    boolean parseJsonObject(JSONObject jsonObject);
    JSONObject getJsonObject();

}
