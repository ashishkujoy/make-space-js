import { NoVacantRoomError } from "./errors.js";

export class MeetingRoomManager {
  constructor(meetingRooms, validator) {
    this.meetingRooms = meetingRooms;
    this.validator = validator;
  }

  book(teamSize, timeSlot) {
    this.validator.validate(teamSize, timeSlot);

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