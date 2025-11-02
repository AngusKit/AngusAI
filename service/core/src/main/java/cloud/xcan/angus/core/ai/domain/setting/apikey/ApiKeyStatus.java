package cloud.xcan.angus.core.ai.domain.setting.apikey;

/**
 * API密钥状态枚举
 */
public enum ApiKeyStatus {
  /**
   * 激活状态
   */
  ACTIVE,

  /**
   * 已撤销
   */
  REVOKED,

  /**
   * 已过期
   */
  EXPIRED
}
