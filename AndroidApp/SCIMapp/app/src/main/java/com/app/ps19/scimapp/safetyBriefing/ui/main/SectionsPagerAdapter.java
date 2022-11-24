package com.app.ps19.scimapp.safetyBriefing.ui.main;

import android.content.Context;
import androidx.annotation.Nullable;
import androidx.annotation.StringRes;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;

import com.app.ps19.scimapp.R;
import com.app.ps19.scimapp.safetyBriefing.BriefingFragment;
import com.app.ps19.scimapp.safetyBriefing.CommentsFragment;
import com.app.ps19.scimapp.safetyBriefing.WorkerFragment;

/**
 * A [FragmentPagerAdapter] that returns a fragment corresponding to
 * one of the sections/tabs/pages.
 */
public class SectionsPagerAdapter extends FragmentPagerAdapter {

    @StringRes
    private static final int[] TAB_TITLES = new int[]{R.string.safety_briefing_tab_text_1, R.string.safety_briefing_tab_text_2, R.string.safety_briefing_tab_text_3};
    private final Context mContext;

    public SectionsPagerAdapter(Context context, FragmentManager fm) {
        super(fm);
        mContext = context;
    }

    @Override
    public Fragment getItem(int position) {
        // getItem is called to instantiate the fragment for the given page.
        // Return a PlaceholderFragment (defined as a static inner class below).
        switch (position){
            case 0:
                return BriefingFragment.newInstance("First", "Briefing");
            //AssetFragment.newInstance("First", "Units");//
            case 1:
                return WorkerFragment.newInstance("Second","Worker");
            case 2:
                return CommentsFragment.newInstance("Third", "Comments");
        }
        return PlaceholderFragment.newInstance(position + 1);
    }

    @Nullable
    @Override
    public CharSequence getPageTitle(int position) {
        return mContext.getResources().getString(TAB_TITLES[position]);
    }

    @Override
    public int getCount() {
        // Show 2 total pages.
        return 3;
    }
}