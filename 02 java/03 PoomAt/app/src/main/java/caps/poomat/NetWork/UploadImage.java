package caps.poomat.NetWork;

import android.os.AsyncTask;
import android.util.Log;

import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by Hyeon on 2016-04-25.
 */
public class UploadImage {
    private String imagePath;
    public OnFinishCallBack callBack;
    public UploadImage(String imagePath){
        this.imagePath = imagePath;
    }
    public void ConnectToServer(){
        new connectToServer().execute();
    }
    class connectToServer extends AsyncTask<String,Void,String>{
        private String urlString = "http://poom.dothome.co.kr/UploadToServer.php";
        private String uriString;

        private String lineEnd = "\r\n";
        private String twoHyphens = "--";
        private String boundary = "*****";
        private int bytesRead, bytesAvailable, bufferSize;
        private byte[] buffer;
        private int maxBufferSize = 1* 1024 * 1024;
        private File sourceFile ;
        private URL url;
        private HttpURLConnection connection;
        private FileInputStream fileInputStream;
        private DataOutputStream dataOutputStream;
        private int serverResponseCode;
        @Override
        public String doInBackground(String ... args){
            uriString = imagePath;
            sourceFile = new File(uriString);
            try {
                if (!sourceFile.isFile()) {
                    throw new IllegalAccessException("sourceFile not Exist");
                }
                fileInputStream = new FileInputStream(sourceFile);

                url = new URL(urlString);
                connection = (HttpURLConnection)url.openConnection();
                connection.setDoInput(true);
                connection.setDoOutput(true);
                connection.setUseCaches(false);
                connection.setRequestMethod("POST");
                connection.setRequestProperty("Connection", "Keep-Alive");
                connection.setRequestProperty("ENCTYPE", "multipart/form-data");
                connection.setRequestProperty("Content-Type", "multipart/form-data;boundary=" + boundary);
                connection.setRequestProperty("uploaded_file", uriString);

                dataOutputStream = new DataOutputStream(connection.getOutputStream());
                dataOutputStream.writeBytes(twoHyphens + boundary + lineEnd);
                dataOutputStream.writeBytes("Content-Disposition: form-data; name=\"uploaded_file\";filename=\""
                        + uriString + "\"" + lineEnd);

                dataOutputStream.writeBytes(lineEnd);


                // create a buffer of  maximum size
                bytesAvailable = fileInputStream.available();

                bufferSize = Math.min(bytesAvailable, maxBufferSize);
                buffer = new byte[bufferSize];

                // read file and write it into form...
                bytesRead = fileInputStream.read(buffer, 0, bufferSize);

                while (bytesRead > 0) {
                    dataOutputStream.write(buffer, 0, bufferSize);
                    bytesAvailable = fileInputStream.available();
                    bufferSize = Math.min(bytesAvailable, maxBufferSize);
                    bytesRead = fileInputStream.read(buffer, 0, bufferSize);
                }


                // send multipart form data necesssary after file data...
                dataOutputStream.writeBytes(lineEnd);
                dataOutputStream.writeBytes(twoHyphens + boundary + twoHyphens + lineEnd);

                // Responses from the server (code and message)
                serverResponseCode = connection.getResponseCode();
                String serverResponseMessage = connection.getResponseMessage();

                Log.i("uploadFile", "HTTP Response is : "
                        + serverResponseMessage + ": " + serverResponseCode);

                //close the streams
                fileInputStream.close();
                dataOutputStream.flush();
                dataOutputStream.close();
                connection.disconnect();
            }catch (Exception e){
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
    public interface OnFinishCallBack{
        void onFinish();
    }
    public void setOnFinishCallBack(OnFinishCallBack callBack){
        this.callBack = callBack;
    }
}
