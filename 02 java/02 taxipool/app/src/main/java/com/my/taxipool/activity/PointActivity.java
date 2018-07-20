package com.my.taxipool.activity;

import android.content.DialogInterface;
import android.content.Intent;
import android.content.SyncStatusObserver;
import android.os.Bundle;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.LinearLayoutManager;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.my.taxipool.R;
import com.my.taxipool.adapter.BlockListAdapter;
import com.my.taxipool.adapter.PointRecordAdapter;
import com.my.taxipool.util.CommuServer;
import com.my.taxipool.util.Set;
import com.my.taxipool.vo.BlockCustomerInfo;
import com.my.taxipool.vo.PointRecordInfo;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

/**
 * Created by sungjin on 2017-06-26.
 */

public class PointActivity extends AppCompatActivity {

    //포인트사용내역
    private Button bt_pointlist;

    //충전금액 설정
    private Button bt_50000;
    private Button bt_10000;
    private Button bt_5000;

    //무료충전
    private Button bt_freepoint;

    //충전하기
    private Button bt_charge;

    //현재포인트 상태 보여주기
    private TextView tv_nowpoint;

    //충전금액 입력하기
    private EditText et_inputpoint;

    //출금하기
    private Button bt_pointout;

    //서버로 받은 결과
    private String result;
    //private BlockListAdapter adapter;
    //private ArrayList<BlockCustomerInfo> data;
    private int point;
    //ListView listView;


    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_pointcharge);

        bt_pointlist = (Button)findViewById(R.id.bt_pointlist);
        bt_50000 = (Button)findViewById(R.id.bt_5);
        bt_10000 = (Button)findViewById(R.id.bt_1);
        bt_5000 = (Button)findViewById(R.id.bt_0_5);
        bt_freepoint = (Button)findViewById(R.id.bt_freepoint);
        bt_charge = (Button)findViewById(R.id.bt_charge);
        tv_nowpoint = (TextView)findViewById(R.id.tv_nowpoint);
        et_inputpoint = (EditText)findViewById(R.id.et_inputpoint);
        bt_pointout = (Button)findViewById(R.id.bt_pointout);


        final String info_id = Set.Load(getApplication(), "info_id", null);
        //final String info_id = "447433869";

        //현재 로그인한 사람의 POINT를 조회.
        pointCheck(info_id);




        //무료충전 준비중 안내문구
        bt_freepoint.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(getApplicationContext(), "준비중이에요 죄송합니다 OTL..", Toast.LENGTH_SHORT).show();
            }

        });

        //금액입력부분 클릭 시 금액초기화
        et_inputpoint.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                if(hasFocus){
                    et_inputpoint.setText("");
                }
            }
        });

        //내역보기로 넘어가기
        bt_pointlist.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                    Intent intent = new Intent(PointActivity.this, PointListActivity.class);
                    startActivity(intent);
            }
        });

        bt_50000.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int tmp;
                if(et_inputpoint.getText().toString().isEmpty()){
                    tmp = 50000;
                }else{
                    tmp = Integer.parseInt(et_inputpoint.getText().toString()) + 50000;
                }
                String plus = String.valueOf(tmp);
                et_inputpoint.setText(plus);
            }
        });

        bt_10000.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int tmp;
                if(et_inputpoint.getText().toString().isEmpty()){
                    tmp = 10000;
                }else{
                    tmp = Integer.parseInt(et_inputpoint.getText().toString()) + 10000;
                }
                String plus = String.valueOf(tmp);
                et_inputpoint.setText(plus);
            }
        });

        bt_5000.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int tmp;
                if(et_inputpoint.getText().toString().isEmpty()){
                    tmp = 5000;
                }else{
                    tmp = Integer.parseInt(et_inputpoint.getText().toString()) + 5000;
                }
                String plus = String.valueOf(tmp);
                et_inputpoint.setText(plus);
            }
        });


        //충전하기
        bt_charge.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                /////////////////////////////////////////////////////////////
                if (et_inputpoint.length() != 0) {
                    //AlertDialog
                    AlertDialog.Builder builder = new AlertDialog.Builder(PointActivity.this);
                    builder.setTitle("충전안내");
                    builder.setMessage(et_inputpoint.getText().toString() + "의 금액을 충전하시겠습니까?");

                    DialogInterface.OnClickListener dialogClickListener = new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            switch (which) {
                                case DialogInterface.BUTTON_POSITIVE:
                                    SimpleDateFormat transFormat = new SimpleDateFormat("yyyy-MM-dd");
                                    long l_today = System.currentTimeMillis();
                                    String s_today = transFormat.format(new Date(l_today));

                                    new CommuServer(CommuServer.POINT_CHARGE, new CommuServer.OnCommuListener() {

                                        @Override
                                        public void onSuccess(JSONObject object, JSONArray arr, String str) {
                                            Log.d("PointActivity", "충전성공");
                                            pointCheck(info_id);
                                        }

                                        @Override
                                        public void onFailed(Error error) {
                                            Log.i("PointActivity", "LIST 조회 실패");
                                        }
                                    }).addParam("info_id", info_id)
                                            .addParam("point", et_inputpoint.getText().toString())
                                            .addParam("date", s_today)
                                            .addParam("type", 1).start();

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
                }else{
                    Toast.makeText(PointActivity.this, "충전금액을 입력해야합니다~", Toast.LENGTH_SHORT).show();
                }

            }

        });


        //출금하기
        bt_pointout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(getApplicationContext(), "출금하기 창으로 이동합니다!", Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(getApplicationContext(), PointOutActivity.class);
                startActivity(intent);
            }
        });


    }

    public void pointCheck(String info_id){
        new CommuServer(CommuServer.POINT_CHECK, new CommuServer.OnCommuListener() {

            @Override
            public void onSuccess(JSONObject object, JSONArray arr, String str) {
                result = str;
                Log.d("ddu string",str);
                Long l_now_point = Long.parseLong(result);
                DecimalFormat Comma = new DecimalFormat("#,###");
                String c_point = Comma.format(l_now_point);
                tv_nowpoint.setText(c_point+"원");
                Log.d("PointActivity","point:"+result);
            }
            @Override
            public void onFailed(Error error) {
                Log.d("PointActivity", "포인트 조회 실패");
                error.printStackTrace();
            }
        }).addParam("info_id", info_id).start();
    }
}
