package com.app.ps19.tipsapp.defects;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.net.Uri;
import android.preference.PreferenceManager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseExpandableListAdapter;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.app.ps19.tipsapp.R;
import com.app.ps19.tipsapp.ReportAddActivity;
import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.classes.Report;
import com.squareup.picasso.Picasso;

import java.io.File;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;

import static android.view.View.GONE;
import static android.view.View.VISIBLE;
import static com.app.ps19.tipsapp.Shared.Globals.appName;
import static com.app.ps19.tipsapp.Shared.Globals.selectedJPlan;
import static com.app.ps19.tipsapp.Shared.Globals.setSelectedTask;
import static com.app.ps19.tipsapp.Shared.Utilities.getImgPath;

/**
 * Created by zqureshi on 01/07/2021.
 */
public class recentDefectsAdapter extends BaseExpandableListAdapter {

    private Context context;
    private ArrayList<Report> issuesList = new ArrayList<>();
    private static final String CHARACTER_OFFSET = "        ";
    private boolean gotoReportView = false;

    public recentDefectsAdapter(Context context, ArrayList<Report> issuesList) {
        this.context = context;
        this.issuesList.clear();
        this.issuesList.addAll(issuesList);

    }

    @Override
    public Report getChild(int groupPosition, int childPosition) {
        return issuesList.get(groupPosition);
    }

    @Override
    public long getChildId(int groupPosition, int childPosition) {
        return childPosition;
    }


    @Override
    public View getChildView(int groupPosition, int childPosition, boolean isLastChild,
                             View view, ViewGroup parent) {
        if (view == null) {
            LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            view = inflater.inflate(R.layout.recent_defect_child_item, null);
        }
        view.setBackgroundColor(Color.parseColor("#EBEBEB"));


        Report issue = getChild(groupPosition, childPosition);
        TextView titleText = (TextView) view.findViewById(R.id.reportTitle);
        ImageView imageView = (ImageView) view.findViewById(R.id.list_image);

        TextView tvDesc = (TextView) view.findViewById(R.id.tv_issue_description);
        TextView tvIssueType = (TextView) view.findViewById(R.id.tv_issue_type);
        TextView tvRule = (TextView) view.findViewById(R.id.tv_issue_rule);
        TextView tvNotesCount = (TextView) view.findViewById(R.id.tv_issue_notes_count);
        TextView tvPhotosCount = (TextView) view.findViewById(R.id.tv_issue_photos_count);

        ImageView openIssueDetails = view.findViewById(R.id.img_show_report);

        openIssueDetails.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                onRecentIssueSelected(context, groupPosition);
            }
        });

        if(!issue.getTitle().equals("")){
            titleText.setText(issue.getTitle());
        } else {
            // titleText.setText(issue.getDescription());
            titleText.setText("(no title)");
        }
        tvDesc.setText(issue.getDescription());
        if(issue.getIssueType().equals(Globals.DEFECT_TYPE)){
            String type =  context.getResources().getString(R.string.defect_text) + CHARACTER_OFFSET;
            tvIssueType.setText(type);
        } else if(issue.getIssueType().equals(Globals.DEFICIENCY_TYPE)){
            tvIssueType.setText(context.getResources().getString(R.string.deficiency_text));
        }
        if(appName.equals(Globals.AppName.TIMPS)){
            if(issue.isRuleApplied()){
                tvRule.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_check_box_black_24dp,0,0,0);
            } else {
                tvRule.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_check_box_outline_blank_black_24dp,0,0,0);
            }
        }
        if(issue.getVoiceList().size() > 0 ){
            tvNotesCount.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_baseline_mic_24_purple,0,0,0);
            tvNotesCount.setText(String.valueOf(issue.getVoiceList().size()));
        } else {
            tvNotesCount.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_baseline_mic_off_24,0,0,0);
            tvNotesCount.setText("0");
        }
        if(issue.getImgList().size() > 0) {
            tvPhotosCount.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_baseline_photo_library_24_green,0,0,0);
            tvPhotosCount.setText(String.valueOf(issue.getImgList().size()));
        } else {
            tvPhotosCount.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_photo_library_gray_24dp,0,0,0);
            tvPhotosCount.setText("0");
        }

        Bitmap bitmap=null;

        try {
            String url = "";
            Uri uri;
            if (issue.getImgList().size() == 0) {
                Picasso.get()
                        .load(R.drawable.no_image)
                        .placeholder(R.drawable.no_image)
                        .error(R.drawable.no_image)
                        .into(imageView);
            } else {
                uri = Uri.fromFile(new File(getImgPath(issue.getImgList().get(issue.getImgList().size() - 1).getImgName())));
                Picasso.get()
                        .load(uri)
                        .resize(150, 150)
                        .placeholder(R.drawable.no_image)
                        .error(R.drawable.no_image)
                        .into(imageView);
            }} catch (Exception e) {
            e.printStackTrace();
        }
        return view;
    }

    private void onRecentIssueSelected(Context ctx, int position){
        try {
            if (Globals.selectedJPlan != null && Globals.selectedJPlan.getTaskList() != null) {
                if (Globals.selectedJPlan.getTaskList().size() == 1) {
                    setSelectedTask(selectedJPlan.getTaskList().get(0));
                }
            }

            Globals.selectedReportIndex = position;
            Globals.selectedReport = RecentIssuesFragment.selectedIssue;
            Globals.newReport = null;
            Globals.selectedCategory = "TASK_FINISHED_STATUS";
               /* if (Globals.selectedTask.getStatus().equals(TASK_FINISHED_STATUS)) {
                    Intent viewMode = new Intent(context, ReportViewActivity.class);
                    startActivity(viewMode);
                } else {*/
            Intent intent = new Intent(ctx, ReportAddActivity.class);
            ((Activity) ctx).startActivityForResult(intent, RecentIssuesFragment.SECOND_ACTIVITY_REQUEST_CODE);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @Override
    public int getChildrenCount(int groupPosition) {

        //Report productList = issuesList.get(groupPosition);
        return 1;

    }

    @Override
    public Object getGroup(int groupPosition) {
        return issuesList.get(groupPosition);
    }

    @Override
    public int getGroupCount() {
        return issuesList.size();
    }

    @Override
    public long getGroupId(int groupPosition) {
        return groupPosition;
    }

    @Override
    public View getGroupView(int groupPosition, boolean isLastChild, View view,
                             ViewGroup parent) {
        if (view == null) {
            LayoutInflater inf = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            view = inf.inflate(R.layout.recent_defect_parent_item, null);
        }
        Report issue = (Report) getGroup(groupPosition);
        TextView tvStartMP = view.findViewById(R.id.tv_start_mp);
        TextView tvEndMP = view.findViewById(R.id.tv_end_mp);
        TextView tvMpDivider = view.findViewById(R.id.tv_divider);
        TextView tvTitle = view.findViewById(R.id.tv_issue_title);
        TextView tvDate = view.findViewById(R.id.tv_date_time);
        LinearLayout llMarkerContainer = view.findViewById(R.id.ll_marker_container);
        LinearLayout llMpContainer = view.findViewById(R.id.ll_number_mp_container);
        TextView tvMarkerStart = view.findViewById(R.id.tv_marker_start);
        TextView tvMarkerEnd = view.findViewById(R.id.tv_marker_end);

        DateFormat df = new SimpleDateFormat(Globals.defaultDateFormat, Locale.getDefault());
        try {
            Date dtt = df.parse(issue.getTimeStampFormatted());
            SimpleDateFormat sm = new SimpleDateFormat("MMM-dd-yyyy", Locale.getDefault());

            String strDate = sm.format(dtt);
            tvDate.setText(strDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        if(issue.getUnit().getAssetTypeObj().isMarkerMilepost()){
            llMarkerContainer.setVisibility(VISIBLE);
            llMpContainer.setVisibility(GONE);
            tvMarkerStart.setText(issue.getStartMarker());
            tvMarkerEnd.setText(issue.getEndMarker());
        } else {
            llMarkerContainer.setVisibility(GONE);
            llMpContainer.setVisibility(VISIBLE);
            tvStartMP.setText(issue.getStartMp());
            tvEndMP.setText(issue.getEndMp());
        }

        tvTitle.setText(issue.getTitle());


        return view;
    }

    @Override
    public boolean hasStableIds() {
        return true;
    }

    @Override
    public boolean isChildSelectable(int groupPosition, int childPosition) {
        return true;
    }

}