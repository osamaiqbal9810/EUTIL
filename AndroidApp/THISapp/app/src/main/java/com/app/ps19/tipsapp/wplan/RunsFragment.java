package com.app.ps19.tipsapp.wplan;

import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;

import android.text.Html;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.Toast;

import com.app.ps19.tipsapp.DashboardActivity;
import com.app.ps19.tipsapp.R;
import com.app.ps19.tipsapp.WorkPlanActivity;
import com.app.ps19.tipsapp.classes.JourneyPlanOpt;
import com.app.ps19.tipsapp.wpAdapter1;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;

import static android.app.Activity.RESULT_OK;
import static com.app.ps19.tipsapp.Shared.Globals.inbox;
import static com.app.ps19.tipsapp.Shared.Globals.selectedJPlan;
import static com.app.ps19.tipsapp.Shared.Globals.selectedUnit;
import static com.app.ps19.tipsapp.Shared.Globals.setLocale;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link RunsFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class RunsFragment extends Fragment {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    ListView lvWplan;
    //Inbox inbox;
    wpAdapter1 _wpAdapter;

    ProgressDialog progressDialog;
    ArrayList<JSONObject> _templateList;
    LinearLayout llNoInspection;
    View rootView;
    ArrayList<JourneyPlanOpt> journeyPlans;

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    public RunsFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment RunsFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static RunsFragment newInstance(String param1, String param2) {
        RunsFragment fragment = new RunsFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setLocale(getActivity());
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        rootView =  inflater.inflate(R.layout.fragment_runs, container, false);
        lvWplan = (ListView) rootView.findViewById(R.id.lvWPView);
        llNoInspection = (LinearLayout) rootView.findViewById(R.id.ll_no_plan);

        progressDialog= new ProgressDialog(getActivity());
        progressDialog.setTitle(getResources().getString(R.string.please_wait));
        progressDialog.setMessage(getResources().getString(R.string.loading_inspections_msg));
        progressDialog.setCancelable(false);
        progressDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
        progressDialog.show();

        setAdapter();

        lvWplan.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            public void onItemClick(AdapterView<?> parent, View view,
                                    final int position, long id) {
                try {
                    for(JourneyPlanOpt jp: journeyPlans){
                        if(_templateList.get(position).optString("code").equals(jp.getWorkplanTemplateId()) || _templateList.get(position).optString("code").equals("-1")){
                            Toast.makeText(getActivity(), getString(R.string.inspection_in_progress_toast),Toast.LENGTH_SHORT).show();
                            return;
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                String title = _templateList.get(position).optString("title");
                final String code = _templateList.get(position).optString("code");
                String branchInfoString = "";
                String prevInspection = "";
                if(selectedJPlan != null){
                    prevInspection = getString(R.string.inspection_in_progress_msg_part_1) +" "+ "<b><i>" + selectedJPlan.getTitle() +"</i></b>"+ " " + getString(R.string.inspection_in_progress_msg_part_2) + "<br>";
                }
                branchInfoString = prevInspection + getString(R.string.want_to_start_work_plan)+ " "+
                        "<b><i>" + title + "</i></b>" + " " + getString(R.string.previous_inspection_msg);
                new AlertDialog.Builder(getActivity())
                        .setTitle(getString(R.string.confirmation))
                        .setMessage(Html.fromHtml(branchInfoString))
                        .setIcon(android.R.drawable.ic_dialog_alert)
                        .setPositiveButton(R.string.btn_ok, new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int whichButton) {
                                Intent returnIntent = new Intent();
                                returnIntent.putExtra("Selection", "Yes");
                                returnIntent.putExtra("Position", position);
                                returnIntent.putExtra("Mode", "New");
                                returnIntent.putExtra("code",code);
                                //returnIntent.putExtra("StartMP", "");
                                getActivity().setResult(RESULT_OK, returnIntent);
                                selectedUnit = null;
                                getActivity().finish();
                            }
                        })
                        .setNegativeButton(R.string.btn_cancel, null).show();
            }

            // }
        });
        return rootView;
    }
    private void setAdapter(){
        new Thread(new Runnable() {
            @Override
            public void run() {
                _templateList=inbox.loadWokPlanTemplateList(getActivity());
                journeyPlans = inbox.getInProgressJourneyPlans();
                Collections.reverse(_templateList);
                _wpAdapter = new wpAdapter1(getActivity(), _templateList, journeyPlans);
                //_wpAdapter = new wpAdapter(WorkPlanActivity.this, inbox.getWorkPlanTemplates());
                getActivity().runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        lvWplan.setAdapter(_wpAdapter);
                        // If no workplan assigned
                        if(_templateList.size() == 0){
                            llNoInspection.setVisibility(View.VISIBLE);
                        } else {
                            llNoInspection.setVisibility(View.GONE);
                        }
                        progressDialog.dismiss();
                    }
                });
            }
        }).start();
    }
    public void refreshFragment(){
        setAdapter();
        //lvWplan.invalidateViews();
    }
    }
