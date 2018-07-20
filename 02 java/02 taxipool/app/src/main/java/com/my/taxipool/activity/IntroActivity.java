package com.my.taxipool.activity;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.os.Handler;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;

import com.my.taxipool.MyInfo;
import com.my.taxipool.R;
import com.my.taxipool.util.CommuServer;
import com.my.taxipool.util.ImageHelper;
import com.my.taxipool.util.Set;
import com.my.taxipool.vo.Room;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by Hyeon on 2016-05-25.
 */

public class IntroActivity extends AppCompatActivity {
//    public static CustomerInfo myInfo;
    String info_id;
    Bitmap bitmap;
    Intent intent;

    @Override
    public void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_intro);
        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
        Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                info_id = Set.Load(IntroActivity.this,"info_id",null);
                if( null != info_id){
                    //id있을 때 - 어플 받고 로그인이력 1번 이상
                    Set.Save(getApplication(),"info_id", info_id);
                    getMyInfo();
                }else{
                    intent = new Intent(IntroActivity.this, LoginActivity.class);
                    startActivity(intent);
                }
                finish();
            }
        }, 1000);
    }
    public void getMyInfo(){
        new CommuServer(CommuServer.SELECT_BY_INFOID, new CommuServer.OnCommuListener() {
            @Override
            public void onSuccess(JSONObject object, JSONArray arr, String str) {
                if(str!= null){
                    if(str.equals("0")){
                        Log.d("ddu login","0");
                    }
                }else{
                    try{
                        MyInfo.setInfo_id(object.getString("info_id"));
                        MyInfo.setProfile_pic(object.getString("profile_pic"));
                        MyInfo.setPhone_no(object.getString("phone_no"));
                        MyInfo.setInfo_name(object.getString("info_name"));
                        MyInfo.setNickname(object.getString("nickname"));
                        MyInfo.setInfo_gender(object.getString("info_gender"));
                        MyInfo.setPoint(object.getInt("point"));
                        MyInfo.setResultscore(object.getInt("score")/(double)object.getInt("cnt"));
//                        MyInfo.setState(object.getString("state"));
//                        MyInfo.setLast_room(object.getString("room_no"));
                        MyInfo.setState("e");
                        setBitmap();
                    }catch(JSONException e){
                        e.printStackTrace();
                    }
                }
            }
            @Override
            public void onFailed(Error error) {
            }
        }).addParam("info_id", info_id).start();
    }

    //get myinfo for hamberger menu
    private void setBitmap() {
        Thread mThread = new Thread(){
            @Override
            public void run(){
                try{
                    URL url = new URL(MyInfo.getProfile_pic());
                    HttpURLConnection conn = (HttpURLConnection)url.openConnection();
                    conn.setDoInput(true);
                    conn.connect();
                    InputStream is = conn.getInputStream();
                    bitmap = BitmapFactory.decodeStream(is);
                }catch (IOException e){
                    e.printStackTrace();
                }
            }
        };
        mThread.start();
        try{
            mThread.join();
            ImageHelper ih = new ImageHelper();
            bitmap = ih.getRoundedCornerBitmap(bitmap,200);
            MyInfo.setProfile_bitmap(bitmap);
            if(MyInfo.getState() == Room.NO_MEMBER){
                intent = new Intent(IntroActivity.this,HomeActivity2.class);
            }else{
                intent = new Intent(IntroActivity.this,RoomActivity.class);
            }
            startActivity(intent);
        }catch(InterruptedException e) {
            e.printStackTrace();
        }
    }
}
