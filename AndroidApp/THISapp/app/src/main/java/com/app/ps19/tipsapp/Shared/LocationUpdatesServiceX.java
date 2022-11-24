///**
// * Copyright 2017 Google Inc. All Rights Reserved.
// *
// * Licensed under the Apache License, Version 2.0 (the "License");
// * you may not use this file except in compliance with the License.
// * You may obtain a copy of the License at
// *
// * http://www.apache.org/licenses/LICENSE-2.0
// *
// * Unless required by applicable law or agreed to in writing, software
// * distributed under the License is distributed on an "AS IS" BASIS,
// * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// * See the License for the specific language governing permissions and
// * limitations under the License.
// */
//
//package com.app.ps19.tipsapp.Shared;
//
//import android.app.ActivityManager;
//import android.app.Notification;
//import android.app.NotificationChannel;
//import android.app.NotificationManager;
//import android.app.PendingIntent;
//import android.app.Service;
//import android.content.Context;
//import android.content.Intent;
//import android.content.res.Configuration;
//import android.location.Location;
//import android.os.Binder;
//import android.os.Build;
//import android.os.Handler;
//import android.os.HandlerThread;
//import android.os.IBinder;
//import android.os.Looper;
//import androidx.annotation.NonNull;
//import androidx.core.app.NotificationCompat;
//import androidx.localbroadcastmanager.content.LocalBroadcastManager;
//import android.util.Log;
//
//import com.app.ps19.tipsapp.MainActivity;
//import com.app.ps19.tipsapp.R;
//
//import com.google.android.gms.location.FusedLocationProviderClient;
//import com.google.android.gms.location.LocationCallback;
//import com.google.android.gms.location.LocationRequest;
//import com.google.android.gms.location.LocationResult;
//import com.google.android.gms.location.LocationServices;
//import com.google.android.gms.tasks.OnCompleteListener;
//import com.google.android.gms.tasks.Task;
//
//import java.util.Date;
//
////import androidx.annotation.NonNull;
////import androidx.core.app.NotificationCompat;
////import androidx.localbroadcastmanager.content.LocalBroadcastManager;
//
///**
// * A bound and started service that is promoted to a foreground service when location updates have
// * been requested and all clients unbind.
// *
// * For apps running in the background on "O" devices, location is computed only once every 10
// * minutes and delivered batched every 30 minutes. This restriction applies even to apps
// * targeting "N" or lower which are run on "O" devices.
// *
// * This sample show how to use a long-running service for location updates. When an activity is
// * bound to this service, frequent location updates are permitted. When the activity is removed
// * from the foreground, the service promotes itself to a foreground service, and location updates
// * continue. When the activity comes back to the foreground, the foreground service stops, and the
// * notification assocaited with that service is removed.
// */
//public class LocationUpdatesServiceX extends Service {
//    private static final int TWO_MINUTES = 1000 * 60 * 2;
//
//    private static final String PACKAGE_NAME =
//            "com.google.android.gms.location.sample.locationupdatesforegroundservice";
//
//    private static final String TAG = "resPOINT";
//
//    private Context context;
//    /**
//     * The name of the channel for notifications.
//     */
//    private static final String CHANNEL_ID = "channel_01";
//
//    public static final String ACTION_BROADCAST = PACKAGE_NAME + ".broadcast";
//
//    //public static final String EXTRA_LOCATION = PACKAGE_NAME + ".location";
//    private static final String EXTRA_STARTED_FROM_NOTIFICATION = PACKAGE_NAME +
//            ".started_from_notification";
//
//    private final IBinder mBinder = new LocalBinder();
//
//    /**
//     * The desired interval for location updates. Inexact. Updates may be more or less frequent.
//     */
//    private static final long UPDATE_INTERVAL_IN_MILLISECONDS = 0;
//
//    /**
//     * The fastest rate for active location updates. Updates will never be more frequent
//     * than this value.
//     */
//    private static final long FASTEST_UPDATE_INTERVAL_IN_MILLISECONDS =0;
//            //UPDATE_INTERVAL_IN_MILLISECONDS / 2;
//
//    /**
//     * The identifier for the notification displayed for the foreground service.
//     */
//    private static final int NOTIFICATION_ID = 12345678;
//
//    /**
//     * Used to check whether the bound activity has really gone away and not unbound as part of an
//     * orientation change. We create a foreground service notification only if the former takes
//     * place.
//     */
//    private boolean mChangingConfiguration = false;
//
//    private NotificationManager mNotificationManager;
//
//    /**
//     * Contains parameters used by {@link com.google.android.gms.location.FusedLocationProviderApi}.
//     */
//    private LocationRequest mLocationRequest;
//
//    /**
//     * Provides access to the Fused Location Provider API.
//     */
//    private FusedLocationProviderClient mFusedLocationClient;
//
//    /**
//     * Callback for changes in location.
//     */
//    private LocationCallback mLocationCallback;
//
//    private Handler mServiceHandler;
//
//    Double latitude, longitude;
//
//    /**
//     * The current location.
//     */
//    private Location mLocation;
//    private Location previousBestLocation = null;
//
//
//    private Boolean isGpsLoggingEnabled;
//    /**
//     * Realtime location save in firestore or firebase*/
//  /*  GeoFire geoFire;
//    FirebaseFirestore firebaseFirestore;
//    DocumentReference documentReference;
//    FirebaseAuth firebaseAuth;*/
//
//    public LocationUpdatesServiceX() {
//    }
//
//    @Override
//    public void onCreate() {
//
//        mFusedLocationClient = LocationServices.getFusedLocationProviderClient(this);
//
//        mLocationCallback = new LocationCallback() {
//            @Override
//            public void onLocationResult(LocationResult locationResult) {
//                super.onLocationResult(locationResult);
//                onNewLocation(locationResult.getLastLocation());
//            }
//        };
//
//        isGpsLoggingEnabled = false;
//        context = this;
//        createLocationRequest();
//        getLastLocation();
//
//        HandlerThread handlerThread = new HandlerThread(TAG);
//        handlerThread.start();
//        mServiceHandler = new Handler(handlerThread.getLooper());
//        mNotificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
//
//        // Android O requires a Notification Channel.
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//            CharSequence name = getString(R.string.app_name);
//            // Create the channel for the notification
//            NotificationChannel mChannel =
//                    new NotificationChannel(CHANNEL_ID, name, NotificationManager.IMPORTANCE_DEFAULT);
//
//            // Set the Notification Channel for the Notification Manager.
//            mNotificationManager.createNotificationChannel(mChannel);
//        }
//    }
//
//
//
//    @Override
//    public int onStartCommand(Intent intent, int flags, int startId) {
//        Log.i(TAG, "Service started");
//        boolean startedFromNotification = intent.getBooleanExtra(EXTRA_STARTED_FROM_NOTIFICATION,
//                false);
//
//        // We got here because the user decided to remove location updates from the notification.
//        if (startedFromNotification) {
//            removeLocationUpdates();
//            stopSelf();
//        }
//        // Tells the system to not try to recreate the service after it has been killed.
//        return START_NOT_STICKY;
//    }
//
//
//    @Override
//    public void onConfigurationChanged(Configuration newConfig) {
//        super.onConfigurationChanged(newConfig);
//        mChangingConfiguration = true;
//    }
//
//
//    @Override
//    public IBinder onBind(Intent intent) {
//        // Called when a client (MainActivity in case of this sample) comes to the foreground
//        // and binds with this service. The service should cease to be a foreground service
//        // when that happens.
//        Log.i(TAG, "in onBind()");
//        stopForeground(true);
//        mChangingConfiguration = false;
//
//        // Register Firestore when service will restart
//       /* firebaseAuth = FirebaseAuth.getInstance();
//        firebaseFirestore = FirebaseFirestore.getInstance();*/
//        return mBinder;
//    }
//
//
//    @Override
//    public void onRebind(Intent intent) {
//        // Called when a client (MainActivity in case of this sample) returns to the foreground
//        // and binds once again with this service. The service should cease to be a foreground
//        // service when that happens.
//        Log.i(TAG, "in onRebind()");
//        stopForeground(true);
//        mChangingConfiguration = false;
//
//        // Register Firestore when service will restart
//      /*  firebaseAuth = FirebaseAuth.getInstance();
//        firebaseFirestore = FirebaseFirestore.getInstance();*/
//        super.onRebind(intent);
//    }
//
//
//    @Override
//    public boolean onUnbind(Intent intent) {
//        Log.i(TAG, "Last client unbound from service");
//
//        // Called when the last client (MainActivity in case of this sample) unbinds from this
//        // service. If this method is called due to a configuration change in MainActivity, we
//        // do nothing. Otherwise, we make this service a foreground service.
//        if (!mChangingConfiguration && Utils.requestingLocationUpdates(this)) {
//            Log.d(TAG, "Starting foreground service");
//            /*
//            // TODO(developer). If targeting O, use the following code.
//            if (Build.VERSION.SDK_INT == Build.VERSION_CODES.O) {
//                mNotificationManager.startServiceInForeground(new Intent(this,
//                        LocationUpdatesService.class), NOTIFICATION_ID, getNotification());
//            } else {
//                startForeground(NOTIFICATION_ID, getNotification());
//            }
//             */
//
//            //startForeground(NOTIFICATION_ID, getNotification());
//
//
//        }
//        return true; // Ensures onRebind() is called when a client re-binds.
//    }
//
//
//    @Override
//    public void onDestroy() {
//        mServiceHandler.removeCallbacksAndMessages(null);
//    }
//
//    /**
//     * Makes a request for location updates. Note that in this sample we merely log the
//     * {@link SecurityException}.
//     */
//    public void requestLocationUpdates() {
//        Log.i(TAG, "Requesting location updates");
//        Utils.setRequestingLocationUpdates(this, true);
//        startService(new Intent(getApplicationContext(), LocationUpdatesService.class));
//        try {
//            mFusedLocationClient.requestLocationUpdates(mLocationRequest,
//                    mLocationCallback, Looper.myLooper());
//        } catch (SecurityException unlikely) {
//            Utils.setRequestingLocationUpdates(this, false);
//            Log.d(TAG, "Lost location permission. Could not request updates. " + unlikely);
//        }
//    }
//
//    /**
//     * Removes location updates. Note that in this sample we merely log the
//     * {@link SecurityException}.
//     */
//    public void removeLocationUpdates() {
//        Log.i(TAG, "Removing location updates");
//        try {
//            mFusedLocationClient.removeLocationUpdates(mLocationCallback);
//            Utils.setRequestingLocationUpdates(this, false);
//            stopSelf();
//        } catch (SecurityException unlikely) {
//            Utils.setRequestingLocationUpdates(this, true);
//            Log.d(TAG, "Lost location permission. Could not remove updates. " + unlikely);
//        }
//    }
//
//    /**
//     * Returns the {@link NotificationCompat} used as part of the foreground service.
//     */
//    private Notification getNotification() {
//        Intent intent = new Intent(this, LocationUpdatesService.class);
//
//        CharSequence text = Utils.getLocationText(mLocation);
//
//        // Extra to help us figure out if we arrived in onStartCommand via the notification or not.
//        intent.putExtra(EXTRA_STARTED_FROM_NOTIFICATION, true);
//
//        // The PendingIntent that leads to a call to onStartCommand() in this service.
//        PendingIntent servicePendingIntent = PendingIntent.getService(this, 0, intent,
//                PendingIntent.FLAG_UPDATE_CURRENT);
//
//        // The PendingIntent to launch activity.
//        PendingIntent activityPendingIntent = PendingIntent.getActivity(this, 0,
//                new Intent(this, MainActivity.class), 0);
//
//        NotificationCompat.Builder builder = new NotificationCompat.Builder(this)
//                .addAction(R.drawable.ic_launch, getString(R.string.launch_activity),
//                        activityPendingIntent)
//                .addAction(R.drawable.ic_cancel, getString(R.string.remove_location_updates),
//                        servicePendingIntent)
//                .setContentText(text)
//                .setContentTitle(Utils.getLocationTitle(this))
//                .setOngoing(true)
//                .setPriority(Notification.PRIORITY_HIGH)
//                .setSmallIcon(R.mipmap.ic_launcher)
//                .setTicker(text)
//                .setWhen(System.currentTimeMillis());
//
////        // Set the Channel ID for Android O.
////        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
////            builder.setChannelId(CHANNEL_ID); // Channel ID
////        }
//
//        return builder.build();
//    }
//
//    private void getLastLocation() {
//        try {
//            mFusedLocationClient.getLastLocation()
//                    .addOnCompleteListener(new OnCompleteListener<Location>() {
//                        @Override
//                        public void onComplete(@NonNull Task<Location> task) {
//                            if (task.isSuccessful() && task.getResult() != null) {
//                                mLocation = task.getResult();
//                            } else {
//                                Log.w(TAG, "Failed to get location.");
//                            }
//                        }
//                    });
//        } catch (SecurityException unlikely) {
//            Log.d(TAG, "Lost location permission." + unlikely);
//        }
//    }
//
//    private void onNewLocation(Location location) {
//        Log.d(TAG, "New location: " + location);
//        if(isBetterLocation(location, previousBestLocation)) {
//
//            mLocation = location;
//
//            //Logging GPS location
//            String _latitude = String.valueOf(location.getLatitude());
//            String _longitude = String.valueOf(location.getLongitude());
//
//                if (_latitude.equalsIgnoreCase("0.0") && _longitude.equalsIgnoreCase("0.0")) {
//                    //requestLocationUpdate();
//                } else {
//                    Log.e(TAG, "Latitude : " + location.getLatitude() + "\tLongitude : " + location.getLongitude());
//                    if(isGpsLoggingEnabled){
//                        Globals.addEmployeeLogData(context ,new Date(),location);
//                    }
//                    //generateNoteOnSD(context, "locationsLog.txt", "Date Time: " + new Date() + ",   " + "Latitude : " + loc.getLatitude() + ',' + "   " + "Longitude : " + loc.getLongitude() + "\n");
//                    // pref.putString("Location", String.valueOf(location.getLatitude()) + ',' + String.valueOf(location.getLongitude()));
//                }
//
//            // Notify anyone listening for broadcasts about the new location.
//            if(previousBestLocation != null){
//                if(previousBestLocation.distanceTo(location) > 0.1){
//                    Intent intent = new Intent(ACTION_BROADCAST);
//                    intent.putExtra(EXTRA_LOCATION, location);
//                    LocalBroadcastManager.getInstance(getApplicationContext()).sendBroadcast(intent);
//                    Globals.lastKnownLocation = location;
//                }
//            } else {
//                Intent intent = new Intent(ACTION_BROADCAST);
//                intent.putExtra(EXTRA_LOCATION, location);
//                LocalBroadcastManager.getInstance(getApplicationContext()).sendBroadcast(intent);
//                Globals.lastKnownLocation = location;
//            }
//
//
//            // Update notification content if running as a foreground service.
//            if (serviceIsRunningInForeground(this)) {
//                //mNotificationManager.notify(NOTIFICATION_ID, getNotification());
//
//                // Getting location when notification was call.
//                latitude = location.getLatitude();
//                longitude = location.getLongitude();
//
//                // Here using to call Save to serverMethod
//                //SavetoServer();
//
//            }
//            previousBestLocation = location;
//        } else {
//            Log.d(TAG, "New location ignored as it's not a better one: " + location);
//        }
//
//    }
//
//    /**
//     * Sets the location request parameters.
//     */
//    private void createLocationRequest() {
//        mLocationRequest = new LocationRequest();
//        mLocationRequest.setInterval(UPDATE_INTERVAL_IN_MILLISECONDS);
//        mLocationRequest.setSmallestDisplacement(1);
//        //mLocationRequest.setFastestInterval(FASTEST_UPDATE_INTERVAL_IN_MILLISECONDS);
//        mLocationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
//    }
//
//    /**
//     * Class used for the client Binder.  Since this service runs in the same process as its
//     * clients, we don't need to deal with IPC.
//     */
//    public class LocalBinder extends Binder {
//        public LocationUpdatesServiceX getService() {
//            return LocationUpdatesServiceX.this;
//        }
//    }
//
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
//
//
//    /**
//     * Save a value in realtime to firestore when user in background
//     * For foreground you have to call same method to activity
//     * */
///*
//    private void SavetoServer(){
//        Toast.makeText(this, "Save to server", Toast.LENGTH_SHORT).show();
//        Log.d("resMM", "Send to server");
//        Log.d("resML", String.valueOf(latitude));
//        Log.d("resMLL", String.valueOf(longitude));
//
//        Map<String , String> driverMap = new HashMap<>();
//
//        driverMap.put("name" , String.valueOf(latitude));
//        driverMap.put("email" , String.valueOf(longitude));
//
//        documentReference = firebaseFirestore
//                .collection("driverAvaliable")
//                .document("newdriver");
//
//        documentReference.update("latitude", String.valueOf(latitude),
//                                    "longitude", String.valueOf(longitude),
//                                    "timeStamp", FieldValue.serverTimestamp())
//                .addOnSuccessListener(new OnSuccessListener<Void>() {
//                    @Override
//                    public void onSuccess(Void aVoid) {
//                        Log.d(TAG, "DocumentSnapshot successfully updated!");
//                    }
//                }).addOnFailureListener(new OnFailureListener() {
//            @Override
//            public void onFailure(@NonNull Exception e) {
//                Log.d(TAG, "Error updating document", e);
//            }
//        });
//    }*/
//    protected boolean isBetterLocation(Location location, Location currentBestLocation) {
//        if (currentBestLocation == null) {
//            // A new location is always better than no location
//            return true;
//        }
//
//        // Check whether the new location fix is newer or older
//        long timeDelta = location.getTime() - currentBestLocation.getTime();
//        boolean isSignificantlyNewer = timeDelta > TWO_MINUTES;
//        boolean isSignificantlyOlder = timeDelta < -TWO_MINUTES;
//        boolean isNewer = timeDelta > 0;
//
//        // If it's been more than two minutes since the current location, use the new location
//        // because the user has likely moved
//        if (isSignificantlyNewer) {
//            return true;
//            // If the new location is more than two minutes older, it must be worse
//        } else if (isSignificantlyOlder) {
//            return false;
//        }
//
//        // Check whether the new location fix is more or less accurate
//        int accuracyDelta = (int) (location.getAccuracy() - currentBestLocation.getAccuracy());
//        boolean isLessAccurate = accuracyDelta > 0;
//        boolean isMoreAccurate = accuracyDelta < 0;
//        boolean isSignificantlyLessAccurate = accuracyDelta > 200;
//
//        // Check if the old and new location are from the same provider
//        boolean isFromSameProvider = isSameProvider(location.getProvider(),
//                currentBestLocation.getProvider());
//
//        // Determine location quality using a combination of timeliness and accuracy
//        if (isMoreAccurate) {
//            return true;
//        } else if (isNewer && !isLessAccurate) {
//            return true;
//        } else if (isNewer && !isSignificantlyLessAccurate && isFromSameProvider) {
//            return true;
//        }
//        return false;
//    }
//    /** Checks whether two providers are the same */
//    private boolean isSameProvider(String provider1, String provider2) {
//        if (provider1 == null) {
//            return provider2 == null;
//        }
//        return provider1.equals(provider2);
//    }
//}
