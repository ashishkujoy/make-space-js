import MeetingRoom from "../../src/domain/meeting_room.js";
import { assert } from "chai";
import { Time, TimeSlot } from "../../src/domain/time_slot.js";
import { NotEnoughRoomCapacityError, TimeSlotNotAvailableError } from "../../src/domain/errors.js";

describe("Meeting Room", () => {
  describe("Accomodation", () => {
    it("should accomodate a team of size lesser than the room capacity", () => {
      const meetingRoom = new MeetingRoom("test", 4, []);
      assert.isTrue(meetingRoom.canAccomodate(3));
    });

    it("should accomodate a team of size equal to the room capacity", () => {
      const meetingRoom = new MeetingRoom("test", 4, []);
      assert.isTrue(meetingRoom.canAccomodate(4));
    });

    it("should not accomodate a team of size equal greater than room capacity", () => {
      const meetingRoom = new MeetingRoom("test", 4, []);
      assert.isFalse(meetingRoom.canAccomodate(5));
    });
  });

  describe("Book", () => {
    it("should not allow booking room having capacity less than team size", () => {
      const meetingRoom = new MeetingRoom("test", 3, []);
      const timeSlot = new TimeSlot(new Time(10, 0), new Time(10, 15));
      const booking = meetingRoom.book(4, timeSlot);

      assert.deepStrictEqual(
        booking, {
        success: false,
        error: new NotEnoughRoomCapacityError(3, 4)
      });
    });

    it("should allow booking room having capacity for the team size", () => {
      const meetingRoom = new MeetingRoom("test", 3, []);
      const timeSlot = new TimeSlot(new Time(10, 0), new Time(10, 15));
      const booking = meetingRoom.book(3, timeSlot);

      assert.deepStrictEqual(
        booking, {
        success: true,
        error: null,
      });
    });

    it("should allow booking room having more capacity then the team size", () => {
      const meetingRoom = new MeetingRoom("test", 13, []);
      const timeSlot = new TimeSlot(new Time(10, 0), new Time(10, 15));
      const booking = meetingRoom.book(3, timeSlot);

      assert.deepStrictEqual(
        booking, {
        success: true,
        error: null,
      });
    });

    it("should not allow booking during the buffer time", () => {
      const meetingRoom = new MeetingRoom("test", 13, [
        new TimeSlot(new Time(9, 0), new Time(9, 15)),
        new TimeSlot(new Time(13, 15), new Time(13, 45)),
        new TimeSlot(new Time(18, 45), new Time(19, 0)),
      ]);

      const timeSlot = new TimeSlot(new Time(13, 30), new Time(13, 45));
      const booking = meetingRoom.book(3, timeSlot);

      assert.deepStrictEqual(
        booking,
        {
          success: false,
          error: new TimeSlotNotAvailableError(timeSlot),
        });
    });

    it("should not allow booking during a prebooked slot", () => {
      const meetingRoom = new MeetingRoom("test", 13, [
        new TimeSlot(new Time(9, 0), new Time(9, 15)),
        new TimeSlot(new Time(13, 15), new Time(13, 45)),
        new TimeSlot(new Time(18, 45), new Time(19, 0)),
      ]);
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
});