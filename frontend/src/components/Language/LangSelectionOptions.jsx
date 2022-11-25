import React, { Component } from "react";
import { Link, Route } from "react-router-dom";
import { optionsTexts } from "components/SetupPage/options";
import "../../App.css";
import { setLanguage } from "reduxRelated/actions/langaugeHelperAction.js";
import { CRUDFunction } from "reduxCURD/container";
import { getAppMockupsTypes } from "reduxRelated/actions/diagnosticsActions";
import { setDynamicWords } from "Language/DynamicLanguage";
import moment from "moment";
import { basicColors, retroColors, electricColors } from "style/basic/basicColors";
import { themeService } from "theme/service/activeTheme.service";
import options from "./option";
class LangSelectionOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // options: [
      //   {
      //     name: "English",
      //     value: "en",
      //   },
      //   {
      //     name: "Español",
      //     value: "es",
      //   },
      //   { name: "French", value: "fr" },
      // ],
      value: localStorage.getItem("language"),
    };
  }

  componentDidMount() {
    // let lang = localStorage.getItem("language");
    // this.props.getAppMockupsTypes("DynamicLanguage_" + (lang ? lang : ""));
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.diagnosticsActionType !== prevProps.diagnosticsActionType &&
      this.props.diagnosticsActionType == "DYNAMIC_LANGUAGE_GET_SUCCESS"
    ) {
      //console.log("::" + this.props.dynamicLanguageList);
      setDynamicWords(this.props.dynamicLanguageList[0] ? this.props.dynamicLanguageList[0].opt1 : null);
      this.props.history.goBack();
    }
  }

  handleChange = (item) => {
    let selectedLang = item.value;
    this.setState({ value: selectedLang });
    window.location.reload(true);
    localStorage.setItem("language", selectedLang);
    this.props.setLanguage(selectedLang);
    this.props.getAppMockupsTypes("DynamicLanguage_" + selectedLang);
    moment.locale(selectedLang);
    console.log(selectedLang);
    this.props.history.push("/");
  };
  render() {
    return (
      <div
        className="App-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="langBox"
          style={{
            height: "auto",
            width: "250px",
            background: "var(--fifth)",
          }}
        >
          {options.options.map((item) => (
            <a
              onClick={(e) => {
                this.handleChange(item);
              }}
              key={item.value}
              className="btn btn-small btn-default"
              value={item.value}
              style={themeService({
                default: {
                  display: "block",
                  background: "#e3e9ef",
                  margin: "5px",
                  color: "var(--twelve)",
                  ":hover": {
                    background: "var(--first)",
                    color: "#e3e9ef",
                  },
                },
                retro: {
                  display: "block",
                  background: "#e3e9ef",
                  margin: "5px",
                  color: retroColors.second,
                  ":hover": {
                    background: retroColors.second,
                    color: "#e3e9ef",
                  },
                },
                electric: {
                  display: "block",
                  background: "#e3e9ef",
                  margin: "5px",
                  color: electricColors.second,
                  ":hover": {
                    background: electricColors.second,
                    color: "#e3e9ef",
                  },
                },
              })}
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    );
  }
}

let variables = {
  languageHelperReducer: {
    language: "",
  },
  diagnosticsReducer: { dynamicLanguageList: [] },
};

let actionOptions = {
  create: false,
  update: false,
  read: false,
  delete: false,
  others: {
    setLanguage,
    getAppMockupsTypes,
  },
};
let LangSelectionOptionsContainer = CRUDFunction(LangSelectionOptions, "languageSelectionOptions", actionOptions, variables, [
  "languageHelperReducer",
  "diagnosticsReducer",
]);
export default LangSelectionOptionsContainer;
