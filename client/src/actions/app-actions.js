// Change the date to "MM dd, yyyy" format
export const toDateString = (date) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleString("en-US", options);
};

// Change the date to "MM dd, yyyy, " format
export const toDateTimeString = (date) => {
  const options = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleString("en-US", options);
};
