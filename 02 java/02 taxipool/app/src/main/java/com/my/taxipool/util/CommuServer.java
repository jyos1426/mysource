package com.my.taxipool.util;
/**
 * Created by JeyHoon on 2016-5-22.
 * Created by Hyeon on 2016-11-16.
 * Edited by Hyeon on 2017-06-22.
 */

import android.os.AsyncTask;
import android.os.Handler;
import android.os.Message;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

public class CommuServer extends AsyncTask<String,Void,Message> {
    public static final String ROOT_URL="http://192.168.12.30:8888/taxi_db_test2/";
//    public static final String ROOT_URL="http://13.124.132.118:8080/taxi_db_test2/";
    public static final String SELECT_ROOM_LIST = ROOT_URL+"roomlist.do";
    public static final String SELECT_ROOM_INFO = ROOT_URL+"roominfo.do";
    public static final String REGIST_ROOM = ROOT_URL+"registroom.do";
    public static final String SELECT_PEOPLE_ROOMSHARE = ROOT_URL+"roomsharepeople.do";
    public static final String SELECT_BOCKLIST = ROOT_URL+"blocklist.do";
    public static final String DELETE_BLOCKLIST = ROOT_URL+"blocklistcancel.do";
    public static final String UPDATE_STATE = ROOT_URL+"stateupdate.do";
    public static final String SELECT_BY_INFOID = ROOT_URL+"selectbyid.do";
    public static final String UPDATE_ADDSCORE = ROOT_URL+"addscore.do";
    public static final String INSERT_ADDBLOCKLIST = ROOT_URL+"addblocklist.do";
    public static final String POINT_CHECK = ROOT_URL+"pointcheck.do";
    public static final String POINT_RECORD = ROOT_URL+"pointrecord.do";
    public static final String POINT_CHARGE = ROOT_URL+"pointcharge.do";
    public static final String SELECT_SHARE_LIST = ROOT_URL+"sharelist.do";
    public static final String REQUEST_ROOM = ROOT_URL+"requestroom.do";

    protected String url=ROOT_URL;
    protected String query = "";

    public static final int FAILED = OnCommuListener.FAILED;
    public static final int SUCCESS = OnCommuListener.SUCCESS;

    @Override
    //background스레드를 실행하기전 준비 단계
    //변수의 초기화나, 네트워크 통신전 셋팅해야할 것
    protected void onPreExecute() {
        super.onPreExecute();
    }

    @Override
    // background 스레드로 일처리를 해주는 곳,  비동기적
    protected Message doInBackground(String... params) {
        HttpURLConnection conn = null;
        StringBuilder builder = new StringBuilder();    //변경이 자유로운 클래스
        Message msg = new Message();
        try {
            URL url = new URL(this.url);
            conn = (HttpURLConnection)url.openConnection();
            if (conn != null) {//정상접속이 되었다면
                conn.setConnectTimeout(1000);
                conn.setRequestMethod("POST");
                conn.setDoInput(true);
                conn.setDoOutput(true);
                conn.setUseCaches(false);//캐쉬사용안함

                //QueryString을 추가하는 부분, UTF-8로 한글까지 Server에서 이상없이 받을 수 있음
                OutputStream os = conn.getOutputStream();
                BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));
                bw.write(query);
                bw.flush();
                bw.close();

                if (conn.getResponseCode() == HttpURLConnection.HTTP_OK) {
                    //InputStreamReader 객체 얻어오기
                    InputStreamReader isr =
                            new InputStreamReader(conn.getInputStream());
                    BufferedReader bufferedReader = new BufferedReader(isr);
                    while (true) {
                        String line = bufferedReader.readLine();
                        if (line == null) break;
                        //읽어온 문자열을 builder에 저장
                        builder.append(line);
                    }
                    bufferedReader.close();
                }
            }
            msg = handler.obtainMessage();
            msg.what = SUCCESS; //성공
            msg.obj = builder.toString(); //가져온 String Data를 저장

        } catch (Exception e) {
            e.printStackTrace();
            if(null!=e.getMessage()) {
                Log.e("Test,post 전송중 에러!", e.getMessage());
            }
            msg=handler.obtainMessage();
            msg.what = FAILED; //실패
            msg.obj = "No response.";
            handler.sendMessage(msg);
        }finally {
            if (null != conn)
                conn.disconnect(); //접속 종료
        }
        return msg;
    }

    @Override
    // 중간중간에 UI스레드 에게 일처리를 맡겨야 하는 상황일때
    protected void onProgressUpdate(Void... values) {
        super.onProgressUpdate(values);
    }

    @Override
    //UI변경 ( ex) textview.setText("~~") )할때 사용
    protected void onPostExecute(Message msg) {
        final Message m=new Message();
        m.copyFrom(msg);
        handler.sendMessage(m);
    }

    public interface OnCommuListener {
        public static final int FAILED = 2;
        public static final int SUCCESS = 1;
        void onSuccess(final JSONObject obj,final JSONArray arr,final String str);
        void onFailed(final Error error);
    }

    public OnCommuListener checkHandler = null;
    protected Handler handler = new Handler() {
        /**
         * Subclasses must implement this to receive messages.
         * @param msg
         */
        @Override
        public void handleMessage(Message msg) {
            String jsonStr1 = (String) msg.obj;
            Log.d("ddu obj result",jsonStr1);
            switch (msg.what) {
                case SUCCESS:
                    try {
                        JSONObject jsonObj = new JSONObject(jsonStr1);
                        int resultCode=jsonObj.getInt("result");
                        if(resultCode==SUCCESS) {
                            if(jsonObj.has("object")){
                                sendSuccess(jsonObj.getJSONObject("object"),null,null);
                            }else if(jsonObj.has("list")){
                                sendSuccess(null,jsonObj.getJSONArray("list"),null);
                            }else if(jsonObj.has("string")){
                                sendSuccess(null,null,jsonObj.getString("string"));
                            }
                        }else if(resultCode==FAILED){
                            String error=jsonObj.getString("error");
                            String hint=jsonObj.getString("hint");
                            sendFailed(error,hint);
                        } else {
                            sendFailed("ERROR#999","HTML Error");
                        }

                    } catch (Exception e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                        sendFailed("ERROR#444", "JSON Data has Exception");
                    }
                    break;
                case FAILED:
                    sendFailed("ERROR#404", jsonStr1);
                    //                    sendCheckHandler(OnCheckHandler.HAS_NOT, null);
                    break;
            }
        }
    };
    protected CommuServer(){}
    public CommuServer(String url, OnCommuListener checkHandler) {
        this.checkHandler = checkHandler;
        this.url = url;
    }
    public CommuServer(String url, OnCommuListener checkHandler,JSONObject obj) {
        this(url,checkHandler);
        setParam(obj);
    }
    public CommuServer setParam(JSONObject obj){
        String $value=obj.toString();
        addParam("json", $value, "UTF-8");
        return this;
    }
    public CommuServer addParam(String key, String value){
        this.query=this.query+"&"+key+"="+value;
        return this;
    }
    public CommuServer addParam(String key, boolean value){
        this.query=this.query+"&"+key+"="+value;
        return this;
    }
    public CommuServer addParam(String key, double value){
        this.query=this.query+"&"+key+"="+value;
        return this;
    }
    public CommuServer addParam(String key, int value){
        this.query=this.query+"&"+key+"="+String.valueOf(value);
        return this;
    }
    public CommuServer addParam(String key, long value){
        this.query=this.query+"&"+key+"="+String.valueOf(value);
        return this;
    }
    public CommuServer addParam(String key, float value){
        this.query=this.query+"&"+key+"="+String.valueOf(value);
        return this;
    }
    public CommuServer addParamUTF8(String key, String value){
        return addParam(key,value,"UTF-8");
    }
    public CommuServer addParam(String key, String $value, String charSet){
        String value=$value;
        try{
            value= URLEncoder.encode(value, charSet);
        }catch(Exception e){
            value=$value;
        }
        this.query=this.query+"&"+key+"="+value;
        return this;
    }

    private void sendSuccess(JSONObject obj, JSONArray arr, String str) {
        if (null != checkHandler) {
            checkHandler.onSuccess(obj,arr,str);
        }
    }
//    private void sendSuccess(JSONArray arr) {
//        if (null != checkHandler) {
//            checkHandler.onSuccess(arr);
//        }
//    }
//    private void sendSuccess(String str) {
//        if (null != checkHandler) {
//            checkHandler.onSuccess(str);
//        }
//    }
    private void sendFailed(String error, String hint) {
        if (null != checkHandler) {
            checkHandler.onFailed(new Error(error+":"+hint));
        }
    }

    public AsyncTask<String,Void,Message> start(String... params){
        return execute(params);
    }
}

