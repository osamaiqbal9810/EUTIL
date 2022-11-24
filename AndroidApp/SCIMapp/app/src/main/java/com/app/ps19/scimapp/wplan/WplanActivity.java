package com.app.ps19.scimapp.wplan;

import android.content.Intent;
import android.os.Bundle;

import com.app.ps19.scimapp.R;
import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.Shared.ObservableObject;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.snackbar.Snackbar;
import com.google.android.material.tabs.TabLayout;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.viewpager.widget.ViewPager;
import androidx.appcompat.app.AppCompatActivity;

import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.Window;

import com.app.ps19.scimapp.wplan.ui.main.SectionsPagerAdapter;

import java.util.Observable;
import java.util.Observer;

import static com.app.ps19.scimapp.Shared.Globals.WPLAN_TEMPLATE_LIST_NAME;
import static com.app.ps19.scimapp.Shared.Globals.appName;

public class WplanActivity extends AppCompatActivity implements Observer {
    SectionsPagerAdapter sectionsPagerAdapter;
    @Override
    protected void onStop() {
        ObservableObject.getInstance().deleteObserver(this);
        super.onStop();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_wplan);
        sectionsPagerAdapter = new SectionsPagerAdapter(this, getSupportFragmentManager());
        ViewPager viewPager = findViewById(R.id.view_pager);
        viewPager.setAdapter(sectionsPagerAdapter);
        TabLayout tabs = findViewById(R.id.tabs);
        tabs.setupWithViewPager(viewPager);
        ObservableObject.getInstance().addObserver(this);
        tabs.setOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                Log.d("",tab.getText().toString());
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {

            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {

            }
        });
        /*FloatingActionButton fab = findViewById(R.id.fab);

        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });*/
        //Index of Maintain tab
        TabLayout.Tab tabFirst = tabs.getTabAt(0);
        if(appName.equals(Globals.AppName.TIMPS)){
            assert tabFirst != null;
            tabFirst.setText(getString(R.string.select_run));
        } else {
            tabFirst.setText(getString(R.string.select_run_test));
        }
    }
    private TemplateTestFragment getTemplateTestFragment(){
        FragmentManager fm= getSupportFragmentManager();
        for(Fragment frag:fm.getFragments()){
            if( frag instanceof  TemplateTestFragment){
                return  (TemplateTestFragment) frag;
            }
        }
        return null;
    }
    private RunsFragment getRunsFragment(){
        FragmentManager fm= getSupportFragmentManager();
        for(Fragment frag:fm.getFragments()){
            if( frag instanceof  RunsFragment){
                return  (RunsFragment) frag;
            }
        }
        return null;
    }
    private plansFragment getPlansFragment(){
        FragmentManager fm= getSupportFragmentManager();
        for(Fragment frag:fm.getFragments()){
            if( frag instanceof  plansFragment){
                return  (plansFragment) frag;
            }
        }
        return null;
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
                        break;
                    case Globals.OBSERVABLE_MESSAGE_DATA_CHANGED:
                        //message="Data Changed: (" + messageData +")";
                        if(Globals.changeItemList !=null){
                            for(String key:Globals.changeItemList.keySet()){
                                switch (key){
                                    case Globals.APPLICATION_LOOKUP_LIST_NAME:
                                    case WPLAN_TEMPLATE_LIST_NAME:
                                        TemplateTestFragment fragment=getTemplateTestFragment();
                                        RunsFragment runFragment = getRunsFragment();

                                        if(fragment!=null){
                                            fragment.refresh();
                                        }
                                        if(runFragment != null){
                                            runFragment.refreshFragment();
                                        }
                                        Log.d("Items Changed","Need to refresh template list frag");
                                        break;
                                    case Globals.JPLAN_LIST_NAME:
                                        break;
                                    case Globals.SOD_LIST_NAME:
                                        break;

                                }
                            }
                        }
                        break;
                    case Globals.OBSERVABLE_MESSAGE_DATA_SENT:
                    case Globals.OBSERVABLE_MESSAGE_NETWORK_PULL:
                    case Globals.OBSERVABLE_MESSAGE_NETWORK_PUSH:
                    case Globals.OBSERVABLE_MESSAGE_NETWORK_CONNECTED:
                    case Globals.OBSERVABLE_MESSAGE_NETWORK_DISCONNECTED:
                    case Globals.OBSERVABLE_MESSAGE_LANGUAGE_CHANGED:

                }
            }
        });
    }

}