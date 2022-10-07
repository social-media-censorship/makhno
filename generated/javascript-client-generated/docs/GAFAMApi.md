# MakhnoApiDesign.GAFAMApi

All URIs are relative to *https://makhno.net/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**gAFAMparse**](GAFAMApi.md#gAFAMparse) | **POST** /GAFAM/parse | this endpoint receives the payload produced from one of the &#x60;agent&#x60; collecting evidence.
[**gAFAMsupported**](GAFAMApi.md#gAFAMsupported) | **POST** /GAFAM/supported | Return if a &#x60;target URL&#x60; belongs to a supported platform
[**gAFAMsupportedList**](GAFAMApi.md#gAFAMsupportedList) | **GET** /GAFAM/supported | Display a list of the supported natures and URL exmaples that can be processed

<a name="gAFAMparse"></a>
# **gAFAMparse**
> ParseResult gAFAMparse(body, targetURL, source, countryCode, html)

this endpoint receives the payload produced from one of the &#x60;agent&#x60; collecting evidence.

An API that process HTML and parse it, receive a &#x60;targetURL&#x60; and before parsing it, it also re-check if the url is supported, by using the same internal validation also provided by the API &#x60;/GAFAM/supported&#x60;

### Example
```javascript
import {MakhnoApiDesign} from 'makhno_api_design';

let apiInstance = new MakhnoApiDesign.GAFAMApi();
let body = new MakhnoApiDesign.ParsePayload(); // ParsePayload | The payload captured by the agent and information about the agent itself, also information about the `vantagePoint`
let targetURL = "targetURL_example"; // String | 
let source = "source_example"; // String | 
let countryCode = "countryCode_example"; // String | 
let html = "html_example"; // String | 

apiInstance.gAFAMparse(body, targetURL, source, countryCode, html, (error, data, response) => {
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
 **body** | [**ParsePayload**](ParsePayload.md)| The payload captured by the agent and information about the agent itself, also information about the &#x60;vantagePoint&#x60; | 
 **targetURL** | **String**|  | 
 **source** | **String**|  | 
 **countryCode** | **String**|  | 
 **html** | **String**|  | 

### Return type

[**ParseResult**](ParseResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, application/xml, application/x-www-form-urlencoded
 - **Accept**: application/json, application/xml

<a name="gAFAMsupported"></a>
# **gAFAMsupported**
> SupportedUrl gAFAMsupported(opts)

Return if a &#x60;target URL&#x60; belongs to a supported platform

it expect in the payload a target URL, it return with what normally is referred as Nature, so the nature of the URL. such as, a youtube video or a tiktok channel.

### Example
```javascript
import {MakhnoApiDesign} from 'makhno_api_design';

let apiInstance = new MakhnoApiDesign.GAFAMApi();
let opts = { 
  'body': new MakhnoApiDesign.ProposedUrl(), // ProposedUrl | 
  'targetURL': "targetURL_example" // String | 
};
apiInstance.gAFAMsupported(opts, (error, data, response) => {
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
 **body** | [**ProposedUrl**](ProposedUrl.md)|  | [optional] 
 **targetURL** | **String**|  | [optional] 

### Return type

[**SupportedUrl**](SupportedUrl.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, application/xml, application/x-www-form-urlencoded
 - **Accept**: application/json

<a name="gAFAMsupportedList"></a>
# **gAFAMsupportedList**
> SupportedUrlFormatList gAFAMsupportedList()

Display a list of the supported natures and URL exmaples that can be processed

### Example
```javascript
import {MakhnoApiDesign} from 'makhno_api_design';

let apiInstance = new MakhnoApiDesign.GAFAMApi();
apiInstance.gAFAMsupportedList((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**SupportedUrlFormatList**](SupportedUrlFormatList.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

