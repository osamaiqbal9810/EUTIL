// Generated by view binder compiler. Do not edit!
package com.app.ps19.elecapp.databinding;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ExpandableListView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.FragmentContainerView;
import androidx.viewbinding.ViewBinding;
import com.app.ps19.elecapp.R;
import java.lang.NullPointerException;
import java.lang.Override;
import java.lang.String;

public final class FragmentPreviousIssuesBinding implements ViewBinding {
  @NonNull
  private final RelativeLayout rootView;

  @NonNull
  public final ExpandableListView elPreviousIssues;

  @NonNull
  public final RelativeLayout frameLayoutUca;

  @NonNull
  public final ImageView ivPoint;

  @NonNull
  public final LinearLayout llIssueCount;

  @NonNull
  public final RelativeLayout llLocationName;

  @NonNull
  public final FragmentContainerView mapUca;

  @NonNull
  public final RelativeLayout rlPrevReportedDefects;

  @NonNull
  public final ImageView transparentImage;

  @NonNull
  public final TextView tvIssueCount;

  @NonNull
  public final TextView tvLocName;

  private FragmentPreviousIssuesBinding(@NonNull RelativeLayout rootView,
      @NonNull ExpandableListView elPreviousIssues, @NonNull RelativeLayout frameLayoutUca,
      @NonNull ImageView ivPoint, @NonNull LinearLayout llIssueCount,
      @NonNull RelativeLayout llLocationName, @NonNull FragmentContainerView mapUca,
      @NonNull RelativeLayout rlPrevReportedDefects, @NonNull ImageView transparentImage,
      @NonNull TextView tvIssueCount, @NonNull TextView tvLocName) {
    this.rootView = rootView;
    this.elPreviousIssues = elPreviousIssues;
    this.frameLayoutUca = frameLayoutUca;
    this.ivPoint = ivPoint;
    this.llIssueCount = llIssueCount;
    this.llLocationName = llLocationName;
    this.mapUca = mapUca;
    this.rlPrevReportedDefects = rlPrevReportedDefects;
    this.transparentImage = transparentImage;
    this.tvIssueCount = tvIssueCount;
    this.tvLocName = tvLocName;
  }

  @Override
  @NonNull
  public RelativeLayout getRoot() {
    return rootView;
  }

  @NonNull
  public static FragmentPreviousIssuesBinding inflate(@NonNull LayoutInflater inflater) {
    return inflate(inflater, null, false);
  }

  @NonNull
  public static FragmentPreviousIssuesBinding inflate(@NonNull LayoutInflater inflater,
      @Nullable ViewGroup parent, boolean attachToParent) {
    View root = inflater.inflate(R.layout.fragment_previous_issues, parent, false);
    if (attachToParent) {
      parent.addView(root);
    }
    return bind(root);
  }

  @NonNull
  public static FragmentPreviousIssuesBinding bind(@NonNull View rootView) {
    // The body of this method is generated in a way you would not otherwise write.
    // This is done to optimize the compiled bytecode for size and performance.
    int id;
    missingId: {
      id = R.id.el_previous_issues;
      ExpandableListView elPreviousIssues = rootView.findViewById(id);
      if (elPreviousIssues == null) {
        break missingId;
      }

      id = R.id.frameLayout_uca;
      RelativeLayout frameLayoutUca = rootView.findViewById(id);
      if (frameLayoutUca == null) {
        break missingId;
      }

      id = R.id.iv_point;
      ImageView ivPoint = rootView.findViewById(id);
      if (ivPoint == null) {
        break missingId;
      }

      id = R.id.ll_issue_count;
      LinearLayout llIssueCount = rootView.findViewById(id);
      if (llIssueCount == null) {
        break missingId;
      }

      id = R.id.ll_location_name;
      RelativeLayout llLocationName = rootView.findViewById(id);
      if (llLocationName == null) {
        break missingId;
      }

      id = R.id.map_uca;
      FragmentContainerView mapUca = rootView.findViewById(id);
      if (mapUca == null) {
        break missingId;
      }

      id = R.id.rl_prev_reported_defects;
      RelativeLayout rlPrevReportedDefects = rootView.findViewById(id);
      if (rlPrevReportedDefects == null) {
        break missingId;
      }

      id = R.id.transparent_image;
      ImageView transparentImage = rootView.findViewById(id);
      if (transparentImage == null) {
        break missingId;
      }

      id = R.id.tv_issue_count;
      TextView tvIssueCount = rootView.findViewById(id);
      if (tvIssueCount == null) {
        break missingId;
      }

      id = R.id.tv_loc_name;
      TextView tvLocName = rootView.findViewById(id);
      if (tvLocName == null) {
        break missingId;
      }

      return new FragmentPreviousIssuesBinding((RelativeLayout) rootView, elPreviousIssues,
          frameLayoutUca, ivPoint, llIssueCount, llLocationName, mapUca, rlPrevReportedDefects,
          transparentImage, tvIssueCount, tvLocName);
    }
    String missingId = rootView.getResources().getResourceName(id);
    throw new NullPointerException("Missing required view with ID: ".concat(missingId));
  }
}