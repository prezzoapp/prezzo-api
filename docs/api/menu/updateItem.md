Adds an item to a category in a menu.  
  
*method:* `PUT`  
*path:* `/v1/menus/:menuId/categories/:categoryId/items/:itemId`  
  
Parameters  
-----------  
  
**Body**  
  
- *title*  
  - type: `string`  
- *description*  
  - type: `string`  
- *price*  
  - type: `number`  
  
**Query**  
  
`none`  
  
Specifications  
--------------  
  
- should return status 401 (unauthorized) if the user isnt logged in  
- should return status 403 (forbidden) if the user is not a vendor  
- should return status 403 (forbidden) if the menu doesn’t belong to the vendor  
- should return status 404 (resouce not found) if the menu doesnt exist  
- should return status 404 (resouce not found) if the category doesnt exist  
- should return status 404 (resouce not found) if the item doesnt exist  
- should update the item in the menu on success  
- should succeed if the item doesn't change  
- should NOT modify any other menus  
