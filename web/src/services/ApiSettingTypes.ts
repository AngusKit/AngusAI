import {ApiLocaleResult} from "@xcan-angus/infra";
import { OpenAPIV3_1 } from '@/types/openapi-types';

/** The API response result of supporting international message. */
export type ApiSchemaResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: ApiSchemaVo;
};

export interface ApiSchemaVo {
  /** @format int64 */
  id?: string;
  /** @format int64 */
  collectionId?: string;
  openapi?: string;
  info?: OpenAPIV3_1.InfoObject;
  externalDocs?: OpenAPIV3_1.ExternalDocumentationObject;
  servers?: OpenAPIV3_1.ServerObject[];
  securityRequirements?: OpenAPIV3_1.SecurityRequirementObject[];
  tags?: OpenAPIV3_1.TagObject[];
  extensions?: Record<string, object>;
  specVersion?: ApiSchemaVoSpecVersionEnum;
  securities?: Record<string, OpenAPIV3_1.SecuritySchemeObject>;
}

export enum ApiSchemaVoSpecVersionEnum {
  V30 = "V30",
  V31 = "V31",
}
