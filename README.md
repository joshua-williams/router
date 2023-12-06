### Usage
This router does not depend on Node HTTP Module to initialize routing therefore it can be used as a stand-alone javascript 
router in a lambda function or other similar use cases.
```typescript
import {Router, HttpMethod} from "router";
// create instance of router
const router = new Router();
// register some routes
router.get('/', () => 'Welcome Home')
router.get('/about-us', () => 'About Us')
// initialize routing
const content = router.exec('/about-us')
// content === 'About Us'
```

### Router Initilization
Initialization is the process of matching a given url with a route previously registered. 
The router can be initialized with the `exec` and `resolve` method.

#### exec(requestUrl)

The requestUrl represents the request url that router will attempt to match with a registered route.
It can be a string or regular expression.
If a match is found it will invoke the route's callback function passing in route parameters and query parameters 

### Named Parameters
When registering routes you can set a named parameter in the url eg: `router.get('/product/:id)`. The route parameters are
stored on an object and passed to the callback function as the first argument.
```typescript
import Router from 'router'
const router = new Router();
const callback = (param, queryParam) => `Learn about the ${param.department} department`
router.get('/about/:department', callback);
// initialize routing
router.exec('/product/20')
```
### Query Parameters
Query parameters are stored on an object and passed as the second argument to the callback function.

```typescript
import Router from 'router'
const router = new Router();
const callback = (routeParams, queryParams) => {
  return `
    Product ID: ${id}
    promocode = ${queryParams.promocode}
    sort = ${queryParams.sort}
  `;
}
router.get('/product/:id', callback)
// initialize routing
router.exec('/product/20?sort=desc&promocode=free4me')
```

#### resolve(requestUrl, HttpMethod)
The requestUrl represents the request url that router will attempt to match with a registered route. 
It can be a string or regular expression. 
If a match is found it will return the callback function for the matched route. This method allows more control over the
routing lifecycle. 




```typescript
import Router from 'router'
import {HttpMethod} from "./constants";
// create instance of router
const router = new Router();
// register a post route with parameter
router.post('/product/:id', () => 'Product Updated')
// resolve the route. if successful it will return the callback
const callback = router.resolve('/product/20?name=Twinkie&quality=fresh', HttpMethod.POST)
// get the named parameters parsed from the request
const params = router.getParams();
// get the query paraameters paresd from the request
const queryParams = router.getQueryParams();
// from here you have access to the parameters and the callback function giving flexibility to do other stuff before
// executing the callback function

```
