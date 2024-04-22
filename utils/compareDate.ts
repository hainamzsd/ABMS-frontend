export function isSecondDateLarger(date1:string, date2:string) {
    // Split the dates into arrays of [month, day, year]
    const date1Parts = date1.split('/');
    const date2Parts = date2.split('/');
  
    // Ensure both dates have valid format (assuming mm/dd/yyyy)
    if (date1Parts.length !== 3 || date2Parts.length !== 3) {
      return false; // Or throw an error if desired
    }
  
    // Convert each part to a number
    const year1 = parseInt(date1Parts[2], 10);
    const month1 = parseInt(date1Parts[0], 10) - 1; // Months are 0-indexed
    const day1 = parseInt(date1Parts[1], 10);
  
    const year2 = parseInt(date2Parts[2], 10);
    const month2 = parseInt(date2Parts[0], 10) - 1;
    const day2 = parseInt(date2Parts[1], 10);
  
    // Compare dates year, month, then day
    if (year2 > year1) {
      return true;
    } else if (year2 === year1) {
      if (month2 > month1) {
        return true;
      } else if (month2 === month1) {
        return day2 > day1;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  export const convertTo24Hour = (time:any) => {
    const [timePart, period] = time.split(' ');
    let [hours, minutes] = timePart.split(':');
    hours = parseInt(hours, 10);
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    return hours;
  };
  export function isDateInFuture(dateString: string) {
    const dateParts = dateString.split('/');
  
    if (dateParts.length !== 3) {
      return false; // Return false if the date format is incorrect or incomplete
    }
  
    // Correct indices for mm/dd/yyyy format
    const month = parseInt(dateParts[0], 10) - 1; // month is at index 0; subtract 1 for zero-indexed months
    const day = parseInt(dateParts[1], 10); // day is at index 1
    const year = parseInt(dateParts[2], 10); // year is at index 2
  
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to the start of the day for fair comparison
  
    const inputDate = new Date(year, month, day);
  
    return inputDate > today;
}