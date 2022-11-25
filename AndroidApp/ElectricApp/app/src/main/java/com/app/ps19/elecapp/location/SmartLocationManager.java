package com.app.ps19.elecapp.location;

import android.content.Context;
import android.location.Location;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.app.ps19.elecapp.geofencing.Interface.IGeofencingProvider;
import com.app.ps19.elecapp.geofencing.Interface.OnGeofencingTransitionListener;
import com.app.ps19.elecapp.geofencing.model.GeofenceModel;
import com.app.ps19.elecapp.location.Interface.LocationProvider;
import com.app.ps19.elecapp.location.Interface.OnLocationUpdatedListener;
import com.app.ps19.elecapp.location.config.LocationParams;
import com.app.ps19.elecapp.location.providers.ProviderType;
import com.app.ps19.elecapp.location.utils.LocationState;

import java.util.List;
import java.util.Map;
import java.util.WeakHashMap;

public class SmartLocationManager {

    private final Context context;
    private final boolean preInitialize;

    private SmartLocationManager(Context context, boolean preInitialize) {
        this.context = context;
        this.preInitialize = preInitialize;
    }

    public static SmartLocationManager with(Context context) {
        return new Builder(context).build();
    }

    public LocationControl location(LocationProvider provider) {
        return new LocationControl(this, provider);
    }

    public GeofencingControl geofencing(IGeofencingProvider geofencingProvider) {
        return new GeofencingControl(this, geofencingProvider);
    }

    public static class Builder {
        private final Context context;
        private boolean preInitialize;

        public Builder(@NonNull Context context) {
            this.context = context;
            this.preInitialize = true;
        }

        public Builder preInitialize(boolean enabled) {
            this.preInitialize = enabled;
            return this;
        }

        public SmartLocationManager build() {
            return new SmartLocationManager(context, preInitialize);
        }

    }

    public static class LocationControl {

        private static final Map<Context, LocationProvider> MAPPING = new WeakHashMap<>();

        private final SmartLocationManager smartLocationManager;
        private static LocationParams params = null;
        private final LocationProvider provider;
        private boolean oneFix;

        public LocationControl(@NonNull SmartLocationManager smartLocationManager, @NonNull LocationProvider locationProvider) {
            this.smartLocationManager = smartLocationManager;
            if(params == null) {
                params = LocationParams.NAVIGATION;
            }

            oneFix = false;

            if (!MAPPING.containsKey(smartLocationManager.context)) {
                MAPPING.put(smartLocationManager.context, locationProvider);
            }
            provider = MAPPING.get(smartLocationManager.context);

            if (smartLocationManager.preInitialize) {
                assert provider != null;
                provider.init(smartLocationManager.context, ProviderType.ALL);
            }
        }

        public LocationControl config(@NonNull LocationParams params) {
            this.params = params;
            return this;
        }

        public LocationControl oneFix() {
            this.oneFix = true;
            return this;
        }

        public LocationControl continuous() {
            this.oneFix = false;
            return this;
        }

        public LocationState state() {
            return LocationState.with(smartLocationManager.context);
        }

        @Nullable
        public Location getLocation() { return provider.getLocation(); }

        public void restart(OnLocationUpdatedListener listener, LocationParams parameters) {provider.restart(listener, parameters);}

        @Nullable
        public Location getLastLocation() { return provider.getLastLocation(); }

        public LocationControl get() {
            return this;
        }

        public boolean canGetLocationUpdates() {return provider.canGetLocation();}

        public void start(OnLocationUpdatedListener listener) {
            if (provider == null) {
                throw new RuntimeException("A provider must be initialized");
            }
            provider.start(listener, params, oneFix);
        }

        public void stop() {
            provider.stop();
        }
    }

    public static class GeofencingControl {

        private static final Map<Context, IGeofencingProvider> MAPPING = new WeakHashMap<>();
        private final IGeofencingProvider provider;

        public GeofencingControl(@NonNull SmartLocationManager smartLocationManager,
                                 @NonNull IGeofencingProvider geofencingProvider) {

            if (!MAPPING.containsKey(smartLocationManager.context)) {
                MAPPING.put(smartLocationManager.context, geofencingProvider);
            }

            provider = MAPPING.get(smartLocationManager.context);

            if (smartLocationManager.preInitialize) {
                assert provider != null;
                provider.init(smartLocationManager.context);
            }
        }

        public GeofencingControl add(@NonNull GeofenceModel geofenceModel) {
            provider.addGeofence(geofenceModel);
            return this;
        }

        public GeofencingControl remove(@NonNull String geofenceId) {
            provider.removeGeofence(geofenceId);
            return this;
        }

        public GeofencingControl addAll(@NonNull List<GeofenceModel> geofenceModelList) {
            provider.addGeofences(geofenceModelList);
            return this;
        }

        public GeofencingControl removeAll(@NonNull List<String> geofenceIdsList) {
            provider.removeGeofences(geofenceIdsList);
            return this;
        }

        public void start(OnGeofencingTransitionListener listener) {
            if (provider == null) {
                throw new RuntimeException("A provider must be initialized");
            }
            provider.start(listener);
        }

        public void stop() {
            provider.stop();
        }
    }

}
