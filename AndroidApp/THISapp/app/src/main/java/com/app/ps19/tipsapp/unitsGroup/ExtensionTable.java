package com.app.ps19.tipsapp.unitsGroup;

import com.app.ps19.tipsapp.R;

public class ExtensionTable {

    public static int getExtensionIcon(String extension) {
        switch (extension) {
            /*case ".c": return R.drawable.ic_c;
            case ".cpp": return R.drawable.ic_cpp;
            case ".cs": return R.drawable.ic_cs;
            case ".git": return R.drawable.ic_git;
            case ".go": return R.drawable.ic_go;
            case ".gradle": return R.drawable.ic_gradle;
            case ".java": return R.drawable.ic_java;*/
            default: return R.drawable.ic_file;
        }
    }
    public static int getEquipmentTypeIcon(String equipmentType){
        //Log.d("ExtensionTable:ET:",equipmentType);
        if(equipmentType!=null) {
            switch (equipmentType) {
                case "port":
                    return R.drawable.icons8_usb_type_c_64;
                case "slot":
                    return R.drawable.icons8_memory_slot_24;
                case "card":
                    return R.drawable.icons8_slot_card_48;
                case "software":
                    return R.drawable.icons8_save_30;
                case "software-exe":
                    return R.drawable.icons8_processor_64;
                case "relay":
                    return R.drawable.icons8_relay_64;
                case "rj45":
                    return R.drawable.icons8_rj45;
                case "box":
                    return R.drawable.icon8_box;
                default:
                    return R.drawable.ic_file;
            }
        }else{
            return R.drawable.ic_file;
        }
    }
}
