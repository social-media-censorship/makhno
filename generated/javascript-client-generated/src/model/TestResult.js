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
import {SubmissionDetail} from './SubmissionDetail';

/**
 * The TestResult model module.
 * @module model/TestResult
 * @version 1.0.0
 */
export class TestResult {
  /**
   * Constructs a new <code>TestResult</code>.
   * @alias module:model/TestResult
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>TestResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/TestResult} obj Optional instance to populate.
   * @return {module:model/TestResult} The populated <code>TestResult</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new TestResult();
      if (data.hasOwnProperty('submission'))
        obj.submission = SubmissionDetail.constructFromObject(data['submission']);
      if (data.hasOwnProperty('testId'))
        obj.testId = ApiClient.convertToType(data['testId'], 'String');
      if (data.hasOwnProperty('vantagePoint'))
        obj.vantagePoint = ApiClient.convertToType(data['vantagePoint'], 'String');
      if (data.hasOwnProperty('checkTimeUTC'))
        obj.checkTimeUTC = ApiClient.convertToType(data['checkTimeUTC'], 'Date');
      if (data.hasOwnProperty('status'))
        obj.status = ApiClient.convertToType(data['status'], 'String');
    }
    return obj;
  }
}

/**
 * @member {module:model/SubmissionDetail} submission
 */
TestResult.prototype.submission = undefined;

/**
 * @member {String} testId
 */
TestResult.prototype.testId = undefined;

/**
 * two letter country code of the agent performing the test
 * @member {String} vantagePoint
 */
TestResult.prototype.vantagePoint = undefined;

/**
 * @member {Date} checkTimeUTC
 */
TestResult.prototype.checkTimeUTC = undefined;

/**
 * Allowed values for the <code>status</code> property.
 * @enum {String}
 * @readonly
 */
TestResult.StatusEnum = {
  /**
   * value: "reachable"
   * @const
   */
  reachable: "reachable",

  /**
   * value: "not reachable"
   * @const
   */
  notReachable: "not reachable",

  /**
   * value: "validation not possible"
   * @const
   */
  validationNotPossible: "validation not possible"
};
/**
 * @member {module:model/TestResult.StatusEnum} status
 */
TestResult.prototype.status = undefined;

