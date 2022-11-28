// Generated by view binder compiler. Do not edit!
package com.app.ps19.elecapp.databinding;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.Toolbar;
import androidx.coordinatorlayout.widget.CoordinatorLayout;
import androidx.viewbinding.ViewBinding;
import androidx.viewpager.widget.ViewPager;
import com.app.ps19.elecapp.R;
import com.google.android.material.appbar.AppBarLayout;
import com.google.android.material.tabs.TabLayout;
import java.lang.NullPointerException;
import java.lang.Override;
import java.lang.String;

public final class ActivityIssuesBinding implements ViewBinding {
  @NonNull
  private final CoordinatorLayout rootView;

  @NonNull
  public final AppBarLayout appbar;

  @NonNull
  public final ViewPager container;

  @NonNull
  public final CoordinatorLayout mainContent;

  @NonNull
  public final TabLayout tabs;

  @NonNull
  public final Toolbar tbIssues;

  @NonNull
  public final TextView tvTaskStatus;

  private ActivityIssuesBinding(@NonNull CoordinatorLayout rootView, @NonNull AppBarLayout appbar,
      @NonNull ViewPager container, @NonNull CoordinatorLayout mainContent, @NonNull TabLayout tabs,
      @NonNull Toolbar tbIssues, @NonNull TextView tvTaskStatus) {
    this.rootView = rootView;
    this.appbar = appbar;
    this.container = container;
    this.mainContent = mainContent;
    this.tabs = tabs;
    this.tbIssues = tbIssues;
    this.tvTaskStatus = tvTaskStatus;
  }

  @Override
  @NonNull
  public CoordinatorLayout getRoot() {
    return rootView;
  }

  @NonNull
  public static ActivityIssuesBinding inflate(@NonNull LayoutInflater inflater) {
    return inflate(inflater, null, false);
  }

  @NonNull
  public static ActivityIssuesBinding inflate(@NonNull LayoutInflater inflater,
      @Nullable ViewGroup parent, boolean attachToParent) {
    View root = inflater.inflate(R.layout.activity_issues, parent, false);
    if (attachToParent) {
      parent.addView(root);
    }
    return bind(root);
  }

  @NonNull
  public static ActivityIssuesBinding bind(@NonNull View rootView) {
    // The body of this method is generated in a way you would not otherwise write.
    // This is done to optimize the compiled bytecode for size and performance.
    int id;
    missingId: {
      id = R.id.appbar;
      AppBarLayout appbar = rootView.findViewById(id);
      if (appbar == null) {
        break missingId;
      }

      id = R.id.container;
      ViewPager container = rootView.findViewById(id);
      if (container == null) {
        break missingId;
      }

      CoordinatorLayout mainContent = (CoordinatorLayout) rootView;

      id = R.id.tabs;
      TabLayout tabs = rootView.findViewById(id);
      if (tabs == null) {
        break missingId;
      }

      id = R.id.tbIssues;
      Toolbar tbIssues = rootView.findViewById(id);
      if (tbIssues == null) {
        break missingId;
      }

      id = R.id.tv_task_status;
      TextView tvTaskStatus = rootView.findViewById(id);
      if (tvTaskStatus == null) {
        break missingId;
      }

      return new ActivityIssuesBinding((CoordinatorLayout) rootView, appbar, container, mainContent,
          tabs, tbIssues, tvTaskStatus);
    }
    String missingId = rootView.getResources().getResourceName(id);
    throw new NullPointerException("Missing required view with ID: ".concat(missingId));
  }
}