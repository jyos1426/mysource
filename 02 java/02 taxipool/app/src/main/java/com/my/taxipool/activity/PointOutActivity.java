package com.my.taxipool.activity;

import android.content.DialogInterface;
import android.graphics.Point;
import android.os.Bundle;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.my.taxipool.R;
import com.my.taxipool.util.CommuServer;
import com.my.taxipool.util.Set;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by sungjin on 2017-06-28.
 */

public class PointOutActivity extends AppCompatActivity {

    //현재포인트 상태 보여주기
    private TextView tv_nowpoint;

    //출금금액 입력하기
    private EditText et_inputpoint;

    //출금하기 버튼
    private Button bt_pointout;

    //서버로 받은 결과
    private String result;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_pointout);

        final String info_id = Set.Load(getApplication(), "info_id", null);
        //final String info_id = "447433869";

        tv_nowpoint = (TextView)findViewById(R.id.tv_nowpoint);
        et_inputpoint = (EditText)findViewById(R.id.et_inputpoint);
        bt_pointout = (Button)findViewById(R.id.bt_pointout);

        //현재 로그인한 사람의 POINT를 조회.
        pointCheck(info_id);

        bt_pointout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String s_input_out_cash = et_inputpoint.getText().toString();
                if(s_input_out_cash.length() !=0 ) {
                    s_input_out_cash = s_input_out_cash.replace("원", "");
                    s_input_out_cash = s_input_out_cash.replace(",", "");
                    String s_now_cash = tv_nowpoint.getText().toString();
                    s_now_cash = s_now_cash.replace("원", "");
                    s_now_cash = s_now_cash.replace(",", "");
                    int input_out_cash = Integer.parseInt(s_input_out_cash);
                    int now_cash = Integer.parseInt(s_now_cash);
                    Log.d("cash value", "" + input_out_cash + "," + now_cash);
                    if (now_cash >= input_out_cash && input_out_cash >= 1000) {

                        AlertDialog.Builder builder = new AlertDialog.Builder(PointOutActivity.this);

                        builder.setTitle("출금안내");
                        builder.setMessage(et_inputpoint.getText().toString() + "의 금액을 출금하시겠습니까?");

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
                                                Log.d("PointOutActivity", "출금성공");
                                                pointCheck(info_id);
                                            }

                                            @Override
                                            public void onFailed(Error error) {
                                                Log.i("PointOutActivity", "LIST 조회 실패");
                                            }
                                        }).addParam("info_id", info_id)
                                                .addParam("point", "-" + et_inputpoint.getText().toString())
                                                .addParam("date", s_today)
                                                .addParam("type", -1).start();

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
                    } else if (now_cash < input_out_cash) {
                        Toast.makeText(PointOutActivity.this, "잔액이 부족해요 ㅠㅠ", Toast.LENGTH_SHORT).show();
                    } else if (input_out_cash < 1000) {
                        Toast.makeText(PointOutActivity.this, "최소 출금은 천원부터랍니다!", Toast.LENGTH_SHORT).show();
                    } else {
                        Toast.makeText(PointOutActivity.this, "앗! 오류에요. 관리자에게 문의해주세요!", Toast.LENGTH_SHORT).show();
                    }
                }else{
                    Toast.makeText(PointOutActivity.this, "출금금액을 입력해주세요!", Toast.LENGTH_SHORT).show();
                }
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
