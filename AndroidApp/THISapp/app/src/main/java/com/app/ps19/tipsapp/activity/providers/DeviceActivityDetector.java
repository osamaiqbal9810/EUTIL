/*
package com.app.ps19.tipsapp.activity.providers;

import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.app.ps19.tipsapp.activity.activityinterface;
import com.app.ps19.tipsapp.activity.config.ActivityParams;
import com.google.android.gms.location.ActivityRecognitionClient;
import com.google.android.gms.location.ActivityRecognitionResult;
import com.google.android.gms.location.DetectedActivity;
import com.google.android.gms.tasks.Task;

import java.util.ArrayList;

public class DeviceActivityDetector extends BroadcastReceiver {
    private static final String TAG = DeviceActivityDetector.class.getSimpleName();

    private PendingIntent mPendingIntent;
    private ActivityRecognitionClient mActivityRecognitionClient;
    private Context mContext = null;
    private static activityinterface onActivityCallback = null;

    private static int lastActivityType = DetectedActivity.UNKNOWN;

    public DeviceActivityDetector(){

    }

    public DeviceActivityDetector(Context ctx, activityinterface callback) {
        mContext = ctx;
        if (onActivityCallback == null) {
            onActivityCallback = callback;
        }
        mActivityRecognitionClient = new ActivityRecognitionClient(ctx);
        Intent intent = new Intent(mContext, DeviceActivityDetector.class);

        mPendingIntent = PendingIntent.getBroadcast(mContext,
                1, intent, PendingIntent.FLAG_UPDATE_CURRENT);
    }

    @Override
    public void onReceive(Context context, Intent intent) {

        if(onActivityCallback == null){
            Log.e(TAG, "No callback registered for Device Activity Updates");
            return;
        }

        ActivityRecognitionResult result = ActivityRecognitionResult.extractResult(intent);

        // Get the list of the probable activities associated with the current state of the
        // device. Each activity is associated with a confidence level, which is an int between
        // 0 and 100.
        ArrayList<DetectedActivity> detectedActivities = (ArrayList) result.getProbableActivities();

        for (DetectedActivity activity : detectedActivities) {

            int type  = getMyTypefromActivity(activity.getType());

            if (activity.getConfidence() >= ActivityParams.CONFIDENCE  && type != lastActivityType) {
                lastActivityType =  type;
                onActivityCallback.OnActivityCallback(lastActivityType, activity.getConfidence());;
            }
        }
    }

    private int getMyTypefromActivity(int type) {
        int myType = 0;

        switch (type) {
            case DetectedActivity.IN_VEHICLE:
            case DetectedActivity.RUNNING:
            case DetectedActivity.ON_BICYCLE: {
                myType = DetectedActivity.IN_VEHICLE;
                break;
            }

            case DetectedActivity.WALKING:
            case DetectedActivity.ON_FOOT: {
                myType = DetectedActivity.WALKING;
                break;
            }
            case DetectedActivity.TILTING:
            case DetectedActivity.UNKNOWN:
            case DetectedActivity.STILL: {
                myType = DetectedActivity.STILL;
                break;
            }
        }
        return myType;
    }



    public void requestActivityUpdates() {

        Task<Void> task = mActivityRecognitionClient.requestActivityUpdates(
                ActivityParams.DETECTION_INTERVAL_IN_MILLISECONDS,
                mPendingIntent);

//        task.addOnSuccessListener(new OnSuccessListener<Void>() {
//            @Override
//            public void onSuccess(Void result) {
//                Toast.makeText(mContext,
//                        "Successfully requested activity updates",
//                        Toast.LENGTH_SHORT)
//                        .show();
//            }
//        });

//        task.addOnFailureListener(new OnFailureListener() {
//            @Override
//            public void onFailure(@NonNull Exception e) {
//                Toast.makeText(mContext,
//                        "Failed to Start Activity Updates ",
//                        Toast.LENGTH_SHORT)
//                        .show();
//            }
//        });
    }

    public void removeActivityUpdates() {
        Task<Void> task = mActivityRecognitionClient.removeActivityUpdates(
                mPendingIntent);
//        task.addOnSuccessListener(new OnSuccessListener<Void>() {
//            @Override
//            public void onSuccess(Void result) {
//                Toast.makeText(mContext,
//                        "Removed activity updates successfully!",
//                        Toast.LENGTH_SHORT)
//                        .show();
//            }
//        });
//
//        task.addOnFailureListener(new OnFailureListener() {
//            @Override
//            public void onFailure(@NonNull Exception e) {
//                Toast.makeText(mContext, "Failed to Remove Activity Updates!",
//                        Toast.LENGTH_SHORT).show();
//            }
//        });
    }

    public void stop(){
        mActivityRecognitionClient.removeActivityUpdates(mPendingIntent);
    }

    public int getLastActivityType() {
        return lastActivityType;
    }
}*/
