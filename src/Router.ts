import Route from './Route';
import {HttpMethod, RouteType} from './constants'

interface IRoutes {
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
  private queryParams: {} | undefined;

  public resolve(requestPath: string, method: HttpMethod = HttpMethod.GET): Function {
    this.currentRoute = undefined;
    this.parseQueryParams(requestPath)
    const [uri] = requestPath.split('?');
    const routes = this.routes[method];

    routes.some(route => {
      const path = route.getPath();
      if (route.getType() === RouteType.REGEX) {
        const isMatch = uri.match(route.getPath());
        if (isMatch) return this.currentRoute = route;
      } else {
        const isMatch = this.matchStringRoute(uri, route);
        if (isMatch) return this.currentRoute = route;
      }
    })
    return this.currentRoute?.getCallback();
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

  parseQueryParams(path:string) {
    const pathParts = path.split('?');
    if (pathParts.length === 2) {
      let queryParams = {};
      let queryString = pathParts[1];
      let pairs = queryString.split('&');
      pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        // @ts-ignore
        queryParams[key] = value;
      })
      this.queryParams = queryParams;
    }
  }

  public getQueryParam(key:string, defaultValue:string) {
    if (!this.queryParams) return defaultValue;
    // @ts-ignore
    return this.queryParams[key];
  }

  public getQueryParams() {
    return this.queryParams;
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

  delete(path: string, callback:Function, type:RouteType): Router {
    const route = new Route(path, HttpMethod.DELETE, callback, type);
    this.routes.delete.push(route);
    return this;
  }

  getRoutes(method:string) {
    // @ts-ignore
    return this.routes[method];
  }
}
