package com.app.ps19.hosapp;

import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.ImageView;

import com.app.ps19.hosapp.Shared.Globals;
import com.bumptech.glide.Glide;
import com.squareup.picasso.Picasso;

import java.io.File;

public class Popup extends Dialog {

    private Context mContext;
    private ImageView imageFirst;
    private String url;
    private int position;
    // final Dialog dialog = new Dialog(mContext);

    public Popup(Context context, String url, int position) {
        super(context);
        mContext = context;
        this.url = url;
        this.position = position;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.popup_image);

        imageFirst = (ImageView) findViewById(R.id.selectedImg);
        /*Glide.with(mContext)
                .load(url)
                .error(R.drawable.no_image)
                .into(imageFirst);*/
        Picasso.get().load(new File(url)).placeholder(R.drawable.no_image).error(R.drawable.no_image).resize(640, 480).noFade().into(imageFirst);


        Button dialogButton = (Button) findViewById(R.id.btnImgCancel);
        dialogButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dismiss();
            }
        });
    }
}


