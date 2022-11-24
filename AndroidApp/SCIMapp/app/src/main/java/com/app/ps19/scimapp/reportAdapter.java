package com.app.ps19.scimapp;


import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.net.Uri;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.classes.Report;
import com.squareup.picasso.Picasso;

import org.w3c.dom.Text;

import java.io.File;
import java.util.ArrayList;

import static com.app.ps19.scimapp.Shared.Globals.appName;
import static com.app.ps19.scimapp.Shared.Globals.setLocale;
import static com.app.ps19.scimapp.Shared.Utilities.getImgPath;

public class reportAdapter extends ArrayAdapter<Report> {
    private final Activity context;
    private final ArrayList<Report> reportList;
    private final String type;/*
    private final ArrayList<String> marked;
    private final ArrayList<String> location;
    private final ArrayList<Uri> imgid;*/
    private static final String PRIORITY_HIGH_TXT = "High";
    private static final String PRIORITY_MEDIUM_TXT = "Medium";
    private static final String PRIORITY_LOW_TXT = "Low";
    private static final String PRIORITY_INFO_TXT = "Info";
    private static final String CHARACTER_OFFSET = "        ";

    public reportAdapter(Activity context, ArrayList<Report> reportList, String type) {
        super(context, R.layout.report_row_new, reportList);
        // TODO Auto-generated constructor stub
        setLocale(context);

        this.context = context;
        this.reportList = reportList;
        this.type = type;

    }

    public View getView(int position, View view, ViewGroup parent) {
        position = getCount() - 1 - position;
        LayoutInflater inflater = context.getLayoutInflater();
        View rowView = inflater.inflate(R.layout.report_row_new, null, true);

        TextView titleText = (TextView) rowView.findViewById(R.id.reportTitle);
        ImageView imageView = (ImageView) rowView.findViewById(R.id.list_image);
        ImageView markedImg = (ImageView) rowView.findViewById(R.id.markedImg);
        ImageView priorityImg = (ImageView) rowView.findViewById(R.id.priorityImg);
        TextView priorityText = (TextView) rowView.findViewById(R.id.priorityTxt);
        TextView markedText = (TextView) rowView.findViewById(R.id.markedTxt);
        TextView latTxt = (TextView) rowView.findViewById(R.id.reportLatTxt);
        TextView longTxt = (TextView) rowView.findViewById(R.id.reportLongTxt);

        TextView tvDesc = (TextView) rowView.findViewById(R.id.tv_issue_description);
        TextView tvIssueType = (TextView) rowView.findViewById(R.id.tv_issue_type);
        TextView tvRule = (TextView) rowView.findViewById(R.id.tv_issue_rule);
        TextView tvNotesCount = (TextView) rowView.findViewById(R.id.tv_issue_notes_count);
        TextView tvPhotosCount = (TextView) rowView.findViewById(R.id.tv_issue_photos_count);

        //Splitting String to get latitude and longitude
        /*String[] parts = reportList.get(position).getLocation().split(",");
        String latitudeTxt = "";
        String longitudeTxt = "";
        if(parts.length == 1){
            latTxt.setText(latitudeTxt);
            longTxt.setText(longitudeTxt);
        } else {
            try {
                latitudeTxt = parts[0];
                longitudeTxt = parts[1];
                latTxt.setText(latitudeTxt);
                longTxt.setText(longitudeTxt);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }*/
        /*if(reportList.get(position).getMarked()){
            markedImg.setImageResource(R.drawable.asset_7);
            markedText.setTextColor(Color.parseColor("#47A722"));
        } else {
            markedImg.setImageResource(R.drawable.flag);
            markedText.setTextColor(Color.GRAY);
        }
        if (reportList.get(position).getPriority().equals(PRIORITY_HIGH_TXT)) {
            priorityImg.setImageResource(R.drawable.pin);
            priorityText.setTextColor(Color.parseColor("#c73d43"));
        } else if (reportList.get(position).getPriority().equals(PRIORITY_MEDIUM_TXT)) {
            priorityImg.setImageResource(R.drawable.pin_blue);
            priorityText.setTextColor(Color.parseColor("#0784DE"));
        } else if (reportList.get(position).getPriority().equals(PRIORITY_LOW_TXT)) {
            priorityImg.setImageResource(R.drawable.pin_blue);
            priorityText.setTextColor(Color.GRAY);
        } else if (reportList.get(position).getPriority().equals(PRIORITY_INFO_TXT)) {
            priorityImg.setImageResource(R.drawable.pin_blue);
            priorityText.setTextColor(Color.GRAY);
        }*/
        if(!reportList.get(position).getTitle().equals("")){
            titleText.setText(reportList.get(position).getTitle());
        } else {
            // titleText.setText(reportList.get(position).getDescription());
            titleText.setText("(no title)");
        }
        tvDesc.setText(reportList.get(position).getDescription());
        if(reportList.get(position).getIssueType().equals(Globals.DEFECT_TYPE)){
            String type =  getContext().getResources().getString(R.string.defect_text) + CHARACTER_OFFSET;
            tvIssueType.setText(type);
        } else if(reportList.get(position).getIssueType().equals(Globals.DEFICIENCY_TYPE)){
            tvIssueType.setText(getContext().getResources().getString(R.string.deficiency_text));
        }
        if(appName.equals(Globals.AppName.TIMPS)){
            if(reportList.get(position).isRuleApplied()){
                tvRule.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_check_box_black_24dp,0,0,0);
            } else {
                tvRule.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_check_box_outline_blank_black_24dp,0,0,0);
            }
        }
        if(reportList.get(position).getVoiceList().size() > 0 ){
            tvNotesCount.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_baseline_mic_24_purple,0,0,0);
            tvNotesCount.setText(String.valueOf(reportList.get(position).getVoiceList().size()));
        } else {
            tvNotesCount.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_baseline_mic_off_24,0,0,0);
            tvNotesCount.setText("0");
        }
        if(reportList.get(position).getImgList().size() > 0) {
            tvPhotosCount.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_baseline_photo_library_24_green,0,0,0);
            tvPhotosCount.setText(String.valueOf(reportList.get(position).getImgList().size()));
        } else {
            tvPhotosCount.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_photo_library_gray_24dp,0,0,0);
            tvPhotosCount.setText("0");
        }

        Bitmap bitmap=null;

        try {
            String url = "";
            Uri uri;
            if (reportList.get(position).getImgList().size() == 0) {
                Picasso.get()
                        .load(R.drawable.no_image)
                        .placeholder(R.drawable.no_image)
                        .error(R.drawable.no_image)
                        .into(imageView);
            } else {
                uri = Uri.fromFile(new File(getImgPath(reportList.get(position).getImgList().get(reportList.get(position).getImgList().size()-1).getImgName())));
                Picasso.get()
                        .load(uri)
                        .resize(150, 150)
                        .placeholder(R.drawable.no_image)
                        .error(R.drawable.no_image)
                        .into(imageView);
            /*if (reportList.get(position).getImgList().size() == 0) {
                Picasso.get()
                        .load(R.drawable.no_image)
                        .placeholder(R.drawable.no_image)
                        .error(R.drawable.no_image)
                        .into(imageView);
            } else {
                //url = getImgPath(reportList.get(position).getImgList().get(0).getImgName());
                Uri uri = Uri.fromFile(new File(getImgPath(reportList.get(position).getImgList().get(0).getImgName())));

                File _file = new File(getImgPath(reportList.get(position).getImgList().get(0).getImgName()));
                if(_file.exists()){

                } else {
                    Utilities.makeImageAvailableEx(context,imageView,reportList.get(position).getImgList().get(0).getImgName());
                }

                Picasso.get()
                        .load(uri)
                        .placeholder(R.drawable.no_image)
                        .error(R.drawable.no_image)
                        .into(imageView);
            }*/
                // getImageFromSDCard(context, reportList.get(position).getImgList().get(0).getImgName());

            /*
            if (reportList.get(position).getImgList().size() == 0) {
                bitmap = MediaStore.Images.Media.getBitmap(context.getContentResolver(), getUriToResource(context, R.drawable.no_image));
            } else {
                //bitmap = getImageFromSDCard(context, reportList.get(position).getImgList().get(0).getImgName());//bitmap = MediaStore.Images.Media.getBitmap(context.getContentResolver(), Uri.parse(getImgPath(reportList.get(position).getImgList().get(0).getImgName())));
                Utilities.makeImageAvailableEx(context,imageView,reportList.get(position).getImgList().get(0).getImgName());
            }
            if(bitmap !=null) {
                Picasso.get()
                        .load(reportList.get(position).getImgList().get(0).getImgName())
                        .resize(50, 50)
                        .centerCrop()
                        .into(imageView);
               *//* Bitmap thumbBitmap = ThumbnailUtils.extractThumbnail(bitmap, 120, 120);
                // imageView.setImageBitmap(thumbBitmap);
                imageView.setImageBitmap(thumbBitmap);*//*
                bitmap.recycle();
            }*/
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        //priorityText.setText(reportList.get(position).getPriority());
        //markedText.setText(marked.get(position));
        return rowView;
    }
}

;
