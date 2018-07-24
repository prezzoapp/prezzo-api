Adds a category to a menu.  
  
*method:* `POST`  
*path:* `/v1/menus/:menuId/categories`  
  
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
- should return status 400 (bad request) if a category exists in the menu with the same title  
- should return status 400 (bad request) if `title` isnt sent in the request  
- should add the category to the menu on success  
- should NOT have modified any other menus  
