package com.app.ps19.tipsapp.camera;

public class PhotographerHelper {

    private Photographer photographer;

    public PhotographerHelper(Photographer photographer) {
        this.photographer = photographer;
    }

    public void switchMode() {
        int newMode = Values.MODE_IMAGE;
        photographer.setMode(newMode);
    }

    public void flip() {
        int newFacing = (photographer.getFacing() == Values.FACING_BACK ? Values.FACING_FRONT : Values.FACING_BACK);
        photographer.setFacing(newFacing);
    }
}
