package com.app.ps19.tipsapp.classes.safetybriefings;

import com.app.ps19.tipsapp.Shared.IConvertHelper;
import com.app.ps19.tipsapp.classes.Units;
import com.app.ps19.tipsapp.classes.dynforms.DynForm;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class JobBriefingCollection implements IConvertHelper {
   ArrayList<JobBriefing> jbCollection = new ArrayList<>();

   public ArrayList<JobBriefing> getJbCollection() {
      return jbCollection;
   }

   public void setJbCollection(ArrayList<JobBriefing> jbCollection) {
      this.jbCollection = jbCollection;
   }

   @Override
   public boolean parseJsonObject(JSONObject jsonObject) {
      try {
         ArrayList<JobBriefing> _jbCollection = new ArrayList<>();
         JSONArray ja = jsonObject.optJSONArray("");
         if(ja!=null){
            for (int i = 0; i < ja.length(); i++) {
               JobBriefing form = new JobBriefing(ja.getJSONObject(i));
               _jbCollection.add(form);
            }
         }

         setJbCollection(_jbCollection);
         return true;
      } catch (JSONException e) {
         e.printStackTrace();
      }
      return false;
   }

   @Override
   public JSONObject getJsonObject() {
      JSONObject jo =new JSONObject();
      try {
         JSONArray jaBriefings = new JSONArray();
         for (JobBriefing briefing : getJbCollection()) {
            jaBriefings.put(briefing.getJsonObject());
         }
         jo.put("jobBriefings", jaBriefings);
         return jo;
      } catch (JSONException e) {
         e.printStackTrace();
      }
      return null;
   }
   public JSONArray getJsonArray(){
      JSONArray jaBriefings = new JSONArray();
      for (JobBriefing briefing : getJbCollection()) {
         jaBriefings.put(briefing.getJsonObject());
      }
      return jaBriefings;
   }
   public JobBriefingCollection (){}
   public JobBriefingCollection (JSONObject jo) {
      parseJsonObject(jo);
   }}
