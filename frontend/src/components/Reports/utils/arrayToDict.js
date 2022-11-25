export const getArrayToDict = (arr, key) => {
    return arr.reduce((obj, item) => {
        item[key] && (obj[item[key]] = item);
        return obj;
    }, {});
}

export const getDictToArray = (dict) => {
    return Object.keys(dict).reduce((arr, key) => {
        arr.push(dict[key]);
        return arr;
    }, []);
}