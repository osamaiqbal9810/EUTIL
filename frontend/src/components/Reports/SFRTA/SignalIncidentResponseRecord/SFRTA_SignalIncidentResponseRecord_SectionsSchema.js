const headerInlineStyle1 = {
    fontSize: "12px",
};
const headerInlineStyle2 = {
    fontSize: "12px",
    wordBreak: "break-word",
};

const SubTitleFormatterWithLogo = (title) => {
    return title;
}

export const SFRTA_SignalIncidentResponseRecord_NotificationSectionSchema = {
    heights: {
        header1: "50px",
    },
    minDataRowsCount: 4,
    columns: [
        {
            title: "WHO WAS NOTIFIED",
            colSpan: 5,
            rowSpan: 1,
            className: "tbl-text-normal",
            accessor: 'date'
        },
        {
            title: "NATURE OF NOTIFICATION",
            colSpan: 10,
            rowSpan: 1,
            className: "tbl-text-normal",
            accessor: 'authno'
        },
        {
            title: "TIME",
            colSpan: 5,
            rowSpan: 1,
            className: "tbl-text-normal",
            accessor: 'train'
        },

    ],

};


export const SFRTA_SignalIncidentResponseRecord_MaterialSectionSchema = {
    heights: {
        header1: "50px",
    },
    minDataRowsCount: 4,
    columns: [
        {
            title: "ITEM",
            colSpan: 10,
            rowSpan: 1,
            className: "tbl-text-normal",
            accessor: 'date'
        },
        {
            title: "QUANTITY",
            colSpan: 10,
            rowSpan: 1,
            className: "tbl-text-normal",
            accessor: 'authno'
        },

    ],
};
