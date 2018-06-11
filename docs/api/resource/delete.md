Deletes a resource.  
  
*method:* `DELETE`  
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
- should return status 403 (forbidden) if the resource doesn't belong to the authenticated user  
- should return remove the resource on success  
- should remove the resource from s3  
