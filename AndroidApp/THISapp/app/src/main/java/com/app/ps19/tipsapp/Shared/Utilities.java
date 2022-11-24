package com.app.ps19.tipsapp.Shared;

import android.app.AlertDialog;
import android.app.DownloadManager;
import android.content.Context;
import android.content.ContextWrapper;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.DashPathEffect;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.ShapeDrawable;
import android.graphics.drawable.shapes.RectShape;
import android.location.Address;
import android.location.Geocoder;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.Settings;
import android.util.Log;
import android.util.SparseIntArray;
import android.util.TypedValue;
import android.view.MotionEvent;
import android.view.Surface;
import android.view.TextureView;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.webkit.MimeTypeMap;
import android.webkit.URLUtil;
import android.widget.ImageView;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Toast;

import androidx.annotation.RequiresApi;

import com.app.ps19.tipsapp.R;
import com.app.ps19.tipsapp.classes.IssueImage;
import com.app.ps19.tipsapp.classes.IssueVoice;
import com.app.ps19.tipsapp.classes.LatLong;
import com.app.ps19.tipsapp.classes.Report;
import com.app.ps19.tipsapp.classes.dynforms.DynFormList;
import com.google.android.gms.maps.model.LatLng;
import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.StringTokenizer;
import java.util.TimeZone;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static android.content.ContentValues.TAG;
import static com.app.ps19.tipsapp.Shared.Globals.FULL_DATE_FORMAT;
import static com.app.ps19.tipsapp.Shared.Globals.geocoder;
import static com.app.ps19.tipsapp.Shared.Globals.getDBContext;
import static com.app.ps19.tipsapp.Shared.Globals.isInternetAvailable;
import static com.app.ps19.tipsapp.Shared.Globals.selectedJPlan;

/**
 * Created by Ajaz Ahmad Qureshi on 7/17/2017.
 */

public class Utilities {

    private static Boolean DialogueInView = false;

    public static String timeDiffText(Date date1, Date date2){
        long different = date2.getTime() - (date1.getTime() );
        long secondsInMilli = 1000;
        long minutesInMilli = secondsInMilli * 60;
        long hoursInMilli = minutesInMilli * 60;
        long daysInMilli = hoursInMilli * 24;

        long elapsedDays = different / daysInMilli;
        different = different % daysInMilli;

        long elapsedHours = different / hoursInMilli;
        different = different % hoursInMilli;

        long elapsedMinutes = different / minutesInMilli;

        String text=""+ (elapsedDays>0?(""+elapsedDays+"d "):"") + (elapsedHours>0?(""+elapsedHours+"h "):"");
                //+ (elapsedMinutes>0?(""+elapsedMinutes+"m "):"");
        if(elapsedDays==0 && elapsedHours==0){
            text="" +elapsedMinutes +"m";
        }
        return text;

    }
    public static int getMinsBetween(Date date1, Date date2) {
        long diff=date2.getTime()-date1.getTime();
        long mins= TimeUnit.MINUTES.convert(diff, TimeUnit.MILLISECONDS);
        return Integer.parseInt("" + mins);
    }
    public static int getHoursBetween(Date date1, Date date2) {
        long diff=date2.getTime()-date1.getTime();
        long hours= TimeUnit.HOURS.convert(diff, TimeUnit.MILLISECONDS);
        return Integer.parseInt("" + hours);
    }
    public static int getDaysBetween(Date date1 , Date date2){
        long diff=date2.getTime()-date1.getTime();
        long days = TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);
        return Integer.parseInt("" + days);
    }
    public static int getPercentComplete(Date dueDate, Date expDate){
        Date today=new Date();
        long totalTimeDiff=TimeUnit.HOURS.convert(expDate.getTime()-dueDate.getTime(),TimeUnit.MILLISECONDS);
        long timePassed= TimeUnit.HOURS.convert(today.getTime()-dueDate.getTime(),TimeUnit.MILLISECONDS);
        float perc=( (float) timePassed/ (float) totalTimeDiff)*100;
        return Math.round(perc);
    }
    public static String [] split(String strText, String strDel)
    {
        if(!strDel.equals("") && !strText.equals(""))
        {
            StringTokenizer stringTokenizer=new StringTokenizer(strText,strDel);
            final int count=stringTokenizer.countTokens();
            String [] retValue=new String[count];
            for(int i=0;i<count;i++)
            {
                retValue[i]=stringTokenizer.nextToken();
            }
            return retValue;
        }
        return  null;
    }

    public static Bitmap getImageFromSDCard(Context context,String fileName)
    {
        FileOutputStream outStream = null;
        FileInputStream inputStream=null;
        Bitmap bitmap=null;
        // Read from SD Card
        try {
           /* File sdCard = Environment.getExternalStorageDirectory();
            File dir = new File (sdCard.getAbsolutePath() + "/"+Globals.imageFolderName);
            //File dir=new File(Environment.getExternalStorageDirectory(),Globals.imageFolderName);
            if(!dir.exists())
                    dir.mkdirs();
*/
            //String fileName = String.format("%d.jpg", System.currentTimeMillis());
            File inFile=new File(getImgPath(fileName));
            if(inFile.exists())
            {
                inputStream=new FileInputStream(inFile);
                 bitmap=BitmapFactory.decodeStream(inputStream);
            }

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        return  bitmap;
    }
    public static int calculateInSampleSize(
            BitmapFactory.Options options, int reqWidth, int reqHeight) {
        // Raw height and width of image
        final int height = options.outHeight;
        final int width = options.outWidth;
        int inSampleSize = 1;

        if (height > reqHeight || width > reqWidth) {

            final int halfHeight = height / 2;
            final int halfWidth = width / 2;

            // Calculate the largest inSampleSize value that is a power of 2 and keeps both
            // height and width larger than the requested height and width.
            while ((halfHeight / inSampleSize) >= reqHeight
                    && (halfWidth / inSampleSize) >= reqWidth) {
                inSampleSize *= 2;
            }
        }

        return inSampleSize;
    }
    public static Bitmap decodeSampledBitmapFromFile(String fileName,
                                                         int reqWidth, int reqHeight) {

        File dir = new File (Environment.getExternalStorageDirectory().getAbsolutePath()
                + "/"+Globals.imageFolderName);
        if(!dir.exists())
            dir.mkdirs();
        File inFile=new File(dir,fileName);
        if(!inFile.exists())
        {
            return  null;
        }
        String file_path=inFile.getPath();
            // First decode with inJustDecodeBounds=true to check dimensions
        final BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;
        //BitmapFactory.decodeResource(res, resId, options);

        BitmapFactory.decodeFile(file_path,options);
        // Calculate inSampleSize
        options.inSampleSize = calculateInSampleSize(options, reqWidth, reqHeight);

        // Decode bitmap with inSampleSize set
        options.inJustDecodeBounds = false;
        return BitmapFactory.decodeFile(file_path, options);
    }
    public static Bitmap decodeSampledBitmapFromBitmap(byte [] byteArray,
                                                     int reqWidth, int reqHeight) {

        // First decode with inJustDecodeBounds=true to check dimensions
        final BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;
        //BitmapFactory.decodeResource(res, resId, options);

        BitmapFactory.decodeByteArray(byteArray,0,byteArray.length,options);
        // Calculate inSampleSize
        options.inSampleSize = calculateInSampleSize(options, reqWidth, reqHeight);

        // Decode bitmap with inSampleSize set
        options.inJustDecodeBounds = false;
        return BitmapFactory.decodeByteArray(byteArray,0,byteArray.length, options);
    }



    public static Bitmap getImageFromSDCardSampleSize(Context context,String fileName,int inSampleSize)
    {
        FileOutputStream outStream = null;
        FileInputStream inputStream=null;
        Bitmap bitmap=null;
        // Read from SD Card
        try {
            File sdCard = Environment.getExternalStorageDirectory();
            File dir = new File (sdCard.getAbsolutePath() + "/"+Globals.imageFolderName);
            //File dir=new File(Environment.getExternalStorageDirectory(),Globals.imageFolderName);
            if(!dir.exists())
                dir.mkdirs();

            //String fileName = String.format("%d.jpg", System.currentTimeMillis());
            File inFile=new File(dir,fileName);
            if(inFile.exists())
            {
                BitmapFactory.Options options = new BitmapFactory.Options();
                options.inSampleSize = inSampleSize;

                bitmap = BitmapFactory.decodeFile(inFile.getPath(),options);
                if(bitmap!=null)
                {
                    //bitmap=Bitmap.createScaledBitmap(bitmap,320,240,false);
                }
                //inputStream=new FileInputStream(inFile);
                //bitmap=BitmapFactory.decodeStream(inputStream,);
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
        }
        return  bitmap;
    }
    public static void makeDocumentsAvailable() {

        DynFormList.loadFormList();
        ArrayList<String> fileList=DynFormList.getPdfFileList();
        for(String fileName:fileList){
            if(!isDocumentExists(fileName)) {
                makeDocAvailableEx(Globals.getDBContext(), fileName);
            }
        }
    }
    public static boolean isImageFileExists(String fileName){
        File inFile=new File(getImgPath(fileName));
        return inFile.exists();
    }
    public static boolean isDocumentExists(String fileName) {
        try {
            /*File sdCard = Environment.getExternalStorageDirectory();
            File dir = new File(sdCard.getAbsolutePath() + "/" + Globals.docFolderName);
            if (!dir.exists())
                dir.mkdirs();*/
            File inFile = new File(getDocumentPath(fileName));
            if (inFile.exists()) {
                return true;
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return false;
    }
    public static Bitmap getImageFromSDCardThumbnail(Context context,String fileName)
    {
        FileOutputStream outStream = null;
        FileInputStream inputStream=null;
        Bitmap bitmap=null;
        // Read from SD Card
        try {
           /* File sdCard = Environment.getExternalStorageDirectory();
            File dir = new File (sdCard.getAbsolutePath() + "/"+Globals.imageFolderName);
            //File dir=new File(Environment.getExternalStorageDirectory(),Globals.imageFolderName);
            if(!dir.exists())
                dir.mkdirs();*/

            //String fileName = String.format("%d.jpg", System.currentTimeMillis());
            File inFile=new File(getImgPath(fileName));
            if(inFile.exists())
            {
                BitmapFactory.Options options = new BitmapFactory.Options();
                options.inSampleSize = 8;

                bitmap = BitmapFactory.decodeFile(inFile.getPath(),options);
                if(bitmap!=null)
                {
                    bitmap=Bitmap.createScaledBitmap(bitmap,320,240,false);
                }
                //inputStream=new FileInputStream(inFile);
                //bitmap=BitmapFactory.decodeStream(inputStream,);
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
        }
        return  bitmap;
    }

    public static boolean removeImageFromInternalStorage(Context context,String fileName)
    {
        ContextWrapper cw = new ContextWrapper(context);
        // path to /data/data/yourapp/app_data/imageDir
        File directory = cw.getDir("images", Context.MODE_PRIVATE);
        // Create imageDir
        File mypath=new File(directory,fileName+".png");
        try{
            if(mypath.exists())
            {
                return mypath.delete();
            }
            return false;
        }
        catch(Exception e){
        }
        return false;
    }

    public static Bitmap getFromInternalStorage(Context context,String fileName)
    {
        ContextWrapper cw = new ContextWrapper(context);
        // path to /data/data/yourapp/app_data/imageDir
        File directory = cw.getDir("images", Context.MODE_PRIVATE);
        // Create imageDir
        File mypath=new File(directory,fileName+".png");
        try{
            FileInputStream fis = new FileInputStream(mypath);
            Bitmap b = BitmapFactory.decodeStream(fis);
            fis.close();
            return b;
        }
        catch(Exception e){
        }
        return null;
    }
    public static String saveToInternalStorage(Context context,String fileName, Bitmap bitmapImage){
        ContextWrapper cw = new ContextWrapper(context);
        // path to /data/data/yourapp/app_data/imageDir
        File directory = cw.getDir("images", Context.MODE_PRIVATE);
        // Create imageDir

        File mypath=new File(directory,fileName+".png");
        if(mypath.exists())
        {
            mypath.delete();
        }

        FileOutputStream fos = null;
        try {
            fos = new FileOutputStream(mypath);
            // Use the compress method on the BitMap object to write image to the OutputStream
            bitmapImage.compress(Bitmap.CompressFormat.PNG, 100, fos);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                fos.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return directory.getAbsolutePath();
    }
    public static long getDateDiffInDays(Date date){
        SimpleDateFormat sdf=new SimpleDateFormat("dd/MM/yyyy");
        Date today=null;
        try {
            today=sdf.parse(sdf.format(new Date()));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return TimeUnit.DAYS.convert(date.getTime()-today.getTime(),TimeUnit.MILLISECONDS );
    }
    public static Date ConvertNumberDate(String dateValue)
    {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        try {
            Date d = sdf.parse(dateValue);
            return  d;

        } catch (ParseException ex) {
            ex.printStackTrace();
            return null;
        }
    }

    public static long compareNumberTimes(String strNum1, String strNum2)
    {
        if(strNum1.equals("") || strNum2.equals(""))
        {
            return -1;
        }
        try{

            Date d1=ConvertNumberDate(strNum1);
            Date d2=ConvertNumberDate(strNum2);
            return  d1.getTime()-d2.getTime();
        }catch (Exception ex)
        {
            ex.printStackTrace();
            return -1;
        }
    }
    public static String ConvertDateToNumber(Date dateValue)
    {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        try {
            return  sdf.format(dateValue);

        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }
    public static String getTimeFromNumberDate(String dateValue)
    {
        if(dateValue.equals("") || dateValue.length()<14)
        {
            return "";
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        try {
            Date d = sdf.parse(dateValue);
            SimpleDateFormat sdf1=new SimpleDateFormat("HH:mm:ss");

            return  sdf1.format(d);

        } catch (ParseException ex) {
            ex.printStackTrace();
            return "";
        }
    }
    public static String getShortTimeFromNumberDate(String dateValue)
    {
        if(dateValue.equals("") || dateValue.length()<14)
        {
            return "";
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        try {
            Date d = sdf.parse(dateValue);
            SimpleDateFormat sdf1=new SimpleDateFormat("HH:mm");

            return  sdf1.format(d);

        } catch (ParseException ex) {
            ex.printStackTrace();
            return "";
        }
    }

    public static Date ConvertToDate(String dateValue)
    {
        SimpleDateFormat sdf = new SimpleDateFormat("MMM, dd, yyyy");
        try {
            Date d = sdf.parse(dateValue);
            return  d;

        } catch (ParseException ex) {
            ex.printStackTrace();
            return null;

        }

    }

    public static Date ConvertToDateTime(String dateValue)
    {
        SimpleDateFormat sdf = new SimpleDateFormat(Globals.defaultDateFormat);
        Date d = null;
        try {
            d = sdf.parse(dateValue);
            if(d==null){
                d = FULL_DATE_FORMAT.parse(dateValue);
            }
            return  d;

        } catch (ParseException ex) {
            try{
                d= FULL_DATE_FORMAT.parse(dateValue);
                return d;

            }catch (Exception e){
                ex.printStackTrace();
                return null;

            }

        }


    }
    public static String FormatDateTime(String dateValue, String format){
        try {
            SimpleDateFormat sdf =new SimpleDateFormat(format);
            Date dt=ConvertToDateTime(dateValue);
            return  sdf.format(dt);

        }catch (Exception e){
            e.printStackTrace();
        }
        return "";
    }
    public static String FormatDateTime(Date dateValue, String format){
        try {
            SimpleDateFormat sdf =new SimpleDateFormat(format);
            return  sdf.format(dateValue);

        }catch (Exception e){
            e.printStackTrace();
        }
        return "";
    }

    public static boolean IsDateInSOD(String dateValue){
        Date dt=ConvertToDateTime(dateValue);
        Date sod=ConvertToDateTime(Globals.SOD);
        SimpleDateFormat sdf =new SimpleDateFormat("yyyyMMdd");
        return  sdf.format(dt).equals(sdf.format(sod));
    }
    public static String getNumberDateForHourKey(Date date){
        SimpleDateFormat sdf1 = new SimpleDateFormat("yyyyMMddHH");
        return sdf1.format(date);
    }
    public static String getNumberDateForMinSecKey(Date date){
        SimpleDateFormat sdf1 = new SimpleDateFormat("mm.ss");
        return sdf1.format(date);
    }
    public static String getNumberDateForImage(String dateValue)
    {
        SimpleDateFormat sdf = new SimpleDateFormat("MMM, dd, yyyy");
        Date d=null;
        try {
            d = sdf.parse(dateValue);


        } catch (ParseException ex) {
            ex.printStackTrace();
            return null;

        }
        SimpleDateFormat sdf1 = new SimpleDateFormat("yyyyMMdd");
        try {
            return  sdf1.format(d);

        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }

    }
    public static Date dateToUTC(Date date){
        SimpleDateFormat sdf=new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
        Date gmt= null;//new Date(sdf.format(date));
        try {
            gmt = FULL_DATE_FORMAT.parse(sdf.format(date));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return gmt;
    }
    public static int getDOWFromDate(Date date)
    {
        try
        {
            Calendar c=Calendar.getInstance();
            c.setTime(date);
            return c.get(Calendar.DAY_OF_WEEK);

        }catch (Exception e)
        {
            e.printStackTrace();
        }
        return -1;
    }

    public static String getCurrNumberTime()
    {
        try
        {
            Calendar c=Calendar.getInstance();
            return ConvertDateToNumber(c.getTime());
        }catch (Exception e)
        {

        }
        return "";
    }

    public static boolean isDateChanged(String sod)
    {
        Date dtSod=ConvertToDate(sod);
        try
        {
            SimpleDateFormat sdf = new SimpleDateFormat("MMM, dd, yyyy");
            Calendar c=Calendar.getInstance();
            sdf.setCalendar(c);
            if(c.getTime().after(dtSod))
            {
                return true;
            }

        }catch (Exception e)
        {

        }
        return false;
    }
    public static String getCurrTime()
    {
        try
        {
            Calendar c=Calendar.getInstance();
            SimpleDateFormat sdf=new SimpleDateFormat("KK:mm:ss a");
            sdf.setCalendar(c);
            return sdf.format(c.getTime());
        }catch (Exception e)
        {

        }
        return "";

    }
    public static String getString(JSONArray ja, int pos)
    {
        try
        {
            return ja.getString(pos);
        }catch (Exception e)
        {
            Log.e("Utilities:getString",e.toString());
        }
        return  "";
    }
    public static int parseInt(String value)
    {
        if(value.equals(""))
        {
            return  0;
        }
        if(isNumeric(value))
        {
            return Integer.parseInt(value);
        }
        return 0;
    }
    public static boolean isNumeric(String str)
    {
        return str.matches("^(?:(?:\\-{1})?\\d+(?:\\.{1}\\d+)?)$");
    }

    public static double round(double value)
    {
        DecimalFormat decimalFormat=new DecimalFormat("00.00");
        String val=decimalFormat.format(value);
        return Double.valueOf(val);
    }
    public static String getTValue()
    {
        if(!Globals.SOD.equals("") )
        {
            Date dt=ConvertToDate(Globals.SOD);
            Calendar c=Calendar.getInstance();
            c.setTime(dt);
            return String.valueOf(c.get(Calendar.DAY_OF_MONTH));
        }
        return "";
    }

    public static List<String> removeUnRelatedImages(String sod) {
        List<String> removedList=new ArrayList<>();
        if(sod.equals(""))
        {
            return null;
        }

        final String fileStart=sod+"_";

        try {
            File sdCard = getDBContext().getExternalFilesDir(null);
            File dir = new File (sdCard + "/"+Globals.imageFolderName);
            //File dir=new File(Environment.getExternalStorageDirectory(),Globals.imageFolderName);
            if(!dir.exists())
                dir.mkdirs();

            String [] allFiles=dir.list(new FilenameFilter() {
                @Override
                public boolean accept(File dir, String filename) {
                    return filename.startsWith(fileStart) && filename.endsWith(".jpg");
                }
            });
            for(int i=0;i<allFiles.length;i++)
            {
                String fname=allFiles[i];
                removedList.add(fname);
            }
            for(String file:removedList)
            {
                File f=new File(sdCard.getAbsolutePath() + "/"+Globals.imageFolderName+"/"+file );
                f.delete();
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return removedList;
    }
    public static List<String> removeUnRelatedImages(String custCode,List<String> imageList) {
        //20170708_29_8_2_1.jpg

        List<String> removedList=new ArrayList<>();
        String sod=getNumberDateForImage(Globals.SOD);
        final String fileStart=sod+"_"+custCode+"_";

        try {
            File sdCard = Environment.getExternalStorageDirectory();
            File dir = new File (sdCard.getAbsolutePath() + "/"+Globals.imageFolderName);
            //File dir=new File(Environment.getExternalStorageDirectory(),Globals.imageFolderName);
            if(!dir.exists())
                dir.mkdirs();

            String [] allFiles=dir.list(new FilenameFilter() {
                @Override
                public boolean accept(File dir, String filename) {
                    return filename.startsWith(fileStart);
                }
            });
            for(int i=0;i<allFiles.length;i++)
            {
                String fname=allFiles[i];
                if(!imageList.contains(fname))
                {
                    removedList.add(fname);
                }
            }
            for(String file:removedList)
            {
                File f=new File(sdCard.getAbsolutePath() + "/"+Globals.imageFolderName+"/"+file );
                f.delete();

            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return removedList;
    }
    public static boolean isContain(JSONArray ja, int value)
    {
        if(ja !=null)
        {
            try {
                for (int i = 0; i < ja.length(); i++) {
                    if (ja.getInt(i) == value) {
                        return true;
                    }
                }
            }catch (Exception e)
            {
                Log.e(TAG,"isContain:"+e.toString());
            }
        }
        return  false;
    }


    public static boolean checkFloatEqual(float a, float b) {
        return Math.abs(a - b) < 0.001;
    }

    private static final int FOCUS_AREA_SIZE = 150;

    public static void addMediaToGallery(Context context, String photoPath) {
        Intent mediaScanIntent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
        File photoFile = new File(photoPath);
        Uri contentUri = Uri.fromFile(photoFile);
        mediaScanIntent.setData(contentUri);
        context.sendBroadcast(mediaScanIntent);
    }

    public static Rect calculateFocusArea(Rect sensorArraySize, int displayOrientation, TextureView textureView, MotionEvent event) {
        final int eventX = (int) event.getX();
        final int eventY = (int) event.getY();

        final int focusX;
        final int focusY;

        switch (displayOrientation) {
            case 0:
                focusX = (int)((eventX / (float)textureView.getWidth())  * (float)sensorArraySize.width());
                focusY = (int)((eventY / (float)textureView.getHeight()) * (float)sensorArraySize.height());
                break;
            case 180:
                focusX = (int)((1 - (eventX / (float)textureView.getWidth()))  * (float)sensorArraySize.width());
                focusY = (int)((1 - (eventY / (float)textureView.getHeight())) * (float)sensorArraySize.height());
                break;
            case 270:
                focusX = (int)((1- (eventY / (float)textureView.getHeight())) * (float)sensorArraySize.width());
                focusY = (int)((eventX / (float)textureView.getWidth())  * (float)sensorArraySize.height());
                break;
            case 90:
            default:
                focusX = (int)((eventY / (float)textureView.getHeight()) * (float)sensorArraySize.width());
                focusY = (int)((1 - (eventX / (float)textureView.getWidth()))  * (float)sensorArraySize.height());
                break;
        }

        int left = Math.max(focusX - FOCUS_AREA_SIZE,  0);
        int top = Math.max(focusY - FOCUS_AREA_SIZE, 0);
        int right = Math.min(left + FOCUS_AREA_SIZE  * 2, sensorArraySize.width());
        int bottom = Math.min(top + FOCUS_AREA_SIZE  * 2, sensorArraySize.width());
        return new Rect(left, top, right, bottom);
    }


    private static final int SENSOR_ORIENTATION_DEFAULT_DEGREES = 90;
    private static final int SENSOR_ORIENTATION_INVERSE_DEGREES = 270;
    private static final SparseIntArray DEFAULT_ORIENTATIONS = new SparseIntArray();
    private static final SparseIntArray INVERSE_ORIENTATIONS = new SparseIntArray();

    static {
        DEFAULT_ORIENTATIONS.append(Surface.ROTATION_0, 90);
        DEFAULT_ORIENTATIONS.append(Surface.ROTATION_90, 0);
        DEFAULT_ORIENTATIONS.append(Surface.ROTATION_180, 270);
        DEFAULT_ORIENTATIONS.append(Surface.ROTATION_270, 180);
    }

    static {
        INVERSE_ORIENTATIONS.append(Surface.ROTATION_0, 270);
        INVERSE_ORIENTATIONS.append(Surface.ROTATION_90, 180);
        INVERSE_ORIENTATIONS.append(Surface.ROTATION_180, 90);
        INVERSE_ORIENTATIONS.append(Surface.ROTATION_270, 0);
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    public static int getJpegOrientation( int sensorOrientation , int deviceOrientation) {
        deviceOrientation = -deviceOrientation;
        // Calculate desired JPEG orientation relative to camera orientation to make
        // the image upright relative to the device orientation
        int jpegOrientation = (sensorOrientation + deviceOrientation + 360) % 360;

        return jpegOrientation;
    }


    public static int getOrientation(int sensorOrientation, int displayRotation) {
        int degree = DEFAULT_ORIENTATIONS.get(displayRotation);
        switch (sensorOrientation) {
            case SENSOR_ORIENTATION_DEFAULT_DEGREES:
                degree = DEFAULT_ORIENTATIONS.get(displayRotation);
                break;
            case SENSOR_ORIENTATION_INVERSE_DEGREES:
                degree = INVERSE_ORIENTATIONS.get(displayRotation);
                break;
        }
        return degree;
    }

    public static float clamp(float value, float min, float max) {
        if (value < min) {
            return min;
        } else if (value > max) {
            return max;
        } else {
            return value;
        }
    }


    public static String getImgPath(String name) {
        File sdCard = getDBContext().getExternalFilesDir(null);
        File dir = new File(sdCard.getAbsolutePath() + "/" + Globals.imageFolderName);
        //File dir=new File(Environment.getExternalStorageDirectory(),Globals.imageFolderName);
        if (!dir.exists())
            dir.mkdirs();
        return getDBContext().getExternalFilesDir(null).getAbsolutePath() + "/" + Globals.imageFolderName
                + "/" + name;
        /*return Environment.getExternalStorageDirectory() + "/" + Globals.imageFolderName
                + "/" + name;*/
    }
    public static String getVoicePath(String name) {
        File sdCard = getDBContext().getExternalFilesDir(null);
        File dir = new File(sdCard.getAbsolutePath() + "/" + Globals.voiceFolderName);
        //File dir=new File(Environment.getExternalStorageDirectory(),Globals.imageFolderName);
        if (!dir.exists())
            dir.mkdirs();
        return getDBContext().getExternalFilesDir(null).getAbsolutePath() + "/" + Globals.voiceFolderName
                + "/" + name;
    }

    public static String getDocumentPath(String name) {
        File sdCard = getDBContext().getExternalFilesDir(null);
        File dir = new File(sdCard.getAbsolutePath() + "/" + Globals.docFolderName);
        //File dir=new File(Environment.getExternalStorageDirectory(),Globals.imageFolderName);
        if (!dir.exists())
            dir.mkdirs();
        return getDBContext().getExternalFilesDir(null).getAbsolutePath() + "/" + Globals.docFolderName
                + "/" + name;
    }

    public static boolean makeImageAvailable(String imgName) {
        String imgPath = getImgPath(imgName);
        File dir = new File(imgPath);
        String url = Globals.wsDomain + "/applicationresources/" + imgName;
        if (!dir.exists()) {

            DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));

            request.setTitle("Downloading...");  //set title for notification in status_bar
            //request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_HIDDEN);  //flag for if you want to show notification in status or not
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE);  //flag for if you want to show notification in status or not

            //String nameOfFile = "YourFileName.pdf";    //if you want to give file_name manually

            String nameOfFile = URLUtil.guessFileName(url, null, MimeTypeMap.getFileExtensionFromUrl(url)); //fetching name of file and type from server

            File f = new File(Environment.getExternalStorageDirectory() + "/" + Globals.imageFolderName);       // location, where to download file in external directory
            if (!f.exists()) {
                f.mkdirs();
            }
            request.setDestinationInExternalPublicDir(Environment.getExternalStorageDirectory() + "/" + Globals.imageFolderName, nameOfFile);
            DownloadManager downloadManager = (DownloadManager) Globals.mainActivity.getSystemService(Context.DOWNLOAD_SERVICE);
            downloadManager.enqueue(request);

        }
        return true;

    }
    public static boolean makeImageAvailableEx(Context context,ImageView thumbImage,String imgName) {
        String imgPath = getImgPath(imgName);
        File dir = new File(imgPath);
        String url = Globals.wsDomain + "/applicationresources/" + imgName;
        if (!dir.exists()) {
            String nameOfFile = URLUtil.guessFileName(url, null, MimeTypeMap.getFileExtensionFromUrl(url)); //fetching name of file and type from server

            /*File f = new File(Environment.getExternalStorageDirectory() + "/" + Globals.imageFolderName);       // location, where to download file in external directory
            if (!f.exists()) {
                f.mkdirs();
            }*/
            new ImageDownloaderTask(thumbImage,url,nameOfFile, context).execute("");
        }else{
            if(thumbImage!=null){
                Picasso.get()
                        .load(new File(getImgPath(imgName)))
                        .resize(150, 150)
                        .placeholder(R.drawable.no_image)
                        .error(R.drawable.no_image)
                        .into(thumbImage);
                //thumbImage.setImageBitmap(getImageFromSDCardThumbnail(context,imgName));
            }
        }
        return true;

    }
    public static boolean makeVoiceAvailableEx(Context context,String voiceName) {
        String imgPath = getVoicePath(voiceName);
        File dir = new File(imgPath);
        String url = Globals.wsDomain + "/audio/" + voiceName;
        if (!dir.exists()) {
            String nameOfFile = URLUtil.guessFileName(url, null, MimeTypeMap.getFileExtensionFromUrl(url)); //fetching name of file and type from server

            /*File f = new File(Environment.getExternalStorageDirectory() + "/" + Globals.voiceFolderName);       // location, where to download file in external directory
            if (!f.exists()) {
                f.mkdirs();
            }*/
            new VoiceDownloaderTask(url,nameOfFile, context).execute("");
        }
        return true;
    }
    public static boolean makeDocAvailableEx(Context context,String docName) {
        String documentPath = getDocumentPath(docName);
        File f1 = new File(documentPath);
        String url = Globals.wsDomain + "/giTestForms/" + docName;
        if (!f1.exists()) {
            String nameOfFile = URLUtil.guessFileName(url, null, MimeTypeMap.getFileExtensionFromUrl(url)); //fetching name of file and type from server
            new DocDownloaderTask(url,nameOfFile, context).execute("");
        }
        return true;
    }

    /**
     * Function to convert milliseconds time to
     * Timer Format
     * Hours:Minutes:Seconds
     */
    public static String formatMilliSecond(long milliseconds) {
        String finalTimerString = "";
        String secondsString = "";

        // Convert total duration into time
        int hours = (int) (milliseconds / (1000 * 60 * 60));
        int minutes = (int) (milliseconds % (1000 * 60 * 60)) / (1000 * 60);
        int seconds = (int) ((milliseconds % (1000 * 60 * 60)) % (1000 * 60) / 1000);

        // Add hours if there
        if (hours > 0) {
            finalTimerString = hours + ":";
        }

        // Prepending 0 to seconds if it is one digit
        if (seconds < 10) {
            secondsString = "0" + seconds;
        } else {
            secondsString = "" + seconds;
        }

        finalTimerString = finalTimerString + minutes + ":" + secondsString;

        //      return  String.format("%02d Min, %02d Sec",
        //                TimeUnit.MILLISECONDS.toMinutes(milliseconds),
        //                TimeUnit.MILLISECONDS.toSeconds(milliseconds) -
        //                        TimeUnit.MINUTES.toSeconds(TimeUnit.MILLISECONDS.toMinutes(milliseconds)));

        // return timer string
        return finalTimerString;
    }
    public final static double AVERAGE_RADIUS_OF_EARTH_KM = 6371;
    public final static double AVERAGE_RADIUS_OF_EARTH_M = 6371000;
    public static int calculateDistanceInMeters(double userLat, double userLng,
                                            double userLat1, double userLng1) {

        double latDistance = Math.toRadians(userLat - userLat1);
        double lngDistance = Math.toRadians(userLng - userLng1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(userLat)) * Math.cos(Math.toRadians(userLat1))
                * Math.sin(lngDistance / 2) * Math.sin(lngDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return (int) (Math.round(AVERAGE_RADIUS_OF_EARTH_M * c));
    }
    public static int calculateDistanceInMeters(LatLng userLoc,
                                                LatLng userLoc1){
        return calculateDistanceInMeters(userLoc.latitude,userLoc.longitude
                , userLoc1.latitude,userLoc1.longitude);
    }
    public static String getLocationDescription(LatLong location, Context _context){
        try {
            Geocoder myLocation = new Geocoder(_context, Locale.getDefault());
            List<Address> myList = myLocation.getFromLocation(Double.parseDouble(location.getLat()), Double.parseDouble(location.getLon()), 1);
            Address address = (Address) myList.get(0);
            String addressStr = "";
            //addressStr += address.getPremises();
            addressStr += (address.getAddressLine(0)!=null?(address.getAddressLine(0) + ""):"");
            //addressStr += address.getAddressLine(1) + ", ";
            //addressStr += address.getAddressLine(2);
            return addressStr;
        }catch (Exception e){
            Toast.makeText(_context, "Please restart device to resolve Address!", Toast.LENGTH_SHORT).show();
            e.printStackTrace();
        }
        return  "";
    }
    public static Double parseDoubleWithLimit(String value){
        String [] values = split(value,".");
        String dValue ="";
        if(values.length==2){
            if(values[1].length()>7){
                values[1]= values[1].substring(0,7);
            }
            dValue=values[0] + "." + values[1];
        }else{
            if(value.equals("")){
                dValue="0";
            }else{
                dValue=value;
            }
        }
        try{
            return  Double.parseDouble(dValue);
        }catch (Exception e){
            return 0d;
        }
    }
    public static String getLocationDescription(Context _context, Double latitude, Double longitude){
        try {
            Geocoder myLocation = new Geocoder(_context, Locale.getDefault());
            List<Address> myList = myLocation.getFromLocation(latitude, longitude, 1);
            Address address = (Address) myList.get(0);
            String addressStr = "";
            //addressStr += address.getPremises();
            addressStr += (address.getAddressLine(0)!=null?(address.getAddressLine(0) + ""):"");
            //addressStr += address.getAddressLine(1) + ", ";
            //addressStr += address.getAddressLine(2);
            return addressStr;
        }catch (Exception e){
            e.printStackTrace();
        }
        return  "";
    }
    public static String getUniqueId(){
        return UUID.randomUUID().toString();
    }
    public static boolean isNetworkAvailable(Context context) {
        ConnectivityManager connectivityManager
                = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetworkInfo = null;
        if (connectivityManager != null) {
            activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
        }
        return activeNetworkInfo != null && activeNetworkInfo.isConnected();
    }
    public static int getDp(Context _context, int size){
        Resources r = _context.getResources();
        return (int) TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP,
                size,
                r.getDisplayMetrics()
        );
    }
    public static String getLocationAddress(Context context, String latitude, String longitude){
        try {
            if(isInternetAvailable(getDBContext())){
                //Geocoder myLocation = new Geocoder(context, Locale.getDefault());
                List<Address> myList = geocoder.getFromLocation(Double.parseDouble(latitude), Double.parseDouble(longitude), 1);
                if(myList.size() > 0) {
                    Address address = (Address) myList.get(0);
                    String addressStr = "";
                    addressStr += (address.getAddressLine(0) != null ? (address.getAddressLine(0) + "") : "");
                    return addressStr;
                }else{
                    return "";
                }
            }
        }catch (IOException e){
            if(!e.equals("grpc failed")) {
                e.printStackTrace();
            }
        }

        return  "";
    }

    /**
     * created by: zqureshi
     * Function to check whether the value is within the range or not
     * param format : double
     * a: start value
     * b: end value
     * c: value which needs to be checked
     */
    public static boolean isInRange(double a, double b, double c) {
        if (b > a) {
            if (c >= a && c <= b) return true;
            else return false;
        } else {
            if (c >= b && c <= a) return true;
            else return false;
        }
    }
   public static void selectFirstVisibleRadioButton(RadioGroup radioGroup) {

        int childCount = radioGroup.getChildCount();

        for (int i = 0; i < childCount; i++) {
            RadioButton rButton = (RadioButton) radioGroup.getChildAt(i);

            if (rButton.getVisibility() == View.VISIBLE) {
                rButton.setChecked(true);
                return;
            }

        }

    }
    //This method is used in Task class and DynFormControl
    public static HashMap<String, String> convertJsonArrayToHashMap(JSONArray ja){
        HashMap<String , String > map=new HashMap<>();
        for(int i=0;i<ja.length();i++){
            try {
                JSONObject jo=ja.optJSONObject(i);
                if(jo!=null && jo.length()>0) {
                    String id = jo.getString("id");
                    String value = jo.getString("value");
                    map.put(id, value);
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return map;
    }
    public static HashMap<String, Object> putHashMapJSONObject(HashMap<String, Object> hmBackupValues ,JSONObject jo){
        if(hmBackupValues==null){
            hmBackupValues=new HashMap<String, Object>();
        }
        for (Iterator<String> it = jo.keys(); it.hasNext(); ) {
            String key = it.next();
            try {
                hmBackupValues.put(key,jo.get(key));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return hmBackupValues;
    }
    public static HashMap<String , Object> getHashMapJSONObject(JSONObject jo){
        HashMap<String , Object> hmBackupValues=new HashMap<>();
        for (Iterator<String> it = jo.keys(); it.hasNext(); ) {
            String key = it.next();
            try {
                if(!(jo.get(key) instanceof JSONObject || jo.get(key) instanceof JSONArray)){
                    hmBackupValues.put(key,jo.get(key));
                }else if(jo.get(key) instanceof JSONArray){
                    hmBackupValues.put(key,jo.getJSONArray(key));
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return hmBackupValues;
    }
    public static JSONObject addObject(JSONObject mainObject, JSONObject targetObject) {
        for (Iterator<String> it = targetObject.keys(); it.hasNext(); ) {
            try {
                String key = it.next();
                Object value = targetObject.get(key);
                String sKey=key;
                if(key.charAt(0)=='*'){
                    sKey=key.substring(1);
                }else{
                    sKey="*" + key;
                }

                if (!mainObject.has(key) && !mainObject.has(sKey)) {
                    // new value for "key":
                    mainObject.put(key, value);
                }
                else {
                    if (value instanceof JSONObject) {
                        JSONObject mainObjectPortion = (JSONObject) mainObject.get(key);
                        addObject(mainObjectPortion, targetObject.getJSONObject(key));
                    }else if (value instanceof JSONArray) {

                        if(mainObject.has(key)){
                            JSONArray mainPortion = (JSONArray) mainObject.get(key);
                            if(key.indexOf(0)=='*') {
                                if(mainObject.has(sKey)){
                                    mainObject.remove(sKey);
                                }
                                mainPortion = new JSONArray();
                            }
                            addArray(mainPortion, targetObject.getJSONArray(key));
                        } else{
                            if(mainObject.has(sKey) && sKey.charAt(0)!='*'){
                                mainObject.remove(sKey);
                            }
                            if(sKey.charAt(0)!='*') {
                                mainObject.put(sKey, targetObject.getJSONArray(key));
                            }else{
                                JSONArray mainPortion=mainObject.getJSONArray(sKey);
                                addArray(mainPortion, targetObject.getJSONArray(key));
                            }
                        }
                        /*
                        if(mainObject.has(key)) {
                            JSONArray mainPortion = (JSONArray) mainObject.get(key);
                            addArray(mainPortion, targetObject.getJSONArray(key));
                        }else if(mainObject.has(sKey)){
                            JSONArray mainPortion = (JSONArray) mainObject.get(sKey);
                            if(targetObject.has(key)) {
                                addArray(mainPortion, targetObject.getJSONArray(key));
                            }else{
                                addArray(mainPortion, targetObject.getJSONArray(sKey));
                            }
                        }*/
                    }
                    else{
                        mainObject.put(key,value);
                    }
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return mainObject;
    }
    public static JSONArray addArray(JSONArray mainArray, JSONArray targetArray)throws JSONException{
        for(int i=0;i<targetArray.length();i++){
            if(mainArray.length()<=i){
                mainArray.put(targetArray.get(i));
            }
            if(!targetArray.isNull(i)){
                Object value=targetArray.get(i);
                if(value instanceof JSONObject){
                        JSONObject mainObject=mainArray.getJSONObject(i);
                        JSONObject targetObject=targetArray.getJSONObject(i);
                        mainObject=addObject(mainObject,targetObject);
                        mainArray.put(i,mainObject);
                }else {
                    mainArray.put(i, targetArray.get(i));
                }
            }
        }
        return mainArray;
    }

    public static JSONObject mergeObject(JSONObject mainObject, JSONObject targetObject) throws JSONException{
        for (Iterator<String> it = targetObject.keys(); it.hasNext(); ) {
            String key = it.next();
            Object value = targetObject.get(key);
            String sKey=key;
            if(key.charAt(0)=='*'){
                sKey=key.substring(1);
            }else{
                sKey="*" + key;
            }

            String mainKey = key.charAt(0) == '*' ? key.substring(1) : key;
            if (!mainObject.has(key) && !mainObject.has(sKey)) {
                // new value for "key":
                mainObject.put(mainKey, value);
            }
            else {
                if (value instanceof JSONObject) {
                    JSONObject mainObjectPortion = (JSONObject) mainObject.get(key);
                    mergeObject(mainObjectPortion, targetObject.getJSONObject(key));
                }else if (value instanceof JSONArray) {

                    if(mainObject.has(key)){
                        JSONArray mainPortion = (JSONArray) mainObject.get(key);
                        if(key.indexOf(0)=='*') {
                            if(mainObject.has(sKey)){
                                mainObject.remove(sKey);
                            }
                            mainPortion = new JSONArray();
                        }
                        mergeArray(mainPortion, targetObject.getJSONArray(key));
                    } else{
                        if(mainObject.has(sKey) && sKey.charAt(0)!='*'){
                            mainObject.remove(sKey);
                        }
                        if(sKey.charAt(0)!='*') {
                            mainObject.put(mainKey, targetObject.getJSONArray(key));
                        }else{
                            JSONArray mainPortion=mainObject.getJSONArray(sKey);
                            mergeArray(mainPortion, targetObject.getJSONArray(key));
                        }
                    }
                }
                else{
                    mainObject.put(mainKey,value);
                }
            }
        }
        return mainObject;
    }
    public static JSONArray mergeArray(JSONArray mainArray, JSONArray targetArray)throws JSONException{
        for(int i=0;i<targetArray.length();i++){
            if(mainArray.length()<=i){
                mainArray.put(targetArray.get(i));
            }
            if(!targetArray.isNull(i)){
                Object value=targetArray.get(i);
                if(value instanceof JSONObject){
                    JSONObject mainObject=mainArray.getJSONObject(i);
                    JSONObject targetObject=targetArray.getJSONObject(i);
                    mainObject=mergeObject(mainObject,targetObject);
                    mainArray.put(i,mainObject);
                }else {
                    mainArray.put(i, targetArray.get(i));
                }
            }
        }
        return mainArray;
    }

    public static JSONObject deepMerge(JSONObject source, JSONObject target) throws JSONException {
        for (Iterator<String> it = source.keys(); it.hasNext(); ) {
            String key = it.next();
            Object value = source.get(key);
            if (!target.has(key)) {
                // new value for "key":
                target.put(key, value);
            } else {
                // existing value for "key" - recursively deep merge:
                if (value instanceof JSONObject) {
                    JSONObject valueJson = (JSONObject)value;
                    deepMerge(valueJson, target.getJSONObject(key));
                } else if(value instanceof  JSONArray){
                    JSONArray ja=target.getJSONArray(key);
                    JSONArray valueJson=(JSONArray) value;
                    for(int i=0;i<valueJson.length();i++){
                        Object value1=valueJson.get(i);
                        ja.put(i,value1);
                        /*
                        if (value1 instanceof JSONObject) {
                            JSONObject valueJson1 = (JSONObject) value;
                            deepMerge(valueJson1, target.getJSONObject(key));

                        }
                        */
                    }
                }
                else {
                    target.put(key, value);
                }
            }
        }
        return target;
    }
//    public static boolean isGPSEnabled(Context mContext) {
//        if (locationManager != null) {
//            return locationManager.getAllProviders().contains(LocationManager.GPS_PROVIDER);
//            //return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
//        } else {
//            locationManager = (LocationManager) mContext.getSystemService(LOCATION_SERVICE);
//            return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
//        }
//    }
//    public static boolean isNetworkProviderAvailable(Context mContext) {
//        // flag for network status
//        if (locationManager == null) {
//            locationManager = (LocationManager) mContext.getSystemService(LOCATION_SERVICE);
//        };
//        return locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
//    }
    /**
     * Function to check GPS/wifi enabled
     *
     * @return boolean
     */

//    public static boolean canGetLocation(Context mContext) {
//        boolean canGetLocation = false;
//        if(isGPSEnabled(mContext)){
//            canGetLocation = true;
//        } else canGetLocation = isNetworkProviderAvailable(mContext);
//        return canGetLocation;
//    }
    public static Drawable createDashedLined() {
        ShapeDrawable sd = new ShapeDrawable(new RectShape());
        Paint fgPaintSel = sd.getPaint();
        fgPaintSel.setColor(Color.BLUE);
        fgPaintSel.setStyle(Paint.Style.STROKE);
        fgPaintSel.setStrokeWidth(4f);
        fgPaintSel.setPathEffect(new DashPathEffect(new float[]{20, 10}, 0));
        return sd;
    }
    /**
     * Function to show settings alert dialog
     * On pressing Settings button will launch Settings Options
     */

    public static void showSettingsAlert(final Context mContext) {

        if (DialogueInView) {return;}
        DialogueInView = true;
        AlertDialog.Builder alertDialog = new AlertDialog.Builder(mContext);

        // Setting Dialog Title
        alertDialog.setTitle("GPS settings");

        // Setting Dialog Message
        alertDialog.setMessage("GPS is not enabled. Do you want to go to settings ?");

        // On pressing Settings button
        alertDialog.setPositiveButton("Settings", new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int which) {
                Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                mContext.startActivity(intent);
            }
        });

        // on pressing cancel button
        alertDialog.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int which) {
                dialog.cancel();
                DialogueInView = false;
            }
        });

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            alertDialog.setOnDismissListener(new DialogInterface.OnDismissListener() {
                public void onDismiss(final DialogInterface dialog) {
                    DialogueInView = false;
                }
            });
        }

        // Showing Alert Message
        alertDialog.show();
    }

    public static boolean isImageExist(List<IssueImage> images, IssueImage image){
        for(IssueImage _image: images){
            if(_image.getImgName().equals(image.getImgName())){
                return true;
            }
        }
        return false;
    }
    public static boolean isVoiceExist(List<IssueVoice> voices, IssueVoice voice){
        for(IssueVoice _voice: voices){
            if(_voice.getVoiceName().equals(voice.getVoiceName())){
                return true;
            }
        }
        return false;
    }
    public static boolean isValidDate(String inDate, boolean isMomentDate) {
        //SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss:ms");
        //dateFormat.setLenient(false);
        try {
            if(isMomentDate){
                SimpleDateFormat sdf=new SimpleDateFormat(Globals.momentDateFormat);
                sdf.parse(inDate);
                return true;
            }
            Date dt = DateFormat.getDateInstance().parse(inDate);
            //dateFormat.parse(inDate.trim());
        } catch (ParseException pe) {
            return false;
        }
        return true;
    }
    public static String formatMomentDate(String date){
        Date sDate= null;
        try {
            //sDate = DateFormat.getDateInstance().parse(date);
            sDate=new Date(date);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        return  formatMomentDate(sDate);
    }

    public static String formatMomentDate(Date date){
        SimpleDateFormat sdf=new SimpleDateFormat(Globals.momentDateFormat);
        return  sdf.format(date);
    }

    public static Date parseMomentDate(String date){
        SimpleDateFormat sdf=new SimpleDateFormat(Globals.momentDateFormat);
        Date date1= null;
        try {
            date1 = sdf.parse(date);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return  date1;
    }

    public static int[] elapsedCalculator(Date date1, Date date2){
        // retObj[0] - elapsed days
        // retObj[1] - elapsed hours
        // retObj[2] - elapsed min
        // retObj[3] - elapsed sec
        int [] retValue={0,0,0,0};
        TimeZone tz = TimeZone.getDefault();
        Date now = new Date();
        int offsetFromUtc = tz.getOffset(now.getTime()); // / 3600000;
        offsetFromUtc=0;
        long different = date1.getTime() - (date2.getTime() + offsetFromUtc);
        long secondsInMilli = 1000;
        long minutesInMilli = secondsInMilli * 60;
        long hoursInMilli = minutesInMilli * 60;
        long daysInMilli = hoursInMilli * 24;
        long elapsedDays = different / daysInMilli;
        different = different % daysInMilli;
        long elapsedHours = different / hoursInMilli;
        different = different % hoursInMilli;
        long elapsedMinutes = different / minutesInMilli;
        different = different % minutesInMilli;
        long elapsedSeconds = different / secondsInMilli;
        retValue[0]=parseInt(""+ elapsedDays);
        retValue[1]=parseInt(""+ elapsedHours);
        retValue[2]=parseInt(""+ elapsedMinutes);
        retValue[3]=parseInt(""+ elapsedSeconds);
        return  retValue;
    }

    public static int checkColorValue(String configValue, String fallback) {
        int colorValue=Color.parseColor(fallback);
        try{
            colorValue=Color.parseColor(configValue);
        }catch (Exception ignore){ }
        return colorValue;
    }
public static int getFilteredNewIssues(String id){
        int count = 0;

        if(selectedJPlan!=null){
            for (Report issue: selectedJPlan.getTaskList().get(0).getReportList()){
                if(issue.getUnit().getUnitId().equals(id)){
                    count++;
                }
            }
        }
        return count;
}
    public static float dpToPixel(Context context, int dp) {
        Resources r = context.getResources();
        float px = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, dp, r.getDisplayMetrics());
        return px;
    }
    public static void showKeyboard(Context context){
        InputMethodManager inputMethodManager = (InputMethodManager) context.getSystemService(Context.INPUT_METHOD_SERVICE);
        inputMethodManager.toggleSoftInput(InputMethodManager.SHOW_FORCED, 0);
    }
    public static void closeKeyboard(Context context){
        InputMethodManager inputMethodManager = (InputMethodManager) context.getSystemService(Context.INPUT_METHOD_SERVICE);
        inputMethodManager.toggleSoftInput(InputMethodManager.HIDE_IMPLICIT_ONLY, 0);
    }
}

