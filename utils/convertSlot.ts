import moment from "moment";

function convertTime(timeString: string): number {
    const timeParts = timeString.split(' ');
    let hours = parseInt(timeParts[0].split(':')[0]);
    const minutes = parseInt(timeParts[0].split(':')[1]);
    const period = timeParts[1].toUpperCase();

    if (isNaN(hours) || isNaN(minutes) || (period !== 'AM' && period !== 'PM')) {
      throw new Error('Invalid time format. Expected format: "hh:mm AM/PM".');
    }

    // Handle AM/PM conversion
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    return hours; // Return converted hour in 24-hour format
  }


  export function calculateSlots(openTime: string, closeTime: string, numberOfSlots: number): string[] {
    const currentDateTime = new Date(); // Get the current date and time
  
    const openingHour = convertTime(openTime);
    const closingHour = convertTime(closeTime);
  
    // Use today's date for open and close times
    const openTimeDate = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate(), openingHour);
    const closeTimeDate = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate(), closingHour);
  
    // Adjust the open and close times if they are set in the past
    if (openTimeDate < currentDateTime) {
      openTimeDate.setDate(currentDateTime.getDate() + 1);
      closeTimeDate.setDate(currentDateTime.getDate() + 1);
    }
  
    // if (openTimeDate >= closeTimeDate) {
    //   throw new Error('Open time must be before close time.');
    // }

    const totalTime = (closeTimeDate.getTime() - openTimeDate.getTime()) / (1000 * 60 * 60);
    // if (numberOfSlots > totalTime) {
    //     throw new Error('Number of slots cannot exceed available hours.');
    // }

    const slots = [];
    const increment = totalTime / numberOfSlots;
    let currentTime = openTimeDate;
   console.log(openTimeDate)
    for (let i = 0; i < numberOfSlots; i++) {
      const endDateTime = new Date(currentTime.getTime() + increment * 60 * 60 * 1000);
      if (endDateTime <= currentDateTime) {
        // Skip this slot because it's in the past or current
        currentTime = endDateTime;
        continue;
      }
  
      if (endDateTime > closeTimeDate) {
        break; // Do not add the slot if it exceeds the closing time
      }
  
      const startHour = currentTime.getHours();
      const endHour = endDateTime.getHours();
      const slotString = `${startHour < 10 ? '0' + startHour : startHour}:00 - ${endHour < 10 ? '0' + endHour : endHour}:00`;
      slots.push(slotString);
      currentTime = endDateTime;
    }
  
    console.log("Final Slots:", slots);
    return slots;
}