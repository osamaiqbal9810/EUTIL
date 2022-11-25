//package com.app.ps19.elecapp;
//
//import java.io.IOException;
//import java.util.List;
//import java.util.SortedSet;
//import java.util.TreeSet;
//
//import android.content.Context;
//import android.graphics.ImageFormat;
//import android.graphics.SurfaceTexture;
//import android.hardware.Camera;
//import android.hardware.camera2.CameraAccessException;
//import android.hardware.camera2.CameraCharacteristics;
//import android.hardware.camera2.CameraManager;
//import android.hardware.camera2.params.StreamConfigurationMap;
//import android.os.Build;
//import android.util.Log;
//import android.util.SparseIntArray;
//import android.view.MotionEvent;
//import android.view.SurfaceHolder;
//import android.view.SurfaceView;
//
//import androidx.annotation.RequiresApi;
//import androidx.core.view.ViewCompat;
//
//import com.app.ps19.elecapp.camera.AspectRatio;
//import com.app.ps19.elecapp.camera.DisplayOrientationDetector;
//import com.app.ps19.elecapp.camera.Size;
//import com.app.ps19.elecapp.camera.SizeMap;
//
//@RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
//public class CameraPreview extends SurfaceView implements SurfaceHolder.Callback {
//    private SurfaceHolder mHolder;
//    private Camera mCamera;
//    private float mDist;
//    private DisplayOrientationDetector displayOrientationDetector;
//    private AspectRatio aspectRatio = AspectRatio.of(4, 3);
//    private CameraCharacteristics characteristics;
//    private SizeMap previewSizeMap = new SizeMap();
//    private SortedSet<Size> supportedPreviewSizes = new TreeSet<>();
//    private Size previewSize;
//
//    private SizeMap imageSizeMap = new SizeMap();
//    private SortedSet<Size> supportedImageSizes = new TreeSet<>();
//    private Size imageSize;
//
//
//    public CameraPreview(Context context, Camera camera) {
//        super(context);
//        mCamera = camera;
//        cameraManager = (CameraManager) context.getSystemService(Context.CAMERA_SERVICE);
//        mHolder = getHolder();
//        mHolder.addCallback(this);
//        setFocusable(true);
//        setFocusableInTouchMode(true);
//        // deprecated setting, but required on Android versions prior to 3.0
//        mHolder.setType(SurfaceHolder.SURFACE_TYPE_PUSH_BUFFERS);
//
//        if (!chooseCameraIdByFacing()) {
//           // callbackHandler.onError(new Error(Error.ERROR_CAMERA));
//            return;
//        }
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
//            if (!collectCameraInfo()) {
//                return;
//            }
//        }
//
//        displayOrientationDetector = new DisplayOrientationDetector(context) {
//            @Override
//            public void onDisplayOrientationChanged(int displayOrientation) {
//                mCamera.setDisplayOrientation(displayOrientation);
//            }
//        };
//    }
//    /*private void initPreview(int width, int height) {
//        if (mCamera != null && mHolder.getSurface() != null) {
//            try {
//                mCamera.setPreviewDisplay(mHolder);
//            } catch (Throwable t) {
//                Log.e("PreviewDemo-surfaceCallback",
//                        "Exception in setPreviewDisplay()", t);
//                Toast.makeText(getContext(), t.getMessage(),
//                        Toast.LENGTH_LONG).show();
//            }
//
//            try {
//                Camera.Parameters parameters=mCamera.getParameters();
//
//                Camera.Size size=getBestPreviewSize(width, height, parameters);
//                Camera.Size pictureSize= getSmallestPictureSize(parameters);
//
//                Display display = windowManager.getDefaultDisplay();
//                // for 2.2 and later
//                switch (display.getRotation()) {
//                    case Surface.ROTATION_0: // This is display orientation
//                        if (size.height > size.width) parameters.setPreviewSize(size.height, size.width);
//                        else parameters.setPreviewSize(size.width, size.height);
//                        mCamera.setDisplayOrientation(90);
//                        break;
//                    case Surface.ROTATION_90:
//                        if (size.height > size.width) parameters.setPreviewSize(size.height, size.width);
//                        else parameters.setPreviewSize(size.width, size.height);
//                        mCamera.setDisplayOrientation(0);
//                        break;
//                    case Surface.ROTATION_180:
//                        if (size.height > size.width) parameters.setPreviewSize(size.height, size.width);
//                        else parameters.setPreviewSize(size.width, size.height);
//                        mCamera.setDisplayOrientation(270);
//                        break;
//                    case Surface.ROTATION_270:
//                        if (size.height > size.width) parameters.setPreviewSize(size.height, size.width);
//                        else parameters.setPreviewSize(size.width, size.height);
//                        mCamera.setDisplayOrientation(180);
//                        break;
//                }
//
//                parameters.setPictureSize(pictureSize.width, pictureSize.height);
//                //parameters.setPictureFormat(ImageFormat.JPEG);
//                camera.setParameters(parameters);
//            } catch (Exception e) {
//                e.printStackTrace();
//            }
//        }
//    }*/
//
//    private static final SparseIntArray INTERNAL_FACINGS = new SparseIntArray();
//    static int FACING_BACK = 0;
//    static int FACING_FRONT = 1;
//    private int facing = FACING_BACK;
//    static {
//        INTERNAL_FACINGS.put(FACING_BACK, CameraCharacteristics.LENS_FACING_BACK);
//        INTERNAL_FACINGS.put(FACING_FRONT, CameraCharacteristics.LENS_FACING_FRONT);
//    }
//    private CameraManager cameraManager;
//    private int sensorOrientation = 90;
//
//    private void updateCameraInfo(String cameraId, CameraCharacteristics characteristics) {
//      //  this.cameraId = cameraId;
//        this.characteristics = characteristics;
//        Integer orientation = characteristics.get(CameraCharacteristics.SENSOR_ORIENTATION);
//        if (orientation != null) {
//            sensorOrientation = orientation;
//        }
//        Float maxZoomObject = characteristics.get(CameraCharacteristics.SCALER_AVAILABLE_MAX_DIGITAL_ZOOM);
//        if (maxZoomObject != null) {
//         //   maxZoom = maxZoomObject;
//        }
//    }
//
//
//    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
//    private boolean chooseCameraIdByFacing() {
//        try {
//            int internalFacing = INTERNAL_FACINGS.get(facing);
//            final String[] ids = cameraManager.getCameraIdList();
//            if (ids.length == 0) { // No camera
//              //  callbackHandler.onError(new Error(Error.ERROR_CAMERA, "No camera available."));
//                return false;
//            }
//            for (String id : ids) {
//                CameraCharacteristics characteristics = cameraManager.getCameraCharacteristics(id);
//
//                Integer level = characteristics.get(CameraCharacteristics.INFO_SUPPORTED_HARDWARE_LEVEL);
//                if (level == null || level == CameraCharacteristics.INFO_SUPPORTED_HARDWARE_LEVEL_LEGACY) {
//                    continue;
//                }
//
//                Integer internal = characteristics.get(CameraCharacteristics.LENS_FACING);
//                if (internal == null) {
//                 //   callbackHandler.onError(new Error(Error.ERROR_CAMERA, "Unexpected state: LENS_FACING null."));
//                    return false;
//                }
//                if (internal == internalFacing) {
//                    updateCameraInfo(id, characteristics);
//                    return true;
//                }
//            }
//
//            // Not found
//            updateCameraInfo(ids[0], cameraManager.getCameraCharacteristics(ids[0]));
//            Integer internal = characteristics.get(CameraCharacteristics.LENS_FACING);
//            if (internal == null) {
//                //callbackHandler.onError(new Error(Error.ERROR_CAMERA, "Unexpected state: LENS_FACING null."));
//                return false;
//            }
//            for (int i = 0, count = INTERNAL_FACINGS.size(); i < count; i++) {
//                if (INTERNAL_FACINGS.valueAt(i) == internal) {
//                    facing = INTERNAL_FACINGS.keyAt(i);
//                    return true;
//                }
//            }
//            // The operation can reach here when the only camera device is an external one.
//            // We treat it as facing back.
//            facing = FACING_BACK;
//            return true;
//        } catch (CameraAccessException e) {
//          //  callbackHandler.onError(new Error(Error.ERROR_CAMERA, e));
//            return false;
//        }
//    }
//
//    @Override
//    protected void onAttachedToWindow() {
//        super.onAttachedToWindow();
//        if (!isInEditMode()) {
//            displayOrientationDetector.enable(ViewCompat.getDisplay(this));
//        }
//    }
//
//    @Override
//    protected void onDetachedFromWindow() {
//        if (!isInEditMode()) {
//            displayOrientationDetector.disable();
//        }
//        super.onDetachedFromWindow();
//    }
//
//    public void surfaceCreated(SurfaceHolder holder) {
//        try {
//            // create the surface and start camera preview
//            if (mCamera == null) {
//                mCamera.setDisplayOrientation(sensorOrientation);
//                mCamera.setPreviewDisplay(holder);
//                mCamera.startPreview();
//            }
//        } catch (IOException e) {
//            Log.d(VIEW_LOG_TAG, "Error setting camera preview: " + e.getMessage());
//        }
//    }
//
//    public void refreshCamera(Camera camera) {
//        if (mHolder.getSurface() == null) {
//            // preview surface does not exist
//            return;
//        }
//        // stop preview before making changes
//        try {
//            mCamera.stopPreview();
//        } catch (Exception e) {
//            // ignore: tried to stop a non-existent preview
//        }
//        // set preview size and make any resize, rotate or
//        // reformatting changes here
//        // start preview with new settings
//        setCamera(camera);
//        try {
//            Camera.Parameters p = mCamera.getParameters();
//            p.setFocusMode(Camera.Parameters.FOCUS_MODE_AUTO);
//
//            mCamera.setParameters(p);
//            mCamera.setPreviewDisplay(mHolder);
//            mCamera.startPreview();
//            //mCamera.autoFocus(null);
//        } catch (Exception e) {
//            Log.d(VIEW_LOG_TAG, "Error starting camera preview: " + e.getMessage());
//        }
//    }
//
//    public void surfaceChanged(SurfaceHolder holder, int format, int w, int h) {
//        // If your preview can change or rotate, take care of those events here.
//        // Make sure to stop the preview before resizing or reformatting it.
//        Camera.Parameters parameters = mCamera.getParameters();
//        mCamera.setDisplayOrientation(sensorOrientation);
//        //Size size = chooseOptimalPreviewSize(1080, 2400);
//        Camera.Size size = getBestPreviewSize(w, h);
//        //parameters.setPreviewSize(size.getWidth(), size.getHeight());
//        parameters.setPreviewSize(size.width, size.height);
//        mCamera.setParameters(parameters);
//        mCamera.startPreview();
//        refreshCamera(mCamera);
//    }
//
//    public void setCamera(Camera camera) {
//        //method to set a camera instance
//        mCamera = camera;
//    }
//
//    @Override
//    public void surfaceDestroyed(SurfaceHolder holder) {
//        // TODO Auto-generated method stub
//        // mCamera.release();
//        displayOrientationDetector.disable();
//    }
//
//    @Override
//    public boolean onTouchEvent(MotionEvent event) {
//        // Get the pointer ID
//        if (mCamera != null) {
//            try {
//                Camera.Parameters params = mCamera.getParameters();
//                int action = event.getAction();
//
//
//                if (event.getPointerCount() > 1) {
//                    // handle multi-touch events
//                    if (action == MotionEvent.ACTION_POINTER_DOWN) {
//                        mDist = getFingerSpacing(event);
//                    } else if (action == MotionEvent.ACTION_MOVE && params.isZoomSupported()) {
//                        mCamera.cancelAutoFocus();
//                        handleZoom(event, params);
//                    }
//                } else {
//                    // handle single touch events
//                    if (action == MotionEvent.ACTION_UP) {
//                        handleFocus(event, params);
//                    }
//                }
//                if (event.getAction() == MotionEvent.ACTION_DOWN) {
//                    Log.d("down", "focusing now");
//
//                    //mCamera.autoFocus(null);
//                }
//            } catch (Exception e) {
//                e.printStackTrace();
//            }
//        }
//
//        return true;
//    }
//
//    private void handleZoom(MotionEvent event, Camera.Parameters params) {
//        int maxZoom = params.getMaxZoom();
//        int zoom = params.getZoom();
//        float newDist = getFingerSpacing(event);
//        if (newDist > mDist) {
//            //zoom in
//            if (zoom < maxZoom)
//                zoom++;
//        } else if (newDist < mDist) {
//            //zoom out
//            if (zoom > 0)
//                zoom--;
//        }
//        mDist = newDist;
//        params.setZoom(zoom);
//        mCamera.setParameters(params);
//    }
//
//    public void handleFocus(MotionEvent event, Camera.Parameters params) {
//        int pointerId = event.getPointerId(0);
//        int pointerIndex = event.findPointerIndex(pointerId);
//        // Get the pointer's current position
//        float x = event.getX(pointerIndex);
//        float y = event.getY(pointerIndex);
//
//        List<String> supportedFocusModes = params.getSupportedFocusModes();
//        if (supportedFocusModes != null && supportedFocusModes.contains(Camera.Parameters.FOCUS_MODE_AUTO)) {
//            mCamera.autoFocus(new Camera.AutoFocusCallback() {
//                @Override
//                public void onAutoFocus(boolean b, Camera camera) {
//                    // currently set to auto-focus on single touch
//                }
//            });
//        }
//    }
//
//    /**
//     * Determine the space between the first two fingers
//     */
//    private float getFingerSpacing(MotionEvent event) {
//        // ...
//        float x = event.getX(0) - event.getX(1);
//        float y = event.getY(0) - event.getY(1);
//        return (float) Math.sqrt(x * x + y * y);
//    }
//
//
//    private Size chooseOptimalPreviewSize(int width, int height) {
//        int surfaceLonger, surfaceShorter;
//        final int surfaceWidth = width;
//        final int surfaceHeight = height;
//
//        if (surfaceWidth < surfaceHeight) {
//            surfaceLonger = surfaceHeight;
//            surfaceShorter = surfaceWidth;
//        } else {
//            surfaceLonger = surfaceWidth;
//            surfaceShorter = surfaceHeight;
//        }
//
//        AspectRatio preferredAspectRatio = AspectRatio.of(surfaceLonger, surfaceShorter);
//        // Pick the smallest of those big enough
//        for (Size size : supportedPreviewSizes) {
//            if (preferredAspectRatio.matches(size)
//                    && size.getWidth() >= surfaceLonger && size.getHeight() >= surfaceShorter) {
//                return size;
//            }
//        }
//
//        // If no size is big enough, pick the largest one which matches the ratio.
//        SortedSet<Size> matchedSizes = previewSizeMap.sizes(preferredAspectRatio);
//        if (matchedSizes != null && matchedSizes.size() > 0) {
//
//            return matchedSizes.last();
//        }
//
//        return supportedPreviewSizes.last();
//        // If no size is big enough or ratio cannot be matched, pick the largest one.
//    }
//
//    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
//    private boolean collectCameraInfo() {
//        StreamConfigurationMap map = characteristics.get(CameraCharacteristics.SCALER_STREAM_CONFIGURATION_MAP);
//        if (map == null) {
//           // callbackHandler.onError(new Error(Error.ERROR_CAMERA, "Cannot get available preview/video sizes"));
//            return false;
//        }
//
//        collectPreviewSizes(map);
//        collectImageSizes(map);
//        refineSizes();
//        return true;
//    }
//
//    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
//    private void collectPreviewSizes(StreamConfigurationMap map) {
//        supportedPreviewSizes.clear();
//        for (android.util.Size size : map.getOutputSizes(SurfaceTexture.class)) {
//            Size s = new Size(size.getWidth(), size.getHeight());
//            supportedPreviewSizes.add(s);
//            previewSizeMap.add(s);
//        }
//    }
//
//
//    private void refineSizes() {
//        for (AspectRatio ratio : previewSizeMap.ratios()) {
//            if ((!imageSizeMap.ratios().contains(ratio))) {
//                if (previewSizeMap.sizes(ratio) != null) {
//                    supportedPreviewSizes.removeAll(previewSizeMap.sizes(ratio));
//                }
//                previewSizeMap.remove(ratio);
//            }
//        }
//
//        // fix the aspectRatio if set
//        if (aspectRatio != null && !previewSizeMap.ratios().contains(aspectRatio)) {
//            aspectRatio = previewSizeMap.ratios().iterator().next();
//        }
//    }
//
//    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
//    private void collectImageSizes(StreamConfigurationMap map) {
//        supportedImageSizes.clear();
//        for (android.util.Size size : map.getOutputSizes(ImageFormat.JPEG)) {
//            Size s = new Size(size.getWidth(), size.getHeight());
//            supportedImageSizes.add(s);
//            imageSizeMap.add(s);
//        }
//    }
//
//    private Camera.Size getBestPreviewSize(int width, int height) {
//        Camera.Size result = null;
//        Camera.Parameters p = mCamera.getParameters();
//        for (Camera.Size size : p.getSupportedPreviewSizes()) {
//            if (size.width <= width && size.height <= height) {
//                if (result == null) {
//                    result = size;
//                } else {
//                    int resultArea = result.width * result.height;
//                    int newArea = size.width * size.height;
//
//                    if (newArea > resultArea) {
//                        result = size;
//                    }
//                }
//            }
//        }
//        return result;
//
//    }
//}