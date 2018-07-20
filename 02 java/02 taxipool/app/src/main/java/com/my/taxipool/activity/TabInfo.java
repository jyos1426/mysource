package com.my.taxipool.activity;

import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v7.app.AlertDialog;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.PolylineOptions;
import com.my.taxipool.MyInfo;
import com.my.taxipool.R;
import com.my.taxipool.adapter.RoomSharepeopleRecyclerAdapter;
import com.my.taxipool.util.CommuServer;
import com.my.taxipool.util.ImageResourceUtil;
import com.my.taxipool.util.Set;
import com.my.taxipool.vo.CustomerInfo;
import com.my.taxipool.vo.Room;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

/**
 * Created by Hyeon on 2017-05-30.
 */

public class TabInfo extends Fragment{
    private View rootView;
    private SupportMapFragment mapFragment;

    int state = MyInfo.getState();
    Room room;
    int info_id;
    Boolean isBangjang = false;
    private ArrayList<CustomerInfo> sharePeopleList;
    SimpleDateFormat transFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    SimpleDateFormat Format = new SimpleDateFormat("MM-dd HH:mm");
    //views
    private Button btn_in_room;
    private TextView tv_info_startspot;
    private TextView tv_info_endspot;
    private TextView tv_info_detail;
    private TextView tv_room_taxibi;

    //People List
    RecyclerView recyclerView_roomShare;
    private RoomSharepeopleRecyclerAdapter adapter = null;

    private ImageView img_room_gender;
    private ImageView img_room_payment;
    private ImageView img_room_alcohol;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        rootView = inflater.inflate(R.layout.view_room_infobase,container,false);
        setViewIds();
        setViews();
        setSharePeopleListAdapter();

        return rootView;
    }
    private void setViewIds(){

        room.setCurrent_cnt(Set.Load(getActivity(), "current_cnt", -1));
        btn_in_room = (Button) rootView.findViewById(R.id.btn_in_room);
        tv_info_startspot = (TextView) rootView.findViewById(R.id.tv_info_startspot);
        tv_info_endspot = (TextView) rootView.findViewById(R.id.tv_info_endspot);
        tv_info_detail = (TextView) rootView.findViewById(R.id.tv_info_detail);
        tv_room_taxibi= (TextView) rootView.findViewById(R.id.tv_room_taxibi);

        recyclerView_roomShare = (RecyclerView) rootView.findViewById(R.id.recyclerview_room_info);
        recyclerView_roomShare.setLayoutManager(new LinearLayoutManager(getContext()));


        img_room_gender = (ImageView) rootView.findViewById(R.id.img_room_gender);
        img_room_payment = (ImageView) rootView.findViewById(R.id.img_room_payment);
        img_room_alcohol = (ImageView) rootView.findViewById(R.id.img_room_alcohol);
    }

    private void setViews(){
        //setting distance
        tv_info_startspot.setText(room.getStart_spot());
        tv_info_endspot.setText(room.getEnd_spot());
        Log.i("ddu",""+room.getEnd_spot());
        Log.i("ddu",""+room.getCurrent_cnt());
        tv_info_detail.setText(detailToString(room.getMax_cnt(),room.getCurrent_cnt(),room.getStart_time()));

        //setting images

        img_room_gender.setImageResource(room.getImgsource_gender());
        img_room_payment.setImageResource(room.getImgsource_payment());
        img_room_alcohol.setImageResource(room.getImgsource_alcohol());


        //setting button
        if (state == Room.NO_MEMBER){
            btn_in_room.setBackgroundColor(getResources().getColor(R.color.darkGray));
            btn_in_room.setTextColor(getResources().getColor(R.color.white));
            btn_in_room.setText("합승 신청");
        }
        else if(state == Room.REQUIRING){
            btn_in_room.setBackgroundColor(getResources().getColor(R.color.darkGray));
            btn_in_room.setTextColor(getResources().getColor(R.color.white));
            btn_in_room.setText("합승신청 취소");
        }
        else if(state == Room.WAIT_TOGO){
            btn_in_room.setBackgroundColor(getResources().getColor(R.color.colorPoint));
            btn_in_room.setTextColor(getResources().getColor(R.color.white));
            btn_in_room.setText("차에 탔어요");
        }

        btn_in_room.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v) {
                int new_state = 0;
                switch(state){
                    case Room.NO_MEMBER :    //합승 신청
                        ////////////////////////////////////////////////////////////////////////////
                        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
                        builder.setTitle("합승 신청");
                        builder.setMessage("이 방에 합승신청할꾸야?");

                        DialogInterface.OnClickListener dialogClickListener = new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                switch (which) {
                                    case DialogInterface.BUTTON_POSITIVE:


                                        long l_today = System.currentTimeMillis();
                                        String s_today = transFormat.format(new Date(l_today));

                                        new CommuServer(CommuServer.REQUEST_ROOM, new CommuServer.OnCommuListener() {
                                            @Override
                                            public void onSuccess(JSONObject object, JSONArray arr, String str) {
                                                Log.d("sj ddu gy", "합승신청성공");
                                            }
                                            @Override
                                            public void onFailed(Error error) {
                                                Log.d("sj ddu gy", "합승신청실패");
                                            }
                                        }).addParam("room_no", room.getRoom_no())
                                                .addParam("share_info_id", info_id)
                                                .addParam("state", "r")
                                                .addParam("date", s_today)
                                                .addParam("share_number", 1).start();
                                    case DialogInterface.BUTTON_NEGATIVE:
                                        dialog.cancel();
                                        break;
                                }
                            }
                        };

                        builder.setPositiveButton("네", dialogClickListener);
                        builder.setNegativeButton("잠깐만요", dialogClickListener);
                        AlertDialog dialog = builder.create();
                        dialog.show();
                        ////////////////////////////////////////////////////////////////////////////
                        new_state = Room.REQUIRING;
                        break;
                    case Room.REQUIRING :   //합승신청 취소
                        new_state = Room.NO_MEMBER;
                        Intent intent = new Intent(getActivity(),HomeActivity2.class);
                        startActivity(intent);
                        getActivity().finish();
                        break;
                    case Room.WAIT_TOGO :    //출발하기
                        //ignore
                           new_state = state + 10;
//                        Intent intent = new Intent(getActivity(),);
//                        startActivity(intent);
//                        finish();
                        break;
                }
                MyInfo.setState(new_state);
            }
        });
    }

    public void setSharePeopleListAdapter(){
        adapter = new RoomSharepeopleRecyclerAdapter(sharePeopleList,getContext(),isBangjang, room.getRoom_no());
        recyclerView_roomShare.setAdapter(adapter);
    }

    //바꿀 것
    private String detailToString(int maxCnt,int currentCnt,Date startTime){
        return "(" + currentCnt + "/" + maxCnt + ")" + Format.format(startTime);
    }

    @Override
    public void onResume(){
        super.onResume();
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        FragmentManager fm = getChildFragmentManager();
        mapFragment = (SupportMapFragment) fm.findFragmentById(R.id.view_info_map);
        if(mapFragment == null){
            Log.i("ddu","1111ㄹ도들어ㅗㅁ");
            mapFragment = SupportMapFragment.newInstance();
            fm.beginTransaction().replace(R.id.view_info_map, mapFragment).commit();
        } else {
            Log.i("ddu","2ㄹ도들어ㅗㅁ");
            mapFragment.getMapAsync(new OnMapReadyCallback() {

                @Override
                public void onMapReady(final GoogleMap googleMap) {

                    MarkerOptions startMarkerOption = new MarkerOptions();
                    MarkerOptions endMarkerOption = new MarkerOptions();
                    LatLng start_latlon = new LatLng(room.getStart_lon(), room.getStart_lat());
                    LatLng end_latlon = new LatLng(room.getEnd_lon(), room.getEnd_lat());
                    ImageResourceUtil util = new ImageResourceUtil();
                    Bitmap bitmap_icon = util.getBitmap(getActivity(),R.drawable.ic_place_yellow_24dp);
                    bitmap_icon = resizeMapIcons(bitmap_icon,130,130);

                    startMarkerOption.position(start_latlon)
                            .title("출발지")
                            .snippet(room.getStart_spot())
                            .icon(BitmapDescriptorFactory.fromBitmap(bitmap_icon));
                    endMarkerOption.position(end_latlon)
                            .title("도착지")
                            .snippet(room.getEnd_spot())
                            .icon(BitmapDescriptorFactory.fromBitmap(bitmap_icon));

                    googleMap.addMarker(startMarkerOption);
                    googleMap.addMarker(endMarkerOption);
                    googleMap.addPolyline(new PolylineOptions()
                            .add(start_latlon, end_latlon)
                            .width(4)
                            .color(getResources().getColor(R.color.colorDart)));

                    LatLngBounds.Builder builder = new LatLngBounds.Builder();
                    builder.include(start_latlon);
                    builder.include(end_latlon);
                    LatLngBounds bounds = builder.build();

                    googleMap.moveCamera(CameraUpdateFactory.newLatLngBounds(bounds, 80));
                }

            });
        }
    }

    public Bitmap resizeMapIcons(Bitmap imageBitmap,int width, int height){
        Bitmap resizedBitmap = Bitmap.createScaledBitmap(imageBitmap, width, height, false);
        return resizedBitmap;
    }

    public void setData(int info_id, Room room,ArrayList<CustomerInfo> sharePeopleList) {
        this.info_id = info_id;
        this.room = room;
        if(Integer.parseInt(room.getAdmin_id()) == info_id){
            isBangjang = true;
        }
        this.sharePeopleList = sharePeopleList;
    }
}