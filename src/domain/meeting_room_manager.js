import { InvalidTimeSlot, NoVacantRoom } from "./errors.js";

export class MeetingRoomManager {
  constructor(meetingRooms, bookingRules) {
    this.meetingRooms = meetingRooms;
    this.bookingRules = bookingRules;
  }

  book(teamSize, timeSlot) {
    const validationError = this.#validateRequest(teamSize, timeSlot);
    if (validationError) {
      return { success: false, roomName: undefined, error: validationError }
    }
    const room = this.meetingRooms.find(room => {
      return room.book(teamSize, timeSlot).success;
    });

    return room ? this.#roomResponse(room.name) : this.#noVaccantRoomResponse();
  }

  #validateRequest(teamSize, timeSlot) {
    if (!this.#isAccommodableTeamSize(teamSize)) return new NoVacantRoom();
    if (!this.#isValidTimeSlot(timeSlot)) return new InvalidTimeSlot();
  }

  #isValidTimeSlot(timeSlot) {
    const { bookingIntervalInMinutes } = this.bookingRules;
    return [timeSlot.start.minutes, timeSlot.end.minutes].every(m => m % bookingIntervalInMinutes === 0);
  }

  #isAccommodableTeamSize(teamSize) {
    const { minRoomOccupancy, maxRoomOccupancy } = this.bookingRules;
    return teamSize >= minRoomOccupancy && teamSize <= maxRoomOccupancy;
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