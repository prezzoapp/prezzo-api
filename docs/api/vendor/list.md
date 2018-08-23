List all vendors.  
  
*method:* `GET`  
*path:* `/v1/vendors`  
  
Parameters  
-----------  
  
**Body**  
  
`none`  
  
**Query**  
  
- *name*  
  - type: `string`  
- *distance*  
  - type: `string`  
- *longitude*  
  - type: `string`  
- *latitude*  
  - type: `string`  
  
Specifications  
--------------  
  
- should require authorization  
- should return vendors  
- should allow filtering by vendor business name  
- should allow filtering by vendor location  
- should populate the menu  
