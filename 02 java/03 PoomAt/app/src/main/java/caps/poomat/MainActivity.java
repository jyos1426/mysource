package caps.poomat;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentStatePagerAdapter;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.ImageView;

import com.astuetz.PagerSlidingTabStrip;

import caps.poomat.FragmentManagement.FragmentManagement;
import caps.poomat.FragmentMap.FragmentMap;
import caps.poomat.FragmentSearch.FragmentSearch;


public class MainActivity extends AppCompatActivity{
    private FragmentMap fragmentMap;
    private FragmentSearch fragmentSearch;
    private FragmentManagement fragmentManagement;

    private ImageView topIcon;
    private PagerSlidingTabStrip tab;
    private MainAdapter adapter;
    private ViewPager viewPager;

    public static final int showMapMode = 0;
    public static final int showFoodMode = 1;

    public static int showModeState;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        showModeState = showFoodMode;
        fragmentMap = new FragmentMap();
        fragmentSearch= new FragmentSearch();
        fragmentManagement = new FragmentManagement();


        adapter = new MainAdapter(getSupportFragmentManager());

        tab = (PagerSlidingTabStrip)findViewById(R.id.main_tab);
        viewPager =(ViewPager)findViewById(R.id.main_viewPager);

        viewPager.setAdapter(adapter);
        viewPager.addOnPageChangeListener(new ViewPager.OnPageChangeListener() {
            @Override
            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {

            }
            @Override
            public void onPageSelected(int position) {
                if(position != 0){
                    topIcon.setVisibility(View.GONE);
                } else {
                    topIcon.setVisibility(View.VISIBLE);
                }
            }
            @Override
            public void onPageScrollStateChanged(int state) {

            }
        });
        tab.setViewPager(viewPager);
        viewPager.setOffscreenPageLimit(3);

        topIcon = (ImageView)findViewById(R.id.main_top_icon);

        topIcon.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (showModeState == showFoodMode) {
                    topIcon.setImageResource(R.drawable.ic_gamepad);
                    fragmentMap.onChangeMode(showModeState);
                    showModeState = showMapMode;

                } else {
                    topIcon.setImageResource(R.drawable.ic_pin_drop);
                    fragmentMap.onChangeMode(showModeState);
                    showModeState = showFoodMode;
                }
            }
        });
    }
    public class MainAdapter extends FragmentStatePagerAdapter implements PagerSlidingTabStrip.IconTabProvider {
        private final int[] ICONS = {R.drawable.ic_location,R.drawable.ic_search,R.drawable.ic_person};

        public MainAdapter(FragmentManager fm){
            super(fm);
        }
        @Override
        public int getCount(){
            return ICONS.length;
        }
        @Override
        public int getPageIconResId(int position){
            return ICONS[position];
        }
        @Override
        public boolean isViewFromObject(View view,Object object){
            return view == ((Fragment)object).getView();
        }
        @Override
        public Fragment getItem(int position){
            if(position == 0){
                return fragmentMap;
            } else if(position ==1){
                return fragmentSearch;
            } else {
                return fragmentManagement;
            }
        }
    }

}

