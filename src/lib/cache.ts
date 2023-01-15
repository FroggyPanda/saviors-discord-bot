import { EventEmitter } from 'node:events';

type Data<Template> = {
  [Key in keyof Template]: Map<number, Template[Key]>;
};

/**
 * Extends off of the EventEmmitter class.  Possible events `endOfLife`
 * @param {number} lifespan The lifespan of all data.  Use the event `endOfLife` to know when it has been hit.
 * @example
 * type User = { id: number; name: string; }
 * type Message = { id: number; content: string; timestamp: number; }
 *
 * const cache = new Cache<{user: User; message: Message;}>(0);
 */
export default class Cache<Template> extends EventEmitter {
  private data: Data<Template>;
  private lifespan: number;
  private timeLeft: number;

  constructor(lifespan: number) {
    super();
    // @ts-ignore
    this.data = {};
    this.lifespan = lifespan;
    this.timeLeft = Date.now() + this.lifespan;
  }

  private isEndOfLife(): boolean {
    if (this.timeLeft < Date.now()) {
      this.timeLeft = Date.now() + this.lifespan;
      return true;
    }
    return false;
  }

  // prettier-ignore
  public set<Table extends keyof Template>(table: Table, id: number, value: Template[Table]) {
		if (this.isEndOfLife()) {
			this.emit('endOfLife');
		}

		if (this.data[table] === undefined) {
			this.data[table] = new Map<number, any>();
		}

		this.data[table].set(id, value);
	}

  // prettier-ignore
  public get<Table extends keyof Template>(table: Table): Template[Table][] | undefined;
  // prettier-ignore
  public get<Table extends keyof Template>(table: Table, id: number): Template[Table] | undefined;
  // prettier-ignore
  public get<Table extends keyof Template>(table: Table, id?: number): Template[Table][] | Template[Table] | undefined {
		if (this.isEndOfLife()) this.emit('endOfLife');

		if (id === undefined) {
			if (this.data[table] === undefined) return undefined;

			return [...this.data[table].values()];
		} else {
			if (this.data[table] === undefined) return undefined;

			return this.data[table].get(id);
		}
	}
}
