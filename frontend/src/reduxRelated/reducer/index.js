import { combineReducers } from "redux";
import loginReducer from "./loginReducer.js";
import userReducer from "./userReducer";
import mainPageReducer from "./mainPageReducer.js";
import ajaxStatusReducer from "./ajaxStatusReducer.js";
import filterTableReducer from "./filterTableReducer.js";
import { commonReducers } from "reduxCURD/reducer.js";
import diagnosticsReducer from "./diagnosticsReducer.js";
import sodReducer from "./sodReducer.js";
import imgReducer from "./imgReducer.js";
import docsReducer from "./docsReducer.js";
import utilReducer from "./utilReducer.js";
import templateHelperReducer from "./templateHelperReducer.js";
import assetGroupHelperReducer from "./assetGroupHelperReducer.js";
import assetHelperReducer from "./assetHelperReducer.js";
import runHelperReducer from "./runHelperReducer.js";
import lineSelectionReducer from "./lineSelectionReducer";
import languageHelperReducer from "./languageHelperReducer";
import inspectionHelperReducer from "./inspectionHelperReducer";
import dashboardHelperReducer from "./dashboardHelperReducer";
import forgotPasswordReducer from "./forgotPasswordReducer";
import filterStateReducer from "./filterStateReducer";
const rootReducer = combineReducers({
  ...commonReducers,
  loginReducer,
  forgotPasswordReducer,
  userReducer,
  ajaxStatusReducer,
  mainPageReducer,
  diagnosticsReducer,
  filterTableReducer,
  sodReducer,
  imgReducer,
  docsReducer,
  utilReducer,
  templateHelperReducer,
  assetGroupHelperReducer,
  assetHelperReducer,
  runHelperReducer,
  lineSelectionReducer,
  languageHelperReducer,
  inspectionHelperReducer,
  dashboardHelperReducer,
  filterStateReducer,
});

export default rootReducer;
