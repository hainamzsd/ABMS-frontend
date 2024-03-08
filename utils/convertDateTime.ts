export  const combineDateTime = (startDate:Date,startTime:Date) => {
    const year = startDate.getFullYear();
    const month = startDate.getMonth(); // Note: January is 0, December is 11
    const day = startDate.getDate();
    const hours = startTime.getHours();
    const minutes = startTime.getMinutes();
    const seconds = startTime.getSeconds();
    const combinedDateTime = new Date(year, month, day, hours, minutes, seconds);
  console.log(year, month, day, hours, minutes, seconds);
   // Format manually to an ISO-like string but in local time
   const isoString = combinedDateTime.getFullYear() + '-' +
   ('0' + (combinedDateTime.getMonth() + 1)).slice(-2) + '-' +
   ('0' + combinedDateTime.getDate()).slice(-2) + 'T' +
   ('0' + combinedDateTime.getHours()).slice(-2) + ':' +
   ('0' + combinedDateTime.getMinutes()).slice(-2) + ':' +
   ('0' + combinedDateTime.getSeconds()).slice(-2) + '.000';
    return isoString; // Converts to ISO format
  };
