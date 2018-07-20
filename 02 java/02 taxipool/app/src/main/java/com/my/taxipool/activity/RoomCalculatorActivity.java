package com.my.taxipool.activity;

import android.app.Activity;
import android.os.Bundle;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.RatingBar;
import android.widget.TextView;

import com.my.taxipool.R;
import com.my.taxipool.adapter.Calculator_ListViewAdapter;
import com.my.taxipool.adapter.RoomListRecyclerAdapter;
import com.my.taxipool.adapter.RoomListRecyclerAdapterInterface;
import com.my.taxipool.util.CommuServer;
import com.my.taxipool.vo.CustomerInfo;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import javax.xml.xpath.XPathExpression;

/**
 * Created by KITRI on 2017-06-20.
 */

public class RoomCalculatorActivity extends Activity implements RoomListRecyclerAdapterInterface.OnItemClickListener{
    EditText[] ed_taxicalcul;
    TextView tv_calculator_price;
    boolean taxicalcul_nullcheck;
    double price;
    JSONArray result;
    private Calculator_ListViewAdapter adapter;
    ArrayList<CustomerInfo> data;
    private RecyclerView calcullrecycle;
    Button bt_calcul;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_calculator);

        ed_taxicalcul = new EditText[3];
        ed_taxicalcul[0] = (EditText) findViewById(R.id.ed_taxicalcul1);
        ed_taxicalcul[1] = (EditText) findViewById(R.id.ed_taxicalcul2);
        ed_taxicalcul[2] = (EditText) findViewById(R.id.ed_taxicalcul3);

        calcullrecycle = (RecyclerView) findViewById(R.id.calcullistview);
        calcullrecycle.setLayoutManager(new LinearLayoutManager(this));

        tv_calculator_price = (TextView) findViewById(R.id.tv_calculator_price);
        bt_calcul = (Button)findViewById(R.id.bt_calcul);

        taxicalcul_nullcheck = true;

        ed_taxicalcul[0].addTextChangedListener(listener);
        ed_taxicalcul[1].addTextChangedListener(listener);
        ed_taxicalcul[2].addTextChangedListener(listener);



        //EditText가 클릭되면 안에 값 제거
        for (int i = 0; i < 3; i++) {
            final int index = i;
            ed_taxicalcul[i].setOnFocusChangeListener(new View.OnFocusChangeListener() {
                @Override
                public void onFocusChange(View v, boolean hasFocus) {
                    if (hasFocus) {
                        ed_taxicalcul[index].setText("");
                    }
                }
            });
        }

        data = new ArrayList<>();



        //query = "room_no="+room_no;
        //room_no 는 받아와야함

        //HttpURLConnection conn = null;
        new CommuServer(CommuServer.SELECT_PEOPLE_ROOMSHARE, new CommuServer.OnCommuListener() {
            @Override
            public void onSuccess(JSONObject object, JSONArray arr, String str) {
                Log.d("ddu result!!", arr.toString());
                result = arr;
                try {
                    for (int i = 0; i < result.length(); i++) {
                        CustomerInfo customerInfo = new CustomerInfo();
                        customerInfo.setInfo_id(result.getJSONObject(i).getString("share_info_id"));
                        customerInfo.setNickname(result.getJSONObject(i).getString("nickname"));
                        customerInfo.setProfile_pic(result.getJSONObject(i).getString("profile_pic"));
                        data.add(customerInfo);
                        Log.d("ddu", result.getJSONObject(i).getString("nickname") + " " + result.getJSONObject(i).getString("share_info_id"));
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                setAdapter(RoomCalculatorActivity.this);
            }

            @Override
            public void onFailed(Error error) {
            }
        }).addParam("room_no", "241").start();

        bt_calcul.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                for(int i = 0;i<data.size();i++) {
                    new CommuServer(CommuServer.UPDATE_ADDSCORE, new CommuServer.OnCommuListener() {
                        @Override
                        public void onSuccess(JSONObject object, JSONArray arr, String str) {
                            Log.d("되나", "ddu");
                        }

                        @Override
                        public void onFailed(Error error) {
                            Log.d("안되나", "ddu");
                        }
                    }).addParam("info_id", data.get(i).getInfo_id())
                      .addParam("score", (int)data.get(i).getResultscore()).start();
                }
            }
        });



    }

    public void setAdapter(final RoomListRecyclerAdapterInterface.OnItemClickListener listener){
        adapter = new Calculator_ListViewAdapter(data, RoomCalculatorActivity.this, listener);
        calcullrecycle.setAdapter(adapter);
    }

    //돈 계산하기
    TextWatcher listener =
            new TextWatcher() {
                @Override
                public void beforeTextChanged(CharSequence s, int start, int count, int after) {
                    taxicalcul_nullcheck=true;
                }

                @Override
                public void onTextChanged(CharSequence s, int start, int before, int count) {

                    for (int j = 0; j < 3; j++){

                        if(ed_taxicalcul[j].getText().toString().equals("")){
                            taxicalcul_nullcheck = false;
                            price=0;
                        }else if(ed_taxicalcul[j].getText().toString().equals("0")){
                            price=0;
                            taxicalcul_nullcheck=false;
                        }
                    }
                    if (taxicalcul_nullcheck){
                        price = Double.parseDouble(ed_taxicalcul[0].getText().toString())/Double.parseDouble(ed_taxicalcul[1].getText().toString())*Double.parseDouble(ed_taxicalcul[2].getText().toString());

                    }
                    tv_calculator_price.setText(price+"원");
                }

                @Override
                public void afterTextChanged(Editable s) {
                }
            };




    @Override
    public void onItemClick(View view, int position) {

    }
}
