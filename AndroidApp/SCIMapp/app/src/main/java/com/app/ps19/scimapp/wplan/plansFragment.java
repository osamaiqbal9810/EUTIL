package com.app.ps19.scimapp.wplan;

import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.text.Html;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.Toast;

import com.app.ps19.scimapp.R;
import com.app.ps19.scimapp.classes.JourneyPlan;
import com.app.ps19.scimapp.classes.JourneyPlanOpt;
import com.app.ps19.scimapp.classes.User;
import com.app.ps19.scimapp.wpAdapter1;
import com.app.ps19.scimapp.wplan.dummy.DummyContent;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;

import static android.app.Activity.RESULT_OK;
import static com.app.ps19.scimapp.Shared.Globals.WORK_PLAN_FINISHED_STATUS;
import static com.app.ps19.scimapp.Shared.Globals.inbox;
import static com.app.ps19.scimapp.Shared.Globals.selectedJPlan;
import static com.app.ps19.scimapp.Shared.Globals.selectedUnit;

/**
 * A fragment representing a list of Items.
 */
public class plansFragment extends Fragment {

    // TODO: Customize parameter argument names
    private static final String ARG_COLUMN_COUNT = "column-count";
    // TODO: Customize parameters
    private int mColumnCount = 1;
    ProgressDialog progressDialog;
    ArrayList<JourneyPlanOpt> journeyPlans;
    ListView lvWorkPlans;
    runInProgressAdapter runAdapter;
    User user;

    /**
     * Mandatory empty constructor for the fragment manager to instantiate the
     * fragment (e.g. upon screen orientation changes).
     */
    public plansFragment() {
    }

    // TODO: Customize parameter initialization
    @SuppressWarnings("unused")
    public static plansFragment newInstance(int columnCount) {
        plansFragment fragment = new plansFragment();
        Bundle args = new Bundle();
        args.putInt(ARG_COLUMN_COUNT, columnCount);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (getArguments() != null) {
            mColumnCount = getArguments().getInt(ARG_COLUMN_COUNT);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_plans_list, container, false);

        lvWorkPlans = (ListView) view.findViewById(R.id.lv_wplans_inprogress);

        progressDialog= new ProgressDialog(getContext());
        progressDialog.setTitle(getResources().getString(R.string.please_wait));
        progressDialog.setMessage(getResources().getString(R.string.loading_inspections_msg));
        progressDialog.setCancelable(false);
        progressDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
        progressDialog.show();
        journeyPlans = inbox.getInProgressJourneyPlans();
        new Thread(new Runnable() {
            @Override
            public void run() {
                Collections.reverse(journeyPlans);
                runAdapter = new runInProgressAdapter(getActivity(), journeyPlans);
                getActivity().runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        if(journeyPlans!=null){
                            lvWorkPlans.setAdapter(runAdapter);
                        }
                        progressDialog.dismiss();

                    }
                });
            }
        }).start();

        lvWorkPlans.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            public void onItemClick(AdapterView<?> parent, View view,
                                    final int position, long id) {

                if(selectedJPlan == null){
                    String title= journeyPlans.get(position).getTitle();
                    final String code= journeyPlans.get(position).getCode();
                    String branchInfoString = getString(R.string.switching_inspection_msg2_part_1)+ " "+  "<b><i>"+ title + "</i></b>"+ "<br>" + getString(R.string.switching_inspection_msg2_part_2);
                    new AlertDialog.Builder(getActivity())
                            .setTitle(getString(R.string.confirmation))
                            .setMessage(Html.fromHtml(branchInfoString))
                            .setIcon(android.R.drawable.ic_dialog_alert)
                            .setPositiveButton(R.string.btn_ok, new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int whichButton) {

                                    Intent returnIntent = new Intent();
                                    returnIntent.putExtra("Selection", "Yes");
                                    returnIntent.putExtra("Position", position);
                                    returnIntent.putExtra("Mode", "Switch");
                                    returnIntent.putExtra("code",code);
                                    getActivity().setResult(RESULT_OK, returnIntent);
                                    selectedUnit = null;
                                    getActivity().finish();
                                }
                            })
                            .setNegativeButton(R.string.btn_cancel, null).show();
                } else {
                    String jId;
                    String jIdToMatch;
                    if(journeyPlans.get(position).getId().equals("")){
                        jId = journeyPlans.get(position).getPrivateKey();
                        jIdToMatch = selectedJPlan.getPrivateKey();
                    } else {
                        jId = journeyPlans.get(position).getId();
                        jIdToMatch = selectedJPlan.getId();
                    }
                    if(jId.equals(jIdToMatch)){
                        String alreadyInProgressMsg = getString(R.string.inspection_in_progress_toast);
                        Toast.makeText(getContext(), alreadyInProgressMsg, Toast.LENGTH_SHORT).show();
                    } else {


                        String title= journeyPlans.get(position).getTitle();
                        final String code= journeyPlans.get(position).getCode();
                        String branchInfoString = getString(R.string.switching_inspection_msg_part_1)+ " " +  "<b><i>"+ selectedJPlan.getTitle()+ "</i></b>"+"<br>" + getString(R.string.switching_inspection_msg_part_2)+ " "+ "<b><i>"+ title + "</i></b>"+ "<br>" + getString(R.string.switching_inspection_msg_part_3);
                        if(selectedJPlan.getStatus().equals(WORK_PLAN_FINISHED_STATUS)){
                            branchInfoString = getString(R.string.switching_inspection_msg2_part_1)+ " " + "<b><i>"+ title + "</i></b>"+ "<br>" + getString(R.string.switching_inspection_msg2_part_2);
                        }
                        new AlertDialog.Builder(getActivity())
                                .setTitle(getString(R.string.confirmation))
                                .setMessage(Html.fromHtml(branchInfoString))
                                .setIcon(android.R.drawable.ic_dialog_alert)
                                .setPositiveButton(R.string.btn_ok, new DialogInterface.OnClickListener() {
                                    public void onClick(DialogInterface dialog, int whichButton) {

                                        Intent returnIntent = new Intent();
                                        returnIntent.putExtra("Selection", "Yes");
                                        returnIntent.putExtra("Position", position);
                                        returnIntent.putExtra("Mode", "Switch");
                                        returnIntent.putExtra("code",code);
                                        getActivity().setResult(RESULT_OK, returnIntent);
                                        selectedUnit = null;
                                        getActivity().finish();
                                    }
                                })
                                .setNegativeButton(R.string.btn_cancel, null).show();
                    }
                }

            }
        });
        return view;
    }
    public void refreshFragment(){

    }
}