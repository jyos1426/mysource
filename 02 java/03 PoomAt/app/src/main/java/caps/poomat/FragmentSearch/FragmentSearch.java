package caps.poomat.FragmentSearch;

import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentStatePagerAdapter;
import android.support.v4.view.ViewPager;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.astuetz.PagerSlidingTabStrip;

import java.util.List;

import caps.poomat.FoodItemActivity;
import caps.poomat.FragmentMap.FoodModel;
import caps.poomat.NetWork.SearchFromCase;
import caps.poomat.NetWork.SearchFromName;
import caps.poomat.R;
import caps.poomat.Register.RegisterActivity;

/**
 * Created by Hyeon on 2016-05-25.
 */
public class FragmentSearch extends Fragment{
    private View rootView;
    private String[] titles={"이름 검색","분류 검색"};
    private PagerSlidingTabStrip tab;
    private ViewPager viewPager;
    private SearchAdapter adapter;
    private Button searchButton;
    private GridLayoutManager layoutManager;
    private TextView searchItemText;
    private FloatingActionButton searchFab;
    private RecyclerView searchRecycler;
    private RelativeLayout searchRelative;
    private FragmentSearchAdapter searchAdapter;

    public FragmentNestedOne nameSearchFragment = new FragmentNestedOne();
    public FragmentNestedTwo caseSearchFragment = new FragmentNestedTwo();

    private final int searchNameFragment = 0;
    private final int searchCaseFragment = 1;
    @Override
    public void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
    }
    @Override
    public View onCreateView(LayoutInflater inflater,ViewGroup container,Bundle savedInstanceState){
        rootView = inflater.inflate(R.layout.fragment_search,container,false);

        adapter = new SearchAdapter(getChildFragmentManager());
        layoutManager = new GridLayoutManager(getContext(),2);

        searchButton = (Button)rootView.findViewById(R.id.searchButton);
        tab = (PagerSlidingTabStrip)rootView.findViewById(R.id.searchTab);
        viewPager = (ViewPager)rootView.findViewById(R.id.searchViewPager);

        searchItemText = (TextView)rootView.findViewById(R.id.searchItemText);
        searchItemText.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                searchRelative.setVisibility(View.GONE);
                searchButton.setVisibility(View.VISIBLE);
                tab.setVisibility(View.VISIBLE);
                searchAdapter = null;
            }
        });
        searchFab = (FloatingActionButton)rootView.findViewById(R.id.searchFab);
        searchFab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(getActivity(), RegisterActivity.class));
            }
        });

        searchRecycler = (RecyclerView)rootView.findViewById(R.id.searchResultRecycler);
        searchRecycler.setLayoutManager(layoutManager);

        searchRelative = (RelativeLayout)rootView.findViewById(R.id.searchResultRelative);
        searchRelative.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                searchRelative.setVisibility(View.GONE);
            }
        });
        viewPager.setAdapter(adapter);
        tab.setViewPager(viewPager);

        searchButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                switch (viewPager.getCurrentItem()){
                    case searchNameFragment:
                        nameSearchFragment.searchFromName.setFinishCallBack(new SearchFromName.FinishCallBack() {
                            @Override
                            public void onFinish(List<FoodModel> dataSet) {

                                searchAdapter = new FragmentSearchAdapter(dataSet);
                                searchAdapter.setOnClickCallBack(new FragmentSearchAdapter.OnClickCallBack() {
                                    @Override
                                    public void onClick(FoodModel model) {
                                        navigateToFoodItem(model);
                                    }
                                });
                                searchRecycler.setAdapter(searchAdapter);
                                searchItemText.setText("검색어" + " : " + nameSearchFragment.editText.getText().toString());
                                searchRelative.setVisibility(View.VISIBLE);
                                tab.setVisibility(View.INVISIBLE);
                                searchButton.setVisibility(View.INVISIBLE);
                            }
                        });
                        nameSearchFragment.searchFromName.execute(nameSearchFragment.editText.getText().toString());
                        break;
                    case searchCaseFragment:
                        caseSearchFragment.searchFromCase.setFinishCallBack(new SearchFromCase.FinishCallBack() {
                            @Override
                            public void onFinish(List<FoodModel> dataSet) {
                                searchAdapter = new FragmentSearchAdapter(dataSet);
                                searchAdapter.setOnClickCallBack(new FragmentSearchAdapter.OnClickCallBack() {
                                    @Override
                                    public void onClick(FoodModel model) {
                                        navigateToFoodItem(model);
                                    }
                                });
                                searchRecycler.setAdapter(searchAdapter);
                                searchItemText.setText("검색 카테고리" + " : " + caseSearchFragment.spinner.getSelectedItem().toString());
                                searchRelative.setVisibility(View.VISIBLE);
                                tab.setVisibility(View.INVISIBLE);
                                searchButton.setVisibility(View.INVISIBLE);
                            }
                        });
                        if(caseSearchFragment.spinner.getSelectedItemPosition() != 0) {
                            caseSearchFragment.searchFromCase.execute(caseSearchFragment.spinner.getSelectedItemPosition());
                        }
                        break;
                    default:
                        new IllegalArgumentException("viewpager argument only 0 or 1");
                }
            }
        });
        return rootView;
    }
    @Override
    public void onResume(){
        super.onResume();
        Log.d("hello","onResume"+"");
    }
    public void navigateToFoodItem(FoodModel model){
        Intent intent = new Intent(getActivity(),FoodItemActivity.class);
        intent.putExtra("foodData",model);
        startActivity(intent);
    }
    public class SearchAdapter extends FragmentStatePagerAdapter {
        public SearchAdapter(FragmentManager fm){
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
                return nameSearchFragment;
            } else{
                return caseSearchFragment;
            }
        }
    }
}
