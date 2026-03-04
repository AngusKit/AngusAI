/** HTTP 请求头前缀 */
export const HEADER_PREFIX = 'X-';

/** 操作租户 ID 的请求头名称 */
export const HEADER_OPT_TENANT_ID = HEADER_PREFIX + 'Opt-Tenant-Id';

/** 请求头：客户端设备 ID */
export const HEADER_DEVICE_ID = HEADER_PREFIX + 'Device-Id';

/** 请求头：接受语言 */
export const HEADER_ACCEPT_LANGUAGE = 'Accept-Language';

/** 请求头：Vary（用于缓存协商） */
export const HEADER_VARY = 'Vary';

/** 请求头：授权令牌 */
export const HEADER_AUTHORIZATION = 'Authorization';

/** 授权 Bearer 前缀 */
export const AUTH_BEARER_PREFIX = 'Bearer ';

/** 刷新 Token 的锁 key */
export const LOCK_KEY_REFRESH_TOKEN = 'refreshToken';

/** Cookie 名：访问令牌 */
export const COOKIE_ACCESS_TOKEN = 'access_token';

/** 需要添加操作租户请求头的路径白名单 */
export const TENANT_HEADER_WHITELIST_PATTERNS = [
  '/api/v1/users', // 用户管理接口
  '/api/v1/user/invites', // 用户邀请管理接口
  '/api/v1/departments', // 部门管理接口
  '/api/v1/groups', // 组管理接口
  '/api/v1/roles', // 角色管理接口
  '/api/v1/authorizations', // 授权管理接口
  '/api/v1/sms', // 短信管理接口
  '/api/v1/email', // 邮件管理接口
  '/api/v1/logs' // 操作日志接口
];

/** 搜索防抖延迟（毫秒） */
export const SEARCH_DEBOUNCE_DELAY = 300;

/** 文件上传大小限制：50MB（字节） */
export const FILE_MAX_SIZE_BYTES = 50 * 1024 * 1024;

/** 文件上传大小限制：50MB */
export const FILE_MAX_SIZE_MB = 50;

/** 不需要添加操作租户请求头的路径白名单（命中时不添加，优先级高于需添加白名单） */
export const TENANT_HEADER_EXCLUDED_PATTERNS = [
  '/api/v1/users/current', // 查询当前租户统计
  '/api/v1/sms/providers', // 查询短信提供商列表
  '/api/v1/sms/templates', // 查询短信模板列表
  '/api/v1/email/smtp', // 查询邮件 SMTP 列表
  '/api/v1/email/templates' // 查询邮件模板列表
];
