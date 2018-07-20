package com.my.taxipool.activity;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;

import com.my.taxipool.R;
import com.my.taxipool.util.Set;

/**
 * Created by sungjin on 2017-07-03.
 */

public class LodingActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_loding);

        Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                Intent intent = getIntent();
                int room_no = intent.getExtras().getInt("room_no");

                Intent intent2 = new Intent(LodingActivity.this, RoomActivity.class);
                intent2.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                Log.d("Loding roomno",""+room_no);
                intent2.putExtra("room_no", room_no);
                startActivity(intent2);
                finish();
            }
        }, 1000);


    }
}
