const fs = require("fs");
const util = require("util");
const fs_writeFile = util.promisify(fs.writeFile);
export async function DataExporterCSV(data, path, fileName) {
  let error = null;
  try {
    await fs_writeFile(`${path}${fileName}`, data);
  } catch (err) {
    error = err;
  }
  return error;
}
