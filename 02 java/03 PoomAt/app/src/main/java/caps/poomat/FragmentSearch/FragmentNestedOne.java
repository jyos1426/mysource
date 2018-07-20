package caps.poomat.FragmentSearch;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;

import caps.poomat.NetWork.SearchFromName;
import caps.poomat.R;

/**
 * Created by Hyeon on 2016-05-25.
 */
public class FragmentNestedOne extends Fragment {
    private View rootView;
    public EditText editText;

    public SearchFromName searchFromName = new SearchFromName();
    @Override
    public View onCreateView(LayoutInflater inflater,ViewGroup container,Bundle savedInstanceState){
        rootView = inflater.inflate(R.layout.fragment_search_nested_one,container,false);
        editText = (EditText)rootView.findViewById(R.id.nameSearchEdit);

        return rootView;
    }
}
