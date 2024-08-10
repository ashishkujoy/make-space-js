export class NotEnoughRoomCapacityError extends Error {
  constructor(roomCapacity, teamSize) {
    super(`Not Enough Room Capacity. Room capacity = ${roomCapacity}, team size = ${teamSize}`);
    this.roomCapacity = roomCapacity;
    this.teamSize = teamSize;
  }
}

export class TimeSlotNotAvailableError extends Error {
  constructor(timeSlot) {
    super(`Room is not available during ${timeSlot}`);
    this.timeSlot = timeSlot;
  }
}

export class NoVacantRoomError extends Error {
  constructor() {
    super("No vacant room");
  }
}

export class InvalidTimeSlotError extends Error {
  constructor(timeSlot) {
    super(`Invalid timeslot ${timeSlot}`);
  }
}

export class InvalidTeamSizeError extends Error {
  constructor(teamSize) {
    super(`Invalid teamsize ${teamSize}`);
  }
}