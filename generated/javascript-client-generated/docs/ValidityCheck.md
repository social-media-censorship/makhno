# MakhnoApiDesign.ValidityCheck

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**submissionId** | **String** |  | [optional] 
**testId** | **String** |  | [optional] 
**vantagePoint** | **String** | two letter country code of the agent performing the test | [optional] 
**checkTimeUTC** | **Date** |  | [optional] 
**status** | **String** |  | [optional] 
**authoritative** | **String** | this string is the authentication material necessary to submit a result and save it in the server | [optional] 

<a name="StatusEnum"></a>
## Enum: StatusEnum

* `reachable` (value: `"reachable"`)
* `notReachable` (value: `"not reachable"`)
* `vaidationNotPossible` (value: `"vaidation not possible"`)

