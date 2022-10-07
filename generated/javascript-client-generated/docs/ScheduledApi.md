# MakhnoApiDesign.ScheduledApi

All URIs are relative to *https://makhno.net/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**forceSchedule**](ScheduledApi.md#forceSchedule) | **POST** /scheduled | Reserved API, it is not mean to be user facing
[**retrieveSchedule**](ScheduledApi.md#retrieveSchedule) | **GET** /scheduled | Invoked by &#x60;agent&#x60; gets what should be tested

<a name="forceSchedule"></a>
# **forceSchedule**
> ScheduledActivity forceSchedule(body, submissionId, checkTimeWindowUTC, countryCodes, authoritative)

Reserved API, it is not mean to be user facing

### Example
```javascript
import {MakhnoApiDesign} from 'makhno_api_design';

let apiInstance = new MakhnoApiDesign.ScheduledApi();
let body = new MakhnoApiDesign.AddScheduled(); // AddScheduled | The payload allow an admin (or someone with special privileges) for force specific test, and controlling the parameters such as timing, country requestes, targetURL, timing (and implicitly also its the priority)
let submissionId = "submissionId_example"; // String | 
let checkTimeWindowUTC = new Date("2013-10-20"); // Date | 
let countryCodes = ["countryCodes_example"]; // [String] | 
let authoritative = "authoritative_example"; // String | 

apiInstance.forceSchedule(body, submissionId, checkTimeWindowUTC, countryCodes, authoritative, (error, data, response) => {
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
 **body** | [**AddScheduled**](AddScheduled.md)| The payload allow an admin (or someone with special privileges) for force specific test, and controlling the parameters such as timing, country requestes, targetURL, timing (and implicitly also its the priority) | 
 **submissionId** | **String**|  | 
 **checkTimeWindowUTC** | **Date**|  | 
 **countryCodes** | [**[String]**](String.md)|  | 
 **authoritative** | **String**|  | 

### Return type

[**ScheduledActivity**](ScheduledActivity.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, application/xml, application/x-www-form-urlencoded
 - **Accept**: application/json, application/xml

<a name="retrieveSchedule"></a>
# **retrieveSchedule**
> ScheduledList retrieveSchedule(opts)

Invoked by &#x60;agent&#x60; gets what should be tested

This endpoint is queried by distributed agent around the world, they look for target URLs fitting their possibilities. normally a default agent should query by using the location as &#x60;vantagePoint&#x60;, but in future versions, agents might for example query because of specific platform (i.e. only facebook and only check &#x60;agent&#x60; should run from Italy). &#x60;submissionId&#x60; are duplicated in this API because a submission is requested to have a &#x60;availabilityCheck&#x60; more than once and from more than one &#x60;vantagePoint&#x60;

### Example
```javascript
import {MakhnoApiDesign} from 'makhno_api_design';

let apiInstance = new MakhnoApiDesign.ScheduledApi();
let opts = { 
  'filter': "filter_example" // String | query parameters to filter by platform, day, and two letter country code
};
apiInstance.retrieveSchedule(opts, (error, data, response) => {
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

[**ScheduledList**](ScheduledList.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, application/xml

