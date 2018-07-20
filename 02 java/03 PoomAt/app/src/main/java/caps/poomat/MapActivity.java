package caps.poomat;

import android.location.Address;
import android.location.Geocoder;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.widget.Toast;

import com.afollestad.materialdialogs.DialogAction;
import com.afollestad.materialdialogs.MaterialDialog;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapFragment;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.UiSettings;
import com.google.android.gms.maps.model.LatLng;

import java.util.List;

/**
 * Created by Hyeon on 2016-04-25.
 */
public class MapActivity extends AppCompatActivity implements OnMapReadyCallback {
    private MaterialDialog materialDialog;
    private MapFragment mapFragment;
    private String address;
    @Override
    public void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maps);
        Toast.makeText(MapActivity.this, "꾹~눌러서 위치를 검색합니다!", Toast.LENGTH_SHORT).show();

        mapFragment = (MapFragment)getFragmentManager().findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);
    }
    @Override
    public void onMapReady(GoogleMap map){
        map.setMyLocationEnabled(true);
        UiSettings uiSettings = map.getUiSettings();
        uiSettings.setCompassEnabled(true);
        uiSettings.setZoomControlsEnabled(true);
        //uiSettings.setMyLocationButtonEnabled(true);
        map.setOnMapLongClickListener(new GoogleMap.OnMapLongClickListener() {
            @Override
            public void onMapLongClick(final LatLng latLng) {
                new ReverseGeocodingTask().execute(latLng);
            }
        });
    }
    private class ReverseGeocodingTask extends AsyncTask<LatLng, Void, LatLng> {
        public ReverseGeocodingTask(){
            super();
        }
        // Finding address using reverse geocoding
        @Override
        protected LatLng doInBackground(LatLng... params) {
            Geocoder geocoder = new Geocoder(MapActivity.this);
            double latitude = params[0].latitude;
            double longitude = params[0].longitude;

            List<Address> addresses = null;

            try {
                addresses = geocoder.getFromLocation(latitude, longitude,1);
                address = addresses.get(0).getAddressLine(0);

            }
            catch (Exception e) {
                e.printStackTrace();
            }
            return params[0];
        }
        @Override
        protected void onPostExecute(final LatLng latLng) {
            materialDialog = new MaterialDialog.Builder(MapActivity.this)
                    .title("현재 위치로 설정하시겠습니까?")
                    .titleColorRes(R.color.navy)
                    .content(address)
                    .positiveText("설정하기")
                    .positiveColorRes(R.color.navy)
                    .negativeText("다시하기")
                    .negativeColorRes(R.color.navy)
                    .onPositive(new MaterialDialog.SingleButtonCallback() {
                        @Override
                        public void onClick(MaterialDialog materialDialog, DialogAction dialogAction) {
                            UserInfo.setUserLat(latLng.latitude);
                            UserInfo.setUserLng(latLng.longitude);
                            materialDialog.dismiss();
                            finish();
                        }
                    })
                    .onNegative(new MaterialDialog.SingleButtonCallback() {
                        @Override
                        public void onClick(MaterialDialog materialDialog, DialogAction dialogAction) {
                            materialDialog.dismiss();
                        }
                    })
                    .show();
            materialDialog.setCanceledOnTouchOutside(false);
            materialDialog.setCancelable(false);
        }
    }
}
