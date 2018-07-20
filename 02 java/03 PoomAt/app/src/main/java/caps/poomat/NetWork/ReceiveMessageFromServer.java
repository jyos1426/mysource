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
import java.util.ArrayList;
import java.util.List;

import caps.poomat.Message.MessageModel;

/**
 * Created by Hyeon on 2016-06-07.
 */
public class ReceiveMessageFromServer {
    private List<MessageModel> models = new ArrayList<>();

    private FinishCallBack callBack;

    public void execute(String userId){
        models.clear();
        new connectToServer().execute(userId);
    }

    private class connectToServer extends AsyncTask<String,Void,String> {
        private String urlString = "http://poom.dothome.co.kr/message/findMessage.php";
        private String data;
        private HttpURLConnection urlConnection;
        private OutputStreamWriter outputStreamWriter;
        private URL url;
        private String result;
        private JSONObject jsonObject;
        private JSONArray jsonArray;
        @Override
        protected String doInBackground(String ... args)
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

                data = "recUserId=" + args[0];
//                data = "recUserId=" +"165115503" ;
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
                Log.d("hellomessage", result);


                jsonObject = new JSONObject(result);
                jsonArray = jsonObject.getJSONArray("poomMSG");

                for(int i =0; i< jsonArray.length(); i++){
                    jsonObject = jsonArray.getJSONObject(i);
                    MessageModel model = new MessageModel();
                    model.setWriteNum(jsonObject.getInt("writeNum"));
                    model.setMessage(jsonObject.getString("message"));
                    model.setRecUserId(jsonObject.getString("recUserId"));
                    model.setMsgNum(jsonObject.getInt("msgNum"));
                    model.setSendUserId(jsonObject.getString("sendUserId"));
                    model.setSendUserNick(jsonObject.getString("sendUserNick"));

                    models.add(model);
                }


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
                callBack.onFinish(models);
            }
        }
    }
    public interface FinishCallBack{
        void onFinish(List<MessageModel> dataSet);
    }
    public void setFinishCallBack(FinishCallBack callBack){
        this.callBack = callBack;
    }}

