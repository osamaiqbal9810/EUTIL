package com.app.ps19.scimapp.classes;

import com.app.ps19.scimapp.Shared.IConvertHelper;
import com.google.maps.android.ui.IconGenerator;

import org.json.JSONObject;

class LocationPrefixDetail implements IConvertHelper {
   private String prefix;
   private String start;
   private String end;
   private String id;

   public String getPrefix() {
      return prefix;
   }

   public void setPrefix(String prefix) {
      this.prefix = prefix;
   }

   public String getStart() {
      return start;
   }

   public void setStart(String start) {
      this.start = start;
   }

   public String getEnd() {
      return end;
   }

   public void setEnd(String end) {
      this.end = end;
   }

   public String getId() {
      return id;
   }

   public void setId(String id) {
      this.id = id;
   }
   public LocationPrefixDetail(JSONObject jo){
      parseJsonObject(jo);
   }
   @Override
   public boolean parseJsonObject(JSONObject jsonObject) {
      setPrefix(jsonObject.optString("prefix"));
      setStart(jsonObject.optString("start"));
      setEnd(jsonObject.optString("end"));
      setId(jsonObject.optString("id"));
      return false;
   }

   @Override
   public JSONObject getJsonObject() {
      return null;
   }
}
