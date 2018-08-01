Deletes a category in a menu.  
  
*method:* `DELETE`  
*path:* `/v1/menus/:menuId/categories/:categoryId`  
  
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
- should return status 404 (resource not found) if the menu doesn’t exist  
- should return status 404 (resource not found) if the category doesn’t exist  
- should delete the category on success  
- should NOT delete any other categories in the menu  
- should NOT delete any other categories in other menus  
