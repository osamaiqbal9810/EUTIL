package com.app.ps19.tipsapp.classes.dynforms;

import android.text.InputFilter;
import android.text.Spanned;

public class InputFilterMinMax implements InputFilter {

    private int min, max;

    public InputFilterMinMax(int min, int max) {
        this.min = min;
        this.max = max;
    }

    public InputFilterMinMax(String min, String max) {
        this.min = Integer.parseInt(min);
        this.max = Integer.parseInt(max);
    }

    @Override
    public CharSequence filter(CharSequence source, int start, int end, Spanned dest, int dstart, int dend) {
        try {
            String lastVal = dest.toString().substring(0, dstart) + dest.toString().substring(dend);
            String newVal = lastVal.substring(0, dstart) + source.toString() + lastVal.substring(dstart);
            int input = Integer.parseInt(newVal);
            if (input < min && lastVal.equals("")) return String.valueOf(min);
            if (isInRange(min, max, input)) {
                String lastDest = dest.toString();
                String checkStr = lastDest.replaceFirst("^0+(?!$)", "");
                if (checkStr.length() < lastDest.length()) return "";

                return null;
            }
        } catch (NumberFormatException ignored) {}
        return "";
    }

    private boolean isInRange(int a, int b, int c) {
        return b > a ? c >= a && c <= b : c >= b && c <= a;
    }

/*    @Override
    public CharSequence filter(CharSequence charSequence, int i, int i1, Spanned spanned, int i2, int i3) {
        return null;
    }*/
}