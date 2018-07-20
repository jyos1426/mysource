package com.my.taxipool.view;

/**
 * Created by Hyeon on 2017-05-29.
 */

import android.annotation.TargetApi;
import android.content.Context;
import android.content.res.TypedArray;
import android.os.Build;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.my.taxipool.R;

/**
 * Created by Hyeon on 2016-11-04.
 */


public class InputCustomView extends LinearLayout{
    public String leftLabel = "";
    public String rightLabel = "";
    private TextView leftTextView;
    private TextView rightTextView;

    public InputCustomView(Context context) {
        super(context);
        LayoutInflater.from(context).inflate(R.layout.customview_input, this);
    }
    public InputCustomView(Context context, AttributeSet attrs) {
        super(context, attrs);
        setViewIds(context);
        getAttrs(attrs);
        initViews();
    }
    public InputCustomView(Context context, AttributeSet attrs, int defStyle) {
        this(context, attrs);
        setViewIds(context);
        getAttrs(attrs, defStyle);
        initViews();
    }

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    public InputCustomView(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
        setViewIds(context);
        getAttrs(attrs, defStyleAttr,defStyleRes);
        initViews();
    }

    private void setViewIds(Context context){
        LayoutInflater.from(context).inflate(R.layout.customview_input, this);

        //left text view
        leftTextView = (TextView) this.findViewById(R.id.leftTextView);
        rightTextView = (TextView) this.findViewById(R.id.rightTextView);
    }   //ID를 가져오고

    private void initViews() {
        leftTextView.setText(leftLabel);
        rightTextView.setText(rightLabel);
    }   //화면을 구성

    public String getLeftLabel() {
        return leftLabel;
    }
    public String getRightLabel() {
        return rightLabel;
    }

//    public void setColor(int color) {
//        if (null != rightTextView) {
//            rightTextView.setTextColor(getResources().getColor(color));
//        }
//    }

    public void setRightLabel(String rightLabel) {
        this.rightLabel = rightLabel;
        if (null != rightTextView) {
            rightTextView.setText(rightLabel);
        }
    }
    public void setLeftLabel(String leftLabel) {
        this.leftLabel = leftLabel;
        if (null != leftTextView) {
            leftTextView.setText(leftLabel);
        }
    }
    public void setRightColor(int color) {
        if (null != rightTextView) {
            rightTextView.setTextColor(getResources().getColor(color));
        }
    }
    private void getAttrs(AttributeSet attrs) {
        TypedArray typedArray = getContext().obtainStyledAttributes(attrs, R.styleable.InputCustomView);
        setTypeArray(typedArray);
    }

    private void getAttrs(AttributeSet attrs, int defStyle) {
        TypedArray typedArray = getContext().obtainStyledAttributes(attrs, R.styleable.InputCustomView, defStyle, 0);
        setTypeArray(typedArray);
    }

    private void getAttrs(AttributeSet attrs, int defStyle, int defStyleRes) {
        TypedArray typedArray = getContext().obtainStyledAttributes(attrs, R.styleable.InputCustomView, defStyle, defStyleRes);
        setTypeArray(typedArray);
    }

    private void setTypeArray(TypedArray a) {
        int textColor = a.getColor(R.styleable.InputCustomView_rightColor, 0);
        rightTextView.setTextColor(textColor);
        leftLabel = a.getString(R.styleable.InputCustomView_leftLabel);
        rightLabel = a.getString(R.styleable.InputCustomView_rightLabel);
        a.recycle();
    }   //가져온대로 화면을 구성하고

    @Override
    public boolean onTouchEvent(final MotionEvent event) {
        if(event.getAction() == MotionEvent.ACTION_UP){
            return performClick();
        }
        return true;
    }

}