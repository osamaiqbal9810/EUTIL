package com.app.ps19.elecapp;

import static com.app.ps19.elecapp.Shared.Globals.setLocale;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;

import androidx.appcompat.app.AppCompatActivity;

import com.app.ps19.elecapp.Shared.Globals;
import com.squareup.picasso.Picasso;

public class PictureActivity extends AppCompatActivity
        //implements Camera.PictureCallback
        {

    private ImageView imageView;
    private ImageButton btnRetake;
    private ImageButton btnSelect;
    private static final String IMAGE_DIRECTORY = "/CustomImage";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setLocale(this);
        setContentView(R.layout.activity_picture);
        imageView = findViewById(R.id.img);

//        imageView.requestLayout();
//        imageView.getLayoutParams().height = Globals.imgSize.getHeight();
//        // Apply the new width for ImageView programmatically
//        imageView.getLayoutParams().width = Globals.imgSize.getWidth();
//        // Set the scale type for ImageView image scaling
//        imageView.setScaleType(ImageView.ScaleType.FIT_CENTER);

        btnRetake = findViewById(R.id.btRetake);
        btnSelect = findViewById(R.id.btSelect);
        /*Picasso.get()
                .load(Globals.imgFile)
                .placeholder(R.drawable.no_image)
                .error(R.drawable.no_image)
                .into(imageView);*/
        Picasso.get()
                .load(Globals.imgFile)
                .placeholder(R.drawable.no_image)
                .error(R.drawable.no_image)
                //.resize(Globals.imgSize.getWidth(), Globals.imgSize.getHeight())
                .noFade()
                .into(imageView);

        //imageView.setImageBitmap(CameraActivity.bitmap);
        //saveImg(CameraActivity.bitmap);
        btnRetake.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }});

        btnSelect.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            Intent returnIntent = new Intent();
            returnIntent.putExtra("result", "Taken");
            setResult(RESULT_OK, returnIntent);
            finish();
        }});
}

//    public String saveImage(Bitmap myBitmap) {
//        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
//        myBitmap.compress(Bitmap.CompressFormat.JPEG, 90, bytes);
//        File wallpaperDirectory = new File(
//                Environment.getExternalStorageDirectory() + IMAGE_DIRECTORY);
//        // have the object build the directory structure, if needed.
//
//        if (!wallpaperDirectory.exists()) {
//            Log.d("dirrrrrr", "" + wallpaperDirectory.mkdirs());
//            wallpaperDirectory.mkdirs();
//        }
//
//        try {
//            File f = new File(wallpaperDirectory, Calendar.getInstance()
//                    .getTimeInMillis() + ".jpg");
//            f.createNewFile();   //give read write permission
//            FileOutputStream fo = new FileOutputStream(f);
//            fo.write(bytes.toByteArray());
//            MediaScannerConnection.scanFile(this,
//                    new String[]{f.getPath()},
//                    new String[]{"image/jpeg"}, null);
//            fo.close();
//            Log.d("TAG", "File Saved::--->" + f.getAbsolutePath());
//
//            return f.getAbsolutePath();
//        } catch (IOException e1) {
//            e1.printStackTrace();
//        }
//        return "";
//
//    }
//
//    public void saveImg(Bitmap myBitmap) {
//        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
//        myBitmap.compress(Bitmap.CompressFormat.JPEG, 40, bytes);
//        File sdCard = Environment.getExternalStorageDirectory();
//        File dir = new File(sdCard.getAbsolutePath() + "/" + Globals.imageFolderName);
//        //File dir=new File(Environment.getExternalStorageDirectory(),Globals.imageFolderName);
//        if (!dir.exists())
//            dir.mkdirs();
//
//        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
//
//        File pictureFile = new File(getImgPath(Globals.selectedTask.getTaskId() + "_" + getCurrentReportIndex() + "_" + timeStamp + ".jpg"));
//        Globals.imgFile = pictureFile;
//        try {
//            pictureFile.createNewFile();   //give read write permission
//            FileOutputStream fo = new FileOutputStream(pictureFile);
//            fo.write(bytes.toByteArray());
//            MediaScannerConnection.scanFile(this,
//                    new String[]{pictureFile.getPath()},
//                    new String[]{"image/jpeg"}, null);
//            fo.close();
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//
//    }
//
//    @Override
//    public void onPictureTaken(byte[] data, Camera camera) {
//        /*File sdCard = Environment.getExternalStorageDirectory();
//        File dir = new File(sdCard.getAbsolutePath() + "/" + Globals.imageFolderName);
//        //File dir=new File(Environment.getExternalStorageDirectory(),Globals.imageFolderName);
//        if (!dir.exists())
//            dir.mkdirs();*/
//
//        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
//
//        //Convert bitmap to byte array
//        Bitmap bitmap = BitmapTools.toBitmap(data);
//        ByteArrayOutputStream bos = new ByteArrayOutputStream();
//        bitmap.compress(Bitmap.CompressFormat.JPEG, 0 /*ignored for PNG*/, bos);
//        //byte[] bitmapdata = bos.toByteArray();
//        File pictureFile = new File(getImgPath(Globals.selectedTask.getTaskId() + "_" + getCurrentReportIndex() + "_" + timeStamp + ".jpg"));
//        Globals.imgFile = pictureFile;
//        byte[] bitmapdata = new byte[0];
//        try {
//            bitmap = handleSamplingAndRotationBitmap(PictureActivity.this, Uri.fromFile(pictureFile));
//            bitmap.compress(Bitmap.CompressFormat.JPEG, 0 /*ignored for PNG*/, bos);
//            bitmapdata = bos.toByteArray();
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//
//        try {
//            FileOutputStream fos = new FileOutputStream(pictureFile);
//            fos.write(bitmapdata);
//            fos.close();
//        } catch (Exception error) {
//            Log.d("File:", "File" + "not saved: "
//                    + error.getMessage());
//        }
//    }
//
//    private static int getCurrentReportIndex() {
//        if (Globals.selectedReport == null) {
//            return Globals.selectedTask.getReportList().size();
//        }
//        return Globals.selectedReport.getReportIndex();
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
    @Override
    protected void onResume() {
        super.onResume();
        setLocale(this);
    }
}
