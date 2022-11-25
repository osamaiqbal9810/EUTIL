package com.app.ps19.elecapp;

import android.app.Activity;
import android.text.Html;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import com.app.ps19.elecapp.classes.JourneyPlan;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

public class wpAdapter extends ArrayAdapter<JourneyPlan> {
    private final Activity context;
    private ArrayList<JourneyPlan> jPlans;
    SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");

    public wpAdapter(Activity context, ArrayList<JourneyPlan> jPlans) {
        super(context, R.layout.workplan_row, jPlans);
        // TODO Auto-generated constructor stub

        this.context = context;
        this.jPlans = jPlans;
    }
    private String getString(int resId){
        return this.context.getString(resId);
    }
    public View getView(int position, View view, ViewGroup parent) {
        LayoutInflater inflater = context.getLayoutInflater();
        View rowView = inflater.inflate(R.layout.workplan_row, null, true);

        TextView titleText = (TextView) rowView.findViewById(R.id.tvWPTitle);
        //ImageView imageView = (ImageView) rowView.findViewById(R.id.task_img);
        TextView limitText = (TextView) rowView.findViewById(R.id.tvWPlimit);
        TextView execText = (TextView) rowView.findViewById(R.id.tvWPlastExec);
        titleText.setText(jPlans.get(position).getTitle());
        //TODO: To be replaced with real date after finalizing changes
        //titleText.setText("WorkPlan Title");
        if(jPlans.get(position).getLastInspection().equals("")){
            execText.setText(Html.fromHtml("<i><b>"+getString(R.string.last_execution)+":</i></b> " + " ( N/A )"));
        } else {
            try {
                Date initDate = new Date();
                initDate = format.parse(jPlans.get(position).getLastInspection());
                String lastExec = "<i><b>"+getString(R.string.last_execution)+"</i></b> " + getDateDiffString(initDate, new Date()) + " "+ getString(R.string.days_ago);
                execText.setText(Html.fromHtml(lastExec));
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        if (jPlans.get(position).getNextDueDate().equals("")){
            String nextInspection = "<b><i> " + getString(R.string.next_inspection) +": </i></b>" + "( N/A )";
            limitText.setText(Html.fromHtml(nextInspection));
        } else {
            SimpleDateFormat _format = new SimpleDateFormat("yyyy-MM-dd");
            Date date = null;
            try {
                date = format.parse(jPlans.get(position).getNextDueDate());
            } catch (ParseException e) {
                e.printStackTrace();
            }
            String nextInspection = "<b><i> " + getString(R.string.next_inspection) + ": </i></b> " + _format.format(date);
            limitText.setText(Html.fromHtml(nextInspection));
        }

        //ImageView statusImg = (ImageView) rowView.findViewById(R.id.taskStatusIcon);

        /*AlphaAnimation blinkanimation = new AlphaAnimation(1, 0); // Change alpha from fully visible to invisible
        blinkanimation.setDuration(300); // duration - half a second
        blinkanimation.setInterpolator(new LinearInterpolator()); // do not alter animation rate
        blinkanimation.setRepeatCount(3); // Repeat animation infinitely
        blinkanimation.setRepeatMode(Animation.REVERSE);

        if (tasks.get(position).getStatus().equals(TASK_NOT_STARTED_STATUS) || tasks.get(position).getStatus().equals("")) {
            statusImg.setImageResource(R.drawable.not_started_txt);
            statusImg.startAnimation(blinkanimation);
        } else if (tasks.get(position).getStatus().equals(TASK_FINISHED_STATUS)) {
            statusImg.setImageResource(R.drawable.finished_txt);
        } else if (tasks.get(position).getStatus().equals(TASK_IN_PROGRESS_STATUS)) {
            //statusImg.setImageResource(R.drawable.ic_play_circle_outline_green_24dp);
            statusImg.setImageResource(R.drawable.started_txt);
            statusImg.startAnimation(blinkanimation);
        }
        Glide.with(context)
                .load(Globals.wsImgURL + tasks.get(position).getImageUrl())
                .error(R.drawable.no_image)
                .into(imageView);
        titleText.setText(tasks.get(position).getTitle());
        //imageView.setImageURI(Uri.parse(Globals.wsImgURL+tasks.get(position).getImageUrl()));
        subtitleText.setText(tasks.get(position).getDescription());
        detailsText.setText(tasks.get(position).getNotes());
        if (tasks.get(position).getStatus().equals(TASK_IN_PROGRESS_STATUS)) {
            isTaskStarted = true;
        }*/
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