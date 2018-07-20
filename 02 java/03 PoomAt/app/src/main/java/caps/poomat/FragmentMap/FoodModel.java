package caps.poomat.FragmentMap;

import java.io.Serializable;

/**
 * Created by Hyeon on 2016-05-25.
 */
public class FoodModel implements Serializable{
    private String serviceUserId;
    private String foodName;
    private String foodImagePath;
    private String date;
    private int writeNum;
    private double latitude;
    private double longitude;
    private double distance;
    private String categoryNum;

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public void setWriteNum(int writeNum) {
        this.writeNum = writeNum;
    }

    public void setServiceUserId(String serviceUserId) {
        this.serviceUserId = serviceUserId;
    }
    public void setCategoryNum(int categoryNum) {
        switch (categoryNum){
            case 1:
                this.categoryNum = "곡물 가공품";
                break;
            case 2:
                this.categoryNum = "정육, 난류";
                break;
            case 3:
                this.categoryNum = "수산 가공품";
                break;
            case 4:
                this.categoryNum = "낙농,축산 가공품";
                break;
            case 5:
                this.categoryNum = "조미료,장류,식용류";
                break;
            case 6:
                this.categoryNum = "채소";
                break;
            case 7:
                this.categoryNum = "과자, 빙과류";
                break;
            case 8:
                this.categoryNum = "음료";
                break;
            case 9:
                this.categoryNum = "의약외품";
                break;
            case 10:
                this.categoryNum = "기타";
                break;
            default:
                throw new IllegalArgumentException("categoryNum index scope is 1~10");
        }
    }
    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }
    public void setDistance(double distance) {
        this.distance = distance;
    }
    public void setFoodImagePath(String foodImagePath) {
        this.foodImagePath = foodImagePath.replaceAll(" ","%20");
    }
    public double getDistance() {
        return distance;
    }
    public double getLatitude() {
        return latitude;
    }
    public double getLongitude() {
        return longitude;
    }
    public String getCategoryNum() {
        return categoryNum;
    }
    public String getFoodImagePath() {
        return foodImagePath;
    }
    public String getFoodName() {
        return foodName;
    }

    public int getWriteNum() {
        return writeNum;
    }

    public String getDate() {
        return date;
    }

    public String getServiceUserId() {
        return serviceUserId;
    }
}
