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
import {ParsePayload} from '../model/ParsePayload';
import {ParseResult} from '../model/ParseResult';
import {ProposedUrl} from '../model/ProposedUrl';
import {SupportedUrl} from '../model/SupportedUrl';
import {SupportedUrlFormatList} from '../model/SupportedUrlFormatList';

/**
* GAFAM service.
* @module api/GAFAMApi
* @version 1.0.0
*/
export class GAFAMApi {

    /**
    * Constructs a new GAFAMApi. 
    * @alias module:api/GAFAMApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instanc
    e} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }

    /**
     * Callback function to receive the result of the gAFAMparse operation.
     * @callback moduleapi/GAFAMApi~gAFAMparseCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ParseResult{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * this endpoint receives the payload produced from one of the &#x60;agent&#x60; collecting evidence.
     * An API that process HTML and parse it, receive a &#x60;targetURL&#x60; and before parsing it, it also re-check if the url is supported, by using the same internal validation also provided by the API &#x60;/GAFAM/supported&#x60;
     * @param {module:model/ParsePayload} body The payload captured by the agent and information about the agent itself, also information about the &#x60;vantagePoint&#x60;
     * @param {String} targetURL 
     * @param {String} source 
     * @param {String} countryCode 
     * @param {String} html 
     * @param {module:api/GAFAMApi~gAFAMparseCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
    gAFAMparse(body, targetURL, source, countryCode, html, callback) {
      
      let postBody = body;
      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling gAFAMparse");
      }
      // verify the required parameter 'targetURL' is set
      if (targetURL === undefined || targetURL === null) {
        throw new Error("Missing the required parameter 'targetURL' when calling gAFAMparse");
      }
      // verify the required parameter 'source' is set
      if (source === undefined || source === null) {
        throw new Error("Missing the required parameter 'source' when calling gAFAMparse");
      }
      // verify the required parameter 'countryCode' is set
      if (countryCode === undefined || countryCode === null) {
        throw new Error("Missing the required parameter 'countryCode' when calling gAFAMparse");
      }
      // verify the required parameter 'html' is set
      if (html === undefined || html === null) {
        throw new Error("Missing the required parameter 'html' when calling gAFAMparse");
      }

      let pathParams = {
        
      };
      let queryParams = {
        
      };
      let headerParams = {
        
      };
      let formParams = {
        'targetURL': targetURL,'source': source,'countryCode': countryCode,'html': html
      };

      let authNames = [];
      let contentTypes = ['application/json', 'application/xml', 'application/x-www-form-urlencoded'];
      let accepts = ['application/json', 'application/xml'];
      let returnType = ParseResult;

      return this.apiClient.callApi(
        '/GAFAM/parse', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the gAFAMsupported operation.
     * @callback moduleapi/GAFAMApi~gAFAMsupportedCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SupportedUrl{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Return if a &#x60;target URL&#x60; belongs to a supported platform
     * it expect in the payload a target URL, it return with what normally is referred as Nature, so the nature of the URL. such as, a youtube video or a tiktok channel.
     * @param {Object} opts Optional parameters
     * @param {module:model/ProposedUrl} opts.body 
     * @param {String} opts.targetURL 
     * @param {module:api/GAFAMApi~gAFAMsupportedCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
    gAFAMsupported(opts, callback) {
      opts = opts || {};
      let postBody = opts['body'];

      let pathParams = {
        
      };
      let queryParams = {
        
      };
      let headerParams = {
        
      };
      let formParams = {
        'targetURL': opts['targetURL']
      };

      let authNames = [];
      let contentTypes = ['application/json', 'application/xml', 'application/x-www-form-urlencoded'];
      let accepts = ['application/json'];
      let returnType = SupportedUrl;

      return this.apiClient.callApi(
        '/GAFAM/supported', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the gAFAMsupportedList operation.
     * @callback moduleapi/GAFAMApi~gAFAMsupportedListCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SupportedUrlFormatList{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Display a list of the supported natures and URL exmaples that can be processed
     * @param {module:api/GAFAMApi~gAFAMsupportedListCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
    gAFAMsupportedList(callback) {
      
      let postBody = null;

      let pathParams = {
        
      };
      let queryParams = {
        
      };
      let headerParams = {
        
      };
      let formParams = {
        
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = SupportedUrlFormatList;

      return this.apiClient.callApi(
        '/GAFAM/supported', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

}