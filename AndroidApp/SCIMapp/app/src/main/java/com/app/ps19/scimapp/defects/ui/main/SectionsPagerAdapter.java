package com.app.ps19.scimapp.defects.ui.main;

import android.content.Context;

import androidx.annotation.Nullable;
import androidx.annotation.StringRes;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;

import com.app.ps19.scimapp.R;
import com.app.ps19.scimapp.defects.PreviousIssuesFragment;
import com.app.ps19.scimapp.defects.RecentIssuesFragment;

/**
 * A [FragmentPagerAdapter] that returns a fragment corresponding to
 * one of the sections/tabs/pages.
 */
public class SectionsPagerAdapter extends FragmentPagerAdapter {

    @StringRes
    private static final int[] TAB_TITLES = new int[]{R.string.tab_text_defects_new, R.string.tab_text_defects_old};
    private final Context mContext;
    private String unitId;
    int TotalPageCount = 0;
    int newissueCount =0;
    int oldIssueCount =0;

    public SectionsPagerAdapter(Context context, FragmentManager fm, String id, int newIssue, int oldIssue) {
        super(fm);
        mContext = context;
        unitId = id;
        if(newIssue > 0 && oldIssue > 0){
            TotalPageCount = 2;
        }
        else if (newIssue > 0 || oldIssue > 0){
            TotalPageCount = 1;
        }
        newissueCount = newIssue;
        oldIssueCount = oldIssue;
    }

    @Override
    public Fragment getItem(int position) {
        // getItem is called to instantiate the fragment for the given page.
        // Return a PlaceholderFragment (defined as a static inner class below).
        switch (position){
            case 0:
                if(newissueCount > 0) {
                    return RecentIssuesFragment.newInstance("First", "#2E3192");
                }
                else {
                    return PreviousIssuesFragment.newInstance(unitId, "#2E3192");
                }
            case 1:
                return PreviousIssuesFragment.newInstance(unitId, "#2E3192");
        }
        return PlaceholderFragment.newInstance(position + 1);
    }


    @Nullable
    @Override
    public CharSequence getPageTitle(int position) {
        if( newissueCount == 0 && oldIssueCount > 0){
            return mContext.getResources().getString(TAB_TITLES[1]);
        }
        else {
            return mContext.getResources().getString(TAB_TITLES[position]);
        }
    }

    @Override
    public int getCount() {
        // Show 2 total pages.
        return TotalPageCount;
    }
}