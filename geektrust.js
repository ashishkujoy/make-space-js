const fs = require("fs");
const App = require("./src/cli/app.js");
const { TimeSlot, Time } = require("./src/domain/time_slot.js");

const filename = process.argv[2];

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

const app = App.createInstance(config);

fs.readFile(filename, "utf8", (err, data) => {
    if (err) throw err
    data.split("\n").forEach(line => console.log(app.execute(line)))
});
