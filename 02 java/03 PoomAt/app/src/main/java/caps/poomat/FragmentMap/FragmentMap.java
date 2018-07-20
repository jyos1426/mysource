package caps.poomat.FragmentMap;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.app.Fragment;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.facebook.drawee.view.SimpleDraweeView;
import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapFragment;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;

import java.util.ArrayList;
import java.util.List;

import caps.poomat.FoodItemActivity;
import caps.poomat.LocationService;
import caps.poomat.MainActivity;
import caps.poomat.MapActivity;
import caps.poomat.NetWork.SearchFromLocation;
import caps.poomat.R;
import caps.poomat.Register.RegisterActivity;

/**
 * Created by Hyeon on 2016-05-25.
 */
public class FragmentMap extends Fragment implements OnMapReadyCallback {
    private View rootView;
    private TextView locationSearcher;
    private TextView noItemShowText;
    private RecyclerView recyclerView;
    private FloatingActionButton fab;
    private ProgressBar progressBar;
    private FragmentMapAdapter adapter;
    private GridLayoutManager layoutManager;
    private MapFragment mapFragment;
    private RelativeLayout relativeLayout;
    private List<FoodModel> models = new ArrayList<>();
    private SimpleDraweeView foodImage;
    private TextView foodName,foodBuyDate,userLatitude;

    @Override
    public View onCreateView(LayoutInflater inflater,ViewGroup container,Bundle savedInstanceState){
        rootView = inflater.inflate(R.layout.fragment_map,container,false);

        LocationService.getInstance(getContext()).detectLocation();
        locationSearcher = (TextView)rootView.findViewById(R.id.fragment_map_textview);
        relativeLayout = (RelativeLayout)rootView.findViewById(R.id.map_rela);
        relativeLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getContext(),FoodItemActivity.class);
                for(FoodModel model : models){
                    String latitude = model.getLatitude()+"";
                    if(latitude.equals(userLatitude.getText().toString())){
                        intent.putExtra("foodData", model);
                    }
                }

                startActivity(intent);
            }
        });
        recyclerView = (RecyclerView)rootView.findViewById(R.id.fragment_map_recycler);
        noItemShowText = (TextView)rootView.findViewById(R.id.fragment_map_no_text);

        foodImage = (SimpleDraweeView)rootView.findViewById(R.id.foodImage);
        foodName = (TextView)rootView.findViewById(R.id.foodName);
        userLatitude = (TextView)rootView.findViewById(R.id.userId);
        foodBuyDate = (TextView)rootView.findViewById(R.id.foodBuyDate);

        layoutManager = new GridLayoutManager(getContext(),2);

        recyclerView.setLayoutManager(layoutManager);

        fab = (FloatingActionButton)rootView.findViewById(R.id.fragment_fab);

        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                navigateToRegister();
            }
        });

        locationSearcher.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(getActivity(), MapActivity.class));
            }
        });


        mapFragment = (MapFragment)getActivity().getFragmentManager().findFragmentById(R.id.main_maps);

        mapFragment.getMapAsync(this);

        relativeLayout.setVisibility(View.GONE);

        return rootView;
    }
    @Override
    public void onMapReady(GoogleMap map){
        map.setMyLocationEnabled(true);

        CameraUpdate center = CameraUpdateFactory.newLatLngZoom(new LatLng(LocationService.getInstance(getContext()).getLatitude(),LocationService.getInstance(getContext()).getLongitude()), 15);
        for(int i =0 ; i< models.size(); i++){
            LatLng latLng = new LatLng(models.get(i).getLatitude(),models.get(i).getLongitude());

            map.addMarker(new MarkerOptions().position(latLng).title(models.get(i).getFoodName()));

            map.setOnMarkerClickListener(new GoogleMap.OnMarkerClickListener() {
                @Override
                public boolean onMarkerClick(Marker marker) {
                    for(FoodModel model : models){
                        if(marker.getTitle().equals(model.getFoodName())){
                            foodImage.setImageURI(Uri.parse(model.getFoodImagePath()));
                            foodName.setText(model.getFoodName());
                            foodBuyDate.setText("구매일 : " + model.getDate());
                            userLatitude.setText(model.getLatitude()+"");
                        }
                    }
                    return false;
                }
            });
        }
        map.moveCamera(center);

    }
    @Override
    public void onResume(){
        super.onResume();

        SearchFromLocation searchFromLocation = new SearchFromLocation();
        searchFromLocation.setFinishCallBack(new SearchFromLocation.FinishCallBack() {
            @Override
            public void onFinish(List<FoodModel> dataSet) {
                adapter = new FragmentMapAdapter(dataSet);
                models = dataSet;
                adapter.setOnClickCallBack(new FragmentMapAdapter.OnClickCallBack() {
                    @Override
                    public void onClick(FoodModel model) {
                        Intent intent = new Intent(getContext(), FoodItemActivity.class);
                        intent.putExtra("foodData",model);
                        startActivity(intent);
                    }
                });
                recyclerView.setAdapter(adapter);

                if(adapter.getItemCount() != 0){
                    noItemShowText.setVisibility(View.GONE);
                } else {
                    noItemShowText.setVisibility(View.VISIBLE);
                }
            }
        });

        searchFromLocation.execute();
    }
    public void navigateToRegister(){
        startActivity(new Intent(getActivity(), RegisterActivity.class));
    }
    public void onChangeMode(int showMode){
        if(showMode == MainActivity.showFoodMode){
            relativeLayout.setVisibility(View.VISIBLE);
            fab.setVisibility(View.INVISIBLE);
            mapFragment.getMapAsync(this);
        } else{
            relativeLayout.setVisibility(View.GONE);
            fab.setVisibility(View.VISIBLE);
        }
    }

}
