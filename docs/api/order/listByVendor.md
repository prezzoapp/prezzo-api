Returns a vendors orders.  
  
*method:* `GET`  
*path:* `/v1/vendors/:id/orders`  
  
Parameters  
-----------  
  
**Body**  
  
`none`  
  
**Query**  
  
- *type*  
  - type: `string`  
  - enum  
    - delivery  
    - table  
- *status*  
  - type: `string`  
  
Specifications  
--------------  
  
- should require authorization  
- should return status 404 (resource not found) if the vendor doesn't exist  
- should return the vendor's orders  
- should only return orders of type `table` when specifying `type=table`  
- should only return orders of type `delivery` when specifying `type=delivery`  
- should only return orders of status `preparing` when specifying `status=preparing`  
