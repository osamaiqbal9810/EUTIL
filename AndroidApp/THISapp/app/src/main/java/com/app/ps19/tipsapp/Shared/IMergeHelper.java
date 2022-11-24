package com.app.ps19.tipsapp.Shared;

import org.json.JSONObject;

public interface IMergeHelper {
    boolean mergeJsonObject(JSONObject jsonObject);
    JSONObject getJsonObject();
}
