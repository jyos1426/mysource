package com.my.taxipool.vo;

import com.my.taxipool.R;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by KITRI on 2017-06-13.
 */

public class Room implements Serializable {
    /*
     - 방번호
     - 출발지/도착지
     - 출발 시간
     - 남/녀
     - 결제방법
     - 음주
    */
    private int room_no;
    private String admin_id;
    private int max_cnt;
    private String payment;
    private String room_gender;
    private String alcohol;
    private String start_spot;
    private String end_spot;
    private double start_lon;
    private double start_lat;
    private double end_lon;
    private double end_lat;
    private Date start_time;
    private String room_state;
    private int current_cnt; // (해당 방에 신청 / 수락된 사람)
    private String str_start_time;
    private String str_start_time2;

public static final int NO_MEMBER = 0;
public static final int REQUIRING = 10;
public static final int WAIT_TOGO = 20;
public static final int GOING = 30;
public static final int FINISH = 50;

private int imgsource_alcohol;
private int imgsource_gender;
private int imgsource_payment;

public int getRoom_no() {
        return room_no;
        }

public void setRoom_no(int room_no) {
        this.room_no = room_no;
        }

public String getAdmin_id() {
        return admin_id;
        }

public void setAdmin_id(String admin_id) {
        this.admin_id = admin_id;
        }

public int getMax_cnt() {
        return max_cnt;
        }

public void setMax_cnt(int max_cnt) {
        this.max_cnt = max_cnt;
        }

public String getPayment() {
        return payment;
        }

public void setPayment(String payment) {
        this.payment = payment;
        }

public String getRoom_gender() {
        return room_gender;
        }

public void setRoom_gender(String room_gender) {
        this.room_gender = room_gender;
        }

public String getAlcohol() {
        return alcohol;
        }

public void setAlcohol(String alcohol) {
        this.alcohol = alcohol;
        }

public String getStart_spot() {
        return start_spot;
        }

public void setStart_spot(String start_spot) {
        this.start_spot = start_spot;
        }

public String getEnd_spot() {
        return end_spot;
        }

public void setEnd_spot(String end_spot) {
        this.end_spot = end_spot;
        }

public double getStart_lon() {
        return start_lon;
        }

public void setStart_lon(double start_lon) {
        this.start_lon = start_lon;
        }

public double getStart_lat() {
        return start_lat;
        }

public void setStart_lat(double start_lat) {
        this.start_lat = start_lat;
        }

public double getEnd_lon() {
        return end_lon;
        }

public void setEnd_lon(double end_lon) {
        this.end_lon = end_lon;
        }

public double getEnd_lat() {
        return end_lat;
        }

public void setEnd_lat(double end_lat) {
        this.end_lat = end_lat;
        }

public Date getStart_time() {
        return start_time;
        }

public void setStart_time(Date start_time) {
        this.start_time = start_time;
        }

public String getRoom_state() {
        return room_state;
        }

public void setRoom_state(String room_state) {
        this.room_state = room_state;
        }

public int getCurrent_cnt() {
        return current_cnt;
        }

public void setCurrent_cnt(int current_cnt) {
        this.current_cnt = current_cnt;
        }

public Room(){	}

public Room(int room_no, String admin_id, int max_cnt, String payment, String room_gender, String alcohol, String start_spot, String end_spot, double start_lon, double start_lat, double end_lon, double end_lat, Date start_time, String room_state) {
        this.room_no = room_no;
        this.admin_id = admin_id;
        this.max_cnt = max_cnt;
        this.payment = payment;
        this.room_gender = room_gender;
        this.alcohol = alcohol;
        this.start_spot = start_spot;
        this.end_spot = end_spot;
        this.start_lon = start_lon;
        this.start_lat = start_lat;
        this.end_lon = end_lon;
        this.end_lat = end_lat;
        this.start_time = start_time;
        this.room_state = room_state;
        }

public Room(int room_no, String admin_id, int max_cnt, String payment, String room_gender, String alcohol, String start_spot, String end_spot, double start_lon, double start_lat, double end_lon, double end_lat, Date start_time, String room_state, int current_cnt) {
        this.room_no = room_no;
        this.admin_id = admin_id;
        this.max_cnt = max_cnt;
        this.payment = payment;
        this.room_gender = room_gender;
        this.alcohol = alcohol;
        this.start_spot = start_spot;
        this.end_spot = end_spot;
        this.start_lon = start_lon;
        this.start_lat = start_lat;
        this.end_lon = end_lon;
        this.end_lat = end_lat;
        this.start_time = start_time;
        this.room_state = room_state;
        this.current_cnt = current_cnt;
        }

public int getImgsource_alcohol() {
        if(alcohol.equals("y")){
        imgsource_alcohol = R.drawable.ic_local_drink_24dp;
        }else{
        imgsource_alcohol = R.drawable.ic_none_24dp;
        }
        return imgsource_alcohol;
        }

public int getImgsource_gender() {
        if(room_gender.equals("f")){
        imgsource_gender = R.drawable.ic_female_24dp;
        }else{
        imgsource_gender = R.drawable.ic_male_24dp;
        }
        return imgsource_gender;
        }

public int getImgsource_payment() {
        if(payment.equals("p")){
        imgsource_payment = R.drawable.ic_point_24dp;
        }else{
        imgsource_payment = R.drawable.ic_cash_24dp;
        }
        return imgsource_payment;
        }

public String getStr_Start_time() {
        SimpleDateFormat transFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        str_start_time = transFormat.format(start_time);

        return str_start_time;
        }

    public void setStart_time2(String start_time) {
        this.str_start_time2 = start_time;

    }
    public String getStart_time2() {
        return this.str_start_time2;

    }
}


