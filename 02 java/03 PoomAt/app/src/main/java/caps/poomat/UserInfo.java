package caps.poomat;

/**
 * Created by Hyeon on 2016-04-25.
 */
public class UserInfo {
    private static String kakaoId;
    private static String nickName;
    private static String thumbNailUrl;
    private static double userLat = 0.0;
    private static double userLng = 0.0;

    public static String getKakaoId() {
        return kakaoId;
    }

    public static String getNickName() {
        return nickName;
    }

    public static String getThumbNailUrl() {
        return thumbNailUrl;
    }

    public static double getUserLat() {
        return userLat;
    }

    public static double getUserLng() {
        return userLng;
    }
    public static void setUserLat(double userLat) {
        UserInfo.userLat = userLat;
    }
    public static void setUserLng(double userLng) {
        UserInfo.userLng = userLng;
    }
    public static void setKakaoId(String kakaoId) {
        UserInfo.kakaoId = kakaoId;
    }

    public static void setNickName(String nickName) {
        UserInfo.nickName = nickName;
    }

    public static void setThumbNailUrl(String thumbNailUrl) {
        UserInfo.thumbNailUrl = thumbNailUrl;
    }
}
