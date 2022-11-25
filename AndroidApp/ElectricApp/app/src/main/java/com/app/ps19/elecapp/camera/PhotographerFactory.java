package com.app.ps19.elecapp.camera;

import android.app.Activity;
import android.os.Build;

import androidx.annotation.RequiresApi;

@RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
public class PhotographerFactory {

    public static Photographer createPhotographerWithCamera2(Activity activity, CameraView preview) {
        InternalPhotographer photographer = new Camera2Photographer();
        photographer.initWithViewfinder(activity, preview);
        preview.assign(photographer);
        return photographer;
    }
}