// Generated by view binder compiler. Do not edit!
package com.app.ps19.elecapp.databinding;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.viewbinding.ViewBinding;
import com.app.ps19.elecapp.R;
import java.lang.NullPointerException;
import java.lang.Override;
import java.lang.String;

public final class BriefingRowChildBinding implements ViewBinding {
  @NonNull
  private final LinearLayout rootView;

  @NonNull
  public final CheckBox checkBox1;

  @NonNull
  public final CheckBox checkBox2;

  @NonNull
  public final CheckBox checkBox3;

  @NonNull
  public final CheckBox checkBox4;

  @NonNull
  public final CheckBox checkBox5;

  @NonNull
  public final EditText date1;

  @NonNull
  public final EditText editText4;

  @NonNull
  public final EditText multiline1;

  @NonNull
  public final EditText time1;

  @NonNull
  public final TextView tvBriefingSimple;

  private BriefingRowChildBinding(@NonNull LinearLayout rootView, @NonNull CheckBox checkBox1,
      @NonNull CheckBox checkBox2, @NonNull CheckBox checkBox3, @NonNull CheckBox checkBox4,
      @NonNull CheckBox checkBox5, @NonNull EditText date1, @NonNull EditText editText4,
      @NonNull EditText multiline1, @NonNull EditText time1, @NonNull TextView tvBriefingSimple) {
    this.rootView = rootView;
    this.checkBox1 = checkBox1;
    this.checkBox2 = checkBox2;
    this.checkBox3 = checkBox3;
    this.checkBox4 = checkBox4;
    this.checkBox5 = checkBox5;
    this.date1 = date1;
    this.editText4 = editText4;
    this.multiline1 = multiline1;
    this.time1 = time1;
    this.tvBriefingSimple = tvBriefingSimple;
  }

  @Override
  @NonNull
  public LinearLayout getRoot() {
    return rootView;
  }

  @NonNull
  public static BriefingRowChildBinding inflate(@NonNull LayoutInflater inflater) {
    return inflate(inflater, null, false);
  }

  @NonNull
  public static BriefingRowChildBinding inflate(@NonNull LayoutInflater inflater,
      @Nullable ViewGroup parent, boolean attachToParent) {
    View root = inflater.inflate(R.layout.briefing_row_child, parent, false);
    if (attachToParent) {
      parent.addView(root);
    }
    return bind(root);
  }

  @NonNull
  public static BriefingRowChildBinding bind(@NonNull View rootView) {
    // The body of this method is generated in a way you would not otherwise write.
    // This is done to optimize the compiled bytecode for size and performance.
    int id;
    missingId: {
      id = R.id.checkBox_1;
      CheckBox checkBox1 = rootView.findViewById(id);
      if (checkBox1 == null) {
        break missingId;
      }

      id = R.id.checkBox_2;
      CheckBox checkBox2 = rootView.findViewById(id);
      if (checkBox2 == null) {
        break missingId;
      }

      id = R.id.checkBox_3;
      CheckBox checkBox3 = rootView.findViewById(id);
      if (checkBox3 == null) {
        break missingId;
      }

      id = R.id.checkBox_4;
      CheckBox checkBox4 = rootView.findViewById(id);
      if (checkBox4 == null) {
        break missingId;
      }

      id = R.id.checkBox_5;
      CheckBox checkBox5 = rootView.findViewById(id);
      if (checkBox5 == null) {
        break missingId;
      }

      id = R.id.date_1;
      EditText date1 = rootView.findViewById(id);
      if (date1 == null) {
        break missingId;
      }

      id = R.id.editText4;
      EditText editText4 = rootView.findViewById(id);
      if (editText4 == null) {
        break missingId;
      }

      id = R.id.multiline_1;
      EditText multiline1 = rootView.findViewById(id);
      if (multiline1 == null) {
        break missingId;
      }

      id = R.id.time_1;
      EditText time1 = rootView.findViewById(id);
      if (time1 == null) {
        break missingId;
      }

      id = R.id.tv_briefing_simple;
      TextView tvBriefingSimple = rootView.findViewById(id);
      if (tvBriefingSimple == null) {
        break missingId;
      }

      return new BriefingRowChildBinding((LinearLayout) rootView, checkBox1, checkBox2, checkBox3,
          checkBox4, checkBox5, date1, editText4, multiline1, time1, tvBriefingSimple);
    }
    String missingId = rootView.getResources().getResourceName(id);
    throw new NullPointerException("Missing required view with ID: ".concat(missingId));
  }
}