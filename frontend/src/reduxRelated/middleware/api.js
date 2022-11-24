import { beginAjaxCall } from '../actions/ajaxStatusAction.js'
import { getServerEndpoint } from '../../utils/serverEndpoint'
import tenantInfo from '../../utils/tenantInfo'
function callApi (endpoint, authenticated, config = {}) {
  let token = localStorage.getItem('access_token') || null
  let domain = window.location.hostname
  let tenantId = tenantInfo.getTenantId(domain)
  // let domainName = 'http://' + (tenantId !== '' ? `${tenantId}.` : '') + getServerEndpoint()
  let domainName = 'http://' + getServerEndpoint()
  if (!config.headers) {
    config['headers'] = {}
  }
  if (authenticated) {
    if (token) {
      config['mode'] = 'cors'
      config['headers']['Authorization'] = `${token}`
    } else {
      // throw 'No token saved!';
    }
  } else {
    config['mode'] = 'cors'
  }
  //  console.log( domainName+'api/'+ endpoint, config);
console.log(domainName);
console.log(endpoint);
console.log(config);
  return fetch("https://electric-utility-inspection-system.onrender.com/" + 'api/' + endpoint, config)
    .then(status)
    .then(text)
    .catch(handleUnexpectedError)
}

export const CALL_API = Symbol('Call API')

export default store => {
  return next => {
    return action => {
      const callAPI = action[CALL_API]

      // So the middleware doesn't get applied to every single action
      if (typeof callAPI === 'undefined') {
        return next(action)
      }

      let { endpoint, types, authenticated, config } = callAPI

      const [requestType, successType, errorType] = types

      // TODO: dispatch request action here?
      store.dispatch({ type: requestType })
      store.dispatch(beginAjaxCall())

      return callApi(endpoint, authenticated, config).then(
        response => {
          return next({
            response: response.length ? JSON.parse(response) : {},
            authenticated,
            type: successType
          })
        },
        error => {
          return next({
            error: error || 'There was an error.',
            type: errorType
          })
        }
      )
    }
  }
}

function status (response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    if (response.status == 401) {
      window.location.assign('/login')
      localStorage.removeItem('access_token')
      localStorage.removeItem('loggedInUser')
    }

    // //console.log(response)
    return Promise.reject(response)
  }
}

function text (response) {
  return response.text()
}

function handleUnexpectedError (error) {
  if (!error.status) {
    console.log('Server is not accessible <br> Please retry in few seconds...', {
      status: 'warning',
      timeout: 2000
    })
  }
  return Promise.reject(error)
}
