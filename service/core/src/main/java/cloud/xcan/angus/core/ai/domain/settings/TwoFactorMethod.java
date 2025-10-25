package cloud.xcan.angus.core.ai.domain.settings;

/**
 * 双因素认证方法
 */
public enum TwoFactorMethod {
  /**
   * 基于时间的一次性密码
   */
  TOTP,

  /**
   * 短信验证码
   */
  SMS,

  /**
   * 邮箱验证码
   */
  EMAIL
}
