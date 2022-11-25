package com.app.ps19.tipsapp.classes.equipment;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.DialogFragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.app.ps19.tipsapp.R;
import com.app.ps19.tipsapp.unitsGroup.EquAttributeRecyclerAdapter;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class EquipmentDialogFragment extends DialogFragment {
    RecyclerView recyclerView;
    EquAttributeRecyclerAdapter adapter;
    private Context context;
    private ArrayList<EquipmentAttributes> attributes;
    private Button btnDone;

    public EquipmentDialogFragment(ArrayList<EquipmentAttributes> attributes) {
        this.attributes=attributes;
    }

    @NonNull
    @Override
    public Dialog onCreateDialog(@Nullable Bundle savedInstanceState) {


        if (getArguments() != null) {
            if (getArguments().getBoolean("notAlertDialog")) {
                return super.onCreateDialog(savedInstanceState);
            }
        }
        context=getActivity();
        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        builder.setTitle("Alert Dialog");
        builder.setMessage("Alert Dialog inside DialogFragment");

        builder.setPositiveButton("Ok", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dismiss();
            }
        });

        builder.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dismiss();
            }
        });

        return builder.create();

    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view=inflater.inflate(R.layout.fragment_equipment_dialog, container, false);
        btnDone=view.findViewById(R.id.btnDone);
        recyclerView=view.findViewById(R.id.recycler_attributeList);
        recyclerView.setLayoutManager(new LinearLayoutManager(getActivity()));

        this.context=getActivity();
        adapter=new EquAttributeRecyclerAdapter(getActivity(),attributes);
        recyclerView.setAdapter(adapter);
        btnDone.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dismiss();
            }
        });
        return view;

    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);


 /*       final EditText editText = view.findViewById(R.id.inEmail);

        if (getArguments() != null && !TextUtils.isEmpty(getArguments().getString("email")))
            editText.setText(getArguments().getString("email"));

        Button btnDone = view.findViewById(R.id.btnDone);
        btnDone.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                DialogListener dialogListener = (DialogListener) getActivity();
                dialogListener.onFinishEditDialog(editText.getText().toString());
                dismiss();
            }
        });*/
    }

    @Override
    public void onResume() {
        super.onResume();

    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);



        boolean setFullScreen = false;
        if (getArguments() != null) {
            setFullScreen = getArguments().getBoolean("fullScreen");
        }

        if (setFullScreen)
            setStyle(DialogFragment.STYLE_NORMAL, android.R.style.Theme_Black_NoTitleBar_Fullscreen);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
    }

    public void setAttributeList(ArrayList<EquipmentAttributes> attributes) {
        if(context!=null){
            //adapter=new EquAttributeRecyclerAdapter(context,attributes);
            adapter.setAttributesData(attributes);
            adapter.notifyDataSetChanged();


            //adapter.setAttributesData(attributes);
        }

    }

    public interface DialogListener {
        void onFinishEditDialog(String inputText);
    }


}
