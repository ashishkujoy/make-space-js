const assert = require("assert");
const App = require("../../src/cli/app.js");
const { Time, TimeSlot } = require("../../src/domain/time_slot.js");

describe("App", () => {
  const bufferTime = [
    new TimeSlot(new Time(9, 0), new Time(9, 15)),
    new TimeSlot(new Time(13, 15), new Time(13, 45)),
    new TimeSlot(new Time(18, 45), new Time(19, 0)),
  ];

  const config = {
    rooms: [
      { name: "C-Cave", capacity: 3 },
      { name: "D-Tower", capacity: 7 },
      { name: "G-Mansion", capacity: 20 },
    ],
    bufferTime,
    minRoomOccupancy: 2,
    maxRoomOccupancy: 20,
    bookingIntervalInMinutes: 15,
    shutoffSlot: new TimeSlot(new Time(23, 45), new Time(0, 0)),
  };

  it("should handle book command", () => {
    const app = App.createInstance(config);

    assert.deepStrictEqual(
      app.execute("BOOK 11:00 11:45 2"),
      "C-Cave",
    );
  });

  it("should handle multiple book command", () => {
    const app = App.createInstance(config);

    assert.deepStrictEqual(
      app.execute("BOOK 11:00 11:45 2"),
      "C-Cave",
    );
    assert.deepStrictEqual(
      app.execute("BOOK 11:15 11:30 3"),
      "D-Tower",
    );
    assert.deepStrictEqual(
      app.execute("BOOK 12:00 13:00 15"),
      "G-Mansion",
    );
  });

  it("should gracefully handle booking failure", () => {
    const app = App.createInstance(config);

    assert.deepStrictEqual(
      app.execute("BOOK 11:00 11:45 19"),
      "G-Mansion",
    );
    assert.deepStrictEqual(
      app.execute("BOOK 23:00 01:45 3"),
      "INCORRECT_INPUT",
    );
    assert.deepStrictEqual(
      app.execute("BOOK 11:15 11:30 13"),
      "NO_VACANT_ROOM",
    );
  });

  it("should handle vacancy command", () => {
    const app = App.createInstance(config);
    app.execute("BOOK 10:00 11:45 4");
    app.execute("BOOK 10:30 11:45 3");
    app.execute("BOOK 10:30 11:45 14");

    assert.deepStrictEqual(
      app.execute("VACANCY 10:15 10:30"),
      "C-Cave G-Mansion",
    );
    assert.deepStrictEqual(
      app.execute("VACANCY 10:30 11:30"),
      "NO_VACANT_ROOM",
    );
  });

  it("should handle multiple commands", () => {
    const app = App.createInstance(config);
    [
      { command: "BOOK 09:30 13:15 2", expectedOutput: "C-Cave" },
      { command: "BOOK 13:45 18:45 2", expectedOutput: "C-Cave" },
      { command: "BOOK 12:55 14:00 3", expectedOutput: "INCORRECT_INPUT" },
      { command: "BOOK 13:45 17:15 6", expectedOutput: "D-Tower" },
      { command: "VACANCY 13:45 15:00", expectedOutput: "G-Mansion" },
      { command: "BOOK 14:00 15:00 2", expectedOutput: "G-Mansion" },
      { command: "BOOK 17:00 18:30 12", expectedOutput: "G-Mansion" },
      { command: "VACANCY 17:00 18:00", expectedOutput: "NO_VACANT_ROOM" },
      { command: "VACANCY 17:30 18:00", expectedOutput: "D-Tower" },
      { command: "BOOK 17:00 18:30 12", expectedOutput: "NO_VACANT_ROOM" },
      { command: "BOOK 15:35 16:35 12", expectedOutput: "INCORRECT_INPUT" },
    ].map(({ command, expectedOutput }) => {
      const actualOutput = app.execute(command);
      assert.equal(actualOutput, expectedOutput, `Command: ${command}`);
    })
  });
});