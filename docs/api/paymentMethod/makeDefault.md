Makes a payment method the default payment method for a user.  
  
*method:* `POST`  
*path:* `/v1/payment-methods/:id/default`  
  
Parameters  
-----------  
  
**Body**  
  
`none`  
  
**Query**  
  
`none`  
  
Specifications  
--------------  
  
- should require authorization  
- should return status 404 (resource not found) if the payment method doesn't exist  
- should return status 403 (forbidden) if user doesn't own the payment method  
- should make the payment method the default payment method  
- should NOT update other payment methods belonging to other users  
