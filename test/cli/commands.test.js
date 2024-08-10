import { assert } from "chai";
import { Time, TimeSlot } from "../../src/domain/time_slot.js";
import { parseCommand, CommandType, parseTime } from "../../src/cli/commands.js";
import { ParseError } from "../../src/cli/parse_error.js";

describe("Command", () => {
  describe("Parse Time", () => {
    it("should parse a valid time", () => {
      assert.deepStrictEqual(
        parseTime("12:01"),
        new Time(12, 1),
      );
    });

    it("should error on missing minutes", () => {
      assert.throws(
        () => parseTime("12:"),
        ParseError,
        "Invalid time format 12:"
      );
    });

    it("should error on more than two digit seconds", () => {
      assert.throws(
        () => parseTime("12:000"),
        ParseError,
        "Invalid time format 12:000"
      );
    });

    it("should error on less than two digit seconds", () => {
      assert.throws(
        () => parseTime("12:0"),
        ParseError,
        "Invalid time format 12:0"
      );
    });

    it("should error on non numeric seconds", () => {
      assert.throws(
        () => parseTime("12:0b"),
        ParseError,
        "Invalid time format 12:0b"
      );
    });

    it("should error on missing hours", () => {
      assert.throws(
        () => parseTime(":12"),
        ParseError,
        "Invalid time format :12"
      );
    });

    it("should error on more than two digit hours", () => {
      assert.throws(
        () => parseTime("120:00"),
        ParseError,
        "Invalid time format 120:00"
      );
    });

    it("should error on less than two digit hours", () => {
      assert.throws(
        () => parseTime("1:00"),
        ParseError,
        "Invalid time format 1:00"
      );
    });

    it("should error on non numeric hours", () => {
      assert.throws(
        () => parseTime("1a:00"),
        ParseError,
        "Invalid time format 1a:00"
      );
    });

    it("should error on negative hours", () => {
      assert.throws(
        () => parseTime("-11:00"),
        ParseError,
        "Invalid time format -11:00"
      );
    });

    it("should error on more than 23 hours time", () => {
      assert.throws(
        () => parseTime("25:00"),
        ParseError,
        "Invalid time 25:00"
      );
    });

    it("should error on more than 59 minutes time", () => {
      assert.throws(
        () => parseTime("23:60"),
        ParseError,
        "Invalid time 23:60"
      );
    });
  });

  describe("Parse", () => {
    describe("Book", () => {
      it("should parse a valid book command", () => {
        const command = parseCommand("BOOK 14:15 16:00 12");
        assert.deepStrictEqual(
          command,
          {
            type: CommandType.Book,
            timeSlot: new TimeSlot(new Time(14, 15), new Time(16, 0)),
            teamSize: 12,
          }
        )
      });

      it("should not parse command with invalid time", () => {
        assert.throws(
          () => parseCommand("BOOK 14:15 16:0 12"),
          ParseError,
          "Invalid time format 16:0",
        );
      });

      it("should not parse command with invalid team size", () => {
        assert.throws(
          () => parseCommand("BOOK 14:15 16:00 -12"),
          ParseError,
          "Invalid team size -12",
        );
      });
    });

    describe("Vaccancy", () => {
      it("should parse a valid vaccancy command", () => {
        const command = parseCommand("VACANCY 14:30 15:00");
        assert.deepStrictEqual(
          command,
          {
            type: CommandType.Vacancy,
            timeSlot: new TimeSlot(new Time(14, 30), new Time(15, 0)),
          }
        );
      });

      it("should not parse vaccancy command missing endtime", () => {
        assert.throws(
          () => parseCommand("VACANCY 14:30"),
          ParseError,
          "Missing required time",
        );
      });

      it("should not parse vaccancy command missing startTime", () => {
        assert.throws(
          () => parseCommand("VACANCY"),
          ParseError,
          "Missing required time",
        );
      });

      it("should not parse vaccancy command having invalid startTime", () => {
        assert.throws(
          () => parseCommand("VACANCY 24:00 13:00"),
          ParseError,
          "Invalid time 24:00",
        );
      });

      it("should not parse vaccancy command having invalid endTime", () => {
        assert.throws(
          () => parseCommand("VACANCY 12:00 13:73"),
          ParseError,
          "Invalid time 13:73",
        );
      });
    });

    it("should not parse unknown command", () => {
      assert.throws(
        () => parseCommand("Foo 12:35 13:00"),
        ParseError,
        "Unknown command FOO",
      )
    });
  });
});