package com.my.taxipool.adapter;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RatingBar;
import android.widget.TextView;

import com.my.taxipool.R;
import com.my.taxipool.util.CommuServer;
import com.my.taxipool.util.ImageHelper;
import com.my.taxipool.vo.CustomerInfo;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;

/**
 * Created by KITRI on 2017-06-21.
 */

public class Calculator_ListViewAdapter extends RecyclerView.Adapter<Calculator_ListViewAdapter.ViewHolder> {

    private ArrayList<CustomerInfo> list;
    CustomerInfo data;
    Context cont;
    Bitmap bitmap;
    float[] arrrating;

    RoomListRecyclerAdapterInterface.OnItemClickListener listener = new RoomListRecyclerAdapterInterface.OnItemClickListener() {
        @Override
        public void onItemClick(View view, int position) {
        }
    };

    public Calculator_ListViewAdapter(ArrayList<CustomerInfo> list, Context context, RoomListRecyclerAdapterInterface.OnItemClickListener listener) {
        this.list = list;
        this.cont = context;
        this.listener = listener;
    }

    @Override
    public int getItemCount() {
        return this.list.size();
    }

    @Override
    public Calculator_ListViewAdapter.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.view_calculator_people_score, parent, false);
        return new Calculator_ListViewAdapter.ViewHolder(view);
    }

    public static final class ViewHolder extends RecyclerView.ViewHolder {

        LinearLayout root;
        ImageView img_cal_profile;
        TextView tv_cal_nickname;
        RatingBar rating_cal_score;
        LinearLayout layout_cal_block;



        public ViewHolder(View itemView) {
            super(itemView);
            root = (LinearLayout) itemView.findViewById(R.id.layout_cal_people);
            img_cal_profile = (ImageView) itemView.findViewById(R.id.img_cal_profile);
            tv_cal_nickname = (TextView) itemView.findViewById(R.id.tv_cal_nickname);
            rating_cal_score = (RatingBar) itemView.findViewById(R.id.rating_cal_score);
            layout_cal_block = (LinearLayout) itemView.findViewById(R.id.layout_cal_block);


        }
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, final int position) {
        data = list.get(position);
        arrrating = new float[list.size()];

        Thread mThread = new Thread() {
            @Override
            public void run() {
                try {
                    URL url = new URL(data.getProfile_pic());
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    conn.setDoInput(true);
                    conn.connect();
                    InputStream is = conn.getInputStream();
                    bitmap = BitmapFactory.decodeStream(is);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        };
        mThread.start();
        try {
            mThread.join();
            ImageHelper ih = new ImageHelper();
            bitmap = ih.getRoundedCornerBitmap(bitmap, 200);
            holder.img_cal_profile.setImageBitmap(bitmap);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        holder.tv_cal_nickname.setText(list.get(position).getNickname());

        list.get(position).setResultscore(0);



        holder.rating_cal_score.setOnRatingBarChangeListener(new RatingBar.OnRatingBarChangeListener() {
            @Override
            public void onRatingChanged(RatingBar ratingBar, float rating, boolean fromUser) {
                arrrating[position] = rating;
                list.get(position).setResultscore(rating);
                Log.i("test2", " "+arrrating[position]);
                for(int i = 0;i<list.size();i++) {
                    Log.i("test2", " " + list.get(i).getResultscore());
                }
            }
        });

        holder.layout_cal_block.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                showDialog(position);
            }
        });
    }


    @Override
    public long getItemId(int position) {
        return position;
    }

    public void showDialog(final int position) {
        //AlertDialog
        AlertDialog.Builder builder = new AlertDialog.Builder(cont);
        builder.setTitle("차단");
        builder.setMessage(list.get(position).getNickname()+"님을 차단하시겠습니까?");

        DialogInterface.OnClickListener dialogClickListener = new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                switch (which) {
                    case DialogInterface.BUTTON_POSITIVE:

                        Log.d("ddu",list.get(position).getInfo_id());

                        //Log.d("ddu",""+rating_cal_score);
                        new CommuServer(CommuServer.INSERT_ADDBLOCKLIST, new CommuServer.OnCommuListener() {
                            @Override
                            public void onSuccess(JSONObject object, JSONArray arr, String str) {
                                /*list.get(position).get*/
                                Log.d("되나","ddu");
                                //Toast.makeText(get, "차단되었습니다", Toast.LENGTH_SHORT).show();
                            }
                            @Override
                            public void onFailed(Error error) {
                                Log.d("안되나","ddu");
                            }
                        }).addParam("info_id","A")
                                .addParam("block_to_id",list.get(position).getInfo_id()).start();
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

    }

}
