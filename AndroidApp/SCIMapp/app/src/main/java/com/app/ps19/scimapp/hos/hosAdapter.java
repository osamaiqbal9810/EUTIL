package com.app.ps19.scimapp.hos;


import android.app.Activity;
import android.os.Build;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.app.ps19.scimapp.R;
import com.app.ps19.scimapp.classes.Session;
import com.app.ps19.scimapp.classes.hos.Hos;
import com.app.ps19.scimapp.classes.hos.TimeSlot;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Date;

import static com.app.ps19.scimapp.Shared.Globals.SESSION_STARTED;

import static com.app.ps19.scimapp.Shared.Globals.selectedPostSign;
import static com.app.ps19.scimapp.Shared.Globals.setLocale;

public class hosAdapter extends ArrayAdapter<TimeSlot> {
    private final Activity context;
    private final ArrayList<TimeSlot> timeSlots;

    public hosAdapter(Activity context, ArrayList<TimeSlot> timeSlots) {
        super(context, R.layout.sessions_list_row, timeSlots);
        // TODO Auto-generated constructor stub
        setLocale(context);
        this.context = context;
        this.timeSlots = timeSlots;
    }

    public View getView(int position, View view, ViewGroup parent) {
        position = getCount() - 1 - position;
        LayoutInflater inflater = context.getLayoutInflater();
        View rowView = inflater.inflate(R.layout.hos_user_entry_row, null, true);
        TimeSlot session = timeSlots.get(position);

        TextView tvSignedInTime = rowView.findViewById(R.id.tv_signin_time_row);

        TextView tvSignedOutTime = rowView.findViewById(R.id.tv_signout_time_row);

        TextView tvTotalHours = rowView.findViewById(R.id.tv_total_hours_row);

        SimpleDateFormat dateFormat = new SimpleDateFormat("MMM d");
        SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm");


        //SimpleDateFormat dateFormat = new SimpleDateFormat("MM-dd-yyyy HH:mm:ss");
        tvSignedInTime.setText(timeFormat.format(session.getStart()));
        //tvStartDate.setText(dateFormat.format(new Date(session.getStartTime())));
        if(session.getEnd()!=null){
            if(session.getEnd().equals("")){
                tvSignedOutTime.setText("--:--");
            } else {
                tvSignedOutTime.setText(timeFormat.format(session.getEnd()));
            }
        }
        long minutes = 0;
        minutes = minutes + session.getTotal();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            tvTotalHours.setText(String.valueOf(LocalTime.MIN.plus(Duration.ofMinutes(minutes))) + " h");
        } else{
            long hours = minutes / 60;
            tvTotalHours.setText(new DecimalFormat("##.##").format(hours) + " h");
        }


        return rowView;
    }
}
