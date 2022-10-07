'use strict';


/**
 * Reserved API, it is not mean to be user facing
 *
 * body AddScheduled The payload allow an admin (or someone with special privileges) for force specific test, and controlling the parameters such as timing, country requestes, targetURL, timing (and implicitly also its the priority)
 * returns ScheduledActivity
 **/
exports.forceSchedule = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "countryCodes" : [ "countryCodes", "countryCodes" ],
  "submissionId" : "submissionId",
  "checkTime" : "2000-01-23",
  "testId" : "testId"
};
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
 * body AddScheduled The payload allow an admin (or someone with special privileges) for force specific test, and controlling the parameters such as timing, country requestes, targetURL, timing (and implicitly also its the priority)
 * returns ScheduledActivity
 **/
exports.forceSchedule = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "countryCodes" : [ "countryCodes", "countryCodes" ],
  "submissionId" : "submissionId",
  "checkTime" : "2000-01-23",
  "testId" : "testId"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Invoked by `agent` gets what should be tested
 * This endpoint is queried by distributed agent around the world, they look for target URLs fitting their possibilities. normally a default agent should query by using the location as `vantagePoint`, but in future versions, agents might for example query because of specific platform (i.e. only facebook and only check `agent` should run from Italy). `submissionId` are duplicated in this API because a submission is requested to have a `availabilityCheck` more than once and from more than one `vantagePoint`
 *
 * filter String query parameters to filter by platform, day, and two letter country code (optional)
 * returns ScheduledList
 **/
exports.retrieveSchedule = function(filter) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "countryCodes" : [ "countryCodes", "countryCodes" ],
  "submissionId" : "submissionId",
  "checkTime" : "2000-01-23",
  "testId" : "testId"
}, {
  "countryCodes" : [ "countryCodes", "countryCodes" ],
  "submissionId" : "submissionId",
  "checkTime" : "2000-01-23",
  "testId" : "testId"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

