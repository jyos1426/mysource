package com.my.taxipool.adapter;

import android.view.View;

/**
 * Created by Hyeon on 2017-06-23.
 */

public class RoomListRecyclerAdapterInterface {
    public interface OnItemClickListener {
        public void onItemClick(View view, int position);
    }
    public interface OnItemLongClickListener{
        public boolean onItemLongClick(View view, int position);
    }
}