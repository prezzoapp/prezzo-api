Deletes a payment method.  
  
*method:* `DELETE`  
*path:* `/v1/payment-methods/:id`  
  
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
- should delete the payment method on success  
- should NOT delete other payment methods belonging to the user  
- should NOT delete other payment methods NOT belonging to the user  
