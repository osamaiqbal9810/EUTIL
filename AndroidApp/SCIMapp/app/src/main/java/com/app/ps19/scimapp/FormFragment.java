package com.app.ps19.scimapp;

import android.app.Activity;
import android.content.Context;
import android.content.res.Resources;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import android.util.Log;
import android.util.TypedValue;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;

import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.Shared.ListMap;
import com.app.ps19.scimapp.classes.Task;
import com.app.ps19.scimapp.classes.Units;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import static com.app.ps19.scimapp.Shared.Globals.TASK_FINISHED_STATUS;
import static com.app.ps19.scimapp.Shared.Globals.getSelectedTask;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link FormFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link FormFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class FormFragment extends Fragment{
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    private static final String JSON_TEXT = "{\n" +
            " \"name\": \"Form A\",\n" +
            "    \"fields\":[\n" +
            "\t{\n" +
            "\t\"title\":\"Horizontal Split Head\",\n" +
            "\t\"data\":[{\"id\":\"row1\",\n" +
            "\"elements\":[\n" +
            "{\n" +
            "            \"name\": \"cbFirst\",\n" +
            "\t\t\t\"tag\": \"cb-q1\",\n" +
            "            \"type\": \"BOOLEAN_CHECKBOX\",\n" +
            "            \"defaultValue\": false\n" +
            "        },\n" +
            "\t\t{\n" +
            "            \"name\": \"tvFirst\",\n" +
            "            \"type\": \"STRING\",\n" +
            "\t    \"description\":\"Verify all issues\",\n" +
            "            \"minCharacters\": 10,\n" +
            "            \"maxCharacters\": 100\n" +
            "        },\n" +
            "        {\n" +
            "            \"name\": \"swFirst\",\n" +
            "\t\t\t\"tag\": \"sw-q1\",\n" +
            "            \"type\": \"BOOLEAN_SWITCH\",\n" +
            "            \"defaultValue\": false\n" +
            "        }] \n" +
            "},\n" +
            "{\"id\":\"row2\",\n" +
            "\"elements\":[\n" +
            "{\n" +
            "            \"name\": \"cbFirst\",\n" +
            "\t\t\t\"tag\": \"cb-q2\",\n" +
            "            \"type\": \"BOOLEAN_CHECKBOX\",\n" +
            "            \"defaultValue\": false\n" +
            "        },\n" +
            "\t\t{\n" +
            "            \"name\": \"tvFirst\",\n" +
            "            \"type\": \"STRING\",\n" +
            "\t    \"description\":\"Vehicle Speed must not be more than 5 mph\",\n" +
            "            \"minCharacters\": 10,\n" +
            "            \"maxCharacters\": 100\n" +
            "        },\n" +
            "        {\n" +
            "            \"name\": \"swFirst\",\n" +
            "\t\t\t\"tag\": \"sw-q2\",\n" +
            "            \"type\": \"BOOLEAN_SWITCH\",\n" +
            "            \"defaultValue\": false\n" +
            "        }] \n" +
            "}]\n" +
            "\t},\n" +
            "\t{\n" +
            "\t\"title\":\"Vertical Split Head\",\n" +
            "\t\"data\":[{\"id\":\"row1\",\n" +
            "\"elements\":[\n" +
            "{\n" +
            "            \"name\": \"cbFirst\",\n" +
            "\t\t\t\"tag\": \"cb-q3\",\n" +
            "            \"type\": \"BOOLEAN_CHECKBOX\",\n" +
            "            \"defaultValue\": false\n" +
            "        },\n" +
            "\t\t{\n" +
            "            \"name\": \"tvFirst\",\n" +
            "            \"type\": \"STRING\",\n" +
            "\t    \"description\":\"Verify all issues\",\n" +
            "            \"minCharacters\": 10,\n" +
            "            \"maxCharacters\": 100\n" +
            "        },\n" +
            "        {\n" +
            "            \"name\": \"swFirst\",\n" +
            "\t\t\t\"tag\": \"sw-q3\",\n" +
            "            \"type\": \"BOOLEAN_SWITCH\",\n" +
            "            \"defaultValue\": false\n" +
            "        }] \n" +
            "},\n" +
            "{\"id\":\"row2\",\n" +
            "\"elements\":[\n" +
            "{\n" +
            "            \"name\": \"cbFirst\",\n" +
            "\t\t\t\"tag\": \"cb-q4\",\n" +
            "            \"type\": \"BOOLEAN_CHECKBOX\",\n" +
            "            \"defaultValue\": false\n" +
            "        },\n" +
            "\t\t{\n" +
            "            \"name\": \"tvFirst\",\n" +
            "            \"type\": \"STRING\",\n" +
            "\t    \"description\":\"Vehicle Speed must not be more than 5 mph\",\n" +
            "            \"minCharacters\": 10,\n" +
            "            \"maxCharacters\": 100\n" +
            "        },\n" +
            "        {\n" +
            "            \"name\": \"swFirst\",\n" +
            "\t\t\t\"tag\": \"sw-q4\",\n" +
            "            \"type\": \"BOOLEAN_SWITCH\",\n" +
            "            \"defaultValue\": false\n" +
            "        }] \n" +
            "}]\n" +
            "\t}\n" +
            "\n" +
            "\t]\n" +
            "}";
    ArrayList<String> idMap = new ArrayList<>();
    Context _context;
    HashMap<String, String> setOfValues = new HashMap<>();
    TextView tvUnitTitle;
    Button btnSubmit;
    LinearLayout rootLayout;
    View rootView;

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;
    private FragmentActivity mActivity;

    public FormFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment FormFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static FormFragment newInstance(String param1, String param2) {
        FormFragment fragment = new FormFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, final ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        rootView = inflater.inflate(R.layout.fragment_form, container, false);
        //Button btnSubmit = (Button) rootView.findViewById(R.id.btSubmit);
        _context = rootView.getContext();
        idMap.clear();
        /*Button btnSet = new Button(_context);
        btnSet.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT));
        btnSet.setText("Set");
        //setOfValues.put("sw-q1",true);

        btnSet.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                for (String key : Globals.selectedUnit.getSelection().keySet()) {
                    if (Globals.selectedUnit.getSelection().get(key)) {
                        String _checkboxTxt = key.replace("sw", "cb");
                        CheckBox _checkbox = (CheckBox) rootView.findViewWithTag(_checkboxTxt);
                        _checkbox.setChecked(Globals.selectedUnit.getSelection().get(key));
                        Switch _switch = (Switch) rootView.findViewWithTag(key);
                        _switch.setChecked(Globals.selectedUnit.getSelection().get(key));
                    }
                }
            }});*/
        btnSubmit = new Button(_context);
        btnSubmit.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT));
        btnSubmit.setText(getString(R.string.title_new_report_btn_save));
        if(getSelectedTask().getStatus().equals(TASK_FINISHED_STATUS)){
            btnSubmit.setVisibility(View.GONE);
        } else {
            btnSubmit.setVisibility(View.VISIBLE);
        }
        tvUnitTitle = (TextView) rootView.findViewById(R.id.tvUnitTitle);
        btnSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setOfValues = new HashMap<>();
                for (int counter = 0; counter < idMap.size(); counter++) {
                    String[] tags = idMap.get(counter).split("-");
                    if(tags[0].equals("etId")){
                        EditText etId = (EditText) rootView.findViewWithTag(idMap.get(counter));
                        if(etId!=null){
                            setOfValues.put(idMap.get(counter), etId.getText().toString());
                        } else {
                            Log.println(Log.INFO,"FORM:", idMap.get(counter) + "Not Found");
                        }
                    } else if (tags[0].equals("etDesc")){
                        EditText etId = (EditText) rootView.findViewWithTag(idMap.get(counter));
                        if(etId!=null){
                            setOfValues.put(idMap.get(counter), etId.getText().toString());
                        } else{
                            Log.println(Log.INFO,"FORM:", idMap.get(counter) + "Not Found");
                        }

                    } else if (tags[0].equals("cb")){
                        CheckBox _checkBox = (CheckBox) rootView.findViewWithTag(idMap.get(counter));
                        if(_checkBox!=null){
                            if(_checkBox.isChecked()){
                                String switchTag = idMap.get(counter).replace("cb", "sw");
                                Switch _switch = (Switch) rootView.findViewWithTag(switchTag);
                                setOfValues.put(switchTag, Boolean.toString(_switch.isChecked()));
                                System.out.println(_switch.isChecked());
                            }
                        }
                    }

                    // System.out.println(idMap.get(counter));
                }

                /*if(setOfValues.size()<Globals.selectedUnit.getSelection().size()){
                    setOfValues.put("null", false);
                }*/
               /* for (int index = 0; index < Globals.selectedUnit.getSelection().size(); index++) {
                    if(Globals.selectedUnit.getSelection().get(index))
                }*/
                if (Globals.selectedUnit.getSelection() != null) {
                    for (Map.Entry<String, String> _values : Globals.selectedUnit.getSelection().entrySet()) {
                        if (!setOfValues.containsKey(_values.getKey())) {
                            setOfValues.put(_values.getKey(), null);
                        }
                    }
                }

                //Globals.selectedUnit.setSelection(setOfValues);
                String selTaskId = getSelectedTask().getTaskId();
                String selUnitId = Globals.selectedUnit.getUnitId();


                for (Task task: Globals.selectedJPlan.getTaskList()){
                    if(task.getTaskId().equals(selTaskId)){
                        for(Units unit: task.getWholeUnitList()){
                            if(unit.getUnitId().equals(selUnitId)){
                                unit.setSelection(setOfValues);
                                break;
                            }
                        }
                    }
                }
                Globals.selectedJPlan.update();
                Toast.makeText(_context, getString(R.string.successfully_updated), Toast.LENGTH_SHORT).show();
            }
        });
        rootLayout = (LinearLayout) rootView.findViewById(R.id.lLayout);
        if(Globals.selectedUnit != null){
            initForm();
        }
        ((IssuesActivity)getActivity()).setFragmentRefreshFormListener(new IssuesActivity.FragmentRefreshFormListener() {
            @Override
            public void onRefresh() {

                // Refresh Your Fragment
                if(Globals.selectedUnit != null){
                    rootLayout.removeAllViews();
                    initForm();
                }
            }
        });
        return rootView;
    }

    public void initForm() {
        if(mActivity!= null){
            _context = mActivity;
        }
        JSONObject reader;
        JSONObject assetTypeForm=null;
        try {
            reader = Globals.selectedUnit.getJoFormData();
            String strForm=reader.optString("inspectionForms");
            String strUseParentFormValue=ListMap.getListValue(ListMap.LIST_SETTINGS,"useParentForm" );
            if(reader.optString("inspectionFormsObj","") !=""){
                strForm=reader.optString("inspectionFormsObj");
            }
            // GET FORM FROM PARENT UNIT
            if(strForm ==null || strForm=="null"){
                if(strUseParentFormValue!=null){
                    if(strUseParentFormValue.equals("1") || strUseParentFormValue.toLowerCase().equals("true")){
                        Units pUnit=Globals.selectedUnit.getParentUnit();
                        if(pUnit!=null){
                            JSONObject readerParent=pUnit.getJoFormData();
                            if(readerParent.optString("inspectionFormsObj","") !=""){
                                strForm=readerParent.optString("inspectionFormsObj");
                            }
                        }
                    }
                }
            }
            if(strForm.equals("null")){
                tvUnitTitle.setText("");
                rootLayout.setVisibility(View.GONE);
                return;
            }
            if(!strForm.equals("")){
                assetTypeForm=new JSONObject(strForm);
                btnSubmit.setVisibility(View.VISIBLE);
                rootLayout.setVisibility(View.VISIBLE);
            }

            if(reader.toString().equals("{}")){
                btnSubmit.setVisibility(View.GONE);
                tvUnitTitle.setText("");
                rootLayout.setVisibility(View.GONE);
            }
            //reader = new JSONObject(JSON_TEXT);
            if(assetTypeForm == null){
                tvUnitTitle.setText("");
                rootLayout.setVisibility(View.GONE);
                return;
            }
            String uTitle= assetTypeForm.optString("name","");
            if(uTitle.equals("")){
                return;
            }
            JSONObject joHeadings = assetTypeForm.optJSONObject("headings");
            if(joHeadings == null){
                joHeadings = new JSONObject();
                joHeadings.put("visible", true);
                joHeadings.put("field1", "Performed?");
                joHeadings.put("field2", "         ");
                joHeadings.put("field3", "Yes/No?");
            }

            tvUnitTitle.setText(uTitle);
            JSONArray fieldsArray = assetTypeForm.getJSONArray("fields");
            for (int fieldIndex = 0; fieldIndex < fieldsArray.length(); fieldIndex++) {
                JSONObject joField = fieldsArray.getJSONObject(fieldIndex);
                String title = joField.getString("title");
                TextView tvTitle = new TextView(_context);
                tvTitle.setTextSize(19);
                tvTitle.setPadding(5, 5, 5, 5);
                tvTitle.setTypeface(null, Typeface.BOLD);
                tvTitle.setText(title);
                rootLayout.addView(tvTitle);
                JSONArray jaData = joField.getJSONArray("data");
                LinearLayout parent = new LinearLayout(_context);
                parent.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));
                parent.setOrientation(LinearLayout.VERTICAL);
                parent.setVerticalScrollBarEnabled(true);
                parent.setPadding(0, 0, 0, 15);
                LinearLayout headingLayout = new LinearLayout(_context);
                headingLayout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
                headingLayout.setOrientation(LinearLayout.HORIZONTAL);
                //headingLayout.setBackgroundColor(getResources().getColor(R.color.form_background));
                headingLayout.setWeightSum(2);
                TextView tvVerify = new TextView(_context);
                TextView tvMsg = new TextView(_context);
                TextView tvAnswer = new TextView(_context);
                tvVerify.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT, 0.5f));
                tvMsg.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT, 1.4f));
                tvAnswer.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT, 0.1f));
                /*if(title.equals("Switch")){
                    tvVerify.setText("");
                    tvMsg.setText("");
                    tvAnswer.setText("");
                } else {
                    tvVerify.setText(getString(R.string.performed));
                    tvMsg.setText(getString(R.string.yes_no));
                    tvAnswer.setText("");
                }*/
                tvVerify.setText(joHeadings.getString("field1"));
                tvMsg.setText(joHeadings.getString("field2"));
                tvAnswer.setText(joHeadings.optString("field3", ""));

                tvVerify.setTypeface(null, Typeface.BOLD);
                tvMsg.setTypeface(null, Typeface.BOLD);
                tvAnswer.setTypeface(null, Typeface.BOLD);
                tvVerify.setTextSize(11);
                tvAnswer.setTextSize(11);
                tvMsg.setTextSize(11);
                //tvVerify.setPadding(getDp(5),0,0,0);
                headingLayout.addView(tvVerify);
                headingLayout.addView(tvMsg);
                headingLayout.addView(tvAnswer);
                GradientDrawable gd = new GradientDrawable();
                gd.setColor(_context.getResources().getColor(R.color.form_background)); // Changes this drawbale to use a single color instead of a gradient
                gd.setCornerRadius(5);
                gd.setStroke(1, 0xFF000000);
                headingLayout.setBackgroundDrawable(gd);
                if(joHeadings.getBoolean("visible")){
                    rootLayout.addView(headingLayout);
                }


                // parent.setWeightSum(2);
                for (int dataIndex = 0; dataIndex < jaData.length(); dataIndex++) {
                    JSONObject joData = jaData.getJSONObject(dataIndex);
                    JSONArray jaElements = joData.getJSONArray("elements");
                    LinearLayout subParent = new LinearLayout(_context);
                    subParent.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
                    subParent.setOrientation(LinearLayout.HORIZONTAL);
                    //subParent.setBackgroundColor(getResources().getColor(R.color.form_background));
                    subParent.setWeightSum(2);
                    for (int eleIndex = 0; eleIndex < jaElements.length(); eleIndex++) {
                        final JSONObject joElement = jaElements.getJSONObject(eleIndex);
                        switch (joElement.getString("type")) {
                            // For new form changes req by Joe Denny
                            case "TEXT":
                                TextView tvHeading = new TextView(_context);
                                tvHeading.setText(joElement.getString("description"));
                                LinearLayout.LayoutParams Idparams = new LinearLayout.LayoutParams(
                                        LinearLayout.LayoutParams.WRAP_CONTENT,
                                        LinearLayout.LayoutParams.WRAP_CONTENT, 0.5f
                                );
                                Idparams.setMargins(0,0,0, getDp(10));
                                tvHeading.setLayoutParams(Idparams);
                                //textView1.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.MATCH_PARENT, 1));
                                subParent.addView(tvHeading);
                                break;
                            case "EDITBOX-ID":
                                EditText etID = new EditText(_context);
                                LinearLayout.LayoutParams editIdBoxParams = new LinearLayout.LayoutParams(
                                        LinearLayout.LayoutParams.WRAP_CONTENT,
                                        LinearLayout.LayoutParams.WRAP_CONTENT, 0.5f
                                );
                                editIdBoxParams.setMargins(0,0,0, getDp(10));
                                etID.setLayoutParams(editIdBoxParams);
                                etID.setTag(joElement.getString("tag"));
                                idMap.add(joElement.getString("tag"));
                                etID.setText(joElement.getString("description"));
                                subParent.addView(etID);
                                break;
                            case "EDITBOX":
                                EditText etDescription = new EditText(_context);
                                LinearLayout.LayoutParams editBoxParams = new LinearLayout.LayoutParams(
                                        LinearLayout.LayoutParams.WRAP_CONTENT,
                                        LinearLayout.LayoutParams.WRAP_CONTENT, 1.5f
                                );
                                editBoxParams.setMargins(0,0,0, getDp(10));
                                etDescription.setLayoutParams(editBoxParams);
                                etDescription.setTag(joElement.getString("tag"));
                                idMap.add(joElement.getString("tag"));
                                etDescription.setText(joElement.getString("description"));
                                subParent.addView(etDescription);
                                break;

                            case "BOOLEAN_CHECKBOX":
                                CheckBox checkBox = new CheckBox(_context);
                                LinearLayout.LayoutParams checkBoxParam = new LinearLayout.LayoutParams(
                                        LinearLayout.LayoutParams.WRAP_CONTENT,
                                        LinearLayout.LayoutParams.WRAP_CONTENT, 0.5f
                                );
                                //checkBoxParam.setMargins(0,0,getDp(10), 0);
                                checkBox.setLayoutParams(checkBoxParam);
                                checkBox.setPadding(0,0,getDp(30), 0);
                                checkBox.setTag(joElement.getString("tag"));
                                idMap.add(joElement.getString("tag"));
                                checkBox.setEnabled(!getSelectedTask().getStatus().equals(TASK_FINISHED_STATUS));
                                subParent.addView(checkBox);
                                break;
                            case "STRING":
                                TextView textView1 = new TextView(_context);
                                textView1.setText(joElement.getString("description"));
                                LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                                        LinearLayout.LayoutParams.WRAP_CONTENT,
                                        LinearLayout.LayoutParams.WRAP_CONTENT, 1
                                );
                                params.setMargins(0,0,0, getDp(10));
                                textView1.setLayoutParams(params);
                                //textView1.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.MATCH_PARENT, 1));
                                subParent.addView(textView1);

                                break;
                            case "BOOLEAN_SWITCH":
                                Switch switch1 = new Switch(_context);
                                Boolean dValue = joElement.getBoolean("defaultValue");
                                switch1.setChecked(dValue);
                                switch1.setTextOn("Y");
                                switch1.setTextOff("N");
                                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                                    switch1.setShowText(true);
                                }
                                LinearLayout.LayoutParams switchParam = new LinearLayout.LayoutParams(
                                        LinearLayout.LayoutParams.WRAP_CONTENT,
                                        LinearLayout.LayoutParams.WRAP_CONTENT, 0.5f
                                );
                                //switchParam.setMargins(getDp(10),0,0, 0);
                                switch1.setLayoutParams(switchParam);
                                switch1.setPadding(getDp(27),0,0,0);
                                //switch1.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT, 0.5f));
                                switch1.setTag(joElement.getString("tag"));
                                switch1.setEnabled(!getSelectedTask().getStatus().equals(TASK_FINISHED_STATUS));
                                subParent.addView(switch1);
                                switch1.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
                                    public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                                        try {
                                            String cbTag = joElement.getString("tag").replace("sw", "cb");
                                            CheckBox cbMark = rootView.findViewWithTag(cbTag);
                                            if (isChecked) {
                                                cbMark.setChecked(true);
                                            } else {
                                                cbMark.setChecked(false);
                                            }
                                        } catch (JSONException e) {
                                            e.printStackTrace();
                                        }
                                    }
                                });
                                break;
                        }
                    }
                    parent.addView(subParent);
                    View v = new View(_context);
                    v.setLayoutParams(new LinearLayout.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            5
                    ));
                    v.setBackgroundColor(Color.WHITE);
                    parent.addView(v);
                }
                rootLayout.addView(parent);
                rootLayout.invalidate();
            }
            try {
                if (!getSelectedTask().getStatus().equals(TASK_FINISHED_STATUS)) {
                    rootLayout.addView(btnSubmit);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        //rootLayout.addView(btnSet);
        if(Globals.selectedUnit.getSelection()!= null && Globals.selectedUnit.getSelection().size()>0){
            setFormState(rootView);
        }
    }
    public void setFormState(View view){
        for(Map.Entry<String, String> e: Globals.selectedUnit.getSelection().entrySet()){
            //for (String key : Globals.selectedUnit.getSelection().keySet()) {
            String[] tags = e.getKey().split("-");
            if(tags[0].equals("etId")){
                EditText etId = (EditText) view.findViewWithTag(e.getKey());
                etId.setText(e.getValue());
            } else if (tags[0].equals("etDesc")){
                EditText etDesc = (EditText) view.findViewWithTag(e.getKey());
                etDesc.setText(e.getValue());
            } else if(tags[0].equals("sw")){
                //if (Globals.selectedUnit.getSelection().get(key)) {}
                String _checkboxTxt = e.getKey().replace("sw", "cb");
                CheckBox _checkbox = (CheckBox) view.findViewWithTag(_checkboxTxt);
                if (e.getKey() != null) {
                    _checkbox.setChecked(true);
                    Switch _switch = (Switch) view.findViewWithTag(e.getKey());
                    _switch.setChecked(Boolean.valueOf(e.getValue()));
                }
            }
            //}
        }
    }
    public int getDp(int size){
        Resources r = _context.getResources();
        return (int) TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP,
                size,
                r.getDisplayMetrics()
        );
    }

    public void refreshView() {
        //THIS IS THE CODE TO REFRESH THE FRAGMENT.
        FragmentManager manager = getActivity().getSupportFragmentManager();
        FragmentTransaction ft = manager.beginTransaction();
        Fragment newFragment = this;
        this.onDestroy();
        ft.remove(this);
        ft.replace(R.id.container, newFragment);
        //container is the ViewGroup of current fragment
        ft.addToBackStack(null);
        ft.commit();
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
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

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnFragmentInteractionListener {
        // TODO: Update argument type and name
        void onFragmentInteraction(Uri uri);
    }
}
