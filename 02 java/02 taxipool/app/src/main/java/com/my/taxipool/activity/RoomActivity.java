package com.my.taxipool.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.TabLayout;
import android.support.v4.app.ActivityCompat;
import android.support.v4.view.ViewPager;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;

import com.my.taxipool.MyInfo;
import com.my.taxipool.R;
import com.my.taxipool.adapter.MyPagerAdapter;
import com.my.taxipool.util.CommuServer;
import com.my.taxipool.vo.CustomerInfo;
import com.my.taxipool.vo.Room;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

/**
 * Created by Hyeon on 2017-05-28.
 */

public class RoomActivity extends BaseActivity {
    //viewPager
    private ViewPager viewPager;
    private TabLayout tab;

    //state
    private String info_id = MyInfo.getInfo_id();
    private int room_no;
    private int state;

    //items
    private Room room;
    private ArrayList<CustomerInfo> sharePeopleList;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if(MyInfo.getState() > Room.NO_MEMBER){
            room_no = MyInfo.getLast_room();
        }else{
            room_no = getIntent().getIntExtra("room_no",0);
        }
        getRoomInfo(room_no);
    }

    private void setViews(int state) {
        tab =  (TabLayout) findViewById(R.id.main_tab);
        viewPager = (ViewPager) findViewById(R.id.viewpager);

        /*set ViewPager*/
        MyPagerAdapter adapter = new MyPagerAdapter(getSupportFragmentManager());
        TabInfo tabInfo = new TabInfo();
        tabInfo.setData(Integer.parseInt(info_id), room, sharePeopleList);
        adapter.addFragment(tabInfo, "합승정보");
        /*if (state >= Room.WAIT_TOGO){*/
            TabChat tabChat = new TabChat();
            tabChat.setRoom_no(room.getRoom_no());


            adapter.addFragment(tabChat, "채팅방");
        /*}*/

        viewPager.setAdapter(adapter);
        /*set ViewPager end*/

        tab.setupWithViewPager(viewPager);
        tab.getTabAt(0).setText("합승정보");
        /*if (state < 20){
            tab.setVisibility(View.GONE);
        }else{*/
            tab.getTabAt(1).setText("채팅방");
            tab.setVisibility(View.VISIBLE);
        /*}*/
    }

    private void getRoomInfo(final int room_no){
        new CommuServer(CommuServer.SELECT_ROOM_INFO, new CommuServer.OnCommuListener() {
            @Override
            public void onSuccess(JSONObject object, JSONArray arr, String str) {
                Log.d("ddu result!!",object.toString());
                JSONObject roomInfoObject = object;
                if(roomInfoObject == null){
                    Log.d("ddu RoomActivity","no room");
                }else {
                    try {

                        Long time = Long.parseLong(roomInfoObject.getString("start_time"));
                        Date d = new Date(time);

                        room = new Room(roomInfoObject.getInt("room_no"), roomInfoObject.getString("admin_id"), roomInfoObject.getInt("max_cnt"),
                                roomInfoObject.getString("payment"), roomInfoObject.getString("room_gender"), roomInfoObject.getString("alcohol"),
                                roomInfoObject.getString("start_spot"), roomInfoObject.getString("end_spot"),
                                roomInfoObject.getDouble("start_lon"), roomInfoObject.getDouble("start_lat"),
                                roomInfoObject.getDouble("end_lon"), roomInfoObject.getDouble("end_lat"),
                                d, roomInfoObject.getString("room_state"), roomInfoObject.getInt("current_cnt"));

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                    getSharePeople(room_no);
                }
            }
            @Override
            public void onFailed(Error error) {
            }
        }).addParam("room_no", room_no).start();

    }
    private void getSharePeople(int room_no){
        new CommuServer(CommuServer.SELECT_PEOPLE_ROOMSHARE, new CommuServer.OnCommuListener() {
            @Override
            public void onSuccess(JSONObject object, JSONArray arr, String str) {
                Log.d("ddu result!!",arr.toString());
                JSONArray roomInfoObject = arr;
                if(roomInfoObject == null){
                    Log.d("ddu RoomActivity","no room");
                }else{
                    sharePeopleList = new ArrayList<>();
                    try{
                        for(int i=0; i<roomInfoObject.length();i++){
                            CustomerInfo customerInfo = new CustomerInfo();
                            customerInfo.setResultscore(roomInfoObject.getJSONObject(i).getInt("score")/(double)roomInfoObject.getJSONObject(i).getInt("cnt"));
                            customerInfo.setInfo_id(roomInfoObject.getJSONObject(i).getString("share_info_id"));
                            customerInfo.setNickname(roomInfoObject.getJSONObject(i).getString("nickname"));
                            customerInfo.setProfile_pic(roomInfoObject.getJSONObject(i).getString("profile_pic"));

                            if(info_id.equals(roomInfoObject.getJSONObject(i).getString("share_info_id"))){
                                customerInfo.setState("m"); //me 어차피 내상태는 MyInfo 에 있음
                            }else{
                                customerInfo.setState(roomInfoObject.getJSONObject(i).getString("state"));
                            }
                            sharePeopleList.add(customerInfo);
                        }
                        Log.d("ddu RoomActivity",sharePeopleList.toString());
                        listener.onSuccess();
                    }catch(JSONException e){
                        e.printStackTrace();
                    }
                }
            }
            @Override
            public void onFailed(Error error) {
            }
        }).addParam("room_no", room_no).start();
    }

    private RoomListener listener = new RoomListener() {
        @Override
        public void onSuccess() {
            runOnUiThread(new Runnable(){
                @Override
                public void run() {
                    setContentView(R.layout.activity_room);
                    setViews(state);
                }
            });
        }
    };

    public interface RoomListener {
        void onSuccess();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_at_room, menu);
        super.onCreateOptionsMenu(menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.action_leaveroom:
                //서버추가
                new CommuServer(CommuServer.UPDATE_STATE, new CommuServer.OnCommuListener() {
                    @Override
                    public void onSuccess(JSONObject object, JSONArray arr, String str) {
                        MyInfo.setState("e");
                        Intent intent = new Intent(getApplicationContext(),HomeActivity2.class);
                        ActivityCompat.finishAffinity(RoomActivity.this); //모든 액티비티 종료
                        startActivity(intent);
                    }
                    @Override
                    public void onFailed(Error error) {
                    }
                }).addParam("room_no", room_no)
                        .addParam("share_info_id",info_id)
                        .addParam("state","d")
                        .start();
                return true;
            default:
                break;
        }
        return super.onOptionsItemSelected(item);
    }
}