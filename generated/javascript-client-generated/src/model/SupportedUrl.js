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
 * The SupportedUrl model module.
 * @module model/SupportedUrl
 * @version 1.0.0
 */
export class SupportedUrl {
  /**
   * Constructs a new <code>SupportedUrl</code>.
   * @alias module:model/SupportedUrl
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>SupportedUrl</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/SupportedUrl} obj Optional instance to populate.
   * @return {module:model/SupportedUrl} The populated <code>SupportedUrl</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new SupportedUrl();
      if (data.hasOwnProperty('platform'))
        obj.platform = ApiClient.convertToType(data['platform'], 'String');
      if (data.hasOwnProperty('nature'))
        obj.nature = ApiClient.convertToType(data['nature'], 'String');
      if (data.hasOwnProperty('details'))
        obj.details = ApiClient.convertToType(data['details'], Object);
      if (data.hasOwnProperty('supported'))
        obj.supported = ApiClient.convertToType(data['supported'], 'Boolean');
      if (data.hasOwnProperty('id'))
        obj.id = ApiClient.convertToType(data['id'], 'String');
    }
    return obj;
  }
}

/**
 * youtube.com, or tiktok.com, basically the url.hostname field
 * @member {String} platform
 */
SupportedUrl.prototype.platform = undefined;

/**
 * the kind of page in the platform (search, profile, homepage, video, etc)
 * @member {String} nature
 */
SupportedUrl.prototype.nature = undefined;

/**
 * the query string, or the videoId, it depends from the nature if details is set or not.
 * @member {Object} details
 */
SupportedUrl.prototype.details = undefined;

/**
 * if the URL can be interpret by the parser API or not
 * @member {Boolean} supported
 */
SupportedUrl.prototype.supported = undefined;

/**
 * the unique ID tight to targetURL, that can be used to fetch other results. This is calculated by hashing the URL.
 * @member {String} id
 */
SupportedUrl.prototype.id = undefined;
