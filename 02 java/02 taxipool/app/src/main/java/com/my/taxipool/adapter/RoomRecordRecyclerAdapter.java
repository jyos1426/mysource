package com.my.taxipool.adapter;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.my.taxipool.R;
import com.my.taxipool.vo.CustomerInfo;
import com.my.taxipool.vo.RoomRecord;

import java.util.List;

/**
 * Created by Hyeon on 2017-06-28.
 */


public class RoomRecordRecyclerAdapter extends RecyclerView.Adapter<RoomRecordRecyclerAdapter.ViewHolder> {
    private List<RoomRecord> list;
    private Context context;
    private RoomRecordRecyclerAdapterInterface.OnItemClickListener listener = new RoomRecordRecyclerAdapterInterface.OnItemClickListener() {
        @Override
        public void onItemClick(View view, int position) {
        }
    };

    public RoomRecordRecyclerAdapter(List<RoomRecord> datalist, Context context, RoomRecordRecyclerAdapterInterface.OnItemClickListener listener){
        Log.d("cccccc",datalist.toString());
        this.list = datalist;
        this.context = context;
        this.listener=listener;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.view_card_room_record, parent, false);
        return new ViewHolder(v);
    }

    final static class ViewHolder extends RecyclerView.ViewHolder {
        public TextView tv_record_date;
        public TextView tv_record_spot_to;
        public TextView tv_record_spot_from;

        public ImageView[] img_record = new ImageView[3];
        public TextView[] tv_record_nickname = new TextView[3];
        int[] img_id = {R.id.img_record_1,R.id.img_record_2,R.id.img_record_3} ;
        int[] nickname_id = {R.id.tv_record_nickname_1,R.id.tv_record_nickname_2,R.id.tv_record_nickname_3} ;

        public ViewHolder(View view) {
            super(view);
            tv_record_date = (TextView)view.findViewById(R.id.tv_record_date);
            tv_record_spot_to = (TextView)view.findViewById(R.id.tv_record_spot_to);
            tv_record_spot_from = (TextView)view.findViewById(R.id.tv_record_spot_from);

            for(int i=0 ; i<3; i++){
                img_record[i] = (ImageView)view.findViewById(img_id[i]);
                tv_record_nickname[i] = (TextView)view.findViewById(nickname_id[i]);
            }
        }
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        holder.tv_record_date.setText(list.get(position).getStr_start_time());
        holder.tv_record_spot_from.setText(list.get(position).getStart_spot());
        holder.tv_record_spot_to.setText(list.get(position).getEnd_spot());

        for(int i=0; i < 3; i++){
            if(i < list.get(position).getMemberlist().size()){
                CustomerInfo person = list.get(position).getMemberlist().get(i);
                holder.tv_record_nickname[i].setText(person.getNickname());
            }else{
                holder.tv_record_nickname[i].setVisibility(View.INVISIBLE);
                holder.img_record[i].setVisibility(View.INVISIBLE);
            }
        }
    }

    @Override
    public int getItemCount() {
        return list.size();
    }

}


