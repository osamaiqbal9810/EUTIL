package com.app.ps19.tipsapp.unitsGroup;

import android.app.Activity;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.os.Build;
import android.os.Bundle;

import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseExpandableListAdapter;
import android.widget.CheckBox;
import android.widget.ExpandableListView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.PopupMenu;
import android.widget.TextView;
import android.widget.Toast;

import com.amrdeveloper.treeview.TreeNode;
import com.amrdeveloper.treeview.TreeViewAdapter;
import com.amrdeveloper.treeview.TreeViewHolderFactory;
import com.app.ps19.tipsapp.AppFormActivity;
import com.app.ps19.tipsapp.R;
import com.app.ps19.tipsapp.ReportAddActivity;
import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.UnitCordsAdjActivity;
import com.app.ps19.tipsapp.classes.DUnit;
import com.app.ps19.tipsapp.classes.Report;
import com.app.ps19.tipsapp.classes.Units;
import com.app.ps19.tipsapp.classes.UnitsTestOpt;
import com.app.ps19.tipsapp.classes.dynforms.AppFormDialogFragment;
import com.app.ps19.tipsapp.classes.equipment.Equipment;
import com.app.ps19.tipsapp.classes.equipment.EquipmentDialogFragment;
import com.app.ps19.tipsapp.defects.DefectsActivity;
import com.app.ps19.tipsapp.defects.PreviousDefectsMapActivity;
import com.app.ps19.tipsapp.inspection.InspectionActivity;
import com.app.ps19.tipsapp.reports.ReportShowActivity;

import java.util.ArrayList;

import static android.view.View.GONE;
import static android.view.View.INVISIBLE;
import static android.view.View.VISIBLE;
import static com.app.ps19.tipsapp.Shared.Globals.ASSET_TYPE_SIDE_TRACK;
import static com.app.ps19.tipsapp.Shared.Globals.activeSession;
import static com.app.ps19.tipsapp.Shared.Globals.appName;
import static com.app.ps19.tipsapp.Shared.Globals.getSelectedTask;
import static com.app.ps19.tipsapp.Shared.Globals.getSelectedUnit;
import static com.app.ps19.tipsapp.Shared.Globals.selectedDUnit;
import static com.app.ps19.tipsapp.Shared.Globals.selectedForm;
import static com.app.ps19.tipsapp.Shared.Globals.selectedJPlan;
import static com.app.ps19.tipsapp.Shared.Globals.selectedUnit;
import static com.app.ps19.tipsapp.Shared.Globals.setSelectedUnit;
import static com.app.ps19.tipsapp.Shared.Utilities.getFilteredNewIssues;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link UrPageFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class UrPageFragment extends Fragment {
    private final int LAUNCH_APPFORM_ACTIVITY=1;
    public static final int ADD_DEFECT_ACTIVITY_REQUEST_CODE = 100;
    static int selectedGroupPosition;
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    ExpandableListView elvInspection;
    InspectionUnitsAdapter itemAdapter;

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    private ArrayList<Units> unitList;
    private Units selectedUnit;
    private TreeViewAdapter treeViewAdapter;
    private EquipmentDialogFragment attributeFragment;

    public void setUnitList(ArrayList<Units> unitList) {
        this.unitList = unitList;
        refresh();
    }

    public ArrayList<Units> getUnitList() {
        return unitList;
    }

    public UrPageFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment UrPageFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static UrPageFragment newInstance(String param1, String param2) {
        UrPageFragment fragment = new UrPageFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }
    @Override
    public void setMenuVisibility(boolean isVisible) {
        super.setMenuVisibility(isVisible);
        if (isVisible){
            if(this.selectedUnit!=null){
                Globals.setSelectedUnit(this.selectedUnit);
            }
            Log.d("Viewpager", "fragment is visible ");
        }else {
            Log.d("Viewpager", "fragment is not visible ");
        }
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
        // Inflate the layout for this fragment
        View view= inflater.inflate(R.layout.fragment_ur_page, container, false);
        RecyclerView recyclerView=view.findViewById(R.id.recycler_view_equ);
        recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        recyclerView.setNestedScrollingEnabled(false);
        TreeViewHolderFactory factory=(v,layout)->new FileViewHolder(v);
        treeViewAdapter=new TreeViewAdapter(factory);
        recyclerView.setAdapter(treeViewAdapter);
        treeViewAdapter.setTreeNodeClickListener(new TreeViewAdapter.OnTreeNodeClickListener() {
            @Override
            public void onTreeNodeClick(TreeNode treeNode, View view) {
                Equipment equipment=(Equipment) treeNode.getValue();
                if(equipment !=null){
                    Handler handler=new Handler(Looper.getMainLooper());
                    handler.post(new Runnable() {
                        @Override
                        public void run() {
/*                            attributeFragment.setAttributeList(equipment.getAttributes());

                            showAttributeFragment();*/
                        }
                    });

                }
            }
        });
        fillEquipmentTree();
        elvInspection=view.findViewById(R.id.elvInspectionGroup);
        elvInspection.setAdapter(itemAdapter);

        //showAttributeFragment();
        return view;
    }
    public void refresh(){
        itemAdapter=new InspectionUnitsAdapter(this.unitList);
        if(this.unitList !=null && this.unitList.size()>0){
            this.selectedUnit=this.unitList.get(0);
        }
        if(elvInspection!=null) {
            elvInspection.setAdapter(itemAdapter);
        }
    }
    private TreeNode addNode(Equipment equipment){
        String nodeText=equipment.getName().equals("")?equipment.getInterfaceString():equipment.getName();
        //nodeText=nodeText.equals("")?equipment.getInterfaceString():"";
        nodeText += "\n" + equipment.getEquipmentType().getEquipmentType();
        //TreeNode node=new TreeNode(nodeText,R.layout.unit_group_list_item);
        TreeNode node=new TreeNode(equipment,R.layout.unit_group_list_item);
        if(equipment.getEquipmentList()!=null && equipment.getEquipmentList().size()>0){
            for(Equipment equ:equipment.getEquipmentList()){
                equ.setContext(getActivity());
                TreeNode childNode=addNode(equ);
                if(childNode!=null){
                    node.addChild(childNode);
                }
            }
        }
        return node;
    }
    private void fillEquipmentTree(){
        if(selectedUnit!=null){
            ArrayList<Equipment> equipmentList=selectedUnit.getEquipmentList();
            ArrayList<TreeNode> rootNodes=new ArrayList<>();
            if(equipmentList!=null && equipmentList.size()>0){
                for(Equipment equipment:equipmentList){
                    equipment.setContext(getActivity());
                    TreeNode childNode=addNode(equipment);
                    rootNodes.add(childNode);
                }
            }
            treeViewAdapter.updateTreeNodes(rootNodes);
        }
    }
    public class InspectionUnitsAdapter extends BaseExpandableListAdapter
    {
        final ArrayList<Units> unitList;
        ArrayList<Units> unitListOriginal;
        ImageView imgStartPlan;
        final boolean showFreezeItems;
        public  InspectionUnitsAdapter(ArrayList<Units> unitList ){
            ArrayList<Units> unitList1;
            unitList1 =new ArrayList<>();
            unitList1.addAll(unitList);
            this.showFreezeItems=false;
            this.unitListOriginal=new ArrayList<>();
            this.unitListOriginal=copyItems(unitList);
            unitList1 =copyItems(unitList);
            this.unitList = unitList1;
        }
        public  InspectionUnitsAdapter(ArrayList<Units> unitList,boolean showFreezeItems ){
            ArrayList<Units> unitList1;
            unitList1 =new ArrayList<>();
            this.showFreezeItems=showFreezeItems;
            this.unitListOriginal=new ArrayList<>();
            this.unitListOriginal=copyItems(unitList);
            unitList1 =copyItems(unitList);
            this.unitList = unitList1;
        }
        private ArrayList<Units> copyItems(ArrayList<Units> items){
            ArrayList<Units> _items=new ArrayList<>();
            for(Units d:items){
                //in case items array has size of 1 item
                if (items.size() == 1) {
                    if (!this.showFreezeItems) {
                        _items.add(d);
                    }
                } else {
                    if (this.showFreezeItems) {
                        if (d.isFreeze()) {
                            _items.add(d);
                        }
                    } else {
                        if (!d.isFreeze()) {
                            _items.add(d);
                        }
                    }
                }
            }
            return _items;
        }
        public void filterData(String query){
            query = query.toLowerCase();
            Log.v("MyListAdapter", String.valueOf(unitList.size()));
            unitList.clear();

            if(query.isEmpty()){
                unitList.addAll(unitListOriginal);
            }
            else {

                for(Units unitOpt: unitListOriginal){
                    if(unitOpt.getDescription().toLowerCase().contains(query)){
                        unitList.add(unitOpt);
                    }
                }
            }
            //Log.v("MyListAdapter", String.valueOf(templateList.size()));
            notifyDataSetChanged();
        }

        @Override
        public UnitsTestOpt getChild(int groupPosition, int childPosition)
        {
            Units selected = (Units) getGroup(groupPosition);
            ArrayList<UnitsTestOpt> testList = selected.getTestFormList();

            UnitsTestOpt unitTestOpt=testList.get(childPosition);

            return unitTestOpt;
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
                tv = getActivity().getLayoutInflater().inflate(R.layout.inspection_unit_test_item, parent, false);
            }
            final View cView=tv;

            final UnitsTestOpt unitTest= (UnitsTestOpt) getChild(groupPosition,childPosition);
            TextView textView=tv.findViewById(R.id.tvSecond);
            View v=tv.findViewById(R.id.viewSecond);
            CheckBox chkInspectionTest=tv.findViewById(R.id.chkInspectionTest);
            chkInspectionTest.setChecked(unitTest.isInspected());
            final boolean checkStatus=unitTest.isInspected();
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                v.setBackgroundTintList (ColorStateList.valueOf(unitTest.getColor()));
            }
            textView.setText(unitTest.getTitle());
            chkInspectionTest.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    chkInspectionTest.setChecked(checkStatus);
                    cView.performClick();
                }
            });
            tv.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {

                    Units selectedUnit=(Units)getGroup(groupPosition);
                    Globals.selectedUnit=selectedUnit;
                    if(!selectedUnit.getUnitId().equals(Globals.selectedUnit)){
                        Globals.selectedUnit=selectedUnit;
                        Globals.selectedForm=Globals.selectedUnit.getUnitForm(unitTest.getTestCode());
                        if(selectedForm==null){
                            return;
                        }
                        selectedForm.resetForm();
                        selectedForm.setSelectedUnit(Globals.selectedUnit);
                        selectedForm.setUnitsTestOpt(unitTest);
                    }
                    Intent intent = new Intent(getActivity(), AppFormActivity.class);
                    intent.putExtra("assetType","");
                    intent.putExtra("getGlobalForm",true);
                    intent.putExtra("form",unitTest.getTestCode());

                    startActivityForResult(intent, LAUNCH_APPFORM_ACTIVITY);
                }
            });
            return tv;
        }

        @Override
        public int getChildrenCount(int groupPosition)
        {
            int count=0;

            Units selected = (Units) getGroup(groupPosition);
            ArrayList<UnitsTestOpt> testList = selected.getTestFormList();

            if( testList.size() > 0){
                count=testList.size();
            }

            return count;
        }

        @Override
        public Object getGroup(int groupPosition)
        {
            return unitList.get(groupPosition);
        }

        @Override
        public int getGroupCount()
        {
            return unitList.size();
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
                tv = getActivity().getLayoutInflater().inflate(R.layout.inspection_unit_group_parent_item, parent, false);
            }
            final Units unitOpt= (Units) getGroup(groupPosition);

            if(selectedJPlan!=null){
                TextView textView=tv.findViewById(R.id.tvParent);

                LinearLayout llIssuesCount = tv.findViewById(R.id.ll_issues_counts);
                ImageView ivAddDefect = tv.findViewById(R.id.img_issue_add_iupi);
                ImageView ivUnitLocUpdate = tv.findViewById(R.id.fixAssetLocationEdit);

                TextView tvNewIssueCount = tv.findViewById(R.id.issue_count_new);
                TextView tvOldIssueCount = tv.findViewById(R.id.issue_count_old);

                //TextView tvGroupRow=tv.findViewById(R.id.tvGroupRow);
                //TextView tvGroupColumn=tv.findViewById(R.id.tvGroupColumn);
                //tvGroupColumn.setText(unitOpt.getAttributes().getRelayAttributes().getColumn());
                //tvGroupRow.setText(unitOpt.getAttributes().getRelayAttributes().getRow());

                ImageView imgPopupMenu=tv.findViewById(R.id.imgViewPopup);
                ImageView ivPin = tv.findViewById(R.id.img_inspection_tile);

                int newIssueCount = 0;
                Units currUnit = (Units) getGroup(groupPosition);
                int oldIssueCount=getOldIssueCount(unitOpt);
                newIssueCount=getNewIssueCount(unitOpt);

                final int newIssueCountFinal=newIssueCount;

                tvNewIssueCount.setText(String.valueOf(newIssueCount));
                tvOldIssueCount.setText(String.valueOf(oldIssueCount));
                if(newIssueCount==0){
                    //llIssuesCount.setVisibility(View.INVISIBLE);
                    if(oldIssueCount==0){
                        tvNewIssueCount.setVisibility(View.INVISIBLE);
                    } else {
                        tvNewIssueCount.setVisibility(VISIBLE);
                        tvNewIssueCount.setBackgroundResource(R.drawable.badge_background_blue);
                        tvNewIssueCount.setText(String.valueOf(oldIssueCount));
                    }

                }else{
                    tvNewIssueCount.setVisibility(VISIBLE);
                    tvNewIssueCount.setBackgroundResource(R.drawable.badge_background);
                }
                ivPin.setImageResource(R.drawable.pin_light_gray);
                ivPin.setVisibility(GONE);


                String title=getUnitDescription(unitOpt);
                textView.setText(title);
                imgPopupMenu.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        PopupMenu popup=new PopupMenu(getActivity(),imgPopupMenu);
                        popup.getMenuInflater()
                                .inflate(R.menu.popup_inspection_unit,popup.getMenu());
                        if(unitOpt.isLinear()) {
                            popup.getMenu().getItem(0).setVisible(false);
                            popup.getMenu().getItem(4).setVisible(true);
                        }
                        if(getSelectedTask().isYardInspection() || appName.equals(Globals.AppName.SCIM)){
                            try {
                                popup.getMenu().getItem(4).setVisible(false);
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        }
                        popup.setOnMenuItemClickListener(new PopupMenu.OnMenuItemClickListener() {
                            @Override
                            public boolean onMenuItemClick(MenuItem item) {
                                Units dUnit = (Units) getGroup(groupPosition);
                                selectedUnit = dUnit;
                                //selectedDUnit = dUnit;
                                switch (item.getItemId()) {
                                    case R.id.mnuEditLocation:
                                        if (activeSession == null) {
                                            Toast.makeText(getActivity().getApplicationContext(), getString(R.string.no_active_session), Toast.LENGTH_SHORT).show();
                                        }
                                        else {
                                            /*DUnit _dUnit = (DUnit) getGroup(groupPosition);
                                            selectedUnit = _dUnit.getUnit();
                                            selectedDUnit = _dUnit;*/
                                            Intent intent = new Intent(getActivity(), UnitCordsAdjActivity.class);
                                            startActivity(intent);
                                        }
                                        return true;
                                    case R.id.mnuIssues:
                                        if (activeSession == null) {
                                            Toast.makeText(getActivity().getApplicationContext(), getString(R.string.no_active_session), Toast.LENGTH_SHORT).show();
                                        }
                                        else {
                                            if (newIssueCountFinal == 0 && oldIssueCount == 0) {
                                                Toast.makeText(getActivity().getApplicationContext(), getString(R.string.no_defect_reported), Toast.LENGTH_SHORT).show();
                                                return false;
                                            } else {

                                                Intent intent = new Intent(getActivity(), DefectsActivity.class);
                                                //DUnit selected = (DUnit) getGroup(groupPosition);
                                                //selectedDUnit = selected;
                                                //selectedUnit = selected.getUnit();

                                                intent.putExtra("EXTRA_UNIT_ID", getSelectedUnit().getUnitId());
                                                intent.putExtra("EXTRA_NEW_ISSUE_COUNT", newIssueCountFinal);
                                                intent.putExtra("EXTRA_OLD_ISSUE_COUNT", oldIssueCount);
                                                startActivity(intent);
                                            }
                                            return true;
                                        }

                                    case R.id.mnuForms:

                                        if (selectedUnit.getAppForms().size() > 0) {
                                            AppFormDialogFragment dialogFragment = new AppFormDialogFragment();
                                            dialogFragment.show(getActivity().getSupportFragmentManager(), "appFormDialog");
                                        } else {
                                            Toast.makeText(getActivity(), getString(R.string.no_form_available), Toast.LENGTH_SHORT).show();
                                        }

                                        break;

                                    case R.id.mnuPrevDefectsMap:
                                        if (oldIssueCount == 0) {
                                            Toast.makeText(getActivity().getApplicationContext(), getString(R.string.no_defect_reported), Toast.LENGTH_SHORT).show();
                                            return false;
                                        } else {
                                            Intent intent = new Intent(getActivity(), PreviousDefectsMapActivity.class);
                                            intent.putExtra("EXTRA_UNIT_ID", getSelectedUnit().getUnitId());
                                            startActivity(intent);
                                        }
                                        break;
                                    case R.id.mnuSessionReport:
                                        setSelectedUnit(unitOpt);
                                        Intent intentRepActivity=new Intent(getActivity(), ReportShowActivity.class);
                                        startActivity(intentRepActivity);

                                        break;

                                }

                                return false;
                            }
                        });
                        popup.show();

                    }
                });
                ivUnitLocUpdate.setVisibility(GONE);
                ivAddDefect.setOnClickListener(v -> {
                    if(activeSession == null){
                        Toast.makeText(getActivity().getApplicationContext(), getString(R.string.no_active_session), Toast.LENGTH_SHORT).show();
                    }
                    else {
                        //collapseGroupFreeze(-1);
                        //collapseGroup(-1);

                        Units unit = (Units) getGroup(groupPosition);
                        selectedUnit = unit;
                        selectedDUnit =null;
                        //selectedDUnit = unit;
                        Globals.selectedReport = null;
                        Globals.newReport = new Report();
                        Globals.issueTitle = "";
                        Globals.selectedCategory = Globals.selectedReportType;
                        Intent intent = new Intent(getActivity(), ReportAddActivity.class);
                        try {
                            selectedGroupPosition = groupPosition;
                            startActivityForResult(intent, ADD_DEFECT_ACTIVITY_REQUEST_CODE);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                });
                int finalNewIssueCount = newIssueCount;

                llIssuesCount.setOnClickListener((View v) -> {

                    if (finalNewIssueCount == 0 && oldIssueCount == 0) {
                        Toast.makeText(getActivity().getApplicationContext(), getString(R.string.no_defect_reported), Toast.LENGTH_SHORT).show();
                    } else {
                        Intent intent = new Intent(getActivity(), DefectsActivity.class);
                        Units selected = (Units) getGroup(groupPosition);
                        selectedDUnit = null;
                        selectedUnit = selected;

                        intent.putExtra("EXTRA_UNIT_ID", selected.getUnitId());
                        intent.putExtra("EXTRA_NEW_ISSUE_COUNT", finalNewIssueCount);
                        intent.putExtra("EXTRA_OLD_ISSUE_COUNT", oldIssueCount);
                        startActivity(intent);
                    }
                });
                boolean isPaused=false;//isSessionPaused();
                ivAddDefect.setVisibility(isPaused ?View.INVISIBLE:View.VISIBLE);
                imgPopupMenu.setVisibility(isPaused?View.INVISIBLE:VISIBLE);

                View view=tv.findViewById(R.id.viewParent);
                ivUnitLocUpdate.setVisibility(GONE);

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    int color = unitOpt.getUnitColor();
                    view.setBackgroundResource(R.drawable.icons8_rack_64);
                    view.setBackgroundTintList (ColorStateList.valueOf(color));
                }
                //String label=""+ template.getSortOrder()+". "+ template.getTitle();
                //            textView.setText(label);
                textView.setText(getUnitDescription(unitOpt));
                //darken the color when all side tracks are selected
            }


            return tv;
        }
        private int getUnitColor(Units unit){
            int color=unit.getUnitColor();
            return color;
        }
        private int getNewIssueCount(Units unit){
            int issueCount=getFilteredNewIssues(unit.getUnitId());
            //selectedJPlan.getTaskList().get(0).getUnitDefectsListByID(currUnit.getUnit().getUnitId()).size()
            return issueCount;

        }
        private int getOldIssueCount(Units unit){
            int issueCount=selectedJPlan.getTaskList().get(0).getUnitDefectsListByID(unit.getUnitId()).size();
            //selectedJPlan.getTaskList().get(0).getUnitDefectsListByID(currUnit.getUnit().getUnitId()).size()
            return issueCount;

        }

        private String getUnitDescription(Units unit){
            String title=unit.getDescription();

            return title;
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

    @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if(itemAdapter!=null){
            itemAdapter.notifyDataSetChanged();
        }
    }
    private void showAttributeFragment(){
        if(this.attributeFragment==null){
            //this.attributeFragment=new EquipmentDialogFragment();
        }
        FragmentTransaction ft = getActivity().getSupportFragmentManager().beginTransaction();
        ft.replace(R.id.frameLayout, this.attributeFragment);
        ft.commit();
    }
    public static ActivityResultLauncher<Intent> onDefectActivityLaunch;

    {
        onDefectActivityLaunch = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                new ActivityResultCallback<ActivityResult>() {
                    @Override
                    public void onActivityResult(ActivityResult result) {
                        //if (result.getResultCode() == Activity.RESULT_OK) {
                            // Here, no request code

                    }
                });
    }

    @Override
    public void onResume() {
        super.onResume();
        if(elvInspection!=null && itemAdapter!= null){
            elvInspection.setAdapter(itemAdapter);
            itemAdapter.notifyDataSetChanged();
        }
    }
}