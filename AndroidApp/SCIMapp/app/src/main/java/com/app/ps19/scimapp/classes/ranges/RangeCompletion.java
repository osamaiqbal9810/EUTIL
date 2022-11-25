package com.app.ps19.scimapp.classes.ranges;

import com.app.ps19.scimapp.LoginActivity;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

public class RangeCompletion {
    private float start=0.0f;
    private float end =0.0f;
    private float mpLen=0.0f;
    private float mpLenCompleted=0.0f;
    private float completePercent=0.0f;
    private boolean completed=false;
    private ArrayList<RangeChunk> chunkList=new ArrayList<>();

    public ArrayList<RangeChunk> getChunkList() {
        return chunkList;
    }

    public void setChunkList(ArrayList<RangeChunk> chunkList) {
        chunkList=normalizeChunkList(chunkList);
        this.chunkList = chunkList;
    }

    private ArrayList<RangeChunk> normalizeChunkList(ArrayList<RangeChunk> chunkList) {
        ArrayList<RangeChunk> _chunkList=new ArrayList<>();
        RangeChunk mainRange=new RangeChunk(this.start, this.end);
        for(int i=0; i< chunkList.size();i++){
            RangeChunk r=chunkList.get(i);
            if(canMergeRange(mainRange, r)) {
                if (r.getStart() > r.getEnd()) {
                    //swap values
                    float val = r.getStart();
                    r.setStart(r.getEnd());
                    r.setEnd(val);
                }
                if (r.getStart() < this.start) {
                    r.setStart(this.start);
                }
                if (r.getEnd() > this.end) {
                    r.setEnd(this.end);
                }
                _chunkList.add(r);
            }
        }
        return _chunkList;
    }

    public boolean isCompleted() {
        return completed;
    }

    public float getCompletePercent() {
        return completePercent;
    }

    public float getMpLenCompleted() {
        return mpLenCompleted;
    }

    public float getMpLen() {
        return mpLen;
    }

    public float getStart() {
        return start;
    }

    public void setStart(float start) {
        this.start = start;
    }

    public void setEnd(float end) {
        this.end = end;
    }

    public float getEnd() {
        return end;
    }

    public RangeCompletion(float start, float end ){
        this.start=start;
        this.end=end;
        mpLen=end-start;
    }

    public boolean calculate(){
        mpLen=end-start;
        Collections.sort(chunkList, new Comparator<RangeChunk>() {
            public int compare(RangeChunk o1, RangeChunk o2) {
                int comp=Float.compare(o1.getStart(), o2.getStart());
                if(comp==0){
                    float len1=o1.getEnd()-o1.getStart(),len2=o2.getEnd()-o2.getStart();
                    return Float.compare(len2,len1);
                }
                return comp;
            }
        });
        ArrayList<RangeChunk> mRangeChunks=new ArrayList<>();
        ArrayList<RangeChunk> _mRangeChunks=new ArrayList<>();
        _mRangeChunks.addAll(chunkList);
        boolean blnReplaced=false;
        for(int j=0; j<_mRangeChunks.size();j++){
            RangeChunk sRangeChunk = _mRangeChunks.get(j); //1st one
            if(j==0){
                mRangeChunks.add(sRangeChunk);
            }else{
                blnReplaced=false;
                for (int i=0;i<mRangeChunks.size();i++) {
                    RangeChunk r=mRangeChunks.get(i);
                    if(canMergeRange(r,sRangeChunk)){
                        sRangeChunk=mergeRanges(sRangeChunk,r);
                        mRangeChunks.set(i,sRangeChunk);
                        blnReplaced=true;
                    }
                }
                if(!blnReplaced){
                    mRangeChunks.add(sRangeChunk);
                }
            }
        }


        float mpLenComp=0.0f;
        for(RangeChunk chunk:mRangeChunks){
            mpLenComp+=(chunk.getEnd()-chunk.getStart());
        }
        mpLenCompleted=mpLenComp;
        completePercent=(mpLenComp/mpLen)*100;
        this.completed=(mpLen==mpLenComp);
        return completed;
    }
    public static boolean canMergeRange(RangeChunk chunk1, RangeChunk chunk2){
        //check if 2 ranges overlap each other
        boolean canMerge=false;
        canMerge=chunk1.getStart()>=chunk2.getStart() && chunk1.getStart()<=chunk2.getEnd()
                ||chunk1.getEnd()>=chunk2.getStart() && chunk1.getEnd()<=chunk2.getEnd()
                ||chunk2.getStart()>=chunk1.getStart() && chunk2.getStart()<=chunk1.getEnd()
                ||chunk2.getEnd()>=chunk1.getStart() && chunk2.getEnd()<=chunk1.getEnd();
        return canMerge;
    }
    public static RangeChunk mergeRanges(RangeChunk chunk1, RangeChunk chunk2){
        //This function will return merged result in new object
        RangeChunk mRangeChunk=new RangeChunk(0,0);
        float start=chunk1.getStart()<chunk2.getStart()?chunk1.getStart():chunk2.getStart();
        float end =chunk1.getEnd()>chunk2.getEnd()?chunk1.getEnd():chunk2.getEnd();
        mRangeChunk.setStart(start);
        mRangeChunk.setEnd(end);
        return  mRangeChunk;
    }

}
