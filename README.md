```typescript
import Router from 'router'
import {HttpMethod} from "./constants";
// create instance of router
const router = new Router();
// add a get route
router.get('/home', () => 'Welcome Home')
// add a post route with parameter
router.post('/product/:id', () => 'Product Updated')
// resolve the route. if successful it will return the callback
const callback = router.resolve('/product/20?name=Twinkie&quality=fresh', HttpMethod.POST)
// get the parameters parsed from the request
const params = router.getParams();
// get the query paraameters paresd from the request
const queryParams = router.getQueryParams();
// To-Do
// exec command will resolve the route and then invokke the callback with the following arguments
// callback(params:object, queryParams:object)
router.exec('/product/20?name=Twinkie&quality=fresh', HttpMethod.POST)

```
