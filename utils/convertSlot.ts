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
    const openingHour = convertTime(openTime);
    const closingHour = convertTime(closeTime);
    // Convert open and close times to Date objects for better handling
    const openTimeDate = new Date(`2024-03-04 ${openingHour}:00`); // Adjust year/month/day if needed
    const closeTimeDate = new Date(`2024-03-04 ${closingHour}:00`); // Adjust year/month/day if needed
  
    // Ensure open time is before close time
    if (openTimeDate >= closeTimeDate) {
      throw new Error('Open time must be before close time.');
    }
  
    // Calculate slot duration in hours (rounded down to avoid fractions)
    const slotDuration = Math.floor((closeTimeDate.getTime() - openTimeDate.getTime()) / (1000 * 60 * 60));
  
    // Ensure enough slots can be created within the time frame
    if (numberOfSlots > slotDuration) {
      throw new Error('Number of slots cannot exceed available hours.');
    }
  
    // Create slots as time ranges without minutes (e.g., "08:00 - 09:00")
    const slots: string[] = [];
    const increment = slotDuration / (numberOfSlots - 1); // Adjust increment for non-integer durations
    let currentHour = openTimeDate.getHours();
    for (let i = 0; i < numberOfSlots; i++) {
      const endHour = currentHour + Math.floor(increment); // Avoid exceeding closing time
      const nextHour = endHour < 24 ? endHour : endHour - 24; // Adjust for hour wrapping
      const slotString = `${currentHour}:00 - ${nextHour}:00`;
      slots.push(slotString);
      currentHour = nextHour;
    }
  
    return slots;
  }
  