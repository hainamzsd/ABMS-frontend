import moment from "moment";

export const calculateHoursAgo = (createTime:Date) => {
    const createTimeMoment = moment.utc(createTime).local(); 
    const now = moment();
    let  hoursAgo = now.diff(createTimeMoment, 'hours');
    hoursAgo = Math.abs(hoursAgo);
    return `${hoursAgo} giờ trước`; 
  };
  