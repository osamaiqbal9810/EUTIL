package com.app.ps19.scimapp.Shared;

import com.app.ps19.scimapp.LampApplication;
import com.app.ps19.scimapp.camera.Size;
import com.app.ps19.scimapp.classes.LocItem;
import com.app.ps19.scimapp.classes.LocationPrefix;
import com.app.ps19.scimapp.classes.Session;
import com.app.ps19.scimapp.classes.User;
import com.app.ps19.scimapp.classes.ativ.ATIVDefect;
import com.app.ps19.scimapp.classes.maintenance.Maintenance;
import com.app.ps19.scimapp.classes.maintenance.MaintenanceList;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.bumptech.glide.request.RequestOptions;
import com.google.android.gms.maps.model.LatLng;
import com.google.common.collect.ArrayListMultimap;
import com.google.common.collect.Multimap;
import android.app.Activity;
import android.app.ProgressDialog;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationManager;
import android.media.MediaPlayer;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.preference.PreferenceManager;
import androidx.annotation.AnyRes;
import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.Observer;

import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.view.animation.LinearInterpolator;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.app.ps19.scimapp.DashboardActivity;
import com.app.ps19.scimapp.LoginActivity;
import com.app.ps19.scimapp.R;
import com.app.ps19.scimapp.classes.AssetType;
import com.app.ps19.scimapp.classes.DUnit;
import com.app.ps19.scimapp.classes.Inbox;
import com.app.ps19.scimapp.classes.IssueImage;
import com.app.ps19.scimapp.classes.IssueVoice;
import com.app.ps19.scimapp.classes.JourneyPlan;
import com.app.ps19.scimapp.classes.LatLong;
import com.app.ps19.scimapp.classes.MD5Util;
import com.app.ps19.scimapp.classes.Report;
import com.app.ps19.scimapp.classes.RptTimeAndGPS;
import com.app.ps19.scimapp.classes.SafetyBriefingForm;
import com.app.ps19.scimapp.classes.Task;
import com.app.ps19.scimapp.classes.Units;
import com.app.ps19.scimapp.classes.Worker;
import com.app.ps19.scimapp.classes.dynforms.DynForm;
import com.app.ps19.scimapp.classes.version.VersionInfo;
import com.bumptech.glide.Glide;
import com.google.gson.Gson;
import com.koushikdutta.async.future.FutureCallback;
import com.koushikdutta.ion.Ion;
import com.mikhaellopez.circularimageview.CircularImageView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;

import static android.content.ContentValues.TAG;
import static com.app.ps19.scimapp.Shared.Utilities.getImgPath;
import static com.app.ps19.scimapp.Shared.Utilities.getVoicePath;
import static com.app.ps19.scimapp.Shared.Utilities.isImageFileExists;

/**
 * Created by Ajaz Ahmad Qureshi on 5/24/2017.
 */

public  class Globals {
    public static String lastConnectionError="";
    public static LampApplication app=LampApplication.getInstance();
    //public static String wsBaseURL="http://10.0.2.2:58836/api/";
    public enum AppName {
        TIMPS,
        SCIM,
        EUIS // for the time being please enable isEUISActive true to use electric app as a SITE
    }

    //Geofencing Values
    public static final float GEOFENCE_RADIUS_IN_METERS = 30; //in meters

    /**
     * Map for storing information about airports in the San Francisco bay area.
     */

    public static final HashMap<String, LatLng> AREA_LANDMARKS = new HashMap<>();
    static {
        AREA_LANDMARKS.put("1", new LatLng(31.502564800077806, 74.35019857948089));
        AREA_LANDMARKS.put("2", new LatLng(31.502856664769382, 74.34899081885031));
        AREA_LANDMARKS.put("3", new LatLng(31.5031722549542, 74.34780528247475));
        AREA_LANDMARKS.put("4", new LatLng(31.50366250389813, 74.34624758960958));
        AREA_LANDMARKS.put("5", new LatLng(31.50405470120101, 74.34478310348399));
        AREA_LANDMARKS.put("6", new LatLng(31.504696163222878, 74.34239861963701));
        AREA_LANDMARKS.put("7", new LatLng(31.50628093286129, 74.33653665187101));
        AREA_LANDMARKS.put("8", new LatLng(31.503955222746548, 74.34556228519281));
        AREA_LANDMARKS.put("9", new LatLng(31.502800350112945, 74.35030174851542));
        AREA_LANDMARKS.put("10", new LatLng(31.501982783134316, 74.35731850328798));
    }


    public static boolean GPS_REQUIRED = true;


    //public static AppName appName = AppName.TIMPS;
    public static AppName appName = AppName.SCIM;
    public static boolean testApp=true;
    public static DBHandler db;
    public static String momentDateFormat="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

    public static boolean offlineMode=true;
    public static Context dbContext=null;
    public static final String AppVer="1.07";
    public static String AppVerReq="";
    public static boolean enforceVer=false;
    public static String ApkDownloadURL="";
    public static String ApkDownloadSize="";
    //public static String wsDomainName ="172.19.3.141:3005";
    //public static String wsDomainName = "172.19.3.137";
    public static String wsDomainName = "timps1.eastus.cloudapp.azure.com";
    public static String defaultServerName = "SITE";
    //public static String wsDomainName ="tips1.southeastasia.cloudapp.azure.com";
    public static String wsPort="80";
    //public static String wsPort = "3005";
    //public static String wsDomain = getWsDomain();
    public static String wsBaseURL;//=getWsDomain()+"/api/";
    public static String wsImgURL;// = getWsDomain() + "/applicationresources/";
    public static String wsVersionUrl;// = "/api/version";
    //public  static  String wsImageURL=wsDomain +"/images/";
    public static String wsReportURL;//=wsBaseURL+"Reports/";
    // This port value should be assigned by Dev
    public static String wsWebPort = ""; // For example :4001
    public static String emailCrashReport = "ps19test@gmail.com"; // Provide email address to receive crash log


    public static File selectedPdf;

    public static final String ROUTE_PLAN_LIST_NAME="RoutePlanList";
    public static final String VISIT_TASK_LIST_NAME="VisitTaskList";
    public static final String USER_SOD_LIST_NAME="UserSODList";
    public static final String APPLICATION_LOOKUP_LIST_NAME = "ApplicationLookups";
    public static final String SOD_LIST_NAME = "SOD";
    public static final String CATEGORY_LIST_NAME = "AssetTypes";
    public static final String PRIORITY_LIST_NAME = "Priority";
    public static final String JPLAN_LIST_NAME = "JourneyPlan";
    public static final String WPLAN_TEMPLATE_LIST_NAME = "WorkPlanTemplate";
    public static final String GPS_LOG_LIST_NAME = "GpsLog";
    public static final String APP_SETTINGS_LIST_NAME = "AppSettings";
    public static final String LOCATION_PREFIX_LIST_NAME = "LocationPrefix";
    public static final String REM_ACTION_LIST_NAME = "remedialAction";
    public static final String APP_FORMS_LIST_NAME = "appForms";
    public static final String APP_CONFIG_LIST_NAME = "config";
    public static final String APP_INFO_TABLE_LIST_NAME = "appInfoTable";
    public static final String APP_LOCATION_MARKER_LIST_NAME = "alphaNumericMilepostIOC";
    public static final String RUN_LIST_NAME = "Run";
    public static final String MAINTENANCE_LIST_NAME = "Maintenance";
    public static final String ASSET_TYPE_SIDE_TRACK = "Side Track";


    public static String LOGIN_ERROR="";
    public static Inbox inbox;

    public static final  String VISIT_MSG_LIST_NAME="VisitMsgList";
    public static final String imageFolderName="tips_data_img";
    public static final String voiceFolderName="tips_data_voice";
    public static final String docFolderName="tips_data_docs";
    public static final String logFolderName="tips_data_logs";
    public static final String  OBSERVABLE_MESSAGE_DATA_CHANGED ="1";
    public static final String  OBSERVABLE_MESSAGE_DATA_SENT ="2";
    public static final String  OBSERVABLE_MESSAGE_NETWORK_PULL ="3";
    public static final String  OBSERVABLE_MESSAGE_NETWORK_PUSH ="4";
    public static final String  OBSERVABLE_MESSAGE_NETWORK_CONNECTED ="5";
    public static final String  OBSERVABLE_MESSAGE_NETWORK_DISCONNECTED ="6";
    public static final String  OBSERVABLE_MESSAGE_UPLOADING_IMAGE ="7";
    public static final String  OBSERVABLE_MESSAGE_TOKEN_STATUS ="8";
    public static final String  OBSERVABLE_MESSAGE_LANGUAGE_CHANGED ="9";


    public static SharedPref mPrefs;
    public static Uri imageFileUri;
    public static String imageFileName="";
    public static final long MIN_UPDATE_INTERVAL=15000;
    public static boolean blnNetAvailable=false;
    public static String appid="";
    public static String appid_temp="";
    public static String orgCode = "ps19";
    public static String userID="";
    public static String empCode = "emp1";
    public static String userToken = "";
    public static User user = null;
    public static int lastWsReturnCode=0;
    public static boolean tokenExpired=false;

    public static final int WS_RET_SUCCESS =200;
    public static final int WS_RET_UNAUTHORIZED =401;
    public static final int WS_RET_FORBIDDEN =403;

    public static DynForm selectedForm=null;
    public static boolean isPullInProgress = false;
    public static boolean isDataPopulated = false;
    public static String lastError = "";
    public volatile static boolean isServiceProcessing=false;
    public static Geocoder geocoder;
    // Declaring a Location Manager
    protected static LocationManager locationManager;

    public static enum TimeEventType{
        teUndefined,
        teDayStart,
        teDayClosed,
        teTaskStart,
        teTaskCompleted,
        teIssuePosted
    }

    public static int empType=0;
    public static String employeeName="";
    public static JSONObject empParams=null;
    public static String defaultDateFormat="yyyy-MM-dd'T'HH:mm:ss.SSS";


    public static String SOD="";
    public static String sodStartLocation = "";
    public static String sodEndLocation = "";
    public static String sodId = "";
    public static boolean isDayProcessRunning=false;
    public static boolean isSODSyncRequired=false;
    public static boolean isDbLocked = false;


    public static String startOfDayTime="";
    public static String endOfDayTime="";
    public static boolean dayStarted=false;
    public static  boolean currDayLocked=false;
    public static boolean downloadCompleted=false;
    public static String timeStamp="";
    public static long lastConnTimeDiff=0;

    public static boolean versionMismatch=false;

    public static boolean inProcess = false;
    public static boolean ListUpdated=false;

    public static boolean visitLockOption=true;
    public static boolean visitUnlockOption=false;
    public static boolean invoiceEditOption=false;


    public static String mstrCurrFragment="";

    /*Settings*/
    public static boolean IsAutoUpdateEnabled;
    public static int intAutoUpdateTimeOut;
    public static long lngAutoUpdateTimeOut=15000;

    public static final int SERVICE_AVAILABLE=0;
    public static int serviceHandle=SERVICE_AVAILABLE;

    public static final String SETTINGS_LIST_NAME="settings";
    public static final String SETTING_AUTO_START = "1";
    public static final String SETTING_TIMESTAMP = "2";
    public static final String SETTING_TIME_LAST_CONN = "3";

    public static final int MESSAGE_STATUS_CREATED=0;
    public static final int MESSAGE_STATUS_READY_TO_POST=1;
    public static final int MESSAGE_STATUS_POSTED=2;
    public static final int MESSAGE_STATUS_REPLIED=3;
    public static final int MESSAGE_STATUS_ERROR=9;

    public static final int SERVICE_STATUS_NOT_CONNECTED =0;
    public static final int SERVICE_STATUS_CONNECTED =1;
    public static final int SERVICE_STATUS_PULL =2;
    public static final int SERVICE_STATUS_PUSH =3;

    public static final int EMPLOYEE_TYPE_ORDER=0;
    public static final int EMPLOYEE_TYPE_DELIVERY=1;
    public static final int EMPLOYEE_TYPE_REPORT=2;


    public static DataSyncProcessEx dataSyncProcessEx=null;
    public static MenuItem menuIcon=null;
    public static DashboardActivity mainActivity = null;
    //public static MainActivity mainActivity=null;
    //public static DashboardActivity dashActivity=null;
    public static boolean blnFreshLogin =false;
    public static boolean blnFreshLoginWaitForData =false;

    public static HashMap<String,JSONArray> changeItemList=new HashMap();
    public static HashMap<String, AssetType>  assetTypes=new HashMap<>();
    public static HashMap<String, LocItem> markerItemsMap;
    public static VersionInfo versionInfo;
    /*Default Values for Lookups selections

     */

    public static int varsGetMode=0;
    public static boolean varsSubscribed=false;

    /*Static Data for Application */
    public static final int ISSUE_IMAGE_STATUS_CREATED = 0;
    public static final int ISSUE_IMAGE_STATUS_UPLOADED = 1;
    public static final int ISSUE_IMAGE_STATUS_REMOVED = 2;
    public static final int ISSUE_IMAGE_STATUS_ERROR = 3;
    public static SimpleDateFormat spinnerDateFormat = new SimpleDateFormat("dd MMMM yyyy", Locale.ENGLISH);
    public static SimpleDateFormat spinnerDayFormat = new SimpleDateFormat("EEEE", Locale.ENGLISH);
    public static SimpleDateFormat FULL_DATE_FORMAT = new SimpleDateFormat("EEE MMM dd HH:mm:ss zzzz yyyy", Locale.ENGLISH);
    public static boolean isTaskStarted = false;
    public static File imgFile;
    public static Size imgSize;
    public static enum AppCameraType{
        Camera2,
        IntentType
    };
    //These values will only be used in IntentType Camera Settings
    public static int maxImageSize=1920;
    public static int jpgQuality=95;

    public static AppCameraType cameraType=AppCameraType.IntentType;
    public static String taskStartTime = "";
    public static String userEmail = "";
    public static String userName = "";
    public static String userUID = "";
    public static Report newReport;
    public static Uri issueImgFileUri;
    public static String SOD_START_STATUS = "started";
    public static String SOD_END_STATUS = "ended";
    public static String PING_ADDRESS = "https://www.google.com/";
    public static String CURRENT_LOCATION = "";
    //Task Status
    public static final String TASK_NOT_STARTED_STATUS = "Not Started";
    public static final String TASK_IN_PROGRESS_STATUS = "In Progress";
    public static final String TASK_FINISHED_STATUS = "Finished";
    //Workpaln Status

    public static final String WORK_PLAN_NOT_STARTED_STATUS = "Not Started";
    public static final String WORK_PLAN_IN_PROGRESS_STATUS = "In Progress";
    public static final String WORK_PLAN_FINISHED_STATUS = "Finished";

    public static final String SESSION_STARTED = "open";
    public static final String SESSION_STOPPED = "closed";

    public static final String MAINTENANCE_ROLE_NAME = "maintenance";
    public static boolean isMaintainer = false;

    public static int SELECTED_JPLAN_INDEX = 0;

    public static JourneyPlan selectedJPlan;
    public static MaintenanceList maintenanceList;
    public static Maintenance selectedMaintenance;
    public static Task selectedTask;
    public static Units selectedUnit;
    public static DUnit selectedDUnit;
    public static String selectedReportType = "";
    public static int selectedReportIndex;
    public static ATIVDefect sATIVDefect;
    public static JourneyPlan initialInspection;
    public static Task initialRun;
    private static LocationPrefix selectedLocPrefix;

    public static Report selectedReport;
    public static String selectedCategory="";
    public static Session activeSession = null;
    public static boolean isDisplayHosOnDashboard = true;
    public static boolean isShowATIV = true;
    public static boolean isDisableRActionByRule = true;
    public static ArrayList<String> defectCodeList;
    public static ArrayList<String> defectCodeSelection;
    public static ArrayList<String> defectCodeTags;
    public static String selectedCode;
    public static boolean isSingleDefCode = false;
    public static Multimap<String, String> defectSelection = ArrayListMultimap.create();
    public static Multimap<String, String> defectSelectionCopy = ArrayListMultimap.create();
    public static SafetyBriefingForm safetyBriefing;
    public static HashMap<Integer, View> listViews = new HashMap<>();
    public static Worker selectedWorker;
    public static String PREFS_KEY_SERVER = "TIPS SERVER INFO";
    public static final String PREFS_KEY_CUSTOM_SERVER = "USER CUSTOM SERVER";
    public static final String PREFS_KEY_SELECTED_SERVER = "SERVER NAME";
    public static final String PREFS_KEY_SELECTED_PORT = "SERVER PORT";
    public static final String PREFS_KEY_SELECTED_SERVER_DISPLAY_NAME = "SERVER DISPLAY NAME";
    public static final String PREFS_KEY_IS_PATCH_PERFORMED = "PATCH PERFORMED";
    public static final String PREFS_STRING_DIVIDER = "_div_";
    public static final String ADAPTER_REFRESH_MSG = "Refresh Adapter";
    public static final String DEFICIENCY_TYPE = "Deficiency";
    public static final String DEFECT_TYPE = "Defect";
    public static final String SETTINGS_UNLOCK_PIN = "0001";
    public static final String INSPECTION_LAYOUT_STATE = "INSPECTION LAYOUT STATE";
    public static final String SESSION_LAYOUT_STATE = "SESSION LAYOUT STATE";
    public static final String MAINTENANCE_LAYOUT_STATE = "MAINTENANCE LAYOUT STATE";
    public static ArrayList<IssueVoice> tempIssueVoiceList;
    public static ArrayList<IssueImage> tempIssueImgList;
    public static RptTimeAndGPS rptTimeAndGPS;
    public static MediaPlayer _notify;
    public static String currentImageTag;
    public static Context safetyBriefingContext;
    public static Context loginContext;
    public static Location lastKnownLocation;
    public static String issueTitle;
    public static ArrayList<String> defectCodeDetails = new ArrayList<>();
    public static double angleOffset = 90.0;
    public static final int NEARBY_ASSETS_LIST_SIZE = 3;
    public static LatLong previousLocation = null;
    public static String defectDivider = "-div-";
    public static boolean isSingleDefectSelection = false;
    public static boolean isIssueUpdateAllowed = false;
    public static boolean isWConditionMustReq = true;
    public static boolean isHideRule213 = false;
    public static boolean isMpReq = true;
    public static boolean isPrimaryAssetOnTop = true;
    public static boolean isTraverseReq = true;
    public static boolean isWConditionReq = true;
    public static boolean isBackOnTaskClose = true;
    public static boolean isInspectionTypeReq = true;
    public static boolean isBypassTaskView = false;
    public static boolean isUseDefaultAsset = true;
    public static boolean isUseRailDirection = true;
    public static boolean showNearByAssets = true;
    public static boolean isShowSwitchInspection = true;
    public static boolean isSmartObjectAvailable=true;  // Journey Plan Full object or only changes
    public static boolean isMaintenanceFromDashboard = true;
    public static boolean isRemedialActionReq = false;
    public static boolean isShowSession = true;
    public static boolean isShowTraverseCheckbox = true;
    public static boolean isShowAllSideTracks = false; // hiding side tracks as per request
    public static boolean isAudibleNotificationAllowed = false;
    public static boolean isMidNightInspClosingAllowed = false;
    public static String selectedTempSign = "";
    public static String selectedDistanceSign = "";
    public static String selectedPostSign = "";
    public static String selectedTraverseBy = "";
    public static String selectedObserveOpt = "";
    //Config names
    public static String isDisableRActionByRuleConfig = "disableRemedialByRule";
    public static String isRule213ReqConfig = "disableRule213";
    public static String isMPRequireConfig = "appmpinput";
    public static String isTrackTraverseRequireConfig = "apptraversetrack";
    public static String isByPassTaskViewConfig = "apptaskviewbypass";
    public static String isRailDirectionConfig = "appraildirection";
    public static String isUseDefaultAssetConfig = "appdefaultasset";
    public static String isInspectionTypeConfig = "appinspectiontype";
    public static String isWConditionConfig = "appweathercondition";
    public static String defaultObserveOpt = "defaultObserveSelection";
    public static String isAudibleNotification = "audibleNotification";
    public static String postSign = "postsign";
    public static String distanceSign = "distancesign";
    public static String tempSign = "temperaturesign";
    public static String defTraverseBy = "traversby";
    public static String colorCodingNaConfig="ccTestNotActive";
    public static String colorCodingAConfig="ccTestActive";
    public static String colorCodingExpConfig="ccTestExpiring";

    public static String Green = "#FF00CC00";

    public static int COLOR_TEST_NOT_ACTIVE= Color.parseColor("darkgray");
    public static int COLOR_TEST_ACTIVE= Color.parseColor(Globals.Green);
    public static int COLOR_TEST_EXPIRING=Color.parseColor("#FFFF0000");


    /*
        public static void setReportSelection(Report selectedObj) {
            selectedReport = selectedObj;
        }
    
        public static Report getReportSelection() {
            return selectedReport;
        }
    */
    public static Context getDBContext(){
        return dbContext;
    }
    public static void setDbContext(Context context){
        dbContext=context;
        db=DBHandler.getInstance(context);
    }
    public static void setDomain() {
        //wsDomain = "http://" + wsDomainName + (wsPort.equals("") ? "" : (":" + wsPort));
        wsBaseURL = getWsDomain() + "/api/";
        wsImgURL = getWsDomain() + "/applicationresources/";
    }


    public static void setUserInfoView(Context context, CircularImageView userImgView, TextView userNameView) {
        //String hash = MD5Util.md5Hex(userEmail); // need to change before finalizing
        //String gravatarUrl = "http://www.gravatar.com/avatar/" + hash + "?s=204&d=404";
        //userImage.setImageURI(Uri.parse("http://www.gravatar.com/avatar/91ee8b178428a70d695f9794a0340235?s=204&d=404"));
        try {
            if(userNameView != null){
                userNameView.setText(Globals.user.getName());
            }
            if(user.getProfImg()!=null && isImageFileExists(user.getProfImg().getImgName())){
               /* Glide.with(context)
                        .load(Uri.parse(getImgPath(user.getProfImg().getImgName())))
                        .apply(new RequestOptions()
                                .circleCrop()
                                .placeholder(R.drawable.ic_person_white_24dp)
                        )
                        .into(userImgView);*/
                File file=new File(getImgPath(user.getProfImg().getImgName()));
                if(file.exists()){
                    Log.d("setUserInfoView", "File Exists:"+file.getAbsolutePath());
                }else{
                    Log.d("setUserInfoView", "File Doesn't Exists");
                }
                Glide.with(context)
                        .load(getImgPath(user.getProfImg().getImgName()))
                        .apply(new RequestOptions()
                                .centerCrop()
                                .dontAnimate()
                                .dontTransform()
                                .skipMemoryCache(true)
                                .diskCacheStrategy(DiskCacheStrategy.NONE))
                        .into(userImgView);

                /*Glide.with(context).load(getImgPath(user.getProfImg().getImgName()))
                        .into(userImgView);*/
                userImgView.setColorFilter(ContextCompat.getColor(context, android.R.color.transparent));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        /*try {
            URLConnection connection = new URL(gravatarUrl).openConnection();
            String contentType = connection.getHeaderField("Content-Type");
            boolean image = contentType.startsWith("image/");
        }catch (Exception e ){
            Toast.makeText(MainActivity.this, e.toString(), Toast.LENGTH_SHORT).show();
        }*/
         /*else {
            Glide.with(context)
                    .load(R.drawable.no_image__placeholder)
                    .apply(new RequestOptions()
                            .circleCrop()
                            .placeholder(R.drawable.amu_bubble_mask)
                    )
                    .into(userImgView);
        }*/
        //Globals.circleImage(userImgView, gravatarUrl, true);
    }

    public static void setUserImage(ImageView userImgView) {
        String hash = MD5Util.md5Hex(userEmail); // need to change before finalizing
        String gravatarUrl = "http://www.gravatar.com/avatar/" + hash + "?s=204&d=404";
        //userImage.setImageURI(Uri.parse("http://www.gravatar.com/avatar/91ee8b178428a70d695f9794a0340235?s=204&d=404"));
        /*try {
            URLConnection connection = new URL(gravatarUrl).openConnection();
            String contentType = connection.getHeaderField("Content-Type");
            boolean image = contentType.startsWith("image/");
        }catch (Exception e ){
            Toast.makeText(MainActivity.this, e.toString(), Toast.LENGTH_SHORT).show();
        }*/
        Globals.circleImage(userImgView, gravatarUrl, true);
    }

    public static <T> void circleImage(final ImageView imageView, T uri, final boolean border) {
        Glide.with(imageView.getContext()).asBitmap().load(uri).apply(new RequestOptions()
                .placeholder(R.drawable.ic_person_white_24dp)
                .fitCenter()).into(imageView);/*new BitmapImageViewTarget(imageView) {
            @Override
            protected void setResource(Bitmap resource) {
                try {
                    String hash = MD5Util.md5Hex(userEmail); // need to change before finalizing
                    RoundedBitmapDrawable circularBitmapDrawable = RoundedBitmapDrawableFactory.create(imageView.getContext().getResources(), border ? addBorder(resource, imageView.getContext()) : resource);
                    circularBitmapDrawable.setCircular(true);
                    if(Globals.mainActivity!=null) {
                        Utilities.saveToInternalStorage(Globals.mainActivity, hash, circularBitmapDrawable.getBitmap());
                    }
                    imageView.setImageDrawable(circularBitmapDrawable);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });*/
    }

    private static Bitmap addBorder(Bitmap resource, Context context) {
        int w = resource.getWidth();
        int h = resource.getHeight();
        int radius = Math.min(h / 2, w / 2);
        Bitmap output = Bitmap.createBitmap(w + 8, h + 8, Bitmap.Config.ARGB_8888);
        Paint p = new Paint();
        p.setAntiAlias(true);
        Canvas c = new Canvas(output);
        c.drawARGB(0, 0, 0, 0);
        p.setStyle(Paint.Style.FILL);
        c.drawCircle((w / 2) + 4, (h / 2) + 4, radius, p);
        p.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.SRC_IN));
        c.drawBitmap(resource, 4, 4, p);
        p.setXfermode(null);
        p.setStyle(Paint.Style.STROKE);
        p.setColor(ContextCompat.getColor(context, R.color.credentials_white));
        p.setStrokeWidth(3);
        c.drawCircle((w / 2) + 4, (h / 2) + 4, radius, p);
        return output;
    }
    /**
     * get uri to any resource type
     *
     * @param context - context
     * @param resId   - resource id
     * @return - Uri to resource by given id
     * @throws Resources.NotFoundException if the given ID does not exist.
     */

    public static Uri getUriToResource(@NonNull Context context,
                                       @AnyRes int resId)
            throws Resources.NotFoundException {
        /** Return a Resources instance for your application's package. */
        Resources res = context.getResources();
        /**
         * Creates a Uri which parses the given encoded URI string.
         * @param uriString an RFC 2396-compliant, encoded URI
         * @throws NullPointerException if uriString is null
         * @return Uri for this given uri string
         */
        Uri resUri = Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE +
                "://" + res.getResourcePackageName(resId)
                + '/' + res.getResourceTypeName(resId)
                + '/' + res.getResourceEntryName(resId));
        /** return uri */
        return resUri;
    }

    public static String getReportsURL(String reportName){

        return wsReportURL + appid +"/" + orgCode +"/html/" + empCode +"/"+ Uri.encode(reportName)+"/";
    }
    public static ArrayList webPullRequestReports(final Context context,int empCode)
    {
        String url = wsBaseURL + "Reports/" + appid + "/" + orgCode + "/html/" + empCode +"/";
        //http://localhost:58836/api/Reports/app001/3/html/5/

        String jsonObject = null;
        jsonObject = JsonWebService.getJSON(url, 5000);
        if(jsonObject==null)
        {
            return null;
        }
        ArrayList reportList=new ArrayList();
        try{
            JSONArray ja= new JSONArray(jsonObject);
            for(int i=0; i<ja.length(); i++){
                String reportName=ja.get(i).toString();
                if(reportName.startsWith(""+empCode+"_")){
                    reportName=reportName.substring((""+empCode+"_").length());
                    if(reportName.endsWith(".html")){
                        reportName=reportName.substring(0,reportName.length()-5);
                    }
                }

                reportList.add(reportName);
            }
        }catch (Exception e){
            Log.e(TAG, e.toString());
        }
        return reportList;
    }

    public static boolean checkDayExpired()
    {
        if(dayStarted)
        {
            if(Utilities.isDateChanged(SOD))
            {
                //Date Changed
                return true;
            }
        }
        return false;
    }
    public static HashMap<String,Bitmap> surveyImageList=new HashMap();

    public static void clearSODData(Context context)
    {
        DBHandler db=Globals.db;//new DBHandler(getDBContext());
        String listName="UserSODMsgList";
        //db.RemoveMsgList(listName,orgCode);
        listName="VisitMsgList";
        db.RemoveMsgList(listName,orgCode);
        listName="DVisitMsgList";
        db.RemoveMsgList(listName,orgCode);

        listName="OrderList";
        db.RemoveMsgList(listName,orgCode);
        listName="DOrderList";
        db.RemoveMsgList(listName,orgCode);

        //db.close();
    }

    public static void initializeAllData()
    {
        appid="";
        appid_temp="";
        //orgCode="";
        userID="";
        userUID = "";
        empCode="";
        employeeName="";
        userToken="";
        visitLockOption=true;
        visitUnlockOption=false;
        invoiceEditOption=false;
        userEmail = "";
        userName = "";

        SOD="";
        startOfDayTime="";
        endOfDayTime="";
        dayStarted=false;
        mstrCurrFragment="";
        timeStamp="";
        sodId = "";
        inbox=null;
        selectedJPlan=null;
        isPullInProgress = false;
        selectedUnit = null;
        selectedDUnit = null;
        //blnFreshLoginWaitForData = true;
        //mstrCurrCustCode="";
        //mstrCurrCustName="";
        //recycleAllImages();
    }

    public static void setEndOfDay()
    {

        Globals.SOD="";
        Globals.dayStarted=false;
        recycleAllImages();

    }
    public static void loadSettings(Context context)
    {
        IsAutoUpdateEnabled=true;
        lngAutoUpdateTimeOut=MIN_UPDATE_INTERVAL;

        AppSettings appSettings=new AppSettings(context);
        Globals.timeStamp=appSettings.getSettings(SETTING_TIMESTAMP,"");
        IsAutoUpdateEnabled= (appSettings.getSettings(SETTING_AUTO_START,"1").equals("1"))?true:false;
        lngAutoUpdateTimeOut=(appSettings.setting2.equals(""))?lngAutoUpdateTimeOut:Long.parseLong(appSettings.setting2);

        if(appSettings.setting1.equals(""))
        {
            appSettings.saveSettings(SETTING_AUTO_START,"1",String.valueOf( MIN_UPDATE_INTERVAL),"");
        }

        appSettings.close();

    }
    public static void saveLastConnTime(Context context)
    {
        AppSettings appSettings=new AppSettings(context);
        String currTime=Utilities.getCurrNumberTime();
        appSettings.saveSettings(SETTING_TIME_LAST_CONN,currTime);
        appSettings.close();
    }
    public static String getLastConnTime(Context context)
    {
        AppSettings appSettings=new AppSettings(context);
        String strRetValue=appSettings.getSettings(SETTING_TIME_LAST_CONN,"");
        appSettings.close();
        return strRetValue;
    }

    public static long getLastConnTimeDiff(Context context)
    {
        String strLastConnTime=getLastConnTime(context);
        String strCurrConnTime=Utilities.getCurrNumberTime();
        return Utilities.compareNumberTimes(strCurrConnTime,strLastConnTime);

    }
    public static void userLoggedOn(Context context)
    {

        DBHandler db=Globals.db;//new DBHandler(getDBContext());
        downloadCompleted=db.isDataAvailable(orgCode,"");
        //db.close();
        varsGetMode=0;
        varsSubscribed=false;
        initializeAllData();
        loadLoginData(context);
        loadDayStatus(context);
        ListMap.initializeAllLists(context);


    }
    public static void userLoggedOff(Context context)
    {

        DBHandler db=Globals.db;//new DBHandler(getDBContext());

        db.RemoveList("user","");
        db.RemoveList(JPLAN_LIST_NAME,orgCode);
        db.RemoveList(WPLAN_TEMPLATE_LIST_NAME,orgCode);
        db.RemoveList(SOD_LIST_NAME,orgCode);
        //dataSyncProcessEx.InterruptThread();
        //db.close();


        //recycleAllImages();
        initializeAllData();

    }

    public static boolean loadInbox(Context context){
        if(inbox ==null){
            inbox =new Inbox();

        }
        inbox.loadSampleData(context);
        try {
            Globals.selectedJPlan=inbox.getCurrentJourneyPlan();
            if(selectedJPlan != null){
                Globals.selectedJPlan.refresh(context);
            }

            //Loading JPData from DB
            inbox.loadWokPlanTemplateListEx();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return  true;
    }
    public static boolean loadDayStatus(Context context)
    {
        if(inbox ==null){
            //load AssetTypes
            assetTypes=new HashMap<>();
            DBHandler db=Globals.db;//new DBHandler(getDBContext());
            List<StaticListItem> items= null;
            try {
                items = Globals.db.getListItems(CATEGORY_LIST_NAME, Globals.orgCode,"","");
            } catch (Exception e) {
                e.printStackTrace();
            }
            //db.close();
            for(StaticListItem item:items){
                try {
                    JSONObject jo = new JSONObject(item.getOptParam1());
                    assetTypes.put(item.getDescription(),new AssetType(jo));
                }catch (Exception e)
                {
                    e.printStackTrace();
                }

            }

            //ListMap.initializeAllLists(context);
            loadInbox(context);

        }
        if(selectedJPlan !=null) {
            SimpleDateFormat sdf = new SimpleDateFormat(defaultDateFormat);
            SOD = sdf.format(new Date());
            startOfDayTime = selectedJPlan.getStartDateTime();
            endOfDayTime = selectedJPlan.getEndDateTime();
            sodStartLocation = selectedJPlan.getStartLocation();
            sodEndLocation = selectedJPlan.getEndLocation();
            sodId = "";
            if(endOfDayTime.equals("")) {
                dayStarted = true;
                currDayLocked=false;
            }else
            {
                dayStarted=false;
                currDayLocked=true;
            }

            return true;
        }

        dayStarted=false;
        return false;
    }

    public static boolean isServerValid() {
        try {
            URL myUrl = new URL(getWsDomain());
            URLConnection connection = myUrl.openConnection();
            connection.setConnectTimeout(10000);
            connection.connect();
            return true;
        } catch (Exception e) {
            // Handle your exceptions
            return false;
        }
    }
    public static boolean isInternetAvailable(Context context) {
        ConnectivityManager connectivityManager
                = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetworkInfo = null;
        if (connectivityManager != null) {
            activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
        }
        return activeNetworkInfo != null && activeNetworkInfo.isConnected();
       /* try {
            InetAddress ipAddr = InetAddress.getByName(wsDomainName); //You can replace it with your name
            blnNetAvailable=!ipAddr.equals("");
            return !ipAddr.equals("");

        } catch (Exception e) {
            blnNetAvailable=false;
            Log.e(TAG,"isInternetAvailable:"+ e);
            return false;
        }*/
            /*ConnectivityManager cm =
                    (ConnectivityManager)Context.getSystemService(Context.CONNECTIVITY_SERVICE);

            NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
            boolean isConnected = activeNetwork != null &&
                    activeNetwork.isConnectedOrConnecting();
            return isConnected;*/

    }
    public static boolean checkVersionChange(Context context)
    {
        String listName="AppVerList";
        MakeListAvailable(context,listName,orgCode);
        boolean isVersionOkay=checkVersion(context);
        Globals.versionMismatch=!isVersionOkay;
        return isVersionOkay;
    }
    public static boolean checkSODChange(Context context)
    {
        DBHandler db=Globals.db;//new DBHandler(getDBContext());
        String listName="UserSODMsgList";
        String sod="";
        List<StaticListItem>items=db.getListItems(listName,orgCode,empCode);
        //db.close();
        if(items.size()==1) {
            StaticListItem item = items.get(0);
            sod = item.getDescription();
        }
        if(!sod.equals("")) {
            if (isInternetAvailable(context)) {
                String strSOD = refreshSODAllowed(context);
                if(strSOD==null)
                {
                    strSOD="";
                }
                if(!strSOD.equals(""))
                {
                    Date dtSOD=Utilities.ConvertToDate(strSOD);
                    Date dtSODMsg=Utilities.ConvertToDate(sod);
                    if(dtSOD.equals(dtSODMsg))
                    {
                        //db.close();
                        return  false;
                    }
                    else
                    {
                        //SOD Changed, cleanup required
                        recycleAllImages();
                        Utilities.removeUnRelatedImages(sod);
                        db.clearAllData();
                        userLoggedOff(context);
                        //db.close();
                        return true;
                    }
                }
            }
        }
        //db.close();
        return false;
    }
    public static boolean checkVersion(Context context)
    {
        DBHandler db=Globals.db;//new DBHandler(getDBContext());
        List<StaticListItem> items=db.getListItems("AppVerList",orgCode,"code>0");

        boolean retValue=false;
        //ApkDownloadURL
        //db.close();
        if(items.size()>0)
        {
            String strAppVer=
                    items.get(0).getOptParam1();
            enforceVer=items.get(0).getOptParam2().equals("1");
            if(!strAppVer.equals(""))
            {
                try{
                    AppVerReq=strAppVer;
                    Double currVer=Double.valueOf(strAppVer);
                    Double appVer =Double.valueOf(AppVer);
                    if(currVer<=appVer)
                    {
                        retValue=true;
                    }

                }catch (Exception e)
                {
                    Log.e("checkVersion:",e.toString());

                }
            }
            if(items.size()>1)
            {
                String strURL=items.get(1).getOptParam1();
                ApkDownloadURL=strURL;
                String strSize=items.get(1).getOptParam2();
                ApkDownloadSize=strSize;
            }

        }
        else
        {
            retValue=true;
            //If no data available then assume its okay
        }

        return  retValue;
    }
    public static boolean webLogin(Context context,String orgCode,String userID,String password)
    {
        if(isInternetAvailable(context))
        {
            String url=wsBaseURL + "login/";
            String jsonObject=null;
            //jsonObject=JsonWebService.getJSONPOST(url,5000);
            try {
                JSONObject joInputData = new JSONObject();
                JSONObject joInputDetail = new JSONObject();
                joInputDetail.put("email", userID);
                joInputDetail.put("password", password);

                joInputData.put("user", joInputDetail);
                jsonObject = JsonWebService.postJSON(url, joInputData.toString(), 5000);
            }catch (Exception e){
                Log.e(TAG,e.toString());
            }
            if(jsonObject==null)
            {
                return  false;
            }
            try{
                JSONObject jo =new JSONObject(jsonObject);
                if(!jo.optString("err","").equals("")){
                    LOGIN_ERROR=jo.optString("err","");
                    return false;
                }
                LOGIN_ERROR="";

                appid="";
                appid_temp=jo.getString("token");
                timeStamp="";
                blnFreshLogin=true;
                blnFreshLoginWaitForData=true;
                //if(webPullRequest(context,"")) {
                DBHandler db = Globals.db;//new DBHandler(getDBContext());
                db.RemoveList("user", "");
                StaticListItem item = new StaticListItem();
                item.setOrgCode("");
                item.setListName("user");
                item.setCode("1");
                JSONObject joResult = jo.getJSONObject("result");
                item.setDescription(joResult.getString("name"));
                item.setOptParam1(jo.getString("token"));
                item.setOptParam2(joResult.toString());
                db.AddList("user", "", item);
                //db.close();
                timeStamp = "";
                loadLoginData(context);
                return true;
                //}

            }catch (Exception e)
            {
                return false;
            }
        }
        return  false;
    }
    public static String getCurrentJP(){
        DBHandler db=Globals.db;//new DBHandler(getDBContext());
        List<StaticListItem> items=db.getListItems("currentJP","", "CJ");
        StaticListItem _item;
        if(items.size()==0){
            // Record Not Found
            return  "";
        }else{
            _item=items.get(0);
            return _item.getOptParam1();
        }
    }
    public static void saveCurrentJP(String code){
        DBHandler db=Globals.db;//new DBHandler(getDBContext());
        List<StaticListItem> items=db.getListItems("currentJP","", "CJ");
        StaticListItem _item;
        if(items.size()==0){
            // Record Not Found
            _item=new StaticListItem("","currentJP","CJ","","","");
        }else{
            _item=items.get(0);
        }
        _item.setOptParam1(""+code);
        db.AddOrUpdateList("currentJP","",_item);
    }
    public static void loadLoginData(Context context)
    {
        DBHandler db=Globals.db;//new DBHandler(getDBContext());
        List<StaticListItem> items= db.getListItems("user","","1");
        //db.close();
        StaticListItem item=null;
        if(items.size()>0) {
            item = items.get(0);
            userID = item.getDescription();
            try {
                JSONObject jo=new JSONObject(item.getOptParam2());
                orgCode=jo.getString("tenantId");// {"orgCode","empCode","appId"}
                empCode=jo.getString("_id");//
                appid=item.getOptParam1();//
                userEmail = jo.getString("email");
                userName = jo.getString("name");
                userUID = jo.getString("_id");
                //timeStamp = "";
                user = new User(jo);
                makeUserImagesAvailable();
                loadDayStatus(context);
                Log.i("loadLoginData","Workplan Started:"+dayStarted);
                //empParams=getEmployeeParams(context);

            } catch (Exception e)
            {
                Log.e(TAG,e.toString());

            }

        }

    }
    private static void makeUserImagesAvailable() {
        if(user!=null){
            IssueImage signature=user.getSignature();
            IssueImage profile=user.getProfImg();
            if(signature!=null && signature.getImgName() !=null && !signature.getImgName().equals("")){
                if(!isImageFileExists(signature.getImgName())){
                    Utilities.makeImageAvailableEx(Globals.loginContext,null, signature.getImgName());
                }
            }
            if(profile!=null && profile.getImgName() !=null && !profile.getImgName().equals("")){
                if(!isImageFileExists(profile.getImgName())){
                    Utilities.makeImageAvailableEx(Globals.loginContext,null, profile.getImgName());
                }
            }

        }
    }
    public static JSONArray getListFromWeb(String listName, String timeStamp)
    {
        String url = wsBaseURL + "List/" + listName + (!timeStamp.equals("")? ("/" + timeStamp):"");
        String jsonObject = null;
        jsonObject = JsonWebService.getJSON(url, 5000);
        try {
            JSONArray jsonArray = new JSONArray(jsonObject);
            return jsonArray;

        } catch (Exception e) {

        }
        return  null;
    }
    public static boolean userEnabled(Context context)
    {
        String listName="UserSODList";
        //MakeListAvailable(context,listName,orgCode,"code="+empCode);
        DBHandler db=Globals.db;//new DBHandler(getDBContext());
        List<StaticListItem> items= db.getListItems(listName,orgCode,empCode);
        //db.close();
        if(items.size()==1)
        {
            StaticListItem item=items.get(0);
            long value=Long.valueOf( item.getOptParam1());

            return (value & 1)==1;
        }
        return false;

    }
    public static boolean isSodReOpenEnabled(Context context)
    {
        String listName="UserSODList";
        //MakeListAvailable(context,listName,orgCode,"code="+empCode);
        DBHandler db=Globals.db;//new DBHandler(getDBContext());
        List<StaticListItem> items= db.getListItems(listName,orgCode,empCode);
        //db.close();
        if(items.size()==1)
        {
            StaticListItem item=items.get(0);
            long value=Long.valueOf( item.getOptParam1());
            return (value & 2)==0;
        }
        return false;

    }
    public static boolean isDayAlreadyClosed(Context context)
    {
        DBHandler db=Globals.db;//new DBHandler(getDBContext());
        String listName="UserSODMsgList";
        String sod="";
        List<StaticListItem>items=db.getListItems(listName,orgCode,empCode);
        //db.close();
        if(items.size()==1) {
            StaticListItem item = items.get(0);
            sod = item.getDescription();
            if(! item.getOptParam1().equals("") && !item.getOptParam2().equals(""))
            {
                return true;
            }
        }
        return false;
    }

    public static String  refreshSODAllowed(Context context)
    {
        String listName="UserSODList";
        MakeListAvailable(context,listName,orgCode,"code="+empCode);
        DBHandler db=Globals.db;//new DBHandler(getDBContext());
        List<StaticListItem> items= db.getListItems(listName,orgCode,empCode);
        //db.close();
        if(items.size()==1)
        {
            StaticListItem item=items.get(0);
            return item.getDescription();
        }
        return null;
    }
    public static boolean updateSODMessage(Context context,String sod,String opt1,String opt2)
    {
        DBHandler db=Globals.db;//new DBHandler(getDBContext());
        String listName="UserSODMsgList";

        String url= wsBaseURL + "Messages/" + appid + "/" + orgCode + "/" + listName + "/put";
        StaticListItem item=new StaticListItem(orgCode,listName,empCode,sod,opt1,opt2);
        //Working
        JSONObject jo=new JSONObject();
        JSONArray ja=new JSONArray();

        try {
            jo=item.getJSONObject();
            ja.put(jo) ;
            String ret=JsonWebService.makePostRequest(url, ja.toString(), 5000);
            ret=ret.replace("\n","");
            ret=ret.replace("\"","");

            if(ret.equals("1"))
            {
                url= wsBaseURL + "Messages/" + appid + "/" + orgCode + "/" + listName + "/code="+empCode;
                String jObject=null;
                jObject=JsonWebService.getJSON(url,5000);
                JSONArray jo1=new JSONArray(jObject);

                if(jo1.length()==1)
                {

                    db.RemoveList(listName,orgCode);
                    db.AddList(listName,orgCode,jo1);
                    db.close();
                    //SOD=sod;
                    return true;
                }

            }

        }catch (Exception e)
        {

            return  false;
        }
        return  true;
    }
    public static String webBackupCodeList(final Context context,int orgCode,int empCode)
    {

        String criteria="backup";
        criteria=(criteria.equals("")?"get":criteria);

        String url = wsBaseURL + "NotificationLists/" + appid + "/" + orgCode + "/" + empCode + "/" + criteria+"/codelist";
        String jsonObject = null;
        int RecCount=0;

        String strTimeStamp="";

        jsonObject = JsonWebService.getJSON(url, 5000);
        try {
            String listName="";
            JSONArray jsonArray = new JSONArray(jsonObject);
            if(jsonArray.length()==1)
            {
                JSONObject jobjTimeStamp=jsonArray.getJSONObject(0);
                if(jobjTimeStamp.getString("name").equals("timestamp")) {
                    strTimeStamp = jobjTimeStamp.getString("val");
                    AppSettings objSetting = new AppSettings(context);
                    objSetting.saveSettings(SETTING_TIMESTAMP, strTimeStamp);
                }
            }

        } catch (Exception e) {
            Log.e("webBackupCodeList",e.toString());

        }
        return strTimeStamp;
    }
    public static void ringtone(Context context){
        try {
            Uri notification = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
            Ringtone r = RingtoneManager.getRingtone( context, notification);
            r.play();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
    public static void ringtone1(Context context,int notify_sound)
    {
        int resid=R.raw.hangouts_message;
        switch (notify_sound)
        {
            case 0:
                resid=R.raw.hangouts_message;
                break;

            case 1:
                resid=R.raw.nice_msg;
                break;
        }
        if(isAudibleNotificationAllowed){
            try {
                if(_notify!=null){
                    if(_notify.isPlaying())
                        _notify.stop();
                    _notify.reset();
                    _notify.release();
                }
                _notify = MediaPlayer.create(context, resid);
                _notify.start();
            } catch (IllegalStateException e) {
                e.printStackTrace();
            } catch (Exception e){
                e.printStackTrace();
            }
        }

    }
    public static boolean webPullRequest(final Context context, String timeStamp){

        isDataPopulated = false;
        TimeZone tz = TimeZone.getDefault();
        Date now = new Date();
        int offsetFromUtc = tz.getOffset(now.getTime())/60000;  // / 3600000;

        String url = wsBaseURL + "List/pull/"+offsetFromUtc+""+ ((timeStamp.equals(""))?"/": ("/" + timeStamp + "/"));

        boolean blnPullAll = timeStamp.equals("");
        String jsonObject = null;
        int RecCount=0;
        boolean dataChanged=false;
        boolean dataVarsChanged=false;

        HashMap<String,JSONArray> changeItemList=new HashMap<>();
        String strTimeStamp="";
        String listName="";
        //Log.i("webPullRequest","timeStamp:"+ timeStamp);
        lastConnectionError="";
        jsonObject = JsonWebService.getJSON(url, 5000);
        if(jsonObject==null)
        {
            lastError = lastConnectionError;
            setOfflineMode(true);
            return false;
        }
        setOfflineMode(false);
        Globals.lastConnTimeDiff=getLastConnTimeDiff(context);
        saveLastConnTime(context);
        DBHandler db=Globals.db;//new DBHandler(getDBContext());
        ArrayList<StaticListItem> items = new ArrayList<>();
        try {
            JSONObject joResult=new JSONObject(jsonObject);
            String ts = joResult.getString("ts");
            Globals.timeStamp=ts;
            JSONArray ja = joResult.optJSONArray("result");
            //Check if ja is empty
            if(ja!=null) {
                JSONArray _ja=new JSONArray();
                for (int i = 0; i < ja.length(); i++) {
                    JSONArray jObjArray = ja.optJSONArray(i);
                    if(jObjArray.length()!=0){
                        _ja.put(jObjArray);
                    }
                }
                ja=_ja.length()!=0?_ja:null;
            }
            if(ja !=null){
                if(blnPullAll){
                    //Remove All
                    db.RemoveList(JPLAN_LIST_NAME,orgCode);
                    db.RemoveList(WPLAN_TEMPLATE_LIST_NAME,orgCode);
                    db.RemoveList(APPLICATION_LOOKUP_LIST_NAME,orgCode);
                    db.RemoveList(SOD_LIST_NAME,orgCode);
                    db.RemoveList(MAINTENANCE_LIST_NAME,orgCode);
                }

                for(int i=0;i<ja.length();i++){
                    JSONArray jObjArray=ja.optJSONArray(i);
                    String curListName ="";
                    String prevListName ="";
                    for(int j=0; j<jObjArray.length();j++)
                    {
                        JSONObject jo =jObjArray.getJSONObject(j);
                        curListName=jo.getString("listName");
                        if(blnPullAll  && !curListName.equals(prevListName) && !curListName.equals("")){
                            //All Items so we need to remove existing items of this list
                            db.RemoveList(curListName, orgCode);
                        }
                        StaticListItem item =new StaticListItem(jo);
                        db.AddOrUpdateList(item.getListName(),orgCode,item);
                        if(!blnPullAll) {
                            JSONArray jaItem = changeItemList.get(item.getListName());
                            if (jaItem == null) {
                                jaItem = new JSONArray();
                                changeItemList.put(item.getListName(), jaItem);
                            }
                            jaItem.put(item.getCode());
                            dataChanged = true;
                        }
                        prevListName = curListName;
                    }
                }
            }

        } catch (Exception e) {
            Log.e("webPullRequest","JSON Error:"+listName);
            //db.close();
            lastError = "Unable to load data!";
            isDataPopulated = true;
            return  false;
        }
        Globals.changeItemList=changeItemList;

        try {
            if(blnPullAll||changeItemList.containsKey(APPLICATION_LOOKUP_LIST_NAME)){
                ListMap.initializeAllLists(getDBContext());
            }
        } catch (Exception e) {
            lastError = "Unable to load data!";
            isDataPopulated = true;
            e.printStackTrace();
        }

        //db.close();
        isDataPopulated = true;
        lastError = "";
        if(dataChanged )
        {
            ringtone1(context,1);
            sendBroadcastMessage(OBSERVABLE_MESSAGE_DATA_CHANGED,"");
        }

        return true;

    }
    public static boolean webPullRequest(final Context context,String orgCode,String empCode)
    {
        if(timeStamp.equals(""))
        {
            return false;
        }
        String url = wsBaseURL + "List/" + appid + "/" + orgCode + "/" + empCode + "/1/" + timeStamp ;

        String jsonObject = null;
        int RecCount=0;
        boolean dataChanged=false;
        boolean dataVarsChanged=false;


        HashMap<String,JSONArray> changeItemList=new HashMap<>();
        String strTimeStamp="";
        String listName="";
        jsonObject = JsonWebService.getJSON(url, 5000);
        if(jsonObject==null)
        {
            return false;
        }
        Globals.lastConnTimeDiff=getLastConnTimeDiff(context);
        saveLastConnTime(context);
        DBHandler db=Globals.db;//new DBHandler(getDBContext());

        try {

            JSONArray jsonArray = new JSONArray(jsonObject);
            for(int i=0;i<jsonArray.length();i++)
            {
                //Array of Multi List Item
                int count=0;
                String code="";
                String desc="";
                String opt1="";
                String opt2="";
                JSONObject jo=jsonArray.getJSONObject(i);
                //ltype:int, lname, code:int, desc, opt1, opt2
                int ltype=jo.getInt("ltype");
                String lname=jo.getString("lname");
                listName=lname;
                switch (ltype)
                {
                    case 0:     // timestamp
                        strTimeStamp=jo.getString("desc");
                        AppSettings objSetting=new AppSettings(context);
                        objSetting.saveSettings(SETTING_TIMESTAMP,strTimeStamp);
                        Globals.timeStamp=strTimeStamp;
                        dataChanged=true;
                        break;
                    case 1:     //static lists
                        code=jo.getString("code");
                        desc=jo.getString("desc");
                        opt1=jo.optString("opt1");
                        opt2=jo.optString("opt2");
                        count=db.AddOrUpdateList(listName,orgCode,new StaticListItem(orgCode,listName,code,desc,opt1,opt2));
                        /*
                        if(listName.equals("DRoutePlanList"))
                        {
                            String customerList=opt1.replace("[","").replace("]","");
                            if(!customerList.equals("") && empType==1)
                            {
                                int retCount=MakeListAvailable(context,"CustomerList",orgCode
                                        ,"code IN("+customerList+")");
                                changeItemList.put("CustomerList",new JSONArray());
                            }

                        }
                        */
                        JSONArray ja=changeItemList.get(listName);
                        if(ja==null)
                        {
                            ja=new JSONArray();
                            changeItemList.put(listName,ja);
                        }
                        ja.put(code);
                        dataChanged=true;
                        break;
                    case 2:     //Msg Lists
                        code=jo.getString("code");
                        desc=jo.getString("desc");
                        opt1=jo.optString("opt1");
                        opt2=jo.optString("opt2");

                        JSONArray ja1=changeItemList.get(listName);
                        if(ja1==null)
                        {
                            ja1=new JSONArray();
                            changeItemList.put(listName,ja1);
                        }
                        ja1.put(code);

                        count=db.AddOrUpdateMsgList(listName,orgCode,new StaticListItem(orgCode,listName,code,desc,opt1,opt2),MESSAGE_STATUS_REPLIED);
                        dataChanged=true;
                        break;
                    case 3:     //Deleted Lists
                        desc=jo.getString("desc");
                        //List of deleted codes of ListName
                        db.RemoveList(listName,orgCode,"code IN("+desc+")");
                        dataChanged=true;
                        break;

                }
                RecCount+=count;
            }

            if(varsGetMode>=0) {
                int count = MakeVarsAvailableRefresh(context, orgCode, varsGetMode);
                if(count>0 )
                {
                    changeItemList.put("DVARS",new JSONArray());
                    dataVarsChanged=true;
                }
                varsGetMode=(varsGetMode==0)?1:varsGetMode;
            }

        } catch (Exception e) {
            Log.e("webPullRequest","JSON Error:"+listName);
            //db.close();
            return  false;

        }
        if(dataChanged )
        {
            ringtone1(context,1);
        }
        Globals.changeItemList=changeItemList;
        //db.close();
        return true;
    }
    public static int webUploadMessageLists(final Context context, String orgCode,List<StaticListItem> items)    {
        //"{appid}/{orgcode:int}"
        String url = wsBaseURL + "msglist/" ;
        String jsonObject = null;
        int intRetValue=0;
        boolean dataChanged=false;

        if(items.size()>0)
        {
            JSONArray ja=new JSONArray();
            for(StaticListItem item:items)
            {
                if(Inbox.isLocalJPCode(item.getCode())){
                    item.setHoldCode(true);
                }
                ja.put(item.getMultiJSONObject());
            }
            String strRetValue=null;

            try {
                strRetValue = JsonWebService.postJSON(url, ja.toString(), 5000);
                System.out.println(ja.toString());
            }catch (Exception e)
            {
                Log.e(TAG,e.toString());
                return -1;
            }
            if(strRetValue==null){
                Log.e(TAG,"Server return error");
                return 0;
            }
            strRetValue=strRetValue.replace("\"","");
            strRetValue=strRetValue.replace("\n","");
            Log.i("webUploadMessageLists","Sending data to webserivce size:"+ items.size()+" ret:"+strRetValue);


            ringtone1(context,0);
            if(strRetValue.equals("success"))
            {
                return 1;
            }
        }
        return 0;
    }
    private static Promise uploadIssueVoices(List<IssueVoice> items){
        Promise promise =new Promise();
        HashMap<String,IssueVoice> voiceQue=new HashMap<>();

        for(IssueVoice item:items){
            voiceQue.put(item.getVoiceName(),item);
            //imageListObserver.postValue(imageQue);
            uploadMultipartVoiceAsync(item.getVoiceName(),item).then(res->{
                item.setStatus(ISSUE_IMAGE_STATUS_UPLOADED);
                voiceQue.remove(item.getVoiceName());
                if(voiceQue.size()==0){
                    promise.resolve(items);
                }

                return true;
            }).error(e->{
                voiceQue.remove(item.getVoiceName());
                if(voiceQue.size()==0){
                    promise.resolve(items);
                }

            }  );
        }
        if(items.size()==0){
            promise.resolve(null);
        }
        return promise;
    }

    private static Promise uploadIssueImages(List<IssueImage> items){
        Promise promise =new Promise();
        //MutableLiveData<HashMap<String, IssueImage>> imageListObserver=new MutableLiveData<>();
        HashMap<String,IssueImage> imageQue=new HashMap<>();

        for(IssueImage item:items){
            imageQue.put(item.getImgName(),item);
            //imageListObserver.postValue(imageQue);
            uploadMultipartImageAsync(item.getImgName(),item).then(res->{
                item.setStatus(ISSUE_IMAGE_STATUS_UPLOADED);
                imageQue.remove(item.getImgName());
                if(imageQue.size()==0){
                    promise.resolve(items);
                }

                return true;
            }).error(e->{
                imageQue.remove(item.getImgName());
                if(imageQue.size()==0){
                    promise.resolve(items);
                }

            }  );
        }
        if(items.size()==0){
            promise.resolve(null);
        }
        return promise;
    }
    public static ArrayList<IssueImage> getIssueImagesByItem(StaticListItem item, ArrayList<IssueImage> imagelist){
        ArrayList<IssueImage> _retImageList=new ArrayList<>();
        if(imagelist!=null){
            for(IssueImage issueImage:imagelist){
                if(item.isEqual(issueImage.getParent())){
                    _retImageList.add(issueImage);
                }
            }
        }

        return _retImageList;
    }
    private static ArrayList<IssueVoice> getIssueVoiceByItem(StaticListItem item, ArrayList<IssueVoice> voiceList){
        ArrayList<IssueVoice> _retImageList=new ArrayList<>();
        if(voiceList!=null){
            for(IssueVoice issueVoice:voiceList){
                if(item.isEqual(issueVoice.getParent())){
                    _retImageList.add(issueVoice);
                }
            }
        }

        return _retImageList;
    }

    private static HashMap<String, Integer> getIssueImageHashmap(ArrayList<IssueImage> imageList, Integer status){
        HashMap<String, Integer> _hasp=new HashMap<>();
        for(IssueImage image:imageList){
            _hasp.put(image.getImgName(),status);
        }
        return _hasp;
    }
    private static HashMap<String, Integer> getIssueVoiceHashmap(ArrayList<IssueVoice> voiceList, Integer status){
        HashMap<String, Integer> _hasp=new HashMap<>();
        for(IssueVoice image:voiceList){
            _hasp.put(image.getVoiceName(),status);
        }
        return _hasp;
    }

    public static int webUploadMessageListsEx(final Context context, String orgCode)
    {
        //"{appid}/{orgcode:int}"
        String url = wsBaseURL + "msglist/" ;
        String jsonObject = null;
        int intRetValue=0;
        boolean dataChanged=false;

        DBHandler db = Globals.db;//new DBHandler(getDBContext());
        List<StaticListItem> items=db.getMsgListItems(orgCode,"status="
                +MESSAGE_STATUS_READY_TO_POST); //Ready to be posted

        long connTimeDiff=Globals.lastConnTimeDiff/1000;

        if(connTimeDiff>150 || items.size()>0)
        {
            Log.i(TAG,"Last Conn Time Diff:"+ String.valueOf(connTimeDiff)+ " (s)");
            //If disconnected more than 5 mins check sod 1st
            //if(checkSODChange(context)){
            //    db.close();
            //    return intRetValue;
            //}
        }

        if(items.size()>0)
        {
            boolean isServerAvailable=isServerAvailable();
            setOfflineMode(!isServerAvailable);
            if(!isServerAvailable){
                return -1;
            }
            JSONArray ja=new JSONArray();
            ArrayList<IssueImage> imageList=new ArrayList<>();
            ArrayList<IssueVoice> voiceList=new ArrayList<>();
            for(StaticListItem item:items)
            {
                if(item.getListName().equals(JPLAN_LIST_NAME)){
                    // Search for images
                    List<IssueImage> imageLists=item.getImageList();
                    HashMap <String , Integer> imageListUpdated= new HashMap<>();
                    for(IssueImage issueImage : imageLists){
                        if (issueImage.getImgName() != null) {
                            if (!issueImage.getImgName().equals("")) {
                                issueImage.setParent(item);
                                imageList.add(issueImage);
                            }
                        }
                    }
                    //Check if status need to be updated
                    // Search for voice
                    List<IssueVoice> voiceLists=item.getVoiceList();
                    HashMap <String , Integer> voiceListUpdated= new HashMap<>();
                    for(IssueVoice issueVoice : voiceLists){
                        if (issueVoice.getVoiceName() != null) {
                            if (!issueVoice.getVoiceName().equals("")) {
                                issueVoice.setParent(item);
                                voiceList.add(issueVoice);

                            }
                        }
                    }

                    if(Inbox.isLocalJPCode(item.getCode())){
                        item.setHoldCode(true);
                    }
                }
                if(item.getListName().equals(GPS_LOG_LIST_NAME)){
                    String code=item.getCode();
                    item.setCode("");
                    ja.put(item.getMultiJSONObject());
                    item.setCode(code);
                }else{
                    ja.put(item.getMultiJSONObject());
                }

            }
            //this method upload images
            uploadIssueImages(imageList)
                    .then(res->{
                        //this method set the status of uploaded images
                        Promise p=new Promise();
                        ArrayList<IssueImage> _items=(ArrayList<IssueImage>)res;
                        if(res==null){
                            p.resolve(voiceList);
                            return p;
                        }
                        for(StaticListItem item:items){
                            ArrayList<IssueImage> itemImages=getIssueImagesByItem(item,_items);
                            HashMap<String, Integer> itemImagesHash=getIssueImageHashmap(itemImages,ISSUE_IMAGE_STATUS_UPLOADED);
                            item.setImageStatus(_items,itemImagesHash);
                        }
                        p.resolve(voiceList);
                        return p;
                    })
                    .then(red-> uploadIssueVoices(voiceList))
                    .then(res->{
                        //this method update status of uploaded voices
                        Promise p=new Promise();
                        ArrayList<IssueVoice> _items=(ArrayList<IssueVoice>)res;
                        if(res==null || _items ==null ){
                            p.resolve("");
                            return p;
                        }
                        for(StaticListItem item:items){
                            ArrayList<IssueVoice> itemVoices=getIssueVoiceByItem(item,_items);
                            HashMap<String, Integer> itemVoicesHash=getIssueVoiceHashmap(itemVoices,ISSUE_IMAGE_STATUS_UPLOADED);
                            item.setVoiceStatus(_items,itemVoicesHash);
                        }
                        p.resolve("");

                        return p;
                    }).then(res->{
                Promise p=new Promise();
                new Thread(()->{
                    String strRetValue=null;
                    System.out.println("Sending Data");
                    long tStart = System.currentTimeMillis();
                    try {
                        System.out.println(ja.toString());
                        System.out.println("Thread: "+Thread.currentThread().getName());
                        strRetValue = JsonWebService.postJSON(url, ja.toString(), 15000);
                    }catch (Exception e)
                    {
                        Log.e(TAG,e.toString());
                    }
                    long tEnd = System.currentTimeMillis();
                    long tDelta = tEnd - tStart;
                    double elapsedSeconds = tDelta / 1000.0;
                    System.out.println("elapsedSeconds");
                    System.out.println(elapsedSeconds);
                    if(strRetValue==null)
                    {
                        if(db !=null)
                        {
                            //db.close();
                        }
                        //ERROR
                        p.resolve(false);
                    }
                    strRetValue=strRetValue.replace("\"","");
                    strRetValue=strRetValue.replace("\n","");
                    Log.i("webUploadMessageLists","Sending data to webserivce size:"+ items.size()+" ret:"+strRetValue);
                    try {
                        ringtone1(context,0);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    if(strRetValue.equals("success"))
                    {
                        for(StaticListItem item:items){
                            item.setHoldCode(false);
                        }
                        //intRetValue=db.UpdateMsgListStatus(orgCode,items,MESSAGE_STATUS_POSTED);
                        db.RemoveMsgListItems(items,MESSAGE_STATUS_READY_TO_POST);
                        ArrayList<String> sentItemList=new ArrayList<>();
                        for(StaticListItem item:items){
                            sentItemList.add(item.getListName());
                        }
                        sendBroadcastMessage(OBSERVABLE_MESSAGE_DATA_SENT,sentItemList.toString());

                    }else if(strRetValue.startsWith("error:") && items.size()==1){
                        items.get(0).setStatus(MESSAGE_STATUS_ERROR);
                        db.AddOrUpdateMsgList(items.get(0).getListName(),orgCode,items.get(0),MESSAGE_STATUS_ERROR);
                    }
                    p.resolve(true);


                }).start();
                return p;
            });
        }
        //db.close();
        return intRetValue;
    }


    public static int webUploadMessageLists(final Context context, String orgCode)
    {
        //"{appid}/{orgcode:int}"
        String url = wsBaseURL + "msglist/" ;
        String jsonObject = null;
        int intRetValue=0;
        boolean dataChanged=false;

        DBHandler db = Globals.db;//new DBHandler(getDBContext());
        List<StaticListItem> items=db.getMsgListItems(orgCode,"status="
                +MESSAGE_STATUS_READY_TO_POST); //Ready to be posted

        long connTimeDiff=Globals.lastConnTimeDiff/1000;

        if(connTimeDiff>150 || items.size()>0)
        {
            Log.i(TAG,"Last Conn Time Diff:"+ String.valueOf(connTimeDiff)+ " (s)");
            //If disconnected more than 5 mins check sod 1st
            //if(checkSODChange(context)){
            //    db.close();
            //    return intRetValue;
            //}
        }

        if(items.size()>0)
        {
            boolean isServerAvailable=isServerAvailable();
            setOfflineMode(!isServerAvailable);
            if(!isServerAvailable){
                return -1;
            }
            JSONArray ja=new JSONArray();
            for(StaticListItem item:items)
            {
                if(item.getListName().equals(JPLAN_LIST_NAME)){
                    // Search for images
                    List<IssueImage> imageLists=item.getImageList();
                    HashMap <String , Integer> imageListUpdated= new HashMap<>();
                    for(IssueImage issueImage : imageLists){
                        if (issueImage.getImgName() != null) {
                            if (!issueImage.getImgName().equals("")) {
                                boolean retValue = uploadMultipartImage(issueImage.getImgName(),issueImage);
                                if (retValue) {
                                    if (!imageListUpdated.containsKey(issueImage.getImgName())) {
                                        imageListUpdated.put(issueImage.getImgName(), ISSUE_IMAGE_STATUS_UPLOADED);
                                    }
                                }
                            }
                        }
                    }
                    //Check if status need to be updated
                    if(imageListUpdated.size()>0){
                        boolean retValue= item.setImageStatus(imageLists,imageListUpdated);
                        if(retValue){
                            List<StaticListItem> newItems=db.getMsgListItems(item.getListName(),orgCode,"code='"+ item.getCode() +"'");
                            if(newItems.size()>0){
                                item = newItems.get(0);
                            }
                        }
                    }

                    // Search for voice
                    List<IssueVoice> voiceLists=item.getVoiceList();
                    HashMap <String , Integer> voiceListUpdated= new HashMap<>();
                    for(IssueVoice issueVoice : voiceLists){
                        if (issueVoice.getVoiceName() != null) {
                            if (!issueVoice.getVoiceName().equals("")) {
                                boolean retValue = uploadMultipartVoice(issueVoice.getVoiceName());
                                if (retValue) {
                                    if (!voiceListUpdated.containsKey(issueVoice.getVoiceName())) {
                                        voiceListUpdated.put(issueVoice.getVoiceName(), ISSUE_IMAGE_STATUS_UPLOADED);
                                    }
                                }
                            }
                        }
                    }
                    //Check if status need to be updated
                    if(voiceListUpdated.size()>0){
                        boolean retValue= item.setVoiceStatus(voiceLists,voiceListUpdated);
                        if(retValue){
                            List<StaticListItem> newItems=db.getMsgListItems(item.getListName(),orgCode,"code='"+ item.getCode() +"'");
                            if(newItems.size()>0){
                                item = newItems.get(0);
                            }
                        }
                    }

                    if(Inbox.isLocalJPCode(item.getCode())){
                        item.setHoldCode(true);
                    }
                }
                if(item.getListName().equals(GPS_LOG_LIST_NAME)){
                    String code=item.getCode();
                    item.setCode("");
                    ja.put(item.getMultiJSONObject());
                    item.setCode(code);
                }else{
                    ja.put(item.getMultiJSONObject());
                }

            }

            String strRetValue=null;
            System.out.println("Sending Data");
            long tStart = System.currentTimeMillis();
            try {
                System.out.println(ja.toString());
                strRetValue = JsonWebService.postJSON(url, ja.toString(), 15000);
            }catch (Exception e)
            {
                Log.e(TAG,e.toString());
            }
            long tEnd = System.currentTimeMillis();
            long tDelta = tEnd - tStart;
            double elapsedSeconds = tDelta / 1000.0;
            System.out.println("elapsedSeconds");
            System.out.println(elapsedSeconds);
            if(strRetValue==null)
            {
                if(db !=null)
                {
                    //db.close();
                }
                //ERROR
                return -1;
            }
            strRetValue=strRetValue.replace("\"","");
            strRetValue=strRetValue.replace("\n","");
            Log.i("webUploadMessageLists","Sending data to webserivce size:"+ items.size()+" ret:"+strRetValue);
            try {
                ringtone1(context,0);
            } catch (Exception e) {
                e.printStackTrace();
            }
            if(strRetValue.equals("success"))
            {
                for(StaticListItem item:items){
                    item.setHoldCode(false);
                }
                //intRetValue=db.UpdateMsgListStatus(orgCode,items,MESSAGE_STATUS_POSTED);
                db.RemoveMsgListItems(items,MESSAGE_STATUS_READY_TO_POST);
                ArrayList<String> sentItemList=new ArrayList<>();
                for(StaticListItem item:items){
                    sentItemList.add(item.getListName());
                }
                sendBroadcastMessage(OBSERVABLE_MESSAGE_DATA_SENT,sentItemList.toString());

            }else if(strRetValue.startsWith("error:") && items.size()==1){
                items.get(0).setStatus(MESSAGE_STATUS_ERROR);
                db.AddOrUpdateMsgList(items.get(0).getListName(),orgCode,items.get(0),MESSAGE_STATUS_ERROR);
            }
        }
        //db.close();
        return intRetValue;
    }

    public static boolean isServerAvailable() {
        JSONArray jaUser = new JSONArray();
        //String url = "http://" + server + ":"+ port + "/api/List/JourneyPlan/pull";
        User user=null;
        String protocol;
        protocol = mPrefs.getString(wsDomainName, "http");
        // TODO: Make a new request with short reply
        String userString = JsonWebService.getJSON(getPingAddress(wsDomainName, wsPort, protocol), 5000);
        try {
            if (userString != null) {
                //jaUser = new JSONArray(userString);
                return true;
                //user = new User(jaUser.getJSONObject(0));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public static boolean sendBroadcastMessage(String messageName, String messageData){
        Intent intent =new Intent();
        intent.putExtra("messageName",messageName);
        intent.putExtra("messageData",messageData);
        ObservableObject.getInstance().updateValue(intent);
        return  true;
    }
    private static boolean cleanupImages(String custCode,List<String> items)
    {
        JSONArray ja=new JSONArray(items);
        String sod=Utilities.getNumberDateForImage(SOD);
        String url=wsBaseURL + "Resources/"+appid+"/"+orgCode+"/"+sod+"/"+custCode+"/jpg/";


        try {
            String retValue = JsonWebService.postJSON(url,ja,5000);
            if(retValue!=null) {
                JSONArray jsonArray = new JSONArray(retValue);
            }
        } catch (Exception e) {

            Log.e(TAG,"cleanupImages:"+e.toString());
            return  false;
        }

        return true;
    }
    public static boolean uploadMultipartImage(String uFile) {
        return uploadMultipartImage(uFile,null);
    }
    public static Promise uploadMultipartImageAsync(String uFile,IssueImage issueImage) {

        /*String file_path= Environment.getExternalStorageDirectory()+"/"+Globals.imageFolderName
                +"/"+uFile;*/
        Promise promise=new Promise();
        String file_path= getImgPath(uFile);
        String url=wsBaseURL + "applicationresources/upload";
        sendBroadcastMessage(OBSERVABLE_MESSAGE_UPLOADING_IMAGE,uFile);

        Log.d("Uri", "Do file path" + file_path);
        HttpURLConnection c = null;
        try {
            final boolean retValue[]={false,false};
            Context context=mainActivity!=null?mainActivity:loginContext;
            Ion.getDefault(context).getConscryptMiddleware().enable(false);
            //TODO: Enhance this function to support false return
            Ion.with(context)
                    .load(url)
                    .setMultipartParameter("name", issueImage!=null?issueImage.getMd5():"")
                    .setMultipartFile("image", "image/jpeg", new File(file_path))
                    .asString()
                    .setCallback(new FutureCallback<String>() {
                        @Override
                        public void onCompleted(Exception e, String result) {
                            if(e!=null){
                                e.printStackTrace();
                                if(issueImage!=null) {
                                    issueImage.setStatus(ISSUE_IMAGE_STATUS_ERROR);

                                }
                                promise.reject(e);
                            }else{
                                if(issueImage!=null) {
                                    issueImage.setStatus(ISSUE_IMAGE_STATUS_UPLOADED);
                                }
                                promise.resolve(issueImage);
                            }
                        }
                    });
        }catch (Exception e)
        {

            Log.d("Globals","uploadMultipartImage:"+e.toString());
            promise.reject(e);
        }
        return promise;
    }
    public static boolean uploadMultipartImage(String uFile,IssueImage issueImage) {

        /*String file_path= Environment.getExternalStorageDirectory()+"/"+Globals.imageFolderName
                +"/"+uFile;*/
        String file_path= getImgPath(uFile);
        String url=wsBaseURL + "applicationresources/upload";
        sendBroadcastMessage(OBSERVABLE_MESSAGE_UPLOADING_IMAGE,uFile);

        Log.d("Uri", "Do file path" + file_path);
        HttpURLConnection c = null;
        try {
            final boolean retValue[]={false,false};
            Ion.getDefault(mainActivity).getConscryptMiddleware().enable(false);
            //TODO: Enhance this function to support false return
            Ion.with(mainActivity)
                    .load(url)
                    .setMultipartParameter("name", issueImage!=null?issueImage.getMd5():"")
                    .setMultipartFile("image", "image/jpeg", new File(file_path))
                    .asString()
                    .setCallback(new FutureCallback<String>() {
                        @Override
                        public void onCompleted(Exception e, String result) {
                            if(e!=null){
                                e.printStackTrace();
                                retValue[1] =false;
                                if(issueImage!=null) {
                                    issueImage.setStatus(ISSUE_IMAGE_STATUS_ERROR);
                                }
                            }else{
                                retValue[1] =true;
                                if(issueImage!=null) {
                                    issueImage.setStatus(ISSUE_IMAGE_STATUS_UPLOADED);
                                }
                            }
                            retValue[0]=true;

                        }
                    });
           /* Timer t=new Timer();
            t.schedule(new TimerTask() {
                @Override
                public void run() {
                    retValue[0]=true;
                }
            },3000);*/
            //while(!retValue[0]);
            // return retValue[1];

            /*boolean useCSRF = false;
            MultipartLargeUtility multipart = new MultipartLargeUtility(url, "UTF-8",useCSRF);
            multipart.addFormField("Authorization",appid);
            multipart.addFormField("param1","value");
            multipart.addFormField("processData","false");
            multipart.addFormField("contentType","false");
            multipart.addFormField("dataType","json");*/
            //multipart.addFormField("Accept", "*/*");

           /* multipart.addFilePart("files",new File(file_path));
            List<String> response = multipart.finish();
            Log.w(TAG,"SERVER REPLIED:");
            for(String line : response) {
                Log.w(TAG, "Upload Files Response:::" + line);
            }*/
        }catch (Exception e)
        {

            Log.d("Globals","uploadMultipartImage:"+e.toString());
        }
        return true;
    }
    private static boolean uploadMultipartVoice(String uFile) {

        /*String file_path= Environment.getExternalStorageDirectory()+"/"+Globals.voiceFolderName
                +"/"+uFile;*/
        String file_path= getVoicePath(uFile);
        String url=wsBaseURL + "applicationresources/uploadAudio";
        sendBroadcastMessage(OBSERVABLE_MESSAGE_UPLOADING_IMAGE,uFile);

        Log.d("Uri", "Do file path" + file_path);
        Ion.getDefault(mainActivity).getConscryptMiddleware().enable(false);
        HttpURLConnection c = null;
        try {
            final boolean[] retValue = {false,false};
            Ion.with(mainActivity)
                    .load(url)
                    .setMultipartParameter("name", "source")
                    .setMultipartFile("voice", "audio/mp4", new File(file_path))
                    .asString().setCallback(new FutureCallback<String>() {
                @Override
                public void onCompleted(Exception e, String result) {
                    if(e!=null){
                        //e.printStackTrace();
                        retValue[1] =false;
                    }else{
                        retValue[1] =true;
                    }
                    retValue[0]=true;
                    //do stuff with result

                }
            });
            /*Timer t=new Timer();
            t.schedule(new TimerTask() {
                @Override
                public void run() {
                    retValue[0]=true;
                }
            },3000);*/
            //while(!retValue[0]);
            // return retValue[1];
        }catch (Exception e)
        {

            Log.d("Globals","uploadMultipartVoice:"+e.toString());
        }
        return true;
    }
    private static Promise uploadMultipartVoiceAsync(String uFile,IssueVoice issueVoice) {

        /*String file_path= Environment.getExternalStorageDirectory()+"/"+Globals.voiceFolderName
                +"/"+uFile;*/
        Promise p =new Promise();
        String file_path= getVoicePath(uFile);
        String url=wsBaseURL + "applicationresources/uploadAudio";
        sendBroadcastMessage(OBSERVABLE_MESSAGE_UPLOADING_IMAGE,uFile);
        Context context=mainActivity!=null?mainActivity:loginContext;
        Log.d("Uri", "Do file path" + file_path);
        Ion.getDefault(context).getConscryptMiddleware().enable(false);
        HttpURLConnection c = null;
        try {
            final boolean[] retValue = {false,false};
            Ion.with(context)
                    .load(url)
                    .setMultipartParameter("name", "source")
                    .setMultipartFile("voice", "audio/mp4", new File(file_path))
                    .asString().setCallback(new FutureCallback<String>() {
                @Override
                public void onCompleted(Exception e, String result) {
                    if(e!=null){
                        //e.printStackTrace();
                        retValue[1] =false;
                        if(issueVoice!=null){
                            issueVoice.setStatus(ISSUE_IMAGE_STATUS_ERROR);
                        }
                        p.reject(e);
                    }else{
                        retValue[1] =true;
                        if(issueVoice!=null){
                            issueVoice.setStatus(ISSUE_IMAGE_STATUS_UPLOADED);
                        }
                        p.resolve(issueVoice);
                    }
                    retValue[0]=true;
                    //do stuff with result

                }
            });
        }catch (Exception e)
        {

            Log.d("Globals","uploadMultipartVoiceAsync:"+e.toString());
        }
        return p;
    }

    public static List<StaticListItem> getListFromWeb(String listName){
        TimeZone tz = TimeZone.getDefault();
        Date now = new Date();
        int offsetFromUtc = tz.getOffset(now.getTime())/60000;  // / 3600000;

        String url = wsBaseURL + "List/"+listName+"/"+offsetFromUtc+"/";

        JSONArray ja;
        String jsonObject = null;
        ArrayList<StaticListItem> items=new ArrayList<>();

        HashMap<String,JSONArray> changeItemList=new HashMap<>();
        String strTimeStamp="";
        jsonObject = JsonWebService.getJSON(url, 5000);
        if(jsonObject==null)
        {
            return items;
        }
        try{
            ja=new JSONArray(jsonObject);
            for(int i=0;i<ja.length();i++){
                StaticListItem item=new StaticListItem(ja.getJSONObject(i));
                items.add(item);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return items;
    }
    public static int MakeListAvailable(final Context context,String listName, String orgCode, String criteria)
    {

        criteria=(criteria.equals("")?"get":criteria);

        criteria=criteria.replace("%","~");
        criteria=criteria.replace(" ","%20");


        String url = wsBaseURL + "NotificationLists/" + appid + "/" + orgCode + "/" + listName + "/" + criteria;
        String jsonObject = null;
        int RecCount=0;
        int TotalRecCount=0;

        jsonObject = JsonWebService.getJSON(url, 5000);
        try {
            JSONArray jsonArray = new JSONArray(jsonObject);
            DBHandler dbHandler = Globals.db;//new DBHandler(getDBContext());
            dbHandler.RemoveList(listName, orgCode);
            RecCount=dbHandler.AddList(listName, orgCode, jsonArray);
            TotalRecCount+=RecCount;
            //dbHandler.close();
        } catch (Exception e) {

        }
        return TotalRecCount;
    }
    public static int MakeMsgListAvailable(final Context context,String listName, String orgCode, String criteria)
    {

        criteria=(criteria.equals("")?"get":criteria);

        //String url = wsBaseURL + "Messages/" + appid + "/" + orgCode + "/" + listName + "/" + criteria;
        String url=wsBaseURL + "Messages/"+appid+"/"+orgCode+"/"+listName+"/"+criteria;
        String jsonObject = null;
        int RecCount=0;
        int TotalRecCount=0;

        jsonObject = JsonWebService.getJSON(url, 5000);
        try {
            JSONArray jsonArray = new JSONArray(jsonObject);
            DBHandler dbHandler = Globals.db;//new DBHandler(getDBContext());
            dbHandler.RemoveList(listName, orgCode);
            RecCount=dbHandler.AddMsgList(listName, orgCode, jsonArray);
            TotalRecCount+=RecCount;
            //dbHandler.close();
        } catch (Exception e) {

        }
        return TotalRecCount;
    }


    public static int MakeListAvailable(final Context context,String listName, String orgCode)
    {

        String url = wsBaseURL + "NotificationLists/" + appid + "/" + orgCode + "/" + listName + "/get";
        String jsonObject = null;
        int RecCount=0;
        int TotalRecCount=0;

        jsonObject = JsonWebService.getJSON(url, 5000);
        try {
            JSONArray jsonArray = new JSONArray(jsonObject);
            DBHandler dbHandler = Globals.db;//new DBHandler(getDBContext());
            dbHandler.RemoveList(listName, orgCode);
            RecCount=dbHandler.AddList(listName, orgCode, jsonArray);
            TotalRecCount+=RecCount;
            //dbHandler.close();

        } catch (Exception e) {
            return  -1;
        }
        return TotalRecCount;
    }
    public static boolean MakeListsAvailable(final Context context, final String [] listNames, final String orgCode)
    {

        if(isInternetAvailable(context))
        {
            Runnable runnable= new Runnable() {
                @Override
                public void run() {
                    inProcess=true;
                    int RecCount=0;
                    int TotalRecCount=0;
                    for (String listName:listNames
                    ) {


                        String url = wsBaseURL + "NotificationLists/" + appid + "/" + orgCode + "/" + listName + "/get";
                        String jsonObject = null;
                        jsonObject = JsonWebService.getJSON(url, 5000);
                        try {
                            JSONArray jsonArray = new JSONArray(jsonObject);
                            DBHandler dbHandler =Globals.db;// new DBHandler(getDBContext());
                            dbHandler.RemoveList(listName, orgCode);
                            RecCount=dbHandler.AddList(listName, orgCode, jsonArray);
                            TotalRecCount+=RecCount;

                        } catch (Exception e) {

                        }

                    }
                    inProcess=false;
                    ListUpdated=true;
                }
            };
            new Thread(runnable).start();

        }
        return true;
    }

    public static int MakeVarsAvailable(Context context,String orgCode)
    {
        String url = wsBaseURL + "Notifications/" + appid + "/" + orgCode ;
        String jsonObject = null;
        int RecCount=0;
        int TotalRecCount=0;

        jsonObject = JsonWebService.getJSON(url, 5000);
        try {
            JSONArray jsonArray = new JSONArray(jsonObject);
            DBHandler dbHandler = Globals.db;//new DBHandler(getDBContext());
            dbHandler.RemoveVars(orgCode);
            RecCount=dbHandler.AddVars(orgCode,jsonArray);
            //dbHandler.close();
            TotalRecCount+=RecCount;

        } catch (Exception e) {

        }
        return TotalRecCount;
    }

    public static int  MakeVarsAvailableRefresh(Context context,String orgCode, int mode)
    {
        String urlSubscribe= wsBaseURL + "Notifications/" + appid + "/subscribe/";
        String url = wsBaseURL + "Notifications/" + appid + "/" + orgCode +"/pull";
        if(mode==0)
        {
            //initialize
            url = wsBaseURL + "Notifications/" + appid + "/" + orgCode +"/";
            try
            {
                String  retValue;
                retValue = JsonWebService.getJSON(urlSubscribe, 5000);
                varsSubscribed=true;

            }catch (Exception e)
            {

            }
        }

        String jsonObject = null;
        int RecCount=0;
        int TotalRecCount=0;

        jsonObject = JsonWebService.getJSON(url, 5000);
        try {
            JSONArray jsonArray = new JSONArray(jsonObject);
            DBHandler dbHandler = Globals.db;//new DBHandler(getDBContext());
            //dbHandler.RemoveVars(orgCode);
            if(varExists(jsonArray,"ST_RST") && mode !=0)
            {
                url = wsBaseURL + "Notifications/" + appid + "/" + orgCode +"/";
                jsonObject = JsonWebService.getJSON(url, 5000);
                jsonArray = new JSONArray(jsonObject);
                mode=0;
            }

            if(mode==0)
            {
                if(jsonArray.length()!=0)
                {
                    dbHandler.RemoveVars(orgCode);
                }
            }
            RecCount=dbHandler.AddOrUpdateVars(orgCode,jsonArray);
            TotalRecCount+=RecCount;

        } catch (Exception e) {

        }
        return TotalRecCount;
    }
    public static boolean isNumeric(String str)
    {
        return str.matches("^(?:(?:\\-{1})?\\d+(?:\\.{1}\\d+)?)$");
    }
    private static boolean itemExists(JSONArray jsonArray, String varname, String value){
        return jsonArray.toString().contains("\""+ varname+ "\":\""+value+"\"");
    }
    private static boolean varExists(JSONArray jsonArray, String varname){
        return jsonArray.toString().contains("\"name\":\""+ varname+ "\"");
    }

    public static Bitmap getSurveyImageReload(Context context,String strFileName)
    {
        Bitmap bitmap=surveyImageList.get(strFileName);
        if(bitmap!=null)
        {
            //bitmap.recycle();
            bitmap=null;
        }
        if(bitmap==null) {
            bitmap = Utilities.getImageFromSDCardThumbnail(
                    context, strFileName);
            Globals.surveyImageList.put(strFileName, bitmap);
        }
        return  bitmap;
    }

    public static Bitmap getSurveyImage(Context context,String strFileName) {
        Bitmap bitmap=surveyImageList.get(strFileName);
        if(bitmap==null) {
            bitmap = Utilities.getImageFromSDCardThumbnail(
                    context, strFileName);
            Globals.surveyImageList.put(strFileName, bitmap);
        }
        return  bitmap;
    }

    public static void recycleAllImages() {
        if(surveyImageList!=null)
        {
            for(String key:surveyImageList.keySet())
            {
                Bitmap b=surveyImageList.get(key);
                if(b!=null)
                {
                    Log.d(TAG,"recycleAllImages:"+key+":"+b.getByteCount());
                    //b.recycle();
                    b=null;
                }
            }
        }
        surveyImageList=new HashMap<>();
    }

    public static JSONObject getEmployeeParams(Context context)
    {
        DBHandler db=Globals.db;//new DBHandler(getDBContext());
        JSONObject jo=null;
        List<StaticListItem> items= db.getListItems("EmployeeList",orgCode,empCode);
        //db.close();
        if(items.size()==1)
        {
            StaticListItem item=items.get(0);
            try
            {
                if(!item.getOptParam1().equals(""))
                {
                    jo=new JSONObject(item.getOptParam1());
                    empParams=jo;
                    empType=empParams.optInt("t",0);

                    visitLockOption=empParams.optInt("vl",1)==1;
                    visitUnlockOption=empParams.optInt("vu",0)==1;
                    invoiceEditOption=empParams.optInt("el",0)==1;
                    if(empType==EMPLOYEE_TYPE_DELIVERY)
                    {

                    }
                }
            }catch (Exception e)
            {
                Log.e(TAG,"getEmployeeParams:"+e.toString());
            }

        }
        return  jo;
    }

    public static String getVisitMsgListName()
    {
        return  ((Globals.empType==1)?"D":"")+"VisitMsgList";
    }

    public static String getOrderListName()
    {
        return  ((Globals.empType==1)?"D":"")+"OrderList";
    }

    public static String getRoutePlanListName()
    {
        return  ((Globals.empType==1)?"D":"")+"RoutePlanList";
    }

    public static ArrayList<String> getLookupData(Context context,int lookupID)
    {
        DBHandler db=Globals.db;//new DBHandler(getDBContext());
        List<StaticListItem> items=db.getListItems("LookupList",orgCode,"OPTPARAM1='" + lookupID +  "'");

        //db.close();
        ArrayList<String> arrayList=new ArrayList<>();
        for(StaticListItem item:items)
        {
            arrayList.add(item.getOptParam2()+". "+item.getDescription());
        }
        return  arrayList;
    }
    public static void updateEmployeeSummary(final Context context){
        new Thread(new Runnable() {
            @Override
            public void run() {


            }
        }).start();
    }

    public static void handleTokenStatus(Context  context) {
        if(Globals.tokenExpired){
            //Token Expired
            Globals.userLoggedOff(context);
            Intent intent1=new Intent(context,LoginActivity.class);
            ((Activity) context).startActivity(intent1);
            ((Activity) context).finish();
        }

    }
    public static String extractVoiceName (String name){
        String[] _name = name.split("/");
        return _name[_name.length-1];
    }
    public static int getLanguageSettingIndex(Activity context){
        SharedPreferences settings = PreferenceManager.getDefaultSharedPreferences(context);
        String lang = settings.getString("LANG", "");
        switch(lang){
            case "es":
                return  1;
            case "fr":
                return  2;
            default:
                return 0;
        }
    }
    public static boolean checkLanguage(Activity context){
        SharedPreferences settings = PreferenceManager.getDefaultSharedPreferences(context);
        Configuration config = context.getBaseContext().getResources().getConfiguration();

        String lang = settings.getString("LANG", "");
        if (! "".equals(lang) && ! config.locale.getLanguage().equals(lang)) {
            Locale locale = new Locale(lang);
            Locale.setDefault(locale);
            config.locale = locale;
            context.getBaseContext().getResources().updateConfiguration(config, context.getBaseContext().getResources().getDisplayMetrics());
        }

        return true;
    }
    public static boolean addEmployeeLogData(Context context, Date localDate, Location location){

        Date date = Utilities.dateToUTC(localDate);
        String listName=GPS_LOG_LIST_NAME;
        String code=Utilities.getNumberDateForHourKey(date)+"-"+ empCode;
        String desc="{\"id\":\""+code+"\"}";
        String criteria = "code='" +code+"'";
        String hourId=Utilities.getNumberDateForHourKey(date);
        String data="[" + Utilities.getNumberDateForMinSecKey(date) + ","+ location.getLatitude()+","+location.getLongitude()+"]";
        int tzOffset=TimeZone.getDefault().getRawOffset()/60000;
        JSONArray jaData=null;

        try {
            jaData = new JSONArray(data);
        }catch (Exception e ){
            jaData=new JSONArray();
        }
        DBHandler dbHandler=Globals.db;//new DBHandler(getDBContext());
        List<StaticListItem> items= dbHandler.getMsgListItems(listName, orgCode, criteria );
        StaticListItem item=null;
        if(items.size()==1) {
            item = items.get(0);
        }else{
            item= new StaticListItem(orgCode,listName,code,desc,"{}","");
        }

        try {
            JSONObject joData=new JSONObject(item.getOptParam1());
            joData.put("id",code);
            joData.put("employee",empCode);
            joData.put("hourId",hourId);
            joData.put("tzOffset",tzOffset);
            //joData.put("data",jaData);
            JSONArray ja = joData.optJSONArray("data");
            if(ja==null){
                ja=new JSONArray();
            }
            ja.put(jaData);
            joData.put("data",ja);
            item.setOptParam1(joData.toString());
            dbHandler.AddOrUpdateMsgList(listName,orgCode,item,MESSAGE_STATUS_READY_TO_POST);

        }catch (Exception e){

            e.printStackTrace();
        }

        //dbHandler.close();
        return true;
    }
    public static String getPingAddress(String server, String port, String protocol){
        return protocol+"://" + server + ":"+ port + "/api/List/user/300";
    }
    public static Animation getBlinkAnimation(){
        Animation blinkAnimation;
        blinkAnimation = new AlphaAnimation(1, 0); // Change alpha from fully visible to invisible
        blinkAnimation.setDuration(300); // duration - half a second
        blinkAnimation.setInterpolator(new LinearInterpolator()); // do not alter animation rate
        blinkAnimation.setRepeatCount(3); // Repeat animation infinitely
        blinkAnimation.setRepeatMode(Animation.REVERSE);
        return blinkAnimation;
    }
    public static void initConfigs(){
        orgCode = "ps19";
        if(appName == AppName.SCIM){
            isSingleDefectSelection = true; // For selection of single defect code
            isIssueUpdateAllowed = false; // For updating issue after reported
            isWConditionMustReq = false; // For weather condition must req
            isMpReq = false; // For milepost entry at the start of run
            isTraverseReq = false; // For traverse by selection at the start of run
            isWConditionReq = false; // For weather condition display
            isBackOnTaskClose = true; // For auto back on run close
            isInspectionTypeReq = false; // For displaying inspection type
            isBypassTaskView = true; // For use single clock
            isUseDefaultAsset = true; // For using main track as default asset
            isUseRailDirection = false; // For the display of rail direction selection
            showNearByAssets = false; // For showing nearby asset
            isShowSwitchInspection = false; // For display of switch selection as separate dropdown
            isSmartObjectAvailable=true; // For new set of data update service
            PREFS_KEY_SERVER = "SCIM SERVER INFO";
        } else if (appName == AppName.TIMPS) {
            isSingleDefectSelection = true; // For selection of single defect code
            isIssueUpdateAllowed = false; // For updating issue after reported
            isWConditionMustReq = true; // For weather condition must req
            isMpReq = true; // For milepost entry at the start of run
            isTraverseReq = true; // For traverse by selection at the start of run
            isWConditionReq = true; // For weather condition display
            isBackOnTaskClose = true; // For auto back on run close
            isInspectionTypeReq = true; // For displaying inspection type
            isBypassTaskView = true; // For use single clock
            isUseDefaultAsset = true; // For using main track as default asset
            isUseRailDirection = true; // For the display of rail direction selection
            showNearByAssets = true; // For showing nearby asset
            isShowSwitchInspection = true; // For display of switch selection as separate dropdown
            isSmartObjectAvailable=true; // For new set of data update service
            PREFS_KEY_SERVER = "TIPS SERVER INFO";
        } else if (appName == AppName.EUIS) {
            isSingleDefectSelection = true; // For selection of single defect code
            isIssueUpdateAllowed = false; // For updating issue after reported
            isWConditionMustReq = false; // For weather condition must req
            isMpReq = false; // For milepost entry at the start of run
            isTraverseReq = false; // For traverse by selection at the start of run
            isWConditionReq = false; // For weather condition display
            isBackOnTaskClose = true; // For auto back on run close
            isInspectionTypeReq = false; // For displaying inspection type
            isBypassTaskView = true; // For use single clock
            isUseDefaultAsset = true; // For using main track as default asset
            isUseRailDirection = false; // For the display of rail direction selection
            showNearByAssets = false; // For showing nearby asset
            isShowSwitchInspection = false; // For display of switch selection as separate dropdown
            isSmartObjectAvailable=true; // For new set of data update service
            PREFS_KEY_SERVER = "EUIS SERVER INFO";

        }
    }
    public static void setLastLocInPref(SharedPref pref ){
        if(Globals.lastKnownLocation != null){
            pref.putString("LOCATION_LAT", String.valueOf(Globals.lastKnownLocation.getLatitude()));
            pref.putString("LOCATION_LON", String.valueOf(Globals.lastKnownLocation.getLongitude()));
            pref.putString("LOCATION_PROVIDER", Globals.lastKnownLocation.getProvider());
        }
    }
    public static Location retrieveLastLocFromPref(SharedPref pref){
        String lat = pref.getString("LOCATION_LAT");
        String lon = pref.getString("LOCATION_LON");
        Location location = null;
        if (!lat.equals("") && !lon.equals("")) {
            String provider = pref.getString("LOCATION_PROVIDER");
            location = new Location(provider);
            location.setLatitude(Double.parseDouble(lat));
            location.setLongitude(Double.parseDouble(lon));
        }
        return location;
    }
    public static void setLocale(Context context) {
        final String lang = PreferenceManager.getDefaultSharedPreferences(context).getString("LANG", "en");
        Configuration config = context.getResources().getConfiguration();
        Locale locale = new Locale(lang);
        Locale.setDefault(locale);
        config.locale = locale;
        context.getResources().updateConfiguration(config, context.getResources().getDisplayMetrics());
        Globals.sendBroadcastMessage(Globals.OBSERVABLE_MESSAGE_LANGUAGE_CHANGED, lang);
        //final Resources res = context.getResources();
        //res.updateConfiguration(config, res.getDisplayMetrics());
    }
    public static boolean isTimpsApp(){
        return (appName.equals(Globals.AppName.TIMPS));
    }
    public static void setOfflineMode(boolean offline){
        offlineMode=offline;
    }
    public static void isMaintainerRole(String role){
        isMaintainer = role.equals(Globals.MAINTENANCE_ROLE_NAME);
    }
    public static String getHosData(Context context, String startDate, String endDate){
        String url=wsBaseURL +"users/hos/"+ user.get_id()+"/"+"?";
        url+="startDate=" + startDate;
        url+="&endDate=" + endDate;
        url+="&id=" + user.get_id();
        String jsonObject=null;
        jsonObject = JsonWebService.getJSON(url , 5000);
        if(jsonObject==null)
        {
            return  null;
        }
        return jsonObject;
    }
    public static String updateHosData(Context context, String startDate, String endDate,String comments){
        String url=wsBaseURL +"users/hos/"+ user.get_id()+"/";
        String jsonObject=null;
        try {
            JSONObject joInputData = new JSONObject();
            JSONObject joInputDetail = new JSONObject();
            joInputDetail.put("startDate", startDate);
            if(!endDate.equals("")) {
                joInputDetail.put("endDate", endDate);
            }
            joInputDetail.put("comments",comments);
            joInputDetail.put("email", userEmail);
            jsonObject = JsonWebService.putJSON(url, joInputDetail.toString(), 5000);
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        if(jsonObject==null)
        {
            return  null;
        }
        return jsonObject;
    }

    public static boolean updatePassword(Context context, String oldPassword, String newPassword){
        String url=wsBaseURL +"users/"+ user.get_id()+"/"+"password";
        String jsonObject=null;
        try {
            JSONObject joInputData = new JSONObject();
            JSONObject joInputDetail = new JSONObject();
            joInputDetail.put("oldPassword", oldPassword);
            joInputDetail.put("newPassword", newPassword);
            joInputDetail.put("source", "mobile");
            jsonObject = JsonWebService.putJSON(url, joInputDetail.toString(), 5000);
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        if(jsonObject==null)
        {
            return  false;
        }
        return true;
    }
    public static boolean addUpdateUserImgName(IssueImage img, String mode){
        String url=wsBaseURL +"users/"+ user.get_id()+"/"+"update";
        String jsonObject=null;
        try {
            JSONObject joInputData = new JSONObject();
            JSONObject joInputDetail = new JSONObject();
            joInputDetail.put(mode, img.getJsonObject());
            jsonObject = JsonWebService.putJSON(url, joInputDetail.toString(), 5000);
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        if(jsonObject==null)
        {
            return  false;
        } else {
            try {
                user = new User(new JSONObject(jsonObject));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return true;
    }
    public static boolean checkJourneyPlanExpired(){
        if(selectedJPlan!=null){
            try {
                Date sDate=FULL_DATE_FORMAT.parse(selectedJPlan.getStartDateTime());
                Date cDate=new Date();
                Calendar cal = Calendar.getInstance();
                cal.setTime(sDate);
                cal.add(Calendar.DAY_OF_MONTH, 1);
                cal.set(Calendar.HOUR_OF_DAY,0);
                cal.set(Calendar.MINUTE,0);
                cal.set(Calendar.SECOND,0);
                if(cDate.after(cal.getTime())){
                    //Day must be closed
                    Log.d("Globals"," Day must be closed");
                    return true;
                }
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        return false;
    }
    public static void setSelectedTask(Task task){
        selectedTask=task;
    }
    public static Task getSelectedTask(){
        return selectedTask;
    }
    public static Units getSelectedUnit(){
        return selectedUnit;
    }
    public static void  setSelectedUnit(Units unit){
        selectedUnit=unit;
    }

    public static void autoCloseInspection(Activity context, ProgressDialog dialog, String lat, String lon){
        new Thread(() -> endTaskAndInspection(lat,lon, context,dialog)).start();
    }
    private static void endTaskAndInspection(String latitude, String longitude, Activity context, ProgressDialog dialog){
        Date now = new Date();
        String location;
        try {
            //Closing Inspection Start
            if(latitude.equals("")||longitude.equals("")){
                location="0.0" +","+"0.0";
            } else {
                location=latitude +","+longitude;
            }

            JourneyPlan jp=Globals.selectedJPlan;
            if(Globals.inbox != null){
                if(jp == null){
                    jp =Globals.inbox.getCurrentJourneyPlan();
                }
                if(jp == null){
                    context.runOnUiThread(() -> {
                        Toast.makeText(context,context.getResources().getString(R.string.unable_to_find_work_plan),Toast.LENGTH_SHORT).show();
                    });
                    return;
                }
            }
            String listName = Globals.JPLAN_LIST_NAME;
            JSONObject jo = new JSONObject();

            Date _date = new Date();

            try {
                for(Task task: jp.getTaskList()){
                    if(latitude.equals("")||longitude.equals("")){
                        task.setEndLocation("0.0" + "," + "0.0");
                    } else {
                        task.setEndLocation(latitude + "," + longitude);
                    }

                    task.setStatus(TASK_FINISHED_STATUS);
                    Globals.isTaskStarted = false;
                    task.setEndTime(now.toString());
                    //In case of yard inspection
                    if(task.isYardInspection() || isMaintainer){
                        task.setUserEndMp(task.getMpEnd());
                    }
                }
                //TODO: will handle this in case of multiple tasks
                for(Session session: jp.getIntervals().getSessions()){
                    if(session.getStatus().equals(SESSION_STARTED)){
                        session.setStatus(SESSION_STOPPED);
                        session.setEndTime(_date.toString());
                        if(latitude.equals("")||longitude.equals("")){
                            session.setEndLocation("0.0" + "," + "0.0");
                        } else {
                            session.setEndLocation(latitude + "," + longitude);
                        }
                        if(jp.getTaskList().get(0).getUserEndMp().equals("")){
                            session.setEnd(jp.getTaskList().get(0).getMpEnd());
                        } else {
                            session.setEnd(jp.getTaskList().get(0).getUserEndMp());
                        }
                    }
                }
                jp.setEndDateTime(_date.toString());
                jp.setEndLocation(location);
                jp.setStatus(WORK_PLAN_FINISHED_STATUS);
                if(!offlineMode){
                    jo=jp.getJsonObject();
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
            //Adding logic to merge pending data
            DBHandler db = Globals.db;
            List<StaticListItem> pItems = db.getMsgListItems(listName, orgCode, "code='" + jp.getuId() + "' AND status=" + MESSAGE_STATUS_READY_TO_POST);
            if(pItems.size()>0){
                JSONObject pendingItem = null;
                try {
                    pendingItem = new JSONObject(pItems.get(0).getOptParam1());
                    jo = Utilities.addObject(pendingItem, jo);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
            StaticListItem item = new StaticListItem(Globals.orgCode, listName
                    , jp.getuId(), "", jo.toString(), "");
            isDayProcessRunning=true;
            context.runOnUiThread(() -> showDialog(dialog,context.getResources().getString(R.string.work_plan),context.getResources().getString(R.string.finishing_inspection)));
            Log.i("Message", "Crossing from Inspection finishing dialog");
            //db.AddOrUpdateMsgList(Globals.SOD_LIST_NAME, Globals.orgCode, item, Globals.MESSAGE_STATUS_READY_TO_POST);

            ArrayList<StaticListItem> items=new ArrayList<>();
            items.add(item);
            if(!Globals.offlineMode && webUploadMessageLists(context,orgCode,items)==1){
                List<StaticListItem> _items=null;
                if(webPullRequest(context,"")){
                    inbox.loadSampleData(context);
                    saveCurrentJP(jp.getPrivateKey());
                    jp = inbox.getLastJourneyPlan();
                    selectedJPlan=jp;
                    if(pItems.size()>0){
                        db.RemoveMsgListItems(pItems,MESSAGE_STATUS_READY_TO_POST);
                    }
                    if(jp !=null) {
                        if (!jp.getEndDateTime().equals("")) {
                            //Day end successful
                            showToastOnUiThread(context,context.getResources().getString(R.string.inspection_closed));
                            isDayProcessRunning = false;
                            context.runOnUiThread(() -> {
                                loadDayStatus(context);
                            });
                        }
                    }
                }
            } else if(Globals.offlineMode){
                if(jp.getWorkplanTemplateId().equals("")){
                    Log.i("WPLAN ID ", "ID is empty");
                }
                jp.update();
                if(jp.getWorkplanTemplateId().equals("")){
                    Log.i("WPLAN ID ", "ID is empty");
                }
                jp.reloadId();
                String uid=jp.getuId();
                if(uid.equals("")){
                    uid=jp.getPrivateKey();
                }
                Globals.saveCurrentJP(uid);
                inbox.loadSampleData(context);
                Globals.loadDayStatus(context);
            } else {
                Toast.makeText(context, "Network Error!", Toast.LENGTH_SHORT).show();
                hideDialog(dialog);
                return;
            }

            context.runOnUiThread(() -> {
                setSelectedTask(null);
                Globals.selectedUnit = null;
                Globals.safetyBriefing = null;
                Globals.selectedWorker = null;
                Globals.selectedJPlan = null;
                Globals.imageFileName = null;
                Globals.defectCodeSelection = null;
                Globals.newReport = null;
                Globals.selectedDUnit = null;
                isDayProcessRunning=false;
                dayStarted = false;
                hideDialog(dialog);
            });
            //Closing Inspection End

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public static void showDialog(ProgressDialog dialog,String title,String message){
        dialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
        dialog.setTitle(title);
        dialog.setMessage(message);
        dialog.setIndeterminate(true);
        dialog.setCanceledOnTouchOutside(false);
        dialog.show();
    }
    private static void showToastOnUiThread(Activity context,String message){
        context.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(context,message,Toast.LENGTH_SHORT).show();

            }
        });
    }

    public static void hideDialog(ProgressDialog dialog){
        if(dialog!=null){
            if(dialog.isShowing()){
                dialog.dismiss();
            }
        }
    }
    public static String getVersionUrl(){
        String protocol = mPrefs.getString(wsDomainName, "http");
        return protocol+"://" + wsDomainName + (wsPort.equals("") ? "" : (":" + wsPort) )+ wsVersionUrl;
    }
    public static String getVersionUrl(String server, String port, String protocol){
        return protocol+"://" + server + ":"+port + wsVersionUrl;
    }
    public static VersionInfo getVersionInfo(){
        Gson gson = new Gson();
        String json = mPrefs.getString("VersionInfoObj", "");
        VersionInfo version = gson.fromJson(json, VersionInfo.class);
        return version;
    }
    public static void setVersionInfo(VersionInfo version){

        Gson gson = new Gson();
        String json = gson.toJson(version);
        mPrefs.putString("VersionInfoObj", json);
        versionInfo = version;
    }
    public static VersionInfo loadVersionInfo(){
        VersionInfo version = null;
        try {
            String versionData = JsonWebService.getJSON(getVersionUrl(), 5000);
            if(versionData!=null){
                version = new VersionInfo(new JSONObject(versionData));
                setVersionInfo(version);
            }
        } catch (Exception e) {
            Log.e(TAG,e.toString());
        }
        return version;
    }
    public static String getWsDomain(){
        String protocol = mPrefs.getString(wsDomainName, "http");
        return protocol+"://" + wsDomainName + (wsPort.equals("") ? "" : (":" + wsPort) );
    }
    public static void setUrls(){
        if(dbContext!=null){
            wsBaseURL=getWsDomain()+"/api/";
            wsImgURL = getWsDomain() + "/applicationresources/";
            wsVersionUrl = "/api/version";
            //public  static  String wsImageURL=wsDomain +"/images/";
            wsReportURL=wsBaseURL+"Reports/";
        }
    }
    public static ATIVDefect getSelectedAtivDef(){
        return sATIVDefect;
    }
    public static void setSelectedAtivDef(ATIVDefect aDefect){
        sATIVDefect = aDefect;
    }
    public static LocationPrefix getLocPrefix(){
        return selectedLocPrefix;
    }
    public static void setLocationPrefix(String id){
        selectedLocPrefix = ListMap.getLocationPrefix(id);
    }
    public static String getPrefixMp(String mp){
        String mpPrefix = null;
        try {
            if(getLocPrefix()!=null) {
                mpPrefix = getLocPrefix().getPrefix(mp);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        if(mpPrefix!=null){
            return mpPrefix + " - " + mp;
        } else {
            return mp;
        }
    }
    public static String getPrefixMpOnly(String mp){
        String mpPrefix = null;
        try {
            mpPrefix = getLocPrefix().getPrefix(mp);
        } catch (Exception e) {
            e.printStackTrace();
        }
        if(mpPrefix!=null){
            return mpPrefix + " - ";
        } else {
            return "";
        }
    }
    public static String getPrefixMp(String mp, String locId){
        LocationPrefix locPrefix = ListMap.getLocationPrefix(locId);
        if(locPrefix!=null) {
            String mpPrefix = null;
            try {
                mpPrefix = locPrefix.getPrefix(mp);
            } catch (Exception e) {
                e.printStackTrace();
            }
            if (mpPrefix != null) {
                return mpPrefix + " - " + mp;
            } else {
                return mp;
            }
        }
        return "";
    }
    public static String getPrefixMpOnly(String mp, String locId){
        LocationPrefix locPrefix = ListMap.getLocationPrefix(locId);
        if(locPrefix!=null){
            String mpPrefix = null;
            try {
                mpPrefix = locPrefix.getPrefix(mp);
            } catch (Exception e) {
                e.printStackTrace();
            }
            if(mpPrefix!=null){
                return mpPrefix + " - ";
            } else {
                return "";
            }
        }
        return "";
    }
}

