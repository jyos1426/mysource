package caps.poomat.NetWork;

import android.annotation.SuppressLint;
import android.os.StrictMode;
/**
 * Created by Hyeon on 2016-04-20.
 */
public class NetworkUtil {
    @SuppressLint("NewApi")
    static public void setNetworkPolicy() {
        if (android.os.Build.VERSION.SDK_INT > 9) {
            StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
            StrictMode.setThreadPolicy(policy);
        }
    }
}
