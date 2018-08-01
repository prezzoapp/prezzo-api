Adds a photo to an item in a menu category.  
  
*method:* `DELETE`  
*path:* `/v1/menus/:menuId/categories/:categoryId/items/:itemId/photos`  
  
Parameters  
-----------  
  
**Body**  
  
- *imageURL*  
  - type: `string`  
  - REQUIRED  
  
**Query**  
  
`none`  
  
Specifications  
--------------  
  
- should return status 401 (unauthorized) if the user isnt logged in  
- should return status 403 (forbidden) if the user is not a vendor  
- should return status 403 (forbidden) if the menu doesn’t belong to the vendor  
- should return status 404 (resource not found) if the menu doesn’t exist  
- should return status 404 (resource not found) if the category doesn’t exist  
- should return status 404 (resource not found) if the item doesn’t exist  
- should remove the image from the menu item on success  
- should NOT remove any images from any other menus on success  
