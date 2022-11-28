// Generated by view binder compiler. Do not edit!
package com.app.ps19.elecapp.databinding;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.viewbinding.ViewBinding;
import com.app.ps19.elecapp.R;
import com.google.android.material.appbar.AppBarLayout;
import com.google.android.material.appbar.CollapsingToolbarLayout;
import com.mikhaellopez.circularimageview.CircularImageView;
import java.lang.NullPointerException;
import java.lang.Override;
import java.lang.String;

public final class ActivityProfileBinding implements ViewBinding {
  @NonNull
  private final RelativeLayout rootView;

  @NonNull
  public final AppBarLayout appBar;

  @NonNull
  public final CircularImageView imgPlus;

  @NonNull
  public final CircularImageView imgProfile;

  @NonNull
  public final LinearLayout linearLayout;

  @NonNull
  public final RelativeLayout rlBackButton;

  @NonNull
  public final CollapsingToolbarLayout toolbarLayout;

  @NonNull
  public final TextView tvEmailMain;

  @NonNull
  public final TextView tvNameMain;

  private ActivityProfileBinding(@NonNull RelativeLayout rootView, @NonNull AppBarLayout appBar,
      @NonNull CircularImageView imgPlus, @NonNull CircularImageView imgProfile,
      @NonNull LinearLayout linearLayout, @NonNull RelativeLayout rlBackButton,
      @NonNull CollapsingToolbarLayout toolbarLayout, @NonNull TextView tvEmailMain,
      @NonNull TextView tvNameMain) {
    this.rootView = rootView;
    this.appBar = appBar;
    this.imgPlus = imgPlus;
    this.imgProfile = imgProfile;
    this.linearLayout = linearLayout;
    this.rlBackButton = rlBackButton;
    this.toolbarLayout = toolbarLayout;
    this.tvEmailMain = tvEmailMain;
    this.tvNameMain = tvNameMain;
  }

  @Override
  @NonNull
  public RelativeLayout getRoot() {
    return rootView;
  }

  @NonNull
  public static ActivityProfileBinding inflate(@NonNull LayoutInflater inflater) {
    return inflate(inflater, null, false);
  }

  @NonNull
  public static ActivityProfileBinding inflate(@NonNull LayoutInflater inflater,
      @Nullable ViewGroup parent, boolean attachToParent) {
    View root = inflater.inflate(R.layout.activity_profile, parent, false);
    if (attachToParent) {
      parent.addView(root);
    }
    return bind(root);
  }

  @NonNull
  public static ActivityProfileBinding bind(@NonNull View rootView) {
    // The body of this method is generated in a way you would not otherwise write.
    // This is done to optimize the compiled bytecode for size and performance.
    int id;
    missingId: {
      id = R.id.app_bar;
      AppBarLayout appBar = rootView.findViewById(id);
      if (appBar == null) {
        break missingId;
      }

      id = R.id.img_plus;
      CircularImageView imgPlus = rootView.findViewById(id);
      if (imgPlus == null) {
        break missingId;
      }

      id = R.id.img_profile;
      CircularImageView imgProfile = rootView.findViewById(id);
      if (imgProfile == null) {
        break missingId;
      }

      id = R.id.linearLayout;
      LinearLayout linearLayout = rootView.findViewById(id);
      if (linearLayout == null) {
        break missingId;
      }

      id = R.id.rl_back_button;
      RelativeLayout rlBackButton = rootView.findViewById(id);
      if (rlBackButton == null) {
        break missingId;
      }

      id = R.id.toolbar_layout;
      CollapsingToolbarLayout toolbarLayout = rootView.findViewById(id);
      if (toolbarLayout == null) {
        break missingId;
      }

      id = R.id.tv_email_main;
      TextView tvEmailMain = rootView.findViewById(id);
      if (tvEmailMain == null) {
        break missingId;
      }

      id = R.id.tv_name_main;
      TextView tvNameMain = rootView.findViewById(id);
      if (tvNameMain == null) {
        break missingId;
      }

      return new ActivityProfileBinding((RelativeLayout) rootView, appBar, imgPlus, imgProfile,
          linearLayout, rlBackButton, toolbarLayout, tvEmailMain, tvNameMain);
    }
    String missingId = rootView.getResources().getResourceName(id);
    throw new NullPointerException("Missing required view with ID: ".concat(missingId));
  }
}