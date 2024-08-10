import { InvalidTeamSizeError, InvalidTimeSlotError } from "./errors.js";

export default class MeetingRoomValidator {
  constructor(config) {
    this.config = config;
  }

  validate(teamSize, timeSlot) {
    this.validateTeamSize(teamSize);
    this.validateTimeSlot(timeSlot);
  }

  validateTeamSize(teamSize) {
    if (!this.#isValidTeamSize(teamSize)) {
      throw new InvalidTeamSizeError(teamSize);
    }
  }

  validateTimeSlot(timeSlot) {
    if (!this.#isValidTimeSlot(timeSlot)) {
      throw new InvalidTimeSlotError(timeSlot);
    }
  }

  #isValidTeamSize(teamSize) {
    const { minRoomOccupancy, maxRoomOccupancy } = this.config;
    return teamSize >= minRoomOccupancy && teamSize <= maxRoomOccupancy;
  }

  #isValidTimeSlot(timeSlot) {
    if (timeSlot.isSpanningMultipleDays()) return false;
    if (!this.#isFollowingBookingInterval(timeSlot)) return false;
    if (timeSlot.overlapsWithAny(this.config.bufferTime)) return false;
    if (this.#isOverlappingWithShutoffSlot(timeSlot)) return false;
    return true;
  }

  #isOverlappingWithShutoffSlot(timeSlot) {
    return this.config.shutoffSlot.overlaps(timeSlot);
  }

  #isFollowingBookingInterval(timeSlot) {
    const { bookingIntervalInMinutes } = this.config;
    return [
      timeSlot.start.minutes,
      timeSlot.end.minutes
    ].every(m => m % bookingIntervalInMinutes === 0);
  }
}