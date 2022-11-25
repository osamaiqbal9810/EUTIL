package com.app.ps19.scimapp.location;

import android.annotation.SuppressLint;
import android.app.ActivityManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.location.Location;
import android.os.Binder;
import android.os.Build;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.NonNull;

import com.app.ps19.scimapp.R;
import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.Shared.Utilities;
import com.app.ps19.scimapp.geofencing.Interface.OnGeofencingTransitionListener;
import com.app.ps19.scimapp.geofencing.model.GeofenceModel;
import com.app.ps19.scimapp.geofencing.providers.GeofencingProvider;
import com.app.ps19.scimapp.geofencing.utils.TransitionGeofence;
import com.app.ps19.scimapp.location.Interface.OnLocationUpdatedListener;
import com.app.ps19.scimapp.location.providers.MultiFallbackProvider;
import com.google.android.gms.location.DetectedActivity;
import com.google.android.gms.location.Geofence;
import com.google.android.gms.maps.model.LatLng;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

public class LocationUpdatesService extends Service implements
        OnLocationUpdatedListener,
        OnGeofencingTransitionListener{

    private static Map<String,OnLocationUpdatedListener> onLocationUpdateCallbacks = new HashMap<>();
    private static MultiFallbackProvider fallbackLocationProvider = null;
    private static GeofencingProvider geofencingProvider = null;
    /*    private static DeviceActivityDetector activityDetection;*/
    private static List<GeofenceModel> geofenceModelList;
    private static final String PACKAGE_NAME = "com.app.ps19.scimapp.Shared";
    private static final String TAG = LocationUpdatesService.class.getSimpleName();
    private static final String CHANNEL_ID = "channel_01";
    public static final String ACTION_BROADCAST = PACKAGE_NAME + ".broadcast";
    public static final String EXTRA_LOCATION = PACKAGE_NAME + ".location";
    //    public  static final String EXTRA_STARTED_FROM_NOTIFICATION = PACKAGE_NAME + ".started_from_notification";
    private Context mContext = null;
    private final IBinder mBinder = new LocalBinder();
    //    private static final int NOTIFICATION_ID = 12345678;
//    private boolean mChangingConfiguration = false;
    private static NotificationManager mNotificationManager = null;
    private Handler mServiceHandler;
    private static Location mLastLocation;
    @SuppressLint("StaticFieldLeak")
    private static SmartLocationManager smartLocationManager;
    private static boolean isNewProvder = true;
    private static boolean isUpdateStarted = false;
    boolean isGpsLoggingEnabled = false;
    static boolean isLocationLocked = false;
    public static final Location defaultLocation =  new Location("None");
    static FileOutputStream stream = null;
    /*    public static int lastActivityType  = DetectedActivity.UNKNOWN;*/

    public LocationUpdatesService() {
    }


    public static  Location getLocation(){
        if(mLastLocation != null){
            return mLastLocation;
        }else{
            Location  retLoc ;
            retLoc = smartLocationManager.location(fallbackLocationProvider).getLocation();
            if (retLoc == null || retLoc.getProvider().equals("None"))
            {
                retLoc =  mLastLocation != null ?  mLastLocation : defaultLocation;
            }
            return  retLoc;
        }
    }

    /**
     * Function to check GPS/wifi enabled
     *
     * @return boolean
     */
    public static boolean canGetLocation() {

        return fallbackLocationProvider != null && fallbackLocationProvider.canGetLocation();
    }

    public static void addOnLocationUpdateListener(@NonNull String className, @NonNull OnLocationUpdatedListener listener) {
        if (onLocationUpdateCallbacks == null) {
            onLocationUpdateCallbacks = new HashMap<>();
        }

        //Update existing key(activity activated) or put new listener
        onLocationUpdateCallbacks.put(className, listener);

        if (mLastLocation != null) {
            if (!mLastLocation.getProvider().equals("None")
                    && mLastLocation.getLongitude() != 0.0 && mLastLocation.getLatitude() != 0.0) {
                listener.onLocationUpdated(mLastLocation);
            }
        }
    }

    public static void removeLocationUpdateListener(@NonNull String className) {
        if (onLocationUpdateCallbacks == null) {
            return;
        }

        onLocationUpdateCallbacks.remove(className);
    }

    @Override
    public void onCreate() {
        HandlerThread handlerThread = new HandlerThread(TAG);
        handlerThread.start();
        mServiceHandler = new Handler(handlerThread.getLooper());
        // mNotificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);

        mContext = this;

        isGpsLoggingEnabled = false;
        // getLastLocation();
        if (isNewProvder) {
            buildLocationProviders();
            if (mNotificationManager == null) {
                mNotificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);

                // Android O requires a Notification Channel.
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    CharSequence name = getString(R.string.app_name);
                    // Create the channel for the notification
                    NotificationChannel mChannel =
                            new NotificationChannel(CHANNEL_ID, name, NotificationManager.IMPORTANCE_DEFAULT);

                    // Set the Notification Channel for the Notification Manager.
                    mNotificationManager.createNotificationChannel(mChannel);
                }
            }
        }
    }

    private void buildLocationProviders() {

        fallbackLocationProvider = new MultiFallbackProvider.Builder().build();
        geofencingProvider = new GeofencingProvider();
        /*        activityDetection = new DeviceActivityDetector(this, this);*/
        geofenceModelList = new ArrayList<>();

        //Adding all locations from Constants to the geofencing model
        for (Map.Entry<String, LatLng> entry : Globals.AREA_LANDMARKS.entrySet()) {
            geofenceModelList.add(new GeofenceModel.Builder(entry.getKey())
                    .setLatitude(entry.getValue().latitude)
                    .setLongitude(entry.getValue().longitude)
                    .setRadius(Globals.GEOFENCE_RADIUS_IN_METERS)
                    .setExpiration(Geofence.NEVER_EXPIRE)
                    .setTransition(Geofence.GEOFENCE_TRANSITION_ENTER)
                    .setLoiteringDelay(1) //1s
                    .setNotificationResponseTimeMS(1)

                    .build());
        }

        smartLocationManager = new SmartLocationManager.Builder(this).build();
        smartLocationManager.location(fallbackLocationProvider);
        smartLocationManager.geofencing(geofencingProvider);
        isNewProvder = false;
    }

    private void getLastLocation() {
        if (mLastLocation == null) {
            mLastLocation =  SmartLocationManager.with(this).location(fallbackLocationProvider).getLastLocation();
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return START_NOT_STICKY;
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
    }

    @Override
    public IBinder onBind(Intent intent) {
        return mBinder;
    }

    @Override
    public void onRebind(Intent intent) {
        super.onRebind(intent);
    }

    @Override
    public boolean onUnbind(Intent intent) {
        return true; // Ensures onRebind() is called when a client re-binds.
    }

    @Override
    public void onDestroy() {
        mServiceHandler.removeCallbacksAndMessages(null);
    }

    /**
     * Makes a request for location updates. Note that in this sample we merely log the
     * {@link SecurityException}.
     */
    public void requestLocationUpdates() {

//        if(!canGetLocation() || isUpdateStarted)
//            return;

        Log.i(TAG, "Requesting location updates");
        startService(new Intent(getApplicationContext(), LocationUpdatesService.class));

        try {
            /*            activityDetection.requestActivityUpdates();*/
            smartLocationManager.location(fallbackLocationProvider).start(this);
            geofencingProvider.addGeofences(geofenceModelList);
            //geofencingProvider.start(this);



            isUpdateStarted = true;

        } catch (SecurityException unlikely) {
            //setRequestingLocationUpdates(this, false);
            isUpdateStarted = false;
            Log.e(TAG, "Lost location permission. Could not request updates. " + unlikely);
        }

    }

    public static String getLocationText(Location location) {
        return location == null ? defaultLocation.getLatitude() + "," + defaultLocation.getLongitude() :
                location.getLatitude() + ", " + location.getLongitude();
    }

    /**
     * Removes location updates. Note that in this sample we merely log the
     * {@link SecurityException}.
     */
    public void removeLocationUpdates() {
        Log.i(TAG, "Removing location updates");
        try {
            SmartLocationManager.with(this).location(fallbackLocationProvider).stop();
            SmartLocationManager.with(this).geofencing(geofencingProvider).stop();

            mNotificationManager.cancelAll();
            fallbackLocationProvider = null;
            geofenceModelList = null;
            smartLocationManager = null;
            /*            activityDetection.stop();*/
            isNewProvder = true;
            //  Utils.setRequestingLocationUpdates(this, false);
            stopSelf();
        } catch (SecurityException unlikely) {
            // Utils.setRequestingLocationUpdates(this, true);
            Log.e(TAG, "Lost location permission. Could not remove updates. " + unlikely);
        }
    }

    @Override
    public void onLocationUpdated(Location newLocation) {

        if (newLocation == null)
            return;

        if (newLocation.getProvider().equals("None")) {
            return;
        }

        String _latitude = String.valueOf(newLocation.getLatitude());
        String _longitude = String.valueOf(newLocation.getLongitude());

        if (_latitude.equalsIgnoreCase("0.0") && _longitude.equalsIgnoreCase("0.0")) {
            return;
        }

        ActivityManager am = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
        ComponentName cn = am.getRunningTasks(1).get(0).topActivity;
        String name = cn.getShortClassName();
        name = name.replace(".", "");
        if (onLocationUpdateCallbacks.containsKey(name)) {
            Objects.requireNonNull(onLocationUpdateCallbacks.get(name)).onLocationUpdated(newLocation);

            mLastLocation = newLocation;
/*            //For testing purpose only
            {
                String data = null;
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                    data = newLocation.getLatitude() + "," + newLocation.getLongitude() + "," + newLocation.getProvider() + "," + newLocation.getAccuracy() + "," +
                            java.text.DateFormat.getDateTimeInstance().format(Calendar.getInstance().getTime()) + "\n";
                }
                logGPSData(data);
            }*/

            Globals.lastKnownLocation = newLocation;

            if (isGpsLoggingEnabled) {
                Globals.addEmployeeLogData(mContext, new Date(), newLocation);
            }
        }

    }

    private void logGPSData(String text){
        if(stream == null) {
            String path = Utilities.getDocumentPath("GPSLogger.txt");
            try {
                stream = new FileOutputStream(path,true);
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            }
        }


        try {
            stream.write(text.getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

/*    private String getTransitionNameFromType(int transitionType) {
        switch (transitionType) {
            case Geofence.GEOFENCE_TRANSITION_ENTER:
                return "ENTER";
            case Geofence.GEOFENCE_TRANSITION_EXIT:
                return "EXIT";
            default:
                return "DWELL";
        }
    }*/

    @Override
    public void onGeofenceTransition(@NonNull TransitionGeofence geofence) {

        //  List<GeofenceModel> transitiions =  geofence.getGeofenceModels();
        String fenceID = geofence.getGeofenceID();
        int geofenceTransition = geofence.getTransitionType();
        String msg = "";
        //   for (final GeofenceModel model : transitiions) {

        if (geofenceTransition == Geofence.GEOFENCE_TRANSITION_ENTER ||
                geofenceTransition == Geofence.GEOFENCE_TRANSITION_EXIT ||
                geofenceTransition == Geofence.GEOFENCE_TRANSITION_DWELL) {

//            msg = msg + "Fence ID : " +
//                    fenceID + " " +
//                    getTransitionNameFromType(geofenceTransition);

            //Toast.makeText(this, msg, Toast.LENGTH_LONG).show();
            // sendGeoFenceNotification(msg);
        }
    }

/*
    @Override
    public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, String key) {
        // Update the buttons state depending on whether location updates are being requested.
        if (key.equals("LMP")) {
            long lat = sharedPreferences.getLong("LATITUDE", 0);
            long lon = sharedPreferences.getLong("LONGITUDE", 0);

        }
    }
*/

    /**
     * Class used for the client Binder.  Since this service runs in the same process as its
     * clients, we don't need to deal with IPC.
     */
    public class LocalBinder extends Binder {
        public LocationUpdatesService getService() {
            return LocationUpdatesService.this;
        }
    }

//    /**
//     * Returns true if this is a foreground service.
//     *
//     * @param context The {@link Context}.
//     */
//    public boolean serviceIsRunningInForeground(Context context) {
//        ActivityManager manager = (ActivityManager) context.getSystemService(
//                Context.ACTIVITY_SERVICE);
//        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(
//                Integer.MAX_VALUE)) {
//            if (getClass().getName().equals(service.service.getClassName())) {
//                if (service.foreground) {
//                    return true;
//                }
//            }
//        }
//        return false;
//    }

/*    @Override
    public void OnActivityCallback(int type, int confidence) {
        lastActivityType = type;
        if(!isLocationLocked) {
            return;
        }

        String label;

        switch (type) {
            case DetectedActivity.IN_VEHICLE: {
                label = mContext.getString(R.string.activity_in_vehicle);
                LocationUpdatesService.smartLocationManager.location(LocationUpdatesService.fallbackLocationProvider)
                        .restart(LocationUpdatesService.this, LocationParams.NAVIGATION);

                Toast.makeText(this,
                        "DEVICE MODE: " + label + "\n FETCHING LOCATION IN HIGH POWER MODE",
                        Toast.LENGTH_LONG)
                        .show();
                break;
            }

            case DetectedActivity.WALKING: {
                label = mContext.getString(R.string.activity_on_foot);
                LocationUpdatesService.smartLocationManager.location(LocationUpdatesService.fallbackLocationProvider)
                        .restart(LocationUpdatesService.this, LocationParams.BEST_EFFORT);

                Toast.makeText(this,
                        "DEVICE MODE: " + label + "\n FETCHING LOCATION IN MEDIUM POWER MODE",
                        Toast.LENGTH_LONG)
                        .show();

                break;
            }

            case DetectedActivity.STILL: {
                label = mContext.getString(R.string.activity_still);
                LocationUpdatesService.smartLocationManager.location(LocationUpdatesService.fallbackLocationProvider)
                        .restart(LocationUpdatesService.this, LocationParams.LAZY);

                Toast.makeText(this,
                        "DEVICE MODE: " + label + "\n FETCHING LOCATION IN LOW POWER MODE",
                        Toast.LENGTH_LONG)
                        .show();

                break;
            }
        }
    }*/
}