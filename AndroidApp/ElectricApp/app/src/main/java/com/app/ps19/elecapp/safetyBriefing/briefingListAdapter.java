package com.app.ps19.elecapp.safetyBriefing;

import static com.app.ps19.elecapp.Shared.Globals.safetyBriefingContext;

import android.annotation.SuppressLint;
import android.app.DatePickerDialog;
import android.app.TimePickerDialog;
import android.content.Context;
import android.content.res.Resources;
import android.graphics.Typeface;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.TypedValue;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseExpandableListAdapter;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.HeterogeneousExpandableList;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.TimePicker;

import com.app.ps19.elecapp.R;
import com.app.ps19.elecapp.Shared.Globals;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

public class briefingListAdapter extends BaseExpandableListAdapter implements HeterogeneousExpandableList {

    private Context context;

    // group titles
    private final List<String> listDataGroup;
    TextView etTime;
    TextView etDate;
    TextView tvRow9;
    TextView tvRow11b;
    String date_row_1;
    private final HashMap<Integer, View> listViews = new HashMap<>();

    // child data in format of header title, child title
    private final HashMap<String, List<String>> listDataChild;

    public briefingListAdapter(Context context, List<String> listDataGroup,
                               HashMap<String, List<String>> listChildData) {
        this.context = context;
        this.listDataGroup = listDataGroup;
        this.listDataChild = listChildData;
    }

    @Override
    public String getChild(int groupPosition, int childPosition) {
        return this.listDataChild.get(this.listDataGroup.get(groupPosition))
                .get(childPosition);
    }

    @Override
    public long getChildId(int groupPosition, int childPosition) {
        return childPosition;
    }

    @SuppressLint("InflateParams")
    @Override
    public View getChildView(final int groupPosition, final int childPosition,
                             boolean isLastChild, View convertView, ViewGroup parent) {

        final String childText = getChild(groupPosition, childPosition);
        //LayoutInflater inflater = context.getLayoutInflater();
        LayoutInflater inflater = (LayoutInflater) context
                .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        convertView = Globals.listViews.get(groupPosition);
        if (/*convertView == null || convertView.getTag() != String.valueOf(groupPosition) || */convertView == null) {
            assert inflater != null;
            switch (groupPosition) {
                case 0:
                    convertView = inflater.inflate(R.layout.briefing_row_1, null);
                    convertView.setTag(0);

                    etDate = (TextView) convertView.findViewById(R.id.tv_date_time);
                    //etTime=(TextView) convertView.findViewById(R.id.in_time);

                    if (Globals.safetyBriefing.getDateTime() == null || Globals.safetyBriefing.getDateTime().equals("")) {
                        etDate.setText(R.string.briefing_date);
                    } else {
                        etDate.setText(Globals.safetyBriefing.getDateTime());
                    }

                    //etTime = convertView.findViewById(R.id.ed_row_1);
                    etDate.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            showDatePicker(groupPosition);
                        }

                    });
                    /*etTime.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            showTimePicker();
                        }

                    });*/
                    break;
                case 1:
                    convertView = inflater.inflate(R.layout.briefing_description_row_2, null);
                    convertView.setTag(1);
                    EditText etDesc = convertView.findViewById(R.id.ed_row_2);
                    if (Globals.safetyBriefing.getWorkLocation() != null && !Globals.safetyBriefing.getWorkLocation().equals("")) {
                        etDesc.setText(Globals.safetyBriefing.getWorkLocation());
                    }
                    etDesc.addTextChangedListener(new TextWatcher() {

                        public void onTextChanged(CharSequence s, int start, int before,
                                                  int count) {
                            if (!s.equals("")) {
                                //do your work here
                                Globals.safetyBriefing.setWorkLocation(s.toString());
                            }
                        }

                        public void beforeTextChanged(CharSequence s, int start, int count,
                                                      int after) {
                        }

                        public void afterTextChanged(Editable s) {
                        }
                    });
                    break;
                case 2:
                    convertView = inflater.inflate(R.layout.briefing_description_row_3, null);
                    convertView.setTag(2);
                    EditText etDesc3 = convertView.findViewById(R.id.ed_row_3);
                    if (Globals.safetyBriefing.getWorkAssignment() != null && !Globals.safetyBriefing.getWorkAssignment().equals("")) {
                        etDesc3.setText(Globals.safetyBriefing.getWorkAssignment());
                    }
                    etDesc3.addTextChangedListener(new TextWatcher() {

                        public void onTextChanged(CharSequence s, int start, int before,
                                                  int count) {
                            if (!s.equals("")) {
                                Globals.safetyBriefing.setWorkAssignment(s.toString());
                            }
                        }

                        public void beforeTextChanged(CharSequence s, int start, int count,
                                                      int after) {

                        }

                        public void afterTextChanged(Editable s) {

                        }
                    });
                    break;
                case 3:
                    convertView = inflater.inflate(R.layout.briefing_description_row_4, null);
                    convertView.setTag(3);
                    EditText etDesc4 = convertView.findViewById(R.id.ed_row_4);
                    if (Globals.safetyBriefing.getqPE() != null && !Globals.safetyBriefing.getqPE().equals("")) {
                        etDesc4.setText(Globals.safetyBriefing.getqPE());
                    }
                    etDesc4.addTextChangedListener(new TextWatcher() {

                        public void onTextChanged(CharSequence s, int start, int before,
                                                  int count) {
                            if (!s.equals("")) {
                                //do your work here
                                Globals.safetyBriefing.setqPE(s.toString());
                            }
                        }

                        public void beforeTextChanged(CharSequence s, int start, int count,
                                                      int after) {

                        }

                        public void afterTextChanged(Editable s) {

                        }
                    });
                    break;
                case 4:
                    convertView = inflater.inflate(R.layout.briefing_description_row_5, null);
                    convertView.setTag(4);
                    EditText etDesc5 = convertView.findViewById(R.id.ed_row_5);
                    if (Globals.safetyBriefing.getConfirmCQ() != null && !Globals.safetyBriefing.getConfirmCQ().equals("")) {
                        etDesc5.setText(Globals.safetyBriefing.getConfirmCQ());
                    }
                    etDesc5.addTextChangedListener(new TextWatcher() {

                        public void onTextChanged(CharSequence s, int start, int before,
                                                  int count) {
                            if (!s.equals("")) {
                                //do your work here
                                Globals.safetyBriefing.setConfirmCQ(s.toString());
                            }
                        }

                        public void beforeTextChanged(CharSequence s, int start, int count,
                                                      int after) {

                        }

                        public void afterTextChanged(Editable s) {

                        }
                    });
                    break;
                case 5:
                    convertView = inflater.inflate(R.layout.briefing_description_row_6, null);
                    convertView.setTag(5);
                    EditText etDesc6 = convertView.findViewById(R.id.ed_row_6);
                    if (Globals.safetyBriefing.getLineOfTrack() != null && !Globals.safetyBriefing.getLineOfTrack().equals("")) {
                        etDesc6.setText(Globals.safetyBriefing.getLineOfTrack());
                    }
                    etDesc6.addTextChangedListener(new TextWatcher() {

                        public void onTextChanged(CharSequence s, int start, int before,
                                                  int count) {
                            if (!s.equals("")) {
                                //do your work here
                                Globals.safetyBriefing.setLineOfTrack(s.toString());
                            }
                        }

                        public void beforeTextChanged(CharSequence s, int start, int count,
                                                      int after) {

                        }

                        public void afterTextChanged(Editable s) {

                        }
                    });
                    break;
                case 6:
                    convertView = inflater.inflate(R.layout.briefing_description_row_7, null);
                    convertView.setTag(6);
                    EditText etDesc7 = convertView.findViewById(R.id.ed_row_7);
                    if (Globals.safetyBriefing.getTrackMaxSpeed() != null && !Globals.safetyBriefing.getTrackMaxSpeed().equals("")) {
                        etDesc7.setText(Globals.safetyBriefing.getTrackMaxSpeed());
                    }
                    etDesc7.addTextChangedListener(new TextWatcher() {

                        public void onTextChanged(CharSequence s, int start, int before,
                                                  int count) {
                            if (!s.equals("")) {
                                //do your work here
                                Globals.safetyBriefing.setTrackMaxSpeed(s.toString());
                            }
                        }

                        public void beforeTextChanged(CharSequence s, int start, int count,
                                                      int after) {

                        }

                        public void afterTextChanged(Editable s) {

                        }
                    });
                    break;
                case 7:
                    convertView = inflater.inflate(R.layout.briefing_checkbox_row_8, null);
                    convertView.setTag(7);
                    CheckBox row8Cb1 = convertView.findViewById(R.id.checkBox_itd);
                    CheckBox row8Cb2 = convertView.findViewById(R.id.checkBox_ft);
                    CheckBox row8Cb3 = convertView.findViewById(R.id.checkBox_taw);
                    CheckBox row8Cb4 = convertView.findViewById(R.id.checkBox_wz);
                    CheckBox row8Cb5 = convertView.findViewById(R.id.checkBox_oos);

                    final String itd = row8Cb1.getText().toString();
                    final String foulTime = row8Cb2.getText().toString();
                    final String taw = row8Cb3.getText().toString();
                    final String workZone = row8Cb4.getText().toString();
                    final String oos = row8Cb5.getText().toString();

                    if (Globals.safetyBriefing.getTypeOfProtection() != null) {
                        for (int i = 0; i < Globals.safetyBriefing.getTypeOfProtection().size(); i++) {
                            if (Globals.safetyBriefing.getTypeOfProtection().get(i).equals(itd)) {
                                row8Cb1.setChecked(true);
                            } else if (Globals.safetyBriefing.getTypeOfProtection().get(i).equals(foulTime)) {
                                row8Cb2.setChecked(true);
                            } else if (Globals.safetyBriefing.getTypeOfProtection().get(i).equals(taw)) {
                                row8Cb3.setChecked(true);
                            } else if (Globals.safetyBriefing.getTypeOfProtection().get(i).equals(workZone)) {
                                row8Cb4.setChecked(true);
                            } else if (Globals.safetyBriefing.getTypeOfProtection().get(i).equals(oos)) {
                                row8Cb5.setChecked(true);
                            }
                        }
                    }
                    row8Cb1.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {

                                                           @Override
                                                           public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                                                               if (isChecked) {
                                                                   if (Globals.safetyBriefing.getTypeOfProtection().contains(itd)) {

                                                                   } else {
                                                                       Globals.safetyBriefing.getTypeOfProtection().set(Globals.safetyBriefing.getTypeOfProtection().indexOf(""),itd);
                                                                   }
                                                               } else {
                                                                   if (Globals.safetyBriefing.getTypeOfProtection().contains(itd)) {
                                                                       Globals.safetyBriefing.getTypeOfProtection().set(Globals.safetyBriefing.getTypeOfProtection().indexOf(itd), "");
                                                                   }
                                                               }
                                                           }
                                                       }
                    );
                    row8Cb2.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {

                                                           @Override
                                                           public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                                                               if (isChecked) {
                                                                   if (Globals.safetyBriefing.getTypeOfProtection().contains(foulTime)) {

                                                                   } else {
                                                                       Globals.safetyBriefing.getTypeOfProtection().set(Globals.safetyBriefing.getTypeOfProtection().indexOf(""),foulTime);
                                                                   }
                                                               } else {
                                                                   if (Globals.safetyBriefing.getTypeOfProtection().contains(foulTime)) {
                                                                       Globals.safetyBriefing.getTypeOfProtection().set(Globals.safetyBriefing.getTypeOfProtection().indexOf(foulTime), "");
                                                                   }
                                                               }
                                                           }
                                                       }
                    );
                    row8Cb3.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {

                                                           @Override
                                                           public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                                                               if (isChecked) {
                                                                   if (Globals.safetyBriefing.getTypeOfProtection().contains(taw)) {

                                                                   } else {
                                                                       Globals.safetyBriefing.getTypeOfProtection().set(Globals.safetyBriefing.getTypeOfProtection().indexOf(""),taw);
                                                                   }
                                                               } else {
                                                                   if (Globals.safetyBriefing.getTypeOfProtection().contains(taw)) {
                                                                       Globals.safetyBriefing.getTypeOfProtection().set(Globals.safetyBriefing.getTypeOfProtection().indexOf(taw), "");
                                                                   }
                                                               }
                                                           }
                                                       }
                    );
                    row8Cb4.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {

                                                           @Override
                                                           public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                                                               if (isChecked) {
                                                                   if (Globals.safetyBriefing.getTypeOfProtection().contains(workZone)) {

                                                                   } else {
                                                                       Globals.safetyBriefing.getTypeOfProtection().set(Globals.safetyBriefing.getTypeOfProtection().indexOf(""),workZone);
                                                                   }
                                                               } else {
                                                                   if (Globals.safetyBriefing.getTypeOfProtection().contains(workZone)) {
                                                                       Globals.safetyBriefing.getTypeOfProtection().set(Globals.safetyBriefing.getTypeOfProtection().indexOf(workZone), "");
                                                                   }
                                                               }
                                                           }
                                                       }
                    );
                    row8Cb5.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {

                                                           @Override
                                                           public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                                                               if (isChecked) {
                                                                   if (Globals.safetyBriefing.getTypeOfProtection().contains(oos)) {

                                                                   } else {
                                                                       Globals.safetyBriefing.getTypeOfProtection().set(Globals.safetyBriefing.getTypeOfProtection().indexOf(""),oos);
                                                                   }
                                                               } else {
                                                                   if (Globals.safetyBriefing.getTypeOfProtection().contains(oos)) {
                                                                       Globals.safetyBriefing.getTypeOfProtection().set(Globals.safetyBriefing.getTypeOfProtection().indexOf(oos), "");
                                                                   }
                                                               }
                                                           }
                                                       }
                    );
                    break;
                case 8:
                    convertView = inflater.inflate(R.layout.briefing_time_row_9, null);
                    convertView.setTag(8);
                    tvRow9 = convertView.findViewById(R.id.ed_itd_time);
                    tvRow9.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            showTimePicker(groupPosition);

                        }
                    });
                    //EditText etRow9 = convertView.findViewById(R.id.ed_itd_time);
                    if (Globals.safetyBriefing.getItdProtectionTime() != null && !Globals.safetyBriefing.getItdProtectionTime().equals("")) {
                        tvRow9.setText(Globals.safetyBriefing.getItdProtectionTime());
                    }
                   /* etRow9.addTextChangedListener(new TextWatcher() {

                        public void onTextChanged(CharSequence s, int start, int before,
                                                  int count) {
                            if (!s.equals("")) {
                                //do your work here
                            }
                        }

                        public void beforeTextChanged(CharSequence s, int start, int count,
                                                      int after) {

                        }

                        public void afterTextChanged(Editable s) {

                        }
                    });*/
                    break;
                case 9:
                    convertView = inflater.inflate(R.layout.briefing_radiobutton_row_10, null);
                    convertView.setTag(9);
                    final RadioGroup rgRow10 = convertView.findViewById(R.id.rg_row_10);
                    if (Globals.safetyBriefing.isHaveFoulTimeForms()) {
                        RadioButton rbYes = convertView.findViewById(R.id.radio_button_yes_10);
                        rbYes.setChecked(true);
                    } else {
                        RadioButton rbNo = convertView.findViewById(R.id.radio_button_no_10);
                        rbNo.setChecked(true);
                    }
                    rgRow10.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
                        public void onCheckedChanged(RadioGroup group, int checkedId) {
                            switch (checkedId) {
                                case R.id.radio_button_yes_10:
                                    // do operations specific to this selection
                                    Globals.safetyBriefing.setHaveFoulTimeForms(true);
                                    break;
                                case R.id.radio_button_no_10:
                                    // do operations specific to this selection
                                    Globals.safetyBriefing.setHaveFoulTimeForms(false);
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                    break;
                case 10:
                    convertView = inflater.inflate(R.layout.briefing_text_edit_time_row_11, null);
                    convertView.setTag(10);
                    EditText etRow11a = convertView.findViewById(R.id.ed_row_11);
                    //EditText etRow11b = convertView.findViewById(R.id.ed_taw_time);
                    tvRow11b = convertView.findViewById(R.id.tv_taw_time);
                    if (Globals.safetyBriefing.getTawWatchPersonRequired() != null && !Globals.safetyBriefing.getTawWatchPersonRequired().equals("")) {
                        etRow11a.setText(Globals.safetyBriefing.getTawWatchPersonRequired());
                    }
                    if (Globals.safetyBriefing.getTawTime() != null && !Globals.safetyBriefing.getTawTime().equals("")) {
                        tvRow11b.setText(Globals.safetyBriefing.getTawTime());
                    }
                    tvRow11b.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            showTimePicker(groupPosition);
                        }
                    });
                    etRow11a.addTextChangedListener(new TextWatcher() {

                        public void onTextChanged(CharSequence s, int start, int before,
                                                  int count) {
                            if (!s.equals("")) {
                                //do your work here
                                Globals.safetyBriefing.setTawWatchPersonRequired(s.toString());
                            }
                        }

                        public void beforeTextChanged(CharSequence s, int start, int count,
                                                      int after) {

                        }

                        public void afterTextChanged(Editable s) {

                        }
                    });
                    break;
                case 11:
                    convertView = inflater.inflate(R.layout.briefing_radiobutton_row_12, null);
                    convertView.setTag(11);
                    final RadioGroup rgRow12a = convertView.findViewById(R.id.rg_row_12_a);
                    final RadioGroup rgRow12b = convertView.findViewById(R.id.rg_row_12_b);
                    if (Globals.safetyBriefing.isTawLocationHotspot()) {
                        RadioButton rbYes = convertView.findViewById(R.id.radioButton_yes_12a);
                        rbYes.setChecked(true);
                    } else {
                        RadioButton rbNo = convertView.findViewById(R.id.radioButton_no_12a);
                        rbNo.setChecked(true);
                    }
                    if (Globals.safetyBriefing.isTawAdditionalWatchpersons()) {
                        RadioButton rbYes = convertView.findViewById(R.id.radioButton_yes_12b);
                        rbYes.setChecked(true);
                    } else {
                        RadioButton rbNo = convertView.findViewById(R.id.radioButton_no_12b);
                        rbNo.setChecked(true);
                    }
                    rgRow12a.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
                        public void onCheckedChanged(RadioGroup group, int checkedId) {
                            switch (checkedId) {
                                case R.id.radioButton_yes_12a:
                                    // do operations specific to this selection
                                    Globals.safetyBriefing.setTawLocationHotspot(true);
                                    break;
                                case R.id.radioButton_no_12a:
                                    // do operations specific to this selection
                                    Globals.safetyBriefing.setTawLocationHotspot(false);
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                    rgRow12b.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
                        public void onCheckedChanged(RadioGroup group, int checkedId) {
                            switch (checkedId) {
                                case R.id.radioButton_yes_12b:
                                    // do operations specific to this selection
                                    Globals.safetyBriefing.setTawAdditionalWatchpersons(true);
                                    break;
                                case R.id.radioButton_no_12b:
                                    // do operations specific to this selection
                                    Globals.safetyBriefing.setTawAdditionalWatchpersons(false);
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                    break;
                case 12:
                    convertView = inflater.inflate(R.layout.briefing_buttonedit_row_13, null);
                    convertView.setTag(12);
                    final RadioGroup rgRow13 = convertView.findViewById(R.id.rg_row_13);
                    EditText etRow13 = convertView.findViewById(R.id.ed_row_13);
                    if (Globals.safetyBriefing.isTaw15PerRule()) {
                        RadioButton rbYes = convertView.findViewById(R.id.radio_button_yes_13);
                        rbYes.setChecked(true);
                    } else {
                        RadioButton rbNo = convertView.findViewById(R.id.radio_button_no_13);
                        rbNo.setChecked(true);
                    }
                    if (Globals.safetyBriefing.getTawRequiredDistanceFeet() != null && !Globals.safetyBriefing.getTawRequiredDistanceFeet().equals("")) {
                        etRow13.setText(Globals.safetyBriefing.getTawRequiredDistanceFeet());
                    }
                    rgRow13.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
                        public void onCheckedChanged(RadioGroup group, int checkedId) {
                            switch (checkedId) {
                                case R.id.radio_button_yes_13:
                                    // do operations specific to this selection
                                    Globals.safetyBriefing.setTaw15PerRule(true);
                                    break;
                                case R.id.radio_button_no_13:
                                    // do operations specific to this selection
                                    Globals.safetyBriefing.setTaw15PerRule(false);
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                    etRow13.addTextChangedListener(new TextWatcher() {

                        public void onTextChanged(CharSequence s, int start, int before,
                                                  int count) {
                            if (!s.equals("")) {
                                //do your work here
                                Globals.safetyBriefing.setTawRequiredDistanceFeet(s.toString());
                            }
                        }

                        public void beforeTextChanged(CharSequence s, int start, int count,
                                                      int after) {

                        }

                        public void afterTextChanged(Editable s) {

                        }
                    });
                    break;
                case 13:
                    convertView = inflater.inflate(R.layout.briefing_radiobutton_row_14, null);
                    convertView.setTag(13);
                    RadioGroup rgRow14 = convertView.findViewById(R.id.rg_row_14);
                    if (Globals.safetyBriefing.isWorkZoneSignPlaced()) {
                        RadioButton rbYes = convertView.findViewById(R.id.radioButton_yes_14);
                        rbYes.setChecked(true);
                    } else {
                        RadioButton rbNo = convertView.findViewById(R.id.radioButton_no_14);
                        rbNo.setChecked(true);
                    }
                    rgRow14.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
                        public void onCheckedChanged(RadioGroup group, int checkedId) {
                            switch (checkedId) {
                                case R.id.radioButton_yes_14:
                                    // do operations specific to this selection
                                    Globals.safetyBriefing.setWorkZoneSignPlaced(true);
                                    break;
                                case R.id.radioButton_no_14:
                                    // do operations specific to this selection
                                    Globals.safetyBriefing.setWorkZoneSignPlaced(false);
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                    break;
                case 14:
                    convertView = inflater.inflate(R.layout.briefing_radiobutton_row_15, null);
                    convertView.setTag(14);
                    RadioGroup rgRow15 = convertView.findViewById(R.id.rg_row_15);
                    if (Globals.safetyBriefing.isOosTrainStopPlans()) {
                        RadioButton rbYes = convertView.findViewById(R.id.radioButton_yes_15);
                        rbYes.setChecked(true);
                    } else {
                        RadioButton rbNo = convertView.findViewById(R.id.radioButton_no_15);
                        rbNo.setChecked(true);
                    }
                    rgRow15.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
                        public void onCheckedChanged(RadioGroup group, int checkedId) {
                            switch (checkedId) {
                                case R.id.radioButton_yes_15:
                                    // do operations specific to this selection
                                    Globals.safetyBriefing.setOosTrainStopPlans(true);
                                    break;
                                case R.id.radioButton_no_15:
                                    // do operations specific to this selection
                                    Globals.safetyBriefing.setOosTrainStopPlans(false);
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                    break;
                case 15:
                    convertView = inflater.inflate(R.layout.briefing_radiobutton_row_16, null);
                    convertView.setTag(15);
                    RadioGroup rgRow16 = convertView.findViewById(R.id.rg_row_16);
                    if (Globals.safetyBriefing.isProtectionEntryPoints()) {
                        RadioButton rbYes = convertView.findViewById(R.id.radioButton_yes_16);
                        rbYes.setChecked(true);
                    } else {
                        RadioButton rbNo = convertView.findViewById(R.id.radioButton_no_16);
                        rbNo.setChecked(true);
                    }
                    rgRow16.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
                        public void onCheckedChanged(RadioGroup group, int checkedId) {
                            switch (checkedId) {
                                case R.id.radioButton_yes_16:
                                    // do operations specific to this selection
                                    Globals.safetyBriefing.setProtectionEntryPoints(true);
                                    break;
                                case R.id.radioButton_no_16:
                                    // do operations specific to this selection
                                    Globals.safetyBriefing.setProtectionEntryPoints(false);
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                    break;
                case 16:
                    convertView = inflater.inflate(R.layout.briefing_radioedit_row_17, null);
                    convertView.setTag(16);
                    RadioGroup rgRow17 = convertView.findViewById(R.id.rg_row_17);
                    EditText etRow17 = convertView.findViewById(R.id.ed_row_17);
                    if (Globals.safetyBriefing.isProtectionAllDirections()) {
                        RadioButton rbYes = convertView.findViewById(R.id.radioButton_yes_17);
                        rbYes.setChecked(true);
                    } else {
                        RadioButton rbNo = convertView.findViewById(R.id.radioButton_no_17);
                        rbNo.setChecked(true);
                    }
                    if (Globals.safetyBriefing.getProtectionAllDirectionNoExplain() != null && !Globals.safetyBriefing.getProtectionAllDirectionNoExplain().equals("")) {
                        etRow17.setText(Globals.safetyBriefing.getProtectionAllDirectionNoExplain());
                    }
                    rgRow17.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
                        public void onCheckedChanged(RadioGroup group, int checkedId) {
                            switch (checkedId) {
                                case R.id.radioButton_yes_17:
                                    // do operations specific to this selection
                                    Globals.safetyBriefing.setProtectionAllDirections(true);
                                    break;
                                case R.id.radioButton_no_17:
                                    // do operations specific to this selection
                                    Globals.safetyBriefing.setProtectionAllDirections(false);
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                    etRow17.addTextChangedListener(new TextWatcher() {

                        public void onTextChanged(CharSequence s, int start, int before,
                                                  int count) {
                            if (!s.equals("")) {
                                //do your work here
                                Globals.safetyBriefing.setProtectionAllDirectionNoExplain(s.toString());
                            }
                        }

                        public void beforeTextChanged(CharSequence s, int start, int count,
                                                      int after) {

                        }

                        public void afterTextChanged(Editable s) {

                        }
                    });
                    break;
                case 17:
                    convertView = inflater.inflate(R.layout.briefing_radiotext_row_18, null);
                    convertView.setTag(17);
                    RadioGroup rgRow18 = convertView.findViewById(R.id.rg_row_18);
                    if (Globals.safetyBriefing.isOtherGroupsInvolved()) {
                        RadioButton rbYes = convertView.findViewById(R.id.radioButton_yes_18);
                        rbYes.setChecked(true);
                    } else {
                        RadioButton rbNo = convertView.findViewById(R.id.radioButton_no_18);
                        rbNo.setChecked(true);
                    }
                    rgRow18.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
                        public void onCheckedChanged(RadioGroup group, int checkedId) {
                            switch (checkedId) {
                                case R.id.radioButton_yes_18:
                                    // do operations specific to this selection
                                    Globals.safetyBriefing.setOtherGroupsInvolved(true);
                                    break;
                                case R.id.radioButton_no_18:
                                    // do operations specific to this selection
                                    Globals.safetyBriefing.setOtherGroupsInvolved(false);
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                    break;
                case 18:
                    convertView = inflater.inflate(R.layout.briefing_description_row_19, null);
                    convertView.setTag(18);
                    EditText etRow19 = convertView.findViewById(R.id.ed_row_19);
                    if (Globals.safetyBriefing.getDiscussRoadWorkerClear() != null && !Globals.safetyBriefing.getDiscussRoadWorkerClear().equals("")) {
                        etRow19.setText(Globals.safetyBriefing.getDiscussRoadWorkerClear());
                    }
                    etRow19.addTextChangedListener(new TextWatcher() {

                        public void onTextChanged(CharSequence s, int start, int before,
                                                  int count) {
                            if (!s.equals("")) {
                                //do your work here
                                Globals.safetyBriefing.setDiscussRoadWorkerClear(s.toString());
                            }
                        }

                        public void beforeTextChanged(CharSequence s, int start, int count,
                                                      int after) {

                        }

                        public void afterTextChanged(Editable s) {

                        }
                    });
                    break;
                case 19:
                    convertView = inflater.inflate(R.layout.briefing_radiotext_row_20, null);
                    convertView.setTag(19);
                    RadioGroup rgRow20 = convertView.findViewById(R.id.rg_row_20);
                    if (Globals.safetyBriefing.isWatchPersonsHaveProperEquipment()) {
                        RadioButton rbYes = convertView.findViewById(R.id.radioButton_yes_20);
                        rbYes.setChecked(true);
                    } else {
                        RadioButton rbNo = convertView.findViewById(R.id.radioButton_no_20);
                        rbNo.setChecked(true);
                    }
                    rgRow20.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
                        public void onCheckedChanged(RadioGroup group, int checkedId) {
                            switch (checkedId) {
                                case R.id.radioButton_yes_20:
                                    // do operations specific to this selection
                                    Globals.safetyBriefing.setWatchPersonsHaveProperEquipment(true);
                                    break;
                                case R.id.radioButton_no_20:
                                    // do operations specific to this selection
                                    Globals.safetyBriefing.setWatchPersonsHaveProperEquipment(false);
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                    break;
                case 20:
                    convertView = inflater.inflate(R.layout.briefing_radiobutton_row_21, null);
                    convertView.setTag(20);
                    RadioGroup rgRow21 = convertView.findViewById(R.id.rg_row_21);
                    if (Globals.safetyBriefing.isWorkersCheckedVQC()) {
                        RadioButton rbYes = convertView.findViewById(R.id.radioButton_yes_21);
                        rbYes.setChecked(true);
                    } else {
                        RadioButton rbNo = convertView.findViewById(R.id.radioButton_no_21);
                        rbNo.setChecked(true);
                    }
                    rgRow21.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
                        public void onCheckedChanged(RadioGroup group, int checkedId) {
                            switch (checkedId) {
                                case R.id.radioButton_yes_21:
                                    // do operations specific to this selection
                                    Globals.safetyBriefing.setWorkersCheckedVQC(true);
                                    break;
                                case R.id.radioButton_no_21:
                                    // do operations specific to this selection
                                    Globals.safetyBriefing.setWorkersCheckedVQC(false);
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                    break;
                case 21:
                    convertView = inflater.inflate(R.layout.briefing_radiobutton_row_22, null);
                    convertView.setTag(21);
                    RadioGroup rgRow22 = convertView.findViewById(R.id.rg_row_22);
                    if (Globals.safetyBriefing.isAllRadiosChecked()) {
                        RadioButton rbYes = convertView.findViewById(R.id.radioButton_yes_22);
                        rbYes.setChecked(true);
                    } else {
                        RadioButton rbNo = convertView.findViewById(R.id.radioButton_no_22);
                        rbNo.setChecked(true);
                    }
                    rgRow22.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
                        public void onCheckedChanged(RadioGroup group, int checkedId) {
                            switch (checkedId) {
                                case R.id.radioButton_yes_22:
                                    // do operations specific to this selection
                                    Globals.safetyBriefing.setAllRadiosChecked(true);
                                    break;
                                case R.id.radioButton_no_22:
                                    // do operations specific to this selection
                                    Globals.safetyBriefing.setAllRadiosChecked(false);
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                    break;
                case 22:
                    convertView = inflater.inflate(R.layout.briefing_textview_row_23, null);
                    convertView.setTag(22);
                    break;
                case 23:
                    convertView = inflater.inflate(R.layout.briefing_radiotext_row_24, null);
                    convertView.setTag(23);
                    RadioGroup rgRow24a = convertView.findViewById(R.id.rg_row_24a);
                    if (Globals.safetyBriefing.isAnyoneHaveConcern()) {
                        RadioButton rbYes = convertView.findViewById(R.id.radioButton_yes_24a);
                        rbYes.setChecked(true);
                    } else {
                        RadioButton rbNo = convertView.findViewById(R.id.radioButton_no_24a);
                        rbNo.setChecked(true);
                    }
                    rgRow24a.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
                        public void onCheckedChanged(RadioGroup group, int checkedId) {
                            switch (checkedId) {
                                case R.id.radioButton_yes_24a:
                                    // do operations specific to this selection
                                    Globals.safetyBriefing.setAnyoneHaveConcern(true);
                                    break;
                                case R.id.radioButton_no_24a:
                                    // do operations specific to this selection
                                    Globals.safetyBriefing.setAnyoneHaveConcern(false);
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                    RadioGroup rgRow24b = convertView.findViewById(R.id.rg_row_24b);
                    if (Globals.safetyBriefing.isAnyoneHaveConcernSatisfied()) {
                        RadioButton rbYes = convertView.findViewById(R.id.radioButton_yes_24b);
                        rbYes.setChecked(true);
                    } else {
                        RadioButton rbNo = convertView.findViewById(R.id.radioButton_no_24b);
                        rbNo.setChecked(true);
                    }
                    rgRow24b.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
                        public void onCheckedChanged(RadioGroup group, int checkedId) {
                            switch (checkedId) {
                                case R.id.radioButton_yes_24b:
                                    // do operations specific to this selection
                                    Globals.safetyBriefing.setAnyoneHaveConcernSatisfied(true);
                                    break;
                                case R.id.radioButton_no_24b:
                                    // do operations specific to this selection
                                    Globals.safetyBriefing.setAnyoneHaveConcernSatisfied(false);
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                    break;
                default:
                    break;
            }/*



            LayoutInflater layoutInflater = (LayoutInflater) this.context
                    .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            convertView = layoutInflater.inflate(R.layout.briefing_row_child, null);*/
            Globals.listViews.put(groupPosition, convertView);
        } else {

        }
        /*CheckBox cb_1 = convertView.findViewById(R.id.checkBox_1);
        CheckBox cb_2 = convertView.findViewById(R.id.checkBox_2);
        CheckBox cb_3 = convertView.findViewById(R.id.checkBox_3);
        CheckBox cb_4 = convertView.findViewById(R.id.checkBox_4);
        CheckBox cb_5 = convertView.findViewById(R.id.checkBox_5);

        EditText ed_simple = convertView.findViewById(R.id.editText4);
        EditText ed_multiline = convertView.findViewById(R.id.multiline_1);
        EditText ed_time = convertView.findViewById(R.id.time_1);
        EditText ed_date = convertView.findViewById(R.id.date_1);
        TextView tv_simple = convertView.findViewById(R.id.tv_briefing_simple);

        cb_1.setVisibility(View.GONE);
        cb_2.setVisibility(View.GONE);
        cb_3.setVisibility(View.GONE);
        cb_4.setVisibility(View.GONE);
        cb_5.setVisibility(View.GONE);
        ed_simple.setVisibility(View.GONE);
        ed_multiline.setVisibility(View.GONE);
        ed_time.setVisibility(View.GONE);
        ed_date.setVisibility(View.GONE);
        tv_simple.setVisibility(View.GONE);

        String[] id = childText.split("-");
        switch (id[0]) {
            case "time":
                ed_time.setVisibility(View.VISIBLE);
                ed_time.setHint("Time");
                break;
            case "date":
                ed_date.setVisibility(View.VISIBLE);
                ed_date.setHint("Date");
                break;
            case "edit":
                if (id[1] != null && id[1].equals("multiline")) {
                    ed_multiline.setVisibility(View.VISIBLE);
                } else {
                    ed_simple.setVisibility(View.VISIBLE);
                }
                break;
            case "tv":
                tv_simple.setVisibility(View.VISIBLE);
                tv_simple.setText(id[1]);
                break;
            case "cb":
                cb_1.setVisibility(View.VISIBLE);
                cb_1.setOnCheckedChangeListener(null);
                cb_1.setChecked(false);
                cb_1.setText(id[1]);

                break;
        }*//*
        TextView tvChildId = convertView.findViewById(R.id.tv_dc_child_id);
        tvChildId.setText(getChild(groupPosition, childPosition));
        CheckBox cbDefectCode = convertView.findViewById(R.id.cb_defect_code);
        cbDefectCode.setTag(getChild(groupPosition, childPosition));

        cbDefectCode.setOnCheckedChangeListener(null);

        cbDefectCode.setChecked(false);
        if(Globals.defectCodeSelection.contains(getChild(groupPosition, childPosition))){
            cbDefectCode.setChecked(true);
        }

        if(!Globals.defectCodeTags.contains(getChild(groupPosition, childPosition))){
            Globals.defectCodeTags.add(getChild(groupPosition, childPosition));
        }
        cbDefectCode.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            public void onCheckedChanged(CompoundButton buttonView,
                                         boolean isChecked) {
                if (isChecked) {

                    *//*int i = selectedNames.indexOf(tempChild.get(childPosition));

                    if (i == -1) {
                        selectedNames.add(tempChild.get(childPosition));
                    }*//*
                    Globals.defectCodeSelection.add(getChild(groupPosition, childPosition));
                } else {

                   *//* int i = selectedNames.indexOf(tempChild.get(childPosition));

                    if (i != -1) {
                        selectedNames.remove(i);
                    }*//*
                    if(Globals.defectCodeSelection.contains(getChild(groupPosition, childPosition))){
                        Globals.defectCodeSelection.remove(getChild(groupPosition, childPosition));
                    }
                }

            }
        });

        TextView textViewChild = convertView
                .findViewById(R.id.textViewChild);

        textViewChild.setText(childText);*/
        //listViews.put(groupPosition, convertView);
        return convertView;
    }

    @Override
    public int getChildrenCount(int groupPosition) {
        return this.listDataChild.get(this.listDataGroup.get(groupPosition))
                .size();
    }

    @Override
    public String getGroup(int groupPosition) {
        return this.listDataGroup.get(groupPosition);
    }

    @Override
    public int getGroupCount() {
        return this.listDataGroup.size();
    }

    @Override
    public long getGroupId(int groupPosition) {
        return groupPosition;
    }

    @Override
    public View getGroupView(int groupPosition, boolean isExpanded,
                             View convertView, ViewGroup parent) {
        String headerTitle = getGroup(groupPosition);
        if (convertView == null) {
            LayoutInflater layoutInflater = (LayoutInflater) context
                    .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            convertView = layoutInflater.inflate(R.layout.briefing_row_group, null);

        }
        /*LinearLayout llMain = convertView.findViewById(R.id.ll_main_group);
        TextView tvId = new TextView(context);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(getDp(40), getDp(40));
        params.setMargins(getDp(0), getDp(0), getDp(0), getDp(4));
        tvId.setLayoutParams(params);
        tvId.setGravity(Gravity.CENTER);

        //tvTitle.setBackground(ContextCompat.getDrawable(context, R.drawable.ready));
        if (android.os.Build.VERSION.SDK_INT < Build.VERSION_CODES.JELLY_BEAN)
            tvId.setBackgroundDrawable(context.getResources().getDrawable(R.drawable.circle));
        else if(android.os.Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP_MR1)
            tvId.setBackground(context.getResources().getDrawable(R.drawable.circle));
        else
            tvId.setBackground(ContextCompat.getDrawable(context, R.drawable.circle));

        tvId.setTextColor(R.color.colorTitle);
        tvId.setTextSize(10);
        tvId.setText("12.123");
        llMain.addView(tvId);

        TextView tvTitle = new TextView(context);
        LinearLayout.LayoutParams titleParam = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT);

        tvTitle.setLayoutParams(titleParam);
        tvTitle.setPadding(getDp(9),getDp(8),0,getDp(8));
        tvTitle.setTextColor(R.color.colorBlack);
        tvTitle.setTextSize(getDp(17));
        tvTitle.setText(headerTitle);
        llMain.addView(tvTitle);*/

        TextView tvGroupTitle = convertView
                .findViewById(R.id.tv_briefing_title);
        tvGroupTitle.setTypeface(null, Typeface.BOLD);
        tvGroupTitle.setText(headerTitle);
        TextView tvInitial = convertView.findViewById(R.id.tv_briefing_id);
        tvInitial.setText(headerTitle.substring(0, 1));

        return convertView;
    }

    @Override
    public boolean hasStableIds() {
        return false;
    }

    @Override
    public boolean isChildSelectable(int groupPosition, int childPosition) {
        return true;
    }

    public int getDp(int size) {
        Resources r = context.getResources();
        return (int) TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP,
                size,
                r.getDisplayMetrics()
        );
    }

    public void showTimePicker(final int position) {
      /*  final Calendar myCalender = Calendar.getInstance();
        int hour = myCalender.get(Calendar.HOUR_OF_DAY);
        int minute = myCalender.get(Calendar.MINUTE);


        TimePickerDialog.OnTimeSetListener myTimeListener = new TimePickerDialog.OnTimeSetListener() {
            @Override
            public void onTimeSet(TimePicker view, int hourOfDay, int minute) {
                if (view.isShown()) {
                    myCalender.set(Calendar.HOUR_OF_DAY, hourOfDay);
                    myCalender.set(Calendar.MINUTE, minute);
                    etTime.setText(myCalender.getTime().toString());


                }
            }
        };
        TimePickerDialog timePickerDialog = new TimePickerDialog(context, android.R.style.Theme_Holo_Light_Dialog_NoActionBar, myTimeListener, hour, minute, true);
        timePickerDialog.setTitle("Choose hour:");
        timePickerDialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);

        timePickerDialog.show();*/
        // Get Current Time
        final Calendar c = Calendar.getInstance();
        int mHour = c.get(Calendar.HOUR_OF_DAY);
        int mMinute = c.get(Calendar.MINUTE);

        try {
            // Launch Time Picker Dialog
            TimePickerDialog timePickerDialog = new TimePickerDialog(safetyBriefingContext,
                    new TimePickerDialog.OnTimeSetListener() {

                        @Override
                        public void onTimeSet(TimePicker view, int hourOfDay,
                                              int minute) {
                            //String time = hourOfDay + ":" + minute;
                            Calendar datetime = Calendar.getInstance();
                            datetime.set(Calendar.HOUR_OF_DAY, hourOfDay);
                            datetime.set(Calendar.MINUTE, minute);

                            SimpleDateFormat timeFormatAmPm = new SimpleDateFormat("hh:mm aa");

                            //etTime.setText(hourOfDay + ":" + minute);
                            if (position == 0) {
                                Globals.safetyBriefing.setDateTime(date_row_1 + ' ' + ',' + timeFormatAmPm.format(datetime.getTime()));
                                etDate.setText(Globals.safetyBriefing.getDateTime());
                            } else if (position == 8) {
                                tvRow9.setText(timeFormatAmPm.format(datetime.getTime()));
                                Globals.safetyBriefing.setItdProtectionTime(timeFormatAmPm.format(datetime.getTime()));
                            } else if (position == 10) {
                                tvRow11b.setText(timeFormatAmPm.format(datetime.getTime()));
                                Globals.safetyBriefing.setTawTime(timeFormatAmPm.format(datetime.getTime()));
                            } else {

                            }


                        }
                    }, mHour, mMinute, false);
            timePickerDialog.show();
        } catch (Exception e) {
            e.printStackTrace();
        }


    }

    public void showDatePicker(final int position) {
        // Get Current Date
        final Calendar c = Calendar.getInstance();
        int mYear = c.get(Calendar.YEAR);
        int mMonth = c.get(Calendar.MONTH);
        int mDay = c.get(Calendar.DAY_OF_MONTH);


        DatePickerDialog datePickerDialog = new DatePickerDialog(safetyBriefingContext,
                new DatePickerDialog.OnDateSetListener() {

                    @Override
                    public void onDateSet(DatePicker view, int year,
                                          int monthOfYear, int dayOfMonth) {
                        Calendar calendar = Calendar.getInstance();
                        calendar.set(year, monthOfYear, dayOfMonth);

                        SimpleDateFormat dateFormat = new SimpleDateFormat("EEE, d MMM yyyy ");

                        date_row_1 = dateFormat.format(calendar.getTime());


                        //etDate.setText(dayOfMonth + "-" + (monthOfYear + 1) + "-" + year);
                        //date_row_1 = (dayOfMonth + "-" + (monthOfYear + 1) + "-" + year);
                        showTimePicker(position);

                    }
                }, mYear, mMonth, mDay);
        try {
            datePickerDialog.show();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
