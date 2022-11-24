package com.app.ps19.hosapp;
        import android.content.Context;
        import android.content.res.Resources;
        import android.graphics.Typeface;
        import android.util.TypedValue;
        import android.view.LayoutInflater;
        import android.view.View;
        import android.view.ViewGroup;
        import android.widget.BaseExpandableListAdapter;
        import android.widget.CheckBox;
        import android.widget.CompoundButton;
        import android.widget.TextView;

        import com.app.ps19.hosapp.Shared.Globals;
        import com.app.ps19.hosapp.classes.DefectCode;

        import java.util.ArrayList;
        import java.util.HashMap;
        import java.util.List;

        import static com.app.ps19.hosapp.Shared.Globals.TASK_FINISHED_STATUS;

public class defectCodeAdapter extends BaseExpandableListAdapter {

    private Context context;

    // group titles
    private List<DefectCode> listDataGroup;

    // child data in format of header title, child title
    private HashMap<DefectCode, List<DefectCode>> listDataChild;

    public defectCodeAdapter(Context context, List<DefectCode> listDataGroup,
                                     HashMap<DefectCode, List<DefectCode>> listChildData) {
        this.context = context;
        this.listDataGroup = listDataGroup;
        this.listDataChild = listChildData;
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
        CheckBox cbDefectCode = convertView.findViewById(R.id.cb_defect_code);
        cbDefectCode.setTag(getChild(groupPosition, childPosition).getCode());

        cbDefectCode.setOnCheckedChangeListener(null);

        cbDefectCode.setChecked(false);
        if(Globals.defectCodeSelection == null){
            Globals.defectCodeSelection = new ArrayList<>();
        }
        if(Globals.defectCodeSelection.contains(getChild(groupPosition, childPosition).getCode())){
            cbDefectCode.setChecked(true);
        }

        if(!Globals.defectCodeTags.contains(getChild(groupPosition, childPosition).getCode())){
            Globals.defectCodeTags.add(getChild(groupPosition, childPosition).getCode());
        }
        cbDefectCode.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            public void onCheckedChanged(CompoundButton buttonView,
                                         boolean isChecked) {
                if (isChecked) {

                    /*int i = selectedNames.indexOf(tempChild.get(childPosition));

                    if (i == -1) {
                        selectedNames.add(tempChild.get(childPosition));
                    }*/
                    if(!Globals.defectCodeSelection.contains(getChild(groupPosition, childPosition).getCode())){
                        Globals.defectCodeSelection.set(Globals.defectCodeSelection.indexOf(""),getChild(groupPosition, childPosition).getCode());
                    }
                    //Globals.defectCodeSelection.add(getChild(groupPosition, childPosition).getCode());
                } else {

                   /* int i = selectedNames.indexOf(tempChild.get(childPosition));

                    if (i != -1) {
                        selectedNames.remove(i);
                    }*/
                   if(Globals.defectCodeSelection.contains(getChild(groupPosition, childPosition).getCode())){
                       //Globals.defectCodeSelection.remove(getChild(groupPosition, childPosition).getCode());

                       Globals.defectCodeSelection.set(Globals.defectCodeSelection.indexOf(getChild(groupPosition, childPosition).getCode()), "");
                   }
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
