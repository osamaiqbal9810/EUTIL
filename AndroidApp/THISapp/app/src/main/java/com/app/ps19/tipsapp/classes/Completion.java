package com.app.ps19.tipsapp.classes;

import android.widget.ArrayAdapter;

import com.app.ps19.tipsapp.Shared.IConvertHelper;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class Completion implements IConvertHelper {
    private boolean complete=false;
    private ArrayList<CompRange> ranges;

    public Completion(JSONObject jo){
        parseJsonObject(jo);
    }

    public ArrayList<CompRange> getRanges() {
        return ranges;
    }

    public void setRanges(ArrayList<CompRange> ranges) {
        this.ranges = ranges;
    }

    public boolean isComplete() {
        return complete;
    }

    public void setComplete(boolean complete) {
        this.complete = complete;
    }

    @Override
    public boolean parseJsonObject(JSONObject jsonObject) {
        setComplete(jsonObject.optBoolean("complete",false));
        JSONArray jaRanges=jsonObject.optJSONArray("ranges");
        ArrayList<CompRange> _ranges=new ArrayList<>();
        if(jaRanges!=null){
            for(int i=0;i<jaRanges.length();i++){
                try {
                    _ranges.add(new CompRange(jaRanges.getJSONObject(i)));

                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }
        this.ranges=_ranges;
        return true;
    }

    @Override
    public JSONObject getJsonObject() {
        return null;
    }
}
