package com.app.ps19.elecapp.classes.dynforms;

import android.content.Context;

public interface IViewController {
    void viewChanged(Context context);
    void viewListenerChanged(OnValueChangeEventListener listener);
    void viewClosed();
}