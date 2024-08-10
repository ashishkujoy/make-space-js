import { InvalidTeamSizeError, InvalidTimeSlotError } from "../domain/errors.js";
import MeetingRoom from "../domain/meeting_room.js";
import { MeetingRoomManager } from "../domain/meeting_room_manager.js";
import MeetingRoomValidator from "../domain/validators.js";
import { CommandType, parseCommand } from "./commands.js";

export class App {
  constructor(manager) {
    this.manager = manager;
  }

  execute(rawCommand) {
    let command;
    try {
      command = parseCommand(rawCommand);
    } catch {
      return "INCORRECT_INPUT";
    }
    return this.#executeCommand(command);
  }

  #executeCommand(command) {
    switch (command.type) {
      case CommandType.Book: {
        const booking = this.manager.book(command.teamSize, command.timeSlot);
        if (booking.success) return booking.roomName;
        if (booking.error instanceof InvalidTeamSizeError || booking.error instanceof InvalidTimeSlotError) {
          return "INCORRECT_INPUT";
        }
        return "NO_VACANT_ROOM";
      };
      case CommandType.Vacancy: {
        const rooms = this.manager.vacancy(command.timeSlot);
        return rooms.join(" ") || "NO_VACANT_ROOM";
      }
    }
  }

  static createInstance(config) {
    const meetingRooms = config.rooms.map(room => {
      return new MeetingRoom(
        room.name,
        room.capacity,
        config.bufferTime,
      );
    });

    const bookingRules = {
      minRoomOccupancy: config.minRoomOccupancy,
      maxRoomOccupancy: config.maxRoomOccupancy,
      bookingIntervalInMinutes: config.bookingIntervalInMinutes,
      shutoffSlot: config.shutoffSlot,
    };

    const validator = new MeetingRoomValidator(bookingRules);

    const manager = new MeetingRoomManager(meetingRooms, validator);

    return new App(manager);
  }
}