import { MeetingRoomManager } from "../../src/domain/meeting_room_manager.js";
import MeetingRoom from "../../src/domain/meeting_room.js"
import { Time, TimeSlot } from "../../src/domain/time_slot.js"
import { assert } from "chai";
import { InvalidTimeSlot, NoVacantRoom } from "../../src/domain/errors.js";

describe("Meeting Room Manager", () => {
  const bufferTime = [
    new TimeSlot(new Time(9, 0), new Time(9, 15)),
    new TimeSlot(new Time(13, 15), new Time(13, 45)),
    new TimeSlot(new Time(18, 45), new Time(19, 0)),
  ];

  const bookingRules = {
    minRoomOccupancy: 2,
    maxRoomOccupancy: 20,
    bookingIntervalInMinutes: 15,
  };

  describe("book", () => {
    it("should book a room for given time slot and team size", () => {
      const manager = new MeetingRoomManager([
        new MeetingRoom("C-Cave", 3, bufferTime),
        new MeetingRoom("D-Tower", 7, bufferTime),
        new MeetingRoom("G-Mansion", 20, bufferTime),
      ], bookingRules);
      const booking = manager.book(3, new TimeSlot(new Time(10, 0), new Time(10, 45)));

      assert.deepStrictEqual(
        booking,
        {
          success: true,
          roomName: "C-Cave",
          error: null,
        }
      )
    });

    it("should book a room of higher capacity when a optimal capacity room is not available", () => {
      const manager = new MeetingRoomManager([
        new MeetingRoom("C-Cave", 3, bufferTime),
        new MeetingRoom("D-Tower", 7, bufferTime),
        new MeetingRoom("G-Mansion", 20, bufferTime),
      ], bookingRules);

      manager.book(3, new TimeSlot(new Time(10, 0), new Time(10, 45)));
      const booking = manager.book(3, new TimeSlot(new Time(10, 30), new Time(10, 45)));

      assert.deepStrictEqual(
        booking,
        {
          success: true,
          roomName: "D-Tower",
          error: null,
        }
      )
    });

    it("should not book any room for buffer timeslot", () => {
      const manager = new MeetingRoomManager([
        new MeetingRoom("C-Cave", 3, bufferTime),
        new MeetingRoom("D-Tower", 7, bufferTime),
        new MeetingRoom("G-Mansion", 20, bufferTime),
      ], bookingRules);

      const booking = manager.book(3, new TimeSlot(new Time(13, 30), new Time(13, 45)));

      assert.deepStrictEqual(
        booking,
        {
          success: false,
          roomName: undefined,
          error: new NoVacantRoom(),
        }
      );
    });

    it("should not book any room for teamsize less than min occupancy", () => {
      const manager = new MeetingRoomManager([
        new MeetingRoom("C-Cave", 3, bufferTime),
        new MeetingRoom("D-Tower", 7, bufferTime),
        new MeetingRoom("G-Mansion", 20, bufferTime),
      ], bookingRules);

      const booking = manager.book(1, new TimeSlot(new Time(10, 0), new Time(11, 0)));

      assert.deepStrictEqual(
        booking,
        {
          success: false,
          roomName: undefined,
          error: new NoVacantRoom(),
        }
      );
    });

    it("should not book any room for teamsize more than max occupancy", () => {
      const manager = new MeetingRoomManager([
        new MeetingRoom("C-Cave", 3, bufferTime),
        new MeetingRoom("D-Tower", 7, bufferTime),
        new MeetingRoom("G-Mansion", 20, bufferTime),
      ], bookingRules);

      const booking = manager.book(21, new TimeSlot(new Time(10, 0), new Time(11, 0)));

      assert.deepStrictEqual(
        booking,
        {
          success: false,
          roomName: undefined,
          error: new NoVacantRoom(),
        }
      );
    });

    it("should not allow booking for a non fifteen minute starting interval based timeslot", () => {
      const manager = new MeetingRoomManager([
        new MeetingRoom("C-Cave", 3, bufferTime),
        new MeetingRoom("D-Tower", 7, bufferTime),
        new MeetingRoom("G-Mansion", 20, bufferTime),
      ], bookingRules);

      const booking = manager.book(20, new TimeSlot(new Time(10, 10), new Time(11, 0)));

      assert.deepStrictEqual(
        booking,
        {
          success: false,
          roomName: undefined,
          error: new InvalidTimeSlot(),
        }
      );
    });

    it("should not allow booking for a non fifteen minute ending interval based timeslot", () => {
      const manager = new MeetingRoomManager([
        new MeetingRoom("C-Cave", 3, bufferTime),
        new MeetingRoom("D-Tower", 7, bufferTime),
        new MeetingRoom("G-Mansion", 20, bufferTime),
      ], bookingRules);

      const booking = manager.book(20, new TimeSlot(new Time(10, 15), new Time(11, 10)));

      assert.deepStrictEqual(
        booking,
        {
          success: false,
          roomName: undefined,
          error: new InvalidTimeSlot(),
        }
      );
    });
  });
});