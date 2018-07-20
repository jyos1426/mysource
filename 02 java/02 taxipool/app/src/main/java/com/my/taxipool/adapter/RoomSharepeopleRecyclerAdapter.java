package com.my.taxipool.adapter;

import android.app.Dialog;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.ColorDrawable;
import android.support.v7.widget.RecyclerView;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
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
 * Created by Hyeon on 2017-06-25.
 */

/**
 * [RecyclerView]
 * 위 그림처럼 100개의 View를 생성하는 대신 ​한 화면을 채우는 데 충분한 12개만 생성
 * 그리고 화면이 스크롤되면서 View가 화면을 벗어날 때 RecyclerView는 그 View를 버리지 않고 재활용한다
 * http://netrance.blog.me/220723708995 요기 참고
 * Created by Hyeon on 2016-11-17.
 */

public class RoomSharepeopleRecyclerAdapter extends RecyclerView.Adapter<RoomSharepeopleRecyclerAdapter.ViewHolder> {

    //item
    CustomerInfo data;
    Boolean isBangjang;
    int room_no;
    private ArrayList<CustomerInfo> list;
    private Context context;
    Bitmap bitmap ;

    public RoomSharepeopleRecyclerAdapter(ArrayList<CustomerInfo> list, Context context,Boolean isBangjang, int room_no){
        this.list = list;
        this.context = context;
        this.isBangjang = isBangjang;
        this.room_no = room_no;
    }

    @Override
    public int getItemCount() {
        return this.list.size();
    }
    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType)     {
        //Inflate the layout, initialize the View Holder
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.view_room_info_people, parent, false);
        ViewHolder holder = new ViewHolder(v);
        return holder;
    }
    @Override
    public void onBindViewHolder(ViewHolder holder, final int position) {
        data = list.get(position);
        //Image set
        Thread mThread = new Thread(){
            @Override
            public void run(){
                try{
                    URL url = new URL(data.getProfile_pic());
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
            mThread.join();
            ImageHelper ih = new ImageHelper();
            bitmap = ih.getRoundedCornerBitmap(bitmap,200);
            holder.img_roomshare_profile.setImageBitmap(bitmap);
        }catch(InterruptedException e){
            e.printStackTrace();
        }

        //Nickname set
        holder.tv_roomshare_nickname.setText(data.getNickname());
        if(data.getState().equals("r")){
            holder.tv_roomshare_state.setText("요청중");
            holder.tv_roomshare_state.setTextColor(context.getResources().getColor(R.color.colorRed));
        }else if(data.getState().equals("a")){
            holder.tv_roomshare_state.setTextColor(context.getResources().getColor(R.color.darkGray));
            holder.tv_roomshare_state.setText("승낙");
        }else if(data.getState().equals("m")){
            holder.tv_roomshare_state.setTextColor(context.getResources().getColor(R.color.darkGray));
            holder.tv_roomshare_state.setText("Me");
        }
        //State set
        if(isBangjang){
            holder.tv_roomshare_state.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    showDialog(position);
                }
            });
        }

        //Ratingbar set
        holder.rating_roomshare.setRating((float)data.getResultscore());
    }

    public static final class ViewHolder extends RecyclerView.ViewHolder{
        LinearLayout root=null;
        ImageView img_roomshare_profile = null;
        TextView tv_roomshare_nickname = null;
        TextView tv_roomshare_state = null;
        RatingBar rating_roomshare = null;

        public ViewHolder(View itemView) {
            super(itemView);
            root = (LinearLayout)itemView.findViewById(R.id.view_sharepeople);
            img_roomshare_profile = (ImageView)itemView.findViewById(R.id.img_roomshare_profile);
            tv_roomshare_nickname = (TextView)itemView.findViewById(R.id.tv_roomshare_nickname);
            tv_roomshare_state = (TextView)itemView.findViewById(R.id.tv_roomshare_state);
            rating_roomshare = (RatingBar)itemView.findViewById(R.id.rating_roomshare);
        }
    }

    //날짜대로 정렬할 경우에만
//    public static final Comparator<CustomerInfo> ALPHA_COMPARATOR = new Comparator<ReplyData>() {
//        private final Collator sCollator = Collator.getInstance();
//
//        @Override
//        public int compare(CustomerInfo object1, CustomerInfo object2) {
//
//            long obj1 = object1.getDateLong();
//            long obj2 = object2.getDateLong();
//            if (obj1 > obj2) {
//                return -1;
//            } else if (obj1 < obj2) {
//                return 1;
//            } else
//                return 0;
//        }
//    };

    public void showDialog(final int position){
        final View innerView = LayoutInflater.from(context).inflate(R.layout.dialog,null);
        TextView tv_dialog_name = (TextView) innerView.findViewById(R.id.tv_dialog_infoname);
        ImageView image_dialog = (ImageView) innerView.findViewById(R.id.dialog_image);
        TextView tv_dialog_no = (TextView) innerView.findViewById(R.id.tv_dialog_no);
        TextView tv_dialog_yes = (TextView) innerView.findViewById(R.id.tv_dialog_yes);

        tv_dialog_name.setText(data.getNickname());
        final Dialog mDialog = new Dialog(context);
        mDialog.setContentView(innerView);

        tv_dialog_yes.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
            new CommuServer(CommuServer.UPDATE_STATE, new CommuServer.OnCommuListener() {
                @Override
                public void onSuccess(JSONObject object, JSONArray arr, String str) {
                    data.setState("a");
                    notifyDataSetChanged();
                    mDialog.dismiss();
                }
                @Override
                public void onFailed(Error error) {
                }
            }).addParam("room_no", room_no)
                    .addParam("share_info_id",data.getInfo_id())
                    .addParam("state","a")
                    .start();

            }
        });
        tv_dialog_no.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
            new CommuServer(CommuServer.UPDATE_STATE, new CommuServer.OnCommuListener() {
                @Override
                public void onSuccess(JSONObject object, JSONArray arr, String str) {
                    list.remove(position);
                    notifyDataSetChanged();
                    mDialog.dismiss();
                }
                @Override
                public void onFailed(Error error) {
                }
            }).addParam("room_no", room_no)
                    .addParam("share_info_id",data.getInfo_id())
                    .addParam("state","d")
                    .start();
            }
        });

        WindowManager.LayoutParams params = mDialog.getWindow().getAttributes();
        params.width = WindowManager.LayoutParams.MATCH_PARENT;
        params.height = WindowManager.LayoutParams.WRAP_CONTENT;
        mDialog.getWindow().setAttributes(params);
        mDialog.getWindow().setBackgroundDrawable(new ColorDrawable(android.graphics.Color.TRANSPARENT));
        mDialog.getWindow().setGravity(Gravity.BOTTOM);
        mDialog.show();
    }
}
