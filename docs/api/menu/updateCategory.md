Updates a category in a menu.  
  
*method:* `PUT`  
*path:* `/v1/menus/:menuId/categories/:categoryId`  
  
Parameters  
-----------  
  
**Body**  
  
- *title*  
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
- should return status 400 (bad request) if the user tries to update the title to another category's title in the menu  
- should update the category in the menu on success  
- should succeed if the category title exists in another category in a different menuctontinue;  
- should succeed if the category doesn't change  
- should NOT modify any other menus  
- should NOT modify any other categories in the menu  
