// export const colors = {
//     first: '#A6A8AB',
//     second: '#25A9E0',
//     third: '#37B34A',
//     fourth: "#EC1C24",
//     fifth: "#F6921E",
//     sixth: "#F6921E",
//     seventh: "#C38A48"//rgb(195, 138, 72)
// };
export const colors = {
  default: {
    first: "#A6A8AB",
    second: "#25A9E0",
    third: "#37B34A",
    fourth: "#EC1C24",
    fifth: "#F6921E",
    sixth: "#F6921E",
    seventh: "#C38A48", //rgb(195, 138, 72)
    total: "rgb(64, 118, 179)",
  },
  retro: {
    total: "#c2976c",
    second: "#e02c49",
    third: "#f69220",
    fourth: "#40a7f4",
    fifth: "#3ab34a",
    sixth: "#808080",
    seventh: "#C38A48", //rgb(195, 138, 72)}
  },
};

export function getColorsArray() {
  let colArray = [];
  let activeTheme = localStorage.getItem("theme") ? localStorage.getItem("theme") : "default";
  let colorKeys = Object.keys(colors[activeTheme]);

  for (let key of colorKeys) {
    colArray.push(colors[activeTheme][key]);
  }

  return colArray;
}
