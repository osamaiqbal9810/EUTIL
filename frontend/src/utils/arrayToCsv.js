import { readString } from "react-papaparse";
import { ToastService } from "./toastify";

export const arrayToCsv = (arr) => {
    let cols = [];
    let header = "";
    if (arr && arr.length > 0) {
        cols = Object.keys(arr[0])
        header = cols
            .map(val => String(val)) // convert every value to String
            .join(","); // comma-separated-and-line-separated
    }
    return (
        header +
        "\r\n" +
        arr
            .map(
                (row) =>
                    Object.keys(row)
                        .map((key) => row[key])
                        .map(String) // convert every value to String
                        .join(","), // comma-separated
            )
            .join("\r\n")
    ); // rows starting on new lines
}

export const csvToArray = (file, cb = (arr = []) => {}, header = true) => {
    if (file.type !== 'text/csv') {
        ToastService.Error('Error reading csv file')
        return;
    }
    let reader = new FileReader();
    let arr = [];
    reader.onload = () => {
        try {
            let csvData = reader.result;
            const results = readString(csvData);
            if (results.errors.length !== 0) {
                ToastService.Error('Error reading csv file')
            }
            else {
                let header = results.data[0];
                let rows = results.data.slice(1);
                arr = rows.map(row => header.reduce((obj, key, i) => {
                    obj[key] = row[i];
                    return obj;
                }, {}))
                cb && cb(arr);
            }

        } catch (e) {
            console.log("Error reading file:", e);
            ToastService.Error('Error reading csv file')
        }
    };
    reader.readAsText(file);
}