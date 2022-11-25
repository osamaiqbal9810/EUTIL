package com.app.ps19.tipsapp.Shared;

import static android.content.ContentValues.TAG;
import static com.app.ps19.tipsapp.Shared.Globals.GPS_LOG_LIST_NAME;
import static com.app.ps19.tipsapp.Shared.Globals.ISSUE_IMAGE_STATUS_ERROR;
import static com.app.ps19.tipsapp.Shared.Globals.ISSUE_IMAGE_STATUS_UPLOADED;
import static com.app.ps19.tipsapp.Shared.Globals.JPLAN_LIST_NAME;
import static com.app.ps19.tipsapp.Shared.Globals.MESSAGE_STATUS_PENDING_TO_POST;
import static com.app.ps19.tipsapp.Shared.Globals.MESSAGE_STATUS_READY_TO_POST;
import static com.app.ps19.tipsapp.Shared.Globals.OBSERVABLE_MESSAGE_UPLOADING_IMAGE;
import static com.app.ps19.tipsapp.Shared.Globals.db;
import static com.app.ps19.tipsapp.Shared.Globals.isLogAllowed;
import static com.app.ps19.tipsapp.Shared.Globals.isServiceInCall;
import static com.app.ps19.tipsapp.Shared.Globals.loginContext;
import static com.app.ps19.tipsapp.Shared.Globals.mainActivity;
import static com.app.ps19.tipsapp.Shared.Globals.sendBroadcastMessage;
import static com.app.ps19.tipsapp.Shared.Globals.setUserImage;
import static com.app.ps19.tipsapp.Shared.Globals.wsBaseURL;
import static com.app.ps19.tipsapp.Shared.Utilities.addObject;
import static com.app.ps19.tipsapp.Shared.Utilities.appendLog;
import static com.app.ps19.tipsapp.Shared.Utilities.getImgPath;
import static com.app.ps19.tipsapp.Shared.Utilities.getVoicePath;
import static com.app.ps19.tipsapp.Shared.Utilities.isImageFileExists;

import android.content.Context;
import android.util.Log;

import com.app.ps19.tipsapp.classes.Inbox;
import com.app.ps19.tipsapp.classes.IssueImage;
import com.app.ps19.tipsapp.classes.IssueVoice;
import com.koushikdutta.async.future.FutureCallback;
import com.koushikdutta.ion.Ion;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.net.HttpURLConnection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.annotations.NonNull;
import io.reactivex.rxjava3.core.Completable;
import io.reactivex.rxjava3.core.CompletableEmitter;
import io.reactivex.rxjava3.core.CompletableObserver;
import io.reactivex.rxjava3.core.CompletableOnSubscribe;
import io.reactivex.rxjava3.core.ObservableEmitter;
import io.reactivex.rxjava3.core.ObservableOnSubscribe;
import io.reactivex.rxjava3.core.Observer;
import io.reactivex.rxjava3.core.Scheduler;
import io.reactivex.rxjava3.disposables.Disposable;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.schedulers.Schedulers;

public class DataUploadHandler {
    private static DataUploadHandler dataUploadHandler=new DataUploadHandler();
    //private static  String url = wsBaseURL + "msglist/" ;
    private Context context;

    public static String getUrl() {
        return wsBaseURL + "msglist/";
    }
    private DataUploadHandler(){

    }
    public static DataUploadHandler getInstance(){
        return dataUploadHandler;
    }
    //This method will check if there is some data to upload "Ready to Post"
    public  int upload(final Context context, String orgCode)
    {
        Globals.isServiceInCall=true;
        //"{appid}/{orgcode:int}"
        //String url = wsBaseURL + "msglist/" ;
        String jsonObject = null;
        int intRetValue=0;
        boolean dataChanged=false;
        this.context=context;
        DBHandler db = Globals.db;//new DBHandler(getDBContext());
        List<StaticListItem> items=db.getMsgListItems(orgCode,"status="
                +MESSAGE_STATUS_READY_TO_POST); //Ready to be posted

        long connTimeDiff=Globals.lastConnTimeDiff/1000;

        if(connTimeDiff>150 || items.size()>0)
        {
            Log.i(TAG,"Last Conn Time Diff:"+ String.valueOf(connTimeDiff)+ " (s)");
            Log.i(TAG, String.valueOf(items.size()));
        }

        if(items.size()>0)
        {
            boolean isServerAvailable=Globals.isServerAvailable();
            Globals.setOfflineMode(!isServerAvailable);
            if(!isServerAvailable){
                Log.i("Server Status","Unavailable");
                Globals.isServiceInCall = false;
                return -1;
            }
            for(StaticListItem staticItem: items){
                db.AddOrUpdateMsgList(staticItem.getListName(),"pending",staticItem,MESSAGE_STATUS_PENDING_TO_POST);
            }
            db.RemoveMsgListItems(items,MESSAGE_STATUS_READY_TO_POST);
            JSONArray ja=new JSONArray();
            ArrayList<IssueImage> imageList=new ArrayList<>();
            ArrayList<IssueVoice> voiceList=new ArrayList<>();
            for(StaticListItem item:items)
            {
                if(item.getListName().equals(JPLAN_LIST_NAME)){
                    // Search for images
                    Log.i("Request Status","Searching for images");
                    List<IssueImage> imageLists=item.getImageList();
                    HashMap<String , Integer> imageListUpdated= new HashMap<>();
                    for(IssueImage issueImage : imageLists){
                        if (issueImage.getImgName() != null) {
                            if (!issueImage.getImgName().equals("") && isImageFileExists(issueImage.getImgName())) {
                                issueImage.setParent(item);
                                imageList.add(issueImage);
                            }
                        }
                    }
                    //Check if status need to be updated
                    // Search for voice
                    Log.i("Request Status","Searching for voices");
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
            uploadIssueImages(imageList)
                    .observeOn(Schedulers.trampoline())
                    .subscribeOn(AndroidSchedulers.mainThread())
                    .subscribe(uploadIssueImageObserver(items,imageList,voiceList));
            //this method upload images
            /*
            uploadIssueImages(imageList)
                    .then(res->{
                        //this method set the status of uploaded images
                        Log.i("Request Status","upload images");
                        //TODO: call was dropping from here
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
                        Log.i("Request Status","Upload voices");
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
                            if(isLogAllowed){
                                appendLog(ja.toString());
                            }
                            long tStart = System.currentTimeMillis();
                            try {
                                isServiceInCall = true;
                                System.out.println(ja.toString());
                                System.out.println("Thread: "+Thread.currentThread().getName());
                                strRetValue = JsonWebService.postJSON(url, ja.toString(), 15000);
                                //Thread.sleep(20000);
                            }catch (Exception e)
                            {
                                Log.e(TAG,e.toString());
                            }
                            isServiceInCall = false;
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
                                //db.RemoveMsgListItems(items,MESSAGE_STATUS_READY_TO_POST);
                                ArrayList<String> sentItemList=new ArrayList<>();
                                for(StaticListItem item:items){
                                    sentItemList.add(item.getListName());
                                }
                                sendBroadcastMessage(OBSERVABLE_MESSAGE_DATA_SENT,sentItemList.toString());

                            }else if(strRetValue.startsWith("error:") && items.size()==1){
                                items.get(0).setStatus(MESSAGE_STATUS_ERROR);
                                db.AddOrUpdateMsgList(items.get(0).getListName(),orgCode,items.get(0),MESSAGE_STATUS_ERROR);
                            } else {
                                Log.i("In timeout case", items.toString());
                                List<StaticListItem> itemsToMatch=db.getMsgListItems(orgCode,"status="
                                        +MESSAGE_STATUS_READY_TO_POST); //Ready to be posted
                                if(itemsToMatch.size()>0){
                                    for(StaticListItem stItem: items){
                                        JSONObject mainObject = null;
                                        StaticListItem targetItem=findItem((ArrayList<StaticListItem>) itemsToMatch, stItem);
                                        if(targetItem!=null) {
                                            try {
                                                mainObject = new JSONObject(stItem.getOptParam1());
                                                JSONObject targetObject=new JSONObject(targetItem.getOptParam1());
                                                mainObject=addObject(mainObject, targetObject);
                                                targetItem.setOptParam1(mainObject.toString());
                                                db.AddOrUpdateMsgList(targetItem.getListName(),targetItem.getOrgCode(),targetItem,MESSAGE_STATUS_READY_TO_POST);
                                            } catch (JSONException e) {
                                                e.printStackTrace();
                                            }
                                        }
                                    }

                                }

                            }
                            db.RemoveMsgListItems(items,"pending",MESSAGE_STATUS_PENDING_TO_POST);
                            p.resolve(true);


                        }).start();
                        return p;
                    });*/
        }else{
            Globals.isServiceInCall=false;
        }
        //db.close();
        return intRetValue;
    }
    //Observer Functions
    private Observer<IssueImage> uploadIssueImageObserver(List<StaticListItem> items,List<IssueImage> issueItems,List<IssueVoice> issueVoices){
        return new Observer<IssueImage>(){

            @Override
            public void onSubscribe(@NonNull Disposable d) {

            }

            @Override
            public void onNext(@NonNull IssueImage issueImage) {
                System.out.println("Uploading image "+issueImage.getImgName());
                //issueImage.getParent().setImageStatus(issueImage)
            }

            @Override
            public void onError(@NonNull Throwable e) {
                errorHandler("Image", e);
            }

            @Override
            public void onComplete() {
                ArrayList<StaticListItem> _items = new ArrayList<>();
                for(StaticListItem item:items){
                    ArrayList<IssueImage> itemImages=getIssueImagesByItem(item,issueItems);
                    HashMap<String, Integer> itemImagesHash=getIssueImageHashmap(itemImages,ISSUE_IMAGE_STATUS_UPLOADED);
                    boolean dataChanged=item.setImageStatusEx(issueItems,itemImagesHash);
                    if(dataChanged){
                        // need to change image status in current loaded journeyPlan
                        if(Globals.selectedJPlan!=null){
                            Globals.selectedJPlan.setImageStatus(itemImagesHash);
                        }
                        //need to reload this item
                        List<StaticListItem> newItems=db.getMsgListItems(item.getListName(),"pending","code='"+ item.getCode() +"'");
                        if(newItems.size()>0){
                            //item = newItems.get(0);
                            _items.add(newItems.get(0));
                        }else{
                            _items.add(item);
                        }
                    }else{
                        _items.add(item);
                    }
                }
                uploadIssueVoices(issueVoices)
                        .observeOn(Schedulers.trampoline())
                        .subscribeOn(AndroidSchedulers.mainThread())
                        .subscribe(uploadIssueVoiceObserver(_items,issueVoices));
            }

        };
    }
    private Observer<IssueVoice> uploadIssueVoiceObserver(List<StaticListItem> items,List<IssueVoice> issueVoices){
        return new Observer<IssueVoice>(){

            @Override
            public void onSubscribe(@NonNull Disposable d) {

            }

            @Override
            public void onNext(@NonNull IssueVoice issueVoice) {
                System.out.println("Uploading voice "+issueVoice.getVoiceName());
                //issueImage.getParent().setImageStatus(issueImage)
            }

            @Override
            public void onError(@NonNull Throwable e) {
                errorHandler("Voice", e);
            }

            @Override
            public void onComplete() {
                ArrayList<StaticListItem> _items = new ArrayList<>();
                for(StaticListItem item:items){
                    ArrayList<IssueVoice> itemImages=getIssueVoiceByItem(item,issueVoices);
                    HashMap<String, Integer> itemVoicesHash=getIssueVoiceHashmap(issueVoices,ISSUE_IMAGE_STATUS_UPLOADED);
                    boolean dataChanged=item.setVoiceStatusEx(issueVoices,itemVoicesHash);
                    if(dataChanged){
                        //need to reload this item
                        // need to change image status in current loaded journeyPlan
                        if(Globals.selectedJPlan!=null){
                            Globals.selectedJPlan.setVoiceStatus(itemVoicesHash);
                        }
                        List<StaticListItem> newItems=db.getMsgListItems(item.getListName(),"pending","code='"+ item.getCode() +"'");
                        if(newItems.size()>0){
                            //item = newItems.get(0);
                            _items.add(newItems.get(0));
                        }else{
                            _items.add(item);
                        }
                    }else{
                        _items.add(item);
                    }
                }
                uploadData(_items).subscribeOn(Schedulers.single())
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribeWith(uploadDataObserver())

                ;
            }

        };
    }

    private Observable<IssueImage> uploadIssueImages(List<IssueImage> items){
        final Disposable[] disposable = new Disposable[1];
        return Observable.create(new ObservableOnSubscribe<IssueImage>() {
            @Override
            public void subscribe(@NonNull ObservableEmitter<IssueImage> emitter) throws Throwable {
                HashMap<String,IssueImage> imageQue=new HashMap<>();
                for(IssueImage item:items){
                    imageQue.put(item.getImgName(),item);
                    emitter.onNext(item);
                    uploadMultipartImageAsync(item.getImgName(),item)
                            .subscribeOn(Schedulers.trampoline())
                            .subscribe(new CompletableObserver() {
                                @Override
                                public void onSubscribe(@NonNull Disposable d) {
                                    disposable[0] =d;
                                }

                                @Override
                                public void onComplete() {
                                    item.setStatus(ISSUE_IMAGE_STATUS_UPLOADED);
                                    imageQue.remove(item.getImgName());

                                }

                                @Override
                                public void onError(@NonNull Throwable e) {
                                    try {
                                        item.setStatus(ISSUE_IMAGE_STATUS_ERROR);
                                        emitter.onError(e);
                                    } catch (Exception ex) {
                                        ex.printStackTrace();
                                    }
                                }
                            });

                }
                if(!emitter.isDisposed()){
                    emitter.onComplete();
                }

            }
        });
        /*return new Observable<IssueImage>() {
            @Override
            protected void subscribeActual(@NonNull Observer<? super IssueImage> observer) {
                HashMap<String,IssueImage> imageQue=new HashMap<>();
                for(IssueImage item:items){
                    imageQue.put(item.getImgName(),item);
                    observer.onNext(item);
                    uploadMultipartImageAsync(item.getImgName(),item)
                            .subscribeOn(Schedulers.io())
                            .subscribe(new CompletableObserver() {
                        @Override
                        public void onSubscribe(@NonNull Disposable d) {
                            disposable[0] =d;
                        }

                        @Override
                        public void onComplete() {
                            item.setStatus(ISSUE_IMAGE_STATUS_UPLOADED);
                            imageQue.remove(item.getImgName());

                        }

                        @Override
                        public void onError(@NonNull Throwable e) {
                            item.setStatus(ISSUE_IMAGE_STATUS_ERROR);
                            observer.onError(e);
                        }
                    });

                }
                observer.onComplete();
            }
        };*/
    }
    private Observable<IssueVoice> uploadIssueVoices(List<IssueVoice> items){
        final Disposable[] disposable = new Disposable[1];
        return Observable.create(new ObservableOnSubscribe<IssueVoice>() {
            @Override
            public void subscribe(@NonNull ObservableEmitter<IssueVoice> emitter) throws Throwable {
                HashMap<String,IssueVoice> voiceQue=new HashMap<>();
                for(IssueVoice item:items){
                    voiceQue.put(item.getVoiceName(),item);
                    emitter.onNext(item);
                    uploadMultipartVoiceAsync(item.getVoiceName(),item)
                            .subscribeOn(Schedulers.trampoline())
                            .subscribe(new CompletableObserver() {
                                @Override
                                public void onSubscribe(@NonNull Disposable d) {
                                    disposable[0] =d;
                                }

                                @Override
                                public void onComplete() {
                                    item.setStatus(ISSUE_IMAGE_STATUS_UPLOADED);
                                    voiceQue.remove(item.getVoiceName());

                                }

                                @Override
                                public void onError(@NonNull Throwable e) {
                                    item.setStatus(ISSUE_IMAGE_STATUS_ERROR);
                                    emitter.onError(e);
                                }
                            });

                }
                if(!emitter.isDisposed()){
                    emitter.onComplete();
                }

            }
        });
     }
    private Completable uploadData(List<StaticListItem> items){
            return Completable.create(new CompletableOnSubscribe() {
                @Override
                public void subscribe(@NonNull CompletableEmitter emitter) throws Throwable {
                    String strRetValue=null;
                    System.out.println("Sending Data");
                    JSONArray ja=new JSONArray();
                    //ArrayList<StaticListItem> _items=new ArrayList<StaticListItem>();
                   /* for(StaticListItem item : items){
                        List<StaticListItem> newItems=db.getMsgListItems(item.getListName(),"pending","code='"+ item.getCode() +"'");
                        if(newItems!=null&&newItems.size()>0){
                            _items.addAll(newItems);
                        }
                    }*/
                    List<StaticListItem> _items=db.getMsgListItems("pending","status='"+ MESSAGE_STATUS_PENDING_TO_POST +"'");

                    for(StaticListItem item:_items){
                        if(Inbox.isLocalJPCode(item.getCode())){
                            item.setHoldCode(true);
                        }
                        ja.put(item.getMultiJSONObject());

                    }

                    if(isLogAllowed){
                        appendLog(ja.toString());
                    }
                    long tStart = System.currentTimeMillis();
                    try {
                        //It's useless here
                        Globals.isServiceInCall = true;

                        System.out.println(ja.toString());
                        System.out.println("Thread: "+Thread.currentThread().getName());
                        strRetValue = JsonWebService.postJSON(getUrl(), ja.toString(), 15000);
                        //Thread.sleep(20000);
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
                        emitter.onError(new Exception("Server not responding"));
                        //Copy Data back to ready to post status
                        copyBackToReadyToPost(items);
                        Globals.db.RemoveMsgListItems(_items,MESSAGE_STATUS_PENDING_TO_POST);
                        isServiceInCall = false;
                        return;
                    }
                    strRetValue=strRetValue.replace("\"","");
                    strRetValue=strRetValue.replace("\n","");
                    Log.i("webUploadMessageLists","Sending data to webserivce size:"+ items.size()+" ret:"+strRetValue);
                    try {
                        Globals.ringtone1(context,0);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    if(strRetValue.equals("success"))
                    {
                        for(StaticListItem item:items){
                            item.setHoldCode(false);
                        }

                            /*List<StaticListItem> itemsToMatch=db.getMsgListItems(orgCode,"status="
                                    +MESSAGE_STATUS_READY_TO_POST); //Ready to be posted
                            for(StaticListItem item: itemsToMatch){
                                StaticListItem _targetItem=findItem((ArrayList<StaticListItem>) items,item);
                                if(_targetItem!=null){
                                    if(_targetItem.getOptParam1().equals(item.getOptParam1())){
                                        db.RemoveMsgListItem(_targetItem);
                                    }
                                }
                            }*/
                        //intRetValue=db.UpdateMsgListStatus(orgCode,items,MESSAGE_STATUS_POSTED);
                        //db.RemoveMsgListItems(items,MESSAGE_STATUS_READY_TO_POST);
                        ArrayList<String> sentItemList=new ArrayList<>();
                        for(StaticListItem item:items){
                            sentItemList.add(item.getListName());
                        }
                        sendBroadcastMessage(Globals.OBSERVABLE_MESSAGE_DATA_SENT,sentItemList.toString());

                    }else if(strRetValue.startsWith("error:") && items.size()==1){
                        items.get(0).setStatus(Globals.MESSAGE_STATUS_ERROR);
                        Globals.db.AddOrUpdateMsgList(items.get(0).getListName(),Globals.orgCode,items.get(0),Globals.MESSAGE_STATUS_ERROR);
                    } else {
                        Log.i("In timeout case", items.toString());
                        //Copy Data back to ready to post status
                        copyBackToReadyToPost(items);
                    }
                    Globals.db.RemoveMsgListItems(_items,MESSAGE_STATUS_PENDING_TO_POST);
                    //Globals.db.RemoveMsgListItems(items,"pending",MESSAGE_STATUS_READY_TO_POST);
                    Globals.isServiceInCall = false;
                }
            });
    }
    public Completable uploadMultipartImageAsync(String uFile,IssueImage issueImage) {
        return Completable.create(new CompletableOnSubscribe() {
            @Override
            public void subscribe(@NonNull CompletableEmitter emitter) throws Throwable {
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
                                        emitter.onError(e);
                                    }else{
                                        if(issueImage!=null) {
                                            issueImage.setStatus(ISSUE_IMAGE_STATUS_UPLOADED);
                                        }
                                        emitter.onComplete();
                                    }
                                }
                            });
                }catch (Exception e)
                {
                    Log.d(TAG,"uploadMultipartImage:"+e.toString());
                    emitter.onError(e);
                }

            }
        });

    }
    private Completable uploadMultipartVoiceAsync(String uFile,IssueVoice issueVoice) {
        return Completable.create(new CompletableOnSubscribe() {
            @Override
            public void subscribe(@NonNull CompletableEmitter emitter) throws Throwable {
                //Promise p =new Promise();
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
                                        if(issueVoice!=null){
                                            issueVoice.setStatus(ISSUE_IMAGE_STATUS_ERROR);
                                        }
                                    }else{
                                        if(issueVoice!=null){
                                            issueVoice.setStatus(ISSUE_IMAGE_STATUS_UPLOADED);
                                        }
                                    }
                                }
                            });
                }catch (Exception e)
                {
                    Log.d(TAG,"uploadMultipartVoiceAsync:"+e.toString());
                    emitter.onError(e);
                }
            }
        });
        /*String file_path= Environment.getExternalStorageDirectory()+"/"+Globals.voiceFolderName
                +"/"+uFile;*/

    }
    //Error Handler
    private void  errorHandler(String source, Throwable e){
        System.out.println("Error Occurred in "+source );
        e.printStackTrace();
        Globals.isServiceInCall = false;
    }
    private static StaticListItem findItem(ArrayList<StaticListItem> items, StaticListItem item){
        for(StaticListItem _item:items){
            if(_item.isEqualListAndCode(item)){
                return _item;
            }
        }
        return  null;
    }
    private CompletableObserver uploadDataObserver(){
        return new CompletableObserver() {
            @Override
            public void onSubscribe(@NonNull Disposable d) {

            }

            @Override
            public void onComplete() {
                System.out.println("Data upload Complete");
            }

            @Override
            public void onError(@NonNull Throwable e) {
                errorHandler("dataUpload",e);
            }
        };
    }

    public ArrayList<IssueImage> getIssueImagesByItem(StaticListItem item, List<IssueImage> imagelist){
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
    private HashMap<String, Integer> getIssueImageHashmap(List<IssueImage> imageList, Integer status){
        HashMap<String, Integer> _hasp=new HashMap<>();
        for(IssueImage image:imageList){
            _hasp.put(image.getImgName(),status);
        }
        return _hasp;
    }

    private ArrayList<IssueVoice> getIssueVoiceByItem(StaticListItem item, List<IssueVoice> voiceList){
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
    private HashMap<String, Integer> getIssueVoiceHashmap(List<IssueVoice> voiceList, Integer status){
        HashMap<String, Integer> _hasp=new HashMap<>();
        for(IssueVoice image:voiceList){
            _hasp.put(image.getVoiceName(),status);
        }
        return _hasp;
    }
    private void copyBackToReadyToPost(List<StaticListItem> items){
        List<StaticListItem> itemsToMatch=Globals.db.getMsgListItems(Globals.orgCode,"status="
                +MESSAGE_STATUS_READY_TO_POST); //Ready to be posted
        if(itemsToMatch.size()>0){
            for(StaticListItem stItem: items){
                JSONObject mainObject = null;
                StaticListItem targetItem=findItem((ArrayList<StaticListItem>) itemsToMatch, stItem);
                if(targetItem!=null) {
                    try {
                        mainObject = new JSONObject(stItem.getOptParam1());
                        JSONObject targetObject=new JSONObject(targetItem.getOptParam1());
                        mainObject=addObject(mainObject, targetObject);
                        targetItem.setOptParam1(mainObject.toString());
                        Globals.db.AddOrUpdateMsgList(targetItem.getListName(),targetItem.getOrgCode(),targetItem,MESSAGE_STATUS_READY_TO_POST);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                } else {
                    Globals.db.AddOrUpdateMsgList(stItem.getListName(), Globals.orgCode, stItem, MESSAGE_STATUS_READY_TO_POST);
                }
            }

        } else {
            for(StaticListItem stItem: items) {
                Globals.db.AddOrUpdateMsgList(stItem.getListName(), Globals.orgCode, stItem, MESSAGE_STATUS_READY_TO_POST);
            }
        }
    }


}
