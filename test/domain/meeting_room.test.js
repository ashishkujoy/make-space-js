import MeetingRoom from "../../src/domain/meeting_room.js";
import { assert } from "chai";
import { Time, TimeSlot } from "../../src/domain/time_slot.js";
import { NotEnoughRoomCapacityError, TimeSlotNotAvailableError } from "../../src/domain/errors.js";

describe("Meeting Room", () => {
  describe("Book", () => {
    it("should not allow booking room for teams larger than the capacity o", () => {
      const meetingRoom = new MeetingRoom("test", 3);
      const timeSlot = new TimeSlot(new Time(10, 0), new Time(10, 15));

      assert.throws(
        () => meetingRoom.book(4, timeSlot),
        NotEnoughRoomCapacityError,
        "Not Enough Room Capacity. Room capacity = 3, team size = 4"
      );
    });

    it("should allow booking room for teams equal to the capacity", () => {
      const meetingRoom = new MeetingRoom("test", 3);
      const timeSlot = new TimeSlot(new Time(10, 0), new Time(10, 15));

      assert.doesNotThrow(() => meetingRoom.book(3, timeSlot));
    });

    it("should allow booking room having more capacity then the team size", () => {
      const meetingRoom = new MeetingRoom("test", 13);
      const timeSlot = new TimeSlot(new Time(10, 0), new Time(10, 15));

      assert.doesNotThrow(() => meetingRoom.book(3, timeSlot));
    });

    it("should not allow booking during a prebooked slot", () => {
      const meetingRoom = new MeetingRoom("test", 13);
      const timeSlot = new TimeSlot(new Time(10, 15), new Time(10, 45));
      meetingRoom.book(3, new TimeSlot(new Time(10, 30), new Time(12, 45)));

      assert.throws(
        () => meetingRoom.book(3, timeSlot),
        TimeSlotNotAvailableError,
        "Room is not available during 10:15-10:45",
      );
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
