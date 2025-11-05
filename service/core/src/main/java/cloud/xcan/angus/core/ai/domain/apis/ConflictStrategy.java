package cloud.xcan.angus.core.ai.domain.apis;

/**
 * 导入冲突处理策略枚举
 */
public enum ConflictStrategy {
  /**
   * 覆盖：如果导入的接口已存在，将使用新数据覆盖原有数据
   */
  OVERWRITE("覆盖"),

  /**
   * 忽略：如果导入的接口已存在，将跳过该接口
   */
  IGNORE("忽略"),

  /**
   * 合并：如果导入的接口已存在，将合并配置
   */
  MERGE("合并");

  private final String displayName;

  ConflictStrategy(String displayName) {
    this.displayName = displayName;
  }

  public String getDisplayName() {
    return displayName;
  }
}

