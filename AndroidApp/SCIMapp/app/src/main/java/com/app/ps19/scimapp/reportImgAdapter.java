package com.app.ps19.scimapp;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.net.Uri;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Toast;

import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.Shared.Utilities;
import com.app.ps19.scimapp.classes.IssueImage;
import com.squareup.picasso.Picasso;

import java.io.File;
import java.util.ArrayList;

import static com.app.ps19.scimapp.Shared.Globals.isIssueUpdateAllowed;
import static com.app.ps19.scimapp.Shared.Globals.tempIssueImgList;
import static com.app.ps19.scimapp.Shared.Utilities.getImgPath;

public class reportImgAdapter extends RecyclerView.Adapter<reportImgAdapter.MyViewHolder> {


    Popup popup;
    private final ArrayList<IssueImage> imgid;
    public static final String IMAGE_DELETE_VERIFICATION_MSG = "Do you really want to delete image?";
    //List<Uri> horizontalList = Collections.emptyList();
    Context context;
    int selectedPosition;
    String tag;
    String maintenanceTag = "Maintenance";


    public reportImgAdapter(Context context, ArrayList<IssueImage> horizontalList, String tag) {
        this.imgid = horizontalList;
        this.context = context;
        this.tag = tag;
    }


    public class MyViewHolder extends RecyclerView.ViewHolder {

        ImageView imageView;
        Button imgRemoveBtn;
        //  TextView txtview;
        public MyViewHolder(View view) {
            super(view);
            imageView=(ImageView) view.findViewById(R.id.imageSlide);
            imgRemoveBtn = (Button) view.findViewById(R.id.removeImgBtn);
            // txtview=(TextView) view.findViewById(R.id.txtview);
        }
    }


    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext()).inflate(R.layout.image_layout, parent, false);

        return new MyViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(final MyViewHolder holder, final int position) {

        if (imgid.get(position) == null) {
            return;
        } else {
            if(imgid.get(position).getTag() != null){
                if(imgid.get(position).getTag().equals(tag)){
                    Uri uri = Uri.fromFile(new File(getImgPath(imgid.get(position).getImgName())));
                    File imgFile = new File(uri.toString());
                    if(imgFile.isFile() && imgFile.exists()){

                    } else {
                        try {
                            //Utilities.makeImageAvailable(imgid.get(position).getImgName());
                            Utilities.makeImageAvailableEx(context,holder.imageView,imgid.get(position).getImgName());
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                    Picasso.get().load(uri).placeholder(R.drawable.no_image).error(R.drawable.no_image).resize(130, 130).noFade().into(holder.imageView);
                    /*Picasso.get()
                            .load(uri)
                            .placeholder(R.drawable.no_image)
                            .error(R.drawable.no_image)
                            .into(holder.imageView);*/
                    //holder.imageView.setImageURI(Uri.parse(getImgPath(imgid.get(position).getImgName())));
                    //holder.txtview.setText(horizontalList.get(position).txt);
                    /*if (context.getClass().getSimpleName().equals("ReportViewActivity")) {
                        context.getClass().getSimpleName();
                        holder.imgRemoveBtn.setVisibility(View.GONE);
                    }*/
                    if(Globals.newReport == null){
                        if(!isIssueUpdateAllowed){
                            if(!imgid.get(position).getTag().equals(maintenanceTag)){
                                holder.imgRemoveBtn.setVisibility(View.GONE);
                            }
                        }
                    }
                    holder.imgRemoveBtn.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            new AlertDialog.Builder(context)
                                    .setTitle(R.string.title_warning)
                                    .setMessage(R.string.delete_image_msg)
                                    .setIcon(android.R.drawable.ic_dialog_alert)
                                    .setPositiveButton(R.string.btn_ok, new DialogInterface.OnClickListener() {

                                        public void onClick(DialogInterface dialog, int whichButton) {
                                            // Remove the item on remove/button click
                                            try {
                                                tempIssueImgList.add(imgid.get(position));
                                                imgid.remove(position);
                                            } catch (Exception e) {
                                                e.printStackTrace();
                                                Toast.makeText(context, "Deleting two images consecutively is not allowed yet. Please save / update and try again", Toast.LENGTH_LONG).show();
                                                return;
                                            }

                /*
                    public final void notifyItemRemoved (int position)
                        Notify any registered observers that the item previously located at position
                        has been removed from the data set. The items previously located at and
                        after position may now be found at oldPosition - 1.

                        This is a structural change event. Representations of other existing items
                        in the data set are still considered up to date and will not be rebound,
                        though their positions may be altered.

                    Parameters
                        position : Position of the item that has now been removed
                */
                                            notifyItemRemoved(position);

                /*
                    public final void notifyItemRangeChanged (int positionStart, int itemCount)
                        Notify any registered observers that the itemCount items starting at
                        position positionStart have changed. Equivalent to calling
                        notifyItemRangeChanged(position, itemCount, null);.

                        This is an item change event, not a structural change event. It indicates
                        that any reflection of the data in the given position range is out of date
                        and should be updated. The items in the given range retain the same identity.

                    Parameters
                        positionStart : Position of the first item that has changed
                        itemCount : Number of items that have changed
                */
                                            notifyItemRangeChanged(position, imgid.size());
                                            //Toast.makeText(context, "Yaay", Toast.LENGTH_SHORT).show();
                                        }
                                    })
                                    .setNegativeButton(R.string.btn_cancel, null).show();

                        }
                    });

                    holder.imageView.setOnClickListener(new View.OnClickListener() {
                        @Override

                        public void onClick(View v) {
                            selectedPosition = position;
                            //String list = taskImgId.get(position);
                            popup = new Popup(context, getImgPath(imgid.get(position).getImgName()), position, imgid.get(position).getImgName());
                            popup.setCancelable(true);
                            popup.show();
                            //Toast.makeText(context, "Item Clicked", Toast.LENGTH_SHORT).show();
                        }
                    });
                    uri = null;
                } else {
                    holder.imageView.setVisibility(View.GONE);
                    holder.imgRemoveBtn.setVisibility(View.GONE);
                }
            } else {
                holder.imageView.setVisibility(View.GONE);
                holder.imgRemoveBtn.setVisibility(View.GONE);
            }

        }

    }

    @Override
    public int getItemCount()
    {
        return imgid.size();
    }

    public int getPosition() {
        return selectedPosition;
    }
}
