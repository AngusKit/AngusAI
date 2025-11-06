import {ApiLocaleResult, TenantAuditingVo} from '@xcan-angus/infra';
import {VisibilityEnum} from "@/enums/enums.ts";

/** 知识库配置信息 */
export interface KnowledgeBaseConfigVo {
    /**
     * 分段大小
     * @format int32
     * @example 512
     */
    chunkSize?: number;
    /**
     * 分段重叠
     * @format int32
     * @example 50
     */
    chunkOverlap?: number;
    /**
     * 向量化模型
     * @example "text-embedding-ada-002"
     */
    embeddingModel?: string;
}

/** 知识库统计信息 */
export interface KnowledgeBaseStatsVo {
    /**
     * 总文档数
     * @format int32
     * @example 15
     */
    totalDocuments?: number;
    /**
     * 已启用文档数
     * @format int32
     * @example 12
     */
    activeDocuments?: number;
    /**
     * 总分段数
     * @format int32
     * @example 120
     */
    totalChunks?: number;
    /**
     * 平均分段大小
     * @format int32
     * @example 512
     */
    avgChunkSize?: number;
}

/** 知识库详情视图对象 */
export interface KnowledgeBaseDetailVo extends TenantAuditingVo {
    /**
     * 知识库ID
     * @format int64
     * @example 1
     */
    id?: number;
    /**
     * 知识库名称
     * @example "产品文档库"
     */
    name?: string;
    /**
     * 图标
     * @example "📚"
     */
    icon?: string;
    /**
     * 背景色
     * @example "bg-blue-100"
     */
    iconBg?: string;
    /**
     * 描述
     * @example "存储产品相关文档和资料"
     */
    description?: string;
    /**
     * 文档数量
     * @format int32
     * @example 15
     */
    documentsCount?: number;
    /**
     * 总大小
     * @example 2.5
     */
    totalSize?: string;
    /**
     * 是否启用
     * @example true
     */
    enabled?: boolean;
    /**
     * 标签
     * @example ["产品","文档"]
     */
    tags?: string[];
    /**
     * 可见性
     * @example "PRIVATE"
     */
    visibility?: VisibilityEnum;
    /** 统计信息 */
    stats?: KnowledgeBaseStatsVo;
    /** 配置信息 */
    config?: KnowledgeBaseConfigVo;
}

/** The API response result of supporting international message. */
export type KnowledgeBaseDetailResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: KnowledgeBaseDetailVo;
};

/** 知识库启用状态切换请求参数 */
export interface KnowledgeBaseToggleDto {
    /**
     * 启用状态
     * @example true
     */
    enabled: boolean;
}

/** 创建知识库请求参数 */
export interface KnowledgeBaseCreateDto {
    /**
     * 知识库名称
     * @example "产品文档库"
     */
    name: string;
    /**
     * 图标
     * @example "📚"
     */
    icon: string;
    /**
     * 背景色
     * @example "bg-blue-100"
     */
    iconBg: string;
    /**
     * 描述
     * @example "存储产品相关文档和资料"
     */
    description: string;
    /**
     * 可见性
     * @example "PRIVATE"
     */
    visibility: VisibilityEnum;
    /**
     * 标签
     * @example ["产品","文档"]
     */
    tags?: string[];
    /** 配置信息 */
    config?: KnowledgeBaseConfigDto;
}

/** 知识库配置 */
export interface KnowledgeBaseConfigDto {
    /**
     * 分段大小
     * @format int32
     * @example 512
     */
    chunkSize?: number;
    /**
     * 分段重叠
     * @format int32
     * @example 50
     */
    chunkOverlap?: number;
    /**
     * 向量化模型
     * @example "text-embedding-ada-002"
     */
    embeddingModel?: string;
}

/** 更新知识库请求参数 */
export interface KnowledgeBaseUpdateDto {
    /**
     * 知识库名称
     * @example "产品文档库"
     */
    name?: string;
    /**
     * 图标
     * @example "📚"
     */
    icon?: string;
    /**
     * 背景色
     * @example "bg-blue-100"
     */
    iconBg?: string;
    /**
     * 描述
     * @example "存储产品相关文档和资料"
     */
    description?: string;
    /**
     * 可见性
     * @example "PRIVATE"
     */
    visibility?: VisibilityEnum;
    /**
     * 标签
     * @example ["产品","文档"]
     */
    tags?: string[];
    /** 配置信息 */
    config?: KnowledgeBaseConfigDto;
}

/** 知识库列表视图对象 */
export interface KnowledgeBaseListVo extends TenantAuditingVo {
    /**
     * 知识库ID
     * @format int64
     * @example 1
     */
    id?: number;
    /**
     * 知识库名称
     * @example "产品文档库"
     */
    name?: string;
    /**
     * 图标
     * @example "📚"
     */
    icon?: string;
    /**
     * 背景色
     * @example "bg-blue-100"
     */
    iconBg?: string;
    /**
     * 描述
     * @example "存储产品相关文档和资料"
     */
    description?: string;
    /**
     * 文档数量
     * @format int32
     * @example 15
     */
    documentsCount?: number;
    /**
     * 总大小
     * @example 2.5
     */
    totalSize?: string;
    /**
     * 是否启用
     * @example true
     */
    enabled?: boolean;
    /**
     * 标签
     * @example ["产品","文档"]
     */
    tags?: string[];
    /**
     * 可见性
     * @example "PRIVATE"
     */
    visibility?: VisibilityEnum;
}

export interface PageKnowledgeBaseListVo {
    /**
     * Total number
     * @format int64
     * @example 10
     */
    total?: number;
    /** Page data */
    list?: KnowledgeBaseListVo[];
}

/** The API response result of supporting international message. */
export type PageResultKnowledgeBaseListResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: PageKnowledgeBaseListVo;
};

/** 排序字段 */
export enum GetKnowledgeBaseListOrderByEnum {
    CreatedDate = "createdDate",
    ModifiedDate = "modifiedDate",
    Name = "name",
    DocumentsCount = "documentsCount",
}
