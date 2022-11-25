package com.app.ps19.elecapp;

import static com.app.ps19.elecapp.Shared.Globals.appName;
import static com.app.ps19.elecapp.Shared.Utilities.getImgPath;

import android.app.Activity;
import android.graphics.Bitmap;
import android.net.Uri;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.app.ps19.elecapp.Shared.Globals;
import com.app.ps19.elecapp.classes.Report;
import com.squareup.picasso.Picasso;

import org.jetbrains.annotations.NotNull;

import java.io.File;
import java.util.ArrayList;

public class issueAdapter extends RecyclerView.Adapter<issueAdapter.MyViewHolder> {
    private final Activity context;
    private final ArrayList<Report> reportList;
    private static final String CHARACTER_OFFSET = "        ";


    public issueAdapter(Activity context, ArrayList<Report> reportList) {
        // TODO Auto-generated constructor stub
        this.context = context;
        this.reportList = reportList;
    }


    public static class MyViewHolder extends RecyclerView.ViewHolder {

        TextView titleText;
        ImageView imageView;
        TextView tvDesc;
        TextView tvIssueType;
        TextView tvRule;
        TextView tvNotesCount;
        TextView tvPhotosCount;
        public MyViewHolder(View view) {
            super(view);
             titleText = (TextView) view.findViewById(R.id.reportTitle);
             imageView = (ImageView) view.findViewById(R.id.list_image);

             tvDesc = (TextView) view.findViewById(R.id.tv_issue_description);
             tvIssueType = (TextView) view.findViewById(R.id.tv_issue_type);
             tvRule = (TextView) view.findViewById(R.id.tv_issue_rule);
             tvNotesCount = (TextView) view.findViewById(R.id.tv_issue_notes_count);
             tvPhotosCount = (TextView) view.findViewById(R.id.tv_issue_photos_count);
        }
    }


    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext()).inflate(R.layout.report_row_new, parent, false);

        return new MyViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(@NotNull final MyViewHolder holder, final int position) {

        if(!reportList.get(position).getTitle().equals("")){
            holder.titleText.setText(reportList.get(position).getTitle());
        } else {
            holder.titleText.setText("(no title)");
        }
        holder.tvDesc.setText(reportList.get(position).getDescription());
        if(reportList.get(position).getIssueType().equals(Globals.DEFECT_TYPE)){
            String type =  context.getResources().getString(R.string.defect_text) + CHARACTER_OFFSET;
            holder.tvIssueType.setText(type);
        } else if(reportList.get(position).getIssueType().equals(Globals.DEFICIENCY_TYPE)){
            holder.tvIssueType.setText(context.getResources().getString(R.string.deficiency_text));
        }
        if(appName.equals(Globals.AppName.TIMPS)){
            if(reportList.get(position).isRuleApplied()){
                holder.tvRule.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_check_box_black_24dp,0,0,0);
            } else {
                holder.tvRule.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_check_box_outline_blank_black_24dp,0,0,0);
            }
        }
        if(reportList.get(position).getVoiceList().size() > 0 ){
            holder.tvNotesCount.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_baseline_mic_24_purple,0,0,0);
            holder.tvNotesCount.setText(String.valueOf(reportList.get(position).getVoiceList().size()));
        } else {
            holder.tvNotesCount.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_baseline_mic_off_24,0,0,0);
            holder.tvNotesCount.setText("0");
        }
        if(reportList.get(position).getImgList().size() > 0) {
            holder.tvPhotosCount.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_baseline_photo_library_24_green,0,0,0);
            holder.tvPhotosCount.setText(String.valueOf(reportList.get(position).getImgList().size()));
        } else {
            holder.tvPhotosCount.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_photo_library_gray_24dp,0,0,0);
            holder.tvPhotosCount.setText("0");
        }

        Bitmap bitmap=null;

        String url = "";
        Uri uri;
        if (reportList.get(position).getImgList().size() == 0) {
            Picasso.get()
                    .load(R.drawable.no_image)
                    .placeholder(R.drawable.no_image)
                    .error(R.drawable.no_image)
                    .into(holder.imageView);
        } else {
            uri = Uri.fromFile(new File(getImgPath(reportList.get(position).getImgList().get(reportList.get(position).getImgList().size()-1).getImgName())));
            Picasso.get()
                    .load(uri)
                    .resize(150, 150)
                    .placeholder(R.drawable.no_image)
                    .error(R.drawable.no_image)
                    .into(holder.imageView);

        }

    }

    @Override
    public int getItemCount()
    {
        return reportList.size();
    }

    public int getPosition() {
        return 0;
    }
}
