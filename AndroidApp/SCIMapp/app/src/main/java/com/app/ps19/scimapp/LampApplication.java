package com.app.ps19.scimapp;

import android.app.Application;
import android.content.Intent;
import android.os.Handler;
import android.os.Looper;
import android.os.StrictMode;
import android.util.Log;

import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.classes.error.ErrorObject;

import org.json.JSONObject;

import java.io.PrintWriter;
import java.io.StringWriter;

public class LampApplication extends Application
{
    private static LampApplication singleton;
    private Thread.UncaughtExceptionHandler oldHandler;
    private ErrorObject errorObject;

    public static LampApplication getInstance(){
        return singleton;
    }
    public void onCreate ()
    {
        super.onCreate();
        singleton = this;
       /* StrictMode.setVmPolicy(new StrictMode.VmPolicy.Builder()
                .detectActivityLeaks()
                .detectLeakedSqlLiteObjects()
                .detectLeakedClosableObjects()
                .penaltyLog()
                .build());
        if(BuildConfig.DEBUG)
            StrictMode.enableDefaults();*/
        // Setup handler for uncaught exceptions.
        oldHandler = Thread.getDefaultUncaughtExceptionHandler();
        Thread.setDefaultUncaughtExceptionHandler (new Thread.UncaughtExceptionHandler()
        {
            @Override
            public void uncaughtException (Thread thread, Throwable e)
            {
                handleUncaughtException (thread, e);
            }
        });
    }
    public boolean isUIThread(){
        return Looper.getMainLooper().getThread() == Thread.currentThread();
    }
    public void handleUncaughtException (Thread thread, Throwable e)
    {
        e.printStackTrace();
        Log.d("Application Crashed","Application Crashed");
        //oldHandler = Thread.getDefaultUncaughtExceptionHandler();
        try {
            StringWriter sw = new StringWriter();
            e.printStackTrace(new PrintWriter(sw));
            errorObject=new ErrorObject(sw.toString());

            if(isUIThread()) {
                invokeLogActivity();
            }else{  //handle non UI thread throw uncaught exception

                new Handler(Looper.getMainLooper()).post(new Runnable() {
                    @Override
                    public void run() {
                        invokeLogActivity();
                    }
                });
            }

        } catch(Exception ex) {
            ex.printStackTrace();
        } finally {
            //if (oldHandler != null)
            //    oldHandler.uncaughtException(thread, e);
            //else
            //System.exit(1);
        }

/*       Intent intent = new Intent ();
        intent.setAction ("com.mydomain.SEND_LOG"); // see step 5.
        intent.setFlags (Intent.FLAG_ACTIVITY_NEW_TASK); // required when starting from Application
        startActivity (intent);*/

        //System.exit(1); // kill off the crashed app
    }

    private void invokeLogActivity() {
        JSONObject joError=errorObject.getJsonObject();
        Intent intent = new Intent ();
        intent.setAction ("com.app.ps19.scimapp.SEND_LOG_TO"); // see step 5.
        intent.setFlags (Intent.FLAG_ACTIVITY_NEW_TASK); // required when starting from Application
        intent.putExtra(Intent.EXTRA_TEXT, joError.toString());
        startActivity (intent);
        System.exit(1);


    }
}