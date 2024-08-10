const assert = require("assert");
const MeetingRoomValidator = require("../../src/domain/validators.js");
const { InvalidTeamSizeError, InvalidTimeSlotError } = require("../../src/domain/errors.js");
const { TimeSlot, Time } = require("../../src/domain/time_slot.js");

describe("Validators", () => {
  const bufferTime = [
    new TimeSlot(new Time(9, 0), new Time(9, 15)),
    new TimeSlot(new Time(13, 15), new Time(13, 45)),
    new TimeSlot(new Time(18, 45), new Time(19, 0)),
  ];

  const config = {
    minRoomOccupancy: 2,
    maxRoomOccupancy: 20,
    shutoffSlot: new TimeSlot(new Time(23, 45), new Time(0, 0)),
    bookingIntervalInMinutes: 15,
    bufferTime,
  }

  describe("Team Size validation", () => {
    it("team size below min room occupancy should be invalid", () => {
      const validator = new MeetingRoomValidator(config);

      assert.throws(
        () => validator.validateTeamSize(1),
        InvalidTeamSizeError,
      );
    });

    it("team size above max room occupancy should be invalid", () => {
      const validator = new MeetingRoomValidator(config);

      assert.throws(
        () => validator.validateTeamSize(21),
        InvalidTeamSizeError,
      );
    });

    it("team size equal to min room occupancy should be valid", () => {
      const validator = new MeetingRoomValidator(config);

      assert.doesNotThrow(
        () => validator.validateTeamSize(2),
      );
    });

    it("team size equal to max room occupancy should be valid", () => {
      const validator = new MeetingRoomValidator(config);

      assert.doesNotThrow(
        () => validator.validateTeamSize(20),
      );
    });

    it("team size equal between min and max room occupancy should be valid", () => {
      const validator = new MeetingRoomValidator(config);

      assert.doesNotThrow(
        () => validator.validateTeamSize(12),
      );
    });
  });

  describe("Time Slot validation", () => {
    it("time slot spanning multiple days should be invalid", () => {
      const validator = new MeetingRoomValidator(config);

      assert.throws(
        () => validator.validateTimeSlot(new TimeSlot(
          new Time(20, 30),
          new Time(1, 30))
        ),
        InvalidTimeSlotError
      );
    });

    it("time slot not following booking interval should be invalid", () => {
      const validator = new MeetingRoomValidator(config);

      assert.throws(
        () => validator.validateTimeSlot(new TimeSlot(
          new Time(20, 0),
          new Time(1, 20))
        ),
        InvalidTimeSlotError
      );
      assert.throws(
        () => validator.validateTimeSlot(new TimeSlot(
          new Time(20, 5),
          new Time(1, 30))
        ),
        InvalidTimeSlotError
      );
    });

    it("time slot overlapping with shutoff time should be invalid", () => {
      const validator = new MeetingRoomValidator(config);

      assert.throws(
        () => validator.validateTimeSlot(new TimeSlot(
          new Time(23, 45),
          new Time(0, 0))
        ),
        InvalidTimeSlotError
      );
    });

    it("time slot overlapping with buffer time should be invalid", () => {
      const validator = new MeetingRoomValidator(config);

      assert.throws(
        () => validator.validateTimeSlot(new TimeSlot(
          new Time(13, 30),
          new Time(13, 45),
        )),
        InvalidTimeSlotError,
      );
    });

    it("should not error for valid time slot", () => {
      const validator = new MeetingRoomValidator(config);

      assert.doesNotThrow(
        () => validator.validateTimeSlot(new TimeSlot(
          new Time(10, 45),
          new Time(11, 15)),
        )
      );
    });

  });
});