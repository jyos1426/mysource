package caps.poomat.Message;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import caps.poomat.FragmentMap.FoodModel;
import caps.poomat.NetWork.SendMessageToServer;
import caps.poomat.R;
import caps.poomat.UserInfo;

/**
 * Created by Hyeon on 2016-04-25.
 */
public class RequestDealActivity extends AppCompatActivity {
    private TextView nickNameText;
    private EditText editText;
    private Intent intent;
    private FoodModel model;
    private String sendUserId,sendUserNick,recUserId,message;
    private int writeNum;
    private Button sendButton;
    @Override
    public void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_request_deal);

        intent = getIntent();
        model = (FoodModel)intent.getSerializableExtra("foodData");

        nickNameText = (TextView)findViewById(R.id.sendUserNickContent);
        editText = (EditText)findViewById(R.id.sendEditText);
        sendButton = (Button)findViewById(R.id.sendButton);

        sendButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(editText.getText().toString().length() != 0) {
                    SendMessageToServer sendMessageToServer = new SendMessageToServer(UserInfo.getKakaoId(), UserInfo.getNickName(), model.getServiceUserId(), editText.getText().toString(), model.getWriteNum());
                    sendMessageToServer.setFinishCallBack(new SendMessageToServer.FinishCallBack() {
                        @Override
                        public void onFinish() {
                            finish();
                        }
                    });
                    sendMessageToServer.ConnectToServer();
                } else {
                    Toast.makeText(RequestDealActivity.this,"보낼 내용을 입력해주세요",Toast.LENGTH_SHORT).show();
                }
            }
        });
        nickNameText.setText(UserInfo.getNickName());
    }
}
