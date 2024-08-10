class NotEnoughRoomCapacityError extends Error {
  constructor(roomCapacity, teamSize) {
    super(`Not Enough Room Capacity. Room capacity = ${roomCapacity}, team size = ${teamSize}`);
    this.roomCapacity = roomCapacity;
    this.teamSize = teamSize;
  }
}

class TimeSlotNotAvailableError extends Error {
  constructor(timeSlot) {
    super(`Room is not available during ${timeSlot}`);
    this.timeSlot = timeSlot;
  }
}

class NoVacantRoomError extends Error {
  constructor() {
    super("No vacant room");
  }
}

class InvalidTimeSlotError extends Error {
  constructor(timeSlot) {
    super(`Invalid timeslot ${timeSlot}`);
  }
}


module.exports = {
  NotEnoughRoomCapacityError,
  TimeSlotNotAvailableError,
  NoVacantRoomError,
  InvalidTimeSlotError,
};
