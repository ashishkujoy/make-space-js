export class Time {
  constructor(hours, minutes) {
    this.hours = hours;
    this.minutes = minutes;
  }

  toMinutes() {
    return (this.hours * 60) + this.minutes;
  }

  toString() {
    return `${this.hours}:${this.minutes}`;
  }
}

export class TimeSlot {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  overlaps(otherTimeSlot) {
    const startTimeOverlaps = this.contains(otherTimeSlot.start);
    const endTimeOverlaps = this.contains(otherTimeSlot.end);

    return startTimeOverlaps || endTimeOverlaps;
  }

  contains(time) {
    const startTimeInMin = this.start.toMinutes();
    const endTimeInMin = this.end.toMinutes();
    const timeInMin = time.toMinutes();

    return startTimeInMin <= timeInMin && timeInMin <= endTimeInMin;
  }

  toString() {
    return `${this.start}-${this.end}`;
  }
}