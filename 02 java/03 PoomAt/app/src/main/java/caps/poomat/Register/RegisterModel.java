package caps.poomat.Register;

/**
 * Created by Kim on 2016-06-07.
 */
public class RegisterModel {
    private String serviceUserId;
    private String foodName;
    private String imagePath;
    private String foodBuydate;
    private double latitude;
    private double longitude;
    private int categotyNum;

    public double getLatitude() {
        return latitude;
    }
    public double getLongitude() {
        return longitude;
    }
    public int getCategotyNum() {
        return categotyNum;
    }
    public String getFoodBuydate() {
        return foodBuydate;
    }
    public String getFoodName() {
        return foodName;
    }
    public String getImagePath() {
        return imagePath;
    }
    public String getServiceUserId() {
        return serviceUserId;
    }
    public void setCategotyNum(int categotyNum) {
        this.categotyNum = categotyNum;
    }
    public void setFoodBuydate(String foodBuydate) {
        this.foodBuydate = foodBuydate;
    }
    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }
    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }
    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }
    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
    public void setServiceUserId(String serviceUserId) {
        this.serviceUserId = serviceUserId;
    }
}
