enum HttpMethod {
  GET    = 'get',
  POST   = 'post',
  PUT    = 'put',
  DELETE = 'delete'
}

enum RouteType {
  EXACT_MATCH   = 'exact_match',
  STARTS_WITH   = 'starts_with',
  PARAMATERIZED = 'parameterized',
  REGEX         = 'regex'
}

export {
  HttpMethod,
  RouteType
}
