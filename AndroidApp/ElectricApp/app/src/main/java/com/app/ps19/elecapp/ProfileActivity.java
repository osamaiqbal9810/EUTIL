package com.app.ps19.elecapp;

import static com.app.ps19.elecapp.Shared.Globals.addUpdateUserImgName;
import static com.app.ps19.elecapp.Shared.Globals.isInternetAvailable;
import static com.app.ps19.elecapp.Shared.Globals.selectedJPlan;
import static com.app.ps19.elecapp.Shared.Globals.uploadMultipartImage;
import static com.app.ps19.elecapp.Shared.Globals.user;
import static com.app.ps19.elecapp.Shared.Utilities.getImgPath;

import android.Manifest;
import android.app.Activity;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.provider.Settings;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import com.app.ps19.elecapp.Shared.Globals;
import com.app.ps19.elecapp.Shared.StaticListItem;
import com.app.ps19.elecapp.classes.IssueImage;
import com.bumptech.glide.Glide;
import com.karumi.dexter.Dexter;
import com.karumi.dexter.MultiplePermissionsReport;
import com.karumi.dexter.PermissionToken;
import com.karumi.dexter.listener.PermissionRequest;
import com.karumi.dexter.listener.multi.MultiplePermissionsListener;
import com.mikhaellopez.circularimageview.CircularImageView;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;

public class ProfileActivity extends AppCompatActivity {
    private static final int REQ_CODE_SIGNATURE = 1;
    public static final int REQUEST_IMAGE = 100;
    private static final String TAG = "Profile Activity";

    TextView tvMName;
    TextView tvMEmail;
    RelativeLayout rlBackBtn;
    TextView tvName;
    TextView tvEmail;
    TextView tvMobile;
    TextView tvPhone;
    ImageView ivPassEdit;
    ImageView ivPerson;
    ImageView ivSigEdit;
    ImageView ivSigThumb;
    TextView tvSignature;
    IssueImage sigImage = new IssueImage("",0,"");
    IssueImage profImage = new IssueImage("",0,"");
    Popup popup;
    CircularImageView imgAdd;
    IssueImage preSigImg = new IssueImage("",0,"");
    IssueImage preProImg = new IssueImage("",0,"");
    ProgressDialog dialog =null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        tvMName = findViewById(R.id.tv_name_main);
        tvMEmail = findViewById(R.id.tv_email_main);
        rlBackBtn = findViewById(R.id.rl_back_button);
        tvName = findViewById(R.id.tv_name);
        tvEmail = findViewById(R.id.tv_email);
        tvMobile = findViewById(R.id.tv_mobile);
        tvPhone = findViewById(R.id.tv_phone);
        ivPassEdit = findViewById(R.id.iv_password_edit);
        ivPerson = findViewById(R.id.img_profile);
        ivSigEdit = findViewById(R.id.iv_signature_edit);
        tvSignature = findViewById(R.id.tv_signature);
        imgAdd = findViewById(R.id.img_plus);
        dialog=new ProgressDialog(this);
        /*ivSigThumb = findViewById(R.id.iv_signature_thumb);*/

        //setUserInfoView(ProfileActivity.this,ivPerson, null);
        if(user.getProfImg()!=null){
            if(user.getProfImg().getImgName().equals("")){
                loadProfileDefault();
            } else {
                preProImg = user.getProfImg();
                loadProfile(getImgPath(user.getProfImg().getImgName()));
            }
        } else {
            loadProfileDefault();
        }
        // ButterKnife.bind(this);

        // Clearing older images from cache directory
        // don't call this line if you want to choose multiple images in the same activity
        // call this once the bitmap(s) usage is over
        ImagePickerActivity.clearCache(this);


        if(user.getSignature()==null){
            tvSignature.setText("N/A");
        } else {
            preSigImg = user.getSignature();
            tvSignature.setText(getString(R.string.view));
        }
        tvMName.setText(user.getName());
        tvMEmail.setText(user.getEmail());
        tvName.setText(user.getName());
        tvEmail.setText(user.getEmail());
        tvMobile.setText(user.getMobileNumber());
        tvPhone.setText(user.getPhoneNumber());

        /*if(selectedJPlan == null){
            imgAdd.setVisibility(GONE);
            ivSigEdit.setVisibility(GONE);
        } else {
            imgAdd.setVisibility(VISIBLE);
            ivSigEdit.setVisibility(VISIBLE);
        }*/

        ivPassEdit.setOnClickListener(view -> {
            if(isInternetAvailable(ProfileActivity.this)){
                Intent intent = new Intent(ProfileActivity.this, UpdatePasswordActivity.class);
                startActivity(intent);
            } else {
                Toast.makeText(ProfileActivity.this, R.string.please_connect_server, Toast.LENGTH_SHORT).show();
            }
        });
        rlBackBtn.setOnClickListener(view -> {
            saveAndExitActivity();
        });
        imgAdd.setOnClickListener(this::onProfileImageClick);
        tvSignature.setOnClickListener(view -> {
            if(user.getSignature()!= null){
                popup = new Popup(ProfileActivity.this, getImgPath(user.getSignature().getImgName()), 0, user.getSignature().getImgName());
                popup.setCancelable(true);
                popup.show();
            }
        });
        ivSigEdit.setOnClickListener(view -> {
            if(selectedJPlan != null || isInternetAvailable(ProfileActivity.this)){
                Globals.imageFileName = "";
                Intent intent = new Intent(ProfileActivity.this, ScribbleNotesActivity.class);
                Bundle b=new Bundle();
                b.putString("filename","");
                startActivityForResult(intent,REQ_CODE_SIGNATURE);
            } else {
                Toast.makeText(ProfileActivity.this, R.string.please_connect_server, Toast.LENGTH_SHORT).show();
            }

        });
        //ivSigEdit.setVisibility(View.GONE);
    }

    private void saveAndExitActivity(){
        if(sigImage.getImgName().equals("") && profImage.getImgName().equals("")){
            finish();
            return;
        }

        if(!preProImg.getImgName().equals(profImage.getImgName())){
            showConfirmationDialog();
            return;
        }
        if(!preSigImg.getImgName().equals(sigImage.getImgName())){
            showConfirmationDialog();
            return;
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        switch(keyCode){
            case KeyEvent.KEYCODE_BACK:
                saveAndExitActivity();
                return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {

        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQ_CODE_SIGNATURE) {
            if (resultCode == Activity.RESULT_OK) {
                String result = data.getStringExtra("result");
                if (result.equals("Taken")) {
                    sigImage.setImgName(Globals.imageFileName);
                    //user.setSignature(sigImage);
                    Globals.imageFileName = "";
                    tvSignature.setText(getString(R.string.view));
                    user.setSignature(sigImage);
                    if(selectedJPlan==null && isInternetAvailable(ProfileActivity.this)){
                        if(!sigImage.getImgName().equals(preSigImg.getImgName())){
                            if(!sigImage.getImgName().equals("")){
                                showProgressDialog("Uploading", "Signature\nPlease wait...");
                                new Thread(new Runnable() {
                                    @Override
                                    public void run() {
                                        if(uploadMultipartImage(sigImage.getImgName())){
                                            if(addUpdateUserImgName(sigImage,"signature")){
                                                ProfileActivity.this.runOnUiThread(new Runnable() {
                                                    @Override
                                                    public void run() {
                                                        sigImage = initImgObj();
                                                        hideProgressDialog();
                                                    }});
                                            } else {
                                                ProfileActivity.this.runOnUiThread(new Runnable() {
                                                    @Override
                                                    public void run() {
                                                        hideProgressDialog();
                                                        Toast.makeText(ProfileActivity.this, "Uploading signature failed. \nPlease try again!", Toast.LENGTH_SHORT).show();
                                                    }});
                                            }
                                        } else {
                                            ProfileActivity.this.runOnUiThread(new Runnable() {
                                                @Override
                                                public void run() {
                                                    hideProgressDialog();
                                                    Toast.makeText(ProfileActivity.this, "Uploading signature failed. \nPlease try again!", Toast.LENGTH_SHORT).show();
                                                }});
                                        }
                                    }}).start();;
                            }
                        }
                        updateUserInDb();
                    }
                }
            }
        }
        if (requestCode == REQUEST_IMAGE) {
            if (resultCode == Activity.RESULT_OK) {
                Uri uri = data.getParcelableExtra("path");
                try {
                    // You can update this bitmap to your server
                    Bitmap bitmap = MediaStore.Images.Media.getBitmap(this.getContentResolver(), uri);

                    // loading profile image from local cache
                    loadProfile(uri.toString());
                    profImage.setImgName(uri.getLastPathSegment());
                    user.setProfImg(profImage);

                    copy(new File(uri.getPath()), new File(getImgPath(uri.getLastPathSegment()) ));
                    if(selectedJPlan==null && isInternetAvailable(ProfileActivity.this)){
                        if(!profImage.getImgName().equals(preProImg.getImgName())){
                            if(!profImage.getImgName().equals("")){
                                showProgressDialog("Uploading", "Profile photo \nPlease wait...");
                                new Thread(new Runnable() {
                                    @Override
                                    public void run() {
                                        if(uploadMultipartImage(profImage.getImgName())){
                                            if(addUpdateUserImgName(profImage,"profile_img")){
                                                ProfileActivity.this.runOnUiThread(new Runnable() {
                                                    @Override
                                                    public void run() {
                                                        profImage = initImgObj();
                                                        hideProgressDialog();
                                                    }});
                                            } else {
                                                ProfileActivity.this.runOnUiThread(new Runnable() {
                                                    @Override
                                                    public void run() {
                                                        hideProgressDialog();
                                                        Toast.makeText(ProfileActivity.this, "Uploading profile photo failed. \nPlease try again!", Toast.LENGTH_SHORT).show();
                                                    }});
                                            }
                                        } else {
                                            ProfileActivity.this.runOnUiThread(new Runnable() {
                                                @Override
                                                public void run() {
                                                    hideProgressDialog();
                                                    Toast.makeText(ProfileActivity.this, "Uploading profile photo failed. \nPlease try again!", Toast.LENGTH_SHORT).show();
                                                }});
                                        }


                                    }}).start();;
                            }
                        }
                        updateUserInDb();
                    }

                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
    public static void copy(File src, File dst) throws IOException {
        InputStream in = new FileInputStream(src);
        try {
            OutputStream out = new FileOutputStream(dst);
            try {
                // Transfer bytes from in to out
                byte[] buf = new byte[1024];
                int len;
                while ((len = in.read(buf)) > 0) {
                    out.write(buf, 0, len);
                }
            } finally {
                out.close();
            }
        } finally {
            in.close();
        }
    }
    /*Image picker related code*/
    private void loadProfile(String url) {
        Log.d(TAG, "Image cache path: " + url);

        Glide.with(this).load(url)
                .into(ivPerson);
        ivPerson.setColorFilter(ContextCompat.getColor(this, android.R.color.transparent));
    }

    private void loadProfileDefault() {
        Glide.with(this).load(R.drawable.baseline_account_circle_black_48)
                .into(ivPerson);
        ivPerson.setColorFilter(ContextCompat.getColor(this, R.color.profile_default_tint));
    }

    public void onProfileImageClick(View view) {
        if(selectedJPlan != null || isInternetAvailable(ProfileActivity.this)){
            Dexter.withActivity(this)
                    .withPermissions(Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                    .withListener(new MultiplePermissionsListener() {
                        @Override
                        public void onPermissionsChecked(MultiplePermissionsReport report) {
                            if (report.areAllPermissionsGranted()) {
                                showImagePickerOptions();
                            }

                            if (report.isAnyPermissionPermanentlyDenied()) {
                                showSettingsDialog();
                            }
                        }

                        @Override
                        public void onPermissionRationaleShouldBeShown(List<PermissionRequest> permissions, PermissionToken token) {
                            token.continuePermissionRequest();
                        }
                    }).check();
        } else {
            Toast.makeText(ProfileActivity.this, R.string.please_connect_server, Toast.LENGTH_SHORT).show();
        }

    }

    private void showImagePickerOptions() {
        ImagePickerActivity.showImagePickerOptions(this, new ImagePickerActivity.PickerOptionListener() {
            @Override
            public void onTakeCameraSelected() {
                launchCameraIntent();
            }

            @Override
            public void onChooseGallerySelected() {
                launchGalleryIntent();
            }
        });
    }

    private void launchCameraIntent() {
        Intent intent = new Intent(ProfileActivity.this, ImagePickerActivity.class);
        intent.putExtra(ImagePickerActivity.INTENT_IMAGE_PICKER_OPTION, ImagePickerActivity.REQUEST_IMAGE_CAPTURE);

        // setting aspect ratio
        intent.putExtra(ImagePickerActivity.INTENT_LOCK_ASPECT_RATIO, true);
        intent.putExtra(ImagePickerActivity.INTENT_ASPECT_RATIO_X, 1); // 16x9, 1x1, 3:4, 3:2
        intent.putExtra(ImagePickerActivity.INTENT_ASPECT_RATIO_Y, 1);

        // setting maximum bitmap width and height
        intent.putExtra(ImagePickerActivity.INTENT_SET_BITMAP_MAX_WIDTH_HEIGHT, true);
        intent.putExtra(ImagePickerActivity.INTENT_BITMAP_MAX_WIDTH, 1000);
        intent.putExtra(ImagePickerActivity.INTENT_BITMAP_MAX_HEIGHT, 1000);

        startActivityForResult(intent, REQUEST_IMAGE);
    }

    private void launchGalleryIntent() {
        Intent intent = new Intent(ProfileActivity.this, ImagePickerActivity.class);
        intent.putExtra(ImagePickerActivity.INTENT_IMAGE_PICKER_OPTION, ImagePickerActivity.REQUEST_GALLERY_IMAGE);

        // setting aspect ratio
        intent.putExtra(ImagePickerActivity.INTENT_LOCK_ASPECT_RATIO, true);
        intent.putExtra(ImagePickerActivity.INTENT_ASPECT_RATIO_X, 1); // 16x9, 1x1, 3:4, 3:2
        intent.putExtra(ImagePickerActivity.INTENT_ASPECT_RATIO_Y, 1);
        startActivityForResult(intent, REQUEST_IMAGE);
    }


    /**
     * Showing Alert Dialog with Settings option
     * Navigates user to app settings
     * NOTE: Keep proper title and message depending on your app
     */
    private void showSettingsDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(ProfileActivity.this);
        builder.setTitle(getString(R.string.dialog_permission_title));
        builder.setMessage(getString(R.string.dialog_permission_message));
        builder.setPositiveButton(getString(R.string.go_to_settings), (dialog, which) -> {
            dialog.cancel();
            ProfileActivity.this.openSettings();
        });
        builder.setNegativeButton(getString(android.R.string.cancel), (dialog, which) -> dialog.cancel());
        builder.show();

    }

    // navigating user to app settings
    private void openSettings() {
        Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        Uri uri = Uri.fromParts("package", getPackageName(), null);
        intent.setData(uri);
        startActivityForResult(intent, 101);
    }
    void showConfirmationDialog() {
        android.app.AlertDialog alertDialog = new android.app.AlertDialog.Builder(this)
                //set icon
                .setIcon(android.R.drawable.ic_dialog_alert)
                //set title
                .setTitle(getString(R.string.title_warning))
                //set message
                .setMessage(getString(R.string.message_save_changes))
                //set positive button
                .setPositiveButton(getString(R.string.briefing_yes), (dialogInterface, i) -> {
                    if(selectedJPlan!= null){
                        if(!profImage.getImgName().equals(preProImg.getImgName())){
                            if(!profImage.getImgName().equals("")){
                                user.setProfImg(profImage);
                            }
                        }
                        if(!sigImage.getImgName().equals(preSigImg.getImgName())){
                            if(!sigImage.getImgName().equals("")){
                                user.setSignature(sigImage);
                            }
                        }
                        selectedJPlan.update();
                        updateUserInDb();
                    }
                    finish();
                })
                //set negative button
                .setNegativeButton(getString(R.string.briefing_no), (dialogInterface, i) -> finish()).setNeutralButton(getString(R.string.btn_cancel), new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                    }
                })
                .show();
    }
    void showProgressDialog(String title,String message){
        dialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
        dialog.setTitle(title);
        dialog.setMessage(message);
        dialog.setIndeterminate(true);
        dialog.setCanceledOnTouchOutside(false);
        dialog.show();
    }
    void hideProgressDialog(){
        if(dialog!=null){
            if(dialog.isShowing()){
                dialog.dismiss();
            }
        }
    }
    private void updateUserInDb(){
        List<StaticListItem> items= Globals.db.getListItems("user","","1");
        if(items.size() == 1){//current user
            String strParm2 = items.get(0).getOptParam2();
            JSONObject jo= null;
            try {
                boolean updated = false;
                jo = new JSONObject(strParm2);
                if(jo.optJSONObject("profile_img")!= null && !profImage.getImgName().equals("")){
                    profImage.setChangeOnly(false);
                    JSONObject joImg = profImage.getJsonObject();
                    jo.put("profile_img", joImg);
                    updated = true;
                }
                if(jo.optJSONObject("signature")!= null && !sigImage.getImgName().equals("")){
                    sigImage.setChangeOnly(false);
                    JSONObject joImg = sigImage.getJsonObject();
                    jo.put("signature", joImg);
                    updated = true;
                }
                if(updated) {
                    items.get(0).setOptParam2(jo.toString());
                    Globals.db.AddOrUpdateList("user", "", items.get(0));
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }
    private IssueImage initImgObj (){
        return new IssueImage("",0,"");
    }
}