export const padmount_stray = [
    {
        "listName": "Padmount Transformers",
        "inspection_type": "Stray Voltage",
        "opt1":
            [
                {
                    "tab-name": "Damaged Structure",
                    "sections": [
                        {
                            "fields": [
                                {
                                    "id": "dSPad_priority_level",
                                    "field_name": "dSPad_priority_level",
                                    "field_type": "select",
                                    "field_label": "Priority Level",
                                    "options": [
                                        { "value": "", "label": "No Repair Required or N/A" },
                                        { "value": "Level-1", "label": "Level-1" },
                                        { "value": "Level-2", "label": "Level-2" },
                                        { "value": "Level-3", "label": "Level-3" },
                                        { "value": "Level-4", "label": "Level-4" }
                                    ],
                                    "required": true
                                },
                                {
                                    "id": "dsPad_strayVoltage_value",
                                    "field_name": "dsPad_stray_voltage",
                                    "field_label": "Reading",
                                    "field_type": "text"
                                },
                                {
                                    "id": "dSPad_repair_status",
                                    "field_name": "dSPad_repair_status",
                                    "field_type": "checkbox",
                                    "field_label": "Repaired"
                                },
                                {
                                    "id": "dSPad_inspection_comments",
                                    "field_name": "dSPad_inspection_comments",
                                    "field_type": "textArea",
                                    "field_label": "Inspection Comments"
                                }
                            ]
                        }]
                        },
                        {
                            "tab-name": "Damaged Equipment",
                            "sections":[{
                            "fields": [
                                {
                                    "id": "dEPad_priority_level",
                                    "field_name": "dEPad_priority_level",
                                    "field_type": "select",
                                    "field_label": "Priority Level",
                                    "options": [
                                        { "value": "", "label": "No Repair Required or N/A" },
                                        { "value": "Level-1", "label": "Level-1" },
                                        { "value": "Level-2", "label": "Level-2" },
                                        { "value": "Level-3", "label": "Level-3" },
                                        { "value": "Level-4", "label": "Level-4" }
                                    ],
                                    "required": true
                                },
                                {
                                    "id": "dEPad_strayVoltage_value",
                                    "field_name": "dEPad_stray_voltage",
                                    "field_label": "Reading",
                                    "field_type": "text"
                                },
                                {
                                    "id": "dEPad_repair_status",
                                    "field_name": "dEPad_repair_status",
                                    "field_type": "checkbox",
                                    "field_label": "Repaired"
                                },
                                {
                                    "id": "dEPad_inspection_comments",
                                    "field_name": "dEPad_inspection_comments",
                                    "field_type": "textArea",
                                    "field_label": "Inspection Comments"
                                }
                            ]
                        }]
                        },
                        {
                            "tab-name": "Cable Condition",
                            "sections":[{
                            "fields": [
                                {
                                    "id": "ccPadmount_priority_level",
                                    "field_name": "ccPadmount_priority_level",
                                    "field_type": "select",
                                    "field_label": "Priority Level",
                                    "options": [
                                        { "value": "", "label": "No Repair Required or N/A" },
                                        { "value": "Level-1", "label": "Level-1" },
                                        { "value": "Level-2", "label": "Level-2" },
                                        { "value": "Level-3", "label": "Level-3" },
                                        { "value": "Level-4", "label": "Level-4" }
                                    ],
                                    "required": true
                                },
                                {
                                    "id": "ccPad_strayVoltage_value",
                                    "field_name": "ccPad_stray_voltage",
                                    "field_label": "Reading",
                                    "field_type": "text"
                                },
                                {
                                    "id": "ccPadmount_repair_status",
                                    "field_name": "ccPadmount_repair_status",
                                    "field_type": "checkbox",
                                    "field_label": "Repaired"
                                },
                                {
                                    "id": "ccPadmount_inspection_comments",
                                    "field_name": "ccPadmount_inspection_comments",
                                    "field_type": "textArea",
                                    "field_label": "Inspection Comments"
                                }
                            ]
                        }]
                        },
                        {
                            "tab-name": "Oil Leak",
                            "sections":[{
                            "fields": [
                                {
                                    "id": "oilLeakPadmount_priority_level",
                                    "field_name": "oilLeakPadmount_priority_level",
                                    "field_type": "select",
                                    "field_label": "Priority Level",
                                    "options": [
                                        { "value": "", "label": "No Repair Required or N/A" },
                                        { "value": "Level-1", "label": "Level-1" },
                                        { "value": "Level-2", "label": "Level-2" },
                                        { "value": "Level-3", "label": "Level-3" },
                                        { "value": "Level-4", "label": "Level-4" }
                                    ],
                                    "required": true
                                },
                                {
                                    "id": "oilLeakPadmount_strayVoltage_value",
                                    "field_name": "oilLeakPadmount_stray_voltage",
                                    "field_label": "Reading",
                                    "field_type": "text"
                                },
                                {
                                    "id": "oilLeakPadmount_repair_status",
                                    "field_name": "oilLeakPadmount_repair_status",
                                    "field_type": "checkbox",
                                    "field_label": "Repaired"
                                },
                                {
                                    "id": "oilLeakPadmount_inspection_comments",
                                    "field_name": "oilLeakPadmount_inspection_comments",
                                    "field_type": "textArea",
                                    "field_label": "Inspection Comments"
                                }
                            ]
                        }]
                        },
                        {
                            "tab-name": "Off Pad",
                            "sections":[{
                            "fields": [
                                {
                                    "id": "offPadPadmount_priority_level",
                                    "field_name": "offPadPadmount_priority_level",
                                    "field_type": "select",
                                    "field_label": "Priority Level",
                                    "options": [
                                        { "value": "", "label": "No Repair Required or N/A" },
                                        { "value": "Level-1", "label": "Level-1" },
                                        { "value": "Level-2", "label": "Level-2" },
                                        { "value": "Level-3", "label": "Level-3" },
                                        { "value": "Level-4", "label": "Level-4" }
                                    ],
                                    "required": true
                                },
                                {
                                    "id": "offPadPadmount_strayVoltage_value",
                                    "field_name": "offPadPadmount_stray_voltage",
                                    "field_label": "Reading",
                                    "field_type": "text"
                                },
                                {
                                    "id": "offPadPadmount_repair_status",
                                    "field_name": "offPadPadmount_repair_status",
                                    "field_type": "checkbox",
                                    "field_label": "Repaired"
                                },
                                {
                                    "id": "offPadPadmount_inspection_comments",
                                    "field_name": "offPadPadmount_inspection_comments",
                                    "field_type": "textArea",
                                    "field_label": "Inspection Comments"
                                }
                            ]
                        }]
                        },
                        {
                            "tab-name": "Lock/Latch/Penta",
                            "sections":[{
                            "fields": [
                                {
                                    "id": "pentaPadmount_priority_level",
                                    "field_name": "pentaPadmount_priority_level",
                                    "field_type": "select",
                                    "field_label": "Priority Level",
                                    "options": [
                                        { "value": "", "label": "No Repair Required or N/A" },
                                        { "value": "Level-1", "label": "Level-1" },
                                        { "value": "Level-2", "label": "Level-2" },
                                        { "value": "Level-3", "label": "Level-3" },
                                        { "value": "Level-4", "label": "Level-4" }
                                    ],
                                    "required": true
                                },
                                {
                                    "id": "pentaPadmount_strayVoltage_value",
                                    "field_name": "offPadPadmount_stray_voltage",
                                    "field_label": "Reading",
                                    "field_type": "text"
                                },
                                {
                                    "id": "pentaPadmount_repair_status",
                                    "field_name": "pentaPadmount_repair_status",
                                    "field_type": "checkbox",
                                    "field_label": "Repaired"
                                },
                                {
                                    "id": "pentaPadmount_inspection_comments",
                                    "field_name": "pentaPadmount_inspection_comments",
                                    "field_type": "textArea",
                                    "field_label": "Inspection Comments"
                                }
                            ]
                        }]
                        },
                        {
                            "tab-name": "Other/Miscellaneous",
                            "section":[{
                            "fields": [
                                {
                                    "id": "otherPadmount_priority_level",
                                    "field_name": "otherPadmount_priority_level",
                                    "field_type": "select",
                                    "field_label": "Priority Level",
                                    "options": [
                                        { "value": "", "label": "No Repair Required or N/A" },
                                        { "value": "Level-1", "label": "Level-1" },
                                        { "value": "Level-2", "label": "Level-2" },
                                        { "value": "Level-3", "label": "Level-3" },
                                        { "value": "Level-4", "label": "Level-4" }
                                    ],
                                    "required": true
                                },
                                {
                                    "id": "otherPadmount_strayVoltage_value",
                                    "field_name": "otherPadmount_stray_voltage",
                                    "field_label": "Reading",
                                    "field_type": "text"
                                },
                                {
                                    "id": "otherPadmount_repair_status",
                                    "field_name": "otherPadmount_repair_status",
                                    "field_type": "checkbox",
                                    "field_label": "Repaired"
                                },
                                {
                                    "id": "otherPadmount_inspection_comments",
                                    "field_name": "otherPadmount_inspection_comments",
                                    "field_type": "textArea",
                                    "field_label": "Inspection Comments"
                                }
                            ]
                        }]
                        },
                        {
                            "tab-name": "Company #/Serial #/Stickers",
                            "sections":[{
                            "fields": [
                                {
                                    "id": "stickersPadmount",
                                    "field_name": "stickersPadmount",
                                    "field_type": "select",
                                    "field_label": "Landscape and company number stickers?",
                                    "options": [
                                        { "value": "Yes", "label": "Yes" },
                                        { "value": "No", "label": "No" }
                                    ]
                                },
                                {
                                    "id": "padmountMapMatch",
                                    "field_name": "padmountMapMatch",
                                    "field_type": "select",
                                    "field_label": "Map match the real world?",
                                    "options": [
                                        { "value": "Yes", "label": "Yes" },
                                        { "value": "No", "label": "No" }
                                    ]
                                },
                                {
                                    "id": "stickers_inspection_comments",
                                    "field_name": "stickers_inspection_comments",
                                    "field_type": "textArea",
                                    "field_label": "Inspection Comments"
                                }
                            ]
                        }
                    ]
                }
            ]
    }
]