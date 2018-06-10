Creates a user.  
  
*method:* `POST`  
*path:* `/v1/users`  
  
Parameters  
-----------  
  
**Body**  
  
- *email*  
  - type: `string`  
  - REQUIRED  
- *firstName*  
  - type: `string`  
  - REQUIRED  
- *lastName*  
  - type: `string`  
  - REQUIRED  
- *password*  
  - type: `string`  
  - REQUIRED  
- *isSubscribedToPromotions*  
  - type: `boolean`  
- *avatarURL*  
  - type: `string`  
- *facebookId*  
  - type: `string`  
- *facebookToken*  
  - type: `string`  
  
**Query**  
  
- *login*  
  - type: `string`  
  - enum  
    - ios  
    - android  
    - web  
  
Specifications  
--------------  
  
- should NOT require authorization  
- should require the email field  
- should hash the password & set the `fullName` property  
- should be able to login if session type sent  
