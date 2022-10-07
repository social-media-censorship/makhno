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
 * The ProposedUrl model module.
 * @module model/ProposedUrl
 * @version 1.0.0
 */
export class ProposedUrl {
  /**
   * Constructs a new <code>ProposedUrl</code>.
   * @alias module:model/ProposedUrl
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>ProposedUrl</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ProposedUrl} obj Optional instance to populate.
   * @return {module:model/ProposedUrl} The populated <code>ProposedUrl</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new ProposedUrl();
      if (data.hasOwnProperty('targetURL'))
        obj.targetURL = ApiClient.convertToType(data['targetURL'], 'String');
    }
    return obj;
  }
}

/**
 * the URL you want to check if is supported or not
 * @member {String} targetURL
 */
ProposedUrl.prototype.targetURL = undefined;

