import { NotEnoughRoomCapacityError, TimeSlotNotAvailableError } from "./errors.js";

export default class MeetingRoom {
  constructor(name, capacity, bufferTime) {
    this.name = name;
    this.capacity = capacity;
    this.bufferTime = bufferTime;
    this.bookedSlots = [];
  }

  canAccomodate(teamSize) {
    return this.capacity >= teamSize;
  }

  book(teamSize, timeSlot) {
    if (!this.canAccomodate(teamSize)) {
      return {
        success: false,
        error: new NotEnoughRoomCapacityError(this.capacity, teamSize),
      }
    }
    if (this.bufferTime.some(bufferSlot => bufferSlot.overlaps(timeSlot))) {
      return {
        success: false,
        error: new TimeSlotNotAvailableError(timeSlot),
      }
    }
    this.bookedSlots.push(timeSlot);
    return {
      success: true,
      error: null
    }
  }
}
