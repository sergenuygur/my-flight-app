export const getNormalizedDateString = (date) => {
  let dateObj = new Date(date);
  return dateObj.toString().substr(16, 5);
};
