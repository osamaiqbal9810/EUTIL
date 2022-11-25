package com.app.ps19.tipsapp.ativ;

import static com.app.ps19.tipsapp.Shared.Globals.getSelectedTask;
import static com.app.ps19.tipsapp.Shared.Globals.postSign;
import static com.app.ps19.tipsapp.Shared.Globals.selectedJPlan;
import static com.app.ps19.tipsapp.Shared.Globals.setSelectedAtivDef;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.app.ps19.tipsapp.R;
import com.app.ps19.tipsapp.classes.ativ.ATIVDefect;
import com.app.ps19.tipsapp.classes.ativ.ATIVProperty;

import java.util.ArrayList;

public class aDefectAdapter extends RecyclerView.Adapter<aDefectAdapter.ViewHolder> {

   private ArrayList<ATIVDefect> mData;
   private LayoutInflater mInflater;
   private ItemClickListener mClickListener;
   private Context context;
   private aDefectInterface listener;

   // data is passed into the constructor
   aDefectAdapter(Context context, ArrayList<ATIVDefect> data, aDefectInterface listener) {
      this.mInflater = LayoutInflater.from(context);
      this.mData = data;
      this.context = context;
      this.listener = listener;

   }

   // inflates the row layout from xml when needed
   @Override
   public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType){
      View view = mInflater.inflate(R.layout.ativ_defect_row, parent, false);
      return new ViewHolder(view);
   }
   /**
    * Custom created method for Setting the item click listener for the items and items with in items
    * @param listener aDefectInterface
    */
   public void setOnItemClickListener(aDefectInterface listener)
   {
      this.listener = listener;
   }
   // binds the data to the TextView in each row
   @Override
   public void onBindViewHolder(ViewHolder holder, int position) {
      String title = mData.get(position).getTitle();
      String mp = mData.get(position).getMilepost();
      int pos = position;
      boolean isVerified = mData.get(position).isVerified();

      ATIVDefect aDefect = mData.get(position);
      holder.tvTitle.setText(title);
      holder.tvMp.setText(mp);
      holder.cbVerify.setChecked(isVerified);

      for(ATIVDefect issuedADefect: selectedJPlan.getTaskList().get(0).getAtivIssues()){
         if(issuedADefect.getAtivId().equals(aDefect.getAtivId())){
            holder.cbVerify.setChecked(issuedADefect.isVerified());
         }
      }
      holder.cbVerify.setEnabled(false);
      holder.ivOpenIssue.setOnClickListener(new View.OnClickListener() {
         @Override
         public void onClick(View v) {
            if(holder.cbVerify.isChecked()){
               if(isExistInIssues(aDefect)){
                  for(ATIVDefect issuedADefect: selectedJPlan.getTaskList().get(0).getAtivIssues()){
                     if(issuedADefect.getAtivId().equals(aDefect.getAtivId())){
                        setSelectedAtivDef(issuedADefect);
                        Intent intent = new Intent(context, ATIVDefectDetailsActivity.class);
                        intent.putExtra("USE_FROM_PROPS", false);
                        context.startActivity(intent);
                        return;
                     }
                  }
               } else {
                if(aDefect.getVerifiedProps()!=null){
                   setSelectedAtivDef(aDefect);
                   Intent intent = new Intent(context, ATIVDefectDetailsActivity.class);
                   intent.putExtra("USE_FROM_PROPS", true);
                   context.startActivity(intent);
                }
               }
            } else {
               setSelectedAtivDef(aDefect);
               Intent intent = new Intent(context, ATIVDefectDetailsActivity.class);
               intent.putExtra("USE_FROM_PROPS", false);
               context.startActivity(intent);
            }
         }
      });
      holder.itemView.setOnClickListener(new View.OnClickListener() {
         @Override
         public void onClick(View v) {
            listener.aDefectInterface(pos, -1);
         }
      });
   }

   // total number of rows
   @Override
   public int getItemCount() {
      return mData.size();
   }


   // stores and recycles views as they are scrolled off screen
   public class ViewHolder extends RecyclerView.ViewHolder  {
      TextView tvTitle;
      TextView tvMp;
      ImageView ivOpenIssue;
      CheckBox cbVerify;

      ViewHolder(View itemView) {
         super(itemView);
         tvTitle = itemView.findViewById(R.id.tv_title);
         tvMp = itemView.findViewById(R.id.tv_mp);
         ivOpenIssue = itemView.findViewById(R.id.img_show_report);
         cbVerify = itemView.findViewById(R.id.cb_verify);

      }
   }

   // convenience method for getting data at click position
   ATIVDefect getItem(int id) {
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
   private boolean isExistInIssues(ATIVDefect aDefect){
      for(ATIVDefect issuedADefect: selectedJPlan.getTaskList().get(0).getAtivIssues()){
         if(issuedADefect.getAtivId().equals(aDefect.getAtivId())){
            return true;
         }
      }
      return false;
   }
}