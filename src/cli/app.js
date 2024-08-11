const { NoVacantRoomError } = require("../domain/errors.js");
const MeetingRoom = require("../domain/meeting_room.js");
const MeetingRoomManager = require("../domain/meeting_room_manager.js");
const MeetingRoomValidator = require("../domain/validators.js");
const { CommandType, parseCommand } = require("./commands.js");

const ErrorMessages = {
  IncorrectInput: "INCORRECT_INPUT",
  NoVacantRoom: "NO_VACANT_ROOM",
}

class App {
  constructor(manager) {
    this.manager = manager;
  }

  execute(rawCommand) {
    try {
      return this.#executeCommand(parseCommand(rawCommand));
    } catch (e) {
      return ErrorMessages.IncorrectInput;
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
    return rooms.join(" ") || ErrorMessages.NoVacantRoom;
  }

  #executeBookingCommand(command) {
    try {
      return this.manager.book(command.teamSize, command.timeSlot);
    } catch (e) {
      return this.#isNoVaccantRoomError(e) ? ErrorMessages.NoVacantRoom : ErrorMessages.IncorrectInput;
    }
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

module.exports = App;
