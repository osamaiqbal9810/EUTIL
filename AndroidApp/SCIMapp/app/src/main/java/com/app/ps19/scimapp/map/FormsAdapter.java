package com.app.ps19.scimapp.map;

import android.content.Context;
import android.graphics.Color;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import com.app.ps19.scimapp.R;
import com.app.ps19.scimapp.classes.UnitsTestOpt;

public class FormsAdapter extends ArrayAdapter<UnitsTestOpt> {

   // Your sent context
   private Context context;
   // Your custom values for the spinner (User)
   private UnitsTestOpt[] values;

   public FormsAdapter(Context context, int textViewResourceId,
                       UnitsTestOpt[] values) {
      super(context, textViewResourceId, values);
      this.context = context;
      this.values = values;

   }

   @Override
   public int getCount(){
      return values.length;
   }

   @Override
   public UnitsTestOpt getItem(int position){
      return values[position];
   }

   @Override
   public long getItemId(int position){
      return position;
   }


   // And the "magic" goes here
   // This is for the "passive" state of the spinner
   @Override
   public View getView(int position, View convertView, ViewGroup parent) {
      // I created a dynamic TextView here, but you can reference your own  custom layout for each spinner item
      TextView label = (TextView) super.getView(position, convertView, parent);
      label.setTextColor(Color.BLACK);
      // Then you can get the current item using the values array (Users array) and the current position
      // You can NOW reference each method you has created in your bean object (User class)
      label.setText(values[position].getTitle());

      // And finally return your dynamic (or custom) view for each spinner item
      return label;
   }

   // And here is when the "chooser" is popped up
   // Normally is the same view, but you can customize it if you want
   @Override
   public View getDropDownView(int position, View convertView,
                               ViewGroup parent) {
      TextView label = (TextView) super.getDropDownView(position, convertView, parent);
      label.setTextColor(Color.BLACK);
      label.setText(values[position].getTitle());
      label.setPadding(10,10,10,10);
      label.setBackground(context.getResources().getDrawable(R.drawable.border_bottom));

      return label;
   }
}