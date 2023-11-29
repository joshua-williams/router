import Router from '../src/Router';
import {HttpMethod, RouteType} from "../src/constants";

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
    expect(callback()).toEqual('Hello World')
  })

  it('should resolve a GET, POST, PUT, DELETE requests', () => {
    testRoute('/home', HttpMethod.GET)
    testRoute('/home', HttpMethod.POST)
    testRoute('/home', HttpMethod.PUT)
    testRoute('/home', HttpMethod.DELETE)
  })

  it('should resolve parameterized path', () => {
    router.get('/product/:id', () => 'Hello World');
    const callback = router.resolve('/product/83');
  })
  it('should parse query parameters', () => {
    router.get('/product/:id', () => "Hello World");
    let callback = router.resolve('product/20/?name=food&quality=great')
    const params = router.getQueryParams();
    expect(typeof callback).toBe('function')
    expect(callback()).toEqual('Hello World');
    expect(params).toHaveProperty('name', 'food')

  })
})
