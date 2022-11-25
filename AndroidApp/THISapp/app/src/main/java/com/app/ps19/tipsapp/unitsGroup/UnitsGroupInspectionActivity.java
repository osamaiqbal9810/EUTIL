package com.app.ps19.tipsapp.unitsGroup;

import static com.app.ps19.tipsapp.Shared.Globals.getSelectedUnit;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.viewpager.widget.ViewPager;

import android.os.Bundle;
import android.view.WindowManager;

import com.app.ps19.tipsapp.R;
import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.classes.Units;
import com.app.ps19.tipsapp.classes.UnitsGroup;
import com.google.android.material.tabs.TabLayout;

import java.util.ArrayList;
import java.util.HashMap;

public class UnitsGroupInspectionActivity extends AppCompatActivity {
    TabLayout tabLayout;
    ViewPager viewPager;
    HashMap<String , ArrayList<Units>> rackList=new HashMap<>();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_units_group_inspection);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        if(getSelectedUnit()!=null){
            setTitle(getSelectedUnit().getDescription());
        }
        ArrayList<Fragment> fragments=new ArrayList<>();
        tabLayout=findViewById(R.id.tabLayout);
        viewPager=findViewById(R.id.viewPager);
        Units units= getSelectedUnit();
        ArrayList<Units> unitList=units.getChildren();
        for(Units u: unitList){
            String rackName=u.getDescription();
            if(!rackList.containsKey(rackName)){
                rackList.put(rackName,new ArrayList<>());
            }
            rackList.get(rackName).add(u);
        }

//        UnitsGroup unitsGroup=units.getUnitsGroup();
//        for(Units u:unitsGroup.getUnitsList()){
//            String rackName=u.getAttributes().getRelayAttributes().getRack();
//            if(!rackList.containsKey(rackName)){
//                rackList.put(rackName,new ArrayList<>());
//            }
//            rackList.get(rackName).add(u);
//        }
        for(String key:rackList.keySet()){
            Fragment fragment=UrPageFragment.newInstance(key,"");
            fragments.add(fragment);
            tabLayout.addTab(tabLayout.newTab().setText(key));
            ((UrPageFragment) fragment).setUnitList(rackList.get(key));

        }
/*
        for(int i=0;i<10;i++){
            String text="Rack "+ (i+1);
            fragments.add(UrPageFragment.newInstance(text,""));
            tabLayout.addTab(tabLayout.newTab().setText(text));
        }
*/
        tabLayout.setTabGravity(TabLayout.GRAVITY_FILL);
        final UrPageAdapter adapter=new UrPageAdapter(this,getSupportFragmentManager(),fragments);
        viewPager.setAdapter(adapter);
        viewPager.addOnPageChangeListener(new TabLayout.TabLayoutOnPageChangeListener(tabLayout));

        tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener(){
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                viewPager.setCurrentItem(tab.getPosition());
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {

            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {

            }
        });
    }
    @Override
    public boolean onSupportNavigateUp() {
        //code it to launch an intent to the activity you want
        finish();
        return true;
    }
    private class UnitSubGroup{
        //rack is unit sub group

    }
}