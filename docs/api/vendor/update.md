Updates a vendor.  
  
*method:* `PUT`  
*path:* `/v1/vendors/:id`  
  
Parameters  
-----------  
  
**Body**  
  
- *name*  
  - type: `string`  
- *phone*  
  - type: `string`  
- *website*  
  - type: `string`  
- *categories*  
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
- should return status 403 (forbidden) if the user is not a vendor  
- should return status 403 (forbidden) if the user is trying to update another vendor  
- should update the vendor on success  
- should retain the values of fields that werent sent  
- should NOT update other vendors  
