package com.app.ps19.scimapp.map;

import static com.app.ps19.scimapp.Shared.Globals.markerItemsMap;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.app.ps19.scimapp.R;
import com.app.ps19.scimapp.classes.DUnit;
import com.app.ps19.scimapp.classes.ativ.ATIVDefect;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.model.Marker;

public class MyInfoWindowAdapter implements GoogleMap.InfoWindowAdapter {

   private final View v;
   private Context context;

   public MyInfoWindowAdapter(Context context) {
      this.context = context;
      v = LayoutInflater.from(context).inflate(R.layout.gmap_marker_item,
              null);

   }

   @Override
   public View getInfoContents(Marker marker) {

      //ImageView icon = (ImageView) v.findViewById(R.id.icon);
      LinearLayout llTests = v.findViewById(R.id.ll_tests);
      TextView tvAssetName = v.findViewById(R.id.tv_asset_name);
      TextView tvAssetType = v.findViewById(R.id.tv_asset_type);
      TextView tvAssetNameTitle = v.findViewById(R.id.tv_cluster_row_name_title);
      TextView tvAssetTypeTitle = v.findViewById(R.id.tv_cluster_item_row_type_title);
      TextView tvAssetTestCount = v.findViewById(R.id.tv_asset_test_count);
      if(markerItemsMap!=null){
         DUnit unit = markerItemsMap.get(marker.getId()).getmTag();
         ATIVDefect aDefect = markerItemsMap.get(marker.getId()).getaDefect();
         if(unit!=null){
            tvAssetName.setText(unit.getUnit().getDescription());
            tvAssetType.setText(unit.getUnit().getAssetTypeDisplayName());
            if(unit.getUnit().getTestFormList()!=null){
               tvAssetTestCount.setText(String.valueOf(unit.getUnit().getTestFormList().size()));
            }
         } else if(aDefect!=null){
            tvAssetNameTitle.setText("Title:");
            tvAssetTypeTitle.setText("Milepost:");
            tvAssetName.setText(aDefect.getTitle());
            tvAssetType.setText(aDefect.getMilepost());
            llTests.setVisibility(View.GONE);

         }

      }


      return v;
   }

   @Override
   public View getInfoWindow(Marker marker) {
      // TODO Auto-generated method stub
      return null;
   }

}