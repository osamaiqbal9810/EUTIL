package com.app.ps19.elecapp.wplan;

import static com.app.ps19.elecapp.Shared.Globals.MESSAGE_STATUS_READY_TO_POST;
import static com.app.ps19.elecapp.Shared.Globals.SESSION_STARTED;
import static com.app.ps19.elecapp.Shared.Globals.TASK_IN_PROGRESS_STATUS;
import static com.app.ps19.elecapp.Shared.Globals.WORK_PLAN_FINISHED_STATUS;
import static com.app.ps19.elecapp.Shared.Globals.WORK_PLAN_IN_PROGRESS_STATUS;
import static com.app.ps19.elecapp.Shared.Globals.WPLAN_TEMPLATE_LIST_NAME;
import static com.app.ps19.elecapp.Shared.Globals.activeSession;
import static com.app.ps19.elecapp.Shared.Globals.appName;
import static com.app.ps19.elecapp.Shared.Globals.dayStarted;
import static com.app.ps19.elecapp.Shared.Globals.getSelectedTask;
import static com.app.ps19.elecapp.Shared.Globals.inbox;
import static com.app.ps19.elecapp.Shared.Globals.initialInspection;
import static com.app.ps19.elecapp.Shared.Globals.initialRun;
import static com.app.ps19.elecapp.Shared.Globals.isBypassTaskView;
import static com.app.ps19.elecapp.Shared.Globals.isDayProcessRunning;
import static com.app.ps19.elecapp.Shared.Globals.isInspectionTypeReq;
import static com.app.ps19.elecapp.Shared.Globals.isMaintainer;
import static com.app.ps19.elecapp.Shared.Globals.isMpReq;
import static com.app.ps19.elecapp.Shared.Globals.isTraverseReq;
import static com.app.ps19.elecapp.Shared.Globals.isUseDefaultAsset;
import static com.app.ps19.elecapp.Shared.Globals.isWConditionReq;
import static com.app.ps19.elecapp.Shared.Globals.loadDayStatus;
import static com.app.ps19.elecapp.Shared.Globals.loadInbox;
import static com.app.ps19.elecapp.Shared.Globals.orgCode;
import static com.app.ps19.elecapp.Shared.Globals.saveCurrentJP;
import static com.app.ps19.elecapp.Shared.Globals.selectedDUnit;
import static com.app.ps19.elecapp.Shared.Globals.selectedJPlan;
import static com.app.ps19.elecapp.Shared.Globals.selectedUnit;
import static com.app.ps19.elecapp.Shared.Globals.setSelectedTask;
import static com.app.ps19.elecapp.Shared.Globals.showNearByAssets;
import static com.app.ps19.elecapp.Shared.Globals.userEmail;
import static com.app.ps19.elecapp.Shared.Globals.userUID;

import android.app.ProgressDialog;
import android.app.SearchManager;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.graphics.Typeface;
import android.location.Location;
import android.os.Build;
import android.os.Bundle;
import android.text.Html;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.BaseExpandableListAdapter;
import android.widget.ExpandableListView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.SearchView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.recyclerview.widget.RecyclerView;

import com.app.ps19.elecapp.BuildConfig;
import com.app.ps19.elecapp.InboxActivity;
import com.app.ps19.elecapp.InspectionStartActivity;
import com.app.ps19.elecapp.R;
import com.app.ps19.elecapp.Shared.DBHandler;
import com.app.ps19.elecapp.Shared.Globals;
import com.app.ps19.elecapp.Shared.ObservableObject;
import com.app.ps19.elecapp.Shared.StaticListItem;
import com.app.ps19.elecapp.Shared.Utilities;
import com.app.ps19.elecapp.classes.JourneyPlan;
import com.app.ps19.elecapp.classes.JourneyPlanOpt;
import com.app.ps19.elecapp.classes.Session;
import com.app.ps19.elecapp.classes.Task;
import com.app.ps19.elecapp.classes.Units;
import com.app.ps19.elecapp.classes.UnitsOpt;
import com.app.ps19.elecapp.classes.UnitsTestOpt;
import com.app.ps19.elecapp.classes.User;
import com.app.ps19.elecapp.classes.dynforms.DynFormList;
import com.app.ps19.elecapp.inspection.InspectionActivity;
import com.app.ps19.elecapp.location.Interface.OnLocationUpdatedListener;
import com.app.ps19.elecapp.location.LocationUpdatesService;
import com.app.ps19.elecapp.wplan.ui.main.SectionsPagerAdapter;

import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Observable;
import java.util.Observer;
import java.util.UUID;

public class WplanActivity extends AppCompatActivity implements
        Observer ,
        SearchView.OnQueryTextListener,
        SearchView.OnCloseListener,
        OnLocationUpdatedListener {
    SectionsPagerAdapter sectionsPagerAdapter;
    ArrayList< Template> templateList=new ArrayList<>();
    ArrayList<JourneyPlanOpt> wpTemplateList= new ArrayList<>();
    ExpandableListView expandableListView;
    // TODO: Rename and change types of parameters
    private String areaType;
    private String mParam2;
    View viewColorNA;
    View viewColorA;
    View viewColorExp;
    private  RecyclerView  horizontal_recycler_view;
    private  JPAreaAdapter horizontalAdapter;

    View viewLocationColor;
    TextView tvUnitLocation;
    ParentLevel itemsAdapter;
    ArrayList<JourneyPlanOpt> journeyPlansInProgress;
    // Used for start inspection activity
    private static final int START_INSPECTION_REQUEST_CODE = 10;
    // Used for inspection activity
    private static final int INSPECTION_ACTIVITY_REQUEST_CODE = 50;
    ProgressDialog dialog =null;
    String longitude="", latitude ="";
    String location="";
    String code = "";
    static int selectedAreaFilterPostion = 0;

    @Override
    protected void onStop() {
        ObservableObject.getInstance().deleteObserver(this);
        LocationUpdatesService.removeLocationUpdateListener(this.getClass().getSimpleName());
        super.onStop();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        LocationUpdatesService.addOnLocationUpdateListener(this.getClass().getSimpleName(), this);
        selectedAreaFilterPostion = 0;
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        setContentView(R.layout.activity_wplan);
        expandableListView = findViewById(R.id.expandableListView);
        viewColorNA = findViewById(R.id.colorNA);
        viewColorA = findViewById(R.id.colorA);
        viewColorExp = findViewById(R.id.colorExp);
        //sectionsPagerAdapter = new SectionsPagerAdapter(this, getSupportFragmentManager());

        //ViewPager viewPager = findViewById(R.id.view_pager);
        //viewPager.setAdapter(sectionsPagerAdapter);
        ObservableObject.getInstance().addObserver(this);

        //TabLayout tabs = findViewById(R.id.tabs);
        //tabs.setupWithViewPager(viewPager);
        /*tabs.setOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                Log.d("",tab.getText().toString());
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {

            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {

            }
        });*/

        /*FloatingActionButton fab = findViewById(R.id.fab);

        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });*/
        //Index of Maintain tab
        /*TabLayout.Tab tabFirst = tabs.getTabAt(0);
        if(appName.equals(Globals.AppName.TIMPS)){
            assert tabFirst != null;
            tabFirst.setText(getString(R.string.select_run));
        } else {
            tabFirst.setText(getString(R.string.select_run_test));
        }*/
        //Test fragment code

        areaType = "ALL";
        wpTemplateList = inbox.getJPLocationOpts().getJourneyPlanListByLocation(areaType);

        if (wpTemplateList.size() == 0) {
            wpTemplateList = inbox.loadWokPlanTemplateListEx();
        }

        journeyPlansInProgress = inbox.getInProgressJourneyPlans();
        ArrayList<Test> testList = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            testList.add(new Test(("G00" + i), (i % 2 == 0) ?  Globals.COLOR_TEST_NOT_ACTIVE :  Globals.COLOR_TEST_ACTIVE, (i % 2 == 0) ? "Due in 2 days" : "Exipre in x Days"));
        }

        Template template1 = new Template("Template 1",  Globals.COLOR_TEST_NOT_ACTIVE);
        Template template2 = new Template("Template 2",  Globals.COLOR_TEST_ACTIVE);
        Template template3 = new Template("Template 3",  Globals.COLOR_TEST_NOT_ACTIVE);
        ArrayList<Unit> unitList = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            unitList.add(new Unit("Unit " + (i + 1), Globals.COLOR_TEST_NOT_ACTIVE));
            unitList.get(i).testList.add(testList.get(0));
            unitList.get(i).testList.add(testList.get(1));
            unitList.get(i).testList.add(testList.get(3));
        }
        ArrayList<Unit> unitList1 = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            unitList1.add(new Unit("Unit " + (i + 4),  Globals.COLOR_TEST_NOT_ACTIVE));
        }
        ArrayList<Unit> unitList2 = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            unitList2.add(new Unit("Unit " + (i + 7),  Globals.COLOR_TEST_NOT_ACTIVE));

        }

        template1.unitList = unitList;
        template2.unitList = unitList1;
        template3.unitList = unitList2;
        templateList.add(template1);
        templateList.add(template2);
        templateList.add(template3);


//        viewLocationColor=view.findViewById(R.id.v_location_color);
//        tvUnitLocation = view.findViewById(R.id.tv_Unit_Loc);
        dialog = new ProgressDialog(WplanActivity.this);
        RefreshWithLastLocation();
        refreshColorLegend();
        SearchView search;
        SearchManager searchManager = (SearchManager) WplanActivity.this.getSystemService(Context.SEARCH_SERVICE);
        search = (SearchView) findViewById(R.id.search_ftt);
        search.setSearchableInfo(searchManager.getSearchableInfo(WplanActivity.this.getComponentName()));
        search.setIconifiedByDefault(false);
        search.setOnQueryTextListener(this);
        search.setOnCloseListener(this);


        //expandableListView.setAdapter(new ParentLevel(templateList));
        //Collections.reverse(wpTemplateList);
        // for(int i=0;i<wpTemplateList.get(0).getUnitList().size();i++){
        // wpTemplateList.get(0).getUnitList().get(i).setTestList(getMockData());
        // }
        //wpTemplateList.get(0).getUnitList().get(0).setTestList(getMockData());

        itemsAdapter = new ParentLevel(wpTemplateList);
        expandableListView.setAdapter(itemsAdapter);

        horizontalAdapter = new JPAreaAdapter(inbox.getJPLocationOpts().getJourneyPlansLocationsList());
        horizontal_recycler_view = (RecyclerView) findViewById(R.id.rvLocations);
        horizontal_recycler_view.setAdapter(horizontalAdapter);
        //End
    }
    private TemplateTestFragment getTemplateTestFragment(){
        FragmentManager fm= getSupportFragmentManager();
        for(Fragment frag:fm.getFragments()){
            if( frag instanceof  TemplateTestFragment){
                return  (TemplateTestFragment) frag;
            }
        }
        return null;
    }
    private RunsFragment getRunsFragment(){
        FragmentManager fm= getSupportFragmentManager();
        for(Fragment frag:fm.getFragments()){
            if( frag instanceof  RunsFragment){
                return  (RunsFragment) frag;
            }
        }
        return null;
    }
    private plansFragment getPlansFragment(){
        FragmentManager fm= getSupportFragmentManager();
        for(Fragment frag:fm.getFragments()){
            if( frag instanceof  plansFragment){
                return  (plansFragment) frag;
            }
        }
        return null;
    }
    @Override
    public void update(Observable o, Object arg) {
        Intent intent=(Intent)arg;
        Bundle b1= intent.getExtras();
        final String messageName=b1.getString("messageName");
        final String messageData=b1.getString("messageData");
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                String message="";
                switch (messageName){
                    case Globals.OBSERVABLE_MESSAGE_TOKEN_STATUS:
                        break;
                    case Globals.OBSERVABLE_MESSAGE_DATA_CHANGED:
                        //message="Data Changed: (" + messageData +")";
                        if(Globals.changeItemList !=null){
                            for(String key:Globals.changeItemList.keySet()){
                                switch (key){
                                    case Globals.APPLICATION_LOOKUP_LIST_NAME:
                                    case WPLAN_TEMPLATE_LIST_NAME:
                                        TemplateTestFragment fragment=getTemplateTestFragment();
                                        RunsFragment runFragment = getRunsFragment();
                                        plansFragment planFrag = getPlansFragment();
                                        if(fragment!=null){
                                            fragment.refresh();
                                        }
                                        if(runFragment != null){
                                            runFragment.refreshFragment();
                                        }
                                        if(planFrag != null){
                                            planFrag.refreshFragment();
                                        }

                                        Log.d("Items Changed","Need to refresh template list frag");
                                        break;
                                    case Globals.JPLAN_LIST_NAME:
                                        break;
                                    case Globals.SOD_LIST_NAME:
                                        break;

                                }
                            }
                        }
                        break;
                    case Globals.OBSERVABLE_MESSAGE_DATA_SENT:
                    case Globals.OBSERVABLE_MESSAGE_NETWORK_PULL:
                    case Globals.OBSERVABLE_MESSAGE_NETWORK_PUSH:
                    case Globals.OBSERVABLE_MESSAGE_NETWORK_CONNECTED:
                    case Globals.OBSERVABLE_MESSAGE_NETWORK_DISCONNECTED:
                    case Globals.OBSERVABLE_MESSAGE_LANGUAGE_CHANGED:

                }
            }
        });
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
    public boolean onClose() {
        itemsAdapter.filterData("");
        return false;
    }

    @Override
    public void onLocationUpdated(Location mlocation) {
        if(!LocationUpdatesService.canGetLocation() || mlocation.getProvider().equals("None")) {
            Utilities.showSettingsAlert(WplanActivity.this);
        }
        else {
            latitude = String.valueOf(mlocation.getLatitude());
            longitude = String.valueOf(mlocation.getLongitude());
            location = latitude + "," + longitude;
        }
    }

    public class Template{
        public String description="";
        public int color=  Globals.COLOR_TEST_NOT_ACTIVE;
        public ArrayList< Unit> unitList=new ArrayList<>();
        public Template(String description, int color){
            this.description=description;
            this.color=color;
        }

    }
    public class Unit {
        public String description="";
        public int color= Globals.COLOR_TEST_ACTIVE;
        public ArrayList< Test> testList=new ArrayList<>();
        public Unit(String description, int color){
            this.description=description;
            this.color=color;
        }
    }
    public class Test{
        public String description="";
        public int color= Globals.COLOR_TEST_ACTIVE;
        public String dueText ="";
        public Test(String description , int color, String dueText){
            this.description=description;
            this.color=color;
            this.dueText=dueText;

        }
    }



    public class JPAreaAdapter extends RecyclerView.Adapter< JPAreaAdapter.MyViewHolder> {
        List<String> areaList;
        List<MyViewHolder> viewList = new ArrayList<>();

        class MyViewHolder extends RecyclerView.ViewHolder {
            TextView tvJPLocation;
            View vJPLocColor;
            LinearLayout selectedColorLayout;
            MyViewHolder(View itemView) {
                super(itemView);
                this.vJPLocColor =(View) itemView.findViewById(R.id.viewLocColor);
                this.tvJPLocation = (TextView) itemView.findViewById(R.id.tvLocTxt);
                this.selectedColorLayout = (LinearLayout) itemView.findViewById(R.id.ll_selected);


                itemView.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {

                        for(MyViewHolder holder : viewList){
                            TextView tv = holder.tvJPLocation;
                            tv.setTextColor(Color.LTGRAY);
                            tv.setTypeface(null, Typeface.NORMAL);
                            holder.selectedColorLayout.setVisibility(View.INVISIBLE);
                        }

                        selectedAreaFilterPostion = getAdapterPosition();
                        selectedColorLayout.setVisibility(View.VISIBLE);
                        tvJPLocation.setTextColor(Color.WHITE);
                        tvJPLocation.setTypeface(null, Typeface.BOLD);
                        String selected = tvJPLocation.getText().toString();
                        refresh(selected);
                    }
                });

            }
        }

        public JPAreaAdapter(List<String> templates) {
            this.areaList=new ArrayList<>();
            this.areaList.addAll(templates);
        }
        @NonNull
        @Override
        public  JPAreaAdapter.MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
            LayoutInflater layout = (LayoutInflater) WplanActivity.this.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            View view = layout.inflate(R.layout.location_item, parent, false);
            MyViewHolder holder = new MyViewHolder(view);
            return holder;
        }

        @Override
        public void onBindViewHolder( MyViewHolder holder, int position) {
            TextView tvLocation = holder.tvJPLocation;
            LinearLayout selectedColorLayout = holder.selectedColorLayout;
            selectedColorLayout.setVisibility(View.INVISIBLE);

            tvLocation.setText(this.areaList.get(position));
            tvLocation.setTextColor(Color.LTGRAY);

            View locColor = holder.vJPLocColor;
            final int jpColor = inbox.getJPLocationOpts().
                    getJPLocationColor(this.areaList.get(position));

            try {
                if(!this.areaList.get(position).equals("ALL")) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        locColor.setBackgroundTintList(ColorStateList.valueOf(jpColor));
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

            if (position == selectedAreaFilterPostion) {
                tvLocation.setTextColor(Color.WHITE);
                tvLocation.setTypeface(null, Typeface.BOLD);
                selectedColorLayout.setVisibility(View.VISIBLE);
            }
            viewList.add(holder);
        }
        @Override
        public int getItemCount() {
            return this.areaList.size();
        }
    }



    public class ParentLevel extends BaseExpandableListAdapter
    {
        //final ArrayList<Template> templateList;
        final ArrayList<JourneyPlanOpt> templateListOriginal;
        final ArrayList<JourneyPlanOpt> templateList;
        ImageView imgStartPlan;

        public  ParentLevel(ArrayList<JourneyPlanOpt> templates ){
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

                for(JourneyPlanOpt journeyPlanOpt: templateListOriginal){
                    if(journeyPlanOpt.getTitle().toLowerCase().contains(query)){
                        templateList.add(journeyPlanOpt);
                    }
                }
            }
            Log.v("MyListAdapter", String.valueOf(templateList.size()));
            notifyDataSetChanged();
        }

        @Override
        public Object getChild(int groupPosition, int childPosition)
        {
            ArrayList<UnitsOpt> unitArrayList=templateList.get(groupPosition).getUnitList();

            return unitArrayList;
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
            CustExpListview SecondLevelexplv = new  CustExpListview( WplanActivity.this);
            ArrayList< Unit> unitList=(ArrayList< Unit>) getChild(groupPosition,childPosition);
            SecondLevelexplv.setAdapter(new  SecondLevelAdapter(unitList));
            //SecondLevelexplv.setGroupIndicator(null);
            return SecondLevelexplv;
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
         /*   TextView tv = new TextView(MainActivity.this);
            tv.setText("->FirstLevel");
            tv.setBackgroundColor(Color.BLUE);
            tv.setPadding(10, 7, 7, 7);*/
            View tv=convertView;
            if(tv==null) {
                LayoutInflater layout = (LayoutInflater)  WplanActivity.this.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
                tv = layout.inflate(R.layout.parent_item, parent, false);
            }
            final JourneyPlanOpt template= (JourneyPlanOpt) getGroup(groupPosition);
            TextView textView=tv.findViewById(R.id.tvParent);
            View view=tv.findViewById(R.id.viewParent);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                view.setBackgroundTintList (ColorStateList.valueOf(template.getColor()));
            }
            textView.setText(template.getTitle());

            imgStartPlan=tv.findViewById(R.id.img_start_plan_pi);
            imgStartPlan.setImageResource(R.drawable.ic_action_goright);
            for(JourneyPlanOpt plan: journeyPlansInProgress){
                if(plan.getWorkplanTemplateId().equals(template.getId())){
                    if(selectedJPlan == null){
                        imgStartPlan.setImageResource(R.drawable.arrow_running);
                    } else {
                        String jId;
                        String jIdToMatch;
                        if(plan.getId().equals("")){
                            jId = plan.getPrivateKey();
                            jIdToMatch = selectedJPlan.getPrivateKey();
                        } else {
                            jId = plan.getId();
                            jIdToMatch = selectedJPlan.getId();
                        }
                        if(jId.equals(jIdToMatch)){
                            imgStartPlan.setImageResource(R.drawable.arrow_active);
                        }else {
                            imgStartPlan.setImageResource(R.drawable.arrow_running);
                        }

                    }
                    /*Drawable mIcon= ContextCompat.getDrawable(WplanActivity.this, R.drawable.arrow);
                    mIcon.setColorFilter(ContextCompat.getColor(WplanActivity.this, R.color.color_db_green_dark), PorterDuff.Mode.MULTIPLY);
                    imgStartPlan.setImageDrawable(mIcon);*/
                    //imgStartPlan.setLayoutParams(new LinearLayout.LayoutParams((int) dpToPixel(WplanActivity.this,24), (int)dpToPixel(WplanActivity.this,24)));

                    break;
                }}

            // }
            imgStartPlan.setOnClickListener(view1 -> {
                for(JourneyPlanOpt plan: journeyPlansInProgress){
                    if(plan.getWorkplanTemplateId().equals(template.getId())){
                        if(selectedJPlan == null|| selectedJPlan.getWorkplanTemplateId().equals("")){
                            String title= plan.getTitle();
                            final String code= plan.getCode();
                            String branchInfoString = getString(R.string.switching_inspection_msg2_part_1)+ " "+  "<b><i>"+ title + "</i></b>"+ "<br>" + getString(R.string.switching_inspection_msg2_part_2);
                            new AlertDialog.Builder(WplanActivity.this)
                                    .setTitle(getString(R.string.confirmation))
                                    .setMessage(Html.fromHtml(branchInfoString))
                                    .setIcon(android.R.drawable.ic_dialog_alert)
                                    .setPositiveButton(R.string.btn_ok, (dialog, whichButton) -> initData(code))
                                    .setNegativeButton(R.string.btn_cancel, null).show();
                        } else {
                            String jId;
                            String jIdToMatch;
                            if(plan.getId().equals("")){
                                jId = plan.getPrivateKey();
                                jIdToMatch = selectedJPlan.getPrivateKey();
                            } else {
                                jId = plan.getId();
                                jIdToMatch = selectedJPlan.getId();
                            }
                            if(jId.equals(jIdToMatch)){
                                launchActivity();
                            } else {

                                String title= plan.getTitle();
                                final String code= plan.getCode();
                                String branchInfoString = getString(R.string.switching_inspection_msg_part_1)+ " " +  "<b><i>"+ selectedJPlan.getTitle()+ "</i></b>"+"<br>" + getString(R.string.switching_inspection_msg_part_2)+ " "+ "<b><i>"+ title + "</i></b>"+ "<br>" + getString(R.string.switching_inspection_msg_part_3);
                                if(selectedJPlan.getStatus().equals(WORK_PLAN_FINISHED_STATUS)){
                                    branchInfoString = getString(R.string.switching_inspection_msg2_part_1)+ " " + "<b><i>"+ title + "</i></b>"+ "<br>" + getString(R.string.switching_inspection_msg2_part_2);
                                }
                                new AlertDialog.Builder(WplanActivity.this)
                                        .setTitle(getString(R.string.confirmation))
                                        .setMessage(Html.fromHtml(branchInfoString))
                                        .setIcon(android.R.drawable.ic_dialog_alert)
                                        .setPositiveButton(R.string.btn_ok, (dialog, whichButton) -> initData(code))
                                        .setNegativeButton(R.string.btn_cancel, null).show();
                            }
                        }
                        break;
                    }}



                String title =template.getTitle();
                boolean isInProgress = false;
                code =template.getCode();
                String branchInfoString = "";
                String prevInspection = "";
                for(JourneyPlanOpt plan: journeyPlansInProgress){
                    if(plan.getWorkplanTemplateId().equals(template.getId())){
                        isInProgress = true;
                        break;
                    }
                }
                if(selectedJPlan != null){
                    prevInspection = getString(R.string.inspection_in_progress_msg_part_1) + " " +"<b><i>" + selectedJPlan.getTitle() +"</i></b>"+" " + getString(R.string.inspection_in_progress_msg_part_2) + "<br>";
                }
                if(isInProgress){
                    branchInfoString = prevInspection + getString(R.string.switching_inspection_msg2_part_2)+" \n" +
                            "<b><i>" + title + "</i></b>" + "\n"+getString(R.string.work_plan)+"?";
                } else {
                    branchInfoString = prevInspection + getString(R.string.want_to_start_work_plan)+" \n" +
                            "<b><i>" + title + "</i></b>" + "\n"+getString(R.string.work_plan)+"?";
                }
                /*if(selectedJPlan != null){
                    prevInspection = "Inspection " + "<b><i>" + selectedJPlan.getTitle() +"</i></b>"+ " is currently in progress.\n";
                }
                branchInfoString = prevInspection + getString(R.string.want_to_start_work_plan)+" \n" +
                        "<b><i>" + title + "</i></b>" + "\n"+getString(R.string.work_plan)+"?";*/
                final boolean finalIsInProgress = isInProgress;
                if(selectedJPlan!=null){
                    if(selectedJPlan.getWorkplanTemplateId().equals(template.getId())){
                        //Toast.makeText( WplanActivity.this,"Already in progress!",Toast.LENGTH_SHORT).show();
                        return;
                    }
                }
                if(!finalIsInProgress){
                    new AlertDialog.Builder( WplanActivity.this)
                            .setTitle(getString(R.string.confirmation))
                            .setMessage(Html.fromHtml(branchInfoString))
                            .setIcon(android.R.drawable.ic_dialog_alert)
                            .setCancelable(false)
                            .setPositiveButton(R.string.btn_ok, new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int whichButton) {
                                   /* Intent returnIntent = new Intent();
                                    returnIntent.putExtra("Selection", "Yes");
                                    returnIntent.putExtra("Position", groupPosition);
                                    returnIntent.putExtra("code",code);
                                    returnIntent.putExtra("Mode", "New");
                                    //returnIntent.putExtra("StartMP", "");
                                     WplanActivity.this.setResult(RESULT_OK, returnIntent);
                                    selectedUnit = null;
                                     WplanActivity.this.finish();*/
                                    initInspectionData(code);
                                }
                            })
                            .setNegativeButton(R.string.btn_cancel, null).show();
                }

                isInProgress = false;
            });

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

    public class CustExpListview extends ExpandableListView
    {

        int intGroupPosition, intChildPosition, intGroupid;

        public CustExpListview(Context context)
        {
            super(context);
        }
        protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec)
        {
            //widthMeasureSpec = MeasureSpec.makeMeasureSpec(960, MeasureSpec.AT_MOST);
            heightMeasureSpec = MeasureSpec.makeMeasureSpec(999999, MeasureSpec.AT_MOST);
            super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        }

        /*protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec)
        {
            widthMeasureSpec = MeasureSpec.makeMeasureSpec(2000, MeasureSpec.AT_MOST);
            heightMeasureSpec = MeasureSpec.makeMeasureSpec(600, MeasureSpec.AT_MOST);
            super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        }*/
    }

    public class SecondLevelAdapter extends BaseExpandableListAdapter
    {
        final ArrayList<UnitsOpt> unitArrayList;
        public SecondLevelAdapter(ArrayList unitList){
            this.unitArrayList=unitList;
        }

        @Override
        public Object getChild(int groupPosition, int childPosition)
        {
            return unitArrayList.get(groupPosition).getTestList()==null?0:unitArrayList.get(groupPosition).getTestList().get(childPosition);
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
            /*TextView tv = new TextView(MainActivity.this);
            tv.setText("child");
            tv.setPadding(15, 5, 5, 5);
            tv.setBackgroundColor(Color.YELLOW);
            tv.setLayoutParams(new ListView.LayoutParams(ViewGroup.LayoutParams.FILL_PARENT, ViewGroup.LayoutParams.FILL_PARENT));*/
            View tv=convertView;
            if(tv==null) {
                LayoutInflater layout = (LayoutInflater)  WplanActivity.this.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
                tv = layout.inflate(R.layout.third_level_item, parent, false);
            }
            UnitsTestOpt test=(UnitsTestOpt)getChild(groupPosition,childPosition);
            TextView textView=tv.findViewById(R.id.tvThird);
            textView.setText(test.getTitle());

            TextView tvDueText=tv.findViewById(R.id.tvDueText);
            tvDueText.setText(test.getDueText());
            View view=tv.findViewById(R.id.viewThird);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                view.setBackgroundTintList (ColorStateList.valueOf(test.getColor()));
            }
            return tv;
        }

        @Override
        public int getChildrenCount(int groupPosition)
        {
            return  unitArrayList.get(groupPosition).getTestList() ==null?0:unitArrayList.get(groupPosition).getTestList().size();
        }

        @Override
        public Object getGroup(int groupPosition)
        {
            return unitArrayList.get(groupPosition);
        }

        @Override
        public int getGroupCount()
        {
            return unitArrayList==null?0:unitArrayList.size();
        }

        @Override
        public long getGroupId(int groupPosition)
        {
            return groupPosition;
        }

        @Override
        public View getGroupView(int groupPosition, boolean isExpanded,
                                 View convertView, ViewGroup parent)
        {
/*
            TextView tv = new TextView(MainActivity.this);
            tv.setText("-->Second Level");
            tv.setPadding(12, 7, 7, 7);
            tv.setBackgroundColor(Color.RED);
*/
            View tv=convertView;
            if(tv==null) {
                LayoutInflater layout = (LayoutInflater)  WplanActivity.this.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
                tv = layout.inflate(R.layout.second_level_item, parent, false);
            }
            UnitsOpt unit=(UnitsOpt) getGroup(groupPosition);
            TextView textView=tv.findViewById(R.id.tvSecond);
            String desc=unit.getDescription() + " ["+unit.getAssetTypeDisplayName()+"]";
            textView.setText(desc);
            View view=tv.findViewById(R.id.viewSecond);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                view.setBackgroundTintList (ColorStateList.valueOf(unit.getColor()));
            }
            return tv;
        }

        @Override
        public boolean hasStableIds() {
            // TODO Auto-generated method stub
            return true;
        }

        @Override
        public boolean isChildSelectable(int groupPosition, int childPosition) {
            // TODO Auto-generated method stub
            return true;
        }

    }

    private ArrayList<UnitsTestOpt> getMockData(){
        ArrayList _testList=new ArrayList();
        //int mockSize=(int)Math.round(Math.random()*4);
        int mockSize= 1 + (int)(Math.random() * ((4 - 1) + 1));
        for(int i=0;i<mockSize;i++){
            String testName="G00" +(i+1);
            //int testStatus=(int)Math.round(Math.random()*3);
            int testStatus= 1 + (int)(Math.random() * ((3 - 1) + 1));
            JSONObject jo=new JSONObject();
            try {
                jo.put("description",testName);
                UnitsTestOpt test=new UnitsTestOpt(jo);
                switch(testStatus){
                    case 1:
                        //   test.setColor(Color.parseColor("darkgray"));
                        test.setDueText("Due in 10 day(s)");
                        break;
                    case 2:
                        test.setDueText("Expire in 12 day(s)");
                        //   test.setColor(Color.parseColor(Globals.Green));
                        break;
                    case 3:
                        test.setDueText("Expires in 2 day(s)");
                        //   test.setColor(Color.parseColor("#FFFF0000"));
                        break;
                }
                _testList.add(test);
            } catch (JSONException e) {
                e.printStackTrace();
            }

        }
        return _testList;
    }

    public void refresh(){
        if(this.expandableListView!=null) {
            try {
                inbox.loadWokPlanTemplateListEx();

                wpTemplateList = inbox.getJPLocationOpts().getJourneyPlanListByLocation(areaType);
                this.itemsAdapter = new  ParentLevel(this.wpTemplateList);
                this.expandableListView.setAdapter(this.itemsAdapter);

                horizontalAdapter=new  JPAreaAdapter(inbox.getJPLocationOpts().getJourneyPlansLocationsList());

                horizontal_recycler_view.setAdapter(horizontalAdapter);
                refreshColorLegend();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public void refresh(String areaType){
        if(this.expandableListView!=null) {
            wpTemplateList = inbox.getJPLocationOpts().getJourneyPlanListByLocation(areaType);
            this.itemsAdapter = new  ParentLevel(this.wpTemplateList);
            this.expandableListView.setAdapter(this.itemsAdapter);


            refreshColorLegend();
        }
    }


    public void refreshColors(){
        if(viewColorNA!=null){
            refreshColorLegend();
        }
    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, final Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if(requestCode == INSPECTION_ACTIVITY_REQUEST_CODE){
            if(resultCode == RESULT_OK){
                journeyPlansInProgress = inbox.getInProgressJourneyPlans();
                refresh();
            }
        }
        if (requestCode == START_INSPECTION_REQUEST_CODE) {
            if (resultCode == RESULT_OK) {

                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        //initInspectionData(code);
                        String expEnd = data.getStringExtra("expEnd");
                        startSession(initialInspection, expEnd);
                        Globals.safetyBriefing = null;
                        Globals.listViews = new HashMap<Integer, View>();
                    }
                }).start();
                //refreshing the list of templates

            } else if (resultCode == RESULT_CANCELED) {
                initialInspection = null;
                initialRun = null;
            }
        }
    }
    // Dashboard code
    private void initInspectionData(String jpCode){
        selectedJPlan = null;
        setSelectedTask(null);
        selectedUnit = null;
        selectedDUnit = null;
        if (!jpCode.equals("")) {
            JourneyPlan journeyPlan = inbox.loadJourneyPlanTemplate( WplanActivity.this, jpCode);
            //journeyPlan.setUserStartMp(startMp);
            startSessionProcess(journeyPlan);
        }
    }
    public void startSessionProcess(final JourneyPlan jPlan){
        if(jPlan.getTaskList().size() == 1 && isBypassTaskView){
            if(isMaintainer || appName.equals(Globals.AppName.SCIM)){
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        jPlan.getTaskList().get(0).setUserStartMp(jPlan.getTaskList().get(0).getMpStart());
                        jPlan.getTaskList().get(0).setUserEndMp(jPlan.getTaskList().get(0).getMpEnd());
                        jPlan.getTaskList().get(0).setInspectionTypeTag("required");
                        jPlan.getTaskList().get(0).setInspectionType("Required Inspection");
                        jPlan.getTaskList().get(0).setInspectionTypeDescription("");
                        jPlan.getTaskList().get(0).setTraverseBy("");
                        jPlan.getTaskList().get(0).setTraverseTrack("");
                        jPlan.getTaskList().get(0).setWeatherConditions("");
                        jPlan.getTaskList().get(0).setTemperature("");
                        jPlan.getTaskList().get(0).setTemperatureUnit("");
                        try {
                            jPlan.getTaskList().get(0).setLocationUnit(Globals.selectedPostSign);
                            jPlan.getTaskList().get(0).setTemperatureUnit(Globals.selectedTempSign);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                        startSession(jPlan,"");
                        Globals.safetyBriefing = null;
                        Globals.listViews = new HashMap<Integer, View>();
                    }}).start();
                return;
            }
            if(isMpReq||isTraverseReq||isWConditionReq||isInspectionTypeReq||showNearByAssets) {
                initialInspection = jPlan;
                Intent intent = new Intent( WplanActivity.this, InspectionStartActivity.class);
                startActivityForResult(intent, START_INSPECTION_REQUEST_CODE);
            } else {
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        startSession(jPlan,"");
                        Globals.safetyBriefing = null;
                        Globals.listViews = new HashMap<Integer, View>();
                    }}).start();
            }
        } else {
            new Thread(new Runnable() {
                @Override
                public void run() {
                    startSession(jPlan,"");
                    Globals.safetyBriefing = null;
                    Globals.listViews = new HashMap<Integer, View>();
                }}).start();
        }
    }
    public void startSession(JourneyPlan journeyPlan, String expEnd) {
        //String location = "";
        String dayToStart="";
        /*
        if(!Globals.isInternetAvailable(DashboardActivity.this)){
            //Toast.makeText(DashboardActivity.this,"Network Unavailable!",Toast.LENGTH_SHORT).show();
            showToastOnUiThread(getResources().getString(R.string.network_unavailable));
            return ;

        }
        */
        DBHandler db= Globals.db;
        boolean isServerAvailable=Globals.isServerAvailable();
        Globals.setOfflineMode(!isServerAvailable);

        RefreshWithLastLocation();
        String listName = Globals.JPLAN_LIST_NAME;
        JSONObject jo = new JSONObject();
        SimpleDateFormat _formatDay = new SimpleDateFormat("yyyy-MM-dd");
        Date curDate = new Date();
        journeyPlan.setuId("");
        journeyPlan.setDate(curDate.toString());
        journeyPlan.setStartDateTime(curDate.toString());
        journeyPlan.setStartLocation(location);
        journeyPlan.setStatus(WORK_PLAN_IN_PROGRESS_STATUS);
        User user = new User();
        user.setEmail(userEmail);
        user.setId(userUID);
        user.setName(Globals.userName);
        journeyPlan.setUser(user);
        journeyPlan.setPrivateKey(inbox.generateLocalJPCode());
        journeyPlan.setCopyAllProps(true);
        JSONObject joWorkPlan=journeyPlan.getJsonObject();

        joWorkPlan.remove("_id");
        final String strJPlanTitle=journeyPlan.getTitle();
        StaticListItem item = new StaticListItem(Globals.orgCode, listName
                , journeyPlan.getPrivateKey(), "", joWorkPlan.toString(), "");
        WplanActivity.this.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                showDialog(getResources().getString(R.string.work_plan_starting),getResources().getString(R.string.please_wait) );
            }
        });
        isDayProcessRunning=true;
        ArrayList<StaticListItem> _items =new ArrayList<>();
        _items.add(item);
        saveCurrentJP(journeyPlan.getPrivateKey());
        if(!Globals.offlineMode && Globals.webUploadMessageLists( WplanActivity.this,Globals.orgCode,_items)==1){
            sleep(500);
            if(Globals.webPullRequest( WplanActivity.this,"")){
                Globals.inbox=null;
                Globals.selectedJPlan=null;
                Globals.loadInbox( WplanActivity.this);
                loadDayStatus( WplanActivity.this);
                sleep(500);
                //if(Globals.dayStarted){
                    makeDocumentsAvailable();
                    WplanActivity.this.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            hideDialog();
                            Toast.makeText( WplanActivity.this,getResources().getString(R.string.inspection_started),Toast.LENGTH_SHORT).show();
                        }
                    });

//                }else{
//
//                    WplanActivity.this.runOnUiThread(new Runnable() {
//                        @Override
//                        public void run() {
//                            hideDialog();
//                            Toast.makeText( WplanActivity.this,getResources().getString(R.string.unable_to_start_inspection),Toast.LENGTH_SHORT).show();
//                        }
//                    });
//                }
            }
        } else if(Globals.offlineMode){
            db.AddOrUpdateMsgList(Globals.JPLAN_LIST_NAME,orgCode,item, MESSAGE_STATUS_READY_TO_POST);
            //Globals.inbox=null;
            Globals.selectedJPlan=null;
            loadInbox(WplanActivity.this);
            Globals.saveCurrentJP(item.getCode());
            //Globals.loadInbox(DashboardActivity.this);
            loadDayStatus( WplanActivity.this);
            //refreshSOD();
            //Log.i("WP Start:",Globals.selectedJPlan.getJsonObject().toString());
            //sleep(500);

        }

        WplanActivity.this.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                hideDialog();
            }
        });
        isDayProcessRunning=false;
        // Check if require to start task
        if(journeyPlan.getTaskList().size() == 1 && isBypassTaskView){
            if(initialRun == null){
                initialRun = journeyPlan.getTaskList().get(0);
            }
            startRun(expEnd);
        }
    }
    void showDialog(String title,String message){
        dialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
        dialog.setTitle(title);
        dialog.setMessage(message);
        dialog.setIndeterminate(true);
        dialog.setCanceledOnTouchOutside(false);
        dialog.show();
    }
    void hideDialog(){
        if(dialog!=null){
            if(dialog.isShowing()){
                dialog.dismiss();
            }
        }
    }
    public void startRun(String expEnd){
        Date now = new Date();
        String selTaskId = Globals.initialRun.getTaskId();
        if(selectedJPlan!=null){
            for (Task task: Globals.selectedJPlan.getTaskList()){
                if(task.getTaskId().equals(selTaskId)){
                    task.setStatus(TASK_IN_PROGRESS_STATUS);
                    task.setStartTime(now.toString());
                    Globals.isTaskStarted = true;
                    Session session = new Session();
                    if(latitude.equals("") || longitude.equals("")){
                        RefreshWithLastLocation();
                        task.setStartLocation(location);
                        session.setStartLocation(location);
                    } else{
                        task.setStartLocation(latitude + "," + longitude);
                        session.setStartLocation(latitude + "," + longitude);
                    }

                    if(initialRun.getInspectionType().equals("")){
                        task.setInspectionType("Required Inspection");
                        task.setInspectionTypeTag("required");
                    } else {
                        task.setInspectionType(initialRun.getInspectionType());
                        task.setInspectionTypeTag(initialRun.getInspectionTypeTag());
                    }
                    task.setInspectionTypeDescription(initialRun.getInspectionTypeDescription());
                    task.setWeatherConditions(initialRun.getWeatherConditions());
                    task.setTraverseBy(initialRun.getTraverseBy());
                    task.setUserStartMp(initialRun.getUserStartMp());
                    task.setLocationUnit(initialRun.getLocationUnit());
                    task.setTemperatureUnit(initialRun.getTemperatureUnit());
                    task.setTraverseTrack(initialRun.getTraverseTrack());
                    //Setting app version
                    try {
                        task.setAppVersion(BuildConfig.VERSION_NAME);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    if(initialRun.getObserveTrack().equals("0")){
                        task.setObserveTrack("");
                    } else {
                        task.setObserveTrack(initialRun.getObserveTrack());
                    }
                    task.setTemperature(initialRun.getTemperature());
                    task.setYardInspection(initialRun.isYardInspection());

                    UUID uuid = UUID.randomUUID();
                    session.setId(uuid.toString());
                    session.setStatus(SESSION_STARTED);
                    session.setStartTime(now.toString());
                    session.setStart(initialRun.getUserStartMp());
                    session.setTraverseTrack(initialRun.getTraverseTrack());
                    if(initialRun.getObserveTrack().equals("0")){
                        session.setObserveTrack("");
                        session.setAllSideTracks(true);
                    } else {
                        session.setObserveTrack(initialRun.getObserveTrack());
                        session.setAllSideTracks(false);
                    }
                    if(appName.equals(Globals.AppName.SCIM)){
                        session.setStart(task.getMpStart());
                        task.setUserStartMp(task.getMpStart());
                        session.setEnd(task.getMpEnd());
                        session.setExpEnd(task.getMpEnd());
                        task.setUserEndMp(task.getMpEnd());
                    } else {
                        session.setStart(initialRun.getUserStartMp());
                        //in case if expected end is unavailable
                        if(expEnd.equals("")){
                            session.setExpEnd(task.getMpEnd());
                            session.setEnd(task.getMpEnd());
                        } else {
                            session.setExpEnd(expEnd);
                            session.setEnd(expEnd);
                        }
                    }
                    selectedJPlan.getIntervals().getSessions().add(session);
                    setSelectedTask(task);
                    activeSession = session;
                }}
            //SimpleDateFormat _format = new SimpleDateFormat("hh:mm:ss aa");
       /* Globals.selectedTask.setStatus(TASK_IN_PROGRESS_STATUS);
        Globals.selectedTask.setStartTime(now.toString());
        Globals.isTaskStarted = true;
        Globals.selectedTask.setStartLocation(latitude + "," + longitude);*/
            for(Units unit: getSelectedTask().getWholeUnitList()){
                if(unit.getUnitId().equals(activeSession.getTraverseTrack())){
                    unit.setFreeze(true);
                    break;
                }
            }

            if(getSelectedTask() == null){
                setSelectedTask(selectedJPlan.getTaskList().get(0));
            }
            if(Globals.selectedUnit == null){
                if(getSelectedTask().getWholeUnitList().size() == 0){
                    Toast.makeText( WplanActivity.this,getResources().getText(R.string.asset_available), Toast.LENGTH_SHORT).show();
                } else{
                    if(isUseDefaultAsset){
                        for(Units unit:getSelectedTask().getWholeUnitList()){
                            if(unit.getAttributes().isPrimary()){
                                Globals.selectedUnit = unit;
                            }
                        }
                    }else {

                    }

                }
            }
            //Intent intent = new Intent(TaskDashboardActivity.this, IssuesActivity.class);//Intent intent = new Intent(TaskActivity.this, TaskDetailActivity.class);
            if(selectedJPlan.getWorkplanTemplateId().equals("")){
                Log.i("WPLAN ID ", "ID is empty");
            }
            Globals.selectedJPlan.update();
            if(selectedJPlan.getWorkplanTemplateId().equals("")){
                Log.i("WPLAN ID ", "ID is empty");
            }
            //Globals.selectedJPlan=Globals.inbox.refreshJP(selectedJPlan);
            //selectedTask = null;
            initialRun = null;
            initialInspection = null;
            launchActivity();
        }

        //loadTaskDetails();
        //startActivity(intent);
    }
    private void makeDocumentsAvailable() {
        DynFormList.loadFormList();
        ArrayList<String> fileList=DynFormList.getPdfFileList();
        for(String fileName:fileList){
            if(!Utilities.isDocumentExists(fileName)) {
                if(dialog!=null){
                    final String fileName1=fileName;
                    WplanActivity.this.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            if(dialog.isShowing()){
                                dialog.setMessage(getString(R.string.downloading_file)+ " "+fileName1);
                            }
                        }
                    });
                }
                Utilities.makeDocAvailableEx( WplanActivity.this.getApplicationContext(), fileName);
            }
        }
    }

    private void sleep(long milis){
        try {
            Thread.sleep(milis);
        }catch (Exception e){

        }
    }
    private void initData(String jpCode){
        saveCurrentJP(jpCode);
        setSelectedTask(null);
        selectedUnit = null;
        selectedDUnit = null;
        selectedJPlan = inbox.getCurrentJourneyPlan();
        dayStarted = true;
        Globals.safetyBriefing = null;
        Globals.listViews = new HashMap<Integer, View>();
        launchActivity();
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

    private void launchActivity(){
        try {
            if (Globals.selectedJPlan != null && Globals.selectedJPlan.getTaskList()!=null) {
                if (Globals.selectedJPlan.getTaskList().size() == 1) {
                    setSelectedTask(selectedJPlan.getTaskList().get(0));
                    activeSession = null;
                    selectedJPlan.setActiveSession();
                    //Intent intent = new Intent(DashboardActivity.this, TaskDashboardActivity.class);

                    Intent intent = new Intent( WplanActivity.this, InspectionActivity.class);
                    startActivity(intent);
                } else {
                    Intent intent = new Intent( WplanActivity.this, InboxActivity.class);
                    startActivity(intent);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void refreshColorLegend(){
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            viewColorNA.setBackgroundTintList (ColorStateList.valueOf(Globals.COLOR_TEST_NOT_ACTIVE));
            viewColorA.setBackgroundTintList (ColorStateList.valueOf(Globals.COLOR_TEST_ACTIVE));
            viewColorExp.setBackgroundTintList (ColorStateList.valueOf(Globals.COLOR_TEST_EXPIRING));
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        try {
            LocationUpdatesService.addOnLocationUpdateListener( this.getClass().getSimpleName(), this);
            journeyPlansInProgress = inbox.getInProgressJourneyPlans();
            refresh();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void onPause(){
        super.onPause();
        try {
            LocationUpdatesService.removeLocationUpdateListener(this.getClass().getSimpleName());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    // End
}