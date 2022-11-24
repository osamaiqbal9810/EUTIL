package com.app.ps19.hosapp;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import android.util.DisplayMetrics;
import android.view.View;
import android.widget.ExpandableListView;

//import com.androidtutorialshub.expandablelistview.adapter.ExpandableListViewAdapter;

import com.app.ps19.hosapp.Shared.Globals;
import com.app.ps19.hosapp.classes.DefectCode;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class DefectCodeActivity extends AppCompatActivity {

    private ExpandableListView expandableListView;

    private defectCodeAdapter expandableListViewAdapter;

    private List<DefectCode> listDataGroup;

    private HashMap<DefectCode, List<DefectCode>> listDataChild;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

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

        // initializing the adapter object
        expandableListViewAdapter = new defectCodeAdapter(this, listDataGroup, listDataChild);

        // setting list adapter
        expandableListView.setAdapter(expandableListViewAdapter);

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

        /*Globals.defectCodeSelection.clear();
        for(int i = 0 ; i < Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().size(); i++){
            for(int j = 0; j < Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails().get(i).getDetails().size(); j++){
                Globals.defectCodeSelection.add("");
            }
        }*/
        //listDataGroup.addAll(Globals.selectedUnit.getAssetTypeObj().getDefectCodes().getDetails());


        // Adding group data
      /*  listDataGroup.add("Temp");
        listDataGroup.add("Temp");
        listDataGroup.add("Temp");
        listDataGroup.add("Temp");
        // array of strings
        String[] array;

        // list of alcohol
        List<String> alcoholList = new ArrayList<>();
        *//*array = getResources().getStringArray(R.array.string_array_alcohol);
        for (String item : array) {
            alcoholList.add(item);
        }*//*
        alcoholList.add("Temp");

        // list of coffee
        List<String> coffeeList = new ArrayList<>();
       *//* array = getResources().getStringArray(R.array.string_array_coffee);
        for (String item : array) {
            coffeeList.add(item);
        }*//*
        coffeeList.add("Temp");

        // list of pasta
        List<String> pastaList = new ArrayList<>();
        *//*array = getResources().getStringArray(R.array.string_array_pasta);
        for (String item : array) {
            pastaList.add(item);
        }*//*
        pastaList.add("Temp");

        // list of cold drinks
        List<String> coldDrinkList = new ArrayList<>();
        *//*array = getResources().getStringArray(R.array.string_array_cold_drinks);
        for (String item : array) {
            coldDrinkList.add(item);
        }*//*
        coldDrinkList.add("Temp");

        // Adding child data
        listDataChild.put(listDataGroup.get(0), alcoholList);
        listDataChild.put(listDataGroup.get(1), coffeeList);
        listDataChild.put(listDataGroup.get(2), pastaList);
        listDataChild.put(listDataGroup.get(3), coldDrinkList);
*/
        // notify the adapter
        expandableListViewAdapter.notifyDataSetChanged();
    }
    @Override
    public boolean onSupportNavigateUp() {
        //code it to launch an intent to the activity you want

        finish();
        return true;
    }
}
