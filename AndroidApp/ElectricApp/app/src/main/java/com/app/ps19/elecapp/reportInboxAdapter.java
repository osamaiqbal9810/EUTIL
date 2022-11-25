package com.app.ps19.elecapp;

import android.app.Activity;
import android.net.Uri;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.ArrayList;

public class reportInboxAdapter extends ArrayAdapter<String> {
    private final Activity context;
    private final ArrayList<String> maintitle;
    private final ArrayList<String> dateEntry;
    private final ArrayList<String> reportDetails;
    private final ArrayList<Uri> imgid;

    public reportInboxAdapter(Activity context, ArrayList<String> maintitle, ArrayList<String> dateEntry, ArrayList<String> reportDetails, ArrayList<Uri> imgid) {
        super(context, R.layout.report_inbox_row, maintitle);
        // TODO Auto-generated constructor stub

        this.context = context;
        this.maintitle = maintitle;
        this.dateEntry = dateEntry;
        this.reportDetails = reportDetails;
        this.imgid = imgid;

    }

    public View getView(int position, View view, ViewGroup parent) {
        LayoutInflater inflater = context.getLayoutInflater();
        View rowView = inflater.inflate(R.layout.report_inbox_row, null, true);

        ImageView imageView = (ImageView) rowView.findViewById(R.id.list_image);
        TextView titleText = (TextView) rowView.findViewById(R.id.reportTitle);
        TextView reportDetailsText = (TextView) rowView.findViewById(R.id.reportReportDetails);
        TextView reportDateText = (TextView) rowView.findViewById(R.id.reportDate);

        titleText.setText(maintitle.get(position));
        imageView.setImageURI(imgid.get(position));
        reportDateText.setText(dateEntry.get(position));
        reportDetailsText.setText(reportDetails.get(position));

        return rowView;

    }

    ;
}
