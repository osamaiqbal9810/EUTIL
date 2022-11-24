package com.app.ps19.hosapp.safetyBriefing;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.Typeface;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.TypedValue;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseExpandableListAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.app.ps19.hosapp.R;
import com.app.ps19.hosapp.Shared.Globals;
import com.app.ps19.hosapp.Shared.Utilities;
import com.app.ps19.hosapp.classes.DefectCode;
import com.app.ps19.hosapp.classes.IssueImage;

import org.w3c.dom.Text;

import java.util.HashMap;
import java.util.List;

public class workerListAdapter extends BaseExpandableListAdapter {

    private Context context;

    // group titles
    private List<String> listDataGroup;

    // child data in format of header title, child title
    private HashMap<String, IssueImage> listDataChild;

    public workerListAdapter(Context context, List<String> listDataGroup,
                               HashMap<String, IssueImage> listChildData) {
        this.context = context;
        this.listDataGroup = listDataGroup;
        this.listDataChild = listChildData;
    }

    @Override
    public IssueImage getChild(int groupPosition, int childPosition) {
        return this.listDataChild.get(this.listDataGroup.get(groupPosition));
    }

    @Override
    public long getChildId(int groupPosition, int childPosition) {
        return childPosition;
    }

    @Override
    public View getChildView(final int groupPosition, final int childPosition,
                             boolean isLastChild, View convertView, ViewGroup parent) {

        final IssueImage signatureImg = getChild(groupPosition, childPosition);

        if (convertView == null) {
            LayoutInflater layoutInflater = (LayoutInflater) this.context
                    .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            convertView = layoutInflater.inflate(R.layout.worker_row_child, null);
        }
        ImageView ivSign = convertView.findViewById(R.id.iv_worker_signature_display);
        Button btnEdit = convertView.findViewById(R.id.ib_worker_edit);
        Button btnRemove = convertView.findViewById(R.id.ib_worker_delete);
        TextView tvSigTitle = convertView.findViewById(R.id.tv_sig);
        if(signatureImg != null){
            if(signatureImg.getImgName() == null || signatureImg.getImgName().equals("")){
                tvSigTitle.setText("Briefing !");
                Drawable d = context.getResources().getDrawable(R.drawable.phone_verify);
                ivSign.setImageDrawable(d);
            } else {
                showImage(signatureImg.getImgName(), ivSign);
                tvSigTitle.setText("Signature !");
            }
        } else {
            tvSigTitle.setText("Briefing !");
            Drawable d = context.getResources().getDrawable(R.drawable.phone_verify);
            ivSign.setImageDrawable(d);
        }

        //ivSign.setImageURI(Uri.parse(signatureImg.getImgName()));
        btnEdit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(context, WorkerAddActivity.class);
                // Intent intent =new Intent(MainActivity.this,ScribbleNotesActivity.class);
                Bundle b=new Bundle();
                b.putString("filename","");
                Globals.selectedWorker = Globals.safetyBriefing.getWorkers().get(groupPosition);
                //intent.putExtras(b);
                context.startActivity(intent);
            }});
        btnRemove.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showDialog(groupPosition);
            }});


        /*String[] id ;//childText.split("-");
        switch (id[0]) {
            case "time":
                ed_time.setVisibility(View.VISIBLE);
                ed_time.setHint("Time");
                break;
            case "date":
                ed_date.setVisibility(View.VISIBLE);
                ed_date.setHint("Date");
                break;
            case "edit":
                if (id[1] != null && id[1].equals("multiline")) {
                    ed_multiline.setVisibility(View.VISIBLE);
                } else {
                    ed_simple.setVisibility(View.VISIBLE);
                }
                break;
            case "tv":
                tv_simple.setVisibility(View.VISIBLE);
                tv_simple.setText(id[1]);
                break;
            case "cb":
                cb_1.setVisibility(View.VISIBLE);
                cb_1.setOnCheckedChangeListener(null);
                cb_1.setChecked(false);
                cb_1.setText(id[1]);

                break;
        }*//*
        TextView tvChildId = convertView.findViewById(R.id.tv_dc_child_id);
        tvChildId.setText(getChild(groupPosition, childPosition));
        CheckBox cbDefectCode = convertView.findViewById(R.id.cb_defect_code);
        cbDefectCode.setTag(getChild(groupPosition, childPosition));

        cbDefectCode.setOnCheckedChangeListener(null);

        cbDefectCode.setChecked(false);
        if(Globals.defectCodeSelection.contains(getChild(groupPosition, childPosition))){
            cbDefectCode.setChecked(true);
        }

        if(!Globals.defectCodeTags.contains(getChild(groupPosition, childPosition))){
            Globals.defectCodeTags.add(getChild(groupPosition, childPosition));
        }
        cbDefectCode.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            public void onCheckedChanged(CompoundButton buttonView,
                                         boolean isChecked) {
                if (isChecked) {

                    *//*int i = selectedNames.indexOf(tempChild.get(childPosition));

                    if (i == -1) {
                        selectedNames.add(tempChild.get(childPosition));
                    }*//*
                    Globals.defectCodeSelection.add(getChild(groupPosition, childPosition));
                } else {

                   *//* int i = selectedNames.indexOf(tempChild.get(childPosition));

                    if (i != -1) {
                        selectedNames.remove(i);
                    }*//*
                    if(Globals.defectCodeSelection.contains(getChild(groupPosition, childPosition))){
                        Globals.defectCodeSelection.remove(getChild(groupPosition, childPosition));
                    }
                }

            }
        });

        TextView textViewChild = convertView
                .findViewById(R.id.textViewChild);

        textViewChild.setText(childText);*/
        return convertView;
    }

    @Override
    public int getChildrenCount(int groupPosition) {
        return 1;
    }

    @Override
    public String getGroup(int groupPosition) {
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
        String headerTitle = getGroup(groupPosition);
        if (convertView == null) {
            LayoutInflater layoutInflater = (LayoutInflater) this.context
                    .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            convertView = layoutInflater.inflate(R.layout.briefing_row_group, null);

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


        TextView tvGroupTitle = convertView
                .findViewById(R.id.tv_briefing_title);
        tvGroupTitle.setTypeface(null, Typeface.BOLD);
        tvGroupTitle.setText(headerTitle);
        TextView tvInitial = convertView.findViewById(R.id.tv_briefing_id);
        tvInitial.setText(headerTitle.substring(0,1));

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
    private void showImage(String imageFileName, ImageView ivSignature){
        if(!imageFileName.equals("")){
            Bitmap bitmap = Utilities.getImageFromSDCard(context
                    ,imageFileName);
            if (bitmap != null) {
                BitmapDrawable background = new BitmapDrawable(bitmap);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
                    ivSignature.setImageDrawable(background );
                }else
                {
                    ivSignature.setImageDrawable(background);
                }
            }
        }
    }
    void showDialog(final Integer position) {
        AlertDialog alertDialog = new AlertDialog.Builder(context)
//set icon
                .setIcon(android.R.drawable.ic_dialog_alert)
//set title
                .setTitle("Confirmation!")
//set message
                .setMessage("Do you want to remove worker ?")
//set positive button
                .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        //set what would happen when positive button is clicked
                        listDataGroup.remove(getGroup(position));
                        //listDataChild.remove(getChild(position, position));
                        Globals.safetyBriefing.getWorkers().remove(Globals.safetyBriefing.getWorkers().get(position));
                        notifyDataSetChanged();

                    }
                })
//set negative button
                .setNegativeButton("No", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        //set what should happen when negative button is clicked
                    }
                })
                .show();
    }
}
