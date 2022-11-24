package com.app.ps19.hosapp;


import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.media.ThumbnailUtils;
import android.net.Uri;
import android.provider.MediaStore;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.app.ps19.hosapp.Shared.Utilities;
import com.app.ps19.hosapp.classes.Report;
import com.squareup.picasso.Picasso;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

import static com.app.ps19.hosapp.Shared.Globals.getUriToResource;
import static com.app.ps19.hosapp.Shared.Utilities.getImageFromSDCard;
import static com.app.ps19.hosapp.Shared.Utilities.getImgPath;

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

    public reportAdapter(Activity context, ArrayList<Report> reportList, String type) {
        super(context, R.layout.report_row, reportList);
        // TODO Auto-generated constructor stub

        this.context = context;
        this.reportList = reportList;
        this.type = type;

    }

    public View getView(int position, View view, ViewGroup parent) {
        LayoutInflater inflater = context.getLayoutInflater();
        View rowView = inflater.inflate(R.layout.report_row, null, true);

        TextView titleText = (TextView) rowView.findViewById(R.id.reportTitle);
        ImageView imageView = (ImageView) rowView.findViewById(R.id.list_image);
        ImageView markedImg = (ImageView) rowView.findViewById(R.id.markedImg);
        ImageView priorityImg = (ImageView) rowView.findViewById(R.id.priorityImg);
        TextView priorityText = (TextView) rowView.findViewById(R.id.priorityTxt);
        TextView markedText = (TextView) rowView.findViewById(R.id.markedTxt);
        TextView latTxt = (TextView) rowView.findViewById(R.id.reportLatTxt);
        TextView longTxt = (TextView) rowView.findViewById(R.id.reportLongTxt);
        //Splitting String to get latitude and longitude
        String[] parts = reportList.get(position).getLocation().split(",");
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
        }
        if(reportList.get(position).getMarked()){
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
        }
        titleText.setText(reportList.get(position).getDescription());
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
        priorityText.setText(reportList.get(position).getPriority());
        //markedText.setText(marked.get(position));
        return rowView;
    }
}

;
