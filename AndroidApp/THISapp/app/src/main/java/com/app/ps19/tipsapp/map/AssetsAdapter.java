package com.app.ps19.tipsapp.map;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.app.ps19.tipsapp.R;
import com.app.ps19.tipsapp.classes.DUnit;
import com.app.ps19.tipsapp.classes.LocItem;
import com.app.ps19.tipsapp.classes.ativ.ATIVDefect;

import java.util.ArrayList;

public class AssetsAdapter extends ArrayAdapter<LocItem> {

   // Your sent context
   private Context context;
   // Your custom values for the spinner (User)
   private ArrayList<LocItem>  values;

   public AssetsAdapter(Context context, int textViewResourceId,
                        ArrayList<LocItem> values) {
      super(context, textViewResourceId, values);
      this.context = context;
      this.values = values;
   }

   @Override
   public int getCount(){
      return values.size();
   }

   @Override
   public LocItem getItem(int position){
      return values.get(position);
   }

   @Override
   public long getItemId(int position){
      return position;
   }


   // And the "magic" goes here
   // This is for the "passive" state of the spinner
   @Override
   public View getView(int position, View convertView, ViewGroup parent) {
      return getCustomView(position, convertView, parent);
   }


   // And here is when the "chooser" is popped up
   // Normally is the same view, but you can customize it if you want
   @Override
   public View getDropDownView(int position, View convertView,
                               ViewGroup parent) {
      return getCustomView(position, convertView, parent);
   }
   public View getCustomView(int position, View convertView, ViewGroup parent) {
      DUnit asset = values.get(position).getmTag();
      ATIVDefect aDefect = null;
      if(asset == null){
         aDefect = values.get(position).getaDefect();
      }

      LayoutInflater inflater=(LayoutInflater) context.getSystemService(  Context.LAYOUT_INFLATER_SERVICE );
      View row=inflater.inflate(R.layout.cluster_row, parent, false);
      LinearLayout llOldMap = row.findViewById(R.id.ll_old_details);
      LinearLayout llNewMap = row.findViewById(R.id.ll_new_details);
      TextView tvAssetName = row.findViewById(R.id.tv_asset_name);
      TextView tvAssetType = row.findViewById(R.id.tv_asset_type);
      TextView tvAssetTestCount = row.findViewById(R.id.tv_asset_test_count);
      TextView tvOpMsg = row.findViewById(R.id.tv_long_click_msg);
      LinearLayout llTests = row.findViewById(R.id.ll_tests);
      TextView tvAssetNameTitle = row.findViewById(R.id.tv_cluster_row_name_title);
      TextView tvAssetTypeTitle = row.findViewById(R.id.tv_cluster_item_row_type_title);

      llNewMap.setVisibility(View.VISIBLE);
      llOldMap.setVisibility(View.GONE);
      tvOpMsg.setVisibility(View.GONE);
      if(asset!=null){
         tvAssetName.setText(asset.getUnit().getDescription());
         tvAssetType.setText(asset.getUnit().getAssetTypeDisplayName());
         if(asset.getUnit().getTestFormList()!=null){
            tvAssetTestCount.setText(String.valueOf(asset.getUnit().getTestFormList().size()));
         }
      }
      if(aDefect!=null){
         tvAssetNameTitle.setText("Title:");
         tvAssetTypeTitle.setText("Milepost:");
         tvAssetName.setText(aDefect.getTitle());
         tvAssetType.setText(aDefect.getMilepost());
         llTests.setVisibility(View.GONE);
      }


      return row;
   }

}