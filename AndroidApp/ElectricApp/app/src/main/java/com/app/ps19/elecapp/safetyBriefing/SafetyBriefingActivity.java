package com.app.ps19.elecapp.safetyBriefing;

import static com.app.ps19.elecapp.Shared.Globals.safetyBriefingContext;
import static com.app.ps19.elecapp.Shared.Globals.setLocale;

import android.net.Uri;
import android.os.Bundle;
import android.view.KeyEvent;

import androidx.appcompat.app.AppCompatActivity;
import androidx.viewpager.widget.ViewPager;

import com.app.ps19.elecapp.R;
import com.app.ps19.elecapp.Shared.Globals;
import com.app.ps19.elecapp.classes.SafetyBriefingForm;
import com.app.ps19.elecapp.safetyBriefing.ui.main.SectionsPagerAdapter;
import com.google.android.material.tabs.TabLayout;

import org.json.JSONObject;

import java.util.ArrayList;

public class SafetyBriefingActivity extends AppCompatActivity implements BriefingFragment.OnFragmentInteractionListener, WorkerFragment.OnFragmentInteractionListener, CommentsFragment.OnFragmentInteractionListener{

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setLocale(this);
        setTitle(R.string.activity_title_safety_briefing);
        setContentView(R.layout.activity_safety_briefing);
        safetyBriefingContext = this;
        try {
            if(Globals.selectedJPlan.getSafetyBriefingForm()!=null){
                Globals.safetyBriefing = Globals.selectedJPlan.getSafetyBriefingForm();
                if(Globals.safetyBriefing.getTypeOfProtection()==null){
                    ArrayList<String> types = new ArrayList<String>();
                    types.add("");
                    types.add("");
                    types.add("");
                    types.add("");
                    types.add("");
                    Globals.safetyBriefing.setMyTypeOfProtection(types);
                }
            } else {
                Globals.safetyBriefing = new SafetyBriefingForm(new JSONObject());
                Globals.safetyBriefing.setMyTypeOfProtection(new ArrayList<String>());
                ArrayList<String> types = new ArrayList<String>();
                types.add("");
                types.add("");
                types.add("");
                types.add("");
                types.add("");
                Globals.safetyBriefing.setMyTypeOfProtection(types);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);


        /*for (int i = 0; i<5; i++){
            Globals.safetyBriefing.getTypeOfProtection().set(i, "");
        }*/
        /*getActionBar().setDisplayHomeAsUpEnabled(true);
        getActionBar().setHomeButtonEnabled(true);*/
        //etSupportActionBar().setDisplayHomeAsUpEnabled(true);
        SectionsPagerAdapter sectionsPagerAdapter = new SectionsPagerAdapter(this, getSupportFragmentManager());
        ViewPager viewPager = findViewById(R.id.view_pager);
        viewPager.setAdapter(sectionsPagerAdapter);
        TabLayout tabs = findViewById(R.id.safety_briefing_tabs);
        tabs.setupWithViewPager(viewPager);
        /*FloatingActionButton fab = findViewById(R.id.fab);

        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });*/
    }
    @Override
    public boolean onSupportNavigateUp() {
        //code it to launch an intent to the activity you want
        try {
            Globals.selectedJPlan.setSafetyBriefingForm(Globals.safetyBriefing);
            Globals.selectedJPlan.update();
        } catch (Exception e) {
            e.printStackTrace();
        }
        finish();
        return true;
    }
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        switch(keyCode){
            case KeyEvent.KEYCODE_BACK:
                // do something here
                /*if (!etAcct.getText().toString().equals("") || !etName.getText().toString().equals("") || !signatureImg.getImgName().equals("")) {
                    showDialog();
                } else {
                    finish();
                }*/
                Globals.selectedJPlan.setSafetyBriefingForm(Globals.safetyBriefing);
                Globals.selectedJPlan.update();
                finish();
                return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    public void onFragmentInteraction(Uri uri) {

    }
}