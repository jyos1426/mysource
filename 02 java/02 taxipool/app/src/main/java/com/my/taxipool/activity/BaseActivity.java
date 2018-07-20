package com.my.taxipool.activity;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.support.annotation.LayoutRes;
import android.support.design.widget.NavigationView;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import com.my.taxipool.MyInfo;
import com.my.taxipool.R;

public class BaseActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener{
    protected DrawerLayout drawerLayout;
    protected FrameLayout frameLayout;

    //toolbar
    protected Toolbar toolbar;
    protected ImageButton toolbar_rightbtn;
    private NavigationView navigationView;

    //For Hamburger Views
    private ImageView img_nav_info;
    private TextView tv_nav_infoname, tv_nav_info_nickandphone, tv_point;
    private Bitmap bitmap;
    private Button bt_point;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public void setContentView(@LayoutRes int layoutResID) {
        drawerLayout = (DrawerLayout) getLayoutInflater().inflate(R.layout.activity_base, null);
        frameLayout = (FrameLayout) drawerLayout.findViewById(R.id.content_frame);
        navigationView = (NavigationView) findViewById(R.id.nav_view);

        getLayoutInflater().inflate(layoutResID, frameLayout, true);
        super.setContentView(drawerLayout);

        setUpNavigation();
        setUpToolBar();
        setViews();
    }

    private void setUpNavigation() {
        navigationView = (NavigationView) findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);

        //Views in Hamburger
        View headerLayout = navigationView.getHeaderView(0);
        img_nav_info = (ImageView) headerLayout.findViewById(R.id.img_nav_info);
        tv_nav_infoname = (TextView) headerLayout.findViewById(R.id.tv_nav_infoname);
        tv_nav_info_nickandphone = (TextView) headerLayout.findViewById(R.id.tv_nav_info_nickandphone);
        tv_point = (TextView) headerLayout.findViewById(R.id.tv_point);
        bt_point = (Button) headerLayout.findViewById(R.id.bt_point);

        toolbar = (Toolbar) findViewById(R.id.toolbar);
        toolbar_rightbtn = (ImageButton) findViewById(R.id.toolbar_rightbtn);
    }

    public void setUpToolBar() {
        setSupportActionBar(toolbar);

        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawerLayout, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawerLayout.setDrawerListener(toggle);
        toggle.syncState();
    }
    private void setViews(){
        bt_point.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getApplicationContext(),PointActivity.class);
                startActivity(intent);
            }
        });
        img_nav_info.setImageBitmap(bitmap);
        tv_nav_infoname.setText(MyInfo.getNickname());
        tv_point.setText(String.valueOf(MyInfo.getPoint()));
        tv_nav_info_nickandphone.setText(MyInfo.getInfo_name()+" / "+MyInfo.getPhone_no());
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        toolbar.setNavigationIcon(R.drawable.ic_menu_black_24dp);
        super.onCreateOptionsMenu(menu);
        return true;
    }

    @SuppressWarnings("StatementWithEmptyBody")
    @Override
    public boolean onNavigationItemSelected(MenuItem item) {
        int id = item.getItemId();
        Intent intent;
        switch (id) {
            case R.id.nav_sub_boardlist:
                intent = new Intent((Activity)this, RoomRecordActiviy.class);
                startActivity(intent);
                break;
            case R.id.nav_sub_blocklist:
                intent = new Intent((Activity)this, BlockActivity.class);
                startActivity(intent);
                break;
        }
        drawerLayout.closeDrawer(GravityCompat.START);
        return true;
    }

    @Override
    public void onBackPressed() {
        if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
            drawerLayout.closeDrawer(GravityCompat.START);
        }else{
            super.onBackPressed();
        }
    }
}