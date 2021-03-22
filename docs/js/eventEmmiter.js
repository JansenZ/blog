let events = Symbol('events');
class EventEmmiter {
    constructor() {
        this[events] = Object.create(null);
    }

    addListener(type, handler, once = false) {
        this[events][type] = this[events][type] || [];
        this[events][type].push(handler);
    }

    once(type, handler) {
        const wrapHandler = (...args) => {
            this.removeListener(type, wrapHandler);
            handler.call(this, ...args);
        }
        this.addListener(type, wrapHandler)
    }

    removeListener(type, handler) {
        if(this[events][type]) {
            if(!handler) {
                delete this[events][type];
            }
            else {
                const handlers = this[events][type];
                handlers.splice(handlers.indexOf(handler) >>> 0, 1);
            }
        }
    }

    emmit(type, ...args) {
        const handlers = this[events][type] || [];
        for(let handler of handlers) {
            handler.call(this, ...args);
        }
    }

    removeAllListeners() {
        this[events] = Object.create(null);
    }
}
