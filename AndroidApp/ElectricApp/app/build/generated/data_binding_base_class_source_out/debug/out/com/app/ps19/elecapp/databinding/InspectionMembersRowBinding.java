// Generated by view binder compiler. Do not edit!
package com.app.ps19.elecapp.databinding;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.viewbinding.ViewBinding;
import com.app.ps19.elecapp.R;
import java.lang.NullPointerException;
import java.lang.Override;
import java.lang.String;

public final class InspectionMembersRowBinding implements ViewBinding {
  @NonNull
  private final LinearLayout rootView;

  @NonNull
  public final LinearLayout llEndTitleContainer;

  @NonNull
  public final LinearLayout llEndValueContainer;

  @NonNull
  public final LinearLayout llSessionRowMainContainer;

  @NonNull
  public final LinearLayout llSessionStatus;

  @NonNull
  public final LinearLayout llStartTitleContainer;

  @NonNull
  public final LinearLayout llStartValueContainer;

  @NonNull
  public final TextView tvSessionListEndDate;

  @NonNull
  public final TextView tvSessionListEndMp;

  @NonNull
  public final TextView tvSessionListEndMpValue;

  @NonNull
  public final TextView tvSessionListEndTime;

  @NonNull
  public final TextView tvSessionListStartDate;

  @NonNull
  public final TextView tvSessionListStartMp;

  @NonNull
  public final TextView tvSessionListStartMpValue;

  @NonNull
  public final TextView tvSessionListStartTime;

  @NonNull
  public final TextView tvUserName;

  private InspectionMembersRowBinding(@NonNull LinearLayout rootView,
      @NonNull LinearLayout llEndTitleContainer, @NonNull LinearLayout llEndValueContainer,
      @NonNull LinearLayout llSessionRowMainContainer, @NonNull LinearLayout llSessionStatus,
      @NonNull LinearLayout llStartTitleContainer, @NonNull LinearLayout llStartValueContainer,
      @NonNull TextView tvSessionListEndDate, @NonNull TextView tvSessionListEndMp,
      @NonNull TextView tvSessionListEndMpValue, @NonNull TextView tvSessionListEndTime,
      @NonNull TextView tvSessionListStartDate, @NonNull TextView tvSessionListStartMp,
      @NonNull TextView tvSessionListStartMpValue, @NonNull TextView tvSessionListStartTime,
      @NonNull TextView tvUserName) {
    this.rootView = rootView;
    this.llEndTitleContainer = llEndTitleContainer;
    this.llEndValueContainer = llEndValueContainer;
    this.llSessionRowMainContainer = llSessionRowMainContainer;
    this.llSessionStatus = llSessionStatus;
    this.llStartTitleContainer = llStartTitleContainer;
    this.llStartValueContainer = llStartValueContainer;
    this.tvSessionListEndDate = tvSessionListEndDate;
    this.tvSessionListEndMp = tvSessionListEndMp;
    this.tvSessionListEndMpValue = tvSessionListEndMpValue;
    this.tvSessionListEndTime = tvSessionListEndTime;
    this.tvSessionListStartDate = tvSessionListStartDate;
    this.tvSessionListStartMp = tvSessionListStartMp;
    this.tvSessionListStartMpValue = tvSessionListStartMpValue;
    this.tvSessionListStartTime = tvSessionListStartTime;
    this.tvUserName = tvUserName;
  }

  @Override
  @NonNull
  public LinearLayout getRoot() {
    return rootView;
  }

  @NonNull
  public static InspectionMembersRowBinding inflate(@NonNull LayoutInflater inflater) {
    return inflate(inflater, null, false);
  }

  @NonNull
  public static InspectionMembersRowBinding inflate(@NonNull LayoutInflater inflater,
      @Nullable ViewGroup parent, boolean attachToParent) {
    View root = inflater.inflate(R.layout.inspection_members_row, parent, false);
    if (attachToParent) {
      parent.addView(root);
    }
    return bind(root);
  }

  @NonNull
  public static InspectionMembersRowBinding bind(@NonNull View rootView) {
    // The body of this method is generated in a way you would not otherwise write.
    // This is done to optimize the compiled bytecode for size and performance.
    int id;
    missingId: {
      id = R.id.ll_end_title_container;
      LinearLayout llEndTitleContainer = rootView.findViewById(id);
      if (llEndTitleContainer == null) {
        break missingId;
      }

      id = R.id.ll_end_value_container;
      LinearLayout llEndValueContainer = rootView.findViewById(id);
      if (llEndValueContainer == null) {
        break missingId;
      }

      LinearLayout llSessionRowMainContainer = (LinearLayout) rootView;

      id = R.id.ll_session_status;
      LinearLayout llSessionStatus = rootView.findViewById(id);
      if (llSessionStatus == null) {
        break missingId;
      }

      id = R.id.ll_start_title_container;
      LinearLayout llStartTitleContainer = rootView.findViewById(id);
      if (llStartTitleContainer == null) {
        break missingId;
      }

      id = R.id.ll_start_value_container;
      LinearLayout llStartValueContainer = rootView.findViewById(id);
      if (llStartValueContainer == null) {
        break missingId;
      }

      id = R.id.tv_session_list_end_date;
      TextView tvSessionListEndDate = rootView.findViewById(id);
      if (tvSessionListEndDate == null) {
        break missingId;
      }

      id = R.id.tv_session_list_end_mp;
      TextView tvSessionListEndMp = rootView.findViewById(id);
      if (tvSessionListEndMp == null) {
        break missingId;
      }

      id = R.id.tv_session_list_end_mp_value;
      TextView tvSessionListEndMpValue = rootView.findViewById(id);
      if (tvSessionListEndMpValue == null) {
        break missingId;
      }

      id = R.id.tv_session_list_end_time;
      TextView tvSessionListEndTime = rootView.findViewById(id);
      if (tvSessionListEndTime == null) {
        break missingId;
      }

      id = R.id.tv_session_list_start_date;
      TextView tvSessionListStartDate = rootView.findViewById(id);
      if (tvSessionListStartDate == null) {
        break missingId;
      }

      id = R.id.tv_session_list_start_mp;
      TextView tvSessionListStartMp = rootView.findViewById(id);
      if (tvSessionListStartMp == null) {
        break missingId;
      }

      id = R.id.tv_session_list_start_mp_value;
      TextView tvSessionListStartMpValue = rootView.findViewById(id);
      if (tvSessionListStartMpValue == null) {
        break missingId;
      }

      id = R.id.tv_session_list_start_time;
      TextView tvSessionListStartTime = rootView.findViewById(id);
      if (tvSessionListStartTime == null) {
        break missingId;
      }

      id = R.id.tv_user_name;
      TextView tvUserName = rootView.findViewById(id);
      if (tvUserName == null) {
        break missingId;
      }

      return new InspectionMembersRowBinding((LinearLayout) rootView, llEndTitleContainer,
          llEndValueContainer, llSessionRowMainContainer, llSessionStatus, llStartTitleContainer,
          llStartValueContainer, tvSessionListEndDate, tvSessionListEndMp, tvSessionListEndMpValue,
          tvSessionListEndTime, tvSessionListStartDate, tvSessionListStartMp,
          tvSessionListStartMpValue, tvSessionListStartTime, tvUserName);
    }
    String missingId = rootView.getResources().getResourceName(id);
    throw new NullPointerException("Missing required view with ID: ".concat(missingId));
  }
}