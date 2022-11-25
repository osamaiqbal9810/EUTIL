package com.app.ps19.elecapp.Shared;

import android.content.Context;
import android.os.AsyncTask;
import android.util.Log;
import android.view.MenuItem;

import com.app.ps19.elecapp.DashboardActivity;
import com.app.ps19.elecapp.MainActivity;

/**
 * Created by Ajaz Ahmad Qureshi on 8/22/2017.
 */

public class DataSyncProcessEx extends AsyncTask<Context,Integer,String>
{
    boolean isNetAvailable;
    boolean prevStatus;
    boolean blnFirstTime;
    MenuItem actionCloud=null;
    boolean isTaskCanceled=false;
    boolean isRunning=false;
    boolean threadInterrupted=false;
    private DataSyncProcessListener listener=null;
    public interface  DataSyncProcessListener{
        void onStatusChanged(int status);

    }

    public void setDataSyncProcessListener(DataSyncProcessListener listener){
        this.listener=listener;
    }
    Context context;
    public DataSyncProcessEx(){

    }
    public DataSyncProcessEx(Context context){
        this.context=context;
    }
    public void CancelTask()
    {
        isTaskCanceled=true;

    }
    int intCount;
    final int serviceHandle=2;
    //public boolean isNewDashEnable = true;
    private void raiseStatusChangeEvent(final int status){
        if(listener !=null && context !=null){
            //if(isNewDashEnable){
            ((DashboardActivity) context).runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    listener.onStatusChanged(status);
                }
            });
            /*} else {
            ((MainActivity) context).runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    listener.onStatusChanged(status);
                }
            });
            }*/
            listener.onStatusChanged(status);
        }
    }

    @Override
    protected void onCancelled() {
        super.onCancelled();
    }

    @Override
    protected void onPreExecute() {
        if(context == null)
            isNetAvailable = Globals.isInternetAvailable(Globals.getDBContext());
        else isNetAvailable = Globals.isInternetAvailable(context);


        if(isNetAvailable){
            raiseStatusChangeEvent(Globals.SERVICE_STATUS_CONNECTED);
        }else
        {
            raiseStatusChangeEvent(Globals.SERVICE_STATUS_NOT_CONNECTED);
        }



        blnFirstTime=true;

        super.onPreExecute();
    }

    @Override
    protected void onPostExecute(String s) {

        isRunning=false;
        super.onPostExecute(s);
    }

    @Override
    protected void onProgressUpdate(Integer... values) {

        if(context == null) {
            isNetAvailable = Globals.isInternetAvailable(Globals.getDBContext());
        }
        else{
            isNetAvailable = Globals.isInternetAvailable(context);
        }
        blnFirstTime=false;
        prevStatus=isNetAvailable;
        if(isNetAvailable)
        {
            raiseStatusChangeEvent(Globals.SERVICE_STATUS_CONNECTED);
        }
        else
        {
            raiseStatusChangeEvent(Globals.SERVICE_STATUS_NOT_CONNECTED);
        }


        super.onProgressUpdate(values);
    }

    @Override
    protected String doInBackground(Context... params) {
        intCount=0;
        this.context=params[0];

        while(Globals.IsAutoUpdateEnabled) {
            //final MenuItem actionCloud=Globals.menuIcon;

            if(Globals.dbContext!=null)
            {
                this.context=Globals.dbContext;
            }
            Log.i("DataSyncServiceEx","doInBackground:"+isCancelled()+":");
            if(isTaskCanceled)
            {
                Log.i("DataSyncServiceEx","doInBackground:canceled  ");
                return "";
            }
            //isNetAvailable = Globals.isInternetAvailable(params[0]);
            //isNetAvailable = false;
            if( ! Globals.empCode.equals("") && ! Globals.orgCode.equals("") && !Globals.appid.equals("") && !Globals.isDayProcessRunning && !Globals.isServiceProcessing)
            {
                Globals.isServiceProcessing=true;
                if(isNetAvailable) {
                    if (Globals.serviceHandle == Globals.SERVICE_AVAILABLE || Globals.serviceHandle == this.serviceHandle) {

                        Globals.serviceHandle = this.serviceHandle;
                        Globals.sendBroadcastMessage(Globals.OBSERVABLE_MESSAGE_NETWORK_PUSH,"");
                        raiseStatusChangeEvent(Globals.SERVICE_STATUS_PUSH);
                        int dataSent=Globals.webUploadMessageLists(this.context,Globals.orgCode);
                        //int dataSent=Globals.webUploadMessageLists(((DashboardActivity) context).getApplicationContext(),Globals.orgCode);

                       /* } else {
                            int dataSent=Globals.webUploadMessageLists(((MainActivity) context).getApplicationContext(),Globals.orgCode);
                            Globals.webPullRequest(((MainActivity) context).getApplicationContext(),Globals.timeStamp);
                        }*/


                        Globals.sendBroadcastMessage(Globals.OBSERVABLE_MESSAGE_NETWORK_PULL,"");
                        raiseStatusChangeEvent(Globals.SERVICE_STATUS_PULL);
                        boolean blnPullAll=Globals.timeStamp.equals("");
                        Globals.webPullRequest(this.context,Globals.timeStamp);

                        Globals.serviceHandle = Globals.SERVICE_AVAILABLE;

                        if(Globals.lastWsReturnCode==Globals.WS_RET_UNAUTHORIZED ){
                            Globals.tokenExpired=true;
                            Globals.sendBroadcastMessage(Globals.OBSERVABLE_MESSAGE_TOKEN_STATUS,"");
                        }else
                        {
                            Globals.tokenExpired = false;
                        }

                        if(blnPullAll && !Globals.offlineMode){
                            Globals.sendBroadcastMessage(Globals.OBSERVABLE_MESSAGE_DATA_CHANGED,"");
                        }

                        try {
                            Thread.sleep(200);
                        }catch (Exception e)
                        {

                        }
                        Globals.sendBroadcastMessage(Globals.OBSERVABLE_MESSAGE_NETWORK_CONNECTED,"");
                        intCount++;
                    }
                }else
                {
                    Globals.sendBroadcastMessage(Globals.OBSERVABLE_MESSAGE_NETWORK_DISCONNECTED,"");
                }
                Globals.isServiceProcessing=false;
            }
            publishProgress(intCount);

            try {
                long count=0;
                long maxValue=Globals.lngAutoUpdateTimeOut/1000;
                while(count<maxValue) {
                    Thread.sleep(1000);
                    count++;
                    if(threadInterrupted){
                        threadInterrupted=false;
                        Log.i("DataSyncProcessEx","Thread Interrupted");
                        break;
                    }
                }
            }catch (Exception e)
            {
                Log.i("DataSyncProcessEx","Thread Interrupted");

            }
        }
        return "";
    }
    public void InterruptThread(){
        this.threadInterrupted=true;
    }
}
