**createdDate**  
-  Date  
-  defaults to `current time`  
  
**creator**  
-  ObjectID  
- *REQUIRED*  
-  reference to `User`  
  
**vendor**  
-  ObjectID  
- *REQUIRED*  
-  reference to `Vendor`  
  
**readableIdentifier**  
-  String  
- *REQUIRED*  
  
**items**  
-  Array  
-  reference to `OrderItem`  
  
**status**  
-  String  
- *REQUIRED*  
-  enum  
  - pending  
  - preparing  
  - active  
  - denied  
  - complete  
  
**type**  
-  String  
- *REQUIRED*  
-  enum  
  - delivery  
  - table  
  
**paymentType**  
-  String  
- *REQUIRED*  
-  enum  
  - card  
  - cash  
  
**paymentMethod**  
-  ObjectID  
-  reference to `PaymentMethod`  
  
**_id**  
-  ObjectID  
  
**__v**  
-  Number  
  
