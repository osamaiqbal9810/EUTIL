package com.app.ps19.scimapp.unitsGroup;

import android.content.Intent;
import android.content.res.ColorStateList;
import android.os.Build;
import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

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

import com.app.ps19.scimapp.AppFormActivity;
import com.app.ps19.scimapp.R;
import com.app.ps19.scimapp.ReportAddActivity;
import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.UnitCordsAdjActivity;
import com.app.ps19.scimapp.classes.DUnit;
import com.app.ps19.scimapp.classes.Report;
import com.app.ps19.scimapp.classes.Units;
import com.app.ps19.scimapp.classes.UnitsTestOpt;
import com.app.ps19.scimapp.classes.dynforms.AppFormDialogFragment;
import com.app.ps19.scimapp.defects.DefectsActivity;
import com.app.ps19.scimapp.defects.PreviousDefectsMapActivity;
import com.app.ps19.scimapp.inspection.InspectionActivity;
import com.app.ps19.scimapp.reports.ReportShowActivity;

import java.util.ArrayList;

import static android.view.View.GONE;
import static android.view.View.INVISIBLE;
import static android.view.View.VISIBLE;
import static com.app.ps19.scimapp.Shared.Globals.ASSET_TYPE_SIDE_TRACK;
import static com.app.ps19.scimapp.Shared.Globals.activeSession;
import static com.app.ps19.scimapp.Shared.Globals.appName;
import static com.app.ps19.scimapp.Shared.Globals.getSelectedTask;
import static com.app.ps19.scimapp.Shared.Globals.selectedDUnit;
import static com.app.ps19.scimapp.Shared.Globals.selectedForm;
import static com.app.ps19.scimapp.Shared.Globals.selectedJPlan;
import static com.app.ps19.scimapp.Shared.Globals.selectedUnit;
import static com.app.ps19.scimapp.Shared.Globals.setSelectedUnit;
import static com.app.ps19.scimapp.Shared.Utilities.getFilteredNewIssues;

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
        elvInspection=view.findViewById(R.id.elvInspectionGroup);
        elvInspection.setAdapter(itemAdapter);
        return view;
    }
    public void refresh(){
        itemAdapter=new InspectionUnitsAdapter(this.unitList);
        if(elvInspection!=null) {
            elvInspection.setAdapter(itemAdapter);
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

                TextView tvGroupRow=tv.findViewById(R.id.tvGroupRow);
                TextView tvGroupColumn=tv.findViewById(R.id.tvGroupColumn);
                tvGroupColumn.setText(unitOpt.getAttributes().getRelayAttributes().getColumn());
                tvGroupRow.setText(unitOpt.getAttributes().getRelayAttributes().getRow());

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
                                            DUnit _dUnit = (DUnit) getGroup(groupPosition);
                                            selectedUnit = _dUnit.getUnit();
                                            selectedDUnit = _dUnit;
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
                                                DUnit selected = (DUnit) getGroup(groupPosition);
                                                selectedDUnit = selected;
                                                selectedUnit = selected.getUnit();

                                                intent.putExtra("EXTRA_UNIT_ID", selected.getUnit().getUnitId());
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
                                            DUnit selected = (DUnit) getGroup(groupPosition);
                                            selectedDUnit = selected;
                                            selectedUnit = selected.getUnit();

                                            Intent intent = new Intent(getActivity(), PreviousDefectsMapActivity.class);
                                            intent.putExtra("EXTRA_UNIT_ID", selected.getUnit().getUnitId());
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
}