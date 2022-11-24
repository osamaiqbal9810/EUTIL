export const MODAL_TYPES = {
    ADD: 'addModal',
    EDIT: 'editModal',
    VIEW: 'viewModal',
    DELETE: 'deleteModal',
    WARNING: 'warning',
    NONE: 'none'
};

export const FORM_SUBMIT_TYPES = {
    ADD: 'add',
    EDIT: 'edit'
};

export const MILEPOST_VARS = {
    MIN: 0,
    MAX: 9999
};

export const FORM_MODES = {
    BASE: 'base',
    SELECTION: 'selection',
    IMAGE_GALLERY: 'imageGallery',
    DOCUMENT_SELECTION: 'documentSelection',
    IMAGE_SELECTION: 'imageSelection',
};

const DynamicUserGroupChangedKeys = {
    Role: 'group_id',
    Department: 'department'
};

export const mapDynamicUserGroupsName = (key) => {
    if (key in DynamicUserGroupChangedKeys) {
        return DynamicUserGroupChangedKeys[key];
    }

    return key;
};
