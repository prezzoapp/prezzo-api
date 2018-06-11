Finds a resource.  
  
*method:* `GET`  
*path:* `/v1/resources/:id`  
  
Parameters  
-----------  
  
**Body**  
  
`none`  
  
**Query**  
  
`none`  
  
Specifications  
--------------  
  
- should require authorization  
- should return status 404 (resource not found) if the resource doesn't exist  
- should return the specified resource  
