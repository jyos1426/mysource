package com.my.taxipool.vo;

import android.graphics.Bitmap;

/**
 * Created by Hyeon on 2017-06-02.
 */
public class CustomerInfo {
    String info_id;
    String profile_pic;
    String phone_no;
    String info_name;
    String nickname;
    String info_gender;
    int point;
    double resultscore;
    String state;
    Bitmap profile_bitmap;

    public Bitmap getProfile_bitmap() {
        return profile_bitmap;
    }

    public void setProfile_bitmap(Bitmap profile_bitmap) {
        this.profile_bitmap = profile_bitmap;
    }

    public int getPoint() {
        return point;
    }

    public void setPoint(int point) {
        this.point = point;
    }

    public double getResultscore() {
        return resultscore;
    }

    public void setResultscore(double resultscore) {
        this.resultscore = resultscore;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public CustomerInfo(){
    }
    public CustomerInfo(String info_id, String phone_no, String info_name, String nickname, String info_gender) {
        this.info_id = info_id;
        this.phone_no = phone_no;
        this.info_name = info_name;
        this.nickname = nickname;
        this.info_gender = info_gender;
    }

    public CustomerInfo(String info_id, String profile_pic, String phone_no, String info_name, String nickname, String info_gender) {
        this.info_id = info_id;
        this.profile_pic = profile_pic;
        this.phone_no = phone_no;
        this.info_name = info_name;
        this.nickname = nickname;
        this.info_gender = info_gender;
    }

    @Override
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

    public String getInfo_id() {
        return info_id;
    }

    public void setInfo_id(String info_id) {
        this.info_id = info_id;
    }

    public String getProfile_pic(){return profile_pic;}

    public void setProfile_pic(String profile_pic){
        this.profile_pic = profile_pic;
    }

    public String getPhone_no() {
        return phone_no;
    }

    public void setPhone_no(String phone_no) {
        this.phone_no = phone_no;
    }

    public String getInfo_name() {
        return info_name;
    }

    public void setInfo_name(String info_name) {
        this.info_name = info_name;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getInfo_gender() {
        return info_gender;
    }

    public void setInfo_gender(String info_gender) {
        this.info_gender = info_gender;
    }
}