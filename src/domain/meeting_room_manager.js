import { NoVacantRoomError } from "./errors.js";

export class MeetingRoomManager {
  constructor(meetingRooms, validator) {
    this.meetingRooms = meetingRooms;
    this.validator = validator;
  }

  book(teamSize, timeSlot) {
    try {
      this.validator.validateTeamSize(teamSize);
      this.validator.validateTimeSlot(timeSlot);
    } catch (error) {
      return { success: false, roomName: undefined, error }
    }

    const room = this.meetingRooms.find(room => {
      return room.book(teamSize, timeSlot).success;
    });

    return room ? this.#roomResponse(room.name) : this.#noVaccantRoomResponse();
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