Logs a user out.  
  
*method:* `GET`  
*path:* `/v1/auth/logout`  
  
Parameters  
-----------  
  
**Body**  
  
`none`  
  
**Query**  
  
`none`  
  
Specifications  
--------------  
  
- should require authorization  
- should remove the session from the user  
- should remove sessions with the same push token  
