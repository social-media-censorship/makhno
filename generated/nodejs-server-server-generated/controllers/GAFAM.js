'use strict';

var utils = require('../utils/writer.js');
var GAFAM = require('../service/GAFAMService');

module.exports.gAFAMparse = function gAFAMparse (req, res, next, body) {
  GAFAM.gAFAMparse(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.gAFAMparse = function gAFAMparse (req, res, next, body) {
  GAFAM.gAFAMparse(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.gAFAMsupported = function gAFAMsupported (req, res, next, body) {
  GAFAM.gAFAMsupported(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.gAFAMsupported = function gAFAMsupported (req, res, next, body) {
  GAFAM.gAFAMsupported(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.gAFAMsupportedList = function gAFAMsupportedList (req, res, next) {
  GAFAM.gAFAMsupportedList()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
