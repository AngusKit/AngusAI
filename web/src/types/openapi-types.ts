export type AuthType = 'basic' | 'bearer' | 'apiKey' | 'oauth2';
export type ApiKeyIn = 'header' | 'query';
export type ParameterIn = 'query' | 'path' |  'cookie' | 'header';
export type AuthFlowKey = 'authorizationCode' | 'password' | 'implicit' | 'clientCredentials';
export type ApiServerSource = 'CURRENT_REQUEST' | 'API_SERVERS' | 'PARENT_SERVERS' | 'MOCK_SERVICE';

/**
 * Defines standard OAuth2 authorization grant types (RFC 6749).
 * Used to specify the OAuth2 flow when requesting an access token.
 */
export enum OAuth2GrantType {
  /**
   * Authorization Code Flow (Recommended for web apps).
   * Flow: Client -> Authorization Server -> User Consent -> Authorization Code -> Token Exchange.
   * Requires client_secret for confidential clients.
   */
  AUTHORIZATION_CODE = 'authorization_code',

  /**
   * Implicit Flow (Legacy, avoid for new projects).
   * Flow: Directly returns tokens (no code exchange).
   * Security Note: Tokens exposed in redirect URIs; use PKCE with Authorization Code instead.
   */
  IMPLICIT = 'implicit',

  /**
   * Resource Owner Password Credentials Flow (Discouraged).
   * Flow: Client sends username/password -> Receives tokens.
   * Warning: Only use for highly trusted clients (e.g., first-party apps).
   */
  PASSWORD = 'password',

  /**
   * Client Credentials Flow (Machine-to-machine).
   * Flow: Client authenticates with its own credentials -> Receives tokens.
   * Scope: Tokens are tied to client permissions, not a user.
   */
  CLIENT_CREDENTIALS = 'client_credentials',

  /**
   * Refresh Token Flow.
   * Flow: Exchanges a refresh_token for a new access_token.
   * Requirement: Initial token must include the `offline_access` scope.
   */
  REFRESH_TOKEN = 'refresh_token',
}

/**
 * Non-standard OAuth2 grant types used by major providers.
 */
export enum ExtendedGrantType {
  /**
   * JWT Bearer Flow (RFC 7523).
   * Used by: Azure AD, Google.
   * Flow: Client submits a signed JWT -> Receives tokens.
   */
  JWT_BEARER = 'urn:ietf:params:oauth:grant-type:jwt-bearer',

  /**
   * Device Authorization Flow (RFC 8628).
   * Used by: GitHub, Microsoft, Google IoT.
   * Flow: Device polls auth server after user approves via a separate browser.
   */
  DEVICE_CODE = 'urn:ietf:params:oauth:grant-type:device_code',
}

/**
 * Schema
 *
 * <pre>
 * | schema             | type    | format    |
 * | ------------------ | ------- | --------- |
 * | Array              | array   | null      |
 * | Binary             | string  | binary    |
 * | Boolean            | boolean | null      |
 * | ByteArray(byte[])  | string  | byte      |
 * | Date               | string  | date      |
 * | DateTime           | string  | date-time |
 * | Email              | string  | email     |
 * | File               | string  | binary    |
 * | integer(Number)    | integer | int32     |
 * | Json               | object  | null      |
 * | Map                | object  | null      |
 * | Number(BigDecimal) | number  | null      |
 * | Object             | object  | null      |
 * | Password           | string  | password  |
 * | String             | string  | null      |
 * | UUID               | string  | uuid      |
 * </pre>
 *
 * @see "https://github.com/OAI/OpenAPI-Specification/blob/3.0.1/versions/3.0.1.md#schemaObject"
 * @see "https://github.com/OAI/OpenAPI-Specification/blob/3.1.0/versions/3.1.0.md#schemaObject"
 */
export enum SchemaType {
  boolean = 'boolean',
  object = 'object',
  number = 'number',
  string = 'string',
  integer = 'integer',
  array = 'array'
}

export enum SchemaFormat {
  null = 'null',
  binary = 'binary',
  byte = 'byte',
  date = 'date',
  date_time = 'date-time',
  email = 'email',
  int32 = 'int32',
  password = 'password',
  uuid = 'uuid',
  xml = 'xml',
  json = 'json'
}

/**
 * API extension keys for XCan custom properties.
 */
export const API_EXTENSION_KEYS = {
  prefix: 'x-xc-', // Prefix
  idKey: 'x-xc-id', // Unique identifier
  valueKey: 'x-xc-value', // Value
  enabledKey: 'x-xc-enabled', // Enable/disable
  statusKey: 'x-xc-status', // Data status
  contentEncoding : 'x-xc-contentEncoding', // Content encoding
  exportVariableKey: 'x-xc-exportVariable', // Whether to set as variable
  requestSettingKey: 'x-xc-requestSetting', // Request settings like timeout, object
  serverNameKey: 'x-xc-serverName', // Server URL name
  serverSourceKey: 'x-xc-serverSource', // Server source
  securityApiKeyPrefix: 'x-xc-apiKey', // API key type extension
  securitySubTypeKey: 'sx-xc-securitySubType', // Security scheme subtype
  fileNameKey: 'x-xc-fileName', // File name
  newTokenKey: 'x-xc-oauth2-newToken', // Whether to use generated auth token
  oAuth2Key: 'x-xc-oauth2-authFlow', // Token generation authorization type
  oAuth2Token: 'x-xc-oauth2-token', // Existing token
  oAuth2CallbackUrlKey: 'x-xc-oauth2-callbackUrl', // OAuth2 callback URL
  oAuth2ClientIdKey: 'x-xc-oauth2-clientId', // OAuth2 client id
  oAuth2ClientSecretKey: 'x-xc-oauth2-clientSecret', // OAuth2 client secret
  oAuth2UsernameKey: 'x-xc-oauth2-username', // OAuth2 resource owner username
  oAuth2PasswordKey: 'x-xc-oauth2-password', // OAuth2 resource owner password
  oAuth2ClientAuthTypeKey: 'x-xc-oauth2-clientAuthType', // OAuth2 client auth type
  formContentTypeKey: 'x-xc-contentType',
  basicAuthKey: 'x-xc-basicAuth',
  wsMessageKey: 'x-wsMessage'
};

/* tslint:disable:no-namespace no-empty-interface */
export namespace OpenAPI {
  export type Document<T extends {} = {}> =
    | OpenAPIV2.Document<T>
    | OpenAPIV3.Document<T>
    | OpenAPIV3_1.Document<T>;
  export type Operation<T extends {} = {}> =
    | OpenAPIV2.OperationObject<T>
    | OpenAPIV3.OperationObject<T>
    | OpenAPIV3_1.OperationObject<T>;
  export type Parameter =
    | OpenAPIV3_1.ReferenceObject
    | OpenAPIV3_1.ParameterObject
    | OpenAPIV3.ReferenceObject
    | OpenAPIV3.ParameterObject
    | OpenAPIV2.ReferenceObject
    | OpenAPIV2.Parameter;
  export type Parameters =
    | (OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.ParameterObject)[]
    | (OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject)[]
    | (OpenAPIV2.ReferenceObject | OpenAPIV2.Parameter)[];

  export interface Request {
    body?: any;
    headers?: object;
    params?: object;
    query?: object;
  }
}

export namespace OpenAPIV3_1 {
  type Modify<T, R> = Omit<T, keyof R> & R;

  type PathsWebhooksComponents<T extends {} = {}> = {
    paths: PathsObject<T>;
    webhooks: Record<string, PathItemObject | ReferenceObject>;
    components: ComponentsObject;
  };

  export type Document<T extends {} = {}> = Modify<
    Omit<OpenAPIV3.Document<T>, 'paths' | 'components'>,
    {
      info: InfoObject;
      jsonSchemaDialect?: string;
      servers?: ServerObject[];
    } & (
    | (Pick<PathsWebhooksComponents<T>, 'paths'> &
    Omit<Partial<PathsWebhooksComponents<T>>, 'paths'>)
    | (Pick<PathsWebhooksComponents<T>, 'webhooks'> &
    Omit<Partial<PathsWebhooksComponents<T>>, 'webhooks'>)
    | (Pick<PathsWebhooksComponents<T>, 'components'> &
    Omit<Partial<PathsWebhooksComponents<T>>, 'components'>)
    )
  >;

  export type InfoObject = Modify<
    OpenAPIV3.InfoObject,
    {
      summary?: string;
      license?: LicenseObject;
    }
  >;

  export type ContactObject = OpenAPIV3.ContactObject;

  export type LicenseObject = Modify<
    OpenAPIV3.LicenseObject,
    {
      identifier?: string;
    }
  >;

  export type ServerObject = Modify<
    OpenAPIV3.ServerObject,
    {
      url: string;
      description?: string;
      variables?: Record<string, ServerVariableObject>;
      // vendor extension stored under dynamic key
      [API_EXTENSION_KEYS.idKey]: string;
      [API_EXTENSION_KEYS.serverSourceKey]: ApiServerSource
    }
  >;

  export type ServerVariableObject = Modify<
    OpenAPIV3.ServerVariableObject,
    {
      enum?: [string, ...string[]];
    }
  >;

  export type PathsObject<T extends {} = {}, P extends {} = {}> = Record<
    string,
    (PathItemObject<T> & P) | undefined
  >;

  export type HttpMethods = OpenAPIV3.HttpMethods;

  export type PathItemObject<T extends {} = {}> = Modify<
    OpenAPIV3.PathItemObject<T>,
    {
      servers?: ServerObject[];
      parameters?: (ReferenceObject | ParameterObject)[];
    }
  > &
    {
      [method in HttpMethods]?: OperationObject<T>;
    };

  export type OperationObject<T extends {} = {}> = Modify<
    OpenAPIV3.OperationObject<T>,
    {
      parameters?: (ReferenceObject | ParameterObject)[];
      requestBody?: ReferenceObject | RequestBodyObject;
      responses?: ResponsesObject;
      callbacks?: Record<string, ReferenceObject | CallbackObject>;
      servers?: ServerObject[];
    }
  > &
    T;

  export type ExternalDocumentationObject = OpenAPIV3.ExternalDocumentationObject;

  export type ParameterObject = OpenAPIV3.ParameterObject;

  export type HeaderObject = OpenAPIV3.HeaderObject;

  export type ParameterBaseObject = OpenAPIV3.ParameterBaseObject;

  export type NonArraySchemaObjectType =
    | OpenAPIV3.NonArraySchemaObjectType
    | 'null';

  export type ArraySchemaObjectType = OpenAPIV3.ArraySchemaObjectType;

  /**
   * There is no way to tell typescript to require items when type is either 'array' or array containing 'array' type
   * 'items' will be always visible as optional
   * Casting schema object to ArraySchemaObject or NonArraySchemaObject will work fine
   */
  export type SchemaObject =
    | ArraySchemaObject
    | NonArraySchemaObject
    | MixedSchemaObject
    | boolean;

  export interface ArraySchemaObject extends BaseSchemaObject {
    type: ArraySchemaObjectType;
    items: ReferenceObject | SchemaObject;
  }

  export interface NonArraySchemaObject extends BaseSchemaObject {
    type?: NonArraySchemaObjectType;
  }

  interface MixedSchemaObject extends BaseSchemaObject {
    type?: (ArraySchemaObjectType | NonArraySchemaObjectType)[];
    items?: ReferenceObject | SchemaObject;
  }

  export type BaseSchemaObject = Modify<
    Omit<OpenAPIV3.BaseSchemaObject, 'nullable'>,
    {
      examples?: OpenAPIV3.BaseSchemaObject['example'][];
      exclusiveMinimum?: boolean | number;
      exclusiveMaximum?: boolean | number;
      contentMediaType?: string;
      $schema?: string;
      additionalProperties?: boolean | ReferenceObject | SchemaObject;
      properties?: {
        [name: string]: ReferenceObject | SchemaObject;
      };
      allOf?: (ReferenceObject | SchemaObject)[];
      oneOf?: (ReferenceObject | SchemaObject)[];
      anyOf?: (ReferenceObject | SchemaObject)[];
      not?: ReferenceObject | SchemaObject;
      discriminator?: DiscriminatorObject;
      externalDocs?: ExternalDocumentationObject;
      xml?: XMLObject;
      const?: any;
    }
  >;

  export type DiscriminatorObject = OpenAPIV3.DiscriminatorObject;

  export type XMLObject = OpenAPIV3.XMLObject;

  export type ReferenceObject = Modify<
    OpenAPIV3.ReferenceObject,
    {
      summary?: string;
      description?: string;
    }
  >;

  export type ExampleObject = OpenAPIV3.ExampleObject;

  export type MediaTypeObject = Modify<
    OpenAPIV3.MediaTypeObject,
    {
      schema?: SchemaObject | ReferenceObject;
      examples?: Record<string, ReferenceObject | ExampleObject>;
    }
  >;

  export type EncodingObject = OpenAPIV3.EncodingObject;

  export type RequestBodyObject = Modify<
    OpenAPIV3.RequestBodyObject,
    {
      content: { [media: string]: MediaTypeObject };
    }
  >;

  export type ResponsesObject = Record<
    string,
    ReferenceObject | ResponseObject
  >;

  export type ResponseObject = Modify<
    OpenAPIV3.ResponseObject,
    {
      headers?: { [header: string]: ReferenceObject | HeaderObject };
      content?: { [media: string]: MediaTypeObject };
      links?: { [link: string]: ReferenceObject | LinkObject };
    }
  >;

  export type LinkObject = Modify<
    OpenAPIV3.LinkObject,
    {
      server?: ServerObject;
    }
  >;

  export type CallbackObject = Record<string, PathItemObject | ReferenceObject>;

  export type SecurityRequirementObject = OpenAPIV3.SecurityRequirementObject;

  export type ComponentsObject = Modify<
    OpenAPIV3.ComponentsObject,
    {
      schemas?: Record<string, SchemaObject>;
      responses?: Record<string, ReferenceObject | ResponseObject>;
      parameters?: Record<string, ReferenceObject | ParameterObject>;
      examples?: Record<string, ReferenceObject | ExampleObject>;
      requestBodies?: Record<string, ReferenceObject | RequestBodyObject>;
      headers?: Record<string, ReferenceObject | HeaderObject>;
      securitySchemes?: Record<string, ReferenceObject | SecuritySchemeObject>;
      links?: Record<string, ReferenceObject | LinkObject>;
      callbacks?: Record<string, ReferenceObject | CallbackObject>;
      pathItems?: Record<string, ReferenceObject | PathItemObject>;
    }
  >;

  export type SecuritySchemeObject = OpenAPIV3.SecuritySchemeObject;

  export type HttpSecurityScheme = OpenAPIV3.HttpSecurityScheme;

  export type ApiKeySecurityScheme = OpenAPIV3.ApiKeySecurityScheme;

  export type ApiKeyExtensionField = OpenAPIV3.ApiKeyExtensionField;

  export type OAuth2SecurityScheme = OpenAPIV3.OAuth2SecurityScheme;

  export type OpenIdSecurityScheme = OpenAPIV3.OpenIdSecurityScheme;

  export type TagObject = OpenAPIV3.TagObject;
}

export namespace OpenAPIV3 {
  export interface Document<T extends {} = {}> {
    openapi: string;
    info: InfoObject;
    servers?: ServerObject[];
    paths: PathsObject<T>;
    components?: ComponentsObject;
    security?: SecurityRequirementObject[];
    tags?: TagObject[];
    externalDocs?: ExternalDocumentationObject;
    extensions?: Record<string, any>;
    'x-express-openapi-additional-middleware'?: (
      | ((request: any, response: any, next: any) => Promise<void>)
      | ((request: any, response: any, next: any) => void)
      )[];
    'x-express-openapi-validation-strict'?: boolean;
  }

  export interface InfoObject {
    title: string;
    description?: string;
    termsOfService?: string;
    contact?: ContactObject;
    license?: LicenseObject;
    version: string;
    extensions?: Record<string, any>;
  }

  export interface ContactObject {
    name?: string;
    url?: string;
    email?: string;
    extensions?: Record<string, any>;
  }

  export interface LicenseObject {
    name: string;
    url?: string;
    extensions?: Record<string, any>;
  }

  export interface ServerObject {
    url: string;
    description?: string;
    variables?: { [variable: string]: ServerVariableObject };
    extensions?: Record<string, any>;
    // vendor extension stored under dynamic key
    [API_EXTENSION_KEYS.idKey]: string;
  }

  export interface ServerVariableObject {
    enum?: string[] | number[];
    default: string | number;
    description?: string;
    extensions?: Record<string, any>;
  }

  export interface PathsObject<T extends {} = {}, P extends {} = {}> {
    [pattern: string]: (PathItemObject<T> & P) | undefined;
  }

  // All HTTP methods allowed by OpenAPI 3 spec
  // See https://swagger.io/specification/#path-item-object
  // You can use keys or values from it in TypeScript code like this:
  //     for (const method of Object.values(OpenAPIV3.HttpMethods)) { … }
  export enum HttpMethods {
    GET = 'get',
    PUT = 'put',
    POST = 'post',
    DELETE = 'delete',
    OPTIONS = 'options',
    HEAD = 'head',
    PATCH = 'patch',
    TRACE = 'trace',
  }

  export type PathItemObject<T extends {} = {}> = {
    $ref?: string;
    summary?: string;
    description?: string;
    servers?: ServerObject[];
    parameters?: (ReferenceObject | ParameterObject)[];
  } & {
    [method in HttpMethods]?: OperationObject<T>;
  };

  export type OperationObject<T extends {} = {}> = {
    tags?: string[];
    summary?: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
    operationId?: string;
    parameters?: (ReferenceObject | ParameterObject)[];
    requestBody?: ReferenceObject | RequestBodyObject;
    responses: ResponsesObject;
    callbacks?: { [callback: string]: ReferenceObject | CallbackObject };
    deprecated?: boolean;
    security?: SecurityRequirementObject[];
    servers?: ServerObject[];
    extensions?: Record<string, any>;
  } & T;

  export interface ExternalDocumentationObject {
    description?: string;
    url: string;
    extensions?: Record<string, any>;
  }

  export interface ParameterObject extends ParameterBaseObject {
    name: string;
    in: string;
  }

  export interface HeaderObject extends ParameterBaseObject {}

  export interface ParameterBaseObject {
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: string;
    explode?: boolean;
    allowReserved?: boolean;
    schema?: ReferenceObject | SchemaObject;
    example?: any;
    examples?: { [media: string]: ReferenceObject | ExampleObject };
    content?: { [media: string]: MediaTypeObject };
    extensions?: Record<string, any>;
    // vendor extension stored under dynamic key
    [API_EXTENSION_KEYS.valueKey]: any;
  }
  export type NonArraySchemaObjectType =
    | 'boolean'
    | 'object'
    | 'number'
    | 'string'
    | 'integer';
  export type ArraySchemaObjectType = 'array';
  export type SchemaObject = ArraySchemaObject | NonArraySchemaObject;

  export interface ArraySchemaObject extends BaseSchemaObject {
    type: ArraySchemaObjectType;
    items: ReferenceObject | SchemaObject;
  }

  export interface NonArraySchemaObject extends BaseSchemaObject {
    type?: NonArraySchemaObjectType;
  }

  export interface BaseSchemaObject {
    // JSON schema allowed properties, adjusted for OpenAPI
    _default?: any;
    name?: string;

    title?: string;
    description?: string;
    format?: string;
    default?: any;
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: boolean;
    minimum?: number;
    exclusiveMinimum?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    additionalProperties?: boolean | ReferenceObject | SchemaObject;
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    maxProperties?: number;
    minProperties?: number;
    required?: string[];
    type?: any;
    enum?: any[];
    properties?: {
      [name: string]: ReferenceObject | SchemaObject;
    };
    allOf?: (ReferenceObject | SchemaObject)[];
    oneOf?: (ReferenceObject | SchemaObject)[];
    anyOf?: (ReferenceObject | SchemaObject)[];
    not?: ReferenceObject | SchemaObject;

    // OpenAPI-specific properties
    nullable?: boolean;
    discriminator?: DiscriminatorObject;
    readOnly?: boolean;
    writeOnly?: boolean;
    xml?: XMLObject;
    externalDocs?: ExternalDocumentationObject;
    example?: any;
    deprecated?: boolean;
    extensions?: Record<string, any>;

    // vendor extension stored under dynamic key
    [API_EXTENSION_KEYS.valueKey]: any;
  }

  export interface DiscriminatorObject {
    propertyName: string;
    mapping?: { [value: string]: string };
    extensions?: Record<string, any>;
  }

  export interface XMLObject {
    name?: string;
    namespace?: string;
    prefix?: string;
    attribute?: boolean;
    wrapped?: boolean;
    extensions?: Record<string, any>;
  }

  export interface ReferenceObject {
    $ref: string;
  }

  export interface ExampleObject {
    summary?: string;
    description?: string;
    value?: any;
    externalValue?: string;
    extensions?: Record<string, any>;
  }

  export interface MediaTypeObject {
    schema?: ReferenceObject | SchemaObject;
    example?: any;
    examples?: { [media: string]: ReferenceObject | ExampleObject };
    encoding?: { [media: string]: EncodingObject };
    extensions?: Record<string, any>;
  }

  export interface EncodingObject {
    contentType?: string;
    headers?: { [header: string]: ReferenceObject | HeaderObject };
    style?: string;
    explode?: boolean;
    allowReserved?: boolean;
    extensions?: Record<string, any>;
  }

  export interface RequestBodyObject {
    description?: string;
    content: { [media: string]: MediaTypeObject };
    required?: boolean;
    extensions?: Record<string, any>;
  }

  export interface ResponsesObject {
    [code: string]: ReferenceObject | ResponseObject;
  }

  export interface ResponseObject {
    description: string;
    headers?: { [header: string]: ReferenceObject | HeaderObject };
    content?: { [media: string]: MediaTypeObject };
    links?: { [link: string]: ReferenceObject | LinkObject };
    extensions?: Record<string, any>;
  }

  export interface LinkObject {
    operationRef?: string;
    operationId?: string;
    parameters?: { [parameter: string]: any };
    requestBody?: any;
    description?: string;
    server?: ServerObject;
    extensions?: Record<string, any>;
  }

  export interface CallbackObject {
    [url: string]: PathItemObject;
  }

  export interface SecurityRequirementObject {
    [name: string]: string[];
  }

  export interface ComponentsObject {
    schemas?: { [key: string]: ReferenceObject | SchemaObject };
    responses?: { [key: string]: ReferenceObject | ResponseObject };
    parameters?: { [key: string]: ReferenceObject | ParameterObject };
    examples?: { [key: string]: ReferenceObject | ExampleObject };
    requestBodies?: { [key: string]: ReferenceObject | RequestBodyObject };
    headers?: { [key: string]: ReferenceObject | HeaderObject };
    securitySchemes?: { [key: string]: ReferenceObject | SecuritySchemeObject };
    links?: { [key: string]: ReferenceObject | LinkObject };
    callbacks?: { [key: string]: ReferenceObject | CallbackObject };
  }


  export type SecuritySchemeObject =
    | HttpSecurityScheme
    | ApiKeySecurityScheme
    | OAuth2SecurityScheme
    | OpenIdSecurityScheme;


  export interface HttpSecurityScheme {
    type: 'http';
    description?: string;
    scheme: string;
    bearerFormat?: string;
    extensions?: Record<string, any>;
    [API_EXTENSION_KEYS.valueKey]?: string;
  }

  export interface ApiKeySecurityScheme {
    type: 'apiKey';
    description?: string;
    name: string;
    in: ApiKeyIn;
    extensions?: Record<string, any>;
    [API_EXTENSION_KEYS.valueKey]?: string;
    [API_EXTENSION_KEYS.securityApiKeyPrefix]?: ApiKeyExtensionField;
  }

  export interface ApiKeyExtensionField {
    name: string;
    value: string;
    in: ApiKeyIn;
  }

  export interface OAuth2SecurityScheme {
    type: 'oauth2';
    description?: string;
    flows: {
      implicit?: {
        authorizationUrl: string;
        refreshUrl?: string;
        scopes: { [scope: string]: string };
        extensions?: Record<string, any>;
      };
      password?: {
        tokenUrl: string;
        refreshUrl?: string;
        scopes: { [scope: string]: string };
        extensions?: Record<string, any>;
        [API_EXTENSION_KEYS.oAuth2ClientAuthTypeKey]?: string,
        [API_EXTENSION_KEYS.oAuth2ClientIdKey]?: string,
        [API_EXTENSION_KEYS.oAuth2ClientSecretKey]?: string,
        [API_EXTENSION_KEYS.oAuth2UsernameKey]?: string,
        [API_EXTENSION_KEYS.oAuth2PasswordKey]?: string,
      };
      clientCredentials?: {
        tokenUrl: string;
        refreshUrl?: string;
        scopes: { [scope: string]: string };
        extensions?: Record<string, any>;
        [API_EXTENSION_KEYS.oAuth2ClientIdKey]?: string,
        [API_EXTENSION_KEYS.oAuth2ClientSecretKey]?: string,
      };
      authorizationCode?: {
        authorizationUrl: string;
        tokenUrl: string;
        refreshUrl?: string;
        scopes: { [scope: string]: string };
        extensions?: Record<string, any>;
      };
    };
    extensions?: Record<string, any>;
    [API_EXTENSION_KEYS.oAuth2Key]?: string;
    [API_EXTENSION_KEYS.newTokenKey]?: boolean;
    [API_EXTENSION_KEYS.oAuth2Token]?: string;
  }

  export interface OpenIdSecurityScheme {
    type: 'openIdConnect';
    description?: string;
    openIdConnectUrl: string;
    extensions?: Record<string, any>;
  }

  export interface TagObject {
    name: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
    extensions?: Record<string, any>;
  }
}

export namespace OpenAPIV2 {
  export interface Document<T extends {} = {}> {
    basePath?: string;
    consumes?: MimeTypes;
    definitions?: DefinitionsObject;
    externalDocs?: ExternalDocumentationObject;
    host?: string;
    info: InfoObject;
    parameters?: ParametersDefinitionsObject;
    paths: PathsObject<T>;
    produces?: MimeTypes;
    responses?: ResponsesDefinitionsObject;
    schemes?: string[];
    security?: SecurityRequirementObject[];
    securityDefinitions?: SecurityDefinitionsObject;
    swagger: string;
    tags?: TagObject[];
    extensions?: Record<string, any>;
    'x-express-openapi-additional-middleware'?: (
      | ((request: any, response: any, next: any) => Promise<void>)
      | ((request: any, response: any, next: any) => void)
      )[];
    'x-express-openapi-validation-strict'?: boolean;
  }

  export interface TagObject {
    name: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
    extensions?: Record<string, any>;
  }

  export interface SecuritySchemeObjectBase {
    type: 'basic' | 'apiKey' | 'oauth2';
    description?: string;
    extensions?: Record<string, any>;
  }

  export interface SecuritySchemeBasic extends SecuritySchemeObjectBase {
    type: 'basic';
  }

  export interface SecuritySchemeApiKey extends SecuritySchemeObjectBase {
    type: 'apiKey';
    name: string;
    in: string;
  }

  export type SecuritySchemeOauth2 =
    | SecuritySchemeOauth2Implicit
    | SecuritySchemeOauth2AccessCode
    | SecuritySchemeOauth2Password
    | SecuritySchemeOauth2Application;

  export interface ScopesObject {
    [index: string]: any;
  }

  export interface SecuritySchemeOauth2Base extends SecuritySchemeObjectBase {
    type: 'oauth2';
    flow: 'implicit' | 'password' | 'application' | 'accessCode';
    scopes: ScopesObject;
  }

  export interface SecuritySchemeOauth2Implicit
    extends SecuritySchemeOauth2Base {
    flow: 'implicit';
    authorizationUrl: string;
  }

  export interface SecuritySchemeOauth2AccessCode
    extends SecuritySchemeOauth2Base {
    flow: 'accessCode';
    authorizationUrl: string;
    tokenUrl: string;
  }

  export interface SecuritySchemeOauth2Password
    extends SecuritySchemeOauth2Base {
    flow: 'password';
    tokenUrl: string;
  }

  export interface SecuritySchemeOauth2Application
    extends SecuritySchemeOauth2Base {
    flow: 'application';
    tokenUrl: string;
  }

  export type SecuritySchemeObject =
    | SecuritySchemeBasic
    | SecuritySchemeApiKey
    | SecuritySchemeOauth2;

  export interface SecurityDefinitionsObject {
    [index: string]: SecuritySchemeObject;
  }

  export interface SecurityRequirementObject {
    [index: string]: string[];
  }

  export interface ReferenceObject {
    $ref: string;
  }

  export type Response = ResponseObject | ReferenceObject;

  export interface ResponsesDefinitionsObject {
    [index: string]: ResponseObject;
  }

  export type Schema = SchemaObject | ReferenceObject;

  export interface ResponseObject {
    description: string;
    schema?: Schema;
    headers?: HeadersObject;
    examples?: ExampleObject;
    extensions?: Record<string, any>;
  }

  export interface HeadersObject {
    [index: string]: HeaderObject;
  }

  export interface HeaderObject extends ItemsObject {
    description?: string;
  }

  export interface ExampleObject {
    [index: string]: any;
  }

  export interface ResponseObject {
    description: string;
    schema?: Schema;
    headers?: HeadersObject;
    examples?: ExampleObject;
  }

  export type OperationObject<T extends {} = {}> = {
    tags?: string[];
    summary?: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
    operationId?: string;
    consumes?: MimeTypes;
    produces?: MimeTypes;
    parameters?: Parameters;
    responses: ResponsesObject;
    schemes?: string[];
    deprecated?: boolean;
    security?: SecurityRequirementObject[];
  } & T;

  export interface ResponsesObject {
    [index: string]: Response | undefined;
    default?: Response;
  }

  export type Parameters = (ReferenceObject | Parameter)[];

  export type Parameter = InBodyParameterObject | GeneralParameterObject;

  export interface InBodyParameterObject extends ParameterObject {
    schema: Schema;
  }

  export interface GeneralParameterObject extends ParameterObject, ItemsObject {
    allowEmptyValue?: boolean;
  }

  // All HTTP methods allowed by OpenAPI 2 spec
  // See https://swagger.io/specification/v2#path-item-object
  // You can use keys or values from it in TypeScript code like this:
  //     for (const method of Object.values(OpenAPIV2.HttpMethods)) { … }
  export enum HttpMethods {
    GET = 'get',
    PUT = 'put',
    POST = 'post',
    DELETE = 'delete',
    OPTIONS = 'options',
    HEAD = 'head',
    PATCH = 'patch',
  }

  export type PathItemObject<T extends {} = {}> = {
    $ref?: string;
    parameters?: Parameters;
  } & {
    [method in HttpMethods]?: OperationObject<T>;
  };

  export interface PathsObject<T extends {} = {}> {
    [index: string]: PathItemObject<T>;
  }

  export interface ParametersDefinitionsObject {
    [index: string]: ParameterObject;
  }

  export interface ParameterObject {
    name: string;
    in: string;
    description?: string;
    required?: boolean;
    [index: string]: any;
  }

  export type MimeTypes = string[];

  export interface DefinitionsObject {
    [index: string]: SchemaObject;
  }

  export interface SchemaObject extends IJsonSchema {
    [index: string]: any;
    discriminator?: string;
    readOnly?: boolean;
    xml?: XMLObject;
    externalDocs?: ExternalDocumentationObject;
    example?: any;
    default?: any;
    items?: ItemsObject | ReferenceObject;
    properties?: {
      [name: string]: SchemaObject;
    };
  }

  export interface ExternalDocumentationObject {
    [index: string]: any;
    description?: string;
    url: string;
    extensions?: Record<string, any>;
  }

  export interface ItemsObject {
    type: string;
    format?: string;
    items?: ItemsObject | ReferenceObject;
    collectionFormat?: string;
    default?: any;
    maximum?: number;
    exclusiveMaximum?: boolean;
    minimum?: number;
    exclusiveMinimum?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    enum?: any[];
    multipleOf?: number;
    $ref?: string;
    extensions?: Record<string, any>;
  }

  export interface XMLObject {
    [index: string]: any;
    name?: string;
    namespace?: string;
    prefix?: string;
    attribute?: boolean;
    wrapped?: boolean;
    extensions?: Record<string, any>;
  }

  export interface InfoObject {
    title: string;
    description?: string;
    termsOfService?: string;
    contact?: ContactObject;
    license?: LicenseObject;
    version: string;
    extensions?: Record<string, any>;
  }

  export interface ContactObject {
    name?: string;
    url?: string;
    email?: string;
    extensions?: Record<string, any>;
  }

  export interface LicenseObject {
    name: string;
    url?: string;
    extensions?: Record<string, any>;
  }
}

export interface IJsonSchema {
  id?: string;
  $schema?: string;
  title?: string;
  description?: string;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  additionalItems?: boolean | IJsonSchema;
  items?: IJsonSchema | IJsonSchema[];
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  additionalProperties?: boolean | IJsonSchema;
  definitions?: {
    [name: string]: IJsonSchema;
  };
  properties?: {
    [name: string]: IJsonSchema;
  };
  patternProperties?: {
    [name: string]: IJsonSchema;
  };
  dependencies?: {
    [name: string]: IJsonSchema | string[];
  };
  enum?: any[];
  type?: string | string[];
  allOf?: IJsonSchema[];
  anyOf?: IJsonSchema[];
  oneOf?: IJsonSchema[];
  not?: IJsonSchema;
  $ref?: string;
  extensions?: Record<string, any>;
}
