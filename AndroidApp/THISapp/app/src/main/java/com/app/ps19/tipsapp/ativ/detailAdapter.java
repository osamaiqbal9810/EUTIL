package com.app.ps19.tipsapp.ativ;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.app.ps19.tipsapp.R;
import com.app.ps19.tipsapp.classes.ativ.ATIVDefect;
import com.app.ps19.tipsapp.classes.ativ.ATIVProperty;

import java.util.ArrayList;

public class detailAdapter extends RecyclerView.Adapter<detailAdapter.ViewHolder> {

   private ArrayList<ATIVProperty> mData;
   private LayoutInflater mInflater;
   private ItemClickListener mClickListener;

   // data is passed into the constructor
   detailAdapter(Context context, ArrayList<ATIVProperty> data) {
      this.mInflater = LayoutInflater.from(context);
      this.mData = data;
   }

   // inflates the row layout from xml when needed
   @Override
   public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
      View view = mInflater.inflate(R.layout.dialog_ativ_row, parent, false);
      return new ViewHolder(view);
   }

   // binds the data to the TextView in each row
   @Override
   public void onBindViewHolder(ViewHolder holder, int position) {
      String name = mData.get(position).getName();
      String value = mData.get(position).getValue();
      holder.tvName.setText(capitalizeString(name));
      holder.tvValue.setText(value);
   }

   // total number of rows
   @Override
   public int getItemCount() {
      return mData.size();
   }


   // stores and recycles views as they are scrolled off screen
   public class ViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener {
      TextView tvName;
      TextView tvValue;

      ViewHolder(View itemView) {
         super(itemView);
         tvName = itemView.findViewById(R.id.tv_dialog_key);
         tvValue = itemView.findViewById(R.id.tv_dialog_value);
         itemView.setOnClickListener(this);
      }

      @Override
      public void onClick(View view) {
         if (mClickListener != null) mClickListener.onItemClick(view, getAdapterPosition());
      }
   }

   // convenience method for getting data at click position
   ATIVProperty getItem(int id) {
      return mData.get(id);
   }

   // allows clicks events to be caught
   void setClickListener(ItemClickListener itemClickListener) {
      this.mClickListener = itemClickListener;
   }

   // parent activity will implement this method to respond to click events
   public interface ItemClickListener {
      void onItemClick(View view, int position);
   }
   public static String capitalizeString(String str) {
      String retStr = str;
      try { // We can face index out of bound exception if the string is null
         retStr = str.substring(0, 1).toUpperCase() + str.substring(1);
      }catch (Exception e){}
      return retStr;
   }
}