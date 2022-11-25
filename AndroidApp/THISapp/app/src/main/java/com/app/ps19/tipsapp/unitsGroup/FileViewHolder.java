package com.app.ps19.tipsapp.unitsGroup;

import static com.app.ps19.tipsapp.Shared.Globals.activeSession;
import static com.app.ps19.tipsapp.Shared.Globals.appName;
import static com.app.ps19.tipsapp.Shared.Globals.getSelectedTask;
import static com.app.ps19.tipsapp.Shared.Globals.selectedDUnit;
import static com.app.ps19.tipsapp.Shared.Globals.selectedUnit;
import static com.app.ps19.tipsapp.Shared.Globals.setSelectedEquipment;
import static com.app.ps19.tipsapp.Shared.Globals.setSelectedUnit;
import static com.app.ps19.tipsapp.inspection.InspectionActivity.ADD_DEFECT_ACTIVITY_REQUEST_CODE;
import static com.app.ps19.tipsapp.unitsGroup.UrPageFragment.onDefectActivityLaunch;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.media.audiofx.DynamicsProcessing;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.PopupMenu;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentTransaction;

import com.amrdeveloper.treeview.TreeNode;
import com.amrdeveloper.treeview.TreeViewHolder;
import com.app.ps19.tipsapp.R;
import com.app.ps19.tipsapp.ReportAddActivity;
import com.app.ps19.tipsapp.Shared.Globals;
import com.app.ps19.tipsapp.UnitCordsAdjActivity;
import com.app.ps19.tipsapp.classes.DUnit;
import com.app.ps19.tipsapp.classes.Report;
import com.app.ps19.tipsapp.classes.Units;
import com.app.ps19.tipsapp.classes.dynforms.AppFormDialogFragment;
import com.app.ps19.tipsapp.classes.equipment.Equipment;
import com.app.ps19.tipsapp.classes.equipment.EquipmentDialogFragment;
import com.app.ps19.tipsapp.databinding.ActivityImagePickerBinding;
import com.app.ps19.tipsapp.defects.DefectsActivity;
import com.app.ps19.tipsapp.defects.PreviousDefectsMapActivity;
import com.app.ps19.tipsapp.inspection.InspectionActivity;
import com.app.ps19.tipsapp.reports.ReportShowActivity;

public class FileViewHolder extends TreeViewHolder {
    private ImageView imgPopupMenu;
    private TextView fileName;
    private ImageView fileStateIcon;
    private ImageView fileTypeIcon;
    private RelativeLayout itemTile;
    FragmentActivity activity;

    public FileViewHolder(@NonNull View itemView) {
        super(itemView);
        initViews();
    }

    private void initViews() {
        fileName = itemView.findViewById(R.id.file_name);
        fileStateIcon = itemView.findViewById(R.id.file_state_icon);
        fileTypeIcon = itemView.findViewById(R.id.file_type_icon);
        imgPopupMenu = itemView.findViewById(R.id.imgViewPopup);
        itemTile=itemView.findViewById(R.id.list_item_ug);
    }

    @Override
    public void bindTreeNode(TreeNode node) {
        super.bindTreeNode(node);
        final Equipment equipment=(Equipment) node.getValue();
        final Context context=equipment.getContext();
        activity=(FragmentActivity) context;
        //String extension = equipment.getEquipmentType().getEquipmentType();//fileNameStr.substring(dotIndex+1);
        String extension = equipment.getEquipmentType().getIconGroup();
        String fName=equipment.getName();//fileNameStr.substring(0,dotIndex);
        fName=fName.equals("")?equipment.getInterfaceString():fName;
        int extensionIcon = ExtensionTable.getEquipmentTypeIcon(extension);
        fileTypeIcon.setImageResource(extensionIcon);
        fileName.setText(fName);
        if(node.isSelected()){
            itemTile.setBackgroundColor( context.getResources().getColor(R.color.color_tile_selected));
        }else
        {
            itemTile.setBackgroundColor( context.getResources().getColor(R.color.design_default_color_background));
        }
        if (node.getChildren().isEmpty()) {
            fileStateIcon.setVisibility(View.INVISIBLE);
        } else {
            fileStateIcon.setVisibility(View.VISIBLE);
            int stateIcon = node.isExpanded() ? R.drawable.ic_arrow_down : R.drawable.ic_arrow_right;
            fileStateIcon.setImageResource(stateIcon);
        }
        imgPopupMenu.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                PopupMenu popup=new PopupMenu( equipment.getContext(),imgPopupMenu);
                popup.getMenuInflater()
                        .inflate(R.menu.popup_menu_equipment,popup.getMenu());
                if(equipment.getAttributes().size() == 0){
                    popup.getMenu().getItem(1).setVisible(false);
                }
                if(equipment.getEquipmentType().getFormList().size() == 0){
                    popup.getMenu().getItem(0).setVisible(false);
                }

                popup.setOnMenuItemClickListener(new PopupMenu.OnMenuItemClickListener() {
                    @Override
                    public boolean onMenuItemClick(MenuItem item) {

                        switch (item.getItemId()) {
                            case R.id.mnuEquipmentForms:
                                if (equipment.getEquipmentType().getFormList().size() > 0) {
                                    AppFormDialogFragment dialogFragment = new AppFormDialogFragment(equipment);
                                    dialogFragment.show( activity.getSupportFragmentManager(), "appFormDialog");
                                } else {
                                    Toast.makeText(context, context.getString(R.string.no_form_available), Toast.LENGTH_SHORT).show();
                                }

                                //break;
                                //Toast.makeText(equipment.getContext(), "Forms of "+equipment.getName(), Toast.LENGTH_SHORT).show();
                                return true;
                            case R.id.mnuReportDefect:
                                setSelectedEquipment(equipment);
                                Globals.selectedReport = null;
                                Globals.newReport = new Report();
                                Globals.issueTitle = "";
                                Globals.selectedCategory = Globals.selectedReportType;
                                Intent intent = new Intent(activity, ReportAddActivity.class);
                                try {
                                    //onDefectActivityLaunch.launch(intent);
                                    activity.startActivity(intent);
                                } catch (Exception e) {
                                    e.printStackTrace();
                                }
                                return true;
                            case R.id.mnuAttributes:
                                if(equipment.getAttributes().size()==0){
                                    Toast.makeText(context, "No Attributes", Toast.LENGTH_SHORT).show();
                                    return false;
                                }
                                EquipmentDialogFragment dialogFragment = new EquipmentDialogFragment(equipment.getAttributes());

                                Bundle bundle = new Bundle();
                                bundle.putBoolean("notAlertDialog", true);

                                dialogFragment.setArguments(bundle);
                                FragmentTransaction ft = activity.getSupportFragmentManager().beginTransaction();
                                Fragment prev = activity.getSupportFragmentManager().findFragmentByTag("dialog");
                                if (prev != null) {
                                    ft.remove(prev);
                                }
                                ft.addToBackStack(null);
                                dialogFragment.show(ft, "dialog");

                                //Toast.makeText(equipment.getContext(), "Attributes of "+equipment.getName(), Toast.LENGTH_SHORT).show();
                                break;

                        }

                        return false;
                    }
                });
                popup.show();

            }
        });
    }
}

