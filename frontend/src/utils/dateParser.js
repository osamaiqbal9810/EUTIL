// Takes in Date in ISO 8601 Format
// returns date if params are valid, else return null
export const getDate = (isoDate) => {
  let date = new Date(isoDate);
  let dateTime = date.getTime();
  if (!isNaN(dateTime)) {
    return date;
  }
  
  return null;
}