package com.app.ps19.scimapp.classes.maintenance;

import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.app.SearchManager;
import android.content.Context;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.graphics.Typeface;
import android.location.Location;
import android.os.Build;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.RecyclerView;

import android.text.Spannable;
import android.text.SpannableString;
import android.text.style.ForegroundColorSpan;
import android.text.style.UnderlineSpan;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.BaseExpandableListAdapter;
import android.widget.Button;
import android.widget.ExpandableListView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.SearchView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.app.ps19.scimapp.MaintenanceExecActivity;
import com.app.ps19.scimapp.R;
import com.app.ps19.scimapp.ReportAddActivity;
import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.Shared.IFunctionCallBack;
import com.app.ps19.scimapp.Shared.Utilities;
import com.app.ps19.scimapp.classes.IssueImage;
import com.app.ps19.scimapp.classes.IssueVoice;
import com.app.ps19.scimapp.classes.Report;
import com.app.ps19.scimapp.location.Interface.OnLocationUpdatedListener;
import com.app.ps19.scimapp.location.LocationUpdatesService;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Observable;
import java.util.Observer;

import static android.view.View.GONE;
import static android.view.View.VISIBLE;
import static com.app.ps19.scimapp.Shared.Globals.getPrefixMp;
import static com.app.ps19.scimapp.Shared.Globals.getSelectedTask;
import static com.app.ps19.scimapp.Shared.Globals.inbox;
import static com.app.ps19.scimapp.Shared.Globals.newReport;
import static com.app.ps19.scimapp.Shared.Globals.selectedJPlan;
import static com.app.ps19.scimapp.Shared.Globals.selectedMaintenance;
import static com.app.ps19.scimapp.Shared.Globals.selectedReport;
import static com.app.ps19.scimapp.Shared.Globals.selectedUnit;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link WorkOrderListFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class WorkOrderListFragment extends Fragment implements
        Observer,
        SearchView.OnQueryTextListener,
        SearchView.OnCloseListener,
        OnLocationUpdatedListener {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    private static final String ASC_ORDER_SORT_TEXT = "ASC";
    private static final String DESC_ORDER_SORT_TEXT = "DESC";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    ArrayList<Maintenance> maintenanceList;
    ExpandableListView expandableListView;
    ParentLevel itemsAdapter;
    Spinner spMaintainSort;
    ArrayList<String> maintenanceSortItems = new ArrayList<>();
    String selectedMaintainSort = ASC_ORDER_SORT_TEXT;
    static int selectedAreaFilterPostion = 0;
    ProgressDialog dialog =null;
    String longitude="", latitude ="";
    String location="";
    private MaintenanceAreaAdapter locationsAdapter;
    private  RecyclerView  rvLocations;
    private String areaType;
    private String mode;


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
        try {
            Globals.inbox.loadMaintenance();
        } catch (Exception e) {
            e.printStackTrace();
        }
        //maintenanceList=Globals.maintenanceList.getMaintenanceList();
        areaType = "All";
        if(mParam1.equals("selected")){
            maintenanceList = Globals.maintenanceList.getMaintenanceByLineId(selectedJPlan.getLineId());
        } else {
            maintenanceList = Globals.maintenanceList.getMaintenanceByLocation("All");
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view=inflater.inflate(R.layout.fragment_work_order_list, container, false);
        LocationUpdatesService.addOnLocationUpdateListener(this.getClass().getSimpleName(), this);
        selectedAreaFilterPostion = 0;
        expandableListView=view.findViewById(R.id.expWorkOrderListView);
        spMaintainSort = view.findViewById(R.id.sp_maintenance_sorting);

        itemsAdapter=new ParentLevel(maintenanceList);
        expandableListView.setAdapter(itemsAdapter);
        maintenanceSortItems.add(ASC_ORDER_SORT_TEXT);
        maintenanceSortItems.add(DESC_ORDER_SORT_TEXT);
        selectedMaintainSort = DESC_ORDER_SORT_TEXT;
        if(mParam1.equals("selected")){
            locationsAdapter = new MaintenanceAreaAdapter(Globals.maintenanceList.getMaintenanceLocations(selectedJPlan.getLineId()));
        } else {
            locationsAdapter = new MaintenanceAreaAdapter(Globals.maintenanceList.getMaintenanceLocations());
        }

        rvLocations = (RecyclerView) view.findViewById(R.id.rvLocations);
        rvLocations.setAdapter(locationsAdapter);

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
        dialog = new ProgressDialog(view.getContext());
        RefreshWithLastLocation();
        SearchView search;
        SearchManager searchManager = (SearchManager) getContext().getSystemService(Context.SEARCH_SERVICE);
        search = (SearchView) view.findViewById(R.id.search_ftt);
        search.setSearchableInfo(searchManager.getSearchableInfo(getActivity().getComponentName()));
        search.setIconifiedByDefault(false);
        search.setOnQueryTextListener(this);
        search.setOnCloseListener(this);
        spMaintainSort.setSelection(1, false);
        setMaintainSort();
        return view;


    }
    private void RefreshWithLastLocation(){
        if(latitude.equals("") || longitude.equals("")){
            Location lastLoc = LocationUpdatesService.getLocation();
            if(lastLoc!= null && !lastLoc.getProvider().equals("None")){
                latitude = String.valueOf(lastLoc.getLatitude());
                longitude = String.valueOf(lastLoc.getLongitude());
                location = latitude + "," + longitude;
            }
        } else {
            location = latitude + "," + longitude;
        }
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

    @Override
    public boolean onClose() {
        itemsAdapter.filterData("");
        return false;
    }

    @Override
    public boolean onQueryTextSubmit(String query) {
        itemsAdapter.filterData(query);
        return false;
    }

    @Override
    public boolean onQueryTextChange(String newText) {
        itemsAdapter.filterData(newText);
        return false;
    }

    @Override
    public void update(Observable o, Object arg) {

    }

    @Override
    public void onLocationUpdated(Location mlocation) {
        if(!LocationUpdatesService.canGetLocation() || mlocation.getProvider().equals("None")) {
            Utilities.showSettingsAlert(getContext());
        }
        else {
            latitude = String.valueOf(mlocation.getLatitude());
            longitude = String.valueOf(mlocation.getLongitude());
            location = latitude + "," + longitude;
        }
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

            TextView tvIssueDetails=tv.findViewById(R.id.tv_issue_details);
            //tvIssueDetails.setText(template.getLineName());
            SpannableString viewDetails = new SpannableString(getString(R.string.view_details));
            viewDetails.setSpan(new ForegroundColorSpan(getResources().getColor(R.color.btn_color_primary)), 0, viewDetails.length(), Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);

            viewDetails.setSpan(new UnderlineSpan(), 0, viewDetails.length(), 0);
            tvIssueDetails.setText(viewDetails);

            TextView tvMrNumber=tv.findViewById(R.id.tvMrNumber);
            tvMrNumber.setText(template.getMrNumber());

            TextView tvStatus=tv.findViewById(R.id.tvStatus);
            tvStatus.setText(template.getStatus());

            TextView tvMainType=tv.findViewById(R.id.tvMaintenanceType);
            tvMainType.setText(template.getMaintenanceType());

            /*TextView tvMarked=tv.findViewById(R.id.tvMarked);
            tvMarked.setText(template.isMarkedOnSite()?"Yes":"No");*/

            TextView tvMpS=tv.findViewById(R.id.tvMpStart);
            tvMpS.setText(getPrefixMp(template.getLocationStartMp(), template.getLineId()));

            TextView tvMpE=tv.findViewById(R.id.tvMpEnd);
            tvMpE.setText(getPrefixMp(template.getLocationEndMp(), template.getLineId()));

            /*TextView tvStart=tv.findViewById(R.id.tvStart);
            tvStart.setText(template.getLocationStartCords());

            TextView tvEnd=tv.findViewById(R.id.tvEnd);
            tvEnd.setText(template.getLocationEndCords());*/
            tvIssueDetails.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View viewIn) {
                    Intent intent = new Intent(getActivity(), ReportAddActivity.class);
                    //TODO: Add image download logic here
                    if(template.getReport()!=null){
                        selectedReport = template.getReport();
                        selectedUnit = template.getReport().getUnit();
                        newReport = null;
                        checkReportResourceDialog(selectedReport, new IFunctionCallBack() {
                            @Override
                            public void onProcessCompleted() {
                                requireActivity().runOnUiThread(new Runnable() {
                                    @Override
                                    public void run() {
                                        intent.putExtra("locId", template.getLineId());
                                        startActivity(intent);
                                    }});
                            }

                            @Override
                            public void onProcessFailed() {

                            }
                        });

                        //startActivity(intent);
                    } else {
                        Toast.makeText(getContext(),"Data unavailable!", Toast.LENGTH_SHORT).show();
                    }
                }});

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
                    intent.putExtra("locId", template.getLineId());
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

    public class MaintenanceAreaAdapter extends RecyclerView.Adapter< MaintenanceAreaAdapter.MyViewHolder> {
        List<String> areaList;
        List<MaintenanceAreaAdapter.MyViewHolder> viewList = new ArrayList<>();

        class MyViewHolder extends RecyclerView.ViewHolder {
            TextView tvJPLocation;
            View vJPLocColor;
            LinearLayout selectedColorLayout;
            TextView tvCount;
            MyViewHolder(View itemView) {
                super(itemView);
                this.vJPLocColor =(View) itemView.findViewById(R.id.viewLocColor);
                this.tvJPLocation = (TextView) itemView.findViewById(R.id.tvLocTxt);
                this.selectedColorLayout = (LinearLayout) itemView.findViewById(R.id.ll_selected);
                this.tvCount = (TextView) itemView.findViewById(R.id.tv_count);


                itemView.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {

                        for(MaintenanceAreaAdapter.MyViewHolder holder : viewList){
                            TextView tv = holder.tvJPLocation;
                            tv.setTextColor(Color.LTGRAY);
                            tv.setTypeface(null, Typeface.NORMAL);
                            holder.selectedColorLayout.setVisibility(View.INVISIBLE);
                        }

                        selectedAreaFilterPostion = getAdapterPosition();
                        selectedColorLayout.setVisibility(VISIBLE);
                        tvJPLocation.setTextColor(Color.WHITE);
                        tvJPLocation.setTypeface(null, Typeface.BOLD);
                        String selected = tvJPLocation.getText().toString();
                        refresh(selected);
                    }
                });

            }
        }

        public MaintenanceAreaAdapter(List<String> templates) {
            this.areaList=new ArrayList<>();
            this.areaList.addAll(templates);
        }
        @NonNull
        @Override
        public  MaintenanceAreaAdapter.MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
            LayoutInflater layout = (LayoutInflater) getContext().getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            View view = layout.inflate(R.layout.location_item, parent, false);
            MaintenanceAreaAdapter.MyViewHolder holder = new MaintenanceAreaAdapter.MyViewHolder(view);
            return holder;
        }


        @Override
        public void onBindViewHolder(MaintenanceAreaAdapter.MyViewHolder holder, int position) {
            TextView tvLocation = holder.tvJPLocation;
            TextView tvMaintenanceCount = holder.tvCount;
            LinearLayout selectedColorLayout = holder.selectedColorLayout;
            selectedColorLayout.setVisibility(View.INVISIBLE);

            tvLocation.setText(this.areaList.get(position));
            tvLocation.setTextColor(Color.LTGRAY);

            View locColor = holder.vJPLocColor;
            final int jpColor = inbox.getJPLocationOpts().
                    getJPLocationColor(this.areaList.get(position));

            if(!this.areaList.get(position).equals("All")) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    locColor.setBackgroundTintList(ColorStateList.valueOf(jpColor));
                }
            }

            if (position == selectedAreaFilterPostion) {
                tvLocation.setTextColor(Color.WHITE);
                tvLocation.setTypeface(null, Typeface.BOLD);
                selectedColorLayout.setVisibility(VISIBLE);
            }
            tvMaintenanceCount.setVisibility(VISIBLE);
            tvMaintenanceCount.setText("0");
            tvMaintenanceCount.setText(String.valueOf(Globals.maintenanceList.getMaintenanceByLocation(this.areaList.get(holder.getAdapterPosition())).size()));

            locColor.setVisibility(GONE);
            viewList.add(holder);
        }
        @Override
        public int getItemCount() {
            return this.areaList.size();
        }
    }
    public void refresh(String areaType){
        if(this.expandableListView!=null) {
            maintenanceList = Globals.maintenanceList.getMaintenanceByLocation(areaType);
            this.itemsAdapter = new ParentLevel(maintenanceList);
            this.expandableListView.setAdapter(this.itemsAdapter);
        }
    }
    public void checkReportResourceDialog(Report report, IFunctionCallBack processFinished) {
        Context context=getActivity();
        int llPadding = 30;
        LinearLayout ll = new LinearLayout(context);
        ll.setOrientation(LinearLayout.HORIZONTAL);
        ll.setPadding(llPadding, llPadding, llPadding, llPadding);
        ll.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams llParam = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT);
        llParam.gravity = Gravity.CENTER;
        ll.setLayoutParams(llParam);

        ProgressBar progressBar = new ProgressBar(context);
        progressBar.setIndeterminate(true);
        progressBar.setPadding(0, 0, llPadding, 0);
        progressBar.setLayoutParams(llParam);

        llParam = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT);
        llParam.gravity = Gravity.CENTER;
        TextView tvText = new TextView(context);
        tvText.setText("Loading ...");
        tvText.setTextColor(Color.parseColor("#000000"));
        tvText.setTextSize(20);
        tvText.setLayoutParams(llParam);

        ll.addView(progressBar);
        ll.addView(tvText);

        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        builder.setCancelable(true);
        builder.setView(ll);

        AlertDialog dialog = builder.create();
        dialog.show();
        Window window = dialog.getWindow();
        if (window != null) {
            WindowManager.LayoutParams layoutParams = new WindowManager.LayoutParams();
            layoutParams.copyFrom(dialog.getWindow().getAttributes());
            layoutParams.width = LinearLayout.LayoutParams.WRAP_CONTENT;
            layoutParams.height = LinearLayout.LayoutParams.WRAP_CONTENT;
            dialog.getWindow().setAttributes(layoutParams);
        }
        new Thread(new Runnable() {
            @Override
            public void run() {
                //heavy job here
                //send message to main thread
                try {
                    checkReportResources(report);
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }catch (Exception e){
                    if(processFinished!=null){
                        processFinished.onProcessFailed();
                    }
                }
                if(processFinished!=null){
                    processFinished.onProcessCompleted();
                }
                dialog.dismiss();
            }
        }).start();
    }
    private boolean checkReportResources(Report report){
        ArrayList<IssueImage> images=report.getImgList();
        for(IssueImage img:images){
            Utilities.makeImageAvailable(img.getImgName());
        }
        ArrayList<IssueVoice> voices=report.getVoiceList();
        for(IssueVoice voice:voices){
            Utilities.makeVoiceAvailableEx(getActivity(),voice.getVoiceName());
        }
        return true;
    }
}