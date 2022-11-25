package com.app.ps19.scimapp.classes;

import com.app.ps19.scimapp.Shared.Globals;

import java.util.Comparator;

public class DUnit {
    private Units unit;
    private double distance;
    private double bearing;
    private boolean freeze=false;

    public void setFreeze(boolean freeze) {
        this.freeze = freeze;
        if(unit!=null){
            if(freeze != unit.isFreeze()){
                unit.setFreeze(freeze);
                Globals.getSelectedTask().setDirty(true);
            }
        }
    }

    public boolean isFreeze() {
        if(unit!=null){
            this.freeze=unit.isFreeze();
        }
        return freeze;
    }

    public double getBearing() {
        return bearing;
    }

    public void setBearing(double bearing) {
        this.bearing = bearing;
    }

    public boolean isLinear() {
        return isLinear;
    }

    public void setLinear(boolean linear) {
        isLinear = linear;
    }

    private boolean isLinear=false;

    public DUnit(Units unit, double distance){
        //this.unit=unit;
        setUnit(unit);
        this.distance=distance;
    }

    public Units getUnit() {
        return unit;
    }

    public void setUnit(Units unit) {
        this.unit = unit;
        if(unit !=null){
            if(unit.getAssetTypeClassify().equals("linear")){
                setLinear(true);
            }else{
                setLinear(false);
            }
        }

    }

    public double getDistance() {
        return distance;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }
    /*Comparator for sorting the list by Student Name*/
    public static Comparator<DUnit> UnitDistanceComparator = new Comparator<DUnit>() {

        public int compare(DUnit u1, DUnit u2) {
            Double unit1 = u1.getDistance();
            Double unit2 = u2.getDistance();

            //ascending order
            return unit1.compareTo(unit2);
        }};
}
