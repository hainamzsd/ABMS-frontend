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

 export function isDateInFuture(dateString:string) {
    // Split the date string into day, month, and year components
    const dateParts = dateString.split('/');
  
    // Ensure the date has a valid format (assuming dd/mm/yyyy)
    if (dateParts.length !== 3) {
      return false;
    }
  
    // Convert each part to a number
    const year = parseInt(dateParts[2], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Months are 0-indexed
    const day = parseInt(dateParts[0], 10);
  
    // Get today's date
    const today = new Date();
  
    // Create a date object from the input string
    const inputDate = new Date(year, month, day);
  
    // Check if the input date is after today's date
    return inputDate > today;
  }