package com.app.ps19.elecapp.Shared;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.Drawable;
import android.os.AsyncTask;
import android.os.Environment;
import android.util.Log;
import android.widget.ImageView;

import com.app.ps19.elecapp.R;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.lang.ref.WeakReference;
import java.net.HttpURLConnection;
import java.net.URL;

import static com.app.ps19.elecapp.Shared.Utilities.getImgPath;

public class ImageDownloaderTask extends AsyncTask<String, Void, Bitmap> {

    private final WeakReference<ImageView> imageViewReference;
    //private final LruCache memoryCache;
    //private final BrandItem brandCatogiriesItem;
    private Context context;
    private String url;
    private String imageName;

    public ImageDownloaderTask(ImageView imageView, String url, String imageName, Context context) {
        imageViewReference = new WeakReference<ImageView>(imageView);
        //memoryCache = new LruCache();
        //brandCatogiriesItem = new BrandItem();
        this.url = url;
        this.context = context;
        this.imageName = imageName;
    }

    @Override
    protected Bitmap doInBackground(String... params) {

        //return downloadBitmap(params[0]);
        return DownloadFile(this.url, this.imageName);
    }

    @Override
    protected void onPostExecute(Bitmap bitmap) {
        if (isCancelled()) {
            bitmap = null;
        }

        if (imageViewReference != null) {
            ImageView imageView = imageViewReference.get();
            if (imageView != null) {
                if (bitmap != null) {
                    //memoryCache.put("1", bitmap);
                    //brandCatogiriesItem.setUrl(url);
                    //brandCatogiriesItem.setThumb(bitmap);
                    // BrandCatogiriesItem.saveLocalBrandOrCatogiries(context, brandCatogiriesItem);
                    imageView.setImageBitmap(bitmap);
                } else {
                    Drawable placeholder = imageView.getContext().getResources().getDrawable(R.drawable.no_image__placeholder);
                    imageView.setImageDrawable(placeholder);
                }
            }

        }
    }

    public Bitmap DownloadFile(String fileURL, String fileName) {
        try {
           /* File root = Environment.getExternalStorageDirectory();
            File dir = new File(root.getAbsolutePath() + "/" + Globals.imageFolderName);*/

            URL u = new URL(fileURL);
            HttpURLConnection c = (HttpURLConnection) u.openConnection();
            //c.setRequestMethod("GET");
            //c.setDoOutput(true);
            //c.connect();
            InputStream in = c.getInputStream();
            FileOutputStream f = new FileOutputStream(new File(getImgPath(fileName)));



            byte[] buffer = new byte[1024];
            int len1 = 0;
            while ((len1 = in.read(buffer)) > 0) {
                f.write(buffer, 0, len1);
            }
            f.close();
            //String imageFile = dir.getAbsolutePath() + "/" + fileName;
            return Utilities.getImageFromSDCardThumbnail(context, fileName);
        } catch (Exception e) {
            Log.d("Downloader", e.getMessage());
        }
        return null;
    }

    private Bitmap downloadBitmap(String url) {
        HttpURLConnection urlConnection = null;
        try {
            URL uri = new URL(url);
            urlConnection = (HttpURLConnection) uri.openConnection();

            int statusCode = urlConnection.getResponseCode();
            if (statusCode != HttpURLConnection.HTTP_OK) {
                return null;
            }

            InputStream inputStream = urlConnection.getInputStream();
            if (inputStream != null) {


                Bitmap bitmap = BitmapFactory.decodeStream(inputStream);
                return bitmap;
            }
        } catch (Exception e) {
            Log.d("URLCONNECTIONERROR", e.toString());
            if (urlConnection != null) {
                urlConnection.disconnect();
            }
            Log.w("ImageDownloader", "Error downloading image from " + url);
        } finally {
            if (urlConnection != null) {
                urlConnection.disconnect();

            }
        }
        return null;
    }
}