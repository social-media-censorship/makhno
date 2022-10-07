/*
 * Makhno API design
 * The endpoint sequence described here is part of the Makhno suite. The purpose is to define a protocol by which a client can request reachability checks from our infrastructure.  ## There are some reserved words that we use in this document:  `target URL`: this is the URL of a social media platform that we want to monitor. the subjects covered in this framework, are, for the most part. `target URLs`. they can be youtube videos or facebook posts. we are talking about a social media platform URL (not all of them are supported, of course, and different versions prograd in supporting more and more of them)  `availabilityCheck`: is the action by which we verify that a `target URL` is accessible from a certain country.  `vantagePoint`: is a point in the Internet network from which the availabilityCheck is executed to a targetURL. They are identified by the nationality of the internet service provider hosting them.  `agent`: a tool executed from a `vantagePoint`, this tool connects to a `target URL` and verify if the content is reachable or not.  ## The purpose of Makhno, as you can guess, is to map whether a social media content is accessible from a nation or not.
 *
 * OpenAPI spec version: 1.0.0
 * Contact: technology@makhno.net
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 3.0.35
 *
 * Do not edit the class manually.
 *
 */
import {ApiClient} from "../ApiClient";
import {TestResultList} from '../model/TestResultList';
import {ValidityCheck} from '../model/ValidityCheck';

/**
* Results service.
* @module api/ResultsApi
* @version 1.0.0
*/
export class ResultsApi {

    /**
    * Constructs a new ResultsApi. 
    * @alias module:api/ResultsApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instanc
    e} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }

    /**
     * Callback function to receive the result of the retrieveResults operation.
     * @callback moduleapi/ResultsApi~retrieveResultsCallback
     * @param {String} error Error message, if any.
     * @param {module:model/TestResultList{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Invoked by webapp and bots to report the reachability status
     * this endpoint should be the primarly public endpoint meant to report the status of reachability for an individual target URL.
     * @param {Object} opts Optional parameters
     * @param {String} opts.filter query parameters to filter by platform, day, and two letter country code
     * @param {module:api/ResultsApi~retrieveResultsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
    retrieveResults(opts, callback) {
      opts = opts || {};
      let postBody = null;

      let pathParams = {
        
      };
      let queryParams = {
        'filter': opts['filter']
      };
      let headerParams = {
        
      };
      let formParams = {
        
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json', 'application/xml'];
      let returnType = TestResultList;

      return this.apiClient.callApi(
        '/results', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the submitValidationCheck operation.
     * @callback moduleapi/ResultsApi~submitValidationCheckCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Reserved API, it is not mean to be user facing
     * @param {module:model/ValidityCheck} body This endpoint should be used by who has the privileges to submit a result into the platform.
     * @param {String} submissionId 
     * @param {String} testId 
     * @param {String} vantagePoint 
     * @param {Date} checkTimeUTC 
     * @param {module:model/String} status 
     * @param {String} authoritative 
     * @param {module:api/ResultsApi~submitValidationCheckCallback} callback The callback function, accepting three arguments: error, data, response
     */
    submitValidationCheck(body, submissionId, testId, vantagePoint, checkTimeUTC, status, authoritative, callback) {
      
      let postBody = body;
      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling submitValidationCheck");
      }
      // verify the required parameter 'submissionId' is set
      if (submissionId === undefined || submissionId === null) {
        throw new Error("Missing the required parameter 'submissionId' when calling submitValidationCheck");
      }
      // verify the required parameter 'testId' is set
      if (testId === undefined || testId === null) {
        throw new Error("Missing the required parameter 'testId' when calling submitValidationCheck");
      }
      // verify the required parameter 'vantagePoint' is set
      if (vantagePoint === undefined || vantagePoint === null) {
        throw new Error("Missing the required parameter 'vantagePoint' when calling submitValidationCheck");
      }
      // verify the required parameter 'checkTimeUTC' is set
      if (checkTimeUTC === undefined || checkTimeUTC === null) {
        throw new Error("Missing the required parameter 'checkTimeUTC' when calling submitValidationCheck");
      }
      // verify the required parameter 'status' is set
      if (status === undefined || status === null) {
        throw new Error("Missing the required parameter 'status' when calling submitValidationCheck");
      }
      // verify the required parameter 'authoritative' is set
      if (authoritative === undefined || authoritative === null) {
        throw new Error("Missing the required parameter 'authoritative' when calling submitValidationCheck");
      }

      let pathParams = {
        
      };
      let queryParams = {
        
      };
      let headerParams = {
        
      };
      let formParams = {
        'submissionId': submissionId,'testId': testId,'vantagePoint': vantagePoint,'checkTimeUTC': checkTimeUTC,'status': status,'authoritative': authoritative
      };

      let authNames = [];
      let contentTypes = ['application/json', 'application/xml', 'application/x-www-form-urlencoded'];
      let accepts = [];
      let returnType = null;

      return this.apiClient.callApi(
        '/results', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

}