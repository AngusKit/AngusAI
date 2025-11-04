import { PageQuery, ApiLocaleResult } from '@xcan-angus/infra';
import {
  ApiLocaleResultKnowledgeBaseDocListVo,
  ApiLocaleResultKnowledgeBaseDocStatusVo,
  ApiLocaleResultListKnowledgeBaseDocSearchResultVo,
  ApiLocaleResultPageResultKnowledgeBaseDocListVo,
  GetDocumentListOrderByEnum,
  GetDocumentListParamsStatusEnum,
  GetDocumentListParamsTypeEnum,
  KnowledgeBaseDocBatchDeleteDto,
  KnowledgeBaseDocSearchDto,
  KnowledgeBaseDocToggleDto,
} from "./data-contracts.ts";
import { ContentType, HttpClient, RequestParams } from "./http-client.ts";

export class Documents<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 切换文档的启用状态
   *
   * @tags KnowledgeBaseDoc
   * @name ToggleDocument
   * @summary 切换文档状态
   * @request PUT:/api/v1/documents/{documentId}/knowledge-bases/{knowledgeBaseId}/toggle
   * @secure
   */
  toggleDocument = (
    documentId: number,
    knowledgeBaseId: number,
    data: KnowledgeBaseDocToggleDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultKnowledgeBaseDocListVo, ApiLocaleResult>({
      path: `/api/v1/documents/${documentId}/knowledge-bases/${knowledgeBaseId}/toggle`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 重新处理失败的文档
   *
   * @tags KnowledgeBaseDoc
   * @name ReprocessDocument
   * @summary 重新处理文档
   * @request POST:/api/v1/documents/{documentId}/knowledge-bases/{knowledgeBaseId}/reprocess
   * @secure
   */
  reprocessDocument = (
    documentId: number,
    knowledgeBaseId: number,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultKnowledgeBaseDocStatusVo, ApiLocaleResult>(
      {
        path: `/api/v1/documents/${documentId}/knowledge-bases/${knowledgeBaseId}/reprocess`,
        method: "POST",
        secure: true,
        ...params,
      },
    );
  /**
   * @description 获取知识库的文档列表
   *
   * @tags KnowledgeBaseDoc
   * @name GetDocumentList
   * @summary 获取文档列表
   * @request GET:/api/v1/documents/knowledge-bases/{knowledgeBaseId}
   * @secure
   */
  getDocumentList = (
    knowledgeBaseId: number,
    query?: PageQuery & {
      /** 文档类型筛选 */
      type?: GetDocumentListParamsTypeEnum;
      /** 状态筛选 */
      status?: GetDocumentListParamsStatusEnum;
      /** 启用状态筛选 */
      enabled?: boolean;
      /** 排序字段 */
      orderBy?: GetDocumentListOrderByEnum;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<
      ApiLocaleResultPageResultKnowledgeBaseDocListVo,
      ApiLocaleResult
    >({
      path: `/api/v1/documents/knowledge-bases/${knowledgeBaseId}`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 上传文档到知识库
   *
   * @tags KnowledgeBaseDoc
   * @name UploadDocuments
   * @summary 上传文档
   * @request POST:/api/v1/documents/knowledge-bases/{knowledgeBaseId}
   * @secure
   */
  uploadDocuments = (
    knowledgeBaseId: number,
    query: {
      /** 文件列表 */
      files: File[];
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `/api/v1/documents/knowledge-bases/${knowledgeBaseId}`,
      method: "POST",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 在知识库中检索相关内容
   *
   * @tags KnowledgeBaseDoc
   * @name SearchDocuments
   * @summary 搜索文档
   * @request POST:/api/v1/documents/knowledge-bases/{knowledgeBaseId}/search
   * @secure
   */
  searchDocuments = (
    knowledgeBaseId: number,
    data: KnowledgeBaseDocSearchDto,
    params: RequestParams = {},
  ) =>
    this.http.request<
      ApiLocaleResultListKnowledgeBaseDocSearchResultVo,
      ApiLocaleResult
    >({
      path: `/api/v1/documents/knowledge-bases/${knowledgeBaseId}/search`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 批量删除文档
   *
   * @tags KnowledgeBaseDoc
   * @name BatchDeleteDocuments
   * @summary 批量删除文档
   * @request POST:/api/v1/documents/knowledge-bases/{knowledgeBaseId}/batch-delete
   * @secure
   */
  batchDeleteDocuments = (
    knowledgeBaseId: number,
    data: KnowledgeBaseDocBatchDeleteDto,
    params: RequestParams = {},
  ) =>
    this.http.request<void, ApiLocaleResult>({
      path: `/api/v1/documents/knowledge-bases/${knowledgeBaseId}/batch-delete`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 删除指定文档
   *
   * @tags KnowledgeBaseDoc
   * @name DeleteDocument
   * @summary 删除文档
   * @request DELETE:/api/v1/documents/{documentId}/knowledge-bases/{knowledgeBaseId}
   * @secure
   */
  deleteDocument = (
    documentId: number,
    knowledgeBaseId: number,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `/api/v1/documents/${documentId}/knowledge-bases/${knowledgeBaseId}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
}
