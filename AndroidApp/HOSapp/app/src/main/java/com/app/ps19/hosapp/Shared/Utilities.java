package com.app.ps19.hosapp.Shared;

import android.app.DownloadManager;
import android.content.Context;
import android.content.ContextWrapper;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.location.Address;
import android.location.Geocoder;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Environment;
import android.util.Log;
import android.util.TypedValue;
import android.webkit.MimeTypeMap;
import android.webkit.URLUtil;
import android.widget.ImageView;
import android.widget.Toast;


import com.app.ps19.hosapp.R;
import com.app.ps19.hosapp.classes.LatLong;
import com.google.android.gms.maps.model.LatLng;
import com.squareup.picasso.Picasso;

import org.json.JSONArray;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.StringTokenizer;
import java.util.TimeZone;
import java.util.UUID;

import static android.content.ContentValues.TAG;

/**
 * Created by Ajaz Ahmad Qureshi on 7/17/2017.
 */

public class Utilities {
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
            File sdCard = Environment.getExternalStorageDirectory();
            File dir = new File (sdCard.getAbsolutePath() + "/"+Globals.imageFolderName);
            //File dir=new File(Environment.getExternalStorageDirectory(),Globals.imageFolderName);
            if(!dir.exists())
                    dir.mkdirs();

            //String fileName = String.format("%d.jpg", System.currentTimeMillis());
            File inFile=new File(dir,fileName);
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

    public static Bitmap getImageFromSDCardThumbnail(Context context,String fileName)
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
                d = new Date(dateValue);
            }
            return  d;

        } catch (ParseException ex) {
            try{
                d=new Date(dateValue);
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
        Date gmt=new Date(sdf.format(date));
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
            File sdCard = Environment.getExternalStorageDirectory();
            File dir = new File (sdCard.getAbsolutePath() + "/"+Globals.imageFolderName);
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

    public static String getImgPath(String name) {
        return Environment.getExternalStorageDirectory() + "/" + Globals.imageFolderName
                + "/" + name;
    }
    public static String getVoicePath(String name) {
        return Environment.getExternalStorageDirectory() + "/" + Globals.voiceFolderName
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

            File f = new File(Environment.getExternalStorageDirectory() + "/" + Globals.imageFolderName);       // location, where to download file in external directory
            if (!f.exists()) {
                f.mkdirs();
            }
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

            File f = new File(Environment.getExternalStorageDirectory() + "/" + Globals.voiceFolderName);       // location, where to download file in external directory
            if (!f.exists()) {
                f.mkdirs();
            }
            new VoiceDownloaderTask(url,nameOfFile, context).execute("");
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
            Geocoder myLocation = new Geocoder(context, Locale.getDefault());
            List<Address> myList = myLocation.getFromLocation(Double.parseDouble(latitude), Double.parseDouble(longitude), 1);
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
}
