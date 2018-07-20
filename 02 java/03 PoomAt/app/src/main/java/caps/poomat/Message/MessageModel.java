package caps.poomat.Message;

import java.io.Serializable;

/**
 * Created by Hyeon on 2016-04-25.
 */
public class MessageModel implements Serializable{
    private String sendUserId;
    private String sendUserNick;
    private String recUserId;
    private String message;
    private int msgNum;
    private int writeNum;

    public int getWriteNum() {
        return writeNum;
    }
    public int getMsgNum() {
        return msgNum;
    }
    public String getMessage() {
        return message;
    }
    public String getRecUserId() {
        return recUserId;
    }
    public String getSendUserId() {
        return sendUserId;
    }
    public String getSendUserNick() {
        return sendUserNick;
    }
    public void setWriteNum(int writeNum) {
        this.writeNum = writeNum;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public void setMsgNum(int msgNum) {
        this.msgNum = msgNum;
    }
    public void setRecUserId(String recUserId) {
        this.recUserId = recUserId;
    }
    public void setSendUserId(String sendUserId) {
        this.sendUserId = sendUserId;
    }
    public void setSendUserNick(String sendUserNick) {
        this.sendUserNick = sendUserNick;
    }
}
