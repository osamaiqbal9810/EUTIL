package com.app.ps19.scimapp.unitsGroup;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;

import java.util.List;

public class UrPageAdapter extends FragmentPagerAdapter {
    private Context context;
    private int totalTabs;
    private List<Fragment> fragmentList;

    public void setFragmentList(List<Fragment> fragmentList) {
        this.fragmentList = fragmentList;
    }

    public List<Fragment> getFragmentList() {
        return fragmentList;
    }
    public UrPageAdapter(Context context, FragmentManager fm, List<Fragment> fragments){
        super(fm,BEHAVIOR_RESUME_ONLY_CURRENT_FRAGMENT);
        this.fragmentList=fragments;
        this.context=context;

    }
    public UrPageAdapter(@NonNull FragmentManager fm, int behavior) {
        super(fm, behavior);
    }
  /*  public UrPageAdapter(Context context,@NonNull FragmentManager fm, int totalTabs) {
        super(fm);
        this.context=context;
        this.totalTabs=totalTabs;
    }*/

    @NonNull
    @Override
    public Fragment getItem(int position) {
        return fragmentList.get(position);
    }

    @Override
    public int getCount() {
        return fragmentList.size();
    }
}
