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
import {ApiClient} from '../ApiClient';

/**
 * The SupportedUrlFormat model module.
 * @module model/SupportedUrlFormat
 * @version 1.0.0
 */
export class SupportedUrlFormat {
  /**
   * Constructs a new <code>SupportedUrlFormat</code>.
   * @alias module:model/SupportedUrlFormat
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>SupportedUrlFormat</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/SupportedUrlFormat} obj Optional instance to populate.
   * @return {module:model/SupportedUrlFormat} The populated <code>SupportedUrlFormat</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new SupportedUrlFormat();
      if (data.hasOwnProperty('platform'))
        obj.platform = ApiClient.convertToType(data['platform'], 'String');
      if (data.hasOwnProperty('nature'))
        obj.nature = ApiClient.convertToType(data['nature'], 'String');
      if (data.hasOwnProperty('example'))
        obj.example = ApiClient.convertToType(data['example'], 'String');
    }
    return obj;
  }
}

/**
 * youtube.com, or tiktok.com, basically the url.hostname field
 * @member {String} platform
 */
SupportedUrlFormat.prototype.platform = undefined;

/**
 * the kind of page in the platform (search, profile, homepage, video, etc)
 * @member {String} nature
 */
SupportedUrlFormat.prototype.nature = undefined;

/**
 * and example of the supported URL.
 * @member {String} example
 */
SupportedUrlFormat.prototype.example = undefined;
