package com.my.taxipool.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.my.taxipool.R;
import com.my.taxipool.adapter.RoomListRecyclerAdapter;
import com.my.taxipool.adapter.RoomListRecyclerAdapterInterface;
import com.my.taxipool.util.CommuServer;
import com.my.taxipool.vo.Room;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;


public class RoomListActivity extends AppCompatActivity implements RoomListRecyclerAdapterInterface.OnItemClickListener {
    private RecyclerView recyclerView_roomlist;
    private RoomListRecyclerAdapter adapter;
    private ArrayList<Room> room_list = new ArrayList<Room>();
//    private static RoomListRecyclerAdapter addressAdapter;

    private int room_no;
    private String admin_id;
    private int max_cnt;
    private String payment;
    private String room_gender;
    private String alcohol;
    private String start_spot;
    private String end_spot;
    private double start_lon;
    private double start_lat;
    private double end_lon;
    private double end_lat;
    private Date start_time;
    private String room_state;
    private int current_cnt;
    Room room ;

    private TextView tv_myStartTime;
    private TextView tv_myStartSpot;
    private TextView tv_myEndSpot;
    private Button btn_goto_makeroom;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_roomlist);

        room = (Room) getIntent().getSerializableExtra("object");
        Log.d("ddu tmpRoom",room.toString());
        setViewIds();
        setViews();
        new CommuServer(CommuServer.SELECT_ROOM_LIST, new CommuServer.OnCommuListener() {
            @Override
            public void onSuccess(JSONObject object,JSONArray arr, String str) {
                Log.d("ddu result!!",arr.toString());
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                // test
                try{
                    for(int i=0; i < arr.length();i++) {
                        JSONObject jsonobject = arr.getJSONObject(i);
                        room_no = jsonobject.getInt("room_no");
                        admin_id = jsonobject.getString("admin_id");
                        payment = jsonobject.getString("payment");
                        max_cnt = jsonobject.getInt("max_cnt");
                        room_gender = jsonobject.getString("room_gender");
                        alcohol = jsonobject.getString("alcohol");
                        start_spot = jsonobject.getString("start_spot");
                        end_spot = jsonobject.getString("end_spot");
                        start_lon = jsonobject.getDouble("start_lon");
                        start_lat = jsonobject.getDouble("start_lat");
                        end_lon = jsonobject.getDouble("end_lon");
                        end_lat = jsonobject.getDouble("end_lat");
                        String start_time_string = jsonobject.getString("start_time");
                        start_time = sdf.parse(start_time_string, new ParsePosition(0));
                        room_state = jsonobject.getString("room_state");
                        current_cnt = jsonobject.getInt("current_cnt");
                        Room r = new Room(room_no, admin_id, max_cnt, payment, room_gender, alcohol, start_spot,
                                end_spot, start_lon, start_lat, end_lon, end_lat, start_time,
                                room_state, current_cnt);
                        room_list.add(r);
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                setAdapter(RoomListActivity.this);
            }
            @Override
            public void onFailed(Error error) {
            }
        }).addParam("start_lat", room.getStart_lat())
                .addParam("start_lon", room.getStart_lon())
                .addParam("end_lat", room.getEnd_lat())
                .addParam("end_lon", room.getEnd_lon()).start();
//    }).addParam("start_lon", tmpRoom.getStartLat())
//            .addParam("start_lat", tmpRoom.getStartLon())
//            .addParam("start_lon", tmpRoom.getEndLat())
//            .addParam("end_lat", tmpRoom.getEndLon()).start();
    }
    private void setViewIds(){
        recyclerView_roomlist = (RecyclerView) findViewById(R.id.recyclerView_roomlist);
        recyclerView_roomlist.setLayoutManager(new LinearLayoutManager(this));
        tv_myEndSpot = (TextView) findViewById(R.id.my_end_spot);
        tv_myStartSpot = (TextView) findViewById(R.id.my_start_spot);
        tv_myStartTime = (TextView) findViewById(R.id.my_start_time);
        btn_goto_makeroom = (Button) findViewById(R.id.btn_goto_makeroom);
    }
    private void setViews() {
        tv_myEndSpot.setText(room.getEnd_spot());
        tv_myStartSpot.setText(room.getStart_spot());
        tv_myStartTime.setText(room.getStart_time2());
        btn_goto_makeroom.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(RoomListActivity.this,RoomRegistActivity.class);
                intent.putExtra("object",room);
                startActivity(intent);
            }
        });
    }
    public void setAdapter(final RoomListRecyclerAdapterInterface.OnItemClickListener listener){
//        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(this);
        adapter = new RoomListRecyclerAdapter(room_list,getApplicationContext(),listener);
        recyclerView_roomlist.setAdapter(adapter);
    }
    @Override
    public void onItemClick(View view, int position) {
            Intent intent = new Intent(RoomListActivity.this, RoomActivity.class);
            intent.putExtra("room_no",room_list.get(position).getRoom_no());
//            intent.putExtra("room_no_from_list",room_list.get(position).getRoom_no());
            startActivity(intent);
    }
}