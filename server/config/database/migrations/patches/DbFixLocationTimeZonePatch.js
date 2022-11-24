import { analyzePlannableLocationsTimeZone } from "../../../../dbAnalyzer/dbAnalyzerActions";

module.exports = {
  async apply() {
    console.log("Patch: Fix Location TimeZone values with default value in patch ");
    await analyzePlannableLocationsTimeZone(true);
  },
};
