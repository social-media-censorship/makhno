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
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(['expect.js', '../../src/index'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    factory(require('expect.js'), require('../../src/index'));
  } else {
    // Browser globals (root is window)
    factory(root.expect, root.MakhnoApiDesign);
  }
}(this, function(expect, MakhnoApiDesign) {
  'use strict';

  var instance;

  describe('(package)', function() {
    describe('AddScheduled', function() {
      beforeEach(function() {
        instance = new MakhnoApiDesign.AddScheduled();
      });

      it('should create an instance of AddScheduled', function() {
        // TODO: update the code to test AddScheduled
        expect(instance).to.be.a(MakhnoApiDesign.AddScheduled);
      });

      it('should have the property submissionId (base name: "submissionId")', function() {
        // TODO: update the code to test the property submissionId
        expect(instance).to.have.property('submissionId');
        // expect(instance.submissionId).to.be(expectedValueLiteral);
      });

      it('should have the property checkTimeWindowUTC (base name: "checkTimeWindowUTC")', function() {
        // TODO: update the code to test the property checkTimeWindowUTC
        expect(instance).to.have.property('checkTimeWindowUTC');
        // expect(instance.checkTimeWindowUTC).to.be(expectedValueLiteral);
      });

      it('should have the property countryCodes (base name: "countryCodes")', function() {
        // TODO: update the code to test the property countryCodes
        expect(instance).to.have.property('countryCodes');
        // expect(instance.countryCodes).to.be(expectedValueLiteral);
      });

      it('should have the property authoritative (base name: "authoritative")', function() {
        // TODO: update the code to test the property authoritative
        expect(instance).to.have.property('authoritative');
        // expect(instance.authoritative).to.be(expectedValueLiteral);
      });

    });
  });

}));
