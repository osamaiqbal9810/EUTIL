package com.app.ps19.hosapp;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.TextView;

import com.app.ps19.hosapp.Shared.Globals;
import com.app.ps19.hosapp.classes.Report;
import com.app.ps19.hosapp.classes.Task;

import static android.app.Activity.RESULT_OK;
import static com.app.ps19.hosapp.Shared.Globals.TASK_FINISHED_STATUS;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link IssueFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link IssueFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class IssueFragment extends Fragment{
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;
    public static final int SECOND_ACTIVITY_REQUEST_CODE = 0;
    public static final String ASSET_TYPE_ALL_TXT = "All";
    ListView reportList;
    Context context;
    // GPSTracker class
    GPSTracker gps;
    TextView taskTitle;
    TextView taskDesc;
    TextView taskNotes;
    TextView tvAddHelp;
    reportAdapter adapter;
    Task task;// = new Task(context);
    protected FragmentActivity mActivity;
    FloatingActionButton fab;

    private TextView mTextMessage;

    public IssueFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment IssueFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static IssueFragment newInstance(String param1, String param2) {
        IssueFragment fragment = new IssueFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        final View rootView = inflater.inflate(R.layout.fragment_issues, container, false);
        taskTitle = (TextView) rootView.findViewById(R.id.taskTitleTxt);
        taskDesc = (TextView) rootView.findViewById(R.id.taskDescTxt);
        taskNotes = (TextView) rootView.findViewById(R.id.taskNotesTxt);
        tvAddHelp = (TextView) rootView.findViewById(R.id.tvAddIssueHelp);

        mTextMessage = (TextView) rootView.findViewById(R.id.message);
        reportList = (ListView) rootView.findViewById(R.id.reportsList);
        fab = (FloatingActionButton) rootView.findViewById(R.id.fabAddIssue);
        context = rootView.getContext();
        task = new Task(context);

        tvAddHelp.setText(getString(R.string.press_add_button));
        taskTitle.setText(Globals.selectedTask.getTitle());
        taskDesc.setText(Globals.selectedTask.getDescription());
        taskNotes.setText(Globals.selectedTask.getNotes());
        //setAdapter(Globals.selectedUnit.getUnitId());

        String unitId = "";
        if(Globals.selectedUnit != null){
            unitId = Globals.selectedUnit.getUnitId();
        }
        if (unitId.equals(ASSET_TYPE_ALL_TXT)) {
            adapter = new reportAdapter(getActivity(), Globals.selectedTask.getReportList(), unitId);
        } else {
            adapter = new reportAdapter(getActivity(), Globals.selectedTask.getFilteredReports(unitId), unitId);
        }
        reportList.setAdapter(adapter);

        if (Globals.selectedTask.getStatus().equals(TASK_FINISHED_STATUS)) {
            fab.hide(); //fab.setVisibility(View.GONE);
            tvAddHelp.setVisibility(View.GONE);
        }

        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Globals.selectedReport = null;
                Globals.newReport = new Report();
                Globals.selectedCategory = Globals.selectedReportType;
                Intent intent = new Intent(getActivity(), ReportAddActivity.class);
                try {
                    getActivity().startActivityForResult(intent, SECOND_ACTIVITY_REQUEST_CODE);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
        reportList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            public void onItemClick(AdapterView<?> parent, View view,
                                    int position, long id) {
                Globals.selectedReportIndex = position;
                if (Globals.selectedReportType.equals(ASSET_TYPE_ALL_TXT)) {
                    Globals.selectedReport = Globals.selectedTask.getReportList().get(position);
                } else {
                    Globals.selectedReport = Globals.selectedTask.getFilteredReports(Globals.selectedUnit.getUnitId()).get(position);
                }
                Globals.newReport = null;
                Globals.selectedCategory = Globals.selectedReportType;
                if (Globals.selectedTask.getStatus().equals(TASK_FINISHED_STATUS)) {
                    Intent viewMode = new Intent(context, ReportViewActivity.class);
                    startActivity(viewMode);
                } else {
                    Intent intent = new Intent(context, ReportAddActivity.class);
                    startActivityForResult(intent, SECOND_ACTIVITY_REQUEST_CODE);
                }
                 }
        });
        ((IssuesActivity)getActivity()).setFragmentRefreshIssueListener(new IssuesActivity.FragmentRefreshIssueListener() {
            @Override
            public void onRefresh() {

                // Refresh Your Fragment
                String unitId = "";
                if(Globals.selectedUnit != null){
                    unitId = Globals.selectedUnit.getUnitId();
                }
                if (unitId.equals(ASSET_TYPE_ALL_TXT)) {
                    adapter = new reportAdapter(mActivity, Globals.selectedTask.getReportList(), unitId);
                } else {
                    adapter = new reportAdapter(mActivity, Globals.selectedTask.getFilteredReports(unitId), unitId);
                }
                reportList.setAdapter(adapter);
                adapter.notifyDataSetChanged();
            }
        });
        return rootView;
    }

    public void setAdapter(String type) {
        if (type.equals(ASSET_TYPE_ALL_TXT)) {
            adapter = new reportAdapter(getActivity(), Globals.selectedTask.getReportList(), type);
        } else {
            adapter = new reportAdapter(getActivity(), Globals.selectedTask.getFilteredReports(type), type);
        }
        reportList.setAdapter(adapter);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        // check that it is the SecondActivity with an OK result
        if (requestCode == SECOND_ACTIVITY_REQUEST_CODE) {
            setAdapter(Globals.selectedUnit.getUnitId());
            if (resultCode == RESULT_OK) {
            }
        }
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof Activity){
            mActivity = (FragmentActivity) context;
        }
        if (context instanceof OnFragmentInteractionListener) {
            mListener = (OnFragmentInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement OnFragmentInteractionListener");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnFragmentInteractionListener {
        // TODO: Update argument type and name
        void onFragmentInteraction(Uri uri);
    }
    @Override
    public void onResume() {
        super.onResume();
        if(Globals.selectedUnit!=null){
            setAdapter(Globals.selectedUnit.getUnitId());
        }


    }
}
