Returns a users orders.  
  
*method:* `GET`  
*path:* `/v1/users/:id/orders`  
  
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
  
Specifications  
--------------  
  
- should require authorization  
- should return status 404 (resource not found) if the user doesn't exist  
- should return the user's orders  
- should only return orders of type `table` when specifying `type=table`  
- should only return orders of type `delivery` when specifying `type=delivery`  
