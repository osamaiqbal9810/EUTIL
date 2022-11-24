package com.app.ps19.hosapp;

import android.app.Activity;
import android.app.ActivityManager;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;

import com.google.android.material.snackbar.Snackbar;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import androidx.appcompat.widget.Toolbar;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ListView;
import android.widget.RadioButton;
import android.widget.TextView;
import android.widget.Toast;

import com.app.ps19.hosapp.Shared.DBHandler;
import com.app.ps19.hosapp.Shared.Globals;
import com.app.ps19.hosapp.Shared.JsonWebService;
import com.app.ps19.hosapp.Shared.ObservableObject;
import com.app.ps19.hosapp.Shared.OnItemClick;
import com.app.ps19.hosapp.Shared.SharedPref;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Observable;
import java.util.Observer;

import static com.app.ps19.hosapp.Shared.Globals.PREFS_KEY_CUSTOM_SERVER;
import static com.app.ps19.hosapp.Shared.Globals.PREFS_KEY_IS_PATCH_PERFORMED;
import static com.app.ps19.hosapp.Shared.Globals.PREFS_KEY_SELECTED_PORT;
import static com.app.ps19.hosapp.Shared.Globals.PREFS_KEY_SELECTED_SERVER;
import static com.app.ps19.hosapp.Shared.Globals.PREFS_KEY_SELECTED_SERVER_DISPLAY_NAME;
import static com.app.ps19.hosapp.Shared.Globals.PREFS_KEY_SERVER;
import static com.app.ps19.hosapp.Shared.Globals.PREFS_STRING_DIVIDER;

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
    serverInfoAdapter aServerInfoAdapter;
    ArrayList<String> serverInfoList = new ArrayList<String>();
    public static String sServerName;
    public static String sServerPort;
    public Boolean isEdit = false;
    int sPosition;
    SharedPref pref;

    ProgressDialog progressDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Globals.checkLanguage(this);
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
                    String conServer = "TIMPS" + PREFS_STRING_DIVIDER + Globals.wsDomainName + PREFS_STRING_DIVIDER + Globals.wsPort;
                    serverInfoList.add(conServer);
                    pref.putString("TIMPS", PREFS_KEY_SELECTED_SERVER_DISPLAY_NAME);
                    //serverInfoList.add("Second" + PREFS_KEY_DIVIDER +"116.58.29.107" + PREFS_KEY_DIVIDER + "3389");
                    saveArrayList(serverInfoList, PREFS_KEY_SERVER);
                    pref.putBool(PREFS_KEY_IS_PATCH_PERFORMED, true);
                }
            }
        }


        //lvServerEntries = (ListView) findViewById(R.id.lvServerInfo);
        if (!Globals.wsDomainName.equals("") && getArrayList(PREFS_KEY_SERVER).size() == 0) {
            String conServer = "TIMPS" + PREFS_STRING_DIVIDER + Globals.wsDomainName + PREFS_STRING_DIVIDER + Globals.wsPort;
            pref.putString("TIMPS", PREFS_KEY_SELECTED_SERVER_DISPLAY_NAME);
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
            tvSelectedServer.setText("TIMPS");
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
                        .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int whichButton) {
                                DBHandler db = new DBHandler(getApplicationContext());
                                db.clearAllData();
                                db.close();
                                Toast.makeText(SettingsActivity.this, getString(R.string.cleared_all_data), Toast.LENGTH_SHORT).show();
                                Intent i = getBaseContext().getPackageManager().
                                        getLaunchIntentForPackage(getBaseContext().getPackageName());
                                i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                                i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                startActivity(i);
                            }
                        })
                        .setNegativeButton(android.R.string.no, null).show();
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

class serverInfoAdapter extends ArrayAdapter<String> {
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
                                .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
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
                                /*ServerActivity.sServerName = server[0];
                                ServerActivity.sServerPort = server[1];*/

                                    }
                                })
                                .setNegativeButton(android.R.string.no, new DialogInterface.OnClickListener() {
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
                            .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int whichButton) {
                                    serverInfo.remove(position);
                                    notifyDataSetChanged();
                                    saveArrayList(serverInfo);
                                }
                            })
                            .setNegativeButton(android.R.string.no, null).show();
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
}
