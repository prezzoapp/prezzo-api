Used to signify the completion of an upload of a file belonging to a resources  
  
*method:* `POST`  
*path:* `/v1/resources/:id/files/:fileId/completeUpload`  
  
Parameters  
-----------  
  
**Body**  
  
`none`  
  
**Query**  
  
`none`  
  
Specifications  
--------------  
  
- should require authorization  
- should return status 404 (resource not found) if the resource doesn't exit  
- should return status 404 (resource not found) if the file doesn't exit in the resource  
- should return status 403 (forbidden) if the resource doesn't belong to the authenticated user  
- should return update the file status to `ready`  
