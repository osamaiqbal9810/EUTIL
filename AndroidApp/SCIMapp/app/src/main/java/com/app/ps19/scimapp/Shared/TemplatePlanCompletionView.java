package com.app.ps19.scimapp.Shared;

import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.RectF;
import android.util.AttributeSet;
import android.view.View;
import androidx.annotation.Nullable;

import com.app.ps19.scimapp.R;
import com.app.ps19.scimapp.classes.Session;
import com.app.ps19.scimapp.classes.ranges.RangeChunk;
import com.app.ps19.scimapp.classes.ranges.RangeCompletion;

import java.time.Clock;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

public class TemplatePlanCompletionView extends View {
    Paint linePaint = new Paint();
    Paint linePaintGreen = new Paint();
    Paint linePaintYellow = new Paint();
    Paint linePaintGray = new Paint();
    Paint strokePaint=new Paint();
    Paint mpTextPaint=new Paint();
    Paint titleTextPaint =new Paint();
    Paint linePaintGreenOthers=new Paint();
    Paint arrowPaint =new Paint(Paint.ANTI_ALIAS_FLAG);
    private boolean showSampleData=true;
    private boolean showArrow=false;
    private boolean showTitle=true;

    public boolean isShowSampleData() {
        return showSampleData;
    }

    public void setShowSampleData(boolean showSampleData) {
        this.showSampleData = showSampleData;
    }

    public void setShowTitle(boolean showTitle) {
        this.showTitle = showTitle;
    }

    public boolean isShowTitle() {
        return showTitle;
    }

    public void setShowArrow(boolean showArrow) {
        this.showArrow = showArrow;
    }

    public boolean isShowArrow() {
        return showArrow;
    }

    float mpStart=0.0f;
    float mpEnd = 200.0f;
    String title="Template Completion";
    String defaultTitle="Template Completion";

    public float getMpStart() {
        return mpStart;
    }

    public void setMpStart(float mpStart) {
        this.mpStart = mpStart;
    }

    public float getMpEnd() {
        return mpEnd;
    }

    public void setMpEnd(float mpEnd) {
        this.mpEnd = mpEnd;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTitle() {
        return title;
    }

    ArrayList<Session> completion=new ArrayList<>();
    ArrayList<Session> completionOthers=new ArrayList<>();

    public void setCompletionOthers(ArrayList<Session> completionOthers) {
        this.completionOthers = completionOthers;
    }

    public ArrayList<Session> getCompletionOthers() {
        return completionOthers;
    }

    public void setCompletion(ArrayList<Session> completion) {
        this.completion = completion;
    }

    public ArrayList<Session> getCompletion() {
        return completion;
    }

    private void addSampleData(){
        this.mpStart=0.0f;
        this.mpEnd=200.0f;
        ArrayList<Session> _completion=new ArrayList<>();
        _completion.add(new Session("1", "10","closed"));
        _completion.add(new Session("20", "25","closed"));
        _completion.add(new Session("65", "80","open"));
        this.completion=_completion;

        ArrayList<Session> _completionOthers=new ArrayList<>();
        _completionOthers.add(new Session("11", "19","closed"));
        _completionOthers.add(new Session("26", "35","closed"));
        _completionOthers.add(new Session("81", "90","open"));
        this.completionOthers=_completionOthers;

    }
    private void initializeData(@Nullable AttributeSet attrs){
        if(attrs !=null){
            TypedArray a =getContext().obtainStyledAttributes(attrs, R.styleable.TemplatePlanCompletionView );
            String titleText=a.getString(R.styleable.TemplatePlanCompletionView_title);
            if(titleText!=""){
                this.title=titleText;
            }
            Boolean showSample=a.getBoolean(R.styleable.TemplatePlanCompletionView_showSampleData,false);
            setShowSampleData(showSample);

            Boolean showTitle=a.getBoolean(R.styleable.TemplatePlanCompletionView_showTitle,true);
            setShowTitle(showTitle);
        }
        linePaint.setColor(Color.GRAY);
        linePaint.setStrokeWidth(10);
        linePaintGreen.setColor(Color.GREEN);
        linePaintGreen.setStrokeWidth(50);
        linePaintYellow.setColor(Color.YELLOW);
        linePaintYellow.setStrokeWidth(50);
        linePaintGray.setColor(Color.argb(255,220,220,220));
        linePaintGray.setStrokeWidth(50);

        linePaintGreenOthers.setColor(Color.argb(60,0,255,0));
        linePaintGreenOthers.setStrokeWidth(50);


        strokePaint.setColor(Color.DKGRAY);
        strokePaint.setStrokeWidth(2);
        titleTextPaint.setColor(Color.argb(255, 175,0,0));
        titleTextPaint.setTextSize(18 * getResources().getDisplayMetrics().density);
        //mpTextPaint.setColor(Color.BLACK);
        // mpTextPaint.setTextSize(12);
        //mpTextPaint.setStrokeWidth(5);
        mpTextPaint.setAntiAlias(true);
        mpTextPaint.setTextSize(12 * getResources().getDisplayMetrics().density);
        mpTextPaint.setColor(0xFF000000);

        arrowPaint.setStyle(Paint.Style.STROKE);
        arrowPaint.setColor(Color.GRAY);
        arrowPaint.setAlpha(80);
        arrowPaint.setStrokeWidth(8);
        if (showSampleData)
            addSampleData();
        /*
        if(isShowSampleData()) {
            addSampleData();
        }*/
    }
    public TemplatePlanCompletionView(Context context) {
        super(context);
        initializeData(null);
    }

    public TemplatePlanCompletionView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        initializeData(attrs);
    }
    @Override
    public void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        int offsetStart=50, offsetEnd=50, offSetStatusLine=40;
        int viewWidth=this.getMeasuredWidth(), viewHeight=getMeasuredHeight();
        int w=viewWidth-offsetEnd, h=viewHeight;
        int lineX=offsetStart, lineX1=w, lineY=h/2, lineY1=h/2;
        float fLineX=offsetStart, fLineX1=w, fLineY= h/2, fLineY1=h/2;
        if(title==null ){
            title=defaultTitle;
        }
        int stokeHeight=20;
        float mpLen=mpEnd-mpStart;
        int lineLen=lineX1-lineX;
        int lineStep=lineLen/(Math.round(mpLen)<=0?1:Math.round(mpLen));
        int titleTextWidth=(int) titleTextPaint.measureText(title);
        linePaintGray.setStrokeWidth(60);
        if(isShowTitle()) {
            canvas.drawText(title, w / 2 - titleTextWidth / 2, lineY - 100, titleTextPaint);
        }else{
            lineY -=50;
            lineY1=lineY;
        }
        canvas.drawLine(lineX, lineY, lineX1, lineY1, linePaint);
        canvas.drawLine(lineX, lineY + offSetStatusLine, lineX1, lineY1 + offSetStatusLine, linePaintGray);
        int cnt=Math.round(mpStart);
        int cntPlus=1;
        int mpTextWidth=Math.round(mpTextPaint.measureText(String.valueOf(mpEnd)));
        int lineLoopStep=lineStep;
        float fLineLen=fLineX1-fLineX;
        float fLineLoopStep= (fLineX1-fLineX)/10;//fLineLen/(Math.round(mpLen)<=0?1:Math.round(mpLen))/10;

        int startTick=lineX/lineStep;
        int safeRange=0;
        float fSafeRange=0.0f;
        float prevTickValue=0.0f;
        String text0="",text1="",text2="";
        String prevText="";
        for(float i=fLineX;i<=fLineX1;i+=fLineLoopStep){
            //int tickValue=(i/lineStep)+cnt-startTick;
            //float tickValue=(((float)i)/(((float)lineLen)/mpLen))+cnt-startTick;
            float tickValue=((i-offsetStart)/(fLineLen/mpLen))+mpStart-startTick;

            String text=String.valueOf(Math.round(tickValue));
            if(tickValue != (int) tickValue   ){
                text0=String.format("%.0f",tickValue);
                text2=String.format("%.2f",tickValue);
                text1=String.format("%.1f",tickValue);
                if((int)tickValue == tickValue){
                    text=String.valueOf((int) tickValue);
                }else if(Float.valueOf(text2).equals(Float.valueOf(text1))){
                    text=text1;
                }else{
                    text=text2;
                }
            }
            int textWidth = (int) mpTextPaint.measureText(text);

            if(i==fLineX){
                text=String.valueOf(mpStart);
                textWidth =  (int) mpTextPaint.measureText(text);
            }else if(i==fLineX1 ||(i==fLineX1-fLineLoopStep && i+fLineLoopStep> fLineX1)){
                if(Math.round(tickValue)!=tickValue){
                    text=String.valueOf(mpEnd);
                    textWidth =  (int) mpTextPaint.measureText(text);
                }
            }
            if(i>fSafeRange){
                canvas.drawLine(i,lineY,i,lineY-stokeHeight,strokePaint);
                if(!prevText.equals(text) || i==fLineX1) {
                    canvas.drawText(text, i - textWidth / 2, lineY - (stokeHeight + stokeHeight / 2), mpTextPaint);
                }
                fSafeRange=i+mpTextWidth;
            }
            prevTickValue=tickValue;
            //prevText=text;
            //cnt+=lineLoopStep;
        }
        float lineStep1=lineLen /mpLen;
        float startAdj=0;//mpStart * lineStep1;
        float totalCompleted=0, totalInProgress=0,totalOthers=0;
        /*
         * Completion others
         * */
        /*
        for(int i=0;i<completionOthers.size();i++){
            Session compRange=completionOthers.get(i);
            float start=compRange.getStartF() *lineStep1-startAdj +offsetStart;
            float end=compRange.getEndF()*lineStep1-startAdj+offsetStart;
            float y=lineY + offSetStatusLine;
            Paint linePaint= linePaintGreenOthers;//compRange.getStatus().equals("closed")?linePaintGreen:linePaintYellow;
            float yOffset=50-linePaint.getStrokeWidth();
            if( compRange.getStatus().equals("closed") || compRange.getStatus().equals("open") ){
                //totalCompleted+=(Math.abs(compRange.getEndF()-compRange.getStartF()));
                totalOthers+=(Math.abs(compRange.getEndF()-compRange.getStartF()));
                totalOthers=totalOthers>mpLen?mpLen:totalOthers;
            }
            //else if(compRange.getStatus().equals("open")){
            //    totalInProgress+=(Math.abs(compRange.getEndF()-compRange.getStartF()));
            //}
            canvas.drawLine(start,y, end, y, linePaint);
            if((start > end) && isShowArrow()){
                //drawArrow(canvas, start,y,end,y,20,arrowPaint);
            }
        }
        */
        linePaintGreen.setStrokeWidth(50);
        //linePaintYellow.setStrokeWidth(50);
        linePaintYellow.setStrokeWidth(25);
        ArrayList<RangeChunk> ranges=new ArrayList<>();
        ArrayList<RangeChunk> rangesInProgress=new ArrayList<>();
        for(int i=0;i<completion.size();i++){
            Session compRange=completion.get(i);
            float start=compRange.getStartF() *lineStep1-startAdj +offsetStart;
            float end=compRange.getEndF()*lineStep1-startAdj+offsetStart;
            float y=lineY + offSetStatusLine;
            float x1=(compRange.getStartF()-mpStart)*lineStep1+offsetStart;
            float x2=(compRange.getEndF()-mpStart) *lineStep1+offsetStart;

            Paint linePaint= compRange.getStatus().equals("closed")?linePaintGreen:linePaintYellow;
            float yOffset=50-linePaint.getStrokeWidth();
            if( compRange.getStatus().equals("closed")){
                totalCompleted+=(Math.abs(compRange.getEndF()-compRange.getStartF()));
                totalCompleted=(totalCompleted>mpLen)? mpLen:totalCompleted;
                ranges.add(new RangeChunk(compRange.getStartF(), compRange.getEndF(),compRange.getStatus()));
            }else if(compRange.getStatus().equals("open")){
                totalInProgress+=(Math.abs(compRange.getEndF()-compRange.getStartF()));
                totalInProgress=(totalInProgress>mpLen)?mpLen:totalInProgress;
                rangesInProgress.add(new RangeChunk(compRange.getStartF(),compRange.getEndF()));
                //ranges.add(new RangeChunk(compRange.getStartF(), compRange.getEndF(),compRange.getStatus()));
            }
            //canvas.drawLine(start,y, end, y, linePaint);
            float lineAdjustY=(linePaint.equals(linePaintYellow))?(linePaintYellow.getStrokeWidth()/2):0;
            canvas.drawLine(x1,y+lineAdjustY, x2, y+lineAdjustY, linePaint);
            if((start > end) && isShowArrow()){
                drawArrow(canvas, start,y+lineAdjustY,end,y+lineAdjustY,20,arrowPaint);
            }
        }
        float legendX=lineX, legendY=lineY+offSetStatusLine+90;
        RangeCompletion rangeCompletion=new RangeCompletion(mpStart, mpEnd);
        float percentComplete=(totalCompleted/Math.abs(mpEnd-mpStart) )*100;
        float percentInProgress=(totalInProgress/Math.abs(mpEnd-mpStart) )*100;
        float percentInProgress1=(totalInProgress/Math.abs(mpEnd-mpStart) )*100;

        float percentCompleteOther=(totalOthers/Math.abs(mpEnd-mpStart) )*100;
        float rectSize=25;
        ArrayList<RangeChunk> allRanges=new ArrayList<>();
        rangeCompletion.setChunkList(ranges);
        rangeCompletion.calculate();
        percentComplete=rangeCompletion.getCompletePercent();
        rangeCompletion.setChunkList(rangesInProgress);
        rangeCompletion.calculate();
        percentInProgress1=rangeCompletion.getCompletePercent();

        allRanges.addAll(ranges);
        allRanges.addAll(rangesInProgress);
        rangeCompletion.setChunkList(allRanges);
        rangeCompletion.calculate();
        float totalCompletePercent=rangeCompletion.getCompletePercent();

        String text=String.format("Completed:%d%%",Math.round(percentComplete));
        float textWidth=mpTextPaint.measureText(text);
        float spaceBetween=rectSize;
        linePaintGreen.setStrokeWidth(8);
        linePaintYellow.setStrokeWidth(8);
        linePaintGray.setStrokeWidth(8);
        //linePaintGreen.setStyle(Paint.Style.STROKE);
        canvas.drawRect(new RectF(legendX ,legendY-rectSize,legendX + rectSize,legendY),linePaintGreen);
        canvas.drawText(text,legendX+(rectSize+rectSize/2), legendY,mpTextPaint);
        float nextTextX=legendX+(rectSize*1)+spaceBetween+textWidth;
        //text=String.format("In Progress:%d%%",Math.round(percentInProgress));
        text=String.format("In Progress:%d%%",Math.round(percentInProgress1));
        textWidth=mpTextPaint.measureText(text);
        canvas.drawRect(new RectF(nextTextX ,legendY-rectSize,nextTextX + rectSize,legendY),linePaintYellow);
        canvas.drawText(text,nextTextX+(rectSize+rectSize/2), legendY,mpTextPaint);
        nextTextX=nextTextX+(rectSize*1)+spaceBetween+textWidth;

        /*
        text=String.format("Others:%d%%",Math.round(percentCompleteOther));
        textWidth=mpTextPaint.measureText(text);
        canvas.drawRect(new RectF(nextTextX ,legendY-rectSize,nextTextX + rectSize,legendY),linePaintGreenOthers);
        canvas.drawText(text,nextTextX+(rectSize+rectSize/2), legendY,mpTextPaint);
        nextTextX=nextTextX+(rectSize*1)+spaceBetween+textWidth;
        */
        //float remainingPercent=Math.round(100-percentInProgress1 - percentComplete- percentCompleteOther);
        //float remainingPercent=Math.round(100-percentInProgress1 - percentComplete);
        //float remainingPercent=Math.round(100- percentComplete);
        float remainingPercent=Math.round(100- totalCompletePercent);
        remainingPercent=remainingPercent<0?0:remainingPercent>100?100:remainingPercent;
        text=String.format("Remaining:%d%%",Math.round(remainingPercent));
        textWidth=mpTextPaint.measureText(text);
        canvas.drawRect(new RectF(nextTextX ,legendY-rectSize,nextTextX + rectSize,legendY),linePaintGray);
        canvas.drawText(text,nextTextX+(rectSize+rectSize/2), legendY,mpTextPaint);


    }
    private void drawArrow(Canvas canvas, float startX, float startY, float endX , float endY,float headWidth,Paint _arrowPaint){
        Path arrowPath=new Path();
        if(startX < endX){
            headWidth=-headWidth;
        }
        arrowPath.moveTo(startX, startY);
        arrowPath.lineTo(endX, endY);
        arrowPath.lineTo((endX+headWidth), (endY-headWidth));
        arrowPath.moveTo(endX, endY);
        arrowPath.lineTo((endX+headWidth), (endY+headWidth));
        canvas.drawPath(arrowPath, _arrowPaint);
        arrowPath.reset();
    }
}

