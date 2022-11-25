package com.app.ps19.tipsapp.Shared;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;

public class SharedPref {

    public static String PREFS_NAME = "TIPS_PREF";
    public static String PREFS_KEY = "TIPS_SERVER_INFO";
    private Context context;

    public SharedPref(Context context) {
        super();
        if(Globals.appName.equals(Globals.AppName.SCIM)){
            PREFS_NAME = "SCIM_PREF";
            PREFS_KEY = "SCIM_SERVER_INFO";

        } else if (Globals.appName.equals(Globals.AppName.TIMPS)){
            PREFS_NAME = "TIPS_PREF";
            PREFS_KEY = "TIPS_SERVER_INFO";
        } else if (Globals.appName.equals(Globals.AppName.EUIS)){
            PREFS_NAME = "EUIS_PREF";
            PREFS_KEY = "EUIS_SERVER_INFO";
        }
        this.context = context;
    }

    public void putString(String key, String text) {
        SharedPreferences settings;
        Editor editor;

        //settings = PreferenceManager.getDefaultSharedPreferences(context);
        settings = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE); //1
        editor = settings.edit(); //2

        editor.putString(key, text); //3
        editor.apply();
        editor.commit(); //4
    }

    public void putBool(String key, Boolean value) {
        SharedPreferences settings;
        Editor editor;

        //settings = PreferenceManager.getDefaultSharedPreferences(context);
        settings = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE); //1
        editor = settings.edit(); //2
        editor.putBoolean(key, value);
        editor.apply();
        editor.commit();
    }

    public Boolean getBoolean(String key) {
        SharedPreferences settings;
        boolean value;

        //settings = PreferenceManager.getDefaultSharedPreferences(context);
        settings = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        value = settings.getBoolean(key, false);
        return value;
    }
    public Boolean getBoolean(String key, boolean def) {
        SharedPreferences settings;
        boolean value;

        //settings = PreferenceManager.getDefaultSharedPreferences(context);
        settings = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        value = settings.getBoolean(key, def);
        return value;
    }

    public String getString(String key) {
        SharedPreferences settings;
        String text;

        //settings = PreferenceManager.getDefaultSharedPreferences(context);
        settings = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        text = settings.getString(key, "");
        return text;
    }
    public String getString(String key, String def) {
        SharedPreferences settings;
        String text;

        //settings = PreferenceManager.getDefaultSharedPreferences(context);
        settings = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        text = settings.getString(key, def);
        return text;
    }

    public void clearSharedPreference(Context context) {
        SharedPreferences settings;
        Editor editor;

        //settings = PreferenceManager.getDefaultSharedPreferences(context);
        settings = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        editor = settings.edit();

        editor.clear();
        editor.apply();
    }

    public void removeValue(Context context) {
        SharedPreferences settings;
        Editor editor;

        settings = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        editor = settings.edit();

        editor.remove(PREFS_KEY);
        editor.apply();
    }
}
