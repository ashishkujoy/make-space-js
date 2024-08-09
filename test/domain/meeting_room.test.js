import MeetingRoom from "../../src/domain/meeting_room.js";
import { assert } from "chai";

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
});