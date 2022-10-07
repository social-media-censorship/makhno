'use strict';

var utils = require('../utils/writer.js');
var Scheduled = require('../service/ScheduledService');

module.exports.forceSchedule = function forceSchedule (req, res, next, body) {
  Scheduled.forceSchedule(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.forceSchedule = function forceSchedule (req, res, next, body) {
  Scheduled.forceSchedule(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.retrieveSchedule = function retrieveSchedule (req, res, next, filter) {
  Scheduled.retrieveSchedule(filter)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
