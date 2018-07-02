Creates a vendor.  
  
*method:* `POST`  
*path:* `/v1/vendors`  
  
Parameters  
-----------  
  
**Body**  
  
- *name*  
  - type: `string`  
  - REQUIRED  
- *phone*  
  - type: `string`  
- *website*  
  - type: `string`  
- *categories*  
  - REQUIRED  
  - enum  
    - Italian  
    - American  
    - Seafood  
    - Steakhouses  
    - Pizza  
    - Sandwiches  
    - Breakfast  
    - Burgers  
    - Vegetarian  
    - Thai  
    - Vietnamese  
    - Chinese  
    - Mexican  
    - Sushi Bars  
    - Korean  
    - Japanese  
- *avatarURL*  
  - type: `string`  
- *hours*  
- *location*  
  - REQUIRED  
  
**Query**  
  
`none`  
  
Specifications  
--------------  
  
- should require authorization  
- should return status 400 (bad request) if missing name  
- should return status 400 (bad request) if missing location  
- should return status 400 (bad request) if location badly formatted  
- should return status 403 (forbidden) if the user is already a vendor  
- should create vendor on success  
