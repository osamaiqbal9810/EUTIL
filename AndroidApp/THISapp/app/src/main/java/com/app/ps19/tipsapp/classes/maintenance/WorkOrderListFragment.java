package com.app.ps19.tipsapp.classes.maintenance;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.BaseExpandableListAdapter;
import android.widget.Button;
import android.widget.ExpandableListView;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.TextView;

import com.app.ps19.tipsapp.MaintenanceExecActivity;
import com.app.ps19.tipsapp.R;
import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.classes.DUnit;
import com.app.ps19.tipsapp.classes.JourneyPlanOpt;
import com.app.ps19.tipsapp.classes.UnitsOpt;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

import static com.app.ps19.tipsapp.Shared.Globals.selectedMaintenance;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link WorkOrderListFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class WorkOrderListFragment extends Fragment {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    private static final String ASC_ORDER_SORT_TEXT = "ASC";
    private static final String DESC_ORDER_SORT_TEXT = "DESC";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    ArrayList<JourneyPlanOpt> journeyPlansInProgress;
    ArrayList<Maintenance> maintenanceList;
    ExpandableListView expandableListView;
    ParentLevel itemsAdapter;
    Spinner spMaintainSort;
    ArrayList<String> maintenanceSortItems = new ArrayList<>();
    String selectedMaintainSort = ASC_ORDER_SORT_TEXT;

    public WorkOrderListFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment WorkOrderList.
     */
    // TODO: Rename and change types and number of parameters
    public static WorkOrderListFragment newInstance(String param1, String param2) {
        WorkOrderListFragment fragment = new WorkOrderListFragment();
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
        Globals.inbox.loadMaintenance();
        maintenanceList=Globals.maintenanceList.getMaintenanceList();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view=inflater.inflate(R.layout.fragment_work_order_list, container, false);
        expandableListView=view.findViewById(R.id.expWorkOrderListView);
        spMaintainSort = view.findViewById(R.id.sp_maintenance_sorting);
        itemsAdapter=new ParentLevel(maintenanceList);
        expandableListView.setAdapter(itemsAdapter);
        spMaintainSort.setSelection(0, false);
        maintenanceSortItems.add(ASC_ORDER_SORT_TEXT);
        maintenanceSortItems.add(DESC_ORDER_SORT_TEXT);

        ArrayAdapter<String> maintainSortAdapter = new ArrayAdapter<String>(view.getContext(),
                R.layout.my_spinner_item, maintenanceSortItems);
        maintainSortAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spMaintainSort.setAdapter(maintainSortAdapter);
        spMaintainSort.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener()
        {
            @Override
            public void onItemSelected(AdapterView<?> arg0, View arg1, int position, long id) {
                switch (position){
                    case 0:
                        selectedMaintainSort = ASC_ORDER_SORT_TEXT;
                        break;
                    case 1:
                        selectedMaintainSort = DESC_ORDER_SORT_TEXT;
                        break;
                }
                setMaintainSort();
            }

            @Override
            public void onNothingSelected(AdapterView<?> arg0) {
                // TODO Auto-generated method stub
            }
        });

        return view;


    }
    private void setMaintainSort(){
        if(selectedMaintainSort.equals(ASC_ORDER_SORT_TEXT)){
            Comparator<Maintenance> compareByStartMp = (Maintenance o1, Maintenance o2) -> o1.mrNumber.compareTo( o2.mrNumber );
            Collections.sort(maintenanceList, compareByStartMp);
        }
        if(selectedMaintainSort.equals(DESC_ORDER_SORT_TEXT)){
            Comparator<Maintenance> compareByStartMp = (Maintenance o1, Maintenance o2) -> o2.mrNumber.compareTo( o1.mrNumber );
            Collections.sort(maintenanceList, compareByStartMp);
        }
        setMaintenanceAdapter();
    }
    private void setMaintenanceAdapter(){
        itemsAdapter=new ParentLevel(maintenanceList);
        expandableListView.setAdapter(itemsAdapter);
    }

    public class ParentLevel extends BaseExpandableListAdapter
    {
        //final ArrayList<Template> templateList;
        final ArrayList<Maintenance> templateListOriginal;
        final ArrayList<Maintenance> templateList;
        ImageView imgStartPlan;

        public  ParentLevel(ArrayList<Maintenance> templates ){
            this.templateList=new ArrayList<>();
            this.templateList.addAll(templates);
            this.templateListOriginal=new ArrayList<>();
            this.templateListOriginal.addAll(templates);

        }

        public void filterData(String query){
            query = query.toLowerCase();
            Log.v("MyListAdapter", String.valueOf(templateList.size()));
            templateList.clear();

            if(query.isEmpty()){
                templateList.addAll(templateListOriginal);
            }
            else {

                for(Maintenance m: templateListOriginal){
                    if(m.getDescription().toLowerCase().contains(query)){
                        templateList.add(m);
                    }
                }
            }
            Log.v("MyListAdapter", String.valueOf(templateList.size()));
            notifyDataSetChanged();
        }
        @Override
        public Object getChild(int groupPosition, int childPosition)
        {
            return null;
        }

        @Override
        public long getChildId(int groupPosition, int childPosition)
        {
            return childPosition;
        }

        @Override
        public View getChildView(int groupPosition, int childPosition,
                                 boolean isLastChild, View convertView, ViewGroup parent)
        {
            View tv=convertView;
            if(tv==null) {
                LayoutInflater layout = (LayoutInflater) getActivity().getSystemService(Context.LAYOUT_INFLATER_SERVICE);
                tv = layout.inflate(R.layout.parent_work_order_detail_item, parent, false);
            }
            final Maintenance template= (Maintenance) getGroup(groupPosition);
            TextView tvLineName=tv.findViewById(R.id.tvLineName);
            tvLineName.setText(template.getLineName());

            TextView tvMrNumber=tv.findViewById(R.id.tvMrNumber);
            tvMrNumber.setText(template.getMrNumber());

            TextView tvStatus=tv.findViewById(R.id.tvStatus);
            tvStatus.setText(template.getStatus());

            TextView tvMainType=tv.findViewById(R.id.tvMaintenanceType);
            tvMainType.setText(template.getMaintenanceType());

            /*TextView tvMarked=tv.findViewById(R.id.tvMarked);
            tvMarked.setText(template.isMarkedOnSite()?"Yes":"No");*/

            TextView tvMpS=tv.findViewById(R.id.tvMpStart);
            tvMpS.setText(template.getLocationStartMp());

            TextView tvMpE=tv.findViewById(R.id.tvMpEnd);
            tvMpE.setText(template.getLocationEndMp());

            /*TextView tvStart=tv.findViewById(R.id.tvStart);
            tvStart.setText(template.getLocationStartCords());

            TextView tvEnd=tv.findViewById(R.id.tvEnd);
            tvEnd.setText(template.getLocationEndCords());*/

            final Button btnOnMap = tv.findViewById(R.id.btn_show_on_map);
            btnOnMap.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(getActivity(), MaintenanceMapActivity.class);
                    try {
                        intent.putExtra("start", template.getLocationStartCords());
                        intent.putExtra("end", template.getLocationEndCords());
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    startActivity(intent);
                }
            });

            return tv;
        }

        @Override
        public int getChildrenCount(int groupPosition)
        {
            return 1;//templateList.get(groupPosition).unitList.size();
        }

        @Override
        public Object getGroup(int groupPosition)
        {
            return templateList.get(groupPosition);
        }

        @Override
        public int getGroupCount()
        {
            return templateList.size();
        }

        @Override
        public long getGroupId(int groupPosition)
        {
            return groupPosition;
        }

        @Override
        public View getGroupView(final int groupPosition, final boolean isExpanded,
                                 View convertView, ViewGroup parent)
        {
            View tv=convertView;
            if(tv==null) {
                LayoutInflater layout = (LayoutInflater) getActivity().getSystemService(Context.LAYOUT_INFLATER_SERVICE);
                tv = layout.inflate(R.layout.parent_work_order_item, parent, false);
            }
            final Maintenance template= (Maintenance) getGroup(groupPosition);
            ImageView ivMrAction = (ImageView) tv.findViewById(R.id.iv_mr_action);
            ivMrAction.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    selectedMaintenance = template;
                    Intent intent = new Intent(getActivity(), MaintenanceExecActivity.class);
                    startActivity(intent);
                }
            });

            TextView textView1=tv.findViewById(R.id.tvWorkOrderNumber);
            textView1.setText(template.getMrNumber());

            TextView textView=tv.findViewById(R.id.tvParent);
            textView.setText(template.getDescription());
            return tv;
        }

        @Override
        public boolean hasStableIds()
        {
            return true;
        }

        @Override
        public boolean isChildSelectable(int groupPosition, int childPosition)
        {
            return true;
        }
    }


}