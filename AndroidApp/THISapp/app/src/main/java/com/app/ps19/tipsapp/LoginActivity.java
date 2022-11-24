package com.app.ps19.tipsapp;

import android.Manifest;
import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.graphics.Color;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.IBinder;
import android.preference.PreferenceManager;
import androidx.annotation.NonNull;

import com.app.ps19.tipsapp.Shared.DataSyncProcessEx;
import com.app.ps19.tipsapp.location.LocationUpdatesService;
import com.app.ps19.tipsapp.Shared.Utilities;
import com.google.android.material.snackbar.Snackbar;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.appcompat.app.AppCompatActivity;
import android.app.LoaderManager.LoaderCallbacks;

import android.content.CursorLoader;
import android.content.Loader;
import android.database.Cursor;
import android.net.Uri;
import android.os.AsyncTask;

import android.os.Build;
import android.os.Bundle;
import android.provider.ContactsContract;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import android.text.TextUtils;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.inputmethod.EditorInfo;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.PopupMenu;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.Shared.JsonWebService;
import com.app.ps19.tipsapp.Shared.ObservableObject;
import com.app.ps19.tipsapp.Shared.SharedPref;
import com.app.ps19.tipsapp.classes.User;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Observable;
import java.util.Observer;

import static android.Manifest.permission.READ_CONTACTS;
import static com.app.ps19.tipsapp.Shared.Globals.PREFS_KEY_CUSTOM_SERVER;
import static com.app.ps19.tipsapp.Shared.Globals.PREFS_KEY_SELECTED_PORT;
import static com.app.ps19.tipsapp.Shared.Globals.PREFS_KEY_SELECTED_SERVER;
import static com.app.ps19.tipsapp.Shared.Globals.dayStarted;
import static com.app.ps19.tipsapp.Shared.Globals.getLanguageSettingIndex;
import static com.app.ps19.tipsapp.Shared.Globals.getPingAddress;
import static com.app.ps19.tipsapp.Shared.Globals.initConfigs;
import static com.app.ps19.tipsapp.Shared.Globals.isMaintainerRole;
import static com.app.ps19.tipsapp.Shared.Globals.setLocale;
import static com.app.ps19.tipsapp.Shared.Globals.wsDomainName;
import static com.app.ps19.tipsapp.Shared.Globals.wsPort;
import static com.app.ps19.tipsapp.Shared.Globals.user;

/**
 * A login screen that offers login via email/password.
 */
public class LoginActivity extends AppCompatActivity implements Observer, LoaderCallbacks<Cursor>, PopupMenu.OnMenuItemClickListener {

    private static final String TAG = "LoginActivity";
    // The BroadcastReceiver used to listen from broadcasts from the service.
    private MyReceiver myReceiver;

    // A reference to the service used to get location updates.
    @SuppressLint("StaticFieldLeak")
    private static LocationUpdatesService mService = null;

    // Tracks the bound state of the service.
    private boolean mBound = false;

    // Monitors the state of the connection to the service.
    private final ServiceConnection mServiceConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            if (mService == null) {
                LocationUpdatesService.LocalBinder binder = (LocationUpdatesService.LocalBinder) service;
                mService = binder.getService();

                if (!LocationUpdatesService.canGetLocation()) {
                    Utilities.showSettingsAlert(LoginActivity.this);
                }

                try {
                    mService.requestLocationUpdates();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            else{
                mService.requestLocationUpdates();
            }

            mBound = true;
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            mService.removeLocationUpdates();
            mService = null;
            mBound = false;
        }
    };

//    @Override
//    public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, String key) {
//
//    }

    /**
     * Receiver for broadcasts sent by {@link LocationUpdatesService}.
     */
    private class MyReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            Location mLocation = intent.getParcelableExtra(LocationUpdatesService.EXTRA_LOCATION);
            if (mLocation != null) {

                if (!LocationUpdatesService.canGetLocation()) {
                    Utilities.showSettingsAlert(LoginActivity.this);
                }
            }
        }
    }
    /**
     * Returns the current state of the permissions needed.
     */
    private boolean checkPermissions() {
        return PackageManager.PERMISSION_GRANTED == ActivityCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_FINE_LOCATION) &&
                PackageManager.PERMISSION_GRANTED == ActivityCompat.checkSelfPermission(this,
                        Manifest.permission.ACCESS_COARSE_LOCATION) /*&&
                PackageManager.PERMISSION_GRANTED == ActivityCompat.checkSelfPermission(this,
                        Manifest.permission.ACCESS_BACKGROUND_LOCATION)*/;
    }

    public static boolean hasPermissions(Context context, String... permissions) {
        if (context != null && permissions != null) {
            for (String permission : permissions) {
                if (ActivityCompat.checkSelfPermission(context, permission) != PackageManager.PERMISSION_GRANTED) {
                    return false;
                }
            }
        }
        return true;
    }

    private void requestPermissions() {

        int PERMISSION_ALL = 1;
        String[] PERMISSIONS = {
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.ACCESS_COARSE_LOCATION,
/*                Manifest.permission.ACCESS_BACKGROUND_LOCATION,
                Manifest.permission.ACTIVITY_RECOGNITION*/
        };

        if (!hasPermissions(this, PERMISSIONS)) {
            ActivityCompat.requestPermissions(this, PERMISSIONS, PERMISSION_ALL);
        }


        boolean shouldProvideRationale =
                ActivityCompat.shouldShowRequestPermissionRationale(this,
                        Manifest.permission.ACCESS_FINE_LOCATION);

/*        if (!shouldProvideRationale) {
            shouldProvideRationale =
                    ActivityCompat.shouldShowRequestPermissionRationale(this,
                            Manifest.permission.ACCESS_BACKGROUND_LOCATION);
        }*/
        // Provide an additional rationale to the user. This would happen if the user denied the
        // request previously, but didn't check the "Don't ask again" checkbox.
        if (shouldProvideRationale) {
            Log.i(TAG, "Displaying permission rationale to provide additional context.");

        } else {
            Log.i(TAG, "Requesting permission");

            ActivityCompat.requestPermissions(this, PERMISSIONS, PERMISSION_ALL);
        }
    }

    /**
     * Id to identity READ_CONTACTS permission request.
     */
    private static final int REQUEST_READ_CONTACTS = 0;

    static {
        AppCompatDelegate.setCompatVectorFromResourcesEnabled(true);
    }

    /**
     * A dummy authentication store containing known user names and passwords.
     * TODO: remove after connecting to a real authentication system.
     */
    private static final String[] DUMMY_CREDENTIALS = new String[]{
            "foo@example.com:hello", "johndoe@example.com:admin"
    };
    /**
     * Keep track of the login task to ensure we can cancel it if requested.
     */
    private UserLoginTask mAuthTask = null;

    // UI references.
    private AutoCompleteTextView mEmailView;
    private EditText mPasswordView;
    private View mProgressView;
    private View mLoginFormView;
    private LinearLayout userFormLayout;
    private LinearLayout userProceedLayout;
    private LinearLayout loginLayout;
    private Button logOutBtn;
    private Button proceedBtn;
    private ImageView welUserImg;
    private TextView welUserTxt;
    private TextView tvVersion;
    private ImageButton imgBtnSetting;
    ProgressDialog progressDialog;
    // private ImageButton serverInfo;
    SharedPref pref;
    Boolean isProceed = false;
    private Button btnSettings;
    private Button btnLanguage;
    boolean isServiceConnected = false;
    DataSyncProcessEx dataSyncProcessEx=null;
    Intent dashIntent;
    ProgressDialog dialog =null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setLocale(this);
/*
        String languageToLoad  = "ur-rPK"; // your language
        Locale locale = new Locale(languageToLoad);
        Locale.setDefault(locale);
        Configuration config = new Configuration();
        config.locale = locale;
        getBaseContext().getResources().updateConfiguration(config,
                getBaseContext().getResources().getDisplayMetrics());
*/
        //Globals.dbContext=getApplicationContext();
        Globals.setDbContext(getApplicationContext());
        if(Globals.dataSyncProcessEx ==null){
            StartDataSyncService();
        }

        Globals.checkLanguage(this);
        Globals.loginContext = this;
        Globals.geocoder = new Geocoder(LoginActivity.this.getApplicationContext(), Locale.getDefault());
        //For initializing configs depends on the App
        initConfigs();

        //setContentView(R.layout.activity_login);
        setContentView(R.layout.login_new_theme);
        dialog=new ProgressDialog(this);
        pref = new SharedPref(this);
        if (pref.getBoolean(PREFS_KEY_CUSTOM_SERVER)) {
            wsDomainName = pref.getString(PREFS_KEY_SELECTED_SERVER);
            wsPort = pref.getString(PREFS_KEY_SELECTED_PORT);
            Globals.setDomain();
        }
        // Set up the login form.
        mEmailView = (AutoCompleteTextView) findViewById(R.id.email);
        //populateAutoComplete();
        //Load LogIn Data if available
        Globals.loadLoginData(LoginActivity.this);
        //Retrieving last known location
        Globals.lastKnownLocation = Globals.retrieveLastLocFromPref(pref);
            /*Intent intent = new Intent(LoginActivity.this, IssuesActivity.class);
            startActivity(intent);*/
        // serverInfo = (ImageButton) findViewById(R.id.btServerSettings);
        welUserTxt = (TextView) findViewById(R.id.welcomeTxt);
        tvVersion = (TextView) findViewById(R.id.versionTxt);
        welUserImg = (ImageView) findViewById(R.id.welcomeUserImg);
        proceedBtn = (Button) findViewById(R.id.proceedBtn);
        logOutBtn = (Button) findViewById(R.id.logOutBtn);
        userFormLayout = (LinearLayout) findViewById(R.id.email_login_form);
        userProceedLayout = (LinearLayout) findViewById(R.id.loggedInLayout);
        loginLayout = (LinearLayout) findViewById(R.id.login_for_layout);
        ObservableObject.getInstance().addObserver(this);
        btnLanguage = findViewById(R.id.btn_language);
        btnSettings = findViewById(R.id.btn_settings);
        dashIntent = new Intent(LoginActivity.this, DashboardActivity.class);
        //dashIntent = new Intent(LoginActivity.this, MainActivity.class);
        btnLanguage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                isProceed = true;
                showChangeLangDialog();
            }
        });
        btnSettings.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (Globals.userEmail.equals("")) {
                    Intent intent = new Intent(LoginActivity.this, SettingsActivity.class);
                    startActivity(intent);
                } else {

                    // testLocationService();
                    Snackbar.make(getWindow().getDecorView().getRootView(), getString(R.string.log_out_first_server_info), Snackbar.LENGTH_LONG)
                            .setAction("Action", null).show();
                }

            }
        });
        imgBtnSetting = findViewById(R.id.imgBtnSettin_la);
        imgBtnSetting.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                //startService(new Intent(getApplication().getBaseContext(), BackgroundLocationUpdateService.class));
                showMenu(v);
            }
        });
        mPasswordView = (EditText) findViewById(R.id.password);
        mPasswordView.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView textView, int id, KeyEvent keyEvent) {
                if (id == EditorInfo.IME_ACTION_DONE || id == EditorInfo.IME_NULL) {
                    attemptLoginEx();
                    return true;
                }
                return false;
            }
        });
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            mEmailView.setCompoundDrawablesRelativeWithIntrinsicBounds(R.drawable.ic_person_outline_black_24dp, 0, 0, 0);
            mPasswordView.setCompoundDrawablesRelativeWithIntrinsicBounds(R.drawable.ic_lock_outline_black_24dp, 0, 0, 0);
        } else {
            mEmailView.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_person_outline_black_24dp, 0, 0, 0);
            mPasswordView.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_lock_outline_black_24dp, 0, 0, 0);
        }
        checkAndRequestPermissions();

        //-------------------GPS Code--------------
        if (!checkPermissions()) {
            requestPermissions();
        }
        myReceiver = new MyReceiver();


        //--------------------END-------------------

        try {
            PackageInfo pInfo = this.getPackageManager().getPackageInfo(getPackageName(), 0);
            String version = pInfo.versionName;
            tvVersion.setText(getString(R.string.login_version_title) + " " + version);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        tvVersion.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View v) {
                // TODO Auto-generated method stub
/*
                if (Globals.userEmail.equals("")) {
                    Intent intent = new Intent(LoginActivity.this, ServerActivity.class);
                    startActivity(intent);
                } else {
                    showChangeLangDialog();
                    */
/*Snackbar.make(v, getString(R.string.log_out_first_server_info), Snackbar.LENGTH_LONG)
                            .setAction("Action", null).show();*//*

                }
*/
                return true;
            }
        });

        mEmailView.setHintTextColor(Color.WHITE);
        mPasswordView.setHintTextColor(Color.WHITE);

        Button mEmailSignInButton = (Button) findViewById(R.id.email_sign_in_button);
        mEmailSignInButton.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                if(isNetworkAvailable()){
                    //new ServerAsyncTask().execute();
                    attemptLoginEx();
                } else {
                    Toast.makeText(LoginActivity.this, getResources().getText(R.string.err_internet_not_available)
                            , Toast.LENGTH_SHORT).show();
                }

            }
        });

        mLoginFormView = findViewById(R.id.login_form);
        mProgressView = findViewById(R.id.login_progress);
        if (!Globals.userEmail.equals("")) {
            //User Already Logged In
            userFormLayout.setVisibility(LinearLayout.INVISIBLE);
            userProceedLayout.setVisibility(LinearLayout.VISIBLE);
            welUserTxt.setText(getString(R.string.welcome_txt) + " " + Globals.userName);
            //setUserImage(welUserImg);
        } else {
            //User Not Logged In
            userFormLayout.setVisibility(LinearLayout.VISIBLE);
            userProceedLayout.setVisibility(LinearLayout.INVISIBLE);
        }
        proceedBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                isProceed = true;
                if(isNetworkAvailable()){
                    new ServerAsyncTask().execute();
                } else {
                    isProceed = false;
                    openContinueDialog(getString(R.string.msg_offline_mode_internet_unavailable));
                    /*Toast.makeText(LoginActivity.this, getResources().getText(R.string.err_internet_not_available)
                            , Toast.LENGTH_SHORT).show();*/
                }
            }
        });
        logOutBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
               new tryLogout().execute();
            }
        });
        /*serverInfo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(Globals.userEmail.equals("")){
                    Intent intent = new Intent(LoginActivity.this, ServerActivity.class);
                    startActivity(intent);
                } else {
                    Snackbar.make(v, "Please LogOut first, to access server information !", Snackbar.LENGTH_LONG)
                            .setAction("Action", null).show();
                }

            }});*/

    }

    private void populateAutoComplete() {
        if (!mayRequestContacts()) {
            return;
        }

        getLoaderManager().initLoader(0, null, this);
    }

    private boolean mayRequestContacts() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            return true;
        }
        if (checkSelfPermission(READ_CONTACTS) == PackageManager.PERMISSION_GRANTED) {
            return true;
        }
        if (shouldShowRequestPermissionRationale(READ_CONTACTS)) {
            Snackbar.make(mEmailView, R.string.permission_rationale, Snackbar.LENGTH_INDEFINITE)
                    .setAction(android.R.string.ok, new View.OnClickListener() {
                        @Override
                        @TargetApi(Build.VERSION_CODES.M)
                        public void onClick(View v) {
                            requestPermissions(new String[]{READ_CONTACTS}, REQUEST_READ_CONTACTS);
                        }
                    });
        } else {
            requestPermissions(new String[]{READ_CONTACTS}, REQUEST_READ_CONTACTS);
        }
        return false;
    }
    public static final int REQUEST_ID_MULTIPLE_PERMISSIONS = 1;

    private  boolean checkAndRequestPermissions() {
        int camera = ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA);
        int storage = ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE);
        int loc = ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION);
        int loc2 = ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION);
        int rec = ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO);
        int internet = ContextCompat.checkSelfPermission(this, Manifest.permission.INTERNET);
        int write = ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE);
        int contacts = ContextCompat.checkSelfPermission(this, READ_CONTACTS);
        int read = 0;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
            read = ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE);
        }

        List<String> listPermissionsNeeded = new ArrayList<>();

        if (camera != PackageManager.PERMISSION_GRANTED) {
            listPermissionsNeeded.add(Manifest.permission.CAMERA);
        }
        if (storage != PackageManager.PERMISSION_GRANTED) {
            listPermissionsNeeded.add(Manifest.permission.WRITE_EXTERNAL_STORAGE);
        }
        if (loc2 != PackageManager.PERMISSION_GRANTED) {
            listPermissionsNeeded.add(Manifest.permission.ACCESS_FINE_LOCATION);
        }
        if (loc != PackageManager.PERMISSION_GRANTED) {
            listPermissionsNeeded.add(Manifest.permission.ACCESS_COARSE_LOCATION);
        }
        if (rec != PackageManager.PERMISSION_GRANTED) {
            listPermissionsNeeded.add(Manifest.permission.RECORD_AUDIO);
        }
        if (internet != PackageManager.PERMISSION_GRANTED) {
            listPermissionsNeeded.add(Manifest.permission.INTERNET);
        }
        if (write != PackageManager.PERMISSION_GRANTED) {
            listPermissionsNeeded.add(Manifest.permission.WRITE_EXTERNAL_STORAGE);
        }
        if (contacts != PackageManager.PERMISSION_GRANTED) {
            listPermissionsNeeded.add(READ_CONTACTS);
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
        if (read != PackageManager.PERMISSION_GRANTED) {
                listPermissionsNeeded.add(Manifest.permission.READ_EXTERNAL_STORAGE);
        }
        }
        if (!listPermissionsNeeded.isEmpty())
        {
            ActivityCompat.requestPermissions(this,listPermissionsNeeded.toArray
                    (new String[listPermissionsNeeded.size()]),REQUEST_ID_MULTIPLE_PERMISSIONS);
            return false;
        }
        return true;
    }

    /**
     * Callback received when a permissions request has been completed.
     */
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        if (requestCode == REQUEST_READ_CONTACTS) {
            if (grantResults.length == 1 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                populateAutoComplete();
            }
        }
    }


    /**
     * Attempts to sign in or register the account specified by the login form.
     * If there are form errors (invalid email, missing fields, etc.), the
     * errors are presented and no actual login attempt is made.
     */
    private void attemptLogin() {
        if (mAuthTask != null) {
            return;
        }

        // Reset errors.
        mEmailView.setError(null);
        mPasswordView.setError(null);

        // Store values at the time of the login attempt.
        String email = mEmailView.getText().toString();
        String password = mPasswordView.getText().toString();

        boolean cancel = false;
        View focusView = null;

        // Check for a valid password, if the user entered one.
        if (!TextUtils.isEmpty(password) && !isPasswordValid(password)) {
            mPasswordView.setError(getString(R.string.error_invalid_password));
            focusView = mPasswordView;
            cancel = true;
        }

        // Check for a valid email address.
        if (TextUtils.isEmpty(email)) {
            mEmailView.setError(getString(R.string.error_field_required));
            focusView = mEmailView;
            cancel = true;
        } else if (!isEmailValid(email)) {
            mEmailView.setError(getString(R.string.error_invalid_email));
            focusView = mEmailView;
            cancel = true;
        }

        if (cancel) {
            // There was an error; don't attempt login and focus the first
            // form field with an error.
            focusView.requestFocus();
        } else {
            // Show a progress spinner, and kick off a background task to
            // perform the user login attempt.
            showProgress(true);
            mAuthTask = new UserLoginTask(email, password);
            mAuthTask.execute((Void) null);
        }
    }

    private void attemptLoginEx() {

        // Reset errors.
        mEmailView.setError(null);
        mPasswordView.setError(null);

        // Store values at the time of the login attempt.
        final String email = mEmailView.getText().toString();
        final String password = mPasswordView.getText().toString();

        boolean cancel = false;
        View focusView = null;

        // Check for a valid password, if the user entered one.
        if (!TextUtils.isEmpty(password) && !isPasswordValid(password)) {
            mPasswordView.setError(getString(R.string.error_invalid_password));
            focusView = mPasswordView;
            cancel = true;
        }

        // Check for a valid email address.
        if (TextUtils.isEmpty(email)) {
            mEmailView.setError(getString(R.string.error_field_required));
            focusView = mEmailView;
            cancel = true;
        } else if (!isEmailValid(email)) {
            mEmailView.setError(getString(R.string.error_invalid_email));
            focusView = mEmailView;
            cancel = true;
        }

        if (cancel) {
            // There was an error; don't attempt login and focus the first
            // form field with an error.
            focusView.requestFocus();
        } else {
            new ServerAsyncTask().execute();
            }
    }
    public void onLoginRequest(){
        final String email = mEmailView.getText().toString();
        final String password = mPasswordView.getText().toString();
        // Show a progress spinner, and kick off a background task to
        // perform the user login attempt.
        showProgress(true);
        new Thread(new Runnable() {
            @Override
            public void run() {
                if (!Globals.isInternetAvailable(LoginActivity.this)) {
                    LoginActivity.this.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(LoginActivity.this, getResources().getText(R.string.err_internet_not_available)
                                    , Toast.LENGTH_SHORT).show();
                        }
                    });
                    //return;
                }
                if (Globals.webLogin(LoginActivity.this, Globals.orgCode, email, password)) {
                    JSONArray jaUser = new JSONArray();
                    //String url = "http://" + wsDomainName + ":"+ wsPort + "/api/List/user/300";
                    String userString = JsonWebService.getJSON(getPingAddress(wsDomainName, wsPort), 5000);
                    try {
                        if(userString != null){
                            jaUser = new JSONArray(userString);
                            JSONObject joUser = jaUser.getJSONObject(0);
                            user = new User(new JSONObject(joUser.getString("optParam1")));
                            //Decide if user is Maintainer or not
                            isMaintainerRole(user.getGroupId());
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    Log.i("attemptLoginEx", "WP Started:" + dayStarted);
                    //Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                    //Intent intent = new Intent(LoginActivity.this, DashboardActivity.class);
                    Utilities.makeDocumentsAvailable();
                    startActivity(dashIntent);

/*
                        new Thread(new Runnable() {
                            @Override
                            public void run() {
                                Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                                startActivity(intent);
                            }
                        }).start();*/
                } else {
                    if (isNetworkAvailable()) {
                        LoginActivity.this.runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                mEmailView.setError(getString(R.string.incorrect_user_info_error));
                                mPasswordView.setError(getString(R.string.error_incorrect_password));
                            }
                        });
                    }
                    if (!Globals.LOGIN_ERROR.equals("")) {
                        LoginActivity.this.runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                Toast.makeText(LoginActivity.this, Globals.LOGIN_ERROR, Toast.LENGTH_SHORT).show();
                            }
                        });

                    }
                }
                LoginActivity.this.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        showProgress(false);
                    }
                });

            }
        }).start();


    }

    private boolean isEmailValid(String email) {
        //TODO: Replace this with your own logic
        return email.contains("@");
    }

    private boolean isPasswordValid(String password) {
        //TODO: Replace this with your own logic
        return password.length() > 4;
    }

    /**
     * Shows the progress UI and hides the login form.
     */
    @TargetApi(Build.VERSION_CODES.HONEYCOMB_MR2)
    private void showProgress(final boolean show) {
        // On Honeycomb MR2 we have the ViewPropertyAnimator APIs, which allow
        // for very easy animations. If available, use these APIs to fade-in
        // the progress spinner.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB_MR2) {
            int shortAnimTime = getResources().getInteger(android.R.integer.config_shortAnimTime);

            mLoginFormView.setVisibility(show ? View.GONE : View.VISIBLE);
            mLoginFormView.animate().setDuration(shortAnimTime).alpha(
                    show ? 0 : 1).setListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationEnd(Animator animation) {
                    mLoginFormView.setVisibility(show ? View.GONE : View.VISIBLE);
                }
            });

            mProgressView.setVisibility(show ? View.VISIBLE : View.GONE);
            mProgressView.animate().setDuration(shortAnimTime).alpha(
                    show ? 1 : 0).setListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationEnd(Animator animation) {
                    mProgressView.setVisibility(show ? View.VISIBLE : View.GONE);
                }
            });
        } else {
            // The ViewPropertyAnimator APIs are not available, so simply show
            // and hide the relevant UI components.
            mProgressView.setVisibility(show ? View.VISIBLE : View.GONE);
            mLoginFormView.setVisibility(show ? View.GONE : View.VISIBLE);
        }
    }

    @Override
    public Loader<Cursor> onCreateLoader(int i, Bundle bundle) {
        return new CursorLoader(this,
                // Retrieve data rows for the device user's 'profile' contact.
                Uri.withAppendedPath(ContactsContract.Profile.CONTENT_URI,
                        ContactsContract.Contacts.Data.CONTENT_DIRECTORY), ProfileQuery.PROJECTION,

                // Select only email addresses.
                ContactsContract.Contacts.Data.MIMETYPE +
                        " = ?", new String[]{ContactsContract.CommonDataKinds.Email
                .CONTENT_ITEM_TYPE},

                // Show primary email addresses first. Note that there won't be
                // a primary email address if the user hasn't specified one.
                ContactsContract.Contacts.Data.IS_PRIMARY + " DESC");
    }

    @Override
    public void onLoadFinished(Loader<Cursor> cursorLoader, Cursor cursor) {
        List<String> emails = new ArrayList<>();
        cursor.moveToFirst();
        while (!cursor.isAfterLast()) {
            emails.add(cursor.getString(ProfileQuery.ADDRESS));
            cursor.moveToNext();
        }

        addEmailsToAutoComplete(emails);
    }

    @Override
    public void onLoaderReset(Loader<Cursor> cursorLoader) {

    }

    private void addEmailsToAutoComplete(List<String> emailAddressCollection) {
        //Create adapter to tell the AutoCompleteTextView what to show in its dropdown list.
        ArrayAdapter<String> adapter =
                new ArrayAdapter<>(LoginActivity.this,
                        android.R.layout.simple_dropdown_item_1line, emailAddressCollection);

        mEmailView.setAdapter(adapter);
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
                       // Globals.handleTokenStatus(DashboardActivity.this);
                        break;
                    case Globals.OBSERVABLE_MESSAGE_DATA_CHANGED:
                        //Toast.makeText(LoginActivity.this,"Data changed", Toast.LENGTH_LONG).show();
                        //message="Data Changed: (" + messageData +")";
                       /* if(Globals.changeItemList !=null){
                            if(Globals.changeItemList.size()==0){
                                //First Pull
                                loadInbox(DashboardActivity.this);
                                Globals.loadDayStatus(DashboardActivity.this);
                                refreshSOD();
                            }
                            for(String key:Globals.changeItemList.keySet()){
                                switch (key){
                                    case Globals.JPLAN_LIST_NAME:
                                        JSONArray ja=Globals.changeItemList.get(key);
                                        for( int i=0;i<ja.length();i++){
                                            try {
                                                String code = ja.getString(i);
                                                if(Globals.selectedJPlan !=null){
                                                    if(Globals.selectedJPlan.getDate().equals(code)){
                                                        Globals.selectedJPlan.refresh(DashboardActivity.this);
                                                    }
                                                }
                                            }catch (Exception e){
                                                e.printStackTrace();
                                            }
                                        }
                                        refreshDashboard();
                                        break;
                                    case Globals.SOD_LIST_NAME:
                                        Globals.loadDayStatus(DashboardActivity.this);
                                        refreshSOD();
                                        break;
                                }
                            }
                        }*/
                        break;
                    case Globals.OBSERVABLE_MESSAGE_DATA_SENT:
                        //message="Data Sent";
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                //imgNetStatus.setImageDrawable(getResources().getDrawable(R.drawable.ic_cloud_queue_white_24dp));
                            }
                        });

                        break;
                    case Globals.OBSERVABLE_MESSAGE_NETWORK_PULL:
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                //Toast.makeText(LoginActivity.this,"Data synced", Toast.LENGTH_LONG).show();
                                isServiceConnected = true;
                                //imgNetStatus.setImageDrawable(getResources().getDrawable(R.drawable.ic_cloud_download_white_24dp));
                            }
                        });
                        break;
                    case Globals.OBSERVABLE_MESSAGE_NETWORK_PUSH:
                        /*runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                //imgNetStatus.setImageDrawable(getResources().getDrawable(R.drawable.ic_cloud_upload_white_24dp));
                            }
                        });*/
                        break;
                    case Globals.OBSERVABLE_MESSAGE_NETWORK_CONNECTED:
                       /*// msgHandler.sendEmptyMessage(0);
                        //runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                //imgNetStatus.setImageDrawable(getResources().getDrawable(R.drawable.ic_cloud_white_24dp));
                            }
                        });*/
                        break;
                    case Globals.OBSERVABLE_MESSAGE_NETWORK_DISCONNECTED:
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                //imgNetStatus.setImageDrawable(getResources().getDrawable(R.drawable.ic_cloud_off_white_24dp));
                            }
                        });
                        break;
                    case Globals.OBSERVABLE_MESSAGE_LANGUAGE_CHANGED:
                        //DashboardActivity.this.recreate();

                }
                if(!message.equals(""))
                    Toast.makeText(LoginActivity.this,message,Toast.LENGTH_SHORT ).show();
            }
        });


    }


    private interface ProfileQuery {
        String[] PROJECTION = {
                ContactsContract.CommonDataKinds.Email.ADDRESS,
                ContactsContract.CommonDataKinds.Email.IS_PRIMARY,
        };

        int ADDRESS = 0;
        int IS_PRIMARY = 1;
    }

    /**
     * Represents an asynchronous login/registration task used to authenticate
     * the user.
     */
    public class UserLoginTask extends AsyncTask<Void, Void, Boolean> {

        private final String mEmail;
        private final String mPassword;

        UserLoginTask(String email, String password) {
            mEmail = email;
            mPassword = password;
        }

        @Override
        protected Boolean doInBackground(Void... params) {
            // TODO: attempt authentication against a network service.

            try {
                // Simulate network access.
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                return false;
            }

            for (String credential : DUMMY_CREDENTIALS) {
                String[] pieces = credential.split(":");
                if (pieces[0].equals(mEmail)) {
                    // Account exists, return true if the password matches.
                    return pieces[1].equals(mPassword);
                }
            }

            // TODO: register the new account here.
            return true;
        }

        @Override
        protected void onPostExecute(final Boolean success) {
            mAuthTask = null;
            showProgress(false);

            if (success) {
                // Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                //Intent intent = new Intent(LoginActivity.this, DashboardActivity.class);
                startActivity(dashIntent);
                //finish();
            } else {
                mPasswordView.setError(getString(R.string.error_incorrect_password));
                mPasswordView.requestFocus();
                /*Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                startActivity(intent);*/
            }
        }

        @Override
        protected void onCancelled() {
            mAuthTask = null;
            showProgress(false);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (!Globals.userEmail.equals("")) {
            //User Already Logged In
            userFormLayout.setVisibility(LinearLayout.INVISIBLE);
            userProceedLayout.setVisibility(LinearLayout.VISIBLE);
            welUserTxt.setText(getString(R.string.welcome_txt) + " " + Globals.userName);
            //setUserImage(welUserImg);
            logOutBtn.setVisibility(View.VISIBLE);
        } else {
            //User Not Logged In
            userFormLayout.setVisibility(LinearLayout.VISIBLE);
            userProceedLayout.setVisibility(LinearLayout.INVISIBLE);
        }

        if (!mBound) {
            bindService(new Intent(LoginActivity.this, LocationUpdatesService.class), mServiceConnection,
                    Context.BIND_AUTO_CREATE);

            LocalBroadcastManager.getInstance(this).registerReceiver(myReceiver,
                    new IntentFilter(LocationUpdatesService.ACTION_BROADCAST));
        }

    }

    @Override
    protected void onStop() {
        super.onStop();
        if (mBound) {
            // Unbind from the service. This signals to the service that this activity is no longer
            // in the foreground, and the service can respond by promoting itself to a foreground
            // service.
            unbindService(mServiceConnection);
            mBound = false;
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (mBound) {
            // Unbind from the service. This signals to the service that this activity is no longer
            // in the foreground, and the service can respond by promoting itself to a foreground
            // service.
            LocalBroadcastManager.getInstance(this).unregisterReceiver(myReceiver);
            unbindService(mServiceConnection);
            mBound = false;
        }
    }

    @Override
    public void onPause() {
        super.onPause();
        try {
            LocalBroadcastManager.getInstance(this).unregisterReceiver(myReceiver);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        switch(keyCode){
            case KeyEvent.KEYCODE_BACK:
                // do something here
                //gps.unbindService();
                if (mBound) {
                    // Unbind from the service. This signals to the service that this activity is no longer
                    // in the foreground, and the service can respond by promoting itself to a foreground
                    // service.
                    LocalBroadcastManager.getInstance(this).unregisterReceiver(myReceiver);
                    unbindService(mServiceConnection);
                    mBound = false;
                }
                finish();
                return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    public boolean isInternetAvailable() {
        ConnectivityManager cm =
                (ConnectivityManager) getApplicationContext().getSystemService(Context.CONNECTIVITY_SERVICE);

        NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
        boolean isConnected = activeNetwork != null &&
                activeNetwork.isConnectedOrConnecting();
        return isConnected;

    }


    public void showChangeLangDialog() {
        AlertDialog.Builder dialogBuilder = new AlertDialog.Builder(this);
        LayoutInflater inflater = this.getLayoutInflater();
        final View dialogView = inflater.inflate(R.layout.language_dialog, null);
        dialogBuilder.setView(dialogView);

        final Spinner spinner1 = (Spinner) dialogView.findViewById(R.id.spinner_ld);

        dialogBuilder.setTitle(getResources().getString(R.string.lang_dialog_title));
        dialogBuilder.setMessage(getResources().getString(R.string.lang_dialog_message));
        dialogBuilder.setPositiveButton(getString(R.string.change_btn_title), new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int whichButton) {
                int langpos = spinner1.getSelectedItemPosition();
                switch (langpos) {
                    case 0: //English
                        PreferenceManager.getDefaultSharedPreferences(getApplicationContext()).edit().putString("LANG", "en").apply();
                        setLangRecreate("en");
                        return;
//                    case 1: //Urdu PK
//                        PreferenceManager.getDefaultSharedPreferences(getApplicationContext()).edit().putString("LANG", "ur").commit();
//                        setLangRecreate("ur");
//                        return;
                    case 1: //Spanish
                        PreferenceManager.getDefaultSharedPreferences(getApplicationContext()).edit().putString("LANG", "es").apply();
                        setLangRecreate("es");
                        return;
                    case 2: //French
                        PreferenceManager.getDefaultSharedPreferences(getApplicationContext()).edit().putString("LANG", "fr").apply();
                        setLangRecreate("fr");
                        return;

                    default: //By default set to english
                        PreferenceManager.getDefaultSharedPreferences(getApplicationContext()).edit().putString("LANG", "en").apply();
                        setLangRecreate("en");
                }
            }
        });
        dialogBuilder.setNegativeButton(getString(R.string.btn_cancel), new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int whichButton) {
                //pass
            }
        });
        AlertDialog b = dialogBuilder.create();
        spinner1.setSelection(getLanguageSettingIndex(this));
        b.show();
    }

    public void setLangRecreate(String langval) {
/*
        String languageToLoad  = langval; // your language
        Locale locale = new Locale(languageToLoad);
        Locale.setDefault(locale);
        Configuration config = new Configuration();
        config.locale = locale;
        getBaseContext().getResources().updateConfiguration(config,
                getBaseContext().getResources().getDisplayMetrics());
*/


        Configuration config = getBaseContext().getResources().getConfiguration();
        Locale locale = new Locale(langval);
        Locale.setDefault(locale);
        config.locale = locale;
        getBaseContext().getResources().updateConfiguration(config, getBaseContext().getResources().getDisplayMetrics());
        Globals.sendBroadcastMessage(Globals.OBSERVABLE_MESSAGE_LANGUAGE_CHANGED, langval);
        recreate();
    }

    public void showMenu(View v) {
        PopupMenu popup = new PopupMenu(this, v);

        // This activity implements OnMenuItemClickListener
        popup.setOnMenuItemClickListener(this);
        popup.inflate(R.menu.popup_menu);
        popup.show();
    }

    @Override
    public boolean onMenuItemClick(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.mnuLanguage:
                showChangeLangDialog();
                return true;
            case R.id.mnuServerInfo:
                if (Globals.userEmail.equals("")) {
                    Intent intent = new Intent(LoginActivity.this, SettingsActivity.class);
                    startActivity(intent);
               } else {

                   // testLocationService();
                    Snackbar.make(getWindow().getDecorView().getRootView(), getString(R.string.log_out_first_server_info), Snackbar.LENGTH_LONG)
                            .setAction("Action", null).show();
                }
                return true;
            default:
                return false;
        }
    }

    public void testLocationService(){
        Location loc=getLocation();
        if(loc !=null){
            Globals.addEmployeeLogData(LoginActivity.this,new Date(),loc);
            Toast.makeText(LoginActivity.this,getString(R.string.toast_location_added),Toast.LENGTH_SHORT).show();
        }else
        {
            Toast.makeText(LoginActivity.this,getString(R.string.toast_unable_get_location),Toast.LENGTH_SHORT).show();
        }
    }

    public Location getLocation() {
        LocationManager locationManager = (LocationManager) this.getSystemService(Context.LOCATION_SERVICE);
        if (locationManager != null) {
            if (ActivityCompat.checkSelfPermission(this,
                    Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
                    ActivityCompat.checkSelfPermission(this,
                            Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED/* &&
                    ActivityCompat.checkSelfPermission(this,
                            Manifest.permission.ACCESS_BACKGROUND_LOCATION) != PackageManager.PERMISSION_GRANTED*/) {
                // TODO: Consider calling
                //    ActivityCompat#requestPermissions
                // here to request the missing permissions, and then overriding
                //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                //                                          int[] grantResults)
                // to handle the case where the user grants the permission. See the documentation
                // for ActivityCompat#requestPermissions for more details.
                return null;
            }

            Location lastKnownLocationGPS = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
            if (lastKnownLocationGPS != null) {
                return lastKnownLocationGPS;
            } else {
                Location loc =  locationManager.getLastKnownLocation(LocationManager.PASSIVE_PROVIDER);
/*                System.out.println("1::"+loc);
                System.out.println("2::"+loc.getLatitude());*/
                return loc;
            }
        } else {
            return null;
        }
    }

    private boolean isNetworkAvailable() {
        ConnectivityManager connectivityManager
                = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetworkInfo = null;
        if (connectivityManager != null) {
            activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
        }
        return activeNetworkInfo != null && activeNetworkInfo.isConnected();
    }

    private class ServerAsyncTask extends AsyncTask<Void, Void, Void> {

        String server;
        String port;


        @Override
        protected void onPreExecute() {
            progressDialog= new ProgressDialog(LoginActivity.this);
            progressDialog.setMessage(getString(R.string.dialog_wait_title));
            //progressDialog.show();
            showProgress(true);
            super.onPreExecute();
        }

        protected Void doInBackground(Void... args) {
            // Parse response data
            JSONArray jaUser = new JSONArray();
            //String url = "http://" + wsDomainName + ":"+ wsPort + "/api/List/user/300";
            String userString = JsonWebService.getJSON(getPingAddress(wsDomainName, wsPort), 5000);
            try {
                if(userString != null){
                    jaUser = new JSONArray(userString);
                    JSONObject joUser = jaUser.getJSONObject(0);
                    user = new User(new JSONObject(joUser.getString("optParam1")));
                    //Decide if user is Maintainer or not
                    isMaintainerRole(user.getGroupId());
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }

            return null;
        }

        protected void onPostExecute(Void result) {
            // openDialog();
            if (progressDialog.isShowing())
                progressDialog.dismiss();
            showProgress(false);

            if(Globals.lastWsReturnCode == 200 || Globals.lastWsReturnCode == 201){
                if(user != null){
                    if(!user.getRemoved()){
                        if(isProceed){
                            isProceed = false;
                            Globals.loadLoginData(LoginActivity.this);
                            Utilities.makeDocumentsAvailable();
                            //Intent intent = new Intent(LoginActivity.this, DashboardActivity.class);
                            //Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                            startActivity(dashIntent);
                        } else {
                            onLoginRequest();
                        }
                    }
                }
            } else if(Globals.lastWsReturnCode == 401){
                if(isProceed){
                    isProceed = false;
                    Globals.loadLoginData(LoginActivity.this);
                    //Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                    //Intent intent = new Intent(LoginActivity.this, DashboardActivity.class);
                    startActivity(dashIntent);
                } else {
                    onLoginRequest();
                }

            } else if(Globals.lastWsReturnCode == 404){
                if(isProceed){
                    isProceed = false;
                    openContinueDialog(getString(R.string.msg_offline_mode_server_not_running) + '\n' + getString(R.string.offline_confirmation));
                }else {
                    Toast.makeText(LoginActivity.this, getString(R.string.toast_timps_no_run), Toast.LENGTH_LONG).show();
                }
            }
            else if(Globals.lastWsReturnCode == 0){
                if(isProceed){
                    isProceed = false;
                    openContinueDialog(getString(R.string.msg_offline_mode_confirmation));
                } else{
                    Toast.makeText(LoginActivity.this, getString(R.string.toast_server_unreach), Toast.LENGTH_LONG).show();
                }
            } else {
                if(isProceed){
                    isProceed = false;
                    openContinueDialog(getString(R.string.msg_offline_mode_confirmation));
                } else {
                    Toast.makeText(LoginActivity.this, getString(R.string.toast_server_unreach), Toast.LENGTH_LONG).show();
                }

            }

            super.onPostExecute(result);
        }
    }

    private void openContinueDialog(String msg) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle(getResources().getString(R.string.confirmation))
                .setMessage(msg)
                .setIcon(android.R.drawable.ic_dialog_alert);
        builder.setPositiveButton(R.string.continue_txt, null);
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
                        Globals.loadLoginData(LoginActivity.this);
                        //Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                        //Intent intent = new Intent(LoginActivity.this, DashboardActivity.class);
                        _dialog.dismiss();
                        startActivity(dashIntent);
                    }
                });

                Button negativeButton = alertDialog.getButton(AlertDialog.BUTTON_NEGATIVE);
                negativeButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        //CLOSE THE DIALOG
                        _dialog.dismiss();
                    }
                });
            }
        });

        alertDialog.show();
    }
    //Saving last known location
    @Override
    public void onBackPressed() {
        Globals.setLastLocInPref(pref);
        finish();
    }
    
    private class tryLogout extends AsyncTask<Void, Void, Void> {

        String server;
        String port;

        @Override
        protected void onPreExecute() {
            progressDialog = new ProgressDialog(LoginActivity.this);
            progressDialog.setMessage(getString(R.string.dialog_wait_title));
            progressDialog.show();
            Globals.lastWsReturnCode = 0;
            super.onPreExecute();
        }

        protected Void doInBackground(Void... args) {
            // Parse response data
            JSONArray jaUser = new JSONArray();
            //String url = "http://" + server + ":"+ port + "/api/List/JourneyPlan/pull";
            String userString = JsonWebService.getJSON(getPingAddress(wsDomainName, wsPort), 5000);
            try {
                if (userString != null) {
                    jaUser = new JSONArray(userString);
                    JSONObject joUser = jaUser.getJSONObject(0);
                    user = new User(new JSONObject(joUser.getString("optParam1")));
                    //Decide if user is Maintainer or not
                    isMaintainerRole(user.getGroupId());
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
            return null;
        }

        protected void onPostExecute(Void result) {
            if (progressDialog.isShowing())
                progressDialog.dismiss();

            if (Globals.lastWsReturnCode == 200 || Globals.lastWsReturnCode == 201) {
                if (user != null) {
                    logoutDialog();
                }
            } else if (Globals.lastWsReturnCode == 401) {
                logoutDialog();
            } else if (Globals.lastWsReturnCode == 404) {
                Toast.makeText(LoginActivity.this, getString(R.string.toast_timps_no_run), Toast.LENGTH_LONG).show();
            } else if (Globals.lastWsReturnCode == 0) {
                Toast.makeText(LoginActivity.this, R.string.logout_msg, Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(LoginActivity.this, R.string.logout_msg, Toast.LENGTH_SHORT).show();
            }
            super.onPostExecute(result);
        }
    }

    private void logoutDialog(){
        new AlertDialog.Builder(LoginActivity.this)
                .setTitle(getResources().getText(R.string.confirmation))
                .setMessage(getResources().getText(R.string.want_to_log_out))
                .setIcon(android.R.drawable.ic_dialog_alert)
                .setPositiveButton(R.string.btn_ok, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int whichButton) {
                        userFormLayout.setVisibility(LinearLayout.VISIBLE);
                        userProceedLayout.setVisibility(LinearLayout.GONE);
                        welUserTxt.setText(getResources().getText(R.string.welcome_text));
                        welUserImg.setImageResource(R.drawable.avatar);
                        loginLayout.refreshDrawableState();
                        logOutBtn.setVisibility(View.GONE);
                        Globals.safetyBriefing = null;
                        Globals.listViews = new HashMap<Integer, View>();
                        Globals.userLoggedOff(LoginActivity.this);
                    }
                })
                .setNegativeButton(R.string.btn_cancel, null).show();
    }

    private  void StartDataSyncService(){
        Globals.IsAutoUpdateEnabled=true;
        dataSyncProcessEx =new DataSyncProcessEx();
        Globals.dataSyncProcessEx=dataSyncProcessEx;
        StartAsyncTaskInParallel(dataSyncProcessEx, Globals.getDBContext());
        Log.i("StartDataSyncService","Starting Data Sync Service");
    }

    @TargetApi(Build.VERSION_CODES.HONEYCOMB)
    private void StartAsyncTaskInParallel(DataSyncProcessEx task){
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB)
            task.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
        else
            task.execute();
    }

    @TargetApi(Build.VERSION_CODES.HONEYCOMB)
    private void StartAsyncTaskInParallel(DataSyncProcessEx task, Context context){
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB)
            task.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR,context);
        else
            task.execute(context);
    }



}