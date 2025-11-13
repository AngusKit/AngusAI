package cloud.xcan.angus.core.ai.domain.apis;

/**
 * 导入冲突处理策略枚举
 */
public enum ConflictStrategy {
  /**
   * 覆盖：如果导入的接口已存在，将使用新数据覆盖原有数据
   */
  OVERWRITE,

  /**
   * 忽略：如果导入的接口已存在，将跳过该接口
   */
  IGNORE,

  /**
   * 合并：如果导入的接口已存在，将合并配置
   */
  MERGE;

  public boolean isOverwrite() {
    return this.equals(OVERWRITE);
  }

  public boolean isMerge() {
    return this.equals(MERGE);
  }
}

