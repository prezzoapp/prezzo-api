Used to add a Facebook account to a users account.  
  
*method:* `PUT`  
*path:* `/v1/users/:id/facebook`  
  
Parameters  
-----------  
  
**Body**  
  
- *facebookId*  
  - type: `string`  
  - REQUIRED  
- *facebookToken*  
  - type: `string`  
  - REQUIRED  
  
**Query**  
  
`none`  
  
Specifications  
--------------  
  
- should require authorization  
- should return status 404 (resource not found) if the user doesnt exist  
- should return status 403 (forbidden) if a user tries to update another users account  
- should succeed on a valid request  
