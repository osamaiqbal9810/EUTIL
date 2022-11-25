package com.app.ps19.scimapp.wplan;

import android.app.SearchManager;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.graphics.Typeface;
import android.os.Build;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.RecyclerView;

import android.text.Html;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseExpandableListAdapter;
import android.widget.ExpandableListView;
import android.widget.ImageView;
import android.widget.SearchView;
import android.widget.TextView;

import com.app.ps19.scimapp.R;
import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.classes.JourneyPlanOpt;
import com.app.ps19.scimapp.classes.UnitsOpt;
import com.app.ps19.scimapp.classes.UnitsTestOpt;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import static android.app.Activity.RESULT_OK;
import static com.app.ps19.scimapp.Shared.Globals.inbox;
import static com.app.ps19.scimapp.Shared.Globals.selectedJPlan;
import static com.app.ps19.scimapp.Shared.Globals.selectedUnit;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link TemplateTestFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class TemplateTestFragment extends Fragment implements SearchView.OnQueryTextListener, SearchView.OnCloseListener {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    ArrayList<Template> templateList=new ArrayList<>();
    ArrayList<JourneyPlanOpt> wpTemplateList=inbox.loadWokPlanTemplateListEx();
    ExpandableListView expandableListView;
    // TODO: Rename and change types of parameters
    private String areaType;
    private String mParam2;
    View viewColorNA;
    View viewColorA;
    View viewColorExp;
    private  RecyclerView  horizontal_recycler_view;
    private JPAreaAdapter horizontalAdapter;

    View viewLocationColor;
    TextView tvUnitLocation;
    ParentLevel itemsAdapter;
    ArrayList<JourneyPlanOpt> journeyPlansInProgress;
    public TemplateTestFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment TemplateTestFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static TemplateTestFragment newInstance(String param1, String param2) {
        TemplateTestFragment fragment = new TemplateTestFragment();
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
            areaType = getArguments().getString(ARG_PARAM1);
            wpTemplateList = inbox.getJPLocationOpts().getJourneyPlanListByLocation(areaType);

            if(wpTemplateList.size() == 0){
                wpTemplateList=inbox.loadWokPlanTemplateListEx();
            }

            mParam2 = getArguments().getString(ARG_PARAM2);
        }
        journeyPlansInProgress = inbox.getInProgressJourneyPlans();
        ArrayList<Test> testList=new ArrayList<>();
        for(int i=0;i<10;i++){
            testList.add(new Test(("G00"+i),(i%2==0)?Globals.COLOR_TEST_NOT_ACTIVE:Globals.COLOR_TEST_ACTIVE,(i%2==0)?"Due in 2 days":"Exipre in x Days"));
        }

        Template template1=new Template("Template 1", Globals.COLOR_TEST_NOT_ACTIVE);
        Template template2=new Template("Template 2", Globals.COLOR_TEST_ACTIVE);
        Template template3=new Template("Template 3", Globals.COLOR_TEST_NOT_ACTIVE);
        ArrayList<Unit> unitList=new ArrayList<>();
        for(int i=0;i<3;i++){
            unitList.add(new Unit("Unit "+(i+1), Globals.COLOR_TEST_NOT_ACTIVE));
            unitList.get(i).testList.add(testList.get(0));
            unitList.get(i).testList.add(testList.get(1));
            unitList.get(i).testList.add(testList.get(3));
        }
        ArrayList<Unit> unitList1=new ArrayList<>();
        for(int i=0;i<3;i++){
            unitList1.add(new Unit("Unit "+(i+4), Globals.COLOR_TEST_NOT_ACTIVE));
        }
        ArrayList<Unit> unitList2=new ArrayList<>();
        for(int i=0;i<3;i++){
            unitList2.add(new Unit("Unit "+(i+7), Globals.COLOR_TEST_NOT_ACTIVE));

        }

        template1.unitList=unitList;
        template2.unitList=unitList1;
        template3.unitList=unitList2;
        templateList.add(template1);
        templateList.add(template2);
        templateList.add(template3);

    }
    private void refreshColorLegend(){
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            viewColorNA.setBackgroundTintList (ColorStateList.valueOf(Globals.COLOR_TEST_NOT_ACTIVE));
            viewColorA.setBackgroundTintList (ColorStateList.valueOf(Globals.COLOR_TEST_ACTIVE));
            viewColorExp.setBackgroundTintList (ColorStateList.valueOf(Globals.COLOR_TEST_EXPIRING));
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        // Inflate the layout for this fragment
        View view=inflater.inflate(R.layout.fragment_template_test, container, false);
        expandableListView=view.findViewById(R.id.expandableListView);
        viewColorNA=view.findViewById(R.id.colorNA);
        viewColorA=view.findViewById(R.id.colorA);
        viewColorExp=view.findViewById(R.id.colorExp);


//        viewLocationColor=view.findViewById(R.id.v_location_color);
//        tvUnitLocation = view.findViewById(R.id.tv_Unit_Loc);

        refreshColorLegend();
        SearchView search;
        SearchManager searchManager = (SearchManager) getActivity().getSystemService(Context.SEARCH_SERVICE);
        search = (SearchView) view.findViewById(R.id.search_ftt);
        search.setSearchableInfo(searchManager.getSearchableInfo(getActivity().getComponentName()));
        search.setIconifiedByDefault(false);
        search.setOnQueryTextListener(this);
        search.setOnCloseListener(this);


        //expandableListView.setAdapter(new ParentLevel(templateList));
        //Collections.reverse(wpTemplateList);
        // for(int i=0;i<wpTemplateList.get(0).getUnitList().size();i++){
        // wpTemplateList.get(0).getUnitList().get(i).setTestList(getMockData());
        // }
        //wpTemplateList.get(0).getUnitList().get(0).setTestList(getMockData());

        itemsAdapter=new ParentLevel(wpTemplateList);
        expandableListView.setAdapter(itemsAdapter);

        horizontalAdapter=new JPAreaAdapter(inbox.getJPLocationOpts().getJourneyPlansLocationsList());
        horizontal_recycler_view= (RecyclerView) view.findViewById(R.id.rvLocations);
        horizontal_recycler_view.setAdapter(horizontalAdapter);


        return view;
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

    public void onLocationChange(String location){

    }



    @Override
    public boolean onClose() {
        itemsAdapter.filterData("");
        return false;
    }

    public class Template{
        public String description="";
        public int color= Globals.COLOR_TEST_NOT_ACTIVE;
        public ArrayList<Unit> unitList=new ArrayList<>();
        public Template(String description, int color){
            this.description=description;
            this.color=color;
        }

    }
    public class Unit {
        public String description="";
        public int color=Globals.COLOR_TEST_ACTIVE;
        public ArrayList<Test> testList=new ArrayList<>();
        public Unit(String description, int color){
            this.description=description;
            this.color=color;
        }
    }
    public class Test{
        public String description="";
        public int color=Globals.COLOR_TEST_ACTIVE;
        public String dueText ="";
        public Test(String description , int color, String dueText){
            this.description=description;
            this.color=color;
            this.dueText=dueText;

        }
    }



    public class JPAreaAdapter extends RecyclerView.Adapter<JPAreaAdapter.MyViewHolder> {
        List<String> areaList;
        List<TextView> viewList = new ArrayList<>();

        class MyViewHolder extends RecyclerView.ViewHolder {
            TextView tvJPLocation;
            View vJPLocColor;
            MyViewHolder(View itemView) {
                super(itemView);
                this.vJPLocColor =(View) itemView.findViewById(R.id.viewLocColor);
                this.tvJPLocation = (TextView) itemView.findViewById(R.id.tvLocTxt);


                itemView.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {

                        for(TextView tv : viewList){
                            tv.setTextColor(Color.LTGRAY);
                            tv.setTypeface(null, Typeface.NORMAL);
                        }

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
        public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
            LayoutInflater layout = (LayoutInflater) getActivity().getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            View view = layout.inflate(R.layout.location_item, parent, false);
            MyViewHolder holder = new MyViewHolder(view);

            return holder;
        }
        @Override
        public void onBindViewHolder(MyViewHolder holder, int position) {
            TextView tvLocation = holder.tvJPLocation;
            viewList.add(tvLocation);
            tvLocation.setText(this.areaList.get(position));
            tvLocation.setTextColor(Color.LTGRAY);
            if (position != 0) {

                View locColor = holder.vJPLocColor;
                final int jpColor = inbox.getJPLocationOpts().
                        getJPLocationColor(this.areaList.get(position));

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    locColor.setBackgroundTintList(ColorStateList.valueOf(jpColor));
                }
            }
            else{
                tvLocation.setTextColor(Color.WHITE);
                tvLocation.setTypeface(null, Typeface.BOLD);
            }
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
            CustExpListview SecondLevelexplv = new CustExpListview(getActivity());
            ArrayList<Unit> unitList=(ArrayList<Unit>) getChild(groupPosition,childPosition);
            SecondLevelexplv.setAdapter(new SecondLevelAdapter(unitList));
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
                LayoutInflater layout = (LayoutInflater) getActivity().getSystemService(Context.LAYOUT_INFLATER_SERVICE);
                tv = layout.inflate(R.layout.parent_item, parent, false);
            }
            final JourneyPlanOpt template= (JourneyPlanOpt) getGroup(groupPosition);
            TextView textView=tv.findViewById(R.id.tvParent);
            View view=tv.findViewById(R.id.viewParent);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                view.setBackgroundTintList (ColorStateList.valueOf(template.getColor()));
            }
            ;
            //String label=""+ template.getSortOrder()+". "+ template.getTitle();
            //            textView.setText(label);
            textView.setText(template.getTitle());


            imgStartPlan=tv.findViewById(R.id.img_start_plan_pi);
            imgStartPlan.setImageResource(R.drawable.ic_action_goright);
            for(JourneyPlanOpt plan: journeyPlansInProgress){
                if(plan.getWorkplanTemplateId().equals(template.getId())){
                    imgStartPlan.setImageResource(R.drawable.ic_outline_lock_24);
                    break;
                }}

            imgStartPlan.setOnClickListener(new View.OnClickListener() {
                public void onClick(View view) {
                    String title =template.getTitle();
                    boolean isInProgress = false;
                    final String code =template.getCode();
                    String branchInfoString = "";
                    String prevInspection = "";
                    for(JourneyPlanOpt plan: journeyPlansInProgress){
                        if(plan.getWorkplanTemplateId().equals(template.getId())){
                            isInProgress = true;
                            break;
                        }
                    }
                    if(selectedJPlan != null){
                        prevInspection = getString(R.string.inspection_in_progress_msg_part_1) + "<b><i>" + selectedJPlan.getTitle() +"</i></b>"+ getString(R.string.inspection_in_progress_msg_part_2) + "\n";
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
                            //Toast.makeText(getActivity(),"Already in progress!",Toast.LENGTH_SHORT).show();
                            return;
                        }
                    }
                    if(!finalIsInProgress){
                        new AlertDialog.Builder(getActivity())
                                .setTitle(getString(R.string.confirmation))
                                .setMessage(Html.fromHtml(branchInfoString))
                                .setIcon(android.R.drawable.ic_dialog_alert)
                                .setCancelable(false)
                                .setPositiveButton(R.string.btn_ok, new DialogInterface.OnClickListener() {
                                    public void onClick(DialogInterface dialog, int whichButton) {
                                        Intent returnIntent = new Intent();
                                        returnIntent.putExtra("Selection", "Yes");
                                        returnIntent.putExtra("Position", groupPosition);
                                        returnIntent.putExtra("code",code);
                                        returnIntent.putExtra("Mode", "New");
                                        //returnIntent.putExtra("StartMP", "");
                                        getActivity().setResult(RESULT_OK, returnIntent);
                                        selectedUnit = null;
                                        getActivity().finish();
                                    }
                                })
                                .setNegativeButton(R.string.btn_cancel, null).show();
                    }

                    isInProgress = false;
                }

                // }
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
                LayoutInflater layout = (LayoutInflater) getActivity().getSystemService(Context.LAYOUT_INFLATER_SERVICE);
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
                LayoutInflater layout = (LayoutInflater) getActivity().getSystemService(Context.LAYOUT_INFLATER_SERVICE);
                tv = layout.inflate(R.layout.second_level_item, parent, false);
            }
            UnitsOpt unit=(UnitsOpt) getGroup(groupPosition);
            TextView textView=tv.findViewById(R.id.tvSecond);
            String desc=unit.getDescription() + " ["+unit.getAssetType()+"]";
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
            inbox.loadWokPlanTemplateListEx();

            wpTemplateList = inbox.getJPLocationOpts().getJourneyPlanListByLocation(areaType);
            this.itemsAdapter = new ParentLevel(this.wpTemplateList);
            this.expandableListView.setAdapter(this.itemsAdapter);

            horizontalAdapter=new JPAreaAdapter(inbox.getJPLocationOpts().getJourneyPlansLocationsList());

            horizontal_recycler_view.setAdapter(horizontalAdapter);
            refreshColorLegend();
        }
    }

    public void refresh(String areaType){
        if(this.expandableListView!=null) {
            wpTemplateList = inbox.getJPLocationOpts().getJourneyPlanListByLocation(areaType);
            this.itemsAdapter = new ParentLevel(this.wpTemplateList);
            this.expandableListView.setAdapter(this.itemsAdapter);


            refreshColorLegend();
        }
    }


    public void refreshColors(){
        if(viewColorNA!=null){
            refreshColorLegend();
        }
    }

}