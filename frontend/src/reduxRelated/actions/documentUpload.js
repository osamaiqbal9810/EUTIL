import * as types from '../ActionTypes/actionTypes.js'
import { CALL_API } from '../middleware/api'

export function uploadDocuments (document, uploadPathFolder) {
  let formData = new FormData();
  let apiPath = 'applicationresources/';
  let pathUpload = 'uploadsingle';

  if (uploadPathFolder) {
    apiPath = apiPath + uploadPathFolder
  } else {
    apiPath = apiPath + pathUpload
  }
  formData.append('file', document);
  const options = {
    headers: {
      processData: 'false',
      contentType: 'false',
      dataType: 'json',
      Accept: '*/*'
    },
    method: 'POST',
    body: formData
  };
  return {
    [CALL_API]: {
      endpoint: apiPath,
      authenticated: true,
      types: [types.DOCUMENT_UPLOAD_REQUEST, types.DOCUMENT_UPLOAD_SUCCESS, types.DOCUMENT_UPLOAD_FAILURE],
      config: options
    }
  }
}

export function loadAllDocuments (pathImgs) {
  const options = { headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, method: 'GET' };
  let pathFinal = 'applicationresources/';
  if (pathImgs) {
    pathFinal = pathFinal + pathImgs
  }

  return {
    [CALL_API]: {
      endpoint: pathFinal,
      authenticated: true,
      types: [types.DOCUMENTS_LOAD_REQUEST, types.DOCUMENTS_LOAD_SUCCESS, types.DOCUMENTS_LOAD_FAILURE],
      config: options
    }
  }
}
