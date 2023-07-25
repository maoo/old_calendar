'use strict';

const on = function (event, fn) {
    if (typeof event !== 'string' || !event.length || typeof fn === 'undefined') return;

    if (event.indexOf(' ') > -1) {
        event.split(' ').forEach(eventName => {
            on.call(this, eventName, fn);
        });
        return;
    }

    this._events = this._events || {};
    this._events[event] = this._events[event] || [];
    this._events[event].push(fn);
};

const off = function (event, fn) {
    if (typeof event !== 'string' || !event.length) return;

    if (event.indexOf(' ') > -1) {
        event.split(' ').forEach(eventName => {
            off.call(this, eventName, fn);
        });
        return;
    }

    this._events = this._events || {};

    if (event in this._events === false) return;

    if (typeof fn === 'undefined') {
        delete this._events[event];
        return;
    }

    const index = this._events[event].indexOf(fn);
    if (index > -1) {
        if (this._events[event].length === 1) {
            delete this._events[event];
        } else {
            this._events[event].splice(index, 1);
        }
    }
};

const emit = function (event, ...args) {
    const lastIndex = event.lastIndexOf(':');
    if (lastIndex > -1) {
        emit.call(this, event.substring(0, lastIndex), ...args);
    }

    this._events = this._events || {};

    if (event in this._events === false) return;

    this._events[event].forEach(fn => {
        fn.apply(this, args);
    });
};

const EventConstructor = function () {};

const proto = EventConstructor.prototype;
proto.on = on;
proto.off = off;
proto.emit = emit;

// legacy extensions
proto.bind = on;
proto.unbind = off;
proto.trigger = emit;

const handler = function (_class) {

    // constructor
    if (arguments.length === 0) {
        return new EventConstructor();
    }

    // mixin
    if (typeof _class === 'function') {
        _class.prototype.on = on;
        _class.prototype.off = off;
        _class.prototype.emit = emit;
    }

    if (typeof _class === 'object') {
        _class.on = on;
        _class.off = off;
        _class.emit = emit;
    }

    return _class;
};

handler.EventConstructor = EventConstructor;

export default handler;
