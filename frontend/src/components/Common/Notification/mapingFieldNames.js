export function processAlertFieldMapping(text, require = 'key') {
    if (require === 'key') {
        let find = ALERT_FIELDS.find(af => af.text === text);
        if (find)
            text = find.key;
    } else if (require === 'text') {
        let find = ALERT_FIELDS.find(af => af.key === text);
        if (find)
            text = find.text;
    }

    return text;
}

export const ALERT_FIELDS = [
    {
        key: 'nextExpiryDate',
        text: 'Expiry Date',
    },
    {
        key: 'lastInspection',
        text: 'Inspection Date',
        exact: true
    },
    {
        key: 'rule2139bIssue',
        text: 'Rule 213.9(b) Issue 30day Expiry',
        isTemplate: true,
        disableRecalculate: true,
        title: `Issue "{issueTitle}" is approaching its 30 day maintenance expiry period against Rule 213.9(b)`,
        message: 'Issue "{issueTitle}" of Inspection "{modelTitle}" is approaching its 30 day maintenance expiry period against Rule 213.9(b) in {time}. Please take appropriate action'
    }
];
