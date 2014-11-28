var should = require('should');
var _ = require('underscore');

var authorize = require('../');
var obj = require('./obj');

describe('cloneWhitelisted()', function () {
  cloneWhitelisted = authorize.cloneWhitelisted;

  it('should return undefined for a false or undefined whitelist', function () {
    _.each(
      [null, true, false, 1, 'foo', [null, true, false, 1, 'foo'], obj],
      function (value) {
        (cloneWhitelisted(value) === undefined).should.equal(true);
        (cloneWhitelisted(value, false) === undefined).should.equal(true);
      }
    );
  });

  it('should directly return non-array and non-object values', function () {
    _.each([true, false, 1, 'foo'], function (value) {
      cloneWhitelisted(value, true).should.equal(value);
    });
    // null has to be treated differently with should
    (cloneWhitelisted(null, true) === null).should.equal(true);
  });

  it('should copy arrays and objects', function () {
    _.each([
      {obj: [1, 2, 3], whitelist: [true]},
      {obj: {foo: 'bar'}, whitelist: {foo: true}}
    ], function (el) {
      var clone = cloneWhitelisted(el.obj, el.whitelist);
      clone.should.not.equal(el.obj);
      clone.should.eql(el.obj);
    });
  });
});
