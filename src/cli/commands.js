const { Time, TimeSlot } = require("../domain/time_slot.js");
const { ParseError } = require("./parse_error.js");

const CommandType = {
  Book: "BOOK",
  Vacancy: "VACANCY"
}

const timeRegex = /^\d\d:\d\d$/;

const parseTime = (time) => {
  if (time === undefined) throw new ParseError("Missing required time");
  if (!timeRegex.test(time)) throw new ParseError(`Invalid time format ${time}`);

  const [hours, minutes] = time.split(":").map(n => +n);
  if (hours > 23) throw new ParseError(`Invalid time ${time}`);
  if (minutes > 59) throw new ParseError(`Invalid time ${time}`);

  return new Time(+hours, +minutes);
}

const intRegex = /^\d+$/;

const parseTeamSize = (teamSize) => {
  if (!intRegex.test(teamSize)) throw new ParseError(`Invalid team size ${teamSize}`);
  return +teamSize;
}

const parseCommand = (rawCommand) => {
  const [
    commandType,
    startTime,
    endTime,
    teamSize
  ] = rawCommand.split(" ").map(token => token.trim().toUpperCase());

  if (![CommandType.Book, CommandType.Vacancy].includes(commandType)) {
    throw new ParseError(`Unknown command ${commandType}`);
  }

  const timeSlot = new TimeSlot(parseTime(startTime), parseTime(endTime));

  if (timeSlot.isSpanningMultipleDays()) {
    throw new ParseError(`Illegal timespan`);
  }

  if (commandType === CommandType.Book) {
    return {
      type: CommandType.Book,
      teamSize: parseTeamSize(teamSize),
      timeSlot,
    }
  }

  if (commandType === CommandType.Vacancy) {
    return {
      type: CommandType.Vacancy,
      timeSlot
    }
  }
}

module.exports = {
  CommandType,
  parseTime,
  parseCommand,
}