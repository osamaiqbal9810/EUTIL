package com.app.ps19.elecapp.Shared;

import android.content.Context;
import android.content.res.ColorStateList;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.LayerDrawable;
import android.graphics.drawable.ShapeDrawable;
import android.graphics.drawable.shapes.OvalShape;
import android.view.ViewGroup;

import androidx.core.content.ContextCompat;

import com.app.ps19.elecapp.R;
import com.app.ps19.elecapp.classes.LocItem;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.model.BitmapDescriptor;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.maps.android.clustering.Cluster;
import com.google.maps.android.clustering.ClusterManager;
import com.google.maps.android.clustering.view.DefaultClusterRenderer;
import com.google.maps.android.ui.IconGenerator;
import com.google.maps.android.ui.SquareTextView;

public class CustomClusterRenderer extends DefaultClusterRenderer<LocItem> {
   private final float mDensity;
   private final Bitmap mIconItemGreen = null;
   private static final int ITEM_PADDING = 7;
   private static Context mContext;

   public CustomClusterRenderer(Context context, GoogleMap map, ClusterManager<LocItem> clusterManager) {
      super(context, map, clusterManager);
      mDensity = context.getResources().getDisplayMetrics().density;
      mContext = context;

      //mIconItemGreen = generateIcon(0).makeIcon();
   }
   private IconGenerator generateIcon(int color){
      IconGenerator iconItemGenerator = new IconGenerator(mContext);
      iconItemGenerator.setContentView(makeSquareTextView(mContext, ITEM_PADDING));
      iconItemGenerator.setBackground(makeClusterBackground(color));
      return iconItemGenerator;
   }

   @Override
   protected int getColor(int clusterSize) {
      return Color.BLUE; // Return any color you want here. You can base it on clusterSize.
   }
   @Override
   protected void onBeforeClusterItemRendered(LocItem item,
                                              MarkerOptions markerOptions) {
      int color = item.getmTag().getUnit().getUnitColor();
      //BitmapDescriptor markerDescriptor = getMarkerIcon(color);

      //markerOptions.icon(markerDescriptor);
      markerOptions.icon(BitmapDescriptorFactory.fromBitmap(generateIcon(color).makeIcon()));
   }
   public BitmapDescriptor getMarkerIcon(int color) {
      int alpha = Color.alpha(color);
      float[] hsv = new float[3];
      Color.colorToHSV(color, hsv);
      int mAlpha = alpha;
      float mHue = hsv[0];
      float mSat = hsv[1];
      float mVal = hsv[2];

      return BitmapDescriptorFactory.defaultMarker(Color.HSVToColor(mAlpha, new float[]{mHue, mSat, mVal}));
   }
   private LayerDrawable makeClusterBackground(int color) {
      ShapeDrawable mColoredCircleBackground = new ShapeDrawable(new OvalShape());
      mColoredCircleBackground.getPaint().setColor(color);
      ShapeDrawable outline = new ShapeDrawable(new OvalShape());
      outline.getPaint().setColor(0x80ffffff);
      LayerDrawable background = new LayerDrawable(new Drawable[]{outline, mColoredCircleBackground});
      int strokeWidth = (int) (mDensity * 3.0F);
      background.setLayerInset(1, strokeWidth, strokeWidth, strokeWidth, strokeWidth);
      return background;
   }

   private SquareTextView makeSquareTextView(Context context, int padding) {
      SquareTextView squareTextView = new SquareTextView(context);
      ViewGroup.LayoutParams layoutParams = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
      squareTextView.setLayoutParams(layoutParams);
      squareTextView.setId(R.id.text);
      int paddingDpi = (int) (padding * mDensity);
      squareTextView.setPadding(paddingDpi, paddingDpi, paddingDpi, paddingDpi);
      return squareTextView;
   }
}
