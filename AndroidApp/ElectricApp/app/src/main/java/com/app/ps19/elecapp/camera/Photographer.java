package com.app.ps19.elecapp.camera;

import java.util.Set;

public interface Photographer {

    Set<Size> getSupportedImageSizes();

    void startPreview();

    void restartPreview();

    void stopPreview();

    Size getPreviewSize();

    Size getImageSize();

    void setImageSize(Size size);

    Set<AspectRatio> getSupportedAspectRatios();

    void setAspectRatio(AspectRatio ratio);

    AspectRatio getAspectRatio();

    void setAutoFocus(boolean autoFocus);

    boolean getAutoFocus();

    void setFacing(int facing);

    int getFacing();

    void setFlash(int flash);

    int getFlash();

    void setZoom(float zoom);

    float getZoom();

    void setMode(int mode);

    int getMode();

    void takePicture();

    void setOnEventListener(OnEventListener listener);

    interface OnEventListener {

        void onDeviceConfigured();

        void onPreviewStarted();

        void onZoomChanged(float zoom);

        void onPreviewStopped();

        void onShotFinished(String filePath);

        void onError(Error error);
    }
}
