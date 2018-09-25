Creates a payment method.  
  
*method:* `POST`  
*path:* `/v1/payment-methods`  
  
Parameters  
-----------  
  
**Body**  
  
- *nonce*  
  - type: `string`  
  - REQUIRED  
  
**Query**  
  
`none`  
  
Specifications  
--------------  
  
- should require authorization  
- should return status 400 (bad request) if the nonce isn't sent  
- should set a braintree customer id on the user if they don't have one  
- should NOT update the user's braintree customer id if they have one  
- should make the payment method the user's default payment method  
