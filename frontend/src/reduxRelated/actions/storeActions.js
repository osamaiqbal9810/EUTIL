import * as types from '../ActionTypes/actionTypes.js'

export function clearStore () {
  return {
    type: types.CLEAR_STORE_DATA
  }
}
