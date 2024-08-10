import { NotEnoughRoomCapacityError, TimeSlotNotAvailableError } from "./errors.js";

export default class MeetingRoom {
  constructor(name, capacity) {
    this.name = name;
    this.capacity = capacity;
    this.bookedSlots = [];
  }

  #canAccommodate(teamSize) {
    return this.capacity >= teamSize;
  }

  isVacant(timeSlot) {
    return !timeSlot.overlapsWithAny(this.bookedSlots);
  }

  book(teamSize, timeSlot) {
    if (!this.#canAccommodate(teamSize)) {
      return {
        success: false,
        error: new NotEnoughRoomCapacityError(this.capacity, teamSize),
      }
    }
    if (timeSlot.overlapsWithAny(this.bookedSlots)) {
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
