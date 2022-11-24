export const isValidJsonString = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

export const processFileExtension = extension => {
    switch (extension) {
        case 'docx' :
        case 'doc' :
            extension = 'doc';
            break;
        case 'csv':
        case 'xlsx':
        case 'xls':
            extension = 'xls';
            break;
        case 'pdf':
            extension = 'pdf';
            break;
        default:
            extension = 'none';
    }

    return extension;
};
