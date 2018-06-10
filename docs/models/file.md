**createdDate**  
-  Date  
-  defaults to `current time`  
  
**meta**  
-  Mixed  
  
**key**  
-  String  
- *REQUIRED*  
  
**mime**  
-  String  
- *REQUIRED*  
-  enum  
  - image/jpeg  
  - image/png  
  - image/gif  
  - video/mp4  
  - video/mov  
  - application/zip  
  - application/octet-stream  
  - application/x-rar-compressed  
  
**size**  
-  Number  
  
**acl**  
-  String  
  
**url**  
-  String  
  
**status**  
-  String  
-  enum  
  - uploading  
  - processing  
  - ready  
  - error  
-  defaults to `uploading`  
  
**type**  
-  String  
- *REQUIRED*  
-  enum  
  - original  
  - thumbnail  
  - optimized  
  - mp4  
  - webm  
  - png  
  - jpg  
-  defaults to `original`  
  
**_id**  
-  ObjectID  
  
**__v**  
-  Number  
  
