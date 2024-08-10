import { assert } from "chai";
import { App } from "../../src/cli/app.js";
import { Time, TimeSlot } from "../../src/domain/time_slot.js";

describe("App", () => {
  const bufferTime = [
    new TimeSlot(new Time(9, 0), new Time(9, 15)),
    new TimeSlot(new Time(13, 15), new Time(13, 45)),
    new TimeSlot(new Time(18, 45), new Time(19, 0)),
  ];

  const config = {
    rooms: [
      { name: "C-Cave", capacity: 3 },
      { name: "D-Tower", capacity: 4 },
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
      "NO_VACANT_ROOM",
    );
    assert.deepStrictEqual(
      app.execute("BOOK 11:15 11:30 13"),
      "NO_VACANT_ROOM",
    );
  });
});