import Route from './Route';
import {HttpMethod, RouteType} from './constants'

interface IRoutes extends Record<string, Route[]> {
  get: Route[],
  post: Route[],
  patch: Route[],
  put: Route[],
  delete: Route[],
}
export default class Router {

  private routes:IRoutes = {
    get: [],
    post: [],
    patch: [],
    put: [],
    delete: [],
  }
  private currentRoute:any;
  private queryParams:Record<string,string> | undefined;
  private routeParams: Record<string,string> | undefined;

  public exec(path: any, method:HttpMethod=HttpMethod.GET) {
    this.setQueryParams(path);
    const callback = this.resolve(path, method);
    if (callback) {
      return callback(this.routeParams || {}, this.queryParams || {});
    }
  }

  public resolve(requestPath: string, method:HttpMethod=HttpMethod.GET): Function | undefined {
    this.currentRoute = undefined;
    this.setQueryParams(requestPath)
    const [uri] = requestPath.split('?');
    const routes = this.routes[method];

    routes.some(route => {
      if (route.getType() === RouteType.REGEX) {
        const isMatch = uri.match(route.getPath());
        if (isMatch) return this.currentRoute = route;
      } else {
        const isMatch = this.matchStringRoute(uri, route);
        if (isMatch) return this.currentRoute = route;
      }
    });

    if (this.currentRoute) {
      this.setParams(uri);
      return this.currentRoute.getCallback();
    }
  }

  matchStringRoute(requestPath:string, route:Route): boolean {
    let routePath:string = (route.getPath() as string).replace(/^\//, '').replace(/\/$/, '');
    requestPath = requestPath.replace(/^\//, '').replace(/\/$/, '')
    const routeType = route.getType();
    if (routeType === RouteType.EXACT_MATCH) {
      if (routePath === requestPath) return true;
    } else if (routeType === RouteType.STARTS_WITH) {
      if (requestPath.startsWith(routePath)) return true;
    } else if (routeType === RouteType.PARAMATERIZED) {
      const routePathSegments = routePath.split('/')
      const requestPathSegments = requestPath.split('/');
      if (routePathSegments.length !== requestPathSegments.length) return false;
      for (let a = 0; a < routePathSegments.length;  a++) {
        const routePathSegment = routePathSegments[a];
        const requestPathSegment = requestPathSegments[a];
        if (routePathSegment.startsWith(':')) continue;
        if (routePathSegment !== requestPathSegment) return false;
      }
      return true;
    }

    return false;
  }

  private setParams(requestPath: string) {
    const params:Record<string, string> = {};
    const requestPathSegments = requestPath.split('/');
    const routePathSegments = this.currentRoute.getPath().split('/');
    for (let index = 0; index < routePathSegments.length; index++) {
      const routeSegment = routePathSegments[index]
      const requestSegment = requestPathSegments[index]
      if (routeSegment.startsWith(':')) {
        const key = routeSegment.replace(':', '');
        params[key] = requestSegment;
      }
    }
    this.routeParams = params;
  }

  setQueryParams(path:string) {
    const pathParts = path.split('?');
    if (pathParts.length === 2) {
      let queryParams:Record<string,string> = {};
      let queryString = pathParts[1];
      let pairs = queryString.split('&');
      pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        queryParams[key] = value;
      })
      this.queryParams = queryParams;
    }
  }

  public getQueryParam(key:string, defaultValue:string) {
    if (!this.queryParams) return defaultValue;
    return this.queryParams[key];
  }

  public getQueryParams() {
    return this.queryParams;
  }

  public getParams(){
    return this.routeParams;
  }

  public get(path: string, callback:Function, type:RouteType = RouteType.STARTS_WITH): Router {
    const route = new Route(path, HttpMethod.GET, callback, type);
    this.routes.get.push(route);
    return this;
  }

  public post(path: string, callback:Function, type:RouteType = RouteType.STARTS_WITH): Router {
    const route = new Route(path, HttpMethod.POST, callback, type);
    this.routes.post.push(route);
    return this;
  }

  public put(path: string, callback:Function, type:RouteType = RouteType.STARTS_WITH): Router {
    const route = new Route(path, HttpMethod.PUT, callback, type);
    this.routes.put.push(route);
    return this;
  }

  delete(path: string, callback:Function, type:RouteType=RouteType.STARTS_WITH): Router {
    const route = new Route(path, HttpMethod.DELETE, callback, type);
    this.routes.delete.push(route);
    return this;
  }

  getRoutes(method:string) {
    return this.routes[method];
  }
}
