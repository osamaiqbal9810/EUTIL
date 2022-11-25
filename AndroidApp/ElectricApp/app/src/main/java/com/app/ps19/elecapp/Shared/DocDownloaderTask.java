package com.app.ps19.elecapp.Shared;

import android.content.Context;
import android.os.AsyncTask;
import android.util.Log;

import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import static com.app.ps19.elecapp.Shared.Utilities.getDocumentPath;

public class DocDownloaderTask  extends AsyncTask<String, Void, String> {
    private Context context;
    private String url;
    private String documentName;

    public DocDownloaderTask(String url, String documentName, Context context) {
        this.url = url;
        this.context = context;
        this.documentName= documentName;
    }

    @Override
    protected String doInBackground(String... params) {

        //return downloadBitmap(params[0]);
        return DownloadFile(this.url, this.documentName);
    }

    @Override
    protected void onPostExecute(String status) {
        if (isCancelled()) {
            status="Canceled";
        }

    }

    public String DownloadFile(String fileURL, String fileName) {
        try {

            URL u = new URL(fileURL);
            HttpURLConnection c = (HttpURLConnection) u.openConnection();

            /*File root = Environment.getExternalStorageDirectory();
            File dir = new File(root.getAbsolutePath() + "/" + Globals.docFolderName);*/

            //c.setRequestMethod("GET");
            //c.setDoOutput(true);
            //c.connect();
            InputStream in = c.getInputStream();
            FileOutputStream f = new FileOutputStream(getDocumentPath(fileName));
            byte[] buffer = new byte[1024];
            int len1 = 0;
            while ((len1 = in.read(buffer)) > 0) {
                f.write(buffer, 0, len1);
            }
            f.close();
            return "OK";
        } catch (Exception e) {
            Log.d("Downloader", e.getMessage());
        }
        return null;
    }

}
