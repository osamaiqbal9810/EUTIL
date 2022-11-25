/**
 * Created by zqureshi on 6/27/2018.
 */
import _ from 'lodash'
export default function permissionCheck (resource, action) {
  const loggedInUser = localStorage.getItem('loggedInUser')

  let currentUser = null
  if (loggedInUser && loggedInUser !== 'undefined') {
    currentUser = JSON.parse(loggedInUser)
  }
  let check = false
  if (currentUser) {
    if (currentUser.userGroup) {
      if (currentUser.userGroup.permissions) {
        check = _.find(currentUser.userGroup.permissions, {
          resource,
          action
        })
      }
    }
  }
  return check;
}
