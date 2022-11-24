package com.app.ps19.scimapp;

import android.app.Activity;
import android.app.ProgressDialog;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;

import com.app.ps19.scimapp.classes.RptTimeAndGPS;

import java.util.ArrayList;

import static com.app.ps19.scimapp.Shared.Globals.setLocale;

public class ReportDetailActivity extends AppCompatActivity {
    ArrayList<String> mainTitle = new ArrayList<String>();
    ArrayList<String> dateEntry = new ArrayList<String>();
    ArrayList<String> status = new ArrayList<String>();
    ListView reportEventList;
    reportDetailAdapter detailAdapter;
    TimeAndGpsReportAdapter timeAndGpsReportAdapter;
    RptTimeAndGPS rptTimeAndGPS;
    TextView reportDate;

    ProgressDialog progressDialog;
    Handler msgHandler;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setLocale(this);
        setContentView(R.layout.activity_report_detail);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbarReportDetail);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);


        //rptTimeAndGPS=new RptTimeAndGPS();
        //region Static Data
        /*
        mainTitle.add("Inspection Unit 204");
        mainTitle.add("Inspection Unit 205");
        mainTitle.add("Inspection Unit 206");
        mainTitle.add("Inspection Unit 207");
        mainTitle.add("Inspection Unit 208");
        mainTitle.add("Inspection Unit 209");
        mainTitle.add("Inspection Unit 210");
        mainTitle.add("Inspection Unit 211");
        dateEntry.add("10:20AM");
        dateEntry.add("11:20AM");
        dateEntry.add("10:20AM");
        dateEntry.add("12:20PM");
        dateEntry.add("12:50PM");
        dateEntry.add("10:20AM");
        dateEntry.add("12:50PM");
        dateEntry.add("10:20AM");
        status.add("Started");
        status.add("Started");
        status.add("Completed");
        status.add("Started");
        status.add("Completed");
        status.add("Started");
        status.add("Started");
        status.add("Started");
        */
        //endregion
        setTitle(R.string.title_activity_report_inbox);
        TextView reportTitle = (TextView) findViewById(R.id.reportDetailTitle);
        String title = getIntent().getExtras().getString("Title");
        reportTitle.setText(title);

        reportDate= (TextView) findViewById(R.id.tvCurDate_crd);
        //reportDate.setText(rptTimeAndGPS.getCurSOD());

        reportEventList = (ListView) findViewById(R.id.reportEntry_crd);
        //detailAdapter = new reportDetailAdapter(this, mainTitle, dateEntry, status);
        //reportEventList.setAdapter(detailAdapter);

        msgHandler=new Handler(){
            @Override
            public void handleMessage(Message msg) {
                progressDialog.dismiss();
                super.handleMessage(msg);
            }
        };
        try {
            progressDialog= new ProgressDialog(getApplicationContext());
            progressDialog.setTitle(getString(R.string.please_wait));
            progressDialog.setMessage(getString(R.string.report_loading));
            progressDialog.setCancelable(false);
            progressDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
            progressDialog.show();
        } catch (Exception e) {
            e.printStackTrace();
        }


        new Thread() {
            public void run() {
                rptTimeAndGPS=new RptTimeAndGPS();
                ReportDetailActivity.this.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        refreshReportData();
                    }
                });
                msgHandler.sendEmptyMessage(0);
            }
        }.start();

        //timeAndGpsReportAdapter=new TimeAndGpsReportAdapter(this,rptTimeAndGPS.getEventArrayList());
        //reportEventList.setAdapter(timeAndGpsReportAdapter);



        /*FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });*/
    }
    private void refreshReportData(){

        reportDate.setText(rptTimeAndGPS.getCurSOD());
        timeAndGpsReportAdapter=new TimeAndGpsReportAdapter(this,rptTimeAndGPS.getEventArrayList());
        reportEventList.setAdapter(timeAndGpsReportAdapter);

    }

    @Override
    public boolean onSupportNavigateUp() {
        //code it to launch an intent to the activity you want
        finish();
        return true;
    }


    public class TimeAndGpsReportAdapter extends ArrayAdapter<RptTimeAndGPS.TimeEvent> {
        private final Activity context;
        private final ArrayList<RptTimeAndGPS.TimeEvent> eventArrayList;

        public TimeAndGpsReportAdapter(Activity context, ArrayList<RptTimeAndGPS.TimeEvent> eventArrayList) {
            super(context, R.layout.report_detail_row,eventArrayList);
            // TODO Auto-generated constructor stub
            this.context = context;
            this.eventArrayList=eventArrayList;

        }
        @Override
        public View getView(int position, View view, ViewGroup parent) {
            //LayoutInflater inflater = context.getLayoutInflater();
            RptTimeAndGPS.TimeEvent timeEvent=eventArrayList.get(position);
            View rowView=view;
            if(rowView == null) {
                //rowView=inflater.inflate(R.layout.report_detail_row, parent, false);
                rowView = LayoutInflater.from(getContext()).inflate(R.layout.report_detail_row, parent, false);
                view=rowView;
            }
            TextView titleText = (TextView) rowView.findViewById(R.id.unitTitle);
            TextView unitTimeTxt = (TextView) rowView.findViewById(R.id.unitTime);
            TextView unitStatusTxt = (TextView) rowView.findViewById(R.id.unitStatus);
            TextView latTxt =(TextView) rowView.findViewById(R.id.tvLat_rdr);
            TextView longTxt =(TextView) rowView.findViewById(R.id.tvLong_rdr);
            TextView locDescTxt=(TextView) rowView.findViewById(R.id.locationDesc_rdr);

            titleText.setText(timeEvent.description);
            unitTimeTxt.setText(timeEvent.timeText);
            unitStatusTxt.setText(timeEvent.status);
            latTxt.setText(timeEvent.latitude);
            longTxt.setText(timeEvent.longitude);
            locDescTxt.setText(timeEvent.locationDescription);
            //markedText.setText(marked.get(position));

            return rowView;

        }
    }


}
