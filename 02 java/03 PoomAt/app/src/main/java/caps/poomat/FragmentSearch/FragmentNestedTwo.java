package caps.poomat.FragmentSearch;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Spinner;

import caps.poomat.NetWork.SearchFromCase;
import caps.poomat.R;

/**
 * Created by Hyeon on 2016-05-25.
 */
public class FragmentNestedTwo extends Fragment {
    private View rootView;
    public Spinner spinner;
    public SearchFromCase searchFromCase = new SearchFromCase();
    @Override
    public View onCreateView(LayoutInflater inflater,ViewGroup container,Bundle savedInstanceState){
        rootView = inflater.inflate(R.layout.fragment_search_nested_two,container,false);
        spinner = (Spinner)rootView.findViewById(R.id.foodBigSpinner);
        return rootView;
    }
}
