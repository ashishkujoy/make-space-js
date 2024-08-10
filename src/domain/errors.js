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

export class NoVacantRoom extends Error {
  constructor() {
    super("No vacant room");
  }
}

export class InvalidTimeSlot extends Error {
  constructor(timeSlot) {
    super(`Invalid timeslot ${timeSlot}`);
  }
}

export class InvalidTeamSize extends Error {
  constructor(teamSize) {
    super(`Invalid teamsize ${teamSize}`);
  }
}