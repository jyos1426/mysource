package caps.poomat.NetWork;

import android.os.AsyncTask;
import android.util.Log;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by Hyeon on 2016-04-25.
 */
public class SendMessageToServer {
    private String sendUserId,sendUserNick,recUserId,message;
    private int writeNum = 0;
    private FinishCallBack callBack;
    public SendMessageToServer(String sendUserId, String sendUserNick, String recUserId, String message, int writeNum){
        this.sendUserId = sendUserId;
        this.sendUserNick = sendUserNick;
        this.recUserId = recUserId;
        this.message = message;
        this.writeNum = writeNum;
    }
    public void ConnectToServer(){
        new connectToServer().execute();
    }
    class connectToServer extends AsyncTask<String,Void,String> {
        private HttpURLConnection urlConnection;
        private URL url;
        private String urlString = "http://poom.dothome.co.kr/message/sendMessage.php";
        private String result;
        @Override
        public String doInBackground(String ... args){

            try {
                String postData = "sendUserId=" + sendUserId+
                        "&" + "sendUserNick=" + sendUserNick+
                        "&" + "recUserId=" + recUserId +
                        "&" + "message=" + message +
                        "&" + "writeNum=" + writeNum ;

                url = new URL(urlString);

                urlConnection = (HttpURLConnection) url.openConnection();

                urlConnection.setRequestProperty("Accept-Charset", "UTF-8");
                urlConnection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");

                urlConnection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
                urlConnection.setRequestMethod("POST");
                urlConnection.setConnectTimeout(5000);
                urlConnection.setDoOutput(true);
                urlConnection.setDoInput(true);

                Log.d("hello", postData);
                OutputStream outputStream = urlConnection.getOutputStream();
                outputStream.write(postData.getBytes("UTF-8"));
                outputStream.flush();
                outputStream.close();

                InputStreamReader inputStreamReader = new InputStreamReader(urlConnection.getInputStream(), "UTF-8");
                BufferedReader bufferedReader = new BufferedReader(inputStreamReader);
                StringBuilder stringBuilder = new StringBuilder();
                String line = null;

                while((line = bufferedReader.readLine()) != null) {
                    stringBuilder.append(line);
                }
                result = stringBuilder.toString();
                inputStreamReader.close();
                urlConnection.disconnect();

                Log.d("hello", result);
            }
            catch (Exception e){
                e.printStackTrace();
            }
            return "";
        }
        @Override
        public void onPostExecute(String result){
            if(callBack != null){
                callBack.onFinish();
            }
        }
    }

    public interface FinishCallBack{
        void onFinish();
    }
    public void setFinishCallBack(FinishCallBack callBack){
        this.callBack = callBack;
    }
}
