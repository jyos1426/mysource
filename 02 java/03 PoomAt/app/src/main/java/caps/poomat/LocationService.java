package caps.poomat;

import android.content.Context;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;

import com.afollestad.materialdialogs.MaterialDialog;

/**
 * Created by Hyeon on 2016-04-25.
 */
public class LocationService implements LocationListener {
    private final long MIN_DISTANCE_CHANGE_FOR_UPDATES = 10;
    private final long MIN_TIME_BW_UPDATES = 2000;
    private static LocationService instance = null;

    public double longitude;
    public double latitude ;

    public LocationManager locationManager;
    private boolean isGpsEnabled;
    private boolean isNetWorkEnabled;
    private boolean isGetLocation;
    private Context context;
    private MaterialDialog dialog;
    public Location location;

    public static LocationService getInstance(Context context){
        if(instance == null){
            instance = new LocationService(context.getApplicationContext());
        }
        return instance;
    }
    public LocationService(Context context){
        this.context = context;
        longitude =0.0;
        latitude = 0.0;
        locationManager = (LocationManager)context.getSystemService(Context.LOCATION_SERVICE);
    }
    public boolean detectLocation() {
        try{
            isGpsEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
            isNetWorkEnabled = locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
            isGetLocation = false;

            if(!isNetWorkEnabled && !isGpsEnabled){
            } else {
                isGetLocation = true;
                if (isNetWorkEnabled) {
                    locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 1800, 1, this);

                    if (locationManager != null) {

                        if ((location = locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER)) != null) {
                            latitude = location.getLatitude();
                            longitude = location.getLongitude();
                            return true;
                        }
                    }
                }
                if (isGpsEnabled) {
                    locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1800, 1,this);

                    if (locationManager != null) {

                        if ((location = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER)) != null) {
                            latitude = location.getLatitude();
                            longitude = location.getLongitude();
                            return true;
                        }
                    }
                }
            }
        }catch (Exception e){e.printStackTrace();}
        return false;
    }
    public double getLatitude(){
        return latitude;
    }
    public double getLongitude(){ return longitude;
    }
    @Override
    public void onLocationChanged(Location location){

        latitude = location.getLatitude();
        longitude = location.getLongitude();
    }
    @Override
    public void onProviderEnabled(String provider){
        //TODO Auto-generated method stub
    }
    @Override
    public void onProviderDisabled(String provider){
        //TODO Auto-generated method stub
    }
    @Override
    public void onStatusChanged(String provider, int status, Bundle extras){
        //TODO Auto-generated method stub
    }

}
