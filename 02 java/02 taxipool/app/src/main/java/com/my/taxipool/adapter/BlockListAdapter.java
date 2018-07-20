package com.my.taxipool.adapter;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.my.taxipool.R;
import com.my.taxipool.activity.BlockActivity;
//import com.my.taxipool.network.NetworkBlockCancel;
import com.my.taxipool.util.CommuServer;
import com.my.taxipool.vo.BlockCustomerInfo;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Text;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;

/**
 * Created by sungjin on 2017-06-20.
 */

public class BlockListAdapter extends BaseAdapter {
    private LayoutInflater inflater;
    private ArrayList<BlockCustomerInfo> data;
    private int layout;
    private Context cont;
    private Bitmap bitmap;
    private boolean dialogFlag;


    public BlockListAdapter(Context context, int layout, ArrayList<BlockCustomerInfo> data){
        this.inflater=(LayoutInflater)context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        this.data=data;
        this.layout=layout;
        this.cont = context;
    }
    @Override
    public int getCount(){return data.size();}
    @Override
    public String getItem(int position){return data.get(position).getBlockNickname();}
    @Override
    public long getItemId(int position){return position;}
    @Override
    public View getView(final int position, View convertView, ViewGroup parent){
        if(convertView==null){
            convertView=inflater.inflate(layout,parent,false);
        }
        final BlockCustomerInfo listviewitem = data.get(position);
        Log.d("BlockListAdapter", listviewitem.getBlockNickname());


        //profile set, 지금은 서버에서 프로필주소 안받아오므로 defalutimage로..
        ImageView profile = (ImageView)convertView.findViewById(R.id.block_profile);
        convertView.findViewById(R.id.img_roomshare_profile);
        Thread mThread = new Thread(){
            @Override
            public void run(){
                try{
                    URL url = new URL(listviewitem.getProfile());
                    HttpURLConnection conn = (HttpURLConnection)url.openConnection();
                    conn.setDoInput(true);
                    conn.connect();
                    InputStream is = conn.getInputStream();
                    bitmap = BitmapFactory.decodeStream(is);
                }catch (IOException e){
                    e.printStackTrace();
                }
            }
        };
        mThread.start();
        try{
            mThread.join();/*
            ImageHelper ih = new ImageHelper();
            bitmap = ih.getRoundedCornerBitmap(bitmap,200);*/
            profile.setImageBitmap(bitmap);
        }catch(InterruptedException e){
            e.printStackTrace();
        }

        //profile.setImageResource(listviewitem.getProfile());
        //icon.setImageResource(listviewitem.getProfile());

        //nickname set
        TextView tx_block_id = (TextView)convertView.findViewById(R.id.block_id);
        tx_block_id.setText(listviewitem.getBlockNickname());

        dialogFlag = false;

        Button bt_cancel = (Button)convertView.findViewById(R.id.block_cancel);
        bt_cancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //AlertDialog
                AlertDialog.Builder builder = new AlertDialog.Builder(cont);
                builder.setTitle("정말로");
                builder.setMessage(listviewitem.getBlockNickname()+"님을 차단해제하시겠습니까?");

                DialogInterface.OnClickListener dialogClickListener = new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        switch (which) {
                            case DialogInterface.BUTTON_POSITIVE:
                                new CommuServer(CommuServer.DELETE_BLOCKLIST, new CommuServer.OnCommuListener() {
                                    @Override
                                    public void onSuccess(JSONObject object, JSONArray arr, String str) {
                                        Log.d("ddu result!!", str.toString());
                                        data.remove(position);
                                        notifyDataSetChanged();
                                    }

                                    @Override
                                    public void onFailed(Error error) {
                                    }
                                }).addParam("info_id", listviewitem.getInfo_id())
                                        .addParam("block_info_id", listviewitem.getBlockInfo_id()).start();
                                break;

                            case DialogInterface.BUTTON_NEGATIVE:
                                dialog.cancel();
                                break;
                        }
                    }
                };

                builder.setPositiveButton("네", dialogClickListener);
                builder.setNegativeButton("잠깐만요", dialogClickListener);
                AlertDialog dialog = builder.create();
                dialog.show();

            /*@Override
            public void onClick(View v) {
                new CommuServer(CommuServer.DELETE_BLOCKLIST, new CommuServer.OnCommuListener() {
                    @Override
                    public void onSuccess(JSONObject object, JSONArray arr, String str) {
                        Log.d("ddu result!!",str.toString());
                        data.remove(position);
                        notifyDataSetChanged();
                    }
                    @Override
                    public void onFailed(Error error) {
                    }
                }).addParam("info_id",listviewitem.getInfo_id())
                  .addParam("block_info_id", listviewitem.getBlockInfo_id()).start();
            }*/
            }
        });//onClickListner End
        return convertView;
    }
}

