package com.app.ps19.tipsapp.classes.dynforms;

import android.app.Activity;
import android.app.DatePickerDialog;
import android.content.Context;
import android.view.View;
import android.widget.DatePicker;
import android.widget.EditText;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

import ch.qos.logback.classic.db.names.SimpleDBNameResolver;

public class  DynEditTextDatePicker  implements View.OnClickListener, DatePickerDialog.OnDateSetListener {
    EditText _editText;
    private int _day;
    private int _month;
    private int _year;
    private Context _context;

    public DynEditTextDatePicker(Context context, EditText editTextViewID)
    {
        Activity act = (Activity)context;
        this._editText = editTextViewID;
        this._editText.setOnClickListener(this);
        this._context = context;
    }

    @Override
    public void onDateSet(DatePicker view, int year, int monthOfYear, int dayOfMonth) {
        _year = year;
        _month = monthOfYear;
        _day = dayOfMonth;
        updateDisplay();
    }
    @Override
    public void onClick(View v) {
        Calendar calendar = Calendar.getInstance(TimeZone.getDefault());
        int year=_year!=0?_year:calendar.get(Calendar.YEAR);
        int month=_month!=0?_month:calendar.get(Calendar.MONTH);
        int dayOfMonth=_day!=0?_day:calendar.get(Calendar.DAY_OF_MONTH);
        DatePickerDialog dialog = new DatePickerDialog(_context, this,
                year,month,
                dayOfMonth);
        dialog.show();

    }

    // updates the date in the birth date EditText
    private void updateDisplay() {
        String myFormat = "dd/MM/yy"; //In which you need put here
        SimpleDateFormat sdf = new SimpleDateFormat(myFormat, Locale.US);
        try {
            Date date=sdf.parse(new StringBuilder()
                    .append(_day).append("/").append(_month+1).append("/").append(_year).append("").toString());
            SimpleDateFormat sdfOut=new SimpleDateFormat("MMM, dd, yyyy");
            //_editText.setText(sdfOut.format(date));
            _editText.setText(date.toString());
        } catch (ParseException e) {
            e.printStackTrace();
        }
/*
        _editText.setText(new StringBuilder()
                // Month is 0 based so add 1
                .append(_day).append("/").append(_month + 1).append("/").append(_year).append(" "));

 */
    }
}