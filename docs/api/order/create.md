Creates an order.  
  
*method:* `POST`  
*path:* `/v1/orders`  
  
Parameters  
-----------  
  
**Body**  
  
- *items*  
  - REQUIRED  
- *type*  
  - type: `string`  
  - REQUIRED  
  - enum  
    - delivery  
    - table  
- *paymentType*  
  - type: `string`  
  - REQUIRED  
  - enum  
    - cash  
- *vendor*  
  - type: `string`  
  - REQUIRED  
- *paymentMethod*  
  - type: `string`  
  
**Query**  
  
`none`  
  
Specifications  
--------------  
  
- should require authorization  
- should return status 400 (bad request) if `type` isn't set to `delivery` or `table`  
- should return status 400 (bad request) if `vendor` is empty  
- should return status 404 (resource not found) if `vendor` isn't a valid vendor  
- should return status 400 (bad request) if `items` is missing  
- should return status 400 (bad request) if `items` isn't an array  
- should return status 400 (bad request) if an item in `items` doesn't have a price  
- should create the order on success  
