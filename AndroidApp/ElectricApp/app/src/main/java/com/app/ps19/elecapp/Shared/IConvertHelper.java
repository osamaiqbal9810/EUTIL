package com.app.ps19.elecapp.Shared;

import org.json.JSONObject;

public interface IConvertHelper {
    boolean parseJsonObject(JSONObject jsonObject);
    JSONObject getJsonObject();

}
