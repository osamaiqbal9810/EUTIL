package com.app.ps19.elecapp;

import static com.app.ps19.elecapp.Shared.Globals.TASK_FINISHED_STATUS;
import static com.app.ps19.elecapp.Shared.Globals.getSelectedTask;
import static com.app.ps19.elecapp.Shared.ListMap.LIST_CATEGORY;

import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.content.res.Resources;
import android.net.Uri;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Spinner;
import android.widget.TextView;

import androidx.annotation.AnyRes;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.app.ps19.elecapp.Shared.Globals;
import com.app.ps19.elecapp.Shared.ListMap;
import com.app.ps19.elecapp.classes.Report;
import com.app.ps19.elecapp.classes.Task;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import java.util.ArrayList;


public class TaskDetailActivity extends AppCompatActivity {
    //String[] reportArray = {"Need Repairs", "Maintenance Required"};
    ListView reportList;
    Context context;
    // GPSTracker class
    //GPSTracker gps;
    TextView taskTitle;
    TextView taskDesc;
    TextView taskNotes;
    public static final String railsTxt = "Rails";
    public static final String tilesTxt = "Tiles";
    public static final String spikesTxt = "Spikes";
    public static final String jointTxt = "Joint Bar";
    public static final String switchTxt = "Switch";
    public static final String safetyTxt = "Safety Hazards";
    public static final String ASSET_TYPE_ALL_TXT = "All";
    //public String Globals.selectedReportType = "";
    // Add a different request code for every activity you are starting from here
    public static final int SECOND_ACTIVITY_REQUEST_CODE = 0;
    //TaskDetails rails = new TaskDetails();
    //TaskDetails tiles = new TaskDetails();
    //TaskDetails spikes = new TaskDetails();
    // joint = new TaskDetails();
    //TaskDetails switchs = new TaskDetails();

    //reportAdapter adapter;
    reportAdapter adapter;
    Task task;// = new Task(context);
    Spinner assetFilterSpinner;
    ArrayAdapter<String> typeAdapter;
    private ArrayList<String> _assetTypeList;


    private TextView mTextMessage;

    /*private BottomNavigationView.OnNavigationItemSelectedListener mOnNavigationItemSelectedListener
            = new BottomNavigationView.OnNavigationItemSelectedListener() {

        @Override
        public boolean onNavigationItemSelected(@NonNull MenuItem item) {
            switch (item.getItemId()) {
                case R.id.navigation_safety:
                    Globals.selectedReportType = safetyTxt;
                    setAdapter(safetyTxt);
                    return true;
                case R.id.navigation_spikes:
                    Globals.selectedReportType = spikesTxt;
                    setAdapter(spikesTxt);
                    //mTextMessage.setText(R.string.title_rails);
                    return true;
                case R.id.navigation_rails:
                    setAdapter(railsTxt);
                    Globals.selectedReportType = railsTxt;
                    //setRailAdapter();
                    //mTextMessage.setText(R.string.title_rails);
                    return true;
               *//* case R.id.navigation_tiles:
                    setAdapter(tilesTxt);
                    Globals.selectedReportType = tilesTxt;
                    //mTextMessage.setText(R.string.title_tiles);
                    //setTilesAdapter();
                    return true;*//*
     *//*case R.id.navigation_spikes:
                    //mTextMessage.setText(R.string.title_spikes);
                    return true;*//*
                case R.id.navigation_jointBar:
                    Globals.selectedReportType = jointTxt;
                    setAdapter(jointTxt);
                    //setJointAdapter();
                    //mTextMessage.setText(R.string.title_jointBar);
                    return true;
                case R.id.navigation_switch:
                    Globals.selectedReportType = switchTxt;
                    setAdapter(switchTxt);
                    //setSwitchAdapter();
                    //mTextMessage.setText(R.string.title_switch);
                    return true;
            }
            return false;
        }
    };*/

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_task_detail);
        taskTitle = (TextView) findViewById(R.id.taskTitleTxt);
        taskDesc = (TextView) findViewById(R.id.taskDescTxt);
        taskNotes = (TextView) findViewById(R.id.taskNotesTxt);

        mTextMessage = (TextView) findViewById(R.id.message);
        /*BottomNavigationView navigation = (BottomNavigationView) findViewById(R.id.navigation);
        navigation.setOnNavigationItemSelectedListener(mOnNavigationItemSelectedListener);
        BottomNavigationViewHelper.removeShiftMode(navigation);
        */
        /*Toolbar toolbar = (Toolbar) findViewById(R.id.taskDetailsToolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);*/
        reportList = (ListView) findViewById(R.id.reportList);
        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fabAdd);
        assetFilterSpinner = (Spinner) findViewById(R.id.assetTypeSpinner);
        context = this;
        task = new Task(context);
        populateTypeSpinner();

        //setRailAdapter();
        //task.loadSampleData();
        //Globals.inbox.getJourneyPlans().get(0).getTaskList().get(0).getFilteredReportList(railsTxt);
        taskTitle.setText(getSelectedTask().getTitle());
        taskDesc.setText(getSelectedTask().getDescription());
        taskNotes.setText(getSelectedTask().getNotes());
        //adapter = new reportAdapter(this, Globals.selectedTask.getReportList(), "All");
        //adapter = new reportAdapter(this, task.getFilteredReportList(railsTxt), railsTxt);
        //reportList.setAdapter(adapter);
        Globals.selectedReportType = ASSET_TYPE_ALL_TXT;
        setAdapter(ASSET_TYPE_ALL_TXT);

        if (getSelectedTask().getStatus().equals(TASK_FINISHED_STATUS)) {
            fab.setVisibility(View.GONE);
        }

        //adapter = new reportAdapter(this, taskTitle, priority, marked, taskImgId);
        //reportList.setAdapter(adapter);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Globals.selectedReport = null;
                Globals.newReport = new Report();
                Globals.selectedCategory = Globals.selectedReportType;
                Intent intent = new Intent(TaskDetailActivity.this, ReportAddActivity.class);
                startActivityForResult(intent, SECOND_ACTIVITY_REQUEST_CODE);
                /*Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();*/
            }
        });
        reportList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            public void onItemClick(AdapterView<?> parent, View view,
                                    int position, long id) {
                Globals.selectedReportIndex = position;
                //setReportSelection(Globals.selectedTask.getFilteredReportList(Globals.selectedReportType).get(position));
                if (Globals.selectedReportType.equals(ASSET_TYPE_ALL_TXT)) {
                    Globals.selectedReport = getSelectedTask().getReportList().get(position);
                } else {
                    Globals.selectedReport = getSelectedTask().getFilteredReportList(Globals.selectedReportType).get(position);
                }
                Globals.newReport = null;
                Globals.selectedCategory = Globals.selectedReportType;
                if (getSelectedTask().getStatus().equals(TASK_FINISHED_STATUS)) {
                    Intent viewMode = new Intent(context, ReportViewActivity.class);
                    startActivity(viewMode);
                } else {
                    Intent intent = new Intent(context, ReportAddActivity.class);
                    startActivityForResult(intent,SECOND_ACTIVITY_REQUEST_CODE);
                }
                    /*String category = task.getFilteredReportList(Globals.selectedReportType).get(position).getCategory();
                    String track = task.getFilteredReportList(Globals.selectedReportType).get(position).getTrackId();
                    String description = task.getFilteredReportList(Globals.selectedReportType).get(position).getDescription();
                    ArrayList<String> attachments = task.getFilteredReportList(Globals.selectedReportType).get(position).getImgList();
                    Boolean marked = task.getFilteredReportList(Globals.selectedReportType).get(position).getMarked();
                    String priority = task.getFilteredReportList(Globals.selectedReportType).get(position).getPriority();
                    Bundle bundle = new Bundle();

                    intent.putExtra("Activity", "New");
                    intent.putExtra("Track", track);
                    intent.putExtra("Description", description);
                    bundle.putSerializable("Images", attachments);
                    intent.putExtra("Marked", marked);
                    intent.putExtra("Priority", priority);
                    intent.putExtra("Category", category);*/
                //intent.putExtra("Activity", "Edit");

//                startActivity(intent);
            }
        });
        assetFilterSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parentView, View selectedItemView, int position, long id) {
                String selectedType = _assetTypeList.get(position);
                Globals.selectedReportType = selectedType;
                setAdapter(selectedType);
            }

            @Override
            public void onNothingSelected(AdapterView<?> parentView) {
                setAdapter(ASSET_TYPE_ALL_TXT);
            }

        });
    }

    public void setAdapter(String type) {
        if (type.equals(ASSET_TYPE_ALL_TXT)) {
            adapter = new reportAdapter(this, getSelectedTask().getReportList(), type);
        } else {
            adapter = new reportAdapter(this, getSelectedTask().getFilteredReportList(type), type);
        }
        reportList.setAdapter(adapter);
    }


    // This method is called when the second activity finishes
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        // check that it is the SecondActivity with an OK result
        if (requestCode == SECOND_ACTIVITY_REQUEST_CODE) {
            setAdapter(Globals.selectedReportType);
            if (resultCode == RESULT_OK) {
                // get String data from Intent
               /* String description = data.getStringExtra("description");
                Boolean isMarked = data.getBooleanExtra("marked", false);
                String priorityTxt = data.getStringExtra("priority");
                String categoryTxt = data.getStringExtra("category");
                String trackTxt = data.getStringExtra("track");
                String location = "";
                *//*list.add("RAILS");
                list.add("TILES");
                list.add("SPIKES");
                list.add("JOINT BAR");
                list.add("SWITCH");*//*
                // create class object
                gps = new GPSTracker(TaskDetailActivity.this);

                // check if GPS enabled
                if (gps.canGetLocation()) {

                    double latitude = gps.getLatitude();
                    double longitude = gps.getLongitude();
                    location = String.valueOf(latitude) + "," + String.valueOf(longitude);
                    //longTxt.setText(String.valueOf(longitude));
                    //latTxt.setText(String.valueOf(latitude));

                    // \n is for new line
            *//*Toast.makeText(getApplicationContext(), "Your Location is - \nLat: "
                    + latitude + "\nLong: " + longitude, Toast.LENGTH_LONG).show();*//*
                } else {
                    // can't get location
                    // GPS or Network is not enabled
                    // Ask user to enable GPS/network in settings
                    gps.showSettingsAlert();
                }
                *//*String category, String trackId,
                        String description, ArrayList<Uri> imgList,
                        String location, Boolean marked,
                        String priority*//*
                //ArrayList<Uri> uriList;
                Bundle bundle = data.getExtras();
                //if ( extras != null ) {
                    //uriList = data.getParcelableArrayListExtra("ImageList");
                    //uriList = (ArrayList<Uri>) data.getSerializable("ImageList");
                ArrayList<IssueImage> uriList = (ArrayList<IssueImage>) bundle.getSerializable("Images");
                    //
                    // Here, we can use uriList
                    //
                    ArrayList<Report> newReport = new ArrayList<>();
                    //newReport.add(new Report(categoryTxt, trackTxt, description, uriList, location, isMarked, priorityTxt  ));
                Globals.selectedTask.getReportList().add(new Report("1", categoryTxt, trackTxt, description, uriList, location, isMarked, priorityTxt, ""));
                //}
                switch (categoryTxt){
                    case "RAILS":
                        setAdapter(railsTxt);
                        //setRailAdapter();
                        break;
                    case "TILES":
                        setAdapter(tilesTxt);
                        //setTilesAdapter();
                        break;
                    case "SPIKES":
                        setAdapter(spikesTxt);
                        //setSpikesAdapter();
                        break;
                    case "JOINT BAR":
                        setAdapter(jointTxt);
                        //setJointAdapter();
                        break;
                    case "SWITCH":
                        setAdapter(switchTxt);
                        //setSwitchAdapter();
                        break;
                }*/
            }
        }
    }
    /**
     * get uri to any resource type
     * @param context - context
     * @param resId - resource id
     * @throws Resources.NotFoundException if the given ID does not exist.
     * @return - Uri to resource by given id
     */
    public static final Uri getUriToResource(@NonNull Context context,
                                             @AnyRes int resId)
            throws Resources.NotFoundException {
        /** Return a Resources instance for your application's package. */
        Resources res = context.getResources();
        /**
         * Creates a Uri which parses the given encoded URI string.
         * @param uriString an RFC 2396-compliant, encoded URI
         * @throws NullPointerException if uriString is null
         * @return Uri for this given uri string
         */
        Uri resUri = Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE +
                "://" + res.getResourcePackageName(resId)
                + '/' + res.getResourceTypeName(resId)
                + '/' + res.getResourceEntryName(resId));
        /** return uri */
        return resUri;
    }

    @Override
    public boolean onSupportNavigateUp() {
        //code it to launch an intent to the activity you want
        finish();
        return true;
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        //inflater.inflate(R.menu.inbox_actions, menu);
        return true;
    }

    public void populateTypeSpinner() {

        ListMap.loadList(LIST_CATEGORY);
        _assetTypeList = ListMap.getList(LIST_CATEGORY);
        _assetTypeList.add(0, ASSET_TYPE_ALL_TXT);
        typeAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, _assetTypeList);
        typeAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        assetFilterSpinner.setAdapter(typeAdapter);
    }

}
