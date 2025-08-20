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
  const targetDate = moment(dateString, "D MMM YYYY").startOf("day");
  const today = moment().startOf("day");

  const diffDays = targetDate.diff(today, "days");

  return diffDays;
}

export const countExpiredItems = (productsList) => {
  if (!productsList.length) {
    return null;
  }

  return productsList.filter(
    ({ place, date }) => place === FRIDGE && daysUntilDate(date) < 0,
  ).length;
};
