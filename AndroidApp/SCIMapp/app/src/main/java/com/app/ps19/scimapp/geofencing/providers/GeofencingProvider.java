package com.app.ps19.scimapp.geofencing.providers;

import android.Manifest;
import android.app.Activity;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentSender;
import android.content.pm.PackageManager;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;

import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.location.Geofence;
import com.google.android.gms.location.GeofenceStatusCodes;
import com.google.android.gms.location.GeofencingClient;
import com.google.android.gms.location.GeofencingEvent;
import com.google.android.gms.location.GeofencingRequest;
import com.google.android.gms.location.LocationServices;
import com.app.ps19.scimapp.geofencing.Interface.OnGeofencingTransitionListener;
import com.app.ps19.scimapp.geofencing.utils.GeofenceErrorMessages;
//import com.app.ps19.scimapp.geofencing.utils.GeofencingStore;
import com.app.ps19.scimapp.geofencing.Interface.IGeofencingProvider;
import com.app.ps19.scimapp.geofencing.model.GeofenceModel;
import com.app.ps19.scimapp.geofencing.utils.TransitionGeofence;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class GeofencingProvider extends BroadcastReceiver implements
        IGeofencingProvider,
        OnCompleteListener<Void>,
        ResultCallback<Status> {

    public static final int RESULT_CODE = 10003;
    private static final String TAG = GeofencingProvider.class.getSimpleName();

    private final List<Geofence> geofencesToAdd = Collections.synchronizedList(new ArrayList<Geofence>());
    private final List<String> geofencesToRemove = Collections.synchronizedList(new ArrayList<String>());
    private static OnGeofencingTransitionListener listener;
    // private static GeofencingStore geofencingStore;
    private Context context;
    private boolean stopped = false;

    //private enum PendingGeofenceTask {ADD, REMOVE, NONE}

    private GeofencingClient mGeofencingClient;
    private List<Geofence> mGeofenceList;
    private PendingIntent mGeofencePendingIntent = null;
    // private PendingGeofenceTask mPendingGeofenceTask = PendingGeofenceTask.NONE;

    @Override
    public void init(@NonNull Context context) {
        this.context = context;
        mGeofenceList = new ArrayList<>();
        //  geofencingStore = new GeofencingStore(context);
        mGeofencingClient = LocationServices.getGeofencingClient(context);

    }

    private PendingIntent getGeofencePendingIntent() {
        // Reuse the PendingIntent if we already have it.
        if (mGeofencePendingIntent != null) {
            return mGeofencePendingIntent;
        }
        Intent intent = new Intent(context, GeofencingProvider.class);
        // We use FLAG_UPDATE_CURRENT so that we get the same pending intent back when calling
        // addGeofences() and removeGeofences().
        mGeofencePendingIntent = PendingIntent.getBroadcast(context,
                0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        return mGeofencePendingIntent;
    }

    @Override
    public void addGeofence(GeofenceModel geofence) {
        List<GeofenceModel> wrapperList = new ArrayList<>();
        wrapperList.add(geofence);
        addGeofences(wrapperList);
    }

    @Override
    public void addGeofences(List<GeofenceModel> geofenceList) {
        for (GeofenceModel geofenceModel : geofenceList) {
            // geofencingStore.put(geofenceModel.getRequestId(), geofenceModel);
            mGeofenceList.add(geofenceModel.toGeofence());
        }
    }

    @Override
    public void removeGeofence(String geofenceId) {
        List<String> wrapperList = new ArrayList<>();
        wrapperList.add(geofenceId);
        removeGeofences(wrapperList);
    }

    @Override
    public void removeGeofences(List<String> geofenceIds) {
//        for (String id : geofenceIds) {
//         //   geofencingStore.remove(id);
//        }
        mGeofencingClient.removeGeofences(getGeofencePendingIntent())
                .addOnCompleteListener(this);
    }

    @Override
    public void start(OnGeofencingTransitionListener callback) {

        listener = callback;
        GeofencingRequest.Builder builder = new GeofencingRequest.Builder();
        // The INITIAL_TRIGGER_ENTER flag indicates that geofencing service should trigger a
        // GEOFENCE_TRANSITION_ENTER notification when the geofence is added and if the device
        // is already inside that geofence.
        builder.setInitialTrigger(GeofencingRequest.INITIAL_TRIGGER_ENTER);
        builder.addGeofences(mGeofenceList);
        if (ActivityCompat.checkSelfPermission(context,
                Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        mGeofencingClient.addGeofences(builder.build(),
                getGeofencePendingIntent())
                .addOnCompleteListener(this);
    }

    @Override
    public void stop() {
        try {
            //context.unregisterReceiver(geofencingReceiver);
        } catch (IllegalArgumentException e) {
            Log.i("G", "Receiver not registered");
        }
        stopped = true;
    }

    /**
     * Returns true if geofences were added, otherwise false.
     */
//    public boolean getGeofencesAdded() {
////        boolean retVal = PreferenceManager.getDefaultSharedPreferences(context).
////                getBoolean(geofencingStore.GEOFENCE_PREFERENCES_FILE, false);
//        return retVal;
//    }

//    public void updateGeofencesAdded(boolean added) {
////        PreferenceManager.getDefaultSharedPreferences(context)
////                .edit()
////                .putBoolean(geofencingStore.GEOFENCE_PREFERENCES_FILE, added)
////                .apply();
//    }

    @Override
    public void onComplete(@NonNull Task<Void> task) {
        // mPendingGeofenceTask = PendingGeofenceTask.NONE;
        mGeofenceList.clear();
        if (task.isSuccessful()) {
            //Geofence Added Successfully
        } else {
            // Get the status code for the error and log it using a user-friendly message.
            String errorMessage = GeofenceErrorMessages.getErrorString(this.context, task.getException());
            //   Toast.makeText(this.context, errorMessage, Toast.LENGTH_LONG).show();
            // Log.w(TAG, errorMessage);
        }
    }

    @Override
    public void onResult(@NonNull Status status) {
        if (status.isSuccess()) {
            //  logger.d("Geofencing update request successful");
        } else if (status.hasResolution() && context instanceof Activity) {
            //  logger.w(
            //         "Unable to register, but we can solve this - will startActivityForResult expecting result code " + RESULT_CODE + " (if received, please try again)");
            try {
                status.startResolutionForResult((Activity) context, RESULT_CODE);
            } catch (IntentSender.SendIntentException e) {
                //     logger.e(e, "problem with startResolutionForResult");
            }
        } else {
            // No recovery. Weep softly or inform the user.
            // logger.e("Registering failed: " + status.getStatusMessage());
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        GeofencingEvent geofencingEvent = GeofencingEvent.fromIntent(intent);
        if (geofencingEvent.hasError()) {
            String errorMessage = GeofenceStatusCodes
                    .getStatusCodeString(geofencingEvent.getErrorCode());
            Log.e(TAG, errorMessage);
            return;
        }

        // Get the transition type.
        int geofenceTransition = geofencingEvent.getGeofenceTransition();

        // Test that the reported transition was of interest.
        if (geofenceTransition == Geofence.GEOFENCE_TRANSITION_ENTER ||
                geofenceTransition == Geofence.GEOFENCE_TRANSITION_EXIT ||
                geofenceTransition == Geofence.GEOFENCE_TRANSITION_DWELL) {

            final List<Geofence> geofences = geofencingEvent.getTriggeringGeofences();

            //  List <GeofenceModel> models = new ArrayList<>();
            for (final Geofence geofence : geofences) {
                // Get GeofenceModel
                String id = geofence.getRequestId();
                if (listener != null) {
                    listener.onGeofenceTransition(new TransitionGeofence(id, geofenceTransition));
                }
/*
                GeofenceModel geofenceModel = GeofencingProvider.geofencingStore.get(id);
                models.add(geofenceModel);*/
            }
/*            if (models.size() > 0) {
                listener.onGeofenceTransition(new TransitionGeofence(models,geofenceTransition));
            } else {
                //     logger.w("Tried to retrieve geofence " + geofenceId + " but it was not in the store");
            }*/
        }
    }
}
