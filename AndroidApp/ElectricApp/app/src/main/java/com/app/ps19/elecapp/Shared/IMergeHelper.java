package com.app.ps19.elecapp.Shared;

import org.json.JSONObject;

public interface IMergeHelper {
    boolean mergeJsonObject(JSONObject jsonObject);
    JSONObject getJsonObject();
}
