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

public final class BriefingTextviewRow23Binding implements ViewBinding {
  @NonNull
  private final LinearLayout rootView;

  @NonNull
  public final TextView textViewRow231;

  @NonNull
  public final TextView textViewRow232;

  @NonNull
  public final TextView textViewRow233;

  @NonNull
  public final TextView textViewRow234;

  private BriefingTextviewRow23Binding(@NonNull LinearLayout rootView,
      @NonNull TextView textViewRow231, @NonNull TextView textViewRow232,
      @NonNull TextView textViewRow233, @NonNull TextView textViewRow234) {
    this.rootView = rootView;
    this.textViewRow231 = textViewRow231;
    this.textViewRow232 = textViewRow232;
    this.textViewRow233 = textViewRow233;
    this.textViewRow234 = textViewRow234;
  }

  @Override
  @NonNull
  public LinearLayout getRoot() {
    return rootView;
  }

  @NonNull
  public static BriefingTextviewRow23Binding inflate(@NonNull LayoutInflater inflater) {
    return inflate(inflater, null, false);
  }

  @NonNull
  public static BriefingTextviewRow23Binding inflate(@NonNull LayoutInflater inflater,
      @Nullable ViewGroup parent, boolean attachToParent) {
    View root = inflater.inflate(R.layout.briefing_textview_row_23, parent, false);
    if (attachToParent) {
      parent.addView(root);
    }
    return bind(root);
  }

  @NonNull
  public static BriefingTextviewRow23Binding bind(@NonNull View rootView) {
    // The body of this method is generated in a way you would not otherwise write.
    // This is done to optimize the compiled bytecode for size and performance.
    int id;
    missingId: {
      id = R.id.textView_row_231;
      TextView textViewRow231 = rootView.findViewById(id);
      if (textViewRow231 == null) {
        break missingId;
      }

      id = R.id.textView_row_232;
      TextView textViewRow232 = rootView.findViewById(id);
      if (textViewRow232 == null) {
        break missingId;
      }

      id = R.id.textView_row_233;
      TextView textViewRow233 = rootView.findViewById(id);
      if (textViewRow233 == null) {
        break missingId;
      }

      id = R.id.textView_row_234;
      TextView textViewRow234 = rootView.findViewById(id);
      if (textViewRow234 == null) {
        break missingId;
      }

      return new BriefingTextviewRow23Binding((LinearLayout) rootView, textViewRow231,
          textViewRow232, textViewRow233, textViewRow234);
    }
    String missingId = rootView.getResources().getResourceName(id);
    throw new NullPointerException("Missing required view with ID: ".concat(missingId));
  }
}