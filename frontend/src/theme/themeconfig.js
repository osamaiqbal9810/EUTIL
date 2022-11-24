import _ from 'lodash'
import {versionInfo} from '../components/MainPage/VersionInfo';

// Image Array Object List.

let sideBarTimpsImage = require('images/SideBarImage.jpg')
let topBarBackground = require('images/topBarBackground.png')
const imageList = [
  { componentName: 'SideNavBar', timps: sideBarTimpsImage, lamp: null },
  { componentName: 'TopBarViewBackground', timps: topBarBackground, lamp: null }
]

export function getImageOf (compName) {

  let timpsModule = true;

   if(versionInfo.isLoaded()) //todo fix dependancy 
     timpsModule = !versionInfo.isLAMP();

  let image = ''
  let result = _.find(imageList, { componentName: compName })
  if (result) {
    if (timpsModule) {
      image = result.timps
    } else {
      image = result.lamp
    }
  }
  return image
}
