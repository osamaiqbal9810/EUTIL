// Generated by view binder compiler. Do not edit!
package com.app.ps19.elecapp.databinding;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.LinearLayout;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.viewbinding.ViewBinding;
import com.app.ps19.elecapp.R;
import java.lang.NullPointerException;
import java.lang.Override;
import java.lang.String;

public final class BriefingDescriptionRow4Binding implements ViewBinding {
  @NonNull
  private final LinearLayout rootView;

  @NonNull
  public final EditText edRow4;

  private BriefingDescriptionRow4Binding(@NonNull LinearLayout rootView, @NonNull EditText edRow4) {
    this.rootView = rootView;
    this.edRow4 = edRow4;
  }

  @Override
  @NonNull
  public LinearLayout getRoot() {
    return rootView;
  }

  @NonNull
  public static BriefingDescriptionRow4Binding inflate(@NonNull LayoutInflater inflater) {
    return inflate(inflater, null, false);
  }

  @NonNull
  public static BriefingDescriptionRow4Binding inflate(@NonNull LayoutInflater inflater,
      @Nullable ViewGroup parent, boolean attachToParent) {
    View root = inflater.inflate(R.layout.briefing_description_row_4, parent, false);
    if (attachToParent) {
      parent.addView(root);
    }
    return bind(root);
  }

  @NonNull
  public static BriefingDescriptionRow4Binding bind(@NonNull View rootView) {
    // The body of this method is generated in a way you would not otherwise write.
    // This is done to optimize the compiled bytecode for size and performance.
    int id;
    missingId: {
      id = R.id.ed_row_4;
      EditText edRow4 = rootView.findViewById(id);
      if (edRow4 == null) {
        break missingId;
      }

      return new BriefingDescriptionRow4Binding((LinearLayout) rootView, edRow4);
    }
    String missingId = rootView.getResources().getResourceName(id);
    throw new NullPointerException("Missing required view with ID: ".concat(missingId));
  }
}