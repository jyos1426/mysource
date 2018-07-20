package caps.poomat.NetWork;

/**
 * Created by Hyeon on 2016-04-25.
 */

import android.util.Log;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
//nickname serviceUserId profilePath
//serviceUserId writeNum foodName imagePath location date categoryNum
/**
 * Created by Hyeon on 2016-04-20.
 */

public class PHPRequest {
    private URL url;

    public PHPRequest(String url) throws MalformedURLException { this.url = new URL(url); }

    private String readStream(InputStream in) throws IOException {
        StringBuilder jsonHtml = new StringBuilder();
        BufferedReader reader = new BufferedReader(new InputStreamReader(in, "UTF-8"));
        String line = null;

        while((line = reader.readLine()) != null)
            jsonHtml.append(line);

        reader.close();
        return jsonHtml.toString();
    }

        public String PhPtest(final String userId, final int wrNum,final String foodName,
        final String imgPath,final String loc,final String date,final int catNum) {
            try {
                String postData = "serviceUserId=" + userId +
                        "&" + "writeNum=" + wrNum +
                        "&" + "foodName=" + foodName +
                        "&" + "imagePath=" + imgPath +
                        "&" + "location=" + loc +
                        "&" + "date=" + date +
                        "&" + "categoryNum=" + catNum ;

            HttpURLConnection conn = (HttpURLConnection)url.openConnection();
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            conn.setRequestMethod("POST");
            conn.setConnectTimeout(5000);
            conn.setDoOutput(true);
            conn.setDoInput(true);
            OutputStream outputStream = conn.getOutputStream();
            outputStream.write(postData.getBytes("UTF-8"));
            outputStream.flush();
            outputStream.close();
            String result = readStream(conn.getInputStream());
            conn.disconnect();
            return result;
        }
        catch (Exception e) {
            
            Log.i("PHPRequest", "request was failed.");
            return null;
        }
    }
}
