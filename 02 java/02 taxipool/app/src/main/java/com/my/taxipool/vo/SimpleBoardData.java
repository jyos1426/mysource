package com.my.taxipool.vo;

/**
 * Created by Hyeon on 2017-05-31.
 */

import org.json.JSONException;
import org.json.JSONObject;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by JeyHoon on 2016. 10. 20..
 */

public class SimpleBoardData implements Serializable {

    private long idx = -1L;
    private String title = "";
    private long mIdx = -1L;
    private String mName = "";
    private int mPoint=0;
    private String date = "";
    private int readCnt = 0;
    private int replyCnt = 0;

    private int boardType=-1;

    public SimpleBoardData() {
    }

    public SimpleBoardData(long idx, String title, long mIdx, String mName, int mPoint, String date, int readCnt, int replyCnt) {
        this.idx = idx;
        this.title = title;
        this.mIdx = mIdx;
        this.mName = mName;
        this.mPoint=mPoint;
        this.date = date;
        this.readCnt = readCnt;
        this.replyCnt = replyCnt;
    }

    public SimpleBoardData(long idx, String title, long mIdx, String mName, int mPoint, String date, int readCnt, int replyCnt, int boardType) {
        this.idx = idx;
        this.title = title;
        this.mIdx = mIdx;
        this.mName = mName;
        this.mPoint=mPoint;
        this.date = date;
        this.readCnt = readCnt;
        this.replyCnt = replyCnt;
        this.boardType=boardType;
    }

    public long getIdx() {
        return idx;
    }

    public void setIdx(long idx) {
        this.idx = idx;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public long getmIdx() {
        return mIdx;
    }

    public void setmIdx(long mIdx) {
        this.mIdx = mIdx;
    }

    public String getmName() {
        return mName;
    }

    public void setmName(String mName) {
        this.mName = mName;
    }

    public int getmPoint() {
        return mPoint;
    }

    public void setmPoint(int mPoint) {
        this.mPoint = mPoint;
    }

    public String getDate() {
        return date;
    }

    public String getDateSimple() {
        try {
            Date now = new Date(System.currentTimeMillis());
            Date study = getDateData();
            if (now.getYear() == study.getYear() && now.getMonth() == study.getMonth() && now.getDate() == study.getDate()) {
                return new SimpleDateFormat("HH:mm").format(study);
            } else {
                return new SimpleDateFormat("MM/dd").format(study);
            }
        } catch (Exception e) {
            return "";
        }
//        return date;
    }

    public Date getDateData() {
        try {
            return new SimpleDateFormat("yyyy.MM.dd HH:mm").parse(date);
        } catch (Exception e) {
            return null;
        }
    }

    public long getDateLong(){
        return getDateData().getTime();
    }

    public void setDate(String date) {
        this.date = date;
    }

    public int getReadCnt() {
        return readCnt;
    }

    public void setReadCnt(int readCnt) {
        this.readCnt = readCnt;
    }

    public void addReadCnt(){
        this.readCnt=this.readCnt+1;
    }

    public int getReplyCnt() {
        return replyCnt;
    }

    public void setReplyCnt(int replyCnt) {
        this.replyCnt = replyCnt;
    }

    public int getBoardType() {
        return boardType;
    }

    public void setBoardType(int boardType) {
        this.boardType = boardType;
    }

    public SimpleBoardData loadFromJSONObject(JSONObject obj) throws JSONException {
        if (obj.has("idx")) {
            idx = obj.getLong("idx");
        }
        if (obj.has("title")) {
            title = obj.getString("title");
        }
        if (obj.has("member_idx")) {
            mIdx = obj.getLong("member_idx");
        }
        if (obj.has("m_idx")) {
            mIdx = obj.getLong("m_idx");
        }
        if (obj.has("member_name")) {
            mName = obj.getString("member_name");
        }
        if (obj.has("member_point")) {
            mPoint = obj.getInt("member_point");
        }
        if (obj.has("date")) {
            date = obj.getString("date");
        }
        if (obj.has("read_cnt")) {
            readCnt = obj.getInt("read_cnt");
        }
        if (obj.has("reply_cnt")) {
            replyCnt = obj.getInt("reply_cnt");
        }
        if (obj.has("board_type")) {
            boardType = obj.getInt("board_type");
        }

        return this;
    }

    public JSONObject toJSONObject(){
        final JSONObject obj = new JSONObject();
        try {
            obj.put("idx", idx);
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            obj.put("title", title);
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            obj.put("member_idx", mIdx);
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            obj.put("member_name", mName);
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            obj.put("member_point", mPoint);
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            obj.put("date", date);
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            obj.put("read_cnt", readCnt);
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            obj.put("reply_cnt", replyCnt);
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            obj.put("board_type", boardType);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return obj;

    }

    public String toString() {
        return toJSONObject().toString();
    }
}
