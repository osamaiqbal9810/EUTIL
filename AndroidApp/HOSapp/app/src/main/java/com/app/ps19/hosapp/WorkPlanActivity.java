package com.app.ps19.hosapp;

import android.content.DialogInterface;
import android.content.Intent;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.text.Html;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;

import static com.app.ps19.hosapp.Shared.Globals.inbox;


public class WorkPlanActivity extends AppCompatActivity {
    ListView lvWplan;
    //Inbox inbox;
    wpAdapter _wpAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_work_plan);
        setTitle(R.string.select_work_plan);

        lvWplan = (ListView) findViewById(R.id.lvWPView);
        inbox.loadWorkPlanTemplates(WorkPlanActivity.this);
         _wpAdapter = new wpAdapter(this, inbox.getWorkPlanTemplates());
        lvWplan.setAdapter(_wpAdapter);
        lvWplan.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            public void onItemClick(AdapterView<?> parent, View view,
                                    final int position, long id) {
               /* //Date currentDate = new Date();
                //SimpleDateFormat _format = new SimpleDateFormat("dd MMMM yyyy");
                //   if (_format.format(currentDate).equals(Globals.selectedJPlan.getDate())) {
             //   Globals.selectedTask = Globals.selectedJPlan.getTaskList().get(position);
                //Intent intent = new Intent(InboxActivity.this, TaskActivity.class);
                Intent intent = new Intent(InboxActivity.this, TaskDashboardActivity.class);
                startActivity(intent);*/
             /*   } else {
                    Snackbar.make(view, "Please select a Plan from Today's list", Snackbar.LENGTH_LONG)
                            .setAction("Action", null).show();
                }*/
                String branchInfoString = getString(R.string.want_to_start_work_plan)+" \n" +
                        "<b><i>" + inbox.getWorkPlanTemplates().get(position).getTitle() + "</i></b>" + "\n"+getString(R.string.work_plan)+"?";
                new AlertDialog.Builder(WorkPlanActivity.this)
                        .setTitle(getString(R.string.confirmation))
                        .setMessage(Html.fromHtml(branchInfoString))
                        .setIcon(android.R.drawable.ic_dialog_alert)
                        .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int whichButton) {
                                //Toast.makeText(MainActivity.this, "Successfully Stopped", Toast.LENGTH_SHORT).show();
                                /*if (!loadCurrentLocation()) {
                                    Toast.makeText(MainActivity.this,"Please enable GPS, Try again",Toast.LENGTH_SHORT).show();
                                    return ;
                                }
                                new Thread(new Runnable() {
                                    @Override
                                    public void run() {
                                        endSession();
                                    }
                                }).start();*/
                                Intent returnIntent = new Intent();
                                returnIntent.putExtra("Selection", "Yes");
                                returnIntent.putExtra("Position", position);
                                setResult(RESULT_OK, returnIntent);
                                finish();
                            }
                        })
                        .setNegativeButton(android.R.string.no, null).show();
            }
        });
    }
}
