package com.app.ps19.tipsapp;

import static com.app.ps19.tipsapp.Shared.Globals.isMaintainer;
import static com.app.ps19.tipsapp.Shared.Globals.setLocale;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.FragmentTransaction;

import android.os.Bundle;
import android.view.KeyEvent;
import android.widget.FrameLayout;

import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.classes.maintenance.WorkOrderListFragment;

public class MaintenanceActivity extends AppCompatActivity {
    FrameLayout flMaintenance;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setLocale(this);
        setContentView(R.layout.activity_maintenance);
        setTitle(getString(R.string.maintenances_activity_title));
        flMaintenance = findViewById(R.id.fl_maintenance);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        WorkOrderListFragment fragment;
        fragment = WorkOrderListFragment.newInstance("", "");
        /* if(isMaintainer){
            fragment = WorkOrderListFragment.newInstance("", "");
        } else {
            fragment = WorkOrderListFragment.newInstance("selected", "");
        }*/
        final FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        transaction.replace(R.id.fl_maintenance, fragment);
        transaction.addToBackStack(null);
        transaction.commit();
    }
    @Override
    public boolean onSupportNavigateUp() {
        //code it to launch an intent to the activity you want
        finish();
        return true;
    }
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            finish();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

}