package com.app.ps19.scimapp;

import android.app.Activity;
import android.text.Html;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.app.ps19.scimapp.classes.Inbox;
import com.app.ps19.scimapp.classes.JourneyPlan;
import com.app.ps19.scimapp.classes.JourneyPlanOpt;

import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

public class wpAdapter1 extends ArrayAdapter<JSONObject> {
    private final Activity context;
    private final ArrayList<JSONObject> jPlans;
    SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");
    ArrayList<JourneyPlanOpt> journeyPlans;

    public wpAdapter1(Activity context, ArrayList<JSONObject> jPlans, ArrayList<JourneyPlanOpt> journeyPlans) {
        super(context, R.layout.workplan_row, jPlans);
        // TODO Auto-generated constructor stub

        this.context = context;
        this.jPlans = jPlans;
        this.journeyPlans = journeyPlans;

    }
    private String getString(int resId){
        return this.context.getString(resId);
    }
    public View getView(int position, View view, ViewGroup parent) {
        LayoutInflater inflater = context.getLayoutInflater();
        View rowView = inflater.inflate(R.layout.workplan_row, null, true);

        TextView titleText = (TextView) rowView.findViewById(R.id.tvWPTitle);
        ImageView ivTempStatus = (ImageView) rowView.findViewById(R.id.iv_wptemplate_status);
        TextView limitText = (TextView) rowView.findViewById(R.id.tvWPlimit);
        TextView execText = (TextView) rowView.findViewById(R.id.tvWPlastExec);
        titleText.setText(jPlans.get(position).optString("title"));
        ivTempStatus.setImageResource(R.drawable.ic_action_goright);
        try {
            for(JourneyPlanOpt jp: journeyPlans){
                if(jPlans.get(position).optString("code").equals(jp.getWorkplanTemplateId()) || jPlans.get(position).optString("code").equals("-1")){
                    ivTempStatus.setImageResource(R.drawable.ic_outline_lock_24);
                    break;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        //TODO: To be replaced with real date after finalizing changes
        //titleText.setText("WorkPlan Title");
        if(jPlans.get(position).optString("lastInspection")==null || jPlans.get(position).optString("lastInspection").equals("") ){
            execText.setText(Html.fromHtml("<i><b>"+getString(R.string.last_execution)+":</i></b> " + " ( N/A )"));
        } else {
            try {
                Date initDate = new Date();
                initDate = format.parse(jPlans.get(position).optString("lastInspection"));
                String lastExec = "<i><b>"+getString(R.string.last_execution)+"</i></b> " + getDateDiffString(initDate, new Date()) + " "+ getString(R.string.days_ago);
                execText.setText(Html.fromHtml(lastExec));
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        if (jPlans.get(position).optString("nextDueDate")==null){
            String nextInspection = "<b><i> " + getString(R.string.next_inspection) +": </i></b>" + "( N/A )";
            limitText.setText(Html.fromHtml(nextInspection));
        } else {
            SimpleDateFormat _format = new SimpleDateFormat("yyyy-MM-dd");
            Date date = null;
            try {
                String nextDueDate = jPlans.get(position).optString("nextDueDate","");
                if(!nextDueDate.equals("")){
                    date = format.parse(jPlans.get(position).optString("nextDueDate",""));
                }
            } catch (ParseException e) {
                e.printStackTrace();
            }
            String nextInspection;
            if(date != null){
                nextInspection = "<b><i> " + getString(R.string.next_inspection) + ": </i></b> " + _format.format(date);
            } else {
                nextInspection = "";
            }
            limitText.setText(Html.fromHtml(nextInspection));
        }

        return rowView;
    };
    /**
     *  Returns a string that describes the number of days
     *  between dateOne and dateTwo.
     *
     */

    public long getDateDiffString(Date dateOne, Date dateTwo)
    {
        long timeOne = dateOne.getTime();
        long timeTwo = dateTwo.getTime();
        long oneDay = 1000 * 60 * 60 * 24;
        long delta = (timeTwo - timeOne) / oneDay;

        if (delta > 0) {
            return delta;
        }
        else {
            delta *= -1;
            return delta;
        }
    }
}