import {ApiLocaleResult, TenantAuditingVo} from '@xcan-angus/infra';
import {KnowledgeBaseDocStatusEnum, KnowledgeBaseDocTypeEnum} from "@/enums/enums.ts";

/** 文档启用状态切换请求参数 */
export interface KnowledgeBaseDocToggleDto {
    /**
     * 启用状态
     * @example true
     */
    enabled: boolean;
}

/** 文档列表视图对象 */
export interface KnowledgeBaseDocListVo extends TenantAuditingVo {
    /**
     * 文档ID
     * @format int64
     * @example 1
     */
    id?: number;
    /**
     * 文档名称
     * @example "产品手册.pdf"
     */
    name?: string;
    /**
     * 文档类型
     * @example "PDF"
     */
    type?: KnowledgeBaseDocTypeEnum;
    /**
     * 文件大小
     * @example 2.5
     */
    size?: string;
    /**
     * 处理状态
     * @example "COMPLETED"
     */
    status?: KnowledgeBaseDocStatusEnum;
    /**
     * 是否启用
     * @example true
     */
    enabled?: boolean;
    /**
     * 分段数量
     * @format int32
     * @example 8
     */
    chunks?: number;
    /**
     * 处理进度
     * @format int32
     * @example 100
     */
    processingProgress?: number;
    /** 错误信息 */
    errorMessage?: string;
}

/** The API response result of supporting international message. */
export type KnowledgeBaseDocLisResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: KnowledgeBaseDocListVo;
};

/** 文档状态视图对象 */
export interface KnowledgeBaseDocStatusVo {
    /**
     * 文档ID
     * @format int64
     * @example 1
     */
    id?: number;
    /**
     * 处理状态
     * @example "PROCESSING"
     */
    status?: KnowledgeBaseDocStatusEnum;
    /**
     * 处理进度
     * @format int32
     * @example 75
     */
    processingProgress?: number;
    /**
     * 分段数量
     * @format int32
     * @example 8
     */
    chunks?: number;
    /** 错误信息 */
    errorMessage?: string;
}

/** The API response result of supporting international message. */
export type KnowledgeBaseDocStatusResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: KnowledgeBaseDocStatusVo;
};

/** 文档检索请求参数 */
export interface KnowledgeBaseDocSearchDto {
    /** 搜索关键字 */
    keyword?: string;
    /**
     * 返回数量
     * @format int32
     * @example 5
     */
    limit?: number;
    /**
     * 相似度阈值
     * @format double
     * @example 0.5
     */
    threshold?: number;
}

/** 文档检索结果 */
export interface KnowledgeBaseDocSearchResultVo {
    /**
     * 文档ID
     * @format int64
     * @example 1
     */
    documentId?: number;
    /**
     * 文档名称
     * @example "产品手册.pdf"
     */
    documentName?: string;
    /**
     * 分段ID
     * @example "chunk_001"
     */
    chunkId?: string;
    /**
     * 分段内容
     * @example "产品功能介绍..."
     */
    content?: string;
    /**
     * 相似度分数
     * @format double
     * @example 0.85
     */
    score?: number;
    /**
     * 元数据
     * @example {"pageNo":1,"position":"header"}
     */
    metadata?: Record<string, object>;
}

/** The API response result of supporting international message. */
export type ListKnowledgeBaseDocSearchResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: KnowledgeBaseDocSearchResultVo[];
};

/** 批量删除文档请求参数 */
export interface KnowledgeBaseDocBatchDeleteDto {
    /**
     * 文档ID列表
     * @example [1,2,3]
     */
    documentIds: number[];
}

export interface PageKnowledgeBaseDocListVo {
    /**
     * Total number
     * @format int64
     * @example 10
     */
    total?: number;
    /** Page data */
    list?: KnowledgeBaseDocListVo[];
}

/** The API response result of supporting international message. */
export type PageKnowledgeBaseDocListResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: PageKnowledgeBaseDocListVo;
};

/** 排序字段 */
export enum GetDocumentListOrderByEnum {
    Id = "id",
    Name = "name",
    Type = "type",
    Status = "status",
    Size = "size",
    CreatedDate = "createdDate",
    ModifiedDate = "modifiedDate",
}
