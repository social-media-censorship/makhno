# MakhnoApiDesign.SupportedUrl

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**platform** | **String** | youtube.com, or tiktok.com, basically the url.hostname field | [optional] 
**nature** | **String** | the kind of page in the platform (search, profile, homepage, video, etc) | [optional] 
**details** | **Object** | the query string, or the videoId, it depends from the nature if details is set or not. | [optional] 
**supported** | **Boolean** | if the URL can be interpret by the parser API or not | [optional] 
**id** | **String** | the unique ID tight to targetURL, that can be used to fetch other results. This is calculated by hashing the URL. | [optional] 
