import Router from '../src/Router';
import {HttpMethod} from "../src/constants";

describe('Router Tests', () => {
  let router: Router;

  const testRoute = (path: string, method: string) => {
    const callback = jest.fn();
    // @ts-ignore
    router[method](path, callback);
    const routes = router.getRoutes(method);
    const [route] = routes;
    expect(routes).toHaveLength(1);
    expect(route.getPath()).toEqual(path);
    expect(route.getMethod()).toEqual(method);
    expect(route.getCallback()).toEqual(callback);
  }

  beforeEach(() => {
    router = new Router();
  });

  it('should resolve a GET request', () => {
    router.get('/home', () => 'Hello World');
    let callback = router.resolve('/home')
    expect(callback).toBeInstanceOf(Function);
    expect(callback?.()).toEqual('Hello World')
  })

  it('should resolve a GET, POST, PUT, DELETE requests', () => {
    testRoute('/home', HttpMethod.GET)
    testRoute('/home', HttpMethod.POST)
    testRoute('/home', HttpMethod.PUT)
    testRoute('/home', HttpMethod.DELETE)
  })

  it('should parse route params', () => {
    router.get('/product/:id', jest.fn());
    router.resolve('/product/20');
    const params = router.getParams();
    const expectedParams = {id:'20'};
    expect(params).toEqual(expectedParams)

  })
  it('should parse query params', () => {
    router.get('/products', jest.fn());
    router.resolve('/product/?name=food&quality=great');
    const queryParams = router.getQueryParams();
    const expectedQueryParams = {name:'food', quality:'great'}
    expect(queryParams).toEqual(expectedQueryParams)
  })

  it('should parse query parameters when resolve is invoked', () => {
    router.delete('/product/:id', () => "Hello World");
    let callback = router.resolve('product/20/?name=food&quality=great', HttpMethod.DELETE);
    const queryParams = router.getQueryParams();
    expect(typeof callback).toBe('function')
    expect(callback?.()).toEqual('Hello World');
    expect(queryParams).toHaveProperty('name', 'food')
  });

  it('should invoke callback with route parameters', () => {
    const callback = jest.fn();
    router.put('/product/:id', callback);
    router.exec('/product/20', HttpMethod.PUT);
    expect(callback).toHaveBeenCalledWith({id:'20'}, {})
  });

  it('should invoke callback with query parameters', () => {
    const callback = jest.fn();
    router.post('/products', callback);
    router.exec('/products?sort=newest&filter=featured', HttpMethod.POST);
    const expectedQueryParams = {sort:'newest', filter:'featured'}
    expect(callback).toHaveBeenCalledWith( {}, expectedQueryParams)
  })
})
