package com.app.ps19.tipsapp;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.Shared.ObservableObject;
import com.app.ps19.tipsapp.Shared.Utilities;
import com.app.ps19.tipsapp.classes.Inbox;
import com.app.ps19.tipsapp.classes.JourneyPlan;
import com.app.ps19.tipsapp.classes.Units;

import org.json.JSONArray;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Observable;
import java.util.Observer;

import static com.app.ps19.tipsapp.Shared.Globals.FULL_DATE_FORMAT;
//import static com.app.ps19.tipsapp.Shared.Globals.selectedTask;
import static com.app.ps19.tipsapp.Shared.Globals.getSelectedTask;
import static com.app.ps19.tipsapp.Shared.Globals.setLocale;
import static com.app.ps19.tipsapp.Shared.Globals.setSelectedTask;

public class InboxActivity extends AppCompatActivity implements Observer{

    // Array of strings...
    Inbox inbox;
    Context mContext;
    ListView taskList;
    TextView tvJpTitle;
   /* GPSService gService;
    boolean mServiceConnected = false;
    boolean mBound = false;
    Location location;*/
    /*
    String[] taskSubTitle = {
            "Milepost 10, 11", "Milepost 12, 13",
            "Milepost 09"
    };

    String[] taskDetails = {
            "Please also check Joint bars and mark all cracked ones.", "..",
            "Please verify the repair work marked location 365 and take pictures."
    };

    Integer[] taskImgId = {
            R.drawable.task1, R.drawable.task2,
            R.drawable.task3
    };*/
    private Spinner daysSpinner;
    List<String> datesForSpinner = new ArrayList<String>();
    ArrayAdapter<String> dateAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setLocale(this);
        setContentView(R.layout.activity_inbox2);
        Toolbar toolbar = (Toolbar) findViewById(R.id.inboxToolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        tvJpTitle = (TextView) findViewById(R.id.tvSelectedJPTitle);

        mContext = this;

        ObservableObject.getInstance().addObserver(this);
        setTitle(getString(R.string.title_activity_inbox));
        if (Globals.inbox == null) {
            inbox = new Inbox();
            //inbox.saveSampleData(this);
            Globals.inbox = inbox;
            Globals.inbox.loadSampleData(this);
        } /*else {
            inbox = Globals.inbox;
        }*/

        taskList = (ListView) findViewById(R.id.taskList);
        taskAdapter adapter;
       /* startService(new Intent(this, GPSService.class));
        GPSTrackerEx nGps = new GPSTrackerEx(this);
        //doBindService();
        if(gService!=null){
            gService.getLocation();
        }
        if(mServiceConnected){

        }*/

        if (Globals.inbox.getJourneyPlans().size() == 0) {
            taskList.setAdapter(null);
        } else {
            adapter = new taskAdapter(this, Globals.inbox.getJourneyPlans().get(0).getTaskList());
            //ArrayAdapter<String> arrayAdapter = new ArrayAdapter<String>(InboxActivity.this, R.layout.activity_listview, R.id.taskView, taskArray);
            taskList.setAdapter(adapter);
            tvJpTitle.setText(Globals.inbox.getJourneyPlans().get(0).getTitle());
        }

        //generateCalDates();
        //addItemsOnSpinner();

        /*FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });*/
        taskList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            public void onItemClick(AdapterView<?> parent, View view,
                                    int position, long id) {
                //Date currentDate = new Date();
                //SimpleDateFormat _format = new SimpleDateFormat("dd MMMM yyyy");
                //   if (_format.format(currentDate).equals(Globals.selectedJPlan.getDate())) {
                    setSelectedTask(Globals.selectedJPlan.getTaskList().get(position));
                    Globals.selectedUnit = null;
                //Setting yard inspection
                findAndSetYardInspection();
                    //Intent intent = new Intent(InboxActivity.this, TaskActivity.class);
                    Intent intent = new Intent(InboxActivity.this, TaskDashboardActivity.class);
                    startActivity(intent);
             /*   } else {
                    Snackbar.make(view, "Please select a Plan from Today's list", Snackbar.LENGTH_LONG)
                            .setAction("Action", null).show();
                }*/
            }
        });
        /*daysSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {

            public void onItemSelected(AdapterView<?> arg0, View view, int position, long id) {
                int item = daysSpinner.getSelectedItemPosition();
                String selectedDate = datesForSpinner.get(item);
                //SimpleDateFormat _format = new SimpleDateFormat("dd MMMM yyyy");
                SimpleDateFormat _format = new SimpleDateFormat("yyyy-MM-dd");
                JourneyPlan sJourneyPlan = new JourneyPlan();
                for (JourneyPlan jPlan : inbox.getJourneyPlans()) {
                    Date test = new Date();
                    try {
                        test = _format.parse(jPlan.getDate());
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }
                    if (Globals.spinnerDateFormat.format(test).equals(Globals.spinnerDateFormat.format(new Date(selectedDate)))) {
                        Globals.selectedJPlan = jPlan;
                        sJourneyPlan = jPlan;
                    }
                }
                if (sJourneyPlan.getTaskList() == null) {
                    taskList.setAdapter(null);
                } else {
                    taskAdapter adapter = new taskAdapter(InboxActivity.this, sJourneyPlan.getTaskList());
                    taskList.setAdapter(adapter);
                }
            }

            public void onNothingSelected(AdapterView<?> arg0) {
            }
        });*/
    }

    /*@Override
    public void onPause() {
        Log.d("SVTEST", "Activity onPause");
        super.onPause();
    }
    @Override
    public void onStop() {
        Log.d("SVTEST", "Activity onStop");
        if (mBound) {
            unbindService(mServconn);
            mBound = false;
        }
        super.onStop();
    }

    @Override
    public void onStart() {
        super.onStart();
        Log.d("SVTEST", "Activity onStart");
       // mServiceConnected = bindService(new Intent(this, GPSService.class), mServconn,
       //         Context.BIND_AUTO_CREATE);
    }
    ServiceConnection mServconn = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            Log.d("SVTEST", "Activity service connected");
            GPSService.LocalBinder binder = (GPSService.LocalBinder) service;
            gService = binder.getService();
            // Can't call this methodInTheService UNTIL IT'S BOUND!
            gService.getLocation();
            gService.methodInTheService();
            mBound = true;
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            Log.d("SVTEST", "Activity service disconnected");
            mBound = false;
        }
    };
    *//*private ServiceConnection mConnection = new ServiceConnection() {
        public void onServiceConnected(ComponentName className, IBinder service) {
            // This is called when the connection with the service has been
            // established, giving us the service object we can use to
            // interact with the service.  Because we have bound to a explicit
            // service that we know is running in our own process, we can
            // cast its IBinder to a concrete class and directly access it.
            gService = ((GPSService.LocalBinder) service).getService();

            // Tell the user about this for our demo.
            *//**//*Toast.makeText(Binding.this, R.string.local_service_connected,
                    Toast.LENGTH_SHORT).show();*//**//*
        }

        public void onServiceDisconnected(ComponentName className) {
            // This is called when the connection with the service has been
            // unexpectedly disconnected -- that is, its process crashed.
            // Because it is running in our same process, we should never
            // see this happen.
            gService = null;
            *//**//*Toast.makeText(MainActivity.this, "Service connected!",
                    Toast.LENGTH_SHORT).show();*//**//*
        }
    };*//*
    *//*void doBindService() {
        // Establish a connection with the service.  We use an explicit
        // class name because there is no reason to be able to let other
        // applications replace our component.
        bindService(new Intent(this,
                GPSService.class), mConnection, Context.BIND_AUTO_CREATE);
        //mIsBound = true;
        //mCallbackText.setText("Binding.");
    }*//*

*/    // add items into spinner dynamically
    public void addItemsOnSpinner() {

        daysSpinner = (Spinner) findViewById(R.id.spinner);
        List<String> list = new ArrayList<String>();
        for (String date : datesForSpinner) {
            try {
                list.add(Globals.spinnerDayFormat.format(FULL_DATE_FORMAT.parse(date)));
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        try {
            dateAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, list);
            dateAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
            daysSpinner.setAdapter(dateAdapter);
        } catch (Exception e) {
            e.printStackTrace();
        }
        Date currentDate = Utilities.ConvertToDateTime(Globals.SOD);//new Date();
        for (int i = 0; i < datesForSpinner.size(); i++) {
            Date _date = null;
            try {
                _date = FULL_DATE_FORMAT.parse(datesForSpinner.get(i));
            } catch (ParseException e) {
                e.printStackTrace();
            }
            if ((Globals.spinnerDayFormat.format(_date)).equals(Globals.spinnerDayFormat.format(currentDate))) {
                setSpinner(dateAdapter, daysSpinner, list.get(i));
                JourneyPlan sJourneyPlan = new JourneyPlan();
                for (JourneyPlan jPlan : inbox.getJourneyPlans()) {
                    if (jPlan.getDate().equals(Globals.spinnerDayFormat.format(currentDate))) {
                        Globals.selectedJPlan = jPlan;
                        sJourneyPlan = jPlan;
                    }
                }
                if (sJourneyPlan.getTaskList() == null) {
                    taskList.setAdapter(null);
                } else {
                    taskAdapter adapter = new taskAdapter(InboxActivity.this, sJourneyPlan.getTaskList());
                    taskList.setAdapter(adapter);
                }
            }
        }
    }

    public void setSpinner(ArrayAdapter<String> selectedAdapter, Spinner selectedSpinner, String spinnerTxt) {
        if (spinnerTxt != null) {
            int spinnerPosition = selectedAdapter.getPosition(spinnerTxt);
            selectedSpinner.setSelection(spinnerPosition);
        }
    }

    public void generateCalDates() {
        Calendar cal = Calendar.getInstance();
//cal.setTime(new Date());//Set specific Date if you want to
        //SimpleDateFormat format1 = new SimpleDateFormat("EEE, d MMM yyyy HH:mm:ss Z");
        Date curSOD=Utilities.ConvertToDateTime(Globals.SOD);
        cal.setTime(curSOD);
        for (int i = Calendar.SUNDAY; i <= Calendar.SATURDAY; i++) {
            cal.set(Calendar.DAY_OF_WEEK, i);
            datesForSpinner.add(cal.getTime().toString());
            //datesForSpinner.add(format1.format(cal.getTime()));
            //System.out.println(cal.getTime());//Returns Date
        }
        addItemsOnSpinner();
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

    @Override
    public void update(Observable o, Object arg) {
        Intent intent=(Intent)arg;
        Bundle b1= intent.getExtras();
        final String messageName=b1.getString("messageName");
        final String messageData=b1.getString("messageData");
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                String message="";
                switch (messageName){
                    case Globals.OBSERVABLE_MESSAGE_TOKEN_STATUS:
                        Globals.handleTokenStatus(InboxActivity.this);
                        break;
                    case Globals.OBSERVABLE_MESSAGE_DATA_CHANGED:

                        if(Globals.changeItemList !=null){
                            for(String key:Globals.changeItemList.keySet()){
                                switch (key){
                                    case Globals.JPLAN_LIST_NAME:
                                        JSONArray ja=Globals.changeItemList.get(key);
                                        for( int i=0;i<ja.length();i++){
                                            try {
                                                String code = ja.getString(i);
                                                if(Globals.selectedJPlan !=null){
                                                    if(Globals.selectedJPlan.getDate().equals(code)){
                                                        //message="Data updated:";
                                                        runOnUiThread(new Runnable() {
                                                            @Override
                                                            public void run() {
                                                                setDataAdapter();
                                                            }
                                                        });

                                                    }
                                                }else{
                                                    refreshJP();

                                                }
                                            }catch (Exception e){
                                                e.printStackTrace();
                                            }
                                        }

                                        break;
                                }
                            }
                        }
                        break;
                    case Globals.OBSERVABLE_MESSAGE_DATA_SENT:
                        break;
                }
                if(!message.equals(""))
                    Toast.makeText(InboxActivity.this,message,Toast.LENGTH_SHORT ).show();
            }
        });

    }
    private void setDataAdapter(){
        JourneyPlan sJourneyPlan = Globals.selectedJPlan;
        if (sJourneyPlan !=null) {
            sJourneyPlan.refresh(InboxActivity.this);
            if (sJourneyPlan.getTaskList() == null) {
                taskList.setAdapter(null);
            } else {
                taskAdapter adapter = new taskAdapter(InboxActivity.this, sJourneyPlan.getTaskList());
                taskList.setAdapter(adapter);
                //adapter.notifyDataSetChanged();
            }
        }
    }
    private void refreshJP(){
        if(Globals.inbox !=null){
            Globals.inbox.loadSampleData(InboxActivity.this);
            //inbox=Globals.inbox;

        }

        try {
            if (Globals.inbox != null) {
                if (Globals.inbox.getJourneyPlans().size() == 0) {
                    taskList.setAdapter(null);
                } else {
                    //taskAdapter adapter;
                    //adapter = new taskAdapter(this, inbox.getJourneyPlans().get(0).getTaskList());
                    //ArrayAdapter<String> arrayAdapter = new ArrayAdapter<String>(InboxActivity.this, R.layout.activity_listview, R.id.taskView, taskArray);
                    //taskList.setAdapter(adapter);
                    generateCalDates();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }


    }

    @Override
    protected void onResume() {
        super.onResume();
        //setDataAdapter();
        if(Globals.selectedJPlan != null ){
            taskAdapter adapter = new taskAdapter(InboxActivity.this, Globals.selectedJPlan.getTaskList());
            taskList.setAdapter(adapter);
        }
    }
    private void findAndSetYardInspection(){
        for(Units asset: getSelectedTask().getWholeUnitList()){
            if(asset.getAssetTypeObj().isMarkerMilepost()){
                getSelectedTask().setYardInspection(true);
                break;
            }
        }
    }
}



