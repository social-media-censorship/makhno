'use strict';

var utils = require('../utils/writer.js');
var Submission = require('../service/SubmissionService');

module.exports.submissionGET = function submissionGET (req, res, next, filter) {
  Submission.submissionGET(filter)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.submitURL = function submitURL (req, res, next, body) {
  Submission.submitURL(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.submitURL = function submitURL (req, res, next, body) {
  Submission.submitURL(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
