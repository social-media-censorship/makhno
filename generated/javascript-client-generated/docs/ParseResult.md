# MakhnoApiDesign.ParseResult

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**parsingInfo** | **Object** | (optional) debug and reporting on how the parsing went | [optional] 
**contentFit** | **Boolean** | if a content was found in the page. When a page contains a blocking message such \&quot;content not available in your country\&quot; this return &#x60;false&#x60; | [optional] 
**id** | **String** | the unique ID tight to targetURL, that can be used to fetch other results. This is calculated by hashing the URL. | [optional] 
