package com.app.ps19.elecapp;

import static com.app.ps19.elecapp.Shared.Globals.appName;
import static com.app.ps19.elecapp.Shared.Globals.getSelectedTask;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;

import com.app.ps19.elecapp.Shared.Globals;
import com.app.ps19.elecapp.classes.dynforms.DynForm;
import com.app.ps19.elecapp.classes.dynforms.DynFormControl;
import com.app.ps19.elecapp.classes.dynforms.OnValueChangeEventListener;

import java.util.ArrayList;


/**
 * A simple {@link Fragment} subclass.
 * Use the {@link DynFormFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class DynFormListFragment extends Fragment implements OnValueChangeEventListener {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    private static final String ARG_PARAM3 = "viewGroup";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    private String mParam3="";
    private ArrayList<DynForm> formList;
    private ArrayAdapter<DynForm> formListAdapter;
    private View rootView=null;
    private ListView lvFormList;

    private RelativeLayout layoutInfoTables;
    private LinearLayout layoutNoForms;
    private Button btnInfoTables;
    private Context _context=null;
    private FragmentActivity mActivity;
    private OnFragmentInteractionListener mListener;
    private RelativeLayout rlReports;
    private Button btViewReports;

    public DynFormListFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment DynFormFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static DynFormListFragment newInstance(String param1, String param2) {
        DynFormListFragment fragment = new DynFormListFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }
    public static DynFormListFragment newInstance(String param1, String param2, String param3) {
        DynFormListFragment fragment = new DynFormListFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        args.putString(ARG_PARAM3, param3);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
            mParam3 = getArguments().getString(ARG_PARAM3);
        }
        //DynFormList.loadSampleFormList();
        fillFormList();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        if(rootView==null) {
            rootView = inflater.inflate(R.layout.fragment_dyn_form_list, container, false);
            //Button btnSubmit = (Button) rootView.findViewById(R.id.btSubmit);
            _context = rootView.getContext();
            layoutInfoTables=rootView.findViewById(R.id.layoutInfo_fdfl);
            layoutNoForms=rootView.findViewById(R.id.layoutNoForm_fdfl);
            btnInfoTables=rootView.findViewById(R.id.btnInfoTables_fdfl);
            lvFormList=rootView.findViewById(R.id.lvFormList_idfl);
            rlReports = (RelativeLayout) rootView.findViewById(R.id.rl_show_report);
            btViewReports = (Button) rootView.findViewById(R.id.btn_show_report);
            lvFormList.setAdapter(formListAdapter);
            String viewGroup=mParam3!=null?mParam3:"";
            lvFormList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                @Override
                public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                    TextView tvTitle=view.findViewById(R.id.tvTitle_idfl);
                    Intent intent = new Intent(getActivity(), AppFormActivity.class);
                    intent.putExtra("assetType",mParam2);
                    intent.putExtra("form",tvTitle.getText());
                    startActivity(intent);
                }
            });
            btnInfoTables.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    Intent intent=new Intent(_context, infoTableActivity.class);
                    startActivity(intent);

                }
            });
            btViewReports.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    Intent intent = new Intent(getActivity(), ReportWebViewActivity.class);
                    startActivity(intent);
                }
            });
            if(appName.equals(Globals.AppName.SCIM)){
                rlReports.setVisibility(View.VISIBLE);
            } else {
                rlReports.setVisibility(View.GONE);
            }
            if(formList.size()==0){
                layoutNoForms.setVisibility(View.VISIBLE);
            }else{
                layoutNoForms.setVisibility(View.GONE);
            }
            if(!mParam2.equals("")){
                rlReports.setVisibility(View.GONE);
                layoutInfoTables.setVisibility(View.VISIBLE);
            } else {
                if(viewGroup.equals("")) {
                    rlReports.setVisibility(View.VISIBLE);
                }
            }
        }
        if(!mParam2.equals("")){
        ((IssuesActivity)getActivity()).setFragmentRefreshFormListener(new IssuesActivity.FragmentRefreshFormListener() {
            @Override
            public void onRefresh() {

                // Refresh Your Fragment
                if(Globals.selectedUnit != null){
                    fillFormList();
                    formListAdapter.notifyDataSetChanged();
                    if(formList.size()==0){
                        layoutNoForms.setVisibility(View.VISIBLE);
                    }else{
                        layoutNoForms.setVisibility(View.GONE);
                    }

                }
            }
        });
        }
        if(appName.equals(Globals.AppName.SCIM)){
            layoutInfoTables.setVisibility(View.GONE);
        }
        return rootView;
    }
    private void fillFormList(){
        if(getSelectedTask()!=null){
            Log.i("List Frags","getting app forms");
            mParam2=(mParam2.equals("")?"":Globals.selectedUnit.getAssetType());
            if(!mParam2.equals("")){
                //layoutInfoTables.setVisibility(View.VISIBLE);
            }

            ArrayList<DynForm> _formList=null;
            if(!mParam2.equals("")){
                if(Globals.selectedUnit !=null){
                    _formList=Globals.selectedUnit.getAppForms();
                }else{
                    return;
                }
            }else{
                _formList=getSelectedTask().getAppForms();
            }
            ArrayList<DynForm> _formFilterList=new ArrayList<>();
            String viewGroup=mParam3 !=null?mParam3:"";
            for(DynForm form:_formList){
                if(mParam2.equals("")) {
                    //if (!form.isAssetTypeExists()) {
                    if ((form.getFormSettings() == null && viewGroup.equals("")) || (form.getFormSettings() !=null && form.getFormSettings().getTarget().equals("task") && form.getFormSettings().getViewGroup().equals(viewGroup)) ) {
                        _formFilterList.add(form);
                    }
                }else{
                    _formFilterList.add(form);
                }
            }
            this.formList=_formFilterList;
            if(this.formList.size()==0){
                //layoutNoForms.setVisibility(View.VISIBLE);
            }
        }else {
            //DynFormList.loadFormList();
            //this.formList = DynFormList.getFormList();
        }
        formListAdapter =new DynFormListAdapter(getActivity(),formList);
        if(lvFormList!=null) {
            lvFormList.setAdapter(formListAdapter);
        }
    }
    private class DynFormListAdapter extends ArrayAdapter<DynForm> {
        public DynFormListAdapter(Context context, ArrayList<DynForm> forms) {
            super(context, 0, forms);
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            // Get the data item for this position
            DynForm form = getItem(position);
            // Check if an existing view is being reused, otherwise inflate the view
            if (convertView == null) {
                convertView = LayoutInflater.from(getContext()).inflate(R.layout.item_dyn_form_list, parent, false);
            }
            // Lookup view for data population
            TextView tvName = (TextView) convertView.findViewById(R.id.tvTitle_idfl);
            TextView tvDetail = (TextView) convertView.findViewById(R.id.tvDetails_idfl);
            // Populate the data into the template view using the data object
            tvName.setText(form.getFormName());
            tvDetail.setText("Form");
            // Return the completed view to render on screen
            return convertView;
        }
    }

    @Override
    public void onValueChange(String id, String value) {

    }

    @Override
    public void onFormDirtyChange(boolean dirty) {

    }

    @Override
    public void onObjectAddClick(DynFormControl control) {

        Toast.makeText(getActivity(),"Add Button Pressed on "+control.getFieldName(),Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onObjectRemoveClick(DynFormControl control, DynForm item) {
        String itemName=item.getFormControlList().get(0).getCurrentValue() +"["+ control.getFieldName()+"]";
        Toast.makeText(getActivity(),"Remove Button Pressed on "+itemName,Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onObjectItemClick(DynFormControl control, DynForm item) {
        String itemName=item.getFormControlList().get(0).getCurrentValue() +"["+ control.getFieldName()+"]";
        Toast.makeText(getActivity(),"Item Clicked on "+itemName,Toast.LENGTH_SHORT).show();

    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof Activity){
            mActivity = (FragmentActivity) context;
        }
        if (context instanceof OnFragmentInteractionListener) {
            mListener = (OnFragmentInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement OnFragmentInteractionListener");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
        _context = null;
    }

    public interface OnFragmentInteractionListener {
        // TODO: Update argument type and name
        void onFragmentInteraction(Uri uri);
    }

}
