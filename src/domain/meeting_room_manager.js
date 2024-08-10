import { NoVacantRoomError } from "./errors.js";

export class MeetingRoomManager {
  constructor(meetingRooms, validator) {
    this.meetingRooms = meetingRooms;
    this.validator = validator;
  }

  book(teamSize, timeSlot) {
    this.validator.validate(teamSize, timeSlot);

    const room = this.meetingRooms.find(room => {
      return room.book(teamSize, timeSlot).success;
    });

    if (!room) throw new NoVacantRoomError();
    return room.name;
  }

  vacancy(timeSlot) {
    try {
      this.validator.validateTimeSlot(timeSlot);
    } catch {
      return [];
    }

    return this.meetingRooms
      .filter(room => room.isVacant(timeSlot))
      .map(room => room.name);
  }

  #roomResponse(roomName) {
    return {
      success: true,
      roomName,
      error: null,
    }
  }

  #noVaccantRoomResponse() {
    return {
      success: false,
      roomName: undefined,
      error: new NoVacantRoomError(),
    }
  }
}