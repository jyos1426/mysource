package com.my.taxipool.activity;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import com.firebase.client.ChildEventListener;
import com.firebase.client.DataSnapshot;
import com.firebase.client.Firebase;
import com.firebase.client.FirebaseError;
import com.my.taxipool.MyInfo;
import com.my.taxipool.R;
import com.my.taxipool.util.Set;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Hyeon on 2017-05-30.
 */

public class TabChat extends Fragment {
    private LinearLayout layout;
    private ImageView sendButton;    private EditText messageArea;
    private ScrollView scrollView;    private Firebase reference;     //1, reference2;
    private int room_no;
    private View rootView;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        rootView = inflater.inflate(R.layout.view_room_chat,container,false);
        layout = (LinearLayout) rootView.findViewById(R.id.layout_chat);
        sendButton = (ImageView) rootView.findViewById(R.id.sendButton);
        messageArea = (EditText) rootView.findViewById(R.id.messageArea);
        scrollView = (ScrollView) rootView.findViewById(R.id.scrollView);
        //bangjang = getIntent().getStringExtra("bangjang");


        Firebase.setAndroidContext(getContext());
        reference = new Firebase("https://taxikitri-1495966509456.firebaseio.com/messages/" + room_no);
        //reference2 = new Firebase("https://taxikitri-1495966509456.firebaseio.com/messages/" + UserDetails.chatWith + "_" + UserDetails.username);
        sendButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String messageText = messageArea.getText().toString();
                if(!messageText.equals("")){
                    Map<String, String> map = new HashMap<String, String>();
                    map.put("message", messageText);
                    //map.put("user", UserDetails.username);
                    reference.push().setValue(map);
                    scrollView.setScrollY(100);
                    messageArea.setText("");
                }
            }
        });

        reference.addChildEventListener(new ChildEventListener() {
            @Override
            public void onChildAdded(DataSnapshot dataSnapshot, String s) {
                Map map = dataSnapshot.getValue(Map.class);
                String message = map.get("message").toString();
                //String userName = map.get("user").toString();

//                if(userName.equals(UserDetails.username)){
                String info_id = Set.Load(getContext(), "info_id", null);

                Log.d("info_id", info_id);
                    addMessageBox(MyInfo.getNickname()+":\n" + message, 1);
//                }else{
//                    addMessageBox(userName + ":\n" + message, 2);
//                }
            }

            @Override
            public void onChildChanged(DataSnapshot dataSnapshot, String s) {
            }
            @Override
            public void onChildRemoved(DataSnapshot dataSnapshot) {
            }
            @Override
            public void onChildMoved(DataSnapshot dataSnapshot, String s) {
            }
            @Override
            public void onCancelled(FirebaseError firebaseError) {

            }
        });
        return rootView;
    }
    @Override
    public void onResume(){
        super.onResume();
    }


    public void addMessageBox(String message, int type){
        TextView textView = new TextView(getContext());
        textView.setText(message);
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.setMargins(0, 0, 0, 10);
        textView.setLayoutParams(lp);

        if(type == 1) {
            textView.setBackgroundResource(R.drawable.chat_rounded_corner1);
            textView.setBackgroundColor(getResources().getColor(R.color.colorPoint));
        }
        else{
            textView.setBackgroundResource(R.drawable.chat_rounded_corner2);
            textView.setBackgroundColor(getResources().getColor(R.color.white));
        }

        layout.addView(textView);
        scrollView.fullScroll(View.FOCUS_DOWN);
    }

    public void setRoom_no(int room_no) {
        this.room_no = room_no;
    }
}