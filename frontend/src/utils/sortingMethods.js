import moment from "moment";

export function generalSort(a, b) {
    let aVal = a.props.children;
    let bVal = b.props.children;
    if (aVal === bVal) {
        return 0;
    }
    const aReverse = aVal.split("").reverse().join("");
    const bReverse = bVal.split("").reverse().join("");
    return aReverse > bReverse ? 1 : -1;
}

export function dateSort(a, b){
    const a1 = new Date(a).getTime();
    const b1 = new Date(b).getTime();
    if(a1<b1)
        return 1;
    else if(a1>b1)
        return -1;
    else
        return 0;
}

export function dateSortArrayByField(arr, field, asc = false) {
    return arr.sort((a, b) => {
        let a1 = '';
        let b1 = '';

        if (asc) {
            a1 = new Date(b[field]).getTime();
            b1 = new Date(a[field]).getTime();
        } else {
            a1 = new Date(a[field]).getTime();
            b1 = new Date(b[field]).getTime();
        }

        if (a1 < b1) return 1;
        else if (a1 > b1) return -1;
        else return 0;
    });
}
