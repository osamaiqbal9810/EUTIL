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

public final class BriefingRadiotextRow24Binding implements ViewBinding {
  @NonNull
  private final LinearLayout rootView;

  @NonNull
  public final RadioButton radioButtonNo24a;

  @NonNull
  public final RadioButton radioButtonNo24b;

  @NonNull
  public final RadioButton radioButtonYes24a;

  @NonNull
  public final RadioButton radioButtonYes24b;

  @NonNull
  public final RadioGroup rgRow24a;

  @NonNull
  public final RadioGroup rgRow24b;

  @NonNull
  public final TextView textViewRow24;

  private BriefingRadiotextRow24Binding(@NonNull LinearLayout rootView,
      @NonNull RadioButton radioButtonNo24a, @NonNull RadioButton radioButtonNo24b,
      @NonNull RadioButton radioButtonYes24a, @NonNull RadioButton radioButtonYes24b,
      @NonNull RadioGroup rgRow24a, @NonNull RadioGroup rgRow24b, @NonNull TextView textViewRow24) {
    this.rootView = rootView;
    this.radioButtonNo24a = radioButtonNo24a;
    this.radioButtonNo24b = radioButtonNo24b;
    this.radioButtonYes24a = radioButtonYes24a;
    this.radioButtonYes24b = radioButtonYes24b;
    this.rgRow24a = rgRow24a;
    this.rgRow24b = rgRow24b;
    this.textViewRow24 = textViewRow24;
  }

  @Override
  @NonNull
  public LinearLayout getRoot() {
    return rootView;
  }

  @NonNull
  public static BriefingRadiotextRow24Binding inflate(@NonNull LayoutInflater inflater) {
    return inflate(inflater, null, false);
  }

  @NonNull
  public static BriefingRadiotextRow24Binding inflate(@NonNull LayoutInflater inflater,
      @Nullable ViewGroup parent, boolean attachToParent) {
    View root = inflater.inflate(R.layout.briefing_radiotext_row_24, parent, false);
    if (attachToParent) {
      parent.addView(root);
    }
    return bind(root);
  }

  @NonNull
  public static BriefingRadiotextRow24Binding bind(@NonNull View rootView) {
    // The body of this method is generated in a way you would not otherwise write.
    // This is done to optimize the compiled bytecode for size and performance.
    int id;
    missingId: {
      id = R.id.radioButton_no_24a;
      RadioButton radioButtonNo24a = rootView.findViewById(id);
      if (radioButtonNo24a == null) {
        break missingId;
      }

      id = R.id.radioButton_no_24b;
      RadioButton radioButtonNo24b = rootView.findViewById(id);
      if (radioButtonNo24b == null) {
        break missingId;
      }

      id = R.id.radioButton_yes_24a;
      RadioButton radioButtonYes24a = rootView.findViewById(id);
      if (radioButtonYes24a == null) {
        break missingId;
      }

      id = R.id.radioButton_yes_24b;
      RadioButton radioButtonYes24b = rootView.findViewById(id);
      if (radioButtonYes24b == null) {
        break missingId;
      }

      id = R.id.rg_row_24a;
      RadioGroup rgRow24a = rootView.findViewById(id);
      if (rgRow24a == null) {
        break missingId;
      }

      id = R.id.rg_row_24b;
      RadioGroup rgRow24b = rootView.findViewById(id);
      if (rgRow24b == null) {
        break missingId;
      }

      id = R.id.textView_row_24;
      TextView textViewRow24 = rootView.findViewById(id);
      if (textViewRow24 == null) {
        break missingId;
      }

      return new BriefingRadiotextRow24Binding((LinearLayout) rootView, radioButtonNo24a,
          radioButtonNo24b, radioButtonYes24a, radioButtonYes24b, rgRow24a, rgRow24b,
          textViewRow24);
    }
    String missingId = rootView.getResources().getResourceName(id);
    throw new NullPointerException("Missing required view with ID: ".concat(missingId));
  }
}