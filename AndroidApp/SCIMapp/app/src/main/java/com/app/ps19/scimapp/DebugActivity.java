package com.app.ps19.scimapp;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import com.app.ps19.scimapp.Shared.Globals;

import java.util.ArrayList;

public class DebugActivity extends AppCompatActivity {
    Button btnNullCheck;
    Button btnArrayIndex;
    Button btnNumberFormat;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_debug);
        btnNullCheck = findViewById(R.id.btn_null);
        btnArrayIndex = findViewById(R.id.btn_array);
        btnNumberFormat = findViewById(R.id.btn_number);

        btnNullCheck.setOnClickListener(v -> {
            performNullCheck();
        });
        btnArrayIndex.setOnClickListener(v -> {
            performArrayIndex();
        });
        btnNumberFormat.setOnClickListener(v -> {
            performNumberFormat();
        });

    }

    private void performNumberFormat() {
        int num = Integer.parseInt ("testing");
    }

    private void performArrayIndex() {
        ArrayList<String> something = new ArrayList<>();
        something.add("something");
        String test = something.get(3);
    }

    private void performNullCheck() {
        String something = null;
        something.equals("");
    }

}