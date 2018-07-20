package caps.poomat.NetWork;

import android.os.AsyncTask;
import android.util.Log;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.StringTokenizer;

import caps.poomat.UserInfo;

/**
 * Created by Hyeon on 2016-04-25.
 */
public class UploadData {
    private String foodName,location,date,imagePath;
    private int catNum;
    private double latitude,longitude;
    public OnFinishCallBack callBack;
    private int writeNum = 0;
    public UploadData(String foodName,String imagePath,double latitude, double longitude,String date,int catNum){
        this.foodName = foodName;
        this.imagePath = imagePath;
        this.location = location;
        this.date = date;
        this.latitude = latitude;
        this.longitude = longitude;
        this.catNum = catNum;
    }
    public void ConnectToServer(){
        new connectToServer().execute();
    }
    class connectToServer extends AsyncTask<String,Void,String>{
        private HttpURLConnection urlConnection;
        private URL url;
        private String urlString = "http://poom.dothome.co.kr/Data_insert.php";
        private String result;
        @Override
        public String doInBackground(String ... args){

            try {
                String postData = "serviceUserId=" + UserInfo.getKakaoId() +
                        "&" + "foodName=" + foodName +
                        "&" + "imagePath=" + "http://poom.dothome.co.kr/uploads/" + getFileUri(imagePath) +
                        "&" + "latitude=" + latitude +
                        "&" + "longitude=" + longitude +
                        "&" + "date=" + date +
                        "&" + "categoryNum=" + catNum;

                url = new URL(urlString);

                urlConnection = (HttpURLConnection) url.openConnection();

                urlConnection.setRequestProperty("Accept-Charset", "UTF-8");
                urlConnection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");

                urlConnection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
                urlConnection.setRequestMethod("POST");
                urlConnection.setConnectTimeout(5000);
                urlConnection.setDoOutput(true);
                urlConnection.setDoInput(true);
                Log.d("hello",postData);
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
            UploadImage uploadImage = new UploadImage(imagePath);
            uploadImage.setOnFinishCallBack(new UploadImage.OnFinishCallBack() {
                @Override
                public void onFinish() {
                    if(callBack != null){
                        callBack.onFinish();
                    }
                }
            });
            uploadImage.ConnectToServer();
        }
    }
    public String getFileUri(String imageUri){
        String imageName = null;
        StringTokenizer values = new StringTokenizer( imageUri, "/" );

        while (values.hasMoreTokens()){
            imageName = String.valueOf(values.nextToken());
        }
        return imageName;
    }

    public interface OnFinishCallBack{
        void onFinish();
    }
    public void setOnFinishCallBack(OnFinishCallBack callBack){
        this.callBack = callBack;
    }
}
