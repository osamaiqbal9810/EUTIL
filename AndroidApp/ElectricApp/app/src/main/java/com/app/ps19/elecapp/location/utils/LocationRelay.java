package com.app.ps19.elecapp.location.utils;

import android.location.Location;
import android.util.Log;

public class LocationRelay {

    static final String TAG = LocationRelay.class.getSimpleName();

    private static final float LOCATION_ACCURACY_THRESHOLD = 7.0f;
    private static final float JUMP_FACTOR = 4.0f;
    private static final int MIN_MINUTES = 1000 * 10;
    private static boolean isFirstUpdate = true;
    private static boolean isLocModePrecise = true;

//    private int lessSpeedCount = 0;

    public static String getLatLongFromLocation(final Location location) {
        return Location.convert(location.getLatitude(), Location.FORMAT_DEGREES) + " " +
                Location.convert(location.getLongitude(), Location.FORMAT_DEGREES);
    }

    private void setLocationMode(boolean mode){
        isLocModePrecise = mode;
    }

    private Location mLastBestKnownLocation;
    private float mTotalSpeed = 0;
    private int mSpeedReadings = 0;

    public Location getLastLocation() {
        return mLastBestKnownLocation;
    }

    public void onStart() {
        mTotalSpeed = 0;
        mSpeedReadings = 0;
        mLastBestKnownLocation = null;
    }

    public static double getHeadingFromCoordinates(Location fromLoc, Location toLoc) {
        double fLat = Math.toRadians(fromLoc.getLatitude());
        double fLng = Math.toRadians(fromLoc.getLongitude());
        double tLat = Math.toRadians(toLoc.getLatitude());
        double tLng = Math.toRadians(toLoc.getLongitude());

        double degree = Math.toDegrees(Math.atan2(
                Math.sin(tLng - fLng) * Math.cos(tLat),
                Math.cos(fLat) * Math.sin(tLat) - Math.sin(fLat) * Math.cos(tLat)
                        * Math.cos(tLng - fLng)));

        return warpToPositiveAngle(degree);
    }

    public static double warpToPositiveAngle(double degree) {
        if (degree >= 0) {
            return degree;
        } else {
            return 360 + degree;
        }
    }

    public Location getAccurateLocation(Location newLocation) {

        if (newLocation == null)
            return null;

        if (isFirstUpdate || mLastBestKnownLocation == null)
        {
            isFirstUpdate = false;
            mLastBestKnownLocation = newLocation;
            return  mLastBestKnownLocation;
        }

        // If location has no bearing, set one based on its heading from the
        // previous location (or 0 if no previous location).
        if (!newLocation.hasBearing()) {
            if (mLastBestKnownLocation != null) {
                newLocation.setBearing((float) getHeadingFromCoordinates(mLastBestKnownLocation, newLocation));
            } else {
                newLocation.setBearing(0);
            }
        }

        final boolean ok = (newLocation.hasAccuracy() && newLocation.hasBearing() && newLocation.getTime() > 0);
        if (ok) {
            boolean isAccurate = false;
            if (mLastBestKnownLocation != null) {

                double distance = mLastBestKnownLocation.distanceTo(newLocation);
                if (distance > 0.1 && newLocation.hasSpeed()) {
                    isAccurate = isLocationAccurate(newLocation.getAccuracy(), newLocation.getSpeed());
                }

                if (isAccurate) {
                    mLastBestKnownLocation = getBetterLocation(newLocation, mLastBestKnownLocation);
                }
                else if (newLocation.getAccuracy() < mLastBestKnownLocation.getAccuracy()) {//new location more accurate
                    mLastBestKnownLocation = newLocation;
                }
            }
        }
        else {
          //  Log.w(TAG, "toLocalLocation(): Location needs accuracy, bearing, and time.");
        }

        return mLastBestKnownLocation;
    }
    private boolean isLocationAccurate(float accuracy, double currentSpeed) {

        if (accuracy >= LOCATION_ACCURACY_THRESHOLD) {
            return false;
        }

        mTotalSpeed += currentSpeed;
        float avg = (mTotalSpeed / ++mSpeedReadings);

        if (mSpeedReadings == 2) {
            mTotalSpeed = 0;
            mSpeedReadings = 0;
        }

        // If moving:
        if (currentSpeed > 0 && currentSpeed >= (avg * JUMP_FACTOR)) {
            Log.w(TAG, "isLocationAccurate() -- JUMP Factor Exceeded " + currentSpeed);
            return false;
        }


        return true;
    }

    /**
     * Determines whether one Location reading is better than the current Location fix
     *
     * @param newlocation            The new Location that you want to evaluate
     * @param currentBestLocation The current Location fix, to which you want to compare the new one
     */
    protected Location getBetterLocation(Location newlocation, Location currentBestLocation) {
        if (currentBestLocation == null) {
            // A new location is always better than no location
            return newlocation;
        }

        // Check whether the new location fix is newer or older
        long timeDelta = newlocation.getTime() - currentBestLocation.getTime();
        boolean isSignificantlyNewer = timeDelta > MIN_MINUTES;
        boolean isSignificantlyOlder = timeDelta < -MIN_MINUTES;


        if (newlocation.getAccuracy() < LOCATION_ACCURACY_THRESHOLD) {// new location accurate

            if (newlocation.getAccuracy() < currentBestLocation.getAccuracy()) {// new location is more accurate than previous location
                return newlocation;
            }
            if (isSignificantlyNewer) {
                return newlocation;
            } else{
                return currentBestLocation;
            }

        } else {
            if (isSignificantlyNewer) {
                return newlocation;
            } else {
                return currentBestLocation;
            }
        }
//

//
//        // Check whether the new location fix is more or less accurate
//        int accuracyDelta = (int) (newlocation.getAccuracy() - currentBestLocation.getAccuracy());
//        boolean isLessAccurate = accuracyDelta > 0;
//        boolean isMoreAccurate = accuracyDelta < 0;
//        boolean isSignificantlyLessAccurate = accuracyDelta > 200;
//
//        // Check if the old and new location are from the same provider
//        boolean isFromSameProvider = isSameProvider(newlocation.getProvider(),
//                currentBestLocation.getProvider());
//
//        // Determine location quality using a combination of timeliness and accuracy
//        if (isMoreAccurate) {
//            return newlocation;
//        } else if (isNewer && !isLessAccurate) {
//            return newlocation;
//        } else if (isNewer && !isSignificantlyLessAccurate && isFromSameProvider) {
//            return newlocation;
//        }
//
//
//        return currentBestLocation;
    }

    private boolean isSameProvider(String provider1, String provider2) {
        if (provider1 == null) {
            return provider2 == null;
        }
        return provider1.equals(provider2);
    }
}