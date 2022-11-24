package com.app.ps19.tipsapp.Shared;

import android.content.Context;
import android.os.AsyncTask;
import android.os.Environment;
import android.util.Log;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import static com.app.ps19.tipsapp.Shared.Utilities.getImgPath;
import static com.app.ps19.tipsapp.Shared.Utilities.getVoicePath;

public class VoiceDownloaderTask extends AsyncTask<String, Void, String>{
    private Context context;
    private String url;
    private String voiceName;

    public VoiceDownloaderTask(String url, String voiceName, Context context) {
        //memoryCache = new LruCache();
        //brandCatogiriesItem = new BrandItem();
        this.url = url;
        this.context = context;
        this.voiceName = voiceName;
    }

    @Override
    protected String doInBackground(String... params) {

        //return downloadBitmap(params[0]);
        return DownloadFile(this.url, this.voiceName);
    }

    @Override
    protected void onPostExecute(String status) {
        if (isCancelled()) {
            status="Canceled";
        }

    }

    public String DownloadFile(String fileURL, String fileName) {
        try {
            /*File root = Environment.getExternalStorageDirectory();
            File dir = new File(root.getAbsolutePath() + "/" + Globals.voiceFolderName);*/

            URL u = new URL(fileURL);
            HttpURLConnection c = (HttpURLConnection) u.openConnection();
            //c.setRequestMethod("GET");
            //c.setDoOutput(true);
            //c.connect();
            InputStream in = c.getInputStream();
            FileOutputStream f = new FileOutputStream(new File(getVoicePath(fileName)));



            byte[] buffer = new byte[1024];
            int len1 = 0;
            while ((len1 = in.read(buffer)) > 0) {
                f.write(buffer, 0, len1);
            }
            f.close();
            //String imageFile = dir.getAbsolutePath() + "/" + fileName;
            return "OK";//Utilities.getImageFromSDCardThumbnail(context, fileName);
        } catch (Exception e) {
            Log.d("Downloader", e.getMessage());
        }
        return null;
    }

}
