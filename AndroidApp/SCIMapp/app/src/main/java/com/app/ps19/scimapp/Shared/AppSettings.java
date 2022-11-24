package com.app.ps19.scimapp.Shared;;

import android.content.Context;

/**
 * Created by Ajaz Ahmad Qureshi on 8/13/2017.
 */

public class AppSettings {
    Context context;
    DBHandler db;
    public String varID = "0";
    public String setting1="";
    public String setting2="";
    public String setting3="";
    public AppSettings(Context context) {
        this.context = context;
        db=Globals.db;//new DBHandler(Globals.getDBContext());
    }
    public void close(){
        //db.close();
    }

    public String getSettings(String varID, String defaultValue)
    {
        String orgCode = Globals.orgCode;
        String empCode = Globals.empCode;
        this.varID=varID;
        String criteria="code="+varID+"";

        StaticListItem item= db.getSettings(orgCode,empCode,varID);
        if(item!=null) {
            setting1 = item.getDescription();
            setting2 = item.getOptParam1();
            setting3 = item.getOptParam2();
        }else
        {
            setting1="";
            setting2="";
            setting3="";
        }
        return (!setting1.equals(""))?setting1:defaultValue;
    }

    public int saveSettings(String pos, String value1)
    {
        return saveSettings(pos,value1,"","");
    }

    public int saveSettings(String pos, String value1, String value2, String value3)
    {
        return db.saveSettings(Globals.orgCode,Globals.empCode, pos,value1,value2,value3);
    }

}
