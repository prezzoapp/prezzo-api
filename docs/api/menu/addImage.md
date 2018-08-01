Adds a photo to an item in a menu category.  
  
*method:* `POST`  
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
- should add the image to the menu item on success  
- should NOT add the image to any other items in the menu on success  
