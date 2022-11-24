package com.app.ps19.scimapp;


import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.app.ps19.scimapp.classes.CompRange;
import com.app.ps19.scimapp.classes.Session;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import kotlinx.coroutines.CompletedExceptionally;

import static com.app.ps19.scimapp.Shared.Globals.SESSION_STARTED;
import static com.app.ps19.scimapp.Shared.Globals.selectedPostSign;
import static com.app.ps19.scimapp.Shared.Globals.setLocale;

public class inspMemberAdapter extends ArrayAdapter<CompRange> {
    private final Activity context;
    private final ArrayList<CompRange> ranges;

    public inspMemberAdapter(Activity context, ArrayList<CompRange> ranges) {
        super(context, R.layout.sessions_list_row, ranges);
        // TODO Auto-generated constructor stub
        setLocale(context);
        this.context = context;
        this.ranges = ranges;
    }

    public View getView(int position, View view, ViewGroup parent) {
        position = getCount() - 1 - position;
        LayoutInflater inflater = context.getLayoutInflater();
        CompRange range = ranges.get(position);
        View rowView = inflater.inflate(R.layout.inspection_members_row, null, true);
        Session session = range.getSessions().get(0);
        LinearLayout llMainContainer = rowView.findViewById(R.id.ll_session_row_main_container);
        TextView tvUserName = rowView.findViewById(R.id.tv_user_name);
        TextView tvStartTime = rowView.findViewById(R.id.tv_session_list_start_time);
        TextView tvStartDate = rowView.findViewById(R.id.tv_session_list_start_date);

        TextView tvEndTime = rowView.findViewById(R.id.tv_session_list_end_time);
        TextView tvEndDate = rowView.findViewById(R.id.tv_session_list_end_date);

        TextView tvStartMPPrefix = rowView.findViewById(R.id.tv_session_list_start_mp);
        TextView tvEndMPPrefix = rowView.findViewById(R.id.tv_session_list_end_mp);

        TextView tvStartMPValue = rowView.findViewById(R.id.tv_session_list_start_mp_value);
        TextView tvEndMPValue = rowView.findViewById(R.id.tv_session_list_end_mp_value);
        tvUserName.setText(range.getUser().getName());
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
