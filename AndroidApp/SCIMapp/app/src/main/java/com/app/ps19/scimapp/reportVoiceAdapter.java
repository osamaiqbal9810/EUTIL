package com.app.ps19.scimapp;

import android.media.MediaMetadataRetriever;
import android.media.MediaPlayer;
import android.os.Environment;
import androidx.recyclerview.widget.RecyclerView;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.net.Uri;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.Shared.Utilities;
import com.app.ps19.scimapp.classes.IssueVoice;

import java.io.File;
import java.util.ArrayList;

import static com.app.ps19.scimapp.Shared.Globals.isIssueUpdateAllowed;
import static com.app.ps19.scimapp.Shared.Globals.tempIssueVoiceList;
import static com.app.ps19.scimapp.Shared.Utilities.getVoicePath;
import static com.app.ps19.scimapp.Shared.Utilities.makeVoiceAvailableEx;

public class reportVoiceAdapter extends RecyclerView.Adapter<reportVoiceAdapter.MyViewHolder> {


    Popup popup;
    private final ArrayList<IssueVoice> voiceList;
    //public static final String VOICE_DELETE_VERIFICATION_MSG = .getString(R.string.msg_delete_voice_confirmation);
    //List<Uri> horizontalList = Collections.emptyList();
    Context context;
    int selectedPosition;
    String activityName;
    MediaPlayer mp = new MediaPlayer();
    // Animation
    Animation animBlink;
    String maintenanceTag = "MaintenanceExecActivity";
    //public static String VOICE_PATH = Environment.getExternalStorageDirectory()+"/"+Globals.voiceFolderName
    //        +"/";


    public reportVoiceAdapter(Context context, ArrayList<IssueVoice> horizontalList, String activityName) {
        this.voiceList = horizontalList;
        this.context = context;
        this.activityName = activityName;
        animBlink = AnimationUtils.loadAnimation(context,
                R.anim.blink);
    }


    public class MyViewHolder extends RecyclerView.ViewHolder {

        ImageView imageView;
        Button btnRemoveVoice;
        TextView tvVoiceDuration;
        public MyViewHolder(View view) {
            super(view);
            imageView=(ImageView) view.findViewById(R.id.iv_voice);
            btnRemoveVoice = (Button) view.findViewById(R.id.btn_remove_voice);
            tvVoiceDuration =(TextView) view.findViewById(R.id.tv_voice_duration);
        }
    }


    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext()).inflate(R.layout.voice_layout, parent, false);

        return new MyViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(final MyViewHolder holder, int position) {

        if(voiceList.get(holder.getAdapterPosition()).getVoiceName() == null || voiceList.get(holder.getAdapterPosition()) == null || voiceList.get(position).getVoiceName().equals("")){
            holder.imageView.setVisibility(View.GONE);
            holder.btnRemoveVoice.setVisibility(View.GONE);
            holder.tvVoiceDuration.setVisibility(View.GONE);
        } else {
            /*try {
            //Utilities.makeImageAvailable(imgid.get(position).getImgName());
            //Utilities.makeImageAvailableEx(context,holder.imageView, voiceList.get(position).getVoiceName());
        } catch (Exception e) {
            e.printStackTrace();
        }*/
            //holder.imageView.setImageURI(Uri.parse(getImgPath(voiceList.get(position).getVoiceName())));
            //holder.txtview.setText(horizontalList.get(position).txt);
            final File audioFile = new File(getVoicePath(voiceList.get(holder.getAdapterPosition()).getVoiceName()));
            if (audioFile.isFile() && audioFile.exists()) {

            } else {
                makeVoiceAvailableEx(context,audioFile.getName());
            }
            //
            holder.tvVoiceDuration.setText(getDuration(new File(getVoicePath(voiceList.get(holder.getAdapterPosition()).getVoiceName()))));
            /*if (context.getClass().getSimpleName().equals("ReportViewActivity")) {
                context.getClass().getSimpleName();
                holder.btnRemoveVoice.setVisibility(View.GONE);
            }*/
            if(Globals.newReport == null){
                if(!isIssueUpdateAllowed){
                    holder.btnRemoveVoice.setVisibility(View.GONE);
                    try {
                        if(activityName.equals(maintenanceTag)){
                            holder.btnRemoveVoice.setVisibility(View.VISIBLE);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
            // mp = MediaPlayer.create(context, Uri.parse(voiceList.get(position).getVoiceName()));
            mp.setOnCompletionListener(new MediaPlayer.OnCompletionListener()
            {
                @Override
                public void onCompletion(MediaPlayer mPlayer)
                {
                    try {
                        mPlayer.stop();
                        mPlayer.reset();
                        mPlayer.release();
                    } catch (IllegalStateException e) {
                        e.printStackTrace();
                    }
                    holder.imageView.setImageDrawable(context.getResources().getDrawable(R.drawable.ic_play_circle_outline_dark_green_24dp));
                }
            });
            holder.imageView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(final View v) {
                    //mp = new MediaPlayer();
                    holder.imageView.setImageDrawable(context.getResources().getDrawable(R.drawable.ic_play_circle_outline_dark_green_24dp));
                    //holder.imageView.setImageDrawable(context.getResources().getDrawable(R.drawable.ic_stop_red_24dp));
                    try {
                        stopPlaying(v);
                        if (audioFile.isFile() && audioFile.exists()) {
                            if(holder.tvVoiceDuration.getText().toString().equals("00:00")){
                                holder.tvVoiceDuration.setText(getDuration(new File(getVoicePath(voiceList.get(holder.getAdapterPosition()).getVoiceName()))));
                            }
                            mp = MediaPlayer.create(context, Uri.parse(getVoicePath(voiceList.get(holder.getAdapterPosition()).getVoiceName())));//mp.setDataSource(voiceList.get(position).getVoiceName());
                            mp.setOnCompletionListener(new MediaPlayer.OnCompletionListener()
                            {
                                @Override
                                public void onCompletion(MediaPlayer mPlayer)
                                {
                                    try {
                                        mPlayer.stop();
                                        mPlayer.reset();
                                        mPlayer.release();
                                    } catch (IllegalStateException e) {
                                        e.printStackTrace();
                                    }
                                    v.clearAnimation();
                                    //holder.imageView.setImageDrawable(context.getResources().getDrawable(R.drawable.ic_play_circle_outline_dark_green_24dp));
                                }
                            });
                            mp.start();
                            v.startAnimation(animBlink);
                        } else {
                            Toast.makeText(context, context.getResources().getText(R.string.download_voice_note), Toast.LENGTH_SHORT).show();
                        }

                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });
            holder.btnRemoveVoice.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    new AlertDialog.Builder(context)
                            .setTitle(R.string.title_warning)
                            .setMessage(context.getString(R.string.msg_delete_voice_confirmation))
                            .setIcon(android.R.drawable.ic_dialog_alert)
                            .setPositiveButton(R.string.btn_ok, new DialogInterface.OnClickListener() {

                                public void onClick(DialogInterface dialog, int whichButton) {
                                    // Remove the item on remove/button click
                                    tempIssueVoiceList.add(voiceList.get(holder.getAdapterPosition()));
                                    voiceList.remove(holder.getAdapterPosition());

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
                                    notifyItemRemoved(holder.getAdapterPosition());

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
                                    notifyItemRangeChanged(holder.getAdapterPosition(), voiceList.size());
                                    //Toast.makeText(context, "Yaay", Toast.LENGTH_SHORT).show();
                                }
                            })
                            .setNegativeButton(R.string.btn_cancel, null).show();

                }
            });

        /*holder.imageView.setOnClickListener(new View.OnClickListener() {
            @Override

            public void onClick(View v) {
                selectedPosition = position;
                //String list = taskImgId.get(position);
                popup = new Popup(context, getImgPath(voiceList.get(position).getVoiceName()), position);
                popup.setCancelable(true);
                popup.show();
                //Toast.makeText(context, "Item Clicked", Toast.LENGTH_SHORT).show();
            }
        });*/
        }

    }
    void stopPlaying(View view) {
        if (mp != null) {
            try {
                mp.stop();
                mp.release();
                mp = null;
                if(view != null) {
                    view.clearAnimation();
                }
            } catch (IllegalStateException e) {
                e.printStackTrace();
            }
        }
    }

    /*@Override
    public void onViewDetachedFromWindow(@NonNull MyViewHolder holder) {
        super.onViewDetachedFromWindow(holder);
        try {
            mp.reset();
            mp.release();
            mp = null;
        } catch (Exception e) {
            e.printStackTrace();
        }
    }*/

    private static String getDuration(File file) {
        String durationStr = null;
        if (file.isFile() && file.exists()) {
            try {
                MediaMetadataRetriever mediaMetadataRetriever = new MediaMetadataRetriever();
                mediaMetadataRetriever.setDataSource(file.getAbsolutePath());
                durationStr = mediaMetadataRetriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION);
            } catch (IllegalArgumentException e) {
                e.printStackTrace();
            }
            try {
                return Utilities.formatMilliSecond(Long.parseLong(durationStr));
            } catch (NumberFormatException e) {
                e.printStackTrace();
            }
        }
        return "00:00";
    }
    @Override
    public int getItemCount()
    {
        return voiceList.size();
    }

    public int getPosition() {
        return selectedPosition;
    }
}
