# MakhnoApiDesign.SubmissionApi

All URIs are relative to *https://makhno.net/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**submissionGet**](SubmissionApi.md#submissionGet) | **GET** /submission | Know which URL have been submitted (not used by agent)
[**submitURL**](SubmissionApi.md#submitURL) | **POST** /submission | Submit to the Makhno server the request to verify a &#x60;targetURL&#x60;

<a name="submissionGet"></a>
# **submissionGet**
> SubmissionList submissionGet(opts)

Know which URL have been submitted (not used by agent)

This is the endpoint that manages a collection of objects into the database; It returns the list of &#x60;targetURL&#x60; that match the criterias specify by the &#x60;agent&#x60;, it can also return a default if not filtering is provided; it is worthy to list existing requested URL and identify their presence in the infrastructure. the &#x60;id&#x60; mentioned here is also referred as &#x60;submissionId&#x60; in other endpoints.

### Example
```javascript
import {MakhnoApiDesign} from 'makhno_api_design';

let apiInstance = new MakhnoApiDesign.SubmissionApi();
let opts = { 
  'filter': "filter_example" // String | query parameters to filter the URL submitted in the past, that might be tested by an agent
};
apiInstance.submissionGet(opts, (error, data, response) => {
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
 **filter** | **String**| query parameters to filter the URL submitted in the past, that might be tested by an agent | [optional] 

### Return type

[**SubmissionList**](SubmissionList.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, application/xml

<a name="submitURL"></a>
# **submitURL**
> SubmissionDetail submitURL(body, url, countryCodes)

Submit to the Makhno server the request to verify a &#x60;targetURL&#x60;

### Example
```javascript
import {MakhnoApiDesign} from 'makhno_api_design';

let apiInstance = new MakhnoApiDesign.SubmissionApi();
let body = new MakhnoApiDesign.SubmissionProposal(); // SubmissionProposal | The payload contains a `targetURL` and one or more country code, in the hopes some `agent` that runs in the right ISP, would pull this submission and perform an `availabilityCheck` from their `vantagePoint`. Internally the `target URL` is validated in the same way as in the /GAFAM/ endpoints.
let url = "url_example"; // String | 
let countryCodes = ["countryCodes_example"]; // [String] | 

apiInstance.submitURL(body, url, countryCodes, (error, data, response) => {
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
 **body** | [**SubmissionProposal**](SubmissionProposal.md)| The payload contains a &#x60;targetURL&#x60; and one or more country code, in the hopes some &#x60;agent&#x60; that runs in the right ISP, would pull this submission and perform an &#x60;availabilityCheck&#x60; from their &#x60;vantagePoint&#x60;. Internally the &#x60;target URL&#x60; is validated in the same way as in the /GAFAM/ endpoints. | 
 **url** | **String**|  | 
 **countryCodes** | [**[String]**](String.md)|  | 

### Return type

[**SubmissionDetail**](SubmissionDetail.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, application/xml, application/x-www-form-urlencoded
 - **Accept**: application/json, application/xml

