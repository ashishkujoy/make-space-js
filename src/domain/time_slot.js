export class Time {
  constructor(hours, minutes) {
    this.hours = hours;
    this.minutes = minutes;
  }

  toMinutes() {
    return (this.hours * 60) + this.minutes;
  }

  equals(other) {
    if (!(other instanceof Time)) return false;
    return this.hours === other.hours && this.minutes === other.minutes;
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
    if (this.equals(otherTimeSlot)) return true;
    const startTimeOverlaps = this.contains(otherTimeSlot.start) || otherTimeSlot.contains(this.start);
    const endTimeOverlaps = this.contains(otherTimeSlot.end) || otherTimeSlot.contains(this.end);

    return startTimeOverlaps || endTimeOverlaps;
  }

  overlapsWithAny(timeSlots) {
    return timeSlots.some(otherTimeSlot => this.overlaps(otherTimeSlot));
  }

  contains(time) {
    const startTimeInMin = this.start.toMinutes();
    const endTimeInMin = this.end.toMinutes();
    const timeInMin = time.toMinutes();

    return startTimeInMin < timeInMin && timeInMin < endTimeInMin;
  }

  isSpanningMultipleDays() {
    return this.end.toMinutes() - this.start.toMinutes() < 0;
  }

  equals(other) {
    if (!(other instanceof TimeSlot)) return false;
    return this.start.equals(other.start) && this.end.equals(other.end);
  }

  toString() {
    return `${this.start}-${this.end}`;
  }
}