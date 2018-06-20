Updates a user.  
  
*method:* `POST`  
*path:* `/v1/users/:id`  
  
Parameters  
-----------  
  
**Body**  
  
- *firstName*  
  - type: `string`  
- *lastName*  
  - type: `string`  
- *isSubscribedToPromotions*  
  - type: `boolean`  
- *avatarURL*  
  - type: `string`  
- *phone*  
  - type: `string`  
- *address*  
  - type: `string`  
- *zip*  
  - type: `string`  
- *city*  
  - type: `string`  
  
**Query**  
  
`none`  
  
Specifications  
--------------  
  
- should require authorization  
- should return status 404 (resource not found) if the user doesnt exist  
- should return status 403 (forbidden) if a user tries to update another users account  
- should succeed on a valid request  
- should update the users full name  
- should NOT update the users email  
