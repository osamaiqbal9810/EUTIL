// returns date if params are valid, else return null
export const getTime = (time) => {
  let timeSplit = time.split(":");
  if (timeSplit.length === 3) {
    let date = new Date();
    try {
      date.setHours(parseInt(timeSplit[0]));
      date.setMinutes(parseInt(timeSplit[1]));
      date.setSeconds(parseInt(timeSplit[2]));
      return date;
    } 
    catch (e) {
    }
  }
  return null;
}