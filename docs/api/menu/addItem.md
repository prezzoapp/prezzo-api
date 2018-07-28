Adds an item to a category in a menu.  
  
*method:* `POST`  
*path:* `/v1/menus/:menuId/categories/:categoryId/items`  
  
Parameters  
-----------  
  
**Body**  
  
- *title*  
  - type: `string`  
  - REQUIRED  
- *description*  
  - type: `string`  
  - REQUIRED  
- *price*  
  - type: `number`  
  - REQUIRED  
  
**Query**  
  
`none`  
  
Specifications  
--------------  
  
- should return status 401 (unauthorized) if the user isnt logged in  
- should return status 404 (resource not found) if the menu doesnt exist  
- should return status 404 (resource not found) if the category doesnt exist  
- should return status 403 (forbidden) if the user is not a vendor  
- should return status 403 (forbidden) if the menu doesn’t belong to the vendor  
- should add an item to the menu on success  
- shouldn’t add the item to any other menus on success  
