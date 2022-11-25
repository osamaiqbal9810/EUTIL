package com.app.ps19.elecapp.wplan;

import static com.app.ps19.elecapp.R.string.started_at_title;
import static com.app.ps19.elecapp.R.string.status_plan_active_adapter;
import static com.app.ps19.elecapp.R.string.status_plan_in_progress_adapter;
import static com.app.ps19.elecapp.Shared.Globals.WORK_PLAN_FINISHED_STATUS;
import static com.app.ps19.elecapp.Shared.Globals.getBlinkAnimation;
import static com.app.ps19.elecapp.Shared.Globals.selectedJPlan;

import android.app.Activity;
import android.text.Html;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.app.ps19.elecapp.R;
import com.app.ps19.elecapp.classes.JourneyPlanOpt;

import java.text.DateFormat;
import java.util.ArrayList;
import java.util.Date;

public class runInProgressAdapter extends ArrayAdapter<JourneyPlanOpt> {
    private final Activity context;
    private ArrayList<JourneyPlanOpt> jPlans;
    public runInProgressAdapter(Activity context, ArrayList<JourneyPlanOpt> jPlans) {
        super(context, R.layout.fragment_plans_inprogress, jPlans);
        // TODO Auto-generated constructor stub

        this.context = context;
        this.jPlans = jPlans;
    }
    private String getString(int resId){
        return this.context.getString(resId);
    }
    public View getView(int position, View view, ViewGroup parent) {
        LayoutInflater inflater = context.getLayoutInflater();
        View rowView = inflater.inflate(R.layout.fragment_plans_inprogress, null, true);
        JourneyPlanOpt jPlan = jPlans.get(position);

        TextView titleText = (TextView) rowView.findViewById(R.id.tvWPTitle);
        ImageView ivStatus = (ImageView) rowView.findViewById(R.id.iv_inspection_status);
        TextView tvInspStatus = (TextView) rowView.findViewById(R.id.tv_inspection_status);
        TextView tvInspStartDate = (TextView) rowView.findViewById(R.id.tv_inspection_start_date);
        TextView tvInspIssueCount = (TextView) rowView.findViewById(R.id.tv_inspection_issue_count);
        String status = context.getString(status_plan_in_progress_adapter);
        if(selectedJPlan!=null){
            if(!selectedJPlan.getStatus().equals(WORK_PLAN_FINISHED_STATUS)){
                if(selectedJPlan.getId().equals("")){
                    if(selectedJPlan.getPrivateKey().equals(jPlan.getPrivateKey())){
                        status = context.getString(status_plan_active_adapter);
                        ivStatus.setImageResource(R.drawable.report_status);
                        ivStatus.startAnimation(getBlinkAnimation());
                    }
                } else {
                    if(jPlan.getId().equals(selectedJPlan.getId())){
                        status = context.getString(status_plan_active_adapter);
                        ivStatus.setImageResource(R.drawable.report_status);
                        ivStatus.startAnimation(getBlinkAnimation());
                    }
                }
            }
        }
        tvInspStatus.setText(Html.fromHtml(status));
        Date startDate = null;
        try {
            startDate = new Date(jPlan.getStartDateTime());
        } catch (Exception e) {
            e.printStackTrace();
        }
        String timeMsg = "N/A";
        if(startDate != null){
            timeMsg = "<b>" + context.getString(started_at_title) + "</b>" + DateFormat.getDateTimeInstance().format(startDate);
        }
        tvInspStartDate.setText(Html.fromHtml(timeMsg));
        String issueCountMsg = "<b>" + "Issue Count: " + "</b>" + "0"/*jPlan.loadJourneyPlan().getTaskList().get(0).getReportList().size()*/;
        //tvInspIssueCount.setText(Html.fromHtml(issueCountMsg));
        titleText.setText(jPlans.get(position).getTitle());

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