package com.my.taxipool.adapter;

import android.content.Context;
import android.graphics.Color;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.my.taxipool.R;
import com.my.taxipool.vo.PointRecordInfo;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * Created by sungjin on 2017-06-27.
 */

public class PointRecordAdapter extends RecyclerView.Adapter<PointRecordAdapter.ViewHolder> {

    private List<PointRecordInfo> pointRecordList;
    private int itemLayout;
    private Context context;

    public PointRecordAdapter(List<PointRecordInfo> items, int itemLayout, Context context) {

        this.pointRecordList = items;
        this.itemLayout = itemLayout;
        this.context = context;
    }

    @Override
    public int getItemCount() {
        return pointRecordList.size();
    }

    //Holder에 저장
    @Override
    public ViewHolder onCreateViewHolder(ViewGroup viewGroup, int viewType) {

        View view = LayoutInflater.from(viewGroup.getContext()).inflate(itemLayout, viewGroup, false);
        return new ViewHolder(view);
    }

    //뿌려주는 작업
    @Override
    public void onBindViewHolder(ViewHolder viewHolder, int position) {

        PointRecordInfo item = pointRecordList.get(position);
        String s_type = "";

        SimpleDateFormat transFormat = new SimpleDateFormat("yyyy년 MM월 dd일");
        String date = transFormat.format(item.getDate());

        viewHolder.tv_date.setText(date);
        viewHolder.tv_point.setText(String.valueOf(item.getPoint())+"원");
        //tv_type의 값에 따라 (계좌충전, 계좌출금, 광고충전, 합승 등 변환필요)

        String[] plus_test_array = context.getResources().getStringArray(R.array.plus_test_array);
        String[] minus_test_array = context.getResources().getStringArray(R.array.minus_test_array);
        //s_type = minus_test_array[item.getType()-1];
        Log.d("체크1", s_type);
        if(item.getType()>0){
            s_type = plus_test_array[item.getType()-1];
            Log.d("체크2", s_type);
        }else{
            s_type =  minus_test_array[-1 * (item.getType()+1)];
            Log.d("체크3", s_type);
        }
        viewHolder.tv_type.setText(s_type);

    }

    //재활용을 위한 ViewHolder
    public static class ViewHolder extends RecyclerView.ViewHolder {

        public TextView tv_date;
        public TextView tv_type;
        public TextView tv_point;

        public ViewHolder(View itemView) {
            super(itemView);

            tv_date = (TextView) itemView.findViewById(R.id.tv_date);
            tv_type = (TextView) itemView.findViewById(R.id.tv_type);
            tv_point = (TextView) itemView.findViewById(R.id.tv_point);

        }
    }
}
