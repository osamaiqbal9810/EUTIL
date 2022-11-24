package com.app.ps19.scimapp;

import android.app.Activity;
import android.app.ActivityManager;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Handler;
import com.google.android.material.snackbar.Snackbar;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import androidx.appcompat.widget.Toolbar;
import android.text.InputType;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewConfiguration;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ListView;
import android.widget.RadioButton;
import android.widget.RelativeLayout;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;

import com.app.ps19.scimapp.Shared.DBHandler;
import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.Shared.JsonWebService;
import com.app.ps19.scimapp.Shared.ObservableObject;
import com.app.ps19.scimapp.Shared.OnItemClick;
import com.app.ps19.scimapp.Shared.SharedPref;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Observable;
import java.util.Observer;

import static com.app.ps19.scimapp.Shared.Globals.PREFS_KEY_CUSTOM_SERVER;
import static com.app.ps19.scimapp.Shared.Globals.PREFS_KEY_IS_PATCH_PERFORMED;
import static com.app.ps19.scimapp.Shared.Globals.PREFS_KEY_SELECTED_PORT;
import static com.app.ps19.scimapp.Shared.Globals.PREFS_KEY_SELECTED_SERVER;
import static com.app.ps19.scimapp.Shared.Globals.PREFS_KEY_SELECTED_SERVER_DISPLAY_NAME;
import static com.app.ps19.scimapp.Shared.Globals.PREFS_KEY_SERVER;
import static com.app.ps19.scimapp.Shared.Globals.PREFS_STRING_DIVIDER;
import static com.app.ps19.scimapp.Shared.Globals.defaultServerName;
import static com.app.ps19.scimapp.Shared.Globals.setLocale;

public class SettingsActivity extends AppCompatActivity implements OnItemClick, Observer {
    //EditText edServerName;
    //EditText edServerPort;
    //Button btAddServerInfo;
    Button btClrData;
    Button btnTestServer;
    String server;
    String port;
    TextView tvSelectedServer;
    //Switch swGpsLog;
    //Button btActivate;
    Button btBack;
    //Button btUpdateServer;
    ListView lvServerEntries;
    //serverInfoAdapter aServerInfoAdapter;
    ArrayList<String> serverInfoList = new ArrayList<String>();
    public static String sServerName;
    public static String sServerPort;
    public Boolean isEdit = false;
    int sPosition;
    SharedPref pref;
    Switch swRequireMp;
    Switch swTraverseTrack;
    RelativeLayout rlMpRequire;
    RelativeLayout rlTraverseRequire;
    Switch swBypassTaskView;
    RelativeLayout rlBypassTaskView;
    RelativeLayout rlSingleDefectCode;
    RelativeLayout rlIssueUpdate;
    Switch swSingleCode;
    Switch swIssueUpdate;
    TextView tvGlobalsSettings;
    RelativeLayout rlOldService;
    Switch swOldService;
    RelativeLayout rlSwitchInspection;
    Switch swSwitchInspection;


    ProgressDialog progressDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Globals.checkLanguage(this);
        //setLocale(this);
        setContentView(R.layout.activity_server);
        setTitle(R.string.title_activity_server_info);
        ObservableObject.getInstance().addObserver(this);

        pref = new SharedPref(this);
        Toolbar toolbar = (Toolbar) findViewById(R.id.serverPageToolBar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        /*edServerName = (EditText) findViewById(R.id.edServer);
        edServerPort = (EditText) findViewById(R.id.edPort);*/

        //btAddServerInfo = (Button) findViewById(R.id.btnAddServer);
        btClrData = (Button) findViewById(R.id.btnClearData);
        btnTestServer = (Button) findViewById(R.id.btn_select_server);
        tvSelectedServer = (TextView) findViewById(R.id.tv_selected_server);
        swRequireMp = (Switch) findViewById(R.id.sw_require_mp);
        swTraverseTrack = (Switch) findViewById(R.id.sw_require_traverse);
        rlMpRequire = (RelativeLayout) findViewById(R.id.rl_mp_require);
        rlTraverseRequire = (RelativeLayout) findViewById(R.id.rl_traverse_req);
        swBypassTaskView = (Switch) findViewById(R.id.sw_bypass_task_view);
        rlBypassTaskView = (RelativeLayout) findViewById(R.id.rl_bypass_task_view);
        rlIssueUpdate = (RelativeLayout) findViewById(R.id.rl_issue_update);
        rlSingleDefectCode = (RelativeLayout) findViewById(R.id.rl_single_code_selection);
        swIssueUpdate = (Switch) findViewById(R.id.sw_issue_update);
        swSingleCode = (Switch) findViewById(R.id.sw_single_code_selection);
        tvGlobalsSettings = (TextView) findViewById(R.id.tv_global_settings);
        rlOldService = (RelativeLayout) findViewById(R.id.rl_old_service);
        swOldService = (Switch) findViewById(R.id.sw_old_service);
        rlSwitchInspection = (RelativeLayout) findViewById(R.id.rl_switch_inspection);
        swSwitchInspection = (Switch) findViewById(R.id.sw_switch_inspection);

        //swGpsLog = (Switch) findViewById(R.id.gps_logging_switch);
        //btActivate = (Button) findViewById(R.id.btnActivateServer);
        //btBack = (Button) findViewById(R.id.btnCancelServer);
        // btUpdateServer = (Button) findViewById(R.id.btnUpdateServer);
        /*if(isMyServiceRunning(BackgroundLocationUpdateService.class)){
            swGpsLog.setChecked(true);
        } else {
            swGpsLog.setChecked(false);
        }*/

        // PATCH FOR OLD DATA
        if (!pref.getBoolean(PREFS_KEY_IS_PATCH_PERFORMED)) {
            ArrayList<String> patchList = new ArrayList<>();
            patchList = getArrayList(PREFS_KEY_SERVER);
            if (patchList.size() > 0) {
                String[] patchArray = patchList.get(0).split(",");
                if (patchArray.length == 2) {
                    String conServer = defaultServerName + PREFS_STRING_DIVIDER + Globals.wsDomainName + PREFS_STRING_DIVIDER + Globals.wsPort;
                    serverInfoList.add(conServer);
                    pref.putString(defaultServerName, PREFS_KEY_SELECTED_SERVER_DISPLAY_NAME);
                    //serverInfoList.add("Second" + PREFS_KEY_DIVIDER +"116.58.29.107" + PREFS_KEY_DIVIDER + "3389");
                    saveArrayList(serverInfoList, PREFS_KEY_SERVER);
                    pref.putBool(PREFS_KEY_IS_PATCH_PERFORMED, true);
                }
            }
        }
        swBypassTaskView.setChecked(Globals.isBypassTaskView);
        swBypassTaskView.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                // do something, the isChecked will be
                // true if the switch is in the On position
                Globals.isBypassTaskView = isChecked;
            }
        });
        swRequireMp.setChecked(Globals.isMpReq);
        swRequireMp.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                // do something, the isChecked will be
                // true if the switch is in the On position
                Globals.isMpReq = isChecked;
            }
        });
        swTraverseTrack.setChecked(Globals.isTraverseReq);
        swTraverseTrack.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                // do something, the isChecked will be
                // true if the switch is in the On position
                Globals.isTraverseReq = isChecked;
            }
        });
        swSingleCode.setChecked(Globals.isSingleDefectSelection);
        swSingleCode.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                // do something, the isChecked will be
                // true if the switch is in the On position
                Globals.isSingleDefectSelection = isChecked;
            }
        });
        swIssueUpdate.setChecked(Globals.isIssueUpdateAllowed);
        swIssueUpdate.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                // do something, the isChecked will be
                // true if the switch is in the On position
                Globals.isIssueUpdateAllowed = isChecked;
            }
        });
        swOldService.setChecked(Globals.isSmartObjectAvailable);
        swOldService.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                // do something, the isChecked will be
                // true if the switch is in the On position
                Globals.isSmartObjectAvailable = isChecked;
            }
        });
        swSwitchInspection.setChecked(Globals.isShowSwitchInspection);
        swSwitchInspection.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                // do something, the isChecked will be
                // true if the switch is in the On position
                Globals.isShowSwitchInspection = isChecked;
            }
        });

        tvGlobalsSettings.setOnTouchListener(new View.OnTouchListener() {
            Handler handler = new Handler();

            int numberOfTaps = 0;
            long lastTapTimeMs = 0;
            long touchDownMs = 0;

            @Override
            public boolean onTouch(View v, MotionEvent event) {

                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        touchDownMs = System.currentTimeMillis();
                        break;
                    case MotionEvent.ACTION_UP:
                        handler.removeCallbacksAndMessages(null);

                        if ((System.currentTimeMillis() - touchDownMs) > ViewConfiguration.getTapTimeout()) {
                            //it was not a tap

                            numberOfTaps = 0;
                            lastTapTimeMs = 0;
                            break;
                        }

                        if (numberOfTaps > 0
                                && (System.currentTimeMillis() - lastTapTimeMs) < ViewConfiguration.getDoubleTapTimeout()) {
                            numberOfTaps += 1;
                        } else {
                            numberOfTaps = 1;
                        }

                        lastTapTimeMs = System.currentTimeMillis();

                        if (numberOfTaps == 3) {
                            final AlertDialog.Builder pinAuth = new AlertDialog.Builder(SettingsActivity.this);
                            LayoutInflater inflater = LayoutInflater.from(SettingsActivity.this);
                            View view = inflater.inflate(R.layout.dialog_pin, null);

                            pinAuth.setTitle("PIN required.");
                            pinAuth.setMessage("To unlock advance settings!");
                            pinAuth.setCancelable(false);
                            pinAuth.setView(view);
                            final EditText etPin = (EditText) view.findViewById(R.id.et_pin);
                            etPin.setInputType(InputType.TYPE_NUMBER_VARIATION_PASSWORD);
                            //final Button btnSubmit = (Button) view.findViewById(R.id.btn_submit);
                            //final Button btnCancel = (Button) view.findViewById(R.id.btn_cancel);
                            pinAuth.setPositiveButton("Ok", new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int which) {
                                    // TODO Auto-generated method stub
                                    if(etPin.getText().toString().equals(Globals.SETTINGS_UNLOCK_PIN)){
                                        rlIssueUpdate.setVisibility(View.VISIBLE);
                                        rlSingleDefectCode.setVisibility(View.VISIBLE);
                                        rlOldService.setVisibility(View.VISIBLE);
                                        rlSwitchInspection.setVisibility(View.VISIBLE);
                                    } else {
                                        Toast.makeText(SettingsActivity.this, "Invalid pin code", Toast.LENGTH_SHORT).show();
                                    }
                                }
                            });
                            pinAuth.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int which) {
                                    // TODO Auto-generated method stub
                                }
                            });

                            pinAuth.show();
                            //Toast.makeText(getApplicationContext(), "triple", Toast.LENGTH_SHORT).show();
                            //handle triple tap
                        } else if (numberOfTaps == 2) {
                            handler.postDelayed(new Runnable() {
                                @Override
                                public void run() {
                                    //handle double tap
                                    //Toast.makeText(getApplicationContext(), "double", Toast.LENGTH_SHORT).show();
                                }
                            }, ViewConfiguration.getDoubleTapTimeout());
                        }
                }

                return true;
            }
        });
        //Temporary blocking hidden settings
        //tvGlobalsSettings.setOnTouchListener(null);
        //Hiding these configs as now they update from backend
        hideAllSettings();

        //lvServerEntries = (ListView) findViewById(R.id.lvServerInfo);
        if (!Globals.wsDomainName.equals("") && getArrayList(PREFS_KEY_SERVER).size() == 0) {
            String conServer = defaultServerName + PREFS_STRING_DIVIDER + Globals.wsDomainName + PREFS_STRING_DIVIDER + Globals.wsPort;
            pref.putString(defaultServerName, PREFS_KEY_SELECTED_SERVER_DISPLAY_NAME);
            serverInfoList.add(conServer);
            //serverInfoList.add("Second" + PREFS_KEY_DIVIDER +"116.58.29.107" + PREFS_KEY_DIVIDER + "3389");
            saveArrayList(serverInfoList, PREFS_KEY_SERVER);
        }

        /*swGpsLog.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if (isChecked) {
                    startService(new Intent(getApplication().getBaseContext(), BackgroundLocationUpdateService.class));
                    // The toggle is enabled
                } else {
                    // The toggle is disabled
                    stopService(new Intent(getApplication().getBaseContext(), BackgroundLocationUpdateService.class));
                }
            }
        });*/
        if (pref.getString(PREFS_KEY_SELECTED_SERVER_DISPLAY_NAME).equals("")) {
            tvSelectedServer.setText(defaultServerName);
        } else {
            tvSelectedServer.setText(pref.getString(PREFS_KEY_SELECTED_SERVER_DISPLAY_NAME));
        }
        btnTestServer.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                /*String _serverName = edServerName.getText().toString();
                String _serverPort = edServerPort.getText().toString();
                if (_serverName.contains("https://")) {
                    _serverName = _serverName.replace("https://", "");
                } else if (_serverName.contains("http://")) {
                    _serverName = _serverName.replace("http://", "");
                }
                server = "http://" + _serverName;
                port = _serverPort;
                String _conServer = _serverName + "," + _serverPort;
                new ServerTestAsyncTask().execute();*/

                Intent intent = new Intent(SettingsActivity.this, EndPointActivity.class);
                startActivity(intent);

            }
        });
        btClrData.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                new AlertDialog.Builder(SettingsActivity.this)
                        .setTitle(getString(R.string.confirmation))
                        .setMessage(getString(R.string.clear_all_data))
                        .setIcon(android.R.drawable.ic_dialog_alert)
                        .setPositiveButton(R.string.btn_ok, new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int whichButton) {
                                DBHandler db = Globals.db;//new DBHandler(Globals.getDBContext());
                                db.clearAllData();
                                //db.close();
                                Toast.makeText(SettingsActivity.this, getString(R.string.cleared_all_data), Toast.LENGTH_SHORT).show();
                                Intent i = getBaseContext().getPackageManager().
                                        getLaunchIntentForPackage(getBaseContext().getPackageName());
                                i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                                i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                startActivity(i);
                            }
                        })
                        .setNegativeButton(R.string.btn_cancel, null).show();
            }
        });
       /* btAddServerInfo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (isEdit) {
                    String _serverName = edServerName.getText().toString();
                    String _serverPort = edServerPort.getText().toString();
                    if (_serverName.contains("https://")) {
                        _serverName = _serverName.replace("https://", "");
                    } else if (_serverName.contains("http://")) {
                        _serverName = _serverName.replace("http://", "");
                    }
                    String _conServer = _serverName + "," + _serverPort;
                    serverInfoList.set(sPosition, _conServer);
                    aServerInfoAdapter.notifyDataSetChanged();
                    saveArrayList(serverInfoList, PREFS_KEY_SERVER);
                    isEdit = false;
                    edServerPort.setText("");
                    edServerName.setText("");
                    btAddServerInfo.setText("ADD");

                } else {
                    if (edServerName.getText().toString().equals("") && edServerPort.getText().toString().equals("")) {
                        Snackbar.make(v, getString(R.string.err_invalid_server_info), Snackbar.LENGTH_LONG)
                                .setAction("Action", null).show();
                    } else {
                        String _serverName = edServerName.getText().toString();
                        String _serverPort = edServerPort.getText().toString();
                        if (_serverName.contains("https://")) {
                            _serverName = _serverName.replace("https://", "");
                        } else if (_serverName.contains("http://")) {
                            _serverName = _serverName.replace("http://", "");
                        }
                        String conServer = _serverName + "," + _serverPort;
                        serverInfoList.add(conServer);
                        saveArrayList(serverInfoList, PREFS_KEY_SERVER);

                        //new ServerTestAsyncTask().execute();
                        aServerInfoAdapter.notifyDataSetChanged();
                        edServerPort.setText("");
                        edServerName.setText("");
                    }
                }
            }
        });*/
        /*btActivate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                edServerName.setText("");
                edServerPort.setText("");
                Toast.makeText(ServerActivity.this, "Successfully Activated", Toast.LENGTH_SHORT).show();
            }});*/
        /*btUpdateServer.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(!sServerName.equals("")&& !sServerPort.equals("")){
                    Globals.wsDomainName = sServerName;
                    Globals.wsPort = sServerPort;
                } else {
                    Snackbar.make(v, "Invalid Server Information !", Snackbar.LENGTH_LONG)
                            .setAction("Action", null).show();
                }
            }});*/
        /*btBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
               finish();
            }});*/
        serverInfoList = getArrayList(PREFS_KEY_SERVER);
        //aServerInfoAdapter = new serverInfoAdapter(ServerActivity.this, serverInfoList, this);
       /* if (serverInfoList.size() == 0) {
            lvServerEntries.setAdapter(null);
        } else {
            lvServerEntries.setAdapter(aServerInfoAdapter);
        }*/

        //lvServerEntries.setOnItemSelectedListener();

        /*lvServerEntries.setOnItemClickListener(new AdapterView.OnItemClickListener() {

            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                btAddServerInfo.setText("UPDATE");
                String[] _server = serverInfoList.get(position).split(",");
                edServerName.setText(_server[0]);
                edServerPort.setText(_server[1]);
                isEdit = true;
            }
        });*/
        /*lvServerEntries.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            public void onItemClick(AdapterView<?> parent, View view,
                                    int position, long id) {

            }
        });*/
    }
    private void hideAllSettings(){
        rlTraverseRequire.setVisibility(View.GONE);
        rlMpRequire.setVisibility(View.GONE);
        rlBypassTaskView.setVisibility(View.GONE);
        rlOldService.setVisibility(View.GONE);
        rlSingleDefectCode.setVisibility(View.GONE);
        rlIssueUpdate.setVisibility(View.GONE);
        rlSwitchInspection.setVisibility(View.GONE);
    }

    @Override
    protected void onResume() {
        if (tvSelectedServer != null) {
            if (pref.getString(PREFS_KEY_SELECTED_SERVER_DISPLAY_NAME).equals("")) {
            } else {
                tvSelectedServer.setText(pref.getString(PREFS_KEY_SELECTED_SERVER_DISPLAY_NAME));
            }
        }
        super.onResume();
    }
    @Override
    protected void onPause() {
        hideAllSettings();
        super.onPause();
    }

    public boolean isAccessible() {
        String url = Globals.wsBaseURL + "NotificationLists/" + 12 + "/" + 32 + "/" + 32 + "/" + 11;
        JsonWebService.getJSON(url, 5000);
        return true;
    }

    private boolean isMyServiceRunning(Class<?> serviceClass) {
        ActivityManager manager = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
        assert manager != null;
        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (serviceClass.getName().equals(service.service.getClassName())) {
                return true;
            }
        }
        return false;
    }

    public void saveArrayList(ArrayList<String> list, String key) {
        Gson gson = new Gson();
        String json = gson.toJson(list);
        pref.putString(key, json);
    }

    public ArrayList<String> getArrayList(String key) {
        Gson gson = new Gson();
        String json = pref.getString(key);
        if (json.equals("")) {
            return new ArrayList<String>();
        } else {
            Type type = new TypeToken<ArrayList<String>>() {
            }.getType();
            return gson.fromJson(json, type);
        }
    }

    @Override
    public boolean onSupportNavigateUp() {
        //code it to launch an intent to the activity you want
        finish();
        return true;
    }

    @Override
    public void onClick(String value, int position) {

       /* String[] _value = value.split(",");
        edServerName.setText(_value[0]);
        edServerPort.setText(_value[1]);
        sPosition = position;
        btAddServerInfo.setText("UPDATE");
        isEdit = true;*/
    }

    @Override
    public void update(Observable o, Object arg) {
        Intent intent = (Intent) arg;
        Bundle b1 = intent.getExtras();
        final String messageName = b1.getString("messageName");
        final String messageData = b1.getString("messageData");
        String message = "";
        switch (messageName) {
            case Globals.OBSERVABLE_MESSAGE_LANGUAGE_CHANGED:
                SettingsActivity.this.recreate();

        }

    }
    /*private class ServerTestAsyncTask extends AsyncTask<Void, Void, Void> {

        public User user;
        @Override
        protected void onPreExecute() {
            progressDialog= new ProgressDialog(ServerActivity.this);
            progressDialog.setMessage("Please wait...");
            progressDialog.show();
            super.onPreExecute();
        }

        protected Void doInBackground(Void... args) {
            // Parse response data
            String url = server + ":"+ port + "/api/List/JourneyPlan/pull";
            String userString = JsonWebService.getJSON(url, 5000);
            try {
                if(userString != null){
                    user = new User(new JSONObject(userString));
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }

            return null;
        }

        protected void onPostExecute(Void result) {
            if (progressDialog.isShowing())
                progressDialog.dismiss();
            if(Globals.lastWsReturnCode == 200 || Globals.lastWsReturnCode == 201){
                if(user != null){
                    if(!user.getRemoved()){
                        Toast.makeText(ServerActivity.this, getString(R.string.toast_server_connect), Toast.LENGTH_LONG).show();
                    }
                }
            } else if(Globals.lastWsReturnCode == 401){
                Toast.makeText(ServerActivity.this, getString(R.string.toast_server_connect), Toast.LENGTH_LONG).show();

            } else if(Globals.lastWsReturnCode == 404){
                Toast.makeText(ServerActivity.this,getString(R.string.toast_server_unreach), Toast.LENGTH_LONG).show();
            }

            *//*if(Globals.lastWsReturnCode == 401){
                Toast.makeText(ServerActivity.this, "Server Connected!", Toast.LENGTH_LONG).show();
            } else {

                Toast.makeText(ServerActivity.this, "Server Unreachable!", Toast.LENGTH_LONG).show();
            }*//*

            //move activity
            *//*final Handler handler = new Handler();
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    if(Globals.lastWsReturnCode == 401){
                        Toast.makeText(ServerActivity.this, "Server Connected!", Toast.LENGTH_LONG).show();
                    }
                }
            }, 5000);*//*

            super.onPostExecute(result);
        }
    }*/
}

/*class serverInfoAdapter extends ArrayAdapter<String> {
    private final Activity context;
    private ArrayList<String> serverInfo;
    private SharedPref pref;
    private OnItemClick mCallback;

    public serverInfoAdapter(Activity context, ArrayList<String> serverInfo, OnItemClick listener) {
        super(context, R.layout.server_info_row, serverInfo);
        // TODO Auto-generated constructor stub

        this.context = context;
        this.serverInfo = serverInfo;
        pref = new SharedPref(context);
        this.mCallback = listener;
    }

    public View getView(final int position, View view, ViewGroup parent) {
        LayoutInflater inflater = context.getLayoutInflater();
        View rowView = inflater.inflate(R.layout.server_info_row, null, true);

        TextView tvServerName = (TextView) rowView.findViewById(R.id.tvServerInfo);
        ImageButton btRemove = (ImageButton) rowView.findViewById(R.id.btnRemoveServerEntry);
        ImageButton btEdit = (ImageButton) rowView.findViewById(R.id.btnEditServerEntry);
        //TextView tvServerName= (TextView) rowView.findViewById(R.id.);
        RadioButton rbServerInfo = (RadioButton) rowView.findViewById(R.id.rbServerInfo);
        tvServerName.setText(serverInfo.get(position));
        String[] serverTxt = serverInfo.get(position).split(",");
        rbServerInfo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String[] _server = serverInfo.get(position).split(",");
                if (_server[0].equals(Globals.wsDomainName) && _server[1].equals(Globals.wsPort)) {

                } else {
                    if (serverInfo.get(position).equals("")) {
                        Snackbar.make(v, context.getString(R.string.err_invalid_server_info), Snackbar.LENGTH_LONG)
                                .setAction("Action", null).show();
                    } else {
                        new AlertDialog.Builder(context)
                                .setTitle(context.getResources().getString(R.string.confirmation))
                                .setMessage(context.getString(R.string.want_to_use_this_server))
                                .setIcon(android.R.drawable.ic_dialog_alert)
                                .setPositiveButton(R.string.btn_ok, new DialogInterface.OnClickListener() {
                                    public void onClick(DialogInterface dialog, int whichButton) {
                                        String[] server = serverInfo.get(position).split(",");
                                        Globals.wsDomainName = server[0];
                                        Globals.wsPort = server[1];
                                        pref.putString(PREFS_KEY_SELECTED_SERVER, server[0]);
                                        pref.putString(PREFS_KEY_SELECTED_PORT, server[1]);
                                        pref.putBool(PREFS_KEY_CUSTOM_SERVER, true);
                                        Globals.setDomain();
                                        Toast.makeText(context, context.getString(R.string.successfully_activated), Toast.LENGTH_SHORT).show();
                                        notifyDataSetChanged();
                                *//*ServerActivity.sServerName = server[0];
                                ServerActivity.sServerPort = server[1];*//*

                                    }
                                })
                                .setNegativeButton(R.string.btn_cancel, new DialogInterface.OnClickListener() {
                                    public void onClick(DialogInterface dialog, int whichButton) {
                                        notifyDataSetChanged();
                                    }
                                }).show();
                    }
                }

            }
        });
        btEdit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String[] _serverTxt = serverInfo.get(position).split(",");
                if (_serverTxt[0].equals(Globals.wsDomainName) && _serverTxt[1].equals(Globals.wsPort)) {
                    Toast.makeText(context, context.getString(R.string.err_edit_server_config), Toast.LENGTH_SHORT).show();
                } else {
                    mCallback.onClick(serverInfo.get(position), position);
                }
            }
        });
        btRemove.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String[] _server = serverInfo.get(position).split(",");
                if (_server[0].equals(Globals.wsDomainName) && _server[1].equals(Globals.wsPort)) {
                    Toast.makeText(context, context.getString(R.string.err_unable_remove_active_server), Toast.LENGTH_SHORT).show();
                } else {
                    new AlertDialog.Builder(context)
                            .setTitle(context.getString(R.string.confirmation))
                            .setMessage(context.getString(R.string.want_to_remove_server))
                            .setIcon(android.R.drawable.ic_dialog_alert)
                            .setPositiveButton(R.string.btn_ok, new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int whichButton) {
                                    serverInfo.remove(position);
                                    notifyDataSetChanged();
                                    saveArrayList(serverInfo);
                                }
                            })
                            .setNegativeButton(R.string.btn_cancel, null).show();
                }
            }
        });

        if (serverTxt[0].equals(Globals.wsDomainName) && serverTxt[1].equals(Globals.wsPort)) {
            rbServerInfo.setChecked(true);
        }

        return rowView;
    }

    ;

    private void saveArrayList(ArrayList<String> list) {
        Gson gson = new Gson();
        String json = gson.toJson(list);
        pref.putString(PREFS_STRING_DIVIDER, json);
    }
}*/
