const { NoVacantRoomError } = require("./errors.js");

class MeetingRoomManager {
  constructor(meetingRooms, validator) {
    this.meetingRooms = meetingRooms;
    this.validator = validator;
  }

  book(teamSize, timeSlot) {
    this.validator.validate(timeSlot);

    for (const room of this.meetingRooms) {
      try {
        room.book(teamSize, timeSlot);
        return room.name;
      } catch {
        continue;
      }
    }

    throw new NoVacantRoomError();
  }

  vacancy(timeSlot) {
    try {
      this.validator.validate(timeSlot);
    } catch {
      return [];
    }

    return this.meetingRooms
      .filter(room => room.isVacant(timeSlot))
      .map(room => room.name);
  }
}

module.exports = MeetingRoomManager;
