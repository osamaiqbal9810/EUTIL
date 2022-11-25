package com.app.ps19.tipsapp.classes.ativ;

import com.app.ps19.tipsapp.Shared.IConvertHelper;
import com.app.ps19.tipsapp.Shared.Utilities;
import com.app.ps19.tipsapp.classes.LatLong;
import com.app.ps19.tipsapp.classes.Units;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;

public class ATIVDefect implements IConvertHelper {
   private ArrayList<ATIVProperty> properties;
   private boolean verified;
   private LatLong vLocation;
   private String info;
   private String ativId;
   private String defCode;
   private String defTitle;
   private String defDescription;
   private boolean deficiency;
   private String oLatitude;
   private String oLongitude;
   private String milepost;
   private String title;
   private HashMap<String, Object> hmBackupValues;
   private boolean changeOnly=false;
   private ATIVDefect verifiedProps;

   public ATIVDefect getVerifiedProps() {
      return verifiedProps;
   }

   public void setVerifiedProps(ATIVDefect verifiedProps) {
      this.verifiedProps = verifiedProps;
   }

   public String getoLatitude() {
      return oLatitude;
   }

   public void setoLatitude(String oLatitude) {
      this.oLatitude = oLatitude;
   }

   public String getoLongitude() {
      return oLongitude;
   }

   public void setoLongitude(String oLongitude) {
      this.oLongitude = oLongitude;
   }

   public String getMilepost() {
      return milepost;
   }

   public void setMilepost(String milepost) {
      this.milepost = milepost;
   }

   public String getTitle() {
      return title;
   }

   public void setTitle(String title) {
      this.title = title;
   }

   public boolean isChangeOnly() {
      return changeOnly;
   }

   public void setChangeOnly(boolean changeOnly) {
      this.changeOnly = changeOnly;
   }

   public String getDefCode() {
      return defCode;
   }

   public void setDefCode(String defCode) {
      this.defCode = defCode;
   }

   public String getDefTitle() {
      return defTitle;
   }

   public void setDefTitle(String defTitle) {
      this.defTitle = defTitle;
   }

   public String getDefDescription() {
      return defDescription;
   }

   public void setDefDescription(String defDescription) {
      this.defDescription = defDescription;
   }

   public boolean isDeficiency() {
      return deficiency;
   }

   public void setDeficiency(boolean deficiency) {
      this.deficiency = deficiency;
   }

   public ArrayList<ATIVProperty> getProperties() {
      return properties;
   }

   public String getAtivId() {
      return ativId;
   }

   public void setAtivId(String ativId) {
      this.ativId = ativId;
   }

   public String getInfo() {
      return info;
   }

   public void setInfo(String info) {
      this.info = info;
   }

   public void setProperties(ArrayList<ATIVProperty> properties) {
      this.properties = properties;
   }

   public boolean isVerified() {
      return verified;
   }

   public void setVerified(boolean verified) {
      this.verified = verified;
   }

   public LatLong getvLocation() {
      return vLocation;
   }

   public void setvLocation(LatLong vLocation) {
      this.vLocation = vLocation;
   }

   public ATIVDefect (JSONObject jsonObject){
      parseJsonObject(jsonObject);
   }

   public ATIVDefect (){}

   @Override
   public boolean parseJsonObject(JSONObject jsonObject) {
      hmBackupValues= Utilities.getHashMapJSONObject(jsonObject);
      setVerified(jsonObject.optBoolean("verified", false));
      if(!jsonObject.optString("latitude","").equals("")){
         setvLocation(new LatLong(jsonObject.optString("latitude",""),jsonObject.optString("longitude","")));
         setoLatitude(jsonObject.optString("latitude"));
         setoLongitude(jsonObject.optString("longitude"));
      }
      JSONArray ja = jsonObject.optJSONArray("properties");
      ArrayList<ATIVProperty> _properties = new ArrayList<>();
      if(ja!=null){
         for(int i=0;i<ja.length(); i++){
            try {
               _properties.add(new ATIVProperty(ja.getJSONObject(i)));
            } catch (JSONException e) {
               e.printStackTrace();
            }
         }
         setProperties(_properties);
      }
      setDefTitle(jsonObject.optString("defTitle",""));
      setDefDescription(jsonObject.optString("defDescription",""));
      setDefCode(jsonObject.optString("defCode",""));
      if(!jsonObject.optString("_id","").equals("")){
         setAtivId(jsonObject.optString("_id",""));
      } else {
         setAtivId(jsonObject.optString("ativId",""));
      }
      setDeficiency(jsonObject.optBoolean("deficiency",false));
      setTitle(jsonObject.optString("title"));
      setMilepost(jsonObject.optString("milepost"));
      setoLatitude(jsonObject.optString("latitude"));
      setoLongitude(jsonObject.optString("longitude"));
      try {
         JSONObject joVerifyProps = jsonObject.optJSONObject("verificationProps");
         if(joVerifyProps!= null){
            setVerifiedProps(new ATIVDefect(joVerifyProps));
         }
      } catch (Exception e) {
         e.printStackTrace();
      }

      return false;
   }

   @Override
   public JSONObject getJsonObject() {
      JSONObject jo = new JSONObject();
      if(changeOnly && hmBackupValues!=null && !hmBackupValues.isEmpty()){
         jo=getJsonObjectChanged();
         return jo;
      }
      try {
         jo.put("ativId", getAtivId());
         jo.put("defCode",getDefCode());
         jo.put("defTitle", getDefTitle());
         jo.put("defDescription", getDefDescription());
         jo.put("deficiency", isDeficiency());
         jo.put("verified", isVerified());
         jo.put("vLatitude", getvLocation().getLat());
         jo.put("vLongitude", getvLocation().getLon());
         jo.put("title", getTitle());
         jo.put("milepost", getMilepost());
         jo.put("latitude", getoLatitude());
         jo.put("longitude", getoLongitude());
         hmBackupValues=Utilities.getHashMapJSONObject(jo);
      } catch (JSONException e) {
         e.printStackTrace();
      }
      return jo;
   }
   public JSONObject getJsonObjectChanged() {
      JSONObject jo = new JSONObject();
      try {
         putJSONProperty(jo,"ativId", getAtivId());
         putJSONProperty(jo,"defCode",getDefCode());
         putJSONProperty(jo,"defTitle", getDefTitle());
         putJSONProperty(jo,"defDescription", getDefDescription());
         putJSONProperty(jo,"deficiency", isDeficiency());
         putJSONProperty(jo,"verified", isVerified());
         putJSONProperty(jo,"vLatitude", getvLocation().getLat());
         putJSONProperty(jo,"vLongitude", getvLocation().getLon());
         putJSONProperty(jo,"title", getTitle());
         putJSONProperty(jo,"milepost", getMilepost());
         putJSONProperty(jo,"latitude", getoLatitude());
         putJSONProperty(jo,"longitude", getoLongitude());
         if(jo !=null && jo.length()!=0){
            hmBackupValues=Utilities.putHashMapJSONObject(hmBackupValues, jo);
         }
      } catch (Exception e) {
         e.printStackTrace();
      }
      return jo;
   }

   private boolean putJSONProperty(JSONObject jo, String fieldName, Object value){
      Object oldValue=null;
      oldValue=hmBackupValues.get(fieldName);

      if(oldValue instanceof JSONArray ){
         if(!oldValue.toString().equals(value.toString())){
            try {
               if(((JSONArray) oldValue).length()>((JSONArray)value).length()){
                  jo.put("*"+fieldName,value);
               }else {
                  jo.put(fieldName, value);
               }
            } catch (JSONException e) {
               e.printStackTrace();
            }
         }
      }else if(oldValue !=null && !oldValue.equals(value)){
         try {
            jo.put(fieldName,value);
         } catch (JSONException e) {
            e.printStackTrace();
            return  false;
         }
      }
      //hmBackupValues.put(fieldName,value);
      return true;
   }
}
