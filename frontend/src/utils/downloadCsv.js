export const downloadCsv = (csv, doc, filename) => {
    var hiddenElement = doc.createElement("a");
    var universalBOM = "\uFEFF";
    hiddenElement.href = "data:text/csv; charset=utf-8," + encodeURIComponent(universalBOM+csv);
    hiddenElement.target = "_blank";
    // provide the name for the CSV file to be downloaded
    hiddenElement.download = `${filename}.csv`;
    hiddenElement.click();
}