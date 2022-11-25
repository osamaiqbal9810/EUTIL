package com.app.ps19.elecapp.hos;

import static com.app.ps19.elecapp.Shared.Globals.isInternetAvailable;

import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.app.TimePickerDialog;
import android.content.Context;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.TimePicker;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.app.ps19.elecapp.R;
import com.app.ps19.elecapp.classes.hos.DateSlot;
import com.app.ps19.elecapp.classes.hos.Hos;
import com.app.ps19.elecapp.classes.hos.IServerResponseCallback;
import com.app.ps19.elecapp.classes.hos.TimeSlot;

import java.lang.reflect.Field;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;


public class HosActivity extends AppCompatActivity implements IServerResponseCallback  {
    TextView tvYesterdayDate;
    TextView tvYesterdayHours;
    TextView tvYesterdaySignedIn;
    TextView tvYesterdaySignedOut;
    TextView tvTodayDate;
    TextView tvTodayHours;
    TextView tvSignedTime;
    Button btnSigned;
    boolean isSignedIn = false;

    ListView lvHosEntries;
    hosAdapter hosAdapter;
    Hos hos;
    ArrayList<TimeSlot> entries;
    SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm");
    SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MMM-yyyy");
    public static int hoursToSend;
    public static int minToSend;
    public static double allowedTimeInMinutes = 720;
    ProgressDialog progressDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_hos);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        setTitle("Hours Of Service");

        tvYesterdayDate = findViewById(R.id.tv_yesterday_date);
        tvYesterdayHours = findViewById(R.id.tv_yesterday_hours);
        tvYesterdaySignedIn = findViewById(R.id.tv_yesterday_signed_in);
        tvYesterdaySignedOut = findViewById(R.id.tv_yesterday_signed_out);

        tvSignedTime = findViewById(R.id.tv_signed_time);
        progressDialog= new ProgressDialog(this);
        progressDialog.setTitle(getResources().getString(R.string.please_wait));
        progressDialog.setMessage("Loading...");
        progressDialog.setCancelable(false);
        progressDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);

        tvTodayDate = findViewById(R.id.tv_today_date);
        tvTodayHours = findViewById(R.id.tv_today_hours);
        btnSigned = findViewById(R.id.btn_sign_in);
        lvHosEntries = findViewById(R.id.lv_hos_entries);
        //Setting Today date
        tvTodayDate.setText(dateFormat.format(new Date()));
        //Initializing HOS
        if(Hos.getToday()== null){
            Hos.load(null);
        }
        //hos = new Hos();
        //hos.load();
        entries = new ArrayList<>();
        if(Hos.getToday().getSlots()!=null){
            entries = Hos.getToday().getSlots();
        }
        isSignedIn = analyzeStatus();
        if(isSignedIn){
            btnSigned.setText("Sign Out");
        } else {
            btnSigned.setText("Sign In");
        }
        hosAdapter = new hosAdapter(HosActivity.this, entries);
        lvHosEntries.setAdapter(hosAdapter);

        setYesterdayDate();
        setYesterdayHours();
        setYesterdaySession();
        setTodayHours();
        //tvYesterdayHours.setText(hos.getYesterday().get);
        tvSignedTime.setOnClickListener(v -> {
            // TODO Auto-generated method stub
            try {
                if(isSignedIn){
                    TimeSlot slot = null;
                    if(Hos.getToday().getSlots()!=null){
                        for(TimeSlot _slot: Hos.getToday().getSlots()){
                            if(_slot.getEnd()==null){
                                slot = _slot;
                            }}
                    }
                    String getHours = null;
                    String getMinutes = null;
                    if(slot!=null){
                        SimpleDateFormat formatMinutes = new SimpleDateFormat("mm");
                        getMinutes = formatMinutes.format(slot.getStart());

                        SimpleDateFormat formatHours = new SimpleDateFormat("HH");
                        getHours = formatHours.format(slot.getStart());
                    }


                    showTime(this,tvSignedTime, Integer.parseInt(getHours), Integer.parseInt(getMinutes), true);
                } else {
                    showTime(this,tvSignedTime, 0, 0, false);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }


        });
        btnSigned.setOnClickListener(v -> {
            // Perform action on click
            Date signedDate = new Date();
            /*try {
                signedDate = timeFormat.parse(tvSignedTime.getText().toString());
            } catch (ParseException e) {
                e.printStackTrace();
            }*/
            if(isInternetAvailable(HosActivity.this)){
                if(!tvSignedTime.getText().equals("Click here to select time")){
                    if(isSignedIn){
                        addSignOut();
                    } else {
                        addSignIn();
                    }
                } else {
                    Toast.makeText(HosActivity.this, "Please select time", Toast.LENGTH_SHORT).show();
                }
            } else {
                Toast.makeText(HosActivity.this, "Server unreachable!", Toast.LENGTH_SHORT).show();
            }
        });

    }
    private boolean isTotalTimeExceeding(Date start, Date end, double existingMinutes){
        long _newDiff = end.getTime() - start.getTime();
        long newDiff = (_newDiff / 1000) / 60;
        return newDiff + existingMinutes > allowedTimeInMinutes;
    }

    private void addSignIn(){
        ArrayList<TimeSlot> slots=Hos.getToday().getSlots();

        double existingTime = 0;
        for(TimeSlot slot: Hos.getToday().getSlots()){
            existingTime = existingTime + slot.getTotal();
        }
        if(existingTime>=allowedTimeInMinutes){
            showCustomAlertDialog(HosActivity.this);
        } else {
            TimeSlot ts=new TimeSlot(Hos.getTodayDate());
            ts.setStart(Hos.getTodayDateWithTime(hoursToSend,minToSend));
            //ts.setEnd(Hos.getTodayDateWithTime(18,50));
            ts.setDirty(true);
            slots.add(ts);
            Hos.update();
            Toast.makeText(HosActivity.this, "Successfully added sign in", Toast.LENGTH_SHORT).show();
            tvSignedTime.setText("Click here to select time");
            btnSigned.setText("Sign Out");
            isSignedIn = true;
            refreshAdapter();
        }
    }

    private void addSignOut(){
        ArrayList<TimeSlot> slots=Hos.getToday().getSlots();
        TimeSlot ts= slots.get(slots.size()-1);
        double existingTime = 0;
        for(TimeSlot slot: Hos.getToday().getSlots()){
            existingTime = existingTime + slot.getTotal();
        }
        Date givenDate = Hos.getDateWithTime(ts.getDate(), hoursToSend, minToSend);
        if(!isTotalTimeExceeding(ts.getStart(),givenDate,existingTime)){
            ts.setEnd(Hos.getTodayDateWithTime(hoursToSend,minToSend));
            ts.setDirty(true);
            Hos.update();
            Toast.makeText(HosActivity.this, "Successfully added sign out", Toast.LENGTH_SHORT).show();
            tvSignedTime.setText("Click here to select time");
            btnSigned.setText("Sign In");
            isSignedIn = false;
            refreshAdapter();
        } else {
            showCustomAlertDialog(HosActivity.this);
        }

    }

    private boolean analyzeStatus() {
        boolean _isSignedIn = false;
        if(Hos.getToday().getSlots()!=null){
            if(Hos.getToday().getSlots().size()>0){
                for(TimeSlot slot: Hos.getToday().getSlots()){
                    if(slot.getEnd()==null){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private void setYesterdaySession() {
        if(Hos.getYesterday().getSlots()!=null && Hos.getYesterday().getSlots().size()!=0){
            TimeSlot slot = Hos.getYesterday().getSlots().get(Hos.getYesterday().getSlots().size()-1);

            try {
                tvYesterdaySignedIn.setText(timeFormat.format(slot.getStart()));
                tvYesterdaySignedOut.setText(timeFormat.format(slot.getEnd()));
            } catch (Exception e) {
                e.printStackTrace();
            }


        }
    }

    private void setTodayHours() {
        if(Hos.getToday().getSlots()!=null){
            long minutes = 0;
            for(TimeSlot slot: Hos.getToday().getSlots()){
                minutes = minutes + slot.getTotal();
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                tvTodayHours.setText(String.valueOf(LocalTime.MIN.plus(Duration.ofMinutes(minutes))));
            } else{
                long hours = minutes / 60;
                tvTodayHours.setText(new DecimalFormat("##.##").format(hours));
            }
            //tvTodayHours.setText(new DecimalFormat("##.##").format(minutes));
        }
    }

    private void setYesterdayDate() {
        if(Hos.getYesterday().getDate()!=null){
            SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MMM-yyyy");
            tvYesterdayDate.setText(dateFormat.format(Hos.getYesterday().getDate()));
        }
    }

    private void setYesterdayHours() {
        if(Hos.getYesterday().getSlots()!=null){
            long minutes = 0;
            for(TimeSlot slot: Hos.getYesterday().getSlots()){
                minutes = minutes + slot.getTotal();
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                tvYesterdayHours.setText(String.valueOf(LocalTime.MIN.plus(Duration.ofMinutes(minutes))));
            } else{
                long hours = minutes / 60;
                tvYesterdayHours.setText(new DecimalFormat("##.##").format(hours));
            }
        }
    }

    @Override
    public boolean onSupportNavigateUp() {
        finish();
        return true;
    }
    public void showTime(final Context context, final TextView textView, int hour, int minute, boolean isMinLimitApplicable) {

        /*final Calendar myCalendar = Calendar.getInstance();
        TimePickerDialog.OnTimeSetListener mTimeSetListener = (view, hourOfDay, minute) -> {
            String am_pm = "";
            myCalendar.set(Calendar.HOUR_OF_DAY, hourOfDay);
            myCalendar.set(Calendar.MINUTE, minute);
            if (myCalendar.get(Calendar.AM_PM) == Calendar.AM)
                am_pm = "AM";
            else if (myCalendar.get(Calendar.AM_PM) == Calendar.PM)
                am_pm = "PM";
            String strHrsToShow = (myCalendar.get(Calendar.HOUR) == 0) ? "12" : myCalendar.get(Calendar.HOUR) + "";
             minToSend = myCalendar.get(Calendar.MINUTE);
             hoursToSend = hourOfDay;
            //UIHelper.showLongToastInCenter(context, strHrsToShow + ":" + myCalendar.get(Calendar.MINUTE) + " " + am_pm);
            //textView.setText(strHrsToShow + ":" + myCalendar.get(Calendar.MINUTE) + " " + am_pm);
            textView.setText(hourOfDay + ":" + myCalendar.get(Calendar.MINUTE));
        };
        new TimePickerDialog(context, mTimeSetListener, myCalendar.get(Calendar.HOUR), myCalendar.get(Calendar.MINUTE), true).show();
*/
        final Calendar mcurrentTime = Calendar.getInstance();
        final int _hour = mcurrentTime.get(Calendar.HOUR_OF_DAY);
        final int _minute = mcurrentTime.get(Calendar.MINUTE);
        final RangeTimePickerDialog mTimePicker;
        mTimePicker = new RangeTimePickerDialog(HosActivity.this, new TimePickerDialog.OnTimeSetListener() {
            @Override
            public void onTimeSet(TimePicker timePicker, int selectedHour, int selectedMinute) {

                textView.setText(selectedHour + ":" + selectedMinute);
                hoursToSend = selectedHour;
                minToSend = selectedMinute;
                Log.d("TAG", "inside OnTimeSetListener");

            }
        }, _hour, _minute, true);//true = 24 hour time
        mTimePicker.setTitle("Select Time");
        if(isMinLimitApplicable){
            mTimePicker.setMin(hour, minute);
        }
        mTimePicker.show();
    }
    public void showCustomAlertDialog(Context context) {
        final AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(
                context);
        LayoutInflater inflater = (LayoutInflater) context
                .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View view = inflater.inflate(R.layout.hos_overtime_dialog, null);
        alertDialogBuilder.setView(view);
        alertDialogBuilder.setCancelable(false);
        final AlertDialog dialog = alertDialogBuilder.create();
        dialog.show();
        TextView tvWarningMsg = view.findViewById(R.id.tv_warning_msg);
        CheckBox cbOverTime = view.findViewById(R.id.cb_overtime);
        LinearLayout llOverTimeComments = view.findViewById(R.id.ll_overtime_comments);
        EditText etComments = view.findViewById(R.id.et_overtime_comments);
        Button btnOk = view.findViewById(R.id.btn_ok);
        Button btnCancel = view.findViewById(R.id.btn_cancel);
        llOverTimeComments.setVisibility(View.INVISIBLE);
        cbOverTime.setOnClickListener(view1 -> {
            if(((CompoundButton) view1).isChecked()){
                llOverTimeComments.setVisibility(View.VISIBLE);
            } else {
                llOverTimeComments.setVisibility(View.INVISIBLE);
            }
        });
        btnOk.setOnClickListener(v -> {
            if(cbOverTime.isChecked()){
                if(etComments.getText().toString().equals("")){
                    Toast.makeText(context, "Please fill the reason to continue", Toast.LENGTH_SHORT).show();
                    return;
                }
                ArrayList<TimeSlot> slots=Hos.getToday().getSlots();
                TimeSlot ts = null;
                if(isSignedIn){
                    try {
                        for(TimeSlot slot: Hos.getToday().getSlots()){
                            if(slot.getEnd()==null){
                                ts = slot;
                            }}
                        double existingTime = 0;
                        for(TimeSlot slot: Hos.getToday().getSlots()){
                            existingTime = existingTime + slot.getTotal();
                        }
                        Date givenDate = Hos.getDateWithTime(ts.getDate(), hoursToSend, minToSend);
                        ts.setEnd(Hos.getTodayDateWithTime(hoursToSend,minToSend));
                        ts.setComments(etComments.getText().toString());
                        ts.setDirty(true);
                        Hos.update();
                        Toast.makeText(HosActivity.this, "Successfully added sign out", Toast.LENGTH_SHORT).show();
                        tvSignedTime.setText("Click here to select time");
                        btnSigned.setText("Sign In");
                        isSignedIn = false;
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
                else {
                    ts = new TimeSlot(Hos.getTodayDate());
                    ts.setStart(Hos.getTodayDateWithTime(hoursToSend,minToSend));
                    ts.setComments(etComments.getText().toString());
                    //ts.setEnd(Hos.getTodayDateWithTime(18,50));
                    ts.setDirty(true);
                    slots.add(ts);
                    Hos.update();
                    Toast.makeText(HosActivity.this, "Successfully added sign in", Toast.LENGTH_SHORT).show();
                    tvSignedTime.setText("Click here to select time");
                    btnSigned.setText("Sign Out");
                    isSignedIn = true;
                }
                refreshAdapter();
                dialog.dismiss();
            } else {
                dialog.dismiss();
            }

        });
        btnCancel.setOnClickListener(v -> {
            dialog.dismiss();

        });
    }
    void refreshAdapter(){
        progressDialog.show();
        Hos.load(new IServerResponseCallback() {
            @Override
            public void serverResponseCallback() {
                DateSlot today=Hos.getToday();
                Log.d("Waiting for data",String.valueOf(Hos.waitingForData));
                entries = today.getSlots();
                Log.d("Slots",String.valueOf(entries.size()));
                hosAdapter = new hosAdapter(HosActivity.this, entries);
                lvHosEntries.setAdapter(hosAdapter);
                setTodayHours();
                progressDialog.dismiss();

            }
        });
    }
    public void refresh(){
        final Handler handler = new Handler(Looper.getMainLooper());
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                //Do something after 100ms
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        DateSlot today=Hos.getToday();
                        Log.d("Waiting for data",String.valueOf(Hos.waitingForData));
                        entries = today.getSlots();
                        Log.d("Slots",String.valueOf(entries.size()));
                        hosAdapter = new hosAdapter(HosActivity.this, entries);
                        lvHosEntries.setAdapter(hosAdapter);
                        setTodayHours();
                        progressDialog.dismiss();
                    }
                });
            }
        }, 1000);

    }

    @Override
    public void serverResponseCallback() {

    }

    public class RangeTimePickerDialog extends TimePickerDialog {

        private int minHour = -1;
        private int minMinute = -1;

        private int maxHour = 25;
        private int maxMinute = 25;

        private int currentHour = 0;
        private int currentMinute = 0;

        private Calendar calendar = Calendar.getInstance();
        private DateFormat dateFormat;


        public RangeTimePickerDialog(Context context, OnTimeSetListener callBack, int hourOfDay, int minute, boolean is24HourView) {
            super(context, callBack, hourOfDay, minute, is24HourView);
            currentHour = hourOfDay;
            currentMinute = minute;
            dateFormat = DateFormat.getTimeInstance(DateFormat.SHORT);

            try {
                Class<?> superclass = getClass().getSuperclass();
                Field mTimePickerField = superclass.getDeclaredField("mTimePicker");
                mTimePickerField.setAccessible(true);
                TimePicker mTimePicker = (TimePicker) mTimePickerField.get(this);
                mTimePicker.setOnTimeChangedListener(this);
            } catch (NoSuchFieldException e) {
            } catch (IllegalArgumentException e) {
            } catch (IllegalAccessException e) {
            }
        }

        public void setMin(int hour, int minute) {
            minHour = hour;
            minMinute = minute;
        }

        public void setMax(int hour, int minute) {
            maxHour = hour;
            maxMinute = minute;
        }

        @Override
        public void onTimeChanged(TimePicker view, int hourOfDay, int minute) {

            Log.d("DADADADA", "onTimeChanged");

            boolean validTime = true;
            if (hourOfDay < minHour || (hourOfDay == minHour && minute < minMinute)) {
                validTime = false;
            }

            if (hourOfDay > maxHour || (hourOfDay == maxHour && minute > maxMinute)) {
                validTime = false;
            }

            if (validTime) {
                currentHour = hourOfDay;
                currentMinute = minute;
            }

            updateTime(currentHour, currentMinute);
            updateDialogTitle(view, currentHour, currentMinute);
        }

        private void updateDialogTitle(TimePicker timePicker, int hourOfDay, int minute) {
            calendar.set(Calendar.HOUR_OF_DAY, hourOfDay);
            calendar.set(Calendar.MINUTE, minute);
            String title = dateFormat.format(calendar.getTime());
            setTitle(title);
        }
    }
}