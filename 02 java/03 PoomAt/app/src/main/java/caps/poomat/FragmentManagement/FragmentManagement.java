package caps.poomat.FragmentManagement;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentStatePagerAdapter;
import android.support.v4.view.ViewPager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.astuetz.PagerSlidingTabStrip;

import caps.poomat.R;

/**
 * Created by Hyeon on 2016-05-25.
 */
public class FragmentManagement extends Fragment {
    private View rootView;

    private ManagementAdapter adapter;
    private PagerSlidingTabStrip tab;
    private ViewPager viewPager;

    private String[] titles = {"품앗이 관리","대화보기"};
    private FragmentNestedOne fragmentNestedOne = new FragmentNestedOne();
    private FragmentNestedTwo fragmentNestedTwo = new FragmentNestedTwo();
    @Override
    public View onCreateView(LayoutInflater inflater,ViewGroup container,Bundle savedInstanceState){
        rootView = inflater.inflate(R.layout.fragment_management,container,false);

        tab = (PagerSlidingTabStrip)rootView.findViewById(R.id.manageTab);
        viewPager = (ViewPager)rootView.findViewById(R.id.manageViewPager);
        adapter = new ManagementAdapter(getChildFragmentManager());
        viewPager.setAdapter(adapter);
        tab.setViewPager(viewPager);

        return rootView;
    }
    @Override
    public void onResume(){
        super.onResume();
    }

    public class ManagementAdapter extends FragmentStatePagerAdapter {
        public ManagementAdapter(FragmentManager fm){
            super(fm);
        }
        @Override
        public int getCount(){
            return titles.length;
        }
        @Override
        public CharSequence getPageTitle(int position) {
            return titles[position];
        }
        @Override
        public Fragment getItem(int position){
            if(position == 0){
                return fragmentNestedOne;
            } else{
                return fragmentNestedTwo;
            }
        }
    }
}
