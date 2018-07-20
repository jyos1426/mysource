package com.my.taxipool.activity;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.widget.ListView;

import com.my.taxipool.R;
import com.my.taxipool.adapter.BlockListAdapter;
import com.my.taxipool.util.CommuServer;
import com.my.taxipool.util.Set;
import com.my.taxipool.vo.BlockCustomerInfo;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

/**
 * Created by sungjin on 2017-06-20.
 */

public class BlockActivity extends AppCompatActivity{
    JSONArray result;
    BlockListAdapter adapter;
    ArrayList<BlockCustomerInfo> data;
    ListView listView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_blocklist);

        final String info_id = Set.Load(getApplicationContext(), "info_id", null);
        data = new ArrayList<>();

        listView=(ListView)findViewById(R.id.listview);

        new CommuServer(CommuServer.SELECT_BOCKLIST, new CommuServer.OnCommuListener() {

            @Override
            public void onSuccess(JSONObject object, JSONArray arr, String str) {

                result = arr;

                try{
                    for(int i=0; i<result.length(); i++){

                        /* 변수명 주의! JSON의 결과로 오는 것의 INFO_ID는 BLACKLIST_ID(NICKNAME, PROFILE도 마찬가지다) */
                        Log.d("BlockActivity ArrayList",new BlockCustomerInfo(info_id, result.getJSONObject(i).getString("info_id"),
                                result.getJSONObject(i).getString("nickname"), result.getJSONObject(i).getString("profile_pic")).toString());
                        data.add(
                                new BlockCustomerInfo(
                                        info_id, result.getJSONObject(i).getString("info_id"), result.getJSONObject(i).getString("nickname"), result.getJSONObject(i).getString("profile_pic"))
                        );
                    }
                    adapter = new  BlockListAdapter(BlockActivity.this, R.layout.view_list_people_info,data);
                    listView.setAdapter(adapter);

                }catch(JSONException e){
                    Log.d("BlockActivity","JSONException");
                    e.printStackTrace();
                }
            }
            @Override
            public void onFailed(Error error) {
                Log.i("BlockActivity", "LIST 조회 실패");
            }
        }).addParam("info_id", info_id).start();
    }

    /*
    public void refresh(){
        Log.d("BlcokActivity","refresh() 메소드 호출");
        Intent intent = new Intent(BlockActivity.this, BlockActivity.class);
        startActivity(intent);
        finish();
    }
    */

    /*
    public JSONArray jsonArrayNetwork(String str_url,String query){
        URL url;
        HttpURLConnection conn;
        String responseData;
        try{
            url = new URL(str_url);

            conn = (HttpURLConnection)url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoInput(true);
            conn.setDoOutput(true);
            conn.setUseCaches(false);
            Log.i("BlockActivity","conn1"+ conn.getRequestMethod());

            //QueryString을 추가하는 부분, UTF-8로 한글까지 Server에서 이상없이 받을 수 있음
            OutputStream os = conn.getOutputStream();
            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));
            bw.write(query);
            bw.flush();
            bw.close();

            final int responseCode = conn.getResponseCode();

            switch (responseCode){
                case HttpURLConnection.HTTP_OK:
                    //응답결과 수신
                    BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));

                    while ((responseData = br.readLine()) != null) {
                        Log.i("BlockActivity", "응답결과:" + responseData);
                        //return new JSONArray(responseData);
                        json_result += responseData;
                    }
                    Log.d("BlockActivitiy", "전달전1 result:" + json_result);

                    if (json_result != null) {
                        Log.d("BlockActivitiy", "전달전2 result:" + json_result);
                        return new JSONArray(json_result);
                    } else {
                        Log.d("BlockActivitiy", "전달전3 result:" + json_result);
                        return new JSONArray();
                    }
                    case HttpURLConnection.HTTP_NOT_FOUND:
                        break;

                default:
                    //HTTP_OK가 아닌 경우 Error를 Toast로 나타냅니다.
                    break;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
        }
        */
}
