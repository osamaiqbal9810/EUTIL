export function fieldFromDescription (fieldname, fstring) {
  //  var fieldname = 'Description' // 'Longitude';

  let index1 = fstring.indexOf(fieldname)

  let index21 = fstring.indexOf('<td>', index1)

  let index22 = fstring.indexOf('</td>', index21)

  let sstring = fstring.substring(index21, index22)
  let finalString = sstring.replace('<td>', '')
  //console.log(' Found string value : ' + finalString)
  return finalString
}
