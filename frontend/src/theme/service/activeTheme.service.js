export function themeService(theme) {
  //debugger
  // if (theme) {
  //     localStorage.setItem("theme", theme)
  // } else if (localStorage.getItem("theme") === "") {
  //     localStorage.setItem("theme", "default")
  // }
  if (theme) {
    // return localStorage.getItem("theme")
    if (localStorage.getItem("theme") === "") {
      localStorage.setItem("theme", "default");
    }

    return theme[localStorage.getItem("theme")] ? theme[localStorage.getItem("theme")] : theme["default"];
  } else {
    return {};
  }
}
