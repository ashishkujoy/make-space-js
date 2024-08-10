import { NoVacantRoomError } from "../domain/errors.js";
import MeetingRoom from "../domain/meeting_room.js";
import { MeetingRoomManager } from "../domain/meeting_room_manager.js";
import MeetingRoomValidator from "../domain/validators.js";
import { CommandType, parseCommand } from "./commands.js";

export class App {
  constructor(manager) {
    this.manager = manager;
  }

  execute(rawCommand) {
    try {
      return this.#executeCommand(parseCommand(rawCommand));
    } catch {
      return "INCORRECT_INPUT";
    }
  }

  #executeCommand(command) {
    switch (command.type) {
      case CommandType.Book: return this.#executeBookingCommand(command);
      case CommandType.Vacancy: return this.#executeVacancyCommand(command);
    }
  }

  #executeVacancyCommand(command) {
    const rooms = this.manager.vacancy(command.timeSlot);
    return rooms.join(" ") || "NO_VACANT_ROOM";
  }

  #executeBookingCommand(command) {
    const {
      success,
      error,
      roomName
    } = this.manager.book(command.teamSize, command.timeSlot);

    if (success) return roomName;
    return this.#isNoVaccantRoomError(error) ? "NO_VACANT_ROOM" : "INCORRECT_INPUT";
  }

  #isNoVaccantRoomError(error) {
    return error instanceof NoVacantRoomError;
  }

  static createInstance(config) {
    const meetingRooms = config.rooms.map(room => {
      return new MeetingRoom(
        room.name,
        room.capacity,
      );
    });

    const bookingRules = {
      minRoomOccupancy: config.minRoomOccupancy,
      maxRoomOccupancy: config.maxRoomOccupancy,
      bookingIntervalInMinutes: config.bookingIntervalInMinutes,
      shutoffSlot: config.shutoffSlot,
      bufferTime: config.bufferTime,
    };

    const validator = new MeetingRoomValidator(bookingRules);

    const manager = new MeetingRoomManager(meetingRooms, validator);

    return new App(manager);
  }
}