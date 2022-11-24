package com.app.ps19.tipsapp.safetyBriefing;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import androidx.fragment.app.Fragment;
import android.util.DisplayMetrics;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ExpandableListView;
import android.widget.ImageButton;

import com.app.ps19.tipsapp.R;
import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.classes.IssueImage;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link WorkerFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link WorkerFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class WorkerFragment extends Fragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    private List<String> listDataGroup;
    private HashMap<String, IssueImage> listDataChild;
    private ExpandableListView expandableListView;
    View rootView;
    Context _context;
    private workerListAdapter workerListViewAdapter;
    private ImageButton ibWorkerAdd;

    private OnFragmentInteractionListener mListener;

    public WorkerFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment WorkerFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static WorkerFragment newInstance(String param1, String param2) {
        WorkerFragment fragment = new WorkerFragment();
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
        listDataGroup = new ArrayList<>();
        listDataChild = new HashMap<>();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        rootView =  inflater.inflate(R.layout.fragment_worker, container, false);
        _context = rootView.getContext();
        expandableListView = rootView.findViewById(R.id.elv_safety_workers);
        ibWorkerAdd = rootView.findViewById(R.id.ib_worker_add);
        ibWorkerAdd.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(_context, WorkerAddActivity.class);
                // Intent intent =new Intent(MainActivity.this,ScribbleNotesActivity.class);
                Bundle b=new Bundle();
                b.putString("addWorker","");
                //intent.putExtras(b);
                startActivityForResult(intent,1);
            }});
        DisplayMetrics metrics = new DisplayMetrics();
        getActivity().getWindowManager().getDefaultDisplay().getMetrics(metrics);
        int width = metrics.widthPixels;
        expandableListView.setIndicatorBounds(width-GetDipsFromPixel(35), width-GetDipsFromPixel(5));
        initListeners();

        initDataGroup();

        initObjects();

        return rootView;

    }
    public int GetDipsFromPixel(float pixels)
    {
        // Get the screen's density scale
        final float scale = getResources().getDisplayMetrics().density;
        // Convert the dps to pixels, based on density scale
        return (int) (pixels * scale + 0.5f);
    }
    /**
     * method to initialize the listeners
     */
    private void initListeners() {

        // ExpandableListView on child click listener
        expandableListView.setOnChildClickListener(new ExpandableListView.OnChildClickListener() {

            @Override
            public boolean onChildClick(ExpandableListView parent, View v,
                                        int groupPosition, int childPosition, long id) {
               /* Toast.makeText(
                        getApplicationContext(),
                        listDataGroup.get(groupPosition)
                                + " : "
                                + listDataChild.get(
                                listDataGroup.get(groupPosition)).get(
                                childPosition), Toast.LENGTH_SHORT)
                        .show();*/
                return false;
            }
        });

        // ExpandableListView Group expanded listener
        expandableListView.setOnGroupExpandListener(new ExpandableListView.OnGroupExpandListener() {

            @Override
            public void onGroupExpand(int groupPosition) {
               /* Toast.makeText(getApplicationContext(),
                        listDataGroup.get(groupPosition) + " " + getString(R.string.text_collapsed),
                        Toast.LENGTH_SHORT).show();*/
            }
        });

        // ExpandableListView Group collapsed listener
        expandableListView.setOnGroupCollapseListener(new ExpandableListView.OnGroupCollapseListener() {

            @Override
            public void onGroupCollapse(int groupPosition) {
               /* Toast.makeText(getApplicationContext(),
                        listDataGroup.get(groupPosition) + " " + getString(R.string.text_collapsed),
                        Toast.LENGTH_SHORT).show();*/

            }
        });

    }

    /**
     * method to initialize the objects
     */
    private void initObjects() {

        // initializing the list of groups
        //listDataGroup = new ArrayList<>();

        // initializing the list of child
        //listDataChild = new HashMap<>();

        // initializing the adapter object
        workerListViewAdapter = new workerListAdapter(_context, listDataGroup, listDataChild);

        // setting list adapter
        expandableListView.setAdapter(workerListViewAdapter);

    }

    void initDataGroup(){
if(Globals.selectedJPlan.getSafetyBriefingForm()!= null){
    //Globals.safetyBriefing = Globals.selectedJPlan.getSafetyBriefingForm();
}
        listDataGroup.clear();
        if(Globals.safetyBriefing.getWorkers() != null && Globals.safetyBriefing.getWorkers().size() > 0 ){
            for (int i = 0 ; i < Globals.safetyBriefing.getWorkers().size(); i++){
                listDataGroup.add(Globals.safetyBriefing.getWorkers().get(i).getName()+" "+"( "+Globals.safetyBriefing.getWorkers().get(i).getAcctNumber()+ " )" );
                listDataChild.put(Globals.safetyBriefing.getWorkers().get(i).getName()+" "+"( "+Globals.safetyBriefing.getWorkers().get(i).getAcctNumber()+ " )" , Globals.safetyBriefing.getWorkers().get(i).getSignature());
            }
            initDataChild();
        }
    }
    void initDataChild (){

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
    public void onActivityResult(int requestCode, int resultCode, Intent data) {

        if (requestCode == 1) {
            if(resultCode == Activity.RESULT_OK){
                String result=data.getStringExtra("result");
                if(result.equals("added")){
                    initDataGroup();
                    workerListViewAdapter.notifyDataSetChanged();
                    expandableListView.collapseGroup(Globals.safetyBriefing.getWorkers().indexOf(Globals.selectedWorker));
                }}}}

    @Override
    public void onResume() {
        super.onResume();
        initDataGroup();
        workerListViewAdapter.notifyDataSetChanged();
        if(Globals.safetyBriefing.getWorkers() != null){
            expandableListView.collapseGroup(Globals.safetyBriefing.getWorkers().indexOf(Globals.selectedWorker));
        }

    }
}
