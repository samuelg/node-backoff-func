'use strict';

var expect = require('chai').expect;

var backoff = require('../lib/backoff.js');

/*jshint expr: true*/

describe('backoff', function () {

  var retry;

  beforeEach(function() {
    retry = backoff.create();
  });

  it('should eventually call the provided function', function (done) {
    retry(function() {
      done();
    });
  });

  it('should return true if attempting to retry before max retries',
      function () {

    var scheduled;

    scheduled = retry(function() {
    });

    expect(scheduled).to.be.true;
  });

  it('should return false if attempting to retry past max retries',
      function () {

    var scheduled;

    for (var i = 0; i <= 10; i++) {
      scheduled = retry(function() {
      });
    }

    expect(scheduled).to.be.false;
  });

  it('should allow changing default delay', function (done) {

    var delayed = false;

    retry = backoff.create({
      delay: 1000
    });

    retry(function() {
      delayed = true;
    });

    setTimeout(function() {
      expect(delayed).to.be.false;

      done();
    }, 500);
  });

  it('should allow changing default max retries', function () {

    retry = backoff.create({
      maxRetries: 1
    });

    var scheduled = retry(function() {
    });

    scheduled = retry(function() {
    });

    expect(scheduled).to.be.false;
  });

  it('should allow changing default max delay', function (done) {

    var delayed = false;

    retry = backoff.create({
      delay: 500,
      maxDelay: 600
    });

    retry(function() {
      retry(function() {
        delayed = true;
      });

      setTimeout(function() {
        expect(delayed).to.be.true;

        done();
      }, 700);
    });
  });

});
