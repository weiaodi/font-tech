function calender(str) {
  const match = str.match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/);

  return match;
}
const dateStrings = [
  '2025-05-19T12:30:00',
  '2025-05-19T09:45:30.123',
  '2025-05-19T23:59:59Z',
  '2025-05-19T14:20:00+08:00',
  '2025-05-19T03:15:45-05:00',
  '2025-05-19T18:00:00.500+02:30',
  '2025-05-19T06:45:15.999Z',
];
dateStrings.forEach((dateString) => {
  console.log(calender(dateString));
});
