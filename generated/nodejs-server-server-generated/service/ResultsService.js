'use strict';


/**
 * Invoked by webapp and bots to report the reachability status
 * this endpoint should be the primarly public endpoint meant to report the status of reachability for an individual target URL.
 *
 * filter String query parameters to filter by platform, day, and two letter country code (optional)
 * returns TestResultList
 **/
exports.retrieveResults = function(filter) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "vantagePoint" : "vantagePoint",
  "submission" : {
    "countryCodes" : [ "countryCodes", "countryCodes" ],
    "url" : {
      "nature" : "nature",
      "details" : { },
      "id" : "id",
      "platform" : "platform",
      "supported" : true
    }
  },
  "testId" : "testId",
  "checkTimeUTC" : "2000-01-23",
  "status" : "reachable"
}, {
  "vantagePoint" : "vantagePoint",
  "submission" : {
    "countryCodes" : [ "countryCodes", "countryCodes" ],
    "url" : {
      "nature" : "nature",
      "details" : { },
      "id" : "id",
      "platform" : "platform",
      "supported" : true
    }
  },
  "testId" : "testId",
  "checkTimeUTC" : "2000-01-23",
  "status" : "reachable"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Reserved API, it is not mean to be user facing
 *
 * body ValidityCheck This endpoint should be used by who has the privileges to submit a result into the platform.
 * no response value expected for this operation
 **/
exports.submitValidationCheck = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Reserved API, it is not mean to be user facing
 *
 * body ValidityCheck This endpoint should be used by who has the privileges to submit a result into the platform.
 * no response value expected for this operation
 **/
exports.submitValidationCheck = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

