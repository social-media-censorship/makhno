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
import {AddScheduled} from '../model/AddScheduled';
import {ScheduledActivity} from '../model/ScheduledActivity';
import {ScheduledList} from '../model/ScheduledList';

/**
* Scheduled service.
* @module api/ScheduledApi
* @version 1.0.0
*/
export class ScheduledApi {

    /**
    * Constructs a new ScheduledApi. 
    * @alias module:api/ScheduledApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instanc
    e} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }

    /**
     * Callback function to receive the result of the forceSchedule operation.
     * @callback moduleapi/ScheduledApi~forceScheduleCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ScheduledActivity{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Reserved API, it is not mean to be user facing
     * @param {module:model/AddScheduled} body The payload allow an admin (or someone with special privileges) for force specific test, and controlling the parameters such as timing, country requestes, targetURL, timing (and implicitly also its the priority)
     * @param {String} submissionId 
     * @param {Date} checkTimeWindowUTC 
     * @param {Array.<String>} countryCodes 
     * @param {String} authoritative 
     * @param {module:api/ScheduledApi~forceScheduleCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
    forceSchedule(body, submissionId, checkTimeWindowUTC, countryCodes, authoritative, callback) {
      
      let postBody = body;
      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling forceSchedule");
      }
      // verify the required parameter 'submissionId' is set
      if (submissionId === undefined || submissionId === null) {
        throw new Error("Missing the required parameter 'submissionId' when calling forceSchedule");
      }
      // verify the required parameter 'checkTimeWindowUTC' is set
      if (checkTimeWindowUTC === undefined || checkTimeWindowUTC === null) {
        throw new Error("Missing the required parameter 'checkTimeWindowUTC' when calling forceSchedule");
      }
      // verify the required parameter 'countryCodes' is set
      if (countryCodes === undefined || countryCodes === null) {
        throw new Error("Missing the required parameter 'countryCodes' when calling forceSchedule");
      }
      // verify the required parameter 'authoritative' is set
      if (authoritative === undefined || authoritative === null) {
        throw new Error("Missing the required parameter 'authoritative' when calling forceSchedule");
      }

      let pathParams = {
        
      };
      let queryParams = {
        
      };
      let headerParams = {
        
      };
      let formParams = {
        'submissionId': submissionId,'checkTimeWindowUTC': checkTimeWindowUTC,'countryCodes': this.apiClient.buildCollectionParam(countryCodes, 'multi'),'authoritative': authoritative
      };

      let authNames = [];
      let contentTypes = ['application/json', 'application/xml', 'application/x-www-form-urlencoded'];
      let accepts = ['application/json', 'application/xml'];
      let returnType = ScheduledActivity;

      return this.apiClient.callApi(
        '/scheduled', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the retrieveSchedule operation.
     * @callback moduleapi/ScheduledApi~retrieveScheduleCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ScheduledList{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Invoked by &#x60;agent&#x60; gets what should be tested
     * This endpoint is queried by distributed agent around the world, they look for target URLs fitting their possibilities. normally a default agent should query by using the location as &#x60;vantagePoint&#x60;, but in future versions, agents might for example query because of specific platform (i.e. only facebook and only check &#x60;agent&#x60; should run from Italy). &#x60;submissionId&#x60; are duplicated in this API because a submission is requested to have a &#x60;availabilityCheck&#x60; more than once and from more than one &#x60;vantagePoint&#x60;
     * @param {Object} opts Optional parameters
     * @param {String} opts.filter query parameters to filter by platform, day, and two letter country code
     * @param {module:api/ScheduledApi~retrieveScheduleCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
    retrieveSchedule(opts, callback) {
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
      let returnType = ScheduledList;

      return this.apiClient.callApi(
        '/scheduled', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

}