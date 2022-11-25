package com.app.ps19.scimapp.classes;

import static com.app.ps19.scimapp.Shared.Utilities.isInRange;

import com.app.ps19.scimapp.Shared.IConvertHelper;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;

public class LocationPrefix implements IConvertHelper {
   private String locationId;
   private String locationName;
   private ArrayList<LocationPrefixDetail> details;

   public String getLocationId() {
      return locationId;
   }

   public void setLocationId(String locationId) {
      this.locationId = locationId;
   }

   public String getLocationName() {
      return locationName;
   }

   public void setLocationName(String locationName) {
      this.locationName = locationName;
   }

   public ArrayList<LocationPrefixDetail> getDetails() {
      return details;
   }

   public void setDetails(ArrayList<LocationPrefixDetail> details) {
      this.details = details;
   }
   public LocationPrefix(JSONObject jo){
      parseJsonObject(jo);
   }
   @Override
   public boolean parseJsonObject(JSONObject jsonObject) {
      setLocationId(jsonObject.optString("code"));
      JSONObject joOptName=jsonObject.optJSONObject("opt1");
      JSONArray jaOpt2=jsonObject.optJSONArray("opt2");
      if(joOptName!=null){
         setLocationName(joOptName.optString("locName"));
      }
      ArrayList<LocationPrefixDetail> _details=new ArrayList<>();
      if(jaOpt2!=null){

         for(int i=0;i<jaOpt2.length();i++)
         {
            _details.add(new LocationPrefixDetail(jaOpt2.optJSONObject(i)));
         }
      }
      setDetails(_details);
      return false;
   }

   @Override
   public JSONObject getJsonObject() {
      return null;
   }
   public String getPrefix(String mp){
      for(LocationPrefixDetail prefix: getDetails()){
         double start = Double.parseDouble(prefix.getStart());
         double end = Double.parseDouble(prefix.getEnd());
         double uStart = Double.parseDouble(mp);
         if (isInRange(start, end, uStart)){
            return prefix.getPrefix();
         }
      }
      return null;
   }
}
