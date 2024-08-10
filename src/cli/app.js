import { MeetingRoomManager } from "../domain/meeting_room_manager.js";
import MeetingRoom from "../domain/meeting_room.js";
import { CommandType, parseCommand } from "./commands.js";
import { TimeSlot } from "../domain/time_slot.js";
import { InvalidTeamSize, InvalidTimeSlot } from "../domain/errors.js";

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
    const timeSlot = new TimeSlot(
      command.startTime,
      command.endTime,
    );

    switch (command.type) {
      case CommandType.Book: {
        const booking = this.manager.book(command.teamSize, timeSlot);
        if (booking.success) return booking.roomName;
        if (booking.error instanceof InvalidTeamSize || booking.error instanceof InvalidTimeSlot) {
          return "INCORRECT_INPUT";
        }
        return "NO_VACANT_ROOM";
      };
      case CommandType.Vacancy: {
        const rooms = this.manager.vacancy(timeSlot);
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

    const manager = new MeetingRoomManager(meetingRooms, bookingRules);

    return new App(manager);
  }
}