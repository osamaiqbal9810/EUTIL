package com.app.ps19.tipsapp.unitsGroup;

import static com.app.ps19.tipsapp.Shared.Globals.getFirmwareAddress;
import static com.app.ps19.tipsapp.Shared.Utilities.removeSpacesForUrl;

import android.content.Context;
import android.text.Html;
import android.text.method.LinkMovementMethod;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.recyclerview.widget.RecyclerView;

import com.app.ps19.tipsapp.R;
import com.app.ps19.tipsapp.classes.equipment.EquipmentAttributes;

import java.util.List;

public class EquAttributeRecyclerAdapter extends RecyclerView.Adapter<EquAttributeRecyclerAdapter.ViewHolder> {
    private List<EquipmentAttributes> mData;
    private LayoutInflater mInflater;
    private ItemClickListener mClickListener;

    public EquAttributeRecyclerAdapter(Context context, List<EquipmentAttributes> data) {
        this.mInflater = LayoutInflater.from(context);
        this.mData = data;
    }


    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = mInflater.inflate(R.layout.item_equipment_attributes, parent, false);
        return new ViewHolder(view);
    }


    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        EquipmentAttributes equAttribute = mData.get(position);
        holder.myTextView.setText(equAttribute.getKey());
        if(!equAttribute.getUrlRelative().equals("")){
            String html="<b><a href="+getFirmwareAddress(removeSpacesForUrl(equAttribute.getUrlRelative()))+">"+equAttribute.getValue()+"</a> </b>";
            holder.myTextValue.append(Html.fromHtml(html));
            holder.myTextValue.setMovementMethod(LinkMovementMethod.getInstance());
        } else if(!equAttribute.getUrl().equals("")){
            String html2="<b><a href="+removeSpacesForUrl(equAttribute.getUrl())+">"+equAttribute.getValue()+"</a> </b>";
            holder.myTextValue.append(Html.fromHtml(html2));
            holder.myTextValue.setMovementMethod(LinkMovementMethod.getInstance());
        }else {
            holder.myTextValue.setText(equAttribute.getValue());
        }



    }


    @Override
    public int getItemCount() {
        return mData.size();
    }


    // stores and recycles views as they are scrolled off screen
    public class ViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener {
        TextView myTextView;
        TextView myTextValue;

        ViewHolder(View itemView) {
            super(itemView);
            myTextView = itemView.findViewById(R.id.tvAttributeKey);
            myTextValue = itemView.findViewById(R.id.tvAttributeValue);
            itemView.setOnClickListener(this);
        }

        @Override
        public void onClick(View view) {
            if (mClickListener != null) mClickListener.onItemClick(view, getAdapterPosition());
        }
    }

    // convenience method for getting data at click position
    EquipmentAttributes getItem(int id) {
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
    public void setAttributesData(List<EquipmentAttributes> data){
        this.mData=data;
        notifyDataSetChanged();
    }
}
