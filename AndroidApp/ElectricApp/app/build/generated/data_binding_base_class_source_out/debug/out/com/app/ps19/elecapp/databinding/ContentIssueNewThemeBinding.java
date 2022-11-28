// Generated by view binder compiler. Do not edit!
package com.app.ps19.elecapp.databinding;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.Switch;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.recyclerview.widget.RecyclerView;
import androidx.viewbinding.ViewBinding;
import com.app.ps19.elecapp.R;
import java.lang.NullPointerException;
import java.lang.Override;
import java.lang.String;

public final class ContentIssueNewThemeBinding implements ViewBinding {
  @NonNull
  private final ConstraintLayout rootView;

  @NonNull
  public final TextView assetTypeTxt;

  @NonNull
  public final TextView btnCheckList;

  @NonNull
  public final ImageButton btnSpeak;

  @NonNull
  public final ImageButton btnVoiceRecord;

  @NonNull
  public final ImageButton captureBtn;

  @NonNull
  public final CheckBox cbDeficiency;

  @NonNull
  public final CheckBox cbRule;

  @NonNull
  public final EditText edLocationInfo;

  @NonNull
  public final EditText edSpeedRestriction;

  @NonNull
  public final EditText edVoiceInfo;

  @NonNull
  public final EditText etMarkerEnd;

  @NonNull
  public final EditText etMarkerStart;

  @NonNull
  public final EditText etMpEnd;

  @NonNull
  public final EditText etMpStart;

  @NonNull
  public final EditText etTitle;

  @NonNull
  public final RecyclerView horizontalRecyclerView;

  @NonNull
  public final ImageButton ibtnCaptureAfterFix;

  @NonNull
  public final ImageButton ibtnCaptureAfterFixOld;

  @NonNull
  public final ImageView ivActionTypeTitle;

  @NonNull
  public final ImageView ivDefectTitle;

  @NonNull
  public final ImageView ivDescTitle;

  @NonNull
  public final ImageView ivFixedTitle;

  @NonNull
  public final ImageView ivIssueTitle;

  @NonNull
  public final ImageView ivLocationTitle;

  @NonNull
  public final ImageView ivMilepostTitle;

  @NonNull
  public final ImageView ivPicturesTitle;

  @NonNull
  public final ImageView ivPriTitle;

  @NonNull
  public final ImageView ivRemedialActionTitle;

  @NonNull
  public final ImageView ivRuleTitle;

  @NonNull
  public final ImageView ivVoicesTitle;

  @NonNull
  public final LinearLayout llActionType;

  @NonNull
  public final LinearLayout llApplyRule;

  @NonNull
  public final LinearLayout llDefCounter;

  @NonNull
  public final LinearLayout llDefDivider;

  @NonNull
  public final LinearLayout llFixOld;

  @NonNull
  public final LinearLayout llFixedSwitchOld;

  @NonNull
  public final LinearLayout llLocationInfoMainContainer;

  @NonNull
  public final LinearLayout llLocationInfoOptional;

  @NonNull
  public final LinearLayout llMarkerContainer;

  @NonNull
  public final LinearLayout llMarkerEnd;

  @NonNull
  public final LinearLayout llMarkerStart;

  @NonNull
  public final LinearLayout llMpContainer;

  @NonNull
  public final LinearLayout llMpEnd;

  @NonNull
  public final LinearLayout llMpStart;

  @NonNull
  public final LinearLayout llPriority;

  @NonNull
  public final LinearLayout llRailDirectionContainer;

  @NonNull
  public final LinearLayout llRemedialAction;

  @NonNull
  public final LinearLayout llTempSpeedRestriction;

  @NonNull
  public final LinearLayout llVoiceInfoOptional;

  @NonNull
  public final LinearLayout lyPictures;

  @NonNull
  public final LinearLayout lyPicturesAfterFix;

  @NonNull
  public final LinearLayout lyPicturesAfterFixOld;

  @NonNull
  public final LinearLayout lyVoice;

  @NonNull
  public final Switch markedSwitch;

  @NonNull
  public final Spinner prioritySpinner;

  @NonNull
  public final RadioButton rbActionClass1;

  @NonNull
  public final RadioButton rbActionClass2;

  @NonNull
  public final RadioButton rbActionClass3;

  @NonNull
  public final RadioButton rbActionIr;

  @NonNull
  public final RadioButton rbActionOos;

  @NonNull
  public final RadioButton rbPermanentFix;

  @NonNull
  public final RadioButton rbTempFix;

  @NonNull
  public final RecyclerView recyclerPicsAfterFix;

  @NonNull
  public final RecyclerView recyclerPicsAfterFixOld;

  @NonNull
  public final LinearLayout remedialActionsForm;

  @NonNull
  public final EditText reportDescriptionTxt;

  @NonNull
  public final RadioGroup rgActionsType;

  @NonNull
  public final RadioGroup rgFixType;

  @NonNull
  public final RelativeLayout rlActionTypeTitle;

  @NonNull
  public final RelativeLayout rlApplyRuleTitle;

  @NonNull
  public final RelativeLayout rlFixedTitleOld;

  @NonNull
  public final RelativeLayout rlLocationInfoTitle;

  @NonNull
  public final RelativeLayout rlLocationTitle;

  @NonNull
  public final RelativeLayout rlPriorityTitle;

  @NonNull
  public final RelativeLayout rlRemedialTitle;

  @NonNull
  public final RecyclerView rvVoice;

  @NonNull
  public final Button saveBtn;

  @NonNull
  public final Spinner spMarkerEnd;

  @NonNull
  public final Spinner spMarkerStart;

  @NonNull
  public final Spinner spRailDirection;

  @NonNull
  public final Spinner spinnerRemedialActions;

  @NonNull
  public final TextView textView15;

  @NonNull
  public final TextView textView16;

  @NonNull
  public final TextView textView19;

  @NonNull
  public final TextView textView22;

  @NonNull
  public final TextView textView23;

  @NonNull
  public final TextView textView3;

  @NonNull
  public final TextView tvActionsType;

  @NonNull
  public final TextView tvApplyRuleTitle;

  @NonNull
  public final TextView tvDefectSelectCount;

  @NonNull
  public final TextView tvDefectTitle;

  @NonNull
  public final TextView tvDefectTotalCount;

  @NonNull
  public final TextView tvFixedHeading;

  @NonNull
  public final TextView tvMileHeading;

  @NonNull
  public final TextView tvPicHeading;

  @NonNull
  public final TextView tvPicHeadingAfterFix;

  @NonNull
  public final TextView tvPicHeadingAfterFixOld;

  @NonNull
  public final TextView tvRemedialActions;

  @NonNull
  public final TextView tvReportAssetSelectionName;

  @NonNull
  public final TextView tvTables;

  @NonNull
  public final TextView tvTitleMarkerEnd;

  @NonNull
  public final TextView tvTitleMarkerStart;

  @NonNull
  public final TextView tvTitleMpEnd;

  @NonNull
  public final TextView tvTitleMpStart;

  @NonNull
  public final TextView tvVoiceHeading;

  private ContentIssueNewThemeBinding(@NonNull ConstraintLayout rootView,
      @NonNull TextView assetTypeTxt, @NonNull TextView btnCheckList, @NonNull ImageButton btnSpeak,
      @NonNull ImageButton btnVoiceRecord, @NonNull ImageButton captureBtn,
      @NonNull CheckBox cbDeficiency, @NonNull CheckBox cbRule, @NonNull EditText edLocationInfo,
      @NonNull EditText edSpeedRestriction, @NonNull EditText edVoiceInfo,
      @NonNull EditText etMarkerEnd, @NonNull EditText etMarkerStart, @NonNull EditText etMpEnd,
      @NonNull EditText etMpStart, @NonNull EditText etTitle,
      @NonNull RecyclerView horizontalRecyclerView, @NonNull ImageButton ibtnCaptureAfterFix,
      @NonNull ImageButton ibtnCaptureAfterFixOld, @NonNull ImageView ivActionTypeTitle,
      @NonNull ImageView ivDefectTitle, @NonNull ImageView ivDescTitle,
      @NonNull ImageView ivFixedTitle, @NonNull ImageView ivIssueTitle,
      @NonNull ImageView ivLocationTitle, @NonNull ImageView ivMilepostTitle,
      @NonNull ImageView ivPicturesTitle, @NonNull ImageView ivPriTitle,
      @NonNull ImageView ivRemedialActionTitle, @NonNull ImageView ivRuleTitle,
      @NonNull ImageView ivVoicesTitle, @NonNull LinearLayout llActionType,
      @NonNull LinearLayout llApplyRule, @NonNull LinearLayout llDefCounter,
      @NonNull LinearLayout llDefDivider, @NonNull LinearLayout llFixOld,
      @NonNull LinearLayout llFixedSwitchOld, @NonNull LinearLayout llLocationInfoMainContainer,
      @NonNull LinearLayout llLocationInfoOptional, @NonNull LinearLayout llMarkerContainer,
      @NonNull LinearLayout llMarkerEnd, @NonNull LinearLayout llMarkerStart,
      @NonNull LinearLayout llMpContainer, @NonNull LinearLayout llMpEnd,
      @NonNull LinearLayout llMpStart, @NonNull LinearLayout llPriority,
      @NonNull LinearLayout llRailDirectionContainer, @NonNull LinearLayout llRemedialAction,
      @NonNull LinearLayout llTempSpeedRestriction, @NonNull LinearLayout llVoiceInfoOptional,
      @NonNull LinearLayout lyPictures, @NonNull LinearLayout lyPicturesAfterFix,
      @NonNull LinearLayout lyPicturesAfterFixOld, @NonNull LinearLayout lyVoice,
      @NonNull Switch markedSwitch, @NonNull Spinner prioritySpinner,
      @NonNull RadioButton rbActionClass1, @NonNull RadioButton rbActionClass2,
      @NonNull RadioButton rbActionClass3, @NonNull RadioButton rbActionIr,
      @NonNull RadioButton rbActionOos, @NonNull RadioButton rbPermanentFix,
      @NonNull RadioButton rbTempFix, @NonNull RecyclerView recyclerPicsAfterFix,
      @NonNull RecyclerView recyclerPicsAfterFixOld, @NonNull LinearLayout remedialActionsForm,
      @NonNull EditText reportDescriptionTxt, @NonNull RadioGroup rgActionsType,
      @NonNull RadioGroup rgFixType, @NonNull RelativeLayout rlActionTypeTitle,
      @NonNull RelativeLayout rlApplyRuleTitle, @NonNull RelativeLayout rlFixedTitleOld,
      @NonNull RelativeLayout rlLocationInfoTitle, @NonNull RelativeLayout rlLocationTitle,
      @NonNull RelativeLayout rlPriorityTitle, @NonNull RelativeLayout rlRemedialTitle,
      @NonNull RecyclerView rvVoice, @NonNull Button saveBtn, @NonNull Spinner spMarkerEnd,
      @NonNull Spinner spMarkerStart, @NonNull Spinner spRailDirection,
      @NonNull Spinner spinnerRemedialActions, @NonNull TextView textView15,
      @NonNull TextView textView16, @NonNull TextView textView19, @NonNull TextView textView22,
      @NonNull TextView textView23, @NonNull TextView textView3, @NonNull TextView tvActionsType,
      @NonNull TextView tvApplyRuleTitle, @NonNull TextView tvDefectSelectCount,
      @NonNull TextView tvDefectTitle, @NonNull TextView tvDefectTotalCount,
      @NonNull TextView tvFixedHeading, @NonNull TextView tvMileHeading,
      @NonNull TextView tvPicHeading, @NonNull TextView tvPicHeadingAfterFix,
      @NonNull TextView tvPicHeadingAfterFixOld, @NonNull TextView tvRemedialActions,
      @NonNull TextView tvReportAssetSelectionName, @NonNull TextView tvTables,
      @NonNull TextView tvTitleMarkerEnd, @NonNull TextView tvTitleMarkerStart,
      @NonNull TextView tvTitleMpEnd, @NonNull TextView tvTitleMpStart,
      @NonNull TextView tvVoiceHeading) {
    this.rootView = rootView;
    this.assetTypeTxt = assetTypeTxt;
    this.btnCheckList = btnCheckList;
    this.btnSpeak = btnSpeak;
    this.btnVoiceRecord = btnVoiceRecord;
    this.captureBtn = captureBtn;
    this.cbDeficiency = cbDeficiency;
    this.cbRule = cbRule;
    this.edLocationInfo = edLocationInfo;
    this.edSpeedRestriction = edSpeedRestriction;
    this.edVoiceInfo = edVoiceInfo;
    this.etMarkerEnd = etMarkerEnd;
    this.etMarkerStart = etMarkerStart;
    this.etMpEnd = etMpEnd;
    this.etMpStart = etMpStart;
    this.etTitle = etTitle;
    this.horizontalRecyclerView = horizontalRecyclerView;
    this.ibtnCaptureAfterFix = ibtnCaptureAfterFix;
    this.ibtnCaptureAfterFixOld = ibtnCaptureAfterFixOld;
    this.ivActionTypeTitle = ivActionTypeTitle;
    this.ivDefectTitle = ivDefectTitle;
    this.ivDescTitle = ivDescTitle;
    this.ivFixedTitle = ivFixedTitle;
    this.ivIssueTitle = ivIssueTitle;
    this.ivLocationTitle = ivLocationTitle;
    this.ivMilepostTitle = ivMilepostTitle;
    this.ivPicturesTitle = ivPicturesTitle;
    this.ivPriTitle = ivPriTitle;
    this.ivRemedialActionTitle = ivRemedialActionTitle;
    this.ivRuleTitle = ivRuleTitle;
    this.ivVoicesTitle = ivVoicesTitle;
    this.llActionType = llActionType;
    this.llApplyRule = llApplyRule;
    this.llDefCounter = llDefCounter;
    this.llDefDivider = llDefDivider;
    this.llFixOld = llFixOld;
    this.llFixedSwitchOld = llFixedSwitchOld;
    this.llLocationInfoMainContainer = llLocationInfoMainContainer;
    this.llLocationInfoOptional = llLocationInfoOptional;
    this.llMarkerContainer = llMarkerContainer;
    this.llMarkerEnd = llMarkerEnd;
    this.llMarkerStart = llMarkerStart;
    this.llMpContainer = llMpContainer;
    this.llMpEnd = llMpEnd;
    this.llMpStart = llMpStart;
    this.llPriority = llPriority;
    this.llRailDirectionContainer = llRailDirectionContainer;
    this.llRemedialAction = llRemedialAction;
    this.llTempSpeedRestriction = llTempSpeedRestriction;
    this.llVoiceInfoOptional = llVoiceInfoOptional;
    this.lyPictures = lyPictures;
    this.lyPicturesAfterFix = lyPicturesAfterFix;
    this.lyPicturesAfterFixOld = lyPicturesAfterFixOld;
    this.lyVoice = lyVoice;
    this.markedSwitch = markedSwitch;
    this.prioritySpinner = prioritySpinner;
    this.rbActionClass1 = rbActionClass1;
    this.rbActionClass2 = rbActionClass2;
    this.rbActionClass3 = rbActionClass3;
    this.rbActionIr = rbActionIr;
    this.rbActionOos = rbActionOos;
    this.rbPermanentFix = rbPermanentFix;
    this.rbTempFix = rbTempFix;
    this.recyclerPicsAfterFix = recyclerPicsAfterFix;
    this.recyclerPicsAfterFixOld = recyclerPicsAfterFixOld;
    this.remedialActionsForm = remedialActionsForm;
    this.reportDescriptionTxt = reportDescriptionTxt;
    this.rgActionsType = rgActionsType;
    this.rgFixType = rgFixType;
    this.rlActionTypeTitle = rlActionTypeTitle;
    this.rlApplyRuleTitle = rlApplyRuleTitle;
    this.rlFixedTitleOld = rlFixedTitleOld;
    this.rlLocationInfoTitle = rlLocationInfoTitle;
    this.rlLocationTitle = rlLocationTitle;
    this.rlPriorityTitle = rlPriorityTitle;
    this.rlRemedialTitle = rlRemedialTitle;
    this.rvVoice = rvVoice;
    this.saveBtn = saveBtn;
    this.spMarkerEnd = spMarkerEnd;
    this.spMarkerStart = spMarkerStart;
    this.spRailDirection = spRailDirection;
    this.spinnerRemedialActions = spinnerRemedialActions;
    this.textView15 = textView15;
    this.textView16 = textView16;
    this.textView19 = textView19;
    this.textView22 = textView22;
    this.textView23 = textView23;
    this.textView3 = textView3;
    this.tvActionsType = tvActionsType;
    this.tvApplyRuleTitle = tvApplyRuleTitle;
    this.tvDefectSelectCount = tvDefectSelectCount;
    this.tvDefectTitle = tvDefectTitle;
    this.tvDefectTotalCount = tvDefectTotalCount;
    this.tvFixedHeading = tvFixedHeading;
    this.tvMileHeading = tvMileHeading;
    this.tvPicHeading = tvPicHeading;
    this.tvPicHeadingAfterFix = tvPicHeadingAfterFix;
    this.tvPicHeadingAfterFixOld = tvPicHeadingAfterFixOld;
    this.tvRemedialActions = tvRemedialActions;
    this.tvReportAssetSelectionName = tvReportAssetSelectionName;
    this.tvTables = tvTables;
    this.tvTitleMarkerEnd = tvTitleMarkerEnd;
    this.tvTitleMarkerStart = tvTitleMarkerStart;
    this.tvTitleMpEnd = tvTitleMpEnd;
    this.tvTitleMpStart = tvTitleMpStart;
    this.tvVoiceHeading = tvVoiceHeading;
  }

  @Override
  @NonNull
  public ConstraintLayout getRoot() {
    return rootView;
  }

  @NonNull
  public static ContentIssueNewThemeBinding inflate(@NonNull LayoutInflater inflater) {
    return inflate(inflater, null, false);
  }

  @NonNull
  public static ContentIssueNewThemeBinding inflate(@NonNull LayoutInflater inflater,
      @Nullable ViewGroup parent, boolean attachToParent) {
    View root = inflater.inflate(R.layout.content_issue_new_theme, parent, false);
    if (attachToParent) {
      parent.addView(root);
    }
    return bind(root);
  }

  @NonNull
  public static ContentIssueNewThemeBinding bind(@NonNull View rootView) {
    // The body of this method is generated in a way you would not otherwise write.
    // This is done to optimize the compiled bytecode for size and performance.
    int id;
    missingId: {
      id = R.id.assetTypeTxt;
      TextView assetTypeTxt = rootView.findViewById(id);
      if (assetTypeTxt == null) {
        break missingId;
      }

      id = R.id.btnCheckList;
      TextView btnCheckList = rootView.findViewById(id);
      if (btnCheckList == null) {
        break missingId;
      }

      id = R.id.btn_speak;
      ImageButton btnSpeak = rootView.findViewById(id);
      if (btnSpeak == null) {
        break missingId;
      }

      id = R.id.btn_voice_record;
      ImageButton btnVoiceRecord = rootView.findViewById(id);
      if (btnVoiceRecord == null) {
        break missingId;
      }

      id = R.id.captureBtn;
      ImageButton captureBtn = rootView.findViewById(id);
      if (captureBtn == null) {
        break missingId;
      }

      id = R.id.cb_deficiency;
      CheckBox cbDeficiency = rootView.findViewById(id);
      if (cbDeficiency == null) {
        break missingId;
      }

      id = R.id.cb_rule;
      CheckBox cbRule = rootView.findViewById(id);
      if (cbRule == null) {
        break missingId;
      }

      id = R.id.ed_location_info;
      EditText edLocationInfo = rootView.findViewById(id);
      if (edLocationInfo == null) {
        break missingId;
      }

      id = R.id.ed_speed_restriction;
      EditText edSpeedRestriction = rootView.findViewById(id);
      if (edSpeedRestriction == null) {
        break missingId;
      }

      id = R.id.ed_voice_info;
      EditText edVoiceInfo = rootView.findViewById(id);
      if (edVoiceInfo == null) {
        break missingId;
      }

      id = R.id.et_marker_end;
      EditText etMarkerEnd = rootView.findViewById(id);
      if (etMarkerEnd == null) {
        break missingId;
      }

      id = R.id.et_marker_start;
      EditText etMarkerStart = rootView.findViewById(id);
      if (etMarkerStart == null) {
        break missingId;
      }

      id = R.id.et_mp_end;
      EditText etMpEnd = rootView.findViewById(id);
      if (etMpEnd == null) {
        break missingId;
      }

      id = R.id.et_mp_start;
      EditText etMpStart = rootView.findViewById(id);
      if (etMpStart == null) {
        break missingId;
      }

      id = R.id.et_title;
      EditText etTitle = rootView.findViewById(id);
      if (etTitle == null) {
        break missingId;
      }

      id = R.id.horizontal_recycler_view;
      RecyclerView horizontalRecyclerView = rootView.findViewById(id);
      if (horizontalRecyclerView == null) {
        break missingId;
      }

      id = R.id.ibtn_capture_after_fix;
      ImageButton ibtnCaptureAfterFix = rootView.findViewById(id);
      if (ibtnCaptureAfterFix == null) {
        break missingId;
      }

      id = R.id.ibtn_capture_after_fix_old;
      ImageButton ibtnCaptureAfterFixOld = rootView.findViewById(id);
      if (ibtnCaptureAfterFixOld == null) {
        break missingId;
      }

      id = R.id.iv_action_type_title;
      ImageView ivActionTypeTitle = rootView.findViewById(id);
      if (ivActionTypeTitle == null) {
        break missingId;
      }

      id = R.id.iv_defect_title;
      ImageView ivDefectTitle = rootView.findViewById(id);
      if (ivDefectTitle == null) {
        break missingId;
      }

      id = R.id.iv_desc_title;
      ImageView ivDescTitle = rootView.findViewById(id);
      if (ivDescTitle == null) {
        break missingId;
      }

      id = R.id.iv_fixed_title;
      ImageView ivFixedTitle = rootView.findViewById(id);
      if (ivFixedTitle == null) {
        break missingId;
      }

      id = R.id.iv_issue_title;
      ImageView ivIssueTitle = rootView.findViewById(id);
      if (ivIssueTitle == null) {
        break missingId;
      }

      id = R.id.iv_location_title;
      ImageView ivLocationTitle = rootView.findViewById(id);
      if (ivLocationTitle == null) {
        break missingId;
      }

      id = R.id.iv_milepost_title;
      ImageView ivMilepostTitle = rootView.findViewById(id);
      if (ivMilepostTitle == null) {
        break missingId;
      }

      id = R.id.iv_pictures_title;
      ImageView ivPicturesTitle = rootView.findViewById(id);
      if (ivPicturesTitle == null) {
        break missingId;
      }

      id = R.id.iv_pri_title;
      ImageView ivPriTitle = rootView.findViewById(id);
      if (ivPriTitle == null) {
        break missingId;
      }

      id = R.id.iv_remedial_action_title;
      ImageView ivRemedialActionTitle = rootView.findViewById(id);
      if (ivRemedialActionTitle == null) {
        break missingId;
      }

      id = R.id.iv_rule_title;
      ImageView ivRuleTitle = rootView.findViewById(id);
      if (ivRuleTitle == null) {
        break missingId;
      }

      id = R.id.iv_voices_title;
      ImageView ivVoicesTitle = rootView.findViewById(id);
      if (ivVoicesTitle == null) {
        break missingId;
      }

      id = R.id.ll_action_type;
      LinearLayout llActionType = rootView.findViewById(id);
      if (llActionType == null) {
        break missingId;
      }

      id = R.id.ll_apply_rule;
      LinearLayout llApplyRule = rootView.findViewById(id);
      if (llApplyRule == null) {
        break missingId;
      }

      id = R.id.ll_def_counter;
      LinearLayout llDefCounter = rootView.findViewById(id);
      if (llDefCounter == null) {
        break missingId;
      }

      id = R.id.ll_def_divider;
      LinearLayout llDefDivider = rootView.findViewById(id);
      if (llDefDivider == null) {
        break missingId;
      }

      id = R.id.ll_fix_old;
      LinearLayout llFixOld = rootView.findViewById(id);
      if (llFixOld == null) {
        break missingId;
      }

      id = R.id.ll_fixed_switch_old;
      LinearLayout llFixedSwitchOld = rootView.findViewById(id);
      if (llFixedSwitchOld == null) {
        break missingId;
      }

      id = R.id.ll_location_info_main_container;
      LinearLayout llLocationInfoMainContainer = rootView.findViewById(id);
      if (llLocationInfoMainContainer == null) {
        break missingId;
      }

      id = R.id.ll_location_info_optional;
      LinearLayout llLocationInfoOptional = rootView.findViewById(id);
      if (llLocationInfoOptional == null) {
        break missingId;
      }

      id = R.id.ll_marker_container;
      LinearLayout llMarkerContainer = rootView.findViewById(id);
      if (llMarkerContainer == null) {
        break missingId;
      }

      id = R.id.ll_marker_end;
      LinearLayout llMarkerEnd = rootView.findViewById(id);
      if (llMarkerEnd == null) {
        break missingId;
      }

      id = R.id.ll_marker_start;
      LinearLayout llMarkerStart = rootView.findViewById(id);
      if (llMarkerStart == null) {
        break missingId;
      }

      id = R.id.ll_mp_container;
      LinearLayout llMpContainer = rootView.findViewById(id);
      if (llMpContainer == null) {
        break missingId;
      }

      id = R.id.ll_mp_end;
      LinearLayout llMpEnd = rootView.findViewById(id);
      if (llMpEnd == null) {
        break missingId;
      }

      id = R.id.ll_mp_start;
      LinearLayout llMpStart = rootView.findViewById(id);
      if (llMpStart == null) {
        break missingId;
      }

      id = R.id.ll_priority;
      LinearLayout llPriority = rootView.findViewById(id);
      if (llPriority == null) {
        break missingId;
      }

      id = R.id.ll_rail_direction_container;
      LinearLayout llRailDirectionContainer = rootView.findViewById(id);
      if (llRailDirectionContainer == null) {
        break missingId;
      }

      id = R.id.ll_remedial_action;
      LinearLayout llRemedialAction = rootView.findViewById(id);
      if (llRemedialAction == null) {
        break missingId;
      }

      id = R.id.ll_temp_speed_restriction;
      LinearLayout llTempSpeedRestriction = rootView.findViewById(id);
      if (llTempSpeedRestriction == null) {
        break missingId;
      }

      id = R.id.ll_voice_info_optional;
      LinearLayout llVoiceInfoOptional = rootView.findViewById(id);
      if (llVoiceInfoOptional == null) {
        break missingId;
      }

      id = R.id.ly_pictures;
      LinearLayout lyPictures = rootView.findViewById(id);
      if (lyPictures == null) {
        break missingId;
      }

      id = R.id.ly_pictures_after_fix;
      LinearLayout lyPicturesAfterFix = rootView.findViewById(id);
      if (lyPicturesAfterFix == null) {
        break missingId;
      }

      id = R.id.ly_pictures_after_fix_old;
      LinearLayout lyPicturesAfterFixOld = rootView.findViewById(id);
      if (lyPicturesAfterFixOld == null) {
        break missingId;
      }

      id = R.id.ly_voice;
      LinearLayout lyVoice = rootView.findViewById(id);
      if (lyVoice == null) {
        break missingId;
      }

      id = R.id.markedSwitch;
      Switch markedSwitch = rootView.findViewById(id);
      if (markedSwitch == null) {
        break missingId;
      }

      id = R.id.prioritySpinner;
      Spinner prioritySpinner = rootView.findViewById(id);
      if (prioritySpinner == null) {
        break missingId;
      }

      id = R.id.rb_action_class1;
      RadioButton rbActionClass1 = rootView.findViewById(id);
      if (rbActionClass1 == null) {
        break missingId;
      }

      id = R.id.rb_action_class2;
      RadioButton rbActionClass2 = rootView.findViewById(id);
      if (rbActionClass2 == null) {
        break missingId;
      }

      id = R.id.rb_action_class3;
      RadioButton rbActionClass3 = rootView.findViewById(id);
      if (rbActionClass3 == null) {
        break missingId;
      }

      id = R.id.rb_action_ir;
      RadioButton rbActionIr = rootView.findViewById(id);
      if (rbActionIr == null) {
        break missingId;
      }

      id = R.id.rb_action_oos;
      RadioButton rbActionOos = rootView.findViewById(id);
      if (rbActionOos == null) {
        break missingId;
      }

      id = R.id.rb_permanent_fix;
      RadioButton rbPermanentFix = rootView.findViewById(id);
      if (rbPermanentFix == null) {
        break missingId;
      }

      id = R.id.rb_temp_fix;
      RadioButton rbTempFix = rootView.findViewById(id);
      if (rbTempFix == null) {
        break missingId;
      }

      id = R.id.recycler_pics_after_fix;
      RecyclerView recyclerPicsAfterFix = rootView.findViewById(id);
      if (recyclerPicsAfterFix == null) {
        break missingId;
      }

      id = R.id.recycler_pics_after_fix_old;
      RecyclerView recyclerPicsAfterFixOld = rootView.findViewById(id);
      if (recyclerPicsAfterFixOld == null) {
        break missingId;
      }

      id = R.id.remedialActionsForm;
      LinearLayout remedialActionsForm = rootView.findViewById(id);
      if (remedialActionsForm == null) {
        break missingId;
      }

      id = R.id.reportDescriptionTxt;
      EditText reportDescriptionTxt = rootView.findViewById(id);
      if (reportDescriptionTxt == null) {
        break missingId;
      }

      id = R.id.rg_actions_type;
      RadioGroup rgActionsType = rootView.findViewById(id);
      if (rgActionsType == null) {
        break missingId;
      }

      id = R.id.rg_fix_type;
      RadioGroup rgFixType = rootView.findViewById(id);
      if (rgFixType == null) {
        break missingId;
      }

      id = R.id.rl_action_type_title;
      RelativeLayout rlActionTypeTitle = rootView.findViewById(id);
      if (rlActionTypeTitle == null) {
        break missingId;
      }

      id = R.id.rl_apply_rule_title;
      RelativeLayout rlApplyRuleTitle = rootView.findViewById(id);
      if (rlApplyRuleTitle == null) {
        break missingId;
      }

      id = R.id.rl_fixed_title_old;
      RelativeLayout rlFixedTitleOld = rootView.findViewById(id);
      if (rlFixedTitleOld == null) {
        break missingId;
      }

      id = R.id.rl_location_info_title;
      RelativeLayout rlLocationInfoTitle = rootView.findViewById(id);
      if (rlLocationInfoTitle == null) {
        break missingId;
      }

      id = R.id.rl_location_title;
      RelativeLayout rlLocationTitle = rootView.findViewById(id);
      if (rlLocationTitle == null) {
        break missingId;
      }

      id = R.id.rl_priority_title;
      RelativeLayout rlPriorityTitle = rootView.findViewById(id);
      if (rlPriorityTitle == null) {
        break missingId;
      }

      id = R.id.rl_remedial_title;
      RelativeLayout rlRemedialTitle = rootView.findViewById(id);
      if (rlRemedialTitle == null) {
        break missingId;
      }

      id = R.id.rv_voice;
      RecyclerView rvVoice = rootView.findViewById(id);
      if (rvVoice == null) {
        break missingId;
      }

      id = R.id.saveBtn;
      Button saveBtn = rootView.findViewById(id);
      if (saveBtn == null) {
        break missingId;
      }

      id = R.id.sp_marker_end;
      Spinner spMarkerEnd = rootView.findViewById(id);
      if (spMarkerEnd == null) {
        break missingId;
      }

      id = R.id.sp_marker_start;
      Spinner spMarkerStart = rootView.findViewById(id);
      if (spMarkerStart == null) {
        break missingId;
      }

      id = R.id.sp_rail_direction;
      Spinner spRailDirection = rootView.findViewById(id);
      if (spRailDirection == null) {
        break missingId;
      }

      id = R.id.spinnerRemedialActions;
      Spinner spinnerRemedialActions = rootView.findViewById(id);
      if (spinnerRemedialActions == null) {
        break missingId;
      }

      id = R.id.textView15;
      TextView textView15 = rootView.findViewById(id);
      if (textView15 == null) {
        break missingId;
      }

      id = R.id.textView16;
      TextView textView16 = rootView.findViewById(id);
      if (textView16 == null) {
        break missingId;
      }

      id = R.id.textView19;
      TextView textView19 = rootView.findViewById(id);
      if (textView19 == null) {
        break missingId;
      }

      id = R.id.textView22;
      TextView textView22 = rootView.findViewById(id);
      if (textView22 == null) {
        break missingId;
      }

      id = R.id.textView23;
      TextView textView23 = rootView.findViewById(id);
      if (textView23 == null) {
        break missingId;
      }

      id = R.id.textView3;
      TextView textView3 = rootView.findViewById(id);
      if (textView3 == null) {
        break missingId;
      }

      id = R.id.tv_actions_type;
      TextView tvActionsType = rootView.findViewById(id);
      if (tvActionsType == null) {
        break missingId;
      }

      id = R.id.tv_apply_rule_title;
      TextView tvApplyRuleTitle = rootView.findViewById(id);
      if (tvApplyRuleTitle == null) {
        break missingId;
      }

      id = R.id.tv_defect_select_count;
      TextView tvDefectSelectCount = rootView.findViewById(id);
      if (tvDefectSelectCount == null) {
        break missingId;
      }

      id = R.id.tv_defect_title;
      TextView tvDefectTitle = rootView.findViewById(id);
      if (tvDefectTitle == null) {
        break missingId;
      }

      id = R.id.tv_defect_total_count;
      TextView tvDefectTotalCount = rootView.findViewById(id);
      if (tvDefectTotalCount == null) {
        break missingId;
      }

      id = R.id.tv_fixed_heading;
      TextView tvFixedHeading = rootView.findViewById(id);
      if (tvFixedHeading == null) {
        break missingId;
      }

      id = R.id.tv_mile_heading;
      TextView tvMileHeading = rootView.findViewById(id);
      if (tvMileHeading == null) {
        break missingId;
      }

      id = R.id.tv_pic_heading;
      TextView tvPicHeading = rootView.findViewById(id);
      if (tvPicHeading == null) {
        break missingId;
      }

      id = R.id.tv_pic_heading_after_fix;
      TextView tvPicHeadingAfterFix = rootView.findViewById(id);
      if (tvPicHeadingAfterFix == null) {
        break missingId;
      }

      id = R.id.tv_pic_heading_after_fix_old;
      TextView tvPicHeadingAfterFixOld = rootView.findViewById(id);
      if (tvPicHeadingAfterFixOld == null) {
        break missingId;
      }

      id = R.id.tv_remedial_actions;
      TextView tvRemedialActions = rootView.findViewById(id);
      if (tvRemedialActions == null) {
        break missingId;
      }

      id = R.id.tv_report_asset_selection_name;
      TextView tvReportAssetSelectionName = rootView.findViewById(id);
      if (tvReportAssetSelectionName == null) {
        break missingId;
      }

      id = R.id.tv_tables;
      TextView tvTables = rootView.findViewById(id);
      if (tvTables == null) {
        break missingId;
      }

      id = R.id.tv_title_marker_end;
      TextView tvTitleMarkerEnd = rootView.findViewById(id);
      if (tvTitleMarkerEnd == null) {
        break missingId;
      }

      id = R.id.tv_title_marker_start;
      TextView tvTitleMarkerStart = rootView.findViewById(id);
      if (tvTitleMarkerStart == null) {
        break missingId;
      }

      id = R.id.tv_title_mp_end;
      TextView tvTitleMpEnd = rootView.findViewById(id);
      if (tvTitleMpEnd == null) {
        break missingId;
      }

      id = R.id.tv_title_mp_start;
      TextView tvTitleMpStart = rootView.findViewById(id);
      if (tvTitleMpStart == null) {
        break missingId;
      }

      id = R.id.tv_voice_heading;
      TextView tvVoiceHeading = rootView.findViewById(id);
      if (tvVoiceHeading == null) {
        break missingId;
      }

      return new ContentIssueNewThemeBinding((ConstraintLayout) rootView, assetTypeTxt,
          btnCheckList, btnSpeak, btnVoiceRecord, captureBtn, cbDeficiency, cbRule, edLocationInfo,
          edSpeedRestriction, edVoiceInfo, etMarkerEnd, etMarkerStart, etMpEnd, etMpStart, etTitle,
          horizontalRecyclerView, ibtnCaptureAfterFix, ibtnCaptureAfterFixOld, ivActionTypeTitle,
          ivDefectTitle, ivDescTitle, ivFixedTitle, ivIssueTitle, ivLocationTitle, ivMilepostTitle,
          ivPicturesTitle, ivPriTitle, ivRemedialActionTitle, ivRuleTitle, ivVoicesTitle,
          llActionType, llApplyRule, llDefCounter, llDefDivider, llFixOld, llFixedSwitchOld,
          llLocationInfoMainContainer, llLocationInfoOptional, llMarkerContainer, llMarkerEnd,
          llMarkerStart, llMpContainer, llMpEnd, llMpStart, llPriority, llRailDirectionContainer,
          llRemedialAction, llTempSpeedRestriction, llVoiceInfoOptional, lyPictures,
          lyPicturesAfterFix, lyPicturesAfterFixOld, lyVoice, markedSwitch, prioritySpinner,
          rbActionClass1, rbActionClass2, rbActionClass3, rbActionIr, rbActionOos, rbPermanentFix,
          rbTempFix, recyclerPicsAfterFix, recyclerPicsAfterFixOld, remedialActionsForm,
          reportDescriptionTxt, rgActionsType, rgFixType, rlActionTypeTitle, rlApplyRuleTitle,
          rlFixedTitleOld, rlLocationInfoTitle, rlLocationTitle, rlPriorityTitle, rlRemedialTitle,
          rvVoice, saveBtn, spMarkerEnd, spMarkerStart, spRailDirection, spinnerRemedialActions,
          textView15, textView16, textView19, textView22, textView23, textView3, tvActionsType,
          tvApplyRuleTitle, tvDefectSelectCount, tvDefectTitle, tvDefectTotalCount, tvFixedHeading,
          tvMileHeading, tvPicHeading, tvPicHeadingAfterFix, tvPicHeadingAfterFixOld,
          tvRemedialActions, tvReportAssetSelectionName, tvTables, tvTitleMarkerEnd,
          tvTitleMarkerStart, tvTitleMpEnd, tvTitleMpStart, tvVoiceHeading);
    }
    String missingId = rootView.getResources().getResourceName(id);
    throw new NullPointerException("Missing required view with ID: ".concat(missingId));
  }
}