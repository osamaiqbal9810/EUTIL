package com.app.ps19.tipsapp.classes.dynforms;

public interface  OnValueChangeEventListener{
    public void onValueChange(String id, String value);
    public  void onFormDirtyChange(boolean dirty);
    public void onObjectAddClick(DynFormControl control);
    public void onObjectRemoveClick(DynFormControl control, DynForm item);
    public void onObjectItemClick(DynFormControl control, DynForm item);
    //public void onObjectPropertyChange(String id, String property, String value);
    public void onObjectPropertyChange(DynControlBinding binding, String value,String originalValue);
        }
