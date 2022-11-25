package com.app.ps19.scimapp.classes;

import com.app.ps19.scimapp.Shared.Globals;

import java.util.ArrayList;

import static com.app.ps19.scimapp.Shared.Globals.selectedJPlan;
import static com.app.ps19.scimapp.Shared.Utilities.getFilteredNewIssues;

public class UnitsGroup {
    private final String group;
    private Units mainUnit;
    private ArrayList<Units> unitsList=new ArrayList<>();
    private int groupColor= Globals.COLOR_TEST_NOT_ACTIVE;
    private int newIssueCount=0;
    private int oldIssueCount=0;

    public int getNewIssueCount() {
        return newIssueCount;
    }

    public void setNewIssueCount(int newIssueCount) {
        this.newIssueCount = newIssueCount;
    }

    public int getOldIssueCount() {
        return oldIssueCount;
    }

    public void setOldIssueCount(int oldIssueCount) {
        this.oldIssueCount = oldIssueCount;
    }

    public int getGroupColor() {
        return groupColor;
    }

    public void setGroupColor(int groupColor) {
        this.groupColor = groupColor;
    }

    public void  refresh(){
        int retColor = Globals.COLOR_TEST_NOT_ACTIVE;
        for(int i = 0 ; i< unitsList.size(); i++){
            if(unitsList.get(i).getColor() == Globals.COLOR_TEST_EXPIRING) {
                retColor = Globals.COLOR_TEST_EXPIRING;
                break;
            }else if(unitsList.get(i).getColor() != Globals.COLOR_TEST_NOT_ACTIVE){
                retColor = unitsList.get(i).getColor();
            }
        }
        this.groupColor= retColor;
        //issues
        int nIssueCount=0;
        int oIssueCount=0;
        if(selectedJPlan!=null) {
            for (int i = 0; i < unitsList.size(); i++) {
                Units currUnit = unitsList.get(i);
                oIssueCount += selectedJPlan.getTaskList().get(0).getUnitDefectsListByID(currUnit.getUnitId()).size();
                nIssueCount += getFilteredNewIssues(currUnit.getUnitId());
            }
        }
        this.newIssueCount=nIssueCount;
        this.oldIssueCount=oIssueCount;
    }
    public void setMainUnit(Units mainUnit) {
        this.mainUnit = mainUnit;
    }

    public Units getMainUnit() {
        return mainUnit;
    }


    public UnitsGroup(String group){
        this.group=group;
    }

    public String getGroup() {
        return group;
    }

    public void setUnitsList(ArrayList<Units> unitsList) {
        this.unitsList = unitsList;
    }

    public ArrayList<Units> getUnitsList() {
        return unitsList;
    }
}
