package com.app.ps19.scimapp;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.os.AsyncTask;

import com.app.ps19.scimapp.Shared.DBHandler;
import com.app.ps19.scimapp.Shared.ListMap;
import com.app.ps19.scimapp.classes.version.VersionInfo;
import com.google.android.material.snackbar.Snackbar;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.RadioButton;
import android.widget.TextView;
import android.widget.Toast;

import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.Shared.JsonWebService;
import com.app.ps19.scimapp.Shared.OnItemClick;
import com.app.ps19.scimapp.Shared.SharedPref;
import com.app.ps19.scimapp.classes.User;
import com.google.gson.Gson;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import static com.app.ps19.scimapp.Shared.Globals.PREFS_KEY_CUSTOM_SERVER;
import static com.app.ps19.scimapp.Shared.Globals.PREFS_KEY_SELECTED_PORT;
import static com.app.ps19.scimapp.Shared.Globals.PREFS_KEY_SELECTED_SERVER;
import static com.app.ps19.scimapp.Shared.Globals.PREFS_KEY_SELECTED_SERVER_DISPLAY_NAME;
import static com.app.ps19.scimapp.Shared.Globals.PREFS_KEY_SERVER;
import static com.app.ps19.scimapp.Shared.Globals.PREFS_STRING_DIVIDER;
import static com.app.ps19.scimapp.Shared.Globals.getVersionInfo;
import static com.app.ps19.scimapp.Shared.Globals.getVersionUrl;
import static com.app.ps19.scimapp.Shared.Globals.setVersionInfo;
import static com.app.ps19.scimapp.Shared.Utilities.isNetworkAvailable;

class endPointAdapter extends ArrayAdapter<String> {
    private final Activity context;
    private ArrayList<String> serverInfo;
    private SharedPref pref;
    private OnItemClick mCallback;
    public String server;
    public String port;
    public String serverString;
    ImageView ivStatus;
    DialogInterface dialog;
    ProgressDialog progressDialog;

    public endPointAdapter(Activity context, ArrayList<String> serverInfo, OnItemClick listener) {
        super(context, R.layout.server_info_row, serverInfo);
        // TODO Auto-generated constructor stub

        this.context = context;
        this.serverInfo = serverInfo;
        pref = new SharedPref(context);
        this.mCallback = listener;
    }

    public View getView(final int position, View view, ViewGroup parent) {
        LayoutInflater inflater = context.getLayoutInflater();
        View rowView = inflater.inflate(R.layout.end_point_row, null, true);

        TextView tvDisplayName = (TextView) rowView.findViewById(R.id.tv_display_name);
        TextView tvServerName = (TextView) rowView.findViewById(R.id.tv_server_name);
        TextView tvServerPort = (TextView) rowView.findViewById(R.id.tv_server_port);

        Button btRemove = (Button) rowView.findViewById(R.id.btn_remove_server);
        Button btEdit = (Button) rowView.findViewById(R.id.btn_edit_server);

        RadioButton rbServerInfo = (RadioButton) rowView.findViewById(R.id.rb_server_selection);
        ivStatus = null;
        String[] info = serverInfo.get(position).split(PREFS_STRING_DIVIDER);
        tvDisplayName.setText(info[0]);
        tvServerName.setText(info[1]);
        tvServerPort.setText(info[2]);
        server = info[1];
        port = info[2];
        if (info[1].equals(Globals.wsDomainName)) {
            rbServerInfo.setChecked(true);
        }

        rbServerInfo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String[] _server = serverInfo.get(position).split(PREFS_STRING_DIVIDER);
                if (_server[1].equals(Globals.wsDomainName) && _server[2].equals(Globals.wsPort)) {

                } else {
                    if (serverInfo.get(position).equals("")) {
                        Snackbar.make(v, context.getString(R.string.err_invalid_server_info), Snackbar.LENGTH_LONG)
                                .setAction("Action", null).show();
                    } else {
                        serverString = serverInfo.get(position);
                        openDialog();
                    }
                }

            }
        });
        btEdit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String[] _serverTxt = serverInfo.get(position).split(PREFS_STRING_DIVIDER);
                if (_serverTxt[1].equals(Globals.wsDomainName) && _serverTxt[2].equals(Globals.wsPort)) {
                    Toast.makeText(context, context.getString(R.string.err_edit_server_config), Toast.LENGTH_SHORT).show();
                } else {
                    mCallback.onClick(serverInfo.get(position), position);
                }
            }
        });
        btRemove.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String[] _server = serverInfo.get(position).split(PREFS_STRING_DIVIDER);
                if (_server[1].equals(Globals.wsDomainName) && _server[2].equals(Globals.wsPort)) {
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

        if (info[0].equals(Globals.wsDomainName) && info[1].equals(Globals.wsPort)) {
            rbServerInfo.setChecked(true);
        }

        return rowView;
    }

    ;

    private void saveArrayList(ArrayList<String> list) {
        Gson gson = new Gson();
        String json = gson.toJson(list);
        pref.putString(PREFS_KEY_SERVER, json);
    }

    private class ServerTestAsyncTask extends AsyncTask<Void, Void, Void> {
        public User user;

        @Override
        protected void onPreExecute() {
            progressDialog = new ProgressDialog(context);
            progressDialog.setMessage(context.getString(R.string.dialog_wait_title));
            progressDialog.show();
            Globals.lastWsReturnCode = 0;
            super.onPreExecute();
        }

        protected Void doInBackground(Void... args) {
            String[] info = serverString.split(PREFS_STRING_DIVIDER);
            // Parse response data
            JSONArray jaUser = new JSONArray();
            String versionData;
            versionData = JsonWebService.getJSON(getVersionUrl(info[1], info[2], "https"), 5000);
            if(versionData != null){
                pref.putString(info[1], "https");
            } else {
                versionData = JsonWebService.getJSON(getVersionUrl(info[1], info[2], "http"), 5000);
                if(versionData != null){
                    pref.putString(info[1], "http");
                }
            }
            if(versionData!=null){
                try {
                    VersionInfo version = new VersionInfo(new JSONObject(versionData));
                    setVersionInfo(version);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
            //String url = "http://" + info[1] + ":"+ info[2] + "/api/List/JourneyPlan/pull";
            /*String userString = JsonWebService.getJSON(getPingAddress(info[1], info[2]), 5000);
            try {
                if (userString != null) {
                    jaUser = new JSONArray(userString);
                    user = new User(jaUser.getJSONObject(0));
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }*/

            return null;
        }

        protected void onPostExecute(Void result) {
            // openDialog();
            if (progressDialog.isShowing())
                progressDialog.dismiss();

            if (Globals.lastWsReturnCode == 200 || Globals.lastWsReturnCode == 201) {

                if(getVersionInfo()!=null){
                    if(!getVersionInfo().getVersion().isBypassVersionCheck()
                            && getVersionInfo().getVersion().getMobileAppVer()!=null
                            && !getVersionInfo().getVersion().getMobileAppVer().equals("null")){

                        float fromServer = Float.parseFloat(getVersionInfo().getVersion().getMobileAppVer());
                        float currentVer = Float.parseFloat(BuildConfig.VERSION_NAME);

                        if(currentVer>=fromServer){
                            dialog.dismiss();
                            updateServer();
                        } else {
                            Toast.makeText(context, "Your App version is incompatible with this server\n Please update!", Toast.LENGTH_LONG).show();
                        }
                    } else {
                        dialog.dismiss();
                        updateServer();
                    }
                }
                /*if (user != null) {
                    if (!user.getRemoved()) {
                        dialog.dismiss();
                        updateServer();
                    }
                }*/
            } else if (Globals.lastWsReturnCode == 401) {

                if(getVersionInfo()!=null){
                    if(!getVersionInfo().getVersion().isBypassVersionCheck()
                            && getVersionInfo().getVersion().getMobileAppVer()!=null
                            && !getVersionInfo().getVersion().getMobileAppVer().equals("null")){
                        float fromServer = Float.parseFloat(getVersionInfo().getVersion().getMobileAppVer());
                        float currentVer = Float.parseFloat(BuildConfig.VERSION_NAME);

                        if(currentVer>=fromServer){
                            dialog.dismiss();
                            updateServer();
                        } else {
                            Toast.makeText(context, "Your App version is incompatible with this server\n Please update!", Toast.LENGTH_LONG).show();
                        }
                    } else {
                        dialog.dismiss();
                        updateServer();
                    }
                }
            } else if (Globals.lastWsReturnCode == 404) {
                Toast.makeText(context, context.getString(R.string.msg_timps_running_server), Toast.LENGTH_LONG).show();
            } else if (Globals.lastWsReturnCode == 0) {
                Toast.makeText(context, context.getString(R.string.msg_server_unreach), Toast.LENGTH_LONG).show();
            }
        }
    }

    public void updateServer() {
        String[] server = serverString.split(PREFS_STRING_DIVIDER);
        Globals.wsDomainName = server[1];
        Globals.wsPort = server[2];
        pref.putString(PREFS_KEY_SELECTED_SERVER_DISPLAY_NAME, server[0]);
        pref.putString(PREFS_KEY_SELECTED_SERVER, server[1]);
        pref.putString(PREFS_KEY_SELECTED_PORT, server[2]);
        pref.putBool(PREFS_KEY_CUSTOM_SERVER, true);
        Globals.setDomain();
        Toast.makeText(context, "Activated \n"+ "Contract: "+ getVersionInfo().getDisplayData().getDisplayName() + "\n"+"Application: "+getVersionInfo().getVersion().getApplicationType(), Toast.LENGTH_LONG).show();
        //Toast.makeText(context, context.getString(R.string.successfully_activated), Toast.LENGTH_SHORT).show();
        notifyDataSetChanged();
        DBHandler db = Globals.db;
        ListMap.clear();
        db.clearAllData();
      /*  // Clearing all data before switching server
        DBHandler db = new DBHandler(Globals.getDBContext());
        db.clearAllData();
        db.close();
        String packageName = context.getBaseContext().getPackageName();
        Intent i = context.getBaseContext().getPackageManager().
                getLaunchIntentForPackage(packageName);
        i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(i);*/

    }

    private void openDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        builder.setTitle(context.getResources().getString(R.string.confirmation))
                .setMessage(context.getString(R.string.want_to_use_this_server))
                .setIcon(android.R.drawable.ic_dialog_alert);
        builder.setPositiveButton(R.string.btn_ok, null);
        builder.setNegativeButton(R.string.btn_cancel, null);
        builder.setCancelable(false);

        final AlertDialog alertDialog = builder.create();

        alertDialog.setOnShowListener(new DialogInterface.OnShowListener() {
            @Override
            public void onShow(final DialogInterface _dialog) {
                Button positiveButton = alertDialog.getButton(AlertDialog.BUTTON_POSITIVE);
                positiveButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        if (isNetworkAvailable(context)) {
                            dialog = null;
                            dialog = _dialog;
                            new ServerTestAsyncTask().execute();
                        } else {
                            Toast.makeText(context, context.getString(R.string.internet_unavail), Toast.LENGTH_LONG).show();
                        }

                    }
                });

                Button negativeButton = alertDialog.getButton(AlertDialog.BUTTON_NEGATIVE);
                negativeButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        //CLOSE THE DIALOG
                        notifyDataSetChanged();
                        _dialog.dismiss();
                    }
                });
            }
        });

        alertDialog.show();
    }
}