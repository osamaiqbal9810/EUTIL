// Generated by view binder compiler. Do not edit!
package com.app.ps19.elecapp.databinding;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.viewbinding.ViewBinding;
import com.app.ps19.elecapp.R;
import java.lang.NullPointerException;
import java.lang.Override;
import java.lang.String;

public final class ActivityTaskBinding implements ViewBinding {
  @NonNull
  private final LinearLayout rootView;

  @NonNull
  public final TextView descNowTxt;

  @NonNull
  public final TextView elapsedTimeNowTxt;

  @NonNull
  public final LinearLayout endTaskLayout;

  @NonNull
  public final ImageView imageGPSTitle;

  @NonNull
  public final ImageView imageView;

  @NonNull
  public final LinearLayout imageView6;

  @NonNull
  public final TextView latNowTxt;

  @NonNull
  public final TextView latTxt;

  @NonNull
  public final TextView longNowTxt;

  @NonNull
  public final TextView longTxt;

  @NonNull
  public final TextView taskMenuDesc;

  @NonNull
  public final TextView taskMenuNotes;

  @NonNull
  public final TextView taskMenuTitle;

  @NonNull
  public final Button taskStartBtn;

  @NonNull
  public final TextView taskStatusTxt;

  @NonNull
  public final Button taskViewBtn;

  @NonNull
  public final TextView textView8;

  @NonNull
  public final TextView timeNowTxt;

  @NonNull
  public final TextView timeTxt;

  @NonNull
  public final LinearLayout titleLayout1;

  @NonNull
  public final LinearLayout titleLayout2;

  @NonNull
  public final ContentUserViewBinding userInfoView;

  private ActivityTaskBinding(@NonNull LinearLayout rootView, @NonNull TextView descNowTxt,
      @NonNull TextView elapsedTimeNowTxt, @NonNull LinearLayout endTaskLayout,
      @NonNull ImageView imageGPSTitle, @NonNull ImageView imageView,
      @NonNull LinearLayout imageView6, @NonNull TextView latNowTxt, @NonNull TextView latTxt,
      @NonNull TextView longNowTxt, @NonNull TextView longTxt, @NonNull TextView taskMenuDesc,
      @NonNull TextView taskMenuNotes, @NonNull TextView taskMenuTitle,
      @NonNull Button taskStartBtn, @NonNull TextView taskStatusTxt, @NonNull Button taskViewBtn,
      @NonNull TextView textView8, @NonNull TextView timeNowTxt, @NonNull TextView timeTxt,
      @NonNull LinearLayout titleLayout1, @NonNull LinearLayout titleLayout2,
      @NonNull ContentUserViewBinding userInfoView) {
    this.rootView = rootView;
    this.descNowTxt = descNowTxt;
    this.elapsedTimeNowTxt = elapsedTimeNowTxt;
    this.endTaskLayout = endTaskLayout;
    this.imageGPSTitle = imageGPSTitle;
    this.imageView = imageView;
    this.imageView6 = imageView6;
    this.latNowTxt = latNowTxt;
    this.latTxt = latTxt;
    this.longNowTxt = longNowTxt;
    this.longTxt = longTxt;
    this.taskMenuDesc = taskMenuDesc;
    this.taskMenuNotes = taskMenuNotes;
    this.taskMenuTitle = taskMenuTitle;
    this.taskStartBtn = taskStartBtn;
    this.taskStatusTxt = taskStatusTxt;
    this.taskViewBtn = taskViewBtn;
    this.textView8 = textView8;
    this.timeNowTxt = timeNowTxt;
    this.timeTxt = timeTxt;
    this.titleLayout1 = titleLayout1;
    this.titleLayout2 = titleLayout2;
    this.userInfoView = userInfoView;
  }

  @Override
  @NonNull
  public LinearLayout getRoot() {
    return rootView;
  }

  @NonNull
  public static ActivityTaskBinding inflate(@NonNull LayoutInflater inflater) {
    return inflate(inflater, null, false);
  }

  @NonNull
  public static ActivityTaskBinding inflate(@NonNull LayoutInflater inflater,
      @Nullable ViewGroup parent, boolean attachToParent) {
    View root = inflater.inflate(R.layout.activity_task, parent, false);
    if (attachToParent) {
      parent.addView(root);
    }
    return bind(root);
  }

  @NonNull
  public static ActivityTaskBinding bind(@NonNull View rootView) {
    // The body of this method is generated in a way you would not otherwise write.
    // This is done to optimize the compiled bytecode for size and performance.
    int id;
    missingId: {
      id = R.id.descNowTxt;
      TextView descNowTxt = rootView.findViewById(id);
      if (descNowTxt == null) {
        break missingId;
      }

      id = R.id.elapsedTimeNowTxt;
      TextView elapsedTimeNowTxt = rootView.findViewById(id);
      if (elapsedTimeNowTxt == null) {
        break missingId;
      }

      id = R.id.endTaskLayout;
      LinearLayout endTaskLayout = rootView.findViewById(id);
      if (endTaskLayout == null) {
        break missingId;
      }

      id = R.id.imageGPSTitle;
      ImageView imageGPSTitle = rootView.findViewById(id);
      if (imageGPSTitle == null) {
        break missingId;
      }

      id = R.id.imageView;
      ImageView imageView = rootView.findViewById(id);
      if (imageView == null) {
        break missingId;
      }

      id = R.id.imageView6;
      LinearLayout imageView6 = rootView.findViewById(id);
      if (imageView6 == null) {
        break missingId;
      }

      id = R.id.latNowTxt;
      TextView latNowTxt = rootView.findViewById(id);
      if (latNowTxt == null) {
        break missingId;
      }

      id = R.id.latTxt;
      TextView latTxt = rootView.findViewById(id);
      if (latTxt == null) {
        break missingId;
      }

      id = R.id.longNowTxt;
      TextView longNowTxt = rootView.findViewById(id);
      if (longNowTxt == null) {
        break missingId;
      }

      id = R.id.longTxt;
      TextView longTxt = rootView.findViewById(id);
      if (longTxt == null) {
        break missingId;
      }

      id = R.id.task_menu_desc;
      TextView taskMenuDesc = rootView.findViewById(id);
      if (taskMenuDesc == null) {
        break missingId;
      }

      id = R.id.task_menu_notes;
      TextView taskMenuNotes = rootView.findViewById(id);
      if (taskMenuNotes == null) {
        break missingId;
      }

      id = R.id.task_menu_title;
      TextView taskMenuTitle = rootView.findViewById(id);
      if (taskMenuTitle == null) {
        break missingId;
      }

      id = R.id.taskStartBtn;
      Button taskStartBtn = rootView.findViewById(id);
      if (taskStartBtn == null) {
        break missingId;
      }

      id = R.id.taskStatusTxt;
      TextView taskStatusTxt = rootView.findViewById(id);
      if (taskStatusTxt == null) {
        break missingId;
      }

      id = R.id.taskViewBtn;
      Button taskViewBtn = rootView.findViewById(id);
      if (taskViewBtn == null) {
        break missingId;
      }

      id = R.id.textView8;
      TextView textView8 = rootView.findViewById(id);
      if (textView8 == null) {
        break missingId;
      }

      id = R.id.timeNowTxt;
      TextView timeNowTxt = rootView.findViewById(id);
      if (timeNowTxt == null) {
        break missingId;
      }

      id = R.id.timeTxt;
      TextView timeTxt = rootView.findViewById(id);
      if (timeTxt == null) {
        break missingId;
      }

      id = R.id.titleLayout1;
      LinearLayout titleLayout1 = rootView.findViewById(id);
      if (titleLayout1 == null) {
        break missingId;
      }

      id = R.id.titleLayout2;
      LinearLayout titleLayout2 = rootView.findViewById(id);
      if (titleLayout2 == null) {
        break missingId;
      }

      id = R.id.userInfoView;
      View userInfoView = rootView.findViewById(id);
      if (userInfoView == null) {
        break missingId;
      }
      ContentUserViewBinding binding_userInfoView = ContentUserViewBinding.bind(userInfoView);

      return new ActivityTaskBinding((LinearLayout) rootView, descNowTxt, elapsedTimeNowTxt,
          endTaskLayout, imageGPSTitle, imageView, imageView6, latNowTxt, latTxt, longNowTxt,
          longTxt, taskMenuDesc, taskMenuNotes, taskMenuTitle, taskStartBtn, taskStatusTxt,
          taskViewBtn, textView8, timeNowTxt, timeTxt, titleLayout1, titleLayout2,
          binding_userInfoView);
    }
    String missingId = rootView.getResources().getResourceName(id);
    throw new NullPointerException("Missing required view with ID: ".concat(missingId));
  }
}