package caps.poomat.FragmentManagement;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import java.util.List;

import caps.poomat.Message.MessageModel;
import caps.poomat.NetWork.DeleteMessage;
import caps.poomat.NetWork.ReceiveMessageFromServer;
import caps.poomat.R;
import caps.poomat.Message.RequestReplyActivity;
import caps.poomat.UserInfo;

/**
 * Created by Hyeon on 2016-05-25.
 */
public class FragmentNestedTwo extends Fragment {
    private View rootView;
    private ReceiveMessageFromServer receiveMessageFromServer;
    private FragmentMessageAdapter adapter;
    private RecyclerView recyclerView;
    private MessageModel data;
    private List<MessageModel> models;
    @Override
    public View onCreateView(LayoutInflater inflater,ViewGroup container,Bundle savedInstanceState){
        rootView = inflater.inflate(R.layout.fragment_management_nested_two,container,false);
        recyclerView = (RecyclerView)rootView.findViewById(R.id.messageRecycler);

        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        receiveMessageFromServer = new ReceiveMessageFromServer();

        receiveMessageFromServer.setFinishCallBack(new ReceiveMessageFromServer.FinishCallBack() {
            @Override
            public void onFinish(List<MessageModel> dataSet) {
                adapter = new FragmentMessageAdapter(dataSet);
                models = dataSet;
                adapter.setOnDeleteCallBack(new FragmentMessageAdapter.OnDeleteCallBack() {
                    @Override
                    public void onDelete(final MessageModel model) {
                        DeleteMessage deleteMessage = new DeleteMessage();
                        deleteMessage.setFinishCallBack(new DeleteMessage.FinishCallBack() {
                            @Override
                            public void onFinish() {
                                for (int i = 0; i < models.size(); i++) {
                                    if (models.get(i).getMsgNum() == model.getMsgNum()) {
                                        models.remove(i);
                                    }
                                }
                                adapter = new FragmentMessageAdapter(models);
                                recyclerView.setAdapter(adapter);
                            }
                        });
                        deleteMessage.execute(model.getMsgNum());
                    }
                });
                adapter.setOnReplyCallBack(new FragmentMessageAdapter.OnReplyCallBack() {
                    @Override
                    public void onReply(final MessageModel model) {
                        Intent intent = new Intent(getContext(), RequestReplyActivity.class);
                        intent.putExtra("messageData",model);
                        startActivity(intent);
                    }
                });
                recyclerView.setAdapter(adapter);
            }
        });

        receiveMessageFromServer.execute(UserInfo.getKakaoId());
        return rootView;
    }
}
