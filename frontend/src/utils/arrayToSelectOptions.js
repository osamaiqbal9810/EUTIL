export const arrayToSelectOptions = (arr) => {
    let options = [{val: '', text: 'Select'}];
    arr.forEach(value => {
        options.push({val: value, text: value})        
    });
    return options;
}