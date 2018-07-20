package com.my.taxipool.view;

/**
 * Created by Hyeon on 2017-05-31.
 */

import android.content.Context;
import android.content.res.TypedArray;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.my.taxipool.R;

/**
 * Created by Hyeon on 2016-10-26.
 */
public class RoomListCustomView extends LinearLayout {

    public String title_text;
    public int levelimg_res;
    public String info_text;
    public String repcount_text;

    private ImageView levelimage;
    private TextView repcount;
    private TextView info;
    private TextView title;

    public RoomListCustomView(Context context) {
        super(context);
        initView();
    }

    public RoomListCustomView(Context context, AttributeSet attrs) {
        super(context, attrs);
        setViewIds(context);
        getAttrs(attrs);
        initView();
    }

    public RoomListCustomView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs);
        setViewIds(context);
        getAttrs(attrs, defStyle);
        initView();
    }

    private void setViewIds(Context context){
        LayoutInflater.from(context).inflate(R.layout.customeview_roomlist, this);
        levelimage = (ImageView) findViewById(R.id.levelimage);
        title = (TextView) findViewById(R.id.title);
        info = (TextView) findViewById(R.id.info);
        repcount = (TextView) findViewById(R.id.repcount);
    }

    private void initView() {
        title.setText(title_text);
        levelimage.setImageResource(levelimg_res);
        info.setText(info_text);
        repcount.setText(repcount_text);
    }

    private void getAttrs(AttributeSet attrs) {
        TypedArray typedArray = getContext().obtainStyledAttributes(attrs, R.styleable.RoomListCustomView);
        setTypeArray(typedArray);
    }

    private void getAttrs(AttributeSet attrs, int defStyle) {
        TypedArray typedArray = getContext().obtainStyledAttributes(attrs, R.styleable.RoomListCustomView, defStyle, 0);
        setTypeArray(typedArray);
    }


    private void setTypeArray(TypedArray typedArray) {
        title_text = typedArray.getString(R.styleable.RoomListCustomView_title1);
        levelimg_res = typedArray.getResourceId(R.styleable.RoomListCustomView_levelimage, R.mipmap.ic_launcher);
        info_text = typedArray.getString(R.styleable.RoomListCustomView_info);
        repcount_text = typedArray.getString(R.styleable.RoomListCustomView_repcount);
        typedArray.recycle();
    }

//    void setLevelimage(int symbol_resID) {
//        levelimage.setImageResource(symbol_resID);
//    }
//
//    void setTitle(String text_string) {
//        title.setText(text_string);
//    }
//
//    void setInfo(int text_resID) {
//        info.setText(text_resID);
//    }
//    void setRepcount(int text_resID) {
//        repcount.setText(text_resID);
//    }
}

