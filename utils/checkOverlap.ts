import moment from "moment";

export const checkForOverlaps = (request:any) => {
    let hasOverlap = false;
    // Assuming request is your array of elevator requests
    for (let i = 0; i < request.length; i++) {
        for (let j = i + 1; j < request.length; j++) {
            if (
                console.log(request[i].startTime),
                moment(request[i].startTime).isBefore(request[j].endTime) &&
                moment(request[j].startTime).isBefore(request[i].endTime)
            ) {
                hasOverlap = true;
                break;
            }
        }
        if (hasOverlap) break;
    }
    if (hasOverlap) {
        return true;
    } else {
        return false;
    }
};

export function checkOverlaps(elevators:any) {
    let overlaps = [];
    for (let i = 0; i < elevators.length; i++) {
      for (let j = i + 1; j < elevators.length; j++) {
        if (elevators[i].endTime > elevators[j].startTime && elevators[i].startTime < elevators[j].endTime) {
          overlaps.push({ first: elevators[i], second: elevators[j] });
        }
      }
    }
    return overlaps;
  }