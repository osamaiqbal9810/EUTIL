package com.app.ps19.elecapp;


import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Point;
import android.os.Build;
import android.os.Bundle;
import android.view.View;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;

import com.app.ps19.elecapp.camera.CanvasDrawer;
import com.app.ps19.elecapp.camera.Photographer;
import com.app.ps19.elecapp.camera.PhotographerFactory;
import com.app.ps19.elecapp.camera.PhotographerHelper;
import com.app.ps19.elecapp.camera.SimpleOnEventListener;
import com.app.ps19.elecapp.camera.Values;
import com.app.ps19.elecapp.databinding.ActivityCamera2Binding;

import java.util.Locale;

//import com.bumptech.glide.Glide;
//import com.bumptech.glide.load.engine.DiskCacheStrategy;
//import com.bumptech.glide.signature.StringSignature;

public class Camera2Activity extends AppCompatActivity {

    Photographer photographer;
    PhotographerHelper photographerHelper;
    static boolean backCam = true;

    private int currentFlash = Values.FLASH_OFF;
    private static final int[] FLASH_OPTIONS = {
            Values.FLASH_OFF,
            Values.FLASH_TORCH,

    };

    private static final int[] FLASH_ICONS = {
            R.drawable.ic_flash_off,
            R.drawable.light_on,
    };

    private static final int[] FLASH_TITLES = { R.string.flash_off,  R.string.tourch,};

//    void chooseRatio() {
//        List<AspectRatioItem> supportedAspectRatios = Commons.wrapItems(photographer.getSupportedAspectRatios(), AspectRatioItem::new);
//        SimplePickerDialog<AspectRatioItem> dialog = SimplePickerDialog.create(new PickerDialog.ActionListener<AspectRatioItem>() {
//            @Override
//            public void onCancelClick(PickerDialog<AspectRatioItem> dialog) { }
//
//            @Override
//            public void onDoneClick(PickerDialog<AspectRatioItem> dialog) {
//                AspectRatioItem item = dialog.getSelectedItem(AspectRatioItem.class);
//                photographer.setAspectRatio(item.get());
//            }
//        });
//        dialog.setItems(supportedAspectRatios);
//        dialog.setInitialItem(Commons.findEqual(supportedAspectRatios, photographer.getAspectRatio()));
//        dialog.show(getSupportFragmentManager(),"aspectRatio");
//        //dialog.show(getFragmentManager(), "aspectRatio");
//    }
//
//    void chooseSize() {
//        Size selectedSize = null;
//        List<SizeItem> supportedSizes = null;
//        int mode = photographer.getMode();
//        if (mode == Values.MODE_IMAGE) {
//            Set<Size> imageSizes = photographer.getSupportedImageSizes();
//            selectedSize = photographer.getImageSize();
//            if (imageSizes != null && imageSizes.size() > 0) {
//                supportedSizes = Commons.wrapItems(imageSizes, SizeItem::new);
//            }
//        }
//
//        if (supportedSizes != null) {
//            SimplePickerDialog<SizeItem> dialog = SimplePickerDialog.create(new PickerDialog.ActionListener<SizeItem>() {
//                @Override
//                public void onCancelClick(PickerDialog<SizeItem> dialog) { }
//
//                @Override
//                public void onDoneClick(PickerDialog<SizeItem> dialog) {
//                    SizeItem sizeItem = dialog.getSelectedItem(SizeItem.class);
//                    photographer.setImageSize(sizeItem.get());
//                }
//            });
//            dialog.setItems(supportedSizes);
//            dialog.setInitialItem(Commons.findEqual(supportedSizes, selectedSize));
//            dialog.show(getSupportFragmentManager(), "cameraOutputSize");
//        }
//    }
//
//
//    void onEnableZoomChecked(boolean checked) {
//        binding.preview.setPinchToZoom(checked);
//    }

    public void onFillSpaceChecked(boolean isChecked) {
        binding.preview.setFillSpace(isChecked);

    }

    void flash() {
        currentFlash = (currentFlash + 1) % FLASH_OPTIONS.length;
        binding.flash.setText(FLASH_TITLES[currentFlash]);
        binding.flash.setCompoundDrawablesWithIntrinsicBounds(FLASH_ICONS[currentFlash], 0, 0, 0);
        photographer.setFlash(FLASH_OPTIONS[currentFlash]);

        toggleFlashTorch();
    }

    void action() {
        int mode = photographer.getMode();
        if (mode == Values.MODE_IMAGE) {
            photographer.takePicture();
        }
    }

    void toggleFlashTorch() {
        int flash = photographer.getFlash();
        if (flash == Values.FLASH_TORCH) {
            binding.flashTorch.setImageResource(R.drawable.light_on);
        } else {
            binding.flashTorch.setImageResource(R.drawable.light_off);
        }
    }

    void flip() {
        photographerHelper.flip();
    }

    private ActivityCamera2Binding binding;

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    private void intiBindings(){

        binding.flip.setOnClickListener(v -> {
            backCam = !backCam;
            if (!backCam){
                binding.flashTorch.setVisibility(View.INVISIBLE);
                binding.flash.setVisibility(View.INVISIBLE);
            }else{
                binding.flashTorch.setVisibility(View.VISIBLE);
                binding.flash.setVisibility(View.VISIBLE);
            }
            flip();
        });
//        binding.flashTorch.setOnClickListener(v -> {
//            flash();
//        });
        binding.action.setOnClickListener(v -> {
            action();
        });
        binding.flash.setOnClickListener(v -> {
            flash();
        });
//        binding.fillSpace.setOnCheckedChangeListener((buttonView, isChecked) -> {
//            onFillSpaceChecked(isChecked);
//        });
//        binding.chooseSize.setOnClickListener(v -> {
//            chooseSize();
//        });
//        binding.chooseRatio.setOnClickListener(v -> {
//            chooseRatio();
//        });
//        binding.enableZoom.setOnCheckedChangeListener((buttonView, isChecked) -> {
//            onEnableZoomChecked(isChecked);
//        });



        binding.preview.setFocusIndicatorDrawer(new CanvasDrawer() {
            private static final int SIZE = 300;
            private static final int LINE_LENGTH = 50;

            @Override
            public Paint[] initPaints() {
                Paint focusPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
                focusPaint.setStyle(Paint.Style.STROKE);
                focusPaint.setStrokeWidth(2);
                focusPaint.setColor(Color.WHITE);
                return new Paint[]{ focusPaint };
            }

            @Override
            public void draw(Canvas canvas, Point point, Paint[] paints) {
                if (paints == null || paints.length == 0) return;

                int left = point.x - (SIZE / 2);
                int top = point.y - (SIZE / 2);
                int right = point.x + (SIZE / 2);
                int bottom = point.y + (SIZE / 2);

                Paint paint = paints[0];

                canvas.drawLine(left, top + LINE_LENGTH, left, top, paint);
                canvas.drawLine(left, top, left + LINE_LENGTH, top, paint);

                canvas.drawLine(right - LINE_LENGTH, top, right, top, paint);
                canvas.drawLine(right, top, right, top + LINE_LENGTH, paint);

                canvas.drawLine(right, bottom - LINE_LENGTH, right, bottom, paint);
                canvas.drawLine(right, bottom, right - LINE_LENGTH, bottom, paint);

                canvas.drawLine(left + LINE_LENGTH, bottom, left, bottom, paint);
                canvas.drawLine(left, bottom, left, bottom - LINE_LENGTH, paint);
            }
        });
        //binding.preview.setFillSpace(true);

        photographer = PhotographerFactory.createPhotographerWithCamera2(this, binding.preview);

    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        binding = ActivityCamera2Binding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        backCam = true;
        intiBindings();

        photographerHelper = new PhotographerHelper(photographer);
        photographer.setOnEventListener(new SimpleOnEventListener() {
            @Override
            public void onDeviceConfigured() {
                binding.action.setImageResource(R.drawable.ic_camera);
            }

            @Override
            public void onZoomChanged(float zoom) {
                binding.zoomValue.setText(String.format(Locale.getDefault(), "%.1fX", zoom));
            }

            @Override
            public void onShotFinished(String filePath) {
                announcingNewFile(filePath);
            }

        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        enterFullscreen();
        photographer.startPreview();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        binding = null;
    }

    @Override
    protected void onPause() {
        photographer.stopPreview();
        super.onPause();
    }

    private void enterFullscreen() {
        View decorView = getWindow().getDecorView();
        decorView.setBackgroundColor(Color.BLACK);
        int uiOptions = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
        decorView.setSystemUiVisibility(uiOptions);
    }


    private void announcingNewFile(String filePath) {
        Intent intent = new Intent(Camera2Activity.this, PictureActivity.class);
        startActivityForResult(intent, 1);
    }

    @SuppressLint("MissingSuperCall")
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        Intent returnIntent = new Intent();
        if(resultCode == RESULT_OK){
            String result = data.getStringExtra("result");
            if(result.equals("Taken")){
                returnIntent.putExtra("result",result);
                setResult(RESULT_OK, returnIntent);
                finish();
            }
        }

    }







}

