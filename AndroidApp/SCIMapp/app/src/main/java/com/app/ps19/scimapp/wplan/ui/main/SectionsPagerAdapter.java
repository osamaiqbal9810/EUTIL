package com.app.ps19.scimapp.wplan.ui.main;

import android.content.Context;

import androidx.annotation.Nullable;
import androidx.annotation.StringRes;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;

import com.app.ps19.scimapp.R;
import com.app.ps19.scimapp.wplan.TemplateTestFragment;
import com.app.ps19.scimapp.wplan.plansFragment;

/**
 * A [FragmentPagerAdapter] that returns a fragment corresponding to
 * one of the sections/tabs/pages.
 */
public class SectionsPagerAdapter extends FragmentPagerAdapter {

    @StringRes
    private static final int[] TAB_TITLES = new int[]{R.string.select_run, R.string.view_running_task,R.string.view_run_tests};
    private final Context mContext;

    public SectionsPagerAdapter(Context context, FragmentManager fm) {
        super(fm);
        mContext = context;
    }
    @Override
    public Fragment getItem(int position) {
        // getItem is called to instantiate the fragment for the given page.
        // Return a PlaceholderFragment (defined as a static inner class below).
        switch (position) {
            case 0:
//                if(Globals.isTimpsApp()) {
//                    //return RunsFragment.newInstance("First", "Briefing");
//                }else{
                //if(Globals.testApp){
                return TemplateTestFragment.newInstance("ALL","");

            //return TemplateTestFragment.newInstance("ALL","");

            //return WPlanLocFilterFragment.newInstance("","");
            //}else{
            //   return RunsFragment.newInstance("First", "Briefing");
            //}
            //  }
            case 1:
                return plansFragment.newInstance(1);
            case 2:
                // return TemplateTestFragment.newInstance("","");
        }
        //  return PlaceholderFragment.newInstance(position + 1);
        return TemplateTestFragment.newInstance("ALL","");
    }

    @Nullable
    @Override
    public CharSequence getPageTitle(int position) {
        return mContext.getResources().getString(TAB_TITLES[position]);
    }

    @Override
    public int getCount() {
        // Show 2 total pages.
        return 2;
    }
}