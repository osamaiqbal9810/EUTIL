// Generated by view binder compiler. Do not edit!
package com.app.ps19.elecapp.databinding;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.viewbinding.ViewBinding;
import com.app.ps19.elecapp.R;
import java.lang.NullPointerException;
import java.lang.Override;
import java.lang.String;

public final class BriefingButtoneditRow13Binding implements ViewBinding {
  @NonNull
  private final LinearLayout rootView;

  @NonNull
  public final EditText edRow13;

  @NonNull
  public final RadioButton radioButtonNo13;

  @NonNull
  public final RadioButton radioButtonYes13;

  @NonNull
  public final RadioGroup rgRow13;

  @NonNull
  public final TextView textViewRow13;

  @NonNull
  public final TextView textViewRow133;

  private BriefingButtoneditRow13Binding(@NonNull LinearLayout rootView, @NonNull EditText edRow13,
      @NonNull RadioButton radioButtonNo13, @NonNull RadioButton radioButtonYes13,
      @NonNull RadioGroup rgRow13, @NonNull TextView textViewRow13,
      @NonNull TextView textViewRow133) {
    this.rootView = rootView;
    this.edRow13 = edRow13;
    this.radioButtonNo13 = radioButtonNo13;
    this.radioButtonYes13 = radioButtonYes13;
    this.rgRow13 = rgRow13;
    this.textViewRow13 = textViewRow13;
    this.textViewRow133 = textViewRow133;
  }

  @Override
  @NonNull
  public LinearLayout getRoot() {
    return rootView;
  }

  @NonNull
  public static BriefingButtoneditRow13Binding inflate(@NonNull LayoutInflater inflater) {
    return inflate(inflater, null, false);
  }

  @NonNull
  public static BriefingButtoneditRow13Binding inflate(@NonNull LayoutInflater inflater,
      @Nullable ViewGroup parent, boolean attachToParent) {
    View root = inflater.inflate(R.layout.briefing_buttonedit_row_13, parent, false);
    if (attachToParent) {
      parent.addView(root);
    }
    return bind(root);
  }

  @NonNull
  public static BriefingButtoneditRow13Binding bind(@NonNull View rootView) {
    // The body of this method is generated in a way you would not otherwise write.
    // This is done to optimize the compiled bytecode for size and performance.
    int id;
    missingId: {
      id = R.id.ed_row_13;
      EditText edRow13 = rootView.findViewById(id);
      if (edRow13 == null) {
        break missingId;
      }

      id = R.id.radio_button_no_13;
      RadioButton radioButtonNo13 = rootView.findViewById(id);
      if (radioButtonNo13 == null) {
        break missingId;
      }

      id = R.id.radio_button_yes_13;
      RadioButton radioButtonYes13 = rootView.findViewById(id);
      if (radioButtonYes13 == null) {
        break missingId;
      }

      id = R.id.rg_row_13;
      RadioGroup rgRow13 = rootView.findViewById(id);
      if (rgRow13 == null) {
        break missingId;
      }

      id = R.id.textView_row_13;
      TextView textViewRow13 = rootView.findViewById(id);
      if (textViewRow13 == null) {
        break missingId;
      }

      id = R.id.textView_row_133;
      TextView textViewRow133 = rootView.findViewById(id);
      if (textViewRow133 == null) {
        break missingId;
      }

      return new BriefingButtoneditRow13Binding((LinearLayout) rootView, edRow13, radioButtonNo13,
          radioButtonYes13, rgRow13, textViewRow13, textViewRow133);
    }
    String missingId = rootView.getResources().getResourceName(id);
    throw new NullPointerException("Missing required view with ID: ".concat(missingId));
  }
}