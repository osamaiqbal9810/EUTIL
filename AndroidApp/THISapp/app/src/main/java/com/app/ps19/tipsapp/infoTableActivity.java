package com.app.ps19.tipsapp;

import android.app.ProgressDialog;
import android.graphics.Bitmap;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import androidx.appcompat.widget.Toolbar;
import android.view.MenuItem;
import android.view.View;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Spinner;

import com.app.ps19.tipsapp.Shared.StaticListItem;
import com.app.ps19.tipsapp.classes.dynforms.DynFormList;

import java.util.HashMap;
import java.util.List;

import static com.app.ps19.tipsapp.Shared.Globals.setLocale;

public class infoTableActivity extends AppCompatActivity {
    Spinner spinnerTableList;
    WebView webView;
    HashMap<String, String> hmItemList=new HashMap<>();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setLocale(this);
        setContentView(R.layout.activity_info_table);
        spinnerTableList=findViewById(R.id.infoTableSpinner);
        webView=findViewById(R.id.infoTableWebView);
        Toolbar toolbar = (Toolbar) findViewById(R.id.tbInfoTables);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);



        loadInfoTableList();
        spinnerTableList.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String html = hmItemList.get(spinnerTableList.getSelectedItem().toString());
                loadHtml(html);
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
                loadHtml("");
            }
        });


        final ProgressDialog progressBar = new ProgressDialog(infoTableActivity.this);
        progressBar.setMessage("Please wait...");

        webView.setWebViewClient(new WebViewClient() {
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                try {
                    if (!progressBar.isShowing()) {
                        progressBar.show();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            public void onPageFinished(WebView view, String url) {
                try {
                    if (progressBar.isShowing()) {
                        progressBar.dismiss();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                if (progressBar.isShowing()) {
                    progressBar.dismiss();
                }
            }
        });
    }
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        if (id==android.R.id.home) {
            finish();
        }
        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
    private void loadHtml(String html){
        final String mimeType = "text/html";
        final String encoding = "UTF-8";
        webView.loadDataWithBaseURL("", html, mimeType, encoding, "");
    }
    private void loadInfoTableList(){
        ArrayAdapter<String> spinnerAdapter=new ArrayAdapter<>(this,android.R.layout.simple_spinner_dropdown_item);
        spinnerAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        DynFormList.loadInfoTableList(this);
        List<StaticListItem> items=DynFormList.infoListItems;
        if(items !=null){
            for(StaticListItem item:items){
                String desc=item.getDescription();
                String document=item.getOptParam1();
                hmItemList.put(desc, document);
                spinnerAdapter.add(desc);
            }
        }
        spinnerTableList.setAdapter(spinnerAdapter);
    }
}