'use strict';


/**
 * this endpoint receives the payload produced from one of the `agent` collecting evidence.
 * An API that process HTML and parse it, receive a `targetURL` and before parsing it, it also re-check if the url is supported, by using the same internal validation also provided by the API `/GAFAM/supported`
 *
 * body ParsePayload The payload captured by the agent and information about the agent itself, also information about the `vantagePoint`
 * returns ParseResult
 **/
exports.gAFAMparse = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "parsingInfo" : { },
  "id" : "id",
  "contentFit" : true
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * this endpoint receives the payload produced from one of the `agent` collecting evidence.
 * An API that process HTML and parse it, receive a `targetURL` and before parsing it, it also re-check if the url is supported, by using the same internal validation also provided by the API `/GAFAM/supported`
 *
 * body ParsePayload The payload captured by the agent and information about the agent itself, also information about the `vantagePoint`
 * returns ParseResult
 **/
exports.gAFAMparse = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "parsingInfo" : { },
  "id" : "id",
  "contentFit" : true
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Return if a `target URL` belongs to a supported platform
 * it expect in the payload a target URL, it return with what normally is referred as Nature, so the nature of the URL. such as, a youtube video or a tiktok channel.
 *
 * body ProposedUrl  (optional)
 * returns SupportedUrl
 **/
exports.gAFAMsupported = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "nature" : "nature",
  "details" : { },
  "id" : "id",
  "platform" : "platform",
  "supported" : true
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Return if a `target URL` belongs to a supported platform
 * it expect in the payload a target URL, it return with what normally is referred as Nature, so the nature of the URL. such as, a youtube video or a tiktok channel.
 *
 * body ProposedUrl  (optional)
 * returns SupportedUrl
 **/
exports.gAFAMsupported = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "nature" : "nature",
  "details" : { },
  "id" : "id",
  "platform" : "platform",
  "supported" : true
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Display a list of the supported natures and URL exmaples that can be processed
 *
 * returns SupportedUrlFormatList
 **/
exports.gAFAMsupportedList = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "nature" : "nature",
  "platform" : "platform",
  "example" : "example"
}, {
  "nature" : "nature",
  "platform" : "platform",
  "example" : "example"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

