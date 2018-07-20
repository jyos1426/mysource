package com.my.taxipool.activity;


import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;

import com.my.taxipool.R;

public class SignupActivity extends AppCompatActivity {
    //private String cookieValues="";
    //Handler handler = new Handler();
    //CustomerInfo info;

    EditText name;
    EditText nickname;
    EditText phone;
    RadioGroup rg;

    String s_name;
    String s_phone;
    String s_nickname;
    String s_gender;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup);

        rg = (RadioGroup)findViewById(R.id.rg);
        name = (EditText)findViewById(R.id.edt_name);
        nickname = (EditText)findViewById(R.id.edt_nickname);
        phone = (EditText)findViewById(R.id.edt_phone);
        RadioButton defaultGender = (RadioButton)findViewById(R.id.man);
        defaultGender.setChecked(true);

        final Button bt_cert = (Button)findViewById(R.id.cert);
        TextView tx_commit = (TextView)findViewById(R.id.commit);
        //Button bt_commit = (Button)findViewById(R.id.commit);

        //이부분은 문자메세지 인증번호부분이지만, 모듈구매를 해야하므로 생략합니다.
        bt_cert.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(getApplicationContext(), "본인인증에 성공하였습니다.(기능구현준비중)", Toast.LENGTH_LONG).show();
                bt_cert.setEnabled(false);
            }
        });

        tx_commit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                s_name = name.getText().toString();
                s_nickname = nickname.getText().toString();
                s_phone = phone.getText().toString();

                int r_id = rg.getCheckedRadioButtonId();
                RadioButton gender = (RadioButton)findViewById(r_id);
                Log.i("genderChk:",gender.getText().toString());

                if(("남성").equals(gender.getText().toString())){
                    s_gender = "m";
                }else{
                    s_gender = "f";
                }

                Log.i("commitSignupA",s_name+","+s_nickname+","+s_phone+","+s_gender);

                if(s_name.length() != 0 && s_name.length() < 20){
                    if(s_nickname.length() != 0 && s_nickname.length() < 20){
                        if(s_phone.length() != 0 && s_phone.length() < 20){
                            if(s_gender.length() !=0){
                                Intent intent = new Intent();
                                //intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
                                //intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                intent.putExtra("name", s_name);
                                intent.putExtra("nickname", s_nickname);
                                intent.putExtra("phone", s_phone);
                                intent.putExtra("gender",s_gender);
                                setResult(RESULT_OK, intent);
                                finish();
                            }else{
                                Toast.makeText(getApplicationContext(), "성별을 입력해주세요", Toast.LENGTH_LONG).show();
                            }
                        }else if(s_phone.length() == 0){
                            Toast.makeText(getApplicationContext(), "전화번호를 입력해주세요", Toast.LENGTH_LONG).show();
                        }else{
                            Toast.makeText(getApplicationContext(), "전화번호의 길이가 20글자를 넘을 수 없습니다.", Toast.LENGTH_LONG).show();
                        }
                    }else if(s_nickname.length() == 0){
                        Toast.makeText(getApplicationContext(), "닉네임을 입력해주세요", Toast.LENGTH_LONG).show();
                    }else{
                        Toast.makeText(getApplicationContext(), "닉네임의 길이가 20글자를 넘을 수 없습니다.", Toast.LENGTH_LONG).show();
                    }
                }else if(s_name.length() == 0){
                    Toast.makeText(getApplicationContext(), "이름을 입력해주세요", Toast.LENGTH_LONG).show();
                }else{
                    Toast.makeText(getApplicationContext(), "이름의 길이가 20글자를 넘을 수 없습니다.", Toast.LENGTH_LONG).show();
                }
            }
        });
    }
}


