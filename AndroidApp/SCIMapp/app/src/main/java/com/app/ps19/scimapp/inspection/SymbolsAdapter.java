package com.app.ps19.scimapp.inspection;

import android.content.Context;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.os.Build;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.app.ps19.scimapp.R;
import com.app.ps19.scimapp.Shared.Globals;

import static com.app.ps19.scimapp.Shared.Globals.appName;

public class SymbolsAdapter extends RecyclerView.Adapter<SymbolsAdapter.MyViewHolder> {

    private static final int[] InspectionColors = new int[]{
            R.string.color_coding_due,
            R.string.color_coding_upcoming,
            R.string.color_coding_expiring,
            R.string.color_coding_traversing,
            R.string.color_coding_observing,
            R.string.color_coding_start_mp,
            R.string.color_coding_end_mp,
            R.string.issues,
    };
    private static final int[] InspectionColorsSite = new int[]{
            R.string.color_coding_due,
            R.string.color_coding_upcoming,
            R.string.color_coding_expiring,
            R.string.color_coding_start_mp,
            R.string.issues,
    };

    Context _context;
    LayoutInflater mInflater;
    boolean showText = true;

    class MyViewHolder extends RecyclerView.ViewHolder {
        TextView txtView;
        View vInspectionLegends;


        MyViewHolder(View itemView) {
            super(itemView);
            this.vInspectionLegends = (View) itemView.findViewById(R.id.viewLocColor);
            this.txtView = (TextView) itemView.findViewById(R.id.tvLocTxt);
        }
    }

    public SymbolsAdapter(Context ctx, boolean showText) {
        _context = ctx;
        this.mInflater = LayoutInflater.from(ctx);
        this.showText = showText;
    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = this.mInflater.inflate(R.layout.location_item, parent, false);
        ViewGroup.MarginLayoutParams params = (ViewGroup.MarginLayoutParams) view.getLayoutParams();
        params.leftMargin = 5;
        params.rightMargin = 5;
        params.topMargin = 0;
        params.bottomMargin = 0;
        MyViewHolder holder = new MyViewHolder(view);

        return holder;
    }

    @Override
    public void onBindViewHolder(MyViewHolder holder, int position) {
        TextView tvInspectionDetail = holder.txtView;
        if(appName.equals(Globals.AppName.SCIM)){
            tvInspectionDetail.setText(this._context.getResources().getString(InspectionColorsSite[position]));
        } else if(appName.equals(Globals.AppName.TIMPS)) {
            tvInspectionDetail.setText(this._context.getResources().getString(InspectionColors[position]));
        }

        if(!this.showText){
            tvInspectionDetail.setVisibility(View.GONE);
        }

        tvInspectionDetail.setTextColor(Color.DKGRAY);
        View vInspectionIcon = holder.vInspectionLegends;
        if(appName.equals(Globals.AppName.SCIM)){
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                switch (position) {
                    case 0:
                        vInspectionIcon.setBackgroundTintList(ColorStateList.valueOf(Globals.COLOR_TEST_ACTIVE));
                        break;
                    case 1:
                        vInspectionIcon.setBackgroundTintList(ColorStateList.valueOf(Globals.COLOR_TEST_NOT_ACTIVE));
                        break;
                    case 2:
                        vInspectionIcon.setBackgroundTintList(ColorStateList.valueOf(Globals.COLOR_TEST_EXPIRING));
                        break;
                    case 3:
                        vInspectionIcon.setBackground(ContextCompat.getDrawable(this._context, R.drawable.ic_flag_black_24dp));
                        break;
                    case 4:
                        vInspectionIcon.setBackground(ContextCompat.getDrawable(this._context, R.drawable.ic_notification));
                        break;
                    default:
                        break;
                }
            }
        } else if(appName.equals(Globals.AppName.TIMPS)) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                switch (position) {
                    case 0:
                        vInspectionIcon.setBackgroundTintList(ColorStateList.valueOf(Globals.COLOR_TEST_ACTIVE));
                        break;

                    case 1:
                        vInspectionIcon.setBackgroundTintList(ColorStateList.valueOf(Globals.COLOR_TEST_NOT_ACTIVE));
                        break;

                    case 2:
                        vInspectionIcon.setBackgroundTintList(ColorStateList.valueOf(Globals.COLOR_TEST_EXPIRING));
                        break;

                    case 3:
                        vInspectionIcon.setBackground(ContextCompat.getDrawable(this._context, R.drawable.img_traversing));
                        break;
                    case 4:
                        vInspectionIcon.setBackground(ContextCompat.getDrawable(this._context, R.drawable.img_observing));
                        break;
                    case 5:
                        vInspectionIcon.setBackground(ContextCompat.getDrawable(this._context, R.drawable.ic_flag_black_24dp));
                        break;
                    case 6:
                        vInspectionIcon.setBackground(ContextCompat.getDrawable(this._context, R.drawable.ic_flag_grey_24dp));
                        break;
                    case 7:
                        //vInspectionIcon.setBackground(ContextCompat.getDrawable(this._context, R.drawable.issues));
                        vInspectionIcon.setBackground(ContextCompat.getDrawable(this._context, R.drawable.ic_notification));

                        break;

                    default:
                        break;
                }
            }
        }

    }

    @Override
    public int getItemCount() {
        if(appName.equals(Globals.AppName.SCIM)){
            return InspectionColorsSite.length;
        } else if(appName.equals(Globals.AppName.TIMPS)) {
            return InspectionColors.length;
        }
        return InspectionColors.length;
    }
}



