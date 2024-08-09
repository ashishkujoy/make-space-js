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