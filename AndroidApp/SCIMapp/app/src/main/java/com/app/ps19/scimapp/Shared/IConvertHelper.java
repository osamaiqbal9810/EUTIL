package com.app.ps19.scimapp.Shared;

import org.json.JSONObject;

public interface IConvertHelper {
    boolean parseJsonObject(JSONObject jsonObject);
    JSONObject getJsonObject();

}
