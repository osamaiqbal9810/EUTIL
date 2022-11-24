package com.app.ps19.scimapp;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.res.Resources;
import android.graphics.Typeface;
import android.util.TypedValue;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseExpandableListAdapter;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.ExpandableListView;
import android.widget.TextView;
import android.widget.Toast;

import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.classes.DefectCode;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static android.app.Activity.RESULT_OK;
import static com.app.ps19.scimapp.Shared.Globals.TASK_FINISHED_STATUS;
import static com.app.ps19.scimapp.Shared.Globals.defectDivider;
import static com.app.ps19.scimapp.Shared.Globals.defectSelection;
import static com.app.ps19.scimapp.Shared.Globals.defectSelectionCopy;
import static com.app.ps19.scimapp.Shared.Globals.isSingleDefectSelection;

public class defectCodeAdapter extends BaseExpandableListAdapter {

    private Context context;

    // group titles
    private List<DefectCode> listDataGroup;

    // child data in format of header title, child title
    private HashMap<DefectCode, List<DefectCode>> listDataChild;

    // If activity in edit mode
    boolean isEdit = false;

    public defectCodeAdapter(Context context, List<DefectCode> listDataGroup,
                             HashMap<DefectCode, List<DefectCode>> listChildData, boolean isEdit) {
        this.context = context;
        this.listDataGroup = listDataGroup;
        this.listDataChild = listChildData;
        this.isEdit = isEdit;
    }

    @Override
    public DefectCode getChild(int groupPosition, int childPosititon) {
        return this.listDataChild.get(this.listDataGroup.get(groupPosition))
                .get(childPosititon);
    }

    @Override
    public long getChildId(int groupPosition, int childPosition) {
        return childPosition;
    }

    @Override
    public View getChildView(final int groupPosition, final int childPosition,
                             boolean isLastChild, View convertView, ViewGroup parent) {

        final String childText = getChild(groupPosition, childPosition).getTitle();

        if (convertView == null) {
            LayoutInflater layoutInflater = (LayoutInflater) this.context
                    .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            convertView = layoutInflater.inflate(R.layout.defect_code_row_child, null);
        }
        TextView tvChildId = convertView.findViewById(R.id.tv_dc_child_id);
        tvChildId.setText(getChild(groupPosition, childPosition).getCode());
        final CheckBox cbDefectCode = convertView.findViewById(R.id.cb_defect_code);
        cbDefectCode.setTag(getChild(groupPosition, childPosition).getCode());

        cbDefectCode.setOnCheckedChangeListener(null);

        cbDefectCode.setChecked(false);

        if(Globals.defectCodeSelection == null){
            Globals.defectCodeSelection = new ArrayList<>();
        }
        String gId = getGroup(groupPosition).getCode() + defectDivider + getGroup(groupPosition).getTitle();
        String cId = getChild(groupPosition, childPosition).getCode() + defectDivider + getChild(groupPosition, childPosition).getTitle();
        /*if(isEdit){
            if(defectSelectionCopy.size() > 0 ){
                if(defectSelectionCopy.containsKey(gId)){
                    for(int i = 0; i < defectSelectionCopy.size(); i++){
                        if(defectSelectionCopy.get(gId).contains(cId)){
                            cbDefectCode.setChecked(true);
                        }
                    }
                }
            }
        } else {*/
        if(defectSelection.size() > 0 ){
            if(defectSelection.containsKey(gId)){
                for(int i = 0; i < defectSelection.size(); i++){
                    if(defectSelection.get(gId).contains(cId)){
                        cbDefectCode.setChecked(true);
                    }
                }
            }
        }
        //}

        /*if(Globals.defectCodeSelection.contains(getChild(groupPosition, childPosition).getCode())){
            String defect = getChild(groupPosition, childPosition).getCode() + Globals.defectDivider + getChild(groupPosition, childPosition).getTitle();
            if(!Globals.defectCodeDetails.contains(defect)){
                Globals.defectCodeDetails.add(defect);
            }
            cbDefectCode.setChecked(true);
        }*/

        if(!Globals.defectCodeTags.contains(getChild(groupPosition, childPosition).getCode())){
            Globals.defectCodeTags.add(getChild(groupPosition, childPosition).getCode());
        }
        cbDefectCode.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            public void onCheckedChanged(CompoundButton buttonView,
                                         boolean isChecked) {
                String gId = getGroup(groupPosition).getCode() + defectDivider + getGroup(groupPosition).getTitle();
                String cId = getChild(groupPosition, childPosition).getCode() + defectDivider + getChild(groupPosition, childPosition).getTitle();
                if (isChecked) {
                    //String gId = getGroup(groupPosition).getCode() + defectDivider + getGroup(groupPosition).getTitle();
                    //String cId = getChild(groupPosition, childPosition).getCode() + defectDivider + getChild(groupPosition, childPosition).getTitle();
                    defectSelection.put(gId, cId);
                    boolean singleSelection = false;
                   /* if(singleSelection){
                        if(Globals.defectCodeDetails.size()>0){
                            Toast.makeText(context, R.string.single_selection_defect, Toast.LENGTH_SHORT).show();
                            cbDefectCode.setChecked(false);
                            return;
                        }
                        if(!Globals.defectCodeSelection.contains(getChild(groupPosition, childPosition).getCode())){
                            Globals.defectCodeSelection.set(Globals.defectCodeSelection.indexOf(""),getChild(groupPosition, childPosition).getCode());
                            String title;
                            title = getGroup(groupPosition).getCode() + Globals.defectDivider + getGroup(groupPosition).getTitle();
                            Globals.issueTitle = title;
                            String defect;
                            defect = getChild(groupPosition, childPosition).getCode() + Globals.defectDivider + getChild(groupPosition, childPosition).getTitle();
                            Globals.defectCodeDetails.add(defect);
                            //Finish activity
                            Intent returnIntent = new Intent();
                            returnIntent.putExtra("code", "DefectCode");
                            ((Activity)context).setResult(RESULT_OK, returnIntent);
                            ((Activity)context).finish();
                        }
                    } else {
                        boolean isSameParent = true;

                    *//*int i = selectedNames.indexOf(tempChild.get(childPosition));

                    if (i == -1) {
                        selectedNames.add(tempChild.get(childPosition));
                    }*//*
                        if(Globals.defectCodeDetails.size() > 0){
                            for(int i = 0; i < Globals.defectCodeDetails.size(); i++){
                                String[] tempDetails = Globals.defectCodeDetails.get(i).split(Globals.defectDivider);
                                String[] savedCode = tempDetails[0].split("[.]");
                                String[] receivedCode = getChild(groupPosition, childPosition).getCode().split("[.]");
                                if(savedCode.length>0){
                                    if(savedCode[0].equals(receivedCode[0])){
                                        isSameParent = true;
                                    } else {
                                        isSameParent = false;
                                        cbDefectCode.setChecked(false);
                                        Toast.makeText(context, R.string.single_parent_error_msg, Toast.LENGTH_SHORT).show();
                                    }
                                }
                            }
                        }
                        if(isSameParent){
                            if(!Globals.defectCodeSelection.contains(getChild(groupPosition, childPosition).getCode())){
                                Globals.defectCodeSelection.set(Globals.defectCodeSelection.indexOf(""),getChild(groupPosition, childPosition).getCode());
                                String title;
                                title = getGroup(groupPosition).getCode() + Globals.defectDivider + getGroup(groupPosition).getTitle();
                                Globals.issueTitle = title;
                                String defect;
                                defect = getChild(groupPosition, childPosition).getCode() + Globals.defectDivider + getChild(groupPosition, childPosition).getTitle();
                                Globals.defectCodeDetails.add(defect);
                            }
                        }
                    }*/
                    //Globals.defectCodeSelection.add(getChild(groupPosition, childPosition).getCode());
                } else {
                    for(int i = 0; i < defectSelection.size(); i++){
                        if(defectSelection.get(gId)!=null){
                            if(defectSelection.get(gId).size()>0){
                                for(int j = 0; j < defectSelection.get(gId).size(); j++){
                                    defectSelection.get(gId).remove(cId);
                                    /*Collection<String> values = defectSelection.get(gId);
                                    if(values.size()>0){
                                        for(String defect: values){
                                            if(!defect.equals("")){

                                            }
                                        }
                                    }*/
                                    /*if(defectSelection.get(gId).get(j).equals(cId)){
                                        defectSelection.get(gId).set(j, "");
                                        if(defectSelection.get(gId).size() == 1){
                                            defectSelection.replace(gId, "");
                                        }
                                    }*/
                                }
                            }
                        }
                    }


                   /* int i = selectedNames.indexOf(tempChild.get(childPosition));

                    if (i != -1) {
                        selectedNames.remove(i);
                    }*/
                  /* if(Globals.defectCodeSelection.contains(getChild(groupPosition, childPosition).getCode())){
                       //Globals.defectCodeSelection.remove(getChild(groupPosition, childPosition).getCode());
                       Globals.defectCodeSelection.set(Globals.defectCodeSelection.indexOf(getChild(groupPosition, childPosition).getCode()), "");
                       //Remove from defectCodeDetails array list
                       for(int i = 0; i < Globals.defectCodeDetails.size(); i++){
                           String[] tempDetails = Globals.defectCodeDetails.get(i).split(Globals.defectDivider);
                           if(getChild(groupPosition, childPosition).getCode().equals(tempDetails[0].trim())){
                               Globals.defectCodeDetails.remove(i);
                               //also removing title
                               Globals.issueTitle = "";
                           }
                       }
                   }*/
                }
            }
        });

        if (Globals.selectedTask.getStatus().equals(TASK_FINISHED_STATUS)) {
            cbDefectCode.setEnabled(false);
        }
        TextView textViewChild = convertView
                .findViewById(R.id.textViewChild);

        textViewChild.setText(childText);
        return convertView;
    }

    @Override
    public int getChildrenCount(int groupPosition) {
        return this.listDataChild.get(this.listDataGroup.get(groupPosition))
                .size();
    }

    @Override
    public DefectCode getGroup(int groupPosition) {
        return this.listDataGroup.get(groupPosition);
    }

    @Override
    public int getGroupCount() {
        return this.listDataGroup.size();
    }

    @Override
    public long getGroupId(int groupPosition) {
        return groupPosition;
    }

    @Override
    public View getGroupView(int groupPosition, boolean isExpanded,
                             View convertView, ViewGroup parent) {
        String headerTitle = getGroup(groupPosition).getTitle();
        if (convertView == null) {
            LayoutInflater layoutInflater = (LayoutInflater) this.context
                    .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            convertView = layoutInflater.inflate(R.layout.defect_code_row_group, null);
        }
        /*LinearLayout llMain = convertView.findViewById(R.id.ll_main_group);
        TextView tvId = new TextView(context);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(getDp(40), getDp(40));
        params.setMargins(getDp(0), getDp(0), getDp(0), getDp(4));
        tvId.setLayoutParams(params);
        tvId.setGravity(Gravity.CENTER);

        //tvTitle.setBackground(ContextCompat.getDrawable(context, R.drawable.ready));
        if (android.os.Build.VERSION.SDK_INT < Build.VERSION_CODES.JELLY_BEAN)
            tvId.setBackgroundDrawable(context.getResources().getDrawable(R.drawable.circle));
        else if(android.os.Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP_MR1)
            tvId.setBackground(context.getResources().getDrawable(R.drawable.circle));
        else
            tvId.setBackground(ContextCompat.getDrawable(context, R.drawable.circle));

        tvId.setTextColor(R.color.colorTitle);
        tvId.setTextSize(10);
        tvId.setText("12.123");
        llMain.addView(tvId);

        TextView tvTitle = new TextView(context);
        LinearLayout.LayoutParams titleParam = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT);

        tvTitle.setLayoutParams(titleParam);
        tvTitle.setPadding(getDp(9),getDp(8),0,getDp(8));
        tvTitle.setTextColor(R.color.colorBlack);
        tvTitle.setTextSize(getDp(17));
        tvTitle.setText(headerTitle);
        llMain.addView(tvTitle);*/


        TextView textViewGroup = convertView
                .findViewById(R.id.textViewGroup);
        textViewGroup.setTypeface(null, Typeface.NORMAL);
        textViewGroup.setText(headerTitle);
        TextView tvMainId = convertView.findViewById(R.id.tv_main_id);
        tvMainId.setText(getGroup(groupPosition).getCode());
        ExpandableListView mExpandableListView = (ExpandableListView) parent;
        if(headerTitle.equals(Globals.issueTitle)){
            mExpandableListView.expandGroup(groupPosition);
        }

        return convertView;
    }

    @Override
    public boolean hasStableIds() {
        return false;
    }

    @Override
    public boolean isChildSelectable(int groupPosition, int childPosition) {
        return true;
    }
    public int getDp(int size){
        Resources r = context.getResources();
        return (int) TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP,
                size,
                r.getDisplayMetrics()
        );
    }
}
