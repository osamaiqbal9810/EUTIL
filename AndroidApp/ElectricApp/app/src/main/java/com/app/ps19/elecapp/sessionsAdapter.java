package com.app.ps19.elecapp;


import static com.app.ps19.elecapp.Shared.Globals.SESSION_STARTED;
import static com.app.ps19.elecapp.Shared.Globals.selectedPostSign;
import static com.app.ps19.elecapp.Shared.Globals.setLocale;

import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.app.ps19.elecapp.classes.Session;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

public class sessionsAdapter extends ArrayAdapter<Session> {
    private final Activity context;
    private final ArrayList<Session> sessionsList;

    public sessionsAdapter(Activity context, ArrayList<Session> sessionsList) {
        super(context, R.layout.sessions_list_row, sessionsList);
        // TODO Auto-generated constructor stub
        setLocale(context);
        this.context = context;
        this.sessionsList = sessionsList;
    }

    public View getView(int position, View view, ViewGroup parent) {
        position = getCount() - 1 - position;
        LayoutInflater inflater = context.getLayoutInflater();
        View rowView = inflater.inflate(R.layout.sessions_list_row, null, true);
        Session session = sessionsList.get(position);
        LinearLayout llMainContainer = rowView.findViewById(R.id.ll_session_row_main_container);
        ImageView ivSessionStatus = rowView.findViewById(R.id.iv_session_status);
        TextView tvStartTime = rowView.findViewById(R.id.tv_session_list_start_time);
        TextView tvStartDate = rowView.findViewById(R.id.tv_session_list_start_date);

        TextView tvEndTime = rowView.findViewById(R.id.tv_session_list_end_time);
        TextView tvEndDate = rowView.findViewById(R.id.tv_session_list_end_date);

        TextView tvStartMPPrefix = rowView.findViewById(R.id.tv_session_list_start_mp);
        TextView tvEndMPPrefix = rowView.findViewById(R.id.tv_session_list_end_mp);

        TextView tvStartMPValue = rowView.findViewById(R.id.tv_session_list_start_mp_value);
        TextView tvEndMPValue = rowView.findViewById(R.id.tv_session_list_end_mp_value);

        //llMainContainer.setBackground(context.getResources().getDrawable(R.drawable.border_bottom_with_background));

        try {
            if(session.getStatus().equals(SESSION_STARTED)){
                ivSessionStatus.setImageResource(R.drawable.ic_baseline_play_arrow_24);
                //ivSessionStatus.startAnimation(getBlinkAnimation());
            } else {
                ivSessionStatus.setImageResource(R.drawable.ic_baseline_stop_24);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        SimpleDateFormat dateFormat = new SimpleDateFormat("MMM d");
        SimpleDateFormat timeFormat = new SimpleDateFormat("hh:mm aaa");


        //SimpleDateFormat dateFormat = new SimpleDateFormat("MM-dd-yyyy HH:mm:ss");
        tvStartTime.setText(timeFormat.format(new Date(session.getStartTime())));
        tvStartDate.setText(dateFormat.format(new Date(session.getStartTime())));
        if(session.getEndTime()!=null){
            if(session.getEndTime().equals("")){
                tvEndDate.setText("--");
                tvEndTime.setText("--:--");
            } else {
                tvEndDate.setText(dateFormat.format(new Date(session.getEndTime())));
                tvEndTime.setText(timeFormat.format(new Date(session.getEndTime())));
            }
        }
        tvStartMPValue.setText(session.getStart());
        tvEndMPValue.setText(session.getEnd());
        tvEndMPPrefix.setText(selectedPostSign);
        tvStartMPPrefix.setText(selectedPostSign);

        return rowView;
    }
}
