import moment from "moment";

import { FRIDGE } from "../constants";

export function convertToISODateString(dateString) {
  // Handle both formats: YYYY-MM-DD (from Firestore) and "D MMM YYYY" (legacy/display)
  let date;

  // Check if it's already YYYY-MM-DD format (new Firestore format)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    date = moment(dateString, "YYYY-MM-DD");
  } else {
    // Legacy format: "D MMM YYYY"
    date = moment(dateString, "D MMM YYYY");
  }

  return date.toISOString();
}

export function convertToCustomFormat(isoString) {
  const date = new Date(isoString);
  const options = { day: "numeric", month: "short", year: "numeric" };

  return date.toLocaleDateString("en-GB", options);
}

export function convertToFirestoreFormat(dateString) {
  // Convert from custom format (e.g., "25 Aug 2025") to YYYY-MM-DD format
  const date = moment(dateString, "D MMM YYYY");

  if (!date.isValid()) {
    throw new Error(`Invalid date format: ${dateString}`);
  }

  return date.format("YYYY-MM-DD");
}

export function convertToDisplayFormat(dateString) {
  // Convert from YYYY-MM-DD format (Firestore) to display format "D MMM YYYY"
  let date;

  // Check if it's YYYY-MM-DD format (Firestore format)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    date = moment(dateString, "YYYY-MM-DD");
  } else {
    // Already in display format or other format
    date = moment(dateString, "D MMM YYYY");
  }

  return date.format("D MMM YYYY");
}

export function daysUntilDate(dateString) {
  // Handle both formats: YYYY-MM-DD (from Firestore) and "D MMM YYYY" (legacy/display)
  let targetDate;

  // Check if it's YYYY-MM-DD format (new Firestore format)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    targetDate = moment(dateString, "YYYY-MM-DD").startOf("day");
  } else {
    // Legacy format: "D MMM YYYY"
    targetDate = moment(dateString, "D MMM YYYY").startOf("day");
  }

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
