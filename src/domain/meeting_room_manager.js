import { NoVacantRoom } from "./errors.js";

export class MeetingRoomManager {
  constructor(meetingRooms, minRoomOccupancy, maxRoomOccupancy) {
    this.meetingRooms = meetingRooms;
    this.minRoomOccupancy = minRoomOccupancy;
    this.maxRoomOccupancy = maxRoomOccupancy;
  }

  book(teamSize, timeSlot) {
    if (!this.#isAccomodableTeamSize(teamSize)) {
      return this.#noVaccantRoomResponse();
    }
    const room = this.meetingRooms.find(room => {
      return room.book(teamSize, timeSlot).success;
    });

    return room ? this.#roomResponse(room.name) : this.#noVaccantRoomResponse();
  }

  #isAccomodableTeamSize(teamSize) {
    return teamSize >= this.minRoomOccupancy && teamSize <= this.maxRoomOccupancy
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
      error: new NoVacantRoom(),
    }
  }
}