Used to login to a user account.  
  
*method:* `POST`  
*path:* `/v1/auth/login`  
  
Parameters  
-----------  
  
**Body**  
  
- *email*  
  - type: `string`  
  - REQUIRED  
- *password*  
  - type: `string`  
  - REQUIRED  
- *type*  
  - type: `string`  
  - REQUIRED  
  - enum  
    - ios  
    - android  
    - web  
- *pushToken*  
  - type: `string`  
  
**Query**  
  
`none`  
  
Specifications  
--------------  
  
- should return status 404 (resource not found)if the email doesnt belong to a user  
- should allow email / password login  
- should succeed even if the emails letter casing is incorrect  
- should allow setting the `pushToken` on login  
- should return vendor and menu information on login  
