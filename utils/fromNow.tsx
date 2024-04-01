import moment from "moment";
export const calculateTimeAgo = (createTime: Date) => {
  const createTimeMoment = moment.utc(createTime).local();
  const now = moment();
  const minutesAgo = now.diff(createTimeMoment, 'minutes');
  const hoursAgo = now.diff(createTimeMoment, 'hours');
  const daysAgo = now.diff(createTimeMoment, 'days');

  if (minutesAgo < 60) {
    return `${minutesAgo} phút trước`;
  } else if (hoursAgo < 24) {
    return `${hoursAgo} giờ trước`;
  } else {
    return `${daysAgo} ngày trước`;
  }
};