Creates a resource.  
  
*method:* `POST`  
*path:* `/v1/resources`  
  
Parameters  
-----------  
  
**Body**  
  
- *name*  
  - type: `string`  
- *type*  
  - type: `string`  
  - REQUIRED  
  - enum  
    - userAvatar  
- *mime*  
  - type: `string`  
  - REQUIRED  
  - enum  
    - image/jpeg  
    - image/png  
    - image/gif  
    - video/mp4  
    - video/mov  
    - application/zip  
    - application/octet-stream  
    - application/x-rar-compressed  
- *size*  
  - type: `number`  
  - REQUIRED  
  
**Query**  
  
- *acl*  
  - enum  
    - public-read  
    - private  
- *addPolicy*  
  - enum  
    - true  
    - false  
  
Specifications  
--------------  
  
- should require authorization  
- should return 400 (bad request) if `mime` not sent  
- should return 400 (bad request) if `size` not sent  
- should return 400 (bad request) if `type` not sent  
- should return 400 (bad request) if `type` in not in enums  
- should succeed if `name` not sent  
- should create a resource with the specified parameters  
- should create a resource with a nested file object  
- should return a nested file with an `uploadUrl` that can be uploaded to  
- should provide an aws policy when specifying the `addPolicy` query parameter  
- should allow specifying the acl as a query parameter  
- should allow uploading zip files  
- should allow uploading mp4 files  
