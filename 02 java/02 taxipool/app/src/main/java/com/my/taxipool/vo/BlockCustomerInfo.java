package com.my.taxipool.vo;

import com.my.taxipool.R;

/**
 * Created by sungjin on 2017-06-20.
 */

public class BlockCustomerInfo {
    ////
    String info_id;
    String b_nickname;
    String b_info_id;
    String b_profile;
    //임시로 drawble에 있는거 쓴다. 원래 url이니까 String으로 해야하나?
    //int b_profile = R.drawable.defaultprofile;


    public String getInfo_id(){return info_id;}
    public String getBlockInfo_id(){return b_info_id;}
    public String getBlockNickname(){return b_nickname;}
    //public int getBlockProfile(){return b_profile;}
    public String getProfile(){return b_profile;}


    public BlockCustomerInfo(String info_id, String b_info_id, String b_nickname,String b_profile){
        this.info_id = info_id;
        this.b_info_id = b_info_id;
        this.b_nickname = b_nickname;
        this.b_profile = b_profile;
    }

    /*public BlockCustomerInfo(String nickname, String info_id){
        this.nickname = nickname;
        this.info_id = info_id;
    }
    public BlockCustomerInfo(String nickname, String info_id, int profile){
        this.nickname = nickname;
        this.info_id = info_id;
        this.profile = profile;
    }
    public BlockCustomerInfo(String nickname, String info_id, int profile, ){
        this.nickname = nickname;
        this.info_id = info_id;
        this.profile = profile;
    }*/
    @Override
    public String toString() {
        return "BlockCustomerInfo [info_id="+info_id+"b_info_id="+b_info_id+"b_nickname=" + b_nickname + ", b_profile=" + b_profile+"]";
    }

}
