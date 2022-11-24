package com.app.ps19.hosapp.Shared;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static android.content.ContentValues.TAG;

/**
 * Created by Ajaz Ahmad Qureshi on 6/19/2017.
 */

public class DBHandler extends SQLiteOpenHelper{
    // Database Version
    private static final int DATABASE_VERSION = 2;

    // Database Name
    private static final String DATABASE_NAME = "tips";

    //TABLE NAME
    private static final String TABLE_APPLICATIONLOOKUPS="applicationlookups";
    private static final String TABLE_MSG_APPLICATIONLOOKUPS="msg_applicationlookups";
    private static final String TABLE_DVARS="DVARS";

    private static final  String pullListName="EmployeePullCriteriaList";

    public DBHandler(Context context)
    {
        super(context,DATABASE_NAME,null,DATABASE_VERSION );
    }
    @Override
    public void onCreate(SQLiteDatabase db) {
        String CREATE_DYNAPPLOOKUP_TABLE="CREATE TABLE " + TABLE_APPLICATIONLOOKUPS
                + " ( ORGCODE TEXT NOT NULL,"
                + " LISTNAME  NOT NULL,"
                + " CODE TEXT  NOT NULL,"
                + " DESCRIPTION TEXT,"
                + " OPTPARAM1 TEXT,"
                + " OPTPARAM2 TEXT,"
                + "PRIMARY KEY(ORGCODE,LISTNAME,CODE))";

        String CREATE_DVARS_TABLE="CREATE TABLE " + TABLE_DVARS
                +"("
                    + "ORGCODE TEXT NOT NULL,"
                    + "VARNAME TEXT NOT NULL,"
                    + "VARVALUE TEXT,"
                    + "PRIMARY KEY(ORGCODE,VARNAME)"
                +")";

        String CREATE_MSGAPPLOOKUP_TABLE="CREATE TABLE " + TABLE_MSG_APPLICATIONLOOKUPS
                + " ( ORGCODE TEXT NOT NULL,"
                + " LISTNAME  NOT NULL,"
                + " CODE TEXT  NOT NULL,"
                + " DESCRIPTION TEXT,"
                + " OPTPARAM1 TEXT,"
                + " OPTPARAM2 TEXT,"
                + " STATUS INTEGER,"
                + "PRIMARY KEY(ORGCODE,LISTNAME,CODE))";

        db.execSQL(CREATE_DYNAPPLOOKUP_TABLE);
        db.execSQL(CREATE_DVARS_TABLE);
        db.execSQL(CREATE_MSGAPPLOOKUP_TABLE);

    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
// Drop older table if existed
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_APPLICATIONLOOKUPS);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_DVARS);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_MSG_APPLICATIONLOOKUPS);
        onCreate(db);
    }
    public boolean clearAllData()
    {
        try {
            SQLiteDatabase db = this.getWritableDatabase();
            db.execSQL("DELETE FROM " + TABLE_DVARS);
            db.execSQL("DELETE FROM " + TABLE_MSG_APPLICATIONLOOKUPS);
            db.execSQL("DELETE FROM " + TABLE_APPLICATIONLOOKUPS);
        }catch (Exception e)
        {
            e.printStackTrace();
            Log.e("clearAllData","DBHandler:"+e.toString());
            return  false;
        }
        return  true;
    }
    public boolean isDataAvailable(String orgCode,String empCode)
    {
        List<StaticListItem> items=getListItems(pullListName,orgCode,"optparam2=''");
        if(items.size()==0)
        {
            return false;
        }
        for(StaticListItem item:items)
        {
            String listName=item.getDescription();
            String criteria=item.getOptParam1();
            if(!empCode.equals("")) {
                criteria = criteria.replace("@EMPCODE", String.valueOf(empCode));
            }else
            {
                criteria="";
            }
            int count=getListItemCount(listName,orgCode,criteria);
            if(count==0)
            {
                return  false;
            }
        }
        return true;
    }
    public boolean removeEmployeeData(String orgCode, String empCode)
    {
        List<StaticListItem> items=getListItems(pullListName,orgCode,"");
        if(items.size()==0)
        {
            return true;
        }
        for(StaticListItem item:items)
        {
            String listName=item.getDescription();
            String criteria=item.getOptParam1();
            if(!empCode.equals("")) {
                criteria = criteria.replace("@EMPCODE", String.valueOf(empCode));
            }
            else
            {
                criteria="";
            }
            RemoveList(listName, orgCode,criteria);
        }
        return true;
    }

    public void RemoveList(String listName,String orgCode)
    {
        SQLiteDatabase db=this.getWritableDatabase();
        String sql="Delete from " + TABLE_APPLICATIONLOOKUPS +
                " WHERE ORGCODE='" + orgCode +"' AND "+
                " LISTNAME='" + listName +"'";
        db.execSQL(sql);
    }
    public void RemoveList(String listName,String orgCode,String criteria)
    {
        SQLiteDatabase db=this.getWritableDatabase();
        String sql="Delete from " + TABLE_APPLICATIONLOOKUPS +
                " WHERE ORGCODE='" + orgCode +"' AND "+
                " LISTNAME='" + listName +"'";
        if(!criteria.equals(""))
        {
            sql+=" AND "+ criteria;
        }
        db.execSQL(sql);
    }

    public int AddOrUpdateList(String listName,String orgCode, StaticListItem array)
    {
        List<StaticListItem> items = getListItems(listName, orgCode, "", "code='" + array.getCode() + "'");
        if(items.size()==1)
        {
            return UpdateList(listName,orgCode,array);
        }else
        {
            return AddList(listName,orgCode,array);
        }
    }

    public int AddList(String listName,String orgCode, StaticListItem array)
    {
        SQLiteDatabase db=this.getWritableDatabase();
        int count=0;

            try {

                ContentValues values=new ContentValues();
                values.put("ORGCODE",orgCode);
                values.put("LISTNAME",listName);
                values.put("CODE",array.getCode());
                values.put("DESCRIPTION",array.getDescription());
                values.put("OPTPARAM1",array.getOptParam1());
                values.put("OPTPARAM2",array.getOptParam2());
                db.insert(TABLE_APPLICATIONLOOKUPS,null,values);
                count++;
            }
            catch (Exception e)
            {

            }

        return count;

    }

    public int AddList(String listName,String orgCode, JSONArray array)
    {
        SQLiteDatabase db=this.getWritableDatabase();
        int count=0;

        for(int i=0;i<array.length();i++)
        {
            try {
                JSONObject jo = array.getJSONObject(i);
                ContentValues values=new ContentValues();
                values.put("ORGCODE",orgCode);
                values.put("LISTNAME",listName);
                values.put("CODE",jo.getString("code"));
                values.put("DESCRIPTION",jo.getString("desc"));
                values.put("OPTPARAM1",jo.getString("opt1"));
                values.put("OPTPARAM2",jo.getString("opt2"));
                db.insert(TABLE_APPLICATIONLOOKUPS,null,values);
                count++;
            }
            catch (Exception e)
            {
                break;
            }
        }
        return count;

    }
    public int UpdateList(String listName,String orgCode, StaticListItem array)
    {
        SQLiteDatabase db=this.getWritableDatabase();
        int count=0;
        String optParam1=replaceSingleQoute(array.getOptParam1());

        try {
            String sql="UPDATE " + TABLE_APPLICATIONLOOKUPS + " SET "
                    + "  DESCRIPTION='" + array.getDescription() +"'"
                    + ", OPTPARAM1='" + optParam1 +"'"
                    + ", OPTPARAM2='" + array.getOptParam2() +"'"
                    +" WHERE ORGCODE='" + orgCode +"' AND LISTNAME='" + listName +"' AND CODE='" + array.getCode() +"'";
            db.execSQL(sql);
            count++;
        }
        catch (Exception e)
        {
            Log.e("UpdateList","Error:"+listName+":"+array.getCode());

        }

        return count;

    }

    public List<StaticListItem> getListItems(String listName , String orgCode , String code)
    {
        List<StaticListItem> items=new ArrayList<StaticListItem>();
        String sql="SELECT * FROM  " + TABLE_APPLICATIONLOOKUPS +
                " WHERE LISTNAME='" + listName + "' AND " +
                " ORGCODE = '" + orgCode +"'" ;
        if(!code.equals("") )
        {
            sql += " AND code='" + code + "'";
        }
        try {
            SQLiteDatabase db=this.getReadableDatabase();
            Cursor cursor= db.rawQuery(sql,null);
            if(cursor.moveToFirst())
            {
                do{
                    StaticListItem item=new StaticListItem();
                    item.setOrgCode(cursor.getString(0));
                    item.setListName(cursor.getString(1));
                    item.setCode(cursor.getString(2));
                    item.setDescription(cursor.getString(3));
                    item.setOptParam1(cursor.getString(4));
                    item.setOptParam2(cursor.getString(5)) ;
                    items.add(item);

                }while(cursor.moveToNext());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return items;
    }
    public List<StaticListItem> getListItems(String listName , String orgCode , String code , String  criteria)
    {
        List<StaticListItem> items=new ArrayList<StaticListItem>();
        String sql="SELECT * FROM  " + TABLE_APPLICATIONLOOKUPS +
                " WHERE LISTNAME='" + listName + "' AND " +
                " ORGCODE = '" + orgCode +"'" ;
        if(!criteria.equals("") )
        {
            sql+= " AND "+criteria;
        }
        SQLiteDatabase db=this.getReadableDatabase();
        Cursor cursor= db.rawQuery(sql,null);
        if(cursor.moveToFirst())
        {
            do{
                StaticListItem item=new StaticListItem();
                item.setOrgCode(cursor.getString(0));
                item.setListName(cursor.getString(1));
                item.setCode(cursor.getString(2));
                item.setDescription(cursor.getString(3));
                item.setOptParam1(cursor.getString(4));
                item.setOptParam2(cursor.getString(5)) ;
                items.add(item);

            }while(cursor.moveToNext());
        }
        return items;
    }

    public int getListItemCount(String listName , String orgCode , String  criteria)
    {
        int count=0;
        List<StaticListItem> items=new ArrayList<StaticListItem>();
        String sql="SELECT count(*) FROM  " + TABLE_APPLICATIONLOOKUPS +
                " WHERE LISTNAME='" + listName + "' AND " +
                " ORGCODE = '" + orgCode +"'" ;
        if(!criteria.equals("") )
        {
            sql+= " AND "+criteria;
        }
        SQLiteDatabase db=this.getReadableDatabase();
        Cursor cursor= db.rawQuery(sql,null);
        if(cursor.moveToFirst())
        {
            count=cursor.getInt(0);
        }
        return count;
    }


    /*message lists CURD methods*/
    public List<StaticListItem> getMsgListItems(String orgCode , String  criteria)
    {
        List<StaticListItem> items=new ArrayList<StaticListItem>();
        String sql="SELECT * FROM  " + TABLE_MSG_APPLICATIONLOOKUPS +
                " WHERE ORGCODE ='" + orgCode+"'";


        if(!criteria.equals("") )
        {
            sql+= " AND "+criteria;
        }
        SQLiteDatabase db=this.getReadableDatabase();
        Cursor cursor= db.rawQuery(sql,null);
        if(cursor.moveToFirst())
        {
            do{
                StaticListItem item=new StaticListItem();
                item.setOrgCode(cursor.getString(0));
                item.setListName(cursor.getString(1));
                item.setCode(cursor.getString(2));
                item.setDescription(cursor.getString(3));
                item.setOptParam1(cursor.getString(4));
                item.setOptParam2(cursor.getString(5)) ;
                item.setStatus(cursor.getInt(cursor.getColumnIndex("STATUS")));
                items.add(item);

            }while(cursor.moveToNext());
        }
        return items;

    }
    public List<StaticListItem> getMsgListItems(String listName , String orgCode , String  criteria)
    {
    List<StaticListItem> items=new ArrayList<StaticListItem>();
    String sql="SELECT * FROM  " + TABLE_MSG_APPLICATIONLOOKUPS +
            " WHERE LISTNAME='" + listName + "' AND " +
            " ORGCODE = '" + orgCode +"'" ;
    if(!criteria.equals("") )
    {
        sql+= " AND "+criteria;
    }
    SQLiteDatabase db=this.getReadableDatabase();
    Cursor cursor= db.rawQuery(sql,null);
    if(cursor.moveToFirst())
    {
        do{
            StaticListItem item=new StaticListItem();
            item.setOrgCode(cursor.getString(0));
            item.setListName(cursor.getString(1));
            item.setCode(cursor.getString(2));
            item.setDescription(cursor.getString(3));
            item.setOptParam1(cursor.getString(4));
            item.setOptParam2(cursor.getString(5)) ;
            item.setStatus(cursor.getInt(cursor.getColumnIndex("STATUS")));
            items.add(item);

        }while(cursor.moveToNext());
    }
    return items;
}

    public void RemoveMsgList(String listName,String orgCode)
    {
        SQLiteDatabase db=this.getWritableDatabase();
        String sql="Delete from " + TABLE_MSG_APPLICATIONLOOKUPS +
                " WHERE ORGCODE='" + orgCode +"' AND "+
                " LISTNAME='" + listName +"'";
        db.execSQL(sql);
    }

    public int AddMsgList(String listName,String orgCode, StaticListItem array,int status)
    {
        SQLiteDatabase db=this.getWritableDatabase();
        int count=0;

        try {

            ContentValues values=new ContentValues();
            values.put("ORGCODE",orgCode);
            values.put("LISTNAME",listName);
            values.put("CODE",array.getCode());
            values.put("DESCRIPTION",array.getDescription());
            values.put("OPTPARAM1",array.getOptParam1());
            values.put("OPTPARAM2",array.getOptParam2());
            values.put("STATUS",status);
            db.insert(TABLE_MSG_APPLICATIONLOOKUPS,null,values);
            count++;
        }
        catch (Exception e)
        {

        }

        return count;

    }
    public int AddMsgList(String listName,String orgCode, JSONArray array)
    {
        SQLiteDatabase db=this.getWritableDatabase();
        int count=0;

        for(int i=0;i<array.length();i++)
        {
            try {
                JSONObject jo = array.getJSONObject(i);
                ContentValues values=new ContentValues();
                values.put("ORGCODE",orgCode);
                values.put("LISTNAME",listName);
                values.put("CODE",jo.getString("code"));
                values.put("DESCRIPTION",jo.getString("desc"));
                values.put("OPTPARAM1",jo.getString("opt1"));
                values.put("OPTPARAM2",jo.getString("opt2"));
                values.put("STATUS",Globals.MESSAGE_STATUS_CREATED);
                db.insert(TABLE_MSG_APPLICATIONLOOKUPS,null,values);
                count++;
            }
            catch (Exception e)
            {
                break;
            }
        }
        return count;

    }

    public int UpdateMsgList(String listName,String orgCode, StaticListItem array,int status)
    {
        SQLiteDatabase db=this.getWritableDatabase();
        int count=0;
        String optParam1=replaceSingleQoute(array.getOptParam1());

        try {
            String sql="UPDATE " + TABLE_MSG_APPLICATIONLOOKUPS + " SET "
                    + "  DESCRIPTION='" + array.getDescription() +"'"
                    + ", OPTPARAM1='" + optParam1 +"'"
                    + ", OPTPARAM2='" + array.getOptParam2() +"'"
                    + ", STATUS=" + status
                    +" WHERE ORGCODE='" + orgCode +"' AND LISTNAME='" + listName +"' AND CODE='" + array.getCode()+"'";
            db.execSQL(sql);
            count++;
        }
        catch (Exception e)
        {
            e.printStackTrace();

        }

        return count;

    }
    private String replaceSingleQoute(String value){
        String strOut=value;
        strOut=strOut.replaceAll("'", "\''");
        return strOut;
    }
    public int UpdateMsgList(String orgCode,List<StaticListItem> items,int status)
    {
        SQLiteDatabase db=this.getWritableDatabase();
        int count=0;

        try {
            for(StaticListItem array:items) {
                String optParam1=replaceSingleQoute(array.getOptParam1());
                String sql = "UPDATE " + TABLE_MSG_APPLICATIONLOOKUPS + " SET "
                        + "  DESCRIPTION='" + array.getDescription() + "'"
                        + ", OPTPARAM1='" + optParam1 + "'"
                        + ", OPTPARAM2='" + array.getOptParam2() + "'"
                        + ", STATUS=" + status
                        + " WHERE ORGCODE='" + orgCode + "' AND LISTNAME='" + array.getListName() + "' AND CODE='" + array.getCode()+"'";
                db.execSQL(sql);
                count++;
            }
        }
        catch (Exception e)
        {

            Log.e("UpdateMsgList",""+e.toString());
        }

        return count;

    }


    public int AddOrUpdateMsgList(String listName,String orgCode, StaticListItem array,int status)
    {
        List<StaticListItem> items=getMsgListItems(listName,orgCode,"code='" +array.getCode()+"'");
        if(items.size()==1)
        {
            return UpdateMsgList(listName,orgCode,array,status);
        }else
        {
            return AddMsgList(listName,orgCode,array,status);
        }
    }

    /*end*/
    public void RemoveVars(String orgCode)
    {
        SQLiteDatabase db=this.getWritableDatabase();
        String sql="Delete from " + TABLE_DVARS +
                " WHERE ORGCODE='" + orgCode +"'";
        db.execSQL(sql);
    }
    public int AddVars(String orgCode, JSONArray array)
    {
        SQLiteDatabase db=this.getWritableDatabase();
        int count=0;

        for(int i=0;i<array.length();i++)
        {
            try {
                JSONObject jo = array.getJSONObject(i);
                ContentValues values=new ContentValues();
                values.put("ORGCODE",orgCode);
                values.put("VARNAME",jo.getString("name"));
                values.put("VARVALUE",jo.getString("val"));
                db.insert(TABLE_DVARS,null,values);
                count++;
            }
            catch (Exception e)
            {
                break;
            }
        }

        return count;

    }

    public int AddOrUpdateVars(String orgCode, JSONArray array)
    {
        SQLiteDatabase db=this.getWritableDatabase();
        int count=0;


        for(int i=0;i<array.length();i++)
        {
            try {
                JSONObject jo = array.getJSONObject(i);
                ContentValues values=new ContentValues();
                values.put("ORGCODE",orgCode);
                values.put("VARNAME",jo.getString("name"));
                values.put("VARVALUE",jo.getString("val"));
                String sql="SELECT * FROM " + TABLE_DVARS + " WHERE ORGCODE='"+orgCode +"'"
                        + " AND VARNAME='"+jo.getString("name")+"'";
                Cursor cursor=db.rawQuery(sql,null);
                if(cursor.isAfterLast())
                {
                    db.insert(TABLE_DVARS,null,values);
                }
                else
                {
                    values.clear();
                    values.put("VARVALUE",jo.getString("val"));
                    sql="UPDATE "+TABLE_DVARS +" SET VARVALUE='"+ jo.getString("val") +"' WHERE "
                            +" ORGCODE='"+orgCode +"' AND VARNAME='"+ jo.getString("name") +"'";
                    //db.rawQuery(sql,null);
                    db.update(TABLE_DVARS,values,"ORGCODE='"+orgCode +"' AND VARNAME='"+ jo.getString("name") +"'",null);
                }
                count++;
            }
            catch (Exception e)
            {
                break;
            }
        }

        return count;

    }
    /*public HashMap<String,Notification> getVarsHashMap(String orgCode, String varNameCriteria)
    {
        HashMap<String, Notification> objHashMap =new HashMap<>();
        String sql="SELECT * FROM " + TABLE_DVARS + " WHERE ORGCODE='" + orgCode +"'";
        if(!varNameCriteria.equals(""))
        {
            sql+=" AND VARNAME LIKE '" + varNameCriteria +"'";
        }
        SQLiteDatabase db=this.getReadableDatabase();
        Cursor cursor= db.rawQuery(sql,null);
        List<Notification> Items=new ArrayList<Notification>();
        if(cursor.moveToFirst())
        {
            do{
                Notification item=new Notification();
                item.name=cursor.getString(1);
                item.value=cursor.getString(2);
                Items.add(item);
                objHashMap.put(item.name,item);
            }while (cursor.moveToNext());
        }
        db.close();
        return objHashMap;
    }*/

   /* public List<Notification> getVars(String orgCode, String varNameCriteria)
    {
        String sql="SELECT * FROM " + TABLE_DVARS + " WHERE ORGCODE='" + orgCode +"'";
        if(!varNameCriteria.equals(""))
        {
            sql+=" AND VARNAME LIKE '" + varNameCriteria +"'";
        }
        SQLiteDatabase db=this.getReadableDatabase();
        Cursor cursor= db.rawQuery(sql,null);
        List<Notification> Items=new ArrayList<Notification>();
        if(cursor.moveToFirst())
        {
            do{
                Notification item=new Notification();
                item.name=cursor.getString(1);
                item.value=cursor.getString(2);
                Items.add(item);
            }while (cursor.moveToNext());
        }
        return Items;
    }*/
    public String getEmployeeName(String empCode)
    {
        String listName="EmployeeList";
        List<StaticListItem> items=getListItems(listName,Globals.orgCode,empCode);
        if (items.size()==1)
        {
            return items.get(0).getDescription();
        }
        return "";
    }

    /*Settings Methods*/
    public StaticListItem getSettings(String orgCode,String empCode,String varID)
    {
        String listName=Globals.SETTINGS_LIST_NAME+"_"+empCode;
        StaticListItem items=null;
        String sql="SELECT * FROM  " + TABLE_APPLICATIONLOOKUPS +
                " WHERE LISTNAME='" + listName + "' AND code='" + varID + "'" +
                " AND ORGCODE = '" + orgCode + "'";

        SQLiteDatabase db=this.getReadableDatabase();
        Cursor cursor= db.rawQuery(sql,null);
        if(cursor.moveToFirst())
        {
            items=new StaticListItem();
            do{

                items.setOrgCode(cursor.getString(0));
                items.setListName(cursor.getString(1));
                items.setCode(cursor.getString(2));
                items.setDescription(cursor.getString(3));
                items.setOptParam1(cursor.getString(4));
                items.setOptParam2(cursor.getString(5)) ;


            }while(cursor.moveToNext());
        }
        db.close();
        return items;

    }

    public int saveSettings(String orgCode,String empCode,String varID,String varValue1, String varValue2,String varValue3)
    {
        String listName=Globals.SETTINGS_LIST_NAME+"_"+empCode;
        RemoveList(listName,orgCode,"code='"+varID+"'" );
        return AddList(listName,orgCode,new StaticListItem(orgCode,listName,varID, varValue1,varValue2,varValue3));
    }

    /*Lists*/
    public HashMap<String, String> getAppLookupList(String strListName){
        String sql="SELECT CODE, DESCRIPTION FROM "+ TABLE_APPLICATIONLOOKUPS
                +" WHERE ORGCODE='"+Globals.orgCode+"' AND LISTNAME='"+ Globals.APPLICATION_LOOKUP_LIST_NAME
                +"' AND OPTPARAM2='"+  strListName +"'";
        SQLiteDatabase db=this.getReadableDatabase();
        Cursor cursor= db.rawQuery(sql,null);
        HashMap<String ,String >list=new HashMap<>();
        if(cursor.moveToFirst()) {

            do{
                String strKey=cursor.getString(0);
                String strItem=cursor.getString(1);
                if(!cursor.getString(0).equals(""))
                {

                    list.put(strKey,strItem);
                }
            }while(cursor.moveToNext());

        }
        cursor.close();
        return list;
    }
    public HashMap<String, String> getAppLookupList(String strListName, String desc){
        String sql="SELECT CODE, DESCRIPTION,OPTPARAM1 FROM "+ TABLE_APPLICATIONLOOKUPS
                +" WHERE ORGCODE='"+Globals.orgCode+"' AND LISTNAME='"+ Globals.APPLICATION_LOOKUP_LIST_NAME
                +"' AND OPTPARAM2='"+  strListName +"'" + (!desc.equals("")?(" AND DESCRIPTION='"+ desc +"'"):""  );
        SQLiteDatabase db=this.getReadableDatabase();
        Cursor cursor= db.rawQuery(sql,null);
        HashMap<String ,String >list=new HashMap<>();
        if(cursor.moveToFirst()) {

            do{
                String strKey=cursor.getString(1);
                String strItem=cursor.getString(2);
                if(!cursor.getString(0).equals(""))
                {

                    list.put(strKey,strItem);
                }
            }while(cursor.moveToNext());

        }
        cursor.close();
        return list;

    }
    public HashMap<String, String> getLookupListObj(String strListName, String desc){
        String sql="SELECT CODE, DESCRIPTION,OPTPARAM1 FROM "+ TABLE_APPLICATIONLOOKUPS
                +" WHERE ORGCODE='"+Globals.orgCode+"' AND LISTNAME='"+ strListName
                +"' AND DESCRIPTION='"+ desc +"'" ;
        SQLiteDatabase db=this.getReadableDatabase();
        Cursor cursor= db.rawQuery(sql,null);
        HashMap<String ,String >list=new HashMap<>();
        if(cursor.moveToFirst()) {

            do{
                String strKey=cursor.getString(1);
                String strItem=cursor.getString(2);
                if(!cursor.getString(0).equals(""))
                {

                    list.put(strKey,strItem);
                }
            }while(cursor.moveToNext());

        }
        cursor.close();
        return list;

    }

    public HashMap<String, String> getLookupList(String strListName){
        String sql="SELECT CODE, DESCRIPTION FROM "+ TABLE_APPLICATIONLOOKUPS
                +" WHERE ORGCODE='"+Globals.orgCode+"' AND LISTNAME='"+  strListName +"'";
        SQLiteDatabase db=this.getReadableDatabase();
        Cursor cursor= db.rawQuery(sql,null);
        HashMap<String ,String >list=new HashMap<>();
        if(cursor.moveToFirst()) {

            do{
                String strKey=cursor.getString(0);
                String strItem=cursor.getString(1);
                if(!cursor.getString(0).equals(""))
                {

                    list.put(strKey,strItem);
                }
            }while(cursor.moveToNext());

        }
        cursor.close();
        return list;
    }

    public HashMap<String, String > getSurveyList()
    {
        String sql="SELECT DISTINCT DESCRIPTION FROM "+ TABLE_APPLICATIONLOOKUPS
                +" WHERE ORGCODE='"+Globals.orgCode+"' AND LISTNAME='"+  Globals.VISIT_TASK_LIST_NAME +"'";
        SQLiteDatabase db=this.getReadableDatabase();
        Cursor cursor= db.rawQuery(sql,null);
        HashMap<String ,String >list=new HashMap<>();
        if(cursor.moveToFirst()) {

            int i=0;
            do{
                String strKey=String.valueOf(i);
                String strItem=cursor.getString(0);
                if(!cursor.getString(0).equals(""))
                {

                    try{
                        JSONObject jo=new JSONObject(cursor.getString(0));
                        strKey=String.valueOf(jo.getInt("id"));
                        //strItem= jo.getString("desc");
                    }catch (Exception e)
                    {
                        Log.i("getVisitTaskList","No Json object");
                    }

                    list.put(strKey,strItem);
                    i++;
                }
             }while(cursor.moveToNext());

        }
        cursor.close();
        return list;
    }
    public HashMap<String, String > getSurveyQuestionList()
    {
        String sql="SELECT DISTINCT DESCRIPTION FROM "+ TABLE_APPLICATIONLOOKUPS+" WHERE ORGCODE='"
                + Globals.orgCode  +"' AND LISTNAME='VisitSurveyList'";
        SQLiteDatabase db=this.getReadableDatabase();
        Cursor cursor= db.rawQuery(sql,null);
        HashMap<String ,String >list=new HashMap<>();
        if(cursor.moveToFirst()) {

            int i=0;
            do{
                String strKey=String.valueOf(i);
                String strItem=cursor.getString(0);
                if(!cursor.getString(0).equals(""))
                {
                    String desc=cursor.getString(0);
                    try{
                        JSONObject jo=new JSONObject(desc);
                        int qId=jo.getInt("id");

                        sql="SELECT group_concat(CODE,',') FROM "+TABLE_APPLICATIONLOOKUPS
                                +" WHERE OrgCode="
                                + Globals.orgCode +" AND LISTNAME='VisitSurveyList' AND DESCRIPTION LIKE '{id:"
                                + qId +",%'";
                        Cursor c1=db.rawQuery(sql,null);
                        if(c1.moveToFirst())
                        {
                            strItem=c1.getString(0);
                        }
                        c1.close();
                    }catch(Exception e)
                    {
                        Log.i(TAG,"DBHandler:getSurveyQuestionList:"+e.toString());
                    }



                    try{
                        JSONObject jo=new JSONObject(cursor.getString(0));
                        strKey=String.valueOf(jo.getInt("id"));
                        //strItem= jo.getString("desc");
                    }catch (Exception e)
                    {
                        Log.i("getSurveyQuestionList","No Json object");
                    }

                    list.put(strKey,strItem);
                    i++;
                }
            }while(cursor.moveToNext());


        }
        cursor.close();
        return list;
    }
    public HashMap<String, String > getProductCatList()
    {
        String sql="SELECT OPTPARAM1,group_concat(CODE,',') FROM "+TABLE_APPLICATIONLOOKUPS
                +" WHERE OrgCode='"
                + Globals.orgCode +"' AND LISTNAME='ProductList' "
                +" GROUP BY OPTPARAM1"
                +" ORDER BY OPTPARAM1";
        SQLiteDatabase db=this.getReadableDatabase();
        Cursor cursor= db.rawQuery(sql,null);
        HashMap<String ,String >list=new HashMap<>();
        if(cursor.moveToFirst()) {
            do{
                list.put(cursor.getString(0),cursor.getString(1));
            }while(cursor.moveToNext());

        }
        cursor.close();
        db.close();
        return list;
    }
    public HashMap<String, String > getNSRList()
    {
        String sql="SELECT OPTPARAM2 DESCRIPTION FROM "+ TABLE_APPLICATIONLOOKUPS
                +" WHERE OrgCode='"+Globals.orgCode+"' AND LISTNAME='VisitNSRList'"
                +" AND CODE='1'";
        SQLiteDatabase db=this.getReadableDatabase();
        Cursor cursor= db.rawQuery(sql,null);
        HashMap<String ,String >list=new HashMap<>();
        if(cursor.moveToFirst()) {



            do{
                String strKey=String.valueOf(1);
                String strItem=cursor.getString(0);
                if(!cursor.getString(0).equals(""))
                {

                    try{
                        JSONArray ja=new JSONArray(cursor.getString(0));
                        for(int i=0;i<ja.length();i++)
                        {
                            JSONObject jo=ja.getJSONObject(i);
                            list.put(String.valueOf(jo.getInt("id")),jo.getString("desc"));
                        }
                    }catch (Exception e)
                    {
                        Log.i("getNSRList","No Json object");
                    }
                }
            }while(cursor.moveToNext());

        }
        cursor.close();
        db.close();
        return list;
    }

    public HashMap<String, String > getProductList()
    {
        String sql="SELECT CODE,DESCRIPTION,OPTPARAM1,OPTPARAM2 DESCRIPTION FROM "+ TABLE_APPLICATIONLOOKUPS
                +" WHERE OrgCode='"+Globals.orgCode+"' AND LISTNAME='ProductList' ORDER BY CODE";

        SQLiteDatabase db=this.getReadableDatabase();
        Cursor cursor= db.rawQuery(sql,null);
        HashMap<String ,String >list=new HashMap<>();
        if(cursor.moveToFirst()) {
            do{
                String strKey=String.valueOf(cursor.getInt(0));
                String strItem="";
                try{
                    JSONObject jo= new JSONObject();
                    jo.put("id",cursor.getInt(0));
                    jo.put("desc",cursor.getString(1));
                    jo.put("cat",cursor.getString(2));
                    int catCode=0, compQty=0;
                    if(!cursor.getString((3)).equals("")) {
                        JSONArray jsonDetails = new JSONArray(cursor.getString(3));
                        if(jsonDetails.length()==2) {
                            catCode=jsonDetails.optInt(0,0);
                            compQty=jsonDetails.optInt(1,0);
                        }
                    }
                    jo.put("catId",catCode);
                    jo.put("compQty",compQty);
                    Cursor c1=db.rawQuery("SELECT OPTPARAM1 FROM "+TABLE_APPLICATIONLOOKUPS +
                        " WHERE ORGCODE="+Globals.orgCode+" AND LISTNAME='DefaultPriceList'" +
                            " AND CODE="+strKey,null);
                    String priceData="[]";
                    if(c1.moveToFirst())
                    {
                        priceData= c1.getString(0);
                    }
                    JSONArray jPrice=new JSONArray(priceData);
                    jo.put("price",jPrice);
                    strItem=jo.toString();
                    list.put(strKey,strItem);
                }catch (Exception e)
                {
                    Log.i("getProductList",e.toString());
                }

            }while(cursor.moveToNext());
        }
        cursor.close();
        db.close();
        return list;
    }
    /*SQL*/
    public int  getTotalOrders(int empCode)
    {
        String sql="SELECT COUNT(CODE) FROM "+TABLE_MSG_APPLICATIONLOOKUPS
                + " WHERE LISTNAME='OrderList' AND DESCRIPTION='" + empCode +"'";
        Cursor c=fetch(sql);
        if(c.moveToNext())
        {
            return c.getInt(0);
        }
        c.close();

        return 0;
    }

    public Cursor fetch(String strSQL)
    {
        SQLiteDatabase db=this.getReadableDatabase();
        Cursor cursor= db.rawQuery(strSQL,null);
        db.close();
        return  cursor;
    }
}
