import { assert } from "chai";
import { Time, TimeSlot } from "../../src/domain/time_slot.js";

describe("Time Slot", () => {
  describe("Contains", () => {
    it("should contain starting time", () => {
      const timeSlot = new TimeSlot(new Time(10, 15), new Time(10, 30));
      assert.isTrue(timeSlot.contains(new Time(10, 15)));
    });

    it("should contain end time", () => {
      const timeSlot = new TimeSlot(new Time(10, 15), new Time(10, 30));
      assert.isTrue(timeSlot.contains(new Time(10, 30)));
    });

    it("should contain time between start and end", () => {
      const timeSlot = new TimeSlot(new Time(10, 15), new Time(10, 30));
      assert.isTrue(timeSlot.contains(new Time(10, 20)));
    });

    it("should contain time between start and end when hours are differen", () => {
      const timeSlot = new TimeSlot(new Time(10, 15), new Time(11, 30));
      assert.isTrue(timeSlot.contains(new Time(11, 0)));
    });

    it("should not contain time less than start time", () => {
      const timeSlot = new TimeSlot(new Time(10, 15), new Time(11, 30));
      assert.isFalse(timeSlot.contains(new Time(10, 10)));
    });

    it("should not contain time greater than end time", () => {
      const timeSlot = new TimeSlot(new Time(10, 15), new Time(11, 30));
      assert.isFalse(timeSlot.contains(new Time(11, 40)));
    });
  });

  describe("Overlap", () => {
    it("should overlap with same timeslot", () => {
      const timeSlot = new TimeSlot(new Time(10, 15), new Time(11, 30));
      const otherSlot = new TimeSlot(new Time(10, 15), new Time(11, 30));
      assert.isTrue(timeSlot.overlaps(otherSlot));
    });

    it("should overlap with timeslot inbetween given slot", () => {
      const timeSlot = new TimeSlot(new Time(10, 15), new Time(11, 30));
      const otherSlot = new TimeSlot(new Time(10, 35), new Time(10, 55));
      assert.isTrue(timeSlot.overlaps(otherSlot));
    });

    it("should overlap with endtime inbetween the timeslot", () => {
      const timeSlot = new TimeSlot(new Time(10, 15), new Time(11, 30));
      const otherSlot = new TimeSlot(new Time(9, 35), new Time(10, 25));
      assert.isTrue(timeSlot.overlaps(otherSlot));
    });

    it("should overlap with starttime inbetween the timeslot", () => {
      const timeSlot = new TimeSlot(new Time(10, 15), new Time(11, 30));
      const otherSlot = new TimeSlot(new Time(10, 35), new Time(11, 55));
      assert.isTrue(timeSlot.overlaps(otherSlot));
    });
  });
});