import MeetingRoom from "../../src/domain/meeting_room.js";
import { assert } from "chai";
import { Time, TimeSlot } from "../../src/domain/time_slot.js";
import { NotEnoughRoomCapacityError, TimeSlotNotAvailableError } from "../../src/domain/errors.js";

describe("Meeting Room", () => {
  describe("Book", () => {
    it("should not allow booking room for teams larger than the capacity o", () => {
      const meetingRoom = new MeetingRoom("test", 3);
      const timeSlot = new TimeSlot(new Time(10, 0), new Time(10, 15));
      const booking = meetingRoom.book(4, timeSlot);

      assert.deepStrictEqual(
        booking, {
        success: false,
        error: new NotEnoughRoomCapacityError(3, 4)
      });
    });

    it("should allow booking room for teams equal to the capacity", () => {
      const meetingRoom = new MeetingRoom("test", 3);
      const timeSlot = new TimeSlot(new Time(10, 0), new Time(10, 15));
      const booking = meetingRoom.book(3, timeSlot);

      assert.deepStrictEqual(
        booking, {
        success: true,
        error: null,
      });
    });

    it("should allow booking room having more capacity then the team size", () => {
      const meetingRoom = new MeetingRoom("test", 13);
      const timeSlot = new TimeSlot(new Time(10, 0), new Time(10, 15));
      const booking = meetingRoom.book(3, timeSlot);

      assert.deepStrictEqual(
        booking, {
        success: true,
        error: null,
      });
    });

    it("should not allow booking during a prebooked slot", () => {
      const meetingRoom = new MeetingRoom("test", 13);
      const timeSlot = new TimeSlot(new Time(10, 15), new Time(10, 45));
      meetingRoom.book(3, new TimeSlot(new Time(10, 30), new Time(12, 45)));
      const booking = meetingRoom.book(3, timeSlot);

      assert.deepStrictEqual(
        booking,
        {
          success: false,
          error: new TimeSlotNotAvailableError(timeSlot),
        });
    });
  });

  describe("IsVacant", () => {
    it("should be vaccant when there is no booking for given timeslot", () => {
      const meetingRoom = new MeetingRoom("test", 13);
      const timeSlot = new TimeSlot(new Time(10, 0), new Time(10, 15));

      assert.isTrue(meetingRoom.isVacant(timeSlot));
    });

    it("should not be vaccant during a prebooked time", () => {
      const meetingRoom = new MeetingRoom("test", 13);

      meetingRoom.book(10, new TimeSlot(new Time(10, 30), new Time(11, 15)));

      assert.isFalse(meetingRoom.isVacant(
        new TimeSlot(new Time(10, 45), new Time(11, 0))
      ));
    });
  });
});
