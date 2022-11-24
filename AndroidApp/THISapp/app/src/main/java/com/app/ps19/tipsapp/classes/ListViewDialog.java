package com.app.ps19.tipsapp.classes;

import android.app.Activity;
import android.app.Dialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.ListView;

import com.app.ps19.tipsapp.R;
import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.clusterItemAdapter;
import com.google.android.gms.maps.model.LatLng;

import java.util.ArrayList;

import static com.app.ps19.tipsapp.Shared.Globals.getSelectedTask;
import static com.app.ps19.tipsapp.Shared.Globals.lastKnownLocation;
public class ListViewDialog {

    private ArrayList<LocItem> list;
    private Context context;
    private Dialog dialog;
    private View view;
    private ListView listView;
    private Button buttonDismiss;
    private boolean initItemClickListener;
    clusterItemAdapter clusterAdapter;
    ProgressDialog progressDialog;


    public ListViewDialog(Context context, ArrayList<LocItem> list, boolean... initClickListener){
        initItemClickListener = initClickListener.length <= 0;
        this.context = context;
        this.list = list;
        setupDialog();
        setupUI();
        setupListView();
        setButtonClickListener();
        if (initItemClickListener) {
            setListOnClickListener();
        }

    }

    public void showDialog(){
        try {
            dialog.show();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    private void setupDialog(){
        dialog = new Dialog(context);
        view = LayoutInflater.from(context).inflate(R.layout.listview_dialog, null);
        dialog.setContentView(view);
    }

    private void setupUI(){
        listView = view.findViewById(R.id.listView);
        buttonDismiss = view.findViewById(R.id.buttonDismiss);
    }

    private void setupListView() {
        clusterAdapter = new clusterItemAdapter(list, context);
        listView.setAdapter(clusterAdapter);
    }

    private void setButtonClickListener() {
        buttonDismiss.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View e) {
                dialog.dismiss();
            }
        });
    }
    private void setListOnClickListener() {
        progressDialog = new ProgressDialog(context);
        progressDialog.setTitle(context.getResources().getString(R.string.please_wait));
        progressDialog.setMessage(context.getResources().getString(R.string.waiting_for_sync_service));
        progressDialog.setCancelable(false);
        progressDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
        //progressDialog.show();

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {

            public void onItemClick(AdapterView<?> parent, View view, final int position, long id) {
                progressDialog.show();
                // Object o = prestListView.getItemAtPosition(position);
                //prestationEco str = (prestationEco)o; //As you are using Default String Adapter
                //Toast.makeText(context,"Clicked on list item",Toast.LENGTH_SHORT).show();
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        if (lastKnownLocation != null) {
                            for (DUnit unit : getSelectedTask().getUnitList(new LatLng(lastKnownLocation.getLatitude(), lastKnownLocation.getLongitude()))) {
                                if (unit.getUnit().getUnitId().equals(list.get(position).getTitle())) {
                                    Globals.selectedReportType = unit.getUnit().getAssetType();
                                    Globals.selectedUnit = unit.getUnit();
                                    Globals.selectedDUnit = unit;
                                }
                            }
                        } else {
                            for (DUnit unit : getSelectedTask().getUnitList(new LatLng(Double.parseDouble("0.0"), Double.parseDouble("0.0")))) {
                                if (unit.getUnit().getUnitId().equals(list.get(position).getTitle())) {
                                    Globals.selectedReportType = unit.getUnit().getAssetType();
                                    Globals.selectedUnit = unit.getUnit();
                                    Globals.selectedDUnit = unit;
                                }
                            }
                        }
                        ((Activity) context).runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                Intent returnIntent = new Intent();
                                returnIntent.putExtra("result", "selected");
                                ((Activity) context).setResult(Activity.RESULT_OK, returnIntent);
                                progressDialog.dismiss();
                                ((Activity) context).finish();
                            }
                        });
                    }
                }).start();

                //selectUnitAndExit(list.get(position));
                /*Globals.selectedReportType = unit.getUnit().getAssetType();
                Globals.selectedUnit = unit.getUnit();
                Globals.selectedDUnit = unit;
                Intent returnIntent = new Intent();
                returnIntent.putExtra("result", "selected");
                ((Activity) context).setResult(Activity.RESULT_OK, returnIntent);
                ((Activity) context).finish();*/
            }
        });

    }
}