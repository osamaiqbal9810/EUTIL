package com.app.ps19.hosapp;

import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.ArrayList;

public class reportDetailAdapter extends ArrayAdapter<String> {
    private final Activity context;
    private final ArrayList<String> maintitle;
    private final ArrayList<String> dateEntry;
    private final ArrayList<String> status;

    public reportDetailAdapter(Activity context, ArrayList<String> maintitle, ArrayList<String> dateEntry, ArrayList<String> status) {
        super(context, R.layout.report_detail_row, maintitle);
        // TODO Auto-generated constructor stub

        this.context = context;
        this.maintitle = maintitle;
        this.dateEntry = dateEntry;
        this.status = status;

    }

    public View getView(int position, View view, ViewGroup parent) {
        LayoutInflater inflater = context.getLayoutInflater();
        View rowView = inflater.inflate(R.layout.report_detail_row, null, true);

        TextView titleText = (TextView) rowView.findViewById(R.id.unitTitle);
        TextView unitTimeTxt = (TextView) rowView.findViewById(R.id.unitTime);
        TextView unitStatusTxt = (TextView) rowView.findViewById(R.id.unitStatus);
        titleText.setText(maintitle.get(position));
        unitTimeTxt.setText(dateEntry.get(position));
        unitStatusTxt.setText(status.get(position));
        //markedText.setText(marked.get(position));

        return rowView;

    }

    ;
}
