export const getNormalizedDateString = (date) => {
  let dateObj = new Date(date);
  return dateObj.toLocaleDateString();
};
