// Generated by view binder compiler. Do not edit!
package com.app.ps19.elecapp.databinding;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.viewbinding.ViewBinding;
import com.app.ps19.elecapp.R;
import java.lang.NullPointerException;
import java.lang.Override;
import java.lang.String;

public final class WorkerRowChildBinding implements ViewBinding {
  @NonNull
  private final RelativeLayout rootView;

  @NonNull
  public final Button ibWorkerDelete;

  @NonNull
  public final Button ibWorkerEdit;

  @NonNull
  public final ImageView ivWorkerSignatureDisplay;

  @NonNull
  public final TextView tvSig;

  private WorkerRowChildBinding(@NonNull RelativeLayout rootView, @NonNull Button ibWorkerDelete,
      @NonNull Button ibWorkerEdit, @NonNull ImageView ivWorkerSignatureDisplay,
      @NonNull TextView tvSig) {
    this.rootView = rootView;
    this.ibWorkerDelete = ibWorkerDelete;
    this.ibWorkerEdit = ibWorkerEdit;
    this.ivWorkerSignatureDisplay = ivWorkerSignatureDisplay;
    this.tvSig = tvSig;
  }

  @Override
  @NonNull
  public RelativeLayout getRoot() {
    return rootView;
  }

  @NonNull
  public static WorkerRowChildBinding inflate(@NonNull LayoutInflater inflater) {
    return inflate(inflater, null, false);
  }

  @NonNull
  public static WorkerRowChildBinding inflate(@NonNull LayoutInflater inflater,
      @Nullable ViewGroup parent, boolean attachToParent) {
    View root = inflater.inflate(R.layout.worker_row_child, parent, false);
    if (attachToParent) {
      parent.addView(root);
    }
    return bind(root);
  }

  @NonNull
  public static WorkerRowChildBinding bind(@NonNull View rootView) {
    // The body of this method is generated in a way you would not otherwise write.
    // This is done to optimize the compiled bytecode for size and performance.
    int id;
    missingId: {
      id = R.id.ib_worker_delete;
      Button ibWorkerDelete = rootView.findViewById(id);
      if (ibWorkerDelete == null) {
        break missingId;
      }

      id = R.id.ib_worker_edit;
      Button ibWorkerEdit = rootView.findViewById(id);
      if (ibWorkerEdit == null) {
        break missingId;
      }

      id = R.id.iv_worker_signature_display;
      ImageView ivWorkerSignatureDisplay = rootView.findViewById(id);
      if (ivWorkerSignatureDisplay == null) {
        break missingId;
      }

      id = R.id.tv_sig;
      TextView tvSig = rootView.findViewById(id);
      if (tvSig == null) {
        break missingId;
      }

      return new WorkerRowChildBinding((RelativeLayout) rootView, ibWorkerDelete, ibWorkerEdit,
          ivWorkerSignatureDisplay, tvSig);
    }
    String missingId = rootView.getResources().getResourceName(id);
    throw new NullPointerException("Missing required view with ID: ".concat(missingId));
  }
}