package caps.poomat;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.facebook.drawee.view.SimpleDraweeView;

import caps.poomat.FragmentMap.FoodModel;
import caps.poomat.Message.RequestDealActivity;
import caps.poomat.NetWork.DeleteFromUserId;

/**
 * Created by Hyeon on 2016-04-25.
 */
public class FoodItemActivity extends AppCompatActivity {
    private SimpleDraweeView foodItemImage;
    private TextView userName,foodItemName,foodBuyDate;
    private Intent intent;
    private FoodModel model;
    private ImageView backButton;
    private Button deleteOrRequestButton;
    @Override
    public void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);

        intent = this.getIntent();
        model = (FoodModel)intent.getSerializableExtra("foodData");
        setContentView(R.layout.activity_food);

        deleteOrRequestButton = (Button)findViewById(R.id.foodItemButton);
        if(model.getServiceUserId().equals(UserInfo.getKakaoId())){
            deleteOrRequestButton.setText("삭제하기");
            deleteOrRequestButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    DeleteFromUserId deleteFromUserId = new DeleteFromUserId();
                    deleteFromUserId.setFinishCallBack(new DeleteFromUserId.FinishCallBack() {
                        @Override
                        public void onFinish() {
                            finish();
                        }
                    });
                    deleteFromUserId.execute(model.getWriteNum());
                }
            });
        }else{
            deleteOrRequestButton.setText("교환 요청하기");
            deleteOrRequestButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(FoodItemActivity.this,RequestDealActivity.class);
                    intent.putExtra("foodData",model);
                    startActivity(intent);
                }
            });
        }
        foodItemImage = (SimpleDraweeView)findViewById(R.id.foodItemImage);
        backButton = (ImageView)findViewById(R.id.foodItemBack);
        foodItemName = (TextView)findViewById(R.id.foodItemName);
        foodBuyDate = (TextView)findViewById(R.id.foodItemDateContent);

        foodItemImage.setImageURI(Uri.parse(model.getFoodImagePath()));
        foodItemName.setText(model.getFoodName());
        foodBuyDate.setText(model.getDate());

        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

    }
}
