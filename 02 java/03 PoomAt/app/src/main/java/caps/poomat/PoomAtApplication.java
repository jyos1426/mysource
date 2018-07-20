package caps.poomat;

import android.app.Activity;
import android.app.Application;
import android.content.Context;

import com.facebook.drawee.backends.pipeline.Fresco;
import com.kakao.auth.ApprovalType;
import com.kakao.auth.AuthType;
import com.kakao.auth.IApplicationConfig;
import com.kakao.auth.ISessionConfig;
import com.kakao.auth.KakaoAdapter;
import com.kakao.auth.KakaoSDK;
import com.kakao.util.helper.log.Logger;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Hyeon on 2016-04-25.
 */
public class PoomAtApplication extends Application {
    private static volatile PoomAtApplication instance = null;
    private static volatile Activity currentActivity = null;
    private static volatile List<Activity> activities = new ArrayList<Activity>();

    public void clearActiviy(){
        for(Activity i :activities){
            i.finish();
        }
        activities.clear();
    }
    public static class KakaoSDKAdapter extends KakaoAdapter {
        @Override
        public ISessionConfig getSessionConfig() {
            return new ISessionConfig() {
                @Override
                public AuthType[] getAuthTypes() {
                    return new AuthType[]{AuthType.KAKAO_LOGIN_ALL};
                }

                @Override
                public boolean isUsingWebviewTimer() {
                    return false;
                }

                @Override
                public ApprovalType getApprovalType() {
                    return ApprovalType.INDIVIDUAL;
                }

                @Override
                public boolean isSaveFormData() {
                    return true;
                }
            };
        }

        @Override
        public IApplicationConfig getApplicationConfig() {
            return new IApplicationConfig() {
                @Override
                public Activity getTopActivity() {
                    return PoomAtApplication.getCurrentActivity();
                }

                @Override
                public Context getApplicationContext() {
                    return PoomAtApplication.getPoomAtApplicationContext();
                }
            };
        }
    }

    public static PoomAtApplication getPoomAtApplicationContext() {
        if (instance == null)
            throw new IllegalStateException("this application does not inherit com.kakao.GlobalApplication");
        return instance;

    }

    public static Activity getCurrentActivity() {
        Logger.d("++ currentActivity : " + (currentActivity != null ? currentActivity.getClass().getSimpleName() : ""));
        return currentActivity;
    }
    @Override
    public void onCreate(){
        super.onCreate();
        instance = this;
        Fresco.initialize(this);
        KakaoSDK.init(new KakaoSDKAdapter());
    }
    @Override
    public void onTerminate() {
        super.onTerminate();
        instance = null;
    }

}
