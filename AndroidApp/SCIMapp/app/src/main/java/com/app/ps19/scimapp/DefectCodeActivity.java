package com.app.ps19.scimapp;

import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import android.util.DisplayMetrics;
import android.view.KeyEvent;
import android.view.View;
import android.widget.ExpandableListView;


import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.classes.DefectCode;
import com.google.common.collect.ArrayListMultimap;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static com.app.ps19.scimapp.Shared.Globals.defectSelection;
import static com.app.ps19.scimapp.Shared.Globals.defectSelectionCopy;
import static com.app.ps19.scimapp.Shared.Globals.setLocale;

public class DefectCodeActivity extends AppCompatActivity {

    private ExpandableListView expandableListView;

    private defectCodeAdapter defectCodeListAdapter;

    private List<DefectCode> listDataGroup;

    private HashMap<DefectCode, List<DefectCode>> listDataChild;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setLocale(this);
        setTitle(R.string.title_activity_defect_code);
        setContentView(R.layout.activity_defect_code);
        /*Toolbar toolbar = (Toolbar) findViewById(R.id.defect_code_toolbar);
        setSupportActionBar(toolbar);*/
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        //Globals.defectCodeSelection = new ArrayList<>();
        Globals.defectCodeTags = new ArrayList<>();

        // initializing the views
        initViews();

        // initializing the listeners
        initListeners();

        // initializing the objects
        initObjects();

        // preparing list data
        initListData();

    }
    public int GetDipsFromPixel(float pixels)
    {
        // Get the screen's density scale
        final float scale = getResources().getDisplayMetrics().density;
        // Convert the dps to pixels, based on density scale
        return (int) (pixels * scale + 0.5f);
    }


    /**
     * method to initialize the views
     */
    private void initViews() {

        expandableListView = findViewById(R.id.expandableListView);
        DisplayMetrics metrics = new DisplayMetrics();
        getWindowManager().getDefaultDisplay().getMetrics(metrics);
        int width = metrics.widthPixels;
        expandableListView.setIndicatorBounds(width-GetDipsFromPixel(35), width-GetDipsFromPixel(5));

    }

    /**
     * method to initialize the listeners
     */
    private void initListeners() {

        // ExpandableListView on child click listener
        expandableListView.setOnChildClickListener(new ExpandableListView.OnChildClickListener() {

            @Override
            public boolean onChildClick(ExpandableListView parent, View v,
                                        int groupPosition, int childPosition, long id) {
               /* Toast.makeText(
                        getApplicationContext(),
                        listDataGroup.get(groupPosition)
                                + " : "
                                + listDataChild.get(
                                listDataGroup.get(groupPosition)).get(
                                childPosition), Toast.LENGTH_SHORT)
                        .show();*/
                return false;
            }
        });

        // ExpandableListView Group expanded listener
        expandableListView.setOnGroupExpandListener(new ExpandableListView.OnGroupExpandListener() {

            @Override
            public void onGroupExpand(int groupPosition) {
               /* Toast.makeText(getApplicationContext(),
                        listDataGroup.get(groupPosition) + " " + getString(R.string.text_collapsed),
                        Toast.LENGTH_SHORT).show();*/
            }
        });

        // ExpandableListView Group collapsed listener
        expandableListView.setOnGroupCollapseListener(new ExpandableListView.OnGroupCollapseListener() {

            @Override
            public void onGroupCollapse(int groupPosition) {
               /* Toast.makeText(getApplicationContext(),
                        listDataGroup.get(groupPosition) + " " + getString(R.string.text_collapsed),
                        Toast.LENGTH_SHORT).show();*/

            }
        });

    }

    /**
     * method to initialize the objects
     */
    private void initObjects() {

        // initializing the list of groups
        listDataGroup = new ArrayList<>();

        // initializing the list of child
        listDataChild = new HashMap<>();

        boolean isEdit = false;

        if(defectSelectionCopy.size() > 0){
            isEdit = true;
            defectSelection.clear();
            defectSelection = ArrayListMultimap.create(defectSelectionCopy);
        }

        // initializing the adapter object
        defectCodeListAdapter = new defectCodeAdapter(this, listDataGroup, listDataChild, isEdit);

        // setting list adapter
        expandableListView.setAdapter(defectCodeListAdapter);

    }

    /*
     * Preparing the list data
     *
     * Dummy Items
     */
    private void initListData() {


        for(int i = 0 ; i < Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().size(); i++){
            listDataGroup.add(Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().get(i));
            listDataChild.put(Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().get(i),Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().get(i).getDetails());
        }
        // notify the adapter
        defectCodeListAdapter.notifyDataSetChanged();
    }
    @Override
    public boolean onSupportNavigateUp() {
        //code it to launch an intent to the activity you want
        Intent returnIntent = new Intent();
        returnIntent.putExtra("code","DefectCode");
        setResult(RESULT_OK, returnIntent);
        finish();
        return true;
    }
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            Intent returnIntent = new Intent();
            returnIntent.putExtra("code", "DefectCode");
            setResult(RESULT_OK, returnIntent);
            finish();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
