package caps.poomat.NetWork;

import android.os.AsyncTask;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by Hyeon on 2016-04-07.
 */
public class DeleteFromUserId {
    private FinishCallBack callBack;

    public void execute(int writeNum){

        new connectToServer().execute(writeNum);
    }

    private class connectToServer extends AsyncTask<Integer,Void,String> {
        private String urlString = "http://poom.dothome.co.kr/delete.php";
        private String data;
        private HttpURLConnection urlConnection;
        private OutputStreamWriter outputStreamWriter;
        private URL url;
        private String result;
        private JSONObject jsonObject;
        private JSONArray jsonArray;
        @Override
        protected String doInBackground(Integer ... args)
        {
            try {
                url = new URL(urlString);
                urlConnection = (HttpURLConnection)url.openConnection();

                urlConnection.setDoOutput(true);
                urlConnection.setDoInput(true);
                urlConnection.setRequestMethod("POST");
                urlConnection.setRequestProperty("Accept-Charset", "UTF-8");
                urlConnection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");

                urlConnection.connect();

                data = "writeNum=" + args[0];
                Log.d("hello", data);

                outputStreamWriter = new OutputStreamWriter(urlConnection.getOutputStream());
                outputStreamWriter.write(data);
                outputStreamWriter.flush();
                outputStreamWriter.close();


                InputStreamReader inputStreamReader = new InputStreamReader(urlConnection.getInputStream(), "UTF-8");
                BufferedReader bufferedReader = new BufferedReader(inputStreamReader);
                StringBuilder stringBuilder = new StringBuilder();
                String line = null;

                while ((line = bufferedReader.readLine()) != null) {
                    stringBuilder.append(line + '\n');
                }

                result = stringBuilder.toString();
                Log.d("hello", result);

                inputStreamReader.close();
                urlConnection.disconnect();

            }catch (Exception e){
                e.printStackTrace();
            }

            return "";
        }
    @Override
    protected void onPostExecute(String result){
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
    }}

