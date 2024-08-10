const assert = require("assert");
const { Time, TimeSlot } = require("../../src/domain/time_slot.js");

describe("Time Slot", () => {
  describe("Contains", () => {
    it("should not contain the start of the timeslot", () => {
      const timeSlot = new TimeSlot(new Time(10, 15), new Time(10, 30));
      assert(!timeSlot.contains(new Time(10, 15)));
    });

    it("should not contain the end of the timeslot", () => {
      const timeSlot = new TimeSlot(new Time(10, 15), new Time(10, 30));
      assert(!timeSlot.contains(new Time(10, 30)));
    });

    it("should contain time within the timeslot", () => {
      const timeSlot = new TimeSlot(new Time(10, 15), new Time(10, 30));
      assert(timeSlot.contains(new Time(10, 20)));
    });

    it("should contain time within the timeslot accross different hours", () => {
      const timeSlot = new TimeSlot(new Time(10, 15), new Time(11, 30));
      assert(timeSlot.contains(new Time(11, 0)));
    });

    it("should not contain time before start of the timeslot", () => {
      const timeSlot = new TimeSlot(new Time(10, 15), new Time(11, 30));
      assert(!timeSlot.contains(new Time(10, 10)));
    });

    it("should not contain time after end of the timeslot", () => {
      const timeSlot = new TimeSlot(new Time(10, 15), new Time(11, 30));
      assert(!timeSlot.contains(new Time(11, 40)));
    });
  });

  describe("Overlap", () => {
    it("identical timeslot should overlap", () => {
      const timeSlot = new TimeSlot(new Time(10, 15), new Time(11, 30));
      const otherSlot = new TimeSlot(new Time(10, 15), new Time(11, 30));
      assert(timeSlot.overlaps(otherSlot));
    });

    it("timeslot fully contained within another should overlap", () => {
      const timeSlot = new TimeSlot(new Time(10, 15), new Time(11, 30));
      const otherSlot = new TimeSlot(new Time(10, 35), new Time(10, 55));
      assert(timeSlot.overlaps(otherSlot));
    });

    it("timeslot starts during another slot should overlap", () => {
      const timeSlot = new TimeSlot(new Time(10, 15), new Time(11, 30));
      const otherSlot = new TimeSlot(new Time(9, 35), new Time(10, 25));
      assert(timeSlot.overlaps(otherSlot));
    });

    it("timeslot starts during and ends with another slot should overlaps", () => {
      const timeSlot = new TimeSlot(new Time(10, 15), new Time(11, 30));
      const otherSlot = new TimeSlot(new Time(10, 35), new Time(11, 55));
      assert(timeSlot.overlaps(otherSlot));
    });

    it("timeslot starts during and ends with another slot should overlaps", () => {
      const timeSlot = new TimeSlot(new Time(13, 15), new Time(13, 45));
      const otherSlot = new TimeSlot(new Time(13, 30), new Time(13, 45));
      assert(otherSlot.overlaps(timeSlot));
    });

    it("timeslot ends when another starts does not overlaps", () => {
      const timeSlot = new TimeSlot(new Time(10, 15), new Time(11, 30));
      const otherSlot = new TimeSlot(new Time(9, 35), new Time(10, 15));
      assert(!timeSlot.overlaps(otherSlot));
    });

    it("timeslot starts when another ends does not overlaps", () => {
      const timeSlot = new TimeSlot(new Time(10, 15), new Time(11, 30));
      const otherSlot = new TimeSlot(new Time(11, 30), new Time(12, 15));
      assert(!timeSlot.overlaps(otherSlot));
    });
  });

  describe("Overlaps With Any", () => {
    it("should not overlap when all timeslots are distinct", () => {
      const timeSlot = new TimeSlot(new Time(10, 15), new Time(11, 30));
      assert(!timeSlot.overlapsWithAny([
        new TimeSlot(new Time(9, 15), new Time(10, 10)),
        new TimeSlot(new Time(11, 35), new Time(11, 40)),
      ]));
    });

    it("should detecte overlap when any timeslot overlaps", () => {
      const timeSlot = new TimeSlot(new Time(10, 15), new Time(11, 30));
      assert(timeSlot.overlapsWithAny([
        new TimeSlot(new Time(10, 35), new Time(11, 0)),
        new TimeSlot(new Time(11, 35), new Time(11, 40)),
      ]));
    });
  });
});