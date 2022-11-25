package com.app.ps19.elecapp.camera.options;

import top.defaults.view.PickerView;

public interface PickerItemWrapper<T> extends PickerView.PickerItem {

    T get();

    interface WrapperFactory<T, W extends PickerItemWrapper<T>> {

        W create(T item);
    }
}
