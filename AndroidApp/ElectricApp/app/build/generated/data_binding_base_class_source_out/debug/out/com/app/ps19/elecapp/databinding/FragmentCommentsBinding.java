// Generated by view binder compiler. Do not edit!
package com.app.ps19.elecapp.databinding;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.viewbinding.ViewBinding;
import com.app.ps19.elecapp.R;
import java.lang.NullPointerException;
import java.lang.Override;
import java.lang.String;

public final class FragmentCommentsBinding implements ViewBinding {
  @NonNull
  private final LinearLayout rootView;

  @NonNull
  public final Button btSaveComments;

  @NonNull
  public final EditText etComments;

  @NonNull
  public final ImageButton ibCommentAddSignature;

  @NonNull
  public final Button ibCommentSignatureDelete;

  @NonNull
  public final Button ibCommentSignatureRetake;

  @NonNull
  public final ImageView ivCommentSignatureDisplay;

  @NonNull
  public final RelativeLayout rlActions;

  @NonNull
  public final TextView tvSignTitle;

  @NonNull
  public final View view1;

  private FragmentCommentsBinding(@NonNull LinearLayout rootView, @NonNull Button btSaveComments,
      @NonNull EditText etComments, @NonNull ImageButton ibCommentAddSignature,
      @NonNull Button ibCommentSignatureDelete, @NonNull Button ibCommentSignatureRetake,
      @NonNull ImageView ivCommentSignatureDisplay, @NonNull RelativeLayout rlActions,
      @NonNull TextView tvSignTitle, @NonNull View view1) {
    this.rootView = rootView;
    this.btSaveComments = btSaveComments;
    this.etComments = etComments;
    this.ibCommentAddSignature = ibCommentAddSignature;
    this.ibCommentSignatureDelete = ibCommentSignatureDelete;
    this.ibCommentSignatureRetake = ibCommentSignatureRetake;
    this.ivCommentSignatureDisplay = ivCommentSignatureDisplay;
    this.rlActions = rlActions;
    this.tvSignTitle = tvSignTitle;
    this.view1 = view1;
  }

  @Override
  @NonNull
  public LinearLayout getRoot() {
    return rootView;
  }

  @NonNull
  public static FragmentCommentsBinding inflate(@NonNull LayoutInflater inflater) {
    return inflate(inflater, null, false);
  }

  @NonNull
  public static FragmentCommentsBinding inflate(@NonNull LayoutInflater inflater,
      @Nullable ViewGroup parent, boolean attachToParent) {
    View root = inflater.inflate(R.layout.fragment_comments, parent, false);
    if (attachToParent) {
      parent.addView(root);
    }
    return bind(root);
  }

  @NonNull
  public static FragmentCommentsBinding bind(@NonNull View rootView) {
    // The body of this method is generated in a way you would not otherwise write.
    // This is done to optimize the compiled bytecode for size and performance.
    int id;
    missingId: {
      id = R.id.bt_save_comments;
      Button btSaveComments = rootView.findViewById(id);
      if (btSaveComments == null) {
        break missingId;
      }

      id = R.id.et_comments;
      EditText etComments = rootView.findViewById(id);
      if (etComments == null) {
        break missingId;
      }

      id = R.id.ib_comment_add_signature;
      ImageButton ibCommentAddSignature = rootView.findViewById(id);
      if (ibCommentAddSignature == null) {
        break missingId;
      }

      id = R.id.ib_comment_signature_delete;
      Button ibCommentSignatureDelete = rootView.findViewById(id);
      if (ibCommentSignatureDelete == null) {
        break missingId;
      }

      id = R.id.ib_comment_signature_retake;
      Button ibCommentSignatureRetake = rootView.findViewById(id);
      if (ibCommentSignatureRetake == null) {
        break missingId;
      }

      id = R.id.iv_comment_signature_display;
      ImageView ivCommentSignatureDisplay = rootView.findViewById(id);
      if (ivCommentSignatureDisplay == null) {
        break missingId;
      }

      id = R.id.rl_actions;
      RelativeLayout rlActions = rootView.findViewById(id);
      if (rlActions == null) {
        break missingId;
      }

      id = R.id.tv_sign_title;
      TextView tvSignTitle = rootView.findViewById(id);
      if (tvSignTitle == null) {
        break missingId;
      }

      id = R.id.view1;
      View view1 = rootView.findViewById(id);
      if (view1 == null) {
        break missingId;
      }

      return new FragmentCommentsBinding((LinearLayout) rootView, btSaveComments, etComments,
          ibCommentAddSignature, ibCommentSignatureDelete, ibCommentSignatureRetake,
          ivCommentSignatureDisplay, rlActions, tvSignTitle, view1);
    }
    String missingId = rootView.getResources().getResourceName(id);
    throw new NullPointerException("Missing required view with ID: ".concat(missingId));
  }
}