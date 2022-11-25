const fs = require("fs");
const path = require("path");
const CONFIG_PATH = "config.json";
const fileExtensions = ["java", "xml", "gradle"];
let config = null;
// Load configs

var copyRecursiveSync = function (src, dest) {
  var exists = fs.existsSync(src);
  var stats = exists && fs.statSync(src);
  var isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (path.basename(src) === config.sourcePackageName) {
      dest = path.join(path.dirname(dest), config.targetPackageName);
      //console.log(config.targetPackageName);
    }
    if (config.ignoreFolders.indexOf(path.basename(src)) > -1) {
      return;
    }
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }

    fs.readdirSync(src).forEach(function (childItemName) {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    if (fs.existsSync(dest)) {
      fs.unlinkSync(dest);
    }
    let ext = path.extname(src).replace(".", "");
    if (fileExtensions.indexOf(ext) > -1) {
      processFile(src, dest);
    } else {
      fs.copyFileSync(src, dest);
    }
  }
};
function processFile(srcFile, targetFile) {
  let data = fs.readFileSync(srcFile, { encoding: "utf8", flag: "r" });
  let result = data.replace(
    new RegExp(config.sourcePackage, "g"),
    config.targetPackage
  );
  //we can write more replacement code here
  //
  if (path.basename(srcFile) === "Globals.java") {
    if (config.sourcePackageType === "TIMPS") {
      result = result.replace(
        new RegExp(
          `public static AppName appName = AppName.${config.sourcePackageType};`,
          "i"
        ),
        `public static AppName appName = AppName.${config.targetPackageType};`
      );
    }
  } else if(path.basename(srcFile) === "AndroidManifest.xml"){
	  if (config.sourcePackageType === "TIMPS") {
      result = result.replace(
        new RegExp(
          `android:icon="@mipmap/ic_launcher_timps_foreground"`,
          "i"
        ),
        (config.targetPackageType === "EUIS")?
		`android:icon="@mipmap/ic_launcher_euis_foreground"`: `android:icon="@mipmap/ic_launcher_site_foreground"`
      );
	  result = result.replace(
        new RegExp(
          `android:roundIcon="@mipmap/ic_launcher_timps_round"`,
          "i"
        ),
        (config.targetPackageType === "EUIS")?
		`android:roundIcon="@mipmap/ic_launcher_euis_round"`: `android:roundIcon="@mipmap/ic_launcher_site_round"`
      );
    }
	  
  } else if (path.basename(srcFile) === "strings.xml") {
    if (config.sourcePackageType === "TIMPS") {
      result = result.replace(
        new RegExp(
          `TIMPS`,
          "g"
        ),
		(config.targetPackageType === "EUIS")?
        `EUIS`:`SITE`
      );
    }
  } else if (path.basename(srcFile) === "colors.xml") {
    if (config.sourcePackageType === "TIMPS" && config.targetPackageType === "EUIS") {
      result = result.replace(
        new RegExp(
		`<color name="title_background">#8CC63E</color>`),
          `<color name="title_background">#71CCFD</color>`);
		  result = result.replace(
        new RegExp(
		`<color name="title_text">#1A1A18</color>`),
          `<color name="title_text">#303A26</color>`);
		  result = result.replace(
        new RegExp(
		`<color name="tile_divider">#B9D694</color>`),
          `<color name="tile_divider">#1976D2</color>`);
		  result = result.replace(
        new RegExp(
		`<color name="grad_start">#E9B9D694</color>`),
          `<color name="grad_start">#CD71CCFD</color>`);
		  result = result.replace(
        new RegExp(
		`<color name="grad_mid">#2D5505</color>`),
          `<color name="grad_mid">#1976D2</color>`);
		  result = result.replace(
        new RegExp(
		`<color name="grad_end">#E9B9D694</color>`),
          `<color name="grad_end">#CD71CCFD</color>`);
		  result = result.replace(
        new RegExp(
		`<color name="divider_color">#6376BE2F</color>`),
          `<color name="divider_color">#1976D2</color>`);
		  result = result.replace(
        new RegExp(
		`<color name="issue_row_background">#41B9D694</color>`),
          `<color name="issue_row_background">#7271CCFD</color>`);
		  result = result.replace(
        new RegExp(
		`<color name="titleColor">#A5D6A7</color>`),
          `<color name="titleColor">#CD71CCFD</color>`);
		  result = result.replace(
        new RegExp(
		`<color name="titleColor1">#E8F5E9</color>`),
          `<color name="titleColor1">#F8B3E1FA</color>`);
    }
  }  
  fs.writeFileSync(targetFile, result, { encoding: "utf8", flags: "w" });
}
try {
  const data = fs.readFileSync(CONFIG_PATH, "utf8");
  config = JSON.parse(data);
  let strSourcePackage = config.sourcePackage.split(".");
  config.sourcePackageName = strSourcePackage[strSourcePackage.length - 1];
  let strTargetPackage = config.targetPackage.split(".");
  config.targetPackageName = strTargetPackage[strTargetPackage.length - 1];

  console.log("Please wait...");
  copyRecursiveSync(config.source, config.target);
  console.log("Done");
} catch (err) {
  console.error(err);
}
