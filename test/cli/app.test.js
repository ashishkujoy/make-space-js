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

  it("should handle multiple command from geektrust test 1", () => {
    const app = App.createInstance(config);
    [
      { command: "VACANCY 10:00 12:00", expectedOutput: "C-Cave D-Tower G-Mansion" },
      { command: "BOOK 11:00 11:45 2", expectedOutput: "C-Cave" },
      { command: "BOOK 11:30 13:00 35", expectedOutput: "NO_VACANT_ROOM" },
      { command: "BOOK 11:30 13:00 15", expectedOutput: "G-Mansion" },
      { command: "VACANCY 11:30 12:00", expectedOutput: "D-Tower" },
      { command: "BOOK 14:00 15:30 3", expectedOutput: "C-Cave" },
      { command: "BOOK 15:00 16:30 2", expectedOutput: "D-Tower" },
      { command: "BOOK 15:15 12:15 12", expectedOutput: "INCORRECT_INPUT" },
      { command: "VACANCY 15:30 16:00", expectedOutput: "C-Cave G-Mansion" },
      { command: "BOOK 15:30 16:30 2", expectedOutput: "C-Cave" },
      { command: "VACANCY 15:45 16:00", expectedOutput: "G-Mansion" },
      { command: "BOOK 16:00 17:00 5", expectedOutput: "G-Mansion" },
      { command: "VACANCY 18:00 19:00", expectedOutput: "NO_VACANT_ROOM" },
    ].map(({ command, expectedOutput }) => {
      const actualOutput = app.execute(command);
      assert.equal(actualOutput, expectedOutput, `Command: ${command}`);
    })
  });

  it("should handle multiple command from geektrust test 2", () => {
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

  it("should handle multiple command from geektrust test 3", () => {
    const app = App.createInstance(config);
    [
      { command: "VACANCY 20:00 23:45", expectedOutput: "C-Cave D-Tower G-Mansion" },
      { command: "BOOK 00:00 03:00 6", expectedOutput: "D-Tower" },
      { command: "BOOK 22:00 23:30 18", expectedOutput: "G-Mansion" },
      { command: "BOOK 23:00 23:45 4", expectedOutput: "D-Tower" },
      { command: "VACANCY 22:00 23:45", expectedOutput: "C-Cave" },
      { command: "VACANCY 22:00 01:00", expectedOutput: "INCORRECT_INPUT" },
    ].map(({ command, expectedOutput }) => {
      const actualOutput = app.execute(command);
      assert.equal(actualOutput, expectedOutput, `Command: ${command}`);
    })
  });

  it("should handle multiple command from geektrust test 4", () => {
    const app = App.createInstance(config);
    [
      { command: "BOOK 09:30 10:00 2", expectedOutput: "C-Cave" },
      { command: "BOOK 09:30 11:15 6", expectedOutput: "D-Tower" },
      { command: "BOOK 09:30 11:00 3", expectedOutput: "G-Mansion" },
      { command: "BOOK 10:15 11:30 2", expectedOutput: "C-Cave" },
      { command: "BOOK 11:00 12:00 3", expectedOutput: "G-Mansion" },
      { command: "VACANCY 11:30 12:00", expectedOutput: "C-Cave D-Tower" },
    ].map(({ command, expectedOutput }) => {
      const actualOutput = app.execute(command);
      assert.equal(actualOutput, expectedOutput, `Command: ${command}`);
    })
  });
});