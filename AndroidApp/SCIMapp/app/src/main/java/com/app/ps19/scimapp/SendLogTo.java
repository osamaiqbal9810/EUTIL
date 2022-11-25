package com.app.ps19.scimapp;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.provider.Settings;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.Shared.JsonWebService;
import com.app.ps19.scimapp.Shared.SharedPref;
import com.app.ps19.scimapp.Shared.Utilities;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

import static com.app.ps19.scimapp.Shared.Globals.PREFS_KEY_CUSTOM_SERVER;
import static com.app.ps19.scimapp.Shared.Globals.PREFS_KEY_SELECTED_PORT;
import static com.app.ps19.scimapp.Shared.Globals.PREFS_KEY_SELECTED_SERVER;
import static com.app.ps19.scimapp.Shared.Globals.emailCrashReport;
import static com.app.ps19.scimapp.Shared.Globals.isInternetAvailable;
import static com.app.ps19.scimapp.Shared.Globals.wsDomainName;
import static com.app.ps19.scimapp.Shared.Globals.wsPort;


public class SendLogTo extends AppCompatActivity {
    private static final int REQUEST_CODE_EMAIL = 100;
    TextView txtData;
    Button btnSendReport;
    Button btnSendEmail;
    Button btnShowContent;
    private ProgressDialog progressDialog;
    JSONObject errorObject;
    private String logFilePath;
    ImageButton btnClose;
    SharedPref pref;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_send_log_to);
        setTitle("Error Reporting System");
        Intent intent=getIntent();
        txtData=findViewById(R.id.txtData);
        btnSendReport=findViewById(R.id.btnSend);
        btnSendEmail=findViewById(R.id.btnSendEmail);
        btnShowContent=findViewById(R.id.btnShowContents);
        btnClose=findViewById(R.id.btnClose);
        Globals.setDbContext(getApplicationContext());
        CharSequence data=intent.getExtras().getCharSequence(Intent.EXTRA_TEXT);
        btnClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                closeApp();
            }
        });
        btnSendEmail.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                try {
                    //String filePath=saveLogToFile();
                    //logFilePath=filePath;
                    //if(!filePath.equals("")){
                    sendEmailByIntent(errorObject.toString());
                    //closeApp();
                    //}
                } catch (Exception e) {
                    e.printStackTrace();
                    Toast.makeText(SendLogTo.this,e.toString(),Toast.LENGTH_LONG).show();
                }
            }
        });
        btnSendReport.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //TODO: write code to send error object to  server
                if(isInternetAvailable(SendLogTo.this)){
                    sendToServer();
                } else {
                    Toast.makeText(SendLogTo.this, "Server unavailable!", Toast.LENGTH_SHORT).show();
                }

            }
        });
        btnShowContent.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(txtData.getVisibility()==View.GONE){
                    txtData.setVisibility(View.VISIBLE);
                    btnShowContent.setText("HIDE CONTENTS");
                }else{
                    txtData.setVisibility(View.GONE);
                    btnShowContent.setText("SHOW CONTENTS");
                }
            }
        });
        String jsonData="";
        try {
            if(data!=null){
                JSONObject jsonObject=new JSONObject(data.toString());
                errorObject=jsonObject;
                jsonData=jsonObject.toString(4);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        txtData.setText(jsonData);

    }

    private void sendToServer() {
        loadSharedPref();
        //showToast( Globals.wsBaseURL);

        progressDialog= new ProgressDialog(SendLogTo.this);
        progressDialog.setTitle(getResources().getString(R.string.please_wait));
        progressDialog.setMessage("Posting your message to server");
        progressDialog.setCancelable(false);
        progressDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
        progressDialog.show();
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {

                    Thread.sleep(3000);
                    try {
                        JSONArray jaData=new JSONArray();
                        jaData.put(errorObject);
                        String url = Globals.wsBaseURL + "errorReporting/";
                        String retValue =putJSON(url, jaData.toString(), 5000);
                        retValue = retValue.replace("\"", "");
                        retValue = retValue.replace("\n", "");
                        if (retValue.contains("success")) {

                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    progressDialog.hide();
                                    //showAlertDialog("Data report submitted successfully", "Submitted Successfully", android.R.drawable.ic_dialog_info, null);
                                    showAlertDialog("Data report submitted successfully", "Submitted Successfully", android.R.drawable.ic_dialog_info, new DialogInterface.OnClickListener() {
                                        @Override
                                        public void onClick(DialogInterface dialog, int which) {
                                            return;
                                        }
                                    });
                                }
                            });
                            return;


                        }
                    }catch (Exception e){
                        e.printStackTrace();
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                Toast.makeText(SendLogTo.this,""+e.toString(),Toast.LENGTH_LONG).show();
                            }
                        });

                    }
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            progressDialog.hide();
                            //showAlertDialog("Data report submitted successfully","Submitted Successfully", android.R.drawable.ic_dialog_info,null);
                        }
                    });

                    //wrap object with errorObject
                    //JSONArray jaData=new JSONArray();

                            /*
                            try {

                                jaData.put(errorObject);
                                String url = Globals.wsBaseURL + "errorReporting/" ;
                                String retValue=JsonWebService.putJSON(url,jaData.toString(),5000);
                                retValue=retValue.replace("\"","");
                                retValue=retValue.replace("\n","");
                                if(retValue.contains("success")){

                                    runOnUiThread(new Runnable() {
                                        @Override
                                        public void run() {
                                            progressDialog.hide();
                                            showAlertDialog("Data report submitted successfully","Submitted Successfully", android.R.drawable.ic_dialog_info,null);
                                        }
                                    });
                                    return;


                                }


                            } catch (JSONException e) {
                                e.printStackTrace();
                            }catch(IOException ex){
                                ex.printStackTrace();
                            }
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    progressDialog.hide();
                                    showAlertDialog("Unable to post error report", "Unsuccessful"
                                            , android.R.drawable.ic_dialog_alert, new DialogInterface.OnClickListener() {
                                                @Override
                                                public void onClick(DialogInterface dialog, int which) {
                                                    return;
                                                }
                                            });
                                }
                            });
*/
                } catch (Exception e) {
                    e.printStackTrace();
                    Toast.makeText(SendLogTo.this,e.toString(),Toast.LENGTH_LONG).show();
                }

            }
        }).start();
        //System.exit(0);
    }

    private void showToast(String message) {
        Toast.makeText(SendLogTo.this,message,Toast.LENGTH_LONG).show();
    }
    private void loadSharedPref(){
        pref = new SharedPref(this);
        if (pref.getBoolean(PREFS_KEY_CUSTOM_SERVER)) {
            wsDomainName = pref.getString(PREFS_KEY_SELECTED_SERVER);
            wsPort = pref.getString(PREFS_KEY_SELECTED_PORT);
            Globals.setDomain();
        }
    }
    private void closeApp(){
        final Handler handler=new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                finishAffinity();
                System.exit(0);

            }
        },100);
    }
    private void sendEmailByIntent(String fileText) {

        try {
            Intent intent = new Intent(Intent.ACTION_SEND);
            intent.setType("text/plain");
            //intent.putExtra(Intent.EXTRA_EMAIL, new String[] {"TIMPS.Alerts@tektracking.com"});
            intent.putExtra(Intent.EXTRA_EMAIL, new String[] {emailCrashReport});
            intent.putExtra(Intent.EXTRA_SUBJECT, "Automated Error Reported in Android App");
            intent.putExtra(Intent.EXTRA_TEXT, fileText);
            //Uri uri = Uri.parse("content://" + filePath);
            //File file=new File(filePath);
            //file.setReadable(true,false);
            //openFileOutput(filePath,MODE_WORLD_READABLE);
            //Uri uri=Uri.fromFile(file);
            //Toast.makeText(SendLogTo.this,uri.toString(),Toast.LENGTH_LONG).show();
            //intent.putExtra(Intent.EXTRA_STREAM, uri);
            startActivityForResult(Intent.createChooser(intent, "Send email..."),REQUEST_CODE_EMAIL);
        } catch (Exception e) {
            e.printStackTrace();
            Toast.makeText(SendLogTo.this,e.toString(),Toast.LENGTH_LONG).show();
        }
    }

    public void showAlertDialog(String message,String title,int icon, DialogInterface.OnClickListener onClickListener){
        AlertDialog.Builder alertDialogBuilder=new AlertDialog.Builder(this);
        alertDialogBuilder.setMessage(message);
        alertDialogBuilder.setIcon(icon);
        alertDialogBuilder.setTitle(title);
        if(onClickListener==null) {
            alertDialogBuilder.setNegativeButton("ok", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    closeApp();
                }
            });
        }else{
            alertDialogBuilder.setNegativeButton("ok",onClickListener);
        }
        AlertDialog alertDialog=alertDialogBuilder.create();
        alertDialog.show();
    }
    public String saveLogToFile(){
        String fileName="crash_log_" + Utilities.getCurrNumberTime()+".log";
        String path = Utilities.getLogPath(fileName);
        File file=new File(path);
        FileWriter writer=null;
        try{
            writer=new FileWriter(file);
            writer.write(errorObject.toString(4));
            writer.close();
            return file.getAbsolutePath();
        }catch (Exception e){
            e.printStackTrace();
        }
        return "";
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if(requestCode==REQUEST_CODE_EMAIL){
            //Toast.makeText(SendLogTo.this,"RESULT:"+ resultCode,Toast.LENGTH_LONG).show();
/*

            if(resultCode== Activity.RESULT_OK){
                showAlertDialog("Email sent!","Successful", android.R.drawable.ic_dialog_info,null);
            }else{

                showAlertDialog("Failed to send email", "Unsuccessful", android.R.drawable.ic_dialog_alert, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        //Remove Log File
                        removeLogFile();
                        return;
                    }
                });

            }
*/
        }
    }

    private void removeLogFile() {
        if(!logFilePath.equals("")){
            try {
                File file=new File(logFilePath);
                boolean fileDelete=file.delete();
                if(fileDelete){
                    Toast.makeText(SendLogTo.this,"Log file removed",Toast.LENGTH_SHORT).show();
                }else{
                    Toast.makeText(SendLogTo.this,"Unable to remove log file",Toast.LENGTH_SHORT).show();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

        }
    }
    private String putJSON(String url1, String  jsonData,int timeOut) throws Exception {
        URL url = new URL(url1);
        String charset = "UTF-8";
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("PUT");
        conn.setDoInput(true);
        conn.setDoOutput(true);
        conn.setRequestProperty("Authorization",Globals.appid);
        conn.setConnectTimeout(timeOut);
        conn.setReadTimeout(timeOut);
        //String getParams=getQuery(apiParams);

        conn.setDoOutput(true); // Triggers POST.
        conn.setRequestProperty("Accept-Charset", charset);
        conn.setRequestProperty("Content-Type", "application/json;charset=" + charset);

        String getParams=jsonData;

        OutputStreamWriter writer = new OutputStreamWriter(conn.getOutputStream());
        /*BufferedWriter writer = new BufferedWriter(
                new OutputStreamWriter(os, "UTF-8"));*/
        writer.write(jsonData);
        writer.flush();
        // writer.close();
        //os.close();
        conn.connect();

        int status = conn.getResponseCode();
        //setLastWsReturnCode(status);
        switch (status) {
            case 200:
            case 201:
                BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    sb.append(line+"\n");
                }
                br.close();
                System.out.println(sb.toString());
                return sb.toString();
            case 400:
            case 401:
                BufferedReader brr = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                StringBuilder sbb = new StringBuilder();
                String line1;
                while ((line1 = brr.readLine()) != null) {
                    sbb.append(line1);
                }
                brr.close();
                //System.out.println(sbb.toString());
                //setLastWsReturnCode(status);
                return sbb.toString();

            case 403:

        }


        if (conn != null) {
            try {
                conn.disconnect();
            } catch (Exception ex) {
            }
        }
        return null;
    }
}