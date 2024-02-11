import moment from 'moment';

export function formatDate(dateString) {
  console.log("dateString ", dateString);
  const parsed = moment(new Date(dateString));

  if (!parsed.isValid()) {
    return dateString;
  }

  return parsed.format('D MMM YYYY');
}

export function daysUntilDate(dateString) {
  const date = moment(dateString, 'D MMM YYYY');
  const today = moment();
  const difference = date.diff(today, 'days');

  return difference;
}