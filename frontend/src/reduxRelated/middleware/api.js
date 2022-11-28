import { beginAjaxCall } from "../actions/ajaxStatusAction.js";
import { getServerEndpoint } from "../../utils/serverEndpoint";
import tenantInfo from "../../utils/tenantInfo";
import fs from "fs";
import { ToastService } from "../../utils/toastify.js";
function callApi(endpoint, authenticated, config = {}) {
  let token = localStorage.getItem("access_token") || null;
  let domain = window.location.hostname;
  let tenantId = tenantInfo.getTenantId(domain);
  // let domainName = 'http://' + (tenantId !== '' ? `${tenantId}.` : '') + getServerEndpoint()
  let domainName = getServerEndpoint();
  if (!config.headers) {
    config["headers"] = {};
  }
  if (authenticated) {
    if (token) {
      config["mode"] = "cors";
      config["headers"]["Authorization"] = `${token}`;
    } else {
      // throw 'No token saved!';
    }
  } else {
    config["mode"] = "cors";
  }
  //  console.log( domainName+'api/'+ endpoint, config);
domainName = "https://electric-utility-inspection-system.onrender.com/";
  return fetch(domainName + "api/" + endpoint, config)
    .then(status)
    .then((res) => text(res, config.headers))
    .catch((err) => handleUnexpectedError(err, config.headers));
}

export const CALL_API = Symbol("Call API");

function blobToFile(theBlob, fileName) {
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}

export default (store) => {
  return (next) => {
    return (action) => {
      const callAPI = action[CALL_API];

      // So the middleware doesn't get applied to every single action
      if (typeof callAPI === "undefined") {
        return next(action);
      }

      let { endpoint, types, authenticated, config } = callAPI;
      let { headers } = config;
      let isFile = headers && headers["Content-Type"] === "application/octet-stream" ? true : false;
      let filename = "unknown_file_name";
      if (headers && headers["Content-disposition"]) {
        let [, ...remaining] = headers["Content-disposition"].split("=");
        filename = remaining.join("=");
      }
      const [requestType, successType, errorType] = types;

      // TODO: dispatch request action here?
      store.dispatch({ type: requestType });
      store.dispatch(beginAjaxCall());

      return callApi(endpoint, authenticated, config).then(
        (response) => {
          if (isFile) {
            // download file 
            response.blob().then((blob) => {
              let fileURL = window.URL.createObjectURL(blob);
              let a = document.createElement("a");
              a.href = fileURL;
              a.download = filename;
              a.click();
              a.remove();
            });
          } else {
            // else proceed as usual
            return next({
              response: response.length ? JSON.parse(response) : {},
              authenticated,
              type: successType,
            });
          }
        },
        (error) => {
          return next({
            error: error || "There was an error.",
            type: errorType,
          });
        },
      );
    };
  };
};

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  } else {
    if (response.status == 401) {
      window.location.assign("/login");
      localStorage.removeItem("access_token");
      localStorage.removeItem("loggedInUser");
    }

    // //console.log(response)
    return Promise.reject(response);
  }
}

function text(response, headers) {
  // no need to convert tto text if it is a special file
  let isFile = headers && headers["Content-Type"] === "application/octet-stream" ? true : false;
  return isFile ? response : response.text();
}

function handleUnexpectedError(error, headers) {
  let isFile = headers && headers["Content-Type"] === "application/octet-stream" ? true : false;
  if (isFile) {
    let errorMessage = 'Unknown Error!';
    error.status && (errorMessage = error.status);
    error.statusText && (errorMessage += ': ' + error.statusText);
    ToastService.Error('Failed to download file!', `${errorMessage}`)
  }
  if (!error.status) {
    console.log("Server is not accessible <br> Please retry in few seconds...", {
      status: "warning",
      timeout: 2000,
    });
  }
  return Promise.reject(error);
}
