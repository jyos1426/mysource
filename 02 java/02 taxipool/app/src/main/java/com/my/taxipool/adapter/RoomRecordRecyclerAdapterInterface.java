package com.my.taxipool.adapter;

import android.view.View;

/**
 * Created by Hyeon on 2017-06-28.
 */

public class RoomRecordRecyclerAdapterInterface {
    public interface OnItemClickListener {
        public void onItemClick(View view, int position);
    }
    public interface OnItemLongClickListener{
        public boolean onItemLongClick(View view, int position);
    }
}