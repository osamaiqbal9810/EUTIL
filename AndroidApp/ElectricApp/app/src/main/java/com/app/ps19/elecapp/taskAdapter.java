package com.app.ps19.elecapp;

import static com.app.ps19.elecapp.Shared.Globals.TASK_FINISHED_STATUS;
import static com.app.ps19.elecapp.Shared.Globals.TASK_IN_PROGRESS_STATUS;
import static com.app.ps19.elecapp.Shared.Globals.TASK_NOT_STARTED_STATUS;
import static com.app.ps19.elecapp.Shared.Globals.isTaskStarted;

import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.view.animation.LinearInterpolator;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.app.ps19.elecapp.Shared.Globals;
import com.app.ps19.elecapp.classes.Task;
import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;

import java.util.ArrayList;

public class taskAdapter extends ArrayAdapter<Task> {
    private final Activity context;
    private ArrayList<Task> tasks;

    public taskAdapter(Activity context, ArrayList<Task> tasks) {
        super(context, R.layout.task_row, tasks);
        // TODO Auto-generated constructor stub

        this.context = context;
        this.tasks = tasks;
    }

    public View getView(int position, View view, ViewGroup parent) {
        LayoutInflater inflater = context.getLayoutInflater();
        View rowView = inflater.inflate(R.layout.task_row, null, true);

        TextView titleText = (TextView) rowView.findViewById(R.id.title);
        ImageView imageView = (ImageView) rowView.findViewById(R.id.task_img);
        TextView subtitleText = (TextView) rowView.findViewById(R.id.sub_title);
        TextView detailsText = (TextView) rowView.findViewById(R.id.details);
        ImageView statusImg = (ImageView) rowView.findViewById(R.id.taskStatusIcon);

        AlphaAnimation blinkanimation = new AlphaAnimation(1, 0); // Change alpha from fully visible to invisible
        blinkanimation.setDuration(300); // duration - half a second
        blinkanimation.setInterpolator(new LinearInterpolator()); // do not alter animation rate
        blinkanimation.setRepeatCount(3); // Repeat animation infinitely
        blinkanimation.setRepeatMode(Animation.REVERSE);

        if (tasks.get(position).getStatus().equals(TASK_NOT_STARTED_STATUS) || tasks.get(position).getStatus().equals("")) {
            statusImg.setImageResource(R.drawable.not_started_txt);
            statusImg.startAnimation(blinkanimation);
        } else if (tasks.get(position).getStatus().equals(TASK_FINISHED_STATUS)) {
            statusImg.setImageResource(R.drawable.finished_txt);
        } else if (tasks.get(position).getStatus().equals(TASK_IN_PROGRESS_STATUS)) {
            //statusImg.setImageResource(R.drawable.ic_play_circle_outline_green_24dp);
            statusImg.setImageResource(R.drawable.started_txt);
            statusImg.startAnimation(blinkanimation);
        }
        RequestOptions requestOptions = new RequestOptions();
        requestOptions.error(R.drawable.no_image);
        Glide.with(context).setDefaultRequestOptions(requestOptions)
                .load(Globals.wsImgURL + tasks.get(position).getImageUrl())
                .into(imageView);
        titleText.setText(tasks.get(position).getTitle());
        //imageView.setImageURI(Uri.parse(Globals.wsImgURL+tasks.get(position).getImageUrl()));
        subtitleText.setText(tasks.get(position).getDescription());
        detailsText.setText(tasks.get(position).getNotes());
        if (tasks.get(position).getStatus().equals(TASK_IN_PROGRESS_STATUS)) {
            isTaskStarted = true;
        }
        return rowView;
    }

    ;
}