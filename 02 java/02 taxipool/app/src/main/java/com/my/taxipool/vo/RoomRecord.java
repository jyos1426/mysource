package com.my.taxipool.vo;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * Created by Hyeon on 2017-06-28.
 */

public class RoomRecord {
    private Date start_time;
    private String str_start_time;
    private String start_spot;
    private String end_spot;
    private List<CustomerInfo> memberlist;

    public RoomRecord() {
    }
    public RoomRecord(Date start_time, String str_start_time, String start_spot, String end_spot, List<CustomerInfo> memberlist) {
        this.start_time = start_time;
        this.str_start_time = str_start_time;
        this.start_spot = start_spot;
        this.end_spot = end_spot;
        this.memberlist = memberlist;
    }

    public Date getStart_time() {
        return start_time;
    }

    public void setStart_time(Date start_time) {
        this.start_time = start_time;
    }

    public void setStr_start_time(String str_start_time) {
        this.str_start_time = str_start_time;
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

    public List<CustomerInfo> getMemberlist() {
        return memberlist;
    }

    public void setMemberlist(List<CustomerInfo> memberlist) {
        this.memberlist = memberlist;
    }

    public void setStart_time(String start_time) {
        SimpleDateFormat transFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        try{
            this.start_time = transFormat.parse(start_time);
        }catch(ParseException e){
            e.printStackTrace();
        }
    }
    public void setStart_time(long start_time) {
        SimpleDateFormat transFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        this.start_time = new Date(start_time);
    }

    public String getStr_start_time() {
        SimpleDateFormat transFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        str_start_time = transFormat.format(start_time);

        return str_start_time;
    }
}
