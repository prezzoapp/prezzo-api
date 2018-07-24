Creates a menu.  
  
*method:* `POST`  
*path:* `/v1/menus`  
  
Parameters  
-----------  
  
**Body**  
  
`none`  
  
**Query**  
  
`none`  
  
Specifications  
--------------  
  
- should return status 401 (unauthorized) if the user isnt logged in  
- should return status 403 (forbidden) if the user isnt a vendor  
- should return status 403 (forbidden) if the vendor already has a menu  
- should create a menu on success  
