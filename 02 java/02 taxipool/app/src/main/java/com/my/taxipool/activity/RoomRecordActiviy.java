package com.my.taxipool.activity;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.View;

import com.my.taxipool.MyInfo;
import com.my.taxipool.R;
import com.my.taxipool.adapter.RoomRecordRecyclerAdapter;
import com.my.taxipool.adapter.RoomRecordRecyclerAdapterInterface;
import com.my.taxipool.util.CommuServer;
import com.my.taxipool.vo.CustomerInfo;
import com.my.taxipool.vo.RoomRecord;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Hyeon on 2017-06-28.
 */

public class RoomRecordActiviy  extends AppCompatActivity implements RoomRecordRecyclerAdapterInterface.OnItemClickListener {
    private RecyclerView recyclerview_room_record;
    private RoomRecordRecyclerAdapter adapter;
    private List<RoomRecord> list = new ArrayList<>();

    String info_id = MyInfo.getInfo_id();
    RoomRecord  roomRecord;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_roomrecord);
        recyclerview_room_record = (RecyclerView) findViewById(R.id.recyclerview_room_record);
        recyclerview_room_record.setLayoutManager(new LinearLayoutManager(this));

        new CommuServer(CommuServer.SELECT_SHARE_LIST, new CommuServer.OnCommuListener() {
            @Override
            public void onSuccess(JSONObject object, JSONArray arr, String str) {
                // test
                Log.d("ddu",arr.toString());
                try{
                    for(int i=0; i < arr.length();i++) {
                        roomRecord = new RoomRecord();
                        ArrayList<CustomerInfo> in_member_list = new ArrayList<>();
                        roomRecord.setMemberlist(in_member_list);

                        roomRecord.setStart_time(arr.getJSONObject(i).getLong("start_time"));
                        roomRecord.setStart_spot(arr.getJSONObject(i).getString("start_spot"));
                        roomRecord.setEnd_spot(arr.getJSONObject(i).getString("end_spot"));

                        JSONArray memberlist = arr.getJSONObject(i).getJSONArray("memberlist");
                        for(int j=0; j < memberlist.length() ; j++){
                            CustomerInfo member = new CustomerInfo();
                            member.setNickname(memberlist.getJSONObject(j).getString("nickname"));
                            member.setProfile_pic(memberlist.getJSONObject(j).getString("profile_pic"));
                            in_member_list.add(member);
                        }
                        list.add(roomRecord);
                    }
                    setAdapter(RoomRecordActiviy.this);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
            @Override
            public void onFailed(Error error) {
            }
        }).addParam("info_id", info_id).start();

    }

    public void setAdapter(final RoomRecordRecyclerAdapterInterface.OnItemClickListener listener){
        adapter = new RoomRecordRecyclerAdapter(list,RoomRecordActiviy.this,listener);
        recyclerview_room_record.setAdapter(adapter);
    }

    @Override
    public void onItemClick(View view, int position) {
    }
}