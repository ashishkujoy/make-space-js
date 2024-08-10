const { InvalidTimeSlotError } = require("./errors.js");

class MeetingRoomValidator {
  constructor(config) {
    this.config = config;
  }

  validate(timeSlot) {
    if (!this.#isValidTimeSlot(timeSlot)) {
      throw new InvalidTimeSlotError(timeSlot);
    }
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

module.exports = MeetingRoomValidator;
