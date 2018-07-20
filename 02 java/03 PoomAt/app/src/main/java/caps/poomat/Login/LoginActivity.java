package caps.poomat.Login;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import com.kakao.auth.ErrorCode;
import com.kakao.auth.ISessionCallback;
import com.kakao.auth.Session;
import com.kakao.network.ErrorResult;
import com.kakao.usermgmt.UserManagement;
import com.kakao.usermgmt.callback.MeResponseCallback;
import com.kakao.usermgmt.response.model.UserProfile;
import com.kakao.util.exception.KakaoException;
import com.kakao.util.helper.log.Logger;

import caps.poomat.MainActivity;
import caps.poomat.R;
import caps.poomat.UserInfo;

/**
 * Created by Hyeon on 2016-05-25.
 */
public class LoginActivity extends Activity {
    private SessionCallBack callback;
    @Override
    public void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);


        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);

        setContentView(R.layout.activity_login);

        callback = new SessionCallBack();
        Session.getCurrentSession().addCallback(callback);
    }
    @Override
    public void onActivityResult(int requestCode,int resultCode,Intent data){
        if(Session.getCurrentSession().handleActivityResult(requestCode,resultCode,data)){
            return ;
        }
        super.onActivityResult(requestCode, resultCode, data);
    }
    @Override
    public void onDestroy(){
        super.onDestroy();
        Session.getCurrentSession().removeCallback(callback);
    }
    protected void requestMe(){
        UserManagement.requestMe(new MeResponseCallback() {
            @Override
            public void onFailure(ErrorResult errorResult) {
                String message = "failed to get user info. msg=" + errorResult;
                Logger.d(message);

                ErrorCode result = ErrorCode.valueOf(errorResult.getErrorCode());
                if (result == ErrorCode.CLIENT_ERROR_CODE) {
                    finish();
                } else {
                }
            }
            @Override
            public void onSessionClosed(ErrorResult errorResult) {
            }
            @Override
            public void onNotSignedUp() {
            }
            @Override
            public void onSuccess(UserProfile result) {
                UserInfo.setKakaoId(result.getId() + "");
                UserInfo.setNickName(result.getNickname());
                UserInfo.setThumbNailUrl(result.getThumbnailImagePath());

                redirectMainActivity();
            }
        });
    }
    private void redirectMainActivity() {
        startActivity(new Intent(this, MainActivity.class));
        finish();
    }
    private class SessionCallBack implements ISessionCallback {

        @Override
        public void onSessionOpened() {
            requestMe();
        }
        @Override
        public void onSessionOpenFailed(KakaoException exception) {
            if(exception != null) {
                Logger.e(exception);
            }
//            setContentView(R.layout.layout_common_kakao_login); // 세션 연결이 실패했을때
        }
    }

}
