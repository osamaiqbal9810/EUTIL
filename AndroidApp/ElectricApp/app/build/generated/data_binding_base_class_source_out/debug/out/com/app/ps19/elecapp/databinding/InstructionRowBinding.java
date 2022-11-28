// Generated by view binder compiler. Do not edit!
package com.app.ps19.elecapp.databinding;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.viewbinding.ViewBinding;
import com.app.ps19.elecapp.R;
import java.lang.NullPointerException;
import java.lang.Override;
import java.lang.String;

public final class InstructionRowBinding implements ViewBinding {
  @NonNull
  private final RelativeLayout rootView;

  @NonNull
  public final TextView tvGiAction;

  @NonNull
  public final TextView tvGiName;

  private InstructionRowBinding(@NonNull RelativeLayout rootView, @NonNull TextView tvGiAction,
      @NonNull TextView tvGiName) {
    this.rootView = rootView;
    this.tvGiAction = tvGiAction;
    this.tvGiName = tvGiName;
  }

  @Override
  @NonNull
  public RelativeLayout getRoot() {
    return rootView;
  }

  @NonNull
  public static InstructionRowBinding inflate(@NonNull LayoutInflater inflater) {
    return inflate(inflater, null, false);
  }

  @NonNull
  public static InstructionRowBinding inflate(@NonNull LayoutInflater inflater,
      @Nullable ViewGroup parent, boolean attachToParent) {
    View root = inflater.inflate(R.layout.instruction_row, parent, false);
    if (attachToParent) {
      parent.addView(root);
    }
    return bind(root);
  }

  @NonNull
  public static InstructionRowBinding bind(@NonNull View rootView) {
    // The body of this method is generated in a way you would not otherwise write.
    // This is done to optimize the compiled bytecode for size and performance.
    int id;
    missingId: {
      id = R.id.tv_gi_action;
      TextView tvGiAction = rootView.findViewById(id);
      if (tvGiAction == null) {
        break missingId;
      }

      id = R.id.tv_gi_name;
      TextView tvGiName = rootView.findViewById(id);
      if (tvGiName == null) {
        break missingId;
      }

      return new InstructionRowBinding((RelativeLayout) rootView, tvGiAction, tvGiName);
    }
    String missingId = rootView.getResources().getResourceName(id);
    throw new NullPointerException("Missing required view with ID: ".concat(missingId));
  }
}