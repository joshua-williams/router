import {HttpMethod, RouteType} from "./constants";

class Route {
  // @ts-ignore
  private params: string[];
  // @ts-ignore
  private queryParams: {};

  constructor(
    private path:string|RegExp,
    private method: HttpMethod,
    private callback: Function,
    private type: RouteType = RouteType.STARTS_WITH) {

    if ( this.path instanceof RegExp) {
      this.type = RouteType.REGEX
    } else {
      this.extractParams();
    }
  }

  private extractParams() {
    if (typeof this.path != "string") return;
    const path = this.path as string;
    const hasParams = path.match(/:\w+/);
    const params = {};
    if (hasParams) {
      this.type = RouteType.PARAMATERIZED;
      const pattern = /:(\w+)/
      // @ts-ignore
      this.params = this.path.match(pattern)
        .map(param => param.replace(':', ''));
    }
  }

  public getPath():string|RegExp {
    return this.path;
  }

  public getMethod():HttpMethod {
    return this.method;
  }

  public getCallback():Function {
    return this.callback;
  }

  getType(): RouteType {
    return this.type;
  }
}

export default Route;
