package com.app.ps19.elecapp.defects;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;

import androidx.appcompat.app.AppCompatActivity;
import androidx.viewpager.widget.ViewPager;

import com.app.ps19.elecapp.R;
import com.app.ps19.elecapp.Shared.Globals;
import com.app.ps19.elecapp.defects.ui.main.SectionsPagerAdapter;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.snackbar.Snackbar;
import com.google.android.material.tabs.TabLayout;

public class DefectsActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_defects);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        /*try {
            Objects.requireNonNull(getSupportActionBar()).setDisplayHomeAsUpEnabled(true);
        } catch (Exception e) {
            e.printStackTrace();
        }*/
        setTitle(getResources().getString(R.string.def_codes));

        String unitiId = getIntent().getStringExtra("EXTRA_UNIT_ID");
        int newIssueCount = getIntent().getIntExtra("EXTRA_NEW_ISSUE_COUNT", 0);
        int oldIssueCount = getIntent().getIntExtra("EXTRA_OLD_ISSUE_COUNT", 0);

        SectionsPagerAdapter sectionsPagerAdapter = new SectionsPagerAdapter(this, getSupportFragmentManager(), unitiId, newIssueCount, oldIssueCount);



        ViewPager viewPager = findViewById(R.id.view_pager);
        viewPager.setAdapter(sectionsPagerAdapter);
        TabLayout tabs = findViewById(R.id.tabs);
        tabs.setupWithViewPager(viewPager);
        FloatingActionButton fab = findViewById(R.id.fab);
        fab.setVisibility(View.GONE);

        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });

    }
    @Override
    public boolean onSupportNavigateUp() {
        //code it to launch an intent to the activity you want
        finish();
        return true;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == RecentIssuesFragment.SECOND_ACTIVITY_REQUEST_CODE) {
            //Globals.selectedTask = null;
            //Globals.selectedUnit = null;
            Globals.selectedReportIndex = 0;
            Globals.selectedReport = null;
            Globals.newReport = null;
            Globals.selectedCategory = "";
        }
    }
}