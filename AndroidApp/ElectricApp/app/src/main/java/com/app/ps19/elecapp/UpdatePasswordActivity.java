package com.app.ps19.elecapp;

import static com.app.ps19.elecapp.Shared.Globals.isInternetAvailable;
import static com.app.ps19.elecapp.Shared.Globals.lastWsReturnCode;
import static com.app.ps19.elecapp.Shared.Globals.setLocale;
import static com.app.ps19.elecapp.Shared.Globals.updatePassword;

import android.content.res.ColorStateList;
import android.graphics.PorterDuff;
import android.os.Build;
import android.os.Bundle;
import android.text.method.HideReturnsTransformationMethod;
import android.text.method.PasswordTransformationMethod;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class UpdatePasswordActivity extends AppCompatActivity {

    private EditText etOldPassword;
    private EditText etNewPassword;
    private EditText etRepeatPassword;
    private Button btUpdate;
    ProgressBar loadingProgressBar;
    LinearLayout llContainer;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_change_password);
        setLocale(this);
        etOldPassword = findViewById(R.id.et_old_password);
        etNewPassword = findViewById(R.id.et_new_password);
        etRepeatPassword = findViewById(R.id.et_new_password_again);
        btUpdate = findViewById(R.id.btn_change_password);
        loadingProgressBar = findViewById(R.id.loading);
        llContainer = findViewById(R.id.ll_container);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        setTitle(R.string.title_activity_change_password);

        btUpdate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                loadingProgressBar.setVisibility(View.VISIBLE);
                llContainer.setVisibility(View.GONE);
                if(!isInternetAvailable(UpdatePasswordActivity.this)){
                    Toast.makeText(UpdatePasswordActivity.this, getString(R.string.please_connect_server), Toast.LENGTH_SHORT).show();
                    showContainerAndHideProgress();
                    return;
                }
                if(etOldPassword.getText().toString().equals("")){
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        etOldPassword.setBackgroundTintList(ColorStateList.valueOf(getResources().getColor(R.color.cancel_btn_background)));
                    } else {
                        etOldPassword.getBackground().setColorFilter(getResources().getColor(R.color.cancel_btn_background), PorterDuff.Mode.SRC_ATOP);
                    }
                    Toast.makeText(UpdatePasswordActivity.this, getString(R.string.old_password_failed), Toast.LENGTH_SHORT).show();
                    etOldPassword.requestFocusFromTouch();
                    showContainerAndHideProgress();
                    return;
                } else if(etNewPassword.getText().toString().equals("")){
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        etNewPassword.setBackgroundTintList(ColorStateList.valueOf(getResources().getColor(R.color.cancel_btn_background)));
                    } else {
                        etNewPassword.getBackground().setColorFilter(getResources().getColor(R.color.cancel_btn_background), PorterDuff.Mode.SRC_ATOP);
                    }
                    Toast.makeText(UpdatePasswordActivity.this, getString(R.string.new_password_failed), Toast.LENGTH_SHORT).show();
                    etNewPassword.requestFocusFromTouch();
                    showContainerAndHideProgress();
                    return;
                } else if(etRepeatPassword.getText().toString().equals("")){
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        etRepeatPassword.setBackgroundTintList(ColorStateList.valueOf(getResources().getColor(R.color.cancel_btn_background)));
                    } else {
                        etRepeatPassword.getBackground().setColorFilter(getResources().getColor(R.color.cancel_btn_background), PorterDuff.Mode.SRC_ATOP);
                    }
                    Toast.makeText(UpdatePasswordActivity.this, getString(R.string.confirm_password_failed), Toast.LENGTH_SHORT).show();
                    etRepeatPassword.requestFocusFromTouch();
                    showContainerAndHideProgress();
                    return;
                }
                if(!isPasswordValid(etOldPassword.getText().toString())){
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        etOldPassword.setBackgroundTintList(ColorStateList.valueOf(getResources().getColor(R.color.cancel_btn_background)));
                    } else {
                        etOldPassword.getBackground().setColorFilter(getResources().getColor(R.color.cancel_btn_background), PorterDuff.Mode.SRC_ATOP);
                    }
                    Toast.makeText(UpdatePasswordActivity.this, getString(R.string.more_characters_req), Toast.LENGTH_SHORT).show();
                    etOldPassword.requestFocusFromTouch();
                    showContainerAndHideProgress();
                    return;
                } else {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        etOldPassword.setBackgroundTintList(ColorStateList.valueOf(getResources().getColor(R.color.btn_color_primary)));
                    } else {
                        etOldPassword.getBackground().setColorFilter(getResources().getColor(R.color.btn_color_primary), PorterDuff.Mode.SRC_ATOP);
                    }
                }
                if(!isPasswordValid(etNewPassword.getText().toString())){
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        etNewPassword.setBackgroundTintList(ColorStateList.valueOf(getResources().getColor(R.color.cancel_btn_background)));
                    } else {
                        etNewPassword.getBackground().setColorFilter(getResources().getColor(R.color.cancel_btn_background), PorterDuff.Mode.SRC_ATOP);
                    }
                    etNewPassword.requestFocusFromTouch();
                    showContainerAndHideProgress();
                    Toast.makeText(UpdatePasswordActivity.this, getString(R.string.more_characters_req), Toast.LENGTH_SHORT).show();
                    return;
                } else {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        etNewPassword.setBackgroundTintList(ColorStateList.valueOf(getResources().getColor(R.color.btn_color_primary)));
                    } else {
                        etNewPassword.getBackground().setColorFilter(getResources().getColor(R.color.btn_color_primary), PorterDuff.Mode.SRC_ATOP);
                    }
                }
                if(!isPasswordValid(etRepeatPassword.getText().toString())){
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        etRepeatPassword.setBackgroundTintList(ColorStateList.valueOf(getResources().getColor(R.color.cancel_btn_background)));
                    } else {
                        etRepeatPassword.getBackground().setColorFilter(getResources().getColor(R.color.cancel_btn_background), PorterDuff.Mode.SRC_ATOP);
                    }
                    etRepeatPassword.requestFocusFromTouch();
                    showContainerAndHideProgress();
                    Toast.makeText(UpdatePasswordActivity.this, getString(R.string.more_characters_req), Toast.LENGTH_SHORT).show();
                    return;
                } else {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        etRepeatPassword.setBackgroundTintList(ColorStateList.valueOf(getResources().getColor(R.color.btn_color_primary)));
                    } else {
                        etRepeatPassword.getBackground().setColorFilter(getResources().getColor(R.color.btn_color_primary), PorterDuff.Mode.SRC_ATOP);
                    }
                }
                if(!etNewPassword.getText().toString().equals(etRepeatPassword.getText().toString())){
                    Toast.makeText(UpdatePasswordActivity.this, getString(R.string.password_do_not_match), Toast.LENGTH_SHORT).show();
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        etRepeatPassword.setBackgroundTintList(ColorStateList.valueOf(getResources().getColor(R.color.cancel_btn_background)));
                        etNewPassword.setBackgroundTintList(ColorStateList.valueOf(getResources().getColor(R.color.cancel_btn_background)));
                    } else {
                        etRepeatPassword.getBackground().setColorFilter(getResources().getColor(R.color.cancel_btn_background), PorterDuff.Mode.SRC_ATOP);
                        etNewPassword.getBackground().setColorFilter(getResources().getColor(R.color.cancel_btn_background), PorterDuff.Mode.SRC_ATOP);
                    }
                    etNewPassword.requestFocusFromTouch();
                    showContainerAndHideProgress();
                    return;
                }
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        if(updatePassword(UpdatePasswordActivity.this, etOldPassword.getText().toString(), etNewPassword.getText().toString())){
                            UpdatePasswordActivity.this.runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    showContainerAndHideProgress();
                                    Toast.makeText(UpdatePasswordActivity.this, getString(R.string.password_updated), Toast.LENGTH_SHORT).show();
                                    finish();
                                }
                            });

                        } else {
                            UpdatePasswordActivity.this.runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    showContainerAndHideProgress();
                                    if(lastWsReturnCode == 401){
                                        Toast.makeText(UpdatePasswordActivity.this, getString(R.string.Old_password_not_correct), Toast.LENGTH_SHORT).show();
                                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                                            etOldPassword.setBackgroundTintList(ColorStateList.valueOf(getResources().getColor(R.color.cancel_btn_background)));
                                        } else {
                                            etOldPassword.getBackground().setColorFilter(getResources().getColor(R.color.cancel_btn_background), PorterDuff.Mode.SRC_ATOP);
                                        }
                                        etOldPassword.requestFocusFromTouch();
                                    } else {
                                        Toast.makeText(UpdatePasswordActivity.this, getString(R.string.update_failed), Toast.LENGTH_SHORT).show();
                                    }
                                }
                            });
                        }}
                }).start();
            }
        });
    }
    @Override
    public boolean onSupportNavigateUp() {
        //code it to launch an intent to the activity you want
        finish();
        return true;
    }
    public void showHidePass(View view){
        if(view.getId()==R.id.iv_show_old_password){

            if(etOldPassword.getTransformationMethod().equals(PasswordTransformationMethod.getInstance())){
                ((ImageView)(view)).setImageResource(R.drawable.ic_baseline_visibility_24);

                //Show Password
                etOldPassword.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
            }
            else{
                ((ImageView)(view)).setImageResource(R.drawable.ic_baseline_visibility_off_24);

                //Hide Password
                etOldPassword.setTransformationMethod(PasswordTransformationMethod.getInstance());
            }
            etOldPassword.setSelection(etOldPassword.getText().length());
        } else if(view.getId() == R.id.iv_show_new_password){
            if(etNewPassword.getTransformationMethod().equals(PasswordTransformationMethod.getInstance())){
                ((ImageView)(view)).setImageResource(R.drawable.ic_baseline_visibility_24);

                //Show Password
                etNewPassword.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
            }
            else{
                ((ImageView)(view)).setImageResource(R.drawable.ic_baseline_visibility_off_24);

                //Hide Password
                etNewPassword.setTransformationMethod(PasswordTransformationMethod.getInstance());
            }
            etNewPassword.setSelection(etNewPassword.getText().length());
        } else if(view.getId() == R.id.iv_show_new_password_again){
            if(etRepeatPassword.getTransformationMethod().equals(PasswordTransformationMethod.getInstance())){
                ((ImageView)(view)).setImageResource(R.drawable.ic_baseline_visibility_24);

                //Show Password
                etRepeatPassword.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
            }
            else{
                ((ImageView)(view)).setImageResource(R.drawable.ic_baseline_visibility_off_24);

                //Hide Password
                etRepeatPassword.setTransformationMethod(PasswordTransformationMethod.getInstance());
            }
            etRepeatPassword.setSelection(etRepeatPassword.getText().length());
        }
    }

    private void showContainerAndHideProgress(){
        loadingProgressBar.setVisibility(View.GONE);
        llContainer.setVisibility(View.VISIBLE);
    }

    private boolean isPasswordValid(String password) {
        return password != null && password.trim().length() > 5;
    }
}