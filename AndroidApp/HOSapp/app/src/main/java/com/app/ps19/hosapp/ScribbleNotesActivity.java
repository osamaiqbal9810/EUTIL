package com.app.ps19.hosapp;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.drawable.BitmapDrawable;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Environment;
import android.os.Handler;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.Toast;


import com.app.ps19.hosapp.Shared.Globals;
import com.app.ps19.hosapp.Shared.MyDrawView;
import com.app.ps19.hosapp.Shared.Utilities;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

public class ScribbleNotesActivity extends AppCompatActivity {

    private static final String TAG = "ScribbleActivity";
    MyDrawView myDrawView=null;
    RelativeLayout parent=null;
    boolean disableBackOption=false;
    String imageFileName="";
    //SurveyAnswers aList=null;
    //AnswerNotesItem answerNotesItem;
    boolean blnClearImage=false;


    ImageView imgClear, imgBack;
    @Override
    public void onBackPressed() {

        if (myDrawView.isDirty())
        {
            saveAndExit();

            return;
        }
        super.onBackPressed();
    }

    private void saveAndExit() {
        disableBackOption = true;
        /*
        if (aList == null) {
            this.aList = Globals.selAnswer;
        }
        if (answerNotesItem == null) {
            this.answerNotesItem = aList.getAnswerNotesItemList().get(0);
        }
        if(!Globals.imageFileName.endsWith(".jpg"))
        {
            String fileName=Utilities.getFileNameByVisit(Globals.currVisit
                    ,this.answerNotesItem);
            Globals.imageFileName=fileName;

        }

        if (answerNotesItem != null) {
            if (answerNotesItem.getItems().size() == 0) {
                answerNotesItem.getItems().add("");
                answerNotesItem.getItems().add("");
                answerNotesItem.getItems().add(Globals.imageFileName);
                answerNotesItem.getItems().add("1");

            } else if (answerNotesItem.getItems().size() == 2) {
                answerNotesItem.getItems().add(Globals.imageFileName);
                answerNotesItem.getItems().add("1");
            }
            else if(answerNotesItem.getItems().size() == 3)
            {
                answerNotesItem.getItems().set(2, Globals.imageFileName);
                answerNotesItem.getItems().add("1");
            }else if(answerNotesItem.getItems().size()==4)
            {
                answerNotesItem.getItems().set(2,Globals.imageFileName);
                answerNotesItem.getItems().set(3,"1");
            }
            answerNotesItem.setDescription(Globals.imageFileName);
            answerNotesItem.setTimeStamp(Utilities.getCurrNumberTime());
            //Globals.getSurveyImageReload(getApplicationContext(),Globals.imageFileName);
            Globals.currVisit.setDataChanged(true);
        }
        */


        Bitmap bitmap = parent.getDrawingCache();
        bitmap = getResizedBitmap(bitmap, 800, 600);

        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.JPEG, 60, stream);
        new SaveImageTask().execute(stream.toByteArray());
        //resetCam();
        Log.d(TAG, "saveAndExit - jpeg");
    }
    private void refreshGallery(File file) {
        Intent mediaScanIntent = new Intent( Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
        mediaScanIntent.setData(Uri.fromFile(file));
        sendBroadcast(mediaScanIntent);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.activity_scribble_notes);
        Bundle b = getIntent().getExtras();
        this.imageFileName=Utilities.getUniqueId() +".png";
        if(b !=null){
            this.imageFileName=b.getString("filename");
        }else if(!Globals.imageFileName.equals("")){
            this.imageFileName=Globals.imageFileName;
        }

        parent =  findViewById(R.id.signImageParent);
        myDrawView = new MyDrawView(this);
        parent.addView(myDrawView);
        parent.setDrawingCacheEnabled(true);
        imgClear=findViewById(R.id.imgClear_asn);
        imgBack=findViewById(R.id.imgBack_asn);
        imgBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });
        imgClear.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(blnClearImage)
                {
                    myDrawView.clear();
                    parent.setBackgroundColor(Color.WHITE);
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {

                        //parent.setBackground(myDrawView.getDrawingCache());
                    }else
                    {
                        //parent.setBackgroundDrawable(null);
                    }
                    parent.setDrawingCacheEnabled(true);
                    return;
                }
                blnClearImage=true;
                Toast.makeText(ScribbleNotesActivity.this,
                        "Press again to clear",Toast.LENGTH_SHORT).show();
                final Runnable runnable=new Runnable() {
                    @Override
                    public void run() {
                        blnClearImage=false;

                    }
                };
                final Handler handler=new Handler();
                handler.postDelayed(runnable,3000);

            }
        });
        showImage(this.imageFileName);

        /*
        aList=Globals.selAnswer;

        if(aList==null)
        {
            aList=Globals.selAnswer;
        }
        if(aList.getAnswerNotesItemList().size()==0)
        {
            aList.getAnswerNotesItemList().add(new AnswerNotesItem(aList,1,"Scribble",Utilities.getCurrNumberTime()));
        }
        this.answerNotesItem=aList.getAnswerNotesItemList().get(0);
        String fileName=Utilities.getFileNameByVisit(Globals.currVisit,this.answerNotesItem);
        Globals.selImageName=fileName;
        Globals.imageFileName=fileName;
        showImage(answerNotesItem);
        */
    }

    public void closeActivity(int resultCode)
    {
        //setResult(resultCode);
        Intent returnIntent = new Intent();
        returnIntent.putExtra("result", "Taken");
        setResult(RESULT_OK, returnIntent);
        finish();
    }
    private void showImage(String imageFileName){
        if(!imageFileName.equals("")){
            Bitmap bitmap = Utilities.getImageFromSDCard(getApplicationContext()
                    ,imageFileName);
            if (bitmap != null) {
                BitmapDrawable background = new BitmapDrawable(bitmap);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
                    parent.setBackground(background );
                }else
                {
                    parent.setBackgroundDrawable(background);
                }
            }
        }
    }
  /*
    private void showImage(AnswerNotesItem aLI) {
        if(aLI.getItems().size()>=2) {
            String strFileName = aLI.getItems().get(2);

            if (!strFileName.equals("")) {
                Bitmap bitmap =Utilities.getImageFromSDCard(getApplicationContext()
                        ,strFileName );
                if (bitmap != null) {
                    BitmapDrawable background = new BitmapDrawable(bitmap);
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
                        parent.setBackground(background );
                    }else
                    {
                        parent.setBackgroundDrawable(background);
                    }
                }
            }
        }
    }
*/
    public Bitmap getResizedBitmap(Bitmap bm, int newWidth, int newHeight) {
        int width = bm.getWidth();
        int height = bm.getHeight();
        float scaleWidth = ((float) newWidth) / width;
        float scaleHeight = ((float) newHeight) / height;

        // CREATE A MATRIX FOR THE MANIPULATION
        Matrix matrix = new Matrix();
        // RESIZE THE BIT MAP
        matrix.postScale(scaleWidth, scaleHeight);

        // "RECREATE" THE NEW BITMAP
        Bitmap resizedBitmap = Bitmap.createBitmap(
                bm, 0, 0, width, height, matrix, false);
        return resizedBitmap;
    }
    private class SaveImageTask extends AsyncTask<byte[], Void, Void> {
        String imageFileName=ScribbleNotesActivity.this.imageFileName;
        @Override
        protected void onPostExecute(Void aVoid) {

            //super.onPostExecute(aVoid);
    //        Globals.getSurveyImageReload(getApplicationContext(),Globals.imageFileName);
            closeActivity(1);
        }

        @Override
        protected Void doInBackground(byte[]... data) {
            FileOutputStream outStream = null;

            // Write to SD Card
            try {
                //File sdCard = Environment.getExternalStorageDirectory();
                //File dir = new File (sdCard.getAbsolutePath() + "/"+Globals.imageFolderName);
                File dir=new File(Environment.getExternalStorageDirectory(), Globals.imageFolderName);
                if(!dir.exists())
                    dir.mkdirs();

                String fileName = this.imageFileName ; //String.format("%d.jpg", System.currentTimeMillis());

                File outFile = new File(dir, fileName);
                if(outFile.exists())
                {
                    outFile.delete();
                }

                outStream = new FileOutputStream(outFile);

                outStream.write(data[0]);
                outStream.flush();
                outStream.close();


                Log.d(TAG, "onPictureTaken - wrote bytes: " + data.length + " to " + outFile.getAbsolutePath());

                refreshGallery(outFile);
                Globals.imageFileName=this.imageFileName;
                //CameraPreviewActivity.this.setResult(1);
                //CameraPreviewActivity.this.finish();


            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
            }
            return null;
        }

    }

}
