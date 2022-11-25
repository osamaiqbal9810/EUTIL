package com.app.ps19.elecapp.classes;

import android.os.Build;

import com.app.ps19.elecapp.Shared.Globals;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class LocationsOpt {

    private List<String> _JourneyPlanAreaList = new ArrayList<>();
    private Map<String, ArrayList<JourneyPlanOpt>> _locationViseJourneyPlans = new ConcurrentHashMap<>();
    private Map<String, Integer> _JourneyPlanAreaColor = new HashMap<>();

    public ArrayList<JourneyPlanOpt> getJourneyPlanListByLocation(String area) {
        ArrayList<JourneyPlanOpt> ret = null;
        if (!_locationViseJourneyPlans.containsKey(area)) {
            ret = new ArrayList<JourneyPlanOpt>();
        } else {
            ret = _locationViseJourneyPlans.get(area);
        }

        try {
            for(int i = 0 ; i < ret.size() ; i++){
                if((ret.get(i).getId().equals("-1"))){
                    ret.remove(i);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ret;
    }

    public ArrayList<JourneyPlanOpt> getJourneyPlanListByLocation(String[] Locations) {
        ArrayList<JourneyPlanOpt> ret = new ArrayList<>();
        for(String loc : Locations){
            ret.addAll(getJourneyPlanListByLocation(loc));
        }

        return ret;
    }

    public int getJPLocationColor(String location) {
        int retColor = Globals.COLOR_TEST_NOT_ACTIVE;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            retColor = _JourneyPlanAreaColor.getOrDefault(location, Globals.COLOR_TEST_NOT_ACTIVE);
        }
        return retColor;
    }

    public void clear(){
        try {
            _locationViseJourneyPlans.clear();
            _JourneyPlanAreaList.clear();
            _JourneyPlanAreaColor.clear();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public List<String> getJourneyPlansLocationsList(){
        return _JourneyPlanAreaList;
    }

    public void addJourneyPlan(JourneyPlanOpt jpOpt) {
        if (!_locationViseJourneyPlans.containsKey("ALL")) {
            _locationViseJourneyPlans.put("ALL", new ArrayList<>());
            _JourneyPlanAreaList.add("ALL");
        }
        _locationViseJourneyPlans.get("ALL").add(jpOpt);

        String location = jpOpt.getArea();
        int color = jpOpt.getColor();
        if(!jpOpt.getId().equals("-1")){
            if(!location.equals("")) {//we don't want to include empty location in out list
                if (!_JourneyPlanAreaList.contains(location)) {
                    _JourneyPlanAreaList.add(location);
                }
                if(!_locationViseJourneyPlans.containsKey(location)){
                    _locationViseJourneyPlans.put(location, new ArrayList<>());
                    _JourneyPlanAreaColor.put(location, Globals.COLOR_TEST_NOT_ACTIVE);
                }

                if(color == Globals.COLOR_TEST_EXPIRING){
                    _JourneyPlanAreaColor.put(location,color);
                }else if(color == Globals.COLOR_TEST_ACTIVE){
                    if(_JourneyPlanAreaColor.get(location) ==  Globals.COLOR_TEST_NOT_ACTIVE) {
                        _JourneyPlanAreaColor.put(location, color);
                    }
                }
                _locationViseJourneyPlans.get(location).add(jpOpt);
            }
        }

    }

    public void SortArray(){
        for (Map.Entry<String, ArrayList<JourneyPlanOpt>> keyValPair : _locationViseJourneyPlans.entrySet()) {
            Collections.sort(keyValPair.getValue(), new Comparator<JourneyPlanOpt>() {
                @Override
                public int compare(JourneyPlanOpt o1, JourneyPlanOpt o2) {
                    return o1.getSortOrder()-o2.getSortOrder();
                }
            });
        }
    }
    public String getMaintenancePlanCode(){
        ArrayList<JourneyPlanOpt> ret = _locationViseJourneyPlans.get("ALL");
        for(int i = 0 ; i < ret.size() ; i++){
            if((ret.get(i).getId().equals("-1"))){
                return ret.get(i).getCode();
            }
        }
        return "";

    }


}
