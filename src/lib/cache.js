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
  }

  get(table, key) {
    if (this.isEndOfLife()) {
      this.emit('endOfLife');
    }
    if (arguments.length === 1) {
      if (this.data[table] === undefined)
        // throw new Error('table does not exist');
        return false;
      return [...this.data[table].values()];
    } else if (arguments.length === 2) {
      if (this.data[table] === undefined)
        // throw new Error('table does not exist');
        return false;
      if (this.data[table].get(key) === undefined)
        // throw new Error('key does not exist');
        return false;

      return this.data[table].get(key);
    }
  }
}
