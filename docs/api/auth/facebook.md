Used to login to a user account.  
  
*method:* `POST`  
*path:* `/v1/auth/facebook`  
  
Parameters  
-----------  
  
**Body**  
  
- *facebookId*  
  - type: `string`  
  - REQUIRED  
- *facebookToken*  
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
  
