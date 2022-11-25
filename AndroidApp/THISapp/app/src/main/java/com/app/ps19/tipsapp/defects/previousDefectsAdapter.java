package com.app.ps19.tipsapp.defects;

import android.content.Context;
import android.graphics.Color;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseExpandableListAdapter;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.app.ps19.tipsapp.R;
import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.classes.UnitsDefectsOpt;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;

import static android.view.View.GONE;
import static android.view.View.VISIBLE;
import static com.app.ps19.tipsapp.Shared.Globals.appName;
import static com.app.ps19.tipsapp.Shared.Globals.getPrefixMp;

public class previousDefectsAdapter extends BaseExpandableListAdapter {

    private Context context;
    private ArrayList<UnitsDefectsOpt> prevDefects;

    public previousDefectsAdapter(Context context, ArrayList<UnitsDefectsOpt> issuesList) {
        this.context = context;
        this.prevDefects = issuesList;
    }

    @Override
    public UnitsDefectsOpt getChild(int groupPosition, int childPosition) {
        return prevDefects.get(groupPosition);
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

        UnitsDefectsOpt defect = getChild(groupPosition, childPosition);

        TextView titleText = (TextView) view.findViewById(R.id.reportTitle);
        ImageView imageView = (ImageView) view.findViewById(R.id.list_image);
        ImageView imageShowReport = (ImageView) view.findViewById(R.id.img_show_report);
        LinearLayout ll_symbols = (LinearLayout) view.findViewById(R.id.ll_symbols);
        imageView.setVisibility(View.GONE);
        ll_symbols.setVisibility(View.GONE);
        imageShowReport.setVisibility(View.GONE);

        TextView tvDesc = (TextView) view.findViewById(R.id.tv_issue_description);

        titleText.setEllipsize(TextUtils.TruncateAt.END);
        titleText.setMaxLines(2);

        if(!defect.getDescription().equals("")){
            titleText.setText(defect.getDescription());
        } else {
            titleText.setText("(N/A)");
        }



        DateFormat df = new SimpleDateFormat(Globals.defaultDateFormat, Locale.getDefault());
        try {
            Date dtt = df.parse(defect.getTimeStamp());
            SimpleDateFormat sm = new SimpleDateFormat("MMM-dd-yyyy  hh:mm:ss aa", Locale.getDefault());

            String strDate = sm.format(dtt);
            String issueCreationDate = context.getResources().getString(R.string.created_at) +  strDate;
            tvDesc.setText(issueCreationDate);

        } catch (ParseException e) {
            e.printStackTrace();
        }

        return view;
    }

    @Override
    public int getChildrenCount(int groupPosition) {
        return 1;
    }

    @Override
    public UnitsDefectsOpt getGroup(int groupPosition) {
        return prevDefects.get(groupPosition);
    }

    @Override
    public int getGroupCount() {
        return prevDefects.size();
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
        UnitsDefectsOpt issue = (UnitsDefectsOpt) getGroup(groupPosition);
        TextView tvStartMP = view.findViewById(R.id.tv_start_mp);
        TextView tvEndMP = view.findViewById(R.id.tv_end_mp);
        TextView tvTitle = view.findViewById(R.id.tv_issue_title);
        TextView tvDate = view.findViewById(R.id.tv_date_time);
        LinearLayout llMarkerContainer = view.findViewById(R.id.ll_marker_container);
        LinearLayout llMpContainer = view.findViewById(R.id.ll_number_mp_container);
        TextView tvMarkerStart = view.findViewById(R.id.tv_marker_start);
        TextView tvMarkerEnd = view.findViewById(R.id.tv_marker_end);
        llMarkerContainer.setVisibility(GONE);
        String formattedDate = issue.getTimeStamp();
        DateFormat df = new SimpleDateFormat(Globals.defaultDateFormat, Locale.getDefault());
        try {
            Date dtt = df.parse(formattedDate);
            SimpleDateFormat sm = new SimpleDateFormat("MMM-dd-yyyy", Locale.getDefault());

            String strDate = sm.format(dtt);
            tvDate.setText(strDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        if(issue.getStartMP().equals("") && issue.getEndMP().equals("")){
            llMarkerContainer.setVisibility(VISIBLE);
            llMpContainer.setVisibility(GONE);
            tvMarkerStart.setText(getPrefixMp(issue.getStartMarker()));
            tvMarkerEnd.setText(getPrefixMp(issue.getEndMarker()));
        } else {
            llMarkerContainer.setVisibility(GONE);
            llMpContainer.setVisibility(VISIBLE);
            tvStartMP.setText(getPrefixMp(issue.getStartMP()));
            tvEndMP.setText(getPrefixMp(issue.getEndMP()));
        }
        if(appName.equals(Globals.AppName.EUIS)){
            llMarkerContainer.setVisibility(GONE);
            llMpContainer.setVisibility(GONE);
        }
        //tvStartMP.setText(issue.getStartMP());
        //tvEndMP.setText(issue.getEndMP());
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
