package com.my.taxipool.vo;

import java.util.Date;

/**
 * Created by sungjin on 2017-06-27.
 */

public class PointRecordInfo {

    private String info_id; // Kakao ID
    private String point; // 변동사항의 포인트를 기록(EX. 10000, 5000 ..)
    private Date date; // 변동사항의 날짜를 기록
    private int type; // +1, +2, +3, -1, -2, 3으로 충전인지 출금인지와 방법을 지정

    public PointRecordInfo(){}

    public PointRecordInfo(String info_id, String point, Date date, int type) {
        this.info_id = info_id;
        this.point = point;
        this.date = date;
        this.type = type;
    }

    public String getInfo_id() {
        return info_id;
    }

    public void setInfo_id(String info_id) {
        this.info_id = info_id;
    }

    public String getPoint() {
        return point;
    }

    public void setPoint(String point) {
        this.point = point;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public int getType() {
        return type;
    }


    public void setType(int type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "PointRecordInfo{" +
                "info_id='" + info_id + '\'' +
                ", point=" + point +
                ", date=" + date +
                ", type=" + type +
                '}';
    }
}
