package com.my.taxipool.adapter;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.my.taxipool.R;
import com.my.taxipool.vo.Room;

import java.text.SimpleDateFormat;
import java.util.ArrayList;

/**
 * Created by KITRI on 2017-06-07.
 */

public class RoomListRecyclerAdapter extends RecyclerView.Adapter<RoomListRecyclerAdapter.ViewHolder>{

    private ArrayList<Room> rooms;
    private Context context;
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

    public RoomListRecyclerAdapter(ArrayList<Room> rooms, Context context, RoomListRecyclerAdapterInterface.OnItemClickListener listener){
        this.rooms = rooms;
        this.context = context;
        this.listener=listener;
    }

    @Override
    public int getItemCount() {
        return rooms.size();
    }

    //레이아웃을 만들어 holder에 저장
    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.view_roomlist_item, parent, false);
        return new ViewHolder(view);
    }

    final static class ViewHolder extends RecyclerView.ViewHolder {
        LinearLayout root = null;
        public TextView start_spot, end_spot, start_time, cnt, current_cnt;
        public ImageView img_roomlist_alcohol,img_roomlist_payment,img_roomlist_gender;

        public ViewHolder(View itemView) {
            super(itemView);
            root = (LinearLayout)itemView.findViewById(R.id.root_roomlist_item);
            start_spot = (TextView) itemView.findViewById(R.id.start_spot);
            end_spot = (TextView) itemView.findViewById(R.id.end_spot);
            start_time = (TextView) itemView.findViewById(R.id.start_time);
            cnt = (TextView) itemView.findViewById(R.id.cnt);
            current_cnt= (TextView) itemView.findViewById(R.id.current_cnt);

            img_roomlist_alcohol= (ImageView) itemView.findViewById(R.id.img_roomlist_alcohol);
            img_roomlist_payment= (ImageView) itemView.findViewById(R.id.img_roomlist_payment);
            img_roomlist_gender= (ImageView) itemView.findViewById(R.id.img_roomlist_gender);
        }
    }

    private RoomListRecyclerAdapterInterface.OnItemClickListener listener = new RoomListRecyclerAdapterInterface.OnItemClickListener() {
        @Override
        public void onItemClick(View view, int position) {
        }
    };

    //넘겨받은 데이터를 화면에 출력하는 역할
    @Override
    public void onBindViewHolder(ViewHolder holder, final int position) {
        holder.root.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
            listener.onItemClick(v, position);
            }
        });

        //출발지
        holder.start_spot.setText(rooms.get(position).getStart_spot());
        holder.end_spot.setText(rooms.get(position).getEnd_spot());
        holder.cnt.setText(String.valueOf(rooms.get(position).getMax_cnt()));
        holder.current_cnt.setText(String.valueOf(rooms.get(position).getCurrent_cnt()));

        holder.img_roomlist_gender.setImageResource(rooms.get(position).getImgsource_gender());
        holder.img_roomlist_payment.setImageResource(rooms.get(position).getImgsource_payment());
        holder.img_roomlist_alcohol.setImageResource(rooms.get(position).getImgsource_alcohol());

    }

}
