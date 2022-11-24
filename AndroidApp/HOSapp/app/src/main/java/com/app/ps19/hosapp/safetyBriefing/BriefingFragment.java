package com.app.ps19.hosapp.safetyBriefing;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import androidx.fragment.app.Fragment;
import android.util.DisplayMetrics;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ExpandableListView;

import com.app.ps19.hosapp.R;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link BriefingFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link BriefingFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class BriefingFragment extends Fragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    private List<String> listDataGroup;
    private HashMap<String, List<String>> listDataChild;
    private ExpandableListView expandableListView;
    View rootView;
    Context _context;

    private briefingListAdapter briefingListViewAdapter;

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;

    public BriefingFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment BriefingFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static BriefingFragment newInstance(String param1, String param2) {
        BriefingFragment fragment = new BriefingFragment();
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
        rootView = inflater.inflate(R.layout.fragment_briefing, container, false);
        _context = rootView.getContext();
        expandableListView = rootView.findViewById(R.id.elv_briefing);
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
        briefingListViewAdapter = new briefingListAdapter(_context, listDataGroup, listDataChild);

        // setting list adapter
        expandableListView.setAdapter(briefingListViewAdapter);

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
    void initDataGroup(){
        listDataGroup.clear();
        listDataGroup.add("Date and Time");
        listDataGroup.add("Work Location");
        listDataGroup.add("Description of Work Assignment");
        listDataGroup.add("Qualified Protection Employee (QPE) in charge of providing on-track protection");
        listDataGroup.add("Confirm Current Qualifications (Date on Qualification Card)");
        listDataGroup.add("On what Line and track(s) will the Roadway Worker protection be required?");
        listDataGroup.add("Track Maximum Authorized Speed (MAS)");
        listDataGroup.add("What form of Protection will be used?");
        listDataGroup.add("If using Individual Train Detection (ITD), you must be a QPE. What time has the Train Dispatcher been notified of your intention to use ITD as protection");
        listDataGroup.add("If requesting Foul Time, the 'Employee Record of Foul Time Authority' form must be used in accordance with Operaing Rule RDR 504.");
        listDataGroup.add("If using Train Approach Warning for protection (TAW), how many Watchpersons/Advanced Watchpersons are required?");
        listDataGroup.add("If using Train Approach Warning for protection (TAW), is the location considered a 'HotSpot'?");
        listDataGroup.add("If using ITD or TAW, has the Speed Distance Table (RDR/OTS 508) been reviewed for required cleaning distances to apply the 15-second rule?");
        listDataGroup.add("if establishing a Work zone for protection, has the Braking Chart (RDR/OTS 231) been reviewed for proper sign placement?");
        listDataGroup.add("If the track is taken OOS for protection, have either Barricades or Portable Train Stops been erected at the limits at all required locations?");
        listDataGroup.add("When establishing protection, have all entry points (turnouts, crossings, interlockings) been considered and properly protected?");
        listDataGroup.add("Has protection been established in all directions?");
        listDataGroup.add("Are other work groups involved?");
        listDataGroup.add("Discuss where Roadway Workers will clear");
        listDataGroup.add("Do all watchpersons have the proper equipment");
        listDataGroup.add("Have all workers been checked for Valid Qualification Cards and PPE?");
        listDataGroup.add("Were Radio Checks performed on all radios?");
        listDataGroup.add("If working around equipment the following must be discussed with the operators");
        listDataGroup.add("Does anyone have any questions or concerns?");
        initDataChild();
    }
    void initDataChild(){
        List<String> childDataList = new ArrayList<>();
        int row = 0;
        for (int i= 0; i<listDataGroup.size(); i++){
            switch (i) {
                case 0:
                    childDataList.add("date");
                   // childDataList.add("time");
                    break;
                case 1:
                case 2:
                    childDataList.add("edit-multiline");
                    break;
                case 3:
                    childDataList.add("edit-text");
                    break;
                case 4:
                    childDataList.add("edit-text");
                    break;
                case 5:
                    childDataList.add("edit-text");
                    break;
                case 6:
                    childDataList.add("edit-text");
                    break;
                case 7:
                    childDataList.add("cb-ITD");
                   // childDataList.add("cb-Foul Time");
                    //childDataList.add("cb-TAW");
                   // childDataList.add("cb-Work Zone");
                   // childDataList.add("cb-OOS");
                    break;
                case 8:
                    childDataList.add("time");
                    break;
                case 9:
                    childDataList.add("tv-Do you have Foul Time Forms?");
                    //childDataList.add("cb-Yes");
                    //childDataList.add("cb-No");
                    break;
                case 10:
                    childDataList.add("edit-text");
                    //childDataList.add("tv-What time has the Train Dispatcher been notified of your intention to use TAW as protection?");
                    //childDataList.add("time");
                    break;
                case 11:
                    childDataList.add("cb-Yes");
                    //childDataList.add("cb-No");
                    //childDataList.add("tv-If Yes, have you considered the requirement for additional advanced watchpersons? ");
                    //childDataList.add("cb-Yes");
                    //childDataList.add("cb-No");
                    break;
                case 12:
                    childDataList.add("cb-Yes");
                    //childDataList.add("cb-No");
                    //childDataList.add("tv-What is the required distance?");
                    //childDataList.add("edit-text");
                    break;
                case 13:
                    childDataList.add("cb-Yes");
                    //childDataList.add("cb-No");
                    break;
                case 14:
                    childDataList.add("cb-Yes");
                    //childDataList.add("cb-No");
                    break;
                case 15:
                    childDataList.add("cb-Yes");
                    //childDataList.add("cb-No");
                    break;
                case 16:
                    childDataList.add("cb-Yes");
                    //childDataList.add("cb-No");
                    //childDataList.add("tv-Remember - Any Time, Any Direction!");
                    //childDataList.add("tv-If No, explain");
                    //childDataList.add("edit-text");
                    break;
                case 17:
                    //childDataList.add("cb-Yes");
                    //childDataList.add("cb-No");
                    childDataList.add("tv-If yes, the Employee-in-Charge (EIC) of the additional group(s) must be briefed and added to Part 2 of the form 'W'");
                    break;
                case 18:
                    childDataList.add("edit-text");
                    break;
                case 19:
                    childDataList.add("cb-Yes");
                    //childDataList.add("cb-No");
                    //childDataList.add("tv-Remember, a whistle test MUST be done after the watchmen are in place!");
                    break;
                case 20:
                    childDataList.add("cb-Yes");
                    //childDataList.add("cb-No");
                    break;
                case 21:
                    childDataList.add("cb-Yes");
                    //childDataList.add("cb-No");
                    break;
                case 22:
                    childDataList.add("tv-Dangers of Equipment");
                    //childDataList.add("tv-Spacing");
                    //childDataList.add("tv-Speeds");
                    //childDataList.add("tv-Weather Conditions");
                    break;
                case 23:
                    childDataList.add("cb-Yes");
                    //childDataList.add("cb-No");
                    //childDataList.add("tv-If yes, have they been addressed to everyone's satisfaction?");
                    //childDataList.add("cb-Yes");
                    //childDataList.add("cb-No");
                    break;
                default:
                    break;
            }
            listDataChild.put(listDataGroup.get(i), childDataList);
            childDataList = new ArrayList<>();
        }

    }
}
