import moment from "moment";

export const formattedLastSeen = (lastSeenTimeStamp) => {
  return moment(lastSeenTimeStamp).calendar(null, {
    sameDay: "[Last seen today at] HH:mm a",
    lastDay: "[Last seen yesterday at] HH:mm a",
    lastWeek: "dddd [at] HH:mm a",
    sameElse: "DD/MM/YYYY [at] HH:mm a",
  });
};
