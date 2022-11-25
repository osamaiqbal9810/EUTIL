package com.app.ps19.scimapp;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.browser.customtabs.CustomTabsCallback;
import androidx.browser.customtabs.CustomTabsClient;
import androidx.browser.customtabs.CustomTabsIntent;
import androidx.browser.customtabs.CustomTabsService;
import androidx.browser.customtabs.CustomTabsServiceConnection;
import androidx.browser.customtabs.CustomTabsSession;
import androidx.constraintlayout.solver.GoalRow;

import android.content.ComponentName;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.hardware.Sensor;
import android.hardware.SensorManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Message;
import android.preference.PreferenceManager;
import android.provider.Browser;
import android.view.View;
import android.view.Window;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.Shared.SharedPref;
import com.app.ps19.scimapp.Shared.Utilities;
import com.app.ps19.scimapp.classes.CompRange;
import com.app.ps19.scimapp.classes.JourneyPlan;
import com.app.ps19.scimapp.classes.JourneyPlanOpt;
import com.app.ps19.scimapp.classes.Session;
import com.app.ps19.scimapp.classes.User;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static com.app.ps19.scimapp.Shared.Globals.appName;
import static com.app.ps19.scimapp.Shared.Globals.appid;
import static com.app.ps19.scimapp.Shared.Globals.dbContext;
import static com.app.ps19.scimapp.Shared.Globals.getPrefixMp;
import static com.app.ps19.scimapp.Shared.Globals.mPrefs;
import static com.app.ps19.scimapp.Shared.Globals.setLocale;
import static com.app.ps19.scimapp.Shared.Globals.wsDomainName;
import static com.app.ps19.scimapp.Shared.Globals.wsWebPort;

public class ReportWebViewActivity extends AppCompatActivity {
    private WebView wView;
    String reportKey="";
    private CustomTabsSession mSession;
    private CustomTabsServiceConnection mConnection;
    String url;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setLocale(this);
        getWindow().requestFeature(Window.FEATURE_PROGRESS);
        setContentView(R.layout.activity_report_web_view);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        wView = (WebView) findViewById(R.id.webview_report);
        // Makes Progress bar Visible
        getWindow().setFeatureInt(Window.FEATURE_PROGRESS, Window.PROGRESS_VISIBILITY_ON);
        Bundle bundle= getIntent().getExtras();
        if(bundle!=null){
            reportKey=bundle.getString("reportId");
        }
        showReport();

    }
    private void showReport(){
        if(reportKey.equals("sessions")){
            showSessionsReport();
        }else{
            loadReport();
        }

    }
    private void showSessionsReport(){
        JourneyPlanOpt wp= Globals.selectedJPlan.getTemplateOpt();
        JourneyPlan jp=Globals.selectedJPlan;
        boolean offlineMode=Globals.offlineMode;
        boolean currentUserOnly=offlineMode;
        String inspectionType="";
        //String nextDueDate=wp.getNextDueDate();
        long dateDiff= 0;
        try {
            Date date=wp.getNextDueDateToDate();
            dateDiff = 0;
            if(date !=null) {
                dateDiff=Utilities.getDateDiffInDays(date);
            }
            if(dateDiff>0){
                currentUserOnly=true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        if(jp.getTaskList().size()>0){
            if(!jp.getTaskList().get(0).getInspectionTypeTag().equals("required")){
                currentUserOnly=true;
                inspectionType=jp.getTaskList().get(0).getInspectionType();
            }
        }
        ArrayList<Session> sessions=new ArrayList<>();
        ArrayList<CompRange> ranges=wp.getCompletion().getRanges();
        ArrayList<Session> intervalSessions=null;
        if(currentUserOnly){
            if(jp.getIntervals()!=null){
                intervalSessions=jp.getIntervals().getSessions();
                for (Session _s :intervalSessions) {
                    sessions.add(_s);
                }
            }

        }else {
            for (CompRange range : ranges) {
                ArrayList<Session> _sessions = range.getSessions();
                for (Session _s : _sessions) {
                    sessions.add(_s);
                }
            }
        }
        setLocale(this);
        StringBuilder sb=new StringBuilder();
        sb.append("<!DOCTYPE html>\n");
        sb.append("<html>\n");
        sb.append("<head>\n");
        sb.append("<style>");
        sb.append("#sessions {");
        sb.append("  font-family: Arial, Helvetica, sans-serif;");
        sb.append("  border-collapse: collapse;");
        sb.append("  width: 100%;");
        sb.append("}");

        sb.append("#sessions td, #sessions th {");
        sb.append("  border: 1px solid #ddd;");
        sb.append("  padding: 8px;");
        sb.append("}");

        sb.append("#sessions tr:nth-child(even){background-color: #f2f2f2;}");

        sb.append("#sessions tr:hover {background-color: #ddd;}");

        sb.append("#sessions .th-active {");
        sb.append("  padding-top: 12px;");
        sb.append("  padding-bottom: 12px;");
        sb.append("  text-align: left;");
        sb.append("  background-color: #4CAF50;");
        sb.append("  color: white;");
        sb.append("}");

        sb.append("#sessions .th-completed {");
        sb.append("  padding-top: 12px;");
        sb.append("  padding-bottom: 12px;");
        sb.append("  text-align: left;");
        sb.append("  background-color: #808080;");
        sb.append("  color: white;");
        sb.append("}");

        sb.append("</style>");

        sb.append("</head>\n");
        sb.append("<body>\n");
        sb.append("<h3>"+getResources().getString(R.string.report_template_sessions_title)+"</h3>\n");
        sb.append("<h4>"+wp.getTitle()+"</h4>\n");
        if(offlineMode){
            sb.append("<h5><font color=\"red\">"+getResources().getString(R.string.offline)+ ((!inspectionType.equals("required"))? ": "+inspectionType+" ":"")+"</font> [ "+getResources().getString(R.string.offline_curr_user_data)+" ]</h5>\n");
        }else if(currentUserOnly){
            if(dateDiff>0){
                sb.append("<h5><font color=\"red\">" + getResources().getString(R.string.due_date_in_days)+" : " + dateDiff +"" + "</font> [ " + getResources().getString(R.string.offline_curr_user_data) + " ]</h5>\n");
            }else {
                sb.append("<h5><font color=\"red\">" + inspectionType + "</font> [ " + getResources().getString(R.string.offline_curr_user_data) + " ]</h5>\n");
            }
        }
        //for(Session session:sessions){
        for(int i=0 ;i<sessions.size();i++){
            Session session=sessions.get(sessions.size()-i-1);
            CompRange cr=null;//(CompRange) session.getParent();
            User user;
            if(session.getParent() instanceof CompRange){
                cr=(CompRange) session.getParent();
                user=cr.getUser();
            }else{
                user=jp.getUser();
            }

            sb.append("<table id=\"sessions\">");
            sb.append("<tr>");
            if(session.getStatus().equals("closed")){
                sb.append("<th class=\"th-completed\" colspan=3>" + user.getName() + "</th>");
            }else {
                sb.append("<th class=\"th-active\" colspan=3>" + user.getName() + "</th>");
            }
            sb.append("</tr>");
            sb.append("<tr>");
            sb.append("<td>&nbsp;</td><td>"+getResources().getString(R.string.prompt_email)+"</td><td>"+user.getEmail()+"</td>");
            sb.append("</tr>");

            sb.append("<tr>");
            sb.append("<td>&nbsp;</td><td>"+getResources().getString(R.string.location_start)+"</td><td>"+getPrefixMp(session.getStart())+"</td>");
            sb.append("</tr>");

            sb.append("<tr>");
            sb.append("<td>&nbsp;</td><td>"+getResources().getString(R.string.time)+"</td><td>"+session.getStartTimeFormatted("MM-dd-yyyy hh:mm aaa")+"</td>");
            sb.append("</tr>");

            sb.append("<tr>");
            sb.append("<td>&nbsp;</td><td>"+getResources().getString(R.string.location_end)+"</td><td>"+getPrefixMp(session.getEnd())+"</td>");
            sb.append("</tr>");

            sb.append("<tr>");
            sb.append("<td>&nbsp;</td><td>"+getResources().getString(R.string.time)+"</td><td>"+session.getEndTimeFormatted("MM-dd-yyyy hh:mm aaa")+"</td>");
            sb.append("</tr>");

            sb.append("<tr>");
            sb.append("<td>&nbsp;</td><td>"+getResources().getString(R.string.status)+"</td><td>"+session.getStatus()+"</td>");
            sb.append("</tr>");
            sb.append("</table>");


        }
        sb.append("</body>\n");
        sb.append("</html>\n");
        String data=sb.toString();
        //wView.getSettings().setJavaScriptEnabled(true);

        WebSettings settings =wView.getSettings();
        settings.setBuiltInZoomControls(true);
        settings.setPluginState(WebSettings.PluginState.ON);
        settings.setJavaScriptEnabled(true);
        settings.setSupportZoom(true);
        wView.setWebChromeClient(
                new WebChromeClient() {
                    @Override
                    public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
                        //Required functionality here
                        return super.onJsAlert(view, url, message, result);
                    }

                    public void onProgressChanged(WebView view, int progress) {
                        //Make the bar disappear after URL is loaded, and changes string to Loading...
                        setTitle(getString(R.string.loading_text));
                        setProgress(progress * 100); //Make the bar disappear after URL is loaded

                        // Return the app name after finish loading
                        if (progress == 100)
                            setTitle(getString(R.string.report_web_title));
                    }
                }
        );

        wView.loadDataWithBaseURL(null, data, "text/html; charset=utf-8","UTF-8",null);
    }
    private void loadReport() {
        wView.getSettings().setDomStorageEnabled(true);
        String appCachePath = ReportWebViewActivity.this.getApplicationContext().getCacheDir().getAbsolutePath();
        wView.getSettings().setAppCachePath(appCachePath);
        wView.getSettings().setAllowFileAccess(true);    // Readable file cache
        wView.getSettings().setAppCacheEnabled(true);
        wView.getSettings().setSupportMultipleWindows(true);
        wView.getSettings().setJavaScriptCanOpenWindowsAutomatically(true);
        wView.setVerticalScrollBarEnabled(true);
        wView.setHorizontalScrollBarEnabled(true);
        wView.getSettings().setJavaScriptEnabled(true);
        wView.getSettings().setPluginState(WebSettings.PluginState.ON);

        wView.getSettings().setBuiltInZoomControls(true);
        wView.getSettings().setLoadsImagesAutomatically(true);
        wView.setScrollBarStyle(View.SCROLLBARS_INSIDE_OVERLAY);
        wView.getSettings().setDomStorageEnabled(true);
        wView.getSettings().setAllowContentAccess(true);
        setLocale(this);
        wView.setWebViewClient(
                new WebViewClient() {
                    @Override
                    public void onPageStarted(WebView view, String url, Bitmap favicon) {
                        super.onPageStarted(view, url, favicon);
                        writeData();
                    }
                }
        );
        wView.setWebChromeClient(
                new WebChromeClient() {
                    @Override
                    public boolean onCreateWindow(WebView view, boolean isDialog,
                                                  boolean isUserGesture, Message resultMsg) {



                        WebView newWebView = new WebView(ReportWebViewActivity.this);
                        newWebView.getSettings().setJavaScriptEnabled(true);
                        newWebView.getSettings().setSupportZoom(true);
                        newWebView.getSettings().setBuiltInZoomControls(true);
                        newWebView.getSettings().setPluginState(WebSettings.PluginState.ON);
                        newWebView.getSettings().setSupportMultipleWindows(true);
                        view.addView(newWebView);
                        WebView.WebViewTransport transport = (WebView.WebViewTransport) resultMsg.obj;
                        transport.setWebView(newWebView);
                        resultMsg.sendToTarget();

                        newWebView.setWebViewClient(new WebViewClient() {
                            @Override
                            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                                view.loadUrl(url);
                                return true;
                            }
                        });

                        return true;
                    }

                    @Override
                    public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
                        //Required functionality here
                        return super.onJsAlert(view, url, message, result);
                    }

                    public void onProgressChanged(WebView view, int progress) {
                        //Make the bar disappear after URL is loaded, and changes string to Loading...
                        setTitle(getString(R.string.loading_text));
                        setProgress(progress * 100); //Make the bar disappear after URL is loaded

                        // Return the app name after finish loading
                        if (progress == 100)
                            setTitle(getString(R.string.report_web_title));
                    }
                }
        );

        url = mPrefs.getString(wsDomainName, "http")+"://" + wsDomainName + wsWebPort + "/appReport/"+appid;
        CustomTabsIntent intent = constructExtraHeadersIntent(mSession);
        intent.launchUrl(ReportWebViewActivity.this, Uri.parse(url));
        //wView.loadUrl(url);
        //wView.reload();
    }

    private CustomTabsIntent constructExtraHeadersIntent(CustomTabsSession session) {
        CustomTabsIntent intent = new CustomTabsIntent.Builder(session).build();

        // Example non-cors-whitelisted headers.
        Bundle headers = new Bundle();
        //headers.putString("bearer-token", appid);
        //headers.putString("redirect-url", url);
        intent.intent.putExtra(Browser.EXTRA_HEADERS, headers);

        return intent;
    }
    @Override
    protected void onStart() {
        super.onStart();
        if(getIntent().getExtras()!=null){
            Bundle bundle= getIntent().getExtras();
            String reportKey = bundle.getString("reportId");
            if(!reportKey.equals("sessions")){
                try {
                    // Set up a callback that launches the intent after session was validated.
                    CustomTabsCallback callback = new CustomTabsCallback() {
                        @Override
                        public void onRelationshipValidationResult(int relation, @NonNull Uri requestedOrigin,
                                                                   boolean result, @Nullable Bundle extras) {
                            // Can launch custom tabs intent after session was validated as the same origin.
                            //mExtraButton.setEnabled(true);
                        }
                    };

                    // Set up a connection that warms up and validates a session.
                    mConnection = new CustomTabsServiceConnection() {
                        @Override
                        public void onCustomTabsServiceConnected(@NonNull ComponentName name,
                                                                 @NonNull CustomTabsClient client) {
                            // Create session after service connected.
                            mSession = client.newSession(callback);
                            client.warmup(0);
                            // Validate the session as the same origin to allow cross origin headers.
                            mSession.validateRelationship(CustomTabsService.RELATION_USE_AS_ORIGIN,
                                    Uri.parse(url), null);
                        }

                        @Override
                        public void onServiceDisconnected(ComponentName componentName) {
                        }
                    };

                    //Add package names for other browsers that support Custom Tabs and custom headers.
                    List<String> packageNames = Arrays.asList(
                            "com.google.android.apps.chrome",
                            "com.chrome.canary",
                            "com.chrome.dev",
                            "com.chrome.beta",
                            "com.android.chrome"
                    );
                    String packageName =
                            CustomTabsClient.getPackageName(ReportWebViewActivity.this, packageNames, false);
                    if (packageName == null) {
                        Toast.makeText(getApplicationContext(), "Package name is null.", Toast.LENGTH_SHORT)
                                .show();
                    } else {
                        // Bind the custom tabs service connection.
                        CustomTabsClient.bindCustomTabsService(this, packageName, mConnection);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

    }
    @Override
    protected void onStop() {
        super.onStop();

        // Unbind from the service if we connected successfully and clear the session.
        if (mSession != null) {
            unbindService(mConnection);
            mConnection = null;
            mSession = null;
        }
        finish();
        //mExtraButton.setEnabled(false);
    }

    public void writeData(){
        String key_token = "access_token";
        String value_token = appid;

        String key_theme = "theme";
        String value_theme = "retro";

        String key_app = "source";
        String value_app = appName + "_App";

        String key_lang = "language";
        String value_lang = PreferenceManager.getDefaultSharedPreferences(getApplicationContext()).getString("LANG","en");


        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.KITKAT) {
            wView.evaluateJavascript("window.localStorage.setItem('"+ key_token +"','"+ value_token +"');", null);
            wView.evaluateJavascript("window.localStorage.setItem('"+ key_theme +"','"+ value_theme +"');", null);
            wView.evaluateJavascript("window.localStorage.setItem('"+ key_lang +"','"+ value_lang +"');", null);
            wView.evaluateJavascript("window.localStorage.setItem('"+ key_app +"','"+ value_app +"');", null);

        } else {
            wView.loadUrl("javascript:localStorage.setItem('"+ key_token +"','"+ value_token +"');");
            wView.loadUrl("javascript:localStorage.setItem('"+ key_theme +"','"+ value_theme +"');");
            wView.loadUrl("javascript:localStorage.setItem('"+ key_lang +"','"+ value_lang +"');");
            wView.loadUrl("javascript:localStorage.setItem('"+ key_app +"','"+ value_app +"');");

        }
    }
    @Override
    public boolean onSupportNavigateUp() {
        finish();
        return true;
    }
    @Override
    protected void onResume()
    {
        super.onResume();
        //loadReport();
        //showReport();
    }
    @Override
    public void onConfigurationChanged(Configuration newConfig)
    {
        super.onConfigurationChanged(newConfig);
        setLocale(this);
    }

}