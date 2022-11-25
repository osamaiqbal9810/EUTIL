package com.app.ps19.scimapp.camera.options;

import com.app.ps19.scimapp.camera.AspectRatio;

public class AspectRatioItem implements PickerItemWrapper<AspectRatio> {

    private AspectRatio aspectRatio;

    public AspectRatioItem(AspectRatio ratio) {
        aspectRatio = ratio;
    }

    @Override
    public String getText() {
        return aspectRatio.toString();
    }

    @Override
    public AspectRatio get() {
        return aspectRatio;
    }
}
