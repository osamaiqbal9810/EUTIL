package com.app.ps19.scimapp;

import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.squareup.picasso.Picasso;

import org.w3c.dom.Text;

import java.io.File;

public class Popup extends Dialog {

    private Context mContext;
    private ImageView imageFirst;
    private String url;
    private String name;
    private int position;
    TextView tvImageName;
    // final Dialog dialog = new Dialog(mContext);

    public Popup(Context context, String url, int position, String name) {
        super(context);
        mContext = context;
        this.url = url;
        this.position = position;
        this.name = name;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.popup_image);

        imageFirst = (ImageView) findViewById(R.id.selectedImg);
        //tvImageName = (TextView) findViewById(R.id.tv_img_name);
        //tvImageName.setText(name);
        //tvImageName.setVisibility(View.GONE);
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


