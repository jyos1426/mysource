package caps.poomat.Register;

import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.Toast;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapFragment;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.UiSettings;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;

import caps.poomat.NetWork.UploadData;
import caps.poomat.R;

/**
 * Created by Kim on 2016-05-25.
 */
public class RegisterActivity extends AppCompatActivity implements OnMapReadyCallback{
    private MapFragment mapFragment;
    private ImageView registerImage,backButton;
    private String foodName,foodBuyDate,foodCategory,selectedImagePath;
    private double userLatitude = 0.0;
    private double userLongitude = 0.0;

    private int cateNum;
    private EditText foodNameEdit;
    private Spinner foodCategorySpinner;
    private DatePicker datePicker;
    private Button registerButton;
    private int markerNum = 0;

    private static final int SELECT_PICTURE = 1;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        mapFragment = (MapFragment) getFragmentManager().findFragmentById(R.id.userRegistMap);
        mapFragment.getMapAsync(this);
        foodNameEdit = (EditText) findViewById(R.id.foodNameEdit);
        foodCategorySpinner = (Spinner) findViewById(R.id.foodBigSpinner);
        registerImage = (ImageView)findViewById(R.id.registerImage);
        datePicker = (DatePicker) findViewById(R.id.datePicker);
        backButton = (ImageView)findViewById(R.id.register_back);
        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
        registerButton = (Button) findViewById(R.id.registerButton);
        registerImage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent();
                intent.setType("image/*");
                intent.setAction(Intent.ACTION_GET_CONTENT);
                startActivityForResult(Intent.createChooser(intent, "Select Picture"), SELECT_PICTURE);
            }
        });
        foodCategorySpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                if (parent.getSelectedItemPosition() != 0) {
                    foodCategory = parent.getItemAtPosition(position).toString();
                }
            }
            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });

        datePicker.init(datePicker.getYear(), datePicker.getMonth(), datePicker.getDayOfMonth(), new DatePicker.OnDateChangedListener() {

            @Override
            public void onDateChanged(DatePicker view, int year, int monthOfYear, int dayOfMonth) {
                String msg = String.format("%d-%d-%d", year, monthOfYear + 1, dayOfMonth);
                foodBuyDate = msg;
            }
        });

        registerButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                foodName = foodNameEdit.getText().toString();
                cateNum = foodCategorySpinner.getSelectedItemPosition();

                if (selectedImagePath == null) {
                    Toast.makeText(RegisterActivity.this, "사진을 등록해 주세요", Toast.LENGTH_SHORT).show();
                } else if (foodName.length() == 0) {
                    Toast.makeText(RegisterActivity.this, "식재료 이름을 입력해주세요", Toast.LENGTH_SHORT).show();
                } else if (foodCategory.length() == 0) {
                    Toast.makeText(RegisterActivity.this, "카테고리를 선택해 주세요", Toast.LENGTH_SHORT).show();
                } else if (userLatitude == 0.0 || userLongitude == 0.0) {
                    Toast.makeText(RegisterActivity.this, "위치를 입력해 주세요", Toast.LENGTH_SHORT).show();
                } else if (foodBuyDate == null) {
                    Toast.makeText(RegisterActivity.this, "구매날짜를 선택해 주세요", Toast.LENGTH_SHORT).show();
                } else {
                    UploadData uploadData = new UploadData(foodName,selectedImagePath,userLatitude,userLongitude,foodBuyDate,cateNum);
                    uploadData.setOnFinishCallBack(new UploadData.OnFinishCallBack() {
                        @Override
                        public void onFinish() {
                            finish();
                        }
                    });
                    uploadData.ConnectToServer();
                }
            }
        });
    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (resultCode == RESULT_OK) {
            if (requestCode == SELECT_PICTURE) {
                Uri selectedImageUri = data.getData();
                selectedImagePath = getPath(selectedImageUri);
                registerImage.setImageURI(selectedImageUri);
            }
        }
    }
    @Override
    public void onMapReady(final GoogleMap map){
        map.setMyLocationEnabled(true);
        UiSettings uiSettings = map.getUiSettings();
        uiSettings.setCompassEnabled(true);
        uiSettings.setZoomControlsEnabled(true);

        map.animateCamera(CameraUpdateFactory.zoomTo(17), 500, null);
        map.setOnMapLongClickListener(new GoogleMap.OnMapLongClickListener() {
            @Override
            public void onMapLongClick(LatLng point) {
                map.clear();
                markerNum = 0;
                if (markerNum == 0) {
                    map.addMarker(new MarkerOptions().position(point).title(
                            point.toString())
                            .draggable(true));
                    userLatitude = point.latitude;
                    userLongitude = point.longitude;
                    markerNum++;
                }
            }

        });
    }
    private String getPath(Uri uri) {
        Cursor cursor = getContentResolver().query(uri, null, null, null, null);
        cursor.moveToFirst();
        String document_id = cursor.getString(0);
        document_id = document_id.substring(document_id.lastIndexOf(":")+1);
        cursor.close();

        cursor = getContentResolver().query(
                android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                null, MediaStore.Images.Media._ID + " = ? ", new String[]{document_id}, null);
        cursor.moveToFirst();
        String path = cursor.getString(cursor.getColumnIndex(MediaStore.Images.Media.DATA));
        cursor.close();
        return path;
    }
}
