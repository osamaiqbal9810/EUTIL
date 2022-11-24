package com.app.ps19.scimapp;

import android.content.Context;
import com.google.android.material.snackbar.Snackbar;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import androidx.fragment.app.FragmentActivity;

import com.app.ps19.scimapp.classes.LocItem;

import java.util.ArrayList;

import static com.app.ps19.scimapp.Shared.Utilities.getLocationDescription;

public class clusterItemAdapter extends ArrayAdapter<LocItem> implements View.OnClickListener {

    private ArrayList<LocItem> dataSet;
    Context mContext;

    // View lookup cache
    private static class ViewHolder {
        TextView txtName;
        TextView txtType;
        TextView txtAddress;
        //ImageView info;
    }

    public clusterItemAdapter(ArrayList<LocItem> data, Context context) {
        super(context, R.layout.cluster_row, data);
        this.dataSet = data;
        this.mContext = context;

    }

    @Override
    public void onClick(View v) {

        int position = (Integer) v.getTag();
        Object object = getItem(position);
        LocItem dataModel = (LocItem) object;
        Snackbar.make(v, "Release date " + dataModel.getTitle(), Snackbar.LENGTH_LONG)
                .setAction("No action", null).show();

    }

    private int lastPosition = -1;

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        // Get the data item for this position
        final LocItem dataModel = getItem(position);
        // Check if an existing view is being reused, otherwise inflate the view
        final ViewHolder viewHolder; // view lookup cache stored in tag

        final View result;

        if (convertView == null) {

            viewHolder = new ViewHolder();
            LayoutInflater inflater = LayoutInflater.from(getContext());
            convertView = inflater.inflate(R.layout.cluster_row, parent, false);
            viewHolder.txtName = (TextView) convertView.findViewById(R.id.tv_cluster_asset_name);
            viewHolder.txtType = (TextView) convertView.findViewById(R.id.tv_cluster_asset_type);
            viewHolder.txtAddress = (TextView) convertView.findViewById(R.id.tv_cluster_asset_address);
            //viewHolder.info = (ImageView) convertView.findViewById(R.id.item_info);

            result = convertView;
            convertView.setTag(viewHolder);
        } else {
            viewHolder = (ViewHolder) convertView.getTag();
            result = convertView;
        }

        Animation animation = AnimationUtils.loadAnimation(mContext, (position > lastPosition) ? R.anim.up_from_bottom : R.anim.down_from_top);
        result.startAnimation(animation);
        lastPosition = position;
        String[] details = dataModel.getSnippet().split(",");
        String _type = details[0].replace(mContext.getString(R.string.string_type), "");
        String _name = details[1].replace(mContext.getString(R.string.description_title), "");
        final String[] _address = new String[1];
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    _address[0] = getLocationDescription(mContext, dataModel.getPosition().latitude, dataModel.getPosition().longitude);
                } catch (Exception e) {
                    e.printStackTrace();
                }

                //update ui on UI thread
                ((FragmentActivity) mContext).runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        viewHolder.txtAddress.setText(_address[0]);
                    }
                });

            }
        }).start();

        viewHolder.txtName.setText(_name);
        viewHolder.txtType.setText(_type);
        //viewHolder.txtAddress.setText(_address[0]);
        //viewHolder..setOnClickListener(this);
        //viewHolder.info.setTag(position);
        // Return the completed view to render on screen
        return convertView;
    }
}