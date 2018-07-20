package caps.poomat.FragmentMap;

import android.net.Uri;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.facebook.drawee.view.SimpleDraweeView;

import java.util.List;

import caps.poomat.R;

/**
 * Created by Hyeon on 2016-05-25.
 */
public class FragmentMapAdapter extends RecyclerView.Adapter {
    private List<FoodModel> dataSet ;
    public OnClickCallBack callBack;
    public FragmentMapAdapter(List<FoodModel> dataSet){
            this.dataSet = dataSet;
    }
    public final static class ViewHolder extends RecyclerView.ViewHolder{
        TextView foodTitle;
        TextView foodInfo;
        SimpleDraweeView foodImage;

        public ViewHolder(View itemView){
            super(itemView);
            foodTitle = (TextView)itemView.findViewById(R.id.foodNameText);
            foodInfo = (TextView)itemView.findViewById(R.id.foodInfoText);
            foodImage = (SimpleDraweeView)itemView.findViewById(R.id.foodImage);
        }
    }
    @Override
    public ViewHolder onCreateViewHolder(ViewGroup viewGroup,int viewType){
        final View itemView = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.content_food,viewGroup,false);
        return new ViewHolder(itemView);
    }
    @Override
    public void onBindViewHolder(final RecyclerView.ViewHolder holder,int position){
        ((ViewHolder)holder).foodTitle.setText(dataSet.get(holder.getLayoutPosition()).getFoodName());
        ((ViewHolder)holder).foodInfo.setText(dataSet.get(holder.getLayoutPosition()).getCategoryNum());
        ((ViewHolder)holder).foodImage.setImageURI(Uri.parse(dataSet.get(holder.getLayoutPosition()).getFoodImagePath()));
        ((ViewHolder)holder).itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(callBack != null){
                    callBack.onClick(dataSet.get(holder.getLayoutPosition()));
                }
            }
        });
    }
    @Override
    public int getItemCount(){
        return dataSet.size();
    }

    public interface OnClickCallBack{
        void onClick(FoodModel model);
    }
    public void setOnClickCallBack(OnClickCallBack callBack){
        this.callBack = callBack;
    }

}
