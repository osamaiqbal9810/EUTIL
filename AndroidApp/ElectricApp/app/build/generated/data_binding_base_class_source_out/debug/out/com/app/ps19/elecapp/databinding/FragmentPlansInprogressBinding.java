// Generated by view binder compiler. Do not edit!
package com.app.ps19.elecapp.databinding;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.viewbinding.ViewBinding;
import com.app.ps19.elecapp.R;
import java.lang.NullPointerException;
import java.lang.Override;
import java.lang.String;

public final class FragmentPlansInprogressBinding implements ViewBinding {
  @NonNull
  private final RelativeLayout rootView;

  @NonNull
  public final ImageView ivInspectionStatus;

  @NonNull
  public final TextView tvInspectionIssueCount;

  @NonNull
  public final TextView tvInspectionStartDate;

  @NonNull
  public final TextView tvInspectionStatus;

  @NonNull
  public final TextView tvWPTitle;

  private FragmentPlansInprogressBinding(@NonNull RelativeLayout rootView,
      @NonNull ImageView ivInspectionStatus, @NonNull TextView tvInspectionIssueCount,
      @NonNull TextView tvInspectionStartDate, @NonNull TextView tvInspectionStatus,
      @NonNull TextView tvWPTitle) {
    this.rootView = rootView;
    this.ivInspectionStatus = ivInspectionStatus;
    this.tvInspectionIssueCount = tvInspectionIssueCount;
    this.tvInspectionStartDate = tvInspectionStartDate;
    this.tvInspectionStatus = tvInspectionStatus;
    this.tvWPTitle = tvWPTitle;
  }

  @Override
  @NonNull
  public RelativeLayout getRoot() {
    return rootView;
  }

  @NonNull
  public static FragmentPlansInprogressBinding inflate(@NonNull LayoutInflater inflater) {
    return inflate(inflater, null, false);
  }

  @NonNull
  public static FragmentPlansInprogressBinding inflate(@NonNull LayoutInflater inflater,
      @Nullable ViewGroup parent, boolean attachToParent) {
    View root = inflater.inflate(R.layout.fragment_plans_inprogress, parent, false);
    if (attachToParent) {
      parent.addView(root);
    }
    return bind(root);
  }

  @NonNull
  public static FragmentPlansInprogressBinding bind(@NonNull View rootView) {
    // The body of this method is generated in a way you would not otherwise write.
    // This is done to optimize the compiled bytecode for size and performance.
    int id;
    missingId: {
      id = R.id.iv_inspection_status;
      ImageView ivInspectionStatus = rootView.findViewById(id);
      if (ivInspectionStatus == null) {
        break missingId;
      }

      id = R.id.tv_inspection_issue_count;
      TextView tvInspectionIssueCount = rootView.findViewById(id);
      if (tvInspectionIssueCount == null) {
        break missingId;
      }

      id = R.id.tv_inspection_start_date;
      TextView tvInspectionStartDate = rootView.findViewById(id);
      if (tvInspectionStartDate == null) {
        break missingId;
      }

      id = R.id.tv_inspection_status;
      TextView tvInspectionStatus = rootView.findViewById(id);
      if (tvInspectionStatus == null) {
        break missingId;
      }

      id = R.id.tvWPTitle;
      TextView tvWPTitle = rootView.findViewById(id);
      if (tvWPTitle == null) {
        break missingId;
      }

      return new FragmentPlansInprogressBinding((RelativeLayout) rootView, ivInspectionStatus,
          tvInspectionIssueCount, tvInspectionStartDate, tvInspectionStatus, tvWPTitle);
    }
    String missingId = rootView.getResources().getResourceName(id);
    throw new NullPointerException("Missing required view with ID: ".concat(missingId));
  }
}