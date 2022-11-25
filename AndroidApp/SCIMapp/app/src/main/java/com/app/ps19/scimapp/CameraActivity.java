//package com.app.ps19.scimapp;
//
//import android.annotation.SuppressLint;
//import android.app.ProgressDialog;
//import android.content.Context;
//import android.content.Intent;
//import android.content.pm.PackageManager;
//import android.graphics.Bitmap;
//import android.graphics.BitmapFactory;
//import android.graphics.Matrix;
//import android.hardware.Camera;
//import android.media.AudioManager;
//import android.media.ExifInterface;
//import android.net.Uri;
//import android.os.Build;
//import android.os.Environment;
//import androidx.core.app.ActivityCompat;
//import androidx.core.content.ContextCompat;
//import androidx.appcompat.app.AppCompatActivity;
//import android.os.Bundle;
//import android.provider.MediaStore;
//import android.util.Log;
//import android.view.View;
//import android.view.WindowManager;
//import android.widget.Button;
//import android.widget.ImageButton;
//import android.widget.ImageView;
//import android.widget.LinearLayout;
//
//import com.app.ps19.scimapp.Shared.BitmapTools;
//import com.app.ps19.scimapp.Shared.Globals;
//
//import java.io.File;
//import java.io.FileOutputStream;
//import java.io.IOException;
//import java.io.InputStream;
//import java.text.SimpleDateFormat;
//import java.util.Date;
//import java.util.List;
//
//import static com.app.ps19.scimapp.Shared.Globals.setLocale;
//import static com.app.ps19.scimapp.Shared.Utilities.getImgPath;
//
//public class CameraActivity extends AppCompatActivity {
//
//    private static final int MY_PERMISSIONS_REQUEST_CAMERA = 555;
//    private Camera mCamera;
//    private CameraPreview mPreview;
//    private Camera.PictureCallback mPicture;
//    private ImageButton capture, switchCamera;
//    private Context myContext;
//    private LinearLayout cameraPreview;
//    private boolean cameraFront = false;
//    public static Bitmap bitmap;
//    Camera.Size bestSize = null;
//    public int preWid;
//    public int preHei;
//    ProgressDialog dialog =null;
//
//    Button camera_open_id;
//    ImageView click_image_id;
//
//    @Override
//    protected void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//        setLocale(this);
//        setContentView(R.layout.activity_camera);
//
//        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
//        myContext = this;
//
//        mCamera =  Camera.open();
//
//        dialog=new ProgressDialog(this);
//        //mCamera.setDisplayOrientation(90);
//        cameraPreview = (LinearLayout) findViewById(R.id.cPreview);
//        capture = (ImageButton) findViewById(R.id.btnCam);
//        mPreview = new CameraPreview(myContext, mCamera);
//        //mPreview = new CameraPreview(this, 0, CameraPreview.LayoutMode.FitToParent);
//        cameraPreview.addView(mPreview);
//
//        capture = (ImageButton) findViewById(R.id.btnCam);
//        capture.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                /*Camera.Parameters param;
//                param = mCamera.getParameters();
//
//                bestSize = null;
//                List<Camera.Size> sizeList = mCamera.getParameters().getSupportedPreviewSizes();
//                bestSize = sizeList.get(0);
//                for(int i = 1; i < sizeList.size(); i++){
//                    if((sizeList.get(i).width * sizeList.get(i).height) > (bestSize.width * bestSize.height)){
//                        bestSize = sizeList.get(i);
//                    }
//                }
//
//                List<Integer> supportedPreviewFormats = param.getSupportedPreviewFormats();
//                Iterator<Integer> supportedPreviewFormatsIterator = supportedPreviewFormats.iterator();
//                while(supportedPreviewFormatsIterator.hasNext()){
//                    Integer previewFormat =supportedPreviewFormatsIterator.next();
//                    if (previewFormat == ImageFormat.YV12) {
//                        param.setPreviewFormat(previewFormat);
//                    }
//                }
//
//                param.setPreviewSize(bestSize.width, bestSize.height);
//
//                param.setPictureSize(bestSize.width, bestSize.height);
//
//                try {
//                    mCamera.setParameters(param);
//                  //  mCamera.takePicture(null, null, mPicture);
//                } catch (Exception e) {
//                    e.printStackTrace();
//                }*/
//                try {
//                    //mCamera.setParameters(param);
//                    mCamera.takePicture(shutterCallback, null, mPicture);
//                } catch (Exception e) {
//                    e.printStackTrace();
//                }
//                showDialog(getString(R.string.title_please_wait),getString(R.string.message_processing_image));
//                //mCamera.takePicture(shutterCallback, rawCallback, jpegCallback);
//
//            }
//        });
//
//        //switchCamera = (ImageButton) findViewById(R.id.btnSwitch);
//        /*switchCamera.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                //get the number of cameras
//                int camerasNumber = Camera.getNumberOfCameras();
//                if (camerasNumber > 1) {
//                    //release the old camera instance
//                    //switch camera, from the front and the back and vice versa
//
//                    releaseCamera();
//                    chooseCamera();
//                } else {
//
//                }
//            }
//        });*/
//        if (ContextCompat.checkSelfPermission(CameraActivity.this, android.Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
//            ActivityCompat.requestPermissions(CameraActivity.this, new String[]{android.Manifest.permission.CAMERA}, MY_PERMISSIONS_REQUEST_CAMERA);
//        } else {
//            preWid = this.getWindowManager().getDefaultDisplay().getWidth();
//            preHei = this.getWindowManager().getDefaultDisplay().getHeight();
//
//            System.out.println("wid"+preWid);
//            System.out.println("hei"+preHei);
//            Camera.Parameters param;
//            param = mCamera.getParameters();
//            Camera.Size myBestSize = getBestPreviewSize(preHei, preWid, param);
//
//            if(myBestSize != null){
//                param.setPreviewSize(myBestSize.width, myBestSize.height);
//                mCamera.setParameters(param);
//                //mCamera.setDisplayOrientation(90);
//                mPicture = getPictureCallback();
//                mPreview.refreshCamera(mCamera);
//                mCamera.startPreview();
//            }
//           /* mCamera.startPreview();
//            //mCamera = Camera.open();
//            mCamera.setDisplayOrientation(90);
//            mPicture = getPictureCallback();
//            mPreview.refreshCamera(mCamera);*/
//        }
//    }
//
//
//    private Camera.Size getBestPreviewSize(int width, int height, Camera.Parameters parameters){
//        Camera.Size bestSize = null;
//        List<Camera.Size> sizeList = parameters.getSupportedPreviewSizes();
//
//        bestSize = sizeList.get(0);
//
//        for(int i = 1; i < sizeList.size(); i++){
//            if((sizeList.get(i).width * sizeList.get(i).height) >
//                    (bestSize.width * bestSize.height)){
//                bestSize = sizeList.get(i);
//            }
//        }
//
//        return bestSize;
//    }
//    @Override
//    public void onRequestPermissionsResult(int requestCode, String permissions[], int[] grantResults) {
//        switch (requestCode) {
//            case MY_PERMISSIONS_REQUEST_CAMERA: {
//                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
//                    mPreview.refreshCamera(mCamera);
//                } else {
//                    //finish();
//                }
//            }
//        }
//    }
//
//    private int findFrontFacingCamera() {
//
//        int cameraId = -1;
//        // Search for the front facing camera
//        int numberOfCameras = Camera.getNumberOfCameras();
//        for (int i = 0; i < numberOfCameras; i++) {
//            Camera.CameraInfo info = new Camera.CameraInfo();
//            Camera.getCameraInfo(i, info);
//            if (info.facing == Camera.CameraInfo.CAMERA_FACING_FRONT) {
//                cameraId = i;
//                cameraFront = true;
//                break;
//            }
//        }
//        return cameraId;
//
//    }
//
//    private int findBackFacingCamera() {
//        int cameraId = -1;
//        //Search for the back facing camera
//        //get the number of cameras
//        int numberOfCameras = Camera.getNumberOfCameras();
//        //for every camera check
//        for (int i = 0; i < numberOfCameras; i++) {
//            Camera.CameraInfo info = new Camera.CameraInfo();
//            Camera.getCameraInfo(i, info);
//            if (info.facing == Camera.CameraInfo.CAMERA_FACING_BACK) {
//                cameraId = i;
//                cameraFront = false;
//                break;
//
//            }
//
//        }
//        return cameraId;
//    }
//
//    public void onResume() {
//
//            super.onResume();
//            setLocale(this);
//            if(mCamera == null) {
//                mCamera = Camera.open();
//                //mCamera.setDisplayOrientation(90);
//                mPicture = getPictureCallback();
//                mPreview.refreshCamera(mCamera);
//                Log.d("nu", "null");
//            }else {
//                Log.d("nu","no null");
//            }
//
//    }
//
//    public void chooseCamera() {
//        //if the camera preview is the front
//        if (cameraFront) {
//            int cameraId = findBackFacingCamera();
//            if (cameraId >= 0) {
//                //open the backFacingCamera
//                //set a picture callback
//                //refresh the preview
//
//                mCamera = Camera.open(cameraId);
//                //mCamera.setDisplayOrientation(90);
//                mPicture = getPictureCallback();
//                mPreview.refreshCamera(mCamera);
//            }
//        } else {
//            int cameraId = findFrontFacingCamera();
//            if (cameraId >= 0) {
//                //open the backFacingCamera
//                //set a picture callback
//                //refresh the preview
//                mCamera = Camera.open(cameraId);
//                //mCamera.setDisplayOrientation(90);
//                mPicture = getPictureCallback();
//                mPreview.refreshCamera(mCamera);
//            }
//        }
//    }
//
//    @Override
//    protected void onPause() {
//        super.onPause();
//        //when on Pause, release camera in order to be used from other applications
//        releaseCamera();
//
//    }
//
//    private void releaseCamera() {
//        // stop and release camera
//        if (mCamera != null) {
//            mCamera.stopPreview();
//            mCamera.setPreviewCallback(null);
//            mCamera.release();
//            mCamera = null;
//        }
//    }
//    private final Camera.ShutterCallback shutterCallback = new Camera.ShutterCallback() {
//        public void onShutter() {
//            AudioManager mgr = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
//            mgr.playSoundEffect(AudioManager.FLAG_PLAY_SOUND);
//        }
//    };
//
//    private Camera.PictureCallback getPictureCallback() {
//        Camera.PictureCallback picture = new Camera.PictureCallback() {
//            @Override
//            public void onPictureTaken(byte[] data, Camera camera) {
//                bitmap = BitmapFactory.decodeByteArray(data, 0, data.length);
//                bitmap = BitmapTools.rotate(bitmap, 90);
//               /* File sdCard = Environment.getExternalStorageDirectory();
//                File dir = new File(sdCard.getAbsolutePath() + "/" + Globals.imageFolderName);
//                //File dir=new File(Environment.getExternalStorageDirectory(),Globals.imageFolderName);
//                if (!dir.exists())
//                    dir.mkdirs();*/
//
//                String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
//                //Convert bitmap to byte array
//                //bitmap = PictureActivity.BitmapTools.toBitmap(data);
//                //ByteArrayOutputStream bos = new ByteArrayOutputStream();
//                //bitmap.compress(Bitmap.CompressFormat.JPEG, 0 /*ignored for PNG*/, bos);
//
//                File pictureFile = new File(getImgPath(Globals.selectedTask.getTaskId() + "_" + getCurrentReportIndex() + "_" + timeStamp + ".jpg"));
//                Globals.imgFile = pictureFile;
//                try {
//
//                    FileOutputStream fos = new FileOutputStream(pictureFile);
//                    //write the compressed bitmap at the destination specified by filename.
//                    bitmap.compress(Bitmap.CompressFormat.JPEG, 80, fos);
//                    //bitmap.compress(Bitmap.CompressFormat.JPEG, 100, fos);
//                    fos.flush();
//                    //fos.write(data);
//                    fos.close();
//                } catch (Exception error) {
//                    Log.d("File:", "File" + "not saved: "
//                            + error.getMessage());
//                }
//                /*try {
//                    bitmap = handleSamplingAndRotationBitmap(CameraActivity.this, Uri.fromFile(pictureFile));
//                } catch (IOException e) {
//                    e.printStackTrace();
//                }*/
//                bitmap.recycle();
//                Intent intent = new Intent(CameraActivity.this, PictureActivity.class);
//                releaseCamera();
//                hideDialog();
//                startActivityForResult(intent, 1);
//                //startActivity(intent);*/
//            }
//        };
//        return picture;
//    }
//    private static int getCurrentReportIndex() {
//        if (Globals.selectedReport == null) {
//            return Globals.selectedTask.getReportList().size();
//        }
//        return Globals.selectedReport.getReportIndex();
//    }
//    @SuppressLint("MissingSuperCall")
//    @Override
//    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
//
//        Intent returnIntent = new Intent();
//        if(resultCode == RESULT_OK){
//            String result = data.getStringExtra("result");
//            if(result.equals("Taken")){
//                returnIntent.putExtra("result",result);
//                setResult(RESULT_OK, returnIntent);
//                releaseCamera();
//                finish();
//            } /*else {
//                returnIntent.putExtra("result", result);
//            }*/
//            //tvResult.setText(data.getIntExtra("result",-1)+"");
//        }
//
//    }
//    /**
//     * This method is responsible for solving the rotation issue if exist. Also scale the images to
//     * 1024x1024 resolution
//     *
//     * @param context       The current context
//     * @param selectedImage The Image URI
//     * @return Bitmap image results
//     * @throws IOException
//     */
//    public static Bitmap handleSamplingAndRotationBitmap(Context context, Uri selectedImage)
//            throws IOException {
//        int MAX_HEIGHT = 1024;
//        int MAX_WIDTH = 1024;
//
//        // First decode with inJustDecodeBounds=true to check dimensions
//        final BitmapFactory.Options options = new BitmapFactory.Options();
//        options.inJustDecodeBounds = true;
//        InputStream imageStream = context.getContentResolver().openInputStream(selectedImage);
//        BitmapFactory.decodeStream(imageStream, null, options);
//        imageStream.close();
//
//        // Calculate inSampleSize
//        options.inSampleSize = calculateInSampleSize(options, MAX_WIDTH, MAX_HEIGHT);
//
//        // Decode bitmap with inSampleSize set
//        options.inJustDecodeBounds = false;
//        imageStream = context.getContentResolver().openInputStream(selectedImage);
//        Bitmap img = BitmapFactory.decodeStream(imageStream, null, options);
//
//        img = rotateImageIfRequired(context, img, selectedImage);
//        return img;
//    }
//
//    /**
//     * Calculate an inSampleSize for use in a {@link BitmapFactory.Options} object when decoding
//     * bitmaps using the decode* methods from {@link BitmapFactory}. This implementation calculates
//     * the closest inSampleSize that will result in the final decoded bitmap having a width and
//     * height equal to or larger than the requested width and height. This implementation does not
//     * ensure a power of 2 is returned for inSampleSize which can be faster when decoding but
//     * results in a larger bitmap which isn't as useful for caching purposes.
//     *
//     * @param options   An options object with out* params already populated (run through a decode*
//     *                  method with inJustDecodeBounds==true
//     * @param reqWidth  The requested width of the resulting bitmap
//     * @param reqHeight The requested height of the resulting bitmap
//     * @return The value to be used for inSampleSize
//     */
//    private static int calculateInSampleSize(BitmapFactory.Options options,
//                                             int reqWidth, int reqHeight) {
//        // Raw height and width of image
//        final int height = options.outHeight;
//        final int width = options.outWidth;
//        int inSampleSize = 1;
//
//        if (height > reqHeight || width > reqWidth) {
//
//            // Calculate ratios of height and width to requested height and width
//            final int heightRatio = Math.round((float) height / (float) reqHeight);
//            final int widthRatio = Math.round((float) width / (float) reqWidth);
//
//            // Choose the smallest ratio as inSampleSize value, this will guarantee a final image
//            // with both dimensions larger than or equal to the requested height and width.
//            inSampleSize = heightRatio < widthRatio ? heightRatio : widthRatio;
//
//            // This offers some additional logic in case the image has a strange
//            // aspect ratio. For example, a panorama may have a much larger
//            // width than height. In these cases the total pixels might still
//            // end up being too large to fit comfortably in memory, so we should
//            // be more aggressive with sample down the image (=larger inSampleSize).
//
//            final float totalPixels = width * height;
//
//            // Anything more than 2x the requested pixels we'll sample down further
//            final float totalReqPixelsCap = reqWidth * reqHeight * 2;
//
//            while (totalPixels / (inSampleSize * inSampleSize) > totalReqPixelsCap) {
//                inSampleSize++;
//            }
//        }
//        return inSampleSize;
//    }
//    /**
//     * Rotate an image if required.
//     *
//     * @param img           The image bitmap
//     * @param selectedImage Image URI
//     * @return The resulted Bitmap after manipulation
//     */
//    private static Bitmap rotateImageIfRequired(Context context, Bitmap img, Uri selectedImage) throws IOException {
//
//        InputStream input = context.getContentResolver().openInputStream(selectedImage);
//        ExifInterface ei;
//        if (Build.VERSION.SDK_INT > 23)
//            ei = new ExifInterface(input);
//        else
//            ei = new ExifInterface(selectedImage.getPath());
//
//        int orientation = ei.getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL);
//
//        switch (orientation) {
//            case ExifInterface.ORIENTATION_ROTATE_90:
//                return rotateImage(img, 90);
//            case ExifInterface.ORIENTATION_ROTATE_180:
//                return rotateImage(img, 180);
//            case ExifInterface.ORIENTATION_ROTATE_270:
//                return rotateImage(img, 270);
//            default:
//                return img;
//        }
//    }
//    private static Bitmap rotateImage(Bitmap img, int degree) {
//        Matrix matrix = new Matrix();
//        matrix.postRotate(degree);
//        Bitmap rotatedImg = Bitmap.createBitmap(img, 0, 0, img.getWidth(), img.getHeight(), matrix, true);
//        img.recycle();
//        return rotatedImg;
//    }
//    void showDialog(String title,String message){
//        dialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
//        dialog.setTitle(title);
//        dialog.setMessage(message);
//        dialog.setIndeterminate(true);
//        dialog.setCanceledOnTouchOutside(false);
//        dialog.show();
//    }
//    void hideDialog(){
//        if(dialog!=null){
//            if(dialog.isShowing()){
//                dialog.dismiss();
//            }
//        }
//    }
//}
