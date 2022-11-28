// Generated by view binder compiler. Do not edit!
package com.app.ps19.elecapp.databinding;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
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

public final class BriefingRadiobuttonRow10Binding implements ViewBinding {
  @NonNull
  private final LinearLayout rootView;

  @NonNull
  public final RadioButton radioButtonNo10;

  @NonNull
  public final RadioButton radioButtonYes10;

  @NonNull
  public final RadioGroup rgRow10;

  @NonNull
  public final TextView textViewRow10;

  private BriefingRadiobuttonRow10Binding(@NonNull LinearLayout rootView,
      @NonNull RadioButton radioButtonNo10, @NonNull RadioButton radioButtonYes10,
      @NonNull RadioGroup rgRow10, @NonNull TextView textViewRow10) {
    this.rootView = rootView;
    this.radioButtonNo10 = radioButtonNo10;
    this.radioButtonYes10 = radioButtonYes10;
    this.rgRow10 = rgRow10;
    this.textViewRow10 = textViewRow10;
  }

  @Override
  @NonNull
  public LinearLayout getRoot() {
    return rootView;
  }

  @NonNull
  public static BriefingRadiobuttonRow10Binding inflate(@NonNull LayoutInflater inflater) {
    return inflate(inflater, null, false);
  }

  @NonNull
  public static BriefingRadiobuttonRow10Binding inflate(@NonNull LayoutInflater inflater,
      @Nullable ViewGroup parent, boolean attachToParent) {
    View root = inflater.inflate(R.layout.briefing_radiobutton_row_10, parent, false);
    if (attachToParent) {
      parent.addView(root);
    }
    return bind(root);
  }

  @NonNull
  public static BriefingRadiobuttonRow10Binding bind(@NonNull View rootView) {
    // The body of this method is generated in a way you would not otherwise write.
    // This is done to optimize the compiled bytecode for size and performance.
    int id;
    missingId: {
      id = R.id.radio_button_no_10;
      RadioButton radioButtonNo10 = rootView.findViewById(id);
      if (radioButtonNo10 == null) {
        break missingId;
      }

      id = R.id.radio_button_yes_10;
      RadioButton radioButtonYes10 = rootView.findViewById(id);
      if (radioButtonYes10 == null) {
        break missingId;
      }

      id = R.id.rg_row_10;
      RadioGroup rgRow10 = rootView.findViewById(id);
      if (rgRow10 == null) {
        break missingId;
      }

      id = R.id.textView_row_10;
      TextView textViewRow10 = rootView.findViewById(id);
      if (textViewRow10 == null) {
        break missingId;
      }

      return new BriefingRadiobuttonRow10Binding((LinearLayout) rootView, radioButtonNo10,
          radioButtonYes10, rgRow10, textViewRow10);
    }
    String missingId = rootView.getResources().getResourceName(id);
    throw new NullPointerException("Missing required view with ID: ".concat(missingId));
  }
}