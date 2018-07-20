package caps.poomat.FragmentManagement;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.facebook.drawee.view.SimpleDraweeView;

import java.util.List;

import caps.poomat.FoodItemActivity;
import caps.poomat.FragmentMap.FoodModel;
import caps.poomat.FragmentSearch.FragmentSearchAdapter;
import caps.poomat.NetWork.SearchFromUserId;
import caps.poomat.R;
import caps.poomat.UserInfo;

/**
 * Created by Hyeon on 2016-05-25.
 */
public class FragmentNestedOne extends Fragment {
    private View rootView;
    private RecyclerView registedRecycler;
    private SimpleDraweeView userProfileImage;
    private TextView registedCountText,userName;
    private GridLayoutManager layoutManager;

    private FragmentSearchAdapter adapter;
    @Override
    public View onCreateView(LayoutInflater inflater,ViewGroup container,Bundle savedInstanceState){
        rootView = inflater.inflate(R.layout.fragment_management_nested_one,container,false);

        userProfileImage = (SimpleDraweeView)rootView.findViewById(R.id.userProfileImage);
        userName = (TextView)rootView.findViewById(R.id.userName);

        registedRecycler = (RecyclerView)rootView.findViewById(R.id.userRegistedRecycler);
        registedCountText = (TextView)rootView.findViewById(R.id.userRegistedCount);


        userName.setText(UserInfo.getNickName());
        userProfileImage.setImageURI(Uri.parse(UserInfo.getThumbNailUrl()));

        layoutManager = new GridLayoutManager(getContext(),2);

        registedRecycler.setLayoutManager(layoutManager);
        return  rootView;
    }
    @Override
    public void onResume(){
        super.onResume();

        SearchFromUserId searchFromUserId = new SearchFromUserId();
        searchFromUserId.setFinishCallBack(new SearchFromUserId.FinishCallBack() {
            @Override
            public void onFinish(List<FoodModel> dataSet) {
                adapter = new FragmentSearchAdapter(dataSet);
                registedCountText.setText("등록" + " " + dataSet.size());
                adapter.setOnClickCallBack(new FragmentSearchAdapter.OnClickCallBack() {
                    @Override
                    public void onClick(FoodModel model) {
                        Intent intent = new Intent(getContext(), FoodItemActivity.class);
                        intent.putExtra("foodData",model);
                        startActivity(intent);
                    }
                });
                registedRecycler.setAdapter(adapter);
            }
        });
        searchFromUserId.execute();
    }
}
