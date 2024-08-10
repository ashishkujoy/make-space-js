import { MeetingRoomManager } from "../../src/domain/meeting_room_manager.js";
import MeetingRoom from "../../src/domain/meeting_room.js"
import { Time, TimeSlot } from "../../src/domain/time_slot.js"
import { assert } from "chai";
import MeetingRoomValidator from "../../src/domain/validators.js";

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
    shutoffSlot: new TimeSlot(new Time(23, 45), new Time(0, 0)),
    bufferTime,
  };

  const validator = new MeetingRoomValidator(bookingRules);

  const createMeetingRooms = () => [
    new MeetingRoom("C-Cave", 3, bufferTime),
    new MeetingRoom("D-Tower", 7, bufferTime),
    new MeetingRoom("G-Mansion", 20, bufferTime),
  ];

  describe("book", () => {
    it("should book a room for available time slot and team size", () => {
      const manager = new MeetingRoomManager(createMeetingRooms(), validator);
      const room = manager.book(3, new TimeSlot(new Time(10, 0), new Time(10, 45)));

      assert.equal(room, "C-Cave");
    });

    it("should book a room of higher capacity when a optimal capacity room is not available", () => {
      const manager = new MeetingRoomManager(createMeetingRooms(), validator);

      manager.book(3, new TimeSlot(new Time(10, 0), new Time(10, 45)));
      const room = manager.book(3, new TimeSlot(new Time(10, 30), new Time(10, 45)));
      
      assert.equal(room, "D-Tower");
    });

    it("should use validator to validate timeslot and teamsize", () => {
      let teamSizeQuery = undefined;
      let timeSlotQuery = undefined;

      const manager = new MeetingRoomManager(createMeetingRooms(), {
        validate: (teamSize, timeSlot) => {
          timeSlotQuery = timeSlot;
          teamSizeQuery = teamSize;
        },
      });
      const timeSlot = new TimeSlot(new Time(10, 0), new Time(10, 45))
      manager.book(3, timeSlot);

      assert.equal(teamSizeQuery, 3);
      assert.deepStrictEqual(timeSlotQuery, timeSlot);
    });
  });

  describe("vacancy", () => {
    it("no room should be available during buffertime", () => {
      const manager = new MeetingRoomManager(createMeetingRooms(), validator);

      assert.deepStrictEqual(
        manager.vacancy(new TimeSlot(new Time(13, 30), new Time(13, 45)),),
        [],
      );
    });

    it("no room should be available during shutoff time", () => {
      const manager = new MeetingRoomManager(createMeetingRooms(), validator);

      assert.deepStrictEqual(
        manager.vacancy(new TimeSlot(new Time(23, 45), new Time(0, 0)),),
        [],
      );
    });

    it("no room should be available for slot spanning multiple days", () => {
      const manager = new MeetingRoomManager(createMeetingRooms(), validator);

      assert.deepStrictEqual(
        manager.vacancy(new TimeSlot(new Time(20, 45), new Time(0, 15)),),
        [],
      );
    });

    it("should give name of all available rooms", () => {
      const manager = new MeetingRoomManager(createMeetingRooms(), validator);
      manager.book(4, new TimeSlot(new Time(10, 0), new Time(10, 45)));

      assert.deepStrictEqual(
        manager.vacancy(new TimeSlot(new Time(10, 15), new Time(10, 30)),),
        ["C-Cave", "G-Mansion"],
      );
    });
  });
});
