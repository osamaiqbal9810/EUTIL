package com.app.ps19.elecapp.camera;

import android.app.Activity;

interface InternalPhotographer extends Photographer {

    void initWithViewfinder(Activity activity, CameraView preview);
}