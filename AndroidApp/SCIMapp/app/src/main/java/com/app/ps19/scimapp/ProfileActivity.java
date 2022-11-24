package com.app.ps19.scimapp;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import android.Manifest;
import android.app.Activity;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.media.Image;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.provider.Settings;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.classes.IssueImage;
import com.app.ps19.scimapp.safetyBriefing.WorkerAddActivity;
import com.bumptech.glide.Glide;
import com.karumi.dexter.Dexter;
import com.karumi.dexter.MultiplePermissionsReport;
import com.karumi.dexter.PermissionToken;
import com.karumi.dexter.listener.PermissionRequest;
import com.karumi.dexter.listener.multi.MultiplePermissionsListener;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.channels.FileChannel;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

import static com.app.ps19.scimapp.Shared.Globals.isInternetAvailable;
import static com.app.ps19.scimapp.Shared.Globals.setUserInfoView;
import static com.app.ps19.scimapp.Shared.Globals.user;
import static com.app.ps19.scimapp.Shared.Utilities.getImgPath;

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
    IssueImage sigImage = new IssueImage();
    IssueImage profImage = new IssueImage();
    Popup popup;

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
        /*ivSigThumb = findViewById(R.id.iv_signature_thumb);*/

        setUserInfoView(ProfileActivity.this,ivPerson, null);
        loadProfileDefault();
        // ButterKnife.bind(this);

        // Clearing older images from cache directory
        // don't call this line if you want to choose multiple images in the same activity
        // call this once the bitmap(s) usage is over
        ImagePickerActivity.clearCache(this);


        if(user.getSignature()==null){
            tvSignature.setText("N/A");
        } else {
            tvSignature.setText("View");
        }
        tvMName.setText(user.getName());
        tvMEmail.setText(user.getEmail());
        tvName.setText(user.getName());
        tvEmail.setText(user.getEmail());
        tvMobile.setText(user.getMobileNumber());
        tvPhone.setText(user.getPhoneNumber());

        ivPassEdit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(isInternetAvailable(ProfileActivity.this)){
                    Intent intent = new Intent(ProfileActivity.this, UpdatePasswordActivity.class);
                    startActivity(intent);
                } else {
                    Toast.makeText(ProfileActivity.this, R.string.please_connect_server, Toast.LENGTH_SHORT).show();
                }
            }
        });
        rlBackBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });
        tvSignature.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(user.getSignature()!= null){
                    popup = new Popup(ProfileActivity.this, getImgPath(user.getSignature().getImgName()), 0, user.getSignature().getImgName());
                    popup.setCancelable(true);
                    popup.show();
                }
            }
        });
        ivSigEdit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Globals.imageFileName = "";
                Intent intent = new Intent(ProfileActivity.this, ScribbleNotesActivity.class);
                Bundle b=new Bundle();
                b.putString("filename","");
                startActivityForResult(intent,REQ_CODE_SIGNATURE);
            }
        });
        ivSigEdit.setVisibility(View.GONE);
    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {

        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQ_CODE_SIGNATURE) {
            if (resultCode == Activity.RESULT_OK) {
                String result = data.getStringExtra("result");
                if (result.equals("Taken")) {
                    sigImage.setImgName(Globals.imageFileName);
                    user.setSignature(sigImage);
                    Globals.imageFileName = "";
                    tvSignature.setText("View");
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

    /*@OnClick({R.id.img_plus, R.id.img_profile})*/
    public void onProfileImageClick(View view) {
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
        builder.setPositiveButton(getString(R.string.go_to_settings), new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.cancel();
                ProfileActivity.this.openSettings();
            }
        });
        builder.setNegativeButton(getString(android.R.string.cancel), new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.cancel();
            }
        });
        builder.show();

    }

    // navigating user to app settings
    private void openSettings() {
        Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        Uri uri = Uri.fromParts("package", getPackageName(), null);
        intent.setData(uri);
        startActivityForResult(intent, 101);
    }
}