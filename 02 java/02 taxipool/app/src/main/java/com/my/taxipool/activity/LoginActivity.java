package com.my.taxipool.activity;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.widget.Toast;

import com.kakao.auth.ApiResponseCallback;
import com.kakao.auth.ErrorCode;
import com.kakao.auth.ISessionCallback;
import com.kakao.auth.Session;
import com.kakao.network.ErrorResult;
import com.kakao.usermgmt.UserManagement;
import com.kakao.usermgmt.callback.LogoutResponseCallback;
import com.kakao.usermgmt.callback.MeResponseCallback;
import com.kakao.usermgmt.response.model.UserProfile;
import com.kakao.util.exception.KakaoException;
import com.kakao.util.helper.log.Logger;
import com.my.taxipool.MyInfo;
import com.my.taxipool.R;
import com.my.taxipool.util.CommuServer;
import com.my.taxipool.util.ImageHelper;
import com.my.taxipool.util.Set;
import com.my.taxipool.vo.CustomerInfo;
import com.my.taxipool.vo.Room;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

public class LoginActivity extends AppCompatActivity {

    SessionCallback callback;

    //KaKao에서 받은 VALUES
    String info_id;
    String profile_pic;

    //회원가입창에서 필요한 VALUES
    String s_name;
    String s_nickname;
    String s_phone;
    String s_gender;

    Bitmap bitmap;

    //회원정보 입력 VO
    CustomerInfo info;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        /**카카오톡 로그아웃 요청**/
        //한번 로그인이 성공하면 세션 정보가 남아있어서 로그인창이 뜨지 않고 바로 onSuccess()메서드를 호출합니다.
        //테스트 하시기 편하라고 매번 로그아웃 요청을 수행하도록 코드를 넣었습니다 ^^

        UserManagement.requestLogout(new LogoutResponseCallback() {
            @Override
            public void onCompleteLogout() {
                //로그아웃 성공 후 하고싶은 내용 코딩 ~
            }
        });

        callback = new SessionCallback();
        Session.getCurrentSession().addCallback(callback);

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        //회원가입 성공
        super.onActivityResult(requestCode, resultCode, data);
        if(requestCode == 5){
            s_name = data.getStringExtra("name");
            s_nickname = data.getStringExtra("nickname");
            s_phone = data.getStringExtra("phone");
            s_gender = data.getStringExtra("gender");

            //★테스트를 위해 잠시 가입을 막아둡니다!!, 바로test로가게바꿔놈!!
            requestSignUp();

            //★원래는 onSuccess에 해야하지만 여기서 서버에 보내보겠습니다!!
            //redirectTest();
        }

        //간편로그인시 호출, 없으면 간편로그인시 로그인 성공화면으로 넘어가지 않음
        else if (Session.getCurrentSession().handleActivityResult(requestCode, resultCode, data)) {
            return;
        }
    }

    private void requestSignUp() {
        UserManagement.requestSignup(new ApiResponseCallback<Long>() {
            @Override
            public void onNotSignedUp() {
            }
            @Override
            public void onSuccess(Long result) {
                requestMe();
            }
            @Override
            public void onFailure(ErrorResult errorResult) {
                final String message = "UsermgmtResponseCallback : failure : " + errorResult;
                com.kakao.util.helper.log.Logger.w(message);
                finish();
            }
            @Override
            public void onSessionClosed(ErrorResult errorResult) {
            }
        },null);
    }



    /**
     * 사용자의 상태를 알아 보기 위해 me API 호출을 한다.
     */
    protected void requestMe() {
        UserManagement.requestMe(new MeResponseCallback() {
            @Override
            public void onFailure(ErrorResult errorResult) {
                String message = "failed to get user info. msg=" + errorResult;
                Logger.d(message);

                ErrorCode result = ErrorCode.valueOf(errorResult.getErrorCode());
                if (result == ErrorCode.CLIENT_ERROR_CODE) {
                    finish();
                } else {
                    //redirectLoginActivity();
                }
            }

            @Override
            public void onSessionClosed(ErrorResult errorResult) {
//                redirectLoginActivity();
            }

            //택시풀 회원가입 성공한 경우.
            @Override
            public void onSuccess(UserProfile userProfile) {
                Logger.d("UserProfile : " + userProfile);

                Log.d("requestMe>onSuccess","kakaoID:"+userProfile.getId()+
                        ","+"name"+s_name+","+"nickname"+s_nickname+","+"phoneNumber"+s_phone+","+"gender"+s_gender);
                info_id = String.valueOf(userProfile.getId());
                profile_pic = userProfile.getProfileImagePath();
                Set.Save(getApplicationContext(), "info_id", info_id);
                //사용자의 프로필사진이 없는 경우 기본이미지로 할 것!
                redirectTest();
                //redirectMainActivity();
            }

            @Override
            public void onNotSignedUp() {
                redirectSignupActivity();
            }
        });
    }



    private class SessionCallback implements ISessionCallback {
        @Override
        public void onSessionOpened() {

            UserManagement.requestMe(new MeResponseCallback() {

                @Override
                public void onFailure(ErrorResult errorResult) {
                    String message = "failed to get user info. msg=" + errorResult;
                    Logger.d(message);

                    ErrorCode result = ErrorCode.valueOf(errorResult.getErrorCode());
                    if (result == ErrorCode.CLIENT_ERROR_CODE) {
                        finish();
                    } else {
                        //redirectMainActivity();
                    }
                }

                @Override
                public void onSessionClosed(ErrorResult errorResult) {
                }

                @Override
                public void onNotSignedUp() {
                    //세션 오픈은 성공했으나 사용자 정보 요청 결과 사용자 가입이 안된 상태로 자동 가입 앱이 아닌 경우에만 호출된다!
                    //회원가입창 (onActivityResult로 갑니다)
                    Intent intent = new Intent(LoginActivity.this, SignupActivity.class);
                    startActivityForResult(intent, 5);
                }
            //간편로그인 onSuccess
            @Override
            public void onSuccess(UserProfile userProfile) {
                //앱 연결에 성공(?), 로그인에 성공(?)하면 로그인한 사용자의 고유일련번호, 닉네임, 이미지URL을 리턴
                Log.e("UserProfile", userProfile.toString());

                info_id = String.valueOf(userProfile.getId());
                profile_pic = userProfile.getNickname();
                Set.Save(getApplicationContext(), "info_id", info_id);
                getMyInfo();

                Intent intent = new Intent(LoginActivity.this, HomeActivity2.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);

                Toast.makeText(getApplicationContext(), "간편로그인으로 접속하였습니다", Toast.LENGTH_SHORT).show();

                startActivity(intent);
                finish();
            }
        });

        }

        @Override
        public void onSessionOpenFailed(KakaoException exception) {
            //세션 연결이 실패되었을 때
        }


    }
    protected void redirectTest() {
        //원래 kakaoID , Image는 onSuccess에서 UserProfile을 이용해 받습니다.
        //그래서 임시로 막아둔거에요.
        //info = new CustomerInfo("kakaoIDt",  "http://mud-kage.kakao.co.kr/14/dn/btqgJ3IPgaS/nNqXGMV8ZLq0sBmaK62PtK/o.jpg", s_phone, s_name, s_nickname, s_gender);
        info = new CustomerInfo(info_id, profile_pic, s_phone, s_name, s_nickname, s_gender);
        Log.i("LoginA:Commit:",info.toString());
        Log.i("LoginA:Commit:info_name",info.getInfo_name());


        new Thread() {
            @Override
            public void run() {
                URL url;
                HttpURLConnection conn;

                try {
                    String queryString = "info_id="+info_id+
                            "&phone_no="+profile_pic+
                            "&info_name="+info.getInfo_name()+
                            "&nickname="+info.getNickname()+
                            "&info_gender="+info.getInfo_gender()+
                            "&profile_pic="+info.getProfile_pic();

                    Log.i("SuccessActivity",info.getInfo_id());

                    url = new URL("http://192.168.12.30:8888/taxi_db_test2/customertest.do");//?"+queryString);

                    conn = (HttpURLConnection)url.openConnection();
                    conn.setRequestMethod("POST");
                    conn.setDoInput(true);
                    conn.setDoOutput(true);
                    conn.setUseCaches(false);
                    Log.i("SuccessActivity","conn1"+ conn.getRequestMethod());

                    //QueryString을 추가하는 부분, UTF-8로 한글까지 Server에서 이상없이 받을 수 있음
                    OutputStream os = conn.getOutputStream();
                    BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));
                    bw.write(queryString);
                    bw.flush();
                    bw.close();

                    final int responseCode = conn.getResponseCode();

                    switch (responseCode){
                        case HttpURLConnection.HTTP_OK:
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    Toast.makeText(getApplicationContext(), "정상응답", Toast.LENGTH_SHORT).show();
                                }
                            });

                            //응답결과 수신
                            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
                            String responseData = null;
                            while((responseData = br.readLine())!=null) {
                                Log.i("HttpNetwork","응답결과:"+responseData);
                            }
                            break;
                        case HttpURLConnection.HTTP_NOT_FOUND:
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    Toast.makeText(getApplicationContext(), "NOT FOUND", Toast.LENGTH_SHORT).show();
                                }
                            });
                            break;
                        default:
                            //HTTP_OK가 아닌 경우 Error를 Toast로 나타냅니다.
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    Toast.makeText(getApplicationContext(), "response code:" + responseCode, Toast.LENGTH_SHORT).show();
                                }
                            });

                            break;
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }.start();

        Intent intent = new Intent(LoginActivity.this, HomeActivity2.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        startActivity(intent);
        finish();
    }
    protected void redirectSignupActivity() {
        final Intent intent = new Intent(this, SignupActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        startActivity(intent);
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
            Intent intent;
            if(MyInfo.getState() == Room.NO_MEMBER){
                intent = new Intent(LoginActivity.this,HomeActivity2.class);
            }else{
                intent = new Intent(LoginActivity.this,RoomActivity.class);
            }
            startActivity(intent);
        }catch(InterruptedException e) {
            e.printStackTrace();
        }
    }


}