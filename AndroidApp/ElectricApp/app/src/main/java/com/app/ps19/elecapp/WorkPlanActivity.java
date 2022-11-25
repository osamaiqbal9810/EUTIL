package com.app.ps19.elecapp;

import static com.app.ps19.elecapp.Shared.Globals.inbox;
import static com.app.ps19.elecapp.Shared.Globals.selectedJPlan;
import static com.app.ps19.elecapp.Shared.Globals.selectedUnit;
import static com.app.ps19.elecapp.Shared.Globals.setLocale;

import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.text.Html;
import android.view.View;
import android.widget.AdapterView;
import android.widget.LinearLayout;
import android.widget.ListView;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import com.app.ps19.elecapp.Shared.ListMap;
import com.app.ps19.elecapp.classes.JourneyPlanOpt;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;


public class WorkPlanActivity extends AppCompatActivity {
    ListView lvWplan;
    //Inbox inbox;
    wpAdapter1 _wpAdapter;

    ProgressDialog progressDialog;
    ArrayList<JSONObject> _templateList;
    LinearLayout llNoInspection;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setLocale(this);
        setContentView(R.layout.activity_work_plan);
        setTitle(R.string.select_work_plan);

        lvWplan = (ListView) findViewById(R.id.lvWPView);
        llNoInspection = (LinearLayout) findViewById(R.id.ll_no_plan);

        progressDialog= new ProgressDialog(this);
        progressDialog.setTitle(getResources().getString(R.string.please_wait));
        progressDialog.setMessage(getResources().getString(R.string.loading_inspections_msg));
        progressDialog.setCancelable(false);
        progressDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
        progressDialog.show();
        //int count=db.getListItemCount(WPLAN_TEMPLATE_LIST_NAME,orgCode,"code<>''");
        //System.out.println("Total Template Count:" + count);
        //_templateList=inbox.loadWokPlanTemplateList(WorkPlanActivity.this);
        _templateList = (ArrayList<JSONObject>) ListMap.getListLookups().get(String.valueOf(ListMap.LIST_TEMPLATES));
        final ArrayList<JourneyPlanOpt> jps = inbox.getInProgressJourneyPlans();
        try {
            Collections.reverse(_templateList);
        } catch (Exception e) {
            e.printStackTrace();
        }
        new Thread(new Runnable() {
            @Override
            public void run() {
                //_templateList=inbox.loadWokPlanTemplateList(WorkPlanActivity.this);
                //Collections.reverse(_templateList);
                _wpAdapter = new wpAdapter1(WorkPlanActivity.this, _templateList, jps);
                //_wpAdapter = new wpAdapter(WorkPlanActivity.this, inbox.getWorkPlanTemplates());
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        lvWplan.setAdapter(_wpAdapter);
                        progressDialog.dismiss();
                        // If no workplan assigned
                        if(_templateList.size() == 0){
                            llNoInspection.setVisibility(View.VISIBLE);
                        } else {
                            llNoInspection.setVisibility(View.GONE);
                        }
                    }
                });
            }
        }).start();

        lvWplan.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            public void onItemClick(AdapterView<?> parent, View view,
                                    final int position, long id) {

                String title = _templateList.get(position).optString("title");
                final String code = _templateList.get(position).optString("code");
                String branchInfoString = "";
                String prevInspection = "";
                if(selectedJPlan != null){
                    prevInspection = "Inspection " + "<b><i>" + selectedJPlan.getTitle() +"</i></b>"+ " is currently in progress.\n";
                }
                   branchInfoString = prevInspection + getString(R.string.want_to_start_work_plan)+" \n" +
                            "<b><i>" + title + "</i></b>" + "\n"+getString(R.string.work_plan)+"?";
                    new AlertDialog.Builder(WorkPlanActivity.this)
                            .setTitle(getString(R.string.confirmation))
                            .setMessage(Html.fromHtml(branchInfoString))
                            .setIcon(android.R.drawable.ic_dialog_alert)
                            .setPositiveButton(R.string.btn_ok, new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int whichButton) {
                                    Intent returnIntent = new Intent();
                                    returnIntent.putExtra("Selection", "Yes");
                                    returnIntent.putExtra("Position", position);
                                    returnIntent.putExtra("code",code);
                                    //returnIntent.putExtra("StartMP", "");
                                    setResult(RESULT_OK, returnIntent);
                                    selectedUnit = null;
                                    finish();
                                }
                            })
                            .setNegativeButton(R.string.btn_cancel, null).show();
                }

           // }
        });
    }
}
