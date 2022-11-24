package com.app.ps19.tipsapp.wplan.ui.main;

import android.content.Context;

import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;

import com.app.ps19.tipsapp.wplan.TemplateTestFragment;

import java.util.List;

import static com.app.ps19.tipsapp.Shared.Globals.inbox;

public class AreaFilteredSectionPagerAdapter extends FragmentPagerAdapter {

    public static List<String> LOCATION_TAB_TITLES = inbox.getJPLocationOpts().getJourneyPlansLocationsList();

    private TemplateTestFragment fragment = null;

    public AreaFilteredSectionPagerAdapter(Context context, FragmentManager fm) {
        super(fm);
    }
    @Override
    public Fragment getItem(int position) {
        // getItem is called to instantiate the fragment for the given page.
        // Return a PlaceholderFragment (defined as a static inner class below).

        if (fragment == null){
            fragment = TemplateTestFragment.newInstance("ALL", "");
        }

        return fragment;
    }

    @Nullable
    @Override
    public CharSequence getPageTitle(int position) {
        return LOCATION_TAB_TITLES.get(position);
    }

    @Override
    public int getCount() {
        refresh();
        return LOCATION_TAB_TITLES.size();
    }


    public void refresh(){

        LOCATION_TAB_TITLES = inbox.getJPLocationOpts().getJourneyPlansLocationsList();;
    }

}
