const { NotEnoughRoomCapacityError, TimeSlotNotAvailableError } = require("./errors.js");

class MeetingRoom {
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
      throw new NotEnoughRoomCapacityError(this.capacity, teamSize);
    }
    if (timeSlot.overlapsWithAny(this.bookedSlots)) {
      throw new TimeSlotNotAvailableError(timeSlot);
    }
    this.bookedSlots.push(timeSlot);
  }
}

module.exports = MeetingRoom;