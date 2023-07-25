/**
 *  To test install mocha:
 *      npm install -g mocha
 *
 *  Run mocha:
 *      mocha
 */

'use strict';

var eventHandler = require('./cjs/event-handler.js');
var assert = require('assert');

describe('event-handler', function () {

    // create a class
    var Foo = function () {};

    // mixin the class to the event-handler
    eventHandler(Foo);

    // create instances of the class
    var a = new Foo();
    var b = new Foo();

    // create an instance of the event-handler
    var c = eventHandler();

    it('should allow you to add an event to a class', function () {
        var status = '';

        a.on('blerg', function (value) {

            status = value;
        });

        a.emit('blerg', 'beep');

        assert.equal(status, 'beep');
    });

    it('should add 1 event to "a" but zero events to "b"', function () {

        assert.equal(a._events.hasOwnProperty('blerg'), true);
        assert.equal(typeof b._events, 'undefined');
    });

    it('should allow you to remove an event', function () {

        var newFn = function () {
            void 0;
        };

        a.on('blerg', newFn);

        assert.equal(a._events['blerg'].length, 2);

        a.off('blerg', newFn);

        assert.equal(a._events['blerg'].length, 1);

    });

    it('should allow you to add multiple events with spaces', function () {
        var status = '';

        b.on('one two three', function (value) {

            status = value;
        });

        b.emit('two', 'beep');

        assert.equal(status, 'beep');
    });

    it('should allow you to remove multiple events with spaces', function () {

        assert.equal(b._events['three'].length, 1);

        b.off('one three');

        assert.equal(typeof b._events['three'], 'undefined');
    });

    it('should allow you to remove all events', function () {

        var newFn = function () {
            void 0;
        };

        a.on('blerg', newFn);

        a.off('blerg');

        assert.equal(typeof a._events['blerg'], 'undefined');
    });

    it('should call all events before the colon', function () {
        var count = 0;

        a.on('subevent', function (name, args) {
            assert.equal(name, 'sub');
            assert.equal(args, 'args');
            count += 1;
        });

        a.on('subevent:extra', function (name, args) {
            assert.equal(name, 'sub');
            assert.equal(args, 'args');
            count += 1;
        });

        a.on('subevent:extra:more', function (name, args) {
            assert.equal(name, 'sub');
            assert.equal(args, 'args');
            count += 1;
        });

        a.emit('subevent:extra:more', 'sub', 'args');

        assert.equal(count, 3);
    });

    it('should allow you to use it as an instance with legacy methods', function () {

        c.on('blerg-on', function (value) {

            assert.equal(value, 'beep');
        });

        c.bind('blerg-bind', function (value) {

            assert.equal(value, 'boop');
        });

        c.emit('blerg-on', 'beep');

        c.trigger('blerg-bind', 'boop');
    });

});
