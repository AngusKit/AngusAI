package cloud.xcan.core.memory.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

/**
 * 记忆策略枚举
 * <p>
 * PERSISTENT 已移除：业务可从数据库加载到内存后使用 MESSAGE_WINDOW 等策略。
 * </p>
 */
public enum MemoryStrategy {

  /** 不保留任何记忆 */
  NONE,

  /** 基于消息条数的滑动窗口 — MessageWindowChatMemory */
  MESSAGE_WINDOW,

  /** 基于 Token 的滑动窗口 — TokenWindowChatMemory */
  TOKEN_WINDOW,

  /** 摘要记忆 — 超出窗口时压缩旧消息为摘要，需 ChatModel */
  SUMMARY;

  /**
   * 从配置字符串解析，兼容历史 YAML/JSON 配置，Jackson 反序列化使用
   */
  @JsonCreator
  public static MemoryStrategy from(String s) {
    if (s == null || s.isBlank()) {
      return TOKEN_WINDOW;
    }
    return switch (s.toUpperCase()) {
      case "NONE" -> NONE;
      case "MESSAGE_WINDOW", "SLIDING_WINDOW" -> MESSAGE_WINDOW;
      case "TOKEN_WINDOW" -> TOKEN_WINDOW;
      case "SUMMARY" -> SUMMARY;
      case "PERSISTENT" -> MESSAGE_WINDOW; // 兼容：映射为 MESSAGE_WINDOW，业务自管持久化
      default -> TOKEN_WINDOW;
    };
  }
}
