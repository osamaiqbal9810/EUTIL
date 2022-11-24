package com.app.ps19.scimapp;

import android.app.ProgressDialog;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;

import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.Shared.Utilities;
import com.app.ps19.scimapp.classes.RptTimeAndGPS;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import static com.app.ps19.scimapp.Shared.Globals.selectedJPlan;
import static com.app.ps19.scimapp.Shared.Globals.setLocale;
import static com.app.ps19.scimapp.TaskDetailActivity.getUriToResource;

public class ReportInboxActivity extends AppCompatActivity {
    ArrayList<String> mainTitle = new ArrayList<String>();
    ArrayList<String> dateEntry = new ArrayList<String>();
    ArrayList<String> reportDetails = new ArrayList<String>();
    ArrayList<Uri> listImage = new ArrayList<Uri>();
    ListView reportList;
    reportInboxAdapter reportAdapter;
    private ProgressDialog progress;
    private Handler msgHandler;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setLocale(this);
        setContentView(R.layout.activity_report_inbox);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbarReportInbox);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        setTitle(R.string.title_activity_report_inbox);
        mainTitle.add(getString(R.string.report_time_and_gps));
        mainTitle.add(getString(R.string.report_time_and_gps_map));
        //mainTitle.add(getResources().getString(R.string.report_template_sessions_title));
        listImage.add(getUriToResource(this, R.drawable.report_gps_icon));
        listImage.add(getUriToResource(this, R.drawable.report_time_icon));
        //listImage.add(getUriToResource(this, R.drawable.report_time_icon));
        String strSOD = getFormattedSOD();
        dateEntry.add(strSOD);
        dateEntry.add(strSOD);
        dateEntry.add(strSOD);
        reportDetails.add(getString(R.string.report_time_and_gps_detail));
        reportDetails.add(getString(R.string.report_time_and_gps_map_detail));
        //reportDetails.add(getString(R.string.report_template_session_detail));
        if(Globals.isTimpsApp()){
            if( selectedJPlan !=null && selectedJPlan.getTaskList().size()>0 && !selectedJPlan.getTaskList().get(0).isYardInspection()){
                mainTitle.add(getResources().getString(R.string.report_template_sessions_title));
                listImage.add(getUriToResource(this, R.drawable.report_time_icon));
                reportDetails.add(getString(R.string.report_template_session_detail));
            }
        }
        reportList = (ListView) findViewById(R.id.list_report_inbox);
        reportAdapter = new reportInboxAdapter(this, mainTitle, dateEntry, reportDetails, listImage);
        reportList.setAdapter(reportAdapter);
        reportList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            public void onItemClick(AdapterView<?> parent, View view,
                                    int position, long id) {
                if (position == 0) {
                    Intent intent = new Intent(ReportInboxActivity.this, ReportDetailActivity.class);
                    //intent.putExtra("Title", "Time & GPS Report");
                    intent.putExtra("Title", getString(R.string.report_time_and_gps));
                    startActivity(intent);
                } else if(position==1) {
                    /*
                    Intent intent = new Intent(ReportInboxActivity.this, ReportDetailActivity.class);
                    intent.putExtra("Title", "Inspection Report");
                    startActivity(intent);
                    */
                    //Toast.makeText(ReportInboxActivity.this,"Under Construction!",Toast.LENGTH_SHORT).show();
                    showTimeAndGpsReport();
                    //Intent intent = new Intent(ReportInboxActivity.this, RptTimeAndGpsActivity.class);
                    //intent.putExtra("Title", "Inspection Report");
                    //startActivity(intent);

                }else if (position==2){
                    Intent intent = new Intent(ReportInboxActivity.this, ReportWebViewActivity.class);
                    //intent.putExtra("Title", "Time & GPS Report");
                    intent.putExtra("reportId", "sessions");
                    startActivity(intent);

                }


            }
        });

        /*FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });*/
    }
    private void showTimeAndGpsReport(){
        if(msgHandler==null){

            progress = new ProgressDialog(this);
            progress.setTitle(getString(R.string.please_wait));
            progress.setMessage(getString(R.string.report_loading));
            progress.setCancelable(false);
            progress.setProgressStyle(ProgressDialog.STYLE_SPINNER);

            msgHandler=new Handler(){
                @Override
                public void handleMessage(Message msg) {

                    Intent mainIntent = new Intent(ReportInboxActivity.this, RptTimeAndGpsActivity.class);
                    startActivity(mainIntent);
                    progress.dismiss();
                    super.handleMessage(msg);
                }
            };

        }
        progress.show();
        new Thread() {
            public void run() {
                Globals.rptTimeAndGPS=new RptTimeAndGPS();
                msgHandler.sendEmptyMessage(0);
            }
        }.start();
    }
    private String getFormattedSOD() {
        //"yyyy-MM-dd'T'HH:mm:ss.SSS"
        if(Globals.SOD.equals("")){
            return "";
        }
        SimpleDateFormat sdf = new SimpleDateFormat("EEEE, MMM dd, yyyy");
        Date dtSOD= Utilities.ConvertToDateTime(Globals.SOD);
        return sdf.format(dtSOD);
    }

    @Override
    public boolean onSupportNavigateUp() {
        //code it to launch an intent to the activity you want
        finish();
        return true;
    }

}
