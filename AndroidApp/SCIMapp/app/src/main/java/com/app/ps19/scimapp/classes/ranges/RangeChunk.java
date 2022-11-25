package com.app.ps19.scimapp.classes.ranges;

public class RangeChunk {
    private float start=0.0f;
    private float end =0.0f;
    private String status="";

    public String getStatus() {
        return status;
    }

    public float getEnd() {
        return end;
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

    public RangeChunk(float start, float end){
        this.start=start;
        this.end=end;
    }
    public RangeChunk(float start, float end, String status){
        this.start=start;
        this.end=end;
        this.status=status;
    }

}
