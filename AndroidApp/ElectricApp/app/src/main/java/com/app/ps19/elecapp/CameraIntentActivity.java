package com.app.ps19.elecapp;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.FileProvider;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.ImageDecoder;
import android.graphics.Matrix;
import android.graphics.drawable.BitmapDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;

import com.app.ps19.elecapp.Shared.Globals;
import com.app.ps19.elecapp.camera.Size;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Locale;
import java.util.UUID;

import static com.app.ps19.elecapp.Shared.Globals.getVersionInfo;
import static com.app.ps19.elecapp.Shared.Utilities.getImgPath;
import static com.app.ps19.elecapp.Shared.Utilities.removeSpaces;

public class CameraIntentActivity extends AppCompatActivity {
    private static final int REQUEST_CAPTURE_IMAGE = 100;
    private String mCurrentPhotoPath;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //setContentView(R.layout.activity_camera_intent);
        openCameraIntent();
    }
    private Bitmap createScaledImage(Bitmap bitmap, int _maxWidth, int _maxHeight){
        int maxHeight = _maxHeight;
        int maxWidth = _maxWidth;
        float scale = Math.min(((float)maxHeight / bitmap.getWidth()), ((float)maxWidth / bitmap.getHeight()));

        Matrix matrix = new Matrix();
        matrix.postScale(scale, scale);

        return  Bitmap.createBitmap(bitmap, 0, 0, bitmap.getWidth(), bitmap.getHeight(), matrix, true);
    }
    @Override
    protected void onActivityResult(int requestCode, int resultCode,
                                    Intent data) {
        Intent returnIntent = new Intent();
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQUEST_CAPTURE_IMAGE &&
                resultCode == RESULT_OK) {
            if(Globals.imgFile.exists()){
                //Resize Bitmap
                try {
                    Bitmap mImageBitmap = null;

                    //if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                    //    ImageDecoder.Source source = ImageDecoder.createSource(new File(mCurrentPhotoPath));
                    //    mImageBitmap = ImageDecoder.decodeBitmap(source);
                    //} else {
                    mImageBitmap = MediaStore.Images.Media.getBitmap(this.getContentResolver(), Uri.parse("file://" + mCurrentPhotoPath));
                    //}
                    try {
                        FileOutputStream outputStream = new FileOutputStream(Globals.imgFile);
                        mImageBitmap = createScaledImage(mImageBitmap, Globals.maxImageSize, Globals.maxImageSize);
                        mImageBitmap.compress(Bitmap.CompressFormat.JPEG, Globals.jpgQuality, outputStream);
                        outputStream.flush();
                        outputStream.close();
                        Log.i("File Saved","File Saved on device");
                    }catch (Exception e){
                        e.printStackTrace();
                    }
                    //mImageView.setImageBitmap(mImageBitmap);
                    //mImageView.setImageBitmap(mImageBitmap);

                } catch (IOException e) {
                    e.printStackTrace();
                }
                returnIntent.putExtra("result","Taken");
                setResult(RESULT_OK, returnIntent);
                finish();
                return;
            }
            if (data != null) {
                //Bitmap imageBitmap = (Bitmap) data.getExtras().get("data");
/*                try {
                    Bitmap mImageBitmap = null;

                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                        ImageDecoder.Source source = ImageDecoder.createSource(new File(mCurrentPhotoPath));
                        mImageBitmap = ImageDecoder.decodeBitmap(source);
                    } else {
                        mImageBitmap = MediaStore.Images.Media.getBitmap(this.getContentResolver(), Uri.parse("file://" + mCurrentPhotoPath));
                    }
                    mImageView.setImageBitmap(mImageBitmap);
                    //mImageView.setImageBitmap(mImageBitmap);

                } catch (IOException e) {
                    e.printStackTrace();
                }*/
            }
        }
        setResult(RESULT_CANCELED);
        finish();

    }
    private void openCameraIntent() {
        Intent pictureIntent = new Intent(
                MediaStore.ACTION_IMAGE_CAPTURE);
        if(pictureIntent.resolveActivity(getPackageManager()) != null){
            //Create a file to store the image
            File photoFile = null;
            try {
                photoFile = createImageFile();
            } catch (Exception ex) {
                // Error occurred while creating the File
                //...
                ex.printStackTrace();
            }
            if (photoFile != null) {
                Uri photoURI = FileProvider.getUriForFile(this,
                        BuildConfig.APPLICATION_ID+".provider", photoFile);
                pictureIntent.putExtra(MediaStore.EXTRA_OUTPUT,
                        photoURI);
                mCurrentPhotoPath=photoFile.getAbsolutePath();
                startActivityForResult(pictureIntent,
                        REQUEST_CAPTURE_IMAGE);
            }
        }
    }
    private File createImageFile(){
        String picturePath;
        UUID uuid = UUID.randomUUID();
        /*if(selectedJPlan!=null){
            picturePath = getImgPath(getSelectedTask().getTaskId() + "_" + getCurrentReportIndex() + "_" + timeStamp + ".jpg");
        } else {
            picturePath = getImgPath(getVersionInfo().getVersion().getApplicationType().toLowerCase(Locale.ROOT) + "_" + removeSpaces(getVersionInfo().getDisplayData().getDisplayName()).toLowerCase(Locale.ROOT) + "_" + uuid.toString() + ".jpg");
        }*/
        picturePath = getImgPath(getVersionInfo().getVersion().getApplicationType().toLowerCase(Locale.ROOT) + "_" + removeSpaces(getVersionInfo().getDisplayData().getDisplayName()).toLowerCase(Locale.ROOT) + "_" + uuid.toString() + ".jpg");
        File pictureFile = new File(picturePath);
        Globals.imgFile = pictureFile;
        //Globals.imgSize = new Size(previewSize.getWidth(), previewSize.getHeight());
        return pictureFile;
    }
}