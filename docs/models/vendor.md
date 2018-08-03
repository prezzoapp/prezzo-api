**createdDate**  
-  Date  
-  defaults to `current time`  
  
**name**  
-  String  
- *REQUIRED*  
  
**phone**  
-  String  
  
**website**  
-  String  
  
**categories**  
-  Array  
  
**avatarURL**  
-  String  
  
**hours**  
-  Array  
-  reference to `HoursOfOperation`  
  
**location**  
-  Embedded  
  
**status**  
-  String  
- *REQUIRED*  
-  enum  
  - pending  
  - approved  
  - denied  
-  defaults to `pending`  
  
**menu**  
-  ObjectID  
-  reference to `Menu`  
  
**_id**  
-  ObjectID  
  
**__v**  
-  Number  
  
