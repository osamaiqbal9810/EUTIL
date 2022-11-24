package com.app.ps19.hosapp;

import android.app.AlertDialog;
import android.app.Dialog;
import android.app.DialogFragment;
import android.content.Context;
import android.content.DialogInterface;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.app.ps19.hosapp.Shared.Globals;
import com.app.ps19.hosapp.Shared.IOnDialogClicked;
import com.app.ps19.hosapp.classes.JourneyPlan;

import java.util.ArrayList;

import static com.app.ps19.hosapp.Shared.Globals.inbox;

public class SelectWorkPlanDialogFragment  extends DialogFragment {
    public static final String TITLE = "dataKey";

    ListView listView;
    WorkPlanAdapter workPlanAdapter;
    IOnDialogClicked onDialogClicked;


    public static SelectWorkPlanDialogFragment newInstance(String dataToShow) {
        SelectWorkPlanDialogFragment frag = new SelectWorkPlanDialogFragment();
        Bundle args = new Bundle();
        args.putString(TITLE, dataToShow);
        frag.setArguments(args);
        return frag;
    }
    public void setOnDialogClicked(IOnDialogClicked onDialogClicked) {
        this.onDialogClicked = onDialogClicked;
    }

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        String mDataReceived = getArguments().getString(TITLE,getResources().getString(R.string.workplan_selection_title));

        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        LayoutInflater inflater = getActivity().getLayoutInflater();
        View view = inflater.inflate(R.layout.fragment_select_work_plan, null);

        listView=view.findViewById(R.id.lvSelWorkPlan_fswp);
        inbox.loadWorkPlanTemplates(Globals.mainActivity);
        workPlanAdapter=new WorkPlanAdapter(Globals.mainActivity,inbox.getWorkPlanTemplates());
        //listView.setAdapter(workPlanAdapter);
        setCancelable(false);

        builder
                .setView(view)
                .setSingleChoiceItems(workPlanAdapter, -1,
                        new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int which) {
                                ListView lv = ((AlertDialog)dialog).getListView();
                                lv.setTag(new Integer(which));
                                for (int i = 0; i < lv.getChildCount(); i++) {
                                    if(which == i ){
                                        lv.getChildAt(i).setBackgroundColor(getResources().getColor(R.color.color_tile_selected));
                                    }else{
                                        lv.getChildAt(i).setBackgroundColor(Color.TRANSPARENT);
                                    }
                                }

                            }
                        })
                .setNegativeButton(getResources().getText((R.string.btn_cancel)), new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        dismiss();
                    }
                })
                .setPositiveButton(getResources().getText((R.string.select_text)), new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        ListView lv=((AlertDialog)dialogInterface).getListView();
                        Integer selected=(Integer) lv.getTag();
                        if(selected ==null){
                            Toast.makeText(Globals.mainActivity,getResources().getText(R.string.select_template),Toast.LENGTH_SHORT).show();
                            return;
                        }
                        JourneyPlan jp =(JourneyPlan)lv.getItemAtPosition(selected);
                        if(jp == null){
                            Toast.makeText(Globals.mainActivity,getResources().getText(R.string.select_template),Toast.LENGTH_SHORT).show();
                            return;
                        }
                        if(onDialogClicked!=null){
                            onDialogClicked.onOkayClicked(jp);
                            dismiss();
                        }
                    }
                });

        Dialog dialog = builder.create();

        dialog.setTitle(mDataReceived);
        /*
        dialog.getWindow().setBackgroundDrawable(
                new ColorDrawable(Color.TRANSPARENT));
        */
        return dialog;

    }

    public class WorkPlanAdapter extends ArrayAdapter<JourneyPlan> {
        int selectedItem=-1;

        public WorkPlanAdapter(Context context, ArrayList<JourneyPlan> journeyPlans) {

            super(context, 0, journeyPlans);

        }



        @Override

        public View getView(int position, View convertView, ViewGroup parent) {

            JourneyPlan journeyPlan = getItem(position);

            if (convertView == null) {

                convertView = LayoutInflater.from(getContext()).inflate(R.layout.item_select_work_plan, parent, false);
            }
            TextView tvTitle = (TextView) convertView.findViewById(R.id.tvTitle_iswp);
            TextView tvDetails = (TextView) convertView.findViewById(R.id.tvDetails_iswp);
            LinearLayout llayoutTile=convertView.findViewById(R.id.llayoutTile_iswp);

            tvTitle.setText(journeyPlan.getTitle());
            String strDetails=(getString(R.string.dashboard_task_count))+ journeyPlan.getTaskList().size() ;
            tvDetails.setText(strDetails);
            return convertView;

        }

    }

}
