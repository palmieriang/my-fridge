import moment from 'moment';

export function convertToISODateString(dateString) {
  const date = moment(dateString, 'D MMM YYYY');

  return date.toISOString();
}

export function convertToCustomFormat(isoString) {
  const date = new Date(isoString);
  const options = { day: 'numeric', month: 'short', year: 'numeric' };

  return date.toLocaleDateString('en-GB', options);
}

export function daysUntilDate(dateString) {
  const date = moment(dateString, 'D MMM YYYY');
  const today = moment();
  const difference = date.diff(today, 'days');

  return difference;
}