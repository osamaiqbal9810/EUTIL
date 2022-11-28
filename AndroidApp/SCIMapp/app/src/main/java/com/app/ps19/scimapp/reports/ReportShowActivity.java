package com.app.ps19.scimapp.reports;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import android.content.Intent;
import android.os.Bundle;

import com.app.ps19.scimapp.R;

public class ReportShowActivity extends AppCompatActivity {
    Fragment cFragment;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_report_show);
        this.cFragment= CompletionFragment.newInstance("","");
        setTitle(getString(R.string.mnu_session_rpt));
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        selectFragment(cFragment);
    }
    private void selectFragment(Fragment fragment) {
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        transaction.replace(R.id.content_report_show, fragment);
        transaction.commit();

    }
    @Override
    public boolean onSupportNavigateUp() {
        finish();
        return true;
    }
}