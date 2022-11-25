package com.app.ps19.scimapp.location.providers;

import android.content.Context;
import android.location.Location;

import com.app.ps19.scimapp.location.Interface.LocationProvider;
import com.app.ps19.scimapp.location.Interface.OnLocationUpdatedListener;
import com.app.ps19.scimapp.location.config.LocationAccuracy;
import com.app.ps19.scimapp.location.config.LocationParams;

import org.jetbrains.annotations.NotNull;


public class MultiFallbackProvider implements LocationProvider {

    private final LocationManagerProvider gpsLocation = new LocationManagerProvider();
    private final LocationManagerProvider networkLocation = new LocationManagerProvider();
    private final LocationManagerProvider passiveLocation= new LocationManagerProvider();
    private final LocationManagerProvider fusedLocation = new LocationManagerProvider();

    private boolean isRunning;
    public MultiFallbackProvider() {
        isRunning = false;
    }

    @Override
    public void init(Context context, ProviderType type) {
        if (!this.isRunning){
            switch (type){
                case NETWORK:
                    networkLocation.init(context, ProviderType.NETWORK);
                    break;
                case GPS:
                    gpsLocation.init(context, ProviderType.GPS);
                    break;
                case FusedLocation:
                    fusedLocation.init(context, ProviderType.FusedLocation);
                    break;
                case Passive:
                    passiveLocation.init(context, ProviderType.Passive);
                    break;
                case ALL:
                    gpsLocation.init(context, ProviderType.GPS);
                    networkLocation.init(context, ProviderType.NETWORK);
                    passiveLocation.init(context, ProviderType.Passive);
                    fusedLocation.init(context, ProviderType.FusedLocation);
                    break;

                default:
                    break;
            }
        }
    }

    public void start(OnLocationUpdatedListener listener, LocationParams params, boolean singleUpdate) {
        if (!this.isRunning) {
            fusedLocation.start(listener, params, singleUpdate);
            passiveLocation.start(listener, params, singleUpdate);
            networkLocation.start(listener, params, singleUpdate);
            gpsLocation.start(listener, params, singleUpdate);
            this.isRunning = true;
        }
    }

    public void stop() {
        if (isRunning) {
            gpsLocation.stop();
            networkLocation.stop();
            passiveLocation.stop();
            fusedLocation.stop();

            isRunning = false;
        }
    }

    @Override
    public void restart(OnLocationUpdatedListener listener, LocationParams params) {
        stop();
        if(params.getAccuracy() == LocationAccuracy.LOW ||
                params.getAccuracy() == LocationAccuracy.LOWEST){
            gpsLocation.restart(listener ,params);
        }
        else if (params.getAccuracy() == LocationAccuracy.MEDIUM){
            gpsLocation.restart(listener ,params);
            networkLocation.restart(listener ,params);
        }
        else if (params.getAccuracy() == LocationAccuracy.HIGH){
            gpsLocation.restart(listener ,params);
            fusedLocation.restart(listener ,params);
            passiveLocation.restart(listener ,params);
            networkLocation.restart(listener ,params);
        }

        this.isRunning = true;
    }

//    public void restart() {
//        fusedLocation.restart(MultiFallbackProvider.listener ,MultiFallbackProvider.mParams);
//        passiveLocation.restart(MultiFallbackProvider.listener ,MultiFallbackProvider.mParams);
//        networkLocation.restart(MultiFallbackProvider.listener ,MultiFallbackProvider.mParams);
//        gpsLocation.restart(MultiFallbackProvider.listener ,MultiFallbackProvider.mParams);
//        this.isRunning = true;
//    }

    @Override
    public boolean canGetLocation() {
        Boolean ret = fusedLocation.canGetLocation();
        if (!ret) {
            ret = gpsLocation.canGetLocation();
        }
        if (!ret) {
            ret = networkLocation.canGetLocation();
        }
        if (!ret) {
            ret = passiveLocation.canGetLocation();
        }
        return ret;
    }

    @NotNull
    public Location getLastLocation()
    {
        Location ret = fusedLocation.getLastLocation();
        if (ret == null) {
            ret = gpsLocation.getLastLocation();
        }
        if (ret == null) {
            ret = networkLocation.getLastLocation();
        }
        if (ret == null) {
            ret = passiveLocation.getLastLocation();
        }
        return ret;
    }

    @NotNull
    public Location getLocation()
    {
        Location ret = fusedLocation.getLocation();
        if (ret == null) {
            ret = gpsLocation.getLocation();
        }
        if (ret == null) {
            ret = networkLocation.getLocation();
        }
        if (ret == null) {
            ret = passiveLocation.getLocation();
        }
        return ret;
    }

    public static class Builder {

        private final MultiFallbackProvider builtProvider;

        public Builder() {
            this.builtProvider = new MultiFallbackProvider();
        }

        public MultiFallbackProvider build() {
            return builtProvider;
        }
    }
}
