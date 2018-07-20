package com.my.taxipool;

import android.graphics.Bitmap;

import com.my.taxipool.vo.Room;

/**
 * Created by Hyeon on 2017-06-29.
 */

public class MyInfo {
    private static String info_id;
    private static  String profile_pic;
    private static String phone_no;
    private static String info_name;
    private static String nickname;
    private static String info_gender;
    private static int point;
    private static double resultscore;
    private static int state;
    private static int last_room;
    private static Bitmap profile_bitmap;


    public static Bitmap getProfile_bitmap() {
        return profile_bitmap;
    }

    public static void setProfile_bitmap(Bitmap profile_bitmap) {
        MyInfo.profile_bitmap = profile_bitmap;
    }

    public static int getPoint() {
        return point;
    }

    public static void setPoint(int point) {
        MyInfo.point = point;
    }

    public static double getResultscore() {
        return resultscore;
    }

    public static void setResultscore(double resultscore) {
        MyInfo.resultscore = resultscore;
    }

    public MyInfo(){
    }

    public String toString() {
        return "CustomerInfo{" +
                "info_id='" + info_id + '\'' +
                ", profile_pic='" + profile_pic + '\'' +
                ", phone_no='" + phone_no + '\'' +
                ", info_name='" + info_name + '\'' +
                ", nickname='" + nickname + '\'' +
                ", info_gender='" + info_gender + '\'' +
                '}';
    }

    public static String getInfo_id() {
        return info_id;
    }

    public static void setInfo_id(String info_id) {
        MyInfo.info_id = info_id;
    }

    public static String getProfile_pic(){return profile_pic;}

    public static void setProfile_pic(String profile_pic){
        MyInfo.profile_pic = profile_pic;
    }

    public static String getPhone_no() {
        return phone_no;
    }

    public static void setPhone_no(String phone_no) {
        MyInfo.phone_no = phone_no;
    }

    public static String getInfo_name() {
        return info_name;
    }

    public static void setInfo_name(String info_name) {
        MyInfo.info_name = info_name;
    }

    public static String getNickname() {
        return nickname;
    }

    public static void setNickname(String nickname) {
        MyInfo.nickname = nickname;
    }

    public static String getInfo_gender() {
        return info_gender;
    }

    public static void setInfo_gender(String info_gender) {
        MyInfo.info_gender = info_gender;
    }

    public static int getLast_room() {
        return last_room;
    }

    public static void setLast_room(int last_room) {
        MyInfo.last_room = last_room;
    }

    public static int getState() {
        return state;
    }
    public static void setState(int state) {
        MyInfo.state = state;
    }

    public static void setState(String state) {
        if(state.equals("a")){
            MyInfo.state = Room.WAIT_TOGO;
        }else if(state.equals("r")){
            MyInfo.state = Room.REQUIRING;
        }else if(state.equals("e")){
            MyInfo.state = Room.NO_MEMBER;
        }else if(state.equals("g")){
            MyInfo.state = Room.GOING;
        }
    }


}
