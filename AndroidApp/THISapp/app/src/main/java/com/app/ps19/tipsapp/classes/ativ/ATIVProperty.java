package com.app.ps19.tipsapp.classes.ativ;

import com.app.ps19.tipsapp.Shared.IConvertHelper;

import org.json.JSONObject;

public class ATIVProperty implements IConvertHelper {
   public String getName() {
      return name;
   }

   public void setName(String name) {
      this.name = name;
   }

   public String getValue() {
      return value;
   }

   public void setValue(String value) {
      this.value = value;
   }

   public String getTag() {
      return tag;
   }

   public void setTag(String tag) {
      this.tag = tag;
   }

   public int getIndex() {
      return index;
   }

   public void setIndex(int index) {
      this.index = index;
   }

   private String name;
   private String value;
   private String tag;
   private int index;

   public ATIVProperty (JSONObject jsonObject) {
      parseJsonObject(jsonObject);
   }

   @Override
   public boolean parseJsonObject(JSONObject jsonObject) {
      setName(jsonObject.optString("name",""));
      setValue(jsonObject.optString("value",""));
      setTag(jsonObject.optString("tag",""));
      setIndex(jsonObject.optInt("index",100));

      return false;
   }

   @Override
   public JSONObject getJsonObject() {
      return null;
   }
}