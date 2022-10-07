'use strict';

var utils = require('../utils/writer.js');
var Results = require('../service/ResultsService');

module.exports.retrieveResults = function retrieveResults (req, res, next, filter) {
  Results.retrieveResults(filter)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.submitValidationCheck = function submitValidationCheck (req, res, next, body) {
  Results.submitValidationCheck(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.submitValidationCheck = function submitValidationCheck (req, res, next, body) {
  Results.submitValidationCheck(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
