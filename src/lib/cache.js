import { EventEmitter } from 'node:events';

export default class Cache extends EventEmitter {
  constructor(lifespan) {
    super();
    this.data = {};
    this.lifespan = lifespan;
    this.timeLeft = Date.now() + this.lifespan;
  }

  isEndOfLife() {
    if (this.timeLeft < Date.now()) {
      this.timeLeft = Date.now() + this.lifespan;
      return true;
    }
    return false;
  }

  set(table, key, value) {
    if (this.isEndOfLife()) {
      this.emit('endOfLife');
    }

    if (this.data[table] === undefined) {
      this.data[table] = new Map();
      this.data[table].set(key, value);
    }

    this.data[table].set(key, value);
    return true;
  }

  get(table, key) {
    if (this.isEndOfLife()) {
      this.emit('endOfLife');
    }
    if (this.data[table] === undefined) return false;
    if (this.data[table].get(key) === undefined) return false;

    return this.data[table].get(key);
  }
}
