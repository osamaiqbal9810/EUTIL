export const basicColors = {
  first: "rgb(55, 139, 119)" /*Theme Colors*/,
  second: "rgb(227, 233, 239 )" /*Theme Background Colors*/,
  third: "rgb(209, 209, 209)" /*Theme Border Colors*/,
  fourth: "#fff" /*Default color, Normal text color with Dark Background*/,
  fifth: "rgb(94, 141, 143)",
};
export const retroColors = {
  first: "rgb(139, 196, 63)" /*Link and Hover background as well as BorderColor*/,
  second: "rgb(26, 26, 26)" /*Text Color*/,
  third: "rgb(77, 77, 77)" /*Icon Colors*/,
  fourth: "#b1b1b1" /*second Color for Buttons and Table Headings*/,
  fifth: "#fff" /*Sidebar background color*/,
  sixth: "rgb(27,20,100)" /*Top Bar Background*/,
  seventh: "rgb(177, 177, 177)" /*Table cell Color*/,
  eight: "rgb(0,113,186)" /*Calender number Color*/,
  nine: "rgb(200, 222 ,188)" /*"rgba(138,196,63,.3)" Calender background Color*/,
  ten: "rgb(102,102,102)" /*Calender Line Color*/,
  eleventh: "rgb(227, 233, 239 )",
  twelve: "rgb(139, 196, 63)"

};
export const electricColors = {
  first: "rgba(64, 118, 179,.5)" /* #ffff sidebar BorderColor*/,
  second: "rgb(	24, 61, 102)" /*Text Color, Hover Color*/,
  third: "rgba(24, 61, 102)" /*Icon Colors*/,
  fourth: "#EDEDED" /*second Color for Buttons and Table Headings*/,
  fifth: "rgb(255,255,255)" /*Sidebar background color*/,/*"#9ABFEA"*/
  sixth: "#4076B3" /*Top Bar Background*/,
  seventh: "rgb(235,235,235)" /*Table cell Color*/,
  eight: "rgb(255,140,73)" /*Calender number Color*/,
  nine: "rgba(40,61,104,.3)" /*Calender background Color*/,
  ten: "rgb(102,102,102)" /*Calender Line Color**/,
  eleventh: "rgb(227, 233, 239 )",
  twelve: "rgb(64 118 179)",
};
const colorNames = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eight", "nine", "ten", "eleventh", "twelve"];
export function updateThemeColors() {
  colorNames.forEach((name) => {
    let CName = "--" + name;
    let Cprop = electricColors[name];
    document.documentElement.style.setProperty(CName, Cprop);
   // console.log(CName, Cprop);
  });
}