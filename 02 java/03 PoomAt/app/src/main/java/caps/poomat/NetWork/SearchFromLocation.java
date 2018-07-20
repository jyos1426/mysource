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

import caps.poomat.FragmentMap.FoodModel;
import caps.poomat.UserInfo;

/**
 * Created by Hyeon on 2016-04-25.
 */
public class SearchFromLocation {
    private FinishCallBack callBack;
    private List<FoodModel> foodModels = new ArrayList<>();

    public void execute(){
        new connectToServer().execute();
    }

    class connectToServer extends AsyncTask<String,Void,String> {
        private int TIMEOUT = 1000;
        private URL url;
        private String result;
        private String data;
        private String urlString = "http://poom.dothome.co.kr/showClosest.php";    //////// 여기에 url 주소 적어주고
        private OutputStreamWriter outputStreamWriter;
        private JSONArray jsonArray = new JSONArray();
        private JSONObject jsonObject ;

        @Override
        protected String doInBackground(String... args) {
            try {
                URL url = new URL(urlString);
                HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();

                urlConnection.setDoOutput(true);
                urlConnection.setDoInput(true);
                urlConnection.setRequestMethod("POST");
                urlConnection.setConnectTimeout(10 * TIMEOUT);
                urlConnection.setReadTimeout(10 * TIMEOUT);
                urlConnection.setRequestProperty("Accept-Charset", "UTF-8");
                urlConnection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");


                urlConnection.connect();

                data = "latitude=" + UserInfo.getUserLat() + "&" + "longitude=" + UserInfo.getUserLng();
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

                Log.d("helloabced",result);
                jsonObject = new JSONObject(result);
                jsonArray = jsonObject.getJSONArray("poomFood");

                for(int i =0; i< jsonArray.length(); i++){
                    jsonObject = jsonArray.getJSONObject(i);
                    FoodModel model = new FoodModel();
                    model.setServiceUserId(jsonObject.getString("serviceUserId"));
                    model.setFoodName(jsonObject.getString("foodName"));
                    model.setFoodImagePath(jsonObject.getString("imagePath"));
                    model.setDate(jsonObject.getString("date"));
                    model.setWriteNum(jsonObject.getInt("writeNum"));
                    model.setCategoryNum(jsonObject.getInt("categoryNum"));
                    model.setDistance(jsonObject.getDouble("distance"));
                    model.setLatitude(jsonObject.getDouble("latitude"));
                    model.setLongitude(jsonObject.getDouble("longitude"));
                    foodModels.add(model);
                }
                urlConnection.disconnect();
            } catch (Exception e) {
                e.printStackTrace();
            }
            return "";
        }

        @Override
        protected void onPostExecute(String result) {
            if(callBack != null){
                callBack.onFinish(foodModels);
            }
        }
    }

    public interface FinishCallBack{
        void onFinish(List<FoodModel> dataSet);
    }
    public void setFinishCallBack(FinishCallBack callBack){
        this.callBack = callBack;
    }
}
