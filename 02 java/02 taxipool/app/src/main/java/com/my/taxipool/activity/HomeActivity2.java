package com.my.taxipool.activity;

import android.Manifest;
import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.app.AlertDialog;
import android.app.Dialog;
import android.app.TimePickerDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.location.Address;
import android.location.Geocoder;
import android.os.Bundle;
import android.os.Handler;
import android.support.annotation.NonNull;
import android.support.v4.app.FragmentManager;
import android.support.v4.content.ContextCompat;
import android.support.v4.view.GravityCompat;
import android.support.v7.app.ActionBarDrawerToggle;
import android.text.Html;
import android.text.Spanned;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.TimePicker;
import android.widget.Toast;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.common.GooglePlayServicesNotAvailableException;
import com.google.android.gms.common.GooglePlayServicesRepairableException;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.location.places.Place;
import com.google.android.gms.location.places.Places;
import com.google.android.gms.location.places.ui.PlaceAutocomplete;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.MarkerOptions;
import com.my.taxipool.R;
import com.my.taxipool.util.ImageResourceUtil;
import com.my.taxipool.view.InputCustomView;
import com.my.taxipool.vo.Room;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;

public class HomeActivity2 extends BaseActivity
        implements GoogleMap.OnCameraIdleListener, OnMapReadyCallback,GoogleApiClient.OnConnectionFailedListener {

    private Room room= new Room();

    //For Input Views
    private LinearLayout layout_inputs;
    private InputCustomView
            view_spot_from,
            view_spot_to,
            view_time;
    private Button btn_home;
    private Spinner home_spinner;

    private Boolean[] issetted = new Boolean[2];
    private Boolean[] valuecheck = new Boolean[3];
    //0은 출발 inputview, 1은 도착 inputview
    private  Boolean flag_fromto = false;

    // Marker and Map
    MarkerOptions markeropt_start;
    MarkerOptions markeropt_end;
    HashMap<String,MarkerOptions> hashMapMarker = new HashMap<>();

    ImageView img_marker;

    private GoogleMap googleMap;
    private SupportMapFragment mapFragment;

    //Autocomplete
    private GoogleApiClient mGoogleApiClient;
    private static final int PLACE_AUTOCOMPLETE_TO = 0;
    private static final int PLACE_AUTOCOMPLETE_FROM = 1;

    //Hidden View
    private RelativeLayout layout_hidden_spot;
    private InputCustomView view_hidden_spot;
    private Button btn_hidden;
    private RelativeLayout layout_input_showmap;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home2);

        /* Google map start */
        FragmentManager manager = getSupportFragmentManager();
        mapFragment = (SupportMapFragment)manager.findFragmentById(R.id.map_home);
        mapFragment.getMapAsync(this);//지도준비가 되면 onMapReady()가 자동호출됨
        /* Google map end */

        /* Autocomplete start */
        mGoogleApiClient = new GoogleApiClient
                .Builder(this)
                .addApi(Places.GEO_DATA_API)
                .addApi(Places.PLACE_DETECTION_API)
                .enableAutoManage(this, this)
                .build();
        /* Autocomplete end*/

        issetted[0] = false;
        issetted[1] = false;
        valuecheck[0]=false;
        valuecheck[1]=false;
        valuecheck[2]=false;

        setViewIds();
        setViews();
    }

    private void setViewIds(){
        //For Input Views
        layout_inputs = (LinearLayout) findViewById(R.id.layout_inputs);
        view_spot_from = (InputCustomView) findViewById(R.id.view_spot_from);
        view_spot_to = (InputCustomView) findViewById(R.id.view_spot_to);
        view_time = (InputCustomView) findViewById(R.id.view_time);
        home_spinner = (Spinner) findViewById(R.id.home_spinner);

        btn_home = (Button)  findViewById(R.id.btn_home);

        //Marker
        img_marker = (ImageView) findViewById(R.id.img_pin);

        //Hidden Views
        layout_hidden_spot = (RelativeLayout) findViewById(R.id.layout_hidden_spot);
        view_hidden_spot = (InputCustomView) findViewById(R.id.view_hidden_spot);
        btn_hidden = (Button) findViewById(R.id.btn_hidden);
        layout_input_showmap = (RelativeLayout) findViewById(R.id.layout_input_showmap);
    }

    private void setViews() {
        //Set clicklistener about input
        view_spot_from.setOnClickListener(input_click_listener);
        view_spot_to.setOnClickListener(input_click_listener);

        //Set basic clicklistener
        view_time.setOnClickListener(basic_click_listener);
        btn_home.setOnClickListener(basic_click_listener);

        btn_hidden.setOnClickListener(basic_click_listener);
        layout_input_showmap.setOnClickListener(basic_click_listener);
        view_hidden_spot.setOnClickListener(basic_click_listener);

    }

    @Override
    public void setUpToolBar(){
        setSupportActionBar(toolbar);

        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawerLayout, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawerLayout.setDrawerListener(toggle);
        toggle.syncState();

        toolbar_rightbtn.setImageResource(R.drawable.ic_search_black_24dp);
        toolbar_rightbtn.setOnClickListener(
                new View.OnClickListener(){
                    @Override
                    public void onClick(View v) {
                        openAutocompleteActivity(flag_fromto);
                    }
                }
        );
    }

    @Override
    public void onCameraIdle() {
        LatLng latLng = googleMap.getCameraPosition().target;
        String title = getmarkerAddress(latLng);
        view_hidden_spot.setRightLabel(title);
    }

    @Override
    public void onMapReady(final GoogleMap googleMap) {
        this.googleMap = googleMap;
        LatLng init = new LatLng(37.56, 126.97);
        googleMap.moveCamera(CameraUpdateFactory.newLatLng(init));
        googleMap.animateCamera(CameraUpdateFactory.zoomTo(15));
        googleMap.setOnCameraIdleListener(this);

        ImageResourceUtil util = new ImageResourceUtil();
        Bitmap bitmap_icon_from = util.getBitmap(HomeActivity2.this,R.mipmap.ic_from);
        bitmap_icon_from = resizeMapIcons(bitmap_icon_from,100,100);
        Bitmap bitmap_icon_to = util.getBitmap(HomeActivity2.this,R.mipmap.ic_to);
        bitmap_icon_to = resizeMapIcons(bitmap_icon_to,100,100);

        markeropt_start = new MarkerOptions();
        markeropt_end = new MarkerOptions();
        markeropt_start.title("출발지")
                .snippet(room.getStart_spot())
                .icon(BitmapDescriptorFactory.fromBitmap(bitmap_icon_from));
        markeropt_end.title("도착지")
                .snippet(room.getEnd_spot())
                .icon(BitmapDescriptorFactory.fromBitmap(bitmap_icon_to));

        /* for current location */
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                == PackageManager.PERMISSION_GRANTED) {
            googleMap.setMyLocationEnabled(true);
        } else {
            view_hidden_spot.setRightLabel("GPS 권한설정이 필요합니다");
        }
    }

    public String getmarkerAddress(LatLng latLng){
        // GPS를 주소로 변환후 반환
        Geocoder geocoder = new Geocoder(this, Locale.getDefault());
        List<Address> addresses;
        try {
            addresses = geocoder.getFromLocation(
                    latLng.latitude,
                    latLng.longitude,
                    1);
        } catch (IOException ioException) {
            //네트워크 문제
            return "네트워크를 확인해주세요";
        } catch (IllegalArgumentException illegalArgumentException) {
            Toast.makeText(this, "잘못된 GPS 좌표", Toast.LENGTH_LONG).show();
            return "GPS 좌표가 잘못되었습니다";
        }

        if (addresses == null || addresses.size() == 0) {
            return "주소를 발견하지 못했습니다";
        } else {
            Address address = addresses.get(0);
            return address.getAddressLine(0).toString();
        }
    }


    private boolean backPressedToExitOnce = false;
    @Override
    public void onBackPressed() {
        if (backPressedToExitOnce) {
            super.onBackPressed();
        }else{
            this.backPressedToExitOnce = true;
            new Handler().postDelayed(new Runnable() {
                @Override
                public void run() {
                    backPressedToExitOnce = false;
                }
            }, 500);
            if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
                drawerLayout.closeDrawer(GravityCompat.START);
            }else if(layout_inputs.getVisibility() == View.GONE){
                googleMap.clear();
                showInputs(true);
            }else if(layout_inputs.getVisibility() == View.VISIBLE){
                showInputs(false);
            }else{
                super.onBackPressed();
            }
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        this.backPressedToExitOnce = false;
    }

    private void openAutocompleteActivity(Boolean flag_from_to) {
        try {
            Intent intent = new PlaceAutocomplete.IntentBuilder(PlaceAutocomplete.MODE_OVERLAY).build(this);
            startActivityForResult(intent, PLACE_AUTOCOMPLETE_FROM);
        } catch (GooglePlayServicesRepairableException e) {
            GoogleApiAvailability.getInstance().getErrorDialog(this, e.getConnectionStatusCode(),
                    0 /* requestCode */).show();
        } catch (GooglePlayServicesNotAvailableException e) {
            String message = "Google Play Services is not available: " +
                    GoogleApiAvailability.getInstance().getErrorString(e.errorCode);
            Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == RESULT_OK) {
            Place place = PlaceAutocomplete.getPlace(this, data);
            googleMap.moveCamera(CameraUpdateFactory.newLatLng(place.getLatLng()));
            googleMap.animateCamera(CameraUpdateFactory.zoomTo(15));
        }else if (resultCode == PlaceAutocomplete.RESULT_ERROR) {
            Status status = PlaceAutocomplete.getStatus(this, data);
        } else if (resultCode == RESULT_CANCELED) {
        }
    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {
    }

    public View.OnClickListener input_click_listener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            int id = v.getId();
            switch (id) {
                case R.id.view_spot_from:
                    flag_fromto = false;
                    if(issetted[0]){
                        showDialogForChangePin(HomeActivity2.this);
                    }else{
                        showInputs(false);
                    }
                    break;
                case R.id.view_spot_to:
                    flag_fromto = true;
                    if(issetted[1]){
                        showDialogForChangePin(HomeActivity2.this);
                    }else{
                        showInputs(false);
                    }
                    break;
            }
        }
    };

    public View.OnClickListener basic_click_listener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            Intent intent;
            switch (v.getId()) {
                case R.id.view_time:
                    final int DIALOG_TIME = 2;
                    showDialog(DIALOG_TIME);
                    break;
                case R.id.btn_home:
                            if (!valuecheck[0]) {
                                Toast.makeText(HomeActivity2.this, "출발지를 지정해주세요", Toast.LENGTH_SHORT).show();
                            } else if (!valuecheck[1]) {
                                Toast.makeText(HomeActivity2.this, "도착지를 지정해주세요", Toast.LENGTH_SHORT).show();
                            } else if (!valuecheck[2]) {
                                Toast.makeText(HomeActivity2.this, "출발시간을 지정해주세요", Toast.LENGTH_SHORT).show();
                            }else {
                                intent = new Intent(HomeActivity2.this, RoomListActivity.class);
                                room.setCurrent_cnt(home_spinner.getSelectedItemPosition() + 1);
                                intent.putExtra("object", room);
                                startActivity(intent);
                            }
                    break;
                case R.id.btn_hidden:
                    LatLng latLng = googleMap.getCameraPosition().target;
                    if(!flag_fromto){   //출발지 설정
                        room.setStart_spot(view_hidden_spot.getRightLabel());
                        room.setStart_lat(latLng.latitude);
                        room.setStart_lon(latLng.longitude);
                        markeropt_start
                                .position(latLng)
                                .snippet(room.getStart_spot());
                        hashMapMarker.put("start",markeropt_start);
                        view_spot_from.setRightLabel(room.getStart_spot());
                        view_spot_from.setRightColor(R.color.black);
                        issetted[0]= true;
                        valuecheck[0] = true;
                    }else{
                        room.setEnd_spot(view_hidden_spot.getRightLabel());
                        room.setEnd_lat(latLng.latitude);
                        room.setEnd_lon(latLng.longitude);
                        markeropt_end
                                .position(latLng)
                                .snippet(room.getEnd_spot());
                        hashMapMarker.put("end",markeropt_end);
                        view_spot_to.setRightLabel(room.getEnd_spot());
                        view_spot_to.setRightColor(R.color.black);
                        issetted[1]= true;
                        valuecheck[1] = true;
                    }
                    showInputs(true);
                    break;
                case R.id.view_hidden_spot:
                    openAutocompleteActivity(flag_fromto);
                    break;
                case R.id.layout_input_showmap:
                    showMap();
                    break;
            }
        }
    };


//    custom methods
    private void showInputs(boolean flag){
        //true = VISIBLE, false = GONE
        if(flag){
            layout_inputs.setTranslationY(layout_inputs.getHeight());
            layout_inputs.setVisibility(View.GONE);
            toolbar_rightbtn.setVisibility(View.GONE);
            layout_inputs.animate()
                    .translationYBy(-layout_inputs.getHeight())
                    .setDuration(500)
                    .setStartDelay(400)
                    .setListener(new AnimatorListenerAdapter() {
                        @Override
                        public void onAnimationStart(final Animator animation) {
                            layout_inputs.setVisibility(View.VISIBLE);
                            layout_hidden_spot.setVisibility(View.GONE);
                            if(issetted[0]&&issetted[1]){
                                layout_input_showmap.setVisibility(View.VISIBLE);
                            }
                        }
                    })
                    .start();
        }else{
            LatLng latLng = googleMap.getCameraPosition().target;
            String title = getmarkerAddress(latLng);
            view_hidden_spot.setRightLabel(title);
            layout_inputs.animate()
                    .translationY(layout_inputs.getHeight())
                    .setDuration(400)
                    .setListener(new AnimatorListenerAdapter() {
                        @Override
                        public void onAnimationEnd(Animator animation) {
                            super.onAnimationEnd(animation);
                            layout_inputs.setVisibility(View.GONE);
                            layout_hidden_spot.setVisibility(View.VISIBLE);
                            toolbar_rightbtn.setVisibility(View.VISIBLE);
                            if(!flag_fromto){
                                img_marker.setImageResource(R.mipmap.ic_from);
                                view_hidden_spot.setLeftLabel("출발지");
                            }else{
                                img_marker.setImageResource(R.mipmap.ic_to);
                                view_hidden_spot.setLeftLabel("도착지");
                            }
                        }
                    });
        }
    }

    private void showMap(){
        layout_inputs.animate()
                .translationY(layout_inputs.getHeight())
                .setDuration(400)
                .setListener(new AnimatorListenerAdapter() {
                    @Override
                    public void onAnimationEnd(Animator animation) {
                        super.onAnimationEnd(animation);
                        layout_inputs.setVisibility(View.GONE);
                        layout_hidden_spot.setVisibility(View.GONE);
                    }
                });

        googleMap.clear();
        LatLngBounds.Builder builder = new LatLngBounds.Builder();
        boolean flag_start = false;
        boolean flag_end = false;
        if(hashMapMarker.containsKey("start")){
            googleMap.addMarker(hashMapMarker.get("start"));
            builder.include(hashMapMarker.get("start").getPosition());
            flag_start = true;
        }
        if(hashMapMarker.containsKey("end")) {
            googleMap.addMarker(hashMapMarker.get("end"));
            builder.include(hashMapMarker.get("end").getPosition());
            flag_end = true;
        }
        if( flag_start && flag_end ){
            LatLngBounds bounds = builder.build();
            googleMap.animateCamera(CameraUpdateFactory.newLatLngBounds(bounds, 200));
        }
    }

    private static Spanned formatPlaceDetails(Resources res, CharSequence name,CharSequence address) {
        return Html.fromHtml(res.getString(R.string.place_details, name, address));
    }

    public void getdistanceJSON(JSONObject response){
        try{
            JSONObject jsonData = response.getJSONArray("rows").getJSONObject(0).getJSONArray("elements").getJSONObject(0);
            String distance = jsonData.getJSONObject("distance").getString("text");
            String time = jsonData.getJSONObject("duration").getString("text");
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    public Bitmap resizeMapIcons(Bitmap imageBitmap,int width, int height){
        Bitmap resizedBitmap = Bitmap.createScaledBitmap(imageBitmap, width, height, false);
        return resizedBitmap;
    }

    private void showDialogForChangePin(Context context){
        //AlertDialog
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        builder.setTitle("마커를 변경합니다.");
        if(!flag_fromto){
            builder.setMessage("출발지를 변경하시겠습니까?");
        }else{
            builder.setMessage("도착지를 변경하시겠습니까?");
        }
        DialogInterface.OnClickListener dialogClickListener = new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                switch(which){
                    case DialogInterface.BUTTON_POSITIVE:
                        showInputs(false);
                    case DialogInterface.BUTTON_NEGATIVE:
                        dialog.cancel();
                        break;
                }
            }
        };

        builder.setPositiveButton("네", dialogClickListener);
        builder.setNegativeButton("실수에요",dialogClickListener);
        AlertDialog dialog = builder.create();
        dialog.show();
    }

    @Override
    @Deprecated
    protected Dialog onCreateDialog(int id) {
        TimePickerDialog tpd =
                new TimePickerDialog(this, AlertDialog.THEME_HOLO_LIGHT,
                        new TimePickerDialog.OnTimeSetListener() {
                            @Override
                            public void onTimeSet(TimePicker view,
                                                  int hourOfDay, int minute) {
                                Calendar calendar = Calendar.getInstance();
                                long now = System.currentTimeMillis();

                                Date sysdate = new Date(now);

                                SimpleDateFormat sdfday = new SimpleDateFormat("yyyy-MM-dd");
                                SimpleDateFormat starthour = new SimpleDateFormat("HH");
                                SimpleDateFormat startiminute = new SimpleDateFormat("mm");
                                SimpleDateFormat transFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");

                                int hour = Integer.parseInt(starthour.format(sysdate));
                                int iminute = Integer.parseInt(startiminute.format(sysdate));

                                calendar.setTime(sysdate);

                                if( hourOfDay < hour || (hourOfDay==hour && minute < iminute) ){
                                    Toast.makeText(getApplicationContext(), "시간설정은 24시간 제한이므로 내일로 설정됩니다.", Toast.LENGTH_LONG).show();
                                    calendar.add(Calendar.DATE, 1);
                                    if(hourOfDay>12) {
                                        view_time.setRightLabel("내일 오후" + (hourOfDay-12) + "시 " + minute + "분");
                                    }else if(hourOfDay==0){
                                        view_time.setRightLabel("내일 오전" + (hourOfDay+12) + "시 " + minute + "분");
                                    }else{
                                        view_time.setRightLabel("내일 오전" + hourOfDay + "시 " + minute + "분");
                                    }
                                }else{
                                    if(hourOfDay>12) {
                                        view_time.setRightLabel("오늘 오후" + (hourOfDay-12) + "시 " + minute + "분");
                                    }else if(hourOfDay==0){
                                        view_time.setRightLabel("오늘 오전" + (hourOfDay+12) + "시 " + minute + "분");
                                    }else{
                                        view_time.setRightLabel("오늘 오전" + hourOfDay + "시 " + minute + "분");
                                    }
                                }
                                room.setStart_time2(view_time.getRightLabel().toString());
                                valuecheck[2] = true;
                                view_time.setRightColor(R.color.black);
                                String strstart_time = sdfday.format(calendar.getTimeInMillis())+" "+hourOfDay+":"+""+minute;
                                try {
                                    room.setStart_time(transFormat.parse(strstart_time));
                                }catch (ParseException e){

                                }
                            }
                        }, // 값설정시 호출될 리스너 등록
                        4,19, false); // 기본값 시분 등록
        // true : 24 시간(0~23) 표시
        // false : 오전/오후 항목이 생김
        return tpd;
    }


}
