Deletes an item in a menu category.  
  
*method:* `DELETE`  
*path:* `/v1/menus/:menuId/categories/:categoryId/items/:itemId`  
  
Parameters  
-----------  
  
**Body**  
  
`none`  
  
**Query**  
  
`none`  
  
Specifications  
--------------  
  
- should return status 401 (unauthorized) if the user isnt logged in  
- should return status 403 (forbidden) if the user is not a vendor  
- should return status 403 (forbidden) if the menu doesn’t belong to the vendor  
- should delete the item on success  
- should NOT delete any other items in other menus  
