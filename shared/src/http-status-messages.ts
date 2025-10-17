import { HttpStatusCode } from "./http-status-code";

export const ACCEPTED = "Accepted";
export const BAD_GATEWAY = "Bad Gateway";
export const BAD_REQUEST = "Bad Request";
export const CONFLICT = "Conflict";
export const CONTINUE = "Continue";
export const CREATED = "Created";
export const EXPECTATION_FAILED = "Expectation Failed";
export const FAILED_DEPENDENCY = "Failed Dependency";
export const FORBIDDEN = "Forbidden";
export const GATEWAY_TIMEOUT = "Gateway Timeout";
export const GONE = "Gone";
export const HTTP_VERSION_NOT_SUPPORTED = "HTTP Version Not Supported";
export const IM_A_TEAPOT = "I'm a teapot";
export const INSUFFICIENT_SPACE_ON_RESOURCE = "Insufficient Space on Resource";
export const INSUFFICIENT_STORAGE = "Insufficient Storage";
export const INTERNAL_SERVER_ERROR = "Internal Server Error";
export const LENGTH_REQUIRED = "Length Required";
export const LOCKED = "Locked";
export const METHOD_FAILURE = "Method Failure";
export const METHOD_NOT_ALLOWED = "Method Not Allowed";
export const MOVED_PERMANENTLY = "Moved Permanently";
export const MOVED_TEMPORARILY = "Moved Temporarily";
export const MULTI_STATUS = "Multi-Status";
export const MULTIPLE_CHOICES = "Multiple Choices";
export const NETWORK_AUTHENTICATION_REQUIRED = "Network Authentication Required";
export const NO_CONTENT = "No Content";
export const NON_AUTHORITATIVE_INFORMATION = "Non Authoritative Information";
export const NOT_ACCEPTABLE = "Not Acceptable";
export const NOT_FOUND = "Not Found";
export const NOT_IMPLEMENTED = "Not Implemented";
export const NOT_MODIFIED = "Not Modified";
export const OK = "OK";
export const PARTIAL_CONTENT = "Partial Content";
export const PAYMENT_REQUIRED = "Payment Required";
export const PERMANENT_REDIRECT = "Permanent Redirect";
export const PRECONDITION_FAILED = "Precondition Failed";
export const PRECONDITION_REQUIRED = "Precondition Required";
export const PROCESSING = "Processing";
export const EARLY_HINTS = "Early Hints";
export const UPGRADE_REQUIRED = "Upgrade Required";
export const PROXY_AUTHENTICATION_REQUIRED = "Proxy Authentication Required";
export const REQUEST_HEADER_FIELDS_TOO_LARGE = "Request Header Fields Too Large";
export const REQUEST_TIMEOUT = "Request Timeout";
export const REQUEST_TOO_LONG = "Request Entity Too Large";
export const REQUEST_URI_TOO_LONG = "Request-URI Too Long";
export const REQUESTED_RANGE_NOT_SATISFIABLE = "Requested Range Not Satisfiable";
export const RESET_CONTENT = "Reset Content";
export const SEE_OTHER = "See Other";
export const SERVICE_UNAVAILABLE = "Service Unavailable";
export const SWITCHING_PROTOCOLS = "Switching Protocols";
export const TEMPORARY_REDIRECT = "Temporary Redirect";
export const TOO_MANY_REQUESTS = "Too Many Requests";
export const UNAUTHORIZED = "Unauthorized";
export const UNAVAILABLE_FOR_LEGAL_REASONS = "Unavailable For Legal Reasons";
export const UNPROCESSABLE_ENTITY = "Unprocessable Entity";
export const UNSUPPORTED_MEDIA_TYPE = "Unsupported Media Type";
export const USE_PROXY = "Use Proxy";
export const MISDIRECTED_REQUEST = "Misdirected Request";

export const HttpStatusCodeMessage = {
  ACCEPTED,
  BAD_GATEWAY,
  BAD_REQUEST,
  CONFLICT,
  CONTINUE,
  CREATED,
  EXPECTATION_FAILED,
  FAILED_DEPENDENCY,
  FORBIDDEN,
  GATEWAY_TIMEOUT,
  GONE,
  HTTP_VERSION_NOT_SUPPORTED,
  IM_A_TEAPOT,
  INSUFFICIENT_SPACE_ON_RESOURCE,
  INSUFFICIENT_STORAGE,
  INTERNAL_SERVER_ERROR,
  LENGTH_REQUIRED,
  LOCKED,
  METHOD_FAILURE,
  METHOD_NOT_ALLOWED,
  MOVED_PERMANENTLY,
  MOVED_TEMPORARILY,
  MULTI_STATUS,
  MULTIPLE_CHOICES,
  NETWORK_AUTHENTICATION_REQUIRED,
  NO_CONTENT,
  NON_AUTHORITATIVE_INFORMATION,
  NOT_ACCEPTABLE,
  NOT_FOUND,
  NOT_IMPLEMENTED,
  NOT_MODIFIED,
  OK,
  PARTIAL_CONTENT,
  PAYMENT_REQUIRED,
  PERMANENT_REDIRECT,
  PRECONDITION_FAILED,
  PRECONDITION_REQUIRED,
  PROCESSING,
  EARLY_HINTS,
  UPGRADE_REQUIRED,
  PROXY_AUTHENTICATION_REQUIRED,
  REQUEST_HEADER_FIELDS_TOO_LARGE,
  REQUEST_TIMEOUT,
  REQUEST_TOO_LONG,
  REQUEST_URI_TOO_LONG,
  REQUESTED_RANGE_NOT_SATISFIABLE,
  RESET_CONTENT,
  SEE_OTHER,
  SERVICE_UNAVAILABLE,
  SWITCHING_PROTOCOLS,
  TEMPORARY_REDIRECT,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
  UNAVAILABLE_FOR_LEGAL_REASONS,
  UNPROCESSABLE_ENTITY,
  UNSUPPORTED_MEDIA_TYPE,
  USE_PROXY,
  MISDIRECTED_REQUEST,
} as const;

// Code to messages mapping
export const HttpStatusCodeMessageMapping = {
  [HttpStatusCode.ACCEPTED]: ACCEPTED,
  [HttpStatusCode.BAD_GATEWAY]: BAD_GATEWAY,
  [HttpStatusCode.BAD_REQUEST]: BAD_REQUEST,
  [HttpStatusCode.CONFLICT]: CONFLICT,
  [HttpStatusCode.CONTINUE]: CONTINUE,
  [HttpStatusCode.CREATED]: CREATED,
  [HttpStatusCode.EXPECTATION_FAILED]: EXPECTATION_FAILED,
  [HttpStatusCode.FAILED_DEPENDENCY]: FAILED_DEPENDENCY,
  [HttpStatusCode.FORBIDDEN]: FORBIDDEN,
  [HttpStatusCode.GATEWAY_TIMEOUT]: GATEWAY_TIMEOUT,
  [HttpStatusCode.GONE]: GONE,
  [HttpStatusCode.HTTP_VERSION_NOT_SUPPORTED]: HTTP_VERSION_NOT_SUPPORTED,
  [HttpStatusCode.IM_A_TEAPOT]: IM_A_TEAPOT,
  [HttpStatusCode.INSUFFICIENT_SPACE_ON_RESOURCE]: INSUFFICIENT_SPACE_ON_RESOURCE,
  [HttpStatusCode.INSUFFICIENT_STORAGE]: INSUFFICIENT_STORAGE,
  [HttpStatusCode.INTERNAL_SERVER_ERROR]: INTERNAL_SERVER_ERROR,
  [HttpStatusCode.LENGTH_REQUIRED]: LENGTH_REQUIRED,
  [HttpStatusCode.LOCKED]: LOCKED,
  [HttpStatusCode.METHOD_FAILURE]: METHOD_FAILURE,
  [HttpStatusCode.METHOD_NOT_ALLOWED]: METHOD_NOT_ALLOWED,
  [HttpStatusCode.MOVED_PERMANENTLY]: MOVED_PERMANENTLY,
  [HttpStatusCode.MOVED_TEMPORARILY]: MOVED_TEMPORARILY,
  [HttpStatusCode.MULTI_STATUS]: MULTI_STATUS,
  [HttpStatusCode.MULTIPLE_CHOICES]: MULTIPLE_CHOICES,
  [HttpStatusCode.NETWORK_AUTHENTICATION_REQUIRED]: NETWORK_AUTHENTICATION_REQUIRED,
  [HttpStatusCode.NO_CONTENT]: NO_CONTENT,
  [HttpStatusCode.NON_AUTHORITATIVE_INFORMATION]: NON_AUTHORITATIVE_INFORMATION,
  [HttpStatusCode.NOT_ACCEPTABLE]: NOT_ACCEPTABLE,
  [HttpStatusCode.NOT_FOUND]: NOT_FOUND,
  [HttpStatusCode.NOT_IMPLEMENTED]: NOT_IMPLEMENTED,
  [HttpStatusCode.NOT_MODIFIED]: NOT_MODIFIED,
  [HttpStatusCode.OK]: OK,
  [HttpStatusCode.PARTIAL_CONTENT]: PARTIAL_CONTENT,
  [HttpStatusCode.PAYMENT_REQUIRED]: PAYMENT_REQUIRED,
  [HttpStatusCode.PERMANENT_REDIRECT]: PERMANENT_REDIRECT,
  [HttpStatusCode.PRECONDITION_FAILED]: PRECONDITION_FAILED,
  [HttpStatusCode.PRECONDITION_REQUIRED]: PRECONDITION_REQUIRED,
  [HttpStatusCode.PROCESSING]: PROCESSING,
  [HttpStatusCode.EARLY_HINTS]: EARLY_HINTS,
  [HttpStatusCode.UPGRADE_REQUIRED]: UPGRADE_REQUIRED,
  [HttpStatusCode.PROXY_AUTHENTICATION_REQUIRED]: PROXY_AUTHENTICATION_REQUIRED,
  [HttpStatusCode.REQUEST_HEADER_FIELDS_TOO_LARGE]: REQUEST_HEADER_FIELDS_TOO_LARGE,
  [HttpStatusCode.REQUEST_TIMEOUT]: REQUEST_TIMEOUT,
  [HttpStatusCode.REQUEST_TOO_LONG]: REQUEST_TOO_LONG,
  [HttpStatusCode.REQUEST_URI_TOO_LONG]: REQUEST_URI_TOO_LONG,
  [HttpStatusCode.REQUESTED_RANGE_NOT_SATISFIABLE]: REQUESTED_RANGE_NOT_SATISFIABLE,
  [HttpStatusCode.RESET_CONTENT]: RESET_CONTENT,
  [HttpStatusCode.SEE_OTHER]: SEE_OTHER,
  [HttpStatusCode.SERVICE_UNAVAILABLE]: SERVICE_UNAVAILABLE,
  [HttpStatusCode.SWITCHING_PROTOCOLS]: SWITCHING_PROTOCOLS,
  [HttpStatusCode.TEMPORARY_REDIRECT]: TEMPORARY_REDIRECT,
  [HttpStatusCode.TOO_MANY_REQUESTS]: TOO_MANY_REQUESTS,
  [HttpStatusCode.UNAUTHORIZED]: UNAUTHORIZED,
  [HttpStatusCode.UNAVAILABLE_FOR_LEGAL_REASONS]: UNAVAILABLE_FOR_LEGAL_REASONS,
  [HttpStatusCode.UNPROCESSABLE_ENTITY]: UNPROCESSABLE_ENTITY,
  [HttpStatusCode.UNSUPPORTED_MEDIA_TYPE]: UNSUPPORTED_MEDIA_TYPE,
  [HttpStatusCode.USE_PROXY]: USE_PROXY,
  [HttpStatusCode.MISDIRECTED_REQUEST]: MISDIRECTED_REQUEST,
} as const;
