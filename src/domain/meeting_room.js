export default class MeetingRoom {
  constructor(name, capacity, bufferTime) {
    this.name = name;
    this.capacity = capacity;
    this.bufferTime = bufferTime;
  }

  canAccomodate(teamSize) {
    return this.capacity >= teamSize;
  }
}
