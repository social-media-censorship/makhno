# MakhnoApiDesign.ResultsApi

All URIs are relative to *https://makhno.net/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**retrieveResults**](ResultsApi.md#retrieveResults) | **GET** /results | Invoked by webapp and bots to report the reachability status
[**submitValidationCheck**](ResultsApi.md#submitValidationCheck) | **POST** /results | Reserved API, it is not mean to be user facing

<a name="retrieveResults"></a>
# **retrieveResults**
> TestResultList retrieveResults(opts)

Invoked by webapp and bots to report the reachability status

this endpoint should be the primarly public endpoint meant to report the status of reachability for an individual target URL.

### Example
```javascript
import {MakhnoApiDesign} from 'makhno_api_design';

let apiInstance = new MakhnoApiDesign.ResultsApi();
let opts = { 
  'filter': "filter_example" // String | query parameters to filter by platform, day, and two letter country code
};
apiInstance.retrieveResults(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **filter** | **String**| query parameters to filter by platform, day, and two letter country code | [optional] 

### Return type

[**TestResultList**](TestResultList.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, application/xml

<a name="submitValidationCheck"></a>
# **submitValidationCheck**
> submitValidationCheck(body, submissionId, testId, vantagePoint, checkTimeUTC, status, authoritative)

Reserved API, it is not mean to be user facing

### Example
```javascript
import {MakhnoApiDesign} from 'makhno_api_design';

let apiInstance = new MakhnoApiDesign.ResultsApi();
let body = new MakhnoApiDesign.ValidityCheck(); // ValidityCheck | This endpoint should be used by who has the privileges to submit a result into the platform.
let submissionId = "submissionId_example"; // String | 
let testId = "testId_example"; // String | 
let vantagePoint = "vantagePoint_example"; // String | 
let checkTimeUTC = new Date("2013-10-20"); // Date | 
let status = "status_example"; // String | 
let authoritative = "authoritative_example"; // String | 

apiInstance.submitValidationCheck(body, submissionId, testId, vantagePoint, checkTimeUTC, status, authoritative, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**ValidityCheck**](ValidityCheck.md)| This endpoint should be used by who has the privileges to submit a result into the platform. | 
 **submissionId** | **String**|  | 
 **testId** | **String**|  | 
 **vantagePoint** | **String**|  | 
 **checkTimeUTC** | **Date**|  | 
 **status** | **String**|  | 
 **authoritative** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, application/xml, application/x-www-form-urlencoded
 - **Accept**: Not defined

