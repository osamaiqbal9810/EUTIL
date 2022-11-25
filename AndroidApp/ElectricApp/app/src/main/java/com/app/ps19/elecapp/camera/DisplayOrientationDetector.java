package com.app.ps19.elecapp.camera;


import android.content.Context;
import android.util.SparseIntArray;
import android.view.Display;
import android.view.OrientationEventListener;
import android.view.Surface;

/**
 * Monitors the value returned from {@link Display#getRotation()}.
 */
public abstract class DisplayOrientationDetector {

    private final OrientationEventListener orientationEventListener;

    /** Mapping from Surface.Rotation_n to degrees. */
    private static final SparseIntArray DISPLAY_ORIENTATIONS = new SparseIntArray();

    static {
        DISPLAY_ORIENTATIONS.put(Surface.ROTATION_0, 0);
        DISPLAY_ORIENTATIONS.put(Surface.ROTATION_90, 90);
        DISPLAY_ORIENTATIONS.put(Surface.ROTATION_180, 180);
        DISPLAY_ORIENTATIONS.put(Surface.ROTATION_270, 270);
    }

    private Display display;

    private int lastKnownDisplayOrientation = 0;

    public DisplayOrientationDetector(Context context) {
        orientationEventListener = new OrientationEventListener(context) {

            /** This is either Surface.Rotation_0, _90, _180, _270, or -1 (invalid). */
            private int lastKnownRotation = -1;

            @Override
            public void onOrientationChanged(int orientation) {
                if (orientation == OrientationEventListener.ORIENTATION_UNKNOWN ||
                        display == null) {
                    return;
                }
                final int rotation = display.getRotation();
                if (lastKnownRotation != rotation) {
                    lastKnownRotation = rotation;
                    dispatchOnDisplayOrientationChanged(DISPLAY_ORIENTATIONS.get(rotation));
                }
            }
        };
    }

    public void enable(Display display) {
        this.display = display;
        orientationEventListener.enable();
        // Immediately dispatch the first callback
        dispatchOnDisplayOrientationChanged(DISPLAY_ORIENTATIONS.get(display.getRotation()));
    }

    public void disable() {
        orientationEventListener.disable();
        display = null;
    }

    public int getLastKnownDisplayOrientation() {
        return lastKnownDisplayOrientation;
    }

    private void dispatchOnDisplayOrientationChanged(int displayOrientation) {
        lastKnownDisplayOrientation = displayOrientation;
        onDisplayOrientationChanged(displayOrientation);
    }

    /**
     * Called when display orientation is changed.
     *
     * @param displayOrientation One of 0, 90, 180, and 270.
     */
    protected abstract void onDisplayOrientationChanged(int displayOrientation);

}
