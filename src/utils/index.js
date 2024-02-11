import moment from "moment";

import { FRIDGE } from "../constants";

export function convertToISODateString(dateString) {
  const date = moment(dateString, "D MMM YYYY");

  return date.toISOString();
}

export function convertToCustomFormat(isoString) {
  const date = new Date(isoString);
  const options = { day: "numeric", month: "short", year: "numeric" };

  return date.toLocaleDateString("en-GB", options);
}

export function daysUntilDate(dateString) {
  const date = moment(dateString, "D MMM YYYY");
  const today = moment();
  const difference = date.diff(today, "days");

  return difference;
}

export const countExpiredItems = (productsList) => {
  if (!productsList.length) {
    return null;
  }

  let counter = null;
  for (let i = 0; i < productsList.length; i++) {
    if (productsList[i].place === FRIDGE) {
      const days = daysUntilDate(productsList[i].date);
      if (days < 0) {
        counter++;
      }
    }
  }
  return counter;
};
