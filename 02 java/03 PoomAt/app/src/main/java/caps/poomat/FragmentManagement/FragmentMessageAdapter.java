package caps.poomat.FragmentManagement;

import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import java.util.List;

import caps.poomat.Message.MessageModel;
import caps.poomat.R;

/**
 * Created by Hyeon on 2016-05-25.
 */
public class FragmentMessageAdapter extends RecyclerView.Adapter {
    private List<MessageModel> dataSet ;
    public OnReplyCallBack replyCallBack;
    public OnDeleteCallBack deleteCallBack;

    public FragmentMessageAdapter(List<MessageModel> dataSet){
        this.dataSet = dataSet;
    }
    public final static class ViewHolder extends RecyclerView.ViewHolder{
        TextView sendUserNick;
        TextView message;
        TextView replyButton,deleteButton;
        public ViewHolder(View itemView){
            super(itemView);
            sendUserNick = (TextView)itemView.findViewById(R.id.sendUserNickContent);
            message = (TextView)itemView.findViewById(R.id.receiveMessage);
            replyButton = (TextView)itemView.findViewById(R.id.replyButton);
            deleteButton = (TextView)itemView.findViewById(R.id.deleteButton);

        }
    }
    @Override
    public ViewHolder onCreateViewHolder(ViewGroup viewGroup,int viewType){
        final View itemView = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.content_message,viewGroup,false);
        return new ViewHolder(itemView);
    }
    @Override
    public void onBindViewHolder(final RecyclerView.ViewHolder holder,int position){
        ((ViewHolder)holder).sendUserNick.setText(dataSet.get(holder.getLayoutPosition()).getSendUserNick());
        ((ViewHolder)holder).message.setText(dataSet.get(holder.getLayoutPosition()).getMessage());

        ((ViewHolder)holder).replyButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(replyCallBack != null){
                    replyCallBack.onReply(dataSet.get(holder.getLayoutPosition()));
                }
            }
        });
        ((ViewHolder)holder).deleteButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(deleteCallBack != null){
                    deleteCallBack.onDelete(dataSet.get(holder.getLayoutPosition()));
                }
            }
        });
    }
    @Override
    public int getItemCount(){
        return dataSet.size();
    }

    public interface OnReplyCallBack{
        void onReply(MessageModel model);
    }
    public interface OnDeleteCallBack{
        void onDelete(MessageModel model);
    }
    public void setOnReplyCallBack(OnReplyCallBack replyCallBack){
        this.replyCallBack = replyCallBack;
    }
    public void setOnDeleteCallBack(OnDeleteCallBack deleteCallBack){
        this.deleteCallBack = deleteCallBack;}
}
