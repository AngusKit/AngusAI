import { ApiLocaleResult, TenantAuditingVo } from '@xcan-angus/infra';

/** 提示词统计信息 */
export interface PromptStatsVo {
  /**
   * 总使用次数
   * @format int64
   */
  totalUses?: number;
  /**
   * 收藏次数
   * @format int64
   */
  favorites?: number;
}

/** 提示词详情 */
export interface PromptDetailVo extends TenantAuditingVo {
  /**
   * ID
   * @format int64
   */
  id?: number;
  /** 标题 */
  title?: string;
  /** 内容 */
  content?: string;
  /** 描述 */
  description?: string;
  /**
   * 分类ID
   * @format int64
   */
  categoryId?: number;
  /** 分类名称 */
  categoryName?: string;
  /** 标签 */
  tags?: string[];
  /** 是否收藏 */
  isFavorite?: boolean;
  /** 是否为系统模板 */
  isSystem?: boolean;
  /** 统计信息 */
  stats?: PromptStatsVo;
}

/** The API response result of supporting international message. */
export type PromptDetailResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: PromptDetailVo;
};

/** 创建提示词请求参数 */
export interface PromptCreateDto {
  /** 提示词标题 */
  title: string;
  /** 提示词内容 */
  content: string;
  /** 描述 */
  description?: string;
  /**
   * 分类ID
   * @format int64
   */
  categoryId: number;
  /** 标签 */
  tags?: string[];
}

/** 更新提示词请求参数 */
export interface PromptUpdateDto {
  /** 提示词标题 */
  title?: string;
  /** 提示词内容 */
  content?: string;
  /** 描述 */
  description?: string;
  /**
   * 分类ID
   * @format int64
   */
  categoryId?: number;
  /** 标签 */
  tags?: string[];
}

/** 提示词列表项 */
export interface PromptListVo extends TenantAuditingVo {
  /**
   * ID
   * @format int64
   */
  id?: number;
  /** 标题 */
  title?: string;
  /** 内容 */
  content?: string;
  /**
   * 分类ID
   * @format int64
   */
  categoryId?: number;
  /** 分类名称 */
  categoryName?: string;
  /** 标签 */
  tags?: string[];
  /** 是否收藏 */
  isFavorite?: boolean;
  /** 是否为系统模板 */
  isSystem?: boolean;
}

export interface PageResultPromptListVo {
  /**
   * Total number
   * @format int64
   * @example 10
   */
  total?: number;
  /** Page data */
  list?: PromptListVo[];
}

/** The API response result of supporting international message. */
export type PagePromptListResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: PageResultPromptListVo;
};

/** 排序字段 */
export enum GetPromptListParamsOrderByEnum {
  Id = 'id',
  Title = 'title',
  CategoryId = 'categoryId',
  CreatedDate = 'createdDate',
  ModifiedDate = 'modifiedDate',
}

/** 分类详情 */
export interface PromptCategoryVo {
  /**
   * ID
   * @format int64
   */
  id?: number;
  /** 分类名称 */
  name?: string;
  /** 图标名称 */
  icon?: string;
  /** 颜色类名 */
  color?: string;
  /**
   * 父分类ID
   * @format int64
   */
  parentId?: number;
  /** 是否为系统分类 */
  isSystem?: boolean;
  /**
   * 该分类下的提示词数量
   * @format int64
   */
  promptCount?: number;
  /**
   * 排序
   * @format int32
   */
  orderNum?: number;
  /** 子分类列表 */
  children?: PromptCategoryVo[];
}

/** The API response result of supporting international message. */
export type PromptCategoryResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: PromptCategoryVo;
};

/** 创建分类请求参数 */
export interface PromptCategoryCreateDto {
  /** 分类名称 */
  name: string;
  /** 图标名称 */
  icon?: string;
  /** 颜色类名 */
  color?: string;
  /**
   * 父分类ID（可选，为空表示根分类）
   * @format int64
   */
  parentId?: number;
}

/** 更新分类请求参数 */
export interface PromptCategoryUpdateDto {
  /** 分类名称 */
  name?: string;
  /** 图标名称 */
  icon?: string;
  /** 颜色类名 */
  color?: string;
  /**
   * 父分类ID（可选）
   * @format int64
   */
  parentId?: number;
}

/** The API response result of supporting international message. */
export type ListPromptCategoryResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: PromptCategoryVo[];
};
