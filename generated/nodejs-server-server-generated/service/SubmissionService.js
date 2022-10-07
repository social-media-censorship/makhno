'use strict';


/**
 * Know which URL have been submitted (not used by agent)
 * This is the endpoint that manages a collection of objects into the database; It returns the list of `targetURL` that match the criterias specify by the `agent`, it can also return a default if not filtering is provided; it is worthy to list existing requested URL and identify their presence in the infrastructure. the `id` mentioned here is also referred as `submissionId` in other endpoints.
 *
 * filter String query parameters to filter the URL submitted in the past, that might be tested by an agent (optional)
 * returns SubmissionList
 **/
exports.submissionGET = function(filter) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "countryCodes" : [ "countryCodes", "countryCodes" ],
  "url" : {
    "nature" : "nature",
    "details" : { },
    "id" : "id",
    "platform" : "platform",
    "supported" : true
  }
}, {
  "countryCodes" : [ "countryCodes", "countryCodes" ],
  "url" : {
    "nature" : "nature",
    "details" : { },
    "id" : "id",
    "platform" : "platform",
    "supported" : true
  }
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Submit to the Makhno server the request to verify a `targetURL`
 *
 * body SubmissionProposal The payload contains a `targetURL` and one or more country code, in the hopes some `agent` that runs in the right ISP, would pull this submission and perform an `availabilityCheck` from their `vantagePoint`. Internally the `target URL` is validated in the same way as in the /GAFAM/ endpoints.
 * returns SubmissionDetail
 **/
exports.submitURL = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "countryCodes" : [ "countryCodes", "countryCodes" ],
  "url" : {
    "nature" : "nature",
    "details" : { },
    "id" : "id",
    "platform" : "platform",
    "supported" : true
  }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Submit to the Makhno server the request to verify a `targetURL`
 *
 * body SubmissionProposal The payload contains a `targetURL` and one or more country code, in the hopes some `agent` that runs in the right ISP, would pull this submission and perform an `availabilityCheck` from their `vantagePoint`. Internally the `target URL` is validated in the same way as in the /GAFAM/ endpoints.
 * returns SubmissionDetail
 **/
exports.submitURL = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "countryCodes" : [ "countryCodes", "countryCodes" ],
  "url" : {
    "nature" : "nature",
    "details" : { },
    "id" : "id",
    "platform" : "platform",
    "supported" : true
  }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

